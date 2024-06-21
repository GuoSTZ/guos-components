import { Form, Modal, FormInstance, ModalProps, Input } from 'antd';
import React, { memo, useImperativeHandle, forwardRef } from 'react';
import styles from './index.module.less';

interface ModalFormProps extends Omit<ModalProps, 'onOk'> {
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>, values: any) => void;
  renderFormItem: (form: FormInstance) => React.ReactNode;
}

const ModalForm = forwardRef<{ form: FormInstance }, ModalFormProps>(
  (props, ref) => {
    const { onOk, onCancel, renderFormItem, ...restProps } = props;
    const [form] = Form.useForm();

    useImperativeHandle(
      ref,
      () => ({
        form,
      }),
      [form],
    );

    const handleOnOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      form.validateFields().then((values) => {
        const newValues = Object.assign(
          {},
          values,
          values.key === undefined || values.key === null
            ? {
                key:
                  new Date().valueOf() +
                  '' +
                  Math.floor(Math.random() * 10 + 1),
              }
            : {},
        );
        onOk?.(e, newValues);
      });
    };

    const handleonCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onCancel?.(e);
    };

    const afterClose = () => {
      form.resetFields();
      props?.afterClose?.();
    };

    return (
      <Modal
        className={styles['modal-form']}
        destroyOnClose
        {...restProps}
        afterClose={afterClose}
        onOk={handleOnOk}
        onCancel={handleonCancel}
      >
        <Form form={form} labelCol={{ span: 5 }}>
          <Form.Item name="key" hidden>
            <Input />
          </Form.Item>
          {renderFormItem(form)}
        </Form>
      </Modal>
    );
  },
);

export default memo(ModalForm);
