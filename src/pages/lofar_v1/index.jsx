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
  const getData = () => {
    setloading(true);
    request(`/v1/feature/lofar_v1`, {
      method: 'POST',
      data: {
        sid: audio_id,
      },
    }).then((res) => {
      console.log('低频线谱： ' + JSON.stringify(res));
      console.log(res?.data.t);
      console.log(res?.data.f);
      console.log(res?.data.lof_n);
      setXdata(res?.data.t);
      setYdata(res?.data.f);
    });
  };
  return (
    <div>
      <Card title="图表之一">
        <Spin spinning={loading}>
          <ReactEcharts
            option={getOption(data, Xdata, Ydata)}
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
