import React,{useState} from 'react';
import '../main.less';
import '../audioEdit/edit.less';
import { Menu } from 'antd';
import {Link} from 'umi';
import { UserOutlined, TwitterOutlined, HomeOutlined, MenuUnfoldOutlined, ScissorOutlined, SnippetsOutlined, EditOutlined} from '@ant-design/icons';
import { FileOutlined, HistoryOutlined, PlayCircleOutlined, PauseOutlined ,LoadingOutlined } from '@ant-design/icons';
import { Layout,Input,Button,Tree, Form  } from 'antd';
import axios from 'axios';
import PowerApp from '../power/index.js';
import { doc } from 'prettier';
const { Header, Sider, Footer, Content } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;

let sound_name = '';
let sound_path = '';
let sound_id = '';
let feature_key = '';

// class Sidermenu extends React.Component {
//   handleClick = e => {
//     console.log('click ', e);
//   };

//   render() {
//     return (
//       <Menu
//         onClick={this.handleClick}
//         style={{ width: 80,backgroundColor:'#2D2D2D',borderBottomLeftRadius:5,borderTopLeftRadius:5 }}
//         defaultSelectedKeys={['4']}
//         mode="inline"
//       >
//         <Menu.Item key="1" icon={<HomeOutlined  />}><Link to='/'></Link></Menu.Item>
//         <Menu.Item key="2"><Link to='/audioImport'><MenuUnfoldOutlined /></Link></Menu.Item>
//         <Menu.Item key="3"><Link to='/audioEdit'><ScissorOutlined /></Link></Menu.Item>
//         <Menu.Item key="4"><Link to='/features'><SnippetsOutlined /></Link></Menu.Item>
//         <Menu.Item key="5"><EditOutlined /></Menu.Item>
//       </Menu>
//     );
//   }
// }

// class TopMenu extends React.Component {
//   handleClick = e => {
//     console.log('click ', e);
//   };

//   render() {
//     return (
//       <Menu onClick={this.handleClick} defaultSelectedKeys={['file']} mode="horizontal" style={{backgroundColor:'black'}}>
//         <Menu.Item key="file" icon={<FileOutlined />}>
//           文件
//         </Menu.Item>
//         <Menu.Item key="history" icon={<HistoryOutlined />}>
//           历史记录
//         </Menu.Item>
//       </Menu>
//     );
//   }
// }

// let treeData = []

// $.ajax({
//   url: "http://47.97.152.219:82/v1/main/list",
//   method: "GET",
//   async: false,
//   success: function(res){
//     // console.log(res.data);
//     treeData = res.data;
//   }
// })

// const dataList = [];
// const generateList = data => {
//   for (let i = 0; i < data.length; i++) {
//     const node = data[i];
//     const { key, title } = node;
//     dataList.push({ key, title: title });
//     if (node.children) {
//       generateList(node.children);
//     }
//   }
// };
// generateList(treeData);

// const getParentKey = (key, tree) => {
//   let parentKey;
//   for (let i = 0; i < tree.length; i++) {
//     const node = tree[i];
//     if (node.children) {
//       if (node.children.some(item => item.key === key)) {
//         parentKey = node.key;
//       } else if (getParentKey(key, node.children)) {
//         parentKey = getParentKey(key, node.children);
//       }
//     }
//   }
//   return parentKey;
// };


// class SearchTree extends React.Component {
//   state = {
//     expandedKeys: [ ],
//     searchValue: '',
//     autoExpandParent: true,
//     checkedKeys: [ ]
//   };

//   onExpand = expandedKeys => {
//     this.setState({
//       expandedKeys,
//       autoExpandParent: false,
//     });
//   };

//   onCheck = checkedKeys => {
//     console.log('onCheck', checkedKeys);
//     this.setState({
//       checkedKeys
//     });
//   };

//   onChange = e => {
//     const { value } = e.target;
//     const expandedKeys = dataList
//       .map(item => {
//         if (item.title.indexOf(value) > -1) {
//           return getParentKey(item.key, treeData);
//         }
//         return null;
//       })
//       .filter((item, i, self) => item && self.indexOf(item) === i);
//     this.setState({
//       expandedKeys,
//       searchValue: value,
//       autoExpandParent: true,
//     });
//   };

//   render() {
//     const onSelect = (selectedKeys, info) => {
//       console.log('onSelect', info['node']['key']);
//       sound_name = info['node']['_title']
//       localStorage['sound_name'] = info['node']['_title'] + '.wav'

//       sound_path = info['node']['sound_path']
//       localStorage['sound_path'] = info['node']['sound_path']

