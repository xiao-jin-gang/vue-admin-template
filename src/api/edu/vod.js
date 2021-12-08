import request from '@/utils/request'
import { baseUrl } from '@/api/url'

export default{
    //删除阿里云视频接口
    deleteAlyVod(id) {
        return request({
            url:`${baseUrl}/eduvod/video/removeAlyVideo/${id}`,
            method: 'delete'
        })
    },
    
}