import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';

export default () => {
  const [selectedValue, setSelectedValue] = useState([] as string[]);
  const [searchValue, setSearchValue] = useState('' as string);

  const options: SelectProps['options'] = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
  ];

  const optionsSet = React.useMemo(() => {
    const optionsSet = new Set();
    options.forEach((item) => {
      optionsSet.add((item.label as string).toLowerCase());
    });
    return optionsSet;
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
      return [{ label: value, value }, ...options];
    }
  };

  const handleChange2 = (value: string) => {
    if (value !== searchValue) {
      setSearchValue('');
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
    </>
  );
};
