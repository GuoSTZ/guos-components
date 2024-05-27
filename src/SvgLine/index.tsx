import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface SvgLineProps {
  width: number | string;
  height?: number;
  color?: CSSProperties['color'];
  text?: string;
  circleProps?: React.SVGProps<SVGCircleElement>;
  lineProps?: React.SVGLineElementAttributes<SVGLineElement>;
  textProps?: React.SVGTextElementAttributes<SVGTextElement>;
  polygonProps?: React.SVGProps<SVGPolygonElement>;
}

const SvgLine = (props: SvgLineProps) => {
  const {
    width,
    height = 50,
    color = '#3385ff',
    text,
    circleProps,
    lineProps,
    textProps,
    polygonProps,
  } = props; // 假设宽度作为prop传入
  const ref = useRef<SVGAElement>(null);
  const [polygonStartX, setPolygonStartX] = useState(0);

  /** 所有的元素都距离边界 */
  const virtual_padding = 2;
  /** 园的半径 */
  const circleR = 3;
  /** 三角形底边长度 */
  const polygonBottom = 12;
  /** 三角形高长度 */
  const polygonHieght = 6;

  /** 计算三角形最左侧的所在X值 */
  const getPolygonStartX = useCallback(() => {
    let data = 0;
    if (typeof width === 'number') {
      data = width - virtual_padding - polygonHieght;
    } else if (typeof width === 'string' && width.endsWith('%')) {
      data =
        (ref.current?.getBoundingClientRect?.()?.width || 0) -
        virtual_padding -
        polygonHieght;
    }
    setPolygonStartX(data);
  }, [
    ref.current?.getBoundingClientRect,
    width,
    virtual_padding,
    polygonHieght,
  ]);

  useEffect(() => {
    getPolygonStartX();

    window.addEventListener('resize', getPolygonStartX);

    return () => {
      window.removeEventListener('resize', getPolygonStartX);
    };
  }, [getPolygonStartX]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 小圆圈头部 */}
      <circle
        cx={virtual_padding + circleR}
        cy={height / 2}
        r={circleR}
        stroke={color}
        strokeWidth="1"
        fill="#fff"
        {...circleProps}
      />

      {/* 文字描述 */}
      <text
        x="50%"
        y={height / 2 - 10}
        textAnchor="middle"
        fontSize="14"
        fill="black"
        {...textProps}
      >
        {text}
      </text>

      {/* 水平虚线 */}
      <line
        x1={virtual_padding + 2 * circleR} // 从圆圈右侧开始
        y1="50%"
        x2={polygonStartX} // 结束于三角形左侧，预留空间给三角形
        y2="50%"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        {...lineProps}
      />

      {/* 小三角形尾部 */}
      <polygon
        points={`
          ${polygonStartX} ${(height - polygonBottom) / 2}, 
          ${polygonStartX} ${(height + polygonBottom) / 2}, 
          ${polygonStartX + polygonHieght} ${height / 2}`}
        fill={color}
        {...polygonProps}
      />
    </svg>
  );
};

export default SvgLine;
