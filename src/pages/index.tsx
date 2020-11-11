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
} from 'antd';
import axios from 'axios';
import PeopleShow from '@/components/PeopleShow/index';

const ProportionAudio = React.lazy(
  () => import('@/components/pie/ProportionAudio'),
);

interface mainContentProps {
  dispatch: Dispatch;
  InforImport: any;
  // powerEngine: any;
  // loading: boolean;
}

const MainContent: React.FC<mainContentProps> = (props) => {
  const { dispatch, InforImport } = props;
  //const audioPieData = InforImport;
  //const peopleData = InforImport;
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
  const peopleData = [
    {
      x: '管理人员',
      y: 4544,
    },
    {
      x: '老师',
      y: 3321,
    },
    {
      x: '学生',
      y: 3113,
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
          <Col span={5} style={{ height: '100%' }}>
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
          </Col>
          <Col span={14} style={{ height: '100%' }}>
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
          <Col span={5} style={{ height: '100%' }}>
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
                <div
                  style={{
                    float: 'left',
                    fontSize: 80,
                    marginTop: '4.5%',
                    marginLeft: '21%',
                  }}
                >
                  <MenuUnfoldOutlined />
                </div>
                <div
                  style={{
                    float: 'left',
                    fontSize: 25,
                    marginTop: '17.5%',
                    marginLeft: 10,
                  }}
                >
                  <span>数据管理</span>
                </div>
              </div>
            </Link>
          </Col>
          <Col span={8}>
            <Link to="/audioEdit">
              <div
                style={{ backgroundColor: '#94BF7A' }}
                className={style.featuresDiv}
              >
                <div
                  style={{
                    float: 'left',
                    fontSize: 80,
                    marginTop: '4.5%',
                    marginLeft: '18%',
                  }}
                >
                  <ScissorOutlined />
                </div>
                <div
                  style={{
                    float: 'left',
                    fontSize: 25,
                    marginTop: '17.5%',
                    marginLeft: 10,
                  }}
                >
                  <span>数据预处理</span>
                </div>
              </div>
            </Link>
          </Col>
          <Col span={8}>
            <Link to="/features">
              <div
                style={{ backgroundColor: '#DDCB76' }}
                className={style.featuresDiv}
              >
                <div
                  style={{
                    float: 'left',
                    fontSize: 80,
                    marginTop: '4.5%',
                    marginLeft: '15%',
                  }}
                >
                  <SnippetsOutlined />
                </div>
                <div
                  style={{
                    float: 'left',
                    fontSize: 25,
                    marginTop: '17.5%',
                    marginLeft: 10,
                  }}
                >
                  <span>目标特征提取</span>
                </div>
              </div>
            </Link>
          </Col>
        </Row>
        <Row gutter={16} style={{ height: 160, marginTop: 20 }}>
          <Col span={8}>
            <Link to="/">
              <div
                style={{ backgroundColor: '#D44444' }}
                className={style.featuresDiv}
              >
                <div
                  style={{
                    float: 'left',
                    fontSize: 80,
                    marginTop: '4.5%',
                    marginLeft: '15%',
                  }}
                >
                  <EditOutlined />
                </div>
                <div
                  style={{
                    float: 'left',
                    fontSize: 25,
                    marginTop: '17.5%',
                    marginLeft: 10,
                  }}
                >
                  <span>数据质量评价</span>
                </div>
              </div>
            </Link>
          </Col>
          <Col span={8}>
            <div
              style={{ backgroundColor: '#F79C32' }}
              className={style.featuresDiv}
            >
              <div
                style={{
                  float: 'left',
                  fontSize: 80,
                  marginTop: '4.5%',
                  marginLeft: '21%',
                }}
              >
                <UserOutlined />
              </div>
              <div
                style={{
                  float: 'left',
                  fontSize: 25,
                  marginTop: '17.5%',
                  marginLeft: 10,
                }}
              >
                <span>听音训练</span>
              </div>
            </div>
          </Col>
          <Col span={8} style={{ height: 160 }}>
            <div
              style={{ backgroundColor: '#00b894' }}
              className={style.featuresDiv}
            >
              <div
                style={{
                  float: 'left',
                  fontSize: 80,
                  marginTop: '4.5%',
                  marginLeft: '12%',
                }}
              >
                <RobotOutlined />
              </div>
              <div
                style={{
                  float: 'left',
                  fontSize: 25,
                  marginTop: '17.5%',
                  marginLeft: 10,
                }}
              >
                <span>小样本机器识别</span>
              </div>
            </div>
          </Col>
        </Row>
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
