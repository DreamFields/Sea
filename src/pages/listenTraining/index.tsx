import React, { useState } from 'react';
import style from './style.less';
import { connect, history } from 'umi';

const Index = (props: any) => {
  const [unlockState, setUnlockState] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);

  return (
    <div className={style.container}>
      {unlockState.map((state, idx) => {
        if (state) {
          return (
            <div
              className={style.difficulty}
              key={idx}
              onClick={() => history.push('/answerQuestion')}
            >
              难度{idx + 1}
            </div>
          );
        } else {
          return (
            <div className={style.difficultyBlock} key={idx}>
              难度{idx + 1}
            </div>
          );
        }
      })}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {};
}

export default connect(mapStateToProps)(Index);
