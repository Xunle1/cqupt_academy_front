import request from '@/utils/request'

export default {
    // 讲师列表（条件分页查询）
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // teacherQuery为条件查询对象，后端使用RequestBody获取数据
            // data表示把对象转换为json进行传递
            data: teacherQuery
          })        
    },
    // 删除讲师
    removeTeacher(id) {
        return request({
            url: `/eduservice/teacher/delete/${id}`,
            method: 'delete',
        })
    },
    // 添加讲师
    saveTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },
    // 根据id查询讲师
    getTeacherInfo(id) {
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },
    // 修改讲师
    updateTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }
}
