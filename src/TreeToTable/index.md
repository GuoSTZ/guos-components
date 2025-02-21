---
toc: content
---

# TreeToTable

:::info{title=使用须知}
该组件强制父子节点选中状态不再关联

存在以下特性，使用前请先确认
下面特性以两层树节点为例进行表述，如果是多层节点请自行区分父子节点关系

1. 点击父节点时，会选中其所有子节点
2. 取消选中子节点，会同时取消选中该子节点的父节点
3. 通过单选方式逐一选中父节点下全部子节点后，并不会使父节点呈现选中状态
4. 单选选中子节点时，右侧表格会展示该子节点数据
5. 单选选中父节点时，右侧表格仅展示该父节点数据，且该父节点下所有的子节点不会显示在右侧表格中，已经被选中的子节点也会被表格移出
6. 当存在父节点被选中，取消选中该父节点下的子节点时，右侧表格会展示该父节点下其他的子节点

对于表格列宽的设置，有如下规则：

1. 如果设置的值为 100，'100'，'100px'，最终值都是转换为【100】来做计算
2. 如果设置的值是百分比，例如'50%'，那么就会转换为【表格宽度\*50%】来做计算
3. 如果所有列都设置了宽度，且宽度超过表格总宽度，那么每一列的实际宽度为【转换后的宽度】
4. 如果所有列都设置了宽度，且宽度未超过表格总宽度，那么每一列的实际宽度为【转换后的宽度+剩余宽度/总列数】
5. 如果部分列设置宽度，且这些列的总宽度超过表格总宽度，那么未设置宽度的列的实际宽度为【表格宽度】
6. 如果部分列设置宽度，且这些列的总宽度未超过表格总宽度，那么未设置宽度的列的实际宽度为【剩余宽度/未设置宽度的列数】

:::

## Demo

<code src='./demos/one-level.tsx' title='一层数据' description='一层数据的使用'></code>
<code src='./demos/two-level.tsx' title='两层数据' description='两层数据的使用'></code>
<code src='./demos/mutiple-level.tsx' title='多层数据' description='目前支持两层及两层以上数据的展示'></code>
<code src='./demos/asset/index.tsx' title='资产场景' description='在Form表单中的展示'></code>
<code src='./demos/identity/index.tsx' title='身份场景' description='在Form表单中的展示'></code>

## API

### TreeToTable

| 参数       | 说明             | 类型                                   | 默认值 | 是否必填 |
| ---------- | ---------------- | -------------------------------------- | ------ | -------- |
| onChange   | 数据变化时的回调 | (value: TreeToTableDataNode[]) => void | -      | 否       |
| tableProps | 右侧表格相关属性 | [tableProps](#tableProps)              | -      | 是       |
| treeProps  | 左侧树相关属性   | [treeProps](#treeProps)                | -      | 是       |
| value      | 当前选中的数据   | any[]                                  | -      | 否       |

### tableProps

| 参数         | 说明               | 类型                                                                                    | 默认值                               | 是否必填 |
| ------------ | ------------------ | --------------------------------------------------------------------------------------- | ------------------------------------ | -------- |
| filterSearch | 表格自定义搜索回调 | (filterValue: string, data: any) => boolean                                             | [默认值](#table-filtersearch-默认值) | 否       |
| header       | 表格头部自定义     | string \| React.ReactNode[] \| ((info: { tableKeySet: Set<React.Key> }) => ReactNode[]) | -                                    | 否       |
| placeholder  | 表格搜索框底部文字 | string                                                                                  | -                                    | 否       |
| showSearch   | 表格是否可搜索     | boolean                                                                                 | -                                    | 否       |

#### table filterSearch 默认值

```ts
(value: string, record: any) => {
  return record.name && record.name.toLowerCase().includes(value.toLowerCase());
};
```

其余属性参考[Table](https://4x-ant-design.antgroup.com/components/table-cn/#Table)

### treeProps

| 参数          | 说明                                                                 | 类型                                                                                    | 默认值                              | 是否必填 |
| ------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------- | -------- |
| treeData      | 树源数据                                                             | [TreeToTableDataNode](#TreeToTableDataNode)                                             | -                                   | 是       |
| header        | 树头部自定义                                                         | string \| React.ReactNode[] \| ((info: { tableKeySet: Set<React.Key> }) => ReactNode[]) | -                                   | 否       |
| showSearch    | 树是否可搜索                                                         | boolean                                                                                 | -                                   | 否       |
| filterSearch  | 树自定义搜索回调                                                     | (filterValue: string, data: any) => boolean                                             | [默认值](#tree-filtersearch-默认值) | 否       |
| placeholder   | 树搜索框底部文字                                                     | string                                                                                  | -                                   | 否       |
| showCheckAll  | 树组件是否显示全选组件                                               | boolean                                                                                 | true                                | 否       |
| checkAll      | 树组件全选组件受控值                                                 | boolean                                                                                 | true                                | 否       |
| checkAllText  | 树组件全选组件文案                                                   | string                                                                                  | `Check All`                         | 否       |
| aliasChildren | 避免 children 字段的存在，移动数据时，右侧表格出现 children 数据展开 | string                                                                                  | `childrenStored`                    | 否       |

#### tree filterSearch 默认值

```ts
(value: string, record: any) => {
  return record.name && record.name.toLowerCase().includes(value.toLowerCase());
};
```

其余属性参考[Tree](https://4x-ant-design.antgroup.com/components/tree-cn/#Tree-props)

### TreeToTableDataNode

| 参数     | 说明         | 类型                | 默认值 | 是否必填 |
| -------- | ------------ | ------------------- | ------ | -------- |
| pKey     | 父节点键值   | React.Key           | -      | 否       |
| pName    | 父节点显示值 | React.ReactNode     | -      | 否       |
| children | 子节点       | TreeToTableDataNode | -      | 否       |
