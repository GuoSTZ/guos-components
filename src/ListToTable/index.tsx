import React, {
  Key,
  memo,
  forwardRef,
  ReactNode,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { Checkbox, TableProps, Input, Empty } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import VirtualTable from '../VirtualTable';
import VirtualList, { VirtualListProps } from '../List/test/2';
import styles from './index.module.less';

export type ListToTableDataRow = {
  key: Key;
  name: React.ReactNode | string;
  [key: string]: any;
};

export interface ListToTableProps<T extends ListToTableDataRow> {
  /** 列表属性 */
  listProps: Omit<
    VirtualListProps<T>,
    'height' | 'itemHeight' | 'itemKey' | 'renderItem'
  > & {
    /** 列表高度 */
    height?: number;
    /** 列表项高度 */
    itemHeight?: number;
    /** 列表项key */
    itemKey?: Key;
    /** 列表项渲染定义 */
    renderItem?: (item: T, index: number) => ReactNode;
    /** 列表源数据 */
    dataSource: T[];
    /** 列表头部自定义 */
    header?:
      | string
      | ReactNode[]
      | ((info: { checkedRows: Map<Key, T> }) => ReactNode[]);
    /** 列表是否可搜索 */
    showSearch?: boolean;
    /** 列表自定义搜索回调 */
    filterSearch?: (filterValue: string, data: T) => boolean;
    /** 列表搜索框底部文字 */
    placeholder?: string;
    /** 列表组件是否显示全选组件 */
    showCheckAll?: boolean;
    /** 列表组件全选组件勾选回调 */
    onCheckAll?: (value?: boolean) => void;
    /** 列表组件全选组件文案 */
    checkAllText?: string;
  };
  /** 表格数据 */
  tableProps: TableProps<Record<string, any>> & {
    /** 表格头部自定义 */
    header?:
      | string
      | ReactNode[]
      | ((info: { checkedRows: Map<Key, T> }) => ReactNode[]);
    /** 表格是否可搜索 */
    showSearch?: boolean;
    /** 表格自定义搜索回调 */
    filterSearch?: (filterValue: string, data: T) => boolean;
    /** 表格搜索框底部文字 */
    placeholder?: string;
    /** 表格是否需要反转数据 */
    needReverse?: boolean;
  };
  /** 回填用的数据 */
  value?: T[];
  /** 数据变化时的回调 */
  onChange?: (value: T[]) => void;
}

export type ListToTableRef<T extends ListToTableDataRow> = {
  listCheckAll: (e: CheckboxChangeEvent) => void;
  tableDelete: (id: Key) => void;
  tableDeleteAll: () => void;
  tableData: T[];
};

/** 列表默认搜索回调函数 */
const defaultListFilterSearch = <T extends ListToTableDataRow>(
  value: string,
  record: T,
) => {
  if (typeof record.name !== 'string') return false;
  return record.name.toLowerCase().includes(value.toLowerCase());
};
/** 表格默认搜索回调函数  */
const defaultTableFilterSearch = <T extends ListToTableDataRow>(
  value: string,
  record: T,
) => {
  if (typeof record.name !== 'string') return false;
  return record.name.toLowerCase().includes(value.toLowerCase());
};

type DebouncedFn<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): DebouncedFn<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};

