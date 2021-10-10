import React from 'react';
import style from './style.less';
// import { useDifficulties } from './models';

import { connect, history, Link, useModel } from 'umi';

const MAX_LEVEL = 5;

const Index = (props: any) => {
  const { level, unblockNextLevel } = useModel('useDifficulties');

  const Levels = Array(5)
    .fill(null)
    .map((_, idx) => {
      const currentLevel = idx + 1;
      const blocked = currentLevel > level;
      const handleClick = blocked
        ? undefined
        : () => history.push(`/answerQuestion/${currentLevel}`);
      return (
        <div
          className={blocked ? style.difficultyBlock : style.difficulty}
          key={`level_${currentLevel}`}
          onClick={handleClick}
        >
          难度{currentLevel}
        </div>
      );
    });

  return (
    <div>
      <Link to="/teacherTraining">教师端</Link>
      <div className={style.container}>{Levels}</div>
    </div>
  );
};

export default Index;
