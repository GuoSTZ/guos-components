import React from 'react';
import { Tabs, TabsProps } from 'antd';
import Demo1 from '../g6/demo1';
import Demo from '../g6/demo';

export default () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Demo',
      children: <Demo />,
    },
    {
      key: '2',
      label: 'Demo1',
      children: <Demo1 />,
    },
  ];

  return <Tabs items={items} defaultActiveKey="2" />;
};
