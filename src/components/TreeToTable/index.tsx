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
import { Tree, TreeProps, Checkbox, TableProps, Input } from 'antd';
import { DataNode } from 'antd/lib/tree';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import VirtualTable from '../VirtualTable';
import styles from './index.module.less';

/** 避免children字段的存在，移动数据时，右侧表格出现children数据展开 */
const CHILDREN_BACKUP = 'childrenStored';

export type TreeToTableDataNode = Omit<DataNode, 'children'> & {
  pKey?: Key;
  pName?: React.ReactNode;
  children?: TreeToTableDataNode[];
  [CHILDREN_BACKUP]?: TreeToTableDataNode[];
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
    /** 树搜索框底部文字 */
    placeholder?: string;
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

const TreeToTable = forwardRef<TreeToTableRef, TreeToTableProps<any>>(
  (props, ref) => {
    const { treeProps, tableProps, value, onChange } = props;
    const {
      treeData,
      header: leftHeader,
      showSearch: leftShowSearch,
      filterSearch: leftFilterSearch,
      placeholder: leftPlaceholder,
      ...restTreeProps
    } = treeProps;
    const {
      header: rightHeader,
      showSearch: rightShowSearch,
      filterSearch: rightFilterSearch,
      placeholder: rightPlaceholder,
      ...restTableProps
    } = tableProps;

    const rowKey = restTreeProps?.fieldNames?.key || 'key';
    const rowName = restTreeProps?.fieldNames?.title || 'title';
    const rowChildren = restTreeProps?.fieldNames?.children || 'children';

    const [tableData, setTableData] = useState<TreeToTableDataNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
    const [treeSearchValue, setTreeSearchValue] = useState('');
    const [tableSearchValue, setTableSearchValue] = useState('');
    const [isCheckAll, setIsCheckAll] = useState(false);

    const allKeys = useRef(new Set<Key>()).current;
    const parentNodeMap = useRef(new Map()).current;
    const treeDataMap = useRef(new Map()).current;
    const tableKeySet = useRef(new Set<Key>()).current;
    const checkedKeySet = useRef(new Set<Key>()).current;

    const loop = useCallback(
      (data: TreeToTableDataNode[], pKey?: Key, pName?: React.ReactNode) => {
        const len = data.length;
        const childKeySet = new Set();
        for (let i = 0; i < len; i++) {
          const item = data[i];
          pKey && (item.pKey = pKey);
          pName && (item.pName = pName);
          const key = item[rowKey];
          const name = item[rowName];
          treeDataMap.set(key, {
            ...item,
            children: null,
            [CHILDREN_BACKUP]: item[rowChildren],
          });
          // 过滤掉「禁用」和「不可勾选」的数据
          item.disabled !== true &&
            item.checkable !== false &&
            allKeys.add(key);
          item.disabled !== true &&
            item.checkable !== false &&
            childKeySet.add(key);
          if (item[rowChildren]) {
            loop(item[rowChildren], key, name);
          }
        }
        pKey && parentNodeMap.set(pKey, childKeySet);
      },
      [],
    );

    useEffect(() => {
      loop(treeData);
    }, [treeData, loop]);

    // 将Set转换为Array
    const transferData = (params?: {
      needReverse?: boolean;
      needOnChange?: boolean;
    }) => {
      const { needReverse = true, needOnChange = true } = params || {};
      setCheckedKeys(Array.from(checkedKeySet));
      const data = [];
      for (const key of tableKeySet) {
        treeDataMap.has(key) && data.push(treeDataMap.get(key));
      }
      needReverse && data.reverse();
      setTableData(data);
      needOnChange && onChange?.(data);
    };

    /** 循环该节点的子节点，并勾选 */
    const loopCNodeForCheck = useCallback(
      (key: Key, callback: (key: Key) => void) => {
        const childKeySet = parentNodeMap.get(key);
        for (const childKey of childKeySet) {
          // 剪枝
          if (parentNodeMap.has(childKey) && !checkedKeySet.has(childKey)) {
            loopCNodeForCheck(childKey, callback);
          }
          callback(childKey);
        }
      },
      [],
    );

    /** 循环该节点的子节点，并取消勾选 */
    const loopCNodeForCancelCheck = useCallback(
      (key: Key, callback: (key: Key) => void) => {
        const childKeySet = parentNodeMap.get(key);
        for (const childKey of childKeySet) {
          // 剪枝
          if (parentNodeMap.has(childKey) && checkedKeySet.has(childKey)) {
            loopCNodeForCancelCheck(childKey, callback);
          }
          callback(childKey);
        }
      },
      [],
    );

    /** 找到该节点的父节点，并处理 */
    const loopPNode = useCallback((key: Key) => {
      const pKey = treeDataMap.get(key)?.pKey;
      if (checkedKeySet.has(pKey)) {
        tableKeySet.delete(key);
        checkedKeySet.delete(key);
        tableKeySet.delete(pKey);
        checkedKeySet.delete(pKey);

        // 将该节点的兄弟节点添加到表格数据中
        const childKeySet = parentNodeMap.get(pKey);
        for (const childKey of childKeySet) {
          childKey !== key && tableKeySet.add(childKey);
        }

        if (checkedKeySet.has(treeDataMap.get(pKey)?.pKey)) {
          loopPNode(pKey);
        }
      }
    }, []);

    // 处理回填
    useEffect(() => {
      if (treeData?.length > 0) {
        tableKeySet.clear();
        checkedKeySet.clear();
        value?.forEach((item) => {
          if (!item[rowKey]) {
            return;
          }
          const key = item[rowKey];
          checkedKeySet.add(key);
          tableKeySet.add(key);
          if (parentNodeMap.has(key)) {
            loopCNodeForCheck(key, (childKey) => {
              checkedKeySet.add(childKey);
            });
          }
        });
        transferData({ needOnChange: false });
      }
    }, [value, treeData, loopCNodeForCheck]);

    // 勾选节点回调
    const onCheck = (_: any, e: any) => {
      const key = e.node[rowKey];
      if (e.checked || e.selected) {
        tableKeySet.add(key);
        checkedKeySet.add(key);
        // 如果勾选了父节点
        if (parentNodeMap.has(key)) {
          loopCNodeForCheck(key, (childKey) => {
            tableKeySet.delete(childKey);
            checkedKeySet.add(childKey);
          });
        }
      } else {
        // 如果取消勾选节点
        if (isCheckAll) {
          setIsCheckAll(false);
        }
        tableKeySet.delete(key);
        checkedKeySet.delete(key);
        const node = treeDataMap.get(key);
        // 如果取消勾选父节点，且该节点没有父节点
        if (parentNodeMap.has(key) && node.pKey === undefined) {
          loopCNodeForCancelCheck(key, (childKey) => {
            tableKeySet.delete(childKey);
            checkedKeySet.delete(childKey);
          });
        } else if (parentNodeMap.has(key) && node.pKey !== undefined) {
          // 如果取消勾选父节点，且该节点有父节点
          loopPNode(key);
          loopCNodeForCancelCheck(key, (childKey) => {
            tableKeySet.delete(childKey);
            checkedKeySet.delete(childKey);
          });
        } else {
          loopPNode(key);
        }
      }
      transferData();
    };

    // 树全选
    const treeCheckAll = (e: CheckboxChangeEvent) => {
      tableKeySet.clear();
      checkedKeySet.clear();
      const treeCheckedKeys = [];
      const tableData = [];
      setIsCheckAll(e.target.checked);

      if (e.target.checked) {
        // 勾选全选时，清空搜索值
        if (treeSearchValue) {
          setTreeSearchValue('');
        }
        for (const key of allKeys) {
          checkedKeySet.add(key);
          treeCheckedKeys.push(key);
          const node = treeDataMap.get(key);
          const pNode = treeDataMap.get(node.pKey);

          if (
            (node.pKey === undefined && node[CHILDREN_BACKUP] === undefined) || // 这个是独立节点，既没有父节点，也没有子节点
            (node.pKey === undefined && parentNodeMap.has(key)) || // 这个是根节点
            pNode?.checkable === false // 这个是父节点不可选的节点
          ) {
            tableKeySet.add(key);
            tableData.push(node);
          }
        }
      }
      setCheckedKeys(treeCheckedKeys);
      setTableData(tableData);
      onChange?.(tableData);
    };

    // 表格单个删除
    const tableDelete = (key: Key) => {
      tableKeySet.delete(key);
      checkedKeySet.delete(key);
      setIsCheckAll(false);
      // 如果删除的是父节点
      if (parentNodeMap.has(key)) {
        loopCNodeForCancelCheck(key, (childKey) => {
          tableKeySet.delete(childKey);
          checkedKeySet.delete(childKey);
        });
      }
      transferData();
    };

    // 表格全部删除
    const tableDeleteAll = () => {
      tableKeySet.clear();
      checkedKeySet.clear();
      setIsCheckAll(false);
      setCheckedKeys([]);
      setTableData([]);
      onChange?.([]);
    };

    // 树搜索
    const leftMergedFilterValue = leftFilterSearch || defaultTreeFilterSearch;
    const treeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTreeSearchValue(value);
    };
    const searchTree: (
      treeNode: TreeToTableDataNode,
      searchValue: string,
    ) => TreeToTableDataNode | null = (
      treeNode: TreeToTableDataNode,
      searchValue: string,
    ) => {
      if (leftMergedFilterValue(searchValue, treeNode)) {
        return { ...treeNode };
      }
      if (!treeNode[rowChildren]) {
        return null;
      }
      const result = [];
      for (const child of treeNode[rowChildren]) {
        const data = searchTree(child, searchValue);
        data && result.push(data);
      }
      if (result.length === 0) {
        return null;
      }
      return { ...treeNode, [rowChildren]: result };
    };
    const getFilterTree = (
      tree: TreeToTableDataNode[],
      searchValue: string,
    ) => {
      const result = [];
      for (const node of tree) {
        const data = searchTree(node, searchValue);
        if (data) {
          result.push(data);
        }
      }
      return result;
    };
    const [filterTreeData] = useMemo(() => {
      if (treeSearchValue) {
        const data = getFilterTree(treeData, treeSearchValue);
        return [data];
      } else {
        return [treeData];
      }
    }, [treeData, treeSearchValue]);

    // 表格搜索
    const rightMergedFilterValue =
      rightFilterSearch || defaultTableFilterSearch;
    const tableSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTableSearchValue(value);
    };
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

    const renderHeader = (
      header: string | ReactNode[] | ((info: any) => ReactNode[]),
    ) => {
      if (typeof header === 'string') {
        return header;
      } else if (typeof header === 'function') {
        return header({ checkedKeySet }).map((item: React.ReactNode) => (
          <div>{item}</div>
        ));
      } else if (Array.isArray(header)) {
        return header.map((item) => <div>{item}</div>);
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        treeCheckAll,
        tableDelete,
        tableDeleteAll,
        tableData,
      }),
      [treeCheckAll, tableDelete, tableDeleteAll, tableData, treeDataMap],
    );

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
                onChange={treeSearch}
                value={treeSearchValue}
              />
            </div>
          ) : null}
          <div className={styles['tree-to-table-checkAll']}>
            <Checkbox checked={isCheckAll} onChange={treeCheckAll}>
              全选
            </Checkbox>
          </div>
          {treeData?.length ? (
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
            />
          ) : null}
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
            scroll={{ y: 356, x: 'hidden' }}
            columns={[]}
            {...restTableProps}
            dataSource={!!tableSearchValue ? filterTableData : tableData}
          />
        </div>
      </div>
    );
  },
);

export default memo(TreeToTable);
