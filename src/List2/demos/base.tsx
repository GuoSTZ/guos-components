import { Button, Tag, Typography } from 'antd';
import { List2, type List2Ref, type List2VisibleRange } from 'guos-components';
import React, { useMemo, useRef, useState } from 'react';

type DemoItem = {
  id: string;
  name: string;
  department: string;
  description: string;
  score: number;
  status: 'online' | 'busy' | 'offline';
};

const statusMap: Record<DemoItem['status'], { color: string; label: string }> =
  {
    online: { color: 'green', label: '在线' },
    busy: { color: 'gold', label: '忙碌' },
    offline: { color: 'default', label: '离线' },
  };

const App = () => {
  const listRef = useRef<List2Ref>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState<List2VisibleRange>({
    start: 0,
    end: 0,
  });

  const dataSource = useMemo<DemoItem[]>(() => {
    const departments = ['前端组', '设计组', '数据组', '增长组'];
    const statusList: DemoItem['status'][] = ['online', 'busy', 'offline'];

    return Array.from({ length: 2000 }, (_, index) => {
      const status = statusList[index % statusList.length];

      return {
        id: `member-${index + 1}`,
        name: `成员 ${index + 1}`,
        department: departments[index % departments.length],
        description: `这是第 ${
          index + 1
        } 条数据，用来展示手写虚拟滚动只渲染可视区附近节点。`,
        score: 80 + (index % 20),
        status,
      };
    });
  }, []);

  const scrollToTarget = (index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToIndex(index, 'center');
  };

  const handleRandomScroll = () => {
    const nextIndex = Math.floor(Math.random() * dataSource.length);
    scrollToTarget(nextIndex);
  };

  const { Text, Paragraph } = Typography;

  return (
    <div style={{ maxWidth: 760 }}>
      <Paragraph style={{ marginBottom: 12 }}>
        下面这份示例会生成 2000
        条数据，但列表始终只渲染当前可视区域附近的少量节点，
        方便直接观察虚拟滚动的效果。
      </Paragraph>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Button onClick={() => listRef.current?.scrollToTop()}>回到顶部</Button>
        <Button onClick={() => scrollToTarget(199)}>定位到第 200 项</Button>
        <Button type="primary" onClick={() => scrollToTarget(999)}>
          定位到第 1000 项
        </Button>
        <Button onClick={handleRandomScroll}>随机定位</Button>
        <Text type="secondary">
          当前可视区：第 {visibleRange.start + 1} 项 - 第 {visibleRange.end + 1}{' '}
          项
        </Text>
      </div>

      <List2<DemoItem>
        ref={listRef}
        dataSource={dataSource}
        height={420}
        itemHeight={72}
        overscan={3}
        itemKey="id"
        onVisibleRangeChange={setVisibleRange}
        renderItem={(item, index) => {
          const isActive = index === activeIndex;
          const currentStatus = statusMap[item.status];

          return (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: isActive ? '#eef6ff' : '#ffffff',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    color: '#1f2937',
                    fontWeight: 600,
                    fontSize: 15,
                    lineHeight: '22px',
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    color: '#667085',
                    fontSize: 13,
                    lineHeight: '20px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.department} · {item.description}
                </div>
              </div>

              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <Tag color={currentStatus.color}>{currentStatus.label}</Tag>
                <div
                  style={{
                    marginTop: 8,
                    color: isActive ? '#1677ff' : '#98a2b3',
                    fontSize: 12,
                  }}
                >
                  第 {index + 1} 项 / 评分 {item.score}
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default App;
