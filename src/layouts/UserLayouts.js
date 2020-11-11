/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime : 2020-11-10 14:51:42
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\layouts\UserLayouts.js
 */
import { Link, SelectLang, useIntl, connect } from 'umi';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayouts.less';
import back from '../assets/back.png';

const UserLayout = (props) => {
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      className={styles.background}
    >
      <img
        style={{ width: '100%', height: '100%', objectFit: 'fill', zIndex: -1 }}
        src={back}
      />
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default UserLayout;
