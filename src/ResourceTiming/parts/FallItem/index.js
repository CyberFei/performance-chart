import React from 'react';
import { Popover } from 'antd';
import { formatTimeUnit } from '../../utils';
import './index.less';

// 单个资源渲染情况
class FallsItem extends React.Component {
  render() {
    const { item, allTime } = this.props;

    // 时间相关计算
    const {
      // 用时
      duration,
      // 时间点
      startTime,
      fetchStart,
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      secureConnectionStart,
      connectEnd,
      requestStart,
      responseStart,
      responseEnd,
    } = item;

    const tWait1 = fetchStart - startTime;
    const tWait2 = domainLookupStart - fetchStart;
    const tDNS = domainLookupEnd - domainLookupStart;
    const tConnect =
      (secureConnectionStart ? secureConnectionStart : connectEnd) -
      connectStart;
    const tSSL = secureConnectionStart ? connectEnd - secureConnectionStart : 0;
    const tWaitRequest = requestStart - connectEnd;
    const tRequest = responseStart - requestStart;
    const tResponse =
      duration > 0
        ? responseEnd -
          Math.max(
            startTime,
            fetchStart,
            domainLookupStart,
            domainLookupEnd,
            connectStart,
            secureConnectionStart,
            connectEnd,
            requestStart,
            responseStart,
          )
        : 0;

    // 时间块
    const timeEL = (val, color, borderColor = 'transparent') =>
      val > 0 ? (
        <div
          className='fall-item'
          style={{
            background: color ? color : '#eee',
            width: (val * 100) / allTime + '%',
            borderColor,
          }}
        ></div>
      ) : (
        <div className='fall-item' />
      );

    // 悬浮窗
    const content = (
      <div className='fall-detail'>
        <div style={{ color: '#000' }}>
          开始于 <span>{formatTimeUnit(startTime)}</span>
        </div>

        <div className='fall-detail-title'>资源队列</div>
        <div className='fall-detail-item' style={{ color: '#ccc' }}>
          队列等待 <span>{formatTimeUnit(tWait1)}</span>
        </div>

        <div className='fall-detail-title'>连接开始</div>
        <div className='fall-detail-item' style={{ color: '#aaa' }}>
          阻塞 <span>{formatTimeUnit(tWait2)}</span>
        </div>
        <div className='fall-detail-item' style={{ color: '#009688' }}>
          DNS 查找 <span>{formatTimeUnit(tDNS)}</span>
        </div>
        <div className='fall-detail-item' style={{ color: '#FF9800' }}>
          初始化连接 <span>{formatTimeUnit(tConnect + tSSL)}</span>
        </div>
        {secureConnectionStart ? (
          <div className='fall-detail-item' style={{ color: '#9C27B0' }}>
            <span style={{ float: 'none', color: '#FF9800' }}>└</span> SSL{' '}
            <span>{formatTimeUnit(tSSL)}</span>
          </div>
        ) : (
          <></>
        )}

        <div className='fall-detail-title'>请求 / 响应</div>
        <div className='fall-detail-item' style={{ color: '#B0BEC5' }}>
          发送请求 <span>{formatTimeUnit(tWaitRequest)}</span>
        </div>
        <div className='fall-detail-item' style={{ color: '#00C853' }}>
          等待响应(TTFB) <span>{formatTimeUnit(tRequest)}</span>
        </div>
        <div className='fall-detail-item' style={{ color: '#01A9F4' }}>
          内容下载 <span>{formatTimeUnit(tResponse)}</span>
        </div>
        <div className='fall-detail-title' style={{ color: '#000' }}>
          用时 {formatTimeUnit(duration)}
        </div>
      </div>
    );

    return (
      <div className='fall'>
        {timeEL(startTime, 'transparent')}
        <Popover content={content}>
          {timeEL(tWait1, '#ccc')}
          {timeEL(tWait2, '#aaa')}
          {timeEL(tDNS, '#009688')}
          {timeEL(tConnect, '#FF9800')}
          {timeEL(tSSL, '#9C27B0', '#FF9800')}
          {timeEL(tWaitRequest, '#B0BEC5')}
          {timeEL(tRequest, '#00C853')}
          {timeEL(tResponse, '#01A9F4')}
        </Popover>
      </div>
    );
  }
}

export default FallsItem;
