import React, { useCallback, useMemo, useRef } from 'react';

import { Button, Space } from 'antd';

import { VariableVirtualList } from '@meichuang/mc-components';
import type { VariableVirtualListRef } from '@meichuang/mc-components';

type ListItem = {
  id: number;
  title: string;
  description: string;
  tag: string;
};

const Demo = () => {
  const listRef = useRef<VariableVirtualListRef>(null);
  const descriptionTemplates = useMemo(
    () => [
      '短内容。',
      '中等长度内容，用于模拟较常见的业务列表项展示效果。',
      '较长内容，用于模拟说明文案、备注信息、扩展字段等场景，因此这一行的高度会明显更高一些。',
      '超长内容，用于模拟真实业务里描述字段很多、状态说明较长、并且随着数据差异会出现明显不同行高的情况，从而验证不定高虚拟滚动的测量和回收策略是否稳定。',
    ],
    [],
  );

  const dataSource = useMemo<ListItem[]>(() => {
    return Array.from({ length: 100000 }, (_, index) => {
      const description =
        descriptionTemplates[index % descriptionTemplates.length];
      const repeatCount = (index % 4) + 1;

      return {
        id: index,
        title: `不定高数据 ${index + 1}`,
        tag: index % 3 === 0 ? '成功' : index % 3 === 1 ? '处理中' : '待确认',
        description: Array(repeatCount).fill(description).join(' '),
      };
    });
  }, [descriptionTemplates]);

  const renderItem = useCallback((item: ListItem, index: number) => {
    return (
      <section
        style={{
          boxSizing: 'border-box',
          padding: '12px 16px',
          border: '1px solid #f0f0f0',
          borderRadius: 6,
          background: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <strong>{item.title}</strong>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 12,
              background: index % 2 === 0 ? '#e6f4ff' : '#f6ffed',
              color: index % 2 === 0 ? '#1677ff' : '#52c41a',
              fontSize: 12,
              lineHeight: '20px',
            }}
          >
            {item.tag}
          </span>
        </div>
        <div
          style={{
            color: '#595959',
            lineHeight: 1.7,
            wordBreak: 'break-word',
          }}
        >
          {item.description}
        </div>
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
          共 {dataSource.length} 条数据，当前示例使用不定高虚拟渲染。
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
      <VariableVirtualList<ListItem>
        ref={listRef}
        dataSource={dataSource}
        height={560}
        estimatedItemSize={92}
        itemKey="id"
        overscanCount={8}
        renderItem={renderItem}
      />
    </section>
  );
};

export default Demo;
