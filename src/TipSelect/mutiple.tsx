import {
  Alert,
  Tooltip,
  Select,
  SelectProps,
  Descriptions,
  Modal,
  TooltipProps,
} from 'antd';
import React, {
  Key,
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import styles from './index.module.less';
import SvgLine from '../SvgLine';

type IOption = {
  label: string | ReactNode;
  value: string | number;
  descriptions: Array<{
    name: string;
    content: Array<{
      label: string;
      value: string | number;
      changed?: boolean;
    }>;
  }>;
};

export interface TipSelectProps extends Omit<SelectProps, 'options'> {
  options: Array<IOption>;
  /** 数据变更时的方法回调，需要返回一个Promise */
  onChangeFn?: (value: string | number, option: IOption) => Promise<any>;
  /** onChange的前置回调方式，返回为false时，则阻断组件onChange事件 */
  beforeOnChange?: (value: string | number, option: IOption) => boolean;
  /** 一些额外信息的传入 */
  extra?: Record<string, unknown>;
  tooltipProps?: TooltipProps;
  tooltipTitle?: string;
}

function getDifferentElements(array1: Array<Key>, array2: Array<Key>) {
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  const diff1 = new Set([...set1].filter((x) => !set2.has(x)));
  const diff2 = new Set([...set2].filter((x) => !set1.has(x)));

  return Array.from([...diff1, ...diff2]);
}

function sortArray(arr: any[]) {
  return arr
    .sort((a, b) => {
      if (a.name !== b.name) return a.name.localeCompare(b.name);
      return a.content
        .map((c: any) => c.label)
        .join(',')
        .localeCompare(b.content.map((c: any) => c.label).join(','));
    })
    .map((item) => ({
      ...item,
      content: item.content.sort((c1: any, c2: any) =>
        c1.label.localeCompare(c2.label),
      ),
    }));
}

function compareContent(content1: any[], content2: any[]) {
  let changes = [];
  let index1 = 0,
    index2 = 0;

  while (index1 < content1.length || index2 < content2.length) {
    if (
      index1 < content1.length &&
      (index2 >= content2.length ||
        content1[index1].label < content2[index2].label)
    ) {
      // content1中有而content2中没有的，视为已删除（但此处不直接处理，因为我们只关注array2的变化）
      index1++;
    } else if (
      index2 < content2.length &&
      (index1 >= content1.length ||
        content2[index2].label < content1[index1].label)
    ) {
      // content2中有而content1中没有的，视为新增
      changes.push({ ...content2[index2], changed: true });
      index2++;
    } else {
      // label相同，比较value
      if (content1[index1].value !== content2[index2].value) {
        changes.push({ ...content2[index2], changed: true });
      } else {
        // 如果value也相同，则不视为变化（但可以选择加入，标记为无变化）
        changes.push({ ...content2[index2], changed: false });
      }
      index1++;
      index2++;
    }
  }
  // return changes.filter(c => c.change !== false); // 过滤掉无变化的项（如果需要的话）
  return changes;
}

function compareArrays(arr1: any[], arr2: any[]) {
  let array1 = [...arr1],
    array2 = [...arr2];
  // 排序两个数组
  array1 = sortArray(array1);
  array2 = sortArray(array2);

  let result: any[] = [];
  let map1 = new Map(array1.map((item) => [item.name, item.content])); // 用于快速查找array1中的项

  array2.forEach((item2) => {
    let item1Content = map1.get(item2.name);

    if (item1Content) {
      // 如果在array1中找到了对应的name，则比较content
      let changes = compareContent(item1Content, item2.content);
      if (changes.length > 0) {
        // 如果有变化，则添加到结果中
        result.push({ ...item2, content: changes });
      }
      // 如果没有变化，则不添加到结果中（或者可以选择以某种方式标记无变化）
    } else {
      // 如果在array1中没有找到对应的name，则视为新增项
      result.push({
        ...item2,
        content: item2.content.map((c: any) => ({ ...c, changed: true })),
      });
    }
  });

  return result;
}

const TipSelect = (props: TipSelectProps) => {
  const {
    options = [],
    onChangeFn,
    beforeOnChange,
    tooltipProps,
    tooltipTitle,
    extra,
    ...restProps
  } = props;
  const mergedValue = props.value || props.defaultValue;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectOption, setSelectOption] = useState<IOption>();
  const [nextSelectOption, setNextSelectOption] = useState<IOption>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const renderTip = (descriptions: IOption['descriptions']) => {
    return (
      <>
        <div className={styles['tip-select-tips-title']}>{tooltipTitle}</div>
        {descriptions.map((item) => (
          <Descriptions
            className={styles['tip-select-tips-desc']}
            title={item.name}
            column={1}
          >
            {item.content?.map((it, idx) => (
              <Descriptions.Item key={idx} label={it.label}>
                {it.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ))}
      </>
    );
  };

  const getOptions = useCallback(() => {
    return options?.map((item) => {
      return {
        ...item,
        label: (
          <Tooltip
            placement="leftTop"
            showArrow={false}
            title={renderTip(item.descriptions)}
            {...tooltipProps}
            overlayClassName={styles['tip-select-tips']}
          >
            {item.label}
          </Tooltip>
        ),
      };
    });
  }, [options, tooltipProps]);

  useEffect(() => {
    const newOptions = getOptions();
    if (mergedValue) {
      const option = newOptions.find((option) => option.value === mergedValue);
      setSelectOption(option);
    }
  }, [mergedValue, getOptions]);

  const handleFilter = (inputValue: string, option: any) => {
    return option?.label?.props?.children
      ?.toLowerCase?.()
      .includes(inputValue.toLowerCase());
  };

  const isChanged = (
    curr: IOption['descriptions'],
    next: IOption['descriptions'],
  ) => {
    if (curr?.length !== next?.length) {
      return true;
    }
    const currNames = curr?.map((item) => item.name);
    const nextNames = next?.map((item) => item.name) || [];
    const diff = getDifferentElements(currNames, nextNames);
    if (diff.length > 0) {
      return true;
    }

    return currNames.some((name, idx) => {
      const currContent = curr[idx]?.content;
      const nextContent = next.find((item) => item.name === name)?.content;

      if (currContent?.length !== nextContent?.length) {
        return true;
      }

      const currContentLabels = currContent?.map((item) => item.label);
      const nextContentLabels = nextContent?.map((item) => item.label);
      const diff = getDifferentElements(currContentLabels, nextContentLabels);
      if (diff.length > 0) {
        return true;
      }
      const nextObj: Record<string, string | number> = {};
      nextContent?.forEach((item) => {
        nextObj[item.label] = item.value;
      });
      return currContent?.some((item) => nextObj[item.label] !== item.value);
    });
  };

  const handleOnChange = (value: string, option: IOption) => {
    const status = beforeOnChange?.(value, option);
    if (status === false) {
      props?.onChange?.(value, option);
      return;
    }

    setNextSelectOption(option);

    if (
      selectOption === undefined ||
      !isChanged(selectOption.descriptions, option.descriptions)
    ) {
      // 如果是没有值时进行数据选择，那么不需要进行变更明细弹窗展示
      props?.onChange?.(value, option);
      setConfirmLoading(true);
      onChangeFn &&
        onChangeFn(value, option as IOption).finally(() => {
          setConfirmLoading(false);
        });
    } else {
      setModalOpen(true);
    }
  };

  const handleModalOnOk = () => {
    // setSelectOption(nextSelectOption);
    setConfirmLoading(true);
    onChangeFn &&
      onChangeFn(nextSelectOption?.value as any, nextSelectOption as any)
        .then(() => {
          setConfirmLoading(false);
          setModalOpen(false);
        })
        .catch(() => {
          setConfirmLoading(false);
        });
    props?.onChange?.(nextSelectOption?.value, nextSelectOption as any);
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
      const data = compareArrays(
        config['curr']?.descriptions,
        config['next']?.descriptions,
      );
      config['next'] = {
        ...config['next'],
        descriptions: data,
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
          {config[type]?.descriptions?.map((item) => {
            return (
              <Descriptions
                className={styles['tip-select-desc']}
                title={item.name}
                column={1}
              >
                {item.content?.map((it, idx) => {
                  return (
                    <Descriptions.Item key={idx} label={it.label}>
                      {it.value}
                      {it.changed ? (
                        <span style={{ color: 'red' }}>【变更项】</span>
                      ) : null}
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Select
        filterOption={handleFilter}
        {...restProps}
        value={(selectOption?.value as string) ?? null}
        showSearch
        className={styles['tip-select']}
        popupClassName={styles['tip-select-dropdown']}
        options={getOptions()}
        // @ts-ignore
        onChange={handleOnChange}
      />
      <Modal
        title="提醒"
        wrapClassName={styles['tip-select-modal']}
        bodyStyle={{
          maxHeight: 400,
          overflowY: 'auto',
        }}
        open={modalOpen}
        width={1100}
        cancelText="取消"
        okText="确定"
        onOk={handleModalOnOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={confirmLoading}
      >
        <Alert
          className={styles['tip-select-modal-alert']}
          type="warning"
          showIcon
          message={`确定更改当前“${extra?.identityShowName}”的授权模板？`}
        />
        <div className={styles['tip-select-modal-templates']}>
          {renderTemplate('curr')}
          <div className={styles['tip-select-modal-templates-separate']}>
            <SvgLine width={'100%'} text="变更明细" />
          </div>
          {renderTemplate('next')}
        </div>
      </Modal>
    </>
  );
};

export default memo(TipSelect);
