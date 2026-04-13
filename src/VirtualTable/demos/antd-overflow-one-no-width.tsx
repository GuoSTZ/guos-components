import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo } from 'react';
import { buildDemoDataSource, type DemoRecord } from './_shared';

const { Paragraph } = Typography;

const App = () => {
  const dataSource = useMemo(() => buildDemoDataSource(), []);

  const columns = useMemo<ColumnsType<DemoRecord>>(
    () => [
      { title: '任务名', dataIndex: 'name', width: 280 },
      { title: '部门', dataIndex: 'department', width: 220 },
      { title: '负责人', dataIndex: 'owner', width: 220 },
      { title: '状态', dataIndex: 'status', width: 180 },
      { title: '大小', dataIndex: 'size', width: 300 },
      { title: '更新时间', dataIndex: 'updatedAt', width: 240 },
      { title: '备注（不设宽）', dataIndex: 'remark' },
    ],
    [],
  );

  return (
    <div style={{ width: '100%' }}>
      <Paragraph type="secondary">
        原生 antd Table：仅保留一列不设置宽度，其余列都设置且总宽超过容器。
        可以发现
      </Paragraph>
      <div>
        <Table<DemoRecord>
          rowKey="key"
          size="small"
          pagination={false}
          scroll={{ x: 500, y: 240 }}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default App;
