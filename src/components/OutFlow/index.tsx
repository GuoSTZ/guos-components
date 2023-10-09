import React from 'react';
import DataBlock from '../DataBlock';
import LabelSvg from './assets/label.svg';
import CountSvg from './assets/count.svg';
import HeaderSvg from './assets/header.svg';
import LabelTag from '../LabelTag';
import styles from './index.less';

export default () => {
  return (
    <div className={styles['out-flow']}>
      <DataBlock
        size="large"
        label="访问源IP/机构"
        value="102.168.1.1"
        unit=" / 卫健部门1"
        icon={CountSvg}
      />
      <DataBlock size="small" label="数据量" value="150" unit="M" icon={CountSvg} />
      <DataBlock
        size="large"
        label="风险标签"
        value={[
          <LabelTag size="small" color="red">
            SQL注入
          </LabelTag>,
          <LabelTag size="large" color="red">
            SQL注入SQL注入SQL注入
          </LabelTag>,
        ]}
        icon={LabelSvg}
      />
    </div>
  );
};
