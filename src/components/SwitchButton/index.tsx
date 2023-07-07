import React from 'react';
import './index.less';

export default () => {
  const buttonOnClick = (e: React.MouseEvent) => {
    e.currentTarget.classList.toggle('switch-button-checked');
  };

  return (
    <button className="switch-button" onClick={buttonOnClick}>
      <div className="switch-button-handle"></div>
    </button>
  );
};
