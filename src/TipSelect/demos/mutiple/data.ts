const data = [
  {
    id: 26,
    templateName: '111',
    templateIntro: '',
    templateType: 2,
    isSys: 0,
    attr: null,
    dsCount: 0,
    dsType: 'all',
    control: 12,
    objectAttr: {
      '1205': [
        {
          action: 'DROP SCHEMA',
          actionChs: '删除SCHEMA',
          assetActionId: 9,
          status: 0,
        },
        {
          action: 'DROP DATABASE',
          actionChs: '删除数据库',
          assetActionId: 46,
          status: 0,
        },
        {
          action: 'ALTER DATABASE',
          actionChs: '修改数据库',
          assetActionId: 47,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA',
          actionChs: '修改SCHEMA',
          assetActionId: 80,
          status: 0,
        },
      ],
      '1204': [
        {
          action: 'DROP TABLESPACE',
          actionChs: '删除表空间',
          assetActionId: 44,
          status: 1,
        },
        {
          action: 'ALTER TABLESPACE',
          actionChs: '修改表空间',
          assetActionId: 45,
          status: 1,
        },
      ],
      '1203': [
        {
          action: 'DROP SYS TABLE',
          actionChs: '删除系统表格',
          assetActionId: 39,
          status: 1,
        },
        {
          action: 'TRUNCATE SYS TABLE',
          actionChs: '清空系统表数据',
          assetActionId: 41,
          status: 1,
        },
        {
          action: 'ALTER SYS TABLE',
          actionChs: '修改系统表格',
          assetActionId: 42,
          status: 1,
        },
      ],
      '1202': [
        {
          action: 'DROP SCHEMA TABLE',
          actionChs: '删除业务用户表格',
          assetActionId: 34,
          status: 1,
        },
        {
          action: 'TRUNCATE SCHEMA TABLE',
          actionChs: '清空业务用户表数据',
          assetActionId: 36,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA TABLE',
          actionChs: '修改业务用户表格',
          assetActionId: 37,
          status: 1,
        },
        {
          action: 'CREATE SCHEMA TABLE',
          actionChs: '创建业务用户表格',
          assetActionId: 83,
          status: 1,
        },
      ],
      '1201': [
        {
          action: 'DROP SENSITIVE TABLE',
          actionChs: '删除敏感表格',
          assetActionId: 28,
          status: 1,
        },
        {
          action: 'TRUNCATE SENSITIVE TABLE',
          actionChs: '清空敏感表数据',
          assetActionId: 30,
          status: 1,
        },
        {
          action: 'ALTER SENSITIVE TABLE',
          actionChs: '修改敏感表格',
          assetActionId: 31,
          status: 1,
        },
      ],
    },
    createTime: '2024-08-20 15:49:06',
  },
  {
    id: 13,
    templateName: '数据表可管理',
    templateIntro: '允许新建、修改、删除、清空所有数据表以及表空间。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 0,
    dsType: 'all',
    control: 12,
    objectAttr: {
      '1205': [
        {
          action: 'DROP SCHEMA',
          actionChs: '删除SCHEMA',
          assetActionId: 9,
          status: 1,
        },
        {
          action: 'DROP DATABASE',
          actionChs: '删除数据库',
          assetActionId: 46,
          status: 1,
        },
        {
          action: 'ALTER DATABASE',
          actionChs: '修改数据库',
          assetActionId: 47,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA',
          actionChs: '修改SCHEMA',
          assetActionId: 80,
          status: 1,
        },
      ],
      '1204': [
        {
          action: 'DROP TABLESPACE',
          actionChs: '删除表空间',
          assetActionId: 44,
          status: 1,
        },
        {
          action: 'ALTER TABLESPACE',
          actionChs: '修改表空间',
          assetActionId: 45,
          status: 1,
        },
      ],
      '1203': [
        {
          action: 'DROP SYS TABLE',
          actionChs: '删除系统表格',
          assetActionId: 39,
          status: 1,
        },
        {
          action: 'TRUNCATE SYS TABLE',
          actionChs: '清空系统表数据',
          assetActionId: 41,
          status: 1,
        },
        {
          action: 'ALTER SYS TABLE',
          actionChs: '修改系统表格',
          assetActionId: 42,
          status: 1,
        },
      ],
      '1202': [
        {
          action: 'DROP SCHEMA TABLE',
          actionChs: '删除业务用户表格',
          assetActionId: 34,
          status: 1,
        },
        {
          action: 'TRUNCATE SCHEMA TABLE',
          actionChs: '清空业务用户表数据',
          assetActionId: 36,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA TABLE',
          actionChs: '修改业务用户表格',
          assetActionId: 37,
          status: 1,
        },
        {
          action: 'CREATE SCHEMA TABLE',
          actionChs: '创建业务用户表格',
          assetActionId: 83,
          status: 1,
        },
      ],
      '1201': [
        {
          action: 'DROP SENSITIVE TABLE',
          actionChs: '删除敏感表格',
          assetActionId: 28,
          status: 1,
        },
        {
          action: 'TRUNCATE SENSITIVE TABLE',
          actionChs: '清空敏感表数据',
          assetActionId: 30,
          status: 1,
        },
        {
          action: 'ALTER SENSITIVE TABLE',
          actionChs: '修改敏感表格',
          assetActionId: 31,
          status: 1,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 12,
    templateName: '数据表可维护',
    templateIntro: '允许新建数据表，修改表空间。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 0,
    dsType: 'all',
    control: 12,
    objectAttr: {
      '1205': [
        {
          action: 'DROP SCHEMA',
          actionChs: '删除SCHEMA',
          assetActionId: 9,
          status: 0,
        },
        {
          action: 'DROP DATABASE',
          actionChs: '删除数据库',
          assetActionId: 46,
          status: 0,
        },
        {
          action: 'ALTER DATABASE',
          actionChs: '修改数据库',
          assetActionId: 47,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA',
          actionChs: '修改SCHEMA',
          assetActionId: 80,
          status: 0,
        },
      ],
      '1204': [
        {
          action: 'DROP TABLESPACE',
          actionChs: '删除表空间',
          assetActionId: 44,
          status: 0,
        },
        {
          action: 'ALTER TABLESPACE',
          actionChs: '修改表空间',
          assetActionId: 45,
          status: 1,
        },
      ],
      '1203': [
        {
          action: 'DROP SYS TABLE',
          actionChs: '删除系统表格',
          assetActionId: 39,
          status: 0,
        },
        {
          action: 'TRUNCATE SYS TABLE',
          actionChs: '清空系统表数据',
          assetActionId: 41,
          status: 0,
        },
        {
          action: 'ALTER SYS TABLE',
          actionChs: '修改系统表格',
          assetActionId: 42,
          status: 0,
        },
      ],
      '1202': [
        {
          action: 'DROP SCHEMA TABLE',
          actionChs: '删除业务用户表格',
          assetActionId: 34,
          status: 0,
        },
        {
          action: 'TRUNCATE SCHEMA TABLE',
          actionChs: '清空业务用户表数据',
          assetActionId: 36,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA TABLE',
          actionChs: '修改业务用户表格',
          assetActionId: 37,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA TABLE',
          actionChs: '创建业务用户表格',
          assetActionId: 83,
          status: 0,
        },
      ],
      '1201': [
        {
          action: 'DROP SENSITIVE TABLE',
          actionChs: '删除敏感表格',
          assetActionId: 28,
          status: 0,
        },
        {
          action: 'TRUNCATE SENSITIVE TABLE',
          actionChs: '清空敏感表数据',
          assetActionId: 30,
          status: 0,
        },
        {
          action: 'ALTER SENSITIVE TABLE',
          actionChs: '修改敏感表格',
          assetActionId: 31,
          status: 0,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 11,
    templateName: '数据表管理无权限',
    templateIntro:
      '不允许对任何数据表进行新建、修改和删除（drop/truncate）操作，且不允许对表空间进行修改和删除。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 20,
    dsType: 'all',
    control: 12,
    objectAttr: {
      '1205': [
        {
          action: 'DROP SCHEMA',
          actionChs: '删除SCHEMA',
          assetActionId: 9,
          status: 0,
        },
        {
          action: 'DROP DATABASE',
          actionChs: '删除数据库',
          assetActionId: 46,
          status: 0,
        },
        {
          action: 'ALTER DATABASE',
          actionChs: '修改数据库',
          assetActionId: 47,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA',
          actionChs: '修改SCHEMA',
          assetActionId: 80,
          status: 0,
        },
      ],
      '1204': [
        {
          action: 'DROP TABLESPACE',
          actionChs: '删除表空间',
          assetActionId: 44,
          status: 0,
        },
        {
          action: 'ALTER TABLESPACE',
          actionChs: '修改表空间',
          assetActionId: 45,
          status: 0,
        },
      ],
      '1203': [
        {
          action: 'DROP SYS TABLE',
          actionChs: '删除系统表格',
          assetActionId: 39,
          status: 0,
        },
        {
          action: 'TRUNCATE SYS TABLE',
          actionChs: '清空系统表数据',
          assetActionId: 41,
          status: 0,
        },
        {
          action: 'ALTER SYS TABLE',
          actionChs: '修改系统表格',
          assetActionId: 42,
          status: 0,
        },
      ],
      '1202': [
        {
          action: 'DROP SCHEMA TABLE',
          actionChs: '删除业务用户表格',
          assetActionId: 34,
          status: 0,
        },
        {
          action: 'TRUNCATE SCHEMA TABLE',
          actionChs: '清空业务用户表数据',
          assetActionId: 36,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA TABLE',
          actionChs: '修改业务用户表格',
          assetActionId: 37,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA TABLE',
          actionChs: '创建业务用户表格',
          assetActionId: 83,
          status: 0,
        },
      ],
      '1201': [
        {
          action: 'DROP SENSITIVE TABLE',
          actionChs: '删除敏感表格',
          assetActionId: 28,
          status: 0,
        },
        {
          action: 'TRUNCATE SENSITIVE TABLE',
          actionChs: '清空敏感表数据',
          assetActionId: 30,
          status: 0,
        },
        {
          action: 'ALTER SENSITIVE TABLE',
          actionChs: '修改敏感表格',
          assetActionId: 31,
          status: 0,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 10,
    templateName: '账号可管理',
    templateIntro: '允许对数据库用户、角色和密码进行创建、修改以及删除操作。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 0,
    dsType: 'all',
    control: 10,
    objectAttr: {
      '1001': [
        {
          action: 'CREATE USER',
          actionChs: '创建用户',
          assetActionId: 2,
          status: 1,
        },
        {
          action: 'DROP USER',
          actionChs: '删除用户',
          assetActionId: 3,
          status: 1,
        },
        {
          action: 'CREATE ROLE',
          actionChs: '创建角色',
          assetActionId: 4,
          status: 1,
        },
        {
          action: 'DROP ROLE',
          actionChs: '删除角色',
          assetActionId: 5,
          status: 1,
        },
        {
          action: 'CHANGE PASSWORD',
          actionChs: '更改密码',
          assetActionId: 6,
          status: 1,
        },
        {
          action: 'ALTER USER',
          actionChs: '修改用户',
          assetActionId: 7,
          status: 1,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 9,
    templateName: '账号管理可维护',
    templateIntro: '允许创建/修改数据库用户和更新密码。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 18,
    dsType: 'all',
    control: 10,
    objectAttr: {
      '1001': [
        {
          action: 'CREATE USER',
          actionChs: '创建用户',
          assetActionId: 2,
          status: 1,
        },
        {
          action: 'DROP USER',
          actionChs: '删除用户',
          assetActionId: 3,
          status: 0,
        },
        {
          action: 'CREATE ROLE',
          actionChs: '创建角色',
          assetActionId: 4,
          status: 0,
        },
        {
          action: 'DROP ROLE',
          actionChs: '删除角色',
          assetActionId: 5,
          status: 0,
        },
        {
          action: 'CHANGE PASSWORD',
          actionChs: '更改密码',
          assetActionId: 6,
          status: 1,
        },
        {
          action: 'ALTER USER',
          actionChs: '修改用户',
          assetActionId: 7,
          status: 1,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 8,
    templateName: '账号管理仅创建',
    templateIntro: '允许创建新的数据库用户或者角色。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 0,
    dsType: 'all',
    control: 10,
    objectAttr: {
      '1001': [
        {
          action: 'CREATE USER',
          actionChs: '创建用户',
          assetActionId: 2,
          status: 1,
        },
        {
          action: 'DROP USER',
          actionChs: '删除用户',
          assetActionId: 3,
          status: 0,
        },
        {
          action: 'CREATE ROLE',
          actionChs: '创建角色',
          assetActionId: 4,
          status: 1,
        },
        {
          action: 'DROP ROLE',
          actionChs: '删除角色',
          assetActionId: 5,
          status: 0,
        },
        {
          action: 'CHANGE PASSWORD',
          actionChs: '更改密码',
          assetActionId: 6,
          status: 0,
        },
        {
          action: 'ALTER USER',
          actionChs: '修改用户',
          assetActionId: 7,
          status: 0,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 7,
    templateName: '账号管理无权限',
    templateIntro: '不允许对数据库用户、角色以及密码进行操作。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 2,
    dsType: 'all',
    control: 10,
    objectAttr: {
      '1001': [
        {
          action: 'CREATE USER',
          actionChs: '创建用户',
          assetActionId: 2,
          status: 0,
        },
        {
          action: 'DROP USER',
          actionChs: '删除用户',
          assetActionId: 3,
          status: 0,
        },
        {
          action: 'CREATE ROLE',
          actionChs: '创建角色',
          assetActionId: 4,
          status: 0,
        },
        {
          action: 'DROP ROLE',
          actionChs: '删除角色',
          assetActionId: 5,
          status: 0,
        },
        {
          action: 'CHANGE PASSWORD',
          actionChs: '更改密码',
          assetActionId: 6,
          status: 0,
        },
        {
          action: 'ALTER USER',
          actionChs: '修改用户',
          assetActionId: 7,
          status: 0,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 6,
    templateName: '代码可管理',
    templateIntro:
      '允许对存储过程/函数/包/触发器和视图进行创建、修改和删除操作。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 0,
    dsType: 'all',
    control: 11,
    objectAttr: {
      '1103': [
        {
          action: 'DROP SCHEMA VIEW',
          actionChs: '删除业务用户视图',
          assetActionId: 22,
          status: 1,
        },
        {
          action: 'CREATE SCHEMA VIEW',
          actionChs: '创建业务用户视图',
          assetActionId: 23,
          status: 1,
        },
        {
          action: 'DROP SYS VIEW',
          actionChs: '删除系统视图',
          assetActionId: 24,
          status: 1,
        },
        {
          action: 'CREATE SYS VIEW',
          actionChs: '创建系统视图',
          assetActionId: 25,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA VIEW',
          actionChs: '修改业务用户视图',
          assetActionId: 26,
          status: 1,
        },
        {
          action: 'ALTER SYS VIEW',
          actionChs: '修改系统视图',
          assetActionId: 27,
          status: 1,
        },
      ],
      '1102': [
        {
          action: 'DROP SCHEMA TRIGGER',
          actionChs: '删除业务用户触发器',
          assetActionId: 16,
          status: 1,
        },
        {
          action: 'CREATE SCHEMA TRIGGER',
          actionChs: '创建业务用户触发器',
          assetActionId: 17,
          status: 1,
        },
        {
          action: 'DROP SYS TRIGGER',
          actionChs: '删除系统触发器',
          assetActionId: 18,
          status: 1,
        },
        {
          action: 'CREATE SYS TRIGGER',
          actionChs: '创建系统触发器',
          assetActionId: 19,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA TRIGGER',
          actionChs: '修改业务用户触发器',
          assetActionId: 20,
          status: 1,
        },
        {
          action: 'ALTER SYS TRIGGER',
          actionChs: '修改系统触发器',
          assetActionId: 21,
          status: 1,
        },
      ],
      '1101': [
        {
          action: 'DROP SCHEMA CODE',
          actionChs: '删除业务用户代码',
          assetActionId: 10,
          status: 1,
        },
        {
          action: 'CREATE SCHEMA CODE',
          actionChs: '创建业务用户代码',
          assetActionId: 11,
          status: 1,
        },
        {
          action: 'CREATE SYS CODE',
          actionChs: '创建系统代码',
          assetActionId: 12,
          status: 1,
        },
        {
          action: 'DROP SYS CODE',
          actionChs: '删除系统代码',
          assetActionId: 13,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA CODE',
          actionChs: '修改业务用户代码',
          assetActionId: 14,
          status: 1,
        },
        {
          action: 'ALTER SYS CODE',
          actionChs: '修改系统代码',
          assetActionId: 15,
          status: 1,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 5,
    templateName: '代码可维护',
    templateIntro: '允许对存储过程/函数/包/触发器和视图进行创建、修改操作。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 18,
    dsType: 'all',
    control: 11,
    objectAttr: {
      '1103': [
        {
          action: 'DROP SCHEMA VIEW',
          actionChs: '删除业务用户视图',
          assetActionId: 22,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA VIEW',
          actionChs: '创建业务用户视图',
          assetActionId: 23,
          status: 1,
        },
        {
          action: 'DROP SYS VIEW',
          actionChs: '删除系统视图',
          assetActionId: 24,
          status: 0,
        },
        {
          action: 'CREATE SYS VIEW',
          actionChs: '创建系统视图',
          assetActionId: 25,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA VIEW',
          actionChs: '修改业务用户视图',
          assetActionId: 26,
          status: 1,
        },
        {
          action: 'ALTER SYS VIEW',
          actionChs: '修改系统视图',
          assetActionId: 27,
          status: 1,
        },
      ],
      '1102': [
        {
          action: 'DROP SCHEMA TRIGGER',
          actionChs: '删除业务用户触发器',
          assetActionId: 16,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA TRIGGER',
          actionChs: '创建业务用户触发器',
          assetActionId: 17,
          status: 1,
        },
        {
          action: 'DROP SYS TRIGGER',
          actionChs: '删除系统触发器',
          assetActionId: 18,
          status: 0,
        },
        {
          action: 'CREATE SYS TRIGGER',
          actionChs: '创建系统触发器',
          assetActionId: 19,
          status: 1,
        },
        {
          action: 'ALTER SCHEMA TRIGGER',
          actionChs: '修改业务用户触发器',
          assetActionId: 20,
          status: 1,
        },
        {
          action: 'ALTER SYS TRIGGER',
          actionChs: '修改系统触发器',
          assetActionId: 21,
          status: 1,
        },
      ],
      '1101': [
        {
          action: 'DROP SCHEMA CODE',
          actionChs: '删除业务用户代码',
          assetActionId: 10,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA CODE',
          actionChs: '创建业务用户代码',
          assetActionId: 11,
          status: 1,
        },
        {
          action: 'CREATE SYS CODE',
          actionChs: '创建系统代码',
          assetActionId: 12,
          status: 1,
        },
        {
          action: 'DROP SYS CODE',
          actionChs: '删除系统代码',
          assetActionId: 13,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA CODE',
          actionChs: '修改业务用户代码',
          assetActionId: 14,
          status: 1,
        },
        {
          action: 'ALTER SYS CODE',
          actionChs: '修改系统代码',
          assetActionId: 15,
          status: 1,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 4,
    templateName: '代码无权限',
    templateIntro:
      '不允许对存储过程/函数/包/触发器和视图进行创建、修改和删除操作。',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 2,
    dsType: 'all',
    control: 11,
    objectAttr: {
      '1103': [
        {
          action: 'DROP SCHEMA VIEW',
          actionChs: '删除业务用户视图',
          assetActionId: 22,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA VIEW',
          actionChs: '创建业务用户视图',
          assetActionId: 23,
          status: 0,
        },
        {
          action: 'DROP SYS VIEW',
          actionChs: '删除系统视图',
          assetActionId: 24,
          status: 0,
        },
        {
          action: 'CREATE SYS VIEW',
          actionChs: '创建系统视图',
          assetActionId: 25,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA VIEW',
          actionChs: '修改业务用户视图',
          assetActionId: 26,
          status: 0,
        },
        {
          action: 'ALTER SYS VIEW',
          actionChs: '修改系统视图',
          assetActionId: 27,
          status: 0,
        },
      ],
      '1102': [
        {
          action: 'DROP SCHEMA TRIGGER',
          actionChs: '删除业务用户触发器',
          assetActionId: 16,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA TRIGGER',
          actionChs: '创建业务用户触发器',
          assetActionId: 17,
          status: 0,
        },
        {
          action: 'DROP SYS TRIGGER',
          actionChs: '删除系统触发器',
          assetActionId: 18,
          status: 0,
        },
        {
          action: 'CREATE SYS TRIGGER',
          actionChs: '创建系统触发器',
          assetActionId: 19,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA TRIGGER',
          actionChs: '修改业务用户触发器',
          assetActionId: 20,
          status: 0,
        },
        {
          action: 'ALTER SYS TRIGGER',
          actionChs: '修改系统触发器',
          assetActionId: 21,
          status: 0,
        },
      ],
      '1101': [
        {
          action: 'DROP SCHEMA CODE',
          actionChs: '删除业务用户代码',
          assetActionId: 10,
          status: 0,
        },
        {
          action: 'CREATE SCHEMA CODE',
          actionChs: '创建业务用户代码',
          assetActionId: 11,
          status: 0,
        },
        {
          action: 'CREATE SYS CODE',
          actionChs: '创建系统代码',
          assetActionId: 12,
          status: 0,
        },
        {
          action: 'DROP SYS CODE',
          actionChs: '删除系统代码',
          assetActionId: 13,
          status: 0,
        },
        {
          action: 'ALTER SCHEMA CODE',
          actionChs: '修改业务用户代码',
          assetActionId: 14,
          status: 0,
        },
        {
          action: 'ALTER SYS CODE',
          actionChs: '修改系统代码',
          assetActionId: 15,
          status: 0,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 3,
    templateName: '授权可管理',
    templateIntro: '允许对所有表和数据库进行所有权限的授权操作',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 0,
    dsType: 'all',
    control: 13,
    objectAttr: {
      '1303': [
        {
          action: 'GRANT DROP ANY',
          actionChs: '删除任意对象授权',
          assetActionId: 68,
          status: 1,
        },
        {
          action: 'GRANT CREATE ANY',
          actionChs: '创建任意对象授权',
          assetActionId: 69,
          status: 1,
        },
        {
          action: 'GRANT ALTER ANY',
          actionChs: '修改任意对象授权',
          assetActionId: 74,
          status: 1,
        },
        {
          action: 'GRANT UPDATE ANY',
          actionChs: '更新任意数据授权',
          assetActionId: 70,
          status: 1,
        },
        {
          action: 'GRANT SELECT ANY',
          actionChs: '查询任意数据授权',
          assetActionId: 71,
          status: 1,
        },
        {
          action: 'GRANT INSERT ANY',
          actionChs: '插入任意数据授权',
          assetActionId: 72,
          status: 1,
        },
        {
          action: 'GRANT DELETE ANY',
          actionChs: '删除任意数据授权',
          assetActionId: 73,
          status: 1,
        },
        {
          action: 'GRANT ALL',
          actionChs: '授权所有操作权限',
          assetActionId: 78,
          status: 1,
        },
        {
          action: 'GRANT RELOAD',
          actionChs: 'Reload 授权',
          assetActionId: 76,
          status: 1,
        },
        {
          action: 'GRANT SHUTDOWN DATABASE',
          actionChs: '关闭数据库授权',
          assetActionId: 77,
          status: 1,
        },
        {
          action: 'GRANT EXECUTE ANY',
          actionChs: '执行任意存储过程授权',
          assetActionId: 79,
          status: 1,
        },
      ],
      '1302': [
        {
          action: 'GRANT SENSITIVE OBJECT',
          actionChs: '访问敏感对象授权',
          assetActionId: 65,
          status: 1,
        },
        {
          action: 'GRANT SCHEMA OBJECT',
          actionChs: '访问业务用户对象授权',
          assetActionId: 66,
          status: 1,
        },
        {
          action: 'GRANT SYS OBJECT',
          actionChs: '访问系统对象授权',
          assetActionId: 67,
          status: 1,
        },
      ],
      '1301': [
        {
          action: 'GRANT SYSDBA',
          actionChs: '数据库系统管理员授权',
          assetActionId: 48,
          status: 1,
        },
        {
          action: 'GRANT DBA',
          actionChs: '数据库管理员授权',
          assetActionId: 49,
          status: 1,
        },
        {
          action: 'GRANT IMP_FULL_DATABASE',
          actionChs: '导入数据库授权',
          assetActionId: 50,
          status: 1,
        },
        {
          action: 'GRANT EXP_FULL_DATABASE',
          actionChs: '导出数据库授权',
          assetActionId: 51,
          status: 1,
        },
        {
          action: 'GRANT DBCREATOR',
          actionChs: '数据库创建者授权',
          assetActionId: 53,
          status: 1,
        },
        {
          action: 'GRANT SECURITYADMIN',
          actionChs: '安全管理员授权',
          assetActionId: 54,
          status: 1,
        },
        {
          action: 'GRANT SERVERADMIN',
          actionChs: '服务器管理员授权',
          assetActionId: 55,
          status: 1,
        },
        {
          action: 'GRANT SETUPADMIN',
          actionChs: '安装管理员授权',
          assetActionId: 56,
          status: 1,
        },
        {
          action: 'GRANT SYSADMIN',
          actionChs: '系统管理员授权',
          assetActionId: 57,
          status: 1,
        },
        {
          action: 'GRANT DBOWNER',
          actionChs: '数据库所有者授权',
          assetActionId: 58,
          status: 1,
        },
        {
          action: 'GRANT DBADM',
          actionChs: '数据库管理员授权',
          assetActionId: 59,
          status: 1,
        },
        {
          action: 'GRANT SECADM',
          actionChs: '数据库安全管理员',
          assetActionId: 60,
          status: 1,
        },
        {
          action: 'GRANT SQLADM',
          actionChs: '数据库管理SQL执行权限',
          assetActionId: 61,
          status: 1,
        },
        {
          action: 'GRANT WLMADM',
          actionChs: '数据库管理工作负载权限',
          assetActionId: 62,
          status: 1,
        },
        {
          action: 'GRANT ADMIN',
          actionChs: '数据库管理员授权',
          assetActionId: 63,
          status: 1,
        },
        {
          action: 'GRANT DBADMIN',
          actionChs: '数据库管理员授权',
          assetActionId: 81,
          status: 1,
        },
        {
          action: 'GRANT USERADMIN',
          actionChs: '数据库用户管理员授权',
          assetActionId: 82,
          status: 1,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 2,
    templateName: '授权可访问',
    templateIntro: '允许对指定敏感表、业务表、系统表进行授权操作',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 18,
    dsType: 'all',
    control: 13,
    objectAttr: {
      '1303': [
        {
          action: 'GRANT DROP ANY',
          actionChs: '删除任意对象授权',
          assetActionId: 68,
          status: 0,
        },
        {
          action: 'GRANT CREATE ANY',
          actionChs: '创建任意对象授权',
          assetActionId: 69,
          status: 0,
        },
        {
          action: 'GRANT ALTER ANY',
          actionChs: '修改任意对象授权',
          assetActionId: 74,
          status: 0,
        },
        {
          action: 'GRANT UPDATE ANY',
          actionChs: '更新任意数据授权',
          assetActionId: 70,
          status: 0,
        },
        {
          action: 'GRANT SELECT ANY',
          actionChs: '查询任意数据授权',
          assetActionId: 71,
          status: 0,
        },
        {
          action: 'GRANT INSERT ANY',
          actionChs: '插入任意数据授权',
          assetActionId: 72,
          status: 0,
        },
        {
          action: 'GRANT DELETE ANY',
          actionChs: '删除任意数据授权',
          assetActionId: 73,
          status: 0,
        },
        {
          action: 'GRANT ALL',
          actionChs: '授权所有操作权限',
          assetActionId: 78,
          status: 0,
        },
        {
          action: 'GRANT RELOAD',
          actionChs: 'Reload 授权',
          assetActionId: 76,
          status: 0,
        },
        {
          action: 'GRANT SHUTDOWN DATABASE',
          actionChs: '关闭数据库授权',
          assetActionId: 77,
          status: 0,
        },
        {
          action: 'GRANT EXECUTE ANY',
          actionChs: '执行任意存储过程授权',
          assetActionId: 79,
          status: 0,
        },
      ],
      '1302': [
        {
          action: 'GRANT SENSITIVE OBJECT',
          actionChs: '访问敏感对象授权',
          assetActionId: 65,
          status: 1,
        },
        {
          action: 'GRANT SCHEMA OBJECT',
          actionChs: '访问业务用户对象授权',
          assetActionId: 66,
          status: 1,
        },
        {
          action: 'GRANT SYS OBJECT',
          actionChs: '访问系统对象授权',
          assetActionId: 67,
          status: 1,
        },
      ],
      '1301': [
        {
          action: 'GRANT SYSDBA',
          actionChs: '数据库系统管理员授权',
          assetActionId: 48,
          status: 0,
        },
        {
          action: 'GRANT DBA',
          actionChs: '数据库管理员授权',
          assetActionId: 49,
          status: 0,
        },
        {
          action: 'GRANT IMP_FULL_DATABASE',
          actionChs: '导入数据库授权',
          assetActionId: 50,
          status: 0,
        },
        {
          action: 'GRANT EXP_FULL_DATABASE',
          actionChs: '导出数据库授权',
          assetActionId: 51,
          status: 0,
        },
        {
          action: 'GRANT DBCREATOR',
          actionChs: '数据库创建者授权',
          assetActionId: 53,
          status: 0,
        },
        {
          action: 'GRANT SECURITYADMIN',
          actionChs: '安全管理员授权',
          assetActionId: 54,
          status: 0,
        },
        {
          action: 'GRANT SERVERADMIN',
          actionChs: '服务器管理员授权',
          assetActionId: 55,
          status: 0,
        },
        {
          action: 'GRANT SETUPADMIN',
          actionChs: '安装管理员授权',
          assetActionId: 56,
          status: 0,
        },
        {
          action: 'GRANT SYSADMIN',
          actionChs: '系统管理员授权',
          assetActionId: 57,
          status: 0,
        },
        {
          action: 'GRANT DBOWNER',
          actionChs: '数据库所有者授权',
          assetActionId: 58,
          status: 0,
        },
        {
          action: 'GRANT DBADM',
          actionChs: '数据库管理员授权',
          assetActionId: 59,
          status: 0,
        },
        {
          action: 'GRANT SECADM',
          actionChs: '数据库安全管理员',
          assetActionId: 60,
          status: 0,
        },
        {
          action: 'GRANT SQLADM',
          actionChs: '数据库管理SQL执行权限',
          assetActionId: 61,
          status: 0,
        },
        {
          action: 'GRANT WLMADM',
          actionChs: '数据库管理工作负载权限',
          assetActionId: 62,
          status: 0,
        },
        {
          action: 'GRANT ADMIN',
          actionChs: '数据库管理员授权',
          assetActionId: 63,
          status: 0,
        },
        {
          action: 'GRANT DBADMIN',
          actionChs: '数据库管理员授权',
          assetActionId: 81,
          status: 0,
        },
        {
          action: 'GRANT USERADMIN',
          actionChs: '数据库用户管理员授权',
          assetActionId: 82,
          status: 0,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
  {
    id: 1,
    templateName: '授权无权限',
    templateIntro: '不允许做任何授权操作',
    templateType: 2,
    isSys: 1,
    attr: null,
    dsCount: 3,
    dsType: 'all',
    control: 13,
    objectAttr: {
      '1303': [
        {
          action: 'GRANT DROP ANY',
          actionChs: '删除任意对象授权',
          assetActionId: 68,
          status: 0,
        },
        {
          action: 'GRANT CREATE ANY',
          actionChs: '创建任意对象授权',
          assetActionId: 69,
          status: 0,
        },
        {
          action: 'GRANT ALTER ANY',
          actionChs: '修改任意对象授权',
          assetActionId: 74,
          status: 0,
        },
        {
          action: 'GRANT UPDATE ANY',
          actionChs: '更新任意数据授权',
          assetActionId: 70,
          status: 0,
        },
        {
          action: 'GRANT SELECT ANY',
          actionChs: '查询任意数据授权',
          assetActionId: 71,
          status: 0,
        },
        {
          action: 'GRANT INSERT ANY',
          actionChs: '插入任意数据授权',
          assetActionId: 72,
          status: 0,
        },
        {
          action: 'GRANT DELETE ANY',
          actionChs: '删除任意数据授权',
          assetActionId: 73,
          status: 0,
        },
        {
          action: 'GRANT ALL',
          actionChs: '授权所有操作权限',
          assetActionId: 78,
          status: 0,
        },
        {
          action: 'GRANT RELOAD',
          actionChs: 'Reload 授权',
          assetActionId: 76,
          status: 0,
        },
        {
          action: 'GRANT SHUTDOWN DATABASE',
          actionChs: '关闭数据库授权',
          assetActionId: 77,
          status: 0,
        },
        {
          action: 'GRANT EXECUTE ANY',
          actionChs: '执行任意存储过程授权',
          assetActionId: 79,
          status: 0,
        },
      ],
      '1302': [
        {
          action: 'GRANT SENSITIVE OBJECT',
          actionChs: '访问敏感对象授权',
          assetActionId: 65,
          status: 0,
        },
        {
          action: 'GRANT SCHEMA OBJECT',
          actionChs: '访问业务用户对象授权',
          assetActionId: 66,
          status: 0,
        },
        {
          action: 'GRANT SYS OBJECT',
          actionChs: '访问系统对象授权',
          assetActionId: 67,
          status: 0,
        },
      ],
      '1301': [
        {
          action: 'GRANT SYSDBA',
          actionChs: '数据库系统管理员授权',
          assetActionId: 48,
          status: 0,
        },
        {
          action: 'GRANT DBA',
          actionChs: '数据库管理员授权',
          assetActionId: 49,
          status: 0,
        },
        {
          action: 'GRANT IMP_FULL_DATABASE',
          actionChs: '导入数据库授权',
          assetActionId: 50,
          status: 0,
        },
        {
          action: 'GRANT EXP_FULL_DATABASE',
          actionChs: '导出数据库授权',
          assetActionId: 51,
          status: 0,
        },
        {
          action: 'GRANT DBCREATOR',
          actionChs: '数据库创建者授权',
          assetActionId: 53,
          status: 0,
        },
        {
          action: 'GRANT SECURITYADMIN',
          actionChs: '安全管理员授权',
          assetActionId: 54,
          status: 0,
        },
        {
          action: 'GRANT SERVERADMIN',
          actionChs: '服务器管理员授权',
          assetActionId: 55,
          status: 0,
        },
        {
          action: 'GRANT SETUPADMIN',
          actionChs: '安装管理员授权',
          assetActionId: 56,
          status: 0,
        },
        {
          action: 'GRANT SYSADMIN',
          actionChs: '系统管理员授权',
          assetActionId: 57,
          status: 0,
        },
        {
          action: 'GRANT DBOWNER',
          actionChs: '数据库所有者授权',
          assetActionId: 58,
          status: 0,
        },
        {
          action: 'GRANT DBADM',
          actionChs: '数据库管理员授权',
          assetActionId: 59,
          status: 0,
        },
        {
          action: 'GRANT SECADM',
          actionChs: '数据库安全管理员',
          assetActionId: 60,
          status: 0,
        },
        {
          action: 'GRANT SQLADM',
          actionChs: '数据库管理SQL执行权限',
          assetActionId: 61,
          status: 0,
        },
        {
          action: 'GRANT WLMADM',
          actionChs: '数据库管理工作负载权限',
          assetActionId: 62,
          status: 0,
        },
        {
          action: 'GRANT ADMIN',
          actionChs: '数据库管理员授权',
          assetActionId: 63,
          status: 0,
        },
        {
          action: 'GRANT DBADMIN',
          actionChs: '数据库管理员授权',
          assetActionId: 81,
          status: 0,
        },
        {
          action: 'GRANT USERADMIN',
          actionChs: '数据库用户管理员授权',
          assetActionId: 82,
          status: 0,
        },
      ],
    },
    createTime: '2024-07-21 15:53:23',
  },
];

const format = (data: any[]) => {
  return data.map((item) => {
    return {
      label: item.templateName,
      value: item.id,
      descriptions: Object.entries(item.objectAttr).map((attr: any) => {
        return {
          name: `测试文本${attr[0]}`,
          content: attr[1]?.map((i: any) => ({
            label: `${i.actionChs}(${i.action})`,
            value: i.status === 0 ? '禁止' : '授权',
          })),
        };
      }),
    };
  });
};

export const template = format(data);