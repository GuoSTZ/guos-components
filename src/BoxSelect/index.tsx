import cls from 'classnames';
import React, { CSSProperties, memo, useState } from 'react';

import styles from './index.module.less';
import {
  BoxSelectOption,
  BoxSelectType,
  BoxSelectValue,
  getBoxSelectOptions,
} from './utils';

interface BoxSelectBaseProps {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  value?: BoxSelectValue[];
  defaultValue?: BoxSelectValue[];
  onChange?: (value: BoxSelectValue[]) => void;
}

interface BoxSelectPresetProps extends BoxSelectBaseProps {
  type?: Exclude<BoxSelectType, 'custom'>;
  dataSource?: never;
}

interface BoxSelectCustomProps extends BoxSelectBaseProps {
  type: 'custom';
  dataSource: BoxSelectOption[];
}

export type BoxSelectProps = BoxSelectPresetProps | BoxSelectCustomProps;

const BoxSelect = (props: BoxSelectProps) => {
  const {
    className,
    style,
    disabled = false,
    value,
    defaultValue = [],
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState<BoxSelectValue[]>(defaultValue);

  const mergedValue = (isControlled ? value : innerValue) ?? [];

  const options =
    props.type === 'custom'
      ? getBoxSelectOptions({ type: 'custom', dataSource: props.dataSource })
      : getBoxSelectOptions({ type: props.type ?? 'week' });

  const emitChange = (nextValue: BoxSelectValue[]) => {
    if (!isControlled) {
      setInnerValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleItemClick = (option: BoxSelectOption) => {
    if (disabled || option.disabled) {
      return;
    }
    const included = mergedValue.includes(option.value);
    const nextValue = included
      ? mergedValue.filter((item) => item !== option.value)
      : [...mergedValue, option.value];
    emitChange(nextValue);
  };

  return (
    <div className={cls(styles['box-select'], className)} style={style}>
      {options.map((option) => {
        const selected = mergedValue.includes(option.value);
        const itemClassName = cls(styles['box-select-item'], {
          [styles['box-select-item-selected']]: selected,
          [styles['box-select-item-disabled']]: disabled || option.disabled,
        });
        return (
          <div
            key={String(option.value)}
            className={itemClassName}
            onClick={() => handleItemClick(option)}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export type { BoxSelectOption, BoxSelectType, BoxSelectValue };

export default memo(BoxSelect);
