import React, { useEffect, useMemo } from 'react';
import {
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTabs,
  ArrayTable,
  Cascader,
  Checkbox,
  DatePicker,
  Editable,
  Form,
  FormButtonGroup,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  FormStep,
  FormTab,
  Input,
  NumberPicker,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  SelectTable,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from '@formily/antd';
import {
  createForm,
  registerValidateRules,
  Form as IForm,
  onFormInit,
  onFormMount,
} from '@formily/core';
import { createSchemaField } from '@formily/react';
import { action } from '@formily/reactive';
import { Button, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import {
  ArrayBaseAddition,
  ArrayBaseRemove,
  ArrayBaseMoveDown,
  ArrayBaseMoveUp,
  ArrayBaseIndex,
} from './components/CustomArrayBaseComponent';

export interface McFormilyProps {
  /** Form 实例获取 */
  getForm?: (form: IForm<any>) => any;
  /** JSON 数据 */
  schema: any;
  /** 自定义组件 */
  components?: any;
  /** 自定义方法 */
  scope?: any;
  /** 自定义校验规则 */
  validator?: any;
  /** 副作用方式添加入口 */
  effects?: (form: IForm<any>) => void;
}

// 同步设置输入控件的数据源
const useDataSource =
  (data: any, transform: (data: any) => any) => (field: any) => {
    field.dataSource = transform ? transform(data) : data;
  };

// 异步设置输入控件的数据源
const useAsyncDataSource =
  (service: (field: any) => Promise<any>, transform: (data: any) => any) =>
  (field: any) => {
    service(field).then(
      action?.bound?.((data: any) => {
        field.dataSource = transform ? transform(data) : data;
      }),
    );
  };

// FormCollapse 组件需要使用到的属性
const useFormCollapse = (activeKey: any) =>
  FormCollapse?.createFormCollapse?.(activeKey);

const SchemaField = createSchemaField({
  components: {
    ArrayBaseAddition,
    ArrayBaseIndex,
    ArrayBaseMoveDown,
    ArrayBaseMoveUp,
    ArrayBaseRemove,
    ArrayCards,
    ArrayCollapse,
    ArrayItems,
    ArrayTabs,
    ArrayTable,
    Button,
    Cascader,
    Checkbox,
    DatePicker,
    Editable,
    FormButtonGroup,
    FormCollapse,
    FormGrid,
    FormItem,
    FormLayout,
    FormStep,
    FormTab,
    Input,
    NumberPicker,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    SelectTable,
    Space,
    Submit,
    Switch,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
  },
  scope: {
    useDataSource,
    useAsyncDataSource,
    useFormCollapse,
  },
});

const McFormily = React.forwardRef((props: McFormilyProps, ref: any) => {
  const {
    getForm,
    schema = {},
    validator,
    components,
    effects,
    ...otherProps
  } = props;

  const baseform: IForm<any> = React.useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects: () => {
          onFormInit(() => {
            // 自定义校验规则注册
            registerValidateRules(validator);
          });
          onFormMount((form: IForm<any>) => {
            getForm?.(form);
          });
        },
      }),
    [],
  );

  baseform.addEffects('customEffects', effects);

  useEffect(() => {
    return () => {
      baseform.removeEffects('customEffects');
    };
  }, []);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        form: baseform,
      };
    },
    [baseform],
  );

  // 自定义组件传出form实例
  const customComp = useMemo(() => {
    if (!components) {
      return {};
    } else {
      const customComp: any = {};
      for (let key in components) {
        if (components.hasOwnProperty(key)) {
          const Comp = components[key];
          customComp[key] = (props: any) => (
            <Comp {...props} formilyForm={baseform} />
          );
        }
      }
      return customComp;
    }
  }, [components, baseform]);

  return (
    <ConfigProvider locale={zhCN}>
      <Form form={baseform} {...(schema.form || {})}>
        <SchemaField
          {...otherProps}
          schema={schema.schema || {}}
          components={customComp}
        />
      </Form>
    </ConfigProvider>
  );
});

export default McFormily;
export {
  ArrayBaseAddition,
  ArrayBaseRemove,
  ArrayBaseMoveDown,
  ArrayBaseMoveUp,
  ArrayBaseIndex,
};
