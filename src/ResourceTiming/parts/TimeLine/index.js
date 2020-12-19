import React from 'react';
import { formatTimeUnit } from '../../utils';
import './index.less';

// 瀑布图
class Falls extends React.Component {
  render() {
    const { allTime, showTime } = this.props;

    // 时间轴算法
    const l = (parseInt(allTime) + '').length;
    const xs = Math.pow(10, l - 1);
    const num = Math.ceil(allTime / xs);
    let coefficient = 1;
    if (num < 4) coefficient = 2;
    if (num > 6) coefficient = 0.5;
    // 时间轴参数
    const lineTime = xs / coefficient;
    // TODO 可能会存在时间轴偏少的情况
    const lineNum = num * coefficient;
    const lineW = (lineTime / allTime) * 100;
    const timeLines = [];
    for (let i = 0; i < lineNum; i++)
      timeLines.push(
        <div
          key={i}
          className='rt-timeline'
          style={{
            top: 0,
            left: lineW * i + '%',
            height: '100%',
            width: lineW + '%',
          }}
        >
          {showTime && formatTimeUnit(lineTime * i)}
        </div>,
      );

    return timeLines;
  }
}

export default Falls;
