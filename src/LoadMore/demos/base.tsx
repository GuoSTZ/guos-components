import { Button } from 'antd';
import { LoadMore } from 'guos-components';
import React, { useMemo, useState } from 'react';

interface ListItem {
  id: number;
  title: string;
  description: string;
}

const PAGE_SIZE = 20;
const MAX_TOTAL = 100;

const createData = (start: number, count: number): ListItem[] => {
  return Array.from({ length: count }, (_, offset) => {
    const id = start + offset + 1;
    return {
      id,
      title: `第 ${id} 条数据`,
      description: '这是用于演示滚动加载的示例内容。',
    };
  });
};

const App = () => {
  const [list, setList] = useState<ListItem[]>(() => createData(0, PAGE_SIZE));
  const [loading, setLoading] = useState(false);

  const hasMore = list.length < MAX_TOTAL;

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setList((current) => {
        const rest = MAX_TOTAL - current.length;
        const nextCount = Math.min(PAGE_SIZE, rest);
        return [...current, ...createData(current.length, nextCount)];
      });
      setLoading(false);
    }, 1800);
  };

  const handleReset = () => {
    setList(createData(0, PAGE_SIZE));
  };

  const renderList = useMemo(() => {
    return list.map((item) => {
      return (
        <div
          key={item.id}
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #f5f5f5',
            lineHeight: '22px',
          }}
        >
          <div style={{ color: '#1f2937', fontWeight: 600 }}>{item.title}</div>
          <div style={{ marginTop: 4, color: '#667085', fontSize: 13 }}>
            {item.description}
          </div>
        </div>
      );
    });
  }, [list]);

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 12 }}>
        <Button onClick={handleReset}>重置数据</Button>
      </div>

      <LoadMore
        height={380}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      >
        {renderList}
      </LoadMore>
    </div>
  );
};

export default App;
