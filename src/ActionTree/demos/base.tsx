import {
  FormOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ActionTree } from 'guos-components';
import React, { useEffect, useState, useMemo } from 'react';
import { mockData } from './mockData';
import { Input, Tag } from 'antd';

type TreeNode = {
  title: React.ReactNode;
  key: string;
  type: string;
  default?: boolean;
  children?: TreeNode[];
  actions?: Action[];
  ruleType?: number;
  tag?: React.ReactNode; // 修改为 ReactNode 以支持 JSX 元素
};

type Action = {
  icon: React.ReactNode;
  onClick: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    node: TreeNode,
  ) => void;
};

// 假定是取自字典
const dicts = {
  SENSITIVE_LEVEL_ASSET_TAG_DICT: [
    { label: '公开', value: 1 },
    { label: '内部', value: 2 },
    { label: '核心', value: 3 },
    { label: '重要', value: 4 },
    { label: '机密', value: 5 },
  ],
  SENSITIVE_COUNT_ASSET_TAG_DICT: [
    { label: 'A类', value: 1 },
    { label: 'B类', value: 2 },
    { label: 'C类', value: 3 },
  ],
};

const SENSITIVE_LEVEL_ASSET_TAG_COLOR = [
  { color: '#4EDFA6', background: '#DAF8EB', value: 1 },
  { color: '#3285FF', background: '#D8E6FF', value: 2 },
  { color: '#FE9C00', background: '#FFEBD4', value: 3 },
  { color: '#FF5B5B', background: '#FFE0DE', value: 4 },
  { color: '#F52F3E', background: '#FFD8D9', value: 5 },
];

const SENSITIVE_COUNT_ASSET_TAG_COLOR = [
  { color: '#FF5B5B', background: '#FFE0DE', value: 1 },
  { color: '#FE9C00', background: '#FFEBD4', value: 2 },
  { color: '#3285FF', background: '#D8E6FF', value: 3 },
];

const handleIcon = (Icon: string | ((props: any) => React.ReactNode)) => {
  if (typeof Icon === 'string') {
    return <img src={Icon} alt="icon" width={16} height={16} />;
  }
  return <Icon style={{ width: 16, height: 16 }} />;
};

