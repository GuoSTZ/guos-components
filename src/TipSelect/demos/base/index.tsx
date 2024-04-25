import { TipSelect } from 'guos-components';
import React from 'react';

import { mockData } from './data';

const App = () => {
  return (
    <TipSelect style={{ width: 300 }} options={mockData} placeholder="请选择" />
  );
};

export default App;
