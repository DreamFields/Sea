import request from '@/utils/request';

export async function ModifyQuality(body: any) {
  // console.log(id);
  return request('/v1/evaluation/manual', {
    method: 'POST',
    data: body,
  });
}

export async function FetchManualLevel(body: any) {
  return request('/v1/evaluation/result', {
    method: 'POST',
    data: body,
  });
}

export async function FetchAutoLevel(body: any) {
  return request(`/v1/evaluation/${body.mode}`, {
    method: 'POST',
    data: {
      sid: body.sid,
    },
  });
}
