import { Button, Modal, Table } from 'antd';
import React, { memo } from 'react';
import BaseForm from './BaseForm';

const ModalToTable = () => {
  return (
    <div>
      <div>
        <Button type="primary">新增</Button>
      </div>
      <div>
        <Table />
      </div>
      <Modal>
        <BaseForm />
      </Modal>
    </div>
  );
};

export default memo(ModalToTable);
