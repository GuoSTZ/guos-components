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
        ScrollXVirtualTable：百分比与像素宽度混用，百分比列将基于 scroll.x
        进行换算。
      </Paragraph>
      <ScrollXVirtualTable
        rowKey="key"
        scroll={{ x: 1800, y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: '22%' },
          { title: '部门', dataIndex: 'department', width: '12%' },
          { title: '负责人', dataIndex: 'owner', width: 220 },
          { title: '状态', dataIndex: 'status', width: '12%' },
          { title: '大小', dataIndex: 'size', width: 180 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 240 },
          { title: '备注', dataIndex: 'remark' },
        ]}
      />
    </div>
  );
};

export default App;
