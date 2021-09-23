import React, { useEffect } from 'react';
import style from './style.less';
import { Input, Space, Form, Button, Checkbox, message, Row, Col } from 'antd';
import { Link, history, connect } from 'umi';
// import Cookies from 'js-cookie';

const Index = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexGrow: 0,
      }}
    >
      <div className={style.difficulty}>难度1</div>
      <div className={style.difficulty}>难度2</div>
      <div className={style.difficulty}>难度3</div>
      <div className={style.difficulty}>难度4</div>
      <div className={style.difficulty}>难度5</div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {};
}

export default connect(mapStateToProps)(Index);
