import React, { useEffect, useState, ReactNode } from 'react';
import { TreeSelect, TreeSelectProps, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ChangeEventExtra } from 'rc-tree-select/es/TreeSelect';

export interface LinkageTreeSelectProps extends TreeSelectProps {
  selectAll?: boolean;
  selectAllText?: string;
  selectAllValue?: any;
  children?: React.ReactNode;
}

const TreeNode = TreeSelect.TreeNode;

type CompoundedComponent = ((props: LinkageTreeSelectProps) => React.ReactElement) & {
  defaultProps?: LinkageTreeSelectProps;
  TreeNode: typeof TreeNode;
};

/**
 * 存有特殊交互方式的树下拉框，目前仅treeData传入方式支持特殊交互，treeNode传入方式暂未支持
 * @param props LinkageTreeSelectProps
 * @returns
 */
const LinkageTreeSelect: CompoundedComponent = (props) => {
  const {
    dropdownRender,
    multiple,
    onChange,
    onDeselect,
    onSelect,
    selectAll,
    selectAllText,
    selectAllValue,
    treeCheckable,
    treeData,
    value,
    ...restProps
  } = props;
  const { listItemHeight } = props;
  const [treeDataMap, setTreeDataMap] = useState(new Map());
  const [checkedValue, setCheckedValue] = useState([] as any[]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [treeValue, setTreeValue] = useState([] as any[]);

  const ITEM_HEIGHT = listItemHeight ?? 24;
  const isMultiple = !!(treeCheckable || multiple);
  const SELECT_ALL_DATA = [{ label: selectAllText, value: selectAllValue }];

  // 遍历treeData，并映射到treeDataMap中
  useEffect(() => {
    const dataMap = new Map();
    const traverseTree = (data: typeof treeData = [], parentTitle?: React.ReactNode) => {
      data.forEach((item, index) => {
        item.parentTitle = parentTitle;
        // 组件本身涉及到disabled状态的修改，故将初始的disabled值转移到自定义的available属性中
        item.available = typeof item.disabled === 'boolean' ? !item.disabled : true;
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

  useEffect(() => {
    setCheckedAll(selectAllValue === value?.[0]?.value);
    if (selectAllValue === value?.[0]?.value) {
      handleTree(true);
    } else {
      setTreeValue(value);
    }
  }, [selectAllValue, value, treeDataMap.size]);

  /**
   * 处理子节点的置灰状态，以及子节点的value值存储
   * @param data 待处理的数据
   * @param status 是否置灰，改变disabled
   * @param tempSet Set数据，存储全部子节点的value值
   * @returns \{ childrenData, set }
   */
  const handleChildren = (data: typeof treeData, status: boolean, tempSet?: Set<any>) => {
    const childrenData = data?.map((item) => {
      item.disabled = status || !item.available;
      if (item.children) {
        item.children = handleChildren(item.children, status, tempSet).childrenData;
      }
      tempSet?.add(item.value);
      return item;
    });
    return { childrenData, set: tempSet };
  };

  const handleOnChange = (value: any, labelList: ReactNode[], extra: ChangeEventExtra) => {
    value.forEach((item: any) => {
      if (treeDataMap.has(item?.value)) {
        const data = treeDataMap.get(item.value);
        item.children = data?.children;
        item.title = item.label;
        item.key = item.value;
        item.parentTitle = data?.parentTitle;
      }
    });
    setCheckedValue(value);
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

  // const handleTreeNode = (data: any = {}, checked: boolean): any => {
  //   const newData = Array.isArray(data) ? data : [data];
  //   return newData?.map((child: any) =>
  //     React.cloneElement(child, {
  //       disabled: checked || !child.available,
  //       children: child.props.children ? handleTreeNode(child.props.children, checked) : undefined,
  //     }),
  //   );
  // };

  const handleTree = (checked: boolean) => {
    if (treeData) {
      treeDataMap.forEach((value) => {
        value.disabled = checked || !value.available;
      });
    }
  };

  const selectAllOnChange = (e: CheckboxChangeEvent) => {
    const checked = e?.target?.checked;
    handleTree(checked);
    if (checked) {
      onChange?.(SELECT_ALL_DATA, [], {} as ChangeEventExtra);
    } else {
      onChange?.(checkedValue, [], {} as ChangeEventExtra);
    }
  };

  const renderDropdown = (originNode: ReactNode) => {
    const menu = (
      <React.Fragment>
        {isMultiple && selectAll && (
          <div className={'linkage-tree-select-all'} style={{ height: ITEM_HEIGHT }}>
            <Checkbox
              onChange={selectAllOnChange}
              checked={checkedAll}
              style={{ lineHeight: `${ITEM_HEIGHT}px` }}
            >
              {selectAllText}
            </Checkbox>
          </div>
        )}
        {originNode}
      </React.Fragment>
    );
    return dropdownRender ? dropdownRender(menu) : menu;
  };

  return (
    <TreeSelect
      multiple
      treeCheckable
      {...restProps}
      dropdownRender={renderDropdown}
      onChange={handleOnChange}
      onDeselect={handleOnDeselect}
      onSelect={handleOnSelect}
      treeData={treeData}
      value={checkedAll ? SELECT_ALL_DATA : treeValue}
    />
  );
};

LinkageTreeSelect.TreeNode = TreeNode;
LinkageTreeSelect.defaultProps = {
  selectAll: true,
  selectAllText: '全部',
  selectAllValue: 'all',
};

export default LinkageTreeSelect;
