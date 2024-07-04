import React from 'react';
import { ArrayBase } from '@formily/antd';
import { useField, Schema } from '@formily/react';
import { isValid, clone } from '@formily/shared';
import { usePrefixCls } from '@formily/antd/esm/__builtins__';
import {
  PlusOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import cls from 'classnames';

message.config({
  prefixCls: 'McFormily-ant-message',
});

const { useArray, useIndex } = ArrayBase;

const getSchemaDefaultValue = (schema: Schema): any => {
  if (schema?.type === 'array') return [];
  if (schema?.type === 'object') return {};
  if (schema?.type === 'void') {
    for (let key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        // 检查是否是对象自身的属性
        const value = getSchemaDefaultValue(schema.properties[key]);
        if (isValid(value)) return value;
      }
    }
  }
};

const getDefaultValue = (defaultValue: any, schema: Schema) => {
  if (isValid(defaultValue)) return clone(defaultValue);
  if (Array.isArray(schema?.items))
    return getSchemaDefaultValue(schema.items[0]);
  return getSchemaDefaultValue(schema.items as Schema);
};

export const ArrayBaseAddition = (props: any) => {
  const self = useField();
  const array = useArray!();
  const prefixCls = usePrefixCls('formily-array-base');
  if (!array) return null;
  if (
    array.field?.pattern !== 'editable' &&
    array.field?.pattern !== 'disabled'
  )
    return null;
  return (
    <Button
      type="dashed"
      block
      icon={<PlusOutlined />}
      {...props}
      disabled={self?.disabled}
      className={cls(`${prefixCls}-addition`, props.className)}
      onClick={(e) => {
        if (array.props?.disabled) return;
        if (
          typeof props.max === 'number' &&
          props.max <= array.field.value.length
        ) {
          message.error(props.maxMessage);
          return;
        }
        const defaultValue = getDefaultValue(props.defaultValue, array.schema);
        if (props.method === 'unshift') {
          array.field?.unshift?.(defaultValue);
          array.props?.onAdd?.(0);
        } else {
          array.field?.push?.(defaultValue);
          array.props?.onAdd?.(array?.field?.value?.length - 1);
        }
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    />
  );
};

export const ArrayBaseRemove = React.forwardRef((props: any, ref) => {
  const index = useIndex!(props.index);
  const self = useField();
  const array = useArray!();
  const prefixCls = usePrefixCls('formily-array-base');
  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;
  if (props.confirmTitle) {
    return (
      <Popconfirm
        title={props.confirmTitle}
        onConfirm={(e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
          if (self?.disabled) return;
          e?.stopPropagation();
          array.field?.remove?.(index);
          array.props?.onRemove?.(index);
          if (props.onClick) {
            props.onClick(e);
          }
        }}
      >
        <Button
          icon={<DeleteOutlined />}
          {...props}
          className={cls(
            `${prefixCls}-remove`,
            self?.disabled ? `${prefixCls}-remove-disabled` : '',
            props.className,
          )}
          ref={ref}
        />
      </Popconfirm>
    );
  }
  return (
    <Button
      icon={<DeleteOutlined />}
      {...props}
      className={cls(
        `${prefixCls}-remove`,
        self?.disabled ? `${prefixCls}-remove-disabled` : '',
        props.className,
      )}
      ref={ref}
      onClick={(e: Event) => {
        if (self?.disabled) return;
        e.stopPropagation();
        array.field?.remove?.(index);
        array.props?.onRemove?.(index);
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    />
  );
});

export const ArrayBaseMoveDown = React.forwardRef((props: any, ref) => {
  const index = useIndex!(props.index);
  const self = useField();
  const array = useArray!();
  const prefixCls = usePrefixCls('formily-array-base');
  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;
  return (
    <Button
      icon={<DownOutlined />}
      {...props}
      className={cls(
        `${prefixCls}-move-down`,
        self?.disabled ? `${prefixCls}-move-down-disabled` : '',
        props.className,
      )}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled) return;
        e.stopPropagation();
        array.field?.moveDown?.(index);
        array.props?.onMoveDown?.(index);
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    />
  );
});

export const ArrayBaseMoveUp = React.forwardRef((props: any, ref) => {
  const index = useIndex!(props.index);
  const self = useField();
  const array = useArray!();
  const prefixCls = usePrefixCls('formily-array-base');
  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;
  return (
    <Button
      icon={<UpOutlined />}
      {...props}
      className={cls(
        `${prefixCls}-move-up`,
        self?.disabled ? `${prefixCls}-move-up-disabled` : '',
        props.className,
      )}
      ref={ref}
      onClick={(e) => {
        if (self?.disabled) return;
        e.stopPropagation();
        array?.field?.moveUp(index);
        array?.props?.onMoveUp?.(index);
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    />
  );
});

export const ArrayBaseIndex = (props: any) => {
  const { render, ...restProps } = props;
  const index = useIndex!();
  const prefixCls = usePrefixCls('formily-array-base');
  return (
    <span {...restProps} className={`${prefixCls}-index`}>
      {render ? render(index) : `#${index + 1}.`}
    </span>
  );
};
