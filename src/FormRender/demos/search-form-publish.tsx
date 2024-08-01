import { Button } from 'antd';
import { FormRender } from 'guos-components';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React, { useRef, useEffect, useCallback } from 'react';
import schema from './schema/search-form.json';
import './style/search-form.less';

const PAYLOAD_TYPE = {
  SEARCH: 'handleSearch',
  RESET: 'handleReset',
};
const App = () => {
  const ref = useRef<{
    form: IFrom;
  }>(null);

  const getData = useCallback(
    (values: any) => console.log('模拟搜索-订阅发布', values),
    [],
  );

  const handleData = useCallback(
    (action: any) => {
      switch (action.type) {
        case PAYLOAD_TYPE.SEARCH: {
          getData(action.payload);
          break;
        }
        case PAYLOAD_TYPE.RESET: {
          getData(action.payload);
          break;
        }
        default:
          break;
      }
    },
    [getData],
  );

  useEffect(() => {
    const num = ref.current?.form?.subscribe?.(handleData);
    return () => {
      !!num && ref.current?.form?.unsubscribe?.(num);
    };
  }, [handleData, ref.current?.form]);

  const handleSearch = () => {
    ref.current?.form?.submit?.((values) => {
      ref.current?.form?.notify?.(PAYLOAD_TYPE.SEARCH, values);
    });
  };

  const handleReset = () => {
    ref.current?.form?.reset?.();
    ref.current?.form?.notify?.(PAYLOAD_TYPE.RESET, {});
  };

  return (
    <div className="search-form">
      <FormRender ref={ref} schema={schema} />
      <div className="search-form-btns">
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" onClick={handleSearch}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default App;
