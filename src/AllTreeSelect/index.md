---
toc: content
demo:
  cols: 2
---

# AllTreeSelect

`AllTreeSelect` 是一个基于 `antd` 的树形下拉选择框组件，支持全选功能。它扩展了 `antd` 的 `TreeSelect` 组件，并添加了一个全选按钮。

## Demo

<code src='./demos/base.tsx' title='基于antd4 TreeSelect组件，添加全选功能' description='基础使用'></code>

## API

| 参数           | 类型                                        | 默认值 | 描述               |
| -------------- | ------------------------------------------- | ------ | ------------------ |
| value          | any                                         | -      | 选择框的当前值     |
| children       | ReactNode                                   | -      | 子节点             |
| onChange       | (value: any, option: any) => void           | -      | 值改变时的回调函数 |
| selectAll      | boolean                                     | true   | 是否显示全选按钮   |
| selectAllValue | string \| number \| Array<string \| number> | 'all'  | 全选值             |
| selectAllText  | string                                      | '全部' | 全选按钮的文案     |
