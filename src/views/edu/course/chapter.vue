<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>

    <el-button type="text" @click="openDialog">添加章节</el-button>
    <!-- 添加或修改章节弹框 -->
    <el-dialog title="添加章节" :visible.sync="dialogChapterFormVisible">
      <el-form :model="chapterInfo" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapterInfo.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapterInfo.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOfUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 课时弹框 -->
    <el-dialog title="添加课时" :visible.sync="dialogVideoFormVisible">
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
          <!-- 参数：file-list 上传文件列表
          before-remove 删除文件列表中的文件时的钩子
          on-exceed 文件超出个数时的钩子
          limit 最大允许上传个数
          -->
        <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/upload'"
            :limit="1"
            class="upload-demo">
            <el-button type="primary" size="small">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G, <br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveBtnDisaled"
          type="primary"
          @click="saveOfUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openAddVideo(chapter.id)"
              >添加小节</el-button
            >
            <el-button type="text" style="" @click="openEditChapter(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button type="primary" :disabled="saveBtnDisabled" @click="next"
        >保存并下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";

export default {
  data() {
    return {
      saveBtnDisaled: false,
      chapterVideoList: [],
      courseId: "",
      dialogChapterFormVisible: false,
      chapterInfo: {
        //封装章节数据
        title: "",
        sort: 0,
      },

      dialogVideoFormVisible: false,
      video: {
        courseId: "",
        chapterId: "",
        title: "",
        sort: 0,
        free: false,
        videoSourceId: '',
        videoOriginalName: '',
      },

      //上传文件列表
      fileList: [],
      //接口API地址
      BASE_API: process.env.BASE_API,
    };
  },
  created() {
    //判断路径是否有id值
    if (this.$route.params && this.$route.params.id) {
      //从路径中获取id值
      this.courseId = this.$route.params.id;
      this.getChapterVideo();
    }
  },
  methods: {
    // ==========================================小节操作======================================
    openAddVideo(chapterId) {
      this.dialogVideoFormVisible = true;
      this.video.chapterId = chapterId;
      this.video.courseId = this.courseId;
    },
    addVideo() {
      console.log(this.video);
      video.addVideo(this.video).then((response) => {
        //弹窗关闭
        this.dialogVideoFormVisible = false;
        //提示信息
        this.$message({
          message: "添加小节成功",
          type: "success",
        });
        //刷新页面
        this.getChapterVideo();
        this.video = {
          courseId: "",
          chapterId: "",
          title: "",
          sort: 0,
          free: false,
          videoSourceId: '',
          videoOriginalName: '',
        }
        this.fileList = []
      });
    },
    saveOfUpdateVideo() {
      this.addVideo();
    },
    //上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {        //上传视频id赋值
      this.video.videoSourceId = response.data.videoId
      //上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    //调用接口删除视频
    handleVodRemove() {
      console.log(this.video.videoSourceId)
      video.deleteAlyVideo(this.video.videoSourceId)
      .then(response => {
        this.$message({
          type: 'success',
          message: '删除视频成功!'
        })
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
      })
    },
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定删除 ${file.name}?`)
    },
    //删除课时
    deleteVideo(videoId) {
      this.$confirm("确认要删除课时？", "⚠", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((response) => {
          video
            .deleteVideo(videoId)
            .then((response) => {
              this.$message({
                type: "success",
                message: "删除成功！",
              });
              //回显数据
              this.getChapterVideo();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // ==========================================章节操作======================================
    openDialog() {
      this.dialogChapterFormVisible = true;
      this.chapterInfo.title = "";
      this.chapterInfo.sort = 0;
    },
    addChapter() {
      this.chapterInfo.courseId = this.courseId;
      // console.log(this.chapterInfo)
      chapter.addChapter(this.chapterInfo).then((response) => {
        //弹窗关闭
        this.dialogChapterFormVisible = false;
        //提示信息
        this.$message({
          message: "添加章节成功",
          type: "success",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    saveOfUpdate() {
      if (this.chapterInfo.id) {
        this.updateChapter();
      } else {
        this.addChapter();
      }
    },
    openEditChapter(chapterId) {
      //弹框
      this.dialogChapterFormVisible = true;
      //调用接口，数据回显
      chapter.getChapter(chapterId).then((response) => {
        this.chapterInfo = response.data.chapter;
      });
    },
    updateChapter() {
      chapter.updateChapter(this.chapterInfo).then((response) => {
        //弹窗关闭
        this.dialogChapterFormVisible = false;
        //提示信息
        this.$message({
          message: "修改章节成功",
          type: "success",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    deleteChapter(chapterId) {
      this.$confirm("确认要删除章节？", "⚠", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((response) => {
          chapter
            .deleteChapter(chapterId)
            .then((response) => {
              this.$message({
                type: "success",
                message: "删除成功！",
              });
              //回显数据
              this.getChapterVideo();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then((response) => {
        this.chapterVideoList = response.data.allChapterVideo;
        // console.log(this.chapterVideoList)
      });
    },
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      //跳转到最后一步
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
  },
};
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
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