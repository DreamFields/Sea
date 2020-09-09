import React,{useState} from 'react';
import './main.less';
import { Menu } from 'antd';
import {Link} from 'umi';
import { UserOutlined, TwitterOutlined, HomeOutlined, MenuUnfoldOutlined, ScissorOutlined, SnippetsOutlined, EditOutlined} from '@ant-design/icons';
import { FileOutlined, HistoryOutlined} from '@ant-design/icons';
import { Layout,Input,Button,Tree,Avatar } from 'antd';
import axios from 'axios';
const { Header, Sider, Footer, Content } = Layout;

const { SubMenu } = Menu;
const { Search } = Input;

class Sidermenu extends React.Component {
  handleClick = e => {
    // console.log('click ', e);
  };

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 80,backgroundColor:'#2D2D2D',borderBottomLeftRadius:5,borderTopLeftRadius:5 }}
        defaultSelectedKeys={['1']}
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

// console.log(treeData_);

// const FileTree = () => {
//   const [expandedKeys, setExpandedKeys] = useState([]);
//   const [checkedKeys, setCheckedKeys] = useState([]);
//   const [selectedKeys, setSelectedKeys] = useState([]);
//   const [autoExpandParent, setAutoExpandParent] = useState(true);

//   const onExpand = expandedKeys => {
//     console.log('onExpand', expandedKeys);
//     // if not set autoExpandParent to false, if children expanded, parent can not collapse.
//     // or, you can remove all expanded children keys.
//     setExpandedKeys(expandedKeys);
//     setAutoExpandParent(false);
//   };

//   const onCheck = checkedKeys => {
//     console.log('onCheck', checkedKeys);
//     setCheckedKeys(checkedKeys);
//   };

//   const onSelect = (selectedKeys, info) => {
//     console.log('onSelect', info['node']['key']);
//     setSelectedKeys(selectedKeys);
//   };

//   return (
//     <Tree
//       checkable
//       defaultExpandAll
//       onExpand={onExpand}
//       expandedKeys={expandedKeys}
//       autoExpandParent={autoExpandParent}
//       onCheck={onCheck}
//       checkedKeys={checkedKeys}
//       onSelect={onSelect}
//       selectedKeys={selectedKeys}
//       treeData={treeData}
//       height={500}
//       style={{marginTop:10}}
//       draggable
//     />
//   );
// };


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
      console.log('onSelect', info['node']);
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
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
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

const MainContent = () => {
  return(
    <div className='rightContent'>
      <div style={{width: 1040,marginLeft:20,height:270,background:'#2F2F2F',marginTop:15}}>
        <div className="userDiv">
          <Avatar size={90} style={{ color:'#f56a00',backgroundColor: '#fde3cf',fontSize:40,marginLeft: 55,marginTop: 20}}>ZS</Avatar>
          <div style={{width:'100%',textAlign:'center',fontSize: 20,marginTop:20}}>张三</div>
          <div style={{width:'100%',textAlign:'center',fontSize: 15,marginTop:20}}>数据管理员</div>
        </div>
        <div style={{width:820,height:'100%',backgroundColor:'#292929',float:'left',marginLeft:20,borderRadius:5}}></div>
      </div>
      <div style={{width: 1040,marginLeft:20,height:350,marginTop:30}}>
        <div style={{backgroundColor:'#AE7CDF',marginLeft:0}} className='featuresDiv'>
          <div style={{float:'left',fontSize:80,marginTop:15,marginLeft:63}}><UserOutlined /></div>
          <div style={{float:'left',fontSize:25,marginTop:60,marginLeft:10}}><span>权限管理</span></div>
        </div>
        <Link to='/audioImport'>
        <div style={{backgroundColor:'#77A5D5'}} className='featuresDiv'>                 
          <div style={{float:'left',fontSize:80,marginTop:15,marginLeft:63}}><MenuUnfoldOutlined /></div>
          <div style={{float:'left',fontSize:25,marginTop:60,marginLeft:10}}><span>数据管理</span></div>
        </div>
        </Link>
        <Link to='/audioEdit'>
          <div style={{backgroundColor:'#94BF7A'}} className='featuresDiv'>
            <div style={{float:'left',fontSize:80,marginTop:15,marginLeft:54}}><ScissorOutlined /></div>
            <div style={{float:'left',fontSize:25,marginTop:60,marginLeft:10}}><span>数据预处理</span></div>
          </div>
        </Link>           
        <Link to='/features'>
        <div style={{backgroundColor:'#DDCB76',marginTop:20,marginLeft:0}} className='featuresDiv'>
          <div style={{float:'left',fontSize:80,marginTop:15,marginLeft:42}}><SnippetsOutlined /></div>
          <div style={{float:'left',fontSize:25,marginTop:60,marginLeft:10}}><span>目标特征提取</span></div>
        </div>
        </Link>
        <Link to='/'>
          <div style={{backgroundColor:'#D44444',marginTop:20}} className='featuresDiv' >
            <div style={{float:'left',fontSize:80,marginTop:15,marginLeft:42}}><EditOutlined /></div>
            <div style={{float:'left',fontSize:25,marginTop:60,marginLeft:10}}><span>数据质量评价</span></div>
          </div>
        </Link>               
        <div style={{backgroundColor:'#F79C32',marginTop:20}} className='featuresDiv'>
          <div style={{float:'left',fontSize:80,marginTop:15,marginLeft:63}}><UserOutlined /></div>
          <div style={{float:'left',fontSize:25,marginTop:60,marginLeft:10}}><span>听音训练</span></div>
        </div>
      </div>
    </div>
  )
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
                  {/* <Input placeholder="请输入目标名称" style={{width: 170,marginLeft:10}} />
                  <Button type='primary' style={{marginLeft:10}}>搜索</Button>
                  <FileTree/> */}
                  <SearchTree/>
                </div>                
              </div>
            </div>
          </Sider>
          <Content>       
            <MainContent/>
          </Content>
        </Layout>
        
        <Footer>海工小分队</Footer>
      </Layout>
    </div>
  );
}
