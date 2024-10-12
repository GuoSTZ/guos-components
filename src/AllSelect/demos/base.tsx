import { AllSelect } from 'guos-components';
import React from 'react';
const App = () => {
  return (
    <AllSelect
      style={{ width: 300 }}
      options={[
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
        { label: '选项3', value: 3 },
      ]}
    />
  );
};

export default App;
