import { Input, InputProps, InputRef } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';

import styles from './index.module.less';

export interface DirectoryInputProps extends InputProps {
  defaultParentDirectory?: string;
}

const DirectoryInput = (props: DirectoryInputProps) => {
  const { value, onChange, defaultParentDirectory, ...restProps } = props;
  const [directoryPath, setDirectoryPath] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<InputProps['value']>('');
  const inputRef = useRef<InputRef>(null);
  const dpRef = useRef(directoryPath);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (defaultParentDirectory) {
      if (typeof defaultParentDirectory !== 'string') {
        throw new Error('defaultParentDirectory is not a string');
      }
      const dpdArray = defaultParentDirectory
        ?.split('/')
        ?.filter((item) => !!item);
      setDirectoryPath((dp) => [...dpdArray, ...dp]);
    }
  }, [defaultParentDirectory]);

  useEffect(() => {
    dpRef.current = directoryPath;
  }, [directoryPath]);

  useEffect(() => {
    inputRef.current?.input?.addEventListener('keydown', function (event) {
      if (event.key === 'Backspace' || event.keyCode === 8) {
        // event.preventDefault(); // 这会阻止输入框中字符的删除
        if (!inputRef.current?.input?.value && dpRef.current.length > 0) {
          event.preventDefault();
          setDirectoryPath((dp) => {
            const result = dp.slice(0, dp.length - 1);
            const last = dp[dp.length - 1];
            setInputValue(last);
            return result;
          });
        }
      }
    });
  }, []);

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

  return (
    <div className={styles['directory-input']}>
      <div className={styles['directory-input-text']}>
        {directoryPath.join('/')}
        {directoryPath.length > 0 ? '/' : null}
      </div>
      <div className={styles['directory-input-control']}>
        <Input
          {...restProps}
          ref={inputRef}
          value={inputValue}
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};

export default memo(DirectoryInput);
