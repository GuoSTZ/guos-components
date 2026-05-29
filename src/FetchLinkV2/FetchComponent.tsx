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
  fetchData: (params: Record<string, any>) => Promise<any>;
  /** 数据转换 */
  transformData?: (data: any) => any;
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
  onChange?: (value: any, record: any, nextInfo: ParamsForNextFetch) => void;
  /** 受控值 */
  value?: any;
  /** 清空组件状态方法，如果有特殊组件需要清空，但内部实现不支持，可自定义实现 */
  clearFn?: () => void;
  /** 外部传入的表单实例，用于同步清空字段值 */
  form?: Pick<FormInstance, 'setFieldValue'>;
}

export interface FetchComponentRef {
  clearView: () => void;
}

const isValidFetchParam = (params: Record<string, any>) => {
  const values = Object.values(params);

  return (
    values.length > 0 &&
    values.every(
      (value) => value !== undefined && value !== null && value !== '',
    )
  );
};

const isEmpty = (value: any) => {
  if (Array.isArray(value)) {
    return !value.length;
  }

  return value === undefined || value === null || value === '';
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
      clearFn,
      form,
    } = props;
    const [data, setData] = useState<any>(null);
    const [innerValue, setInnerValue] = useState<any>(void 0);
    const requestIdRef = useRef(0);

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
          return value?.map((item) =>
            data?.find((i: any) => i[fieldKey] === item),
          );
        } else {
          return data?.find((i: any) => i[fieldKey] === value);
        }
      },
      [data, fieldKey],
    );

    const triggerChange = useRefFunction((value: any, record: any) => {
      setInnerValue(value);
      let nextRecord = record || getRecordFromValue(value);
      const nextInfo = {
        params: mergedFetchParams,
        valueParams: { [name]: value },
        onChangeData: [value, nextRecord],
      };
      onChange?.(value, nextRecord, nextInfo);
    });

    const handleOnChange = useCallback(
      (...args: any[]) => {
        const [value, record] = args;
        triggerChange(value, record);
      },
      [triggerChange],
    );

    const clearView = useCallback(() => {
      setInnerValue(void 0);
      setData(null);
      // 如果有antd form实例，就清空form实例的值
      // 这里其实不太通用，只是针对antd form的兜底处理，满足常规业务使用
      // 如果是一些特殊场景，那最好是外部传入clearFn方法
      form?.setFieldValue(name, void 0);
      clearFn?.();
    }, [name, form, clearFn]);

    const getData = useCallback(() => {
      if (needFetchParam && !isValidFetchParam(mergedFetchParams)) {
        return;
      }
      clearView();
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      fetchData(mergedFetchParams)
        .then((data: any) => {
          if (requestId !== requestIdRef.current) {
            return;
          }
          const transformedData = transformData ? transformData(data) : data;
          setData(transformedData);

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
      clearView,
      triggerChange,
    ]);

    useEffect(() => {
      getData();
    }, [getData]);

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
