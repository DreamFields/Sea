/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors: Please set LastEditors
 * @Date         : 2020-10-27 08:19:03
 * @LastEditTime: 2021-12-08 14:42:35
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\layouts\BasicLayout\service.ts
 */
import request from '@/utils/request';

// 获取用户名
export async function GetToken(body) {
  // console.log(body);
  return request('/v1/token', {
    method: 'POST',
    data: body,
  });
}

// 获取声音文件列表
export async function FetchSoundList(body: any) {
  return request('/v1/sound/list_new', {
    method: 'GET',
  });
}

// 时间名称搜索声音
export async function SearchByname_date({ info }: { info: any }) {
  return request(`/v1/sound/name_date/${info}`, {
    method: 'GET',
  });
}

// 声音类型搜索
export async function SearchBystype({ info }: { info: any }) {
  return request(`/v1/sound/stype/${info}`, {
    method: 'GET',
  });
}

// 目标舷号搜索
export async function SearchByfname({ info }: { info: any }) {
  return request(`/v1/sound/fname/${info}`, {
    method: 'GET',
  });
}

// 深度搜索
export async function SearchBydepth({ info }: { info: any }) {
  return request(`/v1/sound/depth/${info}`, {
    method: 'GET',
  });
}

// 引擎搜索
export async function SearchBypower_engine({ info }: { info: any }) {
  return request(`/v1/sound/power_engine/${info}`, {
    method: 'GET',
  });
}

// 螺旋桨信息搜索
export async function SearchBypropeller({ info }: { info: any }) {
  return request(
    `/v1/sound/propeller/${info.split('_')[0]}/${info.split('_')[1]}/${
      info.split('_')[2]
    }`,
    {
      method: 'GET',
    },
  );
}

// 国家搜索
export async function SearchBycountry({ info }: { info: any }) {
  return request(`/v1/sound/country/${info}`, {
    method: 'GET',
  });
}

// 主动脉冲目标类型搜索
export async function SearchByap({ info }: { info: any }) {
  return request(`/v1/sound/ap/${info}`, {
    method: 'GET',
  });
}

// 主动脉冲声纳类型搜索
export async function SearchByas({ info }: { info: any }) {
  return request(`/v1/sound/as/${info}`, {
    method: 'GET',
  });
}

// 辐射噪声目标类型搜索
export async function SearchByrn({ info }: { info: any }) {
  return request(`/v1/sound/rn/${info}`, {
    method: 'GET',
  });
}

// 目标回声目标类型搜索
export async function SearchByte({ info }: { info: any }) {
  return request(`/v1/sound/te/${info}`, {
    method: 'GET',
  });
}

// 平台搜索
export async function SearchByplatform({ info }: { info: any }) {
  return request(`/v1/sound/platform/${info}`, {
    method: 'GET',
  });
}

// 任务源搜索
export async function SearchByts({ info }: { info: any }) {
  return request(`/v1/sound/ts/${info}`, {
    method: 'GET',
  });
}

// 位置搜索
export async function SearchBylocation({ info }: { info: any }) {
  return request(`/v1/sound/location/${info}`, {
    method: 'GET',
  });
}

// 采集时间搜索
export async function SearchByct({ info }: { info: any }) {
  return request(`/v1/sound/ct/${info}`, {
    method: 'GET',
  });
}

// 目标距离搜索
export async function SearchBydistance({ info }: { info: any }) {
  return request(`/v1/sound/distance/${info}`, {
    method: 'GET',
  });
}

// 航速搜索
export async function SearchByspeed({ info }: { info: any }) {
  return request(`/v1/sound/speed/${info}`, {
    method: 'GET',
  });
}

// 水上水下搜索
export async function SearchBywater({ info }: { info: any }) {
  return request(`/v1/sound/water/${info}`, {
    method: 'GET',
  });
}

// 主机搜索
export async function SearchBypm({ info }: { info: any }) {
  return request(`/v1/sound/pm/${info}`, {
    method: 'GET',
  });
}

// 辅机搜索
export async function SearchByam({ info }: { info: any }) {
  return request(`/v1/sound/am/${info}`, {
    method: 'GET',
  });
}

// 通过声音获取文件
export async function GetAudioInforById({ id }: { id: number }) {
  return request(`/v1/sound/detail/${id}`, {
    method: 'GET',
  });
}
