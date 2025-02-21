import { Form, Button, Select } from 'antd';
import { FetchLink, ModalToTable } from 'guos-components';
import React, { memo, useRef } from 'react';
import { getLabel } from '@/_utils';
import { dicts } from '@/data/editTable';

const formLayout = {
  labelCol: { span: 4 },
};

const dbData = [
  { label: 'database1', value: 1, dbId: 1 },
  { label: 'database2', value: 2, dbId: 2, hasCatalog: true },
  { label: 'database3', value: 3, dbId: 3 },
];
const catalogData = [
  { label: 'catalog1', value: 'catalog1', dbId: 2 },
  { label: 'catalog2', value: 'catalog2', dbId: 2 },
  { label: 'catalog3', value: 'catalog3', dbId: 2 },
];
const schemaData = [
  { label: 'schema1', value: 'schema1', dbId: 1, schema: 'schema1' },
  { label: 'schema2', value: 'schema2', dbId: 1, schema: 'schema2' },
  { label: 'schema3', value: 'schema3', dbId: 1, schema: 'schema3' },
  { label: 'schema4', value: 'schema4', dbId: 2, schema: 'schema4' },
  { label: 'schema5', value: 'schema5', dbId: 2, schema: 'schema5' },
  { label: 'schema6', value: 'schema6', dbId: 2, schema: 'schema6' },
  { label: 'schema7', value: 'schema7', dbId: 3, schema: 'schema7' },
  { label: 'schema8', value: 'schema8', dbId: 3, schema: 'scheme8' },
  { label: 'schema9', value: 'schema9', dbId: 3, schema: 'schema9' },
];
const tableData = [
  { label: 'table1', value: 'table1', dbId: 1, schema: 'schema1' },
  { label: 'table2', value: 'table2', dbId: 1, schema: 'schema1' },
  { label: 'table3', value: 'table3', dbId: 1, schema: 'schema2' },
  { label: 'table4', value: 'table4', dbId: 1, schema: 'schema2' },
  { label: 'table5', value: 'table5', dbId: 1, schema: 'schema3' },
  { label: 'table6', value: 'table6', dbId: 1, schema: 'schema3' },
  { label: 'table7', value: 'table7', dbId: 2, schema: 'schema4' },
  { label: 'table8', value: 'table8', dbId: 2, schema: 'schema4' },
  { label: 'table9', value: 'table9', dbId: 2, schema: 'schema5' },
  { label: 'table10', value: 'table10', dbId: 2, schema: 'schema5' },
  { label: 'table11', value: 'table11', dbId: 2, schema: 'schema6' },
  { label: 'table12', value: 'table12', dbId: 2, schema: 'schema6' },
  { label: 'table13', value: 'table13', dbId: 3, schema: 'schema7' },
  { label: 'table14', value: 'table14', dbId: 3, schema: 'schema7' },
  { label: 'table15', value: 'table15', dbId: 3, schema: 'schema8' },
  { label: 'table16', value: 'table16', dbId: 3, schema: 'schema8' },
  { label: 'table17', value: 'table17', dbId: 3, schema: 'schema9' },
  { label: 'table18', value: 'table18', dbId: 3, schema: 'schema9' },
];
const columnData = [
  {
    label: 'column1',
    value: 'column1',
    dbId: 1,
    schema: 'schema1',
    table: 'table1',
  },
  {
    label: 'column2',
    value: 'column2',
    dbId: 1,
    schema: 'schema1',
    table: 'table1',
  },
  {
    label: 'column3',
    value: 'column3',
    dbId: 1,
    schema: 'schema1',
    table: 'table2',
  },
  {
    label: 'column4',
    value: 'column4',
    dbId: 1,
    schema: 'schema1',
    table: 'table2',
  },
  {
    label: 'column5',
    value: 'column5',
    dbId: 1,
    schema: 'schema2',
    table: 'table3',
  },
  {
    label: 'column6',
    value: 'column6',
    dbId: 1,
    schema: 'schema2',
    table: 'table3',
  },
  {
    label: 'column7',
    value: 'column7',
    dbId: 1,
    schema: 'schema2',
    table: 'table4',
  },
  {
    label: 'column8',
    value: 'column8',
    dbId: 1,
    schema: 'schema2',
    table: 'table4',
  },
  {
    label: 'column9',
    value: 'column9',
    dbId: 1,
    schema: 'schema3',
    table: 'table5',
  },
  {
    label: 'column10',
    value: 'column10',
    dbId: 1,
    schema: 'schema3',
    table: 'table5',
  },
  {
    label: 'column11',
    value: 'column11',
    dbId: 1,
    schema: 'schema3',
    table: 'table6',
  },
  {
    label: 'column12',
    value: 'column12',
    dbId: 1,
    schema: 'schema3',
    table: 'table6',
  },

  {
    label: 'column13',
    value: 'column13',
    dbId: 2,
    schema: 'schema4',
    table: 'table7',
  },
  {
    label: 'column14',
    value: 'column14',
    dbId: 2,
    schema: 'schema4',
    table: 'table7',
  },
  {
    label: 'column15',
    value: 'column15',
    dbId: 2,
    schema: 'schema4',
    table: 'table8',
  },
  {
    label: 'column16',
    value: 'column16',
    dbId: 2,
    schema: 'schema4',
    table: 'table8',
  },
  {
    label: 'column17',
    value: 'column17',
    dbId: 2,
    schema: 'schema5',
    table: 'table9',
  },
  {
    label: 'column18',
    value: 'column18',
    dbId: 2,
    schema: 'schema5',
    table: 'table9',
  },
  {
    label: 'column19',
    value: 'column19',
    dbId: 2,
    schema: 'schema5',
    table: 'table10',
  },
  {
    label: 'column20',
    value: 'column20',
    dbId: 2,
    schema: 'schema5',
    table: 'table10',
  },
  {
    label: 'column21',
    value: 'column21',
    dbId: 2,
    schema: 'schema6',
    table: 'table11',
  },
  {
    label: 'column22',
    value: 'column22',
    dbId: 2,
    schema: 'schema6',
    table: 'table11',
  },
  {
    label: 'column23',
    value: 'column23',
    dbId: 2,
    schema: 'schema6',
    table: 'table12',
  },
  {
    label: 'column24',
    value: 'column24',
    dbId: 2,
    schema: 'schema6',
    table: 'table12',
  },

  {
    label: 'column25',
    value: 'column25',
    dbId: 3,
    schema: 'schema7',
    table: 'table13',
  },
  {
    label: 'column26',
    value: 'column26',
    dbId: 3,
    schema: 'schema7',
    table: 'table13',
  },
  {
    label: 'column27',
    value: 'column27',
    dbId: 3,
    schema: 'schema7',
    table: 'table14',
  },
  {
    label: 'column28',
    value: 'column28',
    dbId: 3,
    schema: 'schema7',
    table: 'table14',
  },
  {
    label: 'column29',
    value: 'column29',
    dbId: 3,
    schema: 'schema8',
    table: 'table15',
  },
  {
    label: 'column30',
    value: 'column30',
    dbId: 3,
    schema: 'schema8',
    table: 'table15',
  },
  {
    label: 'column31',
    value: 'column31',
    dbId: 3,
    schema: 'schema8',
    table: 'table16',
  },
  {
    label: 'column32',
    value: 'column32',
    dbId: 3,
    schema: 'schema8',
    table: 'table16',
  },
  {
    label: 'column33',
    value: 'column33',
    dbId: 3,
    schema: 'schema9',
    table: 'table17',
  },
  {
    label: 'column34',
    value: 'column34',
    dbId: 3,
    schema: 'schema9',
    table: 'table17',
  },
  {
    label: 'column35',
    value: 'column35',
    dbId: 3,
    schema: 'schema9',
    table: 'table18',
  },
  {
    label: 'column36',
    value: 'column36',
    dbId: 3,
    schema: 'schema9',
    table: 'table18',
  },
];

