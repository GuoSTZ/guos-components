import React from 'react';
import { Button, Form, Select } from 'antd';
import { FetchLink } from 'guos-components';

interface OptionItem {
  label: string;
  value: string;
}

const provinceList: OptionItem[] = [
  { label: '浙江省', value: 'zhejiang' },
  { label: '江苏省', value: 'jiangsu' },
  { label: '广东省', value: 'guangdong' },
];

const cityMap: Record<string, OptionItem[]> = {
  zhejiang: [
    { label: '杭州市', value: 'hangzhou' },
    { label: '宁波市', value: 'ningbo' },
  ],
  jiangsu: [
    { label: '南京市', value: 'nanjing' },
    { label: '苏州市', value: 'suzhou' },
  ],
  guangdong: [
    { label: '广州市', value: 'guangzhou' },
    { label: '深圳市', value: 'shenzhen' },
  ],
};

const districtMap: Record<string, OptionItem[]> = {
  hangzhou: [
    { label: '西湖区', value: 'xihu' },
    { label: '滨江区', value: 'binjiang' },
  ],
  ningbo: [
    { label: '海曙区', value: 'haishu' },
    { label: '鄞州区', value: 'yinzhou' },
  ],
  nanjing: [
    { label: '玄武区', value: 'xuanwu' },
    { label: '秦淮区', value: 'qinhuai' },
  ],
  suzhou: [
    { label: '姑苏区', value: 'gusu' },
    { label: '吴中区', value: 'wuzhong' },
  ],
  guangzhou: [
    { label: '天河区', value: 'tianhe' },
    { label: '越秀区', value: 'yuexiu' },
  ],
  shenzhen: [
    { label: '南山区', value: 'nanshan' },
    { label: '福田区', value: 'futian' },
  ],
};

const wait = <T,>(data: T) => {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(data), 300);
  });
};

const App = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, any>) => {
    console.log(values, '提交表单=====');
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onFinish={handleFinish}
    >
      <FetchLink
        config={[
          {
            decorator: Form.Item,
            decoratorProps: {
              name: 'province',
              label: '省份',
            },
            component: Select,
            componentProps: {
              style: { width: 180 },
              placeholder: '请选择省份',
              allowClear: true,
              options: [],
            },
            fetchData: () => wait(provinceList),
            nextFetchParam: 'province',
            fieldNames: {
              key: 'value',
              dataSource: 'options',
            },
          },
          {
            decorator: Form.Item,
            decoratorProps: {
              name: 'city',
              label: '城市',
            },
            component: Select,
            componentProps: {
              style: { width: 180 },
              placeholder: '请选择城市',
              allowClear: true,
              options: [],
            },
            needFetchParam: true,
            fetchData: ({ province }) => wait(cityMap[String(province)] || []),
            nextFetchParam: 'city',
            fieldNames: {
              key: 'value',
              dataSource: 'options',
            },
          },
          {
            decorator: Form.Item,
            decoratorProps: {
              name: 'district',
              label: '区县',
            },
            component: Select,
            componentProps: {
              style: { width: 180 },
              placeholder: '请选择区县',
              allowClear: true,
              options: [],
            },
            needFetchParam: true,
            fetchData: ({ city }) => wait(districtMap[String(city)] || []),
            fieldNames: {
              key: 'value',
              dataSource: 'options',
            },
          },
        ]}
      />
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
