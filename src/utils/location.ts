/*
 * @Descripttion: 与location相关的操作
 * @Author: linkenzone
 * @Date: 2020-09-06 22:12:57
 */

// 获取样本id
export const getSampleId = () => {
  const { pathname, hash } = window.location;

  if (hash) {
    const path_list = hash.split('/');
    return parseInt(path_list[path_list.indexOf('sample') + 1], 10);
  }

  const path_list = pathname.split('/');

  return parseInt(path_list[path_list.indexOf('sample') + 1], 10);
};

// 获取样本id和cycle_number
export const getCycleInfo = () => {
  const { pathname, hash } = window.location;
  if (hash) {
    const path_list = hash.split('/');
    const sample_id = parseInt(path_list[path_list.indexOf('sample') + 1], 10);
    const cycle_number = parseInt(path_list[path_list.indexOf('sample') + 3], 10);
    return { sample_id, cycle_number };
  }
  const path_list = pathname.split('/');
  const sample_id = parseInt(path_list[path_list.indexOf('sample') + 1], 10);
  const cycle_number = parseInt(path_list[path_list.indexOf('sample') + 3], 10);
  return { sample_id, cycle_number };
};

// 获取病人的pid
export const getPid = () => {
  const { pathname, hash } = window.location;
  if (hash) {
    const path_list = hash.split('/');
    return parseInt(path_list[path_list.indexOf('detail') + 1], 10);
  }
  const path_list = pathname.split('/');
  return parseInt(path_list[path_list.indexOf('detail') + 1], 10);
};

// 获取病人的 pid 和 treNum
export const getPidAndTreNum = () => {
  const { pathname, hash } = window.location;
  if (hash) {
    const path_list = hash.split('/');
    const pid = parseInt(path_list[path_list.indexOf('detail') + 1], 10);
    let treNum = -404;
    if (path_list.length > 4) {
      treNum = parseInt(path_list[path_list.indexOf('detail') + 3], 10);
    }
    return { pid, treNum };
  }
  const path_list = pathname.split('/');
  const pid = parseInt(path_list[path_list.indexOf('detail') + 1], 10);
  const treNum = parseInt(path_list[path_list.indexOf('detail') + 3], 10);
  return { pid, treNum };
};
