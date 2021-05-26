import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { Card, Spin, Table, Popover } from 'antd';
import { connect } from 'umi';
import 'echarts/lib/chart/line'; //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import request from '@/utils/request';
import UploadPhotos from '../../components/UploadPhotos';
const TestApp = (props) => {
  const {
    audio_id,
    audio_name,
    dispatch,
    setva,
    setmean,
    setcalc,
    path,
    Data,
  } = props;
  const [loading, setloading] = useState(false);
  let data_Zero = [];
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

  const [myType, setmyType] = useState('log'); //对数还是线性
  const [data, setdata] = useState(data_Zero);
  const [Xdata, setXdata] = useState(x_data);
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  const [id, setid] = useState('');
  const [time, setTime] = useState(0); //音频时长
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

  const getOption = (Type, data, Xdata, Type2) => {
    let option = {
      title: {
        text: '特征提取',
        subtext: '过零率',
      },
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
          data: data,
          type: Type2,
          color: 'skyblue',
        },
      ],
    };
    return option;
  };
  const getData = () => {
    setloading(true);
    request(`/v1/feature/Zero_Crossing`, {
      method: 'POST',
      data: {
        file_id: audio_id,
      },
    }).then((res) => {
      console.log('过零率： ' + JSON.stringify(res));
      for (let i = 0; i < res.picIfo[0].length; i++) {
        data_Zero.push(res.picIfo[0][i]);
        x_data.push(i);
      }
      let temp = [];
      for (let i = 0; i < Object.keys(res.picIfo).length; i++) {
        temp.push(res.picIfo[i]);
      }
      dispatch({
        type: 'Zero_Crossing/savedata',
        payload: {
          data: temp,
        },
      });
      dispatch({
        type: 'Zero_Crossing/savelabel',
        payload: {
          label: 1,
        },
      });
      dispatch({
        type: 'Zero_Crossing/saveframe_num',
        payload: {
          frame_num: temp.length - 1,
        },
      });
      setdata(data_Zero);
      setmyType('value');
      setPicType('line');
      setXdata(x_data);
      console.log(data);
      console.log(Xdata);
      setloading(false);

      // 修改dom信息
      let span_calc_int = document.getElementById('calc_int');
      let span_calc_decimal = document.getElementById('calc_decimal');
      let span_mean_int = document.getElementById('mean_int');
      let span_mean_decimal = document.getElementById('mean_decimal');
      let span_va_int = document.getElementById('va_int');
      let span_va_decimal = document.getElementById('va_decimal');

      span_calc_int.innerText = (res?.calc.toPrecision(3) + '').split('.')[0];
      span_calc_decimal.innerText =
        '.' + (res?.calc.toPrecision(3) + '').split('.')[1];
      span_mean_int.innerText = (res?.mean.toPrecision(3) + '').split('.')[0];
      span_mean_decimal.innerText =
        '.' + (res?.mean.toPrecision(3) + '').split('.')[1];
      span_va_int.innerText = (res?.var.toPrecision(3) + '').split('.')[0];
      span_va_decimal.innerText =
        '.' + (res?.var.toPrecision(3) + '').split('.')[1];
    });
  };
  return (
    <div>
      <Card>
        <Spin spinning={loading}>
          <ReactEcharts
            option={getOption(myType, data, Xdata, PicType)}
            theme="dark"
            style={{ height: '400px' }}
          />
        </Spin>
        <Button onClick={getData}>过零率分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/power/${id}`} />
      </Card>
    </div>
  );
};

const mapStateToProps = ({ Zero_Crossing }) => {
  return {
    Data: Zero_Crossing,
  };
};

export default connect(mapStateToProps)(TestApp);
