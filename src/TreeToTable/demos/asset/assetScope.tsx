import { Form, Radio, RadioChangeEvent } from 'antd';
import React, {
  memo,
  useRef,
  useState,
  useMemo,
  useReducer,
  useEffect,
} from 'react';

import BaseTreeToTable from './BaseTreeToTable';
import { asset_data, db_group_data, db_type } from '../data/asset';

const reducer = (state: any, action: any) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

const AssetScope = () => {
  const form = Form.useFormInstance();
  const ref = useRef<any>(null);
  const [assetType, setAssetType] = useState<0 | 1 | 2 | 3>(1);
  // const [storedData, setStoredData] = useState<
  //   Record<number, { checkAll?: boolean; data: any[] }>
  // >({});
  const [checkAllObj, setCheckAllObj] = useState<
    Record<number, boolean | undefined>
  >({});
  const [state, dispatch] = useReducer(reducer, {});

  const i18nText = {
    header: ['待选项', '已选项'],
    operations: {
      title: '操作',
      delete: '删除',
      deleteAll: '清空',
    },
  };

  const config = useMemo(
    () => ({
      1: {
        fetchData: new Promise((reslove) => {
          reslove(asset_data);
        }),
        treeProps: {
          placeholder: '请输入数据库/资产集合组/资产集合',
        },
        tableProps: {
          columns: [
            {
              title: '资产集合',
              dataIndex: 'assetName',
              key: 'assetName',
              render: (text: string, row: Record<string, unknown>) => {
                const name =
                  row?.assetName || row?.assetGroupName || row?.dbName;
                if (text) {
                  return text;
                } else {
                  return `当前${name}下所有资产集合`;
                }
              },
              ellipsis: true,
            },
            {
              title: '数据库名称',
              dataIndex: 'dbName',
              key: 'dbName',
              ellipsis: true,
            },
          ],
          placeholder: '请输入数据库/资产集合组/资产集合',
        },
        text: i18nText,
      },
      2: {
        fetchData: new Promise((reslove) => {
          reslove(db_group_data);
        }),
        treeProps: {
          placeholder: '请输入数据库分组',
        },
        tableProps: {
          columns: [
            {
              title: '数据库分组',
              dataIndex: 'dbGroupName',
              key: 'dbGroupName',
              ellipsis: true,
              width: 200,
            },
          ],
          placeholder: '请输入数据库分组',
        },
        text: i18nText,
      },
      3: {
        fetchData: new Promise((reslove) => {
          reslove(db_type);
        }),
        treeProps: {
          placeholder: '请输入数据库类型',
        },
        tableProps: {
          columns: [
            {
              title: '数据库类型',
              dataIndex: 'label',
              key: 'label',
              ellipsis: true,
              width: 200,
            },
          ],
          placeholder: '请输入数据库类型',
        },
        text: i18nText,
      },
    }),
    [i18nText, asset_data, db_group_data, db_type],
  );

  useEffect(() => {
    form.setFieldValue('assetScope', state[assetType]?.data);
  }, [state]);

  const handleOnChange = (e: RadioChangeEvent) => {
    const currentAssetType = e.target.value;
    const data = form.getFieldValue('assetScope');
    setAssetType(currentAssetType);
    const action = {
      type: assetType,
      payload: {
        checkAll: checkAllObj[assetType],
        data: data || [],
      },
    };
    dispatch(action);
  };

  const handleOnCheckAll = (value?: boolean) => {
    setCheckAllObj((ca) => ({
      ...ca,
      [assetType]: value,
    }));
  };

  return (
    <>
      <Form.Item label="资产选择方式" name="assetType" initialValue={1}>
        <Radio.Group
          onChange={handleOnChange}
          options={[
            { label: '资产集合', value: 1 },
            { label: '数据库分组', value: 2 },
            { label: '数据库类型', value: 3 },
            { label: '全选资产集合', value: 0 },
          ]}
        />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const assetType: 1 | 2 | 3 | 0 = getFieldValue('assetType');
          if (assetType === 0) {
            return null;
          }
          const { treeProps, ...restConfig } = config[assetType];
          return (
            <Form.Item label="资产授权方式" name={'assetScope'}>
              <BaseTreeToTable
                key={assetType}
                ref={ref}
                treeProps={{
                  ...treeProps,
                  checkAll: checkAllObj[assetType],
                  onCheckAll: handleOnCheckAll,
                  checkAllText: '全选',
                }}
                onChange={() => console.log('onChange========')}
                {...restConfig}
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    </>
  );
};

export default memo(AssetScope);
