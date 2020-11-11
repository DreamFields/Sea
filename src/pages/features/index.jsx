/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime : 2020-11-11 23:37:00
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\features\index.jsx
 */
import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import '../main.less';
import '../audioEdit/edit.less';
import { Menu, Popover } from 'antd';
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

let feature_key;

const Index = (props) => {
  const { FeaturesInfor } = props;
  const [path, setpath] = useState(undefined);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('FeaturesInfor', FeaturesInfor);
    if (FeaturesInfor.audio_id) {
      request(`/v1/file/now_version_url/${FeaturesInfor.audio_id}`, {
        method: 'GET',
      }).then((res) => {
        console.log('版本文件路径', res.url);
        setpath(res.url);
      });
    }
    return () => {};
  }, [FeaturesInfor]);

  class RightSidermenu extends React.Component {
    handleClick = (e) => {
      console.log('click ', e);
      feature_key = e.key;
      if (e.key == '5') {
        document.querySelector('#divPara').style.display = 'block';
      } else {
        document.querySelector('#divPara').style.display = 'none';
      }
    };

    render() {
      return (
        <Menu
          onClick={this.handleClick}
          style={{ width: 250, backgroundColor: 'black' }}
          defaultSelectedKeys={[]}
          defaultOpenKeys={['sub1', 'sub2', 'sub3']}
          mode="inline"
        >
          <Menu.Item key="1">功率谱</Menu.Item>
          <Menu.Item key="2">低频线谱</Menu.Item>
          <Menu.Item key="3">调制谱</Menu.Item>
          <SubMenu key="sub1" title="听音特征" disabled>
            <Menu.Item key="4">梅尔倒谱系数</Menu.Item>
            <Menu.Item key="5">过零率</Menu.Item>
            <Menu.Item key="6">信息熵</Menu.Item>
            <Menu.Item key="7">均值</Menu.Item>
            <Menu.Item key="8">方差</Menu.Item>
            <Menu.Item key="9">清晰度</Menu.Item>
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
        waveColor: '#2ecc71',
        progressColor: '#27ae00',
        // splitChannels: true,
        cursorColor: '#2ecc71',
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
      let show_0 = document.querySelector('#divshow_0');
      show_0.style.display = 'block';
      let show_1 = document.querySelector('#divshow_1');
      // console.log(sound_name)
      // console.log(sound_path)
      let img = document.querySelector('#resImg');
      img.style.display = 'none';
      let loading = document.querySelector('#divLoading');
      loading.style.display = 'block';
      if (feature_key == '4') {
        show_1.style.display = 'none';
        show_0.style.display = 'block';
        request(`/v1/feature/MCFF`, {
          method: 'POST',
          data: {
            filename: FeaturesInfor.audio_name,
          },
        }).then((res) => {
          console.log(res);
          loading.style.display = 'none';
          img.style.display = 'block';
          img.setAttribute('src', res.picIfo);
        });
      } else if (feature_key == '5') {
        show_1.style.display = 'none';
        show_0.style.display = 'block';
        request(`/v1/feature/Zero_Crossing`, {
          method: 'POST',
          data: {
            filename: FeaturesInfor.audio_name,
            StartTime: form.getFieldsValue().start,
            EndTime: form.getFieldsValue().end,
          },
        }).then((res) => {
          console.log(res);
          loading.style.display = 'none';
          img.style.display = 'block';
          img.setAttribute('src', res.picIfo);
        });
      } else if (feature_key == '1') {
        show_0.style.display = 'none';
        show_1.style.display = 'block';
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
                style={{ marginLeft: 630 }}
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
            style={{ width: '100%', height: 200, display: 'block' }}
            id="divshow_0"
          >
            <img
              style={{ width: '100%', height: 200, display: 'none' }}
              id="resImg"
            />
            <div style={{ fontSize: 40, display: 'none' }} id="divLoading">
              <LoadingOutlined style={{ marginTop: 80, marginLeft: 366 }} />
            </div>
          </div>
          <div id="divshow_1" style={{ display: 'none' }}>
            <PowerApp audio_name={FeaturesInfor.audio_name} />
          </div>
        </div>
      );
    }
  }

  const MainContent = () => {
    return (
      <div
        className="rightContent"
        style={{ width: 815, float: 'left', height: 750 }}
      >
        <h3 style={{ width: 550, marginLeft: 20 }}>特征提取</h3>
        <div
          style={{
            backgroundColor: 'white',
            height: 2,
            width: '100%',
            marginTop: -5,
            marginBottom: 5,
          }}
        ></div>
        <h4 id="fileName" style={{ width: 850, marginLeft: 20 }}>
          从左栏选取文件
        </h4>
        <Waveform />
      </div>
    );
  };

  return (
    <>
      <MainContent />
      <div style={{ color: 'white', fontSize: 20, marginTop: 13 }}>
        目标特征提取
      </div>
      <div
        style={{
          backgroundColor: 'black',
          width: 250,
          height: 340,
          float: 'left',
          overflowY: 'auto',
          overflowX: 'hidden',
          border: '1px solid grey',
        }}
      >
        <RightSidermenu />
      </div>
      <div style={{ width: 250, height: 370, float: 'left', marginTop: 15 }}>
        <div style={{ color: 'white', fontSize: 20 }}>参数选择</div>
        <div
          style={{
            width: 250,
            height: 340,
            border: '1px solid grey',
            backgroundColor: 'black',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            id="divPara"
            style={{
              width: 240,
              marginTop: 20,
              marginLeft: 5,
              display: 'none',
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
