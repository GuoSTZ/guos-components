import React from 'react';
import { Tabs, TabsProps } from 'antd';
import Loading from '../components/Loading';
import SwitchButton from '../components/SwitchButton';
import SingleTagSelect from '../components/SingleTagSelect';
import LinkageTreeSelectView from './LinkageTreeSelectView';
import InfoCard from '../components/InFlow';
import Tree_To_Table from './demo/tree-to-table';

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
    {
      key: '5',
      label: '大屏组件1',
      children: (
        <div style={{ width: 400 }}>
          <InfoCard />
        </div>
      ),
    },
    {
      key: '6',
      label: '树表联动组件',
      children: <Tree_To_Table />,
    },
  ];

  return <Tabs items={items} defaultActiveKey="6" />;
};
