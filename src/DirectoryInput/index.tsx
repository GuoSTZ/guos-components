import { Input, InputProps } from 'antd';
import React, { memo, useEffect, useState } from 'react';

import styles from './index.module.less';

export interface DirectoryInputProps extends InputProps {
  defaultParentDirectory?: string;
}

const DirectoryInput = (props: DirectoryInputProps) => {
  const { value, onChange, defaultParentDirectory, ...restProps } = props;
  const [directoryPath, setDirectoryPath] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {}, [value]);

  const handleOnChange = (e: any) => {
    const value: string = e.target.value;
    if (value.endsWith('/')) {
      const data = value.slice(0, value.length - 1);
      setDirectoryPath((dp) => [...dp, data]);
      setInputValue('');
      onChange?.(e);
    } else {
      setInputValue(value);
      onChange?.(e);
    }
  };

  const renderParentDirectory = (value?: string) => {
    if (!value) {
      return;
    }
    if (typeof value !== 'string') {
      throw new Error('defaultParentDirectory is not a string');
    }
    const valueTrim = value.trim();
    if (!valueTrim || valueTrim === '/') {
      return '';
    }
    const dArr = value.split('/');
    return `${dArr.join('/')}/`;
  };

  return (
    <div className={styles['directory-input']}>
      <div className={styles['directory-input-text']}>
        {renderParentDirectory(defaultParentDirectory)}
        {directoryPath.join('/')}
        {directoryPath.length > 0 ? '/' : null}
      </div>
      <div className={styles['directory-input-control']}>
        <Input {...restProps} value={inputValue} onChange={handleOnChange} />
      </div>
    </div>
  );
};

export default memo(DirectoryInput);
