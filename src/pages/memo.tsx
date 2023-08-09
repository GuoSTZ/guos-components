import React, { useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import Demo1 from '../memo/parent-children';
import Demo2 from '../memo/demo2';
import Demo3 from '../memo/demo3';
import Demo4 from '../memo/demo4';
import Demo5 from '../memo/demo5';

// 把固定的数据提取到组件外部
const items: TabsProps['items'] = [
  {
    key: '1',
    label: '父组件重渲',
    children: <Demo1 />,
  },
  {
    key: '2',
    label: 'Demo2',
    children: <Demo2 />,
  },
  {
    key: '3',
    label: 'Demo2（优化）',
    children: <Demo3 />,
  },
  {
    key: '4',
    label: 'Demo3',
    children: <Demo4 />,
  },
  {
    key: '5',
    label: 'Demo3（优化）',
    children: <Demo5 />,
  },
];

export default () => {
  const [activeKey, setActiveKey] = useState('3');

  return <Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />;
};
