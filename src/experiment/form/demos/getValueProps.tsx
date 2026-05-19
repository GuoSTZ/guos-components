import React from 'react';
import { Button, Form, Input, Select } from 'antd';

const options = [
  { label: '字段1', value: 1 },
  { label: '字段2', value: 2 },
];

const App = () => {
  const [form] = Form.useForm<{ name: string; age: number }>();

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={console.log}
      >
        <Form.Item name="input" label="测试字段">
          <Input />
        </Form.Item>

        <Form.Item
          name="select"
          label="测试字段"
          getValueProps={() => {
            return {
              value: 9,
              options: [
                { label: '字段3', value: 8 },
                { label: '字段4', value: 9 },
              ],
            };
          }}
        >
          <Select options={options} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default App;
