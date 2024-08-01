import { Button, Col, Row } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef } from 'react';
import schema from './schema/array-table.json';
const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);

  const handleSubmit = () => {
    ref.current?.form.submit().then(console.log);
  };

  return (
    <>
      <FormRender ref={ref} schema={schema} />
      <Row>
        <Col>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default App;
