---
toc: content
---

# FetchLinkV2

`FetchLinkV2` 用于处理多个异步数据组件之间的联动关系，适合省市区、分类级联、上下游筛选等场景。它通过配置数组描述每一级组件的渲染方式、请求逻辑、参数传递方式和数据映射规则。

## Demo

<code src='./demos/base.tsx' title='基础联动' description='基础联动示例'></code>

<!-- <code src='./demos/nativeBackfill.tsx' title='原生回填' description='通过 form.setFieldsValue 回填后，组件内部自动重放联动链路并恢复隐藏项'></code>
<code src='./demos/nonForm.tsx' title='非表单场景' description='不依赖 Form.Item 和 form 实例，直接在筛选面板中使用级联请求能力'></code>
<code src='./demos/complex.tsx' title='复杂场景' description='复杂场景示例，包含多个异步选择器之间的联动关系'></code> -->

## 使用场景

- 多个异步选择器之间存在前后依赖关系。
- 后一个组件的请求参数需要依赖前一个组件的选中值。
- 上游组件变化时，需要自动清空下游组件的值和数据源。
- 组件数据需要经过接口转换后再注入到业务组件中。
- 业务组件不是固定组件，需要支持 `Select` 或其他自定义组件。

## 基本用法

通过 `config` 配置每一级联动组件。数组顺序即联动顺序：前一项变化后，会将请求参数和变化数据传递给后一项。

```tsx | pure
import { Form, Select } from 'antd';
import { FetchLinkV2 } from 'guos-components';

<FetchLinkV2
  config={[
    {
      decorator: Form.Item,
      decoratorProps: {
        name: 'province',
        label: '省份',
      },
      component: Select,
      componentProps: {
        placeholder: '请选择省份',
        options: [],
      },
      fetchData: fetchProvinceList,
      fieldNames: {
        key: 'value',
        dataSource: 'options',
      },
    },
    {
      decorator: Form.Item,
      decoratorProps: {
        name: 'city',
        label: '城市',
      },
      component: Select,
      componentProps: {
        placeholder: '请选择城市',
        options: [],
      },
      fetchData: fetchCityList,
      fetchParams: (prevFetchParams, prevOnChangeValue) => ({
        ...prevFetchParams,
        province: prevOnChangeValue,
      }),
      fieldNames: {
        key: 'value',
        dataSource: 'options',
      },
    },
  ]}
/>;
```

## 联动机制

每一个配置项都会渲染为一个独立的异步组件，内部流程如下：

1. 根据当前配置计算本级请求参数。
2. 调用 `fetchData` 获取数据。
3. 使用 `transformData` 转换接口数据。
4. 通过 `fieldNames.dataSource` 指定的属性名，将数据注入到业务组件中。
5. 业务组件触发 `onChange` 后，将当前请求参数和 `onChange` 参数传递给下一级组件。
6. 上游组件变化时，所有下游组件会自动清空值和数据源，并重新按依赖参数请求。

## API

### FetchLinkV2

| 参数   | 说明                                                        | 类型                     | 默认值 |
| ------ | ----------------------------------------------------------- | ------------------------ | ------ |
| config | 联动组件配置数组，数组顺序即组件联动顺序                    | `FetchComponentConfig[]` | -      |
| form   | 外部传入的 `antd Form` 实例，用于组件内部清空对应表单字段值 | `FormInstance`           | -      |

### FetchComponentConfig

`config` 中每一项的配置如下。

