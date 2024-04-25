import React from 'react';
import smallRedPng from './assets/smallRed.png';
import largeRedPng from './assets/largeRed.png';
import smallYellowPng from './assets/smallYellow.png';
import styles from './index.module.less';

export interface LabelTagProps {
  size?: 'small' | 'large';
  className?: string;
  /** 暂时不做自定义颜色扩展  */
  color?: 'red' | 'yellow';
  /** 当传入的children不是字符串时，可用tip来做溢出省略提示 */
  tip?: string;
}

const pngs = {
  red: {
    small: smallRedPng,
    large: largeRedPng,
  },
  yellow: {
    small: smallYellowPng,
    large: smallYellowPng,
  },
};

export default (props: React.PropsWithChildren<LabelTagProps>) => {
  const { children, className, color = 'red', size = 'small', tip } = props;
  const defaultClassName = `${styles[`label-tag`]} ${
    styles[`label-tag-${size}`]
  }`;
  const mergedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <label
      className={mergedClassName}
      style={{ backgroundImage: `url(${pngs[color][size]})` }}
      title={tip || (children as string)}
    >
      {children}
    </label>
  );
};
