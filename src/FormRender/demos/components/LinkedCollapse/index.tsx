import {
  Checkbox,
  Collapse,
  CollapsePanelProps,
  CollapseProps,
  Radio,
  RadioChangeEvent,
} from 'antd';
import { CheckboxGroupProps, CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { memo, Key, useState, useEffect, useCallback } from 'react';
import styles from './index.module.less';

type Item = {
  label: React.ReactNode;
  value: Key;
};

interface IDataSourceItem extends Item {
  children: IDataSourceItem[];
}

interface ICollapseProps extends CollapseProps {
  panelProps?: CollapsePanelProps;
}

interface IValue {
  value: Key;
  content: Key[];
}

export interface LinkedCollapseProps {
  /**
   * value 数据格式
   * @enum - [
   *   { value: 1, content: [1, 2, 3, 10, ...] },
   *   { value: 2, content: [1, 2, 3, 4, ...] },
   * ]
   */
  value: IValue[];
  onChange: (value: any) => void;
  checkboxGroupProps?: CheckboxGroupProps;
  collapseProps?: ICollapseProps;
  /**
   * dataSource 数据格式
   * @enum - [
   *   { label: 'xxx', value: 1, children: [ { label: 'xxx1', value: 101, children: [ {label: 'xxx2', value: 10001} ] } ] },
   *   { label: 'yyy', value: 1, children: [ { label: 'yyy1', value: 101, children: [ {label: 'yyy2', value: 10001} ] } ] }
   * ]
   * @description - 类树形数据结构，但目前仅支持三层，后续也不会做拓展，即使传入更多层，也不会进行处理
   */
  dataSource?: IDataSourceItem[];
  /**
   * 需要传入各个 Radio.Group 默认值，格式限制如下
   * @enum - { 1: { 1: 10 } } }
   */
  defaultRadioValue?: Record<Key, Record<Key, Key>>;
}

const LinkedCollapse = (props: LinkedCollapseProps) => {
  const {
    value,
    onChange,
    checkboxGroupProps = {},
    collapseProps = {},
    dataSource,
    defaultRadioValue,
  } = props;
  const { panelProps, ...restCollapseProps } = collapseProps;

  /** 数据存储，记录所有的 Radio.Group 数据 */
  const [panelRadioData, setPanelRadioData] = useState<
    Record<Key, Record<Key, Key[]>>
  >({});
  /** 数据存储，记录 Collapse.Group 下 Checkbox.Group 数据 */
  const [panelData, setPanelData] = useState<Record<Key, Key[]>>({});
  /** 数据存储，记录上层 Checkbox.Group 数据  */
  const [options, setOptions] = useState<Item[]>([]);

  /** Collapse.Panel 的展开/收起控制 */
  const [activeKey, setActiveKey] = useState<Key[]>([]);

  /** 上层 Checkbox.Group 的选中值，控制 Collapse.Panel 的显隐 */
  const [checkedValue, setCheckedValue] = useState<Key[]>([]);
  /** Collapse.Panel 中的 Checkbox.Group 全选状态控制 */
  const [panelCheckAll, setPanelCheckAll] = useState<Record<Key, boolean>>({});
  /** Collapse.Panel 中的 Checkbox.Group 半选状态控制 */
  const [panelIndeterminate, setPanelIndeterminate] = useState<
    Record<Key, boolean>
  >({});
  /** Collapse.Panel 中的 Checkbox.Group 的选中值 */
  const [panelCheckedValue, setPanelCheckedValue] = useState<
    Record<Key, Key[]>
  >({});
  /**
   * Collapse.Panel 中的 Radio.Group 的选中值
   * 数据格式：{ 1: { 1: 10 } }
   */
  const [panelRadioValue, setPanelRadioValue] = useState<
    Record<Key, Record<Key, Key>>
  >({});

  useEffect(() => {
    if (!dataSource || dataSource?.length === 0) {
      return;
    }
    const newOptions: Item[] = [],
      newCheckedValue: Key[] = [],
      newPanelRadioData: Record<Key, Record<Key, Key[]>> = {},
      newPanelData: Record<Key, Key[]> = {};

    dataSource?.forEach((item) => {
      newOptions.push({
        label: item.label,
        value: item.value,
      });
      newCheckedValue.push(item.value);

      item.children?.forEach((it) => {
        newPanelData[item.value] = [
          ...(newPanelData[item.value] || []),
          it.value,
        ];
        if (it.children) {
          newPanelRadioData[item.value] = {
            ...newPanelRadioData[item.value],
            [it.value]: it.children?.map((i) => i.value),
          };
        }
      });
    });

    setPanelRadioData(newPanelRadioData);
    setPanelData(newPanelData);
    setOptions(newOptions || []);

    setCheckedValue(newCheckedValue);
    setActiveKey(newCheckedValue);
  }, [dataSource]);

  /** 编辑回填处理 */
  useEffect(() => {
    const newCheckedValue: Key[] = [],
      newPanelCheckAll: Record<Key, boolean> = {},
      newPanelIndeterminate: Record<Key, boolean> = {},
      newPanelCheckedValue: Record<Key, Key[]> = {},
      newPanelRadioValue: Record<Key, Record<Key, Key>> = {};

    if (!value || Object.keys(panelData)?.length === 0) {
      return;
    }
    value?.forEach((item) => {
      newCheckedValue.push(item.value);

      // 拆分 Checkbox 和 Radio 的值
      const radio: Key[] = [],
        checkbox: Key[] = [];
      item.content?.forEach((it) => {
        if (panelData[item.value]?.includes(it)) {
          checkbox.push(it);
        } else {
          radio.push(it);
          // 找出这个it的值，对应是哪个单选数据
          Object.keys(panelRadioData[item.value] || {}).some((key) => {
            if (panelRadioData[item.value][key].includes(it)) {
              newPanelRadioValue[item.value] = {
                ...newPanelRadioValue[item.value],
                [key]: it,
              };
              return true;
            }
            return false;
          });
        }
      });
      newPanelCheckAll[item.value] =
        checkbox.length > 0 &&
        checkbox.length === panelData[item.value]?.length;
      newPanelIndeterminate[item.value] =
        checkbox.length > 0 &&
        checkbox.length !== panelData[item.value]?.length;
      newPanelCheckedValue[item.value] = checkbox;
    });
    setCheckedValue(newCheckedValue);
    setPanelCheckAll(newPanelCheckAll);
    setPanelIndeterminate(newPanelIndeterminate);
    setPanelCheckedValue(newPanelCheckedValue);
    setPanelRadioValue(newPanelRadioValue);
  }, [value, panelRadioData, panelData]);

  /** 合并要向外爬抛出的数据 */
  const getValue = useCallback(
    (
      checkedValue: Key[],
      panelCheckedValue: Record<Key, Key[]>,
      panelRadioValue: Record<Key, Record<Key, Key>>,
    ) => {
      return checkedValue.map((item: Key) => {
        const content: Key[] = [];
        panelCheckedValue[item]?.forEach((it) => {
          if (panelRadioValue?.[item]?.[it] !== undefined) {
            content.push(panelRadioValue?.[item]?.[it]);
          }
        });
        return {
          value: item,
          content: [...(panelCheckedValue[item] || []), ...content],
        };
      });
    },
    [],
  );

  /** 最上层 Checkbox.Group 的点击事件回调 */
  const checkboxGroupOnChange = useCallback(
    (checkedValue: any) => {
      setCheckedValue(checkedValue);
      checkboxGroupProps?.onChange?.(checkedValue);

      const fieldValue = getValue(
        checkedValue,
        panelCheckedValue,
        panelRadioValue,
      );
      onChange?.(fieldValue);
    },
    [panelCheckedValue, panelRadioValue, getValue],
  );

  /** 控制 Collapse 的收起/展开 */
  const collapseOnChange = useCallback((activeKey: any) => {
    setActiveKey(activeKey);
    collapseProps?.onChange?.(activeKey);
  }, []);

  /** Collapse 内部的 Checkbox.Group 的点击事件回调 */
  const panelOnChange = useCallback(
    (list: any[], value: Key) => {
      const allKeys = panelData[value] || [];

      setPanelCheckedValue((origin) => ({ ...origin, [value]: list }));
      setPanelIndeterminate((origin) => ({
        ...origin,
        [value]: !!list.length && list.length < allKeys.length,
      }));
      setPanelCheckAll((origin) => ({
        ...origin,
        [value]: list.length === allKeys.length,
      }));

      const fieldValue = getValue(
        checkedValue,
        { ...panelCheckedValue, [value]: list },
        defaultRadioValue || {},
      );
      onChange?.(fieldValue);
    },
    [panelData, checkedValue, panelCheckedValue, defaultRadioValue, getValue],
  );

  /** Collapse 内部的全选点击事件回调  */
  const panelOnCheckAll = useCallback(
    (e: CheckboxChangeEvent, value: Key) => {
      const allKeys = panelData[value] || [];
      const newPanelCheckedValue = e.target.checked
        ? { ...panelCheckedValue, [value]: allKeys }
        : { ...panelCheckedValue, [value]: [] };

      setPanelCheckedValue(newPanelCheckedValue);
      setPanelIndeterminate((origin) => ({ ...origin, [value]: false }));
      setPanelCheckAll((origin) => ({ ...origin, [value]: e.target.checked }));

      const fieldValue = getValue(
        checkedValue,
        newPanelCheckedValue,
        defaultRadioValue || {},
      );
      onChange?.(fieldValue);
    },
    [panelData, checkedValue, panelCheckedValue, defaultRadioValue, getValue],
  );

  /** Collapse 内部的单选点击事件回调 */
  const panelRadioOnChange = useCallback(
    (e: RadioChangeEvent, panelValue: Key, value: Key) => {
      const newPanelRadioValue = {
        ...panelRadioValue,
        [panelValue]: {
          ...panelRadioValue?.[panelValue],
          [value]: e.target.value,
        },
      };
      setPanelRadioValue(newPanelRadioValue);

      const fieldValue = getValue(
        checkedValue,
        panelCheckedValue,
        newPanelRadioValue,
      );
      onChange?.(fieldValue);
    },
    [checkedValue, panelCheckedValue],
  );

  /** 由于 Radio.Group 独立在 Checkbox.Group 的选择计算之外，因此只能额外通过options进行单选框的默认值处理 */
  const getPanelRadioValue = useCallback(
    (panelValue: Key, value: Key) => {
      if (panelRadioValue?.[panelValue]?.[value] === undefined) {
        return defaultRadioValue?.[panelValue]?.[value];
      }
      return panelRadioValue?.[panelValue]?.[value];
    },
    [panelRadioData, panelRadioValue, defaultRadioValue],
  );

  return (
    <div className={styles['linked-collapse-wrap']}>
      <div>
        <Checkbox.Group
          {...checkboxGroupProps}
          options={options}
          value={checkedValue}
          onChange={checkboxGroupOnChange}
        />
      </div>
      <div>
        <Collapse
          {...restCollapseProps}
          className={
            restCollapseProps?.className
              ? `${styles['linked-collapse']} ${restCollapseProps?.className}`
              : styles['linked-collapse']
          }
          activeKey={activeKey}
          onChange={collapseOnChange}
        >
          {dataSource?.map((item) =>
            checkedValue.includes(item.value) ? (
              <Collapse.Panel
                {...panelProps}
                key={item.value}
                header={item.label}
                className={
                  panelProps?.className
                    ? `${styles['linked-collapse-panel']} ${panelProps?.className}`
                    : styles['linked-collapse-panel']
                }
              >
                <Checkbox
                  indeterminate={panelIndeterminate[item.value]}
                  onChange={(e) => panelOnCheckAll(e, item.value)}
                  checked={panelCheckAll[item.value]}
                >
                  全选
                </Checkbox>
                <Checkbox.Group
                  className={styles['linked-collapse-panel-group']}
                  value={panelCheckedValue[item.value]}
                  onChange={(e) => panelOnChange(e, item.value)}
                >
                  {item.children?.map((child) => (
                    <>
                      <Checkbox
                        value={child.value}
                        className={
                          child.children
                            ? `${styles['linked-collapse-panel-item']} ${styles['linked-collapse-panel-item-with-child']}`
                            : styles['linked-collapse-panel-item']
                        }
                      >
                        {child.label}
                      </Checkbox>
                      {child.children ? (
                        <Radio.Group
                          options={child.children}
                          disabled={
                            !panelCheckedValue[item.value]?.includes(
                              child.value,
                            )
                          }
                          value={
                            panelCheckedValue[item.value]?.includes(child.value)
                              ? getPanelRadioValue(item.value, child.value)
                              : undefined
                          }
                          onChange={(e) =>
                            panelRadioOnChange(e, item.value, child.value)
                          }
                        />
                      ) : null}
                    </>
                  ))}
                </Checkbox.Group>
              </Collapse.Panel>
            ) : null,
          )}
        </Collapse>
      </div>
    </div>
  );
};

export default memo(LinkedCollapse);
