import { Button, Col, Row, Tabs, TabsProps } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef } from 'react';
import schema from './schema/block_form.json';
import schema2 from './schema/block_form2.json';
import './style/block_form.less';

const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);

  const handleSubmit = () => {
    ref.current?.form.submit().then(console.log);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      className: 'tab1',
      children: <FormRender schema={schema} ref={ref} />,
    },
    {
      key: '2',
      label: 'Tab 2',
      className: 'tab2',
      children: <FormRender schema={schema2} ref={ref} />,
    },
  ];

  return (
    <div className="block-form">
      <Tabs defaultActiveKey="2" destroyInactiveTabPane items={items} />
      <Row>
        <Col offset={schema.form.labelCol}>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default App;
