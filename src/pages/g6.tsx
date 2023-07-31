import React from 'react';
import { Tabs, TabsProps } from 'antd';
import Demo1 from '../g6/demo1';
import Demo from '../g6/demo';
import Demo2 from '../g6/demo2';

export default () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Demo',
      children: <Demo />,
    },
    {
      key: '2',
      label: '网格布局',
      children: <Demo1 />,
    },
    {
      key: '3',
      label: 'Dagre流程图',
      children: <Demo2 />,
    },
  ];

  return <Tabs items={items} defaultActiveKey="3" />;
};
