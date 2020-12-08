import request from '@/utils/request';
import axios from 'axios';

//添加辐射噪声目标类别
export async function AddRnType(body: any) {
  return request('/v1/type/rn_type', {
    method: 'POST',
    data: body,
  });
}

//获取辐射噪声目标类别 /v1/type/rn_type
export async function GetRnType(body: any) {
  return request('/v1/type/rn_type', {
    method: 'GET',
  });
}

//添加目标回声类别
export async function AddTeType(body: any) {
  return request('/v1/type/te_type', {
    method: 'POST',
    data: body,
  });
}

//获取目标回声类别
export async function GetTeType(body: any) {
  return request('/v1/type/te_type', {
    method: 'GET',
  });
}

//添加主动脉冲目标类别
export async function AddApType(body: any) {
  return request('/v1/type/ap_type', {
    method: 'POST',
    data: body,
  });
}

//获取主动脉冲目标类别
export async function GetApType(body: any) {
  return request('/v1/type/ap_type', {
    method: 'GET',
  });
}

//添加主动脉冲声呐类型
export async function AddAsType(body: any) {
  return request('/v1/type/as_type', {
    method: 'POST',
    data: body,
  });
}

//获取主动脉冲声呐类型
export async function GetAsType(body: any) {
  return request('/v1/type/as_type', {
    method: 'GET',
  });
}

//获取国家信息
export async function GetCountry(body: any) {
  return request('/v1/type/country', {
    method: 'GET',
  });
}

//添加动力装置
export async function AddPowerEngine(body: any) {
  return request('/v1/type/power_engine', {
    method: 'POST',
    data: body,
  });
}

//获取目标动力装置
export async function GetPowerEngine(body: any) {
  return request('/v1/type/power_engine', {
    method: 'GET',
  });
}

//添加螺旋桨类别
export async function AddPropeller(body: any) {
  return request('/v1/type/propeller', {
    method: 'POST',
    data: body,
  });
}

//获取螺旋桨类别
export async function GetPropeller(body: any) {
  return request('/v1/type/propeller', {
    method: 'GET',
  });
}

//录入主动脉冲类型信息
export async function ModifyPulse({ id, body }: { id: number; body: any }) {
  return request(`/v1/sound/active_pulse/${id}`, {
    method: 'POST',
    data: body,
  });
}

//录入辐射噪声类型信息
export async function ModifyNoise({ id, body }: { id: number; body: any }) {
  console.log(body);
  return request(`/v1/sound/radiated_noise/${id}`, {
    method: 'POST',
    data: body,
  });
}

//录入目标回声类型信息
export async function ModifyEcho({ id, body }: { id: number; body: any }) {
  return request(`/v1/sound/target_echo/${id}`, {
    method: 'POST',
    data: body,
  });
}

//搜索声音
export async function SearchSound({ id }: { id: any }) {
  return request(`/v1/sound/${id}`, {
    method: 'GET',
  });
}
