import { Avatar, Radio, Switch } from 'antd';
import React from 'react';

import styles from './index.module.less';

export interface BlockProps {
  children: React.ReactElement;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  blockStyle?: React.CSSProperties;
  [key: string]: any;
}

const Block = (props: BlockProps) => {
  const { children, icon, title, ...rest } = props;
  return (
    <div className={styles['block']}>
      <div className={styles['block-info']}>
        <div>
          <Avatar size="large" icon={icon} />
        </div>
        <span>{title}</span>
      </div>
      <div className={styles['block-control']}>
        {React.cloneElement(children, rest)}
      </div>
    </div>
  );
};

Block.RadioGroup = (props: any) => {
  const { icon, title, ...rest } = props;
  return (
    <Block icon={icon} title={title}>
      <Radio.Group {...rest} />
    </Block>
  );
};
Block.Switch = (props: any) => {
  const { icon, title, ...rest } = props;
  return (
    <Block icon={icon} title={title}>
      <Switch {...rest} />
    </Block>
  );
};
export default Block;
