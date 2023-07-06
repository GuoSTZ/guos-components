import React from 'react';
import './index.less';

export default () => {
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
