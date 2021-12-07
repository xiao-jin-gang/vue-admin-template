import request from '@/utils/request'
import { baseUrl } from '@/api/url'
import { mapMutations } from 'vuex'

export default{
    //添加小节
    addVideo(eduVideo){
        return request({
            url: `${baseUrl}/eduservice/video/addVideo`,
            method: 'post',
            data: eduVideo
        })
    },
    //删除小节
    deleteVideo(id) {
        return request({
            url: `${baseUrl}/eduservice/video/${id}`,
            method: 'delete'
        })
    },
    //根据id查询出对应的小节信息
    getVideoInfo(id) {
        return request({
            url:`${baseUrl}/eduservice/video/getVideoInfo/${id}`,
            method: 'get'
        })
    },
    //修改小节信息
    updateVideo(video) {
        return request({
            url:`${baseUrl}/eduservice/video/updateVideo`,
            method: 'post',
            data: video
        })
    }
}