import { Button, Col, Row } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useMemo, useRef, useState } from 'react';
import schema from './schema/form_control.json';
import schema2 from './schema/form_control2.json';

const DYNAMIC_INJECT_SCHEMA: Record<string, unknown> = {
  type_1: schema,
  type_2: schema2,
};

const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);

  const [type, setType] = useState('');

  const onChange = (value: any) => {
    // 回收字段模型（该行为并不会重置表单域内字段的值）
    ref.current?.form?.clearFormGraph?.();
    setType(value);
    // 设置切换schema后，重置所有字段的值，这也包括了type字段的值
    ref.current?.form?.reset?.();
    // 当需要reset时，需要在重置后，手动设置type字段的值
    ref.current?.form?.setValuesIn?.('type', value);

    // 如果不想手动设置type字段的值，可在reset时，不对type字段做处理
    // const { type, ...otherprops } = this.form.getFormGraph();
    // ...
  };

  const schema = useMemo(
    () => ({
      form: {
        labelCol: 4,
        wrapperCol: 10,
      },
      schema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            title: '类型',
            required: true,
            enum: [
              { label: '类型1', value: 'type_1' },
              { label: '类型2', value: 'type_2' },
            ],
            'x-decorator': 'FormItem',
            'x-decorator-props': {},
            'x-component': 'Select',
            'x-component-props': {
              onChange: onChange,
              placeholder: '请选择类型',
            },
          },
          container: DYNAMIC_INJECT_SCHEMA[type],
        },
      },
    }),
    [onChange, DYNAMIC_INJECT_SCHEMA, type],
  );

  const handleSubmit = () => {
    ref.current?.form.submit().then(console.log);
  };

  return (
    <>
      <FormRender ref={ref} schema={schema} />
      <Row>
        <Col offset={schema.form.labelCol}>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default App;
