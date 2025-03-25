import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  TreeSelect,
  TreeSelectProps,
  Checkbox,
  ConfigProvider,
  Empty,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import styles from './index.module.less';

type TreeSelectPropsWithChilren = TreeSelectProps & {
  children?: React.ReactNode;
};

type ChangeEventExtra = {
  preValue: any;
  triggerValue: any;
  triggerNode: any;
  allCheckedNodes: any;
};

export interface AllTreeSelectProps extends TreeSelectPropsWithChilren {
  selectAll?: boolean;
  selectAllValue?: any;
  selectAllText?: string;
  treeIconPrefixCls?: string;
  treePrefixCls?: string;
}

type CompoundedComponent = ((
  props: AllTreeSelectProps,
) => React.ReactElement) & {
  defaultProps?: AllTreeSelectProps;
  AllTreeNode: typeof TreeSelect.TreeNode;
  treeIconPrefixCls?: string;
  treePrefixCls?: string;
};

const AllTreeSelect: CompoundedComponent = (props) => {
  const {
    children,
    selectAllText = '全部',
    selectAllValue = 'all',
    dropdownRender,
    listItemHeight,
    multiple = true,
    onChange,
    selectAll = true,
    treeCheckable = true,
    treeData,
    value,
    treeIconPrefixCls,
    treePrefixCls,
    ...restProps
  } = props;

  const ITEM_HEIGHT = listItemHeight ?? 24;
  const isMultiple = !!(treeCheckable || multiple);

  const [selectedAll, setSelectedAll] = useState(false);
  const [treeValue, setTreeValue] = useState(undefined as any);
  const [treeLabel, setTreeLabel] = useState(undefined as any);
  const [treeChildren, setTreeChildren] = useState(undefined as any);

  const handleTreeData = (data: any[] = [], checked: boolean) => {
    return data?.map((item: any) => {
      item.disabled = checked;
      if (item.children) {
        item.children = handleTreeData(item.children, checked);
      }
      return item;
    });
  };

  const handleTreeNode = (data: any = {}, checked: boolean): any => {
    const newData = Array.isArray(data) ? data : [data];
    return newData?.map((child: any) => {
      return React.cloneElement(child, {
        disabled: checked,
        children: child.props.children
          ? handleTreeNode(child.props.children, checked)
          : undefined,
      });
    });
  };

  const handleTree = (checked: boolean) => {
    if (treeData) {
      handleTreeData(treeData, checked);
    } else if (children) {
      setTreeChildren(handleTreeNode(children, checked));
    }
  };

  useEffect(() => {
    if (
      isMultiple &&
      selectAll &&
      Array.isArray(value) &&
      value[0] === selectAllValue
    ) {
      setSelectedAll(true);
      handleTree(true);
    } else {
      setSelectedAll(false);
      setTreeValue(value);
    }
  }, [
    value,
    selectAllValue,
    selectAll,
    isMultiple,
    treeData,
    children,
    handleTree,
  ]);

  const selectAllOnChange = (e: CheckboxChangeEvent) => {
    const checked = e?.target?.checked;
    setSelectedAll(checked);
    handleTree(checked);
    if (checked) {
      onChange?.([selectAllValue], [selectAllText], {
        preValue: treeValue ?? [],
        triggerValue: [selectAllValue] as any,
        selected: checked,
        allCheckedNodes: [],
        triggerNode: {} as React.ReactElement,
      });
    } else {
      onChange?.(treeValue, treeLabel, {
        preValue: [selectAllValue],
        triggerValue: treeValue,
        selected: checked,
        allCheckedNodes: [],
        triggerNode: {} as React.ReactElement,
      });
    }
  };

  const treeOnChange = (
    value: any,
    label: ReactNode[],
    extra: ChangeEventExtra,
  ) => {
    if (selectedAll && value.length === 0) {
      setSelectedAll(false);
      handleTree(false);
      onChange?.(treeValue, treeLabel, {
        preValue: [selectAllValue],
        triggerValue: treeValue,
        selected: false,
        allCheckedNodes: [],
        triggerNode: {} as React.ReactElement,
      });
      return;
    }
    !selectedAll && setTreeValue(value);
    !selectedAll && setTreeLabel(label);
    onChange?.(value, label, extra);
  };

  const renderDropdown = (originNode: ReactNode) => {
    const menu = (
      <React.Fragment>
        {isMultiple && selectAll && !!treeData?.length && (
          <div
            className={styles['all-tree-select-all']}
            style={{ height: ITEM_HEIGHT }}
          >
            <Checkbox
              onChange={selectAllOnChange}
              checked={selectedAll}
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

  const mergedPopupClassName = useMemo(() => {
    const isOneLevel = !treeData?.some((item) => !!item?.children?.length);
    if (isOneLevel) {
      if (props.popupClassName) {
        return `${styles['all-tree-select-one-level']} ${props.popupClassName}`;
      } else {
        return styles['all-tree-select-one-level'];
      }
    } else {
      return props.popupClassName;
    }
  }, [props.popupClassName, treeData]);

  return (
    <ConfigProvider prefixCls={treePrefixCls} iconPrefixCls={treeIconPrefixCls}>
      <TreeSelect
        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        multiple={multiple}
        treeCheckable={treeCheckable}
        {...restProps}
        popupClassName={mergedPopupClassName}
        treeData={props.treeData}
        children={treeChildren ?? props.children}
        value={selectedAll ? [selectAllText] : treeValue}
        onChange={treeOnChange}
        dropdownRender={renderDropdown}
      />
    </ConfigProvider>
  );
};

AllTreeSelect.AllTreeNode = TreeSelect.TreeNode;

export default AllTreeSelect;
