import React from 'react';
import { Tabs, TabsProps } from 'antd';
import Loading from '../components/Loading';
import SwitchButton from '../components/SwitchButton';
import SingleTagSelect from '../components/SingleTagSelect';
import LinkageTreeSelectView from './LinkageTreeSelectView';

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
      label: '多类型单选下拉框',
      children: <SingleTagSelect />,
    },
    {
      key: '4',
      label: '联动树下拉框',
      children: <LinkageTreeSelectView />,
    },
  ];

  return <Tabs items={items} defaultActiveKey="4" />;
};
