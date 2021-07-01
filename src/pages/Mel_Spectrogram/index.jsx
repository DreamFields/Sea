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
import { Card, Spin, Popover, Checkbox, Row, Col } from 'antd';
import { connect } from 'umi';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import request from '@/utils/request';
import UploadPhotos from '../../components/UploadPhotos';
import MelTable from './table';
const TestApp = (props) => {
  console.log(props);
  const { audio_id, audio_name, signal_type, dispatch } = props;
  const [loading, setloading] = useState(false);
  let data_Mel = [];
  let Y_data = [];
  let X_data = [];
  let person_xdata = [];
  let persondata = [];
  let fMax = -10000;
  let Min = 10000;
  let Max = -10000;
  const [data, setdata] = useState(data_Mel);
  const [Xdata, setXdata] = useState(X_data);
  const [Ydata, setYdata] = useState(Y_data);
  const [time1, settime1] = useState(undefined);
  const [personXdata, setpersonXdata] = useState([]);
  const [personData, setpersonData] = useState([]);
  const [resolution, setResolution] = useState(25); //分辨率
  const [fmax, setFmax] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  let xleft, xright, yleft, yright;
  const [id, setid] = useState(undefined);
  const InputTip2 = (
    <div>
      分辨率需要手动输入
      <br />
      <b style={{ color: 'cyan' }}>额外提示</b>
      <br />
      输入之后重新点击语谱图分析即可加载新的图表
      <br />
      分辨率要求输入纯数字,例如:25
      <br />
      分辨率的范围为0～50，默认值为25
    </div>
  );
  const getOption = (data, Xdata, Ydata, Min, Max) => {
    let option = {
      darkMode: true,
      title: {
        text: '特征提取',
        subtext: '时频图',
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
          color: ['#080707', '#261379', '#9708a4', '#c94f2d', '#eaea5e'],
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
  const getOption2 = (data, Xdata) => {
    let option = {
      title: {
        text: 'person相关系数',
      },
      xAxis: {
        type: 'category',
        data: Xdata,
      },
      yAxis: {
        type: 'value',
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
          data: data,
          type: 'line',
          color: 'skyblue',
        },
      ],
    };
    return option;
  };
  const handleClick = (params) => {
    let copy_data;
    dispatch({
      type: 'MelTable/setdata',
      payload: {},
      callback: (state) => {
        if (signal_type === 2) {
          copy_data = state.tabledata1.slice();
          copy_data[0].frequency = Ydata[params.data[1]];
          return { tabledata1: copy_data };
        } else if (signal_type === 3) {
          copy_data = state.tabledata2.slice();
          copy_data[0].frequency = Ydata[params.data[1]];
          return { tabledata2: copy_data };
        } else {
          copy_data = state.tabledata1.slice();
          return { tabledata1: copy_data };
        }
      },
    });
  };

  const handleBrushSelected = (params) => {
    if (params.batch[0].areas.length > 0) {
      xleft = params.batch[0].areas[0].range[0][0];
      xright = params.batch[0].areas[0].range[0][1];
      yleft = params.batch[0].areas[0].range[1][0];
      yright = params.batch[0].areas[0].range[1][1];
    }
  };
  const calculate = () => {
    let Xdistance = xright - xleft;
    let Ydistance = yright - yleft;
    let copy_data;
    dispatch({
      type: 'MelTable/setdata',
      payload: {},
      callback: (state) => {
        if (signal_type === 2) {
          copy_data = state.tabledata1.slice();
          copy_data[0].echo_length =
            Math.floor((Xdistance / 667.9) * time1 * 100) / 100; //667.9是画布的像素宽度
          copy_data[0].echo_width =
            Math.floor((Ydistance / 305) * fmax * 100) / 100; //305是画布的像素高度
          return { tabledata1: copy_data };
        }
        if (signal_type === 3) {
          copy_data = state.tabledata2.slice();
          copy_data[0].pulse_cycle =
            Math.floor((Xdistance / 667.9) * time1 * 100) / 100;
          copy_data[0].pulse_width =
            Math.floor((Ydistance / 305) * fmax * 100) / 100;
          return { tabledata2: copy_data };
        }
      },
    });
  };

  const getData = () => {
    setloading(true);
    request('/v1/feature/Mel_Spectrogram', {
      method: 'POST',
      data: {
        file_id: audio_id,
        resolution: resolution,
      },
    }).then((res) => {
      setid(res.ms_id);
      settime1(res.time);
      let temp = [];
      let data = JSON.parse(res.picIfo);
      for (let i = 0; i < res.t.length; i++) {
        for (let j = 0; j < res.f.length; j++) {
          if (data[j][i] > Max) Max = data[j][i];
          if (data[j][i] < Min) Min = data[j][i];
          temp.push(i);
          temp.push(j);
          temp.push(data[j][i]);
          data_Mel.push(temp);
          temp = [];
        }
      }
      for (let i = 0; i < res.f.length; i++) {
        console.log(res.f[i]);
        if (fMax < parseInt(res.f[i])) fMax = parseInt(res.f[i]);
      }
      setFmax(fMax);
      setMax(Max);
      setMin(Min);
      setdata(data_Mel);
      setXdata(res.t.map((e) => Math.floor(e * 100) / 100));
      setYdata(res.f.map(Math.round));
      let data2 = JSON.parse(res.person);
      let data3 = Object.keys(data2);
      for (let i = 0; i < data3.length; i++) {
        person_xdata.push(data3[i]);
        persondata.push(data2[i]);
      }
      setpersonData(persondata);
      setpersonXdata(person_xdata);
      setloading(false);

      dispatch({
        type: 'basicSoundData/setdata',
        payload: {
          sc: res?.spectral_centroid.toPrecision(4),
          scw: res?.spectral_centroid_width.toPrecision(4),
          sa: res?.spectral_area.toPrecision(4),
          ss: res?.spectral_slope.toPrecision(4),
          sd: res?.spectral_decline.toPrecision(4),
          si: res?.spectral_Irregularity.toPrecision(4),
          su: res?.spectral_Uneven.toPrecision(4),
          se: res?.spectral_entropy.toPrecision(4),
        },
      });
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
            onEvents={{
              brushselected: handleBrushSelected,
              brushEnd: calculate,
              click: handleClick,
            }}
          />
        </Spin>
        <Button onClick={getData}>时频图分析</Button>
        <Popover title="提示" content={InputTip2}>
          <Input
            placeholder="请输入分辨率"
            onChange={(e) => {
              setResolution(parseInt(e.target.value));
            }}
            maxLength={25}
            style={{ width: 120 }}
          />
        </Popover>
        <UploadPhotos url={`https://10.0.70.89/v1/ffile/frequency/${id}`} />
      </Card>
      <div
        style={{
          display: signal_type === 2 || signal_type === 3 ? 'block' : 'none',
        }}
      >
        <MelTable signal_type={signal_type} id={id} />
      </div>
      <div
        style={{
          display: signal_type === 2 ? 'block' : 'none',
        }}
      >
        <div>
          <Card>
            <Spin spinning={loading}>
              <ReactEcharts
                option={getOption2(personData, personXdata)}
                theme="dark"
                style={{ height: '400px' }}
              />
            </Spin>
          </Card>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({}) => {
  return {};
};
export default connect(mapStateToProps)(TestApp);
