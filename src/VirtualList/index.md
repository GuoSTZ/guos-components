---
title: VirtualList
toc: content
---

# VirtualList

## 使用

大数据场景下，如果可以确定每一项高度固定，优先使用 `VirtualList`，性能和滚动稳定性都更好。

<code src='./demos/base.tsx' description="10w 级定高虚拟列表，推荐优先使用" title='定高列表' ></code>

<code src='./demos/variable.tsx' description="10w 级不定高虚拟列表，高度不可预测时使用" title='不定高列表' ></code>

## VirtualList API

| 参数          | 说明         | 类型                                               | 默认值   | 是否必填 |
| ------------- | ------------ | -------------------------------------------------- | -------- | -------- |
| dataSource    | 列表数据     | `T[]`                                              | `[]`     | 是       |
| height        | 可视区域高度 | `number`                                           | 无       | 是       |
| itemHeight    | 单项高度     | `number`                                           | 无       | 是       |
| renderItem    | 单项渲染函数 | `(item: T, index: number) => React.ReactNode`      | 无       | 是       |
| width         | 列表宽度     | `number \| string`                                 | `'100%'` | 否       |
| overscanCount | 预渲染条数   | `number`                                           | `6`      | 否       |
| className     | 容器类名     | `string`                                           | 无       | 否       |
| style         | 容器样式     | `React.CSSProperties`                              | 无       | 否       |
| itemClassName | 列表项类名   | `string \| (item: T, index: number) => string`     | 无       | 否       |
| itemKey       | 列表项 key   | `keyof T \| (item: T, index: number) => React.Key` | `index`  | 否       |
| emptyRender   | 空态展示     | `React.ReactNode`                                  | `Empty`  | 否       |
| onScroll      | 滚动事件     | `(props: ListOnScrollProps) => void`               | 无       | 否       |

### VirtualList Ref

| 方法名       | 说明                    | 类型                                                                                  |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------- |
| scrollToTop  | 滚动到顶部              | `() => void`                                                                          |
| scrollToItem | 按索引滚动到指定项      | `(index: number, align?: 'auto' \| 'smart' \| 'center' \| 'end' \| 'start') => void`  |
| scrollToKey  | 按业务 key 滚动到指定项 | `(key: React.Key, align?: 'auto' \| 'smart' \| 'center' \| 'end' \| 'start') => void` |

## VariableVirtualList API

| 参数              | 说明         | 类型                                               | 默认值   | 是否必填 |
| ----------------- | ------------ | -------------------------------------------------- | -------- | -------- |
| dataSource        | 列表数据     | `T[]`                                              | `[]`     | 是       |
| height            | 可视区域高度 | `number`                                           | 无       | 是       |
| renderItem        | 单项渲染函数 | `(item: T, index: number) => React.ReactNode`      | 无       | 是       |
| width             | 列表宽度     | `number \| string`                                 | `'100%'` | 否       |
| estimatedItemSize | 预估项高度   | `number`                                           | `64`     | 否       |
| overscanCount     | 预渲染条数   | `number`                                           | `6`      | 否       |
| className         | 容器类名     | `string`                                           | 无       | 否       |
| style             | 容器样式     | `React.CSSProperties`                              | 无       | 否       |
| itemClassName     | 列表项类名   | `string \| (item: T, index: number) => string`     | 无       | 否       |
| itemKey           | 列表项 key   | `keyof T \| (item: T, index: number) => React.Key` | `index`  | 否       |
| emptyRender       | 空态展示     | `React.ReactNode`                                  | `Empty`  | 否       |
| onScroll          | 滚动事件     | `(props: ListOnScrollProps) => void`               | 无       | 否       |

### VariableVirtualList Ref

| 方法名       | 说明                    | 类型                                                                                  |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------- |
| scrollToTop  | 滚动到顶部              | `() => void`                                                                          |
| scrollToItem | 按索引滚动到指定项      | `(index: number, align?: 'auto' \| 'smart' \| 'center' \| 'end' \| 'start') => void`  |
| scrollToKey  | 按业务 key 滚动到指定项 | `(key: React.Key, align?: 'auto' \| 'smart' \| 'center' \| 'end' \| 'start') => void` |
