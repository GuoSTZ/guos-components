import { Empty, Table } from 'antd';
import type { TableProps } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styles from './index.module.less';

const percentageRegex = /^(100|[1-9]?\d(\.\d+)?)%$/;

type ColumnWidth = string | number | undefined;

const parseColumnWidth = (width: ColumnWidth, baseWidth: number) => {
  if (!width) {
    return 0;
  }
  if (typeof width === 'string' && percentageRegex.test(width)) {
    return (parseFloat(width) * baseWidth) / 100;
  }
  return parseFloat(`${width}`);
};

const ScrollXVirtualTable = <RecordType extends object>(
  props: TableProps<RecordType>,
) => {
  const { columns = [], scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);

  /** 当scroll.x为数字时，优先按scroll.x作为列宽分配基准，行为更接近antd */
  const baseWidth =
    typeof scroll?.x === 'number' && scroll.x > 0 ? scroll.x : tableWidth;
  const gridHeight =
    typeof scroll?.y === 'number' ? scroll.y : Number(scroll?.y || 0);

  /** 未设置列宽的列数 */
  const noWidthColumnCount = useMemo(
    () => columns.filter(({ width }) => !width).length,
    [columns],
  );

  /** 对于设置了百分比或者固定宽度的列，计算其总宽度 */
  const fixedWidth = useMemo(() => {
    return columns.reduce((total, { width }) => {
      if (!width) {
        return total;
      }
      return total + parseColumnWidth(width, baseWidth);
    }, 0);
  }, [columns, baseWidth]);

  /** 处理后的columns数组，因为Grid组件需要每个列都有宽度，且仅接受数字类型的宽度 */
  const mergedColumns = useMemo(() => {
    return columns.map((column) => {
      // 当所有列都设置了宽度，但总宽度小于等于基准宽度时，均分剩余宽度
      if (noWidthColumnCount === 0 && fixedWidth <= baseWidth) {
        const remainingWidth = parseFloat(
          ((baseWidth - fixedWidth) / columns.length).toFixed(2),
        );
        const width = parseColumnWidth(column.width, baseWidth);
        return {
          ...column,
          width: width + remainingWidth,
        };
      }
      // 当该列有设置宽度时，根据传入的值进行转换处理
      if (column.width) {
        return { ...column, width: parseColumnWidth(column.width, baseWidth) };
      }
      /**
       * 对于未设置宽度的列，根据fixedWidth（定宽）和baseWidth（宽度预算），以下述方案进行宽度计算并设置
       * 1. 如果定宽没有超出宽度预算，则列宽度为【（宽度预算-定宽）/未设置宽度列数】
       * 2. 如果定宽已经超出宽度预算，则列宽度为【宽度预算/未设置宽度列数】
       */
      const fallbackWidth =
        fixedWidth < baseWidth
          ? Math.floor((baseWidth - fixedWidth) / noWidthColumnCount)
          : 0;
      return {
        ...column,
        width: fallbackWidth,
      };
    });
  }, [columns, fixedWidth, baseWidth, noWidthColumnCount]);

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });
    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  // 基准宽度或容器宽度变化后，重置Grid缓存，避免列宽错位
  useEffect(() => resetVirtualGrid, [baseWidth]);

  const renderVirtualList = (
    rawData: object[],
    { scrollbarSize, ref, onScroll }: any,
  ) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 40;
    return (
      <Grid
        ref={gridRef}
        className={styles['virtual-grid']}
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          const computedWidth = parseFloat(`${width || 0}`);
          return totalHeight > gridHeight && index === mergedColumns.length - 1
            ? computedWidth - scrollbarSize - 1
            : computedWidth;
        }}
        height={gridHeight}
        rowCount={rawData.length}
        rowHeight={() => 40}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft });
        }}
      >
        {({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number;
          rowIndex: number;
          style: React.CSSProperties;
        }) => {
          const record: any = rawData[rowIndex];
          const currentColumn: any = mergedColumns[columnIndex];
          const defaultText = record?.[currentColumn?.dataIndex];
          const content = currentColumn?.render
            ? currentColumn.render(defaultText, record)
            : defaultText;
          return (
            <div
              className={
                columnIndex === mergedColumns.length - 1
                  ? `${styles['virtual-table-cell']} ${styles['virtual-table-cell-last']}`
                  : styles['virtual-table-cell']
              }
              style={style}
              title={
                ['string', 'number'].includes(typeof content) ? content : ''
              }
            >
              {content}
            </div>
          );
        }}
      </Grid>
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
        className={styles['virtual-table']}
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

export default memo(ScrollXVirtualTable);
