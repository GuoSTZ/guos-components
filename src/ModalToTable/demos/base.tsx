import { Form, Button, Popconfirm, Space, Typography } from 'antd';
import { ModalToTable } from 'guos-components';
import React, { memo } from 'react';
import { getLabel } from '@/_utils';

const formLayout = {
  labelCol: { span: 4 },
};

const dicts = {
  idFactor: [
    {
      label: '应用名称',
      type: null,
      value: 'appName',
    },
    {
      label: '应用签名',
      type: null,
      value: 'signature',
    },
    {
      label: '主机名',
      type: null,
      value: 'hostName',
    },
    {
      label: '证书',
      type: null,
      value: 'certNo',
    },
    {
      label: '数据库用户',
      type: null,
      value: 'userAccount',
    },
    {
      label: '操作系统账户',
      type: null,
      value: 'osAccount',
    },
    {
      label: '用户名',
      type: null,
      value: 'account',
    },
    {
      label: 'IP地址',
      type: null,
      value: 'ip',
    },
    {
      label: 'MAC地址',
      type: null,
      value: 'mac',
    },
  ],
};

const App = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form} {...formLayout} onFinish={console.log}>
      <Form.Item name="modalToTable" label="某个组件">
        <ModalToTable
          tableProps={{
            columns: [
              {
                title: '属性名称',
                key: 'name',
                dataIndex: 'name',
              },
              {
                title: '属性信息',
                key: 'policyValueShow',
                dataIndex: 'policyValueShow',
                ellipsis: true,
                render: (
                  text: Array<{ name: string; value: string | number }>,
                ) => {
                  return text
                    ?.map((item) => {
                      return `${getLabel(dicts, 'idFactor', item.name)}=${
                        item.value
                      }`;
                    })
                    .join(',');
                },
              },
              {
                title: '操作',
                width: 150,
                render: (_: any, record: Record<string, unknown>) => {
                  return (
                    <Space>
                      <Typography.Link onClick={() => record}>
                        编辑
                      </Typography.Link>

                      <Popconfirm title="确定删除?" onConfirm={() => record}>
                        <Typography.Link>删除</Typography.Link>
                      </Popconfirm>
                    </Space>
                  );
                },
              },
            ],
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
