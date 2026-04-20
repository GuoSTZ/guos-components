import { Button, InputNumber, Space, Tag, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import List, { type ListRef } from '../test/simple';

type DemoItem = {
  key: string;
  title: string;
  desc: string;
};

const dataSource: DemoItem[] = new Array(5000).fill(0).map((_, index) => ({
  key: `simple-item-${index}`,
  title: `simple 列表项 ${index + 1}`,
  desc: `这是第 ${index + 1} 条数据`,
}));

const App = () => {
  const listRef = useRef<ListRef>(null);
  const [targetIndex, setTargetIndex] = useState(120);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  const stats = useMemo(() => {
    return [
      `总数据量：${dataSource.length}`,
      `当前可视区：${visibleRange.start} - ${visibleRange.end}`,
      `目标索引：${targetIndex}`,
    ];
  }, [targetIndex, visibleRange.end, visibleRange.start]);

  return (
    <Space direction="vertical" size={16} style={{ width: 720 }}>
      <Space wrap>
        <InputNumber
          min={0}
          max={dataSource.length - 1}
          value={targetIndex}
          onChange={(value) =>
            setTargetIndex(typeof value === 'number' ? value : 0)
          }
        />
        <Button onClick={() => listRef.current?.scrollToIndex(targetIndex)}>
          按索引定位
        </Button>
        <Button
          onClick={() =>
            listRef.current?.scrollToKey(`simple-item-${targetIndex}`)
          }
        >
          按 key 定位
        </Button>
      </Space>

      <Space wrap>
        {stats.map((item) => (
          <Tag key={item} color="processing">
            {item}
          </Tag>
        ))}
      </Space>

      <List<DemoItem>
        ref={listRef}
        dataSource={dataSource}
        height={420}
        itemHeight={56}
        itemKey="key"
        renderItem={(item, index) => (
          <div>
            <Typography.Text strong>{item.title}</Typography.Text>
            <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
              #{index}
            </Typography.Text>
            <div>
              <Typography.Text type="secondary">{item.desc}</Typography.Text>
            </div>
          </div>
        )}
        onScroll={(info) => {
          setVisibleRange({
            start: info.start,
            end: info.end,
          });
        }}
      />
    </Space>
  );
};

export default App;
