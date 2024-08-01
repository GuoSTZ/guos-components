import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef } from 'react';
import schema from './schema/array-items.json';

const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);

  const handleSubmit = () => {
    ref.current?.form.submit().then(console.log);
  };

  return (
    <>
      <FormRender
        ref={ref}
        schema={schema}
        scope={{
          getDelete: () => <DeleteOutlined />,
          getPlus: () => <PlusCircleOutlined />,
        }}
      />
      <Row>
        <Col offset={schema.form.labelCol}>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default App;