const App = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [allKeys, setAllKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 树可操作按钮说明：
  // 资产根目录（默认） - type: directory - 编辑，删除，新增集合组（根目录不能删除）
  // 业务资产 - type: dbGroup - 无操作
  // 数据库 - type: db - 新增集合组
  // 资产集合组 - type: assetSetGroup - 编辑， 删除，新增资产集合（默认不能删除，编辑）
  // 资产集合 - type: assetSet - 编辑，删除（默认不能删除，编辑）

  // actions格式
  // [
  //   {
  //     "title": "删除",
  //     "icon": handleIcon(DeleteOutlined),
  //     "onClick": () => {
  //       console.log('删除');
  //     },
  //   },
  // ]

  // 资产标签格式
  // {
  //   "title": "资产标签",
  //   "key": "assetTag",
  //   "type": "assetTag",
  // }

  /**
   * 不同的层级节点有各自的操作，需要手动添加业务进去
   * 实际上就三个类别的操作：添加，删除，编辑
   * 目前是每个层级都各自进行添加，后续看看能不能进行抽象处理
   */
  const buildActions = (node: TreeNode): Action[] => {
    const actions: Action[] = [];

    switch (node.type) {
      case 'directory':
        actions.push(
          {
            icon: handleIcon(PlusCircleOutlined),
            onClick: (e, node) => console.log('新增集合组', node),
          },
          {
            icon: handleIcon(FormOutlined),
            onClick: (e, node) => console.log('编辑资产目录', node),
          },
        );
        // 根目录默认不能删除
        if (!node.default) {
          actions.push({
            icon: handleIcon(DeleteOutlined),
            onClick: (e, node) => console.log('删除资产目录', node),
          });
        }
        break;

      case 'db':
        actions.push({
          icon: handleIcon(PlusCircleOutlined),
          onClick: (e, node) => console.log('新增集合组', node),
        });
        break;

      case 'assetSetGroup':
        actions.push({
          icon: handleIcon(PlusCircleOutlined),
          onClick: (e, node) => console.log('新增资产集合', node),
        });
        // 默认集合组不能删除和编辑
        if (!node.default) {
          actions.push(
            {
              icon: handleIcon(FormOutlined),
              onClick: (e, node) => console.log('编辑资产集合组', node),
            },
            {
              icon: handleIcon(DeleteOutlined),
              onClick: (e, node) => console.log('删除资产集合组', node),
            },
          );
        }
        break;

      case 'assetSet':
        // 默认资产集合不能删除和编辑
        if (!node.default) {
          actions.push(
            {
              icon: handleIcon(FormOutlined),
              onClick: (e, node) => console.log('编辑资产集合', node),
            },
            {
              icon: handleIcon(DeleteOutlined),
              onClick: (e, node) => console.log('删除资产集合', node),
            },
          );
        }
        break;

      case 'dbGroup':
      default:
        // 无操作
        break;
    }

    return actions;
  };

  const buildTag = (
    node: TreeNode & { assetTag?: number; ruleType?: number },
  ) => {
    if (node.assetTag) {
      const dict =
        node.ruleType === 1
          ? dicts.SENSITIVE_LEVEL_ASSET_TAG_DICT
          : dicts.SENSITIVE_COUNT_ASSET_TAG_DICT;
      const color_dict =
        node.ruleType === 1
          ? SENSITIVE_LEVEL_ASSET_TAG_COLOR
          : SENSITIVE_COUNT_ASSET_TAG_COLOR;
      const label = dict.find((item) => item.value === node.assetTag)?.label;
      const color_item = color_dict.find(
        (item) => item.value === node.assetTag,
      );

      return (
        <Tag
          key={node.assetTag}
          style={{
            background: color_item?.background,
            color: color_item?.color,
            borderColor: color_item?.color,
            borderRadius: 2,
          }}
        >
          {label}
        </Tag>
      );
    }
    return null;
  };

  /**
   * 给每个树节点，添加actions操作
   * 同时收集所有的 key，用于默认展开
   */
  const processTreeData = (
    data: TreeNode[],
    keysCollection: string[],
  ): TreeNode[] => {
    return data.map((node) => {
      // 收集 Key
      keysCollection.push(node.key);

      const newNode: TreeNode = {
        ...node,
        actions: buildActions(node),
        tag: node.type === 'assetSet' ? buildTag(node) : null,
      };

      if (newNode.children && newNode.children.length > 0) {
        newNode.children = processTreeData(newNode.children, keysCollection);
      }
      return newNode;
    });
  };

  const onExpand = (newExpandedKeys: any[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const { filteredData, expandKeys } = useMemo(() => {
    if (!searchValue) {
      return { filteredData: treeData, expandKeys: allKeys };
    }

    const keysToExpand = new Set<string>();

    const loop = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => {
          const strTitle = node.title as string;
          const match = strTitle.indexOf(searchValue) > -1;

          const filteredChildren = node.children ? loop(node.children) : [];
          const hasMatchedDescendants = filteredChildren.length > 0;

          if (hasMatchedDescendants) {
            keysToExpand.add(node.key);
            return { ...node, children: filteredChildren };
          }

          if (match) {
            return node;
          }

          return null;
        })
        .filter(Boolean) as TreeNode[];
    };

    const result = loop(treeData);

    return { filteredData: result, expandKeys: Array.from(keysToExpand) };
  }, [searchValue, treeData, allKeys]);

  useEffect(() => {
    setExpandedKeys(expandKeys);
    if (searchValue) {
      setAutoExpandParent(true);
    }
  }, [expandKeys, searchValue]);

  useEffect(() => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 300);
    }).then((data: any) => {
      // 这里要首次处理树数据，数据组装，type定义等
      const firstData = data;

      // 收集所有 Keys 的容器
      const allKeys: string[] = [];

      const secondData = processTreeData(firstData, allKeys);
      setTreeData(secondData);
      setAllKeys(allKeys);
      setExpandedKeys(allKeys);
    });
  }, []);

  return (
    <div>
      <Input
        style={{ marginBottom: 8 }}
        placeholder="搜索"
        onChange={onChange}
      />

      <ActionTree
        treeData={filteredData}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        height={600}
      />
    </div>
  );
};

export default App;
