import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';

export default () => {
  const [selectedValue, setSelectedValue] = useState([] as string[]);

  const options: SelectProps['options'] = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
  ];

  const handleChange = (value: string[]) => {
    if (value.length === 0) {
      setSelectedValue([]);
    } else {
      setSelectedValue([value[value.length - 1]]);
    }
  };

  return (
    <Select
      mode="tags"
      value={selectedValue}
      options={options}
      style={{ width: '100%' }}
      onChange={handleChange}
      placeholder="这是一个tags类型的下拉框"
    />
  );
};
