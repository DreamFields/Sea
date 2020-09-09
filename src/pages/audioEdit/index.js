import React,{useState} from 'react';
import './edit.less';
import { Menu } from 'antd';
import {Link} from 'umi';
import { UserOutlined, TwitterOutlined, HomeOutlined, MenuUnfoldOutlined, ScissorOutlined, SnippetsOutlined, EditOutlined} from '@ant-design/icons';
import { FileOutlined, HistoryOutlined, PlayCircleOutlined, PauseOutlined,FrownOutlined, SmileOutlined} from '@ant-design/icons';
import { Layout,Input,Button,Tree,Avatar,Slider } from 'antd';
import axios from 'axios';
// import wav2 from '@/assets/demo0.wav';
// console.log(wav2);
const { Header, Sider, Footer, Content } = Layout;
const {Search} = Input;
const { SubMenu } = Menu;

let sound_name = '';
let sound_path = '';
let sound_id = '';
let region_now;

class Sidermenu extends React.Component {
  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 80,backgroundColor:'#2D2D2D',borderBottomLeftRadius:5,borderTopLeftRadius:5 }}
        defaultSelectedKeys={['3']}
        mode="inline"
      >
        <Menu.Item key="1" icon={<HomeOutlined  />}><Link to='/'></Link></Menu.Item>
        <Menu.Item key="2"><Link to='/audioImport'><MenuUnfoldOutlined /></Link></Menu.Item>
        <Menu.Item key="3"><Link to='/audioEdit'><ScissorOutlined /></Link></Menu.Item>
        <Menu.Item key="4"><Link to='/features'><SnippetsOutlined /></Link></Menu.Item>
        <Menu.Item key="5"><EditOutlined /></Menu.Item>
      </Menu>
    );
  }
}



class TopMenu extends React.Component {
  handleClick = e => {
    console.log('click ', e);
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

let treeData = []

$.ajax({
  url: "http://47.97.152.219:82/v1/main/list",
  method: "GET",
  async: false,
  success: function(res){
    // console.log(res.data);
    treeData = res.data;
  }
})

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({ key, title: title });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(treeData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};


class SearchTree extends React.Component {
  state = {
    expandedKeys: [ ],
    searchValue: '',
    autoExpandParent: true,
    checkedKeys: [ ]
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({
      checkedKeys
    });
  };

  onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const onSelect = (selectedKeys, info) => {
      document.querySelector('#fileName').innerHTML = info['node']['_title'];
      sound_name = info['node']['_title']
      sound_path = info['node']['sound_path']
      sound_id = info['node']['sound_id']
      // setSelectedKeys(selectedKeys);
    };

    const { searchValue, expandedKeys, autoExpandParent, checkedKeys } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children), _title:item.title, fleet_id:item.fleet_id };
        }

        return {
          title,
          key: item.key,
          _title: item.title,
          sound_id: item.sound_id,
          sound_path: item.sound_path
        };
      });
      // console.log(loop(treeData))
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={this.onChange} />
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(treeData)}
          height={500}
          onSelect={onSelect}
          onCheck={this.onCheck}
          checkedKeys={checkedKeys}
        />
      </div>
    );
  }
}

class Waveform extends React.Component {
  // state = {
  //   value: 1,
  // };

  // handleSlider = value => {
  //   this.setState({ value });
  //   console.log(this.state.value);
  // };

