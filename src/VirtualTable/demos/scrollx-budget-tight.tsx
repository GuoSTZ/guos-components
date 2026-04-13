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
        ScrollXVirtualTable：scroll.x 预算偏紧时，未设宽列会按预算进行压缩分配。
      </Paragraph>
      <ScrollXVirtualTable
        rowKey="key"
        scroll={{ x: 300, y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: 280 },
          { title: '部门', dataIndex: 'department', width: 220 },
          { title: '负责人', dataIndex: 'owner', width: 220 },
          { title: '状态', dataIndex: 'status', width: 180 },
          { title: '大小', dataIndex: 'size', width: 220 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 240 },
          { title: '备注（不设宽）', dataIndex: 'remark' },
        ]}
      />
    </div>
  );
};

export default App;
