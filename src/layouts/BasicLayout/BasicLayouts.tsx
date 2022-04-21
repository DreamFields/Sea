import React, { useState, useEffect } from 'react';
import QuestionSider from './QuestionSider';
import './BasicLayouts.css';
import {
  Menu,
  List,
  Card,
  Modal,
  Form,
  Spin,
  message,
  Drawer,
  Select,
  Dropdown,
  Layout,
  Input,
  Button,
  Avatar,
  Tooltip,
  Popover,
} from 'antd';
import { Link, connect, Dispatch, history } from 'umi';
import {
  UserOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  RobotOutlined,
  EditOutlined,
} from '@ant-design/icons';
import CookieUtil from '@/utils/cookie.js';
import request from '@/utils/request';
import moment from 'moment';
import topLogo from '@/assets/top-logo.png';
import bottomLogo from '@/assets/bottom-logo.png';
import { getRole, getName } from '@/utils/util';
import StuQuestionSider from '@/layouts/BasicLayout/StuQuestionSider';
import AddSound from './components/addSound';
import ChangePasswordModal from './components/changePasswordModal';
import ChangeNicknameModal from './components/changeNicknameModal';

const { Header, Sider, Footer, Content } = Layout;

const { Option } = Select;
const { Search } = Input;

const alltype = {
  name_date: '时间或文件名',
  stype: '声音类型',
  fname: '目标舷号',
  depth: '深度',
  power_engine: '引擎',
  propeller: '螺旋桨',
  country: '国家',
  rn: '辐射噪声目标类别',
  te: '目标回声目标类别',
  ap: '主动脉冲目标类别',
  as: '主动脉冲声呐类型',
  platform: '平台',
  ts: '任务源',
  location: '位置',
  ct: '采集时间',
  distance: '目标距离',
  speed: '航速',
  water: '水上水下',
  pm: '主机',
  am: '辅机',
};

const searchTip = (
  <div>
    注：搜索框为空时点击搜索将获取所有文件
    <br />
    <b style={{ color: 'cyan' }}>特殊搜索类型示例</b>
    <br />
    声音类型(辐射噪声1，目标回声2，主动脉冲3)：1
    <br />
    螺旋桨(轴数_叶数_转速)：3_6_10
    <br />
    日期(年-月-日)：2020-01-01
  </div>
);

interface BasicLayoutsContentProps {
  dispatch: Dispatch;
  sound_list: any;
  soundListLoading: boolean;
  // loading: boolean;
  overflowType: string;
}
/*
let overf = 'auto';
export function setOverFlowHidden() { 

} 

export function setOverFlowAuto() { 
  overf = 'auto';
  console.log("auto");
  //setoverf('auto');
} 
*/

