<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="创建课程大纲"/>
        <el-step title="最终发布"/>
        </el-steps>
        <el-form label-width="120px">

            <el-form-item label="课程标题">
                <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
            </el-form-item>

            <!-- 所属分类 -->
            <el-form-item label="课程分类">
                <el-select
                    v-model="courseInfo.subjectParentId"
                    placeholder="一级分类" @change="subjectLevelOneChanged">
                    <el-option
                        v-for="subject in subjectOneList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
                <!-- 二级分类 -->
                <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
                    <el-option
                        v-for="subject in subjectTwoList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
            </el-form-item>

            <!-- 课程讲师 -->
            <el-form-item label="课程讲师">
            <el-select
                v-model="courseInfo.teacherId"
                placeholder="请选择">
                <el-option
                    v-for="teacher in teacherList"
                    :key="teacher.id"
                    :label="teacher.name"
                    :value="teacher.id"/>
            </el-select>
            </el-form-item>

            <el-form-item label="总课时">
                <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
            </el-form-item>

            <!-- 课程简介 TODO -->
            <el-form-item label="课程简介">
                <el-input type="textarea" v-model="courseInfo.description" placeholder=" "/>
                <!-- <tinymce :height="300" v-model="courseInfo.description"/> -->
            </el-form-item>

            <!-- 课程封面-->
            <el-form-item label="课程封面">
                <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="BASE_API+'/eduoss/fileoss'"
                    class="avatar-uploader">
                    <!-- <img :src="pic"> -->
                    <img style="width:300px" :src="courseInfo.cover">
                </el-upload>
            </el-form-item>

            <el-form-item label="课程价格">
                <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
            </el-form-item>
            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {baseUrl} from '@/api/url'
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import pic from '@/assets/111.jpg'


export default {
    data() {
        return {
            saveBtnDisabled:false,
            courseInfo:{
                title: '',
                subjectId: '',//二级分类id
                subjectParentId:'',//一级分类id
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: '',
                price: 0
            },
            courseId:'',
            BASE_API: `${baseUrl}`, // 接口API地址
            teacherList:[],//封装所有的讲师
            subjectOneList:[],  //一级分类
            subjectTwoList:[]   //二级分类
        }
    },
    created() {
        if(this.$route.params && this.$route.params.id){
            //回显操作
            this.courseId = this.$route.params.id
            this.getCourseInfoById();
        }else{
            this.courseInfoClear()
            //添加操作
            this.getTeacherList()   //获取教师列表
            this.getOneSubject()    //一级分类
            this.courseInfo.cover = pic //图片信息
        }
    }, 
    methods:{
        //在页面获取数据回显 根据id查询课程信息
        getCourseInfoById() {
            course.getCourseInfoById(this.courseId).then(res=>{
                //courseInfo会有课程基本信息，包含一级分类id和二级分类id
                this.courseInfo = res.data.courseInfoVo
                //查询所有分类，包含一级和二级 
                subject.getSubjectList().then(res=>{
                    //获取所有一级分类
                    this.subjectOneList = res.data.list
                    //3把所有一级分类数组进行遍历，比较当前courseInfo里面一级分类id和所有的一级分类id
                    for(var i = 0; i < this.subjectOneList.length; i++){
                        if(this.courseInfo.subjectParentId === this.subjectOneList[i].id){
                            //获取一级分类所有的二级分类
                            this.subjectTwoList = this.subjectOneList[i].children
                        }
                    }
                })
                //初始话所有讲师
                 this.getTeacherList()
            })
        },
        //上传成功调用的方法
        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },
        //上传之前调用的方法
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 /1024 < 2
            if(!isJPG){
                this.$message.error('上传头像图片只能事JPG格式！')
            }
            if(!isLt2M) {
                this.$message.error('上传头像图片大小不能超过2MB！')
            }
            return isLt2M && isJPG
        },        
        //查询所有讲师列表
        getTeacherList(){
            course.getListTeacher().then(response=>{
                this.teacherList = response.data.items
            })
        },
        //课程分类
        //查询所有的一级分类
        getOneSubject() {
            subject.getSubjectList().then(response=>{
                this.subjectOneList = response.data.list
            })
        },
        // 查询对应的二级分类 val为目前选中的值
        subjectLevelOneChanged(val) {
            this.courseInfo.subjectId =''
            for(let i =0; i < this.subjectOneList.length; i++){        
                if(val === this.subjectOneList[i].id){
                    //选中她的孩子
                    this.subjectTwoList = this.subjectOneList[i].children
                    return;
                }
            }
        },
        //保存进入下一页
        saveOrUpdate(){
            if(this.courseInfo.id){
                //修改
                this.updateCourseInfo()
            }
            else {
                this.addCourseInfo()
            }
        },
        //提交表单
        addCourseInfo(){
            course.addCourseInfo(this.courseInfo).then(response=>{
                this.$message({
                    type:'success',
                    message:'添加课程信息成功！'
                })
            //跳转到第二步
            this.$router.push({path:'/course/chapter/'+response.data.courseId})
            })            
        },
        //修改课程信息 不会返回课程id
        updateCourseInfo() {
            course.updateCourseInfo(this.courseInfo).then(res=>{
                this.$message({
                    type:'success',
                    message:'修改课程信息成功！'
                })
                this.$router.push({path:'/course/chapter/'+this.courseId})
            })
        },
        //清除课程信息
        courseInfoClear() {
            this.courseInfo.title='',
            this.courseInfo.subjectId='',
            this.courseInfo.subjectParentId='',
            this.courseInfo.teacherId='',
            this.courseInfo.lessonNum=0,
            this.courseInfo.description='',
            this.courseInfo.cover='',
            this.courseInfo.price= 0            
        }
    }
}
</script>

<style scoped>
/* .tinymce-container {
    line-height: 29px; 
} */
</style>>

