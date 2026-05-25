import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface FetchComponentProps {
  /** 数据请求接口 */
  fetchData: (params: Record<string, unknown>) => Promise<any>;
  /** 对fetchData返回的数据进行转换 */
  transformData?: (data: any) => any;
  /** 自定义组件 */
  component?: any;
  /** 自定义组件属性 */
  componentProps?: Record<string, any>;
  /** 对于一些下拉组件或者label和value不统一的组件，允许数据透出 */
  optionInValue?: boolean;
  /** 是否需要传递请求参数，如果需要，则只在组件接收到参数后才会发请求 */
  needFetchParam?: boolean;
  /** 请求参数 */
  fetchParams?: Record<string, any>;
  /** 请求完成后，是否选中第一个数据 */
  checkFirst?: boolean;
  /** 字段映射 */
  fieldNames?: {
    key?: string;
    name?: string;
    children?: string;
    /** 数据要用到的字段，与自定义组件关联 */
    dataSource?: string;
  };
  /** 值 */
  value?: any;
  /** 值变化回调 */
  onChange?: (...args: any[]) => void;
  /** 清空数据回调 */
  clearFn?: () => void;
  /** 初始化时是否触发onChange */
  onChangeWhileInit?: boolean;
}

export interface FetchComponentRef {
  clearDataSource: () => void;
  clearValue: () => void;
}

const FetchComponent = forwardRef<FetchComponentRef, FetchComponentProps>(
  (props, ref) => {
    const {
      fetchData,
      transformData,
      component: Comp,
      componentProps,
      needFetchParam,
      fetchParams,
      checkFirst,
      fieldNames,
      onChange,
      value,
      clearFn,
      onChangeWhileInit,
      optionInValue = false,
      ...rest
    } = props;

    const [dataSource, setDataSource] = useState([]);
    const [innerValue, setInnerValue] = useState();

    const rowKey = fieldNames?.key || 'key';
    const fieldDataSource = fieldNames?.dataSource || 'dataSource';

    const initFlag = useRef(false);

    useEffect(() => {
      setInnerValue(value);
    }, [value]);

    /** 清空数据及分页 */
    const clearDataSource = useCallback(() => {
      setDataSource([]);
    }, [setDataSource]);

    const getData = useCallback(
      (params: Record<string, any> = {}) => {
        if (needFetchParam && !fetchParams) {
          return;
        }
        try {
          fetchData({ ...(fetchParams || {}), ...params }).then((data: any) => {
            const transformedData = transformData?.(data) || data;
            setDataSource(transformedData);

            if (checkFirst && transformedData?.length) {
              const firstValidItem = transformedData.find(
                (item: any) => !item.disabled,
              );
              if (firstValidItem) {
                onChange?.(firstValidItem[rowKey], firstValidItem);
              }
            }
          });
        } catch (error) {
          console.log(error);
          // 请求失败的话，执行一遍清除操作，避免脏数据
          clearDataSource();
        }
      },
      [
        rowKey,
        needFetchParam,
        fetchParams,
        clearDataSource,
        checkFirst,
        fetchData,
        transformData,
      ],
    );

    useEffect(() => {
      getData();
    }, [getData]);

    const handleOnChange = useCallback(
      (...args: any[]) => {
        const [value, record] = args;
        if (optionInValue) {
          onChange?.(record, record);
        } else {
          onChange?.(value, record);
        }
      },
      [onChange, optionInValue],
    );

    useEffect(() => {
      if (
        onChangeWhileInit &&
        value &&
        handleOnChange &&
        dataSource.length &&
        rowKey &&
        !initFlag.current
      ) {
        const record = dataSource.find((item: any) => item[rowKey] === value);
        handleOnChange(value, record);
        initFlag.current = true;
      }
    }, [
      onChangeWhileInit,
      handleOnChange,
      value,
      initFlag,
      dataSource,
      rowKey,
    ]);

    const clearValue = useCallback(() => {
      if (clearFn) {
        clearFn();
      } else {
        setInnerValue(void 0);
      }
    }, [clearFn, setInnerValue]);

    useImperativeHandle(
      ref,
      () => ({
        clearDataSource,
        clearValue,
      }),
      [clearDataSource, clearValue],
    );

    if (!Comp) {
      return null;
    }

    return (
      <Comp
        {...rest}
        {...componentProps}
        {...{ [fieldDataSource]: dataSource }}
        onChange={handleOnChange}
        value={innerValue}
      />
    );
  },
);

export default memo(FetchComponent);
