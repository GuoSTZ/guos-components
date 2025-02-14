import { defineConfig } from 'dumi';
const CompressionPlugin = require('compression-webpack-plugin');

const NAMESPACE = 'g-components';

export default defineConfig({
  base: `/${NAMESPACE}/`,
  publicPath: `/${NAMESPACE}/`,
  outputPath: NAMESPACE,
  themeConfig: {
    name: NAMESPACE,
    nav: [
      { title: '开始', link: '/guide' },
      { title: '组件', link: '/components' },
    ],
    footer: 'Copyright © 2024 | Powered by GuoSTZ',
  },
  headScripts: [],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  theme: {
    '@red-6': '#FF3D55', //红色系基础色
    '@volcano-6': '#FF6537', //橙色系基础色
    '@gold-6': '#FACA46', //黄色系基础色
    '@green-6': '#1AD999', //绿色系基础色
    '@blue-6': '#3385FF', //蓝色系基础色
    '@purple-6': '#935DD9', //紫色系基础色
    '@primary-color': '#3385FF', //按钮主色
    '@heading-color': '#081333', //表格表头文字主色
    '@text-color': '#38415C', //文本主色，比如面包屑的当前文字主色,表格行文字颜色
    '@text-color-secondary': '#82899E', //次文本主色
    '@disabled-color': '#AFB5C7', //禁用颜色
    '@border-color-base': '#CED2DE', //边框颜色，组件的外框
    '@background-color-base': '#F0F1F5', //基础背景色
    '@border-color-split': '#E6E9F0', //分割线颜色，组件内部的边框
    '@border-radius-base': '2px', // 组件/浮层圆角
    '@background-color-light': '#f7f8fa', // 表头背景颜色
    '@item-hover-bg': '#f7f8fa', // 下拉框 hover 颜色
    '@item-active-bg': '#f0f8ff', // 下拉框 active 颜色
    '@btn-danger-bg': '#ff3d55', // 危险按钮 背景颜色
    '@btn-danger-border': '#ff3d55', // 危险按钮 边框颜色
    '@input-placeholder-color': '#afb5c7', // 表单 placeholder 颜色
    '@label-color': '#82899e', // 表单label 颜色
    '@comment-author-time-color': '#afb5c7', // 评论 时间颜色
    '@table-header-icon-color': '#82899e', // 表格 表头 icon颜色
    '@form-item-margin-bottom': '16px', // 表格item 距离底部边距
    '@table-expanded-row-bg': '#f7f8fa', // 表格展开背景色
    '@ant-prefix': 'ant',
  },
  lessLoader: {
    modifyVars: {
      '@ant-prefix': 'ant',
    },
    javascriptEnabled: true,
  },
  chainWebpack(config) {
    // 在这里可以对 webpack 配置进行修改和定制
    // config.module
    //   .rule('svg')
    //   .test(/\.svg$/)
    //   .use('@svgr/webpack')
    //   .loader('svg-url-loader')
    //   .options({
    //     // 可选配置，根据需要自行调整
    //     encoding: 'base64',
    //   })
    //   .end();

    // 别名配置
    // config.resolve.alias.set('@', require.resolve('./src'));

    config.plugin('CompressionPlugin').use(CompressionPlugin, [
      {
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240, // 对超过10KB的文件进行压缩
        minRatio: 0.8, // 压缩率小于这个值时不进行压缩
      },
    ]);

    config.module
      .rule('png')
      .test(/\.png$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: '[name].[ext]',
        outputPath: 'images/',
      });
  },
});
