import React, { useState, useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Button } from 'antd';
import Cookies from 'js-cookie';

const PowerApp = (props) => {
  const { audio_name } = props;
  // console.log(audio_name);

  const [StartTime, setStartTime] = useState('');
  const [EndTime, setEndTime] = useState('');
  const [Pic, setPic] = useState('');
  const [Zpic, setZpic] = useState('');
  const [Powerdata, setPowerdata] = useState(null);
  const [data_forPower, setdata_forPower] = useState('');
  const [type, settype] = useState(null);

  const test2 = () => {
    console.log('send requir');
    let send_data = {
      StartTime: StartTime,
      EndTime: EndTime,
      filename: audio_name,
    };
    $.ajax({
      url: 'http://47.97.152.219/v1/feature/Power',
      //   url: "http://127.0.0.1:5000/v1/feature/Power",
      method: 'post',
      data: JSON.stringify(send_data),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      dataType: 'json',
      async: false,
      success: (res) => {
        setdata_forPower(res.data);
        setPowerdata(res.data);
        settype(2);
        console.log(data_forPower);
        console.log('200');
      },
    });
  };
  const getPowerFeature = () => {
    console.log('send requir');
    let send_data = {
      StartTime: StartTime,
      EndTime: EndTime,
      // "filepath": localStorage['sound_path'],
      // "filename": localStorage['sound_name']
      filename: audio_name,
    };
    $.ajax({
      url: 'http://47.97.152.219/v1/feature/Power',
      //   url: "http://127.0.0.1:5000/v1/feature/Power",
      method: 'post',
      data: JSON.stringify(send_data),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      dataType: 'json',
      async: false,
      success: (res) => {
        // console.log(res.data)
        setdata_forPower(res.data);
        setPowerdata(res.data);
        settype(1);
        console.log(data_forPower);
        console.log('200');
      },
    });
  };

  const getOneThreeFeature = () => {
    let send_data = {
      StartTime: StartTime,
      EndTime: EndTime,
      filename: audio_name,
    };
    $.ajax({
      url: 'http://47.97.152.219/v1/feature/onethree',
      //   url: "http://127.0.0.1:5000/v1/feature/onethree",
      method: 'post',
      data: JSON.stringify(send_data),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      dataType: 'json',
      async: false,
      success: (res) => {
        console.log(res);
        setdata_forPower(res.data);
        settype(0);
        console.log(data_forPower);
      },
    });
  };
  useEffect(() => {
    if (type == 0) {
      let chart = am4core.create('chartdiv', am4charts.XYChart); //创建XY图
      //边缘
      chart.paddingRight = 20;

      ///数据处理
      let data = data_forPower;
      let data_length = 0;
      let data1 = [];
      for (var key in data) {
        data_length = data_length + 1;
        // console.log(key);     //获取key值
        // console.log(data[key]); //获取对应的value值
        //console.log(data_length)
        data1.push({ country: key, value: data[key] });
      }
      ///

      console.log(data.length);
      console.log(data1);
      chart.data = data1;

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = 'country';
      categoryAxis.title.text = '1/3频谱分析中心频率（hz）';
      categoryAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
      categoryAxis.renderer.labels.template.fontSize = 20;
      categoryAxis.renderer.baseGrid.disabled = true;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = '分贝（db）';
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
      valueAxis.renderer.labels.template.fontSize = 20;

      //var series = chart.series.push(new am4charts.LineSeries());//折线图
      var series = chart.series.push(new am4charts.ColumnSeries()); //柱状图
      series.dataFields.valueY = 'value';
      series.dataFields.categoryX = 'country';

      ///柱状图数据颜色
      //series.fill = am4core.color("red").lighten(0.5);
      //series.fill = am4core.color("black");
      //series.stroke = am4core.color("red");
      ///
      //series.fillAlphas = 0.8;

      ///负责缩放功能
      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      chart.angle = 30;
      chart.depth3D = 15;
      ///
      chart = chart;
    }
    if (type == 1) {
      let chart = am4core.create('chartdiv', am4charts.XYChart); //创建XY图

      //边缘
      chart.paddingRight = 20;

      ///数据处理
      let data = data_forPower;

      // let visits = 10;
      // for (let i = 1; i < 10; i++) {
      //   visits += i*10;
      //   data.push({ country: i, value: visits });
      // }
      // console.log(data);
      let data_length = 0;
      for (var key in data) {
        data_length = data_length + 1;
      }
      ///
      let data1 = [];
      for (let i = 0; i < data_length / 2; i++) {
        data1.push({ country: i, value: data[i] });
      }
      console.log(data.length);
      console.log(data1);
      chart.data = data1;

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = 'country';
      categoryAxis.title.text = '频率（hz）';
      categoryAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
      categoryAxis.renderer.labels.template.fontSize = 20;
      categoryAxis.renderer.baseGrid.disabled = true;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      //valueAxis.title.text = "分贝（db）";
      valueAxis.title.text = '幅度（V）';
      valueAxis.renderer.baseGrid.disabled = true;
      //valueAxis.logarithmic = true;//对数！
      valueAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
      valueAxis.renderer.labels.template.fontSize = 20;

      var series = chart.series.push(new am4charts.LineSeries()); //折线图
      //var series = chart.series.push(new am4charts.ColumnSeries());//柱状图
      series.dataFields.valueY = 'value';
      series.dataFields.categoryX = 'country';

      ///柱状图数据颜色
      //series.fill = am4core.color("red").lighten(0.5);
      //series.fill = am4core.color("black");
      //series.stroke = am4core.color("red");
      ///
      //series.fillAlphas = 0.8;

      ///负责缩放功能
      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      chart.angle = 30;
      chart.depth3D = 15;
      ///
      chart = chart;
    }
    if (type == 2) {
      let chart = am4core.create('chartdiv', am4charts.XYChart); //创建XY图

      //边缘
      chart.paddingRight = 20;

      ///数据处理
      let data = data_forPower;

      // let visits = 10;
      // for (let i = 1; i < 10; i++) {
      //   visits += i*10;
      //   data.push({ country: i, value: visits });
      // }
      // console.log(data);
      let data_length = 0;
      for (var key in data) {
        data_length = data_length + 1;
      }
      ///
      let data1 = [];
      for (let i = 0; i < data_length / 2; i++) {
        data1.push({ country: i, value: data[i] });
      }
      console.log(data.length);
      console.log(data1);
      chart.data = data1;

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = 'country';
      categoryAxis.title.text = '频率（hz）';
      categoryAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
      categoryAxis.renderer.labels.template.fontSize = 20;
      categoryAxis.renderer.baseGrid.disabled = true;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      //valueAxis.title.text = "分贝（db）";
      valueAxis.title.text = '幅度（V）';
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.logarithmic = true; //对数！
      valueAxis.renderer.labels.template.fill = am4core.color('#A0CA92');
      valueAxis.renderer.labels.template.fontSize = 20;

      var series = chart.series.push(new am4charts.LineSeries()); //折线图
      //var series = chart.series.push(new am4charts.ColumnSeries());//柱状图
      series.dataFields.valueY = 'value';
      series.dataFields.categoryX = 'country';

      ///柱状图数据颜色
      //series.fill = am4core.color("red").lighten(0.5);
      //series.fill = am4core.color("black");
      //series.stroke = am4core.color("red");
      ///
      //series.fillAlphas = 0.8;

      ///负责缩放功能
      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      chart.angle = 30;
      chart.depth3D = 15;
      ///
      chart = chart;
    }
  });

  return (
    <div
      className="App"
      style={{ textAlign: 'center', width: 813, height: 490 }}
    >
      <div
        id="chartdiv"
        style={{ width: 813, height: 460, backgroundColor: 'gray' }}
      ></div>
      <Button onClick={getPowerFeature} type="dashed">
        获取功率谱
      </Button>
      <Button onClick={test2} type="dashed">
        功率谱对数显示
      </Button>
      <Button onClick={getOneThreeFeature} type="dashed">
        1/3倍频程分析
      </Button>
    </div>
  );
};

export default PowerApp;
