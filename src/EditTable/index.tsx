import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { TableProps, ColumnType, TablePaginationConfig } from 'antd/es/table';
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/es/table/interface';
import React, {
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import styles from './index.module.less';

export interface Item {
  key: string;
  disabledEdit: boolean;
  [key: string]: any;
}

export interface ColumnText {
  add?: string;
  edit?: string;
  save?: string;
  remove?: string;
  removeConfirm?: string;
  cancel?: string;
  cancelConfirm?: string;
  editingMsg?: string;
  [key: string]: string | undefined;
}

export interface EditTableProps<T>
  extends Omit<TableProps<T>, 'columns' | 'onChange'> {
  columns: EditTableColumnType<T>[];
  text?: ColumnText;
  onChange?: (
    value: any[],
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => void;
  value?: any[];
}

export interface EditTableColumnType<T> extends ColumnType<T> {
  editable?: boolean;
  dataIndex: string;
  /** 目前实际仅对Input有完整的支持，其他组件不做保证 */
  component?: any;
  componentProps?: any;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: Item;
  index: number;
  children: React.ReactNode;
  component?: any;
  componentProps?: any;
  text: ColumnText;
}

function getRandomKey(i?: number) {
  if (typeof i === 'number') {
    return new Date().valueOf() + '' + i;
  } else {
    return new Date().valueOf() + '' + Math.floor(Math.random() * 10 + 1);
  }
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  // record,
  // index,
  children,
  component,
  componentProps = {},
  text,
  ...restProps
}) => {
  const CustomNode = component ? component : Input;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `${text?.placeholderInput}${title}!`,
            },
          ]}
        >
          <CustomNode {...componentProps} />
        </Form.Item>
      ) : (
        // 如果需要支持除了Input外的其他组件，那么这里就需要向外抛出，提供自定义处理方式
        children
      )}
    </td>
  );
};

const EditTable = forwardRef<any, EditTableProps<any>>((props, ref) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { columns, text, dataSource, ...restProps } = props;

  useEffect(() => {
    if (!dataSource) {
      return;
    }
    const modifyData = [];
    const len = dataSource?.length || 0;
    for (let i = 0; i < len; i++) {
      modifyData.push({
        ...dataSource[i],
        key: getRandomKey(i),
      });
    }
    setData(modifyData);
  }, [dataSource]);

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    if (record.key === editingKey) {
      message.error(text?.editingMsg || 'Error');
    } else {
      form.setFieldsValue({ ...record });
      setEditingKey(record.key);
    }
  };

  const cancel = (record: Partial<Item> & { key: React.Key }) => {
    if (isAdding) {
      const newData = data.filter((row) => row.key !== record.key);
      setData(newData);
    }
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      setData(newData);
      setEditingKey('');
      isAdding && setIsAdding(false);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const add = (defaultValue?: Record<string, any>) => {
    if (editingKey) {
      message.error(text?.editingMsg || 'Error');
    } else {
      const key = getRandomKey();
      // const newData = {...defaultValue,originType:0} || {key,originType:0}
      const newData = defaultValue || { key, originType: 0 };
      form.resetFields();
      setIsAdding(true);
      setData((origin) => [...origin, newData]);
      setEditingKey(key);
    }
  };

  const remove = (key: React.Key) => {
    if (editingKey) {
      message.error(text?.editingMsg || 'Error');
    } else {
      const newData = data.filter((row) => row.key !== key);
      setData(newData);
    }
  };

  // 操作列
  const operations: EditTableColumnType<any> = {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    render: (_: any, record: Item) => {
      const editable = record.key === editingKey;
      return editable ? (
        <Space>
          <Typography.Link onClick={() => save(record.key)}>
            {text?.save || 'Save'}
          </Typography.Link>
          <Popconfirm
            title={text?.cancelConfirm || 'Are you sure?'}
            onConfirm={() => cancel(record)}
          >
            <Typography.Link>{text?.cancel || 'Cancel'}</Typography.Link>
          </Popconfirm>
        </Space>
      ) : (
        <Space>
          <Typography.Link
            onClick={() => edit(record)}
            disabled={record.disabledEdit}
          >
            {text?.edit || 'Edit'}
          </Typography.Link>
          <Popconfirm
            title={text?.removeConfirm || 'Are you sure?'}
            onConfirm={() => remove(record.key)}
          >
            <Typography.Link disabled={record.disabledEdit}>
              {text?.remove || 'Remove'}
            </Typography.Link>
          </Popconfirm>
        </Space>
      );
    },
  };

  const mergedColumns = [...columns, operations].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item, index: number) => {
        return {
          record,
          index,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: record.key === editingKey,
          key: editingKey,
          component: col.component,
          componentProps: col.componentProps,
          text,
        };
      },
    };
  });

  useImperativeHandle(ref, () => ({
    data,
  }));

  return (
    <Form form={form} component={false} className={styles['edit-table']}>
      <Table
        pagination={false}
        {...restProps}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        // @ts-ignore
        columns={mergedColumns}
        rowClassName="editable-row"
      />
      <div>
        <Button
          type="dashed"
          className={styles['edit-table-add']}
          onClick={() => add()}
          icon={<PlusOutlined />}
        >
          {text?.add || 'Add'}
        </Button>
      </div>
    </Form>
  );
});

export default memo(EditTable);
