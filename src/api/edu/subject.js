import request from '@/utils/request'
import { baseUrl } from '@/api/url'

export default{
    //讲师列表(条件分页查询)
    getSubjectList(){
        return request({
            url: `${baseUrl}/eduservice/subject/getAllSubject`,
            method: 'get',
        })
    },
   

}

