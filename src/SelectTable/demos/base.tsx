import React from 'react';
import { SelectTable } from 'guos-components';
import { data as mockSchemaData } from './data/schema';
import { data as mockTableData } from './data/table';
import { data as mockColumnData } from './data/column';
import { Button, Form } from 'antd';

const schemaData = new Array(50).fill(0).map((item, index) => {
  return {
    ...mockSchemaData,
    schema: `schemaschemaschemaschema${index}`,
  };
});

const mockFetchSchema = (params: any) => {
  const { pageSize, current, keyword, isPage } = params;
  console.log('mockFetchSchema=========', params);
  // 模拟后端检索
  let data = schemaData;
  if (keyword) {
    data = data.filter((item) =>
      item.schema?.toLowerCase().includes(keyword?.toLowerCase()),
    );
  }
  // 模拟后端分页
  let pageData = data;
  if (isPage || isPage === undefined) {
    pageData = data.slice((current - 1) * pageSize, current * pageSize);
  }
  // 模拟前端获取接口返回数据后的数据处理流程
  let result: any[] = pageData.map((item) => {
    return {
      ...item,
      key: item.schema,
      name: item.schema,
    };
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pageSize,
        current,
        total: data.length,
        items: result,
      });
    }, 100);
  });
};

const tableData = new Array(2500).fill(0).map((item, index) => {
  const schemaIndex = Math.floor(index / 50);
  return {
    ...mockTableData,
    table: `tabletabletabletable${index}`,
    schema: `schemaschemaschemaschema${schemaIndex}`,
  };
});

const mockFetchTable = (params: any) => {
  const { pageSize, current, keyword, isPage, schema } = params;
  console.log('mockFetchTable=========', params);
  // 模拟后端检索
  let data = tableData;
  // 根据schema，找出对应的table数据
  if (schema) {
    data = data.filter((item) => item.schema === schema);
  }
  if (keyword) {
    data = data.filter((item) =>
      item.table?.toLowerCase().includes(keyword?.toLowerCase()),
    );
  }
  // 模拟后端分页
  let pageData = data;
  if (isPage || isPage === undefined) {
    pageData = data.slice((current - 1) * pageSize, current * pageSize);
  }
  // 模拟前端获取接口返回数据后的数据处理流程
  let result: any[] = pageData.map((item) => {
    return {
      ...item,
      key: item.table,
      name: item.table,
    };
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pageSize,
        current,
        total: data.length,
        items: result,
      });
    }, 100);
  });
};

const columnData = new Array(125000).fill(0).map((item, index) => {
  const tableIndex = Math.floor(index / 50);
  const schemaIndex = Math.floor(tableIndex / 50);
  return {
    ...mockColumnData,
    column: `columncolumncolumncolumn${index}`,
    table: `tabletabletabletable${tableIndex}`,
    schema: `schemaschemaschemaschema${schemaIndex}`,
  };
});

const mockFetchColumn = (params: any) => {
  const { pageSize, current, keyword, isPage, schema, table } = params;
  console.log('mockFetchColumn=========', params);
  // 模拟后端检索
  let data = columnData;
  // 根据schema，找出对应的table数据
  if (table && schema) {
    data = data.filter(
      (item) => item.table === table && item.schema === schema,
    );
  }
  if (keyword) {
    data = data.filter((item) =>
      item.table?.toLowerCase().includes(keyword?.toLowerCase()),
    );
  }
  // 模拟后端分页
  let pageData = data;
  if (isPage || isPage === undefined) {
    pageData = data.slice((current - 1) * pageSize, current * pageSize);
  }
  // 模拟前端获取接口返回数据后的数据处理流程
  let result: any[] = pageData.map((item) => {
    return {
      ...item,
      key: item.column,
      name: item.column,
    };
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pageSize,
        current,
        total: data.length,
        items: result,
      });
    }, 100);
  });
};

const App = () => {
  const listConfig = {
    header: '待选项',
    config: [
      {
        fetchData: mockFetchSchema,
        virtual: true,
        nextFetchParam: 'schema',
      },
      {
        fetchData: mockFetchTable,
        needFetchParams: true,
        nextFetchParam: 'table',
      },
      {
        fetchData: mockFetchColumn,
        checkable: true,
        needFetchParams: true,
      },
    ],
  };

  const tableConfig = {
    header: '已选项',
    columns: [
      { title: 'schema', dataIndex: 'schema', key: 'schema' },
      { title: '表', dataIndex: 'table', key: 'table' },
      { title: '列', dataIndex: 'column', key: 'column' },
    ],
    rowKey: (record: any) =>
      `${record.schema}-${record.table}-${record.column}`,
  };

  // return <SelectTable listProps={listConfig} tableProps={tableConfig} />;
  return (
    <Form onFinish={console.log}>
      <Form.Item label="aaa" name="aaa">
        <SelectTable listProps={listConfig} tableProps={tableConfig} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};
export default App;
