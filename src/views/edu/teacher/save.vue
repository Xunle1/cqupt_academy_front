<template>
  <div class="app-container">
    添加讲师
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <el-form-item label="上传头像">

        <!-- 头像缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">上传头像</el-button>

        <!--
                    v-show 是否显示上传组件
                    :key 类似于id，如果一个页面有多个图片上传控件，便于控制
                    :url 后台上传url地址
                    @close 关闭上传组件
                    @crop-upload-success 上传成功后的回调
                 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import teacherApi from '@/api/edu/teacher'
import imageCropper from '@/components/ImageCropper'
import panThumb from '@/components/PanThumb'

export default {
  components: { imageCropper, panThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },

      // 上传弹框组件是否显示
      imagecropperShow: false,
      // 上传组件key值
      imagecropperKey: 0,
      // 获取dev.env.js的BASE_API
      BASE_API: process.env.BASE_API,
      saveBtnDisabled: false // 保存按钮是否禁用
    }
  },
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    close() {
      // 关闭上传弹框方法
      this.imagecropperShow = false
      // 上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1
    },
    cropSuccess(data) {
      // 上传成功方法
      // 上传成功后返回图片url
      this.teacher.avatar = data.url
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      // 判断路径是否有id值
      if (this.$route.params && this.$route.params.id) {
        // 从路径中获取id值
        const id = this.$route.params.id
        this.getTeacherInfo(id)
      } else {
        this.teacher = {}
      }
    },
    resetData() {
      this.teacher = {}
    },
    saveOrUpdate() {
      if (this.teacher.id) {
        this.updateTeacher()
      } else {
        this.saveTeacher()
      }
    },

    // 添加讲师的方法
    saveTeacher() {
      teacherApi.saveTeacher(this.teacher)
        .then(response => {
          // 添加成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功'
          })

          // 返回列表
          // 路由
          this.$router.push({ path: '/teacher/list' })
        })
    },
    // 修改讲师
    updateTeacher() {
      teacherApi.updateTeacher(this.teacher)
        .then(response => {
          // 修改成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改成功'
          })

          // 返回列表
          // 路由
          this.$router.push({ path: '/teacher/list' })
        })
    },

    // 根据id获取讲师信息
    getTeacherInfo(id) {
      teacherApi.getTeacherInfo(id)
        .then(response => {
          this.teacher = response.data.teacher
        })
    }
  }
}
</script>
