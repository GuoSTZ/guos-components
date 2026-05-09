import React, { memo, useRef } from 'react';
import { Typography } from 'antd';
import { ListToTable, ListToTableRef } from 'guos-components';

type UserOption = {
  id: string;
  label: string;
};

const createUserOptions = (count: number): UserOption[] =>
  Array.from({ length: Math.max(0, count) }, (_, index) => {
    const id = String(index + 1);

    return {
      id,
      label: `用户 ${id}`,
    };
  });

// 字段映射场景，用于适配非 key、name 结构的数据源。
const userOptions = createUserOptions(1000);

const App = () => {
  const listToTableRef = useRef<ListToTableRef<UserOption>>(null);

  return (
    <ListToTable
      ref={listToTableRef}
      listProps={{
        dataSource: userOptions,
        fieldNames: {
          key: 'id',
          name: 'label',
        },
        header: '可选用户',
        showSearch: true,
        placeholder: '请输入用户名称',
        checkAllText: '全选',
      }}
      tableProps={{
        columns: [
          {
            title: '用户名称',
            dataIndex: 'label',
            key: 'label',
          },
          {
            title: '操作',
            width: 100,
            render: (_, record) => (
              <Typography.Link
                onClick={() => listToTableRef.current?.tableDelete(record?.id)}
              >
                删除
              </Typography.Link>
            ),
          },
        ],
        header: [
          '已选用户',
          <a onClick={() => listToTableRef.current?.tableDeleteAll()}>清空</a>,
        ],
      }}
    />
  );
};

export default memo(App);
