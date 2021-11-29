import request from '@/utils/request'
import { baseUrl } from '@/api/url'

export default{
    //讲师列表(条件分页查询)
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            url: `${baseUrl}/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json进行传递到接口里面
            data: teacherQuery
        })
    },
    //逻辑删除讲师
    deleteTeacherById(id){
        return request({
            url:`${baseUrl}/eduservice/teacher/${id}`,
            method: 'delete',
        })
    },
    //添加讲师
    addTeacher(teacher){
        return request({
            url:`${baseUrl}/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher  //teacher转换成json传到后端
        })
    },
    //根据id查询讲师所有信息---修改用的
    getTecherInfo(id){
        return request({
            url: `${baseUrl}/eduservice/teacher/getTeacher/${id}`,
            method: 'get', 
        })
    },
    //修改讲师
    updateTeacher(teacher){
        return request({
            url: `${baseUrl}/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }

}

