import request from '@/utils/request'
import { baseUrl } from '@/api/url'
export default {
    //添加课程信息
    addCourseInfo(courseInfo){
        return request({
            url: `${baseUrl}/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有讲师列表
    getListTeacher() {
        return request({
            url: `${baseUrl}/eduservice/teacher/findAll`,
            method: 'get'
        })
    },
    //根据课程id查询课程基本信息
    getCourseInfoById(courseId){
        return request({
            url:`${baseUrl}/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo) {
        return request({
            url:`${baseUrl}/eduservice/course/updateCourseInfo`,
            method:'post',
            data: courseInfo
        })
    },
    //课程信息的确认
    getPublishCourseInfo(id) {
        return request({
            url:`${baseUrl}/eduservice/course/getPublishCourseInfo/${id}`,
            method:'get',
        })
    },
    //修改课程发布状态
    updateCourseStatus(id) {
        return request({
            url:`${baseUrl}/eduservice/course/publishCourseStatus/${id}`,
            method:'post'
        })
    },
    //获取所有课程列表信息
    getCourseList() {
        return request({
            url:`${baseUrl}/eduservice/course`,
            method: 'get'
        })
    },
    //分页查询
    getPageList(courseQuery,page,limit) {
        return request({
            url:`${baseUrl}/eduservice/course/${page}/${limit}`,
            method:'post',
            data: courseQuery
        })
    },
    //删除课程章节小节视频
    deleteCourse(courseId) {
        return request({
            url:`${baseUrl}/eduservice/course/${courseId}`,
            method:'delete',
        })
    }
}