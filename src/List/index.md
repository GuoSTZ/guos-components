---
toc: content
---

# List

`List` 是一个面向大数据量场景的虚拟滚动列表组件，支持预估高度、动态高度纠偏、可视区回调以及按索引或 key 精准滚动。

## Demo

<code src='./demos/base.tsx' title='基础使用' description='展示万级数据、动态高度与滚动定位能力'></code>

## API

### List

| 参数       | 说明                     | 类型                                                           | 默认值 | 是否必填 |
| ---------- | ------------------------ | -------------------------------------------------------------- | ------ | -------- |
| dataSource | 列表数据源               | `T[]`                                                          | -      | 是       |
| height     | 滚动容器高度             | `number`                                                       | -      | 是       |
| renderItem | 列表项渲染函数           | `(item: T, index: number) => ReactNode`                        | -      | 是       |
| itemHeight | 列表项预估高度           | `number`                                                       | `48`   | 否       |
| overscan   | 可视区上下额外渲染数量   | `number`                                                       | `4`    | 否       |
| itemKey    | 列表项唯一标识字段或函数 | `keyof T \| ((item: T, index: number) => React.Key)`           | `key`  | 否       |
| empty      | 空数据时展示内容         | `ReactNode`                                                    | -      | 否       |
| itemStyle  | 列表项样式或样式计算函数 | `CSSProperties \| ((item: T, index: number) => CSSProperties)` | -      | 否       |
| onScroll   | 滚动时返回当前可视区信息 | `(info: ListScrollInfo) => void`                               | -      | 否       |

其余属性参考原生 `div` 属性。

### ListScrollInfo

| 参数         | 说明               | 类型     |
| ------------ | ------------------ | -------- |
| scrollTop    | 当前滚动距离       | `number` |
| scrollHeight | 容器滚动区域总高度 | `number` |
| clientHeight | 容器可视高度       | `number` |
| start        | 当前可视区起始索引 | `number` |
| end          | 当前可视区结束索引 | `number` |

### ListRef

| 参数          | 说明                      | 类型                                                                       |
| ------------- | ------------------------- | -------------------------------------------------------------------------- |
| scrollTo      | 滚动到指定 `scrollTop`    | `(scrollTop: number) => void`                                              |
| scrollToIndex | 滚动到指定索引            | `(index: number, align?: 'auto' \| 'start' \| 'center' \| 'end') => void`  |
| scrollToKey   | 按列表项 key 滚动到指定项 | `(key: React.Key, align?: 'auto' \| 'start' \| 'center' \| 'end') => void` |
| getScrollTop  | 获取当前滚动距离          | `() => number`                                                             |
