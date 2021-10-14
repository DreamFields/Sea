// import React, { useState } from 'react';
// import { post } from '@/utils/request';
// import style from './style.less';
// import QuestionComponent from './questionComponent';
// import { Button, Input } from 'antd';

// const Component = (props: any) => {
//   const [data, setData] = useState(null);
//   const [id, setId] = useState('');

//   const submit = async () => {
//     const res = await post<any>('/v1/teacher/question_detail', {
//       data: {
//         question_id: +id,
//       },
//     });
//     setData(null);
//     setData({ ...res });
//   };

//   console.log(data);
//   return (
//     <div>
//       <Input
//         placeholder="题目id"
//         value={id}
//         onChange={(e) => setId(e.target.value)}
//       ></Input>
//       <Button onClick={submit}>查询</Button>

//       {data && (
//         <QuestionComponent
//           data={data}
//           setData={(newData: any) => setData(newData)}
//           readOnly={true}
//         />
//       )}
//     </div>
//   );
// };

// export default Component;
