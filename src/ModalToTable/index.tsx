import { Button, Table } from 'antd';
import React, {
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';

import ModalForm from './ModalForm';
import styles from './index.module.less';
import { FormInstance } from 'antd/es/form/Form';

// const getLabel = (dicts: Record<string, Record<string, unknown>[]>, dictName: string, value: React.Key) => {
//   return dicts[dictName]?.find(item => item.value === value)?.label || '';
// }

export interface ModalToTableProps {
  onChange?: (data: any) => void;
  value?: Array<{
    key: string;
    [key: string]: any;
  }>;
  tableProps?: any;
  modalProps?: any;
  tips?: string;
}

const ModalToTable = forwardRef<any, ModalToTableProps>((props, ref) => {
  const { onChange, value, tableProps, modalProps, tips } = props;
  const modalFormRef = useRef<{
    form: FormInstance;
  }>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [modalStatus, setModalStatus] = useState<string>();

  useEffect(() => {
    if (value) {
      const data = [];
      value.forEach((item) => {
        if (item.key) {
          data.push(item);
        } else {
          data.push({
            ...item,
            key: new Date().valueOf() + '' + Math.floor(Math.random() * 10 + 1),
          });
        }
      });
      setTableData(value);
    }
  }, [value]);

  const handleOperation = (type: string, record: any) => {
    switch (type) {
      case 'edit':
        setModalOpen(true);
        setModalStatus('edit');
        modalFormRef.current?.form?.setFieldsValue(record);
        break;
      case 'delete': {
        const data = tableData.filter((item) => item.key !== record.key);
        setTableData(data);
        onChange?.(data);
        break;
      }
      default:
        break;
    }
  };

  const tableConfig = useMemo(
    () => ({
      // columns: [
      //   {
      //     title: '属性名称',
      //     key: 'name',
      //     dataIndex: 'name'
      //   },
      //   {
      //     title: '属性信息',
      //     key: 'policyValueShow',
      //     dataIndex: 'policyValueShow',
      //     ellipsis: true,
      //     render: (text: Array<{ name: string, value: string | number }>) => {
      //       return text?.map(item => {
      //         return `${getLabel(dicts, 'idFactor', item.name)}=${item.value}`;
      //       }).join(',');
      //     }
      //   },
      //   {
      //     title: '操作',
      //     width: 150,
      //     render: (_: any, record: Record<string, unknown>) => {
      //       return (
      //         <Space>
      //           <Typography.Link onClick={() => handleOperation('edit', record)}>编辑</Typography.Link>

      //           <Popconfirm
      //             title="确定删除?"
      //             onConfirm={() => handleOperation('delete', record)}
      //           >
      //             <Typography.Link>删除</Typography.Link>
      //           </Popconfirm>
      //         </Space>
      //       )
      //     }
      //   }
      // ],
      ...tableProps,
    }),
    [tableData, tableProps],
  );

  const add = () => {
    setModalOpen(true);
    setModalStatus('add');
    modalFormRef.current?.form?.setFieldsValue({});
  };

  const handleOnModalOk = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    data: any,
  ) => {
    let table;
    const idx = tableData.findIndex((item) => item.key === data.key);
    if (idx === -1) {
      table = [...tableData, data];
    } else {
      table = [
        ...tableData.slice(0, idx),
        data,
        ...tableData.slice(idx + 1, tableData.length),
      ];
    }
    setTableData(table);
    setModalOpen(false);
    onChange?.(table);
  };

  useImperativeHandle(
    ref,
    () => ({
      edit: (record: Record<string, unknown>) =>
        handleOperation('edit', record),
      delete: (record: Record<string, unknown>) =>
        handleOperation('delete', record),
    }),
    [handleOperation],
  );

  return (
    <div className={styles['modal-to-table']}>
      <div className={styles['modal-to-table-btn']}>
        <Button type="primary" ghost onClick={add}>
          新增
        </Button>
        {tips ? (
          <div className={styles['modal-to-table-tips']}>{tips}</div>
        ) : null}
      </div>
      <Table {...tableConfig} dataSource={tableData} />
      <ModalForm
        title={modalStatus === 'add' ? '新增' : '编辑'}
        width={640}
        {...modalProps}
        ref={modalFormRef}
        open={modalOpen}
        onOk={handleOnModalOk}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
});

export default memo(ModalToTable);
