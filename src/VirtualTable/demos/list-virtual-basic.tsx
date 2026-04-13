import { Typography } from 'antd';
import ListVirtualTable from '../ListVirtualTable';
import React, { useMemo } from 'react';
import { buildDemoDataSource } from './_shared';

const { Paragraph } = Typography;

const App = () => {
  const dataSource = useMemo(() => buildDemoDataSource(), []);

  return (
    <div style={{ width: '100%' }}>
      <Paragraph type="secondary">
        ListVirtualTable 基础场景：保持现有列宽分配策略，并使用 List
        做纵向虚拟化。
      </Paragraph>
      <ListVirtualTable
        rowKey="key"
        scroll={{ y: 500 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: 180 },
          { title: '部门', dataIndex: 'department', width: 120 },
          { title: '负责人', dataIndex: 'owner' },
          { title: '状态', dataIndex: 'status', width: 120 },
          { title: '大小', dataIndex: 'size', width: 120 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 220 },
          { title: '备注', dataIndex: 'remark', width: 320 },
        ]}
      />
    </div>
  );
};

export default App;
