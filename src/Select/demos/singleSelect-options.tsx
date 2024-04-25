import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';

export default () => {
  const [searchValue, setSearchValue] = useState('' as string);

  const options: SelectProps['options'] = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
  ];

  const [optionsSet] = React.useMemo(() => {
    const optionsSet = new Set();
    options.forEach((item) => {
      optionsSet.add((item.label as string).toLowerCase());
    });
    return [optionsSet];
  }, [options]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleOption = (
    options: SelectProps['options'] = [],
    value: string,
  ) => {
    if (!value || optionsSet.has(value.toLowerCase())) {
      return options;
    } else {
      return ([] as SelectProps['options'])!.concat(
        { label: value, value },
        options,
      );
    }
  };

  const handleChange = (value: string) => {
    if (value !== searchValue) {
      setSearchValue('');
    }
  };

  return (
    <Select
      options={handleOption(options, searchValue)}
      showSearch
      filterOption={(input, option) =>
        ((option?.label as string) ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      onChange={handleChange}
      onSearch={handleSearch}
      style={{ width: '100%' }}
      placeholder="这是一个普通单选下拉框"
    />
  );
};
