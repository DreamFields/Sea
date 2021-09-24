/*
 * @Author: your name
 * @Date: 2021-09-24 10:23:45
 * @LastEditTime: 2021-09-24 18:09:44
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /seaData/src/pages/service.ts
 */
/*
 * author: TimothyZhung
 * date: 2020-11-03
 */
import request from '@/utils/request';

export async function GetActive_pulse(body: any) {
  return request('/v1/sound/active_pulse_count', {
    method: 'GET',
  });
}
export async function GetTarget_echo(body: any) {
  return request('/v1/sound/target_echo_count', {
    method: 'GET',
  });
}
export async function GetRadiated_noise(body: any) {
  return request('/v1/sound/radiated_noise_count', {
    method: 'GET',
  });
}

export async function GetAudio(body: any) {
  return request('/v1/sound/count', {
    method: 'GET',
  });
}

export async function GetPeople(body: any) {
  return request('/v1/user/role_count', {
    method: 'GET',
  });
}
export async function GetExportList() {
  return request('/v1/ffile/export_count', {
    method: 'POST',
  });
}
export async function UploadExportList(sids: string, signal_type: number) {
  return request('/v1/file/export', {
    method: 'POST',
    data: {
      sids: sids,
      signal_type: signal_type,
    },
  });
}
