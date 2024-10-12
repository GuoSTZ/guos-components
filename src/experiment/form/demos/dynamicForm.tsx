import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import React, { useCallback } from 'react';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const riskTypeData = [
  { label: '漏洞风险', type: null, value: 1 },
  { label: '资产风险', type: null, value: 2 },
  { label: '账号风险', type: null, value: 3 },
  { label: '行为风险', type: null, value: 4 },
  { label: '主机风险', type: null, value: 5 },
];

const riskRuleData = [
  { id: '1763148827107151872', ruleName: '黑名单访问数据库规则2' },
  { id: '1763120617422213120', ruleName: '主机账号破解感知规则1' },
  { id: '1763120607989223424', ruleName: '主机账号破解感知规则2' },
  { id: '1763120607846617088', ruleName: '主机账号破解感知规则3' },
  { id: '1826143581638565888', ruleName: '主机公网连接' },
].map((item) => ({
  label: item.ruleName,
  value: item.id,
}));

const App: React.FC = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  const RISK_TYPE_NAME = 'riskType';
  const riskType = Form.useWatch([RISK_TYPE_NAME], form);

  const getRiskRuleData = useCallback(
    (data: any = [], index: number) => {
      const selectedType = data
        ?.map((item: any) => item?.type)
        ?.filter(Boolean);
      const currentSelectedType = data?.[index]?.type;
      return riskTypeData?.filter(
        (item) =>
          !selectedType?.includes(item?.value) ||
          currentSelectedType === item.value,
      );
    },
    [riskTypeData],
  );

  return (
    <Form
      name="dynamic_form_item"
      {...formItemLayoutWithOutLabel}
      onFinish={onFinish}
      form={form}
    >
      <Form.List name={RISK_TYPE_NAME} initialValue={[{}]}>
        {(fields, { add, remove }, {}) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '风险类型' : ''}
                required={false}
                key={field.key}
                style={{ marginBottom: 0 }}
              >
                <div
                  style={{
                    display: 'flex',
                    columnGap: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'type']}
                    rules={[
                      {
                        required: true,
                        message: '请选择',
                      },
                    ]}
                    style={{ width: '20%' }}
                  >
                    <Select
                      placeholder="请选择"
                      options={getRiskRuleData(riskType, index)}
                      onChange={() => {
                        form.resetFields([
                          [RISK_TYPE_NAME, field.name, 'content'],
                        ]);
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'content']}
                    rules={[
                      {
                        required: true,
                        message: '请选择',
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Select
                      mode="multiple"
                      placeholder="请选择，可搜索"
                      options={riskRuleData}
                    />
                  </Form.Item>

                  <div style={{ display: 'flex', columnGap: 16, width: 44 }}>
                    {fields.length < 5 && index === fields.length - 1 ? (
                      <div style={{ height: 32, lineHeight: '32px' }}>
                        <PlusCircleOutlined
                          className="dynamic-add-button"
                          onClick={() => add()}
                        />
                      </div>
                    ) : null}

                    {fields.length > 1 ? (
                      <div style={{ height: 32, lineHeight: '32px' }}>
                        <DeleteOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </Form.Item>
            ))}
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
