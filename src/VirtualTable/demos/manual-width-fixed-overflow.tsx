import { Typography } from 'antd';
import { VirtualTable } from 'guos-components';
import React, { useMemo } from 'react';
import { buildDemoDataSource } from './_shared';

const { Paragraph, Text } = Typography;

const App = () => {
  const dataSource = useMemo(() => buildDemoDataSource(), []);

  return (
    <div style={{ width: '100%' }}>
      <Paragraph type="secondary">
        固定宽列超过容器时，未定宽列仍会获得可用宽度，避免直接坍缩不可见。
      </Paragraph>
      <div>
        <VirtualTable
          rowKey="key"
          scroll={{ y: 240, x: 1200 }}
          dataSource={dataSource}
          columns={[
            { title: '任务名', dataIndex: 'name', width: 300 },
            { title: '部门', dataIndex: 'department', width: 220 },
            { title: '负责人', dataIndex: 'owner', width: 220 },
            { title: '状态', dataIndex: 'status', width: 180 },
            { title: '大小', dataIndex: 'size', width: 300 },
            { title: '更新时间', dataIndex: 'updatedAt', width: 240 },
            { title: '备注', dataIndex: 'remark' },
          ]}
        />
      </div>
      <Text type="secondary">
        建议拖拽页面宽度或在不同分辨率下查看，更容易观察容器变化时的动态重算效果。
      </Text>
    </div>
  );
};

export default App;
