import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

export interface FetchComponentProps {
  /** 数据请求接口 */
  fetchData: (params: Record<string, unknown>) => Promise<any>;
  /** 自定义组件 */
  component?: any;
  /** 自定义组件属性 */
  componentProps?: Record<string, any>;
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
}

export interface FetchComponentRef {
  clearDataSource: () => void;
  clearValue: () => void;
}

const FetchComponent = forwardRef<FetchComponentRef, FetchComponentProps>(
  (props, ref) => {
    const {
      fetchData,
      component: Comp,
      componentProps,
      needFetchParam,
      fetchParams,
      checkFirst,
      fieldNames,
      onChange,
      value,
      clearFn,
      ...rest
    } = props;

    const [dataSource, setDataSource] = useState([]);
    const [innerValue, setInnerValue] = useState();

    const rowKey = fieldNames?.key || 'key';
    const fieldDataSource = fieldNames?.dataSource || 'dataSource';

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
            setDataSource(data);

            if (
              checkFirst &&
              data?.items?.length &&
              !data?.items?.[0]?.disabled
            ) {
              const firstItem = data?.items?.[0];
              onChange?.(firstItem?.[rowKey], firstItem);
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
      ],
    );

    useEffect(() => {
      getData();
    }, [getData]);

    const handleOnChange = useCallback(
      (...args: any[]) => {
        onChange?.(...args);
      },
      [onChange],
    );

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
