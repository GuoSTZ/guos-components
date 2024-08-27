import {
  Checkbox,
  Collapse,
  CollapsePanelProps,
  CollapseProps,
  Radio,
} from 'antd';
import { CheckboxGroupProps, CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { memo, useState, useEffect, useCallback } from 'react';
import styles from './index.module.less';

type Item = {
  label: string;
  value: number;
  [key: string]: any;
};

interface IDataSourceItem extends Item {
  children: IDataSourceItem[];
}

interface ICollapseProps extends CollapseProps {
  panelProps?: CollapsePanelProps;
}

export interface LinkedCollapseProps {
  /**
   * value 数据格式
   * {
   *   1: [{x: '', y: '', z: ''}],
   *   2: [{x: '', y: '', z: ''}],
   * }
   */
  value: Record<number, any[]>;
  onChange: (value: any) => void;
  checkboxGroupProps?: CheckboxGroupProps;
  collapseProps?: ICollapseProps;
  /**
   * dataSource 数据格式
   * [ { label: 'xxx', value: 1, children: [ { label: 'xxx1', value: 1, ... } ] } ]
   */
  dataSource?: IDataSourceItem[];
  fieldNames?: {
    label?: string;
    value?: string;
    children?: string;
  };
  defaultRadioValue?: Record<number, Record<number, number>>;
}

const LinkedCollapse = (props: LinkedCollapseProps) => {
  const {
    value,
    onChange,
    checkboxGroupProps = {},
    collapseProps = {},
    dataSource,
    fieldNames,
  } = props;
  const { panelProps, ...restCollapseProps } = collapseProps;
  const fieldLabel = fieldNames?.label || 'label';
  const fieldValue = fieldNames?.value || 'value';
  const fieldChildren = fieldNames?.children || 'children';

  /** 数据存储，记录上层 Checkbox.Group 数据  */
  const [options, setOptions] = useState<Item[]>([]);
  const [panelData, setPanelData] = useState<Record<number, Map<string, any>>>(
    {},
  );

  /** Collapse.Panel 的展开/收起控制 */
  const [activeKey, setActiveKey] = useState<number[]>([]);

  /** 上层 Checkbox.Group 的选中值，控制 Collapse.Panel 的显隐 */
  const [checkedValue, setCheckedValue] = useState<number[]>([]);
  /** Collapse.Panel 中的 Checkbox.Group 全选状态控制 */
  const [panelCheckAll, setPanelCheckAll] = useState<Record<number, boolean>>(
    {},
  );
  /** Collapse.Panel 中的 Checkbox.Group 半选状态控制 */
  const [panelIndeterminate, setPanelIndeterminate] = useState<
    Record<number, boolean>
  >({});
  /** Collapse.Panel 中的 Checkbox.Group 的选中值 */
  const [panelCheckedValue, setPanelCheckedValue] = useState<
    Record<number, Map<string, any>>
  >({});

  useEffect(() => {
    if (!dataSource || dataSource?.length === 0) {
      return;
    }
    const newOptions: Item[] = [],
      newCheckedValue: number[] = [],
      newPanelData: Record<number, Map<string, any>> = {};

    dataSource.forEach((item) => {
      newOptions.push({
        label: item.label,
        value: item.value,
      });
      newCheckedValue.push(item.value);
      newPanelData[item.value] = new Map(
        item.children.map((child) => [child?.[fieldLabel], child]),
      );
    });

    setOptions(newOptions);
    setCheckedValue(newCheckedValue);
    setActiveKey(newCheckedValue);
    setPanelData(newPanelData);
  }, [dataSource]);

  // 编辑回填
  useEffect(() => {
    if (!value || Object.keys(panelData).length === 0) {
      return;
    }
    const newCheckedValue: number[] = [],
      newPanelCheckedValue: Record<number, Map<string, any>> = {},
      newPanelCheckAll: Record<number, boolean> = {},
      newPanelIndeterminate: Record<number, boolean> = {};

    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        let checkedBoxCount = 0;
        newCheckedValue.push(+key);
        value[+key]?.forEach((item) => {
          newPanelCheckedValue[key] = new Map([
            ...(newPanelCheckedValue[key] || new Map()),
            [item?.[fieldLabel], item],
          ]);

          if (item?.[fieldValue]) {
            checkedBoxCount++;
          }
        });
        newPanelCheckAll[+key] =
          checkedBoxCount > 0 && checkedBoxCount === panelData[key]?.size;
        newPanelIndeterminate[+key] =
          checkedBoxCount > 0 && checkedBoxCount < panelData[key]?.size;
      }
    }

    setCheckedValue(newCheckedValue);
    setPanelCheckedValue(newPanelCheckedValue);
    setPanelCheckAll(newPanelCheckAll);
    setPanelIndeterminate(newPanelIndeterminate);
  }, [value, fieldLabel, fieldValue, panelData]);

  /** 数据抛出 */
  const getOnChangeValue = useCallback(
    (
      panelCheckedValue: Record<number, Map<string, any>>,
      checkedValue: number[],
    ) => {
      const values: Record<number, any[]> = {};
      checkedValue?.forEach((item) => {
        const currentPanelData = panelData[item];
        const tmp: any[] = [];
        [...currentPanelData.values()].forEach((it) => {
          if (!!panelCheckedValue[item]?.get(it?.[fieldLabel])) {
            tmp.push(panelCheckedValue[item].get(it?.[fieldLabel]));
          } else {
            tmp.push(it);
          }
        });
        values[item] = tmp;
      });
      onChange?.(values);
    },
    [onChange, panelData],
  );

  /** 最上层 Checkbox.Group 的点击事件回调 */
  const checkboxGroupOnChange = useCallback(
    (checkedValue: any) => {
      setCheckedValue(checkedValue);
      checkboxGroupProps?.onChange?.(checkedValue);

      getOnChangeValue(panelCheckedValue, checkedValue);
    },
    [panelCheckedValue, getOnChangeValue],
  );

  /** 控制 Collapse 的收起/展开 */
  const collapseOnChange = useCallback((activeKey: any) => {
    setActiveKey(activeKey);
    collapseProps?.onChange?.(activeKey);
  }, []);

  /** Collapse 内部的全选点击事件回调  */
  const panelOnCheckAll = useCallback(
    (e: CheckboxChangeEvent, value: number) => {
      const allKeys = new Map();
      const checked = e.target.checked;
      for (let [key, content] of panelData[value].entries()) {
        const option = panelCheckedValue[value].get(key);
        const checkStatus = option?.[fieldValue];
        let defaultCheckedValue = 1;
        if (option?.children) {
          defaultCheckedValue = option.children?.find(
            (item: Item) => item.default,
          )?.[fieldValue];
        }
        allKeys.set(key, {
          ...content,
          [fieldValue]: checked ? checkStatus || defaultCheckedValue : 0,
        });
      }
      const newPanelCheckedValue = { ...panelCheckedValue, [value]: allKeys };

      setPanelCheckAll((origin) => ({ ...origin, [value]: checked }));
      setPanelIndeterminate((origin) => ({ ...origin, [value]: false }));
      setPanelCheckedValue(newPanelCheckedValue);

      getOnChangeValue(newPanelCheckedValue, checkedValue);
    },
    [panelData, checkedValue, getOnChangeValue, fieldValue, panelCheckedValue],
  );

  /** Collapse 内部的 Checkbox.Group 点击事件回调  */
  const panelCheckboxOnChange = useCallback(
    (e: any, value: number, option: any) => {
      let defaultCheckedValue = 1;
      if (option?.children) {
        defaultCheckedValue = option.children?.find(
          (item: Item) => item.default,
        )?.[fieldValue];
      }
      const allKeys = panelData[value] || new Map();
      const map = new Map<string, any>([...(panelCheckedValue[value] || [])]);
      let newPanelCheckedValue: Record<string, Map<string, any>> = {};
      map.set(option?.[fieldLabel], {
        ...option,
        [fieldValue]: e.target.checked ? defaultCheckedValue : 0,
      });
      newPanelCheckedValue = {
        ...panelCheckedValue,
        [value]: map,
      };
      setPanelCheckedValue(newPanelCheckedValue);

      const checkedSize = [...newPanelCheckedValue[value].values()].filter(
        (item) => !!item.status,
      )?.length;

      setPanelIndeterminate((origin) => ({
        ...origin,
        [value]: !!checkedSize && checkedSize < allKeys.size,
      }));
      setPanelCheckAll((origin) => ({
        ...origin,
        [value]: checkedSize === allKeys.size,
      }));

      getOnChangeValue(newPanelCheckedValue, checkedValue);
    },
    [
      fieldValue,
      fieldLabel,
      panelCheckedValue,
      panelData,
      checkedValue,
      getOnChangeValue,
    ],
  );

  /** Collapse 内部的 Radio.Group 点击事件回调  */
  const panelRadioOnChange = useCallback(
    (e: any, rootValue: number, value: string) => {
      const radioValue = e.target.value;
      const map = panelCheckedValue[rootValue];
      map.set(value, {
        ...(panelCheckedValue[rootValue]?.get(value) || {}),
        [fieldValue]: radioValue,
      });
      const newPanelCheckedValue = {
        ...panelCheckedValue,
        [rootValue]: map,
      };
      setPanelCheckedValue(newPanelCheckedValue);

      getOnChangeValue(newPanelCheckedValue, checkedValue);
    },
    [fieldValue, panelCheckedValue, checkedValue, getOnChangeValue],
  );

  /** 由于 Radio.Group 独立在 Checkbox.Group 的选择计算之外，因此只能额外通过options进行单选框的默认值处理 */
  const getPanelRadioValue = useCallback(
    (panelValue: number, value: string, options: any[]) => {
      const radioValues = options.map((item) => item?.[fieldValue]);
      const radioDefaultValue = options.find((item) => item.default)?.[
        fieldValue
      ];
      const currentCheckedValue =
        panelCheckedValue[panelValue]?.get(value)?.[fieldValue];

      if (radioValues.includes(currentCheckedValue)) {
        return currentCheckedValue;
      } else {
        return radioDefaultValue;
      }
    },
    [panelCheckedValue, fieldValue],
  );

  return (
    <div
      className={styles['linked-collapse-wrap']}
      style={{ minHeight: checkedValue.length === 0 ? 0 : 225 }}
    >
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
                <div className={styles['linked-collapse-panel-group']}>
                  {item.children?.map((child) => (
                    <>
                      <Checkbox
                        onChange={(e) =>
                          panelCheckboxOnChange(e, item.value, child)
                        }
                        checked={
                          !!panelCheckedValue[item.value]?.get(
                            child?.[fieldLabel],
                          )?.[fieldValue]
                        }
                        className={
                          child?.[fieldChildren]
                            ? `${styles['linked-collapse-panel-item']} ${styles['linked-collapse-panel-item-with-child']}`
                            : styles['linked-collapse-panel-item']
                        }
                      >
                        {child?.[fieldLabel]}
                      </Checkbox>
                      {child?.[fieldChildren] ? (
                        <Radio.Group
                          options={child?.[fieldChildren]}
                          disabled={
                            !panelCheckedValue[item.value]?.get(
                              child?.[fieldLabel],
                            )?.[fieldValue]
                          }
                          value={
                            !!panelCheckedValue[item.value]?.get(
                              child?.[fieldLabel],
                            )?.[fieldValue]
                              ? getPanelRadioValue(
                                  item.value,
                                  child?.[fieldLabel],
                                  child?.[fieldChildren],
                                )
                              : undefined
                          }
                          onChange={(e) =>
                            panelRadioOnChange(
                              e,
                              item.value,
                              child?.[fieldLabel],
                            )
                          }
                        />
                      ) : null}
                    </>
                  ))}
                </div>
              </Collapse.Panel>
            ) : null,
          )}
        </Collapse>
      </div>
    </div>
  );
};

export default memo(LinkedCollapse);
