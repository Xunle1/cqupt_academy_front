import request from '@/utils/request'

export default {
    // 课程列表
    getSubjectList() {
        return request({
            url: "/eduservice/subject/listSubject",
            method: 'get',
          })        
    },
}
