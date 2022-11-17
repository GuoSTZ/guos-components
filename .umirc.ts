import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'base',
  favicon: '',
  logo: '',
  outputPath: 'docs-dist',
  // more config: https://d.umijs.org/config
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
  },
  lessLoader: {
    modifyVars: {},
  },
});
