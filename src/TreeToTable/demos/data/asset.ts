/** 转换 数据库/资产集合组/资产集合 数据 */
export const transferAssetData = (data: any[], pInfo = {}) => {
  return data.map((item) => {
    const newItem = {
      ...item,
      ...pInfo,
      key: `${item.id}-${item.type}`,
      title: item.name,
    };
    if (item.children) {
      newItem.children = transferAssetData(item.children, {
        dbName: newItem.dbName,
        assetGroupName: newItem.assetGroupName,
      });
    }
    return newItem;
  });
};

/** 转换 数据库分组/数据库 数据 */
export const transferGroupData = (data: any[], pInfo = {}) => {
  return data.map((item) => {
    const newItem = {
      ...item,
      ...pInfo,
      key: `${item.id}-${item.type}`,
      title: item.name,
    };
    if (item.children) {
      newItem.children = transferAssetData(item.children, {
        dbGroupName: newItem.dbGroupName,
      });
    }
    return newItem;
  });
};

/** 转换 数据库类型/数据库 数据 */
export const transferTypeData = (data: any[], pInfo = {}) => {
  return data.map((item) => {
    const newItem = {
      ...item,
      ...pInfo,
      key: `${item.id}-${item.type}`,
      title: item.name,
    };
    if (item.children) {
      newItem.children = transferAssetData(item.children, {
        label: newItem.label,
      });
    }
    return newItem;
  });
};

