import { DingdingOutlined, DropboxOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useMemo } from 'react';
import schema from './schema/card.json';
import Card from './components/Card';

const App = () => {
  let baseForm: IFrom;

  const handleSubmit = () => {
    baseForm.submit().then(console.log);
  };

  const components = useMemo(() => {
    return {
      CardRadioGroup: Card.RadioGroup,
      CardSwitch: Card.Switch,
      CardTitle: Card.Title,
      CardCheckboxGroup: Card.CheckboxGroup,
    };
  }, [Card]);

  const scope = useMemo(
    () => ({
      getDing: () => <DingdingOutlined />,
      getDropbox: () => <DropboxOutlined />,
    }),
    [],
  );

  return (
    <>
      <FormRender
        getForm={(form) => (baseForm = form)}
        schema={schema}
        scope={scope}
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
