---
toc: content
---

# FetchLink

`FetchLink` 用于处理多个异步数据组件之间的联动关系，适合省市区、分类级联、上级选择影响下级请求参数等场景。

## Demo

<code src='./demos/base.tsx' title='基础联动' description='通过 FetchLink 串联三个 antd Select，实现省份、城市、区县三级异步联动'></code>
<code src='./demos/form.tsx' title='Form 中使用' description='通过 Form.Item 包裹 FetchLink 各级组件，演示在 antd Form 中进行联动选择与提交'></code>

## API

### FetchLink

| 参数   | 说明             | 类型                                            | 默认值 | 是否必填 |
| ------ | ---------------- | ----------------------------------------------- | ------ | -------- |
| config | 联动组件配置列表 | `(FetchComponentProps & FetchLinkExtraProps)[]` | -      | 是       |

### FetchLinkExtraProps

| 参数                | 说明                                                   | 类型                        | 默认值 | 是否必填 |
| ------------------- | ------------------------------------------------------ | --------------------------- | ------ | -------- |
| decorator           | 外层包裹组件                                           | `ElementType`               | -      | 否       |
| decoratorProps      | 外层包裹组件属性                                       | `Record<string, unknown>`   | -      | 否       |
| handleOnChangeValue | 自定义转换当前组件 `onChange` 抛出的参数               | `(...args: any[]) => any[]` | -      | 否       |
| nextFetchParam      | 当前组件选中值传给下一个组件请求时使用的参数名         | `string \| string[]`        | -      | 否       |
| onChange            | 当前组件值变化后的回调，可用于自定义追加或移除后续配置 | `(...args: any[]) => void`  | -      | 否       |

### FetchComponentProps

| 参数              | 说明                                 | 类型                                                                      | 默认值  | 是否必填 |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------------- | ------- | -------- |
| fetchData         | 数据请求方法                         | `(params: Record<string, unknown>) => Promise<any>`                       | -       | 是       |
| transformData     | 请求结果转换方法                     | `(data: any) => any`                                                      | -       | 否       |
| component         | 实际渲染的组件                       | `any`                                                                     | -       | 否       |
| componentProps    | 传给实际渲染组件的属性               | `Record<string, any>`                                                     | -       | 否       |
| optionInValue     | 是否将选中的整条数据作为值透出       | `boolean`                                                                 | `false` | 否       |
| needFetchParam    | 是否必须等接收到请求参数后才发起请求 | `boolean`                                                                 | -       | 否       |
| fetchParams       | 当前组件请求参数                     | `Record<string, any>`                                                     | -       | 否       |
| checkFirst        | 请求完成后是否默认选中第一条可用数据 | `boolean`                                                                 | -       | 否       |
| fieldNames        | 字段映射配置                         | `{ key?: string; name?: string; children?: string; dataSource?: string }` | -       | 否       |
| value             | 当前值                               | `any`                                                                     | -       | 否       |
| onChange          | 值变化回调                           | `(...args: any[]) => void`                                                | -       | 否       |
| clearFn           | 自定义清空值方法                     | `() => void`                                                              | -       | 否       |
| onChangeWhileInit | 初始化时是否触发 `onChange`          | `boolean`                                                                 | -       | 否       |
