import { TableProps, Typography } from 'antd';
import React, {
  Key,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SelectList, { SelectListRef } from './SelectList';
import VirtualTable from '../VirtualTable';

import styles from './index.module.less';

export interface SelectTableProps {
  /** 左侧列表props */
  listProps: {
    config: Array<{
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
    }>;
    /** 头部自定义 */
    header?: React.ReactNode;
  };
  /** 右侧表格props */
  tableProps: TableProps<any> & {
    /** 头部自定义 */
    header?: React.ReactNode;
  };
  /** 关系keys数据，默认收集tableProps下columns中的dataIndex || key
   * 如果listProps中的config和tableProps中的columns顺序及关系无法对应，需要针对config来自定义该属性
   * */
  relationKeys?: string[];
  value?: any;
  onChange?: (value: any) => void;
}

const SelectTable = (props: SelectTableProps) => {
  const {
    listProps: { config = [], header: listHeader },
    tableProps: { header: tableHeader, ...restTableProps },
    value,
    onChange,
  } = props;
  const [fetchParams, setFetchParams] = useState<Record<number, any>>({});
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectListValue, setSelectListValue] = useState<any[]>([]);

  const selectListRefs = useRef(new Map<number, SelectListRef>());

  const relationKeys = useMemo(() => {
    if (props.relationKeys) {
      return props.relationKeys;
    } else {
      return (
        restTableProps.columns?.map((column) =>
          'dataIndex' in column
            ? (column.dataIndex as string)
            : (column.key as string),
        ) || []
      );
    }
  }, [restTableProps.columns, props.relationKeys]);

  const tableConfig = useMemo(() => {
    const relationKey = relationKeys?.at(-1) || '';
    return {
      size: 'small' as TableProps<any>['size'],
      bordered: true,
      ...restTableProps,
      scroll: { y: 325, ...(restTableProps.scroll || {}) },
      dataSource,
      columns: [
        ...(restTableProps.columns || [])?.map((item) => ({
          width: 100,
          ...item,
        })),
        {
          title: '操作',
          dataIndex: 'operation',
          width: 75,
          render: (_: any, record: any) => {
            return (
              <Typography.Link
                onClick={() =>
                  // selectListRefs.current?.deleteOne(record?.[relationKey])
                  [...selectListRefs.current?.values()]
                    .at(-1)
                    ?.deleteOne(record?.[relationKey])
                }
              >
                删除
              </Typography.Link>
            );
          },
        },
      ].map((item) => ({ ...item, ellipsis: true })),
    };
  }, [restTableProps, selectListRefs.current, relationKeys, dataSource]);

  const handleOnChange = useCallback(
    (keys: Key[], rows: any[], idx: number, nextFetchParam?: string) => {
      selectListRefs.current?.forEach((item, key) => {
        if (key > idx) {
          item.clearSelected();
          // 实际情况下，clearDataSource也可以在 key > idx 中执行，但是会出现数据为空再填入的闪烁情况，所以做了一些小措施
          if (key > idx + 1) {
            item.clearDataSource();
          }
        }
      });
      if (nextFetchParam) {
        setFetchParams((origin) => {
          return {
            ...origin,
            [idx + 1]: {
              ...(origin[idx] || {}),
              [nextFetchParam]: config[idx]?.checkable ? keys : keys?.[0],
            },
          };
        });
      }
      if (idx === config.length - 1) {
        const reverseRows = rows.reverse();
        setDataSource(reverseRows);
        onChange?.(reverseRows);
      }
    },
    [config, onChange],
  );

  useEffect(() => {
    if (value) {
      setDataSource(value);
      const slValue: any[] = [];
      relationKeys?.forEach((key) => {
        const set = new Set();
        value?.forEach((item: any) => {
          set.add(item[key]);
        });
        slValue.push(Array.from(set));
      });
      setSelectListValue(slValue);
    }
  }, [value, relationKeys]);

  return (
    <div className={styles['select-table']}>
      <div className={styles['select-table-left']}>
        <header>{listHeader}</header>
        <div className={styles['select-table-left-lists']}>
          {config.map((item, idx) => {
            const { nextFetchParam, needFetchParam, checkable, ...rest } = item;
            const defaultNeedFetchParam = idx === 0 ? false : needFetchParam;
            const defaultCheckable =
              idx === config.length - 1
                ? true && checkable !== false
                : checkable;
            return (
              <SelectList
                key={idx}
                {...rest}
                value={selectListValue?.[idx]}
                onChange={(keys: Key[], rows: any[]) =>
                  handleOnChange(keys, rows, idx, nextFetchParam)
                }
                needFetchParam={defaultNeedFetchParam}
                checkable={defaultCheckable}
                fetchParams={fetchParams[idx] ? fetchParams[idx] : void 0}
                ref={(el) => {
                  if (el) {
                    selectListRefs.current.set(idx, el);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      <div className={styles['select-table-right']}>
        <header>
          {[
            tableHeader,
            <Typography.Link
              onClick={() =>
                [...selectListRefs.current?.values()].at(-1)?.deleteAll()
              }
            >
              清空
            </Typography.Link>,
          ]}
        </header>
        <VirtualTable {...tableConfig} />
      </div>
    </div>
  );
};

export default memo(SelectTable);
