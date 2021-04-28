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
  console.log(props);
  const { audio_id, audio_name } = props;
  const [loading, setloading] = useState(false);
  let data_Mel = [];
  let Y_data = [];
  let X_data = [];
  const [data, setdata] = useState(data_Mel);
  const [id, setid] = useState('0');
  const [Xdata, setXdata] = useState(X_data);
  const [Ydata, setYdata] = useState(Y_data);
  const getOption = (data, Xdata, Ydata) => {
    let option = {
      darkMode: true,
      title: {
        text: '特征提取',
        subtext: '语谱图',
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
        min: -80,
        max: 0,
        calculable: true,
        orient: 'horizontal',
        inRange: {
          color: ['#080707', '#261379', '#9708a4', '#c94f2d', '#eaea5e'],
        },
        realtime: false,
        left: 'center',
        bottom: '5%',
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
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
          name: 'Mel_Spectrogram',
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
  const handleBrushSelected = (params) => {
    console.log(params);
    var brushComponent = params.batch[0];
    var sum = 0; // 统计选中项的数据值的和
    for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
      // 对于每个 series：
      var dataIndices = brushComponent.selected[sIdx].dataIndex;
      for (var i = 0; i < dataIndices.length; i++) {
        var dataIndex = dataIndices[i];
        sum += data[sIdx][dataIndex];
      }
    }
    console.log(sum); // 用某种方式输出统计值。
  };
  const getData = () => {
    setloading(true);
    request(`/v1/feature/Mel_Spectrogram`, {
      method: 'POST',
      data: { file_id: audio_id },
    }).then((res) => {
      console.log('success');
      let cur = [];
      let obj = JSON.parse(res?.picIfo.picIfo);
      let time = res?.picIfo.time;
      let id = res?.id;
      setid(id);
      console.log('obj: ' + obj[0]);
      for (let i = 0; i < 128; i++) {
        cur.push(obj[i]);
      }
      console.log(cur);
      let xdataL = cur[0].length;
      let ydataL = cur.length;
      console.log('xdataL:' + xdataL);
      console.log('ydataL:' + ydataL);
      let xgap = Math.floor((time * 100) / xdataL) / 100;
      let ygap = Math.floor((8000 * 100) / ydataL) / 100;
      let arr = [];
      for (let i = 0; i < ydataL; i++) {
        for (let j = 0; j < xdataL; j++) {
          arr.push(j);
          arr.push(i);
          arr.push(cur[i][j]);
          data_Mel.push(arr);
          arr = [];
        }
      }
      console.log(data_Mel);
      data_Mel = data_Mel.map(function (item) {
        return [
          item[0],
          item[1],
          item[2] === -80 ? item[2] + 0.1 : Math.floor(item[2] * 1000) / 1000,
        ];
      });
      let x = xgap;
      let y = ygap;
      for (let i = 0; i < xdataL; i++) {
        X_data.push(x);
        x = Math.floor((x + xgap) * 100) / 100;
      }
      for (let i = 0; i < ydataL; i++) {
        Y_data.push(y);
        y += ygap;
      }
      setdata(data_Mel);
      setXdata(X_data);
      setYdata(Y_data);
      console.log('data:' + data);
      console.log('Xdata:' + Xdata);
      console.log('Ydata:' + Ydata);
      setloading(false);
    });
  };
  return (
    <div>
      <Card title="折线图表之一">
        <Spin spinning={loading}>
          <ReactEcharts
            option={getOption(data, Xdata, Ydata)}
            theme="dark"
            style={{ height: '400px' }}
            onEvents={{
              brushselected: handleBrushSelected,
            }}
          />
        </Spin>
        <Button onClick={getData}>语谱谱分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/frequency/${id}`} />
      </Card>
    </div>
  );
};
const mapStateToProps = ({}) => {
  return {};
};
export default connect(mapStateToProps)(TestApp);
