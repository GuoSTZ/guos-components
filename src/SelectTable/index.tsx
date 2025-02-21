import { TableProps, Typography, Form, Input } from 'antd';
import React, {
  Key,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SelectList, { SelectListRef, SelectListProps } from './SelectList';
import VirtualTable from '../VirtualTable';

import styles from './index.module.less';

export interface SelectTableProps {
  /** 左侧列表props */
  listProps: {
    config: Array<SelectListProps>;
    /** 头部自定义 */
    header?: React.ReactNode;
    /** 渲染异常情况 */
    titleRender?: (record: any) => React.ReactNode;
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
  const [filterDataSource, setFilterDataSource] = useState<any[]>([]);
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
      scroll: { y: 269, ...(restTableProps.scroll || {}) },
      dataSource: filterDataSource,
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
  }, [restTableProps, selectListRefs.current, relationKeys, filterDataSource]);

  const handleOnChange = useCallback(
    (
      keys: Key[],
      rows: any[],
      idx: number,
      nextFetchParam?: string | string[],
    ) => {
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
        let nextFetchParams = {};

        if (Array.isArray(nextFetchParam)) {
          if (config[idx]?.checkable) {
            nextFetchParams = nextFetchParam.reduce((acc, curr) => {
              acc[curr] = rows.find((item) => item[curr] === curr);
              return acc;
            }, {} as Record<string, any>);
          } else {
            nextFetchParams = nextFetchParam.reduce((acc, curr) => {
              acc[curr] = rows[0][curr];
              return acc;
            }, {} as Record<string, any>);
          }
        } else {
          nextFetchParams = {
            [nextFetchParam]: config[idx]?.checkable ? keys : keys?.[0],
          };
        }

        setFetchParams((origin) => {
          return {
            ...origin,
            [idx + 1]: {
              ...(origin[idx] || {}),
              ...nextFetchParams,
            },
          };
        });
      }
      if (idx === config.length - 1) {
        const reverseRows = rows.reverse();
        // 数据备份，供搜索时使用
        setDataSource(reverseRows);
        setFilterDataSource(reverseRows);
        onChange?.(reverseRows);
      }
    },
    [config, onChange],
  );

  const handleOnSearch = useCallback(
    (changeValues: any, values: any) => {
      const filterDataSource = dataSource.filter((item) => {
        return Object.entries(values).every(([key, value]) => {
          if (!value) return true;
          return item[key]
            ?.toString()
            ?.toLowerCase()
            .includes(value?.toString()?.toLowerCase());
        });
      });
      setFilterDataSource(filterDataSource);
    },
    [dataSource],
  );

  useEffect(() => {
    if (value) {
      // 数据备份，供搜索时使用
      setDataSource(value);
      setFilterDataSource(value);
      const slValue: any[] = [];
      relationKeys?.forEach((key, index) => {
        if (
          config[index].checkable === true ||
          index === relationKeys.length - 1
        ) {
          const set = new Set();
          value?.forEach((item: any) => {
            set.add(item[key]);
          });
          slValue.push(Array.from(set));
        } else {
          slValue.push(null);
        }
      });
      setSelectListValue(slValue);
    }
  }, [value, relationKeys, config]);

  useEffect(() => {
    config?.forEach((item, idx) => {
      const noEmptyFetchParams = Object.fromEntries(
        Object.entries(item?.fetchParams || {}).filter(
          (entry) =>
            entry[1] !== null && entry[1] !== '' && entry[1] !== undefined,
        ),
      );
      const defaultFetchParams =
        Object.keys(noEmptyFetchParams).length > 0
          ? noEmptyFetchParams
          : void 0;
      setFetchParams((origin) => {
        return {
          ...origin,
          [idx]: defaultFetchParams,
        };
      });
    });
  }, [config]);

  return (
    <div className={styles['select-table']}>
      <div className={styles['select-table-left']}>
        <header>{listHeader}</header>
        <div className={styles['select-table-left-lists']}>
          {config.map((item, idx) => {
            const { nextFetchParam, needFetchParam, checkable, ...rest } = item;
            // 默认第一个list组件不需要参数即可发送请求，其他项需要参数才可发送请求，也可以通过配置来决定
            const defaultNeedFetchParam =
              typeof needFetchParam === 'boolean' ? needFetchParam : idx !== 0;
            // 默认最后一个list组件是checkable，其他组件不是checkable，也可通过配置来决定
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
        <Form
          layout="inline"
          onValuesChange={handleOnSearch}
          style={{ columnGap: 8, padding: 12 }}
        >
          {props.tableProps?.columns?.map((col) => (
            <Form.Item
              // @ts-ignore
              name={`${col.dataIndex || col.key}`}
              style={{
                width: `calc( 100% / ${
                  props?.tableProps?.columns?.length || 1
                } - 8px)`,
                marginRight: 0,
              }}
            >
              <Input placeholder={`请输入${col.title}`} />
            </Form.Item>
          ))}
        </Form>
        <VirtualTable {...tableConfig} />
      </div>
    </div>
  );
};

export default memo(SelectTable);
