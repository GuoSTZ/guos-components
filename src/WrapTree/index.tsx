import { Empty, Input, Tree, TreeProps, Checkbox } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, {
  ChangeEventHandler,
  Key,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { useDebounce } from '../_utils/useDebounce';

import styles from './index.module.less';

export interface WrapTreeProps extends TreeProps {
  /** 数据为空时的展示 */
  renderEmpty?: React.ReactNode;
  /** 自定义搜索框，内部搜索框直接使用了原生input组件，建议替换 */
  renderSearch?: (props: any) => React.ReactNode;
  /** 是否展示搜索框 */
  showSearch?:
    | boolean
    | {
        placeholder?: string;
        onChange?: ChangeEventHandler<HTMLInputElement>;
        filterData?: (data: DataNode[], searchValue: string) => DataNode[];
        /** 是否开启防抖 */
        debounce?: boolean;
        /** 防抖时间 */
        debounceTime?: number;
        [key: string]: any;
      };
  /** 是否展示全选 */
  showCheckAll?: boolean;
  wrapClassName?: string;
  wrapStyle?: React.CSSProperties;
}

export interface WrapTreeRef {
  // checkAll: () => void;
  // uncheckAll: () => void;
  /** 清空选中，不会触发任何的回调 */
  clearChecked: () => void;
}

const WrapTree = forwardRef<WrapTreeRef, WrapTreeProps>((props, ref) => {
  const {
    renderEmpty,
    renderSearch,
    height,
    showSearch,
    showCheckAll = false,
    wrapClassName,
    wrapStyle,
    ...rest
  } = props;
  const {
    debounce = true,
    debounceTime = 300,
    filterData: filterDataFn = null,
    ...restShowSearch
  } = typeof showSearch === 'object' ? showSearch : {};

  const rowKey = props?.fieldNames?.key || 'key';

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<
    | Key[]
    | {
        checked: Key[];
        halfChecked: Key[];
      }
  >([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [filterTreeData, setFilterTreeData] = useState<DataNode[]>([]);
  const [treeDataKeys, setTreeDataKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (props.treeData) {
      setTreeData(props.treeData);
      setCheckedAll(false);
      setTreeDataKeys(props.treeData.map((item: any) => item[rowKey]));
    }
  }, [props.treeData, rowKey]);

  useEffect(() => {
    const { checkable, checkedKeys, checkStrictly } = rest;
    const defaultValue = checkStrictly ? { checked: [], halfChecked: [] } : [];
    if (checkable) {
      setCheckedKeys(checkedKeys || defaultValue);
    }
  }, [props.checkedKeys]);

  const defaultFilterTreeData = useCallback(
    (data: DataNode[], searchValue: string) => {
      if (!searchValue) return data;

      const title = props.fieldNames?.title || 'title';
      const children = props.fieldNames?.children || 'children';
      const searchTerms = searchValue.toLowerCase();

      // 使用 WeakMap 缓存搜索结果
      const matchCache = new WeakMap<DataNode, boolean>();

      // 检查节点是否匹配
      const checkNodeMatch = (node: DataNode): boolean => {
        const cached = matchCache.get(node);
        if (cached !== undefined) {
          return cached;
        }

        // @ts-ignore
        const titleLower = String(node[title] || '').toLowerCase();
        const isMatched = titleLower.includes(searchTerms);

        matchCache.set(node, isMatched);
        return isMatched;
      };

      // 处理树节点
      const processNode = (node: DataNode): DataNode | null => {
        const isMatched = checkNodeMatch(node);
        // @ts-ignore
        const childNodes = node[children];

        if (!childNodes?.length) {
          return isMatched ? node : null;
        }

        const processedChildren = childNodes
          .map((child: any) => processNode(child))
          .filter(Boolean) as DataNode[];

        if (isMatched || processedChildren.length > 0) {
          return {
            ...node,
            ...(processedChildren.length > 0 && {
              [children]: processedChildren,
            }),
          };
        }

        return null;
      };

      try {
        return data
          .map((node) => processNode(node))
          .filter(Boolean) as DataNode[];
      } catch (error) {
        console.error(error);
        return data;
      }
    },
    [props.fieldNames],
  );

  const handleFilterData = useCallback(
    (data: DataNode[], searchValue: string) => {
      if (typeof showSearch === 'object' && filterDataFn) {
        const filteredTree = filterDataFn?.(data, searchValue);
        setFilterTreeData(filteredTree || []);
      } else {
        const filteredTree: DataNode[] = defaultFilterTreeData(
          data,
          searchValue,
        );
        setFilterTreeData(filteredTree);
      }
    },
    [filterDataFn, defaultFilterTreeData],
  );

  const handleSearch = useCallback(
    (e: any) => {
      const value = e.target.value;
      setSearchValue(value);
      handleFilterData(treeData, value);
      if (typeof props?.showSearch === 'object') {
        props?.showSearch?.onChange?.(e);
      }
    },
    [props?.showSearch, handleFilterData, treeData],
  );

  const debouncedFilter = useDebounce(
    handleSearch,
    typeof debounceTime === 'number' ? debounceTime : 300,
  );

  const searchProps = useMemo(() => {
    if (typeof showSearch === 'object') {
      const newProps = {
        ...restShowSearch,
        onChange: debounce ? debouncedFilter : handleSearch,
      };
      return newProps;
    }
    return showSearch;
  }, [handleSearch, showSearch, debounce, restShowSearch]);

  const mockAllNodeInfo = useCallback(
    (checked: boolean, checkedNodes: any[]) => {
      return {
        checked,
        node: {
          key: 'all',
          title: '全部',
          expanded: false,
          selected: false,
          checked,
        } as any,
        checkedNodes,
        event: 'checkAll' as any,
        nativeEvent: {} as any,
      };
    },
    [treeData, checkedAll],
  );

  const checkAllOnChange = useCallback(
    (e: any) => {
      setCheckedAll(e.target.checked);
      if (e.target.checked) {
        if (rest.checkable && rest.checkStrictly) {
          setCheckedKeys({
            checked: treeDataKeys,
            halfChecked: [],
          });
          rest?.onCheck?.(
            { checked: treeDataKeys, halfChecked: [] },
            mockAllNodeInfo(e.target.checked, treeData),
          );
        } else {
          setCheckedKeys(treeDataKeys);
          rest?.onCheck?.(
            treeDataKeys,
            mockAllNodeInfo(e.target.checked, treeData),
          );
        }
      } else {
        if (rest.checkable && rest.checkStrictly) {
          setCheckedKeys({ checked: [], halfChecked: [] });
          rest?.onCheck?.(
            { checked: [], halfChecked: [] },
            mockAllNodeInfo(e.target.checked, []),
          );
        } else {
          setCheckedKeys([]);
          rest?.onCheck?.([], mockAllNodeInfo(e.target.checked, []));
        }
      }
    },
    [
      treeDataKeys,
      rest?.onCheck,
      mockAllNodeInfo,
      rest.checkable,
      rest.checkStrictly,
    ],
  );

  useImperativeHandle(
    ref,
    () => ({
      // checkAll: () => {
      //   checkAllOnChange({ target: { checked: true } });
      // },
      // uncheckAll: () => {
      //   checkAllOnChange({ target: { checked: false } });
      // },
      /** 清空选中，不会触发任何的回调 */
      clearChecked: () => {
        if (checkedAll) {
          setCheckedAll(false);
        }
      },
    }),
    [checkedAll],
  );

  return (
    <div className={wrapClassName} style={wrapStyle}>
      {!!searchProps
        ? renderSearch?.(searchProps) || (
            <Input
              {...(typeof searchProps === 'object' ? searchProps : {})}
              style={{ marginBottom: 4, paddingRight: 8 }}
            />
          )
        : null}
      {rest?.checkable && showCheckAll ? (
        <Checkbox
          style={{ height: 28, lineHeight: '24px', paddingBottom: 4 }}
          checked={checkedAll}
          onChange={checkAllOnChange}
        >
          全部
        </Checkbox>
      ) : null}
      {treeData.length > 0 ? (
        <Tree
          {...rest}
          className={
            rest?.className
              ? `${styles['wrap-tree']} ${rest?.className}`
              : styles['wrap-tree']
          }
          treeData={searchValue ? filterTreeData : treeData}
          height={typeof height === 'number' ? height : 280}
          checkedKeys={checkedKeys}
          onCheck={(checkedKeys, info) => {
            setCheckedKeys(checkedKeys);
            rest.onCheck?.(checkedKeys, info);
          }}
        />
      ) : (
        <div>
          {renderEmpty ?? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      )}
    </div>
  );
});

export default memo(WrapTree);
