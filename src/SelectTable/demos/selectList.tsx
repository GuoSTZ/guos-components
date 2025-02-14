import React, { useCallback } from 'react';
import SelectList from '../SelectList';
const App = () => {
  const dataSource = new Array(10000).fill(0).map((item, index) => {
    return {
      schema: `test${index}`,
    };
  });

  const mockFetchSchema = useCallback((params: any) => {
    const { pageSize, current, keyword, isPage } = params;
    console.log('params=========', params);
    // 模拟后端检索
    let data = dataSource;
    if (keyword) {
      data = data.filter((item) =>
        item.schema?.toLowerCase().includes(keyword?.toLowerCase()),
      );
    }
    let pageData = data;
    if (isPage || isPage === undefined) {
      pageData = data.slice((current - 1) * pageSize, current * pageSize);
    }
    // 模拟前端获取接口返回数据后的数据处理流程
    let result: any[] = pageData.map((item) => {
      return {
        ...item,
        key: item.schema,
        name: item.schema,
      };
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          pageSize,
          current,
          total: data.length,
          items: result,
        });
      }, 100);
    });
  }, []);

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <SelectList fetchData={mockFetchSchema} virtual />
      <SelectList fetchData={mockFetchSchema} />
      <SelectList fetchData={mockFetchSchema} checkable />
    </div>
  );
};
export default App;
