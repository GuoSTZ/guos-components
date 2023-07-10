import React from 'react';
import { Tabs, TabsProps } from 'antd';
import Suspension from '../interaction/suspension';

export default () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '悬浮',
      children: <Suspension />,
    },
  ];

  return <Tabs items={items} />;
};
