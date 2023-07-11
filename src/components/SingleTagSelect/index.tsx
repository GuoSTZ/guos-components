import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';

const { Option } = Select;

export default () => {
  const [selectedValue, setSelectedValue] = useState([] as string[]);
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

  const handleChange = (value: string[]) => {
    if (value.length === 0) {
      setSelectedValue([]);
    } else {
      setSelectedValue([value[value.length - 1]]);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleOption = (options: SelectProps['options'] = [], value: string) => {
    if (!value || optionsSet.has(value.toLowerCase())) {
      return options;
    } else {
      return ([] as SelectProps['options'])!.concat({ label: value, value }, options);
    }
  };

  const handleChange2 = (value: string) => {
    if (value !== searchValue) {
      setSearchValue('');
    }
  };

  const handleOptionsChildren = (options: React.ReactNode[], value: string) => {
    if (!value || optionsSet.has(value.toLowerCase())) {
      return options;
    } else {
      return ([] as React.ReactNode[])!.concat(<Option key={value}>{value}</Option>, options);
    }
  };

  return (
    <>
      <Select
        mode="tags"
        value={selectedValue}
        options={options}
        style={{ width: 600 }}
        onChange={handleChange}
        placeholder="这是一个tags类型的下拉框"
      />

      <Select
        options={handleOption(options, searchValue)}
        showSearch
        filterOption={(input, option) =>
          ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
        }
        onChange={handleChange2}
        onSearch={handleSearch}
        style={{ width: 600, marginTop: 20 }}
        placeholder="这是一个单选下拉框"
      />

      <Select
        showSearch
        filterOption={(input, option) =>
          ((option?.children ?? '') as string).toLowerCase().includes(input.toLowerCase())
        }
        onChange={handleChange2}
        onSearch={handleSearch}
        style={{ width: 600, marginTop: 20 }}
        placeholder="这是一个使用Select.Option的单选下拉框"
      >
        {handleOptionsChildren(optionsChildren, searchValue)}
      </Select>
    </>
  );
};
