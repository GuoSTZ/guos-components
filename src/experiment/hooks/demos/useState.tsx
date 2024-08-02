import { useState, useEffect } from 'react';

const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }];
const App = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    data.forEach((item) => {
      if (item.name === 'a') {
        setCount(100);
      }
    });
    const newData = data.filter((item) => item.name !== 'a');
    setItems(newData);
  }, [data]);

  useEffect(() => {
    console.log('count', count);
    console.log('items', items);
    setItems((origin) => {
      console.log(origin, '======origin');
      return origin;
    });
  }, [count]);
};

export default App;
