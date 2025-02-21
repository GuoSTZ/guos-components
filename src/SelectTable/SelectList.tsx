import { QuestionCircleFilled } from '@ant-design/icons';
import { Checkbox, Input, List, Tooltip } from 'antd';
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
import { formatNumberToChinese } from '@/_utils';

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
  /** 请求完成后，是否默认选中第一项 */
  checkFirst?: boolean;
  /** 头部渲染处理 */
  titleRender?: (record: any, handledDom: React.ReactNode) => React.ReactNode;
  /** 自定义渲染子级数量 */
  fieldNames?: {
    key?: string;
    name?: string;
    childCount?: string;
    status?: string;
  };
  /** 状态配置 */
  statusConfig?: Array<{
    /** 显示内容 */
    label: string;
    /** 映射值 */
    value: string;
    /** 文字颜色 */
    color?: string;
    /** 背景色 */
    background?: string;
    /** 是否需要展示提示图标 */
    showTip?: boolean;
    [key: string]: any;
  }>;
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

const BOX_WIDTH = 220;
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
    titleRender,
    fieldNames,
    statusConfig,
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

  const rowKey = fieldNames?.key || 'key';
  const rowName = fieldNames?.name || 'name';
  const rowChildCount = fieldNames?.childCount || 'childCount';
  const rowStatus = fieldNames?.status || 'status';

  useEffect(() => {
    if (value) {
      setCheckRowKeys(new Set(value || []));
    }
  }, [value, selectedItem]);

  /** 清除选中数据 */
  const clearSelected = useCallback(() => {
    setSelectedItem({});
  }, [setSelectedItem, rowKey]);

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
              pre[cur?.[rowKey]] = cur;
              return pre;
            }, {});
            setPage({
              current: data.current,
              pageSize: data.pageSize,
              total: data.total,
            });

            if (
              checkFirst &&
              data?.items?.length &&
              !data?.items?.[0]?.disabled
            ) {
              const firstItem = data?.items?.[0];
              const newCheckRowKeys = new Set([firstItem?.[rowKey]]);
              const newCheckRows = new Map();
              newCheckRows.set(firstItem?.[rowKey], firstItem);
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
    [
      virtual,
      needFetchParam,
      fetchParams,
      clearDataSource,
      setSelectedItem,
      rowKey,
    ],
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
        newCheckRowKeys.add(item?.[rowKey]);
        newCheckRows.set(item?.[rowKey], item);
      } else {
        newCheckRowKeys.delete(item?.[rowKey]);
        newCheckRows.delete(item?.[rowKey]);
      }

      setCheckRowKeys(newCheckRowKeys);
      setCheckRows(newCheckRows);

      onChange?.(
        Array.from(newCheckRowKeys),
        Array.from(newCheckRows.values()),
      );
    },
    [checkRowKeys, checkRows, onChange, rowKey],
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
      if (!!item.disabled) {
        return;
      }
      setSelectedItem(item);

      if (checkable) {
        onCheck(
          { ...e, target: { checked: !checkRowKeys.has(item?.[rowKey]) } },
          item,
        );
      } else {
        onChange?.([item?.[rowKey]], [item]);
      }
    },
    [onCheck, checkRowKeys, checkable, rowKey],
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
      setSelectedItem(info.selectedNodes);
      onChange?.(keys, info.selectedNodes);
    },
    [onChange],
  );

  /** 树组件勾选 */
  const treeOnCheck = useCallback(
    (keys: Key[], info: any) => {
      setCheckRowKeys(new Set(keys));
      setSelectedItem(info.checkedNodes);
      onChange?.(keys, info.checkedNodes);
    },
    [onChange],
  );

  const deleteOne = useCallback(
    (key: Key) => {
      // @ts-ignore
      onCheck({ target: { checked: false } }, { [rowKey]: key });
    },
    [onCheck, rowKey],
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

  const renderTitle = useCallback(
    (record: any) => {
      const dom: React.ReactNode[] = [<span>{record?.[rowName]}</span>];
      if (typeof record?.[rowChildCount] === 'number') {
        dom.push(
          <span>({formatNumberToChinese(record?.[rowChildCount])})</span>,
        );
      }

      if (!!statusConfig && record?.[rowStatus] !== void 0) {
        const status: Record<string, unknown> =
          statusConfig.find(
            (item: any) => item.value === record?.[rowStatus],
          ) || {};
        const { label, showTip, ...rest } = status;
        dom.push(
          <span className={styles['select-list-status-box']} style={rest}>
            {label}
            {/* 这里暂时写死不支持原因的属性字段 */}
            {showTip ? (
              <Tooltip title={record?.notSupportReason}>
                <QuestionCircleFilled
                  style={{ color: '#aaaaaa', paddingLeft: '4px' }}
                />
              </Tooltip>
            ) : null}
          </span>,
        );
      }

      if (!!titleRender) {
        return titleRender(record, dom);
      } else {
        return dom;
      }
    },
    [titleRender, rowChildCount, statusConfig, rowName, rowStatus],
  );

  const renderListItem = useCallback(
    (item: any) => {
      let checkboxNode = null;

      if (checkable) {
        checkboxNode = (
          <Checkbox
            className={styles['list-item-checkbox']}
            checked={checkRowKeys.has(item?.[rowKey])}
            onChange={(e) => onCheck(e, item)}
            disabled={item.disabled}
          />
        );
      }

      let mergedClassName = styles['select-list-item'];
      if (selectedItem?.[rowKey] === item?.[rowKey] && !checkable) {
        mergedClassName = `${mergedClassName} ${styles['select-list-item-selected']}`;
      }
      if (!!item.disabled) {
        mergedClassName = `${mergedClassName} ${styles['select-list-item-disabled']}`;
      }
      return (
        <div className={styles['select-list-item-wrap']}>
          {checkboxNode}
          <List.Item
            onClick={(e) => onSelect(e, item)}
            className={mergedClassName}
            title={item[rowName]}
          >
            {renderTitle(item)}
          </List.Item>
        </div>
      );
    },
    [
      checkRowKeys,
      onCheck,
      onSelect,
      selectedItem,
      checkable,
      renderTitle,
      rowName,
      rowKey,
    ],
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
          key: rowKey,
          title: rowName,
        }}
        titleRender={renderTitle}
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
