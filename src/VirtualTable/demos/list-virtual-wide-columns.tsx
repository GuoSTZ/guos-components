import { Typography } from 'antd';
import ListVirtualTable from '../ListVirtualTable';
import React, { useMemo } from 'react';

const { Paragraph } = Typography;

type WideRecord = {
  key: string;
  [key: string]: string;
};

const buildWideDataSource = (): WideRecord[] => {
  return Array.from({ length: 200 }, (_, rowIndex) => {
    const row: WideRecord = { key: `row-${rowIndex + 1}` };
    for (let columnIndex = 1; columnIndex <= 18; columnIndex += 1) {
      row[`c${columnIndex}`] = `R${rowIndex + 1}-C${columnIndex}`;
    }
    return row;
  });
};

const App = () => {
  const dataSource = useMemo(() => buildWideDataSource(), []);
  const columns = useMemo(() => {
    return Array.from({ length: 18 }, (_, index) => {
      const dataIndex = `c${index + 1}`;
      return {
        title: `列${index + 1}`,
        dataIndex,
        width: index % 3 === 0 ? 120 : index % 3 === 1 ? 180 : 240,
      };
    });
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Paragraph type="secondary">
        宽列压力场景：列宽总和远超容器时，观察横向滚动滑块是否保持稳定。
      </Paragraph>
      <ListVirtualTable
        rowKey="key"
        scroll={{ y: 500 }}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default App;
