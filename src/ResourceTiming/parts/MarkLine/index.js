import React from 'react';
import './index.less';

// 瀑布图
class Falls extends React.Component {
  render() {
    const { allTime, time, color, w = 2 } = this.props;

    return (
      <div
        className='rt-markline'
        style={{
          top: 0,
          left: (time * 100) / allTime + '%',
          height: '100%',
          width: w + 'px',
          background: color,
        }}
      />
    );
  }
}

export default Falls;
