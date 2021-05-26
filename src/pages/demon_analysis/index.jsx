import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { Card, Spin, Popover } from 'antd';
import { connect } from 'umi';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import request from '@/utils/request';
import UploadPhotos from '../../components/UploadPhotos';
const TestApp = (props) => {
  const { audio_id, audio_name, path, Data, dispatch } = props;
  const [loading, setloading] = useState(false);
  let data_Demon = [];
  let data_L = 0;
  let x_data = [];

  // 播放控制
  let animationValue = false;
  // 播放到的帧数
  let frame_count = 1;
  // 计时器id
  let move;
  // 音频总时长，以ms为单位
  let duration = 0;
  // 帧间隔时间，以ms为单位
  const interval = 100;

  const [myType, setmyType] = useState('value'); //对数还是线性

  const [data, setdata] = useState(data_Demon);
  const [Xdata, setXdata] = useState(x_data);
  const [id, setid] = useState('');
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  useEffect(() => {
    // 获取音频时长
    if (path) {
      let audioElement = new Audio(path);
      audioElement.addEventListener('loadedmetadata', function (_event) {
        duration = audioElement.duration * 1000;
        // console.log('视频的时长为(ms):', duration);
      });
    }
    let dom = document.getElementById('btnPlay');
    dom.addEventListener('click', () => {
      if (animationValue) {
        animationValue = false;
      } else {
        animationValue = true;
      }
      animationController();
    });
  }, []);
  const animationController = function () {
    if (animationValue === true) {
      move = setInterval(() => {
        // console.log(frame_count);
        if (Data.data) {
          const old_data = data.slice();
          let datadis = Math.floor(
            (old_data.length * frame_count * interval) / duration,
          );
          let new_data = old_data.splice(0, datadis);
          dispatch({
            type: 'data_demon/savedata',
            payload: {
              data: new_data,
            },
          });
        }
        frame_count++;
        if (frame_count > Math.floor(duration / interval)) {
          clearInterval(move);
          frame_count = 1;
          dispatch({
            type: 'data_demon/savedata',
            payload: {
              data: data,
            },
          });
          animationValue = false;
        }
      }, interval);
    } else {
      clearInterval(move);
    }
  };

  const getOption = (Type, data1, Xdata, Type2) => {
    let option = {
      title: {
        text: '特征提取',
        subtext: '调制谱',
      },
      animation: true,
      xAxis: {
        type: 'category',
        data: Xdata,
      },
      yAxis: {
        type: Type,
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        left: 'center',
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          saveAsImage: {
            pixelRatio: 5,
          },
          restore: {},
        },
      },
      series: [
        {
          data: data1,
          type: Type2,
          color: 'skyblue',
        },
      ],
    };
    return option;
  };

  const handleChartClick = (params) => {
    console.log(params);
    console.log('分贝(db):' + params.value.toPrecision(3));
    console.log('频率(hz)):' + params.dataIndex);
    let span_db_int = document.getElementById('db_int');
    let span_db_decimal = document.getElementById('db_decimal');
    let span_hz_int = document.getElementById('hz_int');

    span_db_int.innerText = (params.value.toPrecision(3) + '').split('.')[0];
    span_db_decimal.innerText =
      '.' + (params.value.toPrecision(3) + '').split('.')[1];
    span_hz_int.innerText = params.dataIndex + '';
  };

  const getData = () => {
    setloading(true);
    request(`/v1/feature/demon_amalysis`, {
      method: 'POST',
      data: { sid: audio_id },
    }).then((res) => {
      let id = res?.id;
      setid(id);
      for (let i of res.FreqV) {
        x_data.push(i);
      }
      for (let i of res.outputData_2) {
        data_Demon.push(i);
      }
      console.log(JSON.stringify(res));
      setPicType('line');
      setdata(data_Demon);
      data_L = data_Demon.length;
      dispatch({
        type: 'data_demon/savedataL',
        payload: {
          dataL: data_Demon.length,
        },
      });
      dispatch({
        type: 'data_demon/savedata',
        payload: {
          data: data_Demon,
        },
      });
      console.log('data_Demon.length' + data_L);
      setXdata(x_data);
      console.log('data_Demon' + data_Demon);
      console.log('Xdata:' + Xdata);
      setloading(false);
    });
  };

  return (
    <div>
      <Card>
        <Spin spinning={loading}>
          <ReactEcharts
            option={getOption(myType, Data.data, Xdata, PicType)}
            theme="dark"
            style={{ height: '400px' }}
            onEvents={{
              click: handleChartClick,
            }}
          />
        </Spin>
        <Button onClick={getData}>调制谱分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/demon/${id}`} />
      </Card>
    </div>
  );
};

const mapStateToProps = ({ data_demon }) => {
  return {
    Data: data_demon,
  };
};

export default connect(mapStateToProps)(TestApp);
