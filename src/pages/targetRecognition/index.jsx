import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import style from '../audioEdit/edit.less';
import request from '@/utils/request';
import ModeCard from './modeCard';

const Index = (props) => {
  const { targetInfor } = props;
  const [path, setpath] = useState(undefined);

  useEffect(() => {
    console.log('targetInfor', targetInfor);
    if (targetInfor.audio_id) {
      request(`/v1/file/now_version_url/${targetInfor.audio_id}`, {
        method: 'GET',
      }).then((res) => {
        setpath(res?.url);
      });
    }
    return () => {};
  }, [targetInfor]);

  const Waveform = () => {
    useEffect(() => {
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

      let btnPlay = document.getElementById('btnPlay');
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

        hideProgress();

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
      })();

      return () => {};
    }, []);

    return (
      <div style={{ backgroundColor: '#2F2F2F' }}>
        <div style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
          <Button type="primary" id="btnPlay" style={{ fontSize: 15 }}>
            <PlayCircleOutlined />/<PauseOutlined />
          </Button>
        </div>
        <div id="wave-timeline" style={{ marginTop: 20 }}></div>
        <div id="waveform" style={{ backgroundColor: '#3D3D3D' }}>
          <div className="progress progress-striped active" id="progress-bar">
            <div className="progress-bar progress-bar-info"></div>
          </div>
        </div>
      </div>
    );
  };

  const infos = [
    {
      requestUrl: '/v1/classification/audio_classification',
      title: '基于MFCC的CNN模型',
    },
    {
      requestUrl: '/v1/classification/lofar_classification',
      title: '基于LOFAR谱的CNN模型',
    },
    {
      requestUrl: '/v1/classification/bi_lstm_process_single',
      title: '基于MFCC的LSTM模型',
    },
    {
      requestUrl: '/v1/classification/bi_lstm_dms_predict',
      title: '基于调制谱的LSTM模型',
    },
  ];

  return (
    <div>
      <div className={style.rightContent} style={{ height: 1200 }}>
        <div className={style.rightCenter} style={{ height: 1150 }}>
          <h3>分类识别</h3>
          <div
            style={{
              backgroundColor: 'white',
              height: 2,
              width: '100%',
              marginTop: -5,
              marginBottom: 5,
            }}
          ></div>
          <Waveform />
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            {infos.map((item) => {
              return (
                <div key={item.requestUrl} style={{ width: '45%', marginRight: '5%', marginTop: 32 }}>
                  <ModeCard
                    sid={targetInfor.audio_id}
                    title={item.title}
                    requestUrl={item.requestUrl}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ target }) => {
  return {
    targetInfor: target,
  };
};

export default connect(mapStateToProps)(Index);
