import { Typography } from 'antd';
import { VirtualTable } from 'guos-components';
import React, { useMemo } from 'react';
import { buildDemoDataSource } from './_shared';

const { Paragraph } = Typography;

const App = () => {
  const dataSource = useMemo(() => buildDemoDataSource(), []);

  return (
    <div style={{ width: '100%' }}>
      <Paragraph type="secondary">
        百分比列宽会按容器实时换算成像素宽度，便于和固定宽度列组合使用。
      </Paragraph>
      <VirtualTable
        rowKey="key"
        scroll={{ y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: '25%' },
          { title: '部门', dataIndex: 'department', width: '15%' },
          { title: '负责人', dataIndex: 'owner', width: 140 },
          { title: '状态', dataIndex: 'status', width: '12%' },
          { title: '大小', dataIndex: 'size', width: 100 },
          { title: '更新时间', dataIndex: 'updatedAt' },
          { title: '备注', dataIndex: 'remark' },
        ]}
      />
    </div>
  );
};

export default App;
