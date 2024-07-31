import { Button } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef } from 'react';
import schema from './schema/search_form.json';
import './style/search_form.less';

const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);

  const getData = (values: any) => console.log('模拟搜索', values);

  const handleSearch = () => {
    ref.current?.form.submit().then(getData);
  };

  const handleReset = () => {
    ref.current?.form.reset();
    getData({});
  };

  return (
    <div className="search-form">
      <FormRender ref={ref} schema={schema} />
      <div className="search-form-btns">
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" onClick={handleSearch}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default App;
