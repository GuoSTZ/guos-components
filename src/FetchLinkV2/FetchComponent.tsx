import { Form } from 'antd';
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

export interface FetchComponentProps {
  /** 父组件 */
  decorator?: ComponentType<any>;
  /** 父组件属性 */
  decoratorProps?: Record<string, any>;
  /** 自定义组件 */
  component: ComponentType<any>;
  /** 自定义组件属性 */
  componentProps?: Record<string, any>;
  /** 字段开启后，仅传递请求参数或请求参数变化时，才会发送请求，默认是false */
  needFetchParam?: boolean;
  /**
   * 请求参数
   * @param prevFetchParams 上一个组件请求的参数
   * @param prevOnChangeData 上一次组件抛出的数据，与组件的onChange回调参数一致
   * */
  fetchParams?:
    | Record<string, any>
    | ((
        prevFetchParams: Record<string, any>,
        ...prevOnChangeData: any[]
      ) => Record<string, any>);
  prevInfo?: {
    /** 上一个组件请求的参数 */
    params?: Record<string, any>;
    /** 上一次组件抛出的数据 */
    onChangeData?: any[];
  };
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
  /** 数据变化回调 */
  onChange?: (...args: any[]) => void;
  /** 清空组件状态方法，如果有特殊组件需要清空，但内部实现不支持，可自定义实现 */
  clearFn?: () => void;
}

export interface ParamsForNextFetch {
  params: Record<string, any>;
  onChangeData: any[];
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

const FetchComponent = forwardRef<FetchComponentRef, FetchComponentProps>(
  (props, ref) => {
    const {
      decorator: Decorator,
      decoratorProps,
      component: ChildComponent,
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
    } = props;
    const form = Form.useFormInstance();
    const [data, setData] = useState<any>(null);
    const [innerValue, setInnerValue] = useState<any>(void 0);
    const requestIdRef = useRef(0);

    const fieldKey = fieldNames?.key || 'key';
    const fieldDataSource = fieldNames?.dataSource || 'dataSource';
    const prevParams = prevInfo?.params;
    const prevOnChangeData = prevInfo?.onChangeData;

    const mergedFetchParams = useMemo(() => {
      const params =
        fetchParams instanceof Function
          ? fetchParams(prevParams || {}, ...(prevOnChangeData || []))
          : fetchParams;
      return params || {};
    }, [fetchParams, prevParams, prevOnChangeData]);

    const triggerChange = useRefFunction((...args: any[]) => {
      const nextInfo = {
        params: mergedFetchParams,
        onChangeData: args,
      };
      const [value] = args;
      setInnerValue(value);
      onChange?.(...args, nextInfo);
    });

    const handleOnChange = useCallback(
      (...args: any[]) => {
        triggerChange(...args);
      },
      [triggerChange],
    );

    const clearView = useCallback(() => {
      setInnerValue(void 0);
      setData(null);
      // 如果有antd form实例，就清空form实例的值
      // 这里其实不太通用，只是针对antd form的兜底处理，满足常规业务使用
      // 如果是一些特殊场景，那最好是外部传入clearFn方法
      form?.setFieldValue(decoratorProps?.name, void 0);
      clearFn?.();
    }, [decoratorProps?.name, form, clearFn]);

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

    const child = (
      <ChildComponent
        {...componentProps}
        {...{ [fieldDataSource]: data }}
        onChange={handleOnChange}
        value={innerValue}
      />
    );

    if (Decorator) {
      return <Decorator {...decoratorProps}>{child}</Decorator>;
    }
    return child;
  },
);

export default FetchComponent;
