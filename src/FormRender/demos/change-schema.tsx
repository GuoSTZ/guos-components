import { Button, Col, Row } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef, useState } from 'react';
import schema1 from './schema/change-schema1.json';
import schema2 from './schema/change-schema2.json';

const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);
  const [schema, setSchema] = useState(schema1);

  const onChange1 = () => {
    ref.current?.form?.clearFormGraph?.();
    setSchema(schema1);
  };
  const onChange2 = () => {
    ref.current?.form?.clearFormGraph?.();
    setSchema(schema2);
  };

  return (
    <>
      <FormRender ref={ref} schema={schema} />
      <Row>
        <Col offset={schema.form.labelCol}>
          <Button onClick={onChange1} style={{ marginRight: 8 }}>
            切换schema1
          </Button>
          <Button onClick={onChange2}>切换schema2</Button>
        </Col>
      </Row>
    </>
  );
};

export default App;
