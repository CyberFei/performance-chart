import React from 'react';
import { Tooltip } from 'antd';
import { FC, formatSizeUnit, formatTimeUnit } from './utils';

import FallItem from './parts/FallItem';
import TimeLine from './parts/TimeLine';
import MarkLine from './parts/MarkLine';
import './index.less';

class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      w: 500,
    };
  }

  render() {
    const { entries } = this.props;
    // const { w } = this.state;

    // 数据计算
    let size_transferred = 0,
      size_resources = 0,
      unloadEventStart = 0,
      unloadEventEnd = 0,
      domInteractive = 0,
      domContentLoadedEventStart = 0,
      domContentLoadedEventEnd = 0,
      domComplete = 0,
      loadEventStart = 0,
      loadEventEnd = 0,
      time_FCP = 0,
      time_all = 0;

    // 数据处理
    for (let i = 0; i < entries.length; i++) {
      entries[i].duration = FC.sub(
        (entries[i].responseEnd ? entries[i].responseEnd.toFixed(4) : 0) -
          (entries[i].startTime ? entries[i].startTime.toFixed(4) : 0),
      );
      // 相关数据计算
      size_transferred = FC.add(size_transferred, entries[i].transferSize || 0);
      size_resources = FC.add(size_resources, entries[i].decodedBodySize || 0);
      time_all = Math.max(time_all, entries[i].responseEnd || 0);

      if (entries[i].entryType === 'navigation') {
        ({
          unloadEventStart,
          unloadEventEnd,
          domInteractive,
          domContentLoadedEventStart,
          domContentLoadedEventEnd,
          domComplete,
          loadEventStart,
          loadEventEnd,
        } = entries[i]);
      }

      // 获取 FCP 时间
      if (entries[i].name === 'first-contentful-paint') {
        time_FCP = entries[i].startTime;
        // break;
      }
    }

    // 相关数据
    console.table({
      size_transferred,
      size_resources,
      unloadEventStart,
      unloadEventEnd,
      domInteractive,
      domContentLoadedEventStart,
      domContentLoadedEventEnd,
      domComplete,
      loadEventStart,
      loadEventEnd,
      time_FCP,
      time_all,
    });

    function shortName(name) {
      const n = name.split('/');
      if (n.length > 1) {
        return '/' + n[n.length - 1];
      } else return name;
    }

    // 时间轴

    return (
      <div className='rt'>
        <div className='rt-con' style={{ flex: 1 }}>
          <div className='rt-con-l'>
            {/* 表头 */}
            <div className='rt-item rt-header'>
              <b className='rt-item-common rt-item-name'>名称</b>
              <b className='rt-item-common a-c'>类型</b>
              <b className='rt-item-common a-c'>协议</b>
              <b className='rt-item-common a-r'>大小</b>
              <b className='rt-item-common a-r'>用时</b>
            </div>
            {/* 表体 */}
            {entries.map((item, i) => (
              <div className='rt-item' key={i}>
                <Tooltip title={item.name} mouseEnterDelay={0.3}>
                  <div
                    className='rt-item-common rt-item-name'
                    style={{
                      color: item.duration === 0 ? 'red' : '#444',
                    }}
                  >
                    {shortName(item.name)}
                    {/* {item.name} */}
                  </div>
                </Tooltip>
                <div className='rt-item-common a-c'>{item.initiatorType}</div>
                <div className='rt-item-common a-c'>{item.nextHopProtocol}</div>
                <div className='rt-item-common a-r'>
                  {item.duration > 0
                    ? formatSizeUnit(parseInt(item.transferSize))
                    : ''}
                </div>
                <div className='rt-item-common a-r'>
                  {item.duration > 0
                    ? formatTimeUnit(parseInt(item.duration))
                    : ''}
                </div>
              </div>
            ))}
          </div>
          <div className='rt-con-r'>
            {/* 时间轴 */}
            <TimeLine allTime={time_all} />
            {/* 表头 */}
            <div className='rt-item rt-header'>
              <div className='rt-item-chart'>
                <TimeLine allTime={time_all} showTime={true} />
              </div>
            </div>
            {/* 表体 */}
            {entries.map((item, i) => (
              <div className='rt-item' key={i}>
                <div className='rt-item-chart'>
                  <FallItem item={item} allTime={time_all} />
                </div>
              </div>
            ))}
            {/* 标记线 */}
            <MarkLine
              allTime={time_all}
              time={unloadEventEnd}
              color='rgb(229, 130, 38)'
            />
            <MarkLine
              allTime={time_all}
              time={domInteractive}
              color='rgb(31, 225, 31)'
            />
            <MarkLine
              allTime={time_all}
              time={domContentLoadedEventEnd}
              color='rgb(25, 119, 221)'
            />
            <MarkLine
              allTime={time_all}
              time={loadEventEnd}
              color='rgb(193, 65, 205)'
            />
            <MarkLine
              allTime={time_all}
              time={time_FCP}
              color='rgb(231, 217, 140)'
              w={2}
            />
          </div>
        </div>
        {/* 表尾 */}
        <div className='rt-footer'>
          <div className='a-r'>
            transferred
            <br />
            <b>{formatSizeUnit(parseInt(size_transferred))}</b>
          </div>
          <div className='a-r'>
            resources
            <br />
            <b>{formatSizeUnit(parseInt(size_resources))}</b>
          </div>
          <div className='a-r' style={{ flex: 1 }} />
          <div className='a-r' style={{ color: 'rgb(231, 217, 140)' }}>
            FCP
            <br />
            <b>{formatTimeUnit(parseInt(time_FCP))}</b>
          </div>
          {/* <div className='a-r' /> */}
          <div className='a-r' style={{ color: 'rgb(229, 130, 38)' }}>
            DOMProcess
            <br />
            <b>{formatTimeUnit(parseInt(unloadEventEnd))}</b>
          </div>
          <div className='a-r' style={{ color: 'rgb(31, 225, 31)' }}>
            DOMInteractive
            <br />
            <b>{formatTimeUnit(parseInt(domInteractive))}</b>
          </div>
          <div className='a-r' style={{ color: 'rgb(25, 119, 221)' }}>
            DOMContentLoaded
            <br />
            <b>{formatTimeUnit(parseInt(domContentLoadedEventEnd))}</b>
          </div>
          <div className='a-r' style={{ color: 'rgb(193, 65, 205)' }}>
            Load
            <br />
            <b>{formatTimeUnit(parseInt(loadEventEnd))}</b>
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
