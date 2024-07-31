import { Button, Col, Row } from 'antd';
import { FormRender } from 'guos-components';
import {
  Form as IFrom,
  onFieldMount,
  Field,
} from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef } from 'react';
import schema from './schema/effects.json';

const mockDsVersionData = () =>
  new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { label: 'a', value: 1 },
        { label: 'b', value: 2 },
      ]);
    }, 2000);
  });

const mockDsGroupData = () =>
  new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { label: 'c', value: 3 },
        { label: 'd', value: 4 },
      ]);
    }, 2000);
  });

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
        effects={() => {
          onFieldMount('dsVersion', async (field) => {
            (field as Field).loading = true;
            (field as Field).dataSource = await mockDsVersionData();
            (field as Field).loading = false;
          });
          onFieldMount('dsGroup', async (field) => {
            (field as Field).dataSource = await mockDsGroupData();
          });
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
