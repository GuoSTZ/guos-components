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
        该版本直接使用列配置原始 width，未设置宽度的列会得到 0
        宽度，内容可读性明显下降。
      </Paragraph>
      <RawVirtualTable
        rowKey="key"
        scroll={{ y: 240 }}
        dataSource={dataSource}
        columns={[
          { title: '任务名', dataIndex: 'name', width: 180 },
          { title: '部门', dataIndex: 'department' },
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
