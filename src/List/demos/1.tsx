import { Typography } from 'antd';
import React from 'react';
import List from '../test/1';

type DemoItem = {
  key: string;
  title: string;
  desc: string;
};

const dataSource: DemoItem[] = new Array(10000).fill(0).map((_, index) => ({
  key: `simple-item-${index}`,
  title: `simple 列表项 ${index + 1}`,
  desc: `这是第 ${index + 1} 条数据`,
}));

const App = () => {
  return (
    <List<DemoItem>
      dataSource={dataSource}
      height={420}
      itemHeight={56}
      itemKey="key"
      renderItem={(item, index) => (
        <div>
          <Typography.Text strong>{item.title}</Typography.Text>
          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
            #{index}
          </Typography.Text>
          <div>
            <Typography.Text type="secondary">{item.desc}</Typography.Text>
          </div>
        </div>
      )}
    />
  );
};

export default App;
