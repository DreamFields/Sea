import React, { useState, Suspense, useEffect } from 'react';
import style from './main.less';
import { Link, connect, Dispatch } from 'umi';
import {
  UserOutlined,
  RobotOutlined,
  MenuUnfoldOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Layout, Input, Button, Tree, Avatar, Dropdown, Menu } from 'antd';
import axios from 'axios';

const ProportionAudio = React.lazy(() =>
  import('./components/ProportionAudio'),
);

interface mainContentProps {
  dispatch: Dispatch;
  InforImport: any;
  // powerEngine: any;
  // loading: boolean;
}

const MainContent: React.FC<mainContentProps> = props => {
  const { dispatch, InforImport } = props;
  //const audioPieData = InforImport;
  const audioPieData = [
    {
      x: '声音一',
      y: 4544,
    },
    {
      x: '声音二',
      y: 3321,
    },
    {
      x: '声音三',
      y: 3113,
    },
  ];

  return (
    <div className={style.rightContent}>
      <div
        style={{
          width: 1040,
          marginLeft: 20,
          height: 270,
          background: '#2F2F2F',
          marginTop: 15,
        }}
      >
        <div className={style.userDiv}>
          <Avatar
            size={90}
            style={{
              color: '#f56a00',
              backgroundColor: '#fde3cf',
              fontSize: 40,
              marginLeft: 55,
              marginTop: 20,
            }}
          >
            ZS
          </Avatar>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 20,
              marginTop: 20,
            }}
          >
            张三
          </div>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 15,
              marginTop: 20,
            }}
          >
            数据管理员
          </div>
        </div>
        <div
          style={{
            width: 820,
            height: '100%',
            backgroundColor: '#292929',
            float: 'left',
            marginLeft: 20,
            borderRadius: 5,
          }}
        >
          <Suspense fallback={null}>
            <ProportionAudio audioPieData={audioPieData} />
          </Suspense>
        </div>
      </div>
      <div style={{ width: 1040, marginLeft: 20, height: 350, marginTop: 30 }}>
        <Link to="/audioImport">
          <div
            style={{ backgroundColor: '#77A5D5', marginLeft: 0 }}
            className={style.featuresDiv}
          >
            <div
              style={{
                float: 'left',
                fontSize: 80,
                marginTop: 15,
                marginLeft: 63,
              }}
            >
              <MenuUnfoldOutlined />
            </div>
            <div
              style={{
                float: 'left',
                fontSize: 25,
                marginTop: 60,
                marginLeft: 10,
              }}
            >
              <span>数据管理</span>
            </div>
          </div>
        </Link>
        <Link to="/audioEdit">
          <div
            style={{ backgroundColor: '#94BF7A' }}
            className={style.featuresDiv}
          >
            <div
              style={{
                float: 'left',
                fontSize: 80,
                marginTop: 15,
                marginLeft: 54,
              }}
            >
              <ScissorOutlined />
            </div>
            <div
              style={{
                float: 'left',
                fontSize: 25,
                marginTop: 60,
                marginLeft: 10,
              }}
            >
              <span>数据预处理</span>
            </div>
          </div>
        </Link>
        <Link to="/features">
          <div
            style={{ backgroundColor: '#DDCB76' }}
            className={style.featuresDiv}
          >
            <div
              style={{
                float: 'left',
                fontSize: 80,
                marginTop: 15,
                marginLeft: 42,
              }}
            >
              <SnippetsOutlined />
            </div>
            <div
              style={{
                float: 'left',
                fontSize: 25,
                marginTop: 60,
                marginLeft: 10,
              }}
            >
              <span>目标特征提取</span>
            </div>
          </div>
        </Link>
        <Link to="/">
          <div
            style={{ backgroundColor: '#D44444', marginTop: 20, marginLeft: 0 }}
            className={style.featuresDiv}
          >
            <div
              style={{
                float: 'left',
                fontSize: 80,
                marginTop: 15,
                marginLeft: 42,
              }}
            >
              <EditOutlined />
            </div>
            <div
              style={{
                float: 'left',
                fontSize: 25,
                marginTop: 60,
                marginLeft: 10,
              }}
            >
              <span>数据质量评价</span>
            </div>
          </div>
        </Link>
        <div
          style={{ backgroundColor: '#F79C32', marginTop: 20 }}
          className={style.featuresDiv}
        >
          <div
            style={{
              float: 'left',
              fontSize: 80,
              marginTop: 15,
              marginLeft: 63,
            }}
          >
            <UserOutlined />
          </div>
          <div
            style={{
              float: 'left',
              fontSize: 25,
              marginTop: 60,
              marginLeft: 10,
            }}
          >
            <span>听音训练</span>
          </div>
        </div>
        <div
          style={{ backgroundColor: '#00b894', marginTop: 20 }}
          className={style.featuresDiv}
        >
          <div
            style={{
              float: 'left',
              fontSize: 80,
              marginTop: 15,
              marginLeft: 35,
            }}
          >
            <RobotOutlined />
          </div>
          <div
            style={{
              float: 'left',
              fontSize: 25,
              marginTop: 60,
              marginLeft: 10,
            }}
          >
            <span>小样本机器识别</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ inforImport }: { inforImport: any }) => {
  return {
    InforImport: inforImport,
    // powerEngine: inforImport.powerEngine
  };
};

export default connect(mapStateToProps)(MainContent);
