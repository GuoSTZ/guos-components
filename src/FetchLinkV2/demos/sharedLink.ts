import { Form, Select } from 'antd';
import type { FetchLinkV2Config } from 'guos-components';

import {
  cityMap,
  districtMap,
  getCityParamKey,
  hiddenSelectLevelOneMap,
  hiddenSelectLevelThreeMap,
  hiddenSelectLevelTwoMap,
  OptionItem,
  provinceLabelMap,
  provinceList,
  streetMap,
  wait,
} from './sharedData';

type LinkParams = Record<string, any>;

type RequestReporter = (name: string, params: LinkParams) => void;

export const fieldNames = {
  key: 'value',
  dataSource: 'options',
} as const;

export const mergePrevParams = (
  prevFetchParams: LinkParams,
  prevValueParams: LinkParams,
) => ({
  ...prevFetchParams,
  ...prevValueParams,
});

export const fetchProvinceList = (
  params: LinkParams,
  reportRequest?: RequestReporter,
) => {
  if (reportRequest) {
    reportRequest('省份', params);
  } else {
    console.log(params, '省份接口请求发送=====');
  }
  return wait(provinceList);
};

export const fetchHiddenSelectLevelOneList = (
  params: LinkParams,
  reportRequest?: RequestReporter,
) => {
  if (reportRequest) {
    reportRequest('一级隐藏下拉框', params);
  } else {
    console.log(params, '一级隐藏下拉框接口请求发送=====');
  }
  return wait(hiddenSelectLevelOneMap[params.province] || []);
};

export const fetchHiddenSelectLevelTwoList = (
  params: LinkParams,
  reportRequest?: RequestReporter,
) => {
  if (reportRequest) {
    reportRequest('二级隐藏下拉框', params);
  } else {
    console.log(params, '二级隐藏下拉框接口请求发送=====');
  }
  return wait(hiddenSelectLevelTwoMap[params.province] || []);
};

export const fetchHiddenSelectLevelThreeList = (
  params: LinkParams,
  reportRequest?: RequestReporter,
) => {
  if (reportRequest) {
    reportRequest('三级隐藏下拉框', params);
  } else {
    console.log(params, '三级隐藏下拉框接口请求发送=====');
  }
  return wait(hiddenSelectLevelThreeMap[params.jiangsuHidden1] || []);
};

export const fetchCityList = (
  params: LinkParams,
  reportRequest?: RequestReporter,
) => {
  if (reportRequest) {
    reportRequest('城市', params);
  } else {
    console.log(params, '城市接口请求发送=====');
  }
  return wait(cityMap[getCityParamKey(params)] || []);
};

export const fetchDistrictList = (
  params: LinkParams,
  reportRequest?: RequestReporter,
) => {
  if (reportRequest) {
    reportRequest('区县', params);
  } else {
    console.log(params, '区县接口请求发送=====');
  }
  return wait(districtMap[params.city] || []);
};

export const fetchStreetList = (
  params: LinkParams,
  reportRequest?: RequestReporter,
) => {
  if (reportRequest) {
    reportRequest('街道', params);
  } else {
    console.log(params, '街道接口请求发送=====');
  }
  return wait(streetMap[params.district] || []);
};

export const handleProvinceBranchChange = (
  option: OptionItem,
  provinceA: FetchLinkV2Config,
  provinceB: FetchLinkV2Config,
  provinceC: FetchLinkV2Config,
  addConfig: (
    config: FetchLinkV2Config | FetchLinkV2Config[],
    configIndex?: number,
  ) => void,
  deleteConfig: () => void,
) => {
  if (option?.hiddenSelect) {
    addConfig(provinceA);
    return;
  }

  if (option?.hiddenSelect2) {
    addConfig([provinceB, provinceC]);
    return;
  }

  deleteConfig();
};

export const formSelectStyle = { width: 220 };

export const provinceAConfig: FetchLinkV2Config = {
  decorator: Form.Item,
  decoratorProps: {
    name: 'zhejiangHidden',
    label: `${provinceLabelMap.zhejiang}专属筛选`,
  },
  component: Select,
  componentProps: {
    style: formSelectStyle,
    placeholder: `请选择${provinceLabelMap.zhejiang}专属筛选`,
    allowClear: true,
  },
  fetchData: fetchHiddenSelectLevelOneList,
  fetchParams: mergePrevParams,
  fieldNames,
};

export const provinceBConfig: FetchLinkV2Config = {
  decorator: Form.Item,
  decoratorProps: {
    name: 'jiangsuHidden1',
    label: `${provinceLabelMap.jiangsu}一级筛选`,
  },
  component: Select,
  componentProps: {
    style: formSelectStyle,
    placeholder: `请选择${provinceLabelMap.jiangsu}一级筛选`,
    allowClear: true,
  },
  fetchData: fetchHiddenSelectLevelTwoList,
  fetchParams: mergePrevParams,
  fieldNames,
};

export const provinceCConfig: FetchLinkV2Config = {
  decorator: Form.Item,
  decoratorProps: {
    name: 'jiangsuHidden2',
    label: `${provinceLabelMap.jiangsu}二级筛选`,
  },
  component: Select,
  componentProps: {
    style: formSelectStyle,
    placeholder: `请选择${provinceLabelMap.jiangsu}二级筛选`,
    allowClear: true,
  },
  fetchData: fetchHiddenSelectLevelThreeList,
  fetchParams: mergePrevParams,
  fieldNames,
};

export const provinceConfig: FetchLinkV2Config = {
  decorator: Form.Item,
  decoratorProps: {
    name: 'province',
    label: '省份',
  },
  component: Select,
  componentProps: {
    style: formSelectStyle,
    placeholder: '请选择省份',
    allowClear: true,
  },
  fetchData: fetchProvinceList,
  fetchParams: {
    test: 1,
  },
  fieldNames,
  onChange: (
    _value: string,
    option: OptionItem,
    addConfig: (
      config: FetchLinkV2Config | FetchLinkV2Config[],
      configIndex?: number,
    ) => void,
    deleteConfig: () => void,
  ) => {
    handleProvinceBranchChange(
      option,
      provinceAConfig,
      provinceBConfig,
      provinceCConfig,
      addConfig,
      deleteConfig,
    );
  },
};

export const cityConfig: FetchLinkV2Config = {
  decorator: Form.Item,
  decoratorProps: {
    name: 'city',
    label: '城市',
  },
  component: Select,
  componentProps: {
    style: formSelectStyle,
    placeholder: '请选择城市',
    allowClear: true,
  },
  fetchData: fetchCityList,
  fetchParams: mergePrevParams,
  fieldNames,
};

export const districtConfig: FetchLinkV2Config = {
  decorator: Form.Item,
  decoratorProps: {
    name: 'district',
    label: '区县',
  },
  component: Select,
  componentProps: {
    style: formSelectStyle,
    placeholder: '请选择区县',
    allowClear: true,
  },
  fetchData: fetchDistrictList,
  fetchParams: mergePrevParams,
  fieldNames,
};

export const streetConfig: FetchLinkV2Config = {
  decorator: Form.Item,
  decoratorProps: {
    name: 'street',
    label: '街道',
  },
  component: Select,
  componentProps: {
    style: formSelectStyle,
    placeholder: '请选择街道',
    allowClear: true,
  },
  fetchData: fetchStreetList,
  fetchParams: mergePrevParams,
  fieldNames,
};

export const formLinkConfig: FetchLinkV2Config[] = [
  provinceConfig,
  cityConfig,
  districtConfig,
  streetConfig,
];
