import React, {
  Key,
  memo,
  forwardRef,
  ReactNode,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useImperativeHandle,
} from 'react';
import { Checkbox, TableProps, Input, Empty } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import VirtualTable from '../VirtualTable';
import VirtualList, { VirtualListProps } from '../VirtualList';
import styles from './index.module.less';

export type ListToTableDataRow = {
  /** 数据唯一标识，未配置 fieldNames.key 时默认取 key */
  key?: Key;
  /** 默认展示字段，未配置 fieldNames.name 时默认取 name */
  name?: React.ReactNode | string;
  [key: string]: any;
};

export type ListToTableFieldNames = {
  /** 主键字段，默认 key */
  key?: string;
  /** 默认展示字段，默认 name */
  name?: string;
};

export interface ListToTableProps<T extends ListToTableDataRow> {
  /** 左侧列表相关属性 */
  listProps: Omit<
    VirtualListProps<T>,
    'height' | 'itemHeight' | 'itemKey' | 'renderItem'
  > & {
    /** 列表高度 */
    height?: number;
    /** 列表项高度 */
    itemHeight?: number;
    /** 列表项渲染定义 */
    renderItem?: (item: T, index: number) => ReactNode;
    /** 列表源数据 */
    dataSource: T[];
    /** 自定义字段映射 */
    fieldNames?: ListToTableFieldNames;
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
  tableProps: Omit<TableProps<Record<string, any>>, 'dataSource'> & {
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
  /** 当前选中的数据，传入后组件进入受控模式 */
  value?: T[];
  /** 数据变化时的回调，受控模式下由外部接管最终结果 */
  onChange?: (value: T[]) => void;
}

export type ListToTableRef<T extends ListToTableDataRow> = {
  /** 触发左侧全选逻辑 */
  listCheckAll: (e: CheckboxChangeEvent) => void;
  /** 删除右侧表格中的单条数据 */
  tableDelete: (id: Key) => void;
  /** 清空右侧表格中的全部数据 */
  tableDeleteAll: () => void;
  /** 当前右侧表格数据 */
  tableData: T[];
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

/** 大数据搜索场景下，挂载到原始数据上的内部缓存字段 */
const INTERNAL_SEARCH_TEXT_FIELD = '__list_to_table_search_text__';

const ListToTable = forwardRef(
  <T extends ListToTableDataRow>(
    props: ListToTableProps<T>,
    ref: React.Ref<ListToTableRef<T>>,
  ) => {
    const { listProps, tableProps, value, onChange } = props;
    const {
      height: leftHeight = 356,
      itemHeight: leftItemHeight = 28,
      renderItem: leftRenderItem,
      dataSource,
      fieldNames: listFieldNames,
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

    /** 统一的数据唯一标识字段 */
    const rowKey = listFieldNames?.key || 'key';
    /** 默认展示字段，同时也是默认搜索预处理来源字段 */
    const rowName = listFieldNames?.name || 'name';

    const [listSearchValue, setListSearchValue] = useState('');
    const [tableSearchValue, setTableSearchValue] = useState('');
    const [innerCheckedRows, setInnerCheckedRows] = useState<Map<Key, T>>(
      new Map(),
    );
    const isControlled = value !== undefined;

    const dataSourceMap = useMemo(() => {
      const nextDataSourceMap = new Map<Key, T>();
      const len = dataSource.length;

      for (let i = 0; i < len; i++) {
        const item = dataSource[i];
        const key = item?.[rowKey] as Key | undefined;

        if (key === undefined || key === null) {
          continue;
        }

        const rawSearchText = item?.[rowName];
        const normalizedSearchText =
          typeof rawSearchText === 'string'
            ? rawSearchText.trim().toLowerCase()
            : '';

        // 允许侵入原对象时，将默认搜索文本缓存到私有字段，避免重复字符串处理。
        (item as any)[INTERNAL_SEARCH_TEXT_FIELD] = normalizedSearchText;
        nextDataSourceMap.set(key, item);
      }

      return nextDataSourceMap;
    }, [dataSource, rowKey, rowName]);

    const normalizedListSearchValue = useMemo(
      () => listSearchValue.trim().toLowerCase(),
      [listSearchValue],
    );
    const normalizedTableSearchValue = useMemo(
      () => tableSearchValue.trim().toLowerCase(),
      [tableSearchValue],
    );

    const mergedListFilterSearch = useMemo(() => {
      if (leftFilterSearch) {
        return leftFilterSearch;
      }

      return (filterValue: string, record: T) => {
        const cachedSearchText = record?.[INTERNAL_SEARCH_TEXT_FIELD];
        return (
          typeof cachedSearchText === 'string' &&
          cachedSearchText.includes(filterValue)
        );
      };
    }, [leftFilterSearch]);

    const mergedTableFilterSearch = useMemo(() => {
      if (rightFilterSearch) {
        return rightFilterSearch;
      }

      return (filterValue: string, record: T) => {
        const cachedSearchText = record?.[INTERNAL_SEARCH_TEXT_FIELD];
        return (
          typeof cachedSearchText === 'string' &&
          cachedSearchText.includes(filterValue)
        );
      };
    }, [rightFilterSearch]);

    /** 控制模式下的选中项，value数据回填 */
    const controlledCheckedRows = useMemo(() => {
      if (!isControlled || !value?.length) {
        return new Map<Key, T>();
      }

      const nextCheckedRows = new Map<Key, T>();

      for (let i = 0; i < value.length; i++) {
        const key = value[i]?.[rowKey] as Key | undefined;

        if (key === undefined || key === null) {
          continue;
        }

        const row = dataSourceMap.get(key);

        if (!row) continue;

        nextCheckedRows.set(key, row);
      }

      return nextCheckedRows;
    }, [dataSourceMap, isControlled, rowKey, value]);

    useEffect(() => {
      if (isControlled) {
        return;
      }

      setInnerCheckedRows((origin) => {
        if (origin.size === 0) {
          return origin;
        }

        let changed = false;
        const next = new Map<Key, T>();

        origin.forEach((currentRow, key) => {
          const latestRow = dataSourceMap.get(key);

          if (!latestRow) {
            changed = true;
            return;
          }

          next.set(key, latestRow);

          if (latestRow !== currentRow) {
            changed = true;
          }
        });

        return changed ? next : origin;
      });
    }, [dataSourceMap, isControlled]);

    /** 统一的当前选中数据源，受控模式取 value，非受控模式取内部状态 */
    const checkedRows = isControlled ? controlledCheckedRows : innerCheckedRows;
    /** 非受控模式下，needReverse 只影响右侧表格展示顺序 */
    const shouldReverseTableData = !isControlled && needReverse;
    /** 受控模式下，needReverse 只影响 onChange 输出顺序 */
    const shouldReverseChangeValue = isControlled && needReverse;

    const tableData = useMemo(
      () =>
        shouldReverseTableData
          ? [...checkedRows.values()].reverse()
          : [...checkedRows.values()],
      [checkedRows, shouldReverseTableData],
    );

    const filteredListData = useMemo(() => {
      if (!normalizedListSearchValue) {
        return dataSource;
      }
      return dataSource.filter((item) =>
        mergedListFilterSearch(normalizedListSearchValue, item),
      );
    }, [dataSource, mergedListFilterSearch, normalizedListSearchValue]);

    const filteredTableData = useMemo(() => {
      if (!normalizedTableSearchValue) {
        return tableData;
      }
      return tableData.filter((item) =>
        mergedTableFilterSearch(normalizedTableSearchValue, item),
      );
    }, [tableData, mergedTableFilterSearch, normalizedTableSearchValue]);

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

    const isCheckAllChecked = useMemo(() => {
      if (currentTotal === 0) {
        return false;
      }

      if (!isSearchMode) {
        return checkedRows.size === dataSourceMap.size;
      }

      for (let i = 0; i < currentListData.length; i++) {
        const key = currentListData[i]?.[rowKey] as Key | undefined;

        if (key === undefined || key === null || !checkedRows.has(key)) {
          return false;
        }
      }

      return true;
    }, [
      checkedRows,
      currentListData,
      currentTotal,
      dataSourceMap.size,
      isSearchMode,
      rowKey,
    ]);

    const triggerChange = useCallback(
      (nextCheckedRows: Map<Key, T>) => {
        const nextTableData = shouldReverseChangeValue
          ? [...nextCheckedRows.values()].reverse()
          : [...nextCheckedRows.values()];

        onChange?.(nextTableData);
      },
      [onChange, shouldReverseChangeValue],
    );

    const updateCheckedRows = useCallback(
      (updater: (origin: Map<Key, T>) => Map<Key, T>) => {
        const origin = isControlled ? controlledCheckedRows : innerCheckedRows;
        const next = updater(origin);

        if (next === origin) {
          return;
        }

        if (!isControlled) {
          setInnerCheckedRows(next);
        }

        triggerChange(next);
      },
      [controlledCheckedRows, innerCheckedRows, isControlled, triggerChange],
    );

    const onCheckAll = useCallback(
      (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        listOnCheckAll?.(isChecked);

        updateCheckedRows((origin) => {
          if (isSearchMode) {
            const next = new Map(origin);
            let changed = false;

            if (isChecked) {
              for (let i = 0; i < currentListData.length; i++) {
                const row = currentListData[i];
                const key = row?.[rowKey] as Key | undefined;

                if (key === undefined || key === null) {
                  continue;
                }

                if (next.get(key) !== row) {
                  next.set(key, row);
                  changed = true;
                }
              }
            } else {
              for (let i = 0; i < currentListData.length; i++) {
                const key = currentListData[i]?.[rowKey] as Key | undefined;

                if (key !== undefined && key !== null && next.delete(key)) {
                  changed = true;
                }
              }
            }

            return changed ? next : origin;
          }

          if (isChecked) {
            if (origin.size === dataSourceMap.size) {
              let changed = false;

              for (const [key, row] of dataSourceMap) {
                if (origin.get(key) !== row) {
                  changed = true;
                  break;
                }
              }

              if (!changed) {
                return origin;
              }
            }

            return new Map(dataSourceMap);
          }

          return origin.size === 0 ? origin : new Map();
        });
      },
      [
        currentListData,
        dataSourceMap,
        isSearchMode,
        listOnCheckAll,
        rowKey,
        updateCheckedRows,
      ],
    );

    const onCheck = useCallback(
      (e: CheckboxChangeEvent) => {
        const currentKey = e.target.value as Key;
        const isChecked = e.target.checked;

        updateCheckedRows((origin) => {
          if (isChecked) {
            const row = dataSourceMap.get(currentKey);

            if (!row || origin.get(currentKey) === row) {
              return origin;
            }

            const next = new Map(origin);
            next.set(currentKey, row);
            return next;
          }

          if (!origin.has(currentKey)) {
            return origin;
          }

          const next = new Map(origin);
          next.delete(currentKey);
          return next;
        });
      },
      [dataSourceMap, updateCheckedRows],
    );

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
    const tableDelete = useCallback(
      (key: Key) => {
        updateCheckedRows((origin) => {
          if (!origin.has(key)) {
            return origin;
          }

          const next = new Map(origin);
          next.delete(key);
          return next;
        });
      },
      [updateCheckedRows],
    );

    /** 表格全部删除 */
    const tableDeleteAll = useCallback(() => {
      updateCheckedRows((origin) => (origin.size === 0 ? origin : new Map()));
    }, [updateCheckedRows]);

    const renderListItem = useCallback(
      (item: T, index: number) => {
        if (leftRenderItem) {
          return leftRenderItem(item, index);
        }

        return (
          <Checkbox
            key={item?.[rowKey] as Key}
            value={item?.[rowKey] as Key}
            checked={checkedRows.has(item?.[rowKey] as Key)}
            onChange={onCheck}
          >
            {item?.[rowName] as ReactNode}
          </Checkbox>
        );
      },
      [checkedRows, leftRenderItem, onCheck, rowKey, rowName],
    );

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
                itemKey={rowKey}
                dataSource={currentListData}
                renderItem={renderListItem}
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
