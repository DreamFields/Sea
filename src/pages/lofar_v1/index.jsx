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
import UploadPhotos from '../../components/UploadPhotos';
const TestApp = (props) => {
  console.log(props);
  const { audio_id, audio_name, signal_type } = props;
  const [loading, setloading] = useState(false);
  let data_Lofar = [];
  let Y_data = [];
  let X_data = [];
  let minValue = 0;
  let maxValue = 0;
  const [data, setdata] = useState(data_Lofar);
  const [id, setid] = useState('0');
  const [Xdata, setXdata] = useState(X_data);
  const [Ydata, setYdata] = useState(Y_data);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
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
  const getData = () => {
    setloading(true);
    request(`/v1/feature/lofar_v1`, {
      method: 'POST',
      data: {
        sid: audio_id,
      },
    }).then((res) => {
      let temp = [];
      console.log(JSON.stringify(res));
      console.log(res.OutputData1);
      for (let i = 0; i < res.fk.length; i++) {
        for (let j = 0; j < res.y_l.length; j++) {
          temp.push(i);
          temp.push(j);
          temp.push(Math.floor(res.OutputData1[j][i] * 100) / 100);
          if (Math.round(res.OutputData1[j][i]) > maxValue) {
            maxValue = Math.round(res.OutputData1[j][i]);
          }
          if (Math.round(res.OutputData1[j][i]) < minValue) {
            minValue = Math.round(res.OutputData1[j][i]);
          }
          data_Lofar.push(temp);
          temp = [];
        }
      }
      console.log('max' + maxValue);
      setdata(data_Lofar);
      setXdata(res.fk);
      setYdata(res.y_l);
      setMin(minValue);
      setMax(maxValue);
      setloading(false);
    });
  };
  return (
    <div>
      <Card>
        <Spin spinning={loading}>
          <ReactEcharts
            option={getOption(data, Xdata, Ydata, min, max)}
            theme="dark"
            style={{ height: '400px' }}
          />
        </Spin>
        <Button onClick={getData}>低频线谱分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/frequency/${id}`} />
      </Card>
    </div>
  );
};
const mapStateToProps = ({}) => {
  return {};
};
export default connect(mapStateToProps)(TestApp);
