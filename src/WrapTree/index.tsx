import { Empty, Input, Tree, TreeProps } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, {
  ChangeEventHandler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useDebounce } from '../_utils/useDebounce';

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
  wrapClassName?: string;
  wrapStyle?: React.CSSProperties;
}

const WrapTree = (props: WrapTreeProps) => {
  const {
    renderEmpty,
    renderSearch,
    height,
    showSearch,
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

  const [treeData, setTreeData] = useState<DataNode[]>([]);

  const [searchValue, setSearchValue] = useState('');
  const [filterTreeData, setFilterTreeData] = useState<DataNode[]>([]);

  useEffect(() => {
    if (props.treeData) {
      setTreeData(props.treeData);
    }
  }, [props.treeData]);

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

  return (
    <div className={wrapClassName} style={wrapStyle}>
      {!!searchProps
        ? renderSearch?.(searchProps) || (
            <Input
              {...(typeof searchProps === 'object' ? searchProps : {})}
              style={{ marginBottom: 4 }}
            />
          )
        : null}
      {treeData.length > 0 ? (
        <Tree
          {...rest}
          treeData={searchValue ? filterTreeData : treeData}
          height={typeof height === 'number' ? height : 280}
        />
      ) : (
        <div>
          {renderEmpty ?? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      )}
    </div>
  );
};

export default memo(WrapTree);
