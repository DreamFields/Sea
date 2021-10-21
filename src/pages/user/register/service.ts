/*
 * @Author: Meng Tian
 * @Date: 2021-10-18 15:01:45
 * @Description: Do not edit
 */
import request from '@/utils/request';

// 登录获取token和用户信息
export async function Register(body) {
  console.log(body);
  const newBody = { ...body, role: 3 };
  console.log('newBody', newBody);
  return request('/v1/client/register', {
    method: 'POST',
    data: newBody,
  });
}
