import { Alert, Tooltip, Select, SelectProps, Descriptions, Modal } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, {
  Key,
  memo,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import styles from './index.module.less';

type IOption = {
  label: string | ReactNode;
  value: string | number;
  descriptions: Array<{
    label: string;
    value: string | number;
    changed?: boolean;
  }>;
};

export interface TipSelectProps extends Omit<SelectProps, 'options'> {
  options?: Array<IOption>;
}

function getDifferentElements(array1: Array<Key>, array2: Array<Key>) {
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  const diff = new Set([...set1].filter((x) => !set2.has(x)));
  diff.forEach((x) => set2.has(x) || diff.add(x));
  return Array.from(diff);
}

function getCommonElements(array1: Array<Key>, array2: Array<Key>) {
  const set1 = new Set(array1);
  const commonElements = array2.filter((element) => set1.has(element));
  return commonElements;
}

const TipSelect = (props: TipSelectProps) => {
  const { options, ...restProps } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectOption, setSelectOption] = useState<IOption>();
  const [nextSelectOption, setNextSelectOption] = useState<IOption>();

  useEffect(() => {
    const mergedValue = props.value || props.defaultValue;
    if (mergedValue) {
      const option = options?.find((option) => option.value === mergedValue);
      setSelectOption(option);
    }
  }, [props.value, props.defaultValue]);

  const renderTip = (
    descriptions: Array<{ label: string; value: string | number }>,
  ) => {
    return (
      <Descriptions
        className={styles['tip-select-desc']}
        title="授权详情"
        column={1}
      >
        {descriptions?.map((item, idx) => (
          <Descriptions.Item key={idx} label={item.label}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    );
  };

  const newOptions = options?.map((item) => {
    return {
      ...item,
      label: (
        <Tooltip
          placement="leftTop"
          showArrow={false}
          title={renderTip(item.descriptions)}
          {...restProps}
          overlayClassName={styles['tip-select-tips']}
        >
          {item.label}
        </Tooltip>
      ),
    };
  });

  const handleFilter = (inputValue: string, option: any) => {
    return option?.label?.props?.children
      ?.toLowerCase?.()
      .includes(inputValue.toLowerCase());
  };

  const handleOnChange = (
    value: string,
    option: DefaultOptionType | DefaultOptionType[],
  ) => {
    setNextSelectOption(option as IOption);

    if (selectOption === undefined) {
      setSelectOption(option as IOption);
      props?.onChange?.(value, option);
    } else {
      setModalOpen(true);
    }
  };

  const handleModalOnOk = () => {
    setSelectOption(nextSelectOption);
    setModalOpen(false);
    props?.onChange?.(nextSelectOption?.value, nextSelectOption!);
  };

  const renderTemplate = (type: 'curr' | 'next') => {
    const config = {
      curr: {
        title: '原模板：',
        option: selectOption,
        descriptions: selectOption?.descriptions || [],
      },
      next: {
        title: '当前模板：',
        option: nextSelectOption,
        descriptions: nextSelectOption?.descriptions || [],
      },
    };
    if (type === 'next') {
      // 避免两侧数据顺序不一致，进行一次排序
      const currSort = config['curr']?.descriptions?.map((item) => item.label);
      const nextSort =
        config['next']?.descriptions?.map((item) => item.label) || [];

      const common = getCommonElements(nextSort, currSort);
      const diff = getDifferentElements(nextSort, currSort);

      const newNextDescriptions: IOption['descriptions'] = [];
      [...common, ...diff].forEach((item) => {
        const curr = config['curr']?.descriptions?.find(
          (i) => i.label === item,
        );
        const next = config['next']?.descriptions?.find(
          (i) => i.label === item,
        );
        if (!next) {
          return;
        }
        if (curr?.value !== next?.value) {
          newNextDescriptions.push({
            ...next,
            changed: true,
          });
        } else {
          newNextDescriptions.push(next);
        }
      });
      config['next'] = {
        ...config['next'],
        descriptions: newNextDescriptions,
      };
    }

    return (
      <div className={styles['tip-select-modal-template']}>
        <div className={styles['tip-select-modal-template-title']}>
          {config[type].title}
        </div>
        <div className={styles['tip-select-modal-template-text']}>
          {(config[type].option?.label as ReactElement)?.props?.children}
        </div>
        <div>
          <Descriptions
            className={styles['tip-select-desc']}
            title="操作属性"
            column={1}
          >
            {config[type]?.descriptions?.map((item, idx) => {
              return (
                <Descriptions.Item key={idx} label={item.label}>
                  {item.value}
                  {item.changed ? (
                    <span style={{ color: 'red' }}>【变更项】</span>
                  ) : null}
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </div>
      </div>
    );
  };

  return (
    <>
      <Select
        filterOption={handleFilter}
        {...restProps}
        value={selectOption?.value as string}
        showSearch
        className={styles['tip-select']}
        popupClassName={styles['tip-select-dropdown']}
        options={newOptions}
        onChange={handleOnChange}
      />
      <Modal
        title="提醒"
        wrapClassName={styles['tip-select-modal']}
        open={modalOpen}
        cancelText="取消"
        okText="确定"
        onOk={handleModalOnOk}
        onCancel={() => setModalOpen(false)}
      >
        <Alert
          className={styles['tip-select-modal-alert']}
          type="warning"
          showIcon
          message="确定更改当前“身份组或身份的名称”的授权模板？"
        />
        <div className={styles['tip-select-modal-templates']}>
          {renderTemplate('curr')}
          <div className={styles['tip-select-modal-templates-separate']}>
            更改
          </div>
          {renderTemplate('next')}
        </div>
      </Modal>
    </>
  );
};

export default memo(TipSelect);
