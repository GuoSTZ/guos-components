import React, { memo } from 'react';
import { Form, Button } from 'antd';

import AssetScope from './assetScope';

const formLayout = {
  labelCol: { span: 4 },
};

const formatAssetData = (treeData: any[], data: any[] = []) => {
  const loop = (node: any[]) => {
    node.forEach((item) => {
      if (item.type === 'asset') {
        data.push({
          id: item.id,
          type: item.type,
        });
      }
      if (item.childrenStored) {
        loop(item.childrenStored);
      }
    });
  };
  loop(treeData);
  return data;
};

const App = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    values.assetScope = formatAssetData(values.assetScope);
    console.log(values, '======submit');
  };
  return (
    <Form form={form} {...formLayout} onFinish={onFinish}>
      <AssetScope />

      <Form.Item wrapperCol={{ offset: formLayout.labelCol.span }}>
        <Button htmlType="submit" type="primary">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default memo(App);
