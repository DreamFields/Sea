import React,{useState} from 'react';
import './BasicLayouts.css';
import { Menu, List, Card } from 'antd';
import {Link} from 'umi';
import { UserOutlined, HomeOutlined, MenuUnfoldOutlined, ScissorOutlined, SnippetsOutlined, EditOutlined} from '@ant-design/icons';
import { FileOutlined, HistoryOutlined} from '@ant-design/icons';
import { Layout,Input,Button,Tree,Avatar } from 'antd';
import logo from '../assets/sea-white-logo.png'
import axios from 'axios';
const { Header, Sider, Footer, Content } = Layout;

const { SubMenu } = Menu;
const { Search } = Input;


const BasicLayouts = (props)=>{
  const data = [
    {
      country: "中国",
      signal_category: "辐射噪声",
      fleet_name: "测试文件1",
      power_plant:"柴油机",
      propellers:"单轴3叶",
      Collection_time:"2019-12-12",
      Collection_platform:"平台3",
      Collection_area:"海域1",
      target_number: 2,
      fleet_type_name: "类型1",
      id: 1
    },
    {
      country: "中国",
      signal_category: "目标回声",
      fleet_name: "测试文件2",
      power_plant:"燃气轮机",
      propellers:"单轴4叶",
      Collection_time:"2019-12-24",
      Collection_platform:"平台1",
      Collection_area:"海域3",
      target_number: 3,
      fleet_type_name: "类型2",
      id: 2
    },
    {
      country: "中国",
      signal_category: "脉冲信号",
      fleet_name: "测试文件3",
      power_plant:"涡轮机",
      propellers:"四轴6叶",
      Collection_time:"2018-12-12",
      Collection_platform:"平台2",
      Collection_area:"海域2",
      target_number: 3,
      fleet_type_name: "类型3",
      id: 2
    },
  ];

  const SideCardList = () => {
    return (
      <div style={{overflow: 'auto',width: '100%',height:'100%'}}>
        <List 
          grid={{gutter: 16,column: 1}}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card title={item.fleet_name} style={{width:'92%',marginLeft:'4%'}}>
                <p>分类：{item.signal_category}</p>
                <p>采集船只动力装置：{ item.power_plant}</p>               
                <p>采集船只螺旋桨：{item.propellers}</p>
                <p>采集船只国别：{item.country}</p>
                <p>采集海域：{item.Collection_area}</p>
                <p>采集平台：{item.Collection_platform}</p>
                <p>采集时间：{ item.Collection_time}</p>
              </Card>
            </List.Item>
            )}
        />
      </div>
    )
  }




  class Sidermenu extends React.Component {
      handleClick = e => {
        // console.log('click ', e);
      };
    
      render() {
        return (
          <Menu
            onClick={this.handleClick}
            style={{ width: 80,backgroundColor:'#2D2D2D',borderBottomLeftRadius:5,borderTopLeftRadius:5 }}
            defaultSelectedKeys={[props.location.pathname]}
            mode="inline"
          >
            <Menu.Item key="/"><Link to='/'><HomeOutlined  /></Link></Menu.Item>
            <Menu.Item key="/audioImport"><Link to='/audioImport'><MenuUnfoldOutlined /></Link></Menu.Item>
            <Menu.Item key="/audioEdit"><Link to='/audioEdit'><ScissorOutlined /></Link></Menu.Item>
            <Menu.Item key="/features"><Link to='/features'><SnippetsOutlined /></Link></Menu.Item>
            <Menu.Item key="5"><EditOutlined /></Menu.Item>
          </Menu>
        );
      }
  }
      
  class TopMenu extends React.Component {
      handleClick = e => {
          // console.log('click ', e);
      };
  
      render() {
          return (
          <Menu onClick={this.handleClick} defaultSelectedKeys={['file']} mode="horizontal" style={{backgroundColor:'black'}}>
              <Menu.Item key="file" icon={<FileOutlined />}>
              文件
              </Menu.Item>
              <Menu.Item key="history" icon={<HistoryOutlined />}>
              历史记录
              </Menu.Item>
          </Menu>
          );
      }
  }

    
  return(
      <div>
    <Layout>
      <Header style={{height:50,backgroundColor:'#464646',color:'white',borderBottom: "1px solid black"}}>
        <div  className='logo'>
          {/* <TwitterOutlined style={{fontSize:22}} /> */}
          <div style={{height:45,width:45,marginTop:-10,marginLeft: -35}}><img src={logo} style={{height:45,width:45}} /></div>
          <span style={{width:250,fontSize:22,marginTop:-8,marginLeft: -30}}> | 水声数据库系统</span>
          <div style={{fontSize:22,marginTop:-7,position:'absolute',right:10}}>
            <span >张三 | </span>
            <span style={{marginRight:20}}>数据管理员</span>
            <span style={{marginLeft: -15,fontSize: 25}}><Link to="/user/login"><UserOutlined /></Link></span>
          </div>
        </div>
        
      </Header>
      <Layout style={{backgroundColor:'#343434'}}>
        <Sider className='side' width={380}>
          <div className='sideContainer'>
            <div className='mainMenu'>
              <Sidermenu />
            </div>
            <div className='fileMenu'>
              <div className='topMenu' style={{width:220,height:60,marginLeft:30}}>
                <TopMenu />
              </div>
              <div style={{width:'100%',height:1,backgroundColor:'#2D2D2D'}}></div>
              <div className='fileContainer'>
                {/* <SearchTree/> */}
                <SideCardList />
              </div>                
            </div>
          </div>
        </Sider>
        <Content>       
          {props.children}
        </Content>
      </Layout>
      
      <Footer>海工小分队</Footer>
    </Layout>
  </div>
  );
}


export default BasicLayouts;