  componentDidMount(){
    var menu = document.getElementById('editMenu');
    document.onclick = function(){
      menu.style.display = 'none'
    }

    var wavesurfer = WaveSurfer.create({
        backgroundColor: 'black',
        container: '#waveform',
        waveColor: '#2ecc71',
        progressColor: '#2ecc71',
        // splitChannels: true,
        cursorColor: '#bdc3c7',
        cursorWidth: 1,
        // barWidth: 2,
        // barHeight: 1, // the height of the wave
        // barGap: 2, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
        barRadius: 3,
        plugins: [
          WaveSurfer.cursor.create({
            showTime: true,
            opacity: 1,
            color: '#bdc3c7',
            customShowTimeStyle: {
                'background-color': '#000',
                color: 'white',
                padding: '2px',
                'font-size': '10px'
            }
          }),
          WaveSurfer.spectrogram.create({
            wavesurfer: wavesurfer,
            container: "#wave-spectrogram",
            labels: true
          }),
          WaveSurfer.regions.create(),
          WaveSurfer.timeline.create({
            height: 20,
            container: "#wave-timeline",
            color: 'red'
          }),
        ]
    });

    wavesurfer.load('123');

    // // Zoom slider
    // var slider = document.querySelector('[data-action="zoom"]');

    // slider.value = wavesurfer.params.minPxPerSec;
    // slider.min = wavesurfer.params.minPxPerSec;
    // // Allow extreme zoom-in, to see individual samples
    // slider.max = 1000;

    // slider.addEventListener('input', function() {
    //     wavesurfer.zoom(Number(this.value));
    // });

    // // // set initial zoom to match slider value
    // wavesurfer.zoom(this.state.value);


    wavesurfer.on('ready', function() {
      wavesurfer.enableDragSelection({
          color: "rgba(112,500,130,0.3)"
      });
      axios({
        url: 'http://47.97.152.219:82/v1/pretreatment/getTips/' + sound_id,
        method: 'GET',        
      }).then(res => {
        console.log(res.data.regions);
        wavesurfer.clearRegions();
        loadRegions(JSON.parse(res.data.regions));
      });
  });
  wavesurfer.on('region-click', function(region, e) {
      e.stopPropagation();
      // Play on click, loop on shift click
      e.shiftKey ? region.playLoop() : region.play();
  });

  wavesurfer.on('region-click', editAnnotation);
  wavesurfer.on('region-in', showNote);
  wavesurfer.on('region-updated', saveRegions);
  // wavesurfer.on('region-removed', saveRegions); 

    /**
     * Save annotations to localStorage.
     */
    function saveRegions() {
      var regions = Object.keys(wavesurfer.regions.list).map(function(id) {
          var region = wavesurfer.regions.list[id];
          return {
              start: region.start,
              end: region.end,
              data: region.data
          };
      })          
      // console.log(regions)
      axios({
        url: 'http://47.97.152.219:82/v1/pretreatment/saveTips',
        method: 'POST',
        data: {"sound_id": sound_id,regions: JSON.stringify(regions)}        
      }).then(res => {
        // console.log(res)
      });
    }


    /**
     * Load regions from localStorage.
     */
    function loadRegions(regions) {
      regions.forEach(function(region) {
          region.color = "rgba(112,500,130,0.3)";
          wavesurfer.addRegion(region);
      });
    }
    /**
    * Display annotation.
    */
    function showNote(region) {
      if (!showNote.el) {
          showNote.el = document.querySelector('#subtitle');
      }
      showNote.el.textContent = region.data.note || '–';
    }

    function editAnnotation(region) {
      var form = document.forms.edit;
      (form.elements.start.value = region.start.toFixed(3)),
      (form.elements.end.value = region.end.toFixed(3));
      form.elements.note.value = region.data.note || '';

      region_now = region;
      
      form.dataset.region = region.id;
    }

    saveRegion.addEventListener('click', function (e){
      // form.style.opacity = 1;
      // console.log(region_now)
      if(region_now != undefined){
        region_now.update({
          start: document.querySelector('#regionStart').value,
          end: document.querySelector('#regionEnd').value,
          data: {
              note: document.querySelector('#regionNote').value
          }
      });
      }
      
      // console.log(region_now);
      saveRegions();
      alert('success save!');
    });

    deleteRegion.addEventListener('click', function(e){
      // form.style.opacity = 0;
      region_now.remove();
      // form.dataset.region = null;
      saveRegions();
    });
    audioDelete.addEventListener('click', function(){
      axios({
        url: 'http://47.97.152.219:82/v1/datamanage/sounds/' + sound_id,
        method: 'delete'
      }).then(res => {
        alert(res.data.msg);
      })
    })


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
    btncopy.addEventListener('click', function(){
      sendEdit(this);
    });
    btncut.addEventListener('click', function(){
      sendEdit(this);
    });
    btndelete.addEventListener('click', function(){
      sendEdit(this);
    });
    btnpaste.addEventListener('click', function(){
      sendEdit(this);
    });

    function sendEdit(node) {
      var operateName = node.getAttribute('id');
      var start = document.querySelector('#regionStart').value
      var end = document.querySelector('#regionEnd').value
      axios({
        url: 'http://47.97.152.219:82/v1/pretreatment/editAudio',
        method: 'POST',
        data: {'operateName': operateName,'start':start, 'end':end,'audio_path': sound_path}        
      }).then(res => {
        alert(res.data.status)
        // console.log(res.data);
        let str = '/var/www/html/seadist';
        let origin_len = region_now.end - region_now.start;
        console.log(origin_len)
        let paste_len = res.data.paste_len/1000;
        if(operateName == 'btnpaste'){         
          // console.log(paste_len - origin_len)
          axios({
            url: 'http://47.97.152.219:82/v1/pretreatment/getTips/' + sound_id,
            method: 'GET',        
          }).then(res => {
            let pre_regions = JSON.parse(res.data.regions)
            // console.log(pre_regions);
            pre_regions.forEach(function(reg) {
              // console.log(reg);
              if(reg.start > region_now.start){
                reg.start = reg.start + paste_len - origin_len;
                reg.end = reg.end + paste_len - origin_len;
              }else if(reg.start == region_now.start && reg.end == region_now.end){
                reg.end = reg.start + paste_len;
              }
            });
            
            // console.log(pre_regions);
            axios({
              url: 'http://47.97.152.219:82/v1/pretreatment/saveTips',
              method: 'POST',
              data: {"sound_id": sound_id,regions: JSON.stringify(pre_regions)}        
            }).then(res => {
              wavesurfer.load(sound_path.replace(str, '.'))
            });
          });
        }else if(operateName == 'btncut' || operateName == 'btndelete'){
          axios({
            url: 'http://47.97.152.219:82/v1/pretreatment/getTips/' + sound_id,
            method: 'GET',        
          }).then(res => {
            let pre_regions = JSON.parse(res.data.regions)
            // console.log(pre_regions);
            console.log(pre_regions);
            let index = 0;
            pre_regions.forEach(function(reg) {
              console.log(reg);
              if(reg.start > region_now.start){
                reg.start = reg.start - origin_len;
                reg.end = reg.end - origin_len;
              }
            });
            pre_regions.forEach(function(reg) {
              console.log(reg);
              if(reg.start == region_now.start && reg.end == region_now.end){
                pre_regions.splice(index, 1);
              }
              index += 1;
            });
            
            
            // console.log(pre_regions);
            axios({
              url: 'http://47.97.152.219:82/v1/pretreatment/saveTips',
              method: 'POST',
              data: {"sound_id": sound_id,regions: JSON.stringify(pre_regions)}        
            }).then(res => {
              wavesurfer.load(sound_path.replace(str, '.'))
            });
          });
        }
   
      });
    }

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

  render() {
    return (
      <div style={{backgroundColor:'#3D3D3D'}}>
        <p id="subtitle" className="text-center text-info">&nbsp;</p>
        <div id='wave-timeline'></div>
        <div id='waveform' style={{backgroundColor:'black'}}>
          <div className="progress progress-striped active" id="progress-bar">
            <div className="progress-bar progress-bar-info" ></div>
          </div>
        </div>
        <div id='wave-spectrogram'></div>
        <div style={{marginTop:10,marginLeft:10,float:'left'}}>
          <Button type='dashed' id='btnLoad' style={{float:'left',marginRight:20}}>加载</Button>
          <Button type='dashed' id='audioDelete' style={{float:'left',marginRight:20}}>删除</Button>
          <Button type='dashed' onClick={this.start} id='btnPlay' style={{fontSize:15}}><PlayCircleOutlined />/<PauseOutlined /></Button>
        </div>
        
      </div>
      );
  }
}


export default () => {
  return (
    <div>
      <Layout>
        <Header style={{height:50,backgroundColor:'#464646',color:'white',borderBottom: "1px solid black"}}>
          <div style={{marginTop: -7,float:'left',border:0,position:'absolute',left:10}} className='header'>
            <TwitterOutlined style={{fontSize:22}} />
            <span style={{width:70,fontSize:22}}> | 水声数据库系统</span>
          </div>
          <div style={{fontSize:22,marginTop:-7,position:'absolute',right:10}}>
            <span>张三 | </span>
            <span style={{marginRight:20}}>数据管理员</span>
            <span><UserOutlined /></span>
          </div>
        </Header>
        <Layout style={{backgroundColor:'#343434'}}>
          <Sider className='side' width={380} style={{height:820}}>
            <div className='sideContainer' style={{height:800}}>
              <div className='mainMenu'>
                <Sidermenu />
              </div>
              <div className='fileMenu'>
                <div className='topMenu' style={{width:220,height:60,marginLeft:30}}>
                  <TopMenu />
                </div>
                <div style={{width:'100%',height:1,backgroundColor:'#2D2D2D'}}></div>
                <div className='fileContainer'>
                  <SearchTree/>
                </div>                
              </div>
            </div>
          </Sider>
          <Content>       
            <div className='rightContent' style={{height:800}}>
              <div className='rightCenter'>
                <h3>数据预处理</h3>
                <div style={{backgroundColor:'white',height:2,width:'100%',marginTop:-5,marginBottom:5}}></div>
                <h3 id='fileName'>从左栏选取文件进行编辑</h3>
                <form name='edit' role='form' style={{marginTop:20,height:32}}>
                  <Input id='regionStart' name='start' autoComplete='off' style={{width:120,float:'left',marginLeft:0}} placeholder='开始时间' /> 
                  <Input id='regionEnd' name='end' autoComplete='off' style={{width:120,float:'left',marginLeft:20}} placeholder='结束时间'/>
                  <Input id='regionNote' name='note' autoComplete='off' style={{width:720,float:'left',marginLeft:20}} placeholder='标签'/>
                </form>
                <div className='showWave'>
                  <Waveform/>
                </div>
              </div>
            </div>
            <div style={{width:150,height:200,position:'absolute',left:0,top:0,zIndex:9,display:'none'}} id='editMenu' className="btn-group-vertical" role='group'>
              <button type="button" className="btn btn-default" id='saveRegion'>保存</button>
              <button type="button" className="btn btn-default" id="deleteRegion">删除标记</button>
              <button type="button" className="btn btn-default" id='btncopy'>复制</button>
              <button type="button" className="btn btn-default" id='btnpaste'>粘贴</button>
              <button type="button" className="btn btn-default" id='btndelete'>删除区域</button>
              <button type="button" className="btn btn-default" id='btncut'>剪切</button>
            </div>
          </Content>
        </Layout>
        
        <Footer>海工小分队</Footer>
      </Layout>
    </div>
  );
}
