import { QuestionCircleFilled } from '@ant-design/icons';
import { Pagination, Tooltip, Input, Spin } from 'antd';
import WrapTree, { WrapTreeProps, WrapTreeRef } from '../WrapTree';
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
import { formatNumberToChinese } from '../utils';

import styles from './SelectTree.module.less';
import debounce from 'lodash/debounce';

export interface SelectTreeProps extends Omit<WrapTreeProps, 'titleRender'> {
  /** 传递给fetchData的参数 */
  fetchParams?: Record<string, any>;
  /** 数据请求接口 */
  fetchData: (params: Record<string, unknown>) => Promise<any>;
  /**
   * 下一个组件的请求，依赖当前组件数据，根据该字段传递响应数据作为下一个组件请求的参数
   * 如果为字符串，则字符串作为参数名，值为选中数据对应的值
   * 如果为数组，则每个字符串分别为参数名，需要在整条数据中找到对应的值
   */
  prevFetchParam?: string[] | string;
  /** 当前请求，是否依赖上一个list组件的数据，如果是，则在上一个list传递参数后，才会发起请求 */
  needFetchParam?: boolean;
  /** 开启可选模式 */
  checkable?: boolean;
  /** 开启虚拟滚动模式，将关闭分页功能 */
  virtual?: boolean;
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
  handleSearch?: (value: string, size?: number) => void;
  /** 宽度 */
  width?: React.CSSProperties['width'];
}
export interface SelectTreeRef {
  deleteOne: (key: Key) => void;
  deleteAll: () => void;
  clearDataSource: () => void;
}

