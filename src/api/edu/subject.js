import request from '@/utils/request'
import { baseUrl } from '@/api/url'

export default{
    //课程分类树状查询
    getSubjectList(){
        return request({
            url: `${baseUrl}/eduservice/subject/getAllSubject`,
            method: 'get',
        })
    },
   

}

