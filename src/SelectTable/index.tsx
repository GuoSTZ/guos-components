// import { VirtualTable } from 'guos-components';
import { Table, TableProps, Typography } from 'antd';
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

import styles from './index.module.less';

export interface SelectTableProps {
  listProps: {
    config: Array<{
      fetchData: (params: Record<string, unknown>) => Promise<any>;
      nextFetchParam?: string;
      checkable?: boolean;
    }>;
    header?: React.ReactNode;
  };
  tableProps: TableProps<any> & {
    header?: React.ReactNode;
  };
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

  const selectListRef = useRef<SelectListRef>(null);

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
      scroll: { y: 299 },
      ...restTableProps,
      columns: [
        ...(restTableProps.columns || []),
        {
          title: '操作',
          dataIndex: 'operation',
          width: 60,
          render: (_: any, record: any) => {
            return (
              <Typography.Link
                onClick={() =>
                  selectListRef.current?.deleteOne(record?.[relationKey])
                }
              >
                删除
              </Typography.Link>
            );
          },
        },
      ].map((item) => ({ ...item, ellipsis: true })),
    };
  }, [restTableProps, selectListRef, relationKeys]);

  const handleOnChange = useCallback(
    (keys: Key[], rows: any[], idx: number, nextFetchParam?: string) => {
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
        setDataSource(rows);
        onChange?.(rows);
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
            const { nextFetchParam, ...rest } = item;
            return (
              <SelectList
                key={idx}
                {...rest}
                value={selectListValue?.[idx]}
                onChange={(keys: Key[], rows: any[]) =>
                  handleOnChange(keys, rows, idx, nextFetchParam)
                }
                fetchParams={fetchParams[idx] ? fetchParams[idx] : void 0}
                {...(idx === config.length - 1 ? { ref: selectListRef } : {})}
              />
            );
          })}
        </div>
      </div>

      <div className={styles['select-table-right']}>
        <header>
          {[
            tableHeader,
            <Typography.Link onClick={() => selectListRef.current?.deleteAll()}>
              清空
            </Typography.Link>,
          ]}
        </header>
        <Table {...tableConfig} dataSource={dataSource} />
      </div>
    </div>
  );
};

export default memo(SelectTable);
