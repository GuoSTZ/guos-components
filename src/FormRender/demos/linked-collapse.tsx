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

import LinkedCollapse from './components/LinkedCollapse';
import { data } from './data/Linked-collapse';
import schema from './schema/linked-collapse.json';

const App = () => {
  const formRef = useRef<{ form: Form }>();
  const [authData, setAuthData] = useState<any[]>([]);

  const [cc, setCc] = useState<number>(1);

  useEffect(() => {
    setAuthData(data);
    formRef.current?.form?.setValuesIn('defaultFieldData', data);
    /** 这里跟编辑回填有关系，将请求的数据进行回填 */
    formRef.current?.form?.setValuesIn('dd', [
      { value: 1, content: [1, 2, 3, 6, 11, 12] },
    ]);
  }, []);

  // cc字段发生改变或者第一次获取到数据时，切换dd的数据源
  useEffect(() => {
    if (authData?.length === 0) {
      return;
    }
    const dataSource =
      authData?.find((item) => item.value === cc)?.children || [];
    formRef.current?.form?.setFieldState?.('dd', (state: any) => {
      state.componentProps.dataSource = dataSource;
      state.componentProps.defaultRadioValue = {
        1: {
          1: 11,
          6: 12,
        },
      };
    });
  }, [authData, cc, formRef.current]);

  const handleSubmit = useCallback((values: any) => {
    console.log(values);
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
          const currentField = defaultFieldData?.find(
            (item: any) => item.value === field.value,
          );
          const data = currentField?.children?.map((item: any) => ({
            value: item.value,
            content: [],
          }));
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
