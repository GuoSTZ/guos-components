import { Form, Button, Input, FormInstance, Select } from 'antd';
import { ModalToTable, EditTable } from 'guos-components';
import React, { memo, useRef } from 'react';
import { getLabel } from '@/_utils';
import { dicts, commonText } from '@/data/editTable';

const formLayout = {
  labelCol: { span: 4 },
};

const App = () => {
  const [form] = Form.useForm();
  const editTableRef = useRef<{ form: FormInstance }>(null);

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
  };

  const editTableConfig = {
    columns: [
      {
        title: '下拉框',
        dataIndex: 'select',
        width: 150,
        editable: true,
        component: ({ text }: { text: string }) =>
          getLabel(dicts, 'idFactor', text) || '-',
        editComponent: Select,
        editComponentProps: {
          placeholder: '请选择',
          options: dicts['idFactor'],
        },
        editConfig: {
          rules: [{ required: true, message: '请选择' }],
        },
      },
      {
        title: '输入框',
        dataIndex: 'input',
        editable: true,
        editComponentProps: {
          placeholder: '请输入',
        },
        editConfig: {
          rules: [{ required: true, message: '请输入' }],
        },
      },
    ],
    text: commonText,
    ref: editTableRef,
  };

  const renderFormItem = () => {
    return (
      <>
        <Form.Item
          name="input"
          label="输入框"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="editTable"
          label="可编辑表格"
          rules={[
            {
              validator: async () => {
                try {
                  // 校验可编辑表格内部是否存在问题
                  await editTableRef.current?.form?.validateFields?.();
                  return Promise.resolve();
                } catch (err) {
                  return Promise.reject();
                }
              },
            },
          ]}
        >
          <EditTable {...editTableConfig} />
        </Form.Item>
        <div>属性间的关系是“and”</div>
      </>
    );
  };

  return (
    <Form form={form} {...formLayout} onFinish={console.log}>
      <Form.Item name="modalToTable" label="某个组件">
        <ModalToTable
          tableProps={tableConfig}
          modalProps={{ renderFormItem }}
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
