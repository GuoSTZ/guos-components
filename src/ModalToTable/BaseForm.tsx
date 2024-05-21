import { Form, Input, Select } from 'antd';
import React, { memo } from 'react';
import { EditTable } from 'guos-components';

const BaseForm = () => {
  const [form] = Form.useForm();
  const tableConfig = {
    columns: [
      {
        title: '属性名称',
        dataIndex: 'name',
        editable: true,
        component: Select,
        componentProps: {
          placeholder: '请选择',
        },
      },
      {
        title: '值',
        dataIndex: 'value',
        editable: true,
        componentProps: {
          placeholder: '请输入',
        },
      },
    ],
    dataSource: [],
    // text: commonText
  };
  return (
    <Form form={form}>
      <Form.Item label="属性名称" name="name">
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="属性信息" name="name">
        <EditTable {...tableConfig} />
      </Form.Item>
    </Form>
  );
};

export default memo(BaseForm);
