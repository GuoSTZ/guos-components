import { Form, Button, FormInstance, Select } from 'antd';
import { ModalToTable } from 'guos-components';
import React, { memo } from 'react';
import { getLabel } from '@/_utils';
import { dicts } from '@/data/editTable';

const formLayout = {
  labelCol: { span: 4 },
};

const App = () => {
  const [form] = Form.useForm();

  const tableConfig = {
    columns: [
      {
        title: '属性名称',
        key: 'input',
        dataIndex: 'input',
      },
      {
        title: '属性信息',
        key: 'editTable',
        dataIndex: 'editTable',
        ellipsis: true,
        render: (text: Array<{ select: string; input: string | number }>) => {
          return text
            ?.map((item) => {
              return `${getLabel(dicts, 'idFactor', item.select)}=${
                item.input
              }`;
            })
            .join(',');
        },
      },
    ],
    operations: {
      delete: {
        renderable: false,
      },
    },
  };

  const renderFormItem = (form: FormInstance) => {
    console.log(form, Form);
    return (
      <>
        <Form.Item
          name="input"
          label="数据库"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select placeholder="请选择" />
        </Form.Item>
        <Form.Item
          name="input"
          label="Schema"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select placeholder="请选择" />
        </Form.Item>
        <Form.Item
          name="input"
          label="表"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select placeholder="请选择" />
        </Form.Item>
        <Form.Item
          name="input"
          label="列"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select placeholder="请选择" />
        </Form.Item>
      </>
    );
  };

  return (
    <Form form={form} {...formLayout} onFinish={console.log}>
      <Form.Item name="modalToTable" label="业务场景1">
        <ModalToTable
          tableProps={tableConfig}
          modalProps={{
            renderFormItem,
            okText: '确定',
            cancelText: '取消',
          }}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: formLayout.labelCol.span }}>
        <Button htmlType="submit" type="primary">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default memo(App);
