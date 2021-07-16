import request from '@/utils/request'

export default {

    /* ==============================添加课程=================================== */
    // 添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: "/eduservice/course/addcourse",
            method: 'post',
            data: courseInfo
        })        
    },
    // 查询所有讲师
    getTeacherList() {
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get',
            
        })
    },
    // 获取课程信息
    getCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getcourse/${courseId}`,
            method: 'get'
        })
    },
    // 获取课程确认信息
    getPublishCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    // 课程最终发布
    publishCourse(courseId) {
        return request({
            url: `/eduservice/course/publishCourse/${courseId}`,
            method: 'post'
        })
    },
    // 修改课程信息
    updateCourse(courseInfo) {
        return request({
            url: "/eduservice/course/updatecourse",
            method: 'post',
            data: courseInfo
        })
    },

    /* ==============================课程列表=================================== */
    getCourseList() {
        return request({
            url: `/eduservice/course/list`,
            method: 'get'
        })
    },
    deleteCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/deleteCourse/${courseId}`,
            method: 'delete'
        })
    },
    getPageConditionList(current, limit, courseQuery) {
        return request({
            url: `/eduservice/course/pageConditionList/${current}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    }
}