//       sound_id = info['node']['sound_id']
//       document.querySelector('#fileName').innerHTML = info['node']['_title'];
//     };

//     const { searchValue, expandedKeys, autoExpandParent, checkedKeys } = this.state;
//     const loop = data =>
//       data.map(item => {
//         const index = item.title.indexOf(searchValue);
//         const beforeStr = item.title.substr(0, index);
//         const afterStr = item.title.substr(index + searchValue.length);
//         const title =
//           index > -1 ? (
//             <span>
//               {beforeStr}
//               <span className="site-tree-search-value">{searchValue}</span>
//               {afterStr}
//             </span>
//           ) : (
//             <span>{item.title}</span>
//           );
//         if (item.children) {
//           return { title, key: item.key, children: loop(item.children), _title:item.title, fleet_id:item.fleet_id };
//         }

//         return {
//           title,
//           key: item.key,
//           _title: item.title,
//           sound_id: item.sound_id,
//           sound_path: item.sound_path
//         };
//       });
//       // console.log(loop(treeData))
//     return (
//       <div>
//         <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={this.onChange} />
//         <Tree
//           checkable
//           onExpand={this.onExpand}
//           expandedKeys={expandedKeys}
//           autoExpandParent={autoExpandParent}
//           treeData={loop(treeData)}
//           height={500}
//           onSelect={onSelect}
//           onCheck={this.onCheck}
//           checkedKeys={checkedKeys}
//         />
//       </div>
//     );
//   }
// }



class RightSidermenu extends React.Component {
    handleClick = (e) => {
      console.log('click ', e);
      feature_key = e.key;
      if(e.key == "5"){
        document.querySelector('#divPara').style.display = 'block';
      }else{
        document.querySelector('#divPara').style.display = 'none';
      }
      // console.log(document.querySelector('#divPara'))
    };
  
