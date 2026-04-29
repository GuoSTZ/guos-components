import React, { memo, useRef } from 'react';
import { Typography } from 'antd';
import { ListToTable, ListToTableRef } from 'guos-components';

const createOneLevelTreeData = (count: number) =>
  Array.from({ length: Math.max(0, count) }, (_, index) => {
    const id = String(index + 1);
    return {
      key: id,
      name: `节点 ${id}`,
    };
  });

const treeData = createOneLevelTreeData(200000);

const App = () => {
  const listToTableRef = useRef<ListToTableRef<any>>(null);

  return (
    <ListToTable
      ref={listToTableRef}
      listProps={{
        dataSource: treeData,
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
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '操作',
            render: (_, record) => (
              <Typography.Link
                onClick={() => listToTableRef.current?.tableDelete(record?.key)}
              >
                删除
              </Typography.Link>
            ),
          },
        ],
        header: [
          '已选项',
          <a onClick={() => listToTableRef.current?.tableDeleteAll()}>清空</a>,
        ],
        showSearch: true,
        placeholder: '请输入',
        needReverse: true,
      }}
    />
  );
};

export default memo(App);
