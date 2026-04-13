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
        仅给关键列设置宽度，其余列不设宽度，观察自动补齐策略是否让表格铺满容器。
      </Paragraph>
      <VirtualTable
        rowKey="key"
        scroll={{ y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: 180 },
          { title: '部门', dataIndex: 'department', width: 120 },
          { title: '负责人', dataIndex: 'owner' },
          { title: '状态', dataIndex: 'status' },
          { title: '大小', dataIndex: 'size' },
          { title: '更新时间', dataIndex: 'updatedAt' },
          { title: '备注', dataIndex: 'remark' },
        ]}
      />
    </div>
  );
};

export default App;
