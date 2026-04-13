import { Typography } from 'antd';
import React, { useMemo } from 'react';
import ScrollXVirtualTable from '../ScrollXVirtualTable';
import { buildDemoDataSource } from './_shared';

const { Paragraph } = Typography;

const App = () => {
  const dataSource = useMemo(() => buildDemoDataSource(), []);

  return (
    <div style={{ width: '100%' }}>
      <Paragraph type="secondary">
        ScrollXVirtualTable：其余列定宽且总宽超容器，仅保留一列不设宽，观察该列在
        scroll.x 预算下的分配表现。
      </Paragraph>
      <ScrollXVirtualTable
        rowKey="key"
        scroll={{ x: 2000, y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: 280 },
          { title: '部门', dataIndex: 'department', width: 220 },
          { title: '负责人', dataIndex: 'owner', width: 220 },
          { title: '状态', dataIndex: 'status', width: 180 },
          { title: '大小', dataIndex: 'size', width: 300 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 240 },
          { title: '备注（不设宽）', dataIndex: 'remark' },
        ]}
      />
    </div>
  );
};

export default App;