/** 资产相关数据 */
export const asset_data = transferAssetData([
  {
    id: 1,
    type: 'db',
    name: '数据库名称1',
    dbId: 1,
    dbName: '数据库名称1',
    children: [
      {
        id: 1,
        type: 'assetGroup',
        name: '默认资产集合组ORCLE',
        assetGroupId: 1,
        assetGroupName: '默认资产集合组ORCLE',
        children: [],
      },
      {
        id: 2,
        type: 'assetGroup',
        name: '资产集合组21',
        dbId: 1,
        assetGroupId: 2,
        assetGroupName: '资产集合组21',
        children: [
          {
            id: 1,
            type: 'asset',
            name: '资产集合2',
            dbId: 1,
            assetGroupId: 2,
            assetId: 1,
            assetName: '资产集合2',
            sensitiveTag: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    type: 'db',
    name: '数据库名称3',
    dbId: 2,
    dbName: '数据库名称3',
    children: [
      {
        id: 3,
        type: 'assetGroup',
        name: '默认资产集合组MySQL',
        dbId: 2,
        assetGroupName: '默认资产集合组MySQL',
        children: [],
      },
      {
        id: 4,
        type: 'assetGroup',
        name: '资产集合组222',
        dbId: 2,
        assetGroupName: '资产集合组222',
        children: [
          {
            id: 2,
            type: 'asset',
            name: '资产集合2221',
            dbId: 2,
            assetGroupId: 2,
            assetId: 2,
            assetName: '资产集合2221',
            sensitiveTag: 2,
          },
          {
            id: 3,
            type: 'asset',
            name: '资产集合2222',
            dbId: 2,
            assetGroupId: 2,
            assetId: 3,
            assetName: '资产集合2222',
            sensitiveTag: 3,
          },
          {
            id: 4,
            type: 'asset',
            name: '资产集合2223',
            dbId: 2,
            assetGroupId: 2,
            assetId: 4,
            assetName: '资产集合2223',
            sensitiveTag: 4,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    type: 'db',
    name: '数据库名称2',
    dbId: 3,
    dbName: '数据库名称2',
    children: [
      {
        id: 5,
        type: 'assetGroup',
        name: '默认资产集合组MySQL2',
        dbId: 3,
        assetGroupName: '默认资产集合组MySQL2',
        children: [
          {
            id: 5,
            type: 'asset',
            name: '资产集合mysql201',
            dbId: 3,
            assetGroupId: 5,
            assetId: 5,
            assetName: '资产集合mysql201',
            sensitiveTag: 5,
          },
        ],
      },
      {
        id: 6,
        name: '资产集合组666',
        dbId: 3,
        assetGroupName: '资产集合组666',
        children: [
          {
            id: 6,
            type: 'asset',
            name: '资产集合6661',
            dbId: 3,
            assetGroupId: 6,
            assetId: 6,
            assetName: '资产集合6661',
            sensitiveTag: 1,
          },
          {
            id: 7,
            type: 'asset',
            name: '资产集合6662',
            dbId: 3,
            assetGroupId: 6,
            assetId: 7,
            assetName: '资产集合6662',
            sensitiveTag: 2,
          },
        ],
      },
    ],
  },
]);

/** 分组相关数据 */
export const db_group_data = transferGroupData([
  {
    id: 1,
    type: 'dbGroup',
    name: '分组1',
    dbGroupName: '分组1',
    dbGroupId: 1,
    children: [
      {
        id: 1,
        type: 'db',
        name: '数据库名称1',
        dbId: 1,
        dbName: '数据库名称1',
      },
      {
        id: 2,
        type: 'db',
        name: '数据库名称2',
        dbId: 2,
        dbName: '数据库名称2',
      },
    ],
  },
  {
    id: 2,
    type: 'dbGroup',
    name: '分组2',
    dbGroupName: '分组2',
    children: [
      {
        id: 3,
        type: 'db',
        name: '数据库名称3',
        dbId: 3,
        dbName: '数据库名称3',
      },
      {
        id: 4,
        type: 'db',
        name: '数据库名称4',
        dbId: 4,
        dbName: '数据库名称4',
      },
      {
        id: 5,
        type: 'db',
        name: '数据库名称5',
        dbId: 5,
        dbName: '数据库名称5',
      },
    ],
  },
  {
    id: 3,
    type: 'dbGroup',
    name: '分组3',
    dbGroupName: '分组3',
    children: [
      {
        id: 6,
        type: 'db',
        name: '数据库名称6',
        dbId: 6,
        dbName: '数据库名称6',
      },
    ],
  },
]);

/** 数据库类型相关数据 */
export const db_type = transferTypeData([
  {
    id: 3507,
    type: 'type',
    name: 'MySql',
    label: 'MySql',
    value: 'Mysql',
    children: [
      {
        id: 1,
        type: 'db',
        name: 'mysql_test_1',
        dbId: 1,
        dbName: 'mysql_test_1',
      },
      {
        id: 2,
        type: 'db',
        name: 'mysql_test_2',
        dbId: 2,
        dbName: 'mysql_test_2',
      },
    ],
  },
  {
    id: 3510,
    type: 'type',
    name: 'Oracle',
    label: 'Oracle',
    value: 'Oracle',
    children: [
      {
        id: 3,
        type: 'db',
        name: 'oracle_test_3',
        dbId: 3,
        dbName: 'oracle_test_3',
      },
      {
        id: 4,
        type: 'db',
        name: 'oracle_test_4',
        dbId: 4,
        dbName: 'oracle_test_4',
      },
    ],
  },
  {
    id: 3514,
    type: 'type',
    name: 'Sqlserver',
    label: 'Sqlserver',
    value: 'Mssql',
    children: [
      {
        id: 5,
        type: 'db',
        name: 'Sqlserver_test_5',
        dbId: 5,
        dbName: 'Sqlserver_test_5',
      },
      {
        id: 6,
        type: 'db',
        name: 'Sqlserver_test_6',
        dbId: 6,
        dbName: 'Sqlserver_test_6',
      },
      {
        id: 7,
        type: 'db',
        name: 'Sqlserver_test_7',
        dbId: 7,
        dbName: 'Sqlserver_test_7',
      },
    ],
  },
  {
    id: 3517,
    type: 'type',
    name: 'Db2',
    label: 'Db2',
    value: 'Db2',
    children: [
      {
        id: 8,
        type: 'db',
        name: 'DB2_test_8',
        dbId: 8,
        dbName: 'DB2_test_8',
      },
    ],
  },
  {
    id: 3521,
    type: 'type',
    name: 'PostgreSQL',
    label: 'PostgreSQL',
    value: 'Pgsql',
    children: [
      {
        id: 9,
        type: 'db',
        name: 'PostgreSQL_test_9',
        dbId: 9,
        dbName: 'PostgreSQL_test_9',
      },
    ],
  },
]);
