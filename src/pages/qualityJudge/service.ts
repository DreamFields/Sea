import request from '@/utils/request';

export async function ModifyQuality(body: any) {
  // console.log(id);
  return request('/v1/evaluation/manual', {
    method: 'POST',
    data: body,
  });
}

export async function FetchLevel(body: any) {
  return request('/v1/evaluation/result', {
    method: 'POST',
    data: body,
  });
}

export async function FetchManualLevel(body: any) {
  return request('/v1/evaluation/manual_result', {
    method: 'POST',
    data: body,
  });
}
