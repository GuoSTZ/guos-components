import React, { useEffect, useState } from 'react';
import { TreeSelect, TreeSelectProps } from 'antd';
import { ChangeEventExtra } from 'rc-tree-select/es/TreeSelect';

export interface LinkageTreeSelectProps extends TreeSelectProps {}

export default (props: LinkageTreeSelectProps) => {
  const { treeData, onChange, onDeselect, onSelect, ...restProps } = props;
  const [treeDataMap, setTreeDataMap] = useState(new Map());

  // 遍历treeData，并映射到treeDataMap中
  useEffect(() => {
    const dataMap = new Map();
    const traverseTree = (data: typeof treeData = [], parentTitle?: React.ReactNode) => {
      data.forEach((item, index) => {
        item.parentTitle = parentTitle;
        dataMap.set(item['value'], item);
        if (Array.isArray(item.children) && item.children.length > 0) {
          traverseTree(item.children, item.title);
        }
      });
    };

    if (treeData) {
      traverseTree(treeData);
      setTreeDataMap(dataMap); // 更新 Map 对象以触发重新渲染
    }
  }, [treeData]);

  /**
   * 处理子节点的置灰状态，以及子节点的value值存储
   * @param data 待处理的数据
   * @param status 是否置灰，改变disabled和disableCheckbox
   * @param tempSet Set数据，存储全部子节点的value值
   * @returns \{ childrenData, set }
   */
  const handleChildren = (data: typeof treeData, status: boolean, tempSet?: Set<any>) => {
    const childrenData = data?.map((item) => {
      item.disableCheckbox = status;
      item.disabled = status;
      if (item.children) {
        item.children = handleChildren(item.children, status, tempSet).childrenData;
      }
      tempSet?.add(item.value);
      return item;
    });
    return { childrenData, set: tempSet };
  };

  const handleOnChange = (value: any, labelList: React.ReactNode[], extra: ChangeEventExtra) => {
    value.forEach((item: any) => {
      if (treeDataMap.has(item?.value)) {
        const data = treeDataMap.get(item.value);
        item.children = data?.children;
        item.title = item.label;
        item.key = item.value;
        item.parentTitle = data?.parentTitle;
      }
    });
    onChange?.(value, labelList, extra);
  };

  const handleOnDeselect = (value: string, node: any) => {
    if (Array.isArray(node?.children) && node.children.length > 0) {
      node.children = handleChildren(node.children, false).childrenData;
    }
    onDeselect?.(value, node);
  };

  /**
   * 选中节点时的回调，目前用来处理选中父节点时，其子节点的置灰和取消勾选状态
   * @param value 选中节点的value值
   * @param node 选中节点的整条数据值，注意，非原始数据的
   */
  const handleOnSelect = (value: string, node: any) => {
    if (Array.isArray(node?.children) && node.children.length > 0) {
      const { childrenData, set: dataSet } = handleChildren(node.children, true, new Set());
      node.children = childrenData;

      const newValue = props.value?.filter((item: any) => !dataSet!.has(item.value)) || [];
      newValue.push(node);
      onChange?.(newValue, [], {} as ChangeEventExtra);
    }
    onSelect?.(value, node);
  };

  return (
    <TreeSelect
      {...restProps}
      onChange={handleOnChange}
      onDeselect={handleOnDeselect}
      onSelect={handleOnSelect}
      treeData={treeData}
    />
  );
};
