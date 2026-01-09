import React, { useMemo } from 'react';
import { Tree, TreeProps, Empty, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import setIcon from './assets/set.svg';
import assetSetIcon from './assets/assetSet.svg';

import styles from './index.module.less';

const ActionTree = (props: TreeProps) => {
  const { className, treeData, ...restProps } = props;

  const mergedClassName = useMemo(() => {
    const customClassName = className
      ? `${styles['action-tree']} ${className}`
      : `${styles['action-tree']}`;
    return customClassName;
  }, [className]);

  if (!treeData?.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <Tree
      blockNode
      showIcon
      titleRender={(
        node: DataNode & { actions?: any[]; tag?: React.ReactNode },
      ) => {
        let actions = null;
        if (!!node.actions?.length) {
          actions = node.actions.map((item) => {
            const { icon, onClick, ...rest } = item;
            return (
              <Typography.Link
                {...rest}
                onClick={(e: any) => {
                  e.stopPropagation();
                  onClick(e, node);
                }}
              >
                {icon}
              </Typography.Link>
            );
          });
        }

        return (
          <div className={styles['action-tree-custom-title']}>
            <div className={styles['action-tree-custom-title-content']}>
              {node.tag ? node.tag : null}
              {typeof node.title === 'function' ? node.title(node) : node.title}
            </div>
            {actions ? (
              <div className={styles['action-tree-custom-title-actions']}>
                {actions}
              </div>
            ) : null}
          </div>
        );
      }}
      icon={(node: any) => {
        if (node.type === 'assetSet') {
          return (
            <img src={assetSetIcon} alt="assetSet" width={16} height={16} />
          );
        }
        return <img src={setIcon} alt="set" width={16} height={16} />;
      }}
      {...restProps}
      treeData={treeData}
      className={mergedClassName}
    />
  );
};

export default ActionTree;
