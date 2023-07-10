import React from 'react';
import { Tabs, TabsProps } from 'antd';
import Loading from '../components/Loading';
import SwitchButton from '../components/SwitchButton';
import SingleTagSelect from '../components/SingleTagSelect';

export default () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '加载中',
      children: (
        <div style={{ width: 'fit-content', background: '#000' }}>
          <Loading />
        </div>
      ),
    },
    {
      key: '2',
      label: '主题切换',
      children: <SwitchButton />,
    },
    {
      key: '3',
      label: '单选的tags Select',
      children: <SingleTagSelect />,
    },
  ];

  return <Tabs items={items} defaultActiveKey="3" />;
};
