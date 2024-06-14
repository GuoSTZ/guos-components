import { Select } from 'antd';
import { EditTable } from 'guos-components';
import React, { useRef } from 'react';

const App = () => {
  const tableRef = useRef();
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

  const tableConfig = {
    columns: [
      {
        title: '下拉框',
        dataIndex: 'select',
        width: 150,
        editable: true,
        editComponent: Select,
        editComponentProps: {
          placeholder: '请选择',
          options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
          ],
        },
        editConfig: {
          rules: [{ required: true, message: '请选择' }],
        },
      },
      {
        title: '输入框',
        dataIndex: 'input',
        editable: true,
        editComponentProps: {
          placeholder: '请输入',
        },
        editConfig: {
          rules: [{ required: true, message: '请输入' }],
        },
      },
    ],
    dataSource: [],
    text: commonText,
  };

  return <EditTable {...tableConfig} ref={tableRef} />;
};

export default App;
