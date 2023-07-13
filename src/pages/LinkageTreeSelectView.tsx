import React, { useState, useEffect } from 'react';
import { Table, TableProps, Space, Form, Button, Tree, TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd';
import LinkageTreeSelect from '../components/LinkageTreeSelect';

interface TableRecord {
  managedAccount: string;
  username: string;
  dbAccount: string;
  dbName: string;
}

interface FormViewProps {}

let dbAccountKey = 0;
const createDbAccountData = (level = 1, path = 0) => {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
    const key = level === 1 ? `数据源名称${i}` : `账号${i}-${level}`;
    const treeNode: Exclude<TreeSelectProps['treeData'], undefined> extends (infer T)[]
      ? T
      : never = {
      title: key,
      key: `${dbAccountKey}`,
      value: `${dbAccountKey}`,
    };
    dbAccountKey++;

    if (level > 0) {
      treeNode.children = createDbAccountData(level - 1, path++);
    }

    list.push(treeNode);
  }
  return list;
};

let userKey = 0;
const createUserData = (level = 2, path = 0) => {
  const list = [];
  for (let i = 0; i < 20; i += 1) {
    let key = '';
    if (level === 2) key = `一级部门${i}`;
    if (level === 1) key = `二级部门${i}`;
    if (level === 0) key = `用户${i}-${level}`;
    const treeNode: Exclude<TreeSelectProps['treeData'], undefined> extends (infer T)[]
      ? T
      : never = {
      title: key,
      key: `${userKey}`,
      value: `${userKey}`,
    };
    userKey++;

    if (level > 0) {
      treeNode.children = createUserData(level - 1, path++);
    }
    list.push(treeNode);
  }
  return list;
};

const dbAccountData = createDbAccountData();
const userData = createUserData();
console.log(`当前账号以及数据源的节点数量： ${dbAccountKey}`, '====');
console.log(`当前用户以及部门的节点数量： ${userKey}`, '====');

export default () => {
  const [formData, setFormData] = useState({ dbAccount: [], username: [] });
  const [tableData, setTableData] = useState([] as any[]);
  const [filterData, setFilterData] = useState(new Map());

  useEffect(() => {
    const { dbAccount = [], username = [] } = formData;
    let res: any[] = [];
    const dbData: any[] = [];
    const uData: any[] = [];

    dbAccount.forEach((item: any) => {
      if (item.children) {
        item.children.forEach((it: any) => {
          it.parentTitle = item.title;
          dbData.push(it);
        });
      } else {
        dbData.push(item);
      }
    });
    username.forEach((item: any) => {
      if (item.children) {
        item.children.forEach((it: any) => {
          it.parentTitle = item.title;
          uData.push(it);
        });
      } else {
        uData.push(item);
      }
    });
    const dataMap = new Map();
    uData.forEach((item: any, index: number) => {
      const temp: any[] = [];
      dbData.forEach((it: any, idx: number) => {
        temp.push({
          managedAccount: `托管账号${index}-${idx}`,
          username: item.title,
          dbAccount: it.title,
          dbName: it.parentTitle,
        });
      });
      dataMap.set(item.value, temp);
      res = res.concat(temp);
    });
    setFilterData(dataMap);
    setTableData(res);
  }, [formData]);

  const tableConfig: TableProps<TableRecord> = {
    columns: [
      { title: '托管账号', dataIndex: 'managedAccount', key: 'managedAccount' },
      { title: '用户', dataIndex: 'username', key: 'username' },
      { title: '数据源账号', dataIndex: 'dbAccount', key: 'dbAccount' },
      { title: '数据源名称', dataIndex: 'dbName', key: 'dbName' },
    ],
    dataSource: tableData,
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    setFormData(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="数据源账号"
          name="dbAccount"
          rules={[{ required: true, message: '请选择数据源账号' }]}
        >
          <LinkageTreeSelect
            multiple
            treeCheckable
            treeDefaultExpandAll
            treeData={dbAccountData}
            treeCheckStrictly
            maxTagCount={10}
            placeholder="数据源账号"
          />
        </Form.Item>

        <Form.Item
          label="用户"
          name="username"
          rules={[{ required: true, message: ' 请选择用户' }]}
        >
          <LinkageTreeSelect
            multiple
            treeCheckable
            treeDefaultExpandAll
            treeData={userData}
            treeCheckStrictly
            maxTagCount={10}
            placeholder="用户"
          />
        </Form.Item>

        {/* <Form.Item
          label="用户2"
          name="username2"
          rules={[{ required: true, message: ' 请选择用户2' }]}
        >
          <TreeSelect
            multiple
            treeCheckable
            treeDefaultExpandAll
            treeData={userData}
            treeCheckStrictly
            maxTagCount={10}
            placeholder="用户2"
          />
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit">
            收集
          </Button>
        </Form.Item>
      </Form>
      <Tree treeData={formData.username} style={{ minHeight: 300 }} />
      <Table {...tableConfig} />
    </Space>
  );
};
