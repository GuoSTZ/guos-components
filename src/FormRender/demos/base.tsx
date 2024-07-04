import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef } from 'react';
import schema from './schema/base.json';

const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log(values, '====values');
  };

  return (
    <div>
      <FormRender ref={ref} schema={schema} scope={{ handleSubmit }} />
    </div>
  );
};

export default App;
