import React, { useMemo } from 'react';
import { Button, Form, Select } from 'antd';
import { FetchLinkV2, type FetchLinkV2Config } from 'guos-components';

interface OptionItem {
  label: string;
  value: string;
  hiddenSelect?: boolean; // 表示有一项隐藏项
  hiddenSelect2?: boolean; // 表示有两项隐藏项
}

const provinceList: OptionItem[] = [
  { label: '浙江省', value: 'zhejiang', hiddenSelect: true },
  { label: '江苏省', value: 'jiangsu', hiddenSelect2: true },
  { label: '广东省', value: 'guangdong' },
];

const cityMap: Record<string, OptionItem[]> = {
  zhejiang: [
    { label: '杭州市', value: 'hangzhou' },
    { label: '宁波市', value: 'ningbo' },
  ],
  'zhejiang-hidden-1': [{ label: '浙江隐藏项一', value: 'hangzhou' }],
  'zhejiang-hidden-2': [{ label: '浙江隐藏项二', value: 'ningbo' }],
  jiangsu: [
    { label: '南京市', value: 'nanjing' },
    { label: '苏州市', value: 'suzhou' },
  ],
  'jiangsu-hidden-1': [{ label: '江苏隐藏项一', value: 'nanjing' }],
  'jiangsu-hidden-2': [{ label: '江苏隐藏项二', value: 'suzhou' }],
  guangdong: [
    { label: '广州市', value: 'guangzhou' },
    { label: '深圳市', value: 'shenzhen' },
  ],
  'guangdong-hidden-1': [{ label: '广东隐藏项一', value: 'guangzhou' }],
  'guangdong-hidden-2': [{ label: '广东隐藏项二', value: 'shenzhen' }],
};

const hiddenSelectMap: Record<string, OptionItem[]> = {
  zhejiang: [
    { label: '浙江隐藏项一', value: 'zhejiang-hidden-1' },
    { label: '浙江隐藏项二', value: 'zhejiang-hidden-2' },
  ],
  jiangsu: [
    { label: '江苏隐藏项一', value: 'jiangsu-hidden-1' },
    { label: '江苏隐藏项二', value: 'jiangsu-hidden-2' },
  ],
  guangdong: [
    { label: '广东隐藏项一', value: 'guangdong-hidden-1' },
    { label: '广东隐藏项二', value: 'guangdong-hidden-2' },
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

const streetMap: Record<string, OptionItem[]> = {
  xihu: [
    { label: '北山街道', value: 'beishan' },
    { label: '翠苑街道', value: 'cuiyuan' },
  ],
  binjiang: [
    { label: '西兴街道', value: 'xixing' },
    { label: '长河街道', value: 'changhe' },
  ],
  haishu: [
    { label: '月湖街道', value: 'yuehu' },
    { label: '鼓楼街道', value: 'gulou' },
  ],
  yinzhou: [
    { label: '首南街道', value: 'shounan' },
    { label: '中河街道', value: 'zhonghe' },
  ],
  xuanwu: [
    { label: '梅园新村街道', value: 'meiyuanxincun' },
    { label: '新街口街道', value: 'xinjiekou' },
  ],
  qinhuai: [
    { label: '夫子庙街道', value: 'fuzimiao' },
    { label: '五老村街道', value: 'wulaocun' },
  ],
  gusu: [
    { label: '平江街道', value: 'pingjiang' },
    { label: '沧浪街道', value: 'canglang' },
  ],
  wuzhong: [
    { label: '长桥街道', value: 'changqiao' },
    { label: '越溪街道', value: 'yuexi' },
  ],
  tianhe: [
    { label: '天河南街道', value: 'tianhenan' },
    { label: '石牌街道', value: 'shipai' },
  ],
  yuexiu: [
    { label: '北京街道', value: 'beijing' },
    { label: '洪桥街道', value: 'hongqiao' },
  ],
  nanshan: [
    { label: '粤海街道', value: 'yuehai' },
    { label: '招商街道', value: 'zhaoshang' },
  ],
  futian: [
    { label: '福田街道', value: 'futianjiedao' },
    { label: '莲花街道', value: 'lianhua' },
  ],
};

const fetchProvinceList = (params: Record<string, any>) => {
  console.log(params, '省份接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(() => resolve(provinceList), 300);
  });
};

const fetchCityList = (params: Record<string, any>) => {
  console.log(params, '城市接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(() => resolve(cityMap[params.province] || []), 300);
  });
};

const fetchHiddenSelectList = (params: Record<string, any>) => {
  console.log(params, '隐藏下拉框接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(
      () => resolve(hiddenSelectMap[params.province] || []),
      300,
    );
  });
};

