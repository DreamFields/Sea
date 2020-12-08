/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-27 08:19:03
 * @LastEditTime : 2020-12-08 13:37:18
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\layouts\BasicLayout\service.ts
 */
import request from '@/utils/request';

//获取声音文件列表
export async function FetchSoundList(body: any) {
  return request('/v1/sound/list', {
    method: 'GET',
  });
}

//搜索声音
export async function SearchSoundList({ id }: { id: any }) {
  return request(`/v1/sound/${id}`, {
    method: 'GET',
  });
}
