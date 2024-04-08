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
} from 'react';
import { Tree, TreeProps, Checkbox, TableProps, Input } from 'antd';
import { DataNode } from 'antd/lib/tree';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import VirtualTable from '../VirtualTable';
import styles from './index.module.less';

type NewDataNode = Omit<DataNode, 'children'> & {
  pKey?: Key;
  pName?: React.ReactNode;
  children?: NewDataNode[];
  [key: string]: any;
};

export interface TreeToTableProps<T> {
  treeProps: Omit<TreeProps, 'treeData'> & {
    treeData: NewDataNode[];
    header?: ReactNode[] | ((info: { checkedKeySet: Set<Key> }) => ReactNode[]);
    showSearch?: boolean;
    filterSearch?: (filterValue: string, data: any) => boolean;
    placeholder?: string;
  };
  tableProps: TableProps<T> & {
    header?: ReactNode[] | ((info: { tableKeySet: Set<Key> }) => ReactNode[]);
    showSearch?: boolean;
    filterSearch?: (filterValue: string, data: any) => boolean;
    placeholder?: string;
  };
  value?: any[];
}

const defaultTreeFilterSearch = (value: string, record: any) =>
  record.name && record.name.toLowerCase().includes(value.toLowerCase());
const defaultTableFilterSearch = (value: string, record: any) =>
  record.name && record.name.toLowerCase().includes(value.toLowerCase());

const TreeToTable = forwardRef<any, TreeToTableProps<any>>((props, ref) => {
  const { treeProps, tableProps, value } = props;
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

  const [tableData, setTableData] = useState<NewDataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [treeSearchValue, setTreeSearchValue] = useState('');
  const [tableSearchValue, setTableSearchValue] = useState('');
  const [isCheckAll, setIsCheckAll] = useState(false);

  const allKeys = useRef(new Array()).current;
  const parentNodeMap = useRef(new Map()).current;
  const treeDataMap = useRef(new Map()).current;
  const tableKeySet = useRef(new Set<Key>()).current;
  const checkedKeySet = useRef(new Set<Key>()).current;

  useEffect(() => {
    // 这里暂时只做了两层数据的处理来做测试，，如果有多层，需要改成递归的形式
    treeData.forEach((item) => {
      const pKey = item[rowKey];
      const pName = item[rowName];
      treeDataMap.set(pKey, { ...item, children: null, childrenStored: item.children });
      allKeys.push(pKey);
      const childKeySet = new Set();
      item.children?.forEach((it) => {
        const cKey = it[rowKey];
        // 子节点存储父节点的唯一id和name值
        it.pKey = pKey;
        it.pName = pName;
        childKeySet.add(cKey);
        treeDataMap.set(cKey, { ...it, children: null, childrenStored: it.children });
        allKeys.push(cKey);
      });
      parentNodeMap.set(pKey, childKeySet);
    });
  }, [treeData]);

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
          const childKeySet = parentNodeMap.get(key);
          for (const childKey of childKeySet) {
            checkedKeySet.add(childKey);
          }
        }
      });
      transferData();
    }
  }, [value, treeData]);

  // 将Set转换为Array
  const transferData = ({ needReverse } = { needReverse: true }) => {
    setCheckedKeys(Array.from(checkedKeySet));
    const data = [];
    for (const key of tableKeySet) {
      data.push(treeDataMap.get(key));
    }
    needReverse && data.reverse();
    setTableData(data);
  };

  // 勾选节点回调
  const onCheck = (_: any, e: any) => {
    const key = e.node[rowKey];
    if (e.checked || e.selected) {
      tableKeySet.add(key);
      checkedKeySet.add(key);
      // 如果勾选了父节点
      if (parentNodeMap.has(key)) {
        const childKeySet = parentNodeMap.get(key);
        for (const childKey of childKeySet) {
          tableKeySet.delete(childKey);
          checkedKeySet.add(childKey);
        }
      }
    } else {
      tableKeySet.delete(key);
      checkedKeySet.delete(key);
      // 如果取消勾选父节点
      if (parentNodeMap.has(key)) {
        const childKeySet = parentNodeMap.get(key);
        for (const childKey of childKeySet) {
          tableKeySet.delete(childKey);
          checkedKeySet.delete(childKey);
        }
      } else {
        // 如果取消勾选节点
        if (isCheckAll) {
          setIsCheckAll(false);
        }
        const pKey = e.node.pKey;
        // 当该节点的父节点已经处于选中状态，而此时取消勾选该节点时
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
        }
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
      const len = allKeys.length;
      for (let i = 0; i < len; i++) {
        const key = allKeys[i];
        checkedKeySet.add(key);
        treeCheckedKeys.push(key);
        if (parentNodeMap.has(key)) {
          tableKeySet.add(key);
          tableData.push(treeDataMap.get(key));
        }
      }
    }
    setCheckedKeys(treeCheckedKeys);
    setTableData(tableData);
  };

  // 表格单个删除
  const tableDelete = (key: string) => {
    tableKeySet.delete(key);
    checkedKeySet.delete(key);
    setIsCheckAll(false);
    // 如果删除的是分组
    if (parentNodeMap.has(key)) {
      const childKeySet = parentNodeMap.get(key);
      for (const childKey of childKeySet) {
        tableKeySet.delete(childKey);
        checkedKeySet.delete(childKey);
      }
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
  };

  // 树搜索
  const leftMergedFilterValue = leftFilterSearch || defaultTreeFilterSearch;
  const treeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTreeSearchValue(value);
  };
  const searchTree: (treeNode: NewDataNode, searchValue: string) => NewDataNode | null = (
    treeNode: NewDataNode,
    searchValue: string,
  ) => {
    if (leftMergedFilterValue(searchValue, treeNode)) {
      return { ...treeNode };
    }
    if (!treeNode.children) {
      return null;
    }
    const result = [];
    for (const child of treeNode.children) {
      const data = searchTree(child, searchValue);
      data && result.push(data);
    }
    if (result.length === 0) {
      return null;
    }
    return { ...treeNode, children: result };
  };
  const getFilterTree = (tree: NewDataNode[], searchValue: string) => {
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
  const rightMergedFilterValue = rightFilterSearch || defaultTableFilterSearch;
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

  useImperativeHandle(
    ref,
    () => ({
      treeCheckAll,
      tableDelete,
      tableDeleteAll,
      tableData,
      treeDataMap,
    }),
    [treeCheckAll, tableDelete, tableDeleteAll, tableData, treeDataMap],
  );

  return (
    <div className={styles['tree-to-table']}>
      <div className={styles['tree-to-table-left']}>
        {leftHeader ? (
          <div className={styles['tree-to-table-header']}>
            {typeof leftHeader !== 'function'
              ? leftHeader.map((item) => <div>{item}</div>)
              : leftHeader({ checkedKeySet }).map((item) => <div>{item}</div>)}
          </div>
        ) : null}
        {leftShowSearch ? (
          <div className={styles['tree-to-table-search']}>
            <Input placeholder={leftPlaceholder} onChange={treeSearch} value={treeSearchValue} />
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
            {typeof rightHeader !== 'function'
              ? rightHeader.map((item) => <div>{item}</div>)
              : rightHeader({ tableKeySet }).map((item) => <div>{item}</div>)}
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
});

export default memo(TreeToTable);