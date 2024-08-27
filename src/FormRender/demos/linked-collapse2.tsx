import { FormRender } from 'guos-components';
import {
  Form,
  onFieldChange,
} from 'guos-components/FormRender/dependencies/formilyCore';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import LinkedCollapse from './components/LinkedCollapse2';
import { data3 } from './data/Linked-collapse';
import schema from './schema/linked-collapse.json';

const dataMap: Record<number, number[]> = {
  1: [1],
  2: [1, 4],
  3: [1, 2, 3, 4, 5],
};

const dicts = {
  aa: [
    { label: '查询结果明文', value: 2 },
    { label: '查询结果脱敏', value: 3 },
  ],
};

const App = () => {
  const formRef = useRef<{ form: Form }>();
  const [authData, setAuthData] = useState<any[]>([]);

  const [cc, setCc] = useState<number>(1);

  const getChildren = useCallback(
    (value: number, action: string, dicts: Record<string, any[]>) => {
      if (value === 1 && action === 'SELECT') {
        const newOptions = dicts['aa'].map((item) => {
          return {
            ...item,
            status: item.value,
            default: item.value === 3,
          };
        });
        return {
          children: newOptions,
        };
      } else {
        return {};
      }
    },
    [],
  );

  useEffect(() => {
    const newData = data3.map((item) => ({
      ...item,
      children: item.children?.map((child) => {
        const childrenObj = getChildren(item.value, child.action, dicts);
        return {
          ...child,
          label: `${child.actionChs}(${child.action})`,
          // 针对查询做的特殊处理
          ...childrenObj,
        };
      }),
    }));
    setAuthData(newData);
    formRef.current?.form?.setValuesIn('defaultFieldData', newData);
    /** 这里跟编辑回填有关系，将请求的数据进行回填 */
    const ddValues: any = {
      1: [
        { action: 'SELECT', actionChs: '查询', status: 2, assetActionId: 1 },
        { action: 'INSERT', actionChs: '插入', status: 1, assetActionId: 2 },
        { action: 'UPDATE', actionChs: '更新', status: 0, assetActionId: 3 },
      ],
    };
    for (let key in ddValues) {
      if (ddValues.hasOwnProperty(key)) {
        ddValues[key] = ddValues[key].map((item: any) => ({
          ...item,
          label: `${item.actionChs}(${item.action})`,
        }));
      }
    }
    formRef.current?.form?.setValuesIn('dd', ddValues);
  }, []);

  // cc字段发生改变或者第一次获取到数据时，切换dd的数据源
  useEffect(() => {
    if (authData?.length === 0) {
      return;
    }
    const dataSource = authData.filter((item) =>
      dataMap[cc]?.includes(item.value),
    );
    formRef.current?.form?.setFieldState?.('dd', (state: any) => {
      state.componentProps.dataSource = dataSource;
      state.componentProps.fieldNames = {
        value: 'status',
      };
    });
  }, [authData, cc, formRef.current]);

  const handleSubmit = useCallback((values: any) => {
    console.log(values, '======提交');
  }, []);

  const scope = useMemo(() => {
    return {
      handleSubmit,
    };
  }, [handleSubmit]);

  const components = useMemo(() => {
    return {
      LinkedCollapse,
    };
  }, []);

  return (
    <FormRender
      ref={formRef}
      scope={scope}
      schema={schema}
      components={components}
      effects={() => {
        onFieldChange('cc', (field: any, form) => {
          setCc(field.value);

          const { storedData, defaultFieldData } = form.values || {};
          const data: Record<number, any[]> = {};
          defaultFieldData
            ?.filter((item: any) => dataMap[field.value]?.includes(item.value))
            ?.forEach((item: any) => {
              data[item.value] = item.children;
            });
          form.setValuesIn('dd', storedData?.[field.value] || data);
        });

        onFieldChange('dd', (field: any, form) => {
          const { cc, storedData } = form.values || {};
          form.setValuesIn('storedData', {
            ...storedData,
            [cc]: field.value,
          });
        });
      }}
    />
  );
};

export default App;
