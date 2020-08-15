import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { Button } from 'antd';
//import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// const sever = 'http://127.0.0.1:8000'

class PowerApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      StartTime: '',
      EndTime: '',
      Pic: '',
      Zpic: '',
      data_forPower:'',
    }
    this.ChangeIfo = this.ChangeIfo.bind(this);
    // this.test = this.test.bind(this);
    this.test1 = this.test1.bind(this);
    this.test2 = this.test2.bind(this);
  }
  componentDidMount() {

  }


  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  test2(){
    console.log(document.querySelector('#startTime'))
    let send_data = {
      "StartTime": this.state.StartTime,
      "EndTime": this.state.EndTime,
      "filepath": localStorage['sound_path'],
      "filename": localStorage['sound_name']
    };
    $.ajax({
      url: "http://127.0.0.1:5000/v1/feature/onethree",
      method: 'post',
      data: JSON.stringify(send_data),
      dataType:'json',
      async: false,
      success: (res => {
        console.log(res);
        // this.setState(
        //   {data_forPower : res}
        // )
        this.state.data_forPower = res;
        // console.log(this.state.data_forPower);
      })
    });

    let chart = am4core.create("chartdiv", am4charts.XYChart);//创建XY图

    //边缘
    chart.paddingRight = 20;

    ///数据处理
    let data = this.state.data_forPower;
    
    // let visits = 10;
    // for (let i = 1; i < 10; i++) {
    //   visits += i*10;
    //   data.push({ country: i, value: visits });
    // }
    // console.log(data);
    let data_length = 0
    let data1 = []
    for (var key in data) {
      data_length = data_length+1
      // console.log(key);     //获取key值
      // console.log(data[key]); //获取对应的value值
      //console.log(data_length)
      data1.push({ country: key, value: data[key] });
    }
    ///
    
    console.log(data.length)
    console.log(data1)
    chart.data = data1;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    
    categoryAxis.dataFields.category = "country";
    categoryAxis.title.text =  "1/3频谱分析中心频率（hz）";
    categoryAxis.renderer.labels.template.fill = am4core.color("#A0CA92");
    categoryAxis.renderer.labels.template.fontSize = 20;
    categoryAxis.renderer.baseGrid.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "分贝（db）";
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#A0CA92");
    valueAxis.renderer.labels.template.fontSize = 20;

    //var series = chart.series.push(new am4charts.LineSeries());//折线图
    var series = chart.series.push(new am4charts.ColumnSeries());//柱状图
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "country";
    
    ///柱状图数据颜色
    //series.fill = am4core.color("red").lighten(0.5);
    //series.fill = am4core.color("black");
    //series.stroke = am4core.color("red");
    ///
    //series.fillAlphas = 0.8;

    ///负责缩放功能
    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    chart.angle = 30;
    chart.depth3D = 15;
    ///
    this.chart = chart;
  }

  test1(){
    let send_data = {
      "StartTime": this.state.StartTime,
      "EndTime": this.state.EndTime,
      "filepath": localStorage['sound_path'],
      "filename": localStorage['sound_name']
    };
    $.ajax({
      url: "http://127.0.0.1:5000/v1/feature/Power",
      method: 'post',
      data: JSON.stringify(send_data),
      dataType:'json',
      async: false,
      success: (res => {
        // console.log(res);
        // this.setState(
        //   {data_forPower : res}
        // )
        this.state.data_forPower = res;
        // console.log(this.state.data_forPower);
      })
    });

    let chart = am4core.create("chartdiv", am4charts.XYChart);//创建XY图

    //边缘
    chart.paddingRight = 20;

    ///数据处理
    let data = this.state.data_forPower;
    
    // let visits = 10;
    // for (let i = 1; i < 10; i++) {
    //   visits += i*10;
    //   data.push({ country: i, value: visits });
    // }
    // console.log(data);
    let data_length = 0
    for (var key in data) {
      data_length = data_length+1
      console.log(key);     //获取key值
      console.log(data[key]); //获取对应的value值
      //console.log(data_length)
    }
    ///
    let data1 = []
    for(let i = 0 ; i < data_length/2;i++){
      data1.push({ country: i, value: data[i] });
    }
    console.log(data.length)
    console.log(data1)
    chart.data = data1;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    
    categoryAxis.dataFields.category = "country";
    categoryAxis.title.text = "频率（hz）";
    categoryAxis.renderer.labels.template.fill = am4core.color("#A0CA92");
    categoryAxis.renderer.labels.template.fontSize = 20;
    categoryAxis.renderer.baseGrid.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "分贝（db）";
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#A0CA92");
    valueAxis.renderer.labels.template.fontSize = 20;

    var series = chart.series.push(new am4charts.LineSeries());//折线图
    //var series = chart.series.push(new am4charts.ColumnSeries());//柱状图
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "country";
    
    ///柱状图数据颜色
    //series.fill = am4core.color("red").lighten(0.5);
    //series.fill = am4core.color("black");
    //series.stroke = am4core.color("red");
    ///
    //series.fillAlphas = 0.8;

    ///负责缩放功能
    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    chart.angle = 30;
    chart.depth3D = 15;
    ///
    this.chart = chart;
  }
  //实时更新数据
  ChangeIfo(key, e) {
    this.setState({
      [key]: e.target.value
    });
    console.log(e.target.value);

  }
  render() {
    return (
      <div className="App" style={{textAlign:"center",width:813,height:490}}>
        {/* <h1>Hello World</h1>
        <p>It is for test!</p> */}
        {/* <input value={this.state.StartTime} onChange={(e) => { this.ChangeIfo('StartTime', e) }}></input>
        <br />
        <input value={this.state.EndTime} onChange={(e) => { this.ChangeIfo('EndTime', e) }}></input> */}
        {/* <button onClick={this.test} style={{color:'black'}}>Click me and for test</button> */}
        {/* <button onClick={this.test1} style={{color:'black'}}>Click me and for power_show</button>
        <button onClick={this.test2} style={{color:'black'}}>Click me and for feature_onethree</button>
        <br /> */}
        {/* <img src={this.state.Pic.data} alt='2' />
        <img src={this.state.Zpic.data} alt='3' /> */}       
        <div id="chartdiv" style={{ width: 813, height: 460,backgroundColor:'gray'}}></div>
        <Button onClick={this.test1} type='dashed' style={{}}>功率谱</Button>
        <Button onClick={this.test2} type='dashed'>三分之一</Button>
      </div>
    );
  }
}

export default PowerApp;
