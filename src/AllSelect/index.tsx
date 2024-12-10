import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
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
   * 全选时的数据格式处理，为`true`时，自动处理成[value]格式，为`function`时，自定义处理格式
   *
   * 该属性优先级高于 `selectAllValue` 属性
   */
  transformSelectAllValue?:
    | boolean
    | ((data: Record<string, unknown>[]) => any);
}

type CompoundedComponent = ((props: AllSelectProps) => React.ReactElement) & {
  defaultProps?: SelectProps;
  Option: typeof Select.Option;
  OptGroup: typeof Select.OptGroup;
};

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

  const handledSelectAllValue = useMemo(() => {
    if (!options || options?.length === 0) {
      return [];
    }
    const len = options?.length;
    const data = [];
    for (let i = 0; i < len; i++) {
      !options[i].disabled && data.push(options[i][rowValue]);
    }
    if (
      typeof transformSelectAllValue === 'boolean' &&
      transformSelectAllValue
    ) {
      return data;
    } else if (typeof transformSelectAllValue === 'function') {
      return transformSelectAllValue(options);
    } else {
      return Array.isArray(selectAllValue) ? selectAllValue : [selectAllValue];
    }
  }, [options, rowValue, transformSelectAllValue, selectAllValue]);

  useEffect(() => {
    if (
      Array.isArray(value) &&
      ((value.length === 1 && value[0] === handledSelectAllValue) || // 当传入字符串或者数字作为全选值时
        value === handledSelectAllValue) // 当直接传入数组作为全选值时
    ) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
      setLastSelect(value);
    }
  }, [value, handledSelectAllValue]);

  const selectOnChange = useCallback(
    (value: any, option: any) => {
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
      const checked = e?.target?.checked;
      setSelectedAll(checked);
      if (checked) {
        onChange?.(
          handledSelectAllValue,
          // @ts-ignore
          [
            {
              key: selectAllText,
              value: handledSelectAllValue,
              label: selectAllText,
            },
          ],
        );
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
export default AllSelect;
