import { Tree, TreeProps } from 'antd';
import React, { memo } from 'react';
import useAutoHeight from '@/_utils/useAutoHeight';
import styles from './index.module.less';

interface BaseTreeProps extends TreeProps {
  /**
   * 设置虚拟滚动容器高度，设置后内部节点不再支持横向滚动，不设置将默认以父容器高度作为虚拟滚动容器高度，如需全量渲染，可将 `virtual` 属性设置为 `false` ，关闭虚拟滚动。
   */
  height?: TreeProps['height'];
}

const BaseTree = (props: BaseTreeProps) => {
  const { containerRef, height: autoHeight } = useAutoHeight<HTMLDivElement>();
  const { className, height, style, ...restProps } = props;
  const treeHeight = height ?? (autoHeight > 0 ? autoHeight : undefined);
  const mergedClassName = className
    ? `${styles['base-tree']} ${className}`
    : styles['base-tree'];

  return (
    <div ref={containerRef} style={{ ...style }}>
      <Tree {...restProps} height={treeHeight} className={mergedClassName} />
    </div>
  );
};

export default memo(BaseTree);
