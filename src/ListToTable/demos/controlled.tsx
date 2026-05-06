import React, { memo, useMemo, useState } from 'react';
import { Button, Space } from 'antd';
import { ListToTable } from '@meichuang/mc-components';

type DepartmentOption = {
  key: string;
  name: string;
};

const createDepartmentOptions = (count: number): DepartmentOption[] =>
  Array.from({ length: Math.max(0, count) }, (_, index) => {
    const id = String(index + 1);

    return {
      key: id,
      name: `部门 ${id}`,
    };
  });

const App = () => {
  // 受控模式下，最终选中值统一由外部状态维护。
  const departmentOptions = useMemo(() => createDepartmentOptions(200), []);
  const [selectedRows, setSelectedRows] = useState<DepartmentOption[]>([
    departmentOptions[1],
    departmentOptions[2],
  ]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Space>
        <Button onClick={() => setSelectedRows(departmentOptions.slice(0, 3))}>
          预置前三项
        </Button>
        <Button onClick={() => setSelectedRows([])}>清空</Button>
      </Space>

      <ListToTable
        value={selectedRows}
        onChange={(value) => setSelectedRows(value as DepartmentOption[])}
        listProps={{
          dataSource: departmentOptions,
          header: '待选部门',
          showSearch: true,
          placeholder: '请输入部门名称',
          checkAllText: '全选',
        }}
        tableProps={{
          columns: [
            {
              title: '部门名称',
              dataIndex: 'name',
              key: 'name',
            },
          ],
          header: '已选部门',
          needReverse: true,
        }}
      />
    </Space>
  );
};

export default memo(App);
