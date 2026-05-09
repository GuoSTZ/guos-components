import React, { memo, useMemo } from 'react';
import { Button, Form, Space, Typography } from 'antd';
import { ListToTable } from 'guos-components';

type RoleOption = {
  key: string;
  name: string;
};

type FormValues = {
  roles: RoleOption[];
};

const createRoleOptions = (count: number): RoleOption[] =>
  Array.from({ length: Math.max(0, count) }, (_, index) => {
    const id = String(index + 1);

    return {
      key: id,
      name: `角色 ${id}`,
    };
  });

const App = () => {
  const [form] = Form.useForm<FormValues>();

  // 表单场景下，ListToTable 通过 Form.Item 接管 value 和 onChange。
  const roleOptions = useMemo(() => createRoleOptions(200), []);

  const selectedRoles = Form.useWatch('roles', form) || [];

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      initialValues={{
        roles: [roleOptions[0], roleOptions[1]],
      }}
      onFinish={(values) => {
        // eslint-disable-next-line no-console
        console.log('submit values', values);
      }}
    >
      <Form.Item
        label="角色分配"
        name="roles"
        valuePropName="value"
        trigger="onChange"
      >
        <ListToTable
          listProps={{
            dataSource: roleOptions,
            header: '待选角色',
            showSearch: true,
            placeholder: '请输入角色名称',
            checkAllText: '全选',
          }}
          tableProps={{
            columns: [
              {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
              },
            ],
            header: '已选角色',
            needReverse: true,
          }}
        />
      </Form.Item>

      <Form.Item label="当前表单值">
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          {selectedRoles.length
            ? selectedRoles.map((item) => item.name).join('、')
            : '暂无选择'}
        </Typography.Paragraph>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default memo(App);