| 参数           | 说明                                                                                   | 类型                                            | 默认值                                     |
| -------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| decorator      | 外层包装组件，常用于传入 `Form.Item`                                                   | `ComponentType<any>`                            | -                                          |
| decoratorProps | 外层包装组件属性                                                                       | `Record<string, any>`                           | -                                          |
| component      | 实际渲染的业务组件，如 `Select`                                                        | `ComponentType<any>`                            | -                                          |
| componentProps | 传递给业务组件的属性                                                                   | `Record<string, any>`                           | -                                          |
| needFetchParam | 是否必须存在有效请求参数才发起请求。在 `FetchLinkV2` 中，除第一级外会自动设置为 `true` | `boolean`                                       | `false`                                    |
| fetchParams    | 当前组件请求参数，支持对象或函数                                                       | `Record<string, any> \| FetchParamsGetter`      | `{}`                                       |
| fetchData      | 数据请求函数，参数为当前组件计算后的请求参数                                           | `(params: Record<string, any>) => Promise<any>` | -                                          |
| transformData  | 数据转换函数，在接口返回后、注入组件前执行                                             | `(data: any) => any`                            | -                                          |
| fieldNames     | 字段映射配置                                                                           | `{ key?: string; dataSource?: string }`         | `{ key: 'key', dataSource: 'dataSource' }` |
| checkFirst     | 数据返回后是否自动选中第一个未禁用项                                                   | `boolean`                                       | `false`                                    |
| onChange       | 业务组件变化回调，参数与业务组件 `onChange` 保持一致                                   | `(...args: any[]) => void`                      | -                                          |
| clearFn        | 自定义清空方法，用于处理特殊组件的清空逻辑                                             | `() => void`                                    | -                                          |

### FetchParamsGetter

当 `fetchParams` 为函数时，会接收上一级组件的信息。

```ts
(prevFetchParams: Record<string, any>, ...prevOnChangeData: any[]) =>
  Record<string, any>;
```

| 参数             | 说明                                 |
| ---------------- | ------------------------------------ |
| prevFetchParams  | 上一级组件实际发起请求时使用的参数   |
| prevOnChangeData | 上一级组件 `onChange` 抛出的全部参数 |

以 `Select` 为例，`onChange` 的第一个参数通常是选中值，第二个参数通常是选中项，因此可以这样组织下一级请求参数：

```tsx | pure
fetchParams: (prevFetchParams, value, option) => ({
  ...prevFetchParams,
  parentId: value,
  parentLabel: option?.label,
});
```

## 字段映射

组件默认会将接口返回数据作为 `dataSource` 属性传递给业务组件。如果业务组件使用其他属性接收数据，需要通过 `fieldNames.dataSource` 指定。

例如 `antd` 的 `Select` 使用 `options` 接收选项数据：

```tsx | pure
fieldNames: {
  key: 'value',
  dataSource: 'options',
}
```

其中 `fieldNames.key` 用于 `checkFirst` 自动选中时读取选中值。默认读取数据项的 `key` 字段，配置为 `value` 后会读取第一项的 `value` 字段作为组件值。

## 自动选中第一项

开启 `checkFirst` 后，请求完成并存在有效数据时，会自动选中第一个未禁用的选项，并继续触发下一级组件请求。

```tsx | pure
{
  component: Select,
  fetchData: fetchProvinceList,
  checkFirst: true,
  fieldNames: {
    key: 'value',
    dataSource: 'options',
  },
}
```

如果数据项存在 `disabled: true`，会跳过禁用项。

## 清空规则

当某一级组件触发变化时，它后面的所有组件都会被清空：

- 组件内部值会被重置为 `undefined`。
- 组件数据源会被重置为 `null`。
- 如果当前处于 `Form.Item` 下，并且传入了 `decoratorProps.name`，会同步清空对应表单字段。
- 如果传入了 `clearFn`，会执行自定义清空逻辑。

对于不受 `value` 控制，或不能通过 `Form.Item` 自动清空的特殊组件，建议传入 `clearFn`。

## 请求参数有效性

除第一级组件外，后续组件默认需要依赖上一级参数才会请求。参数会在以下条件下被视为有效：

- 参数对象至少包含一个字段。
- 每个参数值都不为 `undefined`、`null` 或空字符串。

如果参数无效，本级组件不会发起请求。

## 注意事项

- `config` 数组顺序决定联动顺序。
- 业务组件需要支持 `value` 和 `onChange` 受控属性。
- 业务组件的数据源属性由 `fieldNames.dataSource` 决定。
- 使用 `Form.Item` 作为 `decorator` 时，建议传入 `decoratorProps.name`，便于上游变化时同步清空表单字段。
- `fetchData` 返回较慢时，组件内部会忽略过期请求结果，避免旧请求覆盖新数据。
- 如果需要把上游选中项的更多信息传给下游，可以通过 `fetchParams` 函数的剩余参数读取上游 `onChange` 抛出的数据。
