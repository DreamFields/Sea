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
  let person_xdata = [];
  let persondata = [];
  let fMax = -10000;
  let Min = 10000;
  let Max = -10000;
  const [data, setdata] = useState(data_Mel);
  const [id, setid] = useState('0');
  const [Xdata, setXdata] = useState(X_data);
  const [Ydata, setYdata] = useState(Y_data);
  const [echo_length, setecho_length] = useState(undefined); //回波长度
  const [echo_width, setecho_width] = useState(undefined); //回波宽度
  const [person_coefficient, setperson_coefficient] = useState([]); //Person帧相关系数
  const [signal_type2, setsignal_type2] = useState('CW'); //信号形式
  const [center_frequency, setcenter_frequency] = useState(undefined); //中心频率
  const [pulse_cycle, setpulse_cycle] = useState(undefined); //脉冲周期
  const [pulse_width, setpulse_width] = useState(undefined); //脉冲宽度
  const [time1, settime1] = useState(undefined);
  const [personXdata, setpersonXdata] = useState([]);
  const [personData, setpersonData] = useState([]);
  const [objlength, setlength] = useState(128);
  const [resolution, setResolution] = useState(25); //分辨率
  const [fmax, setFmax] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  let xleft, xright, yleft, yright;
  let person = [];
  const uploadTip = (
    <div>
      点击提交按钮即可提交表格中的信息
      <br />
      <b style={{ color: 'cyan' }}>额外提示</b>
      <br />
      中心频率需要手动输入
      <br />
      信号形式需要手动选择
      <br />
      其他信息在图中框选即可自动计算
    </div>
  );
  const InputTip = (
    <div>
      中心频率需要手动输入
      <br />
      <b style={{ color: 'cyan' }}>额外提示</b>
      <br />
      点击提交即可将输入框中内容提交
      <br />
      中心频率要求输入纯数字,例如:1000
      <br />
      如果输入其他字符就会提交失败,错误示例:1000Hz
    </div>
  );
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
          type: 'line',
          color: 'skyblue',
        },
      ],
    };
    return option;
  };
  //回波的样式
  const columns1 = [
    {
      title: '中心频率',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (text) => (
        <Popover title="提示" content={InputTip}>
          <Input
            placeholder="frequency"
            onChange={(e) => {
              setcenter_frequency(e.target.value);
            }}
          />
        </Popover>
      ),
    },
    {
      title: '回波宽带',
      dataIndex: 'echo_width',
      key: 'echo_width',
    },
    {
      title: '回波长波',
      dataIndex: 'echo_length',
      key: 'echo_length',
    },
    {
      render: () => (
        <Popover title="提示" content={uploadTip}>
          <Button onClick={dispatchEcho}>提交</Button>
        </Popover>
      ),
    },
  ];
  const data1 = [
    {
      key: '1',
      frequency: center_frequency,
      echo_width: echo_width,
      echo_length: echo_length,
    },
  ];
  //主动脉冲展示
  const columns2 = [
    {
      title: '中心频率',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (text) => (
        <Popover title="提示" content={InputTip}>
          <Input
            placeholder="frequency"
            onChange={(e) => {
              setcenter_frequency(e.target.value);
            }}
          />
        </Popover>
      ),
    },
    {
      title: '信号形式',
      dataIndex: 'signal_type',
      key: 'signal_type',
      render: (text) => (
        <Radio.Group onChange={onChange} value={signal_type2}>
          <Space direction="vertical">
            <Radio value={'CW'}>CW</Radio>
            <Radio value={'LFM'}>LFM</Radio>
            <Radio value={'HFM'}>HFM</Radio>
            <Radio value={'CW+LFM'}>CW+LFM</Radio>
            <Radio value={'CW+HFM'}>CW+HFM</Radio>
            <Radio value={6}>
              More...
              {signal_type2 === 6 ? (
                <Input style={{ width: 100, marginLeft: 10 }} />
              ) : null}
            </Radio>
          </Space>
        </Radio.Group>
      ),
    },
    {
      title: '脉冲宽度',
      dataIndex: 'pulse_width',
      key: 'pulse_width',
    },
    {
      title: '脉冲周期',
      dataIndex: 'pulse_cycle',
      key: 'pulse_cycle',
    },
    {
      render: () => (
        <Popover title="提示" content={uploadTip}>
          <Button onClick={dispatchEcho}>提交</Button>
        </Popover>
      ),
    },
  ];
  const data2 = [
    {
      key: '1',
      center_frequency: center_frequency,
      signal_type: signal_type2,
      pulse_cycle: pulse_cycle,
      pulse_width: pulse_width,
    },
  ];
  //相关系数的展示
  const columns3 = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Person_coefficient',
      dataIndex: 'person_coefficient',
      key: 'person_coefficient',
    },
  ];
  let data3 = [];
  //信号选择框变化
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setsignal_type2(e.target.value);
    console.log(signal_type2);
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
    console.log(Xdistance);
    console.log(Ydistance);
    console.log(center_frequency);
    console.log(signal_type2),
      setecho_length(Math.floor((Xdistance / 667.9) * time1 * 100) / 100); //667.9是画布的像素宽度
    setecho_width(Math.floor((Ydistance / 305) * fmax * 100) / 100); //305是画布的像素高度
    setpulse_cycle(Math.floor((fmax / objlength) * 100) / 100);
    setpulse_width(Math.floor((Xdistance / 666.9) * time1 * 100) / 100);
  };
  const dispatchEcho = () => {
    request(`/v1/ffile/frequency/${id}`, {
      method: 'PUT',
      data: {
        echo_length: echo_length,
        echo_width: echo_width,
        person_coefficient: person_coefficient,
        signal_type: signal_type2,
        center_frequency: center_frequency,
        pulse_cycle: pulse_cycle,
        pusle_width: pulse_width,
      },
    }).then((res) => {
      if (res === true) {
        message.success('提交成功！');
      } else if (res === null) {
        message.error('提交失败，请检查图片是否加载成功！');
      } else {
        console.log(res.code);
      }
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
        if (fMax < res.f[i]) fMax = res.f[i];
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

      // 操作dom更改语谱图相关属性值
      let span_sc_int = document.getElementById('sc_int');
      let span_sc_decimal = document.getElementById('sc_decimal');
      let span_scw_int = document.getElementById('scw_int');
      let span_scw_decimal = document.getElementById('scw_decimal');
      let span_sa_int = document.getElementById('sa_int');
      let span_sa_decimal = document.getElementById('sa_decimal');
      let span_ss_int = document.getElementById('ss_int');
      let span_ss_decimal = document.getElementById('ss_decimal');
      let span_sd_int = document.getElementById('sd_int');
      let span_sd_decimal = document.getElementById('sd_decimal');
      let span_si_int = document.getElementById('si_int');
      let span_si_decimal = document.getElementById('si_decimal');
      let span_su_int = document.getElementById('su_int');
      let span_su_decimal = document.getElementById('su_decimal');
      let span_se_int = document.getElementById('calc_int');
      let span_se_decimal = document.getElementById('se_decimal');

      span_sc_int.innerText = (
        res?.spectral_centroid.toPrecision(3) + ''
      ).split('.')[0];
      span_sc_decimal.innerText =
        '.' + (res?.spectral_centroid.toPrecision(3) + '').split('.')[1];
      span_scw_int.innerText = (
        res?.spectral_centroid_width.toPrecision(3) + ''
      ).split('.')[0];
      span_scw_decimal.innerText =
        '.' + (res?.spectral_centroid_width.toPrecision(3) + '').split('.')[1];
      span_sa_int.innerText = (res?.spectral_area.toPrecision(3) + '').split(
        '.',
      )[0];
      span_sa_decimal.innerText =
        '.' + (res?.spectral_area.toPrecision(3) + '').split('.')[1];
      span_ss_int.innerText = (res?.spectral_slope.toPrecision(3) + '').split(
        '.',
      )[0];
      span_ss_decimal.innerText =
        '.' + (res?.spectral_slope.toPrecision(3) + '').split('.')[1];
      span_sd_int.innerText = (res?.spectral_decline.toPrecision(3) + '').split(
        '.',
      )[0];
      span_sd_decimal.innerText =
        '.' + (res?.spectral_decline.toPrecision(3) + '').split('.')[1];
      span_si_int.innerText = (
        res?.spectral_Irregularity.toPrecision(3) + ''
      ).split('.')[0];
      span_si_decimal.innerText =
        '.' + (res?.spectral_Irregularity.toPrecision(3) + '').split('.')[1];
      span_su_int.innerText = (res?.spectral_Uneven.toPrecision(3) + '').split(
        '.',
      )[0];
      span_su_decimal.innerText =
        '.' + (res?.spectral_Uneven.toPrecision(3) + '').split('.')[1];
      span_se_int.innerText = (res?.spectral_entropy.toPrecision(3) + '').split(
        '.',
      )[0];
      span_se_decimal.innerText =
        '.' + (res?.spectral_entropy.toPrecision(3) + '').split('.')[1];
    });
  };
  /*
  const getData = () => {
    setloading(true);
    request(`/v1/feature/Mel_Spectrogram`, {
      method: 'POST',
      data: {
        file_id: audio_id,
        resolution: 25,
      },
    }).then((res) => {
      console.log('success');
      console.log('signal_type: ' + signal_type);
      console.log(JSON.stringify(res));
      let cur = [];
      let obj = JSON.parse(res?.picIfo.picIfo);
      let time = res?.picIfo.time;
      settime1(time);
      let id = res?.id;
      setid(id);
      console.log('typeof obj' + typeof obj);
      console.log('obj: ' + obj[0]);
      console.log('objlength: ' + Object.keys(obj).length);
      setlength(Object.keys(obj).length);
      for (let i = 0; i < Object.keys(obj).length; i++) {
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
      let res2 = [];
      for (let i = 0; i < ydataL; i++) {
        for (let j = 0; j < xdataL; j++) {
          arr.push(j);
          arr.push(i);
          arr.push(cur[i][j]);
          res2.push(cur[i][j]);
          data_Mel.push(arr);
          arr = [];
        }
      }
      let XAverage = 4000;
      let YAverage = [];
      let anticur = [];
      let arr2 = [];
      for (let i = 0; i < xdataL; i++) {
        for (let j = 0; j < ydataL; j++) {
          arr2.push(res2[j * xdataL + i]);
        }
        anticur.push(arr2);
        arr2 = [];
      }
      let curx = 0,
        cury = 0,
        curz = 0,
        sum = 0;
      for (let i = 0; i < anticur.length; i++) {
        for (let j = 0; j < anticur[i].length; j++) {
          sum += anticur[i][j];
        }
        YAverage.push(sum / anticur[i].length);
        sum = 0;
      }
      console.log('YAverage' + YAverage);
      for (let i = 0; i < anticur.length; i++) {
        for (let j = 0; j < anticur[i].length; j++) {
          curx += (j * ygap - 4000) * (anticur[i][j] - YAverage[i]);
          cury += (j * ygap - 4000) ** 2;
          curz += (anticur[i][j] - YAverage[i]) ** 2;
        }
        console.log('curx' + curx);
        console.log('cury' + cury);
        console.log('curz' + curz);
        person.push(Math.floor((curx / Math.sqrt(cury * curz)) * 100) / 100);
        curx = 0;
        cury = 0;
        curz = 0;
      }
      console.log('person' + person);
      console.log('cur' + cur.length);
      console.log('anticur' + anticur.length);
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
      let curobj = {};
      for (let i = 1; i <= person.length; i++) {
        curobj.key = `${i}`;
        curobj.time = Xdata[i - 1];
        curobj.person_coefficient = person[i - 1];
        data3.push(curobj);
        curobj = {};
      }
      setperson_coefficient(data3);
      setdata(data_Mel);
      setXdata(X_data);
      setYdata(Y_data);
      setloading(false);
    });
  };
  */
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
            }}
          />
        </Spin>
        <Button onClick={getData}>语谱谱分析</Button>
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
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/frequency/${id}`} />
      </Card>
      <div
        style={{
          display: signal_type === 2 ? 'block' : 'none',
        }}
      >
        <Table
          columns={columns1}
          dataSource={data1}
          style={{
            marginTop: 20,
            width: '100%',
            height: 200,
          }}
        />
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
      <div
        style={{
          display: signal_type === 3 ? 'block' : 'none',
        }}
      >
        <Table
          columns={columns2}
          dataSource={data2}
          style={{
            marginTop: 20,
            width: '100%',
            height: 200,
          }}
        />
      </div>
    </div>
  );
};
const mapStateToProps = ({}) => {
  return {};
};
export default connect(mapStateToProps)(TestApp);
