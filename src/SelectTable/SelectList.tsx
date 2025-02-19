import { Checkbox, Input, List } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { WrapTree } from 'guos-components';
import React, {
  Key,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import { useDebounce } from '@/_utils/useDebounce';

import styles from './SelectList.module.less';

export interface SelectListProps {
  /** 传递给fetchData的参数 */
  fetchParams?: Record<string, any>;
  /** 数据请求接口 */
  fetchData: (params: Record<string, unknown>) => Promise<any>;
  /** 下一个list组件的请求，依赖当前list数据，根据该字段传递响应数据作为下一个list请求的参数 */
  nextFetchParam?: string;
  /** 当前请求，是否依赖上一个list组件的数据，如果是，则在上一个list传递参数后，才会发起请求 */
  needFetchParam?: boolean;
  /** 开启可选模式 */
  checkable?: boolean;
  /** 开启虚拟滚动模式，将关闭分页功能 */
  virtual?: boolean;
  /** 搜索功能 */
  showSearch?:
    | boolean
    | {
        placeholder?: string;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      };
  checkFirst?: boolean;
  /** 当前选中的值 */
  value?: string;
  /** 选择变化时的回调函数 */
  onChange?: (value: Array<Key>, items: Array<any>) => void;
}

export interface SelectListRef {
  deleteOne: (key: Key) => void;
  deleteAll: () => void;
  clearSelected: () => void;
  clearDataSource: () => void;
}

const BOX_WIDTH = 188;
const SelectList = forwardRef<SelectListRef, SelectListProps>((props, ref) => {
  const {
    fetchData,
    needFetchParam = true,
    fetchParams,
    value,
    onChange,
    virtual,
    checkable,
    showSearch = true,
    checkFirst = false,
  } = props;
  const [checkRowKeys, setCheckRowKeys] = useState<Set<Key>>(new Set());
  const [checkRows, setCheckRows] = useState(new Map());
  const [selectedItem, setSelectedItem] = useState<Record<string, string>>({});
  const [dataSource, setDataSource] = useState<any[]>([]);
  const dataSourceMap = useRef(null);
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (value) {
      setCheckRowKeys(new Set(value || []));
    }
  }, [value]);

  /** 清除选中数据 */
  const clearSelected = useCallback(() => {
    setSelectedItem({});
  }, [setSelectedItem]);

  /** 清空数据及分页 */
  const clearDataSource = useCallback(() => {
    setDataSource([]);
    dataSourceMap.current = null;
    setPage({
      current: 1,
      pageSize: 10,
      total: 0,
    });
  }, [setDataSource]);

  const getData = useCallback(
    (params: Record<string, any> = {}) => {
      if (needFetchParam && !fetchParams) {
        return;
      }
      try {
        fetchData({ ...(fetchParams || {}), ...params, isPage: !virtual }).then(
          (data: any) => {
            setDataSource(data?.items);
            dataSourceMap.current = data.items.reduce((pre: any, cur: any) => {
              pre[cur.key] = cur;
              return pre;
            }, {});
            setPage({
              current: data.current,
              pageSize: data.pageSize,
              total: data.total,
            });

            if (checkFirst && data?.items?.length) {
              const firstItem = data?.items?.[0];
              console.log(firstItem, '=====fi');
              const newCheckRowKeys = new Set([firstItem.key]);
              const newCheckRows = new Map();
              newCheckRows.set(firstItem.key, firstItem);
              setCheckRowKeys(newCheckRowKeys);
              setCheckRows(newCheckRows);
              onChange?.(
                Array.from(newCheckRowKeys),
                Array.from(newCheckRows.values()),
              );
              setSelectedItem(firstItem);
            }
          },
        );
      } catch (error) {
        console.log(error);
        // 请求失败的话，执行一遍清除操作，避免脏数据
        clearDataSource();
      }
    },
    [virtual, needFetchParam, fetchParams, clearDataSource, setSelectedItem],
  );

  useEffect(() => {
    getData({ current: 1, pageSize: 10 });
  }, [getData]);

  /** list组件，勾选checkbox */
  const onCheck = useCallback(
    (e: CheckboxChangeEvent, item: any) => {
      const newCheckRowKeys = new Set(checkRowKeys);
      const newCheckRows = new Map(checkRows);
      if (e.target.checked) {
        newCheckRowKeys.add(item?.key);
        newCheckRows.set(item?.key, item);
      } else {
        newCheckRowKeys.delete(item?.key);
        newCheckRows.delete(item?.key);
      }

      setCheckRowKeys(newCheckRowKeys);
      setCheckRows(newCheckRows);

      onChange?.(
        Array.from(newCheckRowKeys),
        Array.from(newCheckRows.values()),
      );
    },
    [checkRowKeys, checkRows, onChange],
  );

  /** 输入框搜索 */
  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      getData({ keyword: e.target.value, current: 1, pageSize: 10 });
      typeof showSearch === 'object' && showSearch.onChange?.(e);
    },
    [getData, showSearch],
  );

  const debounceSearch = useDebounce(onSearch);

  /** list组件，点击item */
  const onSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: any) => {
      setSelectedItem(item);

      if (checkable) {
        onCheck(
          { ...e, target: { checked: !checkRowKeys.has(item.key) } },
          item,
        );
      } else {
        onChange?.([item.key], [item]);
      }
    },
    [onCheck, checkRowKeys, checkable],
  );

  /** 分页回调 */
  const paginationOnChange = useCallback(
    (current: number, pageSize: number) => {
      getData({ current, pageSize });
    },
    [getData],
  );

  /** 树组件点击 */
  const treeOnSelect = useCallback(
    (keys: Key[], info: any) => {
      setCheckRowKeys(new Set(keys));
      onChange?.(keys, info.selectedNodes);
    },
    [onChange],
  );

  /** 树组件勾选 */
  const treeOnCheck = useCallback(
    (keys: Key[], info: any) => {
      setCheckRowKeys(new Set(keys));
      onChange?.(keys, info.checkedNodes);
    },
    [onChange],
  );

  const deleteOne = useCallback(
    (key: Key) => {
      // @ts-ignore
      onCheck({ target: { checked: false } }, { key });
    },
    [onCheck],
  );

  const deleteAll = useCallback(() => {
    setCheckRowKeys(new Set());
    setCheckRows(new Map());

    onChange?.([], []);
  }, [setCheckRowKeys, setCheckRows, onChange]);

  useImperativeHandle(
    ref,
    () => ({
      deleteOne,
      deleteAll,
      clearSelected,
      clearDataSource,
    }),
    [deleteOne, deleteAll, clearSelected, clearDataSource],
  );

  const renderListItem = useCallback(
    (item: any) => {
      let checkboxNode = null;

      if (checkable) {
        checkboxNode = (
          <Checkbox
            className={styles['list-item-checkbox']}
            checked={checkRowKeys.has(item.key)}
            onChange={(e) => onCheck(e, item)}
          />
        );
      }
      return (
        <div className={styles['select-list-item-wrap']}>
          {checkboxNode}
          <List.Item
            onClick={(e) => onSelect(e, item)}
            className={
              selectedItem.key === item.key && !checkable
                ? `${styles['select-list-item']} ${styles['select-list-item-selected']}`
                : styles['select-list-item']
            }
            title={item.name}
          >
            {item.name}
          </List.Item>
        </div>
      );
    },
    [checkRowKeys, onCheck, onSelect, selectedItem.key, checkable],
  );

  const renderSearch = useMemo(() => {
    if (showSearch === true) {
      return (
        <div className={styles['select-list-input']}>
          <Input placeholder="请输入" onChange={debounceSearch} />
        </div>
      );
    } else if (typeof showSearch === 'object') {
      return (
        <div className={styles['select-list-input']}>
          <Input {...showSearch} onChange={debounceSearch} />
        </div>
      );
    } else {
      return null;
    }
  }, [showSearch, debounceSearch]);

  if (virtual) {
    return (
      <WrapTree
        wrapClassName={styles['select-list-tree']}
        wrapStyle={{ width: BOX_WIDTH }}
        showSearch={showSearch}
        height={309}
        checkable={checkable}
        selectable={!checkable}
        treeData={dataSource || []}
        selectedKeys={Array.from(checkRowKeys)}
        checkedKeys={Array.from(checkRowKeys)}
        fieldNames={{
          title: 'name',
        }}
        onSelect={treeOnSelect}
        // @ts-ignore
        onCheck={treeOnCheck}
      />
    );
  }

  return (
    <div className={styles['select-list']} style={{ width: BOX_WIDTH }}>
      {renderSearch}
      <List
        size="small"
        dataSource={dataSource || []}
        renderItem={renderListItem}
        pagination={
          page?.total
            ? {
                simple: true,
                onChange: paginationOnChange,
                total: page?.total || 0,
                current: page?.current || 1,
                pageSize: page?.pageSize || 10,
              }
            : false
        }
      />
    </div>
  );
});

export default memo(SelectList);
