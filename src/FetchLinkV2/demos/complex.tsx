import React, { useMemo, useRef, useState } from 'react';
import { Alert, Button, Card, Form, Space, Tag } from 'antd';
import { FetchLinkV2, type FetchLinkV2Config } from 'guos-components';
import { detailRecordMap, DetailRecord, OptionItem } from './sharedData';
import {
  fetchCityList,
  fetchDistrictList,
  fetchHiddenSelectLevelOneList,
  fetchHiddenSelectLevelThreeList,
  fetchHiddenSelectLevelTwoList,
  fetchProvinceList,
  fetchStreetList,
  cityConfig,
  districtConfig,
  handleProvinceBranchChange,
  provinceAConfig,
  provinceBConfig,
  provinceCConfig,
  provinceConfig,
  streetConfig,
} from './sharedLink';

type RequestRecord = {
  id: number;
  name: string;
  params: Record<string, any>;
};

const App = () => {
  const [form] = Form.useForm();
  const [currentDetail, setCurrentDetail] = useState<DetailRecord>();
  const [requestRecords, setRequestRecords] = useState<RequestRecord[]>([]);
  const requestIdRef = useRef(0);

  const recordRequest = (name: string, params: Record<string, any>) => {
    requestIdRef.current += 1;
    console.log(`[FetchLinkV2 complex] ${name} 请求发出`, params);
    setRequestRecords((records) =>
      [
        {
          id: requestIdRef.current,
          name,
          params,
        },
        ...records,
      ].slice(0, 30),
    );
  };
  const provinceA = useMemo(
    (): FetchLinkV2Config => ({
      ...provinceAConfig,
      fetchData: (params) =>
        fetchHiddenSelectLevelOneList(params, recordRequest),
    }),
    [],
  );

  const provinceB = useMemo(
    (): FetchLinkV2Config => ({
      ...provinceBConfig,
      fetchData: (params) =>
        fetchHiddenSelectLevelTwoList(params, recordRequest),
    }),
    [],
  );

  const provinceC = useMemo(
    (): FetchLinkV2Config => ({
      ...provinceCConfig,
      fetchData: (params) =>
        fetchHiddenSelectLevelThreeList(params, recordRequest),
    }),
    [],
  );

  const config = useMemo(
    (): FetchLinkV2Config[] => [
      {
        ...provinceConfig,
        fetchData: (params) => fetchProvinceList(params, recordRequest),
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
            provinceA,
            provinceB,
            provinceC,
            addConfig,
            deleteConfig,
          );
        },
      },
      {
        ...cityConfig,
        fetchData: (params) => fetchCityList(params, recordRequest),
      },
      {
        ...districtConfig,
        fetchData: (params) => fetchDistrictList(params, recordRequest),
      },
      {
        ...streetConfig,
        fetchData: (params) => fetchStreetList(params, recordRequest),
      },
    ],
    [provinceA, provinceB, provinceC],
  );

  const applyDetail = (detailId: string) => {
    const detail = detailRecordMap[detailId];
    setCurrentDetail(detail);
    form.setFieldsValue(detail);
  };

  const applySameDetailTwice = () => {
    const detail = detailRecordMap.jiangsu;
    setCurrentDetail(detail);
    form.setFieldsValue(detail);
    window.setTimeout(() => {
      form.setFieldsValue(detail);
    }, 500);
  };

  const switchDetailQuickly = () => {
    setCurrentDetail(detailRecordMap.zhejiang);
    form.setFieldsValue(detailRecordMap.zhejiang);
    window.setTimeout(() => {
      setCurrentDetail(detailRecordMap.jiangsu);
      form.setFieldsValue(detailRecordMap.jiangsu);
    }, 120);
    window.setTimeout(() => {
      setCurrentDetail(detailRecordMap.guangdong);
      form.setFieldsValue(detailRecordMap.guangdong);
    }, 240);
  };

  const changeTopByUserLikeValue = (province: string) => {
    form.setFieldValue('province', province);
  };

  const clearDownstreamOnly = () => {
    form.setFieldsValue({
      zhejiangHidden: undefined,
      jiangsuHidden1: undefined,
      jiangsuHidden2: undefined,
      city: undefined,
      district: undefined,
      street: undefined,
    });
  };

  const resetAll = () => {
    setCurrentDetail(void 0);
    form.resetFields();
  };

  const currentValues = Form.useWatch([], form);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Alert
        type="info"
        showIcon
        message="复杂场景回填测试"
        description="用于观察原生回填、重复回填、快速切换、动态插入配置、部分回填、冲突回填、用户切换上游和下游清空时的请求次数与链路状态。"
      />

      <Card title="测试动作" size="small">
        <Space wrap>
          <Button onClick={() => applyDetail('zhejiang')}>
            回填浙江完整详情
          </Button>
          <Button onClick={() => applyDetail('jiangsu')}>
            回填江苏完整详情
          </Button>
          <Button onClick={() => applyDetail('guangdong')}>
            回填广东完整详情
          </Button>
          <Button onClick={() => applyDetail('partial')}>回填部分详情</Button>
          <Button danger onClick={() => applyDetail('conflict')}>
            回填冲突详情
          </Button>
          <Button onClick={applySameDetailTwice}>同一详情连续回填两次</Button>
          <Button onClick={switchDetailQuickly}>快速切换三条详情</Button>
          <Button onClick={() => changeTopByUserLikeValue('zhejiang')}>
            父级直接改省份为浙江
          </Button>
          <Button onClick={() => changeTopByUserLikeValue('jiangsu')}>
            父级直接改省份为江苏
          </Button>
          <Button onClick={clearDownstreamOnly}>只清空下游字段</Button>
          <Button onClick={resetAll}>重置全部</Button>
          <Button onClick={() => setRequestRecords([])}>清空请求记录</Button>
        </Space>
      </Card>

      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
        <FetchLinkV2 form={form} config={config} />
      </Form>

      <Space align="start" size={16} style={{ width: '100%' }}>
        <Card title="当前详情" size="small" style={{ flex: 1 }}>
          <pre style={{ margin: 0 }}>
            {JSON.stringify(currentDetail || {}, null, 2)}
          </pre>
        </Card>

        <Card title="表单当前值" size="small" style={{ flex: 1 }}>
          <pre style={{ margin: 0 }}>
            {JSON.stringify(currentValues || {}, null, 2)}
          </pre>
        </Card>
      </Space>

      <Card
        title={
          <Space>
            请求记录
            <Tag color="blue">{requestRecords.length}</Tag>
          </Space>
        }
        size="small"
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {requestRecords.map((record) => (
            <Card key={record.id} size="small" type="inner">
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Space>
                  <Tag color="purple">#{record.id}</Tag>
                  <Tag color="geekblue">{record.name}</Tag>
                </Space>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(record.params, null, 2)}
                </pre>
              </Space>
            </Card>
          ))}
        </Space>
      </Card>
    </Space>
  );
};

export default App;
