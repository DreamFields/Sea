import React, { useState } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';

import PLAY from './play.png';
import PAUSE from './pause.png';
import END from './end.png';

const Index = () => {
  const [recordState, setrecordState] = useState(null);
  const [play, setplay] = useState(null);
  const [visible, setvisible] = useState(false);
  const [url, seturl] = useState(null);

  const recorderPlay = () => {
    if (play === 'start') {
      setrecordState(RecordState.PAUSE);
      setplay(RecordState.PAUSE);
    } else {
      setrecordState(RecordState.START);
      setplay(RecordState.START);
      seturl(null);
      setvisible(false);
    }
  };

  const stop = () => {
    setrecordState(RecordState.STOP);
    setplay(RecordState.STOP);
    const timer = setInterval(() => {
      setrecordState(RecordState.NONE);
      setplay(RecordState.NONE);
      clearInterval(timer);
    });
  };

  //audioData contains blob and blobUrl
  const onStop = (audioData) => {
    console.log('audioData', audioData);
    console.log(audioData.url);
    seturl(audioData.url);
    setvisible(true);
  };

  return (
    <div>
      <div>
        <AudioReactRecorder
          canvasWidth="0"
          canvasHeight="0"
          state={recordState}
          onStop={onStop}
        />
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
  );
};

export default Index;
