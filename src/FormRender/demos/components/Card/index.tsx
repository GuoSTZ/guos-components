import { Avatar, Radio, Switch, Checkbox, AvatarProps } from 'antd';
import React, { JSXElementConstructor, ReactNode, ReactElement } from 'react';

import styles from './index.module.less';

export interface CardProps {
  children: ReactElement;
  title?: ReactNode;
  avatarProps?: AvatarProps;
  [key: string]: any;
}

interface CardWrapComponentProps {
  title?: ReactNode;
  avatarProps?: AvatarProps;
  [key: string]: any;
}

const Card = (props: CardProps) => {
  const { children, title, avatarProps, ...rest } = props;
  return (
    <div className={styles['card']}>
      <div className={styles['card-info']}>
        <div>
          <Avatar size="large" {...avatarProps} />
        </div>
        <span>{title}</span>
      </div>
      <div className={styles['card-control']}>
        {React.cloneElement(children, rest)}
      </div>
    </div>
  );
};

Card.wrap = <T extends JSXElementConstructor<any>>(Component: T) => {
  return (props: CardWrapComponentProps & React.ComponentPropsWithRef<T>) => {
    const { avatarProps, title, ...rest } = props;
    return (
      <Card avatarProps={avatarProps} title={title}>
        <Component {...(rest as React.ComponentPropsWithRef<T>)} />
      </Card>
    );
  };
};
Card.RadioGroup = Card.wrap(Radio.Group);
Card.Switch = Card.wrap(Switch);
Card.CheckboxGroup = Card.wrap(Checkbox.Group);
Card.wrap(Checkbox.Group);
Card.Title = (props: { title?: ReactNode; description?: ReactNode }) => {
  const { title, description } = props;
  return (
    <div className={styles['card-title']}>
      <span className={styles['card-title-title']}>{title}</span>
      <span className={styles['card-title-desc']}>{description}</span>
    </div>
  );
};

export default Card;
