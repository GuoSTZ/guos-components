import React, { Key, memo, useCallback, useMemo, useState } from 'react';
import { Table, TableProps, Typography } from 'antd';
import SelectList from './SelectList';

import styles from './index.module.less';

export interface SelectTableProps {
  listProps: {
    config: Array<{
      fetchData: (params: Record<string, unknown>) => Promise<any>;
      nextFetchParam?: string;
    }>;
  };
  tableProps: TableProps<any>;
}

const SelectTable = (props: SelectTableProps) => {
  const {
    listProps: { config = [] },
    tableProps,
  } = props;
  const [fetchParams, setFetchParams] = useState<Record<number, any>>({});

  const tableConfig = useMemo(() => {
    return {
      ...tableProps,
      columns: [
        ...(tableProps.columns || []),
        {
          title: '操作',
          dataIndex: 'operation',
          width: 80,
          render: () => {
            return <Typography.Link>删除</Typography.Link>;
          },
        },
      ],
    };
  }, [tableProps]);

  const onChange = useCallback(
    (keys: Key[], idx: number, nextFetchParam?: string) => {
      if (nextFetchParam) {
        setFetchParams((origin) => {
          return {
            ...origin,
            [idx + 1]: {
              ...(origin[idx] || {}),
              [nextFetchParam]: keys?.[0],
            },
          };
        });
      }
      if (idx === config.length - 1) {
        console.log(keys, '========result');
      }
    },
    [config.length],
  );

  return (
    <div className={styles['select-table']}>
      <div className={styles['select-table-left']}>
        {config.map((item, idx) => {
          const { nextFetchParam, ...rest } = item;
          return (
            <SelectList
              key={idx}
              {...rest}
              onChange={(keys: Key[]) => onChange(keys, idx, nextFetchParam)}
              fetchParams={fetchParams[idx] ? fetchParams[idx] : void 0}
            />
          );
        })}
      </div>

      <div>
        <Table {...tableConfig} />
      </div>
    </div>
  );
};

export default memo(SelectTable);
