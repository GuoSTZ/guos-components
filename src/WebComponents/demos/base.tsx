import React, { useEffect } from 'react';
import { defineRiceBlock } from 'guos-components';

const shellStyle: React.CSSProperties = {
  display: 'grid',
  gap: 24,
  minHeight: 620,
  padding: 56,
  background:
    'radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.22), transparent 28%), linear-gradient(180deg, #ced9e6 0%, #c8d3df 100%)',
  borderRadius: 36,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: 36,
  alignItems: 'center',
};

const noteStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.7,
  maxWidth: 560,
  color: '#6f7f91',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.2,
  color: '#56687d',
  fontFamily:
    '"Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
};

const Demo = () => {
  useEffect(() => {
    defineRiceBlock();
  }, []);

  return (
    <section style={shellStyle}>
      <header>
        <h2 style={titleStyle}>Rice Block</h2>
        <p style={noteStyle}>
          这版调整成偏冷白蓝的柔雾实体方块，更接近你发图里的厚圆角悬浮质感。
        </p>
      </header>

      <section style={rowStyle}>
        <rice-block size="260" radius="48" />
        <rice-block size="220" radius="44" />
        <rice-block size="180" hoverable>
          soft
        </rice-block>
      </section>
    </section>
  );
};

export default Demo;
