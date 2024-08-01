import { FormRender } from 'guos-components';
import React from 'react';
import schema from './schema/basic-with-button.json';

const App = () => {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log(values, '====values');
  };

  return <FormRender schema={schema} scope={{ handleSubmit }} />;
};

export default App;
