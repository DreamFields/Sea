import React,{useState} from 'react';
import '../main.less';
import '../audioEdit/edit.less';
import { Menu } from 'antd';
import {Link, connect} from 'umi';
import { UserOutlined, TwitterOutlined, HomeOutlined, MenuUnfoldOutlined, ScissorOutlined, SnippetsOutlined, EditOutlined} from '@ant-design/icons';
import { FileOutlined, HistoryOutlined} from '@ant-design/icons';
import { Layout,Input,Button,Tree,Popconfirm, Select } from 'antd';
import { Upload, message, Modal, Form } from 'antd';
import { Table, Tag, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Header, Sider, Footer, Content } = Layout;

const { Search,TextArea } = Input;
const { SubMenu } = Menu;
const { Dragger } = Upload;
const { Option } = Select;

let fleet_id_now = 9999;

class Sidermenu extends React.Component {
  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 80,backgroundColor:'#2D2D2D',borderBottomLeftRadius:5,borderTopLeftRadius:5 }}
        defaultSelectedKeys={['2']}
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
// console.log(treeData)


const index = ({fleets, dispatch}) => {
  const uploadprops = {
    name: 'file',
    accept: '.wav',
    multiple: true,
    action: 'http://47.97.152.219:82/upload',
    data: {'fleet_name': ''},
    showUploadList: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        // console.log(info.file.response);
        if(info.file.response == 'target not exists!'){
          message.error('目标船舰不存在!');
        }else if (info.file.response == 'please choose target!') {
          alert('请选择目标!');
        }else{
          let sound_infor = info.file.response;
          // console.log("fleet_id: "+fleet_id_now);
          // console.log(sound_infor);
          axios({
            url: "http://47.97.152.219:82/v1/datamanage/upload",
            method: "POST",
            data: {
              fleet_id: fleet_id_now,
              sound_name: sound_infor['name'],
              sound_path: sound_infor['path'],
            }
          }).then(res => {
            message.success(`${info.file.name} 文件上传成功.`);
            dispatch({
              type: 'fleets/getRemote',
            });
          })
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`);
      }
    },
  };


  //添加弹出框
  class Add extends React.Component {
    state = { visible: false, fleetType: '小航空母舰' };
  
    showModal = () => {
      this.setState({
        visible: true,
      });
    };
  
    handleOk = e => {
      // console.log(e);
      // alert(document.querySelector('#fleet_name').value);
      axios({
        url: 'http://47.97.152.219:82/create_fleet',
        method: 'POST',
        data: {'fleet_name': document.querySelector('#fleet_name').value}        
      }).then(res => {
        alert(res.data)
      });
      axios({
        url: 'http://47.97.152.219:82/v1/datamanage/fleets',
        method: 'POST',
        data: {'fleet_name': document.querySelector('#fleet_name').value,
        "fleet_type": this.state.fleetType,
        "fleet_description": document.querySelector('#fleet_des').value}        
      }).then(res => {
        message.success('创建成功！')
        dispatch({
          type: 'fleets/getRemote',
        });
      }); 
      this.setState({
        visible: false,
      });
    };
  
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };

    handleSelect = value => {
      this.setState({fleetType: value})
    }
  
    render() {
      return (
        <>
          <Button type="dashed" onClick={this.showModal}>
            添加目标
          </Button>
          <Modal
            title="添加目标 "
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Input placeholder="目标名称"  id='fleet_name'/>
            <Select placeholder="目标类别"  id='fleet_type' onChange={this.handleSelect} style={{marginTop: 20, width:'100%'}}>
              <Option value="大航空母舰">大航空母舰</Option>
              <Option value="小航空母舰">小航空母舰</Option>
              <Option value="中航空母舰">中航空母舰</Option>
              <Option value="大小航空母舰">大小航空母舰</Option>
            </Select>
            <TextArea rows={4} placeholder="说明" style={{marginTop: 20}} id='fleet_des' />
          </Modal>
        </>
      );
    }
  }

  let treeData = []
  if(fleets.treeData != undefined){
    treeData = fleets.treeData
  }

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
        document.querySelector('#targetName').innerHTML = info['node']['_title'];
        uploadprops.data.fleet_name = info['node']['_title'];
        // setSelectedKeys(selectedKeys);
        fleet_id_now = info['node']['fleet_id'];
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


  const MainContent = () => {
    const [ModalVisble, setModalVisble] = useState(false);
    const [Record, setRecord] = useState(undefined);
    const [FleetType, setFleetType] = useState(undefined);

    const [form] = Form.useForm();
    // console.log(fleets)
    // console.log(props);
    function cancelDelete(e) {
      console.log(e);
      message.error('Cancel');
    }
    
    const confirmDelete = record => {
      console.log('record', record)
      axios({
        url: 'http://47.97.152.219:82/delete_fleet',
        method: 'POST',
        data: {'fleet_name': record.fleet_name}        
      }).then(res => {
        console.log(res.data)
      });
      dispatch({
        type: 'fleets/delete',
        payload: {
          id: record.id,
        },
      });
    }
    

    const handleEdit = record => {
      console.log('record ', record);
      setModalVisble(true);
      // document.getElementById("fleet_edit_name").value = record.fleet_name
      form.setFieldsValue(record);
      setRecord(record);
      setFleetType(record.fleet_type_name);
    }
    
    const columns = [
      {
        title: '目标编号',
        dataIndex: 'id',
        key: 'id',
        render: fleet_id => <a>{fleet_id}</a>,
      },
      {
        title: '目标名称',
        dataIndex: 'fleet_name',
        key: 'fleet_name',
      },
      {
        title: '目标类别',
        dataIndex: 'fleet_type_name',
        key: 'fleet_type_name',
      },
      {
        title: '说明',
        key: 'description',
        dataIndex: 'description',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={() => {handleEdit(record)}}>编辑</a>
            <Popconfirm
              title="Are you sure delete this task?"
              onConfirm={() => confirmDelete(record)}
              onCancel={cancelDelete}
              okText="是"
              cancelText="否"
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  
    let data=[]
    if (fleets.targetData != undefined){
      // console.log(fleets.targetData);
      data = fleets.targetData
    }



    const handleOk = () => {
      if( Record.fleet_name != document.querySelector('#fleet_edit_name').value){
        axios({
          url: 'http://47.97.152.219:82/edit_fleet',
          method: 'post',
          data: {'fleet_old_name' : Record.fleet_name, 'fleet_new_name': document.querySelector('#fleet_edit_name').value}
        }).then( res => {
          console.log('edit_res', res)
        })
      }
      // console.log(FleetType)
      dispatch({
        type: 'fleets/edit',
        payload: {values: { 
          "fleet_id": Record.id,
          "fleet_name": document.querySelector('#fleet_edit_name').value,
          "fleet_type": FleetType,
          "fleet_description": document.querySelector('#fleet_edit_des').value
          }}        
      });
      setModalVisble(false);
    }
  
    const handleCancel = (e) => {
      setModalVisble(false);
    }

    
    const handleSelect = (value) => {
      setFleetType(value);
    }

    return(
      <div className='rightContent'>
          <div className='rightCenter' style={{backgroundColor: '',height:630}}>
              <h3>数据入库</h3>
              <h4 id='targetName'>请在左侧选择目标上传声音文件</h4>
              <div style={{width:'100%',height:200,marginBottom: 50}}>
                  <Dragger {...uploadprops} >
                      <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">单击或将文件拖到该区域以上传</p>
                      <p className="ant-upload-hint">
                      目前仅支持单个文件上传
                      </p>
                  </Dragger>
              </div>
              <Add />
              <Modal
                title="修改目标 "
                visible={ModalVisble}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Form name="edit_fleet" form={form}>
                  <Form.Item name='fleet_name' label="目标名称">
                    <Input placeholder="目标名称"  id='fleet_edit_name' />
                  </Form.Item>
                  <Form.Item name='fleet_type_name' label="目标类别">
                    <Select placeholder="目标类别"  id='fleet_edit_type' onChange={handleSelect}>
                      <Option value="大航空母舰">大航空母舰</Option>
                      <Option value="小航空母舰">小航空母舰</Option>
                      <Option value="中航空母舰">中航空母舰</Option>
                      <Option value="大小航空母舰">大小航空母舰</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name='description' label="目标描述">
                    <TextArea rows={4} placeholder="说明"  id='fleet_edit_des' />
                  </Form.Item>
                </Form> 
              </Modal>
              <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 3}} />
          </div>
      </div>
    )
  }

  return(
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
                  <SearchTree/>
                </div>                
              </div>
            </div>
          </Sider>
          <Content>       
            <MainContent />
          </Content>
        </Layout>
        
        <Footer>海工小分队</Footer>
      </Layout>
    </div>
  )
}

const mapStateToProps = ({fleets}) => {
  // console.log(fleets)
  return{
      fleets
  }
}

export default connect(mapStateToProps)(index);
