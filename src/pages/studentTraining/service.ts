import request from '@/utils/request';

//获得某一个章节某个题目的题目信息列表
export async function getQuestionsList({ chapter, difficult }) {
  return request(`/v1/student/question_list`, {
    method: 'POST',
    data: {
      chapter,
      difficult,
    },
  });
}

//获得学生可以选择的各个章节难度列表
export async function getDiffcult() {
  return request(`/v1/student/student_difficult`, {
    method: 'POST',
  });
}

//向后端提交某个问题的选项
// export async function submit({ id, answer }) {
//   return request(`/v1/student/Student_assessment_submission`,{
//     method: 'POST',
//     data:{
//       id,
//       answer
//     }
//   })
// }

// 查看已完成的试卷列表
export async function getPaperDoneList() {
  return request(`/v1/student/exam_done_list`, {
    method: 'POST',
  });
}

export async function getPaperCanDoList() {
  return request(`/v1/student/exam_undo_list`, {
    method: 'POST',
  });
}
