/*
 * @Author: Meng Tian
 * @Date: 2021-11-04 18:56:24
 * @Description: Do not edit
 */
import React, { useEffect } from 'react';
import TeacherIndex from '../teacherTraining/index';
import CookieUtil from '@/utils/cookie.js';

import { history, useModel } from 'umi';
import StudentIndex from '@/pages/studentTraining';

const MAX_LEVEL = 5;

// const StudentIndex = (props: any) => {
//   const { level, unblockNextLevel, refreshLevel } = useModel('useDifficulties');
//   console.log(props);
//   useEffect(refreshLevel, []);
//   const Levels = Array(5)
//     .fill(null)
//     .map((_, idx) => {
//       const currentLevel = idx + 1;
//       const blocked = currentLevel > level;
//       const handleClick = blocked
//         ? undefined
//         : () => history.push(`/answerQuestion/${currentLevel}`);
//       return (
//         <div
//           className={blocked ? style.difficultyBlock : style.difficulty}
//           key={`level_${currentLevel}`}
//           onClick={handleClick}
//         >
//           难度{currentLevel}
//         </div>
//       );
//     });
//
//   return (
//     <div>
//       <div className={style.container}>{Levels}</div>
//     </div>
//   );
// };

const roles = ['管理员', '教员', '学员'];

const Index = () => {
  const role = CookieUtil.get('role')
    ? roles[CookieUtil.get('role') - 1]
    : 'null';
  console.log('role', role);

  if (role === '学员') return <StudentIndex />;
  else return <TeacherIndex />;
};

export default Index;
