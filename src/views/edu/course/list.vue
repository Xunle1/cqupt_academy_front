<template>
  <div class="app-container">
    课程列表
    <!-- 条件查询 -->
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="courseQuery.title" placeholder="名称"/>
        </el-form-item>

        <el-form-item>
            <el-select v-model="courseQuery.status" clearable placeholder="状态">
                <el-option value="Normal" label="已发布"/>
                <el-option value="Draft" label="未发布"/>
            </el-select>
        </el-form-item>


        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称"  />

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="60" />

      <el-table-column prop="gmtCreate" label="创建时间" width="160" />

      <el-table-column prop="viewCount" label="浏览数" width="60" />

      <el-table-column prop="操作" width="200" align="center">
        <template slot-scope="scope">
        <p>
            <router-link :to="'/course/info/' + scope.row.id">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
            </router-link>
        </p>
        <p>
            <router-link :to="'/course/chapter/' + scope.row.id">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
            </router-link>
        </p>
        <p>
            <el-button type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="remove(scope.row.id)">删除课程信息</el-button>
        </p>
        </template>
      </el-table-column>
    </el-table>

    

    <!-- 分页 -->
    <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"/>

    
  </div>
</template>

<script>
import course from "@/api/edu/course";

export default {
  // 定义变量和初始值
  data() {
    return {
      list: null, // 查询后接口返回集合
      page: 1,
      limit: 5,
      total: 0,
      courseQuery: {}, //条件封装对象
    };
  },
  // 在页面渲染前执行，一般执行methods定义的方法
  created() {
    this.getList();
  },
  // 创建具体的方法，调用teacher.js
  methods: {
    //讲师列表处理
    getList(page = 1) {
        this.page = page
        course.getPageConditionList(this.page, this.limit, this.courseQuery)
        .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
        })
        .catch((error) => {
            console.log(error);
        });
    },
    remove(courseId) {
        this.$confirm("确认要删除课程吗？", "⚠", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",})
        .then((response) => {
            course.deleteCourseInfo(courseId)
            .then((response) => {
              this.$message({
                type: "success",
                message: "删除成功！",
              });
              //回显数据
              this.getList()
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
    resetData() {
        //表单数据项清空(使用v-model)
        this.courseQuery={}
        this.getList()
    },
  },
};
</script>