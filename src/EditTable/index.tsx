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
  TablePaginationConfig,
} from 'antd';
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/es/table/interface';
import { FormInstance } from 'antd/es/form/Form';
import { TableProps, ColumnType } from 'antd/es/table';
import React, {
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react';
import styles from './index.module.less';

interface Item {
  key: string;
  disabledEdit: boolean;
  [key: string]: any;
}

interface ColumnText {
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

type TypeOfTableParams<T> = {
  pagination?: TablePaginationConfig;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<T> | SorterResult<T>[];
  extra?: TableCurrentDataSource<T>;
};

interface EditTableProps<T>
  extends Omit<TableProps<T>, 'columns' | 'onChange'> {
  columns: EditTableColumnType<T>[];
  text?: ColumnText;
  onAdd?: (values: Partial<Item> & { key: React.Key }) => void;
  onEdit?: (values: Partial<Item> & { key: React.Key }) => void;
  onCancel?: (values: Partial<Item> & { key: React.Key }) => void;
  onDelete?: (id: React.Key) => void;
  onSave?: (values: Partial<Item> & { key: React.Key }) => void;
  value?: T[];
  onChange?: (value: T[], info: TypeOfTableParams<T>) => void;
  /** 请勿手动传入该属性，仅在Form.Item包裹下会自动传入 */
  id?: string;
  // [key: string]: any;
}

interface EditTableColumnType<T> extends ColumnType<T> {
  editable?: boolean;
  dataIndex: string;
  /** 显示状态下的组件 */
  component?: any;
  componentProps?: any;
  /** 编辑状态下的组件 */
  editComponent?: any;
  editComponentProps?: any;
  editConfig?:
    | Record<string, unknown>
    | ((form: FormInstance) => Record<string, unknown>);
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  form?: FormInstance;
  editing: boolean;
  dataIndex: string;
  title: any;
  record: Item;
  index: number;
  children: React.ReactNode;
  component?: any;
  componentProps?: any;
  editComponent?: any;
  editComponentProps?: any;
  editConfig?:
    | Record<string, unknown>
    | ((form: FormInstance) => Record<string, unknown>);
  text: ColumnText;
}

const renderEditItem = (info: any) => {
  const {
    CustomEditNode,
    editComponentProps,
    editConfig,
    values,
    dataIndex,
    form,
  } = info;
  const handleEditConfig =
    typeof editConfig === 'function' ? editConfig(form) : editConfig;

  if (handleEditConfig?.shouldUpdate) {
    return (
      <Form.Item noStyle shouldUpdate={handleEditConfig?.shouldUpdate}>
        {/* @ts-ignore */}
        {(formInstance: FormInstance) => {
          const updateEditComponentProps =
            typeof editComponentProps === 'function'
              ? editComponentProps(formInstance)
              : editComponentProps;
          /** 这里的配置需要用到formInstance，所以重新执行了一次 */
          const updateEditConfig =
            typeof editConfig === 'function' ? editConfig(form) : editConfig;
          const { ...resetUpdateEditConfig } = updateEditConfig;
          return (
            <Form.Item name={dataIndex} {...resetUpdateEditConfig}>
              <CustomEditNode
                {...updateEditComponentProps}
                record={values}
                text={values?.[dataIndex]}
                form={formInstance}
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    );
  } else {
    const handleEditComponentProps =
      typeof editComponentProps === 'function'
        ? editComponentProps(form)
        : editComponentProps;
    return (
      <Form.Item style={{ margin: 0 }} {...handleEditConfig} name={dataIndex}>
        <CustomEditNode
          {...handleEditComponentProps}
          record={values}
          text={values?.[dataIndex]}
          form={form}
        />
      </Form.Item>
    );
  }
};

const EditableCell: React.FC<EditableCellProps> = ({
  form,
  editing,
  dataIndex,
  // title,
  record,
  // index,
  children,
  component,
  componentProps = {},
  editComponent,
  editComponentProps = {},
  editConfig,
  // text,
  ...restProps
}) => {
  const values = form?.getFieldsValue(true);
  const CustomNode = component ? component : () => children;
  const CustomEditNode = editComponent ? editComponent : Input;
  const handleComponentProps =
    typeof componentProps === 'function'
      ? componentProps(form)
      : componentProps;
  return (
    <td {...restProps}>
      {editing ? (
        renderEditItem({
          CustomEditNode,
          dataIndex,
          values,
          editComponentProps,
          editConfig,
          form,
        })
      ) : (
        <CustomNode
          {...handleComponentProps}
          record={record}
          text={record?.[dataIndex]}
        />
      )}
    </td>
  );
};

const EditTable = forwardRef<any, EditTableProps<any>>((props, ref) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Array<Partial<Item> & { key: React.Key }>>(
    [],
  );
  const [editingKey, setEditingKey] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tableParams, setTableParams] = useState<TypeOfTableParams<any>>({});
  const {
    columns,
    text,
    dataSource,
    onAdd,
    onCancel,
    onDelete,
    onEdit,
    onSave,
    value,
    onChange,
    ...restProps
  } = props;

  useEffect(() => {
    if (!!value) {
      setData(value || []);
    } else if (!!dataSource) {
      setData((dataSource || []) as Array<Partial<Item> & { key: React.Key }>);
    }
  }, [value, dataSource]);

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    if (editingKey) {
      message.error(text?.editingMsg || 'Error');
    } else {
      form.setFieldsValue({ ...record });
      setEditingKey(record.key);
      onEdit?.(record);
    }
  };

  const cancel = (record: Partial<Item> & { key: React.Key }) => {
    if (isAdding) {
      const newData = data.filter((row) => row.key !== record.key);
      setData(newData);
    }
    setEditingKey('');
    onCancel?.(record);
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
      onChange?.(newData, tableParams);
      onSave?.(row);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const add = (defaultValue?: Partial<Item> & { key: React.Key }) => {
    if (editingKey) {
      message.error(text?.editingMsg || 'Error');
    } else {
      const key =
        new Date().valueOf() + '' + Math.floor(Math.random() * 10 + 1);
      const newData = defaultValue || { key };
      form.resetFields();
      setIsAdding(true);
      setData((origin) => [...origin, newData]);
      setEditingKey(key);
      onAdd?.(newData);
    }
  };

  const remove = (key: React.Key) => {
    if (editingKey) {
      message.error(text?.editingMsg || 'Error');
    } else {
      const newData = data.filter((row) => row.key !== key);
      setData(newData);
      onDelete?.(key);
      onChange?.(newData, tableParams);
    }
  };

  // 操作列
  const operations: EditTableColumnType<any> = {
    title: '操作',
    dataIndex: 'operation',
    width: 120,
    render: (_: any, record: Item) => {
      const editing = record.key === editingKey;
      return editing ? (
        <Space className={styles['edit-table-operation-editing']}>
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
          form,
          record,
          index,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: record.key === editingKey,
          key: editingKey,
          component: col.component,
          componentProps: col.componentProps,
          editComponent: col.editComponent,
          editComponentProps: col.editComponentProps,
          editConfig: col.editConfig,
          text,
        };
      },
    };
  });

  const tableOnChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<any> | SorterResult<any>[],
      extra: TableCurrentDataSource<any>,
    ) => {
      onChange?.(data, { pagination, filters, sorter, extra });
      setTableParams({ pagination, filters, sorter, extra });
    },
    [data],
  );

  useImperativeHandle(
    ref,
    () => ({
      data,
      form,
      isEditing: !!editingKey,
    }),
    [data, form, editingKey],
  );

  return (
    <Form form={form} component={false}>
      <Table
        pagination={false}
        {...restProps}
        onChange={tableOnChange}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        // @ts-ignore
        columns={mergedColumns}
        rowClassName={styles['edit-table-row']}
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
