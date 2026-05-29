import React from 'react';
import { Button, Form } from 'antd';
import { FetchLinkV2 } from 'guos-components';
import { formLinkConfig } from './sharedLink';

const App = () => {
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    console.log(values, '提交表单=====');
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onFinish={onFinish}
    >
      <FetchLinkV2 config={formLinkConfig} />
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
