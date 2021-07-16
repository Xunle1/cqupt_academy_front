<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="'/static/01.xlsx'">点击下载模板</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :action="BASE_API + '/eduservice/subject/addSubject'"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :limit="1"
          :disabled="importBtnDisabled">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取dev.env.js的BASE_API
      BASE_API: process.env.BASE_API,
      //保存按钮是否禁用
      importBtnDisabled: false,
      loading: false
    }
  },
  created() {},
  methods: {
    submitUpload() {
      this.importBtnDisabled = true;
      this.loading = true;
      //js document.getElementById("upload").submit()
      this.$refs.upload.submit()
    },
    fileUploadSuccess() {
      //提示信息
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加课程分类成功'
      })

      //跳转
      this.$router.push({path: '/subject/list'})
    },
    fileUploadError() {
      //提示信息
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加课程分类失败'
      })
    }
  },
};
</script>