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
                      count: 0,
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
].map((item: any) => {
  // 递归处理树节点，给 type 为 assetSet 的节点增加随机 ruleType 和 tag
  const processNode = (node: any) => {
    if (node.type === 'assetSet') {
      const ruleType = Math.random() > 0.5 ? 1 : 2;
      let assetTag = null;

      // ruleType 为 1 时，tag 在 1-5 和 null 之间随机
      if (ruleType === 1) {
        // 1-5 加上 null 共 6 种情况
        const rand = Math.floor(Math.random() * 6); // 0-5
        assetTag = rand === 0 ? null : rand; // 0 为 null, 1-5 为值
      }
      // ruleType 为 2 时，tag 在 1-3 和 null 之间随机
      else {
        // 1-3 加上 null 共 4 种情况
        const rand = Math.floor(Math.random() * 4); // 0-3
        assetTag = rand === 0 ? null : rand; // 0 为 null, 1-3 为值
      }

      node.ruleType = ruleType;
      node.assetTag = assetTag;
    }

    if (node.children) {
      node.children.forEach(processNode);
    }
    return node;
  };

  return processNode(item);
});
