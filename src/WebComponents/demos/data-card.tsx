import React, { useEffect } from 'react';
import { defineDataCard } from 'guos-components';

const shellStyle: React.CSSProperties = {
  display: 'grid',
  gap: 24,
  minHeight: 360,
  padding: 28,
  background: 'linear-gradient(180deg, #eef2f6 0%, #e8edf3 100%)',
  borderRadius: 28,
};

const noteStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: 640,
  fontSize: 14,
  lineHeight: 1.7,
  color: '#728196',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.2,
  color: '#223045',
  fontFamily:
    '"Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
};

const Demo = () => {
  useEffect(() => {
    defineDataCard();
  }, []);

  return (
    <section style={shellStyle}>
      <header>
        <h2 style={titleStyle}>Data Card</h2>
        <p style={noteStyle}>
          只围绕标题、说明文字、金额块、数量和两个操作按钮做展示，不额外扩展数据字段。
        </p>
      </header>

      <data-card
        title="测试1"
        meta="由 盛 支付"
        amount-label="盛"
        amount="2.00"
        count="2"
      />
    </section>
  );
};

export default Demo;
