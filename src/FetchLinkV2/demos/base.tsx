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

const provinceLabelMap = provinceList.reduce<Record<string, string>>(
  (acc, item) => {
    acc[item.value] = item.label;
    return acc;
  },
  {},
);

const hiddenSelectLevelOneMap: Record<string, OptionItem[]> = {
  zhejiang: [
    {
      label: `${provinceLabelMap.zhejiang}专属筛选一`,
      value: 'zhejiang-hidden-1-a',
    },
    {
      label: `${provinceLabelMap.zhejiang}专属筛选二`,
      value: 'zhejiang-hidden-1-b',
    },
  ],
};

const hiddenSelectLevelTwoMap: Record<string, OptionItem[]> = {
  jiangsu: [
    {
      label: `${provinceLabelMap.jiangsu}一级筛选一`,
      value: 'jiangsu-hidden-2-a',
    },
    {
      label: `${provinceLabelMap.jiangsu}一级筛选二`,
      value: 'jiangsu-hidden-2-b',
    },
  ],
};

const hiddenSelectLevelThreeMap: Record<string, OptionItem[]> = {
  'jiangsu-hidden-2-a': [
    {
      label: `${provinceLabelMap.jiangsu}二级筛选一`,
      value: 'jiangsu-hidden-3-a',
    },
    {
      label: `${provinceLabelMap.jiangsu}二级筛选二`,
      value: 'jiangsu-hidden-3-b',
    },
  ],
  'jiangsu-hidden-2-b': [
    {
      label: `${provinceLabelMap.jiangsu}二级筛选三`,
      value: 'jiangsu-hidden-3-c',
    },
    {
      label: `${provinceLabelMap.jiangsu}二级筛选四`,
      value: 'jiangsu-hidden-3-d',
    },
  ],
};

const cityMap: Record<string, OptionItem[]> = {
  guangdong: [
    { label: '广州市', value: 'guangzhou' },
    { label: '深圳市', value: 'shenzhen' },
  ],
  'zhejiang-hidden-1-a': [
    { label: '杭州市', value: 'hangzhou' },
    { label: '绍兴市', value: 'shaoxing' },
  ],
  'zhejiang-hidden-1-b': [
    { label: '宁波市', value: 'ningbo' },
    { label: '温州市', value: 'wenzhou' },
  ],
  'jiangsu-hidden-3-a': [
    { label: '南京市', value: 'nanjing' },
    { label: '无锡市', value: 'wuxi' },
  ],
  'jiangsu-hidden-3-b': [
    { label: '常州市', value: 'changzhou' },
    { label: '苏州市', value: 'suzhou' },
  ],
  'jiangsu-hidden-3-c': [
    { label: '扬州市', value: 'yangzhou' },
    { label: '镇江市', value: 'zhenjiang' },
  ],
  'jiangsu-hidden-3-d': [
    { label: '南通市', value: 'nantong' },
    { label: '泰州市', value: 'taizhou' },
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
  shaoxing: [
    { label: '越城区', value: 'yuecheng' },
    { label: '柯桥区', value: 'keqiao' },
  ],
  wenzhou: [
    { label: '鹿城区', value: 'lucheng' },
    { label: '龙湾区', value: 'longwan' },
  ],
  nanjing: [
    { label: '玄武区', value: 'xuanwu' },
    { label: '秦淮区', value: 'qinhuai' },
  ],
  wuxi: [
    { label: '梁溪区', value: 'liangxi' },
    { label: '滨湖区', value: 'binhu' },
  ],
  changzhou: [
    { label: '天宁区', value: 'tianning' },
    { label: '钟楼区', value: 'zhonglou' },
  ],
  suzhou: [
    { label: '姑苏区', value: 'gusu' },
    { label: '吴中区', value: 'wuzhong' },
  ],
  yangzhou: [
    { label: '广陵区', value: 'guangling' },
    { label: '邗江区', value: 'hanjiang' },
  ],
  zhenjiang: [
    { label: '京口区', value: 'jingkou' },
    { label: '润州区', value: 'runzhou' },
  ],
  nantong: [
    { label: '崇川区', value: 'chongchuan' },
    { label: '通州区', value: 'tongzhou' },
  ],
  taizhou: [
    { label: '海陵区', value: 'hailing' },
    { label: '高港区', value: 'gaogang' },
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
  yuecheng: [
    { label: '塔山街道', value: 'tashan' },
    { label: '府山街道', value: 'fushan' },
  ],
  keqiao: [
    { label: '柯桥街道', value: 'keqiaojiedao' },
    { label: '华舍街道', value: 'huashe' },
  ],
  lucheng: [
    { label: '五马街道', value: 'wuma' },
    { label: '松台街道', value: 'songtai' },
  ],
  longwan: [
    { label: '永中街道', value: 'yongzhong' },
    { label: '蒲州街道', value: 'puzhou' },
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
  liangxi: [
    { label: '山北街道', value: 'shanbei' },
    { label: '扬名街道', value: 'yangming' },
  ],
  binhu: [
    { label: '河埒街道', value: 'helie' },
    { label: '蠡园街道', value: 'liyuan' },
  ],
  tianning: [
    { label: '兰陵街道', value: 'lanling' },
    { label: '雕庄街道', value: 'diaozhuang' },
  ],
  zhonglou: [
    { label: '五星街道', value: 'wuxing' },
    { label: '永红街道', value: 'yonghong' },
  ],
  wuzhong: [
    { label: '长桥街道', value: 'changqiao' },
    { label: '越溪街道', value: 'yuexi' },
  ],
  guangling: [
    { label: '文峰街道', value: 'wenfeng' },
    { label: '曲江街道', value: 'qujiang' },
  ],
  hanjiang: [
    { label: '邗上街道', value: 'hanshang' },
    { label: '蒋王街道', value: 'jiangwang' },
  ],
  jingkou: [
    { label: '正东路街道', value: 'zhengdonglu' },
    { label: '健康路街道', value: 'jiankanglu' },
  ],
  runzhou: [
    { label: '七里甸街道', value: 'qilidian' },
    { label: '金山街道', value: 'jinshan' },
  ],
  chongchuan: [
    { label: '新城桥街道', value: 'xinchengqiao' },
    { label: '学田街道', value: 'xuetian' },
  ],
  tongzhou: [
    { label: '金沙街道', value: 'jinsha' },
    { label: '兴仁镇', value: 'xingren' },
  ],
  hailing: [
    { label: '城中街道', value: 'chengzhong' },
    { label: '城东街道', value: 'chengdong' },
  ],
  gaogang: [
    { label: '口岸街道', value: 'kouan' },
    { label: '刁铺街道', value: 'diaopu' },
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
    window.setTimeout(() => resolve(cityMap[params.linkValue] || []), 300);
  });
};

const fetchHiddenSelectLevelOneList = (params: Record<string, any>) => {
  console.log(params, '一级隐藏下拉框接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(
      () => resolve(hiddenSelectLevelOneMap[params.province] || []),
      300,
    );
  });
};