const SelectTree = forwardRef<SelectTreeRef, SelectTreeProps>((props, ref) => {
  const {
    fetchData,
    needFetchParam = true,
    fetchParams,
    value,
    onChange,
    virtual,
    checkable,
    showSearch,
    checkFirst,
    titleRender,
    fieldNames,
    statusConfig,
    prevFetchParam,
    handleSearch,
    width = 220,
    showCheckAll = false,
  } = props;
  const [checkRowKeys, setCheckRowKeys] = useState<Set<Key>>(new Set());
  const [checkRows, setCheckRows] = useState(new Map());
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  // const [searchValue, setSearchValue] = useState('');
  const searchValue = useRef('');
  const latestRequestId = useRef<number>(0);

  const initFetchFlag = useRef(false);
  const wrapTreeRef = useRef<WrapTreeRef>(null);

  const rowKey = fieldNames?.key || 'key';
  const rowName = fieldNames?.name || 'name';
  const rowChildCount = fieldNames?.childCount || 'childCount';
  const rowStatus = fieldNames?.status || 'status';
  const searchField =
    typeof showSearch === 'object' ? showSearch.field || 'keyword' : 'keyword';

  useEffect(() => {
    return () => {
      initFetchFlag.current = false;
    };
  }, []);

  useEffect(() => {
    if (value) {
      setCheckRowKeys(new Set(value || []));
    }
  }, [value]);

  /** 清空数据及分页 */
  const clearDataSource = useCallback(() => {
    setDataSource([]);
    setPage({
      current: 1,
      pageSize: 10,
      total: 0,
    });
  }, [setDataSource]);

  const ensureArray = useCallback(
    (value: string | string[] | undefined): string[] => {
      if (!value) {
        return [];
      }
      if (Array.isArray(value)) {
        return value;
      } else {
        return [value];
      }
    },
    [],
  );

  const handledFetchParams = useMemo(() => {
    if (!prevFetchParam) {
      return Object.keys(fetchParams || {})
        .sort((a, b) => a.localeCompare(b))
        .map((key) => fetchParams?.[key])
        .join('&');
    }
    const prevFetchParamArray = ensureArray(prevFetchParam);
    const composeFetchParams = prevFetchParamArray.reduce((acc, curr) => {
      return acc + fetchParams?.[curr];
    }, '');
    return composeFetchParams;
  }, [fetchParams, prevFetchParam, rowKey]);

  const getData = useCallback(
    (params: Record<string, any> = {}) => {
      try {
        if (needFetchParam !== false && !fetchParams) {
          return Promise.reject();
        }

        const prevFetchParamArray = ensureArray(prevFetchParam);
        const hasprevFetchParam = prevFetchParamArray.some(
          (item) => !!fetchParams?.[item],
        );
        if (prevFetchParamArray.length > 0 && !hasprevFetchParam) {
          return Promise.reject();
        }
        const searchParams = !!searchValue.current
          ? { [searchField]: searchValue.current }
          : {};
        setLoading(true);
        const requestId = Date.now();
        latestRequestId.current = requestId;
        return fetchData({
          ...params,
          isPage: !virtual,
          ...searchParams,
          ...fetchParams,
        })
          .then((data: any) => {
            const statusKeys =
              statusConfig?.map((item: any) => item.value) || [];
            const treeData =
              data?.items?.map((item: any) => {
                return {
                  ...item,
                  disabled:
                    typeof item.disabled === 'boolean'
                      ? item.disabled
                      : statusKeys.includes(item?.[rowStatus]),
                };
              }) || [];
            if (latestRequestId.current !== requestId) {
              return Promise.reject('请求取消');
            }
            setDataSource(treeData);

            setPage({
              current: data.current,
              pageSize: data.pageSize,
              total: data.total,
            });

            if (checkFirst && treeData?.length && !treeData?.[0]?.disabled) {
              const firstItem = treeData?.[0];
              const newCheckRowKeys = new Set([firstItem?.[rowKey]]);
              const newCheckRows = new Map();
              newCheckRows.set(firstItem?.[rowKey], firstItem);
              setCheckRowKeys(newCheckRowKeys);
              setCheckRows(newCheckRows);
              onChange?.(
                Array.from(newCheckRowKeys),
                Array.from(newCheckRows.values()),
              );
              initFetchFlag.current = false;
            }

            return Promise.resolve(treeData);
          })
          .catch((error: any) => {
            return Promise.reject(error);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        // 请求失败的话，执行一遍清除操作，避免脏数据
        clearDataSource();
        return Promise.reject(error);
      }
    },
    [
      virtual,
      needFetchParam,
      handledFetchParams, // 替代fetchParams和prevFetchParam依赖
      clearDataSource,
      rowKey,
      checkFirst,
      fetchData,
      ensureArray,
      statusConfig?.length,
      rowStatus,
      searchField,
      searchValue,
    ],
  );

  useEffect(() => {
    getData({ current: 1, pageSize: 10 }).catch(() => {});
  }, [getData]);

  /** 分页回调 */
  const paginationOnChange = useCallback(
    (current: number, pageSize: number) => {
      getData({ current, pageSize }).catch(() => {});
    },
    [getData],
  );

  /** 树组件点击 - 仅在单选模式下会触发 */
  const treeOnSelect = useCallback(
    (keys: Key[], info: any) => {
      if (info.selected === false) {
        return;
      }
      const newCheckRowKeys = new Set(keys);
      setCheckRowKeys(newCheckRowKeys);
      onChange?.(keys, info.selectedNodes);
    },
    [onChange],
  );

  /** 树组件勾选 - 仅在多选模式下会触发 */
  const treeOnCheck = useCallback(
    (keys: Key[], info: any) => {
      const newCheckRows = new Map(checkRows);
      const newCheckRowKeys = new Set(checkRowKeys);

      if (info.checked) {
        info.checkedNodes.forEach((item: any) => {
          newCheckRows.set(item?.[rowKey], item);
          newCheckRowKeys.add(item?.[rowKey]);
        });
      } else {
        if (info?.event === 'checkAll') {
          newCheckRows.clear();
          newCheckRowKeys.clear();
        } else {
          newCheckRows.delete(info?.node?.[rowKey]);
          newCheckRowKeys.delete(info?.node?.[rowKey]);
          wrapTreeRef.current?.clearChecked();
        }
      }

      setCheckRowKeys(newCheckRowKeys);
      setCheckRows(newCheckRows);
      onChange?.(
        Array.from(newCheckRowKeys),
        Array.from(newCheckRows.values()),
      );
    },
    [onChange, rowKey, checkRows, checkRowKeys],
  );

  const deleteOne = useCallback(
    (key: Key) => {
      const newCheckRowKeys = new Set(checkRowKeys);
      const newCheckRows = new Map(checkRows);

      if (checkRowKeys.has(key)) {
        newCheckRowKeys.delete(key);
        newCheckRows.delete(key);
      }
      setCheckRowKeys(newCheckRowKeys);
      setCheckRows(newCheckRows);
      wrapTreeRef.current?.clearChecked();

      onChange?.(
        Array.from(newCheckRowKeys),
        Array.from(newCheckRows.values()),
      );
    },
    [rowKey, checkRowKeys, checkRows, onChange],
  );

  const deleteAll = useCallback(() => {
    setCheckRowKeys(new Set());
    setCheckRows(new Map());
    wrapTreeRef.current?.clearChecked();

    onChange?.([], []);
  }, [setCheckRowKeys, setCheckRows, onChange]);

  useImperativeHandle(
    ref,
    () => ({
      deleteOne,
      deleteAll,
      clearDataSource,
    }),
    [deleteOne, deleteAll, clearDataSource],
  );

  const renderTitle = useCallback(
    (record: any) => {
      const dom: React.ReactNode[] = [<span>{record?.[rowName]}</span>];
      if (
        typeof record?.[rowChildCount] === 'number' &&
        record?.[rowChildCount] >= 0
      ) {
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
        if (!!label) {
          dom.push(
            <span className={styles['select-tree-status-box']} style={rest}>
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
      }

      if (!!titleRender) {
        return titleRender(record, dom);
      } else {
        return dom;
      }
    },
    [titleRender, rowChildCount, statusConfig, rowName, rowStatus],
  );

  /** 输入框搜索 */
  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // getData已经比较庞大，所以将搜索相关的内容单独拎出来做，通过useRef，避免搜索值的更新，引起getData的重渲染
      searchValue.current = e.target.value;
      getData({ [searchField]: e.target.value, current: 1, pageSize: 10 })
        .then((data: any) => {
          handleSearch?.(e.target.value, data?.length);
        })
        .catch(() => {});
    },
    [getData, searchField, handleSearch],
  );

  const renderSearch = useCallback(
    (searchProps: any) => {
      if (searchProps === true) {
        return (
          <div className={styles['select-tree-input']}>
            <Input onChange={debounce(onSearch, 300)} />
          </div>
        );
      } else if (typeof searchProps === 'object') {
        return (
          <div className={styles['select-tree-input']}>
            <Input {...searchProps} onChange={debounce(onSearch, 300)} />
          </div>
        );
      } else {
        return null;
      }
    },
    [debounce, onSearch],
  );

  return (
    <div className={styles['select-tree']} style={{ width }}>
      <Spin spinning={loading}>
        <WrapTree
          ref={wrapTreeRef}
          wrapClassName={styles['select-tree-tree']}
          wrapStyle={{ width }}
          renderSearch={renderSearch}
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
          showCheckAll={showCheckAll}
        />
        {page?.total && !virtual ? (
          <Pagination
            className={styles['select-tree-pagination']}
            size="small"
            showSizeChanger={false}
            simple
            current={page.current}
            pageSize={page.pageSize}
            total={page.total}
            onChange={paginationOnChange}
          />
        ) : null}
      </Spin>
    </div>
  );
});

export default memo(SelectTree);
