import React from 'react';
import { Form, Input, InputNumber, Radio, Typography } from 'antd';

const App = () => {
  const [form] = Form.useForm<{ name: string; age: number }>();
  const nameValue = Form.useWatch('name', form);
  const controlValue = Form.useWatch('control', form);

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name="name" label="Name (Watch to trigger rerender)">
          <Input />
        </Form.Item>
        <Form.Item name="age" label="Age (Not Watch)">
          <InputNumber />
        </Form.Item>

        <Form.Item name="control" label="控制器">
          <Radio.Group
            options={[
              { label: '显示', value: 1 },
              { label: '隐藏', value: 0 },
            ]}
          />
        </Form.Item>
        {controlValue === 1 ? (
          <Form.Item name="content1" label="受控器1">
            <Input placeholder="根据控制器的值来决定是否显示" />
          </Form.Item>
        ) : null}
      </Form>

      <Typography>
        <pre>Name Value: {nameValue}</pre>
        <pre>控制值的值：{controlValue}</pre>
      </Typography>
    </>
  );
};

export default App;
