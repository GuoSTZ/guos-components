import G6, { IAbstractGraph } from '@antv/g6';
import React, { useEffect, useRef } from 'react';
import { appSvgBase64, apiSvgBase64 } from './images';
import { fittingString } from './utils';
import './demo2.less';

// 连接点的位置
const anchorPoints = [
  [0.5, 0], // 0
  [1, 0.5], // 1
  [0.5, 1], // 2
  [0, 0.5], // 3

  [0.3, 0], // 4
  [0.7, 0], // 5
  [0.7, 1], // 6
  [0.3, 1], // 7
];

const data = {
  // 点集
  nodes: [
    {
      id: 'node1', // String，该节点存在则必须，节点的唯一标识
      label: '这是一个应用A',
      appName: '这是一个应用A',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node2', // String，该节点存在则必须，节点的唯一标识
      label: '应用B',
      appName: '应用B',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node3', // String，该节点存在则必须，节点的唯一标识
      label: '应用C',
      appName: '应用C',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node4', // String，该节点存在则必须，节点的唯一标识
      label: '应用D',
      appName: '应用D',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node5', // String，该节点存在则必须，节点的唯一标识
      label: '应用E',
      appName: '应用E',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node6', // String，该节点存在则必须，节点的唯一标识
      label: '应用F',
      appName: '应用F',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node7', // String，该节点存在则必须，节点的唯一标识
      label: '应用G',
      appName: '应用G',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node8', // String，该节点存在则必须，节点的唯一标识
      label: '应用H',
      appName: '应用H',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
    {
      id: 'node9', // String，该节点存在则必须，节点的唯一标识
      label: '应用I',
      appName: '应用I',
      appUrl: '192.168.1.1:8080',
      anchorPoints,
    },
  ],
  // 边集
  edges: [
    {
      id: 'edge1',
      source: 'node1', // String，必须，起始点 id
      target: 'node2', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge2',
      source: 'node1', // String，必须，起始点 id
      target: 'node4', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge3',
      source: 'node1', // String，必须，起始点 id
      target: 'node5', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge4',
      source: 'node2', // String，必须，起始点 id
      target: 'node3', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge5',
      source: 'node2', // String，必须，起始点 id
      target: 'node5', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge6',
      source: 'node3', // String，必须，起始点 id
      target: 'node6', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge7',
      source: 'node4', // String，必须，起始点 id
      target: 'node7', // String，必须，目标点 id
      // sourceAnchor: 7,
      // targetAnchor: 4,
      count: 123,
      lineType: 'polyline',
    },
    {
      id: 'edge8',
      source: 'node4', // String，必须，起始点 id
      target: 'node9', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge9',
      source: 'node5', // String，必须，起始点 id
      target: 'node8', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge10',
      source: 'node6', // String，必须，起始点 id
      target: 'node8', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge11',
      source: 'node6', // String，必须，起始点 id
      target: 'node9', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge12',
      source: 'node7', // String，必须，起始点 id
      target: 'node4', // String，必须，目标点 id
      count: 123,
      // sourceAnchor: 5,
      // targetAnchor: 6,
      lineType: 'polyline',
    },
    {
      id: 'edge13',
      source: 'node7', // String，必须，起始点 id
      target: 'node8', // String，必须，目标点 id
      count: 123,
    },
    {
      id: 'edge14',
      source: 'node7', // String，必须，起始点 id
      target: 'node9', // String，必须，目标点 id
      count: 123,
      // sourceAnchor: 7,
      // targetAnchor: 7,
      // lineType: 'polyline', // 自定义属性
    },
  ],
};

data.nodes.forEach(function (node: any) {
  node.label = fittingString(node.label, 100, 14);
});

G6.registerEdge(
  'rect-img-edge',
  {
    afterDraw(cfg, group) {
      // 双向线条的处理仍然存在问题
      // const startPoint = cfg?.startPoint!;
      // const endPoint = cfg?.endPoint!;
      // const x1 = startPoint.x,
      //   y1 = startPoint.y,
      //   x2 = endPoint.x,
      //   y2 = endPoint.y;

      // let offsetX = 0,
      //   offsetY = 0;
      // if (cfg?.lineType === 'polyline') {
      //   let offSet = 30;
      //   // 在网格布局中，实际上每个节点是对齐的
      //   if (y1 < y2 && x1 === x2) {
      //     offsetX = -offSet;
      //   } else {
      //     offsetX = offSet;
      //   }
      //   if (x1 < x2 && y1 === y2) {
      //     offsetY = -offSet;
      //   } else {
      //     offsetY = offSet;
      //   }
      // }

      const width = 52,
        height = 20;
      const shape = group?.get('children')[0];
      const midPoint = shape.getPoint(0.5);

      group?.addShape('rect', {
        attrs: {
          width,
          height,
          fill: '#fff',
          radius: 10,
          stroke: '#E6E9F0',
          x: midPoint.x - width / 2,
          y: midPoint.y - height / 2,
          cursor: 'pointer',
        },
        name: 'edge-rect',
      });

      // const icon =
      group?.addShape('image', {
        attrs: {
          x: midPoint.x - 24,
          y: midPoint.y - 8,
          width: 16,
          height: 16,
          img: apiSvgBase64,
          cursor: 'pointer',
        },
        name: 'edge-image',
      });

      // const text =
      group?.addShape('text', {
        attrs: {
          x: midPoint.x - 4,
          y: midPoint.y + 6,
          text: cfg?.count,
          fontSize: 12,
          fill: '#38415C',
          cursor: 'pointer',
        },
        name: 'edge-text',
      });
    },
    update: undefined,
  },
  'line',
);

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  let graph: IAbstractGraph;
  useEffect(() => {
    if (!graph) {
      const width = ref.current?.scrollWidth || 1200; // 暂时直接定义宽度
      const height = ref.current?.scrollHeight || 600; // 暂时直接定义高度
      // 实例化 minimap 插件
      // const minimap =
      new G6.Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate',
      });

      // 实例化 grid 插件
      const grid = new G6.Grid();

      graph = new G6.Graph({
        container: ref.current!, // String | HTMLElement，必须
        width, // Number，必须，图的宽度
        height, // Number，必须，图的高度
        // linkCenter: true, // 边指向节点的中心
        // fitViewPadding: [0, 0, 0, 0],
        layout: {
          type: 'grid', // 指定网格布局
          begin: [0, 0],
          width: width,
          height: height,
          preventOverlap: true, // 防止节点重叠
          // preventOverlapPadding: 20, // 节点之间的最小间距
          cols: 3, // 每行放置的节点数量
          nodeSpacing: 30, // 节点之间的距离，也可以使用[x, y]的形式
          sortBy: 'id',
        },
        defaultNode: {
          type: 'modelRect',
          size: [160, 50],
          preRect: {
            show: false,
          },
          logoIcon: {
            offset: -20,
            img: appSvgBase64,
            width: 32,
            height: 32,
          },
          stateIcon: {
            show: false,
          },
          style: {
            radius: 25,
            stroke: '#E6E9F0',
            shadowBlur: 10,
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
          },
          labelCfg: {
            offset: 20,
            style: {
              fontSize: 14,
            },
          },
        },
        defaultEdge: {
          type: 'rect-img-edge',
          style: {
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,0 L 8,-4 Z',
              fill: '#B1BFD4',
            },
            stroke: '#B1BFD4',
            radius: 20,
          },
        },
        // 节点不同状态下的样式集合
        nodeStateStyles: {
          // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
          hover: {
            stroke: '#3385FF',
            lineWidth: 1,
          },
        },
        modes: {
          // 允许拖拽画布、放缩画布、拖拽节点
          default: [
            'drag-canvas',
            'zoom-canvas',
            'drag-node',
            {
              type: 'tooltip', // 提示框
              formatText(model) {
                // 提示框文本内容
                const text = `应用名称：${model.appName} <br /> 应用地址：${model.appUrl}`;
                return text;
              },
            },
          ],
        },
        plugins: [grid], // 将 minimap 实例配置到图上
      });
      graph.data(data);
      graph.render(); // 渲染图

      // 鼠标进入节点
      graph.on('node:mouseenter', (e) => {
        const nodeItem = e.item; // 获取鼠标进入的节点元素对象
        graph.setItemState(nodeItem!, 'hover', true); // 设置当前节点的 hover 状态为 true
      });
      // 鼠标离开节点
      graph.on('node:mouseleave', (e) => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        graph.setItemState(nodeItem!, 'hover', false); // 设置当前节点的 hover 状态为 false
      });
      graph.on('edge-rect:click', function () {
        graph.changeData({ nodes: [] });
      });

      graph.on('edge-image:click', () => {
        graph.changeData({ nodes: [] });
      });

      graph.on('edge-text:click', () => {
        graph.changeData({ nodes: [] });
      });
    }

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (
          !ref.current ||
          !ref.current.scrollWidth ||
          !ref.current.scrollHeight
        )
          return;
        graph.changeSize(ref.current.scrollWidth, ref.current.scrollHeight);
      };
  }, []);

  return <div ref={ref}></div>;
};
