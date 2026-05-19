import React from 'react';
import { Upload as AntdUpload, UploadProps as AntdUploadProps } from 'antd';

export interface UploadProps extends AntdUploadProps {
  /** 是否开启大文件上传 */
  large?: boolean;
  /** 大文件上传时，最大文件大小，单位：字节，默认：5MB */
  largeFileSize?: number;
}

const Upload = (props: UploadProps) => {
  const {
    // large = false,
    // largeFileSize = 5 * 1024 * 1024,
    ...otherProps
  } = props;

  return <AntdUpload {...otherProps} />;
};

export default Upload;
