import G6, { IAbstractGraph } from '@antv/g6';
import React, { useEffect, useRef } from 'react';
import { appSvgBase64, apiSvgBase64 } from './images';
import { fittingString } from './utils';
import { mockData } from './data';
// import './index.less';

// 连接点的位置
const anchorPoints = [
  [0, 0.5],
  [1, 0.5],
  [0.5, 0],
  [0.5, 1],

  // [0.3, 0], // 4
  // [0.7, 0], // 5
  // [0.7, 1], // 6
  // [0.3, 1], // 7
];

// const data = {
//   nodes: [
//     {
//       id: '0',
//       label: '应用0',
//       appName: '这是一个应用0',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '1',
//       label: '应用1',
//       appName: '这是一个应用1',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '2',
//       label: '应用2',
//       appName: '应用2',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '3',
//       label: '应用3',
//       appName: '应用3',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '4',
//       label: '应用4',
//       appName: '应用4',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '5',
//       label: '应用5',
//       appName: '应用5',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '6',
//       label: '应用6',
//       appName: '应用6',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '7',
//       label: '应用7',
//       appName: '应用7',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '8',
//       label: '应用8',
//       appName: '应用8',
//       appUrl: '192.168.1.1:8080',
//     },
//     {
//       id: '9',
//       label: '应用9',
//       appName: '应用9',
//       appUrl: '192.168.1.1:8080',
//     },
//   ],
//   edges: [
//     {
//       source: '0',
//       target: '1',
//       count: 123,
//     },
//     {
//       source: '1',
//       target: '0',
//       count: 123,
//     },
//     {
//       source: '0',
//       target: '2',
//       count: 342,
//     },
//     {
//       source: '1',
//       target: '4',
//       count: 643,
//     },
//     {
//       source: '0',
//       target: '3',
//       count: 12,
//     },
//     {
//       source: '3',
//       target: '4',
//       count: 32,
//     },
//     {
//       source: '4',
//       target: '5',
//       count: 7,
//     },
//     {
//       source: '4',
//       target: '6',
//       count: 123,
//     },
//     {
//       source: '5',
//       target: '7',
//       count: 123,
//     },
//     {
//       source: '7',
//       target: '5',
//       count: 1234,
//     },
//     {
//       source: '5',
//       target: '8',
//       count: 123,
//     },
//     {
//       source: '8',
//       target: '9',
//       count: 123,
//     },
//     {
//       source: '2',
//       target: '9',
//       count: 123,
//     },
//     {
//       source: '3',
//       target: '9',
//       count: 123,
//     },
//   ],
// };

const data = {
  nodes: mockData.data.apps,
  edges: mockData.data.links,
};

data.nodes.forEach(function (node: any) {
  node.label = fittingString(node.label, 100, 14);
  node.anchorPoints = anchorPoints;
});
// data.edges.forEach(function (edge: any) {

// });

G6.registerEdge(
  'extra-shape-edge',
  {
    afterDraw(cfg, group) {
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
  'polyline',
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
        container: ref.current!,
        width,
        height,
        // linkCenter: true, // 边指向节点的中心
        // fitViewPadding: [0, 0, 0, 0],
        fitCenter: true,
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          // align: 'UL',
          controlPoints: true,
          nodesepFunc: () => 50,
          ranksepFunc: () => 50,
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
          type: 'extra-shape-edge',
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
        // 节点不同状态下的样式集合
        edgeStateStyles: {
          // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
          hover: {
            stroke: '#3385FF',
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,0 L 8,-4 Z',
              fill: '#3385FF',
            },
            lineWidth: 2,
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
      graph.render(); // 渲染图;

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
      // 鼠标进入边
      graph.on('edge:mouseenter', (e) => {
        const edgeItem = e.item; // 获取鼠标进入的节点元素对象
        graph.setItemState(edgeItem!, 'hover', true); // 设置当前边的 hover 状态为 true
      });
      // 鼠标离开边
      graph.on('edge:mouseleave', (e) => {
        const edgeItem = e.item; // 获取鼠标离开的节点元素对象
        graph.setItemState(edgeItem!, 'hover', false); // 设置当前边的 hover 状态为 false
      });

      // 边上自定义节点的多个元素点击事件
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
