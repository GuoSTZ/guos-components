import React, { memo, useMemo, useState } from 'react';

const ChildComponent1 = (props: any) => {
  console.log('子组件1触发了渲染');
  return (
    <div>
      子组件1 -
      验证子组件在接收不变的value时，父组件通过触发不影响value值的setState操作，是否会引起子组件的重渲染
      <br />
      父组件传值：{props.value}
    </div>
  );
};

const ChildComponent2 = memo((props: any) => {
  console.log('子组件2触发了渲染');
  return (
    <div>
      子组件2 - 使用memo直接包裹组件，不做定制化比较
      <br />
      父组件传值：{props.value}
    </div>
  );
});

const ChildComponent3 = () => {
  console.log('子组件3触发了渲染');
  return <div>子组件3 - 不接受任何传值</div>;
};

export default () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const value = count1 % 2;
  const value1 = useMemo(() => count2 % 2, [count2]);
  return (
    <div>
      父组件
      <br />
      <button onClick={() => setCount1((origin) => origin + 1)}>修改count1</button>
      {`count1的值为 ${count1}`}
      <br />
      <button onClick={() => setCount2((origin) => origin + 1)}>修改count2</button>
      {`count2的值为 ${count2}`}
      <ChildComponent1 value={value1} />
      <ChildComponent2 value={value1} />
      <ChildComponent3 />
    </div>
  );
};
