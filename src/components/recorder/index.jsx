import React, { useRef, useState } from 'react';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
import 'recorder-core/src/engine/wav';
import { Button } from 'antd';
import './index.less';
import PLAY from './play.png';
import PAUSE from './pause.png';
import END from './end.png';
import LOADING from './loading.png';
//import ajax from '../../api'

let record;
let Blob;
const App = () => {
  const [play, setPlay] = useState(false);
  const [visible, setVisible] = useState(false);
  let audio1 = useRef(null);

  const recordOpen = () => {
    record = Recorder({
      type: 'wav',
      sampleRate: 16000,
      bitRate: 16,
      onProcess: function (
        buffers,
        powerLevel,
        bufferDuration,
        bufferSampleRate,
        newBufferIdx,
        asyncEnd,
      ) {},
    });
    record.open(
      () => {
        record.start();
        setPlay(!play);
        setVisible(false);
      },
      (msg, isUserNotAllow) => {
        setPlay(!play);
        console.log(
          (isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg,
        );
      },
    );
  };

  const recordPause = () => {
    record.pause();
    setPlay(!play);
  };

  const recordResume = () => {
    record.resume();
    setPlay(!play);
  };

  const recordStop = () => {
    record.stop(
      (blob, duration) => {
        Blob = blob;
        console.log(
          blob,
          (window.URL || webkitURL).createObjectURL(blob),
          '时长:' + duration + 'ms',
        );
        /*const load = confirm('是否上传')
      if (load) {
        const reader = new FileReader();
        reader.onloadend = async function () {
          const results = await ajax('/api/recorder', {
            mime: blob.type, //告诉后端，这个录音是什么格式的，可能前后端都固定的mp3可以不用写
            upfile_b64: (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result) || [])[1] //录音文件内容，后端进行base64解码成二进制
            //...其他表单参数
          }, 'POST')
          console.log(results.data)
        }
        reader.readAsDataURL(blob)
        console.log(reader)
      }*/
        /*
      let file = {}
      const xhr = new XMLHttpRequest()
      console.log(Blob)
      xhr.open('GET', Blob, true)
      xhr.responseType = 'blob'
      xhr.onload = function (e) {
        console.log(this.response)
        if (this.status === 200) {
          file.file = this.response;
          file.name = "whatever_filename.wav";
          file.type = "audio/wav";
        }
      };
      xhr.send();*/
        record.close(); //释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        record = null;
        //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
        audio1.src = (window.URL || webkitURL).createObjectURL(blob);
      },
      (msg) => {
        console.log('录音失败:' + msg);
        record.close(); //可以通过stop方法的第3个参数来自动调用close
        record = null;
      },
    );
  };

  const getRecorder = async () => {
    const results = await ajax('/api/getrecorder', 'GET');
    console.log(results.data.data);
    const src = `data:${results.data.data.mime};base64,${results.data.data.upfile_b64}`;
    audio1.src = src;
    console.log(audio1.src);
  };

  const controlPlay = () => {
    console.log(visible);
    if (record && play) {
      recordPause();
    } else {
      if (record) {
        recordResume();
      } else {
        recordOpen();
      }
    }
  };

  const controlEnd = () => {
    recordStop();
    const Inter = setInterval(function () {
      setVisible(!visible);
      if (play) {
        setPlay(!play);
      }
      clearTimeout(Inter);
    }, 1);
  };

  const controlUpload = () => {
    if (Blob) {
      const reader = new FileReader();
      reader.onloadend = async function () {
        const results = await ajax(
          '/api/recorder',
          {
            mime: Blob.type, //告诉后端，这个录音是什么格式的，可能前后端都固定的mp3可以不用写
            upfile_b64: (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result) ||
              [])[1], //录音文件内容，后端进行base64解码成二进制
            //...其他表单参数
          },
          'POST',
        );
        console.log(results.data);
      };
      reader.readAsDataURL(Blob);
    }
  };

  return (
    <div>
      <div className="recorder">
        {play ? (
          <img src={PAUSE} alt="" className="play" onClick={controlPlay} />
        ) : (
          <img src={PLAY} className="play" onClick={controlPlay} />
        )}
        <img src={END} className="play" onClick={controlEnd} />
      </div>
      {/*visible? <Button type="primary" onClick={controlUpload} >上传</Button> : <div></div>*/}
      <br />
      {/*<button onClick={getRecorder}>获取后端数据</button>*/}
      <br />
      {visible ? (
        <audio ref={(c) => (audio1 = c)} controls={true}></audio>
      ) : (
        <div></div>
      )}
      {/*<button onClick={recordOpen}>创建录音机并请求权限</button>
      <button onClick={recordPause}>暂停录音</button>
      <button onClick={recordResume}>继续录音</button>
      <button onClick={recordStop}>结束录音</button>*/}
    </div>
  );
};

export default App;
