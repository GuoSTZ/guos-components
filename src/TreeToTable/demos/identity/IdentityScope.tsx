import { Form, Radio, RadioChangeEvent } from 'antd';
import React, { memo, useCallback, useRef, useState } from 'react';

import BaseTreeToTable from './BaseTreeToTable';
import { identity_data, identity_group_data } from '../data/identity';

const AssetScope = () => {
  const form = Form.useFormInstance();
  const ref = useRef<any>(null);
  const [assetType, setAssetType] = useState<0 | 1 | 2 | 3>(1);
  const [storedData, setStoredData] = useState<
    Record<number, { checkAll?: boolean; data: any[] }>
  >({});
  const [checkAll, setCheckAll] = useState<boolean | undefined>(false);

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
            const len = identity_data.length;
            const data = [];
            // 实际上只处理了第一层数据，但也只需要处理第一层数据
            for (let i = 0; i < len; i++) {
              data.push({
                ...identity_data[i],
                checkable: identity_data[i].type !== 'parentGroup',
              });
            }
            reslove(data);
          });
        });
      }, []),
      treeProps: {
        fieldNames: {
          key: 'id',
          title: 'name',
          children: 'child',
        },
        placeholder: '请输入身份组/身份',
        titleRender: (node: any) => {
          if (node?.type === 'group') {
            return `${node?.name}(${node.child?.length})`;
          } else {
            return node?.name;
          }
        },
      },
      tableProps: {
        columns: [
          {
            title: '身份',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, row: Record<string, unknown>) => {
              if (row.type === 'user') {
                return text;
              } else {
                return `当前${text}下所有身份`;
              }
            },
            ellipsis: true,
          },
          {
            title: '身份组',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, row: Record<string, unknown>) => {
              if (row.type === 'group') {
                return text;
              } else {
                return row.pName || '';
              }
            },
            ellipsis: true,
          },
        ],
        placeholder: '请输入身份组/身份',
      },
      text: i18nText,
    },
    2: {
      fetchData: useCallback((params: Record<string, unknown>) => {
        console.log(params);
        return new Promise((reslove) => {
          setTimeout(() => {
            const len = identity_group_data.length;
            const data = [];
            // 实际上只处理了第一层数据，但也只需要处理第一层数据
            for (let i = 0; i < len; i++) {
              data.push({
                ...identity_group_data[i],
                checkable: identity_group_data[i].type !== 'parentGroup',
              });
            }
            reslove(data);
          });
        });
      }, []),
      treeProps: {
        fieldNames: {
          key: 'id',
          title: 'name',
          children: 'child',
        },
        placeholder: '请输入身份组',
      },
      tableProps: {
        columns: [
          {
            title: '身份组',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 200,
          },
        ],
        placeholder: '请输入身份组',
      },
      text: i18nText,
    },
  };

  const handleOnChange = (e: RadioChangeEvent) => {
    /** 切换的时候，存储当前组件的值，回填上一个组件的值 */
    const data = form.getFieldValue('identityScope');
    setStoredData((origin) => ({ ...origin, [assetType]: { checkAll, data } }));

    form.setFieldValue('identityType', e.target.value);
    form.setFieldValue('identityScope', storedData[e.target.value]?.data);
    setCheckAll(storedData[e.target.value]?.checkAll);

    setAssetType(e.target.value);
  };

  const handleOnCheckAll = (value?: boolean) => {
    setCheckAll(value);
  };

  const renderComp = (configId: 0 | 1 | 2 | 3) => {
    if (configId === 0) {
      return null;
    } else if (configId === 3) {
      return <div>身份属性组件</div>;
    }
    const { treeProps, ...restConfig } = config[configId];
    return (
      <Form.Item label="授权身份范围" name={'identityScope'}>
        <BaseTreeToTable
          key={configId}
          ref={ref}
          treeProps={{
            ...treeProps,
            checkAll,
            onCheckAll: handleOnCheckAll,
            checkAllText: '全选',
          }}
          {...restConfig}
        />
      </Form.Item>
    );
  };

  return (
    <>
      <Form.Item label="身份选择方式" name="identityType" initialValue={1}>
        <Radio.Group
          onChange={handleOnChange}
          options={[
            { label: '身份', value: 1 },
            { label: '身份组', value: 2 },
            { label: '自定义身份属性', value: 3 },
            { label: '全选身份组', value: 0 },
          ]}
        />
      </Form.Item>
      {renderComp(assetType)}
    </>
  );
};

export default memo(AssetScope);
