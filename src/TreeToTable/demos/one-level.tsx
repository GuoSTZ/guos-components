import React, { memo, useRef } from 'react';
import { Typography } from 'antd';
import { TreeToTable, TreeToTableRef } from 'guos-components';

import { treeData_1_level } from './data/treeData';

const App = () => {
  const treeToTableRef = useRef<TreeToTableRef>(null);

  return (
    <TreeToTable
      ref={treeToTableRef}
      treeProps={{
        treeData: treeData_1_level,
        header: '待选项',
        showSearch: true,
        placeholder: '请输入',
        checkAllText: '全选',
      }}
      tableProps={{
        dataSource: [],
        columns: [
          {
            title: '名称',
            dataIndex: 'title',
            key: 'title',
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

export default memo(App);
