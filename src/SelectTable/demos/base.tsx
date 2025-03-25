import { Button, Form, Radio, Select } from 'antd';
import React, { useMemo, useState } from 'react';
import { SelectTable } from 'guos-components';
import { data as mockSchemaData } from './data/schema';
import { data as mockTableData } from './data/table';
import { data as mockColumnData } from './data/column';

const schemaData = new Array(50).fill(0).map((item, index) => {
  return {
    ...mockSchemaData,
    schema: `schema${index}`,
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
      disabled: item.encryptStatus === 2, // 置灰处理
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
    }, 1000);
  });
};

const tableSpaceData = new Array(3).fill(0).map((item, index) => {
  return {
    encryptStatus: 1,
    tableSpace: `tableSpace${index}`,
  };
});

const mockFetchTableSpace = (params: any) => {
  const { pageSize, current, keyword, isPage } = params;
  console.log('mockFetchTableSpace=========', params);
  // 模拟后端检索
  let data = tableSpaceData;
  if (keyword) {
    data = data.filter((item) =>
      item.tableSpace?.toLowerCase().includes(keyword?.toLowerCase()),
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
      status: item.encryptStatus,
      key: item.tableSpace,
      name: item.tableSpace,
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
    }, 1000);
  });
};

const tableData = new Array(2500).fill(0).map((item, index) => {
  const schemaIndex = Math.floor(index / 50);
  return {
    ...mockTableData,
    table: `table${index}`,
    schema: schemaData[schemaIndex].schema,
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
      disabled: item.encryptStatus === 2, // 置灰处理
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
    }, 1000);
  });
};

const columnData = new Array(125000).fill(0).map((item, index) => {
  const tableIndex = Math.floor(index / 50);
  const schemaIndex = Math.floor(tableIndex / 50);
  return {
    ...mockColumnData,
    column: `column${index}`,
    table: tableData[tableIndex].table,
    schema: schemaData[schemaIndex].schema,
  };
});

const mockFetchColumn = (params: any) => {
  const { pageSize, current, column, isPage, schema, table } = params;
  console.log('mockFetchColumn=========', params);
  // 模拟后端检索
  let data = columnData;
  // 根据schema，找出对应的table数据
  if (table && schema) {
    data = data.filter(
      (item) => item.table === table && item.schema === schema,
    );
  }
  if (column) {
    data = data.filter((item) =>
      item.column?.toLowerCase().includes(column?.toLowerCase()),
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
      disabled: item.encryptStatus === 2, // 置灰处理
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
    }, 1000);
  });
};

