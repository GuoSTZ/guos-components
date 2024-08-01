import { FormRender } from 'guos-components';
import React from 'react';
import schema from './schema/show-hide.json';

const App = () => {
  return (
    <>
      <FormRender schema={schema} />
    </>
  );
};

export default App;
