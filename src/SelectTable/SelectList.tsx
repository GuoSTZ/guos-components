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
} from 'react';

import styles from './SelectList.module.less';

export interface SelectListProps {
  /** 获取数据的方法，返回一个Promise */
  fetchData: (params: Record<string, any>) => Promise<any>;
  /** 是否需要传递请求参数，开启后，如果不传递fetchParams参数，则不会发送请求 */
  needFetchParam?: boolean;
  /** 传递给fetchData的参数 */
  fetchParams?: Record<string, any>;
  /** 当前选中的值 */
  value?: string;
  /** 选择变化时的回调函数 */
  onChange?: (value: Array<Key>, items: Array<any>) => void;
  /** 是否使用虚拟滚动，默认不使用，采用分页方式 */
  virtual?: boolean;
  /** 是否可勾选 */
  checkable?: boolean;
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
            setDataSource(data.items);
            dataSourceMap.current = data.items.reduce((pre: any, cur: any) => {
              pre[cur.key] = cur;
              return pre;
            }, {});
            setPage({
              current: data.current,
              pageSize: data.pageSize,
              total: data.total,
            });
          },
        );
      } catch (error) {
        console.log(error);
        // 请求失败的话，执行一遍清除操作，避免脏数据
        clearDataSource();
      }
    },
    [virtual, needFetchParam, fetchParams, clearDataSource],
  );

  useEffect(() => {
    getData({ current: 1, pageSize: 10 });
  }, [getData]);

  /** 输入框搜索 */
  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      getData({ keyword: e.target.value, current: 1, pageSize: 10 });
    },
    [getData],
  );

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

  if (virtual) {
    return (
      <WrapTree
        wrapClassName={styles['select-list-tree']}
        wrapStyle={{ width: BOX_WIDTH }}
        showSearch={{
          placeholder: '请输入',
        }}
        height={309}
        checkable={checkable}
        selectable={!checkable}
        treeData={dataSource || []}
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
      <div className={styles['select-list-input']}>
        <Input placeholder="请输入" onChange={onSearch} />
      </div>
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
