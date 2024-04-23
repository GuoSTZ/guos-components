import React, { memo } from 'react';
import { Form, Button, Input } from 'antd';

import AssetScope from './assetScope';

const formLayout = {
  labelCol: { span: 4 },
};

const BaseForm = () => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      {...formLayout}
      onFinish={(values) => console.log(values, '=====form-submit-values')}
    >
      <Form.Item label={'测试项'}>
        <Input />
      </Form.Item>

      <AssetScope />

      <Form.Item wrapperCol={{ offset: formLayout.labelCol.span }}>
        <Button htmlType="submit" type="primary">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default memo(BaseForm);
