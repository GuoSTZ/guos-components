---
toc: content
---

# VirtualTable

## Demo

<code src='./demos/manual-width-cases.tsx' title='手动列宽：场景一（部分列定宽）' description='部分列设置固定宽度，其余列自动分配'></code>
<code src='./demos/manual-width-percent-mix.tsx' title='手动列宽：场景二（百分比混用）' description='百分比与像素宽度混用时的换算行为'></code>
<code src='./demos/manual-width-all-fixed-underflow.tsx' title='手动列宽：场景三（总宽不足）' description='全部定宽但总宽不足时，自动均分剩余空间'></code>
<code src='./demos/manual-width-fixed-overflow.tsx' title='手动列宽：场景四（总宽超限）' description='固定宽总和超出容器时，未定宽列的兜底表现'></code>
<code src='./demos/antd-overflow-one-no-width.tsx' title='对照：antd Table（超宽+单列未设宽）' description='其余列全设宽且总宽超容器，仅保留一列不设宽度，观察原生表现'></code>
<code src='./demos/scrollx-overflow-one-no-width.tsx' title='ScrollXVirtualTable：超宽+单列未设宽' description='其余列定宽且总宽超容器，未设宽列按 scroll.x 预算参与分配'></code>
<code src='./demos/scrollx-percent-mix.tsx' title='ScrollXVirtualTable：百分比混用' description='百分比与像素宽度混用时，百分比列基于 scroll.x 进行换算'></code>
<code src='./demos/scrollx-budget-tight.tsx' title='ScrollXVirtualTable：预算偏紧' description='scroll.x 预算不足时，未设宽列在预算内被压缩'></code>
<code src='./demos/raw-width-risk-cases.tsx' title='未手动处理：风险一（未设宽塌陷）' description='未设置 width 的列可能得到 0 宽度'></code>
<code src='./demos/raw-width-risk-percent.tsx' title='未手动处理：风险二（百分比失真）' description='百分比字符串被直接解析为像素数字'></code>
<code src='./demos/raw-width-risk-underflow.tsx' title='未手动处理：风险三（右侧留白）' description='总宽小于容器时没有自动补齐策略'></code>
<code src='./demos/list-virtual-basic.tsx' title='ListVirtualTable：基础场景' description='使用 VariableSizeList 做纵向虚拟化，并保留现有列宽计算策略'></code>
<code src='./demos/list-virtual-wide-columns.tsx' title='ListVirtualTable：宽列压力场景' description='列宽总和远大于容器宽时，观察横向滚动体验'></code>
