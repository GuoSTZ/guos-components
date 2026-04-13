import { Button, Form, Radio, Space, Typography } from 'antd';
import React from 'react';
import { BoxSelect } from 'guos-components';

type ScheduleType = 'week' | 'month' | 'custom';

const customDataSource = [
  { label: '每2小时', value: 2 },
  { label: '每4小时', value: 4 },
  { label: '每6小时', value: 6 },
  { label: '每8小时', value: 8 },
];

const App = () => {
  const [form] = Form.useForm<{
    type: ScheduleType;
    time: Array<string | number>;
  }>();
  const scheduleType = Form.useWatch('type', form) ?? 'week';

  const handleTypeChange = () => {
    form.setFieldValue('time', []);
  };

  const renderBoxSelect = () => {
    if (scheduleType === 'custom') {
      return <BoxSelect type="custom" dataSource={customDataSource} />;
    }
    return <BoxSelect type={scheduleType} />;
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: 'week', time: [1, 3, 5] }}
      >
        <Form.Item label="周期类型" name="type">
          <Radio.Group onChange={handleTypeChange}>
            <Space size={20}>
              <Radio value="week">每周</Radio>
              <Radio value="month">每月</Radio>
              <Radio value="custom">自定义</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="执行时间"
          name="time"
          rules={[{ required: true, message: '请选择至少一个时间' }]}
        >
          {renderBoxSelect()}
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <Typography.Text type="secondary">
              当前表单值：{JSON.stringify(form.getFieldsValue())}
            </Typography.Text>
          )}
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={() => form.validateFields()}>
              校验
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