const mockFetchDbData = () => {
  console.log('=========请求数据库数据');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dbData);
    }, 200);
  });
};

const mockFetchCatalogData = (params: any) => {
  const { dbId } = params;
  console.log('=========请求catalog数据', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(catalogData.filter((item) => item.dbId === dbId));
    }, 200);
  });
};
const mockFetchSchemaData = (params: any) => {
  const { dbId } = params;
  console.log('=========请求schema数据', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(schemaData.filter((item) => item.dbId === dbId));
    }, 200);
  });
};

const mockFetchTableData = (params: any) => {
  const { dbId, schema } = params;
  console.log('=========请求table数据', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        tableData.filter(
          (item) => item.dbId === dbId && item.schema === schema,
        ),
      );
    }, 200);
  });
};

const mockFetchColumnData = (params: any) => {
  const { dbId, schema, table } = params;
  console.log('=========请求column数据', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        columnData.filter(
          (item) =>
            item.dbId === dbId &&
            item.schema === schema &&
            item.table === table,
        ),
      );
    }, 200);
  });
};

const App = () => {
  const [form] = Form.useForm();
  const hasCatalog = useRef(false);

  const tableConfig = {
    columns: [
      {
        title: '属性名称',
        key: 'input',
        dataIndex: 'input',
      },
      {
        title: '属性信息',
        key: 'editTable',
        dataIndex: 'editTable',
        ellipsis: true,
        render: (text: Array<{ select: string; input: string | number }>) => {
          return text
            ?.map((item) => {
              return `${getLabel(dicts, 'idFactor', item.select)}=${
                item.input
              }`;
            })
            .join(',');
        },
      },
    ],
    operations: {
      delete: {
        renderable: false,
      },
    },
  };

  const catalogConfig = {
    fetchData: mockFetchCatalogData,
    component: Select,
    componentProps: {
      placeholder: '请选择，可搜索',
      showSearch: true,
    },
    fieldNames: {
      key: 'value',
      name: 'label',
      dataSource: 'options',
    },
    needFetchParam: true,
    nextFetchParam: 'catalog',
    decorator: Form.Item,
    decoratorProps: {
      label: 'catalog',
      name: 'catalog',
    },
  };

  const config = [
    {
      fetchData: mockFetchDbData,
      component: Select,
      componentProps: {
        placeholder: '请选择，可搜索',
        showSearch: true,
      },
      fieldNames: {
        key: 'value',
        name: 'label',
        dataSource: 'options',
      },
      nextFetchParam: ['dbId'],
      onChange: (value: any, record: any) => {
        if (record.hasCatalog && !hasCatalog.current) {
          hasCatalog.current = true;
          config.splice(1, 0, catalogConfig);
        }
        if (!record.hasCatalog && hasCatalog.current) {
          hasCatalog.current = false;
          config.splice(1, 1);
        }
      },
      decorator: Form.Item,
      decoratorProps: {
        label: '数据库',
        name: 'database',
      },
    },
    {
      fetchData: mockFetchSchemaData,
      component: Select,
      componentProps: {
        placeholder: '请选择，可搜索',
        showSearch: true,
      },
      fieldNames: {
        key: 'value',
        name: 'label',
        dataSource: 'options',
      },
      needFetchParam: true,
      nextFetchParam: ['schema'],
      decorator: Form.Item,
      decoratorProps: {
        label: 'schema',
        name: 'schema',
      },
    },
    {
      fetchData: mockFetchTableData,
      component: Select,
      componentProps: {
        placeholder: '请选择，可搜索',
        showSearch: true,
      },
      fieldNames: {
        key: 'value',
        name: 'label',
        dataSource: 'options',
      },
      needFetchParam: true,
      nextFetchParam: 'table',
      decorator: Form.Item,
      decoratorProps: {
        label: '表',
        name: 'table',
      },
    },
    {
      fetchData: mockFetchColumnData,
      component: Select,
      componentProps: {
        placeholder: '请选择，可搜索，可多选',
        showSearch: true,
        mode: 'multiple',
      },
      fieldNames: {
        key: 'value',
        name: 'label',
        dataSource: 'options',
      },
      needFetchParam: true,
      decorator: Form.Item,
      decoratorProps: {
        label: '列',
        name: 'column',
      },
    },
  ];

  const renderFormItem = () => {
    return <FetchLink config={config} />;
  };

  return (
    <Form form={form} {...formLayout} onFinish={console.log}>
      <Form.Item name="modalToTable" label="业务场景1">
        <ModalToTable
          tableProps={tableConfig}
          modalProps={{
            renderFormItem,
            okText: '确定',
            cancelText: '取消',
          }}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: formLayout.labelCol.span }}>
        <Button htmlType="submit" type="primary">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default memo(App);
