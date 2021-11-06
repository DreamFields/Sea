/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors: Please set LastEditors
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime: 2021-11-06 20:41:25
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
import DemonApp from '../demonAnalysis/index';
import MelApp from '../melSpectrogram/index';
import LofarApp from '../lofarV1/index';
import ZeroApp from '../zeroCrossing/index';
import MCFFApp from '../MCFF/index';
import BasicSoundData from './basicSoundData';
import FeatureRightMenu from './FeatureRightMenu';
import FeatureMainContent from './FeatureMainContent';

const Index = (props) => {
  const { audio_id, dispatch } = props;
  const [path, setpath] = useState(undefined);

  const Waveform = (props) => {
    var wavesurfer;

    useEffect(() => {
      // console.log('FeaturesInfor', FeaturesInfor);

      // 初始化wavesurfer组件
      wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'grey', // 修改配色
        // waveColor: 'rgba(2，68,187,0.65)',
        progressColor: '#1e90ff',
        splitChannels: true,
        cursorColor: '#bdc37',
        cursorWidth: 1,
        // barWidth: 2,
        // barHeight: 1, // the height of the wave
        // barGap: 2, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
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
      // btnPlay.addEventListener('click', function () {
      // wavesurfer.playPause();
      // });
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
      if (audio_id) {
        request(`/v1/file/now_version_url/${audio_id}`, {
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
    }, [audio_id]);

    return (
      <>
        <div style={{ marginTop: 20, marginLeft: 10, overflow: 'auto' }}>
          <Button
            type="primary"
            id="btnPlay"
            style={{ fontSize: 15, float: 'left' }}
            onClick={() => {
              wavesurfer.playPause();
            }}
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
          <Button
            type="primary"
            style={{ fontSize: 15, float: 'left', marginLeft: '16px' }}
            onClick={() => {
              if (wavesurfer) {
                wavesurfer.skip(0 - wavesurfer.getCurrentTime());
              }
            }}
          >
            复制截图
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
      </>
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
          <div style={{ backgroundColor: '#2F2F2F' }}>
            <Waveform />
            <FeatureMainContent path={path} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <MainContent />
      <FeatureRightMenu />
    </>
  );
};

const mapStateToProps = ({ features, loading }) => {
  return {
    audio_id: features.audio_id,
    // f_key: features.menu_key,
    // FeaturesInfor: features,
  };
};

export default connect(mapStateToProps)(Index);
