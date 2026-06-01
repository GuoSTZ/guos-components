import type { FormInstance } from 'antd/es/form';
import React, {
  forwardRef,
  memo,
  useMemo,
  useCallback,
  useReducer,
  useRef,
  useEffect,
  useImperativeHandle,
  ComponentType,
} from 'react';

import FetchComponent, {
  ChangeSource,
  ParamsForNextFetch,
  FetchComponentProps,
  FetchComponentRef,
} from './FetchComponent';

export type FetchLinkConfig = Omit<
  FetchComponentProps,
  'prevInfo' | 'name' | 'onChange'
> & {
  /** 组件name，不传递时，取decoratorProps?.name，若也不存在，则使用内部生成的字段 */
  name?: string;
  /** 父组件 */
  decorator?: ComponentType<any>;
  /** 父组件属性 */
  decoratorProps?: Record<string, any>;
  /**
   * 当组件值改变时触发
   * @param value 组件值改变时的值
   * @param record 组件值改变时的记录
   * @param addConfig 添加配置项，传参为[配置项|配置项数组， idx]，idx为添加位置，默认可不传，即添加到当前操作项后面
   * @param deleteConfig 删除配置项，调用后，组件会自动将当前操作项相关的新增配置都删除
   */
  onChange?: (
    value: any,
    record: any,
    addConfig: (
      config: FetchLinkConfig | FetchLinkConfig[],
      configIndex?: number,
    ) => void,
    deleteConfig: () => void,
  ) => void;
};

type FetchLinkConfigWithKey = FetchLinkConfig & {
  __configKey__: string;
};

type FetchLinkState = {
  innerConfig: Array<FetchLinkConfigWithKey>;
  prevInfoMap: Record<number, ParamsForNextFetch>;
};

type FetchLinkAction =
  | {
      type: 'init';
      config: Array<FetchLinkConfig>;
    }
  | {
      type: 'changeNextInfo';
      idx: number;
      nextInfo: ParamsForNextFetch;
    }
  | {
      type: 'addConfig';
      key: string;
      config: FetchLinkConfig | FetchLinkConfig[];
      configIndex?: number;
    }
  | {
      type: 'deleteConfig';
      key: string;
    };

/**
 * 获取 idx 之前的所有 prevInfo
 * @param origin 原始 prevInfoMap
 * @param idx 目标索引
 * @returns 目标索引之前的所有 prevInfoMap
 */
const getPrevInfoMapBefore = (
  origin: Record<number, ParamsForNextFetch>,
  idx: number,
) => {
  const next: Record<number, ParamsForNextFetch> = {};
  for (let i = 1; i <= idx; i++) {
    if (origin[i]) {
      next[i] = origin[i];
    }
  }
  return next;
};

/**
 * 标式化配置项，添加 configKey 属性
 * @param config 配置项数组
 * @returns 标式化后的配置项数组
 */
const normalizeConfig = (config: Array<FetchLinkConfig>) => {
  return config.map((item, idx): FetchLinkConfigWithKey => {
    if ((item as FetchLinkConfigWithKey).__configKey__) {
      return item as FetchLinkConfigWithKey;
    }
    return { ...item, __configKey__: `init${idx}` };
  });
};

const reducer = (
  state: FetchLinkState,
  action: FetchLinkAction,
): FetchLinkState => {
  switch (action.type) {
    case 'init':
      return {
        innerConfig: normalizeConfig(action.config),
        prevInfoMap: {},
      };
    case 'changeNextInfo': {
      const next = { ...state.prevInfoMap };

      Object.keys(next).forEach((key) => {
        if (Number(key) > action.idx) {
          delete next[Number(key)];
        }
      });

      next[action.idx + 1] = action.nextInfo;

      return {
        ...state,
        prevInfoMap: next,
      };
    }
    case 'addConfig': {
      const configArr = (
        Array.isArray(action.config) ? action.config : [action.config]
      ).map((item, idx) => {
        return {
          ...item,
          __configKey__: `${action.key}_add${idx}`,
        };
      });
      const _idx =
        state.innerConfig.findIndex(
          (item) => item.__configKey__ === action.key,
        ) + 1;
      const idx =
        action.configIndex ?? Math.min(_idx, state.innerConfig.length);
      const innerConfig = state.innerConfig.filter(
        (item) =>
          item.__configKey__ === action.key ||
          item.__configKey__?.split('_')[0] !== action.key,
      );

      if (configArr.length) {
        innerConfig.splice(idx, 0, ...configArr);
      }

      return {
        innerConfig,
        prevInfoMap: getPrevInfoMapBefore(state.prevInfoMap, idx),
      };
    }
    case 'deleteConfig': {
      const idx =
        state.innerConfig.findIndex(
          (item) => item.__configKey__ === action.key,
        ) + 1;

      return {
        innerConfig: state.innerConfig.filter(
          (item) =>
            item.__configKey__ === action.key ||
            item.__configKey__?.split('_')[0] !== action.key,
        ),
        prevInfoMap: getPrevInfoMapBefore(state.prevInfoMap, idx),
      };
    }
    default:
      return state;
  }
};

