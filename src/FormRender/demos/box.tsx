import { Button, Col, Row } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useMemo } from 'react';
import schema from './schema/box.json';
import Block from './components/Block';

const App = () => {
  let baseForm: IFrom;

  const handleSubmit = () => {
    baseForm.submit().then(console.log);
  };

  const components = useMemo(() => {
    return {
      BlockRadioGroup: Block.RadioGroup,
      BlockSwitch: Block.Switch,
    };
  }, []);

  return (
    <>
      <FormRender
        getForm={(form) => (baseForm = form)}
        schema={schema}
        components={components}
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
