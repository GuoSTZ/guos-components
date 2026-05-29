import React, { useCallback, useMemo, useState } from 'react';
import { Button, Select, Tag, Typography } from 'antd';
import { FetchLinkV2, type FetchLinkV2Config } from 'guos-components';

import { detailRecordMap, OptionItem, provinceLabelMap } from './sharedData';
import {
  fieldNames,
  fetchCityList,
  fetchDistrictList,
  fetchHiddenSelectLevelOneList,
  fetchHiddenSelectLevelThreeList,
  fetchHiddenSelectLevelTwoList,
  fetchProvinceList,
  fetchStreetList,
  handleProvinceBranchChange,
  mergePrevParams,
} from './sharedLink';

type SelectionState = {
  province?: string;
  zhejiangHidden?: string;
  jiangsuHidden1?: string;
  jiangsuHidden2?: string;
  city?: string;
  district?: string;
  street?: string;
};

type FilterPanelProps = {
  name: string;
  title: string;
  children: React.ReactNode;
};

const FilterPanel = (props: FilterPanelProps) => {
  const { title, children } = props;
  return (
    <div style={{ width: 220 }}>
      <div style={{ marginBottom: 4 }}>
        <Typography.Text>{title}</Typography.Text>
      </div>
      {children}
    </div>
  );
};

