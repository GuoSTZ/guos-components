---
toc: content
---

# LoadMore

`LoadMore` 是一个通用的容器滚动加载组件，滚动到距离底部一定阈值时自动触发加载更多。

## Demo

<code src='./demos/base.tsx' title='基础滚动加载' description='通过滚动触底自动请求下一页数据'></code>

<code src='./demos/chunk.tsx' title='分块滚动加载' description='123'></code>

## API

| 参数           | 类型               | 默认值               | 描述                       |
| -------------- | ------------------ | -------------------- | -------------------------- |
| children       | `ReactNode`        | -                    | 列表内容                   |
| className      | `string`           | -                    | 外层容器类名               |
| style          | `CSSProperties`    | -                    | 外层容器样式               |
| height         | `number \| string` | `420`                | 滚动容器高度               |
| loading        | `boolean`          | `false`              | 是否处于加载中             |
| hasMore        | `boolean`          | `true`               | 是否还有更多数据           |
| disabled       | `boolean`          | `false`              | 禁止触发滚动加载           |
| threshold      | `number`           | `80`                 | 距离底部多少像素时触发加载 |
| onLoadMore     | `() => void`       | -                    | 触底后触发                 |
| loadingContent | `ReactNode`        | `'加载中...'`        | 加载中时底部文案           |
| endContent     | `ReactNode`        | `'没有更多数据了'`   | 无更多数据时底部文案       |
| moreContent    | `ReactNode`        | `'继续下滑加载更多'` | 可继续加载时底部提示文案   |
