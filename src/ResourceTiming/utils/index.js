import FC from './fcalc';

// 浮点数计算库
export { FC };

// 单位换算
function formatUnit(units, bases, val) {
  let r = val >= 0 ? val : 0;
  let level = 0;
  for (; r >= bases[level] && level < bases.length; level++) {
    r = FC.div(r, bases[level]).toFixed(4);
  }
  return `${parseFloat(parseFloat(r).toFixed(1))} ${units[level]}`;
}

export const formatSizeUnit = (val) =>
  formatUnit(
    ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'],
    [1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024],
    parseFloat(val.toFixed(2)),
  );

export const formatTimeUnit = (val) =>
  formatUnit(
    ['ms', 's', 'min', 'h', 'day'],
    [1000, 60, 60, 24],
    parseFloat(val.toFixed(2)),
  );
