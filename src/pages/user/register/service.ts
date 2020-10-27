import request from '@/utils/request'

// 登录获取token和用户信息
export async function Register(body) {
  console.log(body);
  return request('/v1/client/register', {
    method: 'POST',
    data: body
  })
}