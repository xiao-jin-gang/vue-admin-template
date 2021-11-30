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
            BASE_API: `${baseUrl}`, // 接口API地址
            teacherList:[],//封装所有的讲师
            subjectOneList:[],//一级分类
            subjectTwoList:[]//二级分类
        }
    },
    created() {
        this.getTeacherList()
        this.getOneSubject()
        this.courseInfo.cover = pic
    }, 
    methods:{
        //上传成功调用的方法
        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
            console.log(this.courseInfo.cover)
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
        //提交表单
        saveOrUpdate(){
            course.addCourseInfo(this.courseInfo).then(response=>{
                this.$message({
                    type:'success',
                    message:'添加课程信息成功！'
                })
            //跳转到第二步
            this.$router.push({path:'/course/chapter/'+response.data.courseId})
            })
            
        }
    }
}
</script>

<style scoped>
/* .tinymce-container {
    line-height: 29px; 
} */
</style>>

