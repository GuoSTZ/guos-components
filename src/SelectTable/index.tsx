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
import SelectTree, { SelectTreeRef, SelectTreeProps } from './SelectTree';
import VirtualTable from '../VirtualTable';

import styles from './index.module.less';

export interface SelectTableProps {
  /** 左侧列表props */
  listProps: {
    config: Array<
      Omit<SelectTreeProps, 'prevFetchParam'> & {
        nextFetchParam?: string[] | string;
      }
    >;
    /** 头部自定义 */
    header?: React.ReactNode;
    titleRender?: (record: any) => React.ReactNode;
  };
  /** 右侧表格props */
  tableProps: TableProps<any> & {
    /** 头部自定义 */
    header?: React.ReactNode;
    /** 表格高度 */
    height?: number;
  };
  /** 关系keys数据，默认收集config中fieldNames中的key，key默认为 `key`
   * 如果listProps中的config和tableProps中的columns顺序及关系无法对应，需要针对config来自定义该属性
   * */
  relationKeys?: string[];
  value?: any;
  onChange?: (value: any) => void;
}

const SelectTable = (props: SelectTableProps) => {
  const {
    listProps: { config = [], header: listHeader } = {},
    tableProps: {
      header: tableHeader,
      height: tableHeight = 269,
      ...restTableProps
    } = {},
    value,
    onChange,
  } = props;
  const [fetchParams, setFetchParams] = useState<Record<number, any>>({});
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [filterDataSource, setFilterDataSource] = useState<any[]>([]);
  const [selectTreeValue, setSelectTreeValue] = useState<any[]>([]);

  const selectTreeRefs = useRef(new Map<number, SelectTreeRef>());

  const relationKeys = useMemo(() => {
    if (Array.isArray(props.relationKeys)) {
      return props.relationKeys;
    } else if (Array.isArray(config)) {
      return config?.map((item) => item?.fieldNames?.key || 'key');
    } else {
      return [];
    }
  }, [config, props.relationKeys]);

  const tableConfig = useMemo(() => {
    const relationKey = relationKeys?.at(-1) || '';
    return {
      style: { height: tableHeight + 40 },
      size: 'small' as TableProps<any>['size'],
      bordered: true,
      ...restTableProps,
      scroll: { y: tableHeight, ...(restTableProps.scroll || {}) },
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
                  [...selectTreeRefs.current?.values()]
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
  }, [
    restTableProps,
    selectTreeRefs.current,
    relationKeys,
    filterDataSource,
    tableHeight,
  ]);

  const handleOnChange = useCallback(
    (
      keys: Key[],
      rows: any[],
      idx: number,
      nextFetchParam?: string | string[],
    ) => {
      selectTreeRefs.current?.forEach((item, key) => {
        if (key > idx + 1) {
          item.clearDataSource();
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
            [nextFetchParam]: config[idx]?.checkable
              ? rows.map((item) => item[nextFetchParam])
              : rows[0][nextFetchParam],
          };
        }

        setFetchParams((origin) => {
          const handledCurrentFetchParams = { ...(origin[idx] || {}) };
          // 删除分页相关参数
          delete handledCurrentFetchParams?.current;
          delete handledCurrentFetchParams?.pageSize;
          delete handledCurrentFetchParams?.total;

          return {
            ...origin,
            [idx + 1]: {
              ...handledCurrentFetchParams,
              ...nextFetchParams,
            },
          };
        });
      }
      // 最后一列组件数据的选中，展示到右侧
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

  const handleListOnSearch = useCallback(
    (value: string, size: number | undefined, idx: number) => {
      // 搜索引起的数据源为空，清除下一个组件的请求参数和数据源
      if (!!value && size === 0) {
        selectTreeRefs.current?.forEach((item, key) => {
          if (key > idx) {
            item.clearDataSource();
          }
        });
        setFetchParams((origin) => {
          const handledNextFetchParams = { ...origin };
          for (const key in handledNextFetchParams) {
            if (Number(key) > idx) {
              delete handledNextFetchParams[key];
            }
          }
          return handledNextFetchParams;
        });
      }
    },
    [],
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
          slValue.push(void 0);
        }
      });
      setSelectTreeValue(slValue);
    }
  }, [value, relationKeys, config]);

  /** 将config中的fetchParams拼接成字符串，判断是否会被动态改变 */
  const handleConfigFetchParams = useMemo(() => {
    return config
      .map((item) => {
        const noEmptyFetchParams = Object.fromEntries(
          Object.entries(item?.fetchParams || {}).filter(
            (entry) =>
              entry[1] !== null && entry[1] !== '' && entry[1] !== undefined,
          ),
        );
        const keys = Object.keys(noEmptyFetchParams).sort((a, b) =>
          a.localeCompare(b),
        );
        return keys.map((key) => noEmptyFetchParams[key]).join('&');
      })
      .join('&');
  }, [config]);

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
  }, [handleConfigFetchParams]);

  return (
    <div className={styles['select-table']}>
      <div className={styles['select-table-left']}>
        <header>{listHeader}</header>
        <div className={styles['select-table-left-lists']}>
          {config.map((item, idx) => {
            const { nextFetchParam, checkable, ...rest } = item;
            // 默认最后一个list组件是checkable，其他组件不是checkable，也可通过配置来决定
            const defaultCheckable =
              idx === config.length - 1
                ? true && checkable !== false
                : checkable;

            return (
              <SelectTree
                key={idx}
                {...rest}
                prevFetchParam={
                  idx > 0 ? config[idx - 1]?.nextFetchParam : void 0
                }
                value={selectTreeValue?.[idx]}
                onChange={(keys: Key[], rows: any[]) =>
                  handleOnChange(keys, rows, idx, nextFetchParam)
                }
                checkable={defaultCheckable}
                fetchParams={fetchParams[idx] ? fetchParams[idx] : void 0}
                ref={(el) => {
                  if (el) {
                    selectTreeRefs.current.set(idx, el);
                  }
                }}
                handleSearch={(value, size) =>
                  handleListOnSearch(value, size, idx)
                }
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
                [...selectTreeRefs.current?.values()].at(-1)?.deleteAll()
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
              <Input placeholder={`${col.title}`} />
            </Form.Item>
          ))}
        </Form>
        <VirtualTable {...tableConfig} />
      </div>
    </div>
  );
};

export default memo(SelectTable);
