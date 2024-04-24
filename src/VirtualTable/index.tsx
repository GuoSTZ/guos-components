import { Table } from 'antd';
import type { TableProps } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import React, { memo, useEffect, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styles from './index.module.less';

const VirtualTable = <RecordType extends object>(
  props: TableProps<RecordType>,
) => {
  const { columns = [], scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);

  const widthColumnCount = columns!.filter(({ width }) => !width).length;
  const mergedColumns = columns!.map((column) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

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

  useEffect(() => resetVirtualGrid, [tableWidth]);

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
          return totalHeight > Number(scroll!.y!) &&
            index === mergedColumns.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number);
        }}
        height={scroll!.y as number}
        rowCount={rawData.length}
        rowHeight={() => 40}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft });
        }}
        style={{ overflowX: 'hidden' }}
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
              title={content}
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
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
};

export default memo(VirtualTable);
