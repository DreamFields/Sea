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
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import { Input, Button, Form, Table } from 'antd';
import axios from 'axios';
import request from '@/utils/request';
import PowerApp from '../power/index.jsx';
import DemonApp from '../demon_analysis/index';
import MelApp from '../Mel_Spectrogram/index';
import LofarApp from '../lofar_v1/index';
import ZeroApp from '../Zero_crossing/index';
import MCFFApp from '../MCFF/index';
import BasicSoundData from './basicSoundData';
const { SubMenu } = Menu;
const rightWidth = '22%';
let feature_key;
const Index = (props) => {
  const { FeaturesInfor, dispatch } = props;
  const [path, setpath] = useState(undefined);
  const [f_key, setfkey] = useState(undefined);
  class RightSidermenu extends React.Component {
    handleClick = (e) => {
      feature_key = e.key;
      setfkey(e.key);
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
          <Menu.Item key="4">梅尔倒谱</Menu.Item>
          <Menu.Item key="5">过零率</Menu.Item>
          <Menu.Item key="6">语谱图</Menu.Item>
        </Menu>
      );
    }
  }

  const Waveform = () => {
    var wavesurfer;

    useEffect(() => {
      // console.log('FeaturesInfor', FeaturesInfor);

      // 初始化wavesurfer组件
      wavesurfer = WaveSurfer.create({
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
      // 初始化完成
      if (FeaturesInfor.audio_id) {
        request(`/v1/file/now_version_url/${FeaturesInfor.audio_id}`, {
          method: 'GET',
        }).then((res) => {
          // console.log('版本文件路径', res?.url);
          if (wavesurfer) {
            wavesurfer.load(res?.url);
          }
          setpath(res?.url);
        });
      }
      return () => {};
    }, [FeaturesInfor]);

    const FeatureMainDiv = {
      1: (
        <div>
          <PowerApp
            audio_id={FeaturesInfor.audio_id}
            audio_name={FeaturesInfor.audio_name}
          />
        </div>
      ),
      2: (
        <div>
          <LofarApp
            audio_id={FeaturesInfor.audio_id}
            audio_name={FeaturesInfor.audio_name}
          />
        </div>
      ),
      3: (
        <div>
          <DemonApp
            audio_id={FeaturesInfor.audio_id}
            audio_name={FeaturesInfor.audio_name}
            path={path}
          />
        </div>
      ),

      4: (
        <div>
          <MCFFApp audio_id={FeaturesInfor.audio_id} />
        </div>
      ),
      5: (
        <div>
          <ZeroApp
            audio_id={FeaturesInfor.audio_id}
            audio_name={FeaturesInfor.audio_name}
            path={path}
          />
        </div>
      ),
      6: (
        <div>
          <MelApp
            audio_id={FeaturesInfor.audio_id}
            audio_name={FeaturesInfor.audio_name}
            signal_type={FeaturesInfor.signal_type}
          />
        </div>
      ),
    };

    return (
      <div style={{ backgroundColor: '#2F2F2F' }}>
        <div style={{ marginTop: 20, marginLeft: 10, overflow: 'auto' }}>
          <Button
            type="primary"
            id="btnPlay"
            style={{ fontSize: 15, float: 'left' }}
          >
            <PlayCircleOutlined />/<PauseOutlined />
          </Button>
          <Button
            type="primary"
            style={{ fontSize: 15, float: 'left', marginLeft: '16px' }}
            onClick={() => {
              if (wavesurfer) {
                wavesurfer.skip(0 - wavesurfer.getCurrentTime());
              }
            }}
          >
            复位
          </Button>
        </div>
        <div id="wave-timeline" style={{ marginTop: 20 }}></div>
        <div id="waveform" style={{ backgroundColor: '#3D3D3D' }}>
          <div
            className="progress progress-striped active"
            id="progress-bar"
            style={{ display: 'none' }}
          >
            <div className="progress-bar progress-bar-info"></div>
          </div>
        </div>

        {FeatureMainDiv[f_key]}
      </div>
    );
  };

  const MainContent = () => {
    return (
      <div
        className="centerContent"
        style={{
          overflowY: 'scroll',
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
        <BasicSoundData f_key={f_key} />
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
