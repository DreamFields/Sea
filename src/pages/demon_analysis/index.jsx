import React, { useState, useEffect, useRef } from 'react';
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

  // 播放控制
  let animationValue = false;
  // 播放到的帧数
  let frame_count = -1;
  // 计时器id
  let move;
  // 音频总时长，以ms为单位
  let duration = 0;
  // 帧间隔时间，以ms为单位
  let interval = 0;

  const [myType, setmyType] = useState('log'); //对数还是线性
  const [id, setid] = useState('');
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图

  //获取原生echart对象
  let echartRef;
  let echartInstance;
  //用highlight列表来控制点点状态
  let highlightArr = [];
  // useEffect(() => {
  // 获取音频时长
  // if (path) {
  //   let audioElement = new Audio(path);
  //   audioElement.addEventListener('loadedmetadata', function (_event) {
  //     duration = audioElement.duration * 1000;
  //     // console.log('视频的时长为(ms):', duration);
  //   });
  // }
  // }, []);

  useEffect(() => {
    setmyType('value');
    setPicType('line');
  }, []);

  const getOption = (Type, data1, Xdata, Type2) => {
    let option = {
      legend: {},
      title: {
        text: '特征提取',
        subtext: '调制谱',
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
          data: data1,
          type: Type2,
          color: 'skyblue',
          //实现点击样式变化
          select: {
            itemStyle: {},
          },
        },
      ],
    };
    return option;
  };

  const handleChartClick = (params) => {
    console.log(params);
    echartInstance = echartRef.getEchartsInstance();
    console.log(echartInstance);
    echartInstance.dispatchAction({
      type: 'select',
      // 数据项的 index，如果不指定也可以通过 name 属性根据名称指定数据项
      dataIndex: params.dataIndex,
    });

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
      if (res) {
        console.log('res', res);

        let id = res?.id;
        setid(id);
        let ydata = [];
        let xdata = [];
        for (let i = 1, len = res.FreqV.length; i < len; i++) {
          xdata.push(res.FreqV[i]);
          ydata.push(res.outputData_2[i]);
        }
        xdata.push(res.FreqV[0]);
        ydata.push(res.outputData_2[0]);
        dispatch({
          type: 'data_demon/savedata',
          payload: {
            xdata: xdata,
            ydata: ydata,
            label: res.FreqV.length - 1,
          },
        });

        //=============================================================================================>>
        let dom = document.getElementById('btnPlay');
        duration = res.time * 1000;
        interval = duration / ydata.length;

        const animationController = function () {
          if (animationValue === true) {
            move = setInterval(() => {
              console.log(frame_count);
              dispatch({
                type: 'data_demon/savedata',
                payload: {
                  label: frame_count,
                },
              });

              frame_count++;
              // console.log(ydata);
              if (frame_count >= ydata.length) {
                clearInterval(move);
                frame_count = -1;
                animationValue = false;
              }
            }, interval);
          } else {
            clearInterval(move);
          }
        };

        dom.addEventListener('click', () => {
          if (animationValue) {
            animationValue = false;
          } else {
            animationValue = true;
          }
          // 这里要如果frame_count是-1，直接dispatch而不是使用setInterval。
          if (frame_count === -1) {
            dispatch({
              type: 'data_demon/savedata',
              payload: {
                label: frame_count,
              },
            });
            frame_count++;
            animationController();
          } else {
            animationController();
          }
        });
      }
      //=============================================================================================>>

      setloading(false);
    });
  };

  return (
    <div>
      <Card>
        <Spin spinning={loading}>
          <ReactEcharts
            ref={(e) => {
              echartRef = e;
            }}
            option={getOption(
              myType,
              Data.ydata[Data.label],
              Data.xdata[Data.label],
              PicType,
            )}
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
  // console.log(data_demon);
  return {
    Data: data_demon,
  };
};

export default connect(mapStateToProps)(TestApp);
