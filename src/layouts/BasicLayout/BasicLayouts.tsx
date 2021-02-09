import React, { useState, useEffect } from 'react';
import request from '@/utils/request';
import './BasicLayouts.css';
import {
  Menu,
  List,
  Card,
  Modal,
  Form,
  InputNumber,
  Spin,
  message,
} from 'antd';
import { Link, connect, Dispatch } from 'umi';
import {
  UserOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  EditOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { FileOutlined, HistoryOutlined } from '@ant-design/icons';
import { Layout, Input, Button, Tree, Avatar } from 'antd';
import logo from '@/assets/sea-white-logo.png';
import CookieUtil from '@/utils/cookie.js';
import axios from 'axios';
const { Header, Sider, Footer, Content } = Layout;

const { SubMenu } = Menu;
const { Search } = Input;

const pagesHeight = {
  '/': 710,
  '/audioImport': 1030,
  '/audioEdit': 1318,
  '/features': 1093,
  '/targetRecognition': 1093,
};

const listHeight = {
  '/': 582,
  '/audioImport': 892,
  '/audioEdit': 1172,
  '/features': 955,
  '/targetRecognition': 955,
};

interface BasicLayoutsContentProps {
  dispatch: Dispatch;
  sound_list: any;
  soundListLoading: boolean;
  // loading: boolean;
}

const BasicLayouts: React.FC<BasicLayoutsContentProps> = (props: any) => {
  const {
    dispatch,
    sound_list,
    soundListLoading,
    searchListLoading,
    location,
  } = props;

  // console.log('searchListLoading', searchListLoading)

  useEffect(() => {
    dispatch({
      type: 'soundList/fetchSoundList',
    });
    return () => {};
  }, [1]);

  useEffect(() => {
    if (sound_list) {
      console.log('sound_list', sound_list);
    }
  }, [sound_list]);

  useEffect(() => {
    dispatch({
      type: 'pretreatment/setAudio',
      payload: {
        audio_id: undefined,
        audio_name: undefined,
        audio_versions: undefined,
        tips: undefined,
      },
    });
    dispatch({
      type: 'features/setAudio',
      payload: {
        audio_id: undefined,
        audio_name: undefined,
      },
    });
    dispatch({
      type: 'target/setAudio',
      payload: {
        audio_id: undefined,
        audio_name: undefined,
      },
    });
  }, [location]);

  const InforModal = ({ item }) => {
    const [visible, setvisible] = useState(false);
    // const [data, setData] = useState(undefined);
    const [type, settype] = useState('');
    const [normal, setnormal] = useState(undefined);
    const [fleet, setfleet] = useState(undefined);
    const [collect, setcollect] = useState(undefined);
    let _normal: any;
    let _fleet: any;
    let _collect: any;

    useEffect(() => {
      // console.log(document.cookie);
      console.log(item?.pictures);
      if (item?.pictures.length > 0) {
        request(`/v1/file/audio_url/${item?.pictures[0].filename}`, {
          method: 'get',
        }).then((res) => {
          console.log(res);
        });
      }

      if (item) {
        if (item.target_type_str) {
          switch (item.target_type_str) {
            case '主动脉冲':
              settype('ap_type');
              _normal = {
                target_type_str: item.target_type_str,
              };
              setnormal(_normal);
              _fleet = {
                ap_type: item.fleet_detail.ap_type?.name,
                as_type: item.fleet_detail.as_type?.name,
                country: item.fleet_detail.country?.label,
                name: item.fleet_detail.name,
              };
              setfleet(_fleet);
              _collect = item.target_information;
              setcollect(_collect);
              break;
            case '辐射噪声':
              settype('rn_type');
              _normal = {
                target_type_str: item.target_type_str,
                power_engine: item.power_engine?.name,
                shaft_count: item.propeller?.shaft_count,
                blade_count: item.propeller?.blade_count,
              };
              setnormal(_normal);
              _fleet = {
                rn_type: item.fleet_detail.rn_type?.name,
                country: item.fleet_detail.country?.label,
                name: item.fleet_detail.name,
              };
              setfleet(_fleet);
              _collect = item.target_information;
              setcollect(_collect);
              break;
            case '目标回声':
              settype('te_type');
              _normal = {
                target_type_str: item.target_type_str,
                power_engine: item.power_engine?.name,
                shaft_count: item.propeller?.shaft_count,
                blade_count: item.propeller?.blade_count,
              };
              setnormal(_normal);
              _fleet = {
                te_type: item.fleet_detail.te_type?.name,
                country: item.fleet_detail.country?.label,
                name: item.fleet_detail.name,
              };
              setfleet(_fleet);
              _collect = item.target_information;
              setcollect(_collect);
              break;
            default:
              break;
          }
        }
      }
      return () => {};
    }, [1]);

    const ShowForm: React.FC<{
      normal: any;
      fleet: any;
      collect: any;
    }> = (showProps) => {
      const { normal, fleet, collect } = showProps;

      return (
        <>
          <Form
            name="normal"
            initialValues={normal}
            labelAlign="right"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item name="target_type_str" label="目标分类">
              <Input />
            </Form.Item>
            {item.target_type_str === '主动脉冲' ? null : (
              <>
                <Form.Item name="power_engine" label="动力装置">
                  <Input />
                </Form.Item>
                {item.target_information === '目标回声' ? null : (
                  <>
                    <Form.Item name="shaft_count" label="轴数">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item name="blade_count" label="叶数">
                      <InputNumber />
                    </Form.Item>
                  </>
                )}
              </>
            )}
          </Form>

          <Form
            name="fleet"
            initialValues={fleet}
            labelAlign="right"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item name={type} label="船舰类型">
              <Input />
            </Form.Item>
            {item.target_type_str !== '主动脉冲' ? null : (
              <>
                <Form.Item name="as_type" label="主动声纳类型">
                  <Input />
                </Form.Item>
              </>
            )}
            <Form.Item name="country" label="国别">
              <Input />
            </Form.Item>
            <Form.Item name="name" label="名称">
              <Input />
            </Form.Item>
          </Form>

          <Form
            name="collect"
            initialValues={collect}
            labelAlign="right"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item name="collect_time_str" label="采集时间">
              <Input />
            </Form.Item>
            <Form.Item name="collect_platform" label="采集平台">
              <Input />
            </Form.Item>
            <Form.Item name="location" label="采集位置">
              <Input />
            </Form.Item>
            <Form.Item name="depth_str" label="采集深度">
              <InputNumber />
            </Form.Item>
            <Form.Item name="task_source" label="采集任务源">
              <Input />
            </Form.Item>
          </Form>
        </>
      );
    };

    return (
      <>
        <Modal
          title={item.name}
          visible={visible}
          onOk={() => setvisible(false)}
          onCancel={() => setvisible(false)}
          okText="确认"
          cancelText="取消"
        >
          {item?.target_type_str ? (
            <ShowForm normal={normal} fleet={fleet} collect={collect} />
          ) : null}
        </Modal>
        <Button onClick={() => setvisible(true)} style={{ width: '50%' }}>
          查看
        </Button>
        {/* 通过在layout中dispatch页面中的effect达到传递参数并重新渲染页面的效果 */}
        <Button
          onClick={() => {
            if (location.pathname === '/audioEdit') {
              dispatch({
                type: 'pretreatment/setAudio',
                payload: {
                  audio_id: item.id,
                  audio_name: item.name,
                  audio_versions: undefined,
                },
              });
            } else if (location.pathname === '/features') {
              dispatch({
                type: 'features/setAudio',
                payload: {
                  audio_id: item.id,
                  audio_name: item.name,
                },
              });
            } else if (location.pathname === '/audioImport') {
              dispatch({
                type: 'inforImport/setInfor',
                payload: { ...normal, ...collect, ...fleet },
              });
            } else if (location.pathname === '/targetRecognition') {
              dispatch({
                type: 'target/setAudio',
                payload: {
                  audio_id: item.id,
                  audio_name: item.name,
                },
              });
            } else {
              message.error('请在音频编辑或者特征提取界面加载音频！');
            }
          }}
          style={{ width: '50%' }}
        >
          加载
        </Button>
      </>
    );
  };

  const SideCardList = () => {
    return (
      <div
        style={{
          overflowY: 'auto',
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
        }}
      >
        <Spin
          spinning={
            soundListLoading || (searchListLoading ? searchListLoading : false)
          }
        >
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={sound_list}
            renderItem={(item: any) => {
              return (
                <List.Item>
                  <Card
                    title={item.name}
                    style={{
                      width: '92%',
                      marginLeft: '4%',
                      borderColor: '#595959',
                    }}
                  >
                    <InforModal item={item} />
                  </Card>
                </List.Item>
              );
            }}
          />
        </Spin>
      </div>
    );
  };

  class Sidermenu extends React.Component {
    handleClick = (e) => {
      // console.log('click ', e);
    };

    render() {
      return (
        <Menu
          onClick={this.handleClick}
          style={{
            width: 80,
            backgroundColor: '#2D2D2D',
            borderBottomLeftRadius: 5,
            borderTopLeftRadius: 5,
          }}
          defaultSelectedKeys={[props.location.pathname]}
          mode="inline"
        >
          <Menu.Item key="/">
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item key="/audioImport">
            <Link to="/audioImport">
              <MenuUnfoldOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item key="/audioEdit">
            <Link to="/audioEdit">
              <ScissorOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item key="/features">
            <Link to="/features">
              <SnippetsOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item key="5" disabled>
            <EditOutlined />
          </Menu.Item>
          <Menu.Item key="/targetRecognition">
            <Link to="/targetRecognition">
              <RobotOutlined />
            </Link>
          </Menu.Item>
        </Menu>
      );
    }
  }

  class TopMenu extends React.Component {
    handleClick = (e) => {
      // console.log('click ', e);
    };

    render() {
      return (
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={['file']}
          mode="horizontal"
          style={{ backgroundColor: '#2D2D2D' }}
        >
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

  const handleSearch = (e) => {
    console.log(e);
    if (e) {
      dispatch({
        type: 'soundList/searchSoundList',
        payload: { id: e },
      }).then(() => {});
    } else {
      dispatch({
        type: 'soundList/fetchSoundList',
      }).then(() => {});
    }
  };

  return (
    <div>
      <Layout>
        <Header
          style={{
            height: 50,
            backgroundColor: '#464646',
            color: 'white',
            borderBottom: '1px solid black',
          }}
        >
          <div className="logo">
            {/* <TwitterOutlined style={{fontSize:22}} /> */}
            <div
              style={{ height: 45, width: 45, marginTop: -10, marginLeft: -35 }}
            >
              <img src={logo} style={{ height: 45, width: 45 }} />
            </div>
            <span
              style={{
                width: 250,
                fontSize: 22,
                marginTop: -8,
                marginLeft: -30,
              }}
            >
              {' '}
              | 水声数据库系统
            </span>
            <div
              style={{
                fontSize: 22,
                marginTop: -7,
                position: 'absolute',
                right: 10,
              }}
            >
              <span>张三 | </span>
              <span style={{ marginRight: 20 }}>数据管理员</span>
              <span style={{ marginLeft: -15, fontSize: 25 }}>
                <Link to="/user/login">
                  <UserOutlined />
                </Link>
              </span>
            </div>
          </div>
        </Header>
        <Layout style={{ backgroundColor: '#343434' }}>
          <Sider
            className="side"
            width={'25%'}
            style={{ height: pagesHeight[location.pathname] }}
          >
            <div className="sideContainer">
              <div className="mainMenu">
                <Sidermenu />
              </div>
              <div className="fileMenu">
                <div
                  className="topMenu"
                  style={{ width: 220, height: 60, marginLeft: 30 }}
                >
                  <TopMenu />
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#2D2D2D',
                  }}
                ></div>
                <Search
                  placeholder="输入关键字"
                  onSearch={handleSearch}
                  enterButton
                />
                <div
                  className="fileContainer"
                  style={{ height: listHeight[location.pathname] }}
                >
                  <SideCardList />
                </div>
              </div>
            </div>
          </Sider>
          <Content>{props.children}</Content>
        </Layout>

        <Footer style={{ backgroundColor: '#2f2f2f' }}>海工小分队</Footer>
      </Layout>
    </div>
  );
};

const mapStateToProps = ({ loading, soundList }) => {
  // console.log(loading)
  return {
    soundListLoading: loading.effects['soundList/fetchSoundList'],
    searchListLoading: loading.effects['soundList/searchSoundList'],
    sound_list: soundList.sound_list,
  };
};

export default connect(mapStateToProps)(BasicLayouts);
