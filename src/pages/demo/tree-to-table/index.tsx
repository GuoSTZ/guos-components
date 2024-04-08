import React, { memo, useRef } from 'react';
import { Typography } from 'antd';
import TreeToTable from '../../../components/TreeToTable/index';

import { treeData_2_level, treeData_3_level } from '../../../data/treeData';

const Tree_To_Table = () => {
  const treeToTableRef = useRef<{
    tableDelete: (key: string) => void;
  }>(null);

  return (
    <TreeToTable
      ref={treeToTableRef}
      treeProps={{
        fieldNames: {
          key: 'id',
          title: 'name',
        },
        // @ts-ignore
        treeData: treeData_3_level,
        showSearch: true,
        placeholder: '请输入',
      }}
      tableProps={{
        dataSource: [],
        columns: [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '操作',
            render: (_, record) => (
              <Typography.Link onClick={() => treeToTableRef.current?.tableDelete(record?.id)}>
                删除
              </Typography.Link>
            ),
          },
        ],
        showSearch: true,
        placeholder: '请输入',
      }}
    />
  );
};

export default memo(Tree_To_Table);