const App = () => {
  const [selection, setSelection] = useState<SelectionState>({});
  const [instanceKey, setInstanceKey] = useState(0);

  const patchSelection = useCallback((patch: Partial<SelectionState>) => {
    setSelection((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const resetSelection = useCallback(() => {
    setSelection({});
    setInstanceKey((key) => key + 1);
  }, []);

  const applyZhejiang = useCallback(() => {
    setSelection(detailRecordMap.zhejiang);
  }, []);

  const applyJiangsu = useCallback(() => {
    setSelection(detailRecordMap.jiangsu);
  }, []);

  const provinceA = useMemo(
    () =>
      ({
        decorator: FilterPanel,
        decoratorProps: {
          name: 'zhejiangHidden',
          title: '浙江隐藏筛选',
        },
        component: Select,
        componentProps: {
          allowClear: true,
          placeholder: `请选择${provinceLabelMap.zhejiang}专属筛选`,
          style: { width: '100%' },
        },
        value: selection.zhejiangHidden,
        fetchData: fetchHiddenSelectLevelOneList,
        fetchParams: mergePrevParams,
        fieldNames,
        onChange: (value: string | undefined) => {
          patchSelection({
            zhejiangHidden: value,
            city: void 0,
            district: void 0,
            street: void 0,
          });
        },
      } as FetchLinkV2Config),
    [patchSelection, selection.zhejiangHidden],
  );

  const provinceB = useMemo(
    () =>
      ({
        decorator: FilterPanel,
        decoratorProps: {
          name: 'jiangsuHidden1',
          title: '江苏一级筛选',
        },
        component: Select,
        componentProps: {
          allowClear: true,
          placeholder: `请选择${provinceLabelMap.jiangsu}一级筛选`,
          style: { width: '100%' },
        },
        value: selection.jiangsuHidden1,
        fetchData: fetchHiddenSelectLevelTwoList,
        fetchParams: mergePrevParams,
        fieldNames,
        onChange: (value: string | undefined) => {
          patchSelection({
            jiangsuHidden1: value,
            jiangsuHidden2: void 0,
            city: void 0,
            district: void 0,
            street: void 0,
          });
        },
      } as FetchLinkV2Config),
    [patchSelection, selection.jiangsuHidden1],
  );

  const provinceC = useMemo(
    () =>
      ({
        decorator: FilterPanel,
        decoratorProps: {
          name: 'jiangsuHidden2',
          title: '江苏二级筛选',
        },
        component: Select,
        componentProps: {
          allowClear: true,
          placeholder: `请选择${provinceLabelMap.jiangsu}二级筛选`,
          style: { width: '100%' },
        },
        value: selection.jiangsuHidden2,
        fetchData: fetchHiddenSelectLevelThreeList,
        fetchParams: mergePrevParams,
        fieldNames,
        onChange: (value: string | undefined) => {
          patchSelection({
            jiangsuHidden2: value,
            city: void 0,
            district: void 0,
            street: void 0,
          });
        },
      } as FetchLinkV2Config),
    [patchSelection, selection.jiangsuHidden2],
  );

  const config = useMemo(
    () =>
      [
        {
          decorator: FilterPanel,
          decoratorProps: {
            name: 'province',
            title: '省份',
          },
          component: Select,
          componentProps: {
            allowClear: true,
            placeholder: '请选择省份',
            style: { width: '100%' },
          },
          value: selection.province,
          fetchData: fetchProvinceList,
          fetchParams: {
            native: 1,
          },
          fieldNames,
          onChange: (
            value: string | undefined,
            option: OptionItem,
            addConfig: (
              nextConfig: FetchLinkV2Config | FetchLinkV2Config[],
              configIndex?: number,
            ) => void,
            deleteConfig: () => void,
          ) => {
            patchSelection({
              province: value,
              zhejiangHidden: void 0,
              jiangsuHidden1: void 0,
              jiangsuHidden2: void 0,
              city: void 0,
              district: void 0,
              street: void 0,
            });

            handleProvinceBranchChange(
              option,
              provinceA,
              provinceB,
              provinceC,
              addConfig,
              deleteConfig,
            );
          },
        } as FetchLinkV2Config,
        {
          decorator: FilterPanel,
          decoratorProps: {
            name: 'city',
            title: '城市',
          },
          component: Select,
          componentProps: {
            allowClear: true,
            placeholder: '请选择城市',
            style: { width: '100%' },
          },
          value: selection.city,
          fetchData: fetchCityList,
          fetchParams: mergePrevParams,
          fieldNames,
          onChange: (value: string | undefined) => {
            patchSelection({
              city: value,
              district: void 0,
              street: void 0,
            });
          },
        } as FetchLinkV2Config,
        {
          decorator: FilterPanel,
          decoratorProps: {
            name: 'district',
            title: '区县',
          },
          component: Select,
          componentProps: {
            allowClear: true,
            placeholder: '请选择区县',
            style: { width: '100%' },
          },
          value: selection.district,
          fetchData: fetchDistrictList,
          fetchParams: mergePrevParams,
          fieldNames,
          onChange: (value: string | undefined) => {
            patchSelection({
              district: value,
              street: void 0,
            });
          },
        } as FetchLinkV2Config,
        {
          decorator: FilterPanel,
          decoratorProps: {
            name: 'street',
            title: '街道',
          },
          component: Select,
          componentProps: {
            allowClear: true,
            placeholder: '请选择街道',
            style: { width: '100%' },
          },
          value: selection.street,
          fetchData: fetchStreetList,
          fetchParams: mergePrevParams,
          fieldNames,
          onChange: (value: string | undefined) => {
            patchSelection({
              street: value,
            });
          },
        } as FetchLinkV2Config,
      ] as FetchLinkV2Config[],
    [
      patchSelection,
      provinceA,
      provinceB,
      provinceC,
      selection.city,
      selection.district,
      selection.province,
      selection.street,
    ],
  );

  const selectedTags = useMemo(
    () =>
      Object.entries(selection).filter(
        ([, value]) => value !== undefined && value !== '',
      ),
    [selection],
  );

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}
      >
        <Button onClick={applyZhejiang}>回填浙江</Button>
        <Button onClick={applyJiangsu}>回填江苏</Button>
        <Button onClick={resetSelection}>重置全部</Button>
      </div>
      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}
      >
        <Typography.Text type="secondary" style={{ lineHeight: '32px' }}>
          当前筛选：
        </Typography.Text>
        {selectedTags.length ? (
          selectedTags.map(([key, value]) => (
            <Tag key={key}>
              {key}: {String(value)}
            </Tag>
          ))
        ) : (
          <Typography.Text type="secondary" style={{ lineHeight: '32px' }}>
            未选择
          </Typography.Text>
        )}
      </div>
      <div key={instanceKey}>
        <FetchLinkV2 config={config} />
      </div>
      <pre style={{ margin: 0 }}>{JSON.stringify(selection, null, 2)}</pre>
    </div>
  );
};

export default App;
