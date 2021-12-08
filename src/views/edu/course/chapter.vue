<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            control-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="" @click="dialogChapterFormVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :url="BASE_API+'/eduvod/video/uploadAlyVideo'"
            :action="BASE_API+'/eduvod/video/uploadAlyVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <!-- <p> -->
        {{ chapter.title }}
        <!-- <span class="acts"> -->
        <el-button type="text" @click="openVideoDialog(chapter.id)"
          >添加小节</el-button
        >
        <el-button type="text" @click="openEditChapter(chapter.id)"
          >编辑</el-button
        >
        <el-button type="text" @click="removeChapter(chapter.id)"
          >删除</el-button
        >
        <el-divider />
        <!-- </span> -->
        <!-- </p> -->
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <!-- <p> -->
            {{ video.title }}
            <span class="acts">
              <el-button type="text" @click="openEditVideo(video.id)"
                >编辑</el-button
              >
              <el-button type="text" @click="removeVideo(video.id)"
                >删除</el-button
              >
            </span>
            <!-- </p> -->
            <el-divider />
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
import vod from '@/api/edu/vod'
import {baseUrl} from "@/api/url"

export default {
  data() {
    return {
      dialogChapterFormVisible: false, //章节弹框
      dialogVideoFormVisible: false, //小节弹框
      saveBtnDisabled: false,
      chapter: {
        title: "",
        sort: 0,
      },
      video: {
        // 课时对象
        title: "",
        sort: 0,
        free: 0,
        videoSourceId: "",
        videoOriginalName: "",  //视频名称
      },
      courseId: "", // 课程id
      chapterVideoList: [],
      fileList: [],
      BASE_API:`${baseUrl}`,
    };
  },
  created() {
    //获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
    }
    this.getChapterVideo();
  },
  methods: {
    handleVodUploadSuccess(response, file, fileList) {
      //上传视频id赋值
      this.video.videoSourceId = response.data.videoId
      //上传视频名称赋值
      this.video.videoOriginalName = file.name;
    },
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    //点击×调用这个方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleVodRemove() {
      //调用接口的删除视频的方法
      vod.deleteAlyVod(this.video.videoSourceId).then(response => {
        //提示信息
        this.$message({
          type: "success",
          message: "删除视频成功!"
        });
        //把文件列表清空
        this.fileList = [];
        //把video视频id和视频名称值清空
        //上传视频id赋值
        this.video.videoSourceId = "";
        //上传视频名称赋值
        this.video.videoOriginalName = "";
      });
    },
    //==============================================小节=========================================
    //小节删除按钮
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return video.deleteVideo(videoId);
        })
        .then(() => {
          this.getChapterVideo(); // 刷新列表
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
    //打开小节对话框
    openVideoDialog(chapterId) {
      this.dialogVideoFormVisible = true;
      // 设置章节id
      this.video.chapterId = chapterId
      this.video.title = ""
      this.video.sort = 0
      this.video.free = 0
      this.video.videoSourceId = ""
      this.video.videoOriginalName = ""
    },
    //添加小节 确认键
    addVideo() {
      this.video.courseId = this.courseId
      console.log(this.video)
      video.addVideo(this.video).then((res) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "添加小节成功！",
        });
        //刷新界面
        this.getChapterVideo();
      });
    },
    //修改小节 确认键
    updateVideo() {
      console.log(this.video);
      video.updateVideo(this.video).then((res) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "修改小节成功！",
        });
        //刷新界面
        this.getChapterVideo();
      });
    },
    //编辑小节按钮
    openEditVideo(videoId) {
      console.log("videoId", videoId);
      this.dialogVideoFormVisible = true;
      //根据小节id查询对应的信息
      video.getVideoInfo(videoId).then((res) => {
        this.video = res.data.eduVideo;
      });
    },
    // 确认框
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },
    //==============================================章节=========================================
    //打开弹框
    openChapterDialog() {
      this.chapter.title = "";
      this.chapter.sort = 0;
      this.dialogChapterFormVisible = true;
    },
    //添加或修改章节表单
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return chapter.deleteChapter(chapterId);
        })
        .then(() => {
          //刷新列表
          this.getChapterVideo();
          this.$message({
            type: "success",
            message: "删除章节成功！",
          }).catch((response) => {
            if (response === "cancel") {
              this.$message({
                type: "info",
                message: "已取消删除！",
              });
            } else {
              this.$message({
                type: "error",
                message: response.message,
              });
            }
          });
        });
    },
    //章节编辑按钮
    openEditChapter(chapterId) {
      this.dialogChapterFormVisible = true;
      //根据id查询章节
      chapter.getChapterById(chapterId).then((res) => {
        //回显数据
        this.chapter = res.data.eduChapter;
      });
    },
    //====修改章节
    updateChapter() {
      //参数 根据chapterId修改 chapter
      chapter.updateChapter(this.chapter).then((res) => {
        //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "修改章节成功！",
        });
        //刷新界面
        this.getChapterVideo();
      });
    },
    //=====添加章节
    addChapter() {
      //设置courseId到chapterId中
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then((res) => {
        //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "添加章节成功！",
        });
        //刷新界面
        this.getChapterVideo();
      });
    },
    //根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then((response) => {
        this.chapterVideoList = response.data.list;
      });
    },
    previous() {
      this.$router.push({ path: "/course/info/" + this.courseId });
    },
    next() {
      //跳转到第二步
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
  },
};
</script>

<style>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>