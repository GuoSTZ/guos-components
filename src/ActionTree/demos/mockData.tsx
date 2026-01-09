export const mockData = [
  {
    title: '资产根目录',
    key: '0',
    type: 'directory',
    default: true,
    children: [
      {
        title: '业务资产1',
        key: '0-0',
        type: 'dbGroup',
        children: [
          {
            title: '这是数据库名称1',
            key: '0-0-0',
            type: 'db',
            children: [
              {
                title: '默认集合组',
                key: '0-0-0-0',
                type: 'assetSetGroup',
                default: true,
              },
              {
                title: '自定义集合组名称',
                key: '0-0-0-1',
                type: 'assetSetGroup',
              },
              {
                title:
                  '自定义集合组名称太长名称太长名称太长名称太长名称太长名称太长',
                key: '0-0-0-2',
                type: 'assetSetGroup',
                children: [
                  {
                    title: '默认资产集合',
                    key: '0-0-0-2-0',
                    type: 'assetSet',
                    default: true,
                    badge: {
                      // 这里如果后续有类似角标需求可扩展，当前原结构无严格对应，先保留结构示例，若不需要可删除此属性
                      count: 3,
                    },
                  },
                  {
                    title:
                      '资产集合名称太长名称太长名称太长名称太长名称太长名称太长',
                    key: '0-0-0-2-1',
                    type: 'assetSet',
                    badge: {
                      count: 1,
                    },
                  },
                  {
                    title: '未分级资产',
                    key: '0-0-0-2-2',
                    type: 'assetSet',
                    badge: {
                      count: 0, // 这里未分级资产原图无角标数字，假设为0，可根据实际情况修改
                    },
                  },
                ],
              },
            ],
          },
          {
            title: '这是数据库名称2',
            key: '0-0-1',
            type: 'db',
            children: [
              {
                title: '默认集合组',
                key: '0-0-1-0',
                type: 'assetSetGroup',
                default: true,
              },
              {
                title: '自定义集合组名称',
                key: '0-0-1-1',
                type: 'assetSetGroup',
              },
              {
                title:
                  '自定义集合组名称太长名称太长名称太长名称太长名称太长名称太长',
                key: '0-0-1-2',
                type: 'assetSetGroup',
                children: [
                  {
                    title: '默认资产集合',
                    key: '0-0-1-2-0',
                    type: 'assetSet',
                    default: true,
                    badge: {
                      count: 3,
                    },
                  },
                  {
                    title:
                      '资产集合名称太长名称太长名称太长名称太长名称太长名称太长名称太长名称太长名称太长名称太长',
                    key: '0-0-1-2-1',
                    type: 'assetSet',
                    badge: {
                      count: 1,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: '未分配业务资产',
        key: '0-1',
        type: 'dbGroup',
        children: [
          {
            title: '这是数据库名称3',
            key: '0-1-0',
            type: 'db',
            children: [
              {
                title: '默认集合组',
                key: '0-1-0-0',
                type: 'assetSetGroup',
                default: true,
              },
              {
                title: '自定义集合组名称',
                key: '0-1-0-1',
                type: 'assetSetGroup',
              },
              {
                title:
                  '自定义集合组名称太长名称太长名称太长名称太长名称太长名称太长',
                key: '0-1-0-2',
                type: 'assetSetGroup',
                children: [
                  {
                    title: '默认资产集合',
                    key: '0-1-0-2-0',
                    type: 'assetSet',
                    default: true,
                    badge: {
                      // 这里如果后续有类似角标需求可扩展，当前原结构无严格对应，先保留结构示例，若不需要可删除此属性
                      count: 3,
                    },
                  },
                  {
                    title:
                      '资产集合名称太长名称太长名称太长名称太长名称太长名称太长',
                    key: '0-1-0-2-1',
                    type: 'assetSet',
                    badge: {
                      count: 1,
                    },
                  },
                  {
                    title: '未分级资产',
                    key: '0-1-0-2-2',
                    type: 'assetSet',
                    badge: {
                      count: 0, // 这里未分级资产原图无角标数字，假设为0，可根据实际情况修改
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: '自定义资产目录',
    key: '2',
    type: 'directory',
    children: [
      {
        title: '业务资产2',
        key: '2-0',
        type: 'dbGroup',
        children: [
          {
            title: '这是数据库名称4',
            key: '2-0-0',
            type: 'db',
            children: [
              {
                title: '默认集合组',
                key: '2-0-0-0',
                type: 'assetSetGroup',
                default: true,
              },
              {
                title: '自定义集合组名称',
                key: '2-0-0-1',
                type: 'assetSetGroup',
              },
              {
                title:
                  '自定义集合组名称太长名称太长名称太长名称太长名称太长名称太长',
                key: '2-0-0-2',
                type: 'assetSetGroup',
                children: [
                  {
                    title: '默认资产集合',
                    key: '2-0-0-2-0',
                    type: 'assetSet',
                    default: true,
                    badge: {
                      count: 3,
                    },
                  },
                  {
                    title:
                      '资产集合名称太长名称太长名称太长名称太长名称太长名称太长',
                    key: '2-0-0-2-1',
                    type: 'assetSet',
                    badge: {
                      count: 1,
                    },
                  },
                  {
                    title: '未分级资产',
                    key: '2-0-0-2-2',
                    type: 'assetSet',
                    badge: {
                      count: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
