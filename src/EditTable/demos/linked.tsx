import { Button, Select } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { EditTable } from 'guos-components';
import React, { useRef } from 'react';

const commonText = {
  add: '新增',
  edit: '编辑',
  save: '保存',
  remove: '删除',
  removeConfirm: '确认删除吗？',
  cancel: '取消',
  cancelConfirm: '确认取消吗？',
  editingMsg: '当前处于编辑状态，请先保存再做其他操作',
  placeholderInput: '请输入',
};

const options = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
];

const App = () => {
  const tableRef = useRef<{
    data: Array<Record<string, unknown>>;
    form: FormInstance;
  }>();

  const tableConfig = {
    columns: [
      {
        title: '下拉框',
        dataIndex: 'select',
        width: 150,
        editable: true,
        component: ({ text }: { text: number }) =>
          options.find((item) => item.value === text)?.label || '-',
        editComponent: Select,
        editComponentProps: {
          placeholder: '请选择',
          options,
        },
        editConfig: {
          rules: [{ required: true, message: '请选择' }],
        },
      },
      {
        title: '输入框',
        dataIndex: 'input',
        editable: true,
        editComponentProps: (form: FormInstance) => {
          const select = form.getFieldValue('select');
          if (select === 1) {
            return {
              placeholder: '选项1时，禁止输入',
              disabled: true,
            };
          } else {
            return {
              placeholder: '请输入',
            };
          }
        },
        editConfig: (form: FormInstance) => {
          const select = form.getFieldValue('select');
          if (select === 1) {
            return {
              shouldUpdate: true,
            };
          } else {
            return {
              shouldUpdate: true,
              rules: [{ required: true, message: '请输入' }],
            };
          }
        },
      },
    ],
    dataSource: [],
    text: commonText,
  };

  const onClick = () => {
    tableRef.current?.form.validateFields().then(() => {
      console.log(tableRef.current?.data);
    });
  };

  return (
    <div>
      <EditTable {...tableConfig} ref={tableRef} />
      <Button type="primary" onClick={onClick} style={{ marginTop: 24 }}>
        收集数据
      </Button>
    </div>
  );
};

export default App;