const fetchHiddenSelectLevelTwoList = (params: Record<string, any>) => {
  console.log(params, '二级隐藏下拉框接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(
      () => resolve(hiddenSelectLevelTwoMap[params.province] || []),
      300,
    );
  });
};

const fetchHiddenSelectLevelThreeList = (params: Record<string, any>) => {
  console.log(params, '三级隐藏下拉框接口请求发送=====');
  return new Promise<OptionItem[]>((resolve) => {
    window.setTimeout(
      () => resolve(hiddenSelectLevelThreeMap[params.hiddenSelect2] || []),
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
        label: `${provinceLabelMap.zhejiang}专属筛选`,
      },
      component: Select,
      componentProps: {
        style: { width: 180 },
        placeholder: `请选择${provinceLabelMap.zhejiang}专属筛选`,
        allowClear: true,
        options: [],
      },
      fetchData: fetchHiddenSelectLevelOneList,
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
        label: `${provinceLabelMap.jiangsu}一级筛选`,
      },
      component: Select,
      componentProps: {
        style: { width: 180 },
        placeholder: `请选择${provinceLabelMap.jiangsu}一级筛选`,
        allowClear: true,
        options: [],
      },
      fetchData: fetchHiddenSelectLevelTwoList,
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

  const provinceC = useMemo(
    () => ({
      decorator: Form.Item,
      decoratorProps: {
        name: 'hiddenSelect3',
        label: `${provinceLabelMap.jiangsu}二级筛选`,
      },
      component: Select,
      componentProps: {
        style: { width: 180 },
        placeholder: `请选择${provinceLabelMap.jiangsu}二级筛选`,
        allowClear: true,
        options: [],
      },
      fetchData: fetchHiddenSelectLevelThreeList,
      fetchParams: (
        prevFetchParams: Record<string, any>,
        prevOnChangeValue: string,
        prevOption: OptionItem,
      ) => {
        return {
          ...prevFetchParams,
          hiddenSelect2: prevOnChangeValue,
          hiddenSelect2Label: prevOption?.label,
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
            linkValue: prevOnChangeValue,
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
