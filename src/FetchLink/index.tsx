import React, { memo, useCallback, useState, ElementType } from 'react';

import FetchComponent, { FetchComponentProps } from './FetchComponent';

type ConventHandle = (...args: any[]) => any[];

interface FetchLinkExtraProps {
  decorator?: ElementType;
  decoratorProps?: Record<string, unknown>;
  /** 不同的控件，抛出的参数不同，需要自定义 */
  handleOnChangeValue?: ConventHandle;
  /** 下一个组件的请求，依赖当前组件数据，根据该字段传递响应数据作为下一个组件请求的参数
   * 如果为字符串，则字符串作为参数名，值为选中数据对应的值
   * 如果为数组，则每个字符串分别为参数名，需要在整条数据中找到对应的值
   */
  nextFetchParam?: string[] | string;
  onChange?: (...args: any[]) => void;
}

export interface FetchLinkProps {
  config: Array<FetchComponentProps & FetchLinkExtraProps>;
}

const FetchLink = (props: FetchLinkProps) => {
  const { config } = props;

  const [fetchParams, setFetchParams] = useState<Record<number, any>>({});

  const renderComponent = useCallback(
    (config: FetchComponentProps & FetchLinkExtraProps, idx: number) => {
      const {
        decorator,
        decoratorProps,
        handleOnChangeValue,
        nextFetchParam,
        onChange,
        ...rest
      } = config;

      if (decorator) {
        const Decorator = decorator;
        return (
          <Decorator {...decoratorProps}>
            <FetchComponent
              {...rest}
              fetchParams={fetchParams[idx] ? fetchParams[idx] : void 0}
              onChange={(...args: any[]) => {
                const conventedArgs = handleOnChangeValue
                  ? handleOnChangeValue(...args)
                  : args;
                const [value = '', record = {}] = conventedArgs;

                if (nextFetchParam) {
                  let nextFetchParams = {};
                  if (Array.isArray(nextFetchParam)) {
                    nextFetchParams = nextFetchParam.reduce((acc, curr) => {
                      acc[curr] = record[curr];
                      return acc;
                    }, {} as Record<string, any>);
                  } else {
                    nextFetchParams = {
                      [nextFetchParam]: value,
                    };
                  }
                  setFetchParams((origin) => {
                    return {
                      ...origin,
                      [idx + 1]: {
                        ...(origin[idx] || {}),
                        ...nextFetchParams,
                      },
                    };
                  });
                }

                onChange?.(...args);
              }}
            />
          </Decorator>
        );
      }
      return <FetchComponent {...rest} />;
    },
    [fetchParams],
  );

  return (
    <>
      {config.map((item, idx) => {
        return renderComponent(item, idx);
      })}
    </>
  );
};

export default memo(FetchLink);
