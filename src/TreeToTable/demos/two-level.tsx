import React, { memo, useRef } from 'react';
import { Typography } from 'antd';
import { TreeToTable, TreeToTableRef } from 'guos-components';

import { treeData_2_level } from './data/treeData';

const App = () => {
  const treeToTableRef = useRef<TreeToTableRef>(null);

  return (
    <TreeToTable
      ref={treeToTableRef}
      treeProps={{
        // @ts-ignore
        treeData: treeData_2_level,
        header: '待选项',
        showSearch: true,
        filterSearch(filterValue, option) {
          return option?.name
            ?.toLowerCase?.()
            ?.includes(filterValue?.toLowerCase?.());
        },
        placeholder: '请输入',
        checkAllText: '全选',
        alignCheckbox: true,
        fieldNames: {
          key: 'id',
          title: 'name',
        },
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
        filterSearch(filterValue, option) {
          return option?.name
            ?.toLowerCase?.()
            ?.includes(filterValue?.toLowerCase?.());
        },
        placeholder: '请输入',
      }}
    />
  );
};

export default memo(App);
