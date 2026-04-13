export type DemoRecord = {
  key: string;
  name: string;
  department: string;
  owner: string;
  status: string;
  size: string;
  updatedAt: string;
  remark: string;
};

export const buildDemoDataSource = (): DemoRecord[] => {
  const statusList = ['处理中', '已完成', '失败', '排队中'];

  return Array.from({ length: 120 }, (_, index) => ({
    key: `row-${index + 1}`,
    name: `任务-${index + 1}`,
    department: ['前端组', '后端组', '数据组'][index % 3],
    owner: `owner_${(index % 15) + 1}`,
    status: statusList[index % statusList.length],
    size: `${(index % 500) + 50}MB`,
    updatedAt: `2026-04-${String((index % 28) + 1).padStart(2, '0')} 10:${
      (index % 6) * 10
    }`,
    remark: `这是第 ${index + 1} 条记录，用于观察列宽场景表现。`,
  }));
};
