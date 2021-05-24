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
const TestApp = (props) => {
  const { audio_id, audio_name, dispatch, setva, setmean, setcalc } = props;
  const [loading, setloading] = useState(false);
  var data_Zero = [];
  var x_data = [];
  const [myType, setmyType] = useState('log'); //对数还是线性
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
      for (let i = 0; i < res.picIfo[0].length; i++) {
        data_Zero.push(res.picIfo[0][i]);
        x_data.push(i);
      }
      setdata(data_Zero);
      setmyType('value');
      setPicType('line');
      setXdata(x_data);
      console.log(data);
      console.log(Xdata);
      setloading(false);
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
  return {};
};

export default connect(mapStateToProps)(TestApp);
