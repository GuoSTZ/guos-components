import React, { memo, useRef } from 'react';
import { Typography } from 'antd';
import TreeToTable, {
  TreeToTableRef,
} from '../../../components/TreeToTable/index';

import {
  // treeData_2_level,
  // treeData_3_level,
  // treeData_4_level,
  treeData_4_level_child,
} from '../../../data/treeData';

const Tree_To_Table = () => {
  const treeToTableRef = useRef<TreeToTableRef>(null);

  return (
    <TreeToTable
      ref={treeToTableRef}
      treeProps={{
        fieldNames: {
          key: 'id',
          title: 'name',
          children: 'child',
        },
        // @ts-ignore
        treeData: treeData_4_level_child,
        header: '待选项',
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
              <Typography.Link
                onClick={() => treeToTableRef.current?.tableDelete(record?.id)}
              >
                删除
              </Typography.Link>
            ),
          },
        ],
        header: [
          '已选项',
          <a onClick={() => treeToTableRef.current?.tableDeleteAll()}>清空</a>,
        ],
        showSearch: true,
        placeholder: '请输入',
      }}
    />
  );
};

export default memo(Tree_To_Table);
