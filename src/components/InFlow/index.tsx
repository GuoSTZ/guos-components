import React from 'react';
import DataBlock from '../DataBlock';
import LabelSvg from './assets/label.svg';
import CountSvg from './assets/count.svg';
import HeaderSvg from './assets/header.svg';
import LabelTag from '../LabelTag';
import styles from './index.less';

export default () => {
  return (
    <div className={styles['in-flow']}>
      <DataBlock size="small" label="数据量" value="150" unit="M" icon={CountSvg} />
      <DataBlock size="small" label="敏感数据量" value="150" unit="M" icon={CountSvg} />
      <DataBlock size="small" label="接口数量" value="15" icon={CountSvg} />
      <DataBlock size="small" label="敏感接口数据量" value="5" icon={CountSvg} />
      <DataBlock
        size="large"
        label="敏感标签TOP3"
        value={[
          <LabelTag size="small" color="yellow">
            病例号
          </LabelTag>,
          <LabelTag size="small" color="yellow">
            中文姓名
          </LabelTag>,
          <LabelTag size="small" color="yellow">
            手机号
          </LabelTag>,
        ]}
        icon={LabelSvg}
      />
      <DataBlock
        size="large"
        label="风险标签"
        value={[
          <LabelTag size="small" color="red">
            SQL注入
          </LabelTag>,
          <LabelTag size="small" color="red">
            XSS攻击
          </LabelTag>,
        ]}
        icon={LabelSvg}
      />
    </div>
  );
};
