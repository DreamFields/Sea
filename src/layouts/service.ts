import request from "@/utils/request";

//获取声音文件列表
export async function GetSoundList(body:any) {
    return request("/v1/sound/list", {
        method: "GET"
    })
}