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
  const { audio_id, audio_name, dispatch, path, Data } = props;
  const [loading, setloading] = useState(false);
  let data_Zero = [];
  let x_data = [];
  // 播放控制
  let animationValue = false;
  // 播放到的帧数
  let frame_count = -1;
  // 计时器id
  let move;
  // 帧间隔时间，以ms为单位
  const interval = 1000;

  const [myType, setmyType] = useState('log'); //对数还是线性
  const [Xdata, setXdata] = useState(x_data);
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  const [id, setid] = useState('');
  useEffect(() => {
    // 获取音频时长
    // if (path) {
    //   let audioElement = new Audio(path);
    //   audioElement.addEventListener('loadedmetadata', function (_event) {
    //     duration = audioElement.duration * 1000;
    //     // console.log('视频的时长为(ms):', duration);
    //   });
    // }
    setmyType('value');
    setPicType('line');

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

  // useEffect(()=>{
  //   console.log("label", Data?.label);
  // },[Data])

  const animationController = function () {
    if (animationValue === true) {
      move = setInterval(() => {
        console.log(frame_count);
        dispatch({
          type: 'Zero_crossing/savelabel',
          payload: {
            label: frame_count,
          },
        });

        frame_count++;

        if (frame_count >= Data.data?.length) {
          clearInterval(move);
          frame_count = -1;
          // dispatch({
          //   type: 'data_demon/savelabel',
          //   payload: {
          //     label: 0,
          //   },
          // });
          animationValue = false;
        }
      }, interval);
    } else {
      clearInterval(move);
    }
  };

  const getOption = (Type, data, Xdata, Type2) => {
    let option = {
      // animation: false,
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
      // console.log('过零率： ' + JSON.stringify(res));
      if (res) {
        for (let i = 0; i < res.picIfo[0].length; i++) {
          data_Zero.push(res.picIfo[0][i]);
          x_data.push(i);
        }

        let temp = [];
        for (let i = 1; i < Object.keys(res.picIfo).length; i++) {
          temp.push(res.picIfo[i]);
        }
        temp.push(res.picIfo[0]);
        // console.log(temp);

        dispatch({
          type: 'Zero_crossing/savedata',
          payload: {
            data: temp,
            label: temp.length - 1,
          },
        });

        // setdata(data_Zero);

        setXdata(x_data);
        // console.log(data);
        // console.log(Xdata);
      }

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
            option={getOption(
              myType,
              Data?.label === -1 ? [] : Data?.data[Data.label],
              Xdata,
              PicType,
            )}
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

const mapStateToProps = ({ Zero_crossing }) => {
  // console.log("Zero_crossing", Zero_crossing);
  return {
    Data: Zero_crossing,
  };
};

export default connect(mapStateToProps)(TestApp);
