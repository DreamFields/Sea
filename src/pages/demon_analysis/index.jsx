import React, { useState, useEffect, useRef } from 'react';
import { Button, notification } from 'antd';
import { Card, Spin, Popover, message } from 'antd';
import { connect } from 'umi';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import request from '@/utils/request';
import DemonTable from './table';
import DemonForm from '../demon_analysis2/index';
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
  //控制点击事件的开启
  let clickController = false;
  //自动计算所需参数
  let maxDB = 0;
  let maxF = 0;
  let maxFnum = 0;

  const [MaxDB, setMaxDB] = useState(maxDB);
  const [MaxF, setMaxF] = useState(maxF);
  const [MaxFnum, setMaxFnum] = useState(maxFnum);

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
  const getIndex = (value, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] * 10 === value) {
        return i;
      }
    }
    return -1;
  };
  const handleChartClick = (params) => {
    if (clickController) {
      console.log(params);
      echartInstance = echartRef.getEchartsInstance();
      console.log(echartInstance);
      echartInstance.dispatchAction({
        type: 'select',
        // 数据项的 index，如果不指定也可以通过 name 属性根据名称指定数据项
        dataIndex: params.dataIndex,
      });

      let copy_data;
      dispatch({
        type: 'demonTable/setdata',
        payload: {},
        callback: (state) => {
          // copy_data = state.tabledata.slice();
          copy_data = [];
          for (let i = 0; i < 8; i++)
            copy_data.push({
              hz: params.dataIndex * (i + 1),
              db: params.value.toPrecision(3),
              rpm: params.dataIndex * 60 * (i + 1),
            });
          return { tabledata: copy_data };
        },
      });
      //叶片数
      let label = 0;
      //转速
      let rpm = params.dataIndex * 60;
      //轴数 暂时无算法

      let db1 = params.value;
      let db2 =
        Data.ydata[Data.label][
          getIndex(params.dataIndex * 2, Data.xdata[Data.label])
        ];
      let db3 =
        Data.ydata[Data.label][
          getIndex(params.dataIndex * 3, Data.xdata[Data.label])
        ];
      let db4 =
        Data.ydata[Data.label][
          getIndex(params.dataIndex * 4, Data.xdata[Data.label])
        ];
      let db5 =
        Data.ydata[Data.label][
          getIndex(params.dataIndex * 5, Data.xdata[Data.label])
        ];
      let db6 =
        Data.ydata[Data.label][
          getIndex(params.dataIndex * 6, Data.xdata[Data.label])
        ];
      let db7 =
        Data.ydata[Data.label][
          getIndex(params.dataIndex * 7, Data.xdata[Data.label])
        ];
      let db8 =
        Data.ydata[Data.label][
          getIndex(params.dataIndex * 8, Data.xdata[Data.label])
        ];
      let dbData = [];
      dbData.push(db1);
      dbData.push(db2);
      dbData.push(db3);
      dbData.push(db4);
      dbData.push(db5);
      dbData.push(db6);
      dbData.push(db7);
      dbData.push(db8);
      console.log(dbData);
      console.log(params.dataIndex);
      console.log(params.dataIndex * 2);
      console.log(getIndex(params.dataIndex * 2, Data.xdata[Data.label]));
      console.log(Data.ydata[Data.label]);
      console.log(Data.xdata[Data.label]);
      let bigger = (n, arr) => {
        let label = true;
        for (let i = n - 1; i < arr.length; i++) {
          if (arr[n] < arr[i]) label = false;
        }
        return label;
      };
      if (bigger(3, dbData)) {
        if (db1 > db2 && db2 > db4 && db4 > db5 && db5 > db7 && db7 > db8)
          label = 3;
      }
      if (bigger(4, dbData)) {
        if (db1 > db3 && db3 > db5 && db5 > db7 && db2 > db6) label = 4;
      }
      if (bigger(5, dbData)) {
        if (db2 > db3 && db3 > db7 && db7 > db8 && db1 > db4 && db4 > db6)
          label = 5;
      }
      if (bigger(6, dbData)) {
        if (db1 > db5 && db5 > db7 && db2 > db4 && db4 > db8) label = 6;
      }
      if (db1 > db6 && db6 > db8 && db2 > db5 && db3 > db4 && db7 > db8) {
        label = 7;
      }
      if (label === 0) {
        message.error('无法计算叶片数，请选择正确的基频');
      }

      dispatch({
        type: 'basicSoundData/setdata',
        payload: {
          db: params.value.toPrecision(3),
          hz: params.dataIndex,
          label: label,
          rpm: rpm,
        },
      });
    }
  };
  const autoExtract = () => {
    console.log('maxDB' + maxDB);
    console.log('maxF' + maxF);
    console.log('MaxDB' + MaxDB);
    console.log('MaxF' + MaxF);
    let copy_data;
    dispatch({
      type: 'demonTable/setdata',
      payload: {},
      callback: (state) => {
        // copy_data = state.tabledata.slice();
        copy_data = [];
        for (let i = 0; i < 8; i++)
          copy_data.push({
            hz: Math.floor(MaxF * (i + 1) * 10),
            db: MaxDB.toPrecision(3),
          });
        return { tabledata: copy_data };
      },
    });
    //叶片数
    let label = 0;
    //转速
    let rpm = MaxF * 600;
    //轴数 暂时无算法

    let db1 = MaxDB;
    let db2 =
      Data.ydata[Data.label][getIndex(MaxFnum * 2, Data.xdata[Data.label])];
    let db3 =
      Data.ydata[Data.label][getIndex(MaxFnum * 3, Data.xdata[Data.label])];
    let db4 =
      Data.ydata[Data.label][getIndex(MaxFnum * 4, Data.xdata[Data.label])];
    let db5 =
      Data.ydata[Data.label][getIndex(MaxFnum * 5, Data.xdata[Data.label])];
    let db6 =
      Data.ydata[Data.label][getIndex(MaxFnum * 6, Data.xdata[Data.label])];
    let db7 =
      Data.ydata[Data.label][getIndex(MaxFnum * 7, Data.xdata[Data.label])];
    let db8 =
      Data.ydata[Data.label][getIndex(MaxFnum * 8, Data.xdata[Data.label])];
    let dbData = [];
    dbData.push(db1);
    dbData.push(db2);
    dbData.push(db3);
    dbData.push(db4);
    dbData.push(db5);
    dbData.push(db6);
    dbData.push(db7);
    dbData.push(db8);
    console.log(dbData);
    let bigger = (n, arr) => {
      let label = true;
      for (let i = n - 1; i < arr.length; i++) {
        if (arr[n] < arr[i]) label = false;
      }
      return label;
    };
    if (bigger(3, dbData)) {
      if (db1 > db2 && db2 > db4 && db4 > db5 && db5 > db7 && db7 > db8)
        label = 3;
    }
    if (bigger(4, dbData)) {
      if (db1 > db3 && db3 > db5 && db5 > db7 && db2 > db6) label = 4;
    }
    if (bigger(5, dbData)) {
      if (db2 > db3 && db3 > db7 && db7 > db8 && db1 > db4 && db4 > db6)
        label = 5;
    }
    if (bigger(6, dbData)) {
      if (db1 > db5 && db5 > db7 && db2 > db4 && db4 > db8) label = 6;
    }
    if (db1 > db6 && db6 > db8 && db2 > db5 && db3 > db4 && db7 > db8) {
      label = 7;
    }
    if (label === 0) {
      message.error('无法计算叶片数，请检查是否加载正确数据');
    }

    dispatch({
      type: 'basicSoundData/setdata',
      payload: {
        db: MaxDB.toPrecision(3),
        hz: MaxF,
        label: label,
        rpm: rpm,
      },
    });
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
        for (let i = 0; i < res.FreqV[0].length; i++) {
          if (res.outputData_2[0][maxFnum] < res.outputData_2[0][i]) {
            maxFnum = i;
          }
        }
        maxDB = res.outputData_2[0][maxFnum];
        maxF = res.FreqV[0][maxFnum];
        setMaxFnum(maxFnum);
        console.log('maxF' + maxF);
        console.log('maxDB' + maxDB);
        setMaxDB(maxDB);
        setMaxF(maxF);
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
        <Button
          onClick={() => {
            clickController = false;
            autoExtract();
          }}
        >
          自动提取
        </Button>
        <Button
          onClick={() => {
            clickController = true;
          }}
        >
          手动提取
        </Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/demon/${id}`} />
      </Card>
      <DemonTable />
      <DemonForm audio_id={audio_id} />
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
