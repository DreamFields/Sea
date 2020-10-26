import { Link, SelectLang, useIntl, connect } from 'umi';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayouts.less';
import back_video from '../assets/SeaBack.mp4';

const UserLayout = props => {
  
  return (
    <div style={{width:'100%',height:'100%'}} className={styles.background}>
        
        <video autoPlay style={{width: "100%",height: "100%", objectFit: "fill",zIndex:-1}} loop muted>
          <source src={back_video} type="video/mp4" />
        </video>
        <div style={{ position:"absolute",zIndex:1,left:0,top:0}}>
            {props.children}
        </div>
    </div>
  );
};

export default UserLayout;