const App = () => {
  const [aaa, setAaa] = useState(4);
  const [needCatalog, setNeedCatalog] = useState(0);
  const [catalog, setCatalog] = useState();

  const [form] = Form.useForm();

  const leftHeader = '待选项';
  const rightHeader = '已选项';

  const commonConfig = {
    statusConfig: [
      {
        label: '已加密',
        value: 1,
        color: '#1ad999',
        background: '#ebfff5',
        borderColor: '#99ffd3',
      },
      {
        label: '不支持',
        value: 2,
        color: '#38415c',
        background: '#f7f8fa',
        borderColor: '#ced2de',
        showTip: true,
      },
    ],
  };

  const schema配置 = {
    listProps: {
      header: leftHeader,
      config: [
        {
          fetchData: mockFetchSchema,
          virtual: true,
          showSearch: {
            placeholder: '请输入schema',
          },
          fieldNames: {
            name: 'schema',
            key: 'schema',
            childCount: 'count',
            status: 'encryptStatus',
          },
          needFetchParam: !!needCatalog,
          fetchParams: needCatalog ? { catalog } : void 0,
          ...commonConfig,
        },
      ],
    },
    tableProps: {
      header: rightHeader,
      columns: [{ title: 'schema', dataIndex: 'schema', key: 'schema' }],
      rowKey: 'schema',
    },
  };

  const 表空间配置 = {
    listProps: {
      header: leftHeader,
      config: [
        {
          fetchData: mockFetchTableSpace,
          virtual: true,
          showSearch: {
            placeholder: '请输入表空间',
          },
          fieldNames: {
            name: 'tableSpace',
            key: 'tableSpace',
            childCount: 'count',
            status: 'encryptStatus',
          },
          needFetchParam: !!needCatalog,
          fetchParams: needCatalog ? { catalog } : void 0,
          ...commonConfig,
        },
      ],
    },
    tableProps: {
      header: rightHeader,
      columns: [
        { title: '表空间', dataIndex: 'tableSpace', key: 'tableSpace' },
      ],
      rowKey: 'tableSpace',
    },
  };

  const 表配置 = {
    listProps: {
      header: leftHeader,
      config: [
        {
          fetchData: mockFetchSchema,
          virtual: true,
          nextFetchParam: ['schema'],
          showSearch: {
            placeholder: '请输入schema',
          },
          checkFirst: true,
          fieldNames: {
            name: 'schema',
            key: 'schema',
            childCount: 'count',
            status: 'encryptStatus',
          },
          needFetchParam: !!needCatalog,
          fetchParams: needCatalog ? { catalog } : void 0,
          ...commonConfig,
        },
        {
          fetchData: mockFetchTable,
          showSearch: {
            placeholder: '请输入表',
          },
          fieldNames: {
            name: 'table',
            key: 'table',
            childCount: 'count',
            status: 'encryptStatus',
          },
          showCheckAll: true,
          ...commonConfig,
        },
      ],
    },
    tableProps: {
      header: rightHeader,
      columns: [
        { title: 'schema', dataIndex: 'schema', key: 'schema', width: 80 },
        { title: '表', dataIndex: 'table', key: 'table', width: 80 },
      ],
      rowKey: (record: any) => `${record.schema}-${record.table}`,
    },
  };

  const 列配置 = {
    listProps: {
      header: leftHeader,
      config: [
        {
          fetchData: mockFetchSchema,
          virtual: true,
          nextFetchParam: 'schema',
          showSearch: {
            placeholder: '请输入schema',
          },
          checkFirst: true,
          fieldNames: {
            name: 'schema',
            key: 'schema',
            childCount: 'count',
            status: 'encryptStatus',
          },
          needFetchParam: !!needCatalog,
          fetchParams: needCatalog ? { catalog } : void 0,
          ...commonConfig,
        },
        {
          fetchData: mockFetchTable,
          nextFetchParam: 'table',
          showSearch: {
            placeholder: '请输入表',
          },
          checkFirst: true,
          fieldNames: {
            name: 'table',
            key: 'table',
            childCount: 'count',
            status: 'encryptStatus',
          },
          ...commonConfig,
        },
        {
          fetchData: mockFetchColumn,
          showSearch: {
            placeholder: '请输入列',
            field: 'column',
          },
          fieldNames: {
            name: 'column',
            key: 'column',
            childCount: 'count',
            status: 'encryptStatus',
          },
          ...commonConfig,
        },
      ],
    },
    tableProps: {
      header: rightHeader,
      columns: [
        { title: 'schema', dataIndex: 'schema', key: 'schema', width: 80 },
        { title: '表', dataIndex: 'table', key: 'table', width: 80 },
        { title: '列', dataIndex: 'column', key: 'column', width: 80 },
      ],
      rowKey: (record: any) =>
        `${record.schema}-${record.table}-${record.column}`,
    },
  };

  const listConfig: Record<number, any> = useMemo(() => {
    return {
      1: null,
      2: schema配置,
      3: 表空间配置,
      4: 表配置,
      5: 列配置,
    };
  }, [schema配置, 表空间配置, 表配置, 列配置]);

  return (
    <Form onFinish={console.log} form={form}>
      <Form.Item label="aaa" name={'aaa'} initialValue={4}>
        <Radio.Group
          options={[
            { label: '整库', value: 1 },
            { label: 'schema', value: 2 },
            { label: '表空间', value: 3 },
            { label: '表', value: 4 },
            { label: '列', value: 5 },
          ]}
          onChange={(e) => {
            setAaa(e.target.value);
            // 需要手动重置bbb的值，避免切换后，上一次的数据残留
            form.resetFields(['bbb']);
          }}
        />
      </Form.Item>

      <Form.Item
        label="模拟是否存在catalog"
        name="needCatalog"
        initialValue={0}
      >
        <Radio.Group
          options={[
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ]}
          onChange={(e) => {
            setNeedCatalog(e.target.value);
            // 需要手动重置bbb的值，避免切换后，上一次的数据残留
            form.resetFields(['bbb']);
          }}
        />
      </Form.Item>

      {needCatalog === 1 && (
        <Form.Item label="catalog">
          <Select
            placeholder="请选择"
            options={[
              { label: 'catalog1', value: 'catalog1' },
              { label: 'catalog2', value: 'catalog2' },
            ]}
            onChange={(value) => setCatalog(value)}
          />
        </Form.Item>
      )}

      {aaa !== 1 ? (
        <Form.Item label="bbb" name="bbb">
          {/* 这里的key值实际只需要aaa，但是模拟了needCatalog的效果，因此也加上了 */}
          <SelectTable key={`${needCatalog}-${aaa}`} {...listConfig[aaa]} />
        </Form.Item>
      ) : null}

      <Form.Item>
        <Button htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};
export default App;