const fetchDistrictList = (params: Record<string, any>) => {
  console.log(params, '区县接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(() => resolve(districtMap[params.city] || []), 300);
  });
};

const fetchStreetList = (params: Record<string, any>) => {
  console.log(params, '街道接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(() => resolve(streetMap[params.district] || []), 300);
  });
};

const App = () => {
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    console.log(values, '提交表单=====');
  };

  const provinceA = useMemo(
    () => ({
      decorator: Form.Item,
      decoratorProps: {
        name: 'hiddenSelect',
        label: '隐藏下拉框',
      },
      component: Select,
      componentProps: {
        style: { width: 180 },
        placeholder: '请选择隐藏下拉框',
        allowClear: true,
        options: [],
      },
      fetchData: fetchHiddenSelectList,
      fetchParams: (
        prevFetchParams: Record<string, any>,
        prevOnChangeValue: string,
      ) => {
        return {
          ...prevFetchParams,
          province: prevOnChangeValue,
        };
      },
      fieldNames: {
        key: 'value',
        dataSource: 'options',
      },
    }),
    [],
  );

  const provinceB = useMemo(
    () => ({
      decorator: Form.Item,
      decoratorProps: {
        name: 'hiddenSelect2',
        label: '第二个隐藏下拉框',
      },
      component: Select,
      componentProps: {
        style: { width: 180 },
        placeholder: '请选择第二个隐藏下拉框',
        allowClear: true,
        options: [],
      },
      fetchData: fetchHiddenSelectList,
      fetchParams: (
        prevFetchParams: Record<string, any>,
        prevOnChangeValue: string,
      ) => {
        return {
          ...prevFetchParams,
          city: prevOnChangeValue,
        };
      },
      fieldNames: {
        key: 'value',
        dataSource: 'options',
      },
    }),
    [],
  );

  const provinceC = useMemo(
    () => ({
      decorator: Form.Item,
      decoratorProps: {
        name: 'hiddenSelect3',
        label: '第三个隐藏下拉框',
      },
      component: Select,
      componentProps: {
        style: { width: 180 },
        placeholder: '请选择第三个隐藏下拉框',
        allowClear: true,
        options: [],
      },
      fetchData: fetchHiddenSelectList,
      fetchParams: (
        prevFetchParams: Record<string, any>,
        prevOnChangeValue: string,
      ) => {
        return {
          ...prevFetchParams,
          city: prevOnChangeValue,
        };
      },
      fieldNames: {
        key: 'value',
        dataSource: 'options',
      },
    }),
    [],
  );

  const config = useMemo(
    (): FetchLinkV2Config[] => [
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
        },
        fetchData: fetchProvinceList,
        fetchParams: {
          test: 1,
        },
        fieldNames: {
          key: 'value',
          dataSource: 'options',
        },
        onChange: (
          _value: string,
          _option: Record<string, any>,
          addConfig: (
            config: FetchLinkV2Config | FetchLinkV2Config[],
            configIndex?: number,
          ) => void,
          deleteConfig: () => void,
        ) => {
          if (_option.hiddenSelect) {
            addConfig(provinceA);
          } else if (_option.hiddenSelect2) {
            addConfig([provinceB, provinceC]);
          } else {
            deleteConfig();
          }
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
        },
        fetchData: fetchCityList,
        fetchParams: (
          prevFetchParams: Record<string, any>,
          prevOnChangeValue: string,
        ) => {
          return {
            ...prevFetchParams,
            province: prevOnChangeValue,
          };
        },
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
        },
        fetchData: fetchDistrictList,
        fetchParams: (
          prevFetchParams: Record<string, any>,
          prevOnChangeValue: string,
        ) => {
          return {
            ...prevFetchParams,
            city: prevOnChangeValue,
          };
        },
        fieldNames: {
          key: 'value',
          dataSource: 'options',
        },
      },
      {
        decorator: Form.Item,
        decoratorProps: {
          name: 'street',
          label: '街道',
        },
        component: Select,
        componentProps: {
          style: { width: 180 },
          placeholder: '请选择街道',
          allowClear: true,
        },
        fetchData: fetchStreetList,
        fetchParams: (
          prevFetchParams: Record<string, any>,
          prevOnChangeValue: string,
        ) => {
          return {
            ...prevFetchParams,
            district: prevOnChangeValue,
          };
        },
        fieldNames: {
          key: 'value',
          dataSource: 'options',
        },
      },
    ],
    [provinceA, provinceB, provinceC],
  );

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onFinish={onFinish}
    >
      <FetchLinkV2 config={config} />
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
