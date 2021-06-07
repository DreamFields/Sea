import request from '@/utils/request';

export async function ModifyQuality(body: any) {
  // console.log(id);
  return request('/v1/evaluation/manual', {
    method: 'POST',
    data: body,
  });
}
