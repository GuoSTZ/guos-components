import { Form, Radio, RadioChangeEvent } from 'antd';
import React, { memo, useCallback, useState } from 'react';

import BaseTreeToTable from './BaseTreeToTable';
import { asset_data, db_group_data, db_type } from '@/data/asset';

const AssetScope = () => {
  const form = Form.useFormInstance();
  const [assetType, setAssetType] = useState<0 | 1 | 2 | 3>(1);
  const [storedData, setStoredData] = useState<Record<number, any[]>>({});

  const i18nText = {
    header: ['待选项', '已选项'],
    operations: {
      title: '操作',
      delete: '删除',
      deleteAll: '清空',
    },
  };

  const config = {
    1: {
      fetchData: useCallback((params: Record<string, unknown>) => {
        console.log(params);
        return new Promise((reslove) => {
          setTimeout(() => {
            reslove(asset_data);
          });
        });
      }, []),
      treeProps: {
        fieldNames: {
          key: 'id',
          title: 'name',
        },
        placeholder: '请输入数据库/资产集合组/资产集合',
      },
      tableProps: {
        columns: [
          {
            title: '资产集合',
            dataIndex: 'assetName',
            key: 'assetName',
            render: (text: string, row: Record<string, unknown>) => {
              const name = row?.assetName || row?.assetGroupName || row?.dbName;
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
      fetchData: useCallback((params: Record<string, unknown>) => {
        console.log(params);
        return new Promise((reslove) => {
          setTimeout(() => {
            reslove(db_group_data);
          });
        });
      }, []),
      treeProps: {
        fieldNames: {
          key: 'id',
          title: 'dbGroupName',
        },
        placeholder: '请输入数据库分组',
      },
      tableProps: {
        columns: [
          {
            title: '数据库分组',
            dataIndex: 'dbGroupName',
            key: 'dbGroupName',
            ellipsis: true,
            width: 300,
          },
        ],
        placeholder: '请输入数据库分组',
      },
      text: i18nText,
    },
    3: {
      fetchData: useCallback((params: Record<string, unknown>) => {
        console.log(params);
        return new Promise((reslove) => {
          setTimeout(() => {
            reslove(db_type);
          });
        });
      }, []),
      treeProps: {
        fieldNames: {
          key: 'id',
          title: 'label',
        },
        placeholder: '请输入数据库类型',
      },
      tableProps: {
        columns: [
          {
            title: '数据库类型',
            dataIndex: 'label',
            key: 'label',
            ellipsis: true,
            width: 300,
          },
        ],
        placeholder: '请输入数据库类型',
      },
      text: i18nText,
    },
  };

  const handleOnChange = (e: RadioChangeEvent) => {
    /** 切换资产选择方式的时候，存储当前组件的值，回填上一个组件的值 */
    const data = form.getFieldValue('assetScope');
    setStoredData((origin) => ({ ...origin, [assetType]: data }));

    form.setFieldValue('assetType', e.target.value);
    form.setFieldValue('assetScope', storedData[e.target.value]);

    setAssetType(e.target.value);
  };

  const renderComp = (configId: 0 | 1 | 2 | 3) => {
    if (configId === 0) {
      return null;
    }
    return (
      <Form.Item label="资产授权方式" name={'assetScope'}>
        <BaseTreeToTable key={configId} {...config[configId]} />
      </Form.Item>
    );
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
      {renderComp(assetType)}
    </>
  );
};

export default memo(AssetScope);
