import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';

const { Option } = Select;

export default () => {
  const [searchValue, setSearchValue] = useState('' as string);

  const options: SelectProps['options'] = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
  ];

  const [optionsSet, optionsChildren] = React.useMemo(() => {
    const optionsSet = new Set();
    const optionsChildren: React.ReactNode[] = [];
    options.forEach((item) => {
      optionsSet.add((item.label as string).toLowerCase());
      optionsChildren.push(<Option key={item.value}>{item.label}</Option>);
    });
    return [optionsSet, optionsChildren];
  }, [options]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleChange = (value: string) => {
    if (value !== searchValue) {
      setSearchValue('');
    }
  };

  const handleOptionsChildren = (options: React.ReactNode[], value: string) => {
    if (!value || optionsSet.has(value.toLowerCase())) {
      return options;
    } else {
      return ([] as React.ReactNode[])!.concat(
        <Option key={value}>{value}</Option>,
        options,
      );
    }
  };

  return (
    <Select
      showSearch
      filterOption={(input, option) =>
        ((option?.children ?? '') as string)
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      onChange={handleChange}
      onSearch={handleSearch}
      style={{ width: '100%' }}
      placeholder="这是一个使用Select.Option的单选下拉框"
    >
      {handleOptionsChildren(optionsChildren, searchValue)}
    </Select>
  );
};
