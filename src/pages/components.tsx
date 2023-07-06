import React from 'react';
import { Tabs, TabsProps } from 'antd';
import LoadingView from '../views/LoadingView';

export default () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '加载中',
      children: <LoadingView />,
    },
  ];

  return <Tabs items={items} />;
};
