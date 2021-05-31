import React, { useState } from 'react';
import {
  Button,
  notification,
  Radio,
  Input,
  Space,
  Table,
  message,
} from 'antd';
import { Card, Spin, Popover } from 'antd';
import { connect } from 'umi';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import request from '@/utils/request';
import LofarTable from './table';
import UploadPhotos from '../../components/UploadPhotos';
const TestApp = (props) => {
  // 播放控制
  let animationValue = false;
  // 播放到的帧数
  let frame_count = -1;
  // 计时器id
  let move;
  // 帧间隔时间，以ms为单位
  let interval = 1000;
  // 音频总时长
  let duration;

  console.log(props);
  const { audio_id, audio_name, signal_type, dispatch, Data } = props;
  const [loading, setloading] = useState(false);
  let data_Lofar = [];
  let Y_data = [];
  let X_data = [];
  let minValue = 0;
  let maxValue = 0;
  const [id, setid] = useState('0');
  /*
  const [data, setdata] = useState(data_Lofar);
  const [Xdata, setXdata] = useState(X_data);
  const [Ydata, setYdata] = useState(Y_data);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  */

  const getOption = (data, Xdata, Ydata, Min, Max) => {
    let option = {
      darkMode: true,
      title: {
        text: '特征提取',
        subtext: '低频线谱',
      },
      grid: {
        height: '70%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        data: Xdata,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: Ydata,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: Min,
        max: Max,
        calculable: true,
        orient: 'horizontal',
        inRange: {
          color: ['#280128', '#2306a2', '#07cf39', '#96cd17', '#fada74'],
        },
        realtime: false,
        left: 'center',
        bottom: '5%',
      },
      dataZoom: [
        {
          type: 'inside',
          //实现横纵坐标缩放，折线图不设置默认只缩放x轴
          xAxisIndex: [0],
          yAxisIndex: [0],
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      brush: {
        toolbox: ['rect', 'polygon', 'keep', 'clear'],
        xAxisIndex: 0,
      },
      toolbox: {
        left: 'center',
        feature: {
          dataZoom: {},
          saveAsImage: {
            pixelRatio: 5,
          },
          restore: {},
        },
      },
      series: [
        {
          name: 'Lofar_V1',
          type: 'heatmap',
          data: data,
          emphasis: {
            itemStyle: {
              borderColor: '#333',
              borderWidth: 1,
            },
          },
          progressive: 1000,
          animation: false,
        },
      ],
    };
    return option;
  };
  const handleChartClick = (params) => {
    console.log(params);
    let copy_data;
    dispatch({
      type: 'lofarTable/setdata',
      payload: {},
      callback: (state) => {
        copy_data = state.tabledata.slice();
        if (copy_data.length === 0) {
          copy_data.push({
            fk: Data.all_x_data[Data.label][params.value[0]],
            y_l: Data.all_y_data[Data.label][params.value[1]],
            outdata: params.value[2],
            count: 1,
          });
        } else {
          let label = true;
          for (let i = 0; i < copy_data.length; i++) {
            if (
              copy_data[i].fk === Data.all_x_data[Data.label][params.value[0]]
            )
              label = false;
          }
          if (label) {
            let curcount = copy_data[copy_data.length - 1].count;
            copy_data.push({
              fk: Data.all_x_data[Data.label][params.value[0]],
              y_l: Data.all_y_data[Data.label][params.value[1]],
              outdata: params.value[2],
              count: curcount + 1,
            });
            for (let i = 0; i < copy_data.length; i++) {
              copy_data[i].count = curcount + 1;
            }
          }
        }
        return { tabledata: copy_data };
      },
    });
  };

  const getData = () => {
    setloading(true);
    request(`/v1/feature/lofar_v1`, {
      method: 'POST',
      data: {
        sid: audio_id,
      },
    }).then((res) => {
      if (res) {
        let temp = [];
        let dataAll = []; //所有时间的数据集合
        let maxAll = []; //所有时间的最大值集合
        let minAll = []; //所有数据的最小值集合

        for (let z = 1; z < res.fk.length; z++) {
          for (let i = 0; i < res.fk[z].length; i++) {
            for (let j = 0; j < res.y_l[z].length; j++) {
              temp.push(i);
              temp.push(j);
              temp.push(Math.floor(res.OutputData1[z][j][i] * 100) / 100);
              if (Math.round(res.OutputData1[z][j][i]) > maxValue) {
                maxValue = Math.round(res.OutputData1[z][j][i]);
              }
              if (Math.round(res.OutputData1[z][j][i]) < minValue) {
                minValue = Math.round(res.OutputData1[z][j][i]);
              }
              data_Lofar.push(temp);
              temp = [];
            }
          }
          dataAll.push(data_Lofar);
          maxAll.push(maxValue);
          minAll.push(minValue);
          data_Lofar = [];
          minValue = 0;
          maxValue = 0;
        }
        for (let i = 0; i < res.fk[0].length; i++) {
          for (let j = 0; j < res.y_l[0].length; j++) {
            temp.push(i);
            temp.push(j);
            temp.push(Math.floor(res.OutputData1[0][j][i] * 100) / 100);
            if (Math.round(res.OutputData1[0][j][i]) > maxValue) {
              maxValue = Math.round(res.OutputData1[0][j][i]);
            }
            if (Math.round(res.OutputData1[0][j][i]) < minValue) {
              minValue = Math.round(res.OutputData1[0][j][i]);
            }
            data_Lofar.push(temp);
            temp = [];
          }
        }
        dataAll.push(data_Lofar);
        maxAll.push(maxValue);
        minAll.push(minValue);
        for (let i = 1; i < res.fk.length; i++) {
          X_data.push(res.fk[i]);
        }
        X_data.push(res.fk[0]);
        for (let i = 1; i < res.y_l.length; i++) {
          Y_data.push(res.y_l[i]);
        }
        Y_data.push(res.y_l[0]);
        dispatch({
          type: 'lofar_v1/savedata',
          payload: {
            data: dataAll,
            all_x_data: X_data,
            all_y_data: Y_data,
            all_max_value: maxAll,
            all_min_value: minAll,
            label: dataAll.length - 1,
          },
        });
        // 这个下面到setloading之前都是动画逻辑
        //=============================================================================================>>
        let dom = document.getElementById('btnPlay');
        duration = res.time * 1000;
        interval = duration / dataAll.length;

        const animationController = function () {
          if (animationValue === true) {
            move = setInterval(() => {
              console.log(frame_count);
              dispatch({
                type: 'lofar_v1/savedata',
                payload: {
                  label: frame_count,
                },
              });

              frame_count++;
              // console.log(temp);
              if (frame_count >= dataAll.length) {
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
              type: 'lofar/savedata',
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

        //=============================================================================================>>
        /*
        console.log('max' + maxValue);
          setdata(data_Lofar);
          setXdata(res.fk[0]);
          setYdata(res.y_l[0]);
          setMin(minValue);
          setMax(maxValue);
         */
        setloading(false);
      }
    });
  };
  return (
    <div>
      <Card>
        <Spin spinning={loading}>
          <ReactEcharts
            onEvents={{
              click: handleChartClick,
            }}
            option={getOption(
              Data?.label === -2 || Data?.label === -1
                ? []
                : Data?.data[Data.label],
              Data?.label === -2 || Data?.label === -1
                ? []
                : Data?.all_x_data[Data.label],
              Data?.label === -2 || Data?.label === -1
                ? []
                : Data?.all_y_data[Data.label],
              Data?.label === -2 || Data?.label === -1
                ? 0
                : Data?.all_min_value[Data.label],
              Data?.label === -2 || Data?.label === -1
                ? 0
                : Data?.all_max_value[Data.label],
            )}
            theme="dark"
            style={{ height: '400px' }}
          />
        </Spin>
        <Button onClick={getData}>低频线谱分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/frequency/${id}`} />
      </Card>
      <LofarTable />
    </div>
  );
};
const mapStateToProps = ({ lofar_v1 }) => {
  return {
    Data: lofar_v1,
  };
};
export default connect(mapStateToProps)(TestApp);
