import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { Card, Spin } from 'antd';
import { connect } from 'umi';
//不是按需加载的话文件太大
//import echarts from 'echarts'
//下面是按需加载
import echarts from 'echarts/lib/echarts';
//导入折线图
import 'echarts/lib/chart/line'; //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import request from '@/utils/request';
const TestApp = (props) => {
  console.log(props);
  const { audio_id, audio_name, dispatch } = props;
  const [loading, setloading] = useState(false);
  var dataTest = [];
  var data_Power = [];
  var data_L = 0;
  var x_data = [];
  for (var i = 0; i < 500; i++) {
    dataTest.push(i + 3);
  }
  const [myType, setmyType] = useState('log'); //对数还是线性
  const [StartTime, setStartTime] = useState('');
  const [EndTime, setEndTime] = useState('');
  const [data1, setdata1] = useState(dataTest);
  const [data, setdata] = useState(data_Power);
  const [dataL, setdataL] = useState(data_L);
  const [Xdata, setXdata] = useState(x_data);
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  const getOption = (Type, data1, Xdata, Type2) => {
    let option = {
      title: {
        text: '特征提取',
        subtext: '功率谱(默认1000hz)，1/3频谱分析（默认20000hz）',
      },
      animation: true,
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
          // saveAsImage: {},
        },
      },
      // visualMap: {
      //   top: 10,
      //   right: 10,
      //   pieces: [{
      //     gt: 0.0001,
      //     lte: 0.001,
      //     color: '#096'
      //   }, {
      //     gt: 0.001,
      //     lte: 0.01,
      //     color: '#ffde33'
      //   }, {
      //     gt: 0.01,
      //     lte: 0.1,
      //     color: '#ff9933'
      //   }, {
      //     gt: 0.1,
      //     lte: 1,
      //     color: '#cc0033'
      //   }, {
      //     gt: 1,
      //     color: '#7e0023'
      //   }],
      //   outOfRange: {
      //     color: '#999'
      //   }
      // },
      series: [
        {
          data: data1,
          //type: 'bar',
          type: Type2,
          //smooth: true
          color: 'skyblue',
        },
      ],
    };
    return option;
  };
  const handleChartClick = (params) => {
    console.log(params);
    console.log('分贝(db):' + params.value);
    console.log('频率(hz)):' + params.dataIndex);

    let span_db_int = document.getElementById('db_int');
    let span_db_decimal = document.getElementById('db_decimal');
    span_db_int.innerText = (params.value + '').split('.')[0];
    span_db_decimal.innerText = '.' + (params.value + '').split('.')[1];

    let span_hz_int = document.getElementById('hz_int');
    span_hz_int.innerText = params.dataIndex + '';
  };
  const changeToLog = () => {
    setmyType('log');
  };
  const getData = () => {
    setloading(true);
    request(`/v1/feature/Power`, {
      method: 'POST',
      data: { file_id: audio_id },
      // data: { file_id: '6152.wav' },
    }).then((res) => {
      //setPowerdata(res);
      console.log('res: ' + res);
      for (var i in res) {
        data_Power.push(res[i] * 10);
        x_data.push(i);
      }
      setmyType('log');
      setPicType('line');
      setdata(data_Power);
      setdataL(data_Power.length);
      setXdata(x_data);
      console.log(data);
      console.log(Xdata);
      console.log('200');
      setloading(false);
    });
  };

  const getData2 = () => {
    setloading(true);
    console.log('send requir');
    request('/v1/feature/onethree', {
      method: 'POST',
      data: { file_id: audio_id },
      // data: { file_id: '6152.wav' },
    }).then((res) => {
      //setPowerdata(res);
      console.log(res);
      for (var i in res) {
        data_Power.push(res[i] * 10);
        x_data.push(i);
      }
      setdata(data_Power);
      setdataL(data_Power.length);
      setXdata(x_data);
      setmyType('value');
      setPicType('bar');
      console.log(data);
      console.log(Xdata);
      console.log('200');
      setloading(false);
    });
  };

  return (
    <div>
      <Card title="折线图表之一">
        <Spin spinning={loading}>
          <ReactEcharts
            option={getOption(myType, data, Xdata, PicType)}
            theme="dark"
            style={{ height: '400px' }}
            onEvents={{
              click: handleChartClick,
            }}
          />
        </Spin>
        {/* <Button onClick={changeToLog}>ada</Button> */}
        <Button onClick={getData}>功率谱分析</Button>
        <Button onClick={getData2}>1/3频程分析</Button>
      </Card>
    </div>
  );
};

const mapStateToProps = ({}) => {
  return {};
};

export default connect(mapStateToProps)(TestApp);