const BasicLayouts: React.FC<BasicLayoutsContentProps> = (props: any) => {
  const {
    dispatch,
    sound_list,
    soundListLoading,
    searchListLoading,
    train,
    location,
    overflowType,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'soundList/fetchSoundList',
    });
    dispatch({
      type: 'soundList/refreshOverflowType',
      payload: {
        overflowType: 'auto',
      },
    });
    console.log(overflowType);
    return () => {};
  }, [1]);

  // useEffect(() => {
  //   if (sound_list) {
  //     console.log('sound_list', sound_list);
  //   }
  // }, [sound_list]);

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

  const [sumForm] = Form.useForm();
  const [loading, setloading] = useState(false);

  // 左侧点击查看后弹出的抽屉
  const Actions = ({ id, setvisible, setaudioID }) => {
    const load = (item: any) => {
      // console.log("details", item);
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
        // console.log(item);
        dispatch({
          type: 'features/setAudio',
          payload: {
            audio_id: item.id,
            audio_name: item.name,
            signal_type: item.signal_type,
          },
        });
      } else if (location.pathname === '/audioImport') {
        console.log('sound_list_specific_data', item);
        dispatch({
          type: 'inforImport/setInfor',
          payload: item,
        });
      } else if (location.pathname === '/targetRecognition') {
        dispatch({
          type: 'target/setAudio',
          payload: {
            audio_id: item.id,
            audio_name: item.name,
          },
        });
      } else if (location.pathname === '/qualityJudge') {
        dispatch({
          type: 'qualityJudge/setAudio',
          payload: {
            audio_id: item.id,
            audio_name: item.name,
          },
        });
      } else {
        message.error('请在音频整编，特征提取或质量评价界面加载音频！');
      }
    };

    return (
      <>
        <Button
          onClick={() => {
            setvisible(true);
            setaudioID(id);
          }}
          style={{ width: '50%' }}
        >
          查看
        </Button>
        {/* 通过在layout中dispatch页面中的effect达到传递参数并重新渲染页面的效果 */}
        <Button
          onClick={() => {
            dispatch({
              type: 'soundList/getAudioInforById',
              payload: { id: id },
              setitem: load,
            });
            // 清除功率谱数据
            dispatch({
              type: 'power/setdata',
              payload: {
                y_data: [],
                x_data: [],
                ot_x_data: [],
                ot_y_data: [],
                label: 0,
              },
            });
            //清除过零率数据
            dispatch({
              type: 'Zero_crossing/savedata',
              payload: {
                data: [],
                all_x_data: [],
                label: 0,
              },
            });
            //清除调质谱数据
            dispatch({
              type: 'data_demon/savedata',
              payload: {
                ydata: [],
                xdata: [],
                label: 0,
                shade: '',
                blades: 0,
              },
            });
            //清除低频线谱数据
            dispatch({
              type: 'lofar_v1/savedata',
              payload: {
                data: [],
                // 所有横坐标数据
                all_x_data: [],
                //所有纵坐标数据
                all_y_data: [],
                //所有最大值数据
                all_max_value: [],
                //所有最小值数据
                all_min_value: [],
                // 当前帧
                label: -2,
              },
            });
            //清除调制谱列表数据
            dispatch({
              type: 'demonTable/setdata',
              payload: {},
              callback: (state) => {
                let copy_data = [];
                return { tabledata: copy_data };
              },
            });
            //清除叶片数提交数据
            dispatch({
              type: 'bladesUpload/setdata',
              payload: {},
              callback: (state) => {
                return { blades: 0, shade: '' };
              },
            });
            //清除低频线谱谱列表数据
            dispatch({
              type: 'demon_analysis2/savedata',
              payload: {
                data: [],
                // 所有横坐标数据
                all_x_data: [],
                //所有纵坐标数据
                all_y_data: [],
                //所有最大值数据
                all_max_value: [],
                //所有最小值数据
                all_min_value: [],
                // 当前帧
                label: -2,
              },
            });
            //清除调制谱2数据
            dispatch({
              type: 'demon_analysis2/setdata',
              payload: {},
              callback: (state) => {
                let copy_data = [];
                return { tabledata: copy_data };
              },
            });
            //清楚时频图列表数据
            dispatch({
              type: 'MelTable/setdata',
              payload: {},
              callback: (state) => {
                return {
                  tabledata1: [
                    {
                      key: '1',
                      frequency: undefined,
                      echo_width: undefined,
                      echo_length: undefined,
                    },
                  ],
                  tabledata2: [
                    {
                      key: '1',
                      frequency: undefined,
                      signal_type: undefined,
                      pulse_cycle: undefined,
                      pulse_width: undefined,
                    },
                  ],
                };
              },
            });
            dispatch({
              type: 'basicSoundData/setdata',
              payload: {
                db: 0,
                hz: 0,
                calc: 0,
                mean: 0,
                va: 0,
                sc: 0,
                scw: 0,
                sa: 0,
                ss: 0,
                sd: 0,
                si: 0,
                su: 0,
                se: 0,
                label: 0,
                rpm: 0,
                // 轴数
                axle: 0,
              },
            });
          }}
          style={{ width: '50%' }}
        >
          加载
        </Button>
      </>
    );
  };

  const InforDrawer = ({ id, visible, setvisible }) => {
    const [item, setitem] = useState(undefined as any);

    useEffect(() => {
      // console.log("audioID", id);
      if (id && visible === true) {
        dispatch({
          type: 'soundList/getAudioInforById',
          payload: { id: id },
          setitem: setitem,
        });
      }
      return () => {};
    }, [visible]);

    useEffect(() => {
      // console.log("detail", item);
      if (item) {
        if (visible) {
          // console.log('sound_data', item);
          sumForm.resetFields();
          sumForm.setFieldsValue({
            ...item,
            collect_d: item.collect_time
              ? moment(item.collect_time?.split(' ')[0], 'YYYY/MM/DD')
              : undefined,
            collect_t: item.collect_time
              ? moment(item.collect_time?.split(' ')[1], 'HH:mm:ss')
              : undefined,
            shaft_blade_rotationl: `${item.shaft_count}_${item.blade_count}_${item.rotationl_speed}`,
          });
        }
      }
    }, [item]);

    return (
      <Drawer
        title={item?.name}
        visible={visible}
        // onOk={() => setvisible(false)}
        onClose={() => setvisible(false)}
        placement="left"
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              onClick={() => {
                sumForm.submit();
              }}
              type="primary"
              disabled={CookieUtil.get('role') === '3' ? true : false}
            >
              修改信息
            </Button>
          </div>
        }
        width={1000}
      >
        <AddSound sound_data={item} dispatch={dispatch} sumForm={sumForm} />
      </Drawer>
    );
  };

  // 左侧文件列表
  const SideCardList = () => {
    const [visible, setvisible] = useState(false);
    const [audioID, setaudioID] = useState(undefined);

    return (
      <div
        style={{
          overflowY: 'auto',
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
        }}
      >
        <Spin spinning={soundListLoading || loading}>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={sound_list}
            renderItem={(item: any) => {
              return (
                <List.Item>
                  <Tooltip title={item.name}>
                    <Card
                      hoverable={true}
                      title={item.name}
                      style={{
                        width: '92%',
                        marginLeft: '4%',
                        borderColor: '#595959',
                      }}
                    >
                      <Actions
                        id={item.id}
                        setvisible={setvisible}
                        setaudioID={setaudioID}
                      />
                    </Card>
                  </Tooltip>
                </List.Item>
              );
            }}
          />
        </Spin>
        <InforDrawer id={audioID} visible={visible} setvisible={setvisible} />
      </div>
    );
  };

  // 顶部菜单
  const TopMenu = () => {
    return (
      <Menu
        onClick={() => {}}
        defaultSelectedKeys={[props.location.pathname]}
        mode="horizontal"
        style={{ backgroundColor: '#2D2D2D', float: 'left' }}
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">主页</Link>
        </Menu.Item>
        <Menu.Item key="/audioImport" icon={<MenuUnfoldOutlined />}>
          <Link to="/audioImport">音频上传</Link>
        </Menu.Item>
        <Menu.Item key="/audioEdit" icon={<ScissorOutlined />}>
          <Link to="/audioEdit">音频整编</Link>
        </Menu.Item>
        <Menu.Item key="/features" icon={<SnippetsOutlined />}>
          <Link to="/features">特征提取</Link>
        </Menu.Item>
        <Menu.Item key="/qualityJudge" icon={<EditOutlined />}>
          <Link to="/qualityJudge">质量评价</Link>
        </Menu.Item>
        <Menu.Item key="/exam" icon={<UserOutlined />}>
          <Link
            to={getRole() === '学员' ? '/studentTraining' : 'teacherTraining'}
          >
            听音训练
          </Link>
        </Menu.Item>
        <Menu.Item key="/targetRecognition" icon={<RobotOutlined />}>
          <Link to="/targetRecognition">分类识别</Link>
        </Menu.Item>
        {/* <Menu.Item key="/soundsExport" icon={<EditOutlined />}>
          <Link to="/soundsExport">音频导出</Link>
        </Menu.Item> */}
      </Menu>
    );
  };

  // 头像下拉菜单
  const menu = (
    <Menu>
      <Menu.Item>
        <ChangeNicknameModal />
      </Menu.Item>
      <Menu.Item>
        <ChangePasswordModal />
      </Menu.Item>
      <Menu.Item>
        <a
          onClick={() => {
            CookieUtil.unsetAll();
            history.push('/user/login');
          }}
        >
          退出登录
        </a>
      </Menu.Item>
    </Menu>
  );

  // 文件栏搜索组件
  const AllSearch = () => {
    const [searchtype, setsearchtype] = useState('name_date');

    const handleChange = (value) => {
      // console.log(`selected ${value}`);
      setsearchtype(value);
    };

    const handleSearch = (e) => {
      console.log(e);
      if (e) {
        console.log('searchtype', searchtype);
        setloading(true);
        dispatch({
          type: `soundList/searchBy${searchtype}`,
          payload: { info: e },
        }).then(() => {
          setloading(false);
        });
      } else {
        dispatch({
          type: 'soundList/fetchSoundList',
        });
      }
    };

    return (
      <div style={{ marginTop: 16, overflow: 'hidden' }}>
        <Select
          value={searchtype}
          style={{ width: 130, float: 'left' }}
          onChange={handleChange}
        >
          {Object.keys(alltype).map((item) => (
            <Option value={item} key={item}>
              {alltype[item]}
            </Option>
          ))}
        </Select>
        <Popover title="提示" content={searchTip}>
          <Search
            placeholder="输入关键字搜索文件"
            onSearch={handleSearch}
            enterButton
            style={{ float: 'left', width: 220 }}
            // disabled
          />
        </Popover>
      </div>
    );
  };

  return (
    <div>
      <Layout>
        <Header style={{ backgroundColor: '#2D2D2D', zIndex: 999, height: 66 }}>
          <div className="logo">
            <img src={topLogo} alt="水声系统" style={{ width: 60 }} />
            <b>水声工程</b>
          </div>

          <TopMenu />

          <div style={{ float: 'right' }}>
            <Dropdown overlay={menu} placement="bottomRight">
              <Avatar
                size={48}
                style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
          {
            <div className="info">
              <span
                style={{
                  display: CookieUtil.get('role') == 1 ? 'inline' : 'none',
                }}
              >
                <Link to="/staffManage">用户管理 </Link>|
              </span>
              <span>{` 欢迎您回来，${getName()}`}</span>
            </div>
          }
        </Header>
        <Layout style={{ backgroundColor: '#343434' }}>
          {!train && (
            <Sider className="side" width={350}>
              <AllSearch />
              <div className="fileContainer">
                <SideCardList />
              </div>
            </Sider>
          )}
          {train && getRole() !== '学员' && <QuestionSider />}
          {train && getRole() === '学员' && <StuQuestionSider />}
          <Content style={{ overflow: overflowType }} className="main-content">
            {props.children}
          </Content>
        </Layout>

        <Footer
          style={{
            backgroundColor: '#292929',
            textAlign: 'center',
            padding: '12px 50px',
          }}
        >
          <div style={{ margin: '0 auto', width: 240, fontSize: 20 }}>
            <img
              src={bottomLogo}
              alt="海军工程大学"
              style={{ width: 70, marginRight: 16 }}
            />
            <b>海军工程大学</b>
          </div>
        </Footer>
      </Layout>
    </div>
  );
};

const mapStateToProps = ({ loading, soundList }) => {
  /*console.log('1',loading);
  console.log('2',soundList);
  console.log('3',inforImport);
  console.log('4',overflow);*/

  return {
    overflowType: soundList.overflowType,
    soundListLoading: loading.effects['soundList/fetchSoundList'],
    sound_list: soundList.sound_list,
  };
};

export default connect(mapStateToProps)(BasicLayouts);