const ListToTable = forwardRef(
  <T extends ListToTableDataRow>(
    props: ListToTableProps<T>,
    ref: React.Ref<ListToTableRef<T>>,
  ) => {
    const { listProps, tableProps, value, onChange } = props;
    const {
      height: leftHeight = 356,
      itemHeight: leftItemHeight = 28,
      itemKey: leftItemKey = 'key',
      renderItem: leftRenderItem,
      dataSource,
      header: leftHeader,
      showSearch: leftShowSearch,
      filterSearch: leftFilterSearch,
      placeholder: leftPlaceholder,
      showCheckAll = true,
      onCheckAll: listOnCheckAll,
      checkAllText = 'Check All',
      ...restListProps
    } = listProps;

    const {
      header: rightHeader,
      showSearch: rightShowSearch,
      filterSearch: rightFilterSearch,
      placeholder: rightPlaceholder,
      needReverse = false,
      scroll: rightScroll,
      ...restTableProps
    } = tableProps;

    const [listSearchValue, setListSearchValue] = useState('');
    const [tableSearchValue, setTableSearchValue] = useState('');
    const [checkedRows, setCheckedRows] = useState<Map<Key, T>>(new Map());
    const [isCheckAllChecked, setIsCheckAllChecked] = useState(false);
    /** 首次加载完成后，避免触发onChange */
    const hasMountedRef = useRef(false);
    /** 回填数据时，避免触发onChange */
    const syncingFromValueRef = useRef(false);

    const dataSourceMap = useRef<Map<Key, T>>(new Map());

    useEffect(() => {
      dataSourceMap.current.clear();

      const len = dataSource.length;
      for (let i = 0; i < len; i++) {
        const item = { ...dataSource[i] };
        dataSourceMap.current.set(item.key, item);
      }

      if (value === undefined) {
        setCheckedRows(new Map());
        return;
      }

      const nextCheckedRows = new Map<Key, T>();

      for (let i = 0; i < value.length; i++) {
        const key = value[i].key;
        const row = dataSourceMap.current.get(key);
        if (!row) continue;
        nextCheckedRows.set(key, row);
      }

      syncingFromValueRef.current = true;
      setCheckedRows(nextCheckedRows);
    }, [dataSource, value]);

    const tableData = useMemo(
      () =>
        needReverse
          ? [...checkedRows.values()].reverse()
          : [...checkedRows.values()],
      [checkedRows, needReverse],
    );

    useEffect(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }
      if (syncingFromValueRef.current) {
        syncingFromValueRef.current = false;
        return;
      }
      onChange?.(tableData);
    }, [tableData, onChange]);

    const mergedListFilterSearch = leftFilterSearch || defaultListFilterSearch;
    const mergedTableFilterSearch =
      rightFilterSearch || defaultTableFilterSearch;

    const filteredListData = useMemo(() => {
      if (!listSearchValue) {
        return dataSource;
      }
      return dataSource.filter((item) =>
        mergedListFilterSearch?.(listSearchValue, item),
      );
    }, [dataSource, listSearchValue, mergedListFilterSearch]);

    const filteredTableData = useMemo(() => {
      if (!tableSearchValue) {
        return tableData;
      }
      return tableData.filter((item) =>
        mergedTableFilterSearch?.(tableSearchValue, item),
      );
    }, [tableData, tableSearchValue, mergedTableFilterSearch]);

    const listOnSearch = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setListSearchValue(e.target.value);
      },
      [],
    );

    const debouncedListSearch = useMemo(
      () => debounce(listOnSearch, 300),
      [listOnSearch],
    );
    useEffect(() => () => debouncedListSearch.cancel(), [debouncedListSearch]);

    const tableOnSearch = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setTableSearchValue(e.target.value);
      },
      [],
    );

    const currentListData = useMemo(
      () => (!!listSearchValue ? filteredListData : dataSource),
      [listSearchValue, filteredListData, dataSource],
    );
    const currentTotal = currentListData.length;
    const isSearchMode = listSearchValue.trim().length > 0;

    useEffect(() => {
      let count = 0;
      for (let i = 0; i < currentListData.length; i++) {
        if (checkedRows.has(currentListData[i].key)) count++;
      }
      setIsCheckAllChecked(currentTotal > 0 && count === currentTotal);
    }, [checkedRows, currentListData, currentTotal]);

    const onCheckAll = useCallback(
      (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        listOnCheckAll?.(isChecked);

        setCheckedRows((origin) => {
          const next = new Map(origin);
          if (isSearchMode) {
            if (isChecked) {
              for (let i = 0; i < currentListData.length; i++) {
                const row = currentListData[i];
                next.set(row.key, row);
              }
            } else {
              for (let i = 0; i < currentListData.length; i++) {
                next.delete(currentListData[i].key);
              }
            }
          } else {
            if (isChecked) {
              return new Map(dataSourceMap.current);
            } else {
              return new Map();
            }
          }
          return next;
        });
      },
      [listOnCheckAll, currentListData, isSearchMode],
    );

    const onCheck = useCallback((e: CheckboxChangeEvent) => {
      const currentKey = e.target.value as Key;
      if (e?.target?.checked) {
        setCheckedRows((origin) => {
          const newMap = new Map(origin);
          const row = dataSourceMap.current.get(currentKey);
          if (row) {
            newMap.set(currentKey, row);
          }
          return newMap;
        });
      } else {
        setCheckedRows((origin) => {
          const newMap = new Map(origin);
          newMap.delete(currentKey);
          return newMap;
        });
      }
    }, []);

    /** 自定义渲染组件头部 */
    const renderHeader = useCallback(
      (
        header:
          | string
          | ReactNode[]
          | ((info: { checkedRows: Map<Key, T> }) => ReactNode[]),
      ) => {
        if (typeof header === 'string') {
          return header;
        } else if (typeof header === 'function') {
          return header({
            checkedRows,
          }).map((item: React.ReactNode, index) => (
            <div key={index}>{item}</div>
          ));
        } else if (Array.isArray(header)) {
          return header.map((item, index) => <div key={index}>{item}</div>);
        } else {
          return null;
        }
      },
      [checkedRows],
    );

    /** 表格单个删除 */
    const tableDelete = useCallback((key: Key) => {
      setCheckedRows((origin) => {
        const newMap = new Map(origin);
        newMap.delete(key);
        return newMap;
      });
    }, []);

    /** 表格全部删除 */
    const tableDeleteAll = useCallback(() => {
      setCheckedRows(new Map());
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        listCheckAll: onCheckAll,
        tableDelete,
        tableDeleteAll,
        tableData,
      }),
      [onCheckAll, tableDelete, tableDeleteAll, tableData],
    );

    return (
      <div className={styles['list-to-table']}>
        <div className={styles['list-to-table-left']}>
          {/* 列表头部自定义 */}
          {leftHeader ? (
            <div className={styles['list-to-table-header']}>
              {renderHeader(leftHeader)}
            </div>
          ) : null}

          {/* 列表搜索框 */}
          {leftShowSearch ? (
            <div className={styles['list-to-table-search']}>
              <Input
                placeholder={leftPlaceholder}
                onChange={debouncedListSearch}
              />
            </div>
          ) : null}

          {/* 列表全选组件 */}
          {showCheckAll &&
          (!!listSearchValue
            ? filteredListData?.length > 0
            : dataSource?.length > 0) ? (
            <div className={styles['list-to-table-checkAll']}>
              <Checkbox checked={isCheckAllChecked} onChange={onCheckAll}>
                {checkAllText}
              </Checkbox>
            </div>
          ) : null}

          {(
            !!listSearchValue
              ? filteredListData?.length > 0
              : dataSource?.length > 0
          ) ? (
            <div className={styles['list-to-table-left-list']}>
              <VirtualList<any>
                {...restListProps}
                height={leftHeight}
                itemHeight={leftItemHeight}
                itemKey={leftItemKey}
                dataSource={currentListData}
                renderItem={(item, index) => {
                  if (leftRenderItem) {
                    return leftRenderItem(item, index);
                  }
                  return (
                    <Checkbox
                      key={item.key}
                      value={item.key}
                      checked={checkedRows.has(item.key)}
                      onChange={onCheck}
                    >
                      {item.name}
                    </Checkbox>
                  );
                }}
              />
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>

        <div className={styles['list-to-table-right']}>
          {rightHeader ? (
            <div className={styles['list-to-table-header']}>
              {renderHeader(rightHeader)}
            </div>
          ) : null}
          {rightShowSearch ? (
            <div className={styles['list-to-table-search']}>
              <Input placeholder={rightPlaceholder} onChange={tableOnSearch} />
            </div>
          ) : null}
          <VirtualTable
            size="small"
            {...restTableProps}
            scroll={{ y: 356, ...rightScroll }}
            dataSource={!!tableSearchValue ? filteredTableData : tableData}
          />
        </div>
      </div>
    );
  },
);

export default memo(ListToTable);
