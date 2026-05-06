import React, { useCallback, useMemo, useRef } from 'react';

import { Button, Space } from 'antd';

import { VirtualList } from '@meichuang/mc-components';
import type { VirtualListRef } from '@meichuang/mc-components';

type ListItem = {
  id: number;
  title: string;
  description: string;
};

const Demo = () => {
  const listRef = useRef<VirtualListRef>(null);
  const dataSource = useMemo<ListItem[]>(() => {
    return Array.from({ length: 100000 }, (_, index) => ({
      id: index,
      title: `第 ${index + 1} 行数据`,
      description: `这是第 ${
        index + 1
      } 条虚拟列表内容，用于验证 10w 级数据滚动表现。`,
    }));
  }, []);

  const renderItem = useCallback((item: ListItem) => {
    return (
      <section
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #f0f0f0',
          borderRadius: 6,
          background: '#ffffff',
        }}
      >
        <strong style={{ marginRight: 16 }}>{item.title}</strong>
        <span style={{ color: '#999999' }}>{item.description}</span>
      </section>
    );
  }, []);

  return (
    <section
      style={{
        padding: 24,
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 8,
          background: '#ffffff',
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: 500 }}>
          共 {dataSource.length} 条数据，当前示例使用固定行高虚拟渲染。
        </div>
        <Space wrap>
          <Button onClick={() => listRef.current?.scrollToTop()}>
            滚动到顶部
          </Button>
          <Button onClick={() => listRef.current?.scrollToItem(50000, 'start')}>
            滚动到第 50001 项
          </Button>
          <Button onClick={() => listRef.current?.scrollToKey(90000, 'start')}>
            滚动到 key=90000
          </Button>
        </Space>
      </div>
      <VirtualList<ListItem>
        ref={listRef}
        dataSource={dataSource}
        height={480}
        itemHeight={48}
        itemKey="id"
        overscanCount={8}
        renderItem={renderItem}
      />
    </section>
  );
};

export default Demo;
