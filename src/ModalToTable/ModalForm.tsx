import { Form, Input, Modal, FormInstance, ModalProps } from 'antd';
import React, { memo, useImperativeHandle, forwardRef } from 'react';
// import { EditTable } from 'guos-components';
import styles from './index.module.less';

interface ModalFormProps extends Omit<ModalProps, 'onOk'> {
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>, values: any) => void;
}

const ModalForm = forwardRef<{ form: FormInstance }, ModalFormProps>(
  (props, ref) => {
    const { onOk, onCancel, afterClose, ...restProps } = props;
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
          {
            key: new Date().valueOf() + '' + Math.floor(Math.random() * 10 + 1),
          },
          values,
        );
        onOk?.(e, newValues);
      });
    };

    const handleonCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onCancel?.(e);
    };

    return (
      <Modal
        /**
         * 为了使afterClose中的baseForm.reset()生效，需要禁止destroyOnClose
         * 如果一定要用该属性，那么请手动在onOk和onCancel中通过ref调用form.resetFields()
         */
        className={styles['modal-form']}
        destroyOnClose={false}
        {...restProps}
        onOk={handleOnOk}
        onCancel={handleonCancel}
        afterClose={() => {
          afterClose?.();
          form.resetFields();
        }}
      >
        <Form form={form} labelCol={{ span: 5 }}>
          <Form.Item name="input" label="输入框">
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
        <div>属性间的关系是“and”</div>
      </Modal>
    );
  },
);

export default memo(ModalForm);
