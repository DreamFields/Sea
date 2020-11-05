/**
 * author: zt
 * date: 2020-11-02
 */

import request from '@/utils/request';

export async function EditAudio(body: any) {
  console.log(body);
  return request('/v1/pretreatment/editAudio', {
    method: 'POST',
    data: body,
  });
}
