/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime : 2020-12-27 18:17:10
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\features\index.jsx
 */
import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
// import '../main.less';
// import '../audioEdit/edit.less';
import { Menu, Popover, Statistic } from 'antd';
import {
  PlayCircleOutlined,
  PauseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import axios from 'axios';
import request from '@/utils/request';
import PowerApp from '../power/index.jsx';

const { SubMenu } = Menu;
const rightWidth = '22%';

let feature_key;

const Index = (props) => {
  const { FeaturesInfor, dispatch } = props;
  const [path, setpath] = useState(undefined);
  const [f_key, setfkey] = useState(undefined);
  const [picIfo, setpicIfo] = useState(undefined);
  const [va, setva] = useState(undefined); // 方差
  const [mean, setmean] = useState(undefined); // 平均值
  const [calc, setcalc] = useState(undefined); // 信息熵
  const [db, setdb] = useState(undefined); //分贝

  const [form] = Form.useForm();

  useEffect(() => {
    console.log('FeaturesInfor', FeaturesInfor);
    if (FeaturesInfor.audio_id) {
      request(`/v1/file/now_version_url/${FeaturesInfor.audio_id}`, {
        method: 'GET',
      }).then((res) => {
        console.log('版本文件路径', res?.url);
        setpath(res?.url);
      });
    }
    return () => {};
  }, [FeaturesInfor]);

  class RightSidermenu extends React.Component {
    handleClick = (e) => {
      console.log('click ', e);
      feature_key = e.key;
      setfkey(e.key);

      setpicIfo(undefined);
      setva(undefined);
      setmean(undefined);
      setcalc(undefined);
    };

    render() {
      return (
        <Menu
          onClick={this.handleClick}
          style={{ width: '100%', backgroundColor: 'black' }}
          defaultSelectedKeys={[]}
          selectedKeys={[f_key]}
          defaultOpenKeys={['sub1', 'sub2', 'sub3']}
          mode="inline"
        >
          <Menu.Item key="1">功率谱</Menu.Item>
          <Menu.Item key="2">低频线谱</Menu.Item>
          <Menu.Item key="3">调制谱</Menu.Item>
          <SubMenu key="sub1" title="听音特征" disabled>
            <Menu.Item key="4">梅尔倒谱系数</Menu.Item>
            <Menu.Item key="5">过零率</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title="主动脉冲特征" disabled>
            <Menu.Item key="10">信号形式</Menu.Item>
            <Menu.Item key="11">信号基频</Menu.Item>
            <Menu.Item key="12">带宽</Menu.Item>
            <Menu.Item key="13">平台属性</Menu.Item>
          </SubMenu>
        </Menu>
      );
    }
  }

  class Waveform extends React.Component {
    componentDidMount() {
      var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'skyblue',
        progressColor: '#1e90ff',
        // splitChannels: true,
        cursorColor: '#bdc37',
        cursorWidth: 1,
        barWidth: 2,
        barHeight: 1, // the height of the wave
        barGap: 2, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
        barRadius: 3,
        plugins: [
          WaveSurfer.cursor.create({
            showTime: true,
            opacity: 1,
            color: 'white',
            customShowTimeStyle: {
              'background-color': '#000',
              color: 'white',
              padding: '2px',
              'font-size': '10px',
            },
          }),
          WaveSurfer.timeline.create({
            height: 20,
            container: '#wave-timeline',
          }),
        ],
      });

      if (path) {
        wavesurfer.load(path);
      }

      btnPlay.addEventListener('click', function () {
        wavesurfer.playPause();
      });

      // Progress bar
      (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function (percent) {
          progressDiv.style.display = 'block';
          progressBar.style.width = percent + '%';
        };

        var hideProgress = function () {
          progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
      })();
    }

    getFeatures() {
      let loading = document.querySelector('#divLoading');

      if (f_key !== '1') {
        loading.style.display = 'block';
      }

      if (f_key === '4') {
        // show_1.style.display = 'none';
        // show_0.style.display = 'block';
        request(`/v1/feature/MCFF`, {
          method: 'POST',
          data: {
            file_id: FeaturesInfor.audio_id,
          },
        }).then((res) => {
          console.log(res);
          loading.style.display = 'none';

          setpicIfo(res?.picIfo);
          setva(res?.var);
          setmean(res?.mean);
          setcalc(res?.calc);
        });
      } else if (f_key == '5') {
        request(`/v1/feature/Zero_Crossing`, {
          method: 'POST',
          data: {
            file_id: FeaturesInfor.audio_id,
            StartTime: form.getFieldsValue().start,
            EndTime: form.getFieldsValue().end,
          },
        }).then((res) => {
          console.log(res);
          loading.style.display = 'none';

          setpicIfo(res?.picIfo);
          setva(res?.var);
          setmean(res?.mean);
          setcalc(res?.calc);
        });
      }
    }

    render() {
      return (
        <div style={{ backgroundColor: '#2F2F2F' }}>
          <div style={{ marginTop: 20, marginLeft: 10 }}>
            <Button
              type="primary"
              onClick={this.start}
              id="btnPlay"
              style={{ fontSize: 15 }}
            >
              <PlayCircleOutlined />/<PauseOutlined />
            </Button>
            <Popover content="先在右侧特征栏选择特征，再点击计算" title="计算">
              <Button
                type="primary"
                style={{ marginLeft: '80%' }}
                onClick={this.getFeatures}
              >
                计算
              </Button>
            </Popover>
          </div>
          <div id="wave-timeline" style={{ marginTop: 20 }}></div>
          <div id="waveform" style={{ backgroundColor: 'black' }}>
            <div className="progress progress-striped active" id="progress-bar">
              <div className="progress-bar progress-bar-info"></div>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: 200,
              display: f_key === '4' || f_key === '5' ? 'block' : 'none',
            }}
            id="divshow_0"
          >
            <img
              src={picIfo}
              style={{
                width: '100%',
                height: 200,
                display: picIfo ? 'block' : 'none',
              }}
              id="resImg"
            />
            <div style={{ fontSize: 40, display: 'none' }} id="divLoading">
              <LoadingOutlined style={{ marginTop: 80, marginLeft: 366 }} />
            </div>
          </div>
          <div
            id="divshow_1"
            style={{ display: f_key === '1' ? 'block' : 'none' }}
          >
            <PowerApp audio_id={FeaturesInfor.audio_id} />
          </div>
        </div>
      );
    }
  }

  const MainContent = () => {
    return (
      <div
        className="centerContent"
        style={{
          width: '74%',
          float: 'left',
          height: 1060,
          backgroundColor: '#2F2F2F',
          marginLeft: '1rem',
          marginTop: 20,
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            height: '96%',
            width: '96%',
            marginLeft: '2%',
            marginTop: '2%',
          }}
        >
          <h3 style={{ width: '100%' }}>特征提取</h3>
          <div
            style={{
              backgroundColor: 'white',
              height: 2,
              width: '100%',
              marginTop: -5,
              marginBottom: 5,
            }}
          ></div>
          <h4 id="fileName" style={{ width: '100%' }}>
            从左栏选取文件
          </h4>
          <Waveform />
        </div>
      </div>
    );
  };

  return (
    <>
      <MainContent />

      <div
        style={{
          width: rightWidth,
          height: 390,
          float: 'left',
          marginTop: 15,
          marginLeft: '1rem',
        }}
      >
        <div style={{ color: 'white', fontSize: 20 }}>特征选择</div>
        <div
          style={{
            backgroundColor: 'black',
            width: '100%',
            height: 340,
            float: 'left',
            overflowY: 'auto',
            overflowX: 'hidden',
            border: '1px solid grey',
          }}
        >
          <RightSidermenu />
        </div>
      </div>

      <div
        style={{
          width: rightWidth,
          height: 360,
          float: 'left',
          marginTop: 10,
          marginLeft: '1rem',
        }}
      >
        <div style={{ color: 'white', fontSize: 20 }}>基本听音特征</div>
        <div
          style={{
            backgroundColor: 'black',
            width: '100%',
            height: 300,
            float: 'left',
            overflowY: 'auto',
            overflowX: 'hidden',
            border: '1px solid grey',
            padding: '20px 20px',
          }}
        >
          {/* 直接看antd的statistic源码，做一个频率和分贝的数据展示 */}
          <div
            className="ant-statistic"
            style={{ display: f_key === '1' ? 'block' : 'none' }}
          >
            <div className="ant-statistic-title">分贝</div>
            <div className="ant-statistic-content">
              <span className="ant-statistic-content-value">
                <span className="ant-statistic-content-value-int" id="db_int">
                  0
                </span>
                <span
                  className="ant-statistic-content-value-decimal"
                  id="db_decimal"
                ></span>
              </span>
            </div>
          </div>
          <div
            className="ant-statistic"
            style={{ display: f_key === '1' ? 'block' : 'none' }}
          >
            <div className="ant-statistic-title">频率</div>
            <div className="ant-statistic-content">
              <span className="ant-statistic-content-value">
                <span className="ant-statistic-content-value-int" id="hz_int">
                  0
                </span>
                {/* <span className="ant-statistic-content-value-decimal" id="hz_decimal"></span> */}
              </span>
            </div>
          </div>

          <Statistic title="信息熵" value={calc} />
          <Statistic title="均值" value={mean} />
          <Statistic title="方差" value={va} />
          {/* <Statistic title="分贝" value={FeaturesInfor.db} style={{ display: f_key === '1' ? 'block' : 'none' }} id='db' /> */}
        </div>
      </div>

      <div
        style={{
          width: rightWidth,
          height: 300,
          float: 'left',
          marginLeft: '1rem',
        }}
      >
        <div style={{ color: 'white', fontSize: 20 }}>参数选择</div>
        <div
          style={{
            width: '100%',
            height: 270,
            border: '1px solid grey',
            backgroundColor: 'black',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            id="divPara"
            style={{
              width: '96%',
              marginTop: 20,
              marginLeft: '2%',
              display: f_key === '5' ? 'block' : 'none',
            }}
          >
            <Form name="edit_fleet" layout="vertical" form={form}>
              <Form.Item name="start" label="开始时间">
                <Input autoComplete="off" placeholder="单位：ms" />
              </Form.Item>
              <Form.Item name="end" label="结束时间">
                <Input autoComplete="off" placeholder="单位：ms" />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ features, loading }) => {
  return {
    FeaturesInfor: features,
  };
};

export default connect(mapStateToProps)(Index);
