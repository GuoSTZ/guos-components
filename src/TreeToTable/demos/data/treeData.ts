/** 一层 */
export const treeData_1_level = [
  {
    key: 1,
    title: '节点1',
  },
  {
    key: 2,
    title: '节点2',
  },
  {
    key: 3,
    title: '节点3',
  },
  {
    key: 4,
    title: '节点4',
  },
  {
    key: 5,
    title: '节点5',
  },
  {
    key: 6,
    title: '节点6',
  },
  {
    key: 7,
    title: '节点7',
  },
  {
    key: 8,
    title: '节点8',
  },
  {
    key: 9,
    title: '节点9',
  },
  {
    key: 10,
    title: '节点10',
  },
  {
    key: 11,
    title: '节点11',
  },
  {
    key: 12,
    title: '节点12',
  },
  {
    key: 13,
    title: '节点13',
  },
  {
    key: 14,
    title: '节点14',
  },
  {
    key: 15,
    title: '节点15',
  },
];

/** 两层 */
export const treeData_2_level = [
  {
    id: 1,
    name: '父节点1',
    children: [
      {
        id: 2,
        name: '子节点1',
      },
      {
        id: 3,
        name: '子节点2',
      },
    ],
  },
  {
    id: 4,
    name: '父节点2',
    children: [
      {
        id: 5,
        name: '子节点3',
      },
      {
        id: 6,
        name: '子节点4',
      },
    ],
  },
  {
    id: 7,
    name: '独立节点',
  },
];

/** 三层 */
export const treeData_3_level = [
  {
    id: 1,
    name: '父节点1',
    children: [
      {
        id: 2,
        name: '子节点1',
        children: [
          {
            id: 3,
            name: '子节点2',
          },
          {
            id: 4,
            name: '子节点3',
          },
        ],
      },
      {
        id: 5,
        name: '子节点4',
        children: [
          {
            id: 6,
            name: '子节点5',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: '父节点2',
    children: [
      {
        id: 8,
        name: '子节点6',
      },
      {
        id: 9,
        name: '子节点7',
      },
    ],
  },
  {
    id: 10,
    name: '独立节点',
  },
];

/** 四层 */
export const treeData_4_level = [
  {
    id: 1,
    name: '父节点1',
    children: [
      {
        id: 2,
        name: '子节点1',
        children: [
          {
            id: 3,
            name: '子节点2',
            children: [
              {
                id: 4,
                name: '子节点3',
              },
              {
                id: 5,
                name: '子节点4',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: '父节点2',
    children: [
      {
        id: 7,
        name: '子节点5',
        children: [
          {
            id: 8,
            name: '子节点6',
            children: [
              {
                id: 9,
                name: '子节点7',
              },
              {
                id: 10,
                name: '子节点8',
              },
              {
                id: 11,
                name: '子节点9',
              },
            ],
          },
        ],
      },
      {
        id: 12,
        name: '子节点10',
        children: [
          {
            id: 13,
            name: '子节点11',
            children: [
              {
                id: 14,
                name: '子节点12',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 15,
    name: '独立节点',
  },
];

/** 四层，子数据字段为child */
export const treeData_4_level_child = [
  {
    id: 1,
    name: '父节点1',
    checkable: false,
    child: [
      {
        id: 2,
        name: '子节点1',
        child: [
          {
            id: 3,
            name: '子节点2',
            child: [
              {
                id: 4,
                name: '子节点3',
              },
              {
                id: 5,
                name: '子节点4',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: '父节点2',
    checkable: false,
    child: [
      {
        id: 7,
        name: '子节点5',
        child: [
          {
            id: 8,
            name: '子节点6',
            child: [
              {
                id: 9,
                name: '子节点7',
              },
              {
                id: 10,
                name: '子节点8',
              },
              {
                id: 11,
                name: '子节点9',
              },
            ],
          },
        ],
      },
      {
        id: 12,
        name: '子节点10',
        child: [
          {
            id: 13,
            name: '子节点11',
            child: [
              {
                id: 14,
                name: '子节点12',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 15,
    name: '独立节点',
  },
];
