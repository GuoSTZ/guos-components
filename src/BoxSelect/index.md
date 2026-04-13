---
toc: content
---

# BoxSelect

`BoxSelect` 是一个方框多选组件，支持内置模式和自定义数据源。

## Demo

<code src='./demos/base.tsx' title='基础使用' description='支持 week、month、custom 三种模式'></code>
<code src='./demos/form.tsx' title='Form 场景' description='演示 type 与 time 两字段在 antd Form 中联动收集'></code>

## API

| 参数         | 类型                                                                  | 默认值   | 描述                   |
| ------------ | --------------------------------------------------------------------- | -------- | ---------------------- |
| type         | `'week' \| 'month' \| 'custom'`                                       | `'week'` | 数据模式               |
| dataSource   | `{ label: ReactNode; value: string \| number; disabled?: boolean }[]` | -        | `type='custom'` 时必传 |
| value        | `(string \| number)[]`                                                | -        | 受控值                 |
| defaultValue | `(string \| number)[]`                                                | `[]`     | 非受控初始值           |
| onChange     | `(value: (string \| number)[]) => void`                               | -        | 选择变化回调           |
| disabled     | `boolean`                                                             | `false`  | 是否整体禁用           |
| className    | `string`                                                              | -        | 自定义类名             |
| style        | `CSSProperties`                                                       | -        | 自定义样式             |