export interface FetchLinkProps {
  config: Array<FetchLinkConfig>;
  form?: FormInstance;
}

export interface FetchLinkRef {
  reset: () => void;
}

/**
 * 获取配置项的 schemaKey，用于判断是否需要重新初始化联动链路。
 * 这里只读取会影响常见链路结构和初始化行为的配置项，
 * 不会覆盖 fetchData、onChange 等非常见运行时配置变更。
 * @param config 配置项数组
 */
const getConfigSchemaKey = (config: FetchLinkConfig[]) => {
  return JSON.stringify(
    config.map((item, idx) => ({
      idx,
      name: item.name || item.decoratorProps?.name || `__anon_${idx}`,
      hasDecorator: !!item.decorator,
      needFetchParam: !!item?.needFetchParam,
      checkFirst: !!item?.checkFirst,
      fieldKey: item?.fieldNames?.key || 'key',
      fieldDataSource: item?.fieldNames?.dataSource || 'dataSource',
    })),
  );
};

const FetchLink = forwardRef<FetchLinkRef, FetchLinkProps>((props, ref) => {
  const { config, form } = props;
  const [state, dispatch] = useReducer(reducer, {
    innerConfig: [],
    prevInfoMap: {},
  });
  const fetchComponentRefs = useRef(new Map<number, FetchComponentRef>());

  const configSchemaKey = useMemo(() => getConfigSchemaKey(config), [config]);

  useEffect(() => {
    dispatch({
      type: 'init',
      config,
    });
    fetchComponentRefs.current = new Map<number, FetchComponentRef>();
  }, [configSchemaKey]);

  const handleParamsForNextFetchChange = useCallback(
    (idx: number, nextInfo: ParamsForNextFetch, source: ChangeSource) => {
      fetchComponentRefs.current.forEach((item, key) => {
        if (key > idx) {
          item.clearView({
            clearDecoratorValue: source === 'manual',
          });
        }
      });

      dispatch({
        type: 'changeNextInfo',
        idx,
        nextInfo,
      });
    },
    [],
  );

  /**
   * 添加配置项
   * @param key 配置项的唯一标识，用于删除配置项，内部参数
   * @param config 配置项，可以是单个配置项或配置项数组
   * @param configIndex 将配置项添加到指定索引位置，默认添加到当前操作项的下一个索引位置，如果传入自定义索引，那么需要自行计算索引位置
   */
  const addConfig = useCallback(
    (
      key: string,
      config: FetchLinkConfig | FetchLinkConfig[],
      configIndex?: number,
    ) => {
      dispatch({
        type: 'addConfig',
        key,
        config,
        configIndex,
      });
    },
    [],
  );

  /**
   * 删除配置项
   * @param key 配置项的唯一标识，用于删除配置项，内部参数
   */
  const deleteConfig = useCallback((key: string) => {
    dispatch({
      type: 'deleteConfig',
      key,
    });
  }, []);

  const reset = useCallback(() => {
    fetchComponentRefs.current.forEach((item, idx) => {
      if (idx === 0) {
        item.clearView({
          clearData: false,
          clearDecoratorValue: true,
          source: 'manual',
        });
      } else {
        item.clearView();
      }
    });

    dispatch({
      type: 'init',
      config,
    });
  }, [configSchemaKey]);

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset],
  );

  const renderComponent = () => {
    return state.innerConfig.map((configItem: FetchLinkConfigWithKey, idx) => {
      const {
        __configKey__,
        name,
        decorator: Decorator,
        decoratorProps,
        onChange,
        ...restConfigItem
      } = configItem;

      const childComponent = (
        <FetchComponent
          key={__configKey__}
          name={name || decoratorProps?.name || __configKey__}
          ref={(ref) => {
            if (ref) {
              fetchComponentRefs.current.set(idx, ref);
            } else {
              fetchComponentRefs.current.delete(idx);
            }
          }}
          /**
           * 当配置数量大于1个时，才会开启 needFetchParam 功能
           * 默认第一个配置项不开启 needFetchParam 功能，其他配置项开启 needFetchParam 功能
           * 也支持自定义
           */
          needFetchParam={
            idx !== 0 &&
            state.innerConfig.length > 1 &&
            (configItem.needFetchParam ?? true)
          }
          {...restConfigItem}
          form={form}
          prevInfo={state.prevInfoMap[idx]}
          onChange={(value, record, nextInfo, source) => {
            handleParamsForNextFetchChange(idx, nextInfo, source);
            onChange?.(
              value,
              record,
              (
                config: FetchLinkConfig | FetchLinkConfig[],
                configIndex?: number,
              ) => addConfig(__configKey__, config, configIndex),
              () => deleteConfig(__configKey__),
            );
          }}
        />
      );

      if (Decorator) {
        return (
          <Decorator key={__configKey__} {...decoratorProps}>
            {childComponent}
          </Decorator>
        );
      }
      return childComponent;
    });
  };

  return renderComponent();
});

export default memo(FetchLink);
