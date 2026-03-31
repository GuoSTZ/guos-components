import { useCallback, useEffect, useState } from 'react';

// 将高度统一处理为非负整数，避免小数和负值带来的抖动
const normalizeHeight = (nextHeight: number) =>
  Math.max(Math.floor(nextHeight), 0);

const useAutoHeight = <T extends HTMLElement>() => {
  const [element, setElement] = useState<T | null>(null);
  const [height, setHeight] = useState(0);

  // 只有高度真实变化时才更新 state，减少无效渲染
  const updateHeight = useCallback((nextHeight: number) => {
    const normalizedHeight = normalizeHeight(nextHeight);

    setHeight((prevHeight) =>
      prevHeight === normalizedHeight ? prevHeight : normalizedHeight,
    );
  }, []);

  // 使用 callback ref，确保 ref 指向新节点时能重新建立监听
  const containerRef = useCallback((node: T | null) => {
    setElement(node);

    if (!node) {
      setHeight(0);
    }
  }, []);

  useEffect(() => {
    if (!element) {
      return undefined;
    }

    const measureHeight = () => {
      updateHeight(element.getBoundingClientRect().height);
    };

    measureHeight();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      measureHeight();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [element, updateHeight]);

  return {
    containerRef,
    height,
  };
};

export default useAutoHeight;
