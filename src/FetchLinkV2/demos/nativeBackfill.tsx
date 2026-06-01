import React, { useRef, useState } from 'react';
import { Alert, Button, Card, Form, Space } from 'antd';
import { FetchLinkV2 } from 'guos-components';
import type { FetchLinkRef } from '../index';
import { detailRecordMap, DetailRecord } from './sharedData';
import { formLinkConfig } from './sharedLink';

const App = () => {
  const [form] = Form.useForm();
  const [currentDetail, setCurrentDetail] = useState<DetailRecord>();
  const fetchLinkRef = useRef<FetchLinkRef>(null);

  const applyDetail = (detailId: string) => {
    const detail = detailRecordMap[detailId];
    setCurrentDetail(detail);
    form.setFieldsValue(detail);
  };

  const clearDetail = () => {
    setCurrentDetail(void 0);
    form.resetFields();
    fetchLinkRef.current?.reset();
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Alert
        type="info"
        showIcon
        message="原生回填 demo"
        description="点击按钮后只调用 form.setFieldsValue(detail)。FetchLinkV2 会直接基于传入的 form 读取当前值，自动重放 onChange 链路，并恢复隐藏项显隐与下游请求。"
      />
      <Space wrap>
        <Button onClick={() => applyDetail('zhejiang')}>回填浙江详情</Button>
        <Button onClick={() => applyDetail('jiangsu')}>回填江苏详情</Button>
        <Button onClick={() => applyDetail('guangdong')}>回填广东详情</Button>
        <Button onClick={clearDetail}>清空</Button>
      </Space>
      <Card title="详情回填数据" size="small">
        <pre style={{ margin: 0 }}>
          {JSON.stringify(currentDetail || {}, null, 2)}
        </pre>
      </Card>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
        <FetchLinkV2 ref={fetchLinkRef} form={form} config={formLinkConfig} />
        <Form.Item noStyle shouldUpdate>
          {() => (
            <Card title="表单当前值" size="small">
              <pre style={{ margin: 0 }}>
                {JSON.stringify(form.getFieldsValue(true), null, 2)}
              </pre>
            </Card>
          )}
        </Form.Item>
      </Form>
    </Space>
  );
};

export default App;
