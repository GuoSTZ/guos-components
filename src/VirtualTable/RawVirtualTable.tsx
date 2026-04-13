/** 这个组件没有对列宽度进行处理，直接使用原始宽度，用于观察列宽度对滚动滚动的影响 */
import { Empty, Table } from 'antd';
import type { TableProps } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import React, { memo, useEffect, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styles from './index.module.less';

const RawVirtualTable = <RecordType extends object>(
  props: TableProps<RecordType>,
) => {
  const { columns = [], scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);

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
        columnCount={columns.length}
        columnWidth={(index: number) => {
          const width = Number.parseFloat(`${columns[index]?.width ?? 0}`);
          return totalHeight > Number(scroll?.y || 0) &&
            index === columns.length - 1
            ? width - scrollbarSize - 1
            : width;
        }}
        height={Number(scroll?.y || 0)}
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
          const currentColumn: any = columns[columnIndex];
          const defaultText = record?.[currentColumn?.dataIndex];
          const content = currentColumn?.render
            ? currentColumn.render(defaultText, record)
            : defaultText;
          return (
            <div
              className={
                columnIndex === columns.length - 1
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
        columns={columns}
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

export default memo(RawVirtualTable);
