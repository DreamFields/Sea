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
  const { audio_id, audio_name, animation } = props;
  const [loading, setloading] = useState(false);
  let data_Demon = [];
  let data_demon = [];
  let data_L = 0;
  let x_data = [];
  const [myType, setmyType] = useState('value'); //对数还是线性
  const [data, setdata] = useState(data_Demon);
  const [dataL, setdataL] = useState(data_L);
  const [Xdata, setXdata] = useState(x_data);
  const [id, setid] = useState('');
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  useEffect(() => {
    animationController();
  }, [animation]);
  const animationController = function () {
    console.log('Demon_animation: ' + animation);
    if (animation === true) {
      while (data.length < dataL) {
        console.log('while(data):' + data);
        setTimeout(() => {
          data_demon.push(data_Demon.reverse().pop());
          setdata(data_demon);
        }, Math.floor(4850 / dataL));
      }
    }
  };
  const getOption = (Type, data1, Xdata, Type2) => {
    let option = {
      title: {
        text: '特征提取',
        subtext: '调制谱',
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
    console.log('分贝(db):' + params.value);
    console.log('频率(hz)):' + params.dataIndex);
    let span_db_int = document.getElementById('db_int');
    let span_db_decimal = document.getElementById('db_decimal');
    span_db_int.innerText = (params.value + '').split('.')[0];
    span_db_decimal.innerText = '.' + (params.value + '').split('.')[1];
    let span_hz_int = document.getElementById('hz_int');
    span_hz_int.innerText = params.dataIndex + '';
  };

  const getData = () => {
    setloading(true);
    request(`/v1/feature/demon_amalysis`, {
      method: 'POST',
      data: { sid: audio_id },
    }).then((res) => {
      let id = res?.id;
      setid(id);
      for (let i of res.picIfo.fftf) {
        Xdata.push(i);
      }
      for (let i of res.picIfo.Y_demon) {
        data_Demon.push(i);
      }
      setPicType('line');
      //setdata(data_Demon);
      setdataL(data_Demon.length);
      setXdata(x_data);
      console.log('data_Demon' + data_Demon);
      console.log('data:' + data);
      console.log('Xdata:' + Xdata);
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
        <Button onClick={getData}>调制谱分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/demon/${id}`} />
      </Card>
    </div>
  );
};

const mapStateToProps = ({}) => {
  return {};
};

export default connect(mapStateToProps)(TestApp);
