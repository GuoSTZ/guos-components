import TipSelect from 'guos-components/TipSelect/mutiple';
import React, { useEffect } from 'react';
import { Form, Button } from 'antd';

import { template } from './data';

const App = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(template, '======template');
  }, []);

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name="data" label="测试">
          <TipSelect
            style={{ width: 300 }}
            options={template}
            placeholder="请选择"
          />
        </Form.Item>
      </Form>

      <Button
        onClick={() =>
          form
            .validateFields()
            .then((values) => console.log(values, '=======submit'))
        }
      >
        提交
      </Button>
    </>
  );
};

export default App;
