import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Menu, Popover, Typography, Select, message } from 'antd';
import {
  PlayCircleOutlined,
  PauseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import axios from 'axios';
import request from '@/utils/request';

const { Title, Paragraph, Text, Link } = Typography;
const rightWidth = '22%';

const Index = (props) => {
  const { targetInfor } = props;
  const [path, setpath] = useState(undefined);
  const [mark, setMark] = useState('MFCC');
  const [result1, setResult1] = useState(undefined);
  const [result2, setResult2] = useState(undefined);

  useEffect(() => {
    console.log('targetInfor.audio_id', targetInfor);
    targetInfor.audio_result1 = undefined;
    setResult1(undefined);
    setResult2(undefined);
    targetInfor.audio_result2 = undefined;
    return () => {};
  }, [targetInfor.audio_id]);

  useEffect(() => {
    console.log('targetInfor', targetInfor);
    if (targetInfor.audio_id) {
      request(`/v1/file/now_version_url/${targetInfor.audio_id}`, {
        method: 'GET',
      }).then((res) => {
        // console.log('版本文件路径', res.url);
        setpath(res?.url);
      });
    }
    return () => {};
  }, [targetInfor]);

  class RightContent extends React.Component {
    render() {
      return (
        <div>
          <Typography style={{ marginLeft: '5%' }}>
            <br />
            <Title key="1" level={2}>
              类型：{result1}
            </Title>
            <Title key="2" level={2}>
              置信度：{result2}
            </Title>
          </Typography>
        </div>
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

    handleChange(value) {
      console.log(value);
      setMark(value);
    }

    getTargetResult() {
      if (!targetInfor.audio_id) {
        message.error('请先选择音频！');
        return;
      }
      if (mark === 'MFCC') {
        request(`/v1/classification/audio_classification`, {
          method: 'POST',
          data: {
            sound_id: targetInfor.audio_id,
          },
        }).then((res) => {
          if (res.result1) {
            setResult1(res.result1 === 'FishingBoat' ? '渔船' : res.result1);
            targetInfor.audio_result1 = res.result1;
          }
          if (res.result2) {
            setResult2(res.result2 === 'FishingBoat' ? '渔船' : res.result2);
            targetInfor.audio_result2 = res.result2;
          }
        });
      } else {
        request(`/v1/classification/lofar_classification`, {
          method: 'POST',
          data: {
            sound_id: targetInfor.audio_id,
          },
        }).then((res) => {
          if (res.result1) {
            setResult1(res.result1 === 'FishingBoat' ? '渔船' : res.result1);
            targetInfor.audio_result1 = res.result1;
          }
          if (res.result2) {
            setResult2(res.result2 === 'FishingBoat' ? '渔船' : res.result2);
            targetInfor.audio_result2 = res.result2;
          }
        });
      }
    }

    render() {
      return (
        <div style={{ backgroundColor: '#2F2F2F' }}>
          <div style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
            <Button
              type="primary"
              onClick={this.start}
              id="btnPlay"
              style={{ fontSize: 15 }}
            >
              <PlayCircleOutlined />/<PauseOutlined />
            </Button>
            <div style={{ fontSize: 15, float: 'right' }}>
              <Select
                // defaultValue="MFCC"
                //style={{ float: 'right' }}
                onChange={this.handleChange}
                value={mark}
              >
                <Select.Option key="1" value="MFCC">
                  基于MFCC的CNN模型
                </Select.Option>
                <Select.Option key="2" value="LOFAR">
                  基于LOFAR谱的CNN模型
                </Select.Option>
              </Select>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Popover
                content="先在左侧选择音频，然后选择模型，再点击分类"
                title="分类"
              >
                <Button
                  type="primary"
                  style={{ fontSize: 15 }}
                  onClick={this.getTargetResult}
                >
                  分类
                </Button>
              </Popover>
            </div>
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
          <h3 style={{ width: '100%' }}>目标自动识别</h3>
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
        <div style={{ color: 'white', fontSize: 20 }}>分类结果</div>
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
          <RightContent />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ target, loading }) => {
  return {
    targetInfor: target,
  };
};

export default connect(mapStateToProps)(Index);
