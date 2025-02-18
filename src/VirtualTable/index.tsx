import { Table, Empty } from 'antd';
import type { TableProps } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styles from './index.module.less';

const percentageRegex = /^(100|[1-9]?\d(\.\d+)?)%$/;

const VirtualTable = <RecordType extends object>(
  props: TableProps<RecordType>,
) => {
  const { columns = [], scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);

  /** 未设置列宽的列数 */
  const widthColumnCount = useMemo(
    () => columns.filter(({ width }) => !width).length,
    [columns],
  );

  /** 定宽 */
  const fixedWidth = useMemo(() => {
    return columns.reduce((total, { width }) => {
      if (!!width) {
        if (typeof width === 'string' && percentageRegex.test(width)) {
          return total + (parseFloat(width) * tableWidth) / 100;
        } else {
          return total + parseFloat(`${width || 0}`);
        }
      }
      return total;
    }, 0);
  }, [columns, tableWidth]);

  /** 处理后的columns数组 */
  const mergedColumns = useMemo(() => {
    return columns.map((column) => {
      // 当所有列都设置了宽度，但总宽度小于等于表格时，均分剩余宽度
      if (fixedWidth <= tableWidth && widthColumnCount === 0) {
        const remainingWidth = parseFloat(
          ((tableWidth - fixedWidth) / columns.length).toFixed(2),
        );
        let width = parseFloat(`${column.width || 0}`);
        if (
          typeof column.width === 'string' &&
          percentageRegex.test(column.width)
        ) {
          width = (parseFloat(column.width) * tableWidth) / 100;
        }
        return {
          ...column,
          width: width + remainingWidth,
        };
      } else if (column.width) {
        // 仅部分列设置宽度，对宽度进行计算
        if (
          typeof column.width === 'string' &&
          percentageRegex.test(column.width)
        ) {
          const width = (parseFloat(column.width) * tableWidth) / 100;
          return { ...column, width };
        } else {
          return { ...column, width: parseFloat(`${column.width || 0}`) };
        }
      } else {
        /**
         * 部分列未设置定宽时
         * 如果定宽已经超出表格宽，则每列宽度为【表格宽/未设置宽度列数】
         * 如果定宽没有超出表格宽，则每列宽度为【（表格宽-定宽）/未设置宽度列数】
         */
        return {
          ...column,
          width:
            fixedWidth < tableWidth
              ? Math.floor((tableWidth - fixedWidth) / widthColumnCount)
              : Math.floor(tableWidth / widthColumnCount),
        };
      }
    });
  }, [columns, fixedWidth, tableWidth, widthColumnCount]);

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
    console.log(rawData, '=======raw');
    return (
      <Grid
        ref={gridRef}
        className={styles['virtual-grid']}
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          let computedWidth = parseFloat(`${width || 0}`);
          if (typeof width === 'string' && percentageRegex.test(width)) {
            computedWidth = ((tableWidth - 15) * parseFloat(width)) / 100;
          }
          return totalHeight > Number(scroll!.y!) &&
            index === mergedColumns.length - 1
            ? computedWidth - scrollbarSize - 1
            : computedWidth;
        }}
        height={scroll!.y as number}
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

export default memo(VirtualTable);
