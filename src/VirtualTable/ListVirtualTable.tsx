import { Empty, Table } from 'antd';
import type { TableProps } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import {
  getHorizontalMetrics,
  getHorizontalVisibleRange,
  shouldSyncHorizontalScroll,
} from './listVirtualUtils';
import baseStyles from './index.module.less';
import styles from './ListVirtualTable.module.less';

type ColumnWidth = string | number | undefined;
type AnyRecord = Record<string, any>;

const ROW_HEIGHT = 40;
const HORIZONTAL_OVERSCAN = 1;
const percentageRegex = /^(100|[1-9]?\d(\.\d+)?)%$/;

const parseColumnWidth = (width: ColumnWidth, baseWidth: number) => {
  if (!width) {
    return 0;
  }
  if (typeof width === 'string' && percentageRegex.test(width)) {
    return (parseFloat(width) * baseWidth) / 100;
  }
  return parseFloat(`${width}`);
};

const ListVirtualTable = <RecordType extends object>(
  props: TableProps<RecordType>,
) => {
  const { columns = [], scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const listRef = useRef<List>(null);
  const listOuterRef = useRef<HTMLDivElement | null>(null);
  const headerOnScrollRef = useRef<(event: { scrollLeft: number }) => void>();
  const rafIdRef = useRef<number | null>(null);
  const syncedScrollLeftRef = useRef(0);

  const gridHeight = Number(scroll?.y || 0);

  const noWidthColumnCount = useMemo(
    () => columns.filter(({ width }) => !width).length,
    [columns],
  );

  const fixedWidth = useMemo(() => {
    return columns.reduce((total, { width }) => {
      if (!width) {
        return total;
      }
      return total + parseColumnWidth(width, tableWidth);
    }, 0);
  }, [columns, tableWidth]);

  const mergedColumns = useMemo(() => {
    return columns.map((column) => {
      if (noWidthColumnCount === 0 && fixedWidth <= tableWidth) {
        const remainingWidth = parseFloat(
          ((tableWidth - fixedWidth) / columns.length).toFixed(2),
        );
        const width = parseColumnWidth(column.width, tableWidth);
        return {
          ...column,
          width: width + remainingWidth,
        };
      }
      if (column.width) {
        return { ...column, width: parseColumnWidth(column.width, tableWidth) };
      }
      return {
        ...column,
        width:
          fixedWidth < tableWidth
            ? Math.floor((tableWidth - fixedWidth) / noWidthColumnCount)
            : Math.floor(tableWidth / noWidthColumnCount),
      };
    });
  }, [columns, fixedWidth, noWidthColumnCount, tableWidth]);

  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        return listOuterRef.current?.scrollLeft ?? null;
      },
      set: (nextScrollLeft: number) => {
        if (listOuterRef.current) {
          if (
            !shouldSyncHorizontalScroll(
              listOuterRef.current.scrollLeft,
              nextScrollLeft,
              0,
            )
          ) {
            return;
          }
          listOuterRef.current.scrollLeft = nextScrollLeft;
          syncedScrollLeftRef.current = nextScrollLeft;
          setScrollLeft(nextScrollLeft);
        }
      },
    });
    return obj;
  });

  useEffect(() => {
    listRef.current?.resetAfterIndex(0, true);
  }, [tableWidth, mergedColumns]);

  useEffect(() => {
    const outer = listOuterRef.current;
    if (!outer) {
      return;
    }

    const handleScroll = () => {
      const nextScrollLeft = outer.scrollLeft;
      if (
        !shouldSyncHorizontalScroll(syncedScrollLeftRef.current, nextScrollLeft)
      ) {
        return;
      }
      syncedScrollLeftRef.current = nextScrollLeft;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        setScrollLeft(nextScrollLeft);
        headerOnScrollRef.current?.({ scrollLeft: nextScrollLeft });
      });
    };

    outer.addEventListener('scroll', handleScroll);
    return () => {
      outer.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [tableWidth, gridHeight, props.dataSource?.length]);

  const renderVirtualList = (
    rawData: object[],
    { scrollbarSize, ref, onScroll }: any,
  ) => {
    ref.current = connectObject;
    headerOnScrollRef.current = onScroll;
    const totalHeight = rawData.length * ROW_HEIGHT;
    const hasVerticalScrollbar = totalHeight > gridHeight;

    const columnWidths = mergedColumns.map((column, index) => {
      const base = parseFloat(`${column.width || 0}`);
      if (
        hasVerticalScrollbar &&
        index === mergedColumns.length - 1 &&
        base > scrollbarSize + 1
      ) {
        return base - scrollbarSize - 1;
      }
      return base;
    });

    const { columnOffsets, totalWidth } = getHorizontalMetrics(columnWidths);
    const { start, end } = getHorizontalVisibleRange({
      columnWidths,
      scrollLeft,
      viewportWidth: tableWidth,
      overscan: HORIZONTAL_OVERSCAN,
    });

    return (
      <List
        ref={listRef}
        className={baseStyles['virtual-grid']}
        height={gridHeight}
        itemCount={rawData.length}
        itemSize={() => ROW_HEIGHT}
        outerRef={listOuterRef}
        width={tableWidth}
      >
        {({ index, style }: { index: number; style: React.CSSProperties }) => {
          const record = rawData[index] as AnyRecord;
          return (
            <div style={style}>
              <div className={styles['list-row']} style={{ width: totalWidth }}>
                {Array.from(
                  { length: end - start + 1 },
                  (_, visibleColumnOffset) => {
                    const columnIndex = start + visibleColumnOffset;
                    const currentColumn = mergedColumns[
                      columnIndex
                    ] as AnyRecord;
                    const defaultText = record?.[currentColumn?.dataIndex];
                    const content = currentColumn?.render
                      ? currentColumn.render(defaultText, record)
                      : defaultText;
                    return (
                      <div
                        key={`${index}-${columnIndex}`}
                        className={styles['list-cell']}
                        style={{
                          left: columnOffsets[columnIndex],
                          width: columnWidths[columnIndex],
                        }}
                        title={
                          ['string', 'number'].includes(typeof content)
                            ? String(content)
                            : ''
                        }
                      >
                        {content}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          );
        }}
      </List>
    );
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className={baseStyles['virtual-table']}
        columns={mergedColumns}
        pagination={false}
        components={{
          // @ts-ignore
          body:
            props.dataSource?.length === 0
              ? () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              : renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
};

export default memo(ListVirtualTable);
