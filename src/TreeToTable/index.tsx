import React, {
  Key,
  memo,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { Tree, TreeProps, Checkbox, TableProps, Input, Empty } from 'antd';
import { DataNode } from 'antd/lib/tree';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import VirtualTable from '../VirtualTable';
import styles from './index.module.less';

export type TreeToTableDataNode = Omit<DataNode, 'children'> & {
  pKey?: Key;
  pName?: React.ReactNode;
  children?: TreeToTableDataNode[];
  [key: string]: any;
};

export interface TreeToTableProps<T> {
  /** 树属性 */
  treeProps: Omit<TreeProps, 'treeData'> & {
    /** 树源数据 */
    treeData: TreeToTableDataNode[];
    /** 树头部自定义 */
    header?:
      | string
      | ReactNode[]
      | ((info: { checkedKeySet: Set<Key> }) => ReactNode[]);
    /** 树是否可搜索 */
    showSearch?: boolean;
    /** 树自定义搜索回调 */
    filterSearch?: (filterValue: string, data: any) => boolean;
    /** 树自定义过滤数据 */
    filterData?: (
      treeData: TreeToTableDataNode[],
      searchValue: string,
    ) => TreeToTableDataNode[];
    /** 树搜索框底部文字 */
    placeholder?: string;
    /** 树组件是否显示全选组件 */
    showCheckAll?: boolean;
    /** 树组件全选组件受控值 */
    checkAll?: boolean;
    /** 树组件全选组件勾选回调 */
    onCheckAll?: (value?: boolean) => void;
    /** 树组件全选组件文案 */
    checkAllText?: string;
    /** 避免children字段的存在，移动数据时，右侧表格出现children数据展开 */
    aliasChildren?: string;
    /** 当只有一层数据时，勾选框进行对准处理，做成类List样式，如果数据为多层结构，该属性自动失效 */
    alignCheckbox?: boolean;
  };
  /** 表格数据 */
  tableProps: TableProps<T> & {
    /** 表格头部自定义 */
    header?:
      | string
      | ReactNode[]
      | ((info: { tableKeySet: Set<Key> }) => ReactNode[]);
    /** 表格是否可搜索 */
    showSearch?: boolean;
    /** 表格自定义搜索回调 */
    filterSearch?: (filterValue: string, data: any) => boolean;
    /** 表格搜索框底部文字 */
    placeholder?: string;
  };
  /** 回填用的数据 */
  value?: any[];
  /** 数据变化时的回调 */
  onChange?: (value: TreeToTableDataNode[]) => void;
}

export type TreeToTableRef = {
  treeCheckAll: (e: CheckboxChangeEvent) => void;
  tableDelete: (id: Key) => void;
  tableDeleteAll: () => void;
  tableData: TreeToTableDataNode[];
};

/** 树默认搜索回调函数 */
const defaultTreeFilterSearch = (value: string, record: any) =>
  record.name && record.name.toLowerCase().includes(value.toLowerCase());
/** 表格默认搜索回调函数  */
const defaultTableFilterSearch = (value: string, record: any) =>
  record.name && record.name.toLowerCase().includes(value.toLowerCase());

const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const TreeToTable = forwardRef<TreeToTableRef, TreeToTableProps<any>>(
  (props, ref) => {
    const { treeProps, tableProps, value, onChange } = props;
    const {
      treeData,
      header: leftHeader,
      showSearch: leftShowSearch,
      filterSearch: leftFilterSearch,
      filterData: leftFilterData,
      placeholder: leftPlaceholder,
      showCheckAll = true,
      onCheckAll,
      checkAll,
      checkAllText = 'Check All',
      aliasChildren = 'childrenStored',
      alignCheckbox = false,
      ...restTreeProps
    } = treeProps;
    const {
      header: rightHeader,
      showSearch: rightShowSearch,
      filterSearch: rightFilterSearch,
      placeholder: rightPlaceholder,
      // dataSource: rightDataSource,
      scroll: rightScroll,
      ...restTableProps
    } = tableProps;

    const rowKey = restTreeProps?.fieldNames?.key || 'key';
    const rowTitle = restTreeProps?.fieldNames?.title || 'title';
    const rowChildren = restTreeProps?.fieldNames?.children || 'children';

    const [tableData, setTableData] = useState<TreeToTableDataNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
    const [treeSearchValue, setTreeSearchValue] = useState('');
    const [tableSearchValue, setTableSearchValue] = useState('');
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [treeMergedClassName, setTreeMergedClassName] = useState<
      string | undefined
    >();

    const allKeys = useRef(new Set<Key>());
    const parentNodeMap = useRef(new Map());
    const treeDataMap = useRef(new Map());
    const tableKeySet = useRef(new Set<Key>());
    const checkedKeySet = useRef(new Set<Key>());

    const loop = useCallback(
      (data: TreeToTableDataNode[], pKey?: Key, pName?: React.ReactNode) => {
        const len = data.length;
        const childKeySet = new Set();
        for (let i = 0; i < len; i++) {
          const item = { ...data[i] };
          pKey && (item.pKey = pKey);
          pName && (item.pName = pName);
          const key = item[rowKey];
          const name = item[rowTitle];
          item[aliasChildren] = item[rowChildren];
          delete item.children;
          treeDataMap.current?.set(key, item);

          // 过滤掉「禁用」和「不可勾选」的数据
          item.disabled !== true &&
            item.checkable !== false &&
            allKeys.current?.add(key);
          item.disabled !== true &&
            item.checkable !== false &&
            childKeySet.add(key);
          if (item[aliasChildren]) {
            loop(item[aliasChildren], key, name);
          }
        }
        pKey && parentNodeMap.current?.set(pKey, childKeySet);
      },
      [],
    );

    // 树数据全量处理
    useEffect(() => {
      loop(treeData);
    }, [treeData, loop]);

    useEffect(() => {
      // 避免一些无效渲染
      if (!treeData || treeData?.length === 0) {
        return;
      }
      const isOneLevel = !treeData.some(
        (item) => item?.children && item?.children?.length > 1,
      );
      if (!!isOneLevel && !!alignCheckbox) {
        setTreeMergedClassName(
          treeProps?.className
            ? `${treeProps?.className} ${styles['tree-to-table-left-tree-align-checkbox']}`
            : styles['tree-to-table-left-tree-align-checkbox'],
        );
      } else if (!!treeProps?.className) {
        setTreeMergedClassName(treeProps?.className);
      }
    }, [treeProps.className, alignCheckbox, treeData]);

    // 将Set转换为Array
    const transferData = (params?: {
      needReverse?: boolean;
      needOnChange?: boolean;
    }) => {
      const { needReverse = true, needOnChange = true } = params || {};
      setCheckedKeys(Array.from(checkedKeySet.current));
      const data = [];
      for (const key of tableKeySet.current) {
        treeDataMap.current?.has(key) &&
          data.push(treeDataMap.current?.get(key));
      }
      needReverse && data.reverse();
      setTableData(data);
      if (needOnChange) {
        onChange?.(data);
      }
    };

    /** 遍历指定节点的子节点，并勾选 */
    const loopCNodeForCheck = useCallback(
      (key: Key, callback: (key: Key) => void) => {
        const childKeySet = parentNodeMap.current?.get(key);
        for (const childKey of childKeySet) {
          // 剪枝
          if (
            parentNodeMap.current?.has(childKey) &&
            !checkedKeySet.current?.has(childKey)
          ) {
            loopCNodeForCheck(childKey, callback);
          }
          callback(childKey);
        }
      },
      [],
    );

    /** 遍历指定节点的子节点，并取消勾选 */
    const loopCNodeForCancelCheck = useCallback(
      (key: Key, callback: (key: Key) => void) => {
        const childKeySet = parentNodeMap.current?.get(key);
        for (const childKey of childKeySet) {
          // 剪枝
          if (
            parentNodeMap.current?.has(childKey) &&
            checkedKeySet.current?.has(childKey)
          ) {
            loopCNodeForCancelCheck(childKey, callback);
          }
          callback(childKey);
        }
      },
      [],
    );

    /** 找到指定节点的父节点，并处理 */
    const loopPNode = useCallback((key: Key) => {
      const pKey = treeDataMap.current?.get(key)?.pKey;
      if (checkedKeySet.current?.has(pKey)) {
        tableKeySet.current?.delete(key);
        checkedKeySet.current?.delete(key);
        tableKeySet.current?.delete(pKey);
        checkedKeySet.current?.delete(pKey);

        // 将该节点的兄弟节点添加到表格数据中
        const childKeySet = parentNodeMap.current?.get(pKey);
        for (const childKey of childKeySet) {
          childKey !== key && tableKeySet.current?.add(childKey);
        }

        if (checkedKeySet.current?.has(treeDataMap.current?.get(pKey)?.pKey)) {
          loopPNode(pKey);
        }
      }
    }, []);

    // 处理回填
    useEffect(() => {
      if (treeData?.length > 0) {
        checkedKeySet.current?.clear();
        value?.forEach((item) => {
          if (!item[rowKey]) {
            return;
          }
          const key = item[rowKey];
          checkedKeySet.current?.add(key);
          tableKeySet.current?.add(key);
          if (parentNodeMap.current?.has(key)) {
            loopCNodeForCheck(key, (childKey) => {
              checkedKeySet.current?.add(childKey);
            });
          }
        });
        transferData({ needReverse: true, needOnChange: false });
      }
    }, [value, treeData, loopCNodeForCheck]);

    /** 勾选节点回调 */
    const onCheck = (_: any, e: any) => {
      const key = e.node[rowKey];
      if (e.checked || e.selected) {
        tableKeySet.current?.add(key);
        checkedKeySet.current?.add(key);
        // 如果勾选了父节点
        if (parentNodeMap.current?.has(key)) {
          loopCNodeForCheck(key, (childKey) => {
            tableKeySet.current?.delete(childKey);
            checkedKeySet.current?.add(childKey);
          });
        }
      } else {
        // 如果取消勾选节点
        if (isCheckAll) {
          setIsCheckAll(false);
          onCheckAll?.();
        }
        tableKeySet.current?.delete(key);
        checkedKeySet.current?.delete(key);
        const node = treeDataMap.current?.get(key);
        // 如果取消勾选父节点，且该节点没有父节点
        if (parentNodeMap.current?.has(key) && node.pKey === undefined) {
          loopCNodeForCancelCheck(key, (childKey) => {
            tableKeySet.current?.delete(childKey);
            checkedKeySet.current?.delete(childKey);
          });
        } else if (parentNodeMap.current?.has(key) && node.pKey !== undefined) {
          // 如果取消勾选父节点，且该节点有父节点
          loopPNode(key);
          loopCNodeForCancelCheck(key, (childKey) => {
            tableKeySet.current?.delete(childKey);
            checkedKeySet.current?.delete(childKey);
          });
        } else {
          loopPNode(key);
        }
      }
      transferData();
    };

    /** 树全选 */
    const treeCheckAll = (e: CheckboxChangeEvent) => {
      onCheckAll?.(e.target.checked);
      tableKeySet.current?.clear();
      checkedKeySet.current?.clear();
      const treeCheckedKeys = [];
      const tableData = [];
      setIsCheckAll(e.target.checked);

      if (e.target.checked) {
        // 勾选全选时，清空搜索值
        if (treeSearchValue) {
          setTreeSearchValue('');
        }
        for (const key of allKeys.current) {
          checkedKeySet.current?.add(key);
          treeCheckedKeys.push(key);
          const node = treeDataMap.current?.get(key);
          const pNode = treeDataMap.current?.get(node.pKey);

          if (
            (node.pKey === undefined && node[aliasChildren] === undefined) || // 这个是独立节点，既没有父节点，也没有子节点
            (node.pKey !== undefined && pNode.disabled === true) || // 父节点存在且父节点置灰
            (node.pKey === undefined && parentNodeMap.current?.has(key)) || // 这个是根节点
            pNode?.checkable === false // 这个是父节点不可选的节点
          ) {
            tableKeySet.current?.add(key);
            tableData.push(node);
          }
        }
      }
      setCheckedKeys(treeCheckedKeys);
      setTableData(tableData);
      onChange?.(tableData);
    };

    /** 表格单个删除 */
    const tableDelete = (key: Key) => {
      tableKeySet.current?.delete(key);
      checkedKeySet.current?.delete(key);
      setIsCheckAll(false);
      onCheckAll?.();
      // 如果删除的是父节点
      if (parentNodeMap.current?.has(key)) {
        loopCNodeForCancelCheck(key, (childKey) => {
          tableKeySet.current?.delete(childKey);
          checkedKeySet.current?.delete(childKey);
        });
      }
      transferData();
    };

    /** 表格全部删除 */
    const tableDeleteAll = () => {
      tableKeySet.current?.clear();
      checkedKeySet.current?.clear();
      setIsCheckAll(false);
      onCheckAll?.();
      setCheckedKeys([]);
      setTableData([]);
      onChange?.([]);
    };

    const leftMergedFilterValue = useMemo(
      () => leftFilterSearch || defaultTreeFilterSearch,
      [leftFilterSearch],
    );

    /** 树搜索方法 */
    const searchTree = useCallback(
      (
        treeNode: TreeToTableDataNode,
        searchValue: string,
      ): TreeToTableDataNode | null => {
        if (leftMergedFilterValue(searchValue, treeNode)) {
          return { ...treeNode };
        }

        // 如果没有子节点或子节点数组为空，直接返回null
        if (!treeNode[rowChildren] || !treeNode[rowChildren].length) {
          return null;
        }

        const children = treeNode[rowChildren];
        const filteredChildren: TreeToTableDataNode[] = [];

        for (let i = 0; i < children.length; i++) {
          const filteredChild = searchTree(children[i], searchValue);
          if (filteredChild !== null) {
            filteredChildren.push(filteredChild);
          }
        }

        return filteredChildren.length
          ? { ...treeNode, [rowChildren]: filteredChildren }
          : null;
      },
      [leftMergedFilterValue, rowChildren],
    );

    /** 计算搜索后的树数据方法 */
    const getFilterTree = useCallback(
      (tree: TreeToTableDataNode[], searchValue: string) => {
        if (leftFilterData) {
          return leftFilterData(tree, searchValue);
        }

        return (tree || [])
          .map((node) => searchTree(node, searchValue))
          .filter((node): node is TreeToTableDataNode => node !== null);
      },
      [leftFilterData, searchTree],
    );

    /** 计算搜索后的树数据 */
    const filterTreeData = useMemo(
      () =>
        treeSearchValue ? getFilterTree(treeData, treeSearchValue) : treeData,
      [treeData, treeSearchValue, getFilterTree],
    );

    /** 树搜索 */
    const treeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTreeSearchValue(value);
    };

    /** 表格搜索 */
    const rightMergedFilterValue =
      rightFilterSearch || defaultTableFilterSearch;

    /** 表格输入框回调 */
    const tableSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTableSearchValue(value);
    };

    /** 计算搜索后的表格数据 */
    const [filterTableData] = useMemo(() => {
      if (tableSearchValue) {
        const len = tableData.length;
        const tmp = [];
        for (let i = 0; i < len; i++) {
          const record = tableData[i];
          if (rightMergedFilterValue(tableSearchValue, record)) {
            tmp.push(record);
          }
        }
        return [tmp];
      } else {
        return [tableData];
      }
    }, [tableData, tableSearchValue]);

    /** 自定义渲染组件头部 */
    const renderHeader = useCallback(
      (header: string | ReactNode[] | ((info: any) => ReactNode[])) => {
        if (typeof header === 'string') {
          return header;
        } else if (typeof header === 'function') {
          return header({
            checkedKeySet: Array.from(checkedKeySet.current),
          }).map((item: React.ReactNode) => <div>{item}</div>);
        } else if (Array.isArray(header)) {
          return header.map((item) => <div>{item}</div>);
        } else {
          return null;
        }
      },
      [],
    );

    useImperativeHandle(
      ref,
      () => ({
        treeCheckAll,
        tableDelete,
        tableDeleteAll,
        tableData,
      }),
      [treeCheckAll, tableDelete, tableDeleteAll, tableData],
    );

    // 树组件全选组件，受控处理
    useEffect(() => {
      if (treeData?.length === 0) {
        return;
      }
      if (checkAll === true) {
        treeCheckAll({ target: { checked: true } } as CheckboxChangeEvent);
      } else if (checkAll === false) {
        treeCheckAll({ target: { checked: false } } as CheckboxChangeEvent);
      }
    }, [checkAll, treeData]);

    return (
      <div className={styles['tree-to-table']}>
        <div className={styles['tree-to-table-left']}>
          {leftHeader ? (
            <div className={styles['tree-to-table-header']}>
              {renderHeader(leftHeader)}
            </div>
          ) : null}
          {leftShowSearch ? (
            <div className={styles['tree-to-table-search']}>
              <Input
                placeholder={leftPlaceholder}
                onChange={debounce(treeSearch, 300)}
              />
            </div>
          ) : null}
          {showCheckAll &&
          (!!treeSearchValue
            ? filterTreeData?.length > 0
            : treeData?.length > 0) ? (
            <div className={styles['tree-to-table-checkAll']}>
              <Checkbox
                checked={checkAll ?? isCheckAll}
                onChange={treeCheckAll}
              >
                {checkAllText}
              </Checkbox>
            </div>
          ) : null}
          {(
            !!treeSearchValue
              ? filterTreeData?.length > 0
              : treeData?.length > 0
          ) ? (
            <Tree
              height={356}
              defaultExpandAll
              defaultExpandParent
              {...restTreeProps}
              checkable
              selectable={false}
              checkStrictly
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              onSelect={onCheck}
              treeData={!!treeSearchValue ? filterTreeData : treeData}
              className={treeMergedClassName}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>

        <div className={styles['tree-to-table-right']}>
          {rightHeader ? (
            <div className={styles['tree-to-table-header']}>
              {renderHeader(rightHeader)}
            </div>
          ) : null}
          {rightShowSearch ? (
            <div className={styles['tree-to-table-search']}>
              <Input placeholder={rightPlaceholder} onChange={tableSearch} />
            </div>
          ) : null}
          <VirtualTable
            size="small"
            {...restTableProps}
            scroll={{ y: 356, ...rightScroll }}
            dataSource={!!tableSearchValue ? filterTableData : tableData}
          />
        </div>
      </div>
    );
  },
);

export default memo(TreeToTable);
