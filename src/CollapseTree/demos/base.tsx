import { CollapseTree } from 'guos-components';
import React from 'react';
import { treeData_4_level } from '@/data/treeData';
const App = () => {
  return (
    <CollapseTree
      treeData={treeData_4_level as any}
      fieldNames={{
        title: 'name',
        key: 'id',
      }}
    />
  );
};

export default App;
