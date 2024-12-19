import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import { Select, SelectProps, Checkbox, Empty } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import styles from './index.module.less';

export interface AllSelectProps extends SelectProps {
  /**
   * 是否需要展示全选按钮，默认`true`
   */
  selectAll?: boolean;
  /**
   * 全选值
   * @example 'all'，0，[1, 2, 3, 4]
   */
  selectAllValue?: string | number | Array<string | number>;
  /**
   * 全选文案
   * @example '全部'
   */
  selectAllText?: string;
  /**
   * 全选时的数据格式处理，为`true`时，自动处理成[value]格式，该属性开启后，组件仅第一次渲染时，如果value和可选值一致，那么会选中【全部】
   *
   * 该属性优先级高于 `selectAllValue` 属性
   */
  transformSelectAllValue?: boolean;
}

type CompoundedComponent = ((props: AllSelectProps) => React.ReactElement) & {
  defaultProps?: SelectProps;
  Option: typeof Select.Option;
  OptGroup: typeof Select.OptGroup;
};

/** 判断两个数组数据是否一致，如果是对象数组，那么只判定数据key值 */
function areArraysEqual(
  arr1: any[] = [],
  arr2: any[] = [],
  key: string = 'value',
) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const set1 = new Set();
  arr1.forEach((item) => {
    if (typeof item === 'object') {
      set1.add(item?.[key]);
    } else {
      set1.add(item);
    }
  });

  for (let i = 0; i < arr2.length; i++) {
    const item = arr2[i];
    if (typeof item === 'object' && !set1.has(item?.[key])) {
      return false;
    } else {
      if (!set1.has(item)) {
        return false;
      }
    }
  }
  return true;
}

const AllSelect: CompoundedComponent = (props) => {
  const {
    value,
    children,
    onChange,
    selectAll = true,
    selectAllValue = ['all'],
    selectAllText = '全部',
    options,
    fieldNames,
    transformSelectAllValue,
    ...restProps
  } = props;
  const [selectedAll, setSelectedAll] = useState(false);
  const [lastSelect, setLastSelect] = useState(undefined as any);
  const [lastOption, setLastOption] = useState(undefined as any);
  const rowValue = fieldNames?.value || 'value';
  const initRef = useRef(false);

  // 可以选择的数据，去除disabled数据
  const canSelectedOptions = useMemo(() => {
    if (!options || options?.length === 0) {
      return [];
    }
    const len = options?.length || 0;
    const data = [];
    for (let i = 0; i < len; i++) {
      !options?.[i].disabled && data.push(options?.[i]?.[rowValue]);
    }
    return data;
  }, [options, rowValue]);

  const handledSelectAllValue = useMemo(() => {
    if (!options || options?.length === 0) {
      return [];
    }
    if (
      typeof transformSelectAllValue === 'boolean' &&
      transformSelectAllValue
    ) {
      return canSelectedOptions;
    }
    // else if (typeof transformSelectAllValue === 'function') {
    //   return transformSelectAllValue(options);
    // }
    else {
      return Array.isArray(selectAllValue) ? selectAllValue : [selectAllValue];
    }
  }, [transformSelectAllValue, selectAllValue, canSelectedOptions]);

  useEffect(() => {
    console.log(value, handledSelectAllValue, '=====123');
    if (Array.isArray(value) && value === handledSelectAllValue) {
      setSelectedAll(true);
    } else if (
      handledSelectAllValue?.length > 0 &&
      initRef.current === false &&
      areArraysEqual(value, handledSelectAllValue, rowValue)
    ) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
      setLastSelect(value);
    }
  }, [value, handledSelectAllValue, rowValue]);

  const selectOnChange = useCallback(
    (value: any, option: any) => {
      // 数据变动后，立刻更改initRef
      initRef.current = true;
      // 在输入框中，叉选【全部】时
      if (value?.length === 0 && selectedAll) {
        setSelectedAll(false);
        onChange?.(lastSelect, lastOption);
      } else {
        setLastSelect(value);
        setLastOption(option);
        onChange?.(value, option);
      }
    },
    [
      onChange,
      setSelectedAll,
      selectedAll,
      setLastSelect,
      setLastOption,
      lastSelect,
      lastOption,
    ],
  );

  const selectAllOnChange = useCallback(
    (e: CheckboxChangeEvent) => {
      // 数据变动后，立刻更改initRef
      const checked = e?.target?.checked;
      setSelectedAll(checked);
      if (checked) {
        onChange?.(handledSelectAllValue, [
          {
            key: selectAllText,
            // @ts-ignore
            value: handledSelectAllValue,
            label: selectAllText,
          },
        ]);
      } else {
        onChange?.(lastSelect, lastOption);
      }
    },
    [
      setSelectedAll,
      onChange,
      selectAllValue,
      selectAllText,
      lastSelect,
      lastOption,
      handledSelectAllValue,
    ],
  );

  const renderDropdown = useCallback(
    (originNode: ReactNode) => {
      const menu = (
        <React.Fragment>
          {selectAll && !!options?.length && (
            <div className={styles['mc-tree-select-all']}>
              <Checkbox
                checked={selectedAll}
                onChange={selectAllOnChange}
                style={{ lineHeight: `24px`, width: '100%' }}
              >
                {selectAllText}
              </Checkbox>
            </div>
          )}
          {originNode}
        </React.Fragment>
      );
      return menu;
    },
    [selectAll, options, selectAllOnChange, selectedAll, selectAllText],
  );

  const handledOptions = useMemo(() => {
    if (options) {
      const data = [];
      const len = options?.length;
      for (let i = 0; i < len; i++) {
        data.push({
          ...options[i],
          disabled: selectedAll || options[i].disabled || options[i].disabledBp,
          disabledBp: options[i].disabled,
        });
      }
      return data;
    }
    return [];
  }, [options, selectedAll]);

  const handelChildrenNode = useCallback(
    (data: any) => {
      if (data !== undefined) {
        const newData = Array.isArray(data) ? data : [data];
        return newData?.map((child: any) => {
          return React.cloneElement(child, {
            disabled: selectedAll || child.disabled || child.disabledBp,
            disabledBp: child.disabled,
          });
        });
      }
      return null;
    },
    [selectedAll],
  );

  return (
    <Select
      notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      fieldNames={fieldNames}
      {...restProps}
      mode={selectAll ? 'multiple' : undefined}
      value={selectedAll ? [selectAllText] : lastSelect}
      onChange={selectOnChange}
      options={handledOptions}
      dropdownRender={renderDropdown}
    >
      {handelChildrenNode(children)}
    </Select>
  );
};
AllSelect.Option = Select.Option;
AllSelect.OptGroup = Select.OptGroup;
export default memo(AllSelect);
