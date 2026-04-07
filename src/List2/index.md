---
toc: content
---

# List2

`List2` 是一个不依赖第三方虚拟列表库的手写虚拟滚动组件，适合固定高度列表场景。

## Demo

<code src='./demos/base.tsx' title='手写虚拟滚动' description='通过总高度占位和窗口切片渲染，减少大数据量列表的真实 DOM 数量'></code>

## API

| 参数                 | 类型                                                | 默认值       | 描述                         |
| -------------------- | --------------------------------------------------- | ------------ | ---------------------------- |
| dataSource           | `T[]`                                               | `[]`         | 列表数据源                   |
| height               | `number`                                            | -            | 列表可视区域高度             |
| itemHeight           | `number`                                            | -            | 每一项的固定高度             |
| renderItem           | `(item: T, index: number) => ReactNode`             | -            | 列表项渲染函数               |
| overscan             | `number`                                            | `2`          | 可视区前后额外渲染的条数     |
| itemKey              | `keyof T \| ((item: T, index: number) => ReactKey)` | `index`      | 列表项的 key                 |
| className            | `string`                                            | -            | 外层容器类名                 |
| style                | `CSSProperties`                                     | -            | 外层容器样式                 |
| emptyContent         | `ReactNode`                                         | `'暂无数据'` | 空数据时展示的内容           |
| onScroll             | `(scrollTop: number) => void`                       | -            | 滚动时触发                   |
| onVisibleRangeChange | `(range: { start: number; end: number }) => void`   | -            | 当前真实可视区索引变化时触发 |

## Ref

| 名称          | 类型                                                            | 描述           |
| ------------- | --------------------------------------------------------------- | -------------- |
| scrollToTop   | `() => void`                                                    | 滚动到顶部     |
| scrollToIndex | `(index: number, align?: 'start' \| 'center' \| 'end') => void` | 滚动到指定索引 |
