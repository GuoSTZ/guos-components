import cls from 'classnames';
import React, {
  CSSProperties,
  ReactNode,
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
  const footerRef = useRef<HTMLDivElement>(null);
  const triggerLockRef = useRef(false);

  const triggerLoadMore = useCallback(() => {
    if (loading || disabled || !hasMore) {
      return;
    }

    if (triggerLockRef.current) {
      return;
    }

    triggerLockRef.current = true;
    onLoadMore?.();
  }, [disabled, hasMore, loading, onLoadMore]);

  useEffect(() => {
    if (!loading) {
      triggerLockRef.current = false;
    }
  }, [loading]);

  useEffect(() => {
    const container = containerRef.current;
    const footer = footerRef.current;
    if (!container || !footer) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          triggerLoadMore();
        }
      },
      {
        root: container,
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );
    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [children, threshold, triggerLoadMore]);

  return (
    <div className={cls(styles['load-more'], className)} style={style}>
      <div
        ref={containerRef}
        className={styles['load-more-scroll']}
        style={{ height }}
      >
        <div className={styles['load-more-content']}>{children}</div>
        <div ref={footerRef} className={styles['load-more-footer']}>
          {loading ? loadingContent : hasMore ? moreContent : endContent}
        </div>
      </div>
    </div>
  );
};

export default memo(LoadMore);
