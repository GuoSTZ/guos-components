---
toc: content
---

# ListToTable

:::info{title=使用说明}
该组件用于在左侧列表与右侧表格之间维护同一组选中数据，适合“待选项/已选项”场景。

存在以下约定，使用前请先确认：

1. 支持受控与非受控两种模式。
2. 传入 `value` 时视为受控模式，组件内部不再作为最终数据源，变更通过 `onChange` 向外抛出。
3. 未传 `value` 时视为非受控模式，组件内部维护已选数据。
4. `listProps.fieldNames` 当前支持 `key` 和 `name`，分别用于数据唯一标识和默认展示字段映射。
5. 默认搜索会基于 `fieldNames.name` 对应字段做一次内部缓存处理，用于提升大数据场景下的搜索性能。
6. `tableProps.needReverse` 会影响右侧结果顺序。
7. 在受控模式下，`needReverse` 作用于 `onChange` 输出结果；在非受控模式下，`needReverse` 作用于右侧表格展示顺序。

:::

## Demo

<code src='./demos/base.tsx' title='基础使用' description='基础的大数据量列表选择场景，包含搜索、全选和右侧删除能力'></code>
<code src='./demos/controlled.tsx' title='受控模式' description='通过 value 和 onChange 由外部统一维护已选数据，适合需要回填和统一状态管理的场景'></code>
<code src='./demos/fieldNames.tsx' title='字段映射' description='通过 fieldNames 适配非 key、name 结构的数据源'></code>
<code src='./demos/form.tsx' title='表单场景' description='与 antd Form 联动，在表单提交和重置时统一管理已选值'></code>

## API

### ListToTable

| 参数       | 说明                                   | 类型                      | 默认值 | 是否必填 |
| ---------- | -------------------------------------- | ------------------------- | ------ | -------- |
| listProps  | 左侧列表相关属性                       | [listProps](#listprops)   | -      | 是       |
| tableProps | 右侧表格相关属性                       | [tableProps](#tableprops) | -      | 是       |
| value      | 当前选中的数据，传入后组件进入受控模式 | any[]                     | -      | 否       |
| onChange   | 数据变化时的回调                       | (value: any[]) => void    | -      | 否       |

### listProps

| 参数         | 说明                             | 类型                                                                                         | 默认值             | 是否必填 |
| ------------ | -------------------------------- | -------------------------------------------------------------------------------------------- | ------------------ | -------- |
| dataSource   | 左侧列表源数据                   | any[]                                                                                        | -                  | 是       |
| fieldNames   | 字段映射，当前支持 `key`、`name` | { key?: string; name?: string }                                                              | -                  | 否       |
| header       | 列表头部自定义                   | string \| React.ReactNode[] \| ((info: { checkedRows: Map<React.Key, any> }) => ReactNode[]) | -                  | 否       |
| showSearch   | 列表是否显示搜索框               | boolean                                                                                      | -                  | 否       |
| filterSearch | 列表自定义搜索回调               | (filterValue: string, data: any) => boolean                                                  | 内部默认搜索       | 否       |
| placeholder  | 列表搜索框占位文案               | string                                                                                       | -                  | 否       |
| showCheckAll | 是否显示全选组件                 | boolean                                                                                      | true               | 否       |
| onCheckAll   | 点击全选时的回调                 | (value?: boolean) => void                                                                    | -                  | 否       |
| checkAllText | 全选组件文案                     | string                                                                                       | `Check All`        | 否       |
| height       | 列表高度                         | number                                                                                       | 356                | 否       |
| itemHeight   | 列表项高度                       | number                                                                                       | 28                 | 否       |
| renderItem   | 列表项自定义渲染                 | (item: any, index: number) => ReactNode                                                      | 默认 Checkbox 渲染 | 否       |

其余属性参考 `VirtualList`

### tableProps

| 参数         | 说明                         | 类型                                                                                         | 默认值       | 是否必填 |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------- | ------------ | -------- |
| header       | 表格头部自定义               | string \| React.ReactNode[] \| ((info: { checkedRows: Map<React.Key, any> }) => ReactNode[]) | -            | 否       |
| showSearch   | 表格是否显示搜索框           | boolean                                                                                      | -            | 否       |
| filterSearch | 表格自定义搜索回调           | (filterValue: string, data: any) => boolean                                                  | 内部默认搜索 | 否       |
| placeholder  | 表格搜索框占位文案           | string                                                                                       | -            | 否       |
| needReverse  | 是否对右侧结果顺序做反向处理 | boolean                                                                                      | false        | 否       |

其余属性参考 [Table](https://4x-ant-design.antgroup.com/components/table-cn/#Table)
