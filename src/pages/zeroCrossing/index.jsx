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
import { SERVICEURL } from '../../utils/const';
import html2canvas from 'html2canvas';
import b64toBlob from 'b64-to-blob';

const TestApp = (props) => {
  const { audio_id, dispatch, Data, path } = props;
  const [loading, setloading] = useState(false);

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

  const [myType, setmyType] = useState('log'); //对数还是线性
  // const [Xdata, setXdata] = useState(x_data);
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  const [id, setid] = useState('');

  useEffect(() => {
    setmyType('value');
    setPicType('line');
  }, []);

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
        console.log(res);

        // temp是每一帧纵坐标组成的数组
        let temp = [];
        // all_X_data是每一帧横坐标组成的数组
        let all_X_data = [];

        // 根据res结果初始化temp和all_X_data
        for (let i = 1, len = Object.keys(res.picIfo).length; i < len; i++) {
          temp.push(res.picIfo[i]);

          // 处理横坐标
          let xd = [];
          let gap =
            ((res.time_list[i][1] - res.time_list[i][0]) * 1000) /
            (res.picIfo[i].length - 1);

          let j = res.time_list[i][0] * 1000;
          while (true) {
            if (j < res.time_list[i][1] * 1000) {
              xd.push(Math.floor(j));
            } else {
              if (xd.length < res.picIfo[i].length) {
                xd.push(Math.floor(res.time_list[i][1] * 1000));
                break;
              } else {
                break;
              }
            }
            j += gap;
          }
          // console.log(xd.length, res.picIfo[i].length);
          all_X_data.push(xd);
        }
        temp.push(res.picIfo[0]);

        let xd = [];
        let gap =
          ((res.time_list[0][1] - res.time_list[0][0]) * 1000) /
          (res.picIfo[0].length - 1);
        let j = res.time_list[0][0] * 1000;
        while (true) {
          if (j < res.time_list[0][1] * 1000) {
            xd.push(Math.floor(j));
          } else {
            if (xd.length < res.picIfo[0].length) {
              xd.push(Math.floor(res.time_list[0][1] * 1000));
              break;
            } else {
              break;
            }
          }
          j += gap;
        }
        all_X_data.push(xd);

        dispatch({
          type: 'Zero_crossing/savedata',
          payload: {
            data: temp,
            all_x_data: all_X_data,
            label: temp.length - 1,
          },
        });
        // setXdata(x_data);

        // 这个下面到setloading之前都是动画逻辑
        //=============================================================================================>>
        let dom = document.getElementById('btnPlay');
        duration = res.time * 1000;
        interval = duration / temp.length;

        const animationController = function () {
          if (animationValue === true) {
            move = setInterval(() => {
              console.log(frame_count);
              dispatch({
                type: 'Zero_crossing/savedata',
                payload: {
                  label: frame_count,
                },
              });

              frame_count++;
              // console.log(temp);
              if (frame_count >= temp.length) {
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
              type: 'Zero_crossing/savedata',
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

      dispatch({
        type: 'basicSoundData/setdata',
        payload: {
          calc: res?.calc.toPrecision(3),
          mean: res?.mean.toPrecision(3),
          va: res?.var.toPrecision(3),
        },
      });
    });
  };

  const getScreenshot = () => {
    html2canvas(document.querySelector('#capture'), {
      // 转换为图片
      useCORS: true, // 解决资源跨域问题
    }).then((canvas) => {
      // imgUrl 是图片的 base64格式 代码 png 格式
      let imgUrl = canvas.toDataURL('image/png');
      //下面是 下载图片的功能。 不需要不加 注意加 .png
      const str = imgUrl.replace(/data:image\/png;base64,/, '');
      const file = b64toBlob(str, 'image/png');
      const clipboardItemInput = new window.ClipboardItem({
        'image/png': file,
      });
      window.navigator.clipboard.write([clipboardItemInput]);
    });
  };

  useEffect(() => {
    if (audio_id) {
      getData();
    }
  }, [audio_id]);

  return (
    <div>
      <Card>
        <div id="capture">
          <Spin spinning={loading}>
            <ReactEcharts
              option={getOption(
                myType,
                Data?.data[Data.label],
                Data?.all_x_data[Data.label],
                PicType,
              )}
              theme="dark"
              style={{ height: '400px' }}
            />
          </Spin>
        </div>
        <Button onClick={getData}>过零率分析</Button>
        <Button onClick={getScreenshot}>复制截图</Button>
        <UploadPhotos url={`${SERVICEURL}/v1/ffile/power/${id}`} />
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
