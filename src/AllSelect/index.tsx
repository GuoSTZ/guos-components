import React, { ReactNode, useEffect, useState } from 'react';
import { Select, SelectProps, Checkbox, Empty } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import styles from './index.module.less';

export interface AllSelectProps extends SelectProps {
  selectAll?: boolean;
  selectAllValue?: string | number;
  selectAllText?: string;
}

type CompoundedComponent = ((props: AllSelectProps) => React.ReactElement) & {
  defaultProps?: SelectProps;
  Option: typeof Select.Option;
  OptGroup: typeof Select.OptGroup;
};

const AllSelect: CompoundedComponent = (props) => {
  const { value, children, onChange, selectAll = true } = props;
  const [selectedAll, setSelectedAll] = useState(false);
  const [lastSelect, setLastSelect] = useState(undefined as any);
  const [lastOption, setLastOption] = useState(undefined as any);
  const selectAllValue = props.selectAllValue || 'all';
  const selectAllText = props.selectAllText || '全部';

  useEffect(() => {
    if (
      Array.isArray(value) &&
      value.length === 1 &&
      value[0] === selectAllValue
    ) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
      setLastSelect(value);
    }
  }, [value]);

  const selectOnChange = (value: any, option: any) => {
    setLastSelect(value);
    setLastOption(option);
    onChange?.(value, option);
  };
  const selectAllOnChange = (e: CheckboxChangeEvent) => {
    const checked = e?.target?.checked;
    setSelectedAll(checked);
    if (checked) {
      onChange?.(
        [selectAllValue],
        [{ key: selectAllValue, value: selectAllValue, label: selectAllText }],
      );
    } else {
      onChange?.(lastSelect, lastOption);
    }
  };
  const renderDropdown = (originNode: ReactNode) => {
    const menu = (
      <React.Fragment>
        {selectAll && !!props?.options?.length && (
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
  };

  const handleOptions = (options: any) => {
    const len = options?.length;
    for (let i = 0; i < len; i++) {
      options[i].disabled = selectedAll;
    }
    return options || [];
  };

  const handelChildrenNode = (data: any) => {
    if (data !== undefined) {
      const newData = Array.isArray(data) ? data : [data];
      return newData?.map((child: any) => {
        return React.cloneElement(child, {
          disabled: selectedAll,
        });
      });
    }
    return null;
  };
  return (
    <Select
      mode={selectAll ? 'multiple' : undefined}
      {...props}
      value={selectedAll ? selectAllText : lastSelect}
      onChange={selectOnChange}
      options={handleOptions(props?.options)}
      notFoundContent={
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="ant-empty-small"
        />
      }
      dropdownRender={renderDropdown}
    >
      {handelChildrenNode(children)}
    </Select>
  );
};
AllSelect.Option = Select.Option;
AllSelect.OptGroup = Select.OptGroup;
export default AllSelect;
