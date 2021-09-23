import React, { useState } from 'react';
import style from './style.less';
import { Input, Space, Form, Button, Checkbox, message, Row, Col } from 'antd';
import { Link, history, connect } from 'umi';
// import Cookies from 'js-cookie';

const Index = (props: any) => {
  const [unlockState, setUnlockState] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexGrow: 0,
      }}
    >
      {unlockState.map((state, idx) => {
        return (
          <div className={state ? style.difficulty : style.difficultyBlock}>
            难度{idx + 1}
          </div>
        );
      })}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {};
}

export default connect(mapStateToProps)(Index);
