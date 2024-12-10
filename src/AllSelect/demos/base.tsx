import { Form, Button } from 'antd';
import { AllSelect } from 'guos-components';
import React from 'react';
const App = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form} labelCol={{ span: 4 }}>
      <Form.Item
        name="aaa"
        label="全选下拉框"
        rules={[{ required: true, message: '请选择aaa' }]}
      >
        <AllSelect
          style={{ width: 300 }}
          placeholder={'请选择'}
          options={[
            { label: '选项1a', value: 1, disabled: true },
            { label: '选项2b', value: 2 },
            { label: '选项3c', value: 3 },
          ]}
          optionFilterProp="label"
          showSearch
          selectAllValue={[1, 2, 3]}
          transformSelectAllValue={(data) => data?.map((item) => item)}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4 }}>
        <Button
          type="primary"
          onClick={() =>
            form
              .validateFields()
              .then((value) => console.log(value, '==========submit'))
          }
        >
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
