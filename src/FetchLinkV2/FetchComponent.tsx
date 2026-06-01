import type { FormInstance } from 'antd/es/form';
import React, {
  ComponentType,
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';

import { useRefFunction } from '@/_utils/useRefFunction';

export type ParamsForNextFetch = {
  /** 上一个组件请求的参数 */
  params: Record<string, any>;
  /** 上一个组件的受控值 */
  valueParams: Record<string, any>;
  /** 上一次组件抛出的数据 */
  onChangeData: any[];
};

/**
 * 数据变化来源
 * @description manual 手动触发，external 外部触发
 */
export type ChangeSource = 'manual' | 'external';

export type ClearViewOptions = {
  /** 清空父组件值，默认是false */
  clearDecoratorValue?: boolean;
  /** 清空数据，默认是true，如果该属性设为true，那么clearValue强制为true */
  clearData?: boolean;
  /** 清空受控值，默认是true */
  clearValue?: boolean;
  /** 数据变化来源，默认是external */
  source?: ChangeSource;
};

export interface FetchComponentProps {
  /** 字段名 */
  name: string;
  /** 自定义组件 */
  component: ComponentType<any>;
  /** 自定义组件属性 */
  componentProps?: Record<string, any>;
  /** 字段开启后，仅传递请求参数或请求参数变化时，才会发送请求，默认是false */
  needFetchParam?: boolean;
  /**
   * 请求参数
   * @param prevFetchParams 上一个组件请求的参数
   * @param prevValueParams 上一个组件的受控值
   * @param prevOnChangeData 上一次组件抛出的数据，与组件的onChange回调参数一致
   * */
  fetchParams?:
    | Record<string, any>
    | ((
        prevFetchParams: Record<string, any>,
        prevValueParams: Record<string, any>,
        ...prevOnChangeData: any[]
      ) => Record<string, any>);
  prevInfo?: ParamsForNextFetch;
  /** 数据获取 */
  fetchData: (params: Record<string, any>) => Promise<any[]>;
  /** 数据转换 */
  transformData?: (data: any) => any[];
  /** 字段映射 */
  fieldNames?: {
    /** 键字段名 */
    key?: string;
    /** 数据源字段名 */
    dataSource?: string;
  };
  /** 是否选中第一个有效项 */
  checkFirst?: boolean;
  /** 数据变化回调，这里不再和组件的onChange参数一致，而是只传递value和record，做一下统一 */
  onChange?: (
    value: any,
    record: any,
    nextInfo: ParamsForNextFetch,
    source: ChangeSource,
  ) => void;
  /** 受控值 */
  value?: any;
  /** 清空组件状态方法，如果有特殊组件需要清空，但内部实现不支持，可自定义实现 */
  clearFn?: () => void;
  /** 外部传入的表单实例，用于同步清空字段值 */
  form?: Pick<FormInstance, 'setFieldValue'>;
}

export interface FetchComponentRef {
  clearView: (options?: ClearViewOptions) => void;
}

/**
 * 校验请求参数是否有效，即所有值都不为空
 * @param params 请求参数
 */
const isValidFetchParam = (params: Record<string, any>) => {
  const values = Object.values(params);

  return (
    values.length > 0 &&
    values.every(
      (value) => value !== undefined && value !== null && value !== '',
    )
  );
};

/**
 * 校验值是否为空，即 undefined、null、空字符串、空数组等
 * @param value 值
 */
const isEmpty = (value: any) => {
  if (Array.isArray(value)) {
    return !value.length;
  }

  return value === undefined || value === null || value === '';
};

const isReplayRecordReady = (value: any, record: any) => {
  if (isEmpty(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return Array.isArray(record) && record.length === value.length;
  }

  return !!record;
};

const FetchComponent = forwardRef<FetchComponentRef, FetchComponentProps>(
  (props, ref) => {
    const {
      name,
      component: Comp,
      componentProps,
      needFetchParam = false,
      fetchParams,
      fetchData,
      transformData,
      fieldNames,
      checkFirst = false,
      prevInfo,
      onChange,
      value,
      clearFn,
      form,
    } = props;
    const [data, setData] = useState<any>(null);
    const [innerValue, setInnerValue] = useState<any>(void 0);
    const dataMap = useRef<any>(new Map());
    const requestIdRef = useRef(0);
    /** 数据变化来源，表明是手动操作还是外部赋值 */
    const sourceValueRef = useRef<ChangeSource>('external');
    /** 清空时，如果保留dataSource，当value为空时，不能触发重放onChange链路 */
    const skipNextEmptyValueRef = useRef(false);

    const fieldKey = fieldNames?.key || 'key';
    const fieldDataSource = fieldNames?.dataSource || 'dataSource';
    const prevParams = prevInfo?.params;
    const prevValueParams = prevInfo?.valueParams;
    const prevOnChangeData = prevInfo?.onChangeData;

    const mergedFetchParams = useMemo(() => {
      const params =
        fetchParams instanceof Function
          ? fetchParams(
              prevParams || {},
              prevValueParams || {},
              ...(prevOnChangeData || []),
            )
          : fetchParams;
      return params || {};
    }, [fetchParams, prevParams, prevValueParams, prevOnChangeData]);

    /**
     * 根据value反推record
     */
    const getRecordFromValue = useCallback(
      (value: any) => {
        if (!data || isEmpty(value)) {
          return void 0;
        }
        if (Array.isArray(value)) {
          const result: any[] = [];
          value?.forEach((item) => {
            if (dataMap.current.has(item)) {
              result.push(dataMap.current.get(item));
            }
          });
          return result;
        } else {
          return dataMap.current.get(value);
        }
      },
      [data],
    );

    const triggerChange = useRefFunction(
      (value: any, record?: any, source: ChangeSource = 'external') => {
        sourceValueRef.current = source;
        setInnerValue(value);
        const nextRecord = record || getRecordFromValue(value);
        const nextInfo = {
          params: mergedFetchParams,
          valueParams: { [name]: value },
          onChangeData: [value, nextRecord],
        };
        onChange?.(value, nextRecord, nextInfo, source);
      },
    );

    const handleOnChange = useCallback(
      (...args: any[]) => {
        const [value, record] = args;
        triggerChange(value, record, 'manual');
      },
      [triggerChange],
    );

    const clearView = useCallback(
      (options?: ClearViewOptions) => {
        const {
          clearDecoratorValue = false,
          clearData = true,
          clearValue = true,
          source = 'external',
        } = options || {};
        requestIdRef.current += 1;
        sourceValueRef.current = source;

        const shouleClearComponentStatus = clearValue || clearData;
        if (shouleClearComponentStatus) {
          setInnerValue(void 0);
          skipNextEmptyValueRef.current = true;
        }
        if (!!clearData) {
          setData(null);
          dataMap.current.clear();
        }
        if (!!clearDecoratorValue) {
          // 如果有antd form实例，就清空form实例的值
          // 这里其实不太通用，只是针对antd form的兜底处理，满足常规业务使用
          // 如果是一些特殊场景，那最好是外部传入clearFn方法
          form?.setFieldValue(name, void 0);
          clearFn?.();
        }
      },
      [name, form, clearFn],
    );

    const getData = useCallback(() => {
      if (needFetchParam && !isValidFetchParam(mergedFetchParams)) {
        return;
      }
      setData(null);
      dataMap.current.clear();
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      fetchData(mergedFetchParams)
        .then((data: any) => {
          if (requestId !== requestIdRef.current) {
            return;
          }
          const transformedData = transformData ? transformData(data) : data;
          setData(transformedData);

          transformedData?.forEach((item: any) => {
            dataMap.current.set(item[fieldKey], item);
          });

          if (checkFirst && transformedData?.length) {
            const firstValidItem = transformedData.find(
              (item: any) => !item?.disabled,
            );
            if (firstValidItem) {
              triggerChange(firstValidItem[fieldKey], firstValidItem);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, [
      needFetchParam,
      fetchData,
      mergedFetchParams,
      transformData,
      checkFirst,
      fieldKey,
      triggerChange,
    ]);

    useEffect(() => {
      getData();
    }, [getData]);

    useEffect(() => {
      if (skipNextEmptyValueRef.current) {
        if (isEmpty(value)) {
          skipNextEmptyValueRef.current = false;
          return;
        }
        skipNextEmptyValueRef.current = false;
      }
      if (sourceValueRef.current === 'manual') {
        sourceValueRef.current = 'external';
        return;
      }
      if (!data?.length) {
        return;
      }
      // 这里现在只考虑了基础类型，后续需要将数组类型也考虑进去
      if (value === innerValue) {
        return;
      }
      const nextRecord = getRecordFromValue(value);
      if (!isReplayRecordReady(value, nextRecord)) {
        return;
      }

      triggerChange(value, nextRecord, 'external');
    }, [value, innerValue, data, getRecordFromValue]);

    useImperativeHandle(
      ref,
      () => ({
        clearView,
      }),
      [clearView],
    );

    return (
      <Comp
        {...componentProps}
        {...{ [fieldDataSource]: data }}
        onChange={handleOnChange}
        value={innerValue}
      />
    );
  },
);

export default FetchComponent;
