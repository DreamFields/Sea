import React, { useState, useEffect } from 'react';
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
import UploadPhotos from '../../components/UploadPhotos';
const TestApp = (props) => {
  const { audio_id, audio_name, dispatch, setmean, setcalc, setva } = props;
  const [loading, setloading] = useState(false);
  let data_Zero = [];
  let x_data = [];
  const [myType, setmyType] = useState('value'); //对数还是线性
  const [data, setdata] = useState(data_Zero);
  const [Xdata, setXdata] = useState(x_data);
  const [PicType, setPicType] = useState('line'); //柱状图还是线性图
  const [id, setid] = useState('');
  const getOption = (Type, data, Xdata, Type2) => {
    let option = {
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

    console.log(option);

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
      console.log('过零率： ' + JSON.stringify(res));
      for (var i in res.picIfo.picIfo) {
        data_Zero.push(res.picIfo.picIfo[i]);
        x_data.push(parseInt(i));
      }
      setdata(data_Zero);
      setPicType('line');
      setmyType('value');
      setXdata(x_data);
      console.log(data);
      console.log(Xdata);
      setloading(false);
      setva(res?.picIfo.var.toPrecision(3));
      setmean(res?.picIfo.mean.toPrecision(3));
      setcalc(res?.picIfo.calc.toPrecision(3));
    });
  };
  return (
    <div>
      <Card title="过零率">
        <Spin spinning={loading}>
          <ReactEcharts
            option={getOption(myType, data, Xdata, PicType)}
            theme="dark"
            style={{ height: '400px' }}
          />
        </Spin>
        <Button onClick={getData}>过零率分析</Button>
        <UploadPhotos url={`http://47.97.152.219/v1/ffile/power/${id}`} />
      </Card>
    </div>
  );
};

const mapStateToProps = ({}) => {
  // console.log(power);
  return {};
};

export default connect(mapStateToProps)(TestApp);
