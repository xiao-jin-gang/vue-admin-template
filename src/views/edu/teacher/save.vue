<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
      <!-- 头衔缩略图 -->
      <pan-thumb :image="teacher.avatar" />
      <!-- 文件上传按钮 -->
      <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像</el-button>

      <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
      <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherapi from "@/api/edu/teacher";
import {baseUrl} from "@/api/url"
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: {ImageCropper,PanThumb},
  data() {
    return {
      teacher: {
        name: "",
        sort: "1",
        level: 1,
        career: "",
        intro: "",
        avatar: ''
      },
      BASE_API: `${baseUrl}`, // 接口API地址 localhost:9001
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0, // 上传组件id
      
      saveBtnDisabled: false, // 保存按钮是否禁用,
    };
  },
  watch: {
    $route(to, from) {
      //路由变化方式  路由發生了变化
      this.init();
    },
  },
  created() {
    this.init()
  },
  methods: {   
    close(){
      //关闭上传弹框的方法
      this.imagecropperShow=false,
      this.imagecropperKey=this.imagecropperKey+1
    },
    //上传成功的方法
    cropSuccess(data){
      this.imagecropperShow=false
      //上传之后接口返回图片地址
      this.teacher.avatar=data.url
      this.imagecropperKey=this.imagecropperKey+1
    },
    init() {
      //就第一次执行了,多次路由跳转到同一界面
      if (this.$route.params && this.$route.params.id) {
        //从路径获取id
        const id = this.$route.params.id;
        //调用根据id查询的方法
        this.getInfo(id);
      }
    },
    //根据讲师ID查询的方法-修改
    getInfo(id) {
      teacherapi.getTecherInfo(id).then((response) => {
        this.teacher = response.data.teacher;
      });
    },
    saveOrUpdate() {
      //判断是修改还是添加
      //根据teacher是否有id
      if (!this.teacher.id) {
        //添加
        this.saveTeacher();
      } else {
        //修改
        this.updateTeacher();
      }
    },
    //修改讲师的方法
    updateTeacher() {
      teacherapi.updateTeacher(this.teacher).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功！",
        });
        //回到列表页面，路由跳转
        this.$router.push({ path: "/teacher/table" });
      });
    },
    //添加讲师的方法
    saveTeacher() {
      teacherapi.addTeacher(this.teacher).then((response) => {
        //添加成功
        //提示信息
        this.$message({
          type: "success",
          message: "添加成功",
        });
        //回到列表界面  路由跳转
        this.$router.push({ path: "/teacher/table" });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>