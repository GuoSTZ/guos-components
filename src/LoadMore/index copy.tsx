import cls from 'classnames';
import React, {
  CSSProperties,
  ReactNode,
  UIEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import styles from './index.module.less';

export interface LoadMoreProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  height?: number | string;
  loading?: boolean;
  hasMore?: boolean;
  disabled?: boolean;
  threshold?: number;
  onLoadMore?: () => void;
  loadingContent?: ReactNode;
  endContent?: ReactNode;
  moreContent?: ReactNode;
}

const LoadMore = (props: LoadMoreProps) => {
  const {
    children,
    className,
    style,
    height = 420,
    loading = false,
    hasMore = true,
    disabled = false,
    threshold = 80,
    onLoadMore,
    loadingContent = '加载中...',
    endContent = '没有更多数据了',
    moreContent = '继续下滑加载更多',
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerLockRef = useRef(false);

  const triggerLoadMoreIfNeeded = useCallback(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    if (loading || disabled || !hasMore) {
      return;
    }

    if (triggerLockRef.current) {
      return;
    }

    const distanceToBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    if (distanceToBottom <= threshold) {
      triggerLockRef.current = true;
      onLoadMore?.();
    }
  }, [disabled, hasMore, loading, onLoadMore, threshold]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!event.currentTarget) {
      return;
    }
    triggerLoadMoreIfNeeded();
  };

  useEffect(() => {
    if (!loading) {
      triggerLockRef.current = false;
    }
  }, [loading]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      triggerLoadMoreIfNeeded();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [children, hasMore, loading, triggerLoadMoreIfNeeded]);

  return (
    <div className={cls(styles['load-more'], className)} style={style}>
      <div
        ref={containerRef}
        className={styles['load-more-scroll']}
        style={{ height }}
        onScroll={handleScroll}
      >
        <div className={styles['load-more-content']}>{children}</div>
        <div className={styles['load-more-footer']}>
          {loading ? loadingContent : hasMore ? moreContent : endContent}
        </div>
      </div>
    </div>
  );
};

export default memo(LoadMore);
