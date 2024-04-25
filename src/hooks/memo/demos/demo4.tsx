import React, { useState } from 'react';

function ExpensiveTree() {
  let now = performance.now();
  while (performance.now() - now < 1000) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
}

// 此时的color属性在父组件中也被使用，能否继续做拆分处理呢？
export default function App() {
  let [color, setColor] = useState('red');
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p>Hello, world!</p>
      <ExpensiveTree />
    </div>
  );
}
