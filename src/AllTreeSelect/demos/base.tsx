import { Form, Button } from 'antd';
import { AllTreeSelect } from 'guos-components';
import React from 'react';
const App = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} labelCol={{ span: 4 }}>
      <Form.Item
        name="aaa"
        label="全选树下拉框"
        rules={[{ required: true, message: '请选择aaa' }]}
        // initialValue={[]}
      >
        <AllTreeSelect
          style={{ width: 300 }}
          placeholder={'请选择'}
          showSearch
          treeDefaultExpandAll
          treeData={[
            {
              title: '1',
              value: '1',
              children: [
                { title: '1-1', value: '1-1' },
                { title: '1-2', value: '1-2' },
              ],
            },
            {
              title: '2',
              value: '2',
              children: [
                { title: '2-1', value: '2-1' },
                { title: '2-2', value: '2-2' },
              ],
            },
          ]}
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
