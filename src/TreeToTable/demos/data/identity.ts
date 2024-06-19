/** 身份相关数据 */
export const identity_data = [
  {
    id: -1,
    name: '人',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '1',
        name: '员工',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '1-1',
            name: '员工11111111111111111111111',
            status: 'active',
            type: 'user',
          },
          {
            id: '1-2',
            name: '员工2222222222222222222222222',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '2',
        name: '合作伙伴',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '2-1',
            name: '合作伙伴1',
            status: 'active',
            type: 'user',
          },
          {
            id: '2-2',
            name: '合作伙伴2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '3',
        name: '客户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '3-1',
            name: '客户1',
            status: 'active',
            type: 'user',
          },
          {
            id: '3-2',
            name: '客户2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '4',
        name: '临时访客',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '4-1',
            name: '访客1',
            status: 'active',
            type: 'user',
          },
          {
            id: '4-2',
            name: '访客2',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
  {
    id: -2,
    name: '应用程序',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '5',
        name: '业务处理系统',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '5-1',
            name: 'SQL工具1',
            status: 'active',
            type: 'user',
          },
          {
            id: '5-2',
            name: 'SQL工具2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '6',
        name: 'SQL工具',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '6-1',
            name: 'SQL工具1',
            status: 'active',
            type: 'user',
          },
          {
            id: '6-2',
            name: 'SQL工具2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '7',
        name: '交换机',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '7-1',
            name: '交换机1',
            status: 'active',
            type: 'user',
          },
          {
            id: '7-2',
            name: '交换机2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '8',
        name: '运维',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '8-1',
            name: '交换机1',
            status: 'active',
            type: 'user',
          },
          {
            id: '8-2',
            name: '交换机2',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
  {
    id: -3,
    name: '终端设备',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '9',
        name: '业务终端',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '9-1',
            name: '交换机1',
            status: 'active',
            type: 'user',
          },
          {
            id: '9-2',
            name: '交换机2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '10',
        name: '办公终端',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '10-1',
            name: '交换机1',
            status: 'active',
            type: 'user',
          },
          {
            id: '10-2',
            name: '交换机2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '11',
        name: '运维终端',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '11-1',
            name: '交换机1',
            status: 'active',
            type: 'user',
          },
          {
            id: '11-2',
            name: '交换机2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '12',
        name: '服务器',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '12-1',
            name: '服务器1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '13',
        name: '网关跳板',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '网关跳板1',
            name: '网关跳板1',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
  {
    id: -4,
    name: '账户',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '14',
        name: '数据库管理员账户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '14-1',
            name: '数据库管理员1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '15',
        name: '高权限账户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '15-1',
            name: '数据库管理员1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '16',
        name: '敏感数据账户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '16-1',
            name: '数据库管理员2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '17',
        name: '业务账号',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '17-1',
            name: '运维管理员',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '18',
        name: '运维账号',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '18-1',
            name: '运维管理员',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
];

/** 身份相关数据-中文key */
export const identity_data_key = [
  {
    id: -1,
    name: '人',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '员工',
        name: '员工',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '员工1',
            name: '员工111111111111111111111111111111111111111111111111111111111111111111111111',
            status: 'active',
            type: 'user',
          },
          {
            id: '员工2',
            name: '员工222222222222222222222222222222222222222222222222222222222222222222222222',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '合作伙伴',
        name: '合作伙伴',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '合作伙伴1',
            name: '合作伙伴1',
            status: 'active',
            type: 'user',
          },
          {
            id: '合作伙伴2',
            name: '合作伙伴2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '客户',
        name: '客户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '客户1',
            name: '客户1',
            status: 'active',
            type: 'user',
          },
          {
            id: '客户2',
            name: '客户2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '临时访客',
        name: '临时访客',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '临时访客1',
            name: '临时访客1',
            status: 'active',
            type: 'user',
          },
          {
            id: '临时访客2',
            name: '临时访客2',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
  {
    id: -2,
    name: '应用程序',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '业务处理系统',
        name: '业务处理系统',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '业务处理系统1',
            name: '业务处理系统1',
            status: 'active',
            type: 'user',
          },
          {
            id: '业务处理系统2',
            name: '业务处理系统2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: 'SQL工具',
        name: 'SQL工具',
        status: 'active',
        type: 'group',
        child: [
          {
            id: 'SQL工具1',
            name: 'SQL工具1',
            status: 'active',
            type: 'user',
          },
          {
            id: 'SQL工具2',
            name: 'SQL工具2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '交换机',
        name: '交换机',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '交换机1',
            name: '交换机1',
            status: 'active',
            type: 'user',
          },
          {
            id: '交换机2',
            name: '交换机2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '运维',
        name: '运维',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '运维1',
            name: '运维1',
            status: 'active',
            type: 'user',
          },
          {
            id: '运维2',
            name: '运维2',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
  {
    id: -3,
    name: '终端设备',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '业务终端',
        name: '业务终端',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '业务终端1',
            name: '业务终端1',
            status: 'active',
            type: 'user',
          },
          {
            id: '业务终端2',
            name: '业务终端2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '办公终端',
        name: '办公终端',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '办公终端1',
            name: '办公终端1',
            status: 'active',
            type: 'user',
          },
          {
            id: '办公终端2',
            name: '办公终端2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '运维终端',
        name: '运维终端',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '运维终端1',
            name: '运维终端1',
            status: 'active',
            type: 'user',
          },
          {
            id: '运维终端2',
            name: '运维终端2',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '服务器',
        name: '服务器',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '服务器1',
            name: '服务器1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '网关跳板',
        name: '网关跳板',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '网关跳板1',
            name: '网关跳板1',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
  {
    id: -4,
    name: '账户',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '数据库管理员账户',
        name: '数据库管理员账户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '数据库管理员账户1',
            name: '数据库管理员账户1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '高权限账户',
        name: '高权限账户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '高权限账户1',
            name: '高权限账户1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '敏感数据账户',
        name: '敏感数据账户',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '敏感数据账户1',
            name: '敏感数据账户1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '业务账号',
        name: '业务账号',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '业务账号1',
            name: '业务账号1',
            status: 'active',
            type: 'user',
          },
        ],
      },
      {
        id: '运维账号',
        name: '运维账号',
        status: 'active',
        type: 'group',
        child: [
          {
            id: '运维账号1',
            name: '运维账号1',
            status: 'active',
            type: 'user',
          },
        ],
      },
    ],
  },
];

/** 身份组相关数据 */
export const identity_group_data = [
  {
    id: -1,
    name: '人',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '1',
        name: '员工',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '2',
        name: '合作伙伴',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '3',
        name: '客户',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '4',
        name: '临时访客',
        status: 'active',
        type: 'group',
        child: [],
      },
    ],
  },
  {
    id: -2,
    name: '应用程序',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '5',
        name: '业务处理系统',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '6',
        name: 'SQL工具',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '7',
        name: '交换机',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '8',
        name: '运维',
        status: 'active',
        type: 'group',
        child: [],
      },
    ],
  },
  {
    id: -3,
    name: '终端设备',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '9',
        name: '业务终端',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '10',
        name: '办公终端',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '11',
        name: '运维终端',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '12',
        name: '服务器',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '13',
        name: '网关跳板',
        status: 'active',
        type: 'group',
        child: [],
      },
    ],
  },
  {
    id: -4,
    name: '账户',
    status: 'active',
    type: 'parentGroup',
    child: [
      {
        id: '14',
        name: '数据库管理员账户',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '15',
        name: '高权限账户',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '16',
        name: '敏感数据账户',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '17',
        name: '业务账号',
        status: 'active',
        type: 'group',
        child: [],
      },
      {
        id: '18',
        name: '运维账号',
        status: 'active',
        type: 'group',
        child: [],
      },
    ],
  },
];
