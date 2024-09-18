import { Tree, TreeProps } from 'antd';
import React, { memo, useCallback, useMemo, useState, Key } from 'react';
import styles from './index.module.less';

export interface CollapseTreeProps extends TreeProps {
  onChange?: (checkedKeys: any, halfCheckedKeys: any[]) => void;
}

const CollapseTree = (props: CollapseTreeProps) => {
  const { onChange, treeData, ...rest } = props;
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const dataSource = useMemo(() => {
    return treeData?.map((item: any) => {
      return {
        ...item,
        className: styles['collapse-tree-wrap'],
      };
    });
  }, [treeData]);

  const onExpand = useCallback((expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  }, []);

  const onCheck = useCallback(
    (checkedKeysValue: React.Key[], e: any) => {
      setCheckedKeys(checkedKeysValue);
      setExpandedKeys([...checkedKeysValue, ...e.halfCheckedKeys]);
      onChange?.(checkedKeysValue, e.halfCheckedKeys);
    },
    [onChange],
  );

  return (
    <Tree
      selectable={false}
      {...rest}
      className={styles['collapse-tree']}
      checkable
      defaultExpandAll
      autoExpandParent={autoExpandParent}
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      // @ts-ignore
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      treeData={dataSource}
    />
  );
};

export default memo(CollapseTree);
