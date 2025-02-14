import { Checkbox, Input, List } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { WrapTree } from 'guos-components';
import React, { Key, memo, useCallback, useEffect, useState } from 'react';

import styles from './SelectList.module.less';

export interface SelectListProps {
  /** 获取数据的方法，返回一个Promise */
  fetchData: (params: Record<string, any>) => Promise<any>;
  /** 是否需要传递请求参数，开启后，如果不传递fetchParams参数，则不会发送请求 */
  needFetchParams?: boolean;
  /** 传递给fetchData的参数 */
  fetchParams?: Record<string, any>;
  /** 是否存在下一层数据 */
  hasChildren?: boolean;
  /** 当前选中的值 */
  value?: string;
  /** 选择变化时的回调函数 */
  onChange?: (value: Array<Key>) => void;
  /** 是否使用虚拟滚动，默认不使用，采用分页方式 */
  virtual?: boolean;
  /** 是否可勾选 */
  checkable?: boolean;
}

const BOX_WIDTH = 212;
const SelectList = (props: SelectListProps) => {
  const {
    fetchData,
    hasChildren,
    needFetchParams = false,
    fetchParams,
    value,
    onChange,
    virtual,
    checkable,
  } = props;
  const [checkRowKeys, setCheckRowKeys] = useState<Set<Key>>(new Set());
  const [selectedItem, setSelectedItem] = useState<Record<string, string>>({});
  const [data, setData] = useState<any[]>([]);
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

  const getData = useCallback(
    (params: Record<string, any> = {}) => {
      if (needFetchParams && !fetchParams) {
        return;
      }
      try {
        fetchData({ ...(fetchParams || {}), ...params, isPage: !virtual }).then(
          (data: any) => {
            setData(data.items);
            setPage({
              current: data.current,
              pageSize: data.pageSize,
              total: data.total,
            });
          },
        );
      } catch (error) {
        console.log(error);
      }
    },
    [virtual, needFetchParams, fetchParams],
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
    (e: CheckboxChangeEvent, key: string) => {
      const newCheckRowKeys = new Set(checkRowKeys);
      if (e.target.checked) {
        newCheckRowKeys.add(key);
      } else {
        newCheckRowKeys.delete(key);
      }
      setCheckRowKeys(newCheckRowKeys);
      onChange?.(Array.from(newCheckRowKeys));
    },
    [checkRowKeys],
  );

  /** list组件，点击item */
  const onSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: any) => {
      setSelectedItem(item);

      if (checkable) {
        onCheck(
          { ...e, target: { checked: !checkRowKeys.has(item.key) } },
          item.key,
        );
      } else {
        onChange?.([item.key]);
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
      console.log(keys, info, '======treeOnSelect');
      setCheckRowKeys(new Set(keys));
      onChange?.(keys);
    },
    [onChange],
  );

  /** 树组件勾选 */
  const treeOnCheck = useCallback(
    (keys: Key[], info: any) => {
      console.log(keys, info, '======treeOnCheck');
      setCheckRowKeys(new Set(keys));
      onChange?.(keys);
    },
    [onChange],
  );

  const renderListItem = useCallback(
    (item: any) => {
      let checkboxNode = null;

      if (!hasChildren && checkable) {
        checkboxNode = (
          <Checkbox
            className={styles['list-item-checkbox']}
            checked={checkRowKeys.has(item.key)}
            onChange={(e) => onCheck(e, item.key)}
          />
        );
      }
      return (
        <div
          className={styles['select-list-item-wrap']}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {checkboxNode}
          <List.Item
            onClick={(e) => onSelect(e, item)}
            className={
              selectedItem.key === item.key && !checkable
                ? `${styles['select-list-item']} ${styles['select-list-item-selected']}`
                : styles['select-list-item']
            }
            style={{ cursor: 'pointer', width: '100%' }}
          >
            {item.name}
          </List.Item>
        </div>
      );
    },
    [hasChildren, checkRowKeys, onCheck, onSelect, selectedItem.key, checkable],
  );

  if (virtual) {
    return (
      <WrapTree
        wrapClassName={styles['select-list-tree']}
        wrapStyle={{ width: BOX_WIDTH }}
        showSearch={{
          placeholder: '请输入',
        }}
        height={336}
        checkable={checkable}
        selectable={!checkable}
        treeData={data || []}
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
      <Input placeholder="请输入" onChange={onSearch} />
      <List
        size="small"
        dataSource={data || []}
        renderItem={renderListItem}
        pagination={{
          simple: true,
          onChange: paginationOnChange,
          total: page?.total || 0,
          current: page?.current || 1,
          pageSize: page?.pageSize || 10,
        }}
      />
    </div>
  );
};

export default memo(SelectList);