    render() {
      return (
        <Menu
          onClick={this.handleClick}
          style={{ width: 256,backgroundColor:'black' }}
          defaultSelectedKeys={[ ]}
          defaultOpenKeys={['sub1','sub2','sub3']}
          mode="inline"
        >
            <Menu.Item key="1">
              功率谱
            </Menu.Item>
            <Menu.Item key="2">低频线谱</Menu.Item>
            <Menu.Item key="3">调制谱</Menu.Item>
            <SubMenu key="sub1" title="听音特征" disabled>
              <Menu.Item key="4" >梅尔倒谱系数</Menu.Item>
              <Menu.Item key="5">
              过零率
              </Menu.Item>
              <Menu.Item key="6">信息熵</Menu.Item>
              <Menu.Item key="7">均值</Menu.Item>
              <Menu.Item key="8">方差</Menu.Item>
              <Menu.Item key="9">清晰度</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title="主动脉冲特征" disabled>
              <Menu.Item key="10">信号形式</Menu.Item>
              <Menu.Item key="11">信号基频</Menu.Item>
              <Menu.Item key="12">带宽</Menu.Item>
              <Menu.Item key="13">平台属性</Menu.Item>
            </SubMenu>
        </Menu>
      );
    }
  }


  class Waveform extends React.Component {
    componentDidMount(){
      var wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: '#2ecc71',
          progressColor: '#27ae00',
          // splitChannels: true,
          cursorColor: '#2ecc71',
          cursorWidth: 1,
          // barWidth: 2,
          // barHeight: 1, // the height of the wave
          // barGap: 2, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
          // barRadius: 3,
          plugins: [
            WaveSurfer.cursor.create({
              showTime: true,
              opacity: 1,
              color: 'white',
              customShowTimeStyle: {
                  'background-color': '#000',
                  color: 'white',
                  padding: '2px',
                  'font-size': '10px'
              }
            }),
            WaveSurfer.timeline.create({
              height: 20,
              container: "#wave-timeline"
            })
          ]
      });
      wavesurfer.load('123');
  
      btnPlay.addEventListener('click', function () {
        wavesurfer.playPause();
      });

      btnLoad.addEventListener('click', function(){
        if(sound_path == ''){
          alert('请点击左侧文件树上的节点选取单个音频，注意不是点击节点前的复选框!')
        }else{
          let str = '/var/www/html/seadist';
          wavesurfer.load(sound_path.replace(str, '.'))
        } 
      });
  
      // Progress bar
      (function() {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');
  
        var showProgress = function(percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };
  
        var hideProgress = function() {
            progressDiv.style.display = 'none';
        };
  
        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
      })();
    }
  
    getFeatures(){
      let show_0 = document.querySelector('#divshow_0');
      show_0.style.display = 'block';
      let show_1 = document.querySelector('#divshow_1');
      // console.log(sound_name)
      // console.log(sound_path)
      let img = document.querySelector('#resImg');
      img.style.display = 'none';
      let loading = document.querySelector('#divLoading');
      loading.style.display = 'block';
      if(feature_key == '4'){
        show_1.style.display = 'none';
        show_0.style.display = 'block';
        axios({
          url: 'http://47.97.152.219:82/v1/feature/MCFF',
          method: 'POST',
          data:{
            filepath: sound_path,
            filename: sound_name + '.wav'
          }
          
        }).then(res => {
          loading.style.display = 'none';
          img.style.display = 'block';
          img.setAttribute('src', res.data);
        });
      }else if(feature_key == '5'){
        show_1.style.display = 'none';
        show_0.style.display = 'block';
        let startTime = document.querySelector('#startTime').value;
        let endTime = document.querySelector('#endTime').value;
        axios({
          url: 'http://47.97.152.219:82/v1/feature/Zero_Crossing',
          method: 'POST',
          data:{
            filepath: sound_path,
            filename: sound_name + '.wav',
            StartTime: startTime,
            EndTime: endTime
          }
        }).then(res => {
          loading.style.display = 'none';
          img.style.display = 'block';
          img.setAttribute('src', res.data);
        });
      }else if(feature_key == '1'){
        show_0.style.display = 'none';
        show_1.style.display = 'block';
      }
    }

    render() {
      return (
        <div style={{backgroundColor:'#2F2F2F'}}>
          <div style={{marginTop:10,marginLeft:10}}>
            <Button type='dashed' id='btnLoad' style={{fontSize:15,marginRight:20}}>加载</Button>
            <Button type='dashed' onClick={this.start} id='btnPlay' style={{fontSize:15}}><PlayCircleOutlined />/<PauseOutlined /></Button>
            <Button type='dashed' id='btncaculate' style={{marginLeft: 560}} onClick={this.getFeatures} >计算</Button>
          </div>
          <div id='wave-timeline' style={{marginTop:10}}></div>
          <div id='waveform' style={{backgroundColor:'black'}}>
            <div className="progress progress-striped active" id="progress-bar">
              <div className="progress-bar progress-bar-info" ></div>
            </div>
          </div>
          <div style={{width:'100%',height:200, display:'block'}} id='divshow_0'>
            <img style={{width:'100%',height:200,display:'none'}} id='resImg' />
            <div style={{fontSize:40, display:'none'}} id='divLoading'>
              <LoadingOutlined style={{marginTop:80,marginLeft:366}} />
            </div>
          </div>
          <div id='divshow_1' style={{display:'none'}}>
              <PowerApp />
          </div>
        </div>
        );
    }
  }


const MainContent = () => {
  return(
    <div className='rightContent' style={{width: 815, float:'left',height: 750}}>
      <h3 style={{width:550,marginLeft:20}}>特征提取</h3>
      <div style={{backgroundColor:'white',height:2,width:'100%',marginTop:-5,marginBottom:5}}></div>
      <h4 id='fileName' style={{width:850,marginLeft:20}}>从左栏选取文件</h4>
      <Waveform/>     
    </div>
  )
}


const index = ()=>{
  return(
    <div>
        <Layout style={{backgroundColor:'#343434'}}>
          <Content>       
            <MainContent/>
            <div style={{color:'white',fontSize:20,marginTop:13}}>目标特征提取</div>
            <div style={{backgroundColor:'black',width:280,height:340, float:'left', overflow: 'auto', border:'1px solid grey'}}>
                <RightSidermenu />
            </div>
            <div style={{width:280,height:370, float:'left',marginTop:15}}>
              <div style={{color:'white',fontSize:20}}>参数选择</div>
              <div style={{width:280,height:340,border:'1px solid grey',backgroundColor:'black', overflow: 'auto'}}>
                <div id='divPara' style={{width:240,marginTop:20,marginLeft:20,display:'none'}}>
                  <Form name="edit_fleet" >
                    <Form.Item name='start' label="开始时间">
                      <Input id='startTime' autoComplete="off" placeholder="单位：ms" />
                    </Form.Item>
                    <Form.Item name='end' label="结束时间">
                      <Input  id='endTime' autoComplete="off" placeholder="单位：ms" />
                    </Form.Item>
                  </Form> 
                </div>
              </div>
            </div>           
          </Content>
        </Layout>
    </div>
  );
}

export default index;
