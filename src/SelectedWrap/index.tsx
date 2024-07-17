import React, { memo, useMemo, useState } from 'react';
import './index.less';

export interface SelectedWrapProps {
  children: React.ReactNode;
  className?: string;
}

const SVG_WIDTH = 40;
const SVG_HEIGHT = 40;

const SelectedWrap = (props: SelectedWrapProps) => {
  const { children, className } = props;
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
  };

  const mergedClassName = useMemo(() => {
    const customClassName = className
      ? `selected-wrap ${className}`
      : `selected-wrap`;
    return selected
      ? `${customClassName} selected-wrap-selected`
      : customClassName;
  }, [className, selected]);

  return (
    <div className={mergedClassName} onClick={handleClick}>
      {children}

      <div className="selected-svg">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points={`
            0 0,
            ${SVG_WIDTH} 0,
            ${SVG_WIDTH} ${SVG_HEIGHT}
          `}
            fill={'#1890ff'}
          />

          <polyline
            points={`${SVG_WIDTH * 0.5},${SVG_HEIGHT * 0.25} ${
              (SVG_WIDTH * 2) / 3
            },${SVG_HEIGHT * 0.5} ${SVG_WIDTH - 3},${3}`}
            fill="none"
            stroke="#fff"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};

export default memo(SelectedWrap);
