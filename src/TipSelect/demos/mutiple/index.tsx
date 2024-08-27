import TipSelect from 'guos-components/TipSelect/mutiple';
import React, { useEffect } from 'react';
import { Form, Button, message } from 'antd';

import { template, template2 } from './data';

function generateRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const App = () => {
  const [form] = Form.useForm();
  const data3 = Form.useWatch('data3', form);

  // 生成一个1到10位之间的随机长度的字符串
  const randomLength = Math.floor(Math.random() * 10) + 1; // 生成1到10之间的随机数
  const randomString = generateRandomString(randomLength);

  useEffect(() => {
    console.log(template, '======template');
  }, []);

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name="data" label="测试(可切换成功)">
          <TipSelect
            tooltipProps={{
              placement: 'right',
            }}
            tooltipTitle="详情"
            style={{ width: 300 }}
            options={template2}
            placeholder="请选择"
            extra={{
              origin: randomString,
            }}
          />
        </Form.Item>

        <Form.Item name="data2" label="测试(初次切换会失败)">
          <TipSelect
            tooltipProps={{
              placement: 'right',
            }}
            tooltipTitle="详情"
            style={{ width: 300 }}
            options={template}
            placeholder="请选择"
            extra={{
              origin: randomString,
            }}
            onChangeFn={() => {
              return new Promise((reslove, reject) => {
                setTimeout(() => {
                  message.error('模拟请求失败');
                  reject(1);
                }, 1000);
              });
            }}
          />
        </Form.Item>

        <Form.Item name="data3" label="测试(弹窗切换会失败)">
          <TipSelect
            tooltipProps={{
              placement: 'right',
            }}
            tooltipTitle="详情"
            style={{ width: 300 }}
            options={template}
            placeholder="请选择"
            extra={{
              origin: randomString,
            }}
            onChangeFn={() => {
              return new Promise((reslove, reject) => {
                setTimeout(() => {
                  if (!data3) {
                    message.success('数据变更成功');
                    reslove(1);
                  } else {
                    message.error('模拟请求失败');
                    reject(1);
                  }
                }, 1000);
              });
            }}
          />
        </Form.Item>
      </Form>

      <Button
        onClick={() => {
          form
            .validateFields()
            .then((values) => console.log(values, '=======submit'));
        }}
      >
        提交
      </Button>
    </>
  );
};

export default App;
