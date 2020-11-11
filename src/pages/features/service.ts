/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-11-11 18:39:41
 * @LastEditTime : 2020-11-11 19:05:52
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\features\service.ts
 */

import request from '@/utils/request';

export async function EditAudio(body: any) {
  console.log(body);
  return request('/v1/pretreatment/editAudio', {
    method: 'POST',
    data: body,
  });
}

export async function GetDuplicateUrl(id: any) {
  // console.log(id);
  return request(`/v1/file/duplicate_url/${id}`, {
    method: 'GET',
  });
}

export async function SaveAudio(body: any) {
  // console.log(body);
  return request('/v1/pretreatment/save', {
    method: 'POST',
    data: body,
  });
}

export async function GetVersions(id: any) {
  // console.log(id);
  return request(`/v1/sound/all_version_asc/${id}`, {
    method: 'GET',
  });
}

export async function RollBack(body: any) {
  return request('/v1/pretreatment/rollBack', {
    method: 'POST',
    data: body,
  });
}

export async function Reset(body: any) {
  return request('/v1/pretreatment/reset', {
    method: 'POST',
    data: body,
  });
}

export async function GetTips(id: any) {
  return request(`/v1/pretreatment/getTips/${id}`, {
    method: 'GET',
  });
}

export async function SaveTips(body: any) {
  return request('/v1/pretreatment/saveTips', {
    method: 'POST',
    data: body,
  });
}
