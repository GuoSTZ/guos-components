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
        当每一列都设置了宽度，但总宽小于容器宽度时，组件会均分剩余空间，避免右侧大面积留白。
      </Paragraph>
      <VirtualTable
        rowKey="key"
        scroll={{ y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: 60 },
          { title: '部门', dataIndex: 'department', width: 60 },
          { title: '负责人', dataIndex: 'owner', width: 60 },
          { title: '状态', dataIndex: 'status', width: 60 },
          { title: '大小', dataIndex: 'size', width: 90 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 100 },
          { title: '备注', dataIndex: 'remark', width: 100 },
        ]}
      />
    </div>
  );
};

export default App;
