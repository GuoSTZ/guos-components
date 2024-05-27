import React, { useEffect, useRef, useState } from 'react';

const UseStateDemo = () => {
  const [buttonState, setButtonState] = useState(0);
  const [intervalState, setIntervalState] = useState(0);
  const [timeoutState, setTimeoutState] = useState(0);
  const timeoutRef = useRef<any>();

  const handleOnClick = () => {
    setButtonState((n) => n + 1);
    console.log(`buttonState: `, buttonState);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIntervalState((n) => n + 1);
      console.log(`intervalState: `, intervalState);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTimeoutState((n) => n + 1);
    console.log(`timeoutState: `, timeoutState);
    timeoutRef.current = setTimeout(getTimeout, 1000);
  };

  useEffect(() => {
    getTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div>
      <p>{`按钮点击次数：${buttonState}`}</p>
      <p>{`interval 定时器次数：${intervalState}`}</p>
      <p>{`timeout 定时器次数：${timeoutState}`}</p>
      <button type="button" onClick={handleOnClick}>
        点击+1
      </button>
    </div>
  );
};

export default UseStateDemo;
