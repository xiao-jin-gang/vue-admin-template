import request from '@/utils/request'
import { baseUrl } from '@/api/url'

export default {
    //根据id获取章节和小节数据列表 课程大纲列表
    getAllChapterVideo(courseId){
        return request({
            url: `${baseUrl}/eduservice/chapter/getChapterVideo/${courseId}`,
            method: 'get',
        })
    },
    //添加章节
    addChapter(chapter){
        return request({
            url: `${baseUrl}/eduservice/chapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },
    //根据id查询章节
    getChapterById(chapterId){
        return request({
            url: `${baseUrl}/eduservice/chapter/getChapterInfo/${chapterId}`,
            method: 'get',
        })
    },
    //修改章节
    updateChapter(chapter){
        return request({
            url: `${baseUrl}/eduservice/chapter/updateChapter`,
            method: 'post',
            data: chapter
        })
    },
    //删除章节
    deleteChapter(chapterId){
        return request({
            url:`${baseUrl}/eduservice/chapter/${chapterId}`,
            method: 'delete'
        })
    }
}