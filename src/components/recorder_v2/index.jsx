import React, { useState } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { LoadingOutlined } from '@ant-design/icons';
import './index.less';

import PLAY from './play.png';
import PAUSE from './pause.png';
import END from './end.png';

const Index = () => {
  const [recordState, setrecordState] = useState(null);
  const [play, setplay] = useState(null);
  const [visible, setvisible] = useState(false);
  const [url, seturl] = useState(null);
  const [loading, setloading] = useState(false);

  const recorderPlay = () => {
    if (play === 'start') {
      setrecordState(RecordState.PAUSE);
      setplay(RecordState.PAUSE);
      setloading(false);
    } else {
      setrecordState(RecordState.START);
      setplay(RecordState.START);
      seturl(null);
      setvisible(false);
      setloading(true);
    }
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
        {loading ? '正在录音...' : '录音机：'}{' '}
        <LoadingOutlined
          style={{ visibility: loading ? 'visible' : 'hidden' }}
        />
      </h3>
      <div>
        <AudioReactRecorder
          canvasWidth="600"
          canvasHeight="200"
          state={recordState}
          onStop={onStop}
        />
        <div style={{ display: 'flex', marginBottom: 16, marginTop: 16 }}>
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
              src={url}
              /* ref={c => audio1 = c} */ controls={true}
              style={{ display: 'block' }}
            ></audio>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Index;
