export const mockData = [
  // {
  //   label: '选项1',
  //   value: 1,
  //   descriptions: [
  //     {label: '查询(select)', value: '结果明文'},
  //     {label: '插入(insert)', value: '授权'},
  //     {label: '更新(update)', value: '授权'},
  //     {label: '删除(delete)', value: '授权'},
  //     {label: '复制(copy)', value: '授权'},
  //   ]
  // },
  // {
  //   label: '选项2',
  //   value: 2,
  //   descriptions: {
  //     select: 1,
  //     insert: 1,
  //     update: 1,
  //     delete: 1,
  //     copy: 1,
  //   }
  // },
  {
    label: '选项a',
    value: 1,
    descriptions: [
      { label: 'select', value: 1 },
      { label: 'insert', value: 2 },
      { label: 'update', value: 2 },
      { label: 'delete', value: 2 },
      { label: 'copy', value: 2 },
    ],
  },
  {
    label: '选项b',
    value: 2,
    descriptions: [
      { label: 'select', value: 1 },
      { label: 'insert', value: 2 },
      { label: 'update', value: 2 },
      { label: 'delete', value: 2 },
      { label: 'copy', value: 2 },
    ],
  },
  {
    label: '选项c',
    value: 3,
    descriptions: [
      { label: 'select', value: 1 },
      { label: 'insert', value: 2 },
      { label: 'update', value: 3 },
      { label: 'delete', value: 2 },
      { label: 'copy', value: 1 },
    ],
  },
  {
    label: '选项d-详情信息顺序不一致',
    value: 4,
    descriptions: [
      { label: 'delete', value: 4 },
      { label: 'select', value: 0 },
      { label: 'update', value: 2 },
      { label: 'copy', value: 3 },
      { label: 'insert', value: 2 },
    ],
  },
];
