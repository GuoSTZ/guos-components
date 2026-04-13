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
        该版本不会自动均分剩余空间，所以当总宽小于容器时，表格内容区会出现明显空白。
      </Paragraph>
      <RawVirtualTable
        rowKey="key"
        scroll={{ y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: 140 },
          { title: '部门', dataIndex: 'department', width: 100 },
          { title: '负责人', dataIndex: 'owner', width: 120 },
          { title: '状态', dataIndex: 'status', width: 100 },
          { title: '大小', dataIndex: 'size', width: 90 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
          { title: '备注', dataIndex: 'remark', width: 180 },
        ]}
      />
    </div>
  );
};

export default App;
