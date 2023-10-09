import React, { ReactNode } from 'react';
import SmallSvg from './assets/small.svg';
import LargeSvg from './assets/large.svg';
import styles from './index.less';

export interface DataBlockProps {
  size: 'small' | 'large';
  className?: string;
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
}

interface LabelTextProps {
  label: DataBlockProps['label'];
  value: DataBlockProps['value'];
  unit: DataBlockProps['unit'];
}

const LabelText = ({ label, value, unit }: LabelTextProps) => {
  return (
    <div className={styles['label-text']}>
      <span className={styles['label-text-label']}>{label}</span>
      <span className={styles['label-text-value']}>{value}</span>
      <span className={styles['label-text-unit']}>{unit}</span>
    </div>
  );
};

export default (props: DataBlockProps) => {
  const { className, icon, label, size = 'small', unit, value } = props;

  const defaultClassName = `${styles['data-block']} ${styles[`data-block-${size}`]}`;
  const mergedClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <div
      className={mergedClassName}
      // style={{ background: `url(${size === 'large' ? LargeSvg : SmallSvg}) no-repeat` }}
    >
      <img src={icon as any} />
      <LabelText label={label} value={value} unit={unit} />
    </div>
  );
};
