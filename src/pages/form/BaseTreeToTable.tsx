import { Typography } from 'antd';
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useImperativeHandle,
} from 'react';

import TreeToTable, {
  TreeToTableRef,
  TreeToTableProps,
  TreeToTableDataNode,
} from '@/components/TreeToTable';

interface ITreeProps
  extends Omit<TreeToTableProps<any>['treeProps'], 'treeData'> {
  treeData?: TreeToTableDataNode[];
}

export interface BaseTreeToTableProps<T>
  extends Omit<TreeToTableProps<T>, 'treeProps'> {
  treeProps: ITreeProps;
  fetchData: (params: Record<string, unknown>) => Promise<any>;
  fetchParams?: any;
  onChange?: (value: TreeToTableProps<T>['value']) => void;
  text: {
    header: string[];
    operations: {
      title: string;
      delete: string;
      deleteAll: string;
    };
  };
}

const BaseTreeToTable = React.forwardRef<any, BaseTreeToTableProps<any>>(
  (props, ref) => {
    const {
      fetchData,
      fetchParams,
      text,
      treeProps,
      tableProps,
      ...restProps
    } = props;
    const treeToTableRef = useRef<TreeToTableRef>(null);
    const [treeData, setTreeData] = useState([]);

    const getData = useCallback(
      (params: any) => {
        fetchData({ ...fetchParams, ...params })
          .then((data) => {
            setTreeData(data);
          })
          .catch(() => {});
      },
      [fetchData, fetchParams],
    );

    useEffect(() => {
      getData({});
    }, [getData]);

    const operationColumn = useMemo(() => {
      return {
        title: text?.operations?.title || 'Operation',
        render: (_: any, record: Record<string, unknown>) => (
          <Typography.Link
            onClick={() =>
              treeToTableRef.current?.tableDelete(record?.id as React.Key)
            }
          >
            {text?.operations?.delete || 'Delete'}
          </Typography.Link>
        ),
      };
    }, [text]);

    useImperativeHandle(
      ref,
      () => ({
        treeToTableRef,
      }),
      [treeToTableRef],
    );

    return (
      <TreeToTable
        ref={treeToTableRef}
        treeProps={{
          header: text?.header?.[0],
          showSearch: true,
          ...treeProps,
          treeData,
        }}
        tableProps={{
          header: [
            text?.header?.[1],
            <a onClick={() => treeToTableRef.current?.tableDeleteAll()}>
              {text?.operations?.deleteAll || 'DeleteAll'}
            </a>,
          ],
          showSearch: true,
          ...tableProps,
          columns: [...(tableProps.columns || []), operationColumn],
        }}
        {...restProps}
      />
    );
  },
);

export default memo(BaseTreeToTable);
