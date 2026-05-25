import React, { memo, useCallback, useReducer, useRef, useEffect } from 'react';

import FetchComponent, {
  ParamsForNextFetch,
  FetchComponentProps,
  FetchComponentRef,
} from './FetchComponent';

export type FetchLinkConfig = Omit<FetchComponentProps, 'prevInfo'> & {
  /**
   * 当组件值改变时触发
   * @param args 组件值改变时的参数，与组件的 onChange 参数一致
   * @param addConfig 添加配置项，传参为[配置项|配置项数组， idx]，idx为添加位置，默认可不传，即添加到当前操作项后面
   * @param deleteConfig 删除配置项，调用后，组件会自动将当前操作项相关的新增配置都删除
   */
  onChange?: (...args: any[]) => void;
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
}

const FetchLink = (props: FetchLinkProps) => {
  const { config } = props;
  const [state, dispatch] = useReducer(reducer, {
    innerConfig: [],
    prevInfoMap: {},
  });
  const fetchComponentRefs = useRef(new Map<number, FetchComponentRef>());

  useEffect(() => {
    dispatch({
      type: 'init',
      config,
    });
    fetchComponentRefs.current = new Map<number, FetchComponentRef>();
  }, [config.length]); // config的内部配置通常不会改变，所以这里只监听length

  const handleParamsForNextFetchChange = useCallback(
    (idx: number, nextInfo: ParamsForNextFetch) => {
      fetchComponentRefs.current.forEach((item, key) => {
        if (key > idx) {
          item.clearView();
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

  return (
    <>
      {state.innerConfig.map((item: FetchLinkConfigWithKey, idx) => (
        <FetchComponent
          key={item.__configKey__}
          ref={(ref) => {
            if (ref) {
              fetchComponentRefs.current.set(idx, ref);
            }
          }}
          needFetchParam={idx !== 0 && state.innerConfig.length > 1}
          {...item}
          prevInfo={state.prevInfoMap[idx]}
          onChange={(...args) => {
            const nextInfo = args?.[args?.length - 1];
            const rest = args.slice(0, -1);
            handleParamsForNextFetchChange(idx, nextInfo);
            item.onChange?.(
              ...rest,
              (
                config: FetchLinkConfig | FetchLinkConfig[],
                configIndex?: number,
              ) => addConfig(item.__configKey__, config, configIndex),
              () => deleteConfig(item.__configKey__),
            );
          }}
        />
      ))}
    </>
  );
};

export default memo(FetchLink);
