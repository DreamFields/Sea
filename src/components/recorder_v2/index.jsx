import React, { useEffect, useState } from 'react';
import Recorder from 'recorder-core';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { LoadingOutlined } from '@ant-design/icons';
import './index.less';

import PLAY from './play.png';
import PAUSE from './pause.png';
import END from './end.png';
import { message } from 'antd';

const Index = () => {
  const [recordState, setrecordState] = useState(null);
  const [play, setplay] = useState(null);
  const [visible, setvisible] = useState(false);
  const [url, seturl] = useState(null);
  const [loading, setloading] = useState(false);

  const recorderPlay = () => {
    console.log('object');
    //调用开启麦克风
    let constraints = {
      audio: true,
      video: false,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(() => {
        // console.log('有麦克风')
        if (play === 'start') {
          setrecordState(RecordState.PAUSE);
          setplay(RecordState.PAUSE);
          setloading(false);
        } else {
          console.log('reacoedState', RecordState);
          setrecordState(RecordState.START);
          setplay(RecordState.START);
          seturl(null);
          setvisible(false);
          setloading(true);
        }
      })
      .catch((e) => {
        // console.log('e',e)
        message.warning('请检查设备是否有麦克风！');
      });
  };

  const stop = () => {
    setrecordState(RecordState.STOP);
    setplay(RecordState.STOP);
    setloading(false);
    const timer = setInterval(() => {
      setrecordState(RecordState.NONE);
      setplay(RecordState.NONE);
      clearInterval(timer);
    });
  };

  //audioData contains blob and blobUrl
  const onStop = (audioData) => {
    setloading(false);
    console.log('audioData', audioData);
    console.log(audioData.url);
    seturl(audioData.url);
    setvisible(true);
  };

  return (
    <div>
      <h3>
        {loading ? '正在录音...' : '录音机'}{' '}
        <LoadingOutlined
          style={{ visibility: loading ? 'visible' : 'hidden' }}
        />
      </h3>
      <div>
        <div
          style={{
            display: 'flex',
            marginBottom: 16,
            marginTop: 16,
            justifyContent: 'flex-end',
            top: '-45px',
            position: 'relative',
          }}
        >
          {
            <div className="recorder">
              {play === 'start' ? (
                <img src={PAUSE} className="play" onClick={recorderPlay} />
              ) : (
                <img src={PLAY} className="play" onClick={recorderPlay} />
              )}
              <img src={END} className="play" onClick={stop} />
            </div>
          }
          {url && visible ? (
            <audio
              id="audio"
              src={url}
              /* ref={c => audio1 = c} */ controls={true}
              style={{ display: 'block' }}
            ></audio>
          ) : null}
        </div>
        <AudioReactRecorder
          // canvasWidth="100%"
          // canvasHeight="200"
          state={recordState}
          onStop={onStop}
          foregroundColor="#08979c"
          backgroundColor="#434343"
        />
      </div>
    </div>
  );
};

export default Index;
