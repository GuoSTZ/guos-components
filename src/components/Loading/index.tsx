import React from 'react';
import './index.less';

interface Test {
  test: string;
  a: string;
}

interface IProps {
  qqq: Omit<Test, 'a'> & {
    b?: string;
    c?: string;
  };
}

export default () => {
  const func = (props: IProps) => {
    const { qqq } = props;
    const { b, c } = qqq;
  };

  const renderCircle = () => {
    return (
      <div className="circle-wrap">
        <span className="circle-dot"></span>
        <span className="circle-dot"></span>
        <span className="circle-dot"></span>
        <span className="circle-dot"></span>
      </div>
    );
  };

  const renderTriangle = () => {
    return (
      <div className="triangle-wrap">
        <span className="triangle-dot"></span>
        <span className="triangle-dot"></span>
        <span className="triangle-dot"></span>
        <span className="triangle-dot"></span>
      </div>
    );
  };

  return (
    <div className="loading">
      {renderCircle()}
      {renderTriangle()}
    </div>
  );
};
