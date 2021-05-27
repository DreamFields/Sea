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
import {
  Layout,
  Input,
  Button,
  Tree,
  Avatar,
  Dropdown,
  Menu,
  Row,
  Col,
  Space,
} from 'antd';
import axios from 'axios';
import PeopleShow from '@/components/PeopleShow/index';

// const ProportionAudio = React.lazy(
//   () => import('@/components/pie/ProportionAudio'),
// );
const ProportionAudio = React.lazy(
  () => import('@/components/3DPie/ProportionAudio'),
);

interface mainContentProps {
  MainPage: any;
}

const MainContent: React.FC<mainContentProps> = (props) => {
  const { MainPage } = props;
  let active_pulseData = MainPage.active_pulseData;
  let target_echoData = MainPage.target_echoData;
  let radiated_noiseData = MainPage.radiated_noiseData;
  let audioPieData;
  if (
    active_pulseData !== undefined &&
    target_echoData !== undefined &&
    radiated_noiseData !== undefined
  ) {
    audioPieData = [
      {
        x: 'active_pulse',
        y: active_pulseData,
      },
      {
        x: 'target_echo',
        y: target_echoData,
      },
      {
        x: 'radiated_noise',
        y: radiated_noiseData,
      },
    ];
  } else {
    audioPieData = [
      {
        x: 'active_pulse',
        y: 3,
      },
      {
        x: 'target_echo',
        y: 3,
      },
      {
        x: 'radiated_noise',
        y: 7,
      },
    ];
  }
  const peopleData = [
    {
      x: '管理人员',
      y: MainPage.peopleData ? MainPage.peopleData.administrator_count : 0,
    },
    {
      x: '老师',
      y: MainPage.peopleData ? MainPage.peopleData.instructor_count : 0,
    },
    {
      x: '学生',
      y: MainPage.peopleData ? MainPage.peopleData.student_count : 0,
    },
  ];

  return (
    <div className={style.rightContent}>
      <div
        style={{
          width: '95%',
          marginLeft: '2.5%',
          height: 270,
          background: '#2F2F2F',
          marginTop: 15,
        }}
      >
        <Row gutter={20} style={{ height: '100%' }}>
          <Col span={18} style={{ height: '100%' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#292929',
                float: 'left',
                borderRadius: 5,
              }}
            >
              <Suspense fallback={null}>
                <ProportionAudio audioPieData={audioPieData} />
              </Suspense>
            </div>
          </Col>
          <Col span={6} style={{ height: '100%' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#292929',
                float: 'left',
                borderRadius: 5,
              }}
            >
              <Suspense fallback={null}>
                <PeopleShow peopleData={peopleData} />
              </Suspense>
            </div>
          </Col>
        </Row>
      </div>
      <div
        style={{ width: '95%', marginLeft: '2.5%', height: 370, marginTop: 30 }}
      >
        <Row gutter={16} style={{ height: 160 }}>
          <Col span={8}>
            <Link to="/audioImport">
              <div
                style={{ backgroundColor: '#77A5D5' }}
                className={style.featuresDiv}
              >
                <Space
                  align="center"
                  style={{ height: '100%', width: '100%', paddingLeft: '18%' }}
                >
                  <span style={{ fontSize: 80 }}>
                    <MenuUnfoldOutlined />
                  </span>
                  <span style={{ fontSize: 25 }}>数据管理</span>
                </Space>
              </div>
            </Link>
          </Col>
          <Col span={8}>
            <Link to="/audioEdit">
              <div
                style={{ backgroundColor: '#94BF7A' }}
                className={style.featuresDiv}
              >
                <Space
                  align="center"
                  style={{ height: '100%', width: '100%', paddingLeft: '14%' }}
                >
                  <span style={{ fontSize: 80 }}>
                    <ScissorOutlined />
                  </span>
                  <span style={{ fontSize: 25 }}>数据整编</span>
                </Space>
              </div>
            </Link>
          </Col>
          <Col span={8}>
            <Link to="/features">
              <div
                style={{ backgroundColor: '#DDCB76' }}
                className={style.featuresDiv}
              >
                <Space
                  align="center"
                  style={{ height: '100%', width: '100%', paddingLeft: '10%' }}
                >
                  <span style={{ fontSize: 80 }}>
                    <SnippetsOutlined />
                  </span>
                  <span style={{ fontSize: 25 }}>目标特征提取</span>
                </Space>
              </div>
            </Link>
          </Col>
        </Row>
        <Row gutter={16} style={{ height: 160, marginTop: 20 }}>
          <Col span={8}>
            {/* <Link to="/"> */}
            <div
              style={{ backgroundColor: '#D44444' }}
              className={style.featuresDiv}
            >
              <Space
                align="center"
                style={{ height: '100%', width: '100%', paddingLeft: '10%' }}
              >
                <span style={{ fontSize: 80 }}>
                  <EditOutlined />
                </span>
                <span style={{ fontSize: 25 }}>数据质量评价</span>
              </Space>
            </div>
            {/* </Link> */}
          </Col>
          <Col span={8}>
            <div
              style={{ backgroundColor: '#F79C32' }}
              className={style.featuresDiv}
            >
              <Space
                align="center"
                style={{ height: '100%', width: '100%', paddingLeft: '18%' }}
              >
                <span style={{ fontSize: 80 }}>
                  <UserOutlined />
                </span>
                <span style={{ fontSize: 25 }}>听音训练</span>
              </Space>
            </div>
          </Col>
          <Col span={8} style={{ height: 160 }}>
            <Link to="/targetRecognition">
              <div
                style={{ backgroundColor: '#00b894' }}
                className={style.featuresDiv}
              >
                <Space
                  align="center"
                  style={{ height: '100%', width: '100%', paddingLeft: '6%' }}
                >
                  <div style={{ fontSize: 80, margin: '0 auto' }}>
                    <RobotOutlined />
                  </div>
                  <div style={{ fontSize: 25 }}>目标分类识别</div>
                </Space>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ mainPage }: { mainPage: any }) => {
  return {
    MainPage: mainPage,
  };
};

export default connect(mapStateToProps)(MainContent);
