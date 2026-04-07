import { Button, InputNumber, Space, Tag, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { List, type ListRef } from 'guos-components';

type DemoItem = {
  key: string;
  title: string;
  owner: string;
  description: string;
  tag: string;
  level: '高' | '中' | '低';
};

const levelColorMap = {
  高: 'red',
  中: 'gold',
  低: 'blue',
};

const dataSource: DemoItem[] = new Array(10000).fill(0).map((_, index) => {
  const lineCount = (index % 4) + 1;

  return {
    key: `list-item-${index}`,
    title: `虚拟列表数据 ${index + 1}`,
    owner: `owner-${index % 9}`,
    description: new Array(lineCount)
      .fill(`第 ${index + 1} 条数据用于模拟不同高度下的渲染表现`)
      .join('，'),
    tag: ['消息', '任务', '资产', '告警'][index % 4],
    level: ['高', '中', '低'][index % 3] as DemoItem['level'],
  };
});

const App = () => {
  const listRef = useRef<ListRef>(null);
  const [targetIndex, setTargetIndex] = useState(512);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  const stats = useMemo(() => {
    return [
      `总数据量：${dataSource.length}`,
      `当前可视区：${visibleRange.start} - ${visibleRange.end}`,
      `跳转目标：${targetIndex}`,
    ];
  }, [targetIndex, visibleRange.end, visibleRange.start]);

  return (
    <Space direction="vertical" size={16} style={{ width: 760 }}>
      <Space wrap>
        <InputNumber
          min={0}
          max={dataSource.length - 1}
          value={targetIndex}
          onChange={(value) => {
            setTargetIndex(typeof value === 'number' ? value : 0);
          }}
        />
        <Button onClick={() => listRef.current?.scrollToIndex(targetIndex)}>
          滚动到该项
        </Button>
        <Button
          onClick={() => listRef.current?.scrollToIndex(targetIndex, 'start')}
        >
          顶部对齐
        </Button>
        <Button
          onClick={() =>
            listRef.current?.scrollToKey(`list-item-${targetIndex}`)
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
        height={480}
        itemHeight={72}
        overscan={6}
        itemKey="key"
        renderItem={(item, index) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: '14px 16px',
              }}
            >
              <Space wrap size={[8, 8]}>
                <Typography.Text strong>{item.title}</Typography.Text>
                <Tag color={levelColorMap[item.level]}>{item.level}优先级</Tag>
                <Tag>{item.tag}</Tag>
                <Typography.Text type="secondary">#{index}</Typography.Text>
              </Space>

              <Typography.Text type="secondary">
                {item.description}
              </Typography.Text>

              <Typography.Text>负责人：{item.owner}</Typography.Text>
            </div>
          );
        }}
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
