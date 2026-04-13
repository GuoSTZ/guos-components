import { Typography } from 'antd';
import React, { useMemo } from 'react';
import RawVirtualTable from '../RawVirtualTable';
import { buildDemoDataSource } from './_shared';

const { Paragraph } = Typography;

const App = () => {
  const dataSource = useMemo(() => buildDemoDataSource(), []);

  return (
    <div style={{ width: '100%' }}>
      <Paragraph type="secondary">
        例如 30% 会直接被 parseFloat 解析成 30，最终列宽变成 30px，而不是容器的
        30%。
      </Paragraph>
      <RawVirtualTable
        rowKey="key"
        scroll={{ y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: '30%' },
          { title: '部门', dataIndex: 'department', width: '20%' },
          { title: '负责人', dataIndex: 'owner', width: '20%' },
          { title: '状态', dataIndex: 'status', width: '10%' },
          { title: '大小', dataIndex: 'size', width: 120 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 220 },
          { title: '备注', dataIndex: 'remark', width: '20%' },
        ]}
      />
    </div>
  );
};

export default App;
