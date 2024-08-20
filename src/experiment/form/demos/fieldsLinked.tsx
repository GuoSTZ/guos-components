import { Form, Select, Button } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const DATA_HAS_B = ['x', 'y'];
const fetchA = () => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { key: 1, label: '选项1', value: 1, type: 'x' },
        { key: 2, label: '选项2', value: 2, type: 'y' },
        { key: 3, label: '选项3', value: 3, type: 'z' },
        { key: 4, label: '选项4', value: 4, type: 'z' },
      ]);
    }, 1000);
  });
};

const fetchB = () => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { key: 1, label: '选项5', value: 5 },
        { key: 2, label: '选项6', value: 6 },
        { key: 3, label: '选项7', value: 7 },
        { key: 4, label: '选项8', value: 8 },
      ]);
    }, 1000);
  });
};

const fetchC = () => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { key: 1, label: '选项9', value: 9 },
        { key: 2, label: '选项10', value: 10 },
        { key: 3, label: '选项11', value: 11 },
        { key: 4, label: '选项12', value: 12 },
      ]);
    }, 1000);
  });
};

const fetchD = () => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { key: 1, label: '选项13', value: 13 },
        { key: 2, label: '选项14', value: 14 },
        { key: 3, label: '选项15', value: 15 },
        { key: 4, label: '选项16', value: 16 },
      ]);
    }, 1000);
  });
};

const App = () => {
  const [form] = Form.useForm();
  const a = Form.useWatch('a', form);
  const [aOptions, setAOptions] = useState<any[]>([]);
  const [bOptions, setBOptions] = useState<any[]>([]);
  const [cOptions, setCOptions] = useState<any[]>([]);
  const [dOptions, setDOptions] = useState<any[]>([]);

  const type = useMemo(() => {
    return aOptions.find((item) => item.value === a)?.type;
  }, [a, aOptions]);

  useEffect(() => {
    (async () => {
      const data = await fetchA();
      setAOptions(data);
    })();
  }, []);

  const aOnChange = useCallback(
    async (value: any) => {
      // 切换a数据时，需要清空b，c，d的数据
      form.resetFields(['b', 'c', 'd']);
      setBOptions([]);
      setCOptions([]);
      setDOptions([]);

      // 不知道为啥这里拿不到上一层的type值，一直是undefined，即使在依赖中加入了type也一样
      const type = aOptions.find((item) => item.value === value)?.type;
      if (DATA_HAS_B.includes(type)) {
        const data = await fetchB();
        setBOptions(data);
      } else {
        const data = await fetchC();
        setCOptions(data);
      }
    },
    [aOptions],
  );

  const bOnChange = useCallback(async () => {
    // 切换b数据时，需要清空c，d的数据
    form.resetFields(['c', 'd']);
    setCOptions([]);
    setDOptions([]);

    const data = await fetchC();
    setCOptions(data);
  }, []);

  const cOnChange = useCallback(async () => {
    // 切换c数据时，需要清空d的数据
    form.resetFields(['d']);
    setDOptions([]);

    const data = await fetchD();
    setDOptions(data);
  }, []);

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name={['a', 0]} label="A">
          <Select options={aOptions} onChange={aOnChange} />
        </Form.Item>

        {DATA_HAS_B.includes(type) ? (
          <Form.Item name="b" label="B">
            <Select options={bOptions} onChange={bOnChange} />
          </Form.Item>
        ) : null}

        <Form.Item name="c" label="C">
          <Select options={cOptions} onChange={cOnChange} />
        </Form.Item>

        <Form.Item name="d" label="D">
          <Select options={dOptions} />
        </Form.Item>
      </Form>

      <Button onClick={() => form.validateFields().then(console.log)}>
        提交
      </Button>
    </>
  );
};

export default App;
