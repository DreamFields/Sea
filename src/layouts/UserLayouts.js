import { Link, SelectLang, useIntl, connect } from 'umi';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayouts.less';

const UserLayout = props => {
  
  return (
    <div style={{width:'100%',height:'100%'}} className={styles.background}>
        <div>
            {props.children}
        </div>
    </div>
  );
};

export default UserLayout;
