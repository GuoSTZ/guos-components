import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

type LogItem = {
  id: string;
  ts: number;
  level: 'info' | 'warn' | 'error';
  message: string;
};

type ProcessedItem = {
  id: string;
  title: string;
  ts: number;
};

type Options = {
  chunkSize?: number;
  idleTimeout?: number;
};

type IdleDeadlineLike = {
  timeRemaining: () => number;
  didTimeout: boolean;
};

const hasRIC = typeof window !== 'undefined' && 'requestIdleCallback' in window;
const requestIdle = (
  cb: (deadline: IdleDeadlineLike) => void,
  timeout = 60,
): number => {
  if (hasRIC) {
    return (window as any).requestIdleCallback(cb, { timeout });
  }
  return window.setTimeout(() => {
    cb({
      didTimeout: true,
      timeRemaining: () => 0,
    });
  }, 16);
};

const cancelIdle = (id: number) => {
  if (hasRIC) {
    (window as any).cancelIdleCallback(id);
    return;
  }
  clearTimeout(id);
};

function processChunk(
  source: LogItem[],
  start: number,
  end: number,
  keyword: string,
): ProcessedItem[] {
  const out: ProcessedItem[] = [];
  const lower = keyword.trim().toLowerCase();

  for (let i = start; i < end; i++) {
    const item = source[i];
    if (!item) continue;
    if (lower && !item.message.toLowerCase().includes(lower)) continue;

    out.push({
      id: item.id,
      ts: item.ts,
      title: `[${item.level.toUpperCase()}] ${item.message}`,
    });
  }

  // 每个分片内部可排序，最终合并后如果要求全局严格排序可再做一次轻量 merge
  out.sort((a, b) => b.ts - a.ts);
  return out;
}

function useChunkRender(
  source: LogItem[],
  keyword: string,
  options: Options = {},
) {
  const { chunkSize = 500, idleTimeout = 80 } = options;
  const [list, setList] = useState<ProcessedItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  const taskIdRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setList([]);
    setProgress(0);

    let index = 0;
    const total = source.length;

    const run = () => {
      if (cancelledRef.current) return;

      // 利用 idle 时间处理多批，避免单次执行太久
      const handle = requestIdle((deadline) => {
        if (cancelledRef.current) return;

        while (
          (deadline.timeRemaining() > 3 || deadline.didTimeout) &&
          index < total
        ) {
          const start = index;
          const end = Math.min(index + chunkSize, total);
          const chunk = processChunk(source, start, end, keyword);

          startTransition(() => {
            setList((prev) => prev.concat(chunk));
          });

          index = end;
          setProgress(index / total);
        }

        if (index < total && !cancelledRef.current) {
          run();
        }
      }, idleTimeout);

      taskIdRef.current = handle;
    };

    run();

    return () => {
      cancelledRef.current = true;
      if (taskIdRef.current !== null) {
        cancelIdle(taskIdRef.current);
      }
    };
  }, [source, keyword, chunkSize, idleTimeout]);

  return { list, progress, isPending };
}

// demo 页面
export default function BigListPage() {
  const [keyword, setKeyword] = useState('');

  // 模拟 10w 数据
  const source = useMemo<LogItem[]>(() => {
    const arr: LogItem[] = [];
    for (let i = 0; i < 100000; i++) {
      arr.push({
        id: String(i),
        ts: Date.now() - i * 1000,
        level: i % 10 === 0 ? 'error' : i % 3 === 0 ? 'warn' : 'info',
        message: `log item ${i} - some text for searching`,
      });
    }
    return arr;
  }, []);

  const { list, progress, isPending } = useChunkRender(source, keyword, {
    chunkSize: 600,
    idleTimeout: 100,
  });

  return (
    <div style={{ padding: 16 }}>
      <h3>分片渲染 Demo</h3>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="输入关键字过滤"
        style={{ width: 260, marginBottom: 12 }}
      />
      <div style={{ marginBottom: 8 }}>
        进度：{Math.round(progress * 100)}% {isPending ? '(处理中...)' : ''}
      </div>

      <div style={{ height: 420, overflow: 'auto', border: '1px solid #ddd' }}>
        {list.slice(0, 2000).map((item) => (
          <div
            key={item.id}
            style={{ padding: '6px 10px', borderBottom: '1px solid #f3f3f3' }}
          >
            <span style={{ color: '#999', marginRight: 8 }}>{item.ts}</span>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
