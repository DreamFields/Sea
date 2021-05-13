import React, { useState, useEffect, useRef } from 'react';
import { Button, notification } from 'antd';
import { Card, Spin, Table, Popover } from 'antd';
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
import PowerTable from './table';
import UploadPhotos from '../../components/UploadPhotos';

const TestApp = (props) => {
  const { audio_id, audio_name, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'power/setdata',
      payload: {},
      callback: (state) => {
        return { tabledata: [] };
      },
    });
    return () => {};
  }, [audio_id]);

  const [loading, setloading] = useState(false);
  var dataTest = [];
  var data_Power = [];
  var data_L = 0;
  var x_data = [];
  for (var i = 0; i < 500; i++) {
    dataTest.push(i + 3);
  }
  const [myType, setmyType] = useState('log'); //对数还是线性
  // const [data1, setdata1] = useState(dataTest);
  const [data, setdata] = useState(data_Power);
  const [dataL, setdataL] = useState(data_L);
  const [Xdata, setXdata] = useState(x_data);
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  const [id, setid] = useState('');
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
        },
      },
      series: [
        {
          data: data1,
          type: Type2,
          color: 'skyblue',
        },
      ],
    };
    return option;
  };
  const handleChartClick = (params) => {
    console.log(params);
    console.log('分贝(db):' + params.value.toPrecision(3));
    console.log('频率(hz)):' + params.dataIndex);
    let span_db_int = document.getElementById('db_int');
    let span_db_decimal = document.getElementById('db_decimal');
    let span_hz_int = document.getElementById('hz_int');

    span_db_int.innerText = (params.value.toPrecision(3) + '').split('.')[0];
    span_db_decimal.innerText =
      '.' + (params.value.toPrecision(3) + '').split('.')[1];
    span_hz_int.innerText = params.dataIndex + '';

    let copy_data;
    dispatch({
      type: 'power/setdata',
      payload: {},
      callback: (state) => {
        copy_data = state.tabledata.slice();
        copy_data.push({
          hz: params.value.toPrecision(3),
          db: params.dataIndex,
        });
        return { tabledata: copy_data };
      },
    });
  };
  const getData = () => {
    setloading(true);
    request(`/v1/feature/Power`, {
      method: 'POST',
      data: { file_id: audio_id },
    }).then((res) => {
      console.log('res: ', JSON.stringify(res));

      let id = res?.id;
      setid(id);
      console.log(id);
      let count = 0;
      for (var i in res.dataIfo.dataIfo) {
        data_Power.push(res.dataIfo.dataIfo[i]);
        if (count < 500) {
          x_data.push(count);
        }
        count++;
      }
      setmyType('value');
      setPicType('line');
      setdata(data_Power);
      setdataL(data_Power.length);
      setXdata(x_data);
      // console.log(data);
      // console.log(Xdata);
      // console.log('200');
      setloading(false);
    });
  };
  const getData3 = () => {
    setloading(true);
    request(`/v1/feature/Power`, {
      method: 'POST',
      data: { file_id: audio_id },
    }).then((res) => {
      console.log('res: ', JSON.stringify(res));

      let id = res?.id;
      setid(id);
      console.log(id);
      let count = 0;
      for (var i in res.dataIfo.dataIfo_log) {
        data_Power.push(res.dataIfo.dataIfo_log[i]);
        if (count < 500) {
          x_data.push(count);
        }
        count++;
      }
      setmyType('value');
      setPicType('line');
      setdata(data_Power);
      setdataL(data_Power.length);
      setXdata(x_data);
      // console.log(data);
      // console.log(Xdata);
      // console.log('200');
      setloading(false);
    });
  };

  const getData2 = () => {
    setloading(true);
    console.log('send requir');
    request('/v1/feature/onethree', {
      method: 'POST',
      data: { file_id: audio_id },
    }).then((res) => {
      console.log(res?.dataIfo);
      for (var i in res?.dataIfo) {
        data_Power.push(res?.dataIfo[i]);
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
      <Card title="功率谱">
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
        <Button onClick={getData}>功率谱分析</Button>
        <Button onClick={getData3}>功率谱y轴切换</Button>
        <Button onClick={getData2}>1/3频程分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/power/${id}`} />
      </Card>
      <PowerTable />
    </div>
  );
};

const mapStateToProps = ({}) => {
  // console.log(power);
  return {};
};

export default connect(mapStateToProps)(TestApp);
