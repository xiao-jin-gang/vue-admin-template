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
    }
}