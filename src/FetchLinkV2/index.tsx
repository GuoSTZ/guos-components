import React, { memo, useCallback, useState, useRef, useEffect } from 'react';

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

export interface FetchLinkProps {
  config: Array<FetchLinkConfig>;
}

const FetchLink = (props: FetchLinkProps) => {
  const { config } = props;
  const [innerConfig, setInnerConfig] = useState<Array<FetchLinkConfigWithKey>>(
    [],
  );
  const [prevInfoMap, setPrevInfoMap] = useState<
    Record<number, ParamsForNextFetch>
  >({});
  const fetchComponentRefs = useRef(new Map<number, FetchComponentRef>());

  useEffect(() => {
    setInnerConfig(
      config.map((item, idx): FetchLinkConfigWithKey => {
        if ((item as FetchLinkConfigWithKey).__configKey__) {
          return item as FetchLinkConfigWithKey;
        }
        return { ...item, __configKey__: `init${idx}` };
      }),
    );
    fetchComponentRefs.current = new Map<number, FetchComponentRef>();
    setPrevInfoMap({});
  }, [config.length]); // config的内部配置通常不会改变，所以这里只监听length

  const handleParamsForNextFetchChange = useCallback(
    (idx: number, nextInfo: ParamsForNextFetch) => {
      fetchComponentRefs.current.forEach((item, key) => {
        if (key > idx) {
          item.clearView();
        }
      });

      setPrevInfoMap((origin) => {
        const next = { ...origin };

        Object.keys(next).forEach((key) => {
          if (Number(key) > idx) {
            delete next[Number(key)];
          }
        });

        next[idx + 1] = nextInfo;
        return next;
      });
    },
    [],
  );

  const resetPrevInfoMapBefore = useCallback((idx: number) => {
    setPrevInfoMap((origin) => {
      const next: Record<number, any> = {};
      for (let i = 1; i <= idx; i++) {
        origin[i] && (next[i] = origin[i]);
      }
      return next;
    });
  }, []);

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
      const configArr = (Array.isArray(config) ? config : [config])?.map(
        (item, idx) => {
          return {
            ...item,
            __configKey__: `${key}_add${idx}`,
          };
        },
      );

      setInnerConfig((origin) => {
        const _idx =
          origin?.findIndex((item) => item.__configKey__ === key) + 1;
        const idx = configIndex || Math.min(_idx, origin?.length || 0);
        const newConfig = origin?.filter(
          (item) =>
            item.__configKey__ === key ||
            item.__configKey__?.split('_')[0] !== key,
        );
        if (configArr.length) {
          newConfig.splice(idx, 0, ...configArr);
        }
        resetPrevInfoMapBefore(idx);
        return newConfig;
      });
    },
    [resetPrevInfoMapBefore],
  );

  /**
   * 删除配置项
   * @param key 配置项的唯一标识，用于删除配置项，内部参数
   */
  const deleteConfig = useCallback(
    (key: string) => {
      setInnerConfig((origin) => {
        const idx = origin?.findIndex((item) => item.__configKey__ === key) + 1;
        resetPrevInfoMapBefore(idx);
        return origin?.filter(
          (item) =>
            item.__configKey__ === key ||
            item.__configKey__?.split('_')[0] !== key,
        );
      });
    },
    [resetPrevInfoMapBefore],
  );

  return (
    <>
      {innerConfig.map((item: FetchLinkConfigWithKey, idx) => (
        <FetchComponent
          key={item.__configKey__}
          ref={(ref) => {
            if (ref) {
              fetchComponentRefs.current.set(idx, ref);
            }
          }}
          needFetchParam={idx !== 0 && innerConfig.length > 1}
          {...item}
          prevInfo={prevInfoMap[idx]}
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
