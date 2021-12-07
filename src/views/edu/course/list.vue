<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="searchObj.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="searchObj.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in SubjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程标题" />
      </el-form-item>
      <!-- 讲师 -->
      <el-form-item>
        <el-select v-model="searchObj.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="courseQueryBtn()"
        >查 询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border
    fit
    highlight-current-row
    >
    <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
    </el-table-column>
     <el-table-column property="title" label="课程名称"></el-table-column>
     <el-table-column property="status" label="课程状态" width="120"></el-table-column>
     <el-table-column property="lessonNum" label="课时数" width="50"></el-table-column>
     <el-table-column property="gmtCreate" label="添加时间" width="180" ></el-table-column>
     <el-table-column property="viewCount" label="浏览数量" width="50"></el-table-column>
     <el-table-column label="操作">    
         <template slot-scope="scope"> 
            <router-link :to="'/edu/course/info/'+scope.row.id"> 
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
            </router-link>             
            <router-link :to="'/edu/course/chapter/'+scope.row.id">    
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
            </router-link> 
                <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteByCourseId(scope.row.id)">删除</el-button>
        </template>
     </el-table-column>
    </el-table>
    <el-pagination
    :current-page="page"
    :page-size="limit"
    :total="total"
    style="padding: 30px 0; text-align: center;"
    layout="total, prev, pager, next, jumper"
    @current-change="fetchData"/>
  </div>
</template>

<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject"
import teacher from "@/api/edu/teacher"

export default {
  data() {
    return {
        list:null,
        page: 1,
        limit: 10,
        total: 0,     
        subjectOneList:[],   //一级分类
        SubjectTwoList:[], //二级分类
        teacherList:[],
        searchObj: {},
    };
  },
  created() {
    this.getSubjectList()
    this.getTeacherList()
    this.getCourseListByQuery();
  },
  methods: {
    //删除课程章节小节
    deleteByCourseId(courseId) {
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return course.deleteCourse(courseId);
        })
        .then(() => {
          this.getCourseListByQuery(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },
    courseQueryBtn() {
        this.getCourseListByQuery()
    },
    //获取课程列表
    getCourseList() {
      course.getCourseList().then((response) => {
        this.list =  response.data.list
      });
    },
    //条件查询带分页 page当前页 ,limit每页个数
    getCourseListByQuery(page = 1){
        this.page = page
        course.getPageList(this.searchObj,this.page,this.limit).then(response=>{
            this.total =  response.data.total
            this.list = response.data.rows
        })
    },
    // currentPage 改变时会触发 回调参数:当前页
    fetchData(currentPage){
        this.getCourseListByQuery(currentPage)
    },
    // 查询出一二级分类 
    getSubjectList (){
        subject.getSubjectList().then(response=>{
            this.subjectOneList = response.data.list            
        })
    },
    //选中一级分类 触发二级分类 回传id
    subjectLevelOneChanged(val) {
        for(var i =0; i < this.subjectOneList.length; i++) {
            if(this.subjectOneList[i].id == val) {
                this.SubjectTwoList = this.subjectOneList[i].children
                return
            }
        }
    },
    //讲师查询
    getTeacherList() {
        teacher.getTeacherIdName().then(response=>{            
            this.teacherList = response.data.list
        })
    }
  },
};
</script>

<style scoped>
</style>