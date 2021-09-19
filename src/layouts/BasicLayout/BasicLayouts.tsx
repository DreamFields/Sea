import React, { useState, useEffect } from 'react';
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
  Drawer,
  Row,
  Col,
  TimePicker,
  DatePicker,
  Radio,
  Select,
  Dropdown,
  Image,
  Layout,
  Input,
  Button,
  Avatar,
  Upload,
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
  UploadOutlined,
  EditOutlined,
} from '@ant-design/icons';
import CookieUtil from '@/utils/cookie.js';
import Cookies from 'js-cookie';
import request from '@/utils/request';
import moment from 'moment';
import { SERVICEURL } from '@/utils/const';
const { Header, Sider, Footer, Content } = Layout;

const { Option } = Select;
const { Search } = Input;

const roles = ['管理员', '教员', '学员'];

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
}

const BasicLayouts: React.FC<BasicLayoutsContentProps> = (props: any) => {
  const {
    dispatch,
    sound_list,
    InforImport,
    soundListLoading,
    searchListLoading,
    location,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'soundList/fetchSoundList',
    });
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

  const AddSound: React.FC<{ sound_data: any }> = (props: any) => {
    const { sound_data } = props;
    const [type, settype] = useState(
      sound_data?.signal_type ? sound_data?.signal_type : -1,
    );

    useEffect(() => {
      if (sound_data) {
        settype(sound_data?.signal_type ? sound_data?.signal_type : -1);
      }
    }, [sound_data]);

    // 音频类型单选框
    const TypeRadio = () => {
      const onChange = (e) => {
        // type = e.target.value;
        settype(e.target.value);
        console.log('radio checked', e.target);
        // console.log(sumForm.getFieldsValue());
      };

      return (
        <>
          <Form.Item
            name="signal_type"
            label="信号类型"
            labelAlign="left"
            labelCol={{ span: 2 }}
          >
            <Radio.Group onChange={onChange} value={type}>
              <Radio value={1}>辐射噪声</Radio>
              <Radio value={2}>目标回声</Radio>
              <Radio value={3}>主动脉冲</Radio>
            </Radio.Group>
          </Form.Item>
        </>
      );
    };

    // 辐射噪声特有信息表单
    const RadiationTarget = () => {
      const [value_1, setValue_1] = useState(-1);
      const [value_2, setValue_2] = useState(-1);
      const [visible, setVisible] = useState(false);

      const [form] = Form.useForm();

      const onChange_1 = (e) => {
        console.log('RadiationTarget checked', e.target);
        setValue_1(e.target.value);
      };
      const onChange_2 = (e) => {
        console.log('RadiationTarget checked', e.target);
        setValue_2(e.target.value);
        if (e.target.value === '添加新类别') {
          setVisible(true);
        }
      };

      return (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="is_over_water"
                label="水上水下"
                labelAlign="left"
                labelCol={{ span: 2 }}
              >
                <Radio.Group onChange={onChange_1} value={value_1}>
                  <Radio value={1}>水上</Radio>
                  <Radio value={0}>水下</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="rn_type"
                label="目标类型"
                labelAlign="left"
                labelCol={{ span: 2 }}
              >
                <Radio.Group onChange={onChange_2} value={value_2}>
                  {InforImport.rnType?.map((item) => {
                    return <Radio value={item.rn_type}>{item.rn_type}</Radio>;
                  })}
                  <Radio
                    value={'添加新类别'}
                    style={{
                      display:
                        CookieUtil.get('role') === '3'
                          ? 'none'
                          : 'inline-block',
                    }}
                  >
                    添加新类别
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="country"
                label="国别"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Select style={{ width: 120 }}>
                  {InforImport.country?.map((item) => {
                    return (
                      <Option value={item.country} key={item.country}>
                        {item.country}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fleet_name"
                label="目标舰号或名称"
                rules={[
                  {
                    required: type === 1 ? true : false,
                    message: '请输入目标舰号或名称',
                  },
                ]}
              >
                <Input placeholder="名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="principal_machine"
                label="主机"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="auxiliary_machine"
                label="辅机"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Modal
            visible={visible}
            onCancel={() => {
              setVisible(false);
            }}
            onOk={() => {
              form.submit();
              setVisible(false);
            }}
            okText="保存"
            cancelText="取消"
            title="添加新类别"
          >
            <Form
              onFinish={(values: any) => {
                console.log(values);
                dispatch({
                  type: 'inforImport/addRnType',
                  payload: { name: values.addRnFleet },
                }).then(() => {
                  settype(-1);
                });
              }}
              form={form}
            >
              <Form.Item
                name="addRnFleet"
                label="类别名"
                style={{ marginTop: 20 }}
              >
                <Input style={{ width: '80%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      );
    };

    // 目标回声特有信息表单
    const EchoTarget = () => {
      const [value, setValue] = useState(-1);
      const [visible, setVisible] = useState(false);

      const [form] = Form.useForm();

      const onChange = (e) => {
        console.log('EchoTarget checked', e.target);
        setValue(e.target.value);
        if (e.target.value === '添加新类别') {
          setVisible(true);
        }
      };

      return (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="te_type"
                label="目标类型"
                labelAlign="left"
                labelCol={{ span: 2 }}
              >
                <Radio.Group onChange={onChange} value={value}>
                  {InforImport.teType?.map((item) => {
                    return <Radio value={item.te_type}>{item.te_type}</Radio>;
                  })}
                  <Radio
                    value={'添加新类别'}
                    style={{
                      display:
                        CookieUtil.get('role') === '3'
                          ? 'none'
                          : 'inline-block',
                    }}
                  >
                    添加新类别
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="country"
                label="国别"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Select style={{ width: 120 }}>
                  {InforImport.country?.map((item) => {
                    return (
                      <Option value={item.country} key={item.country}>
                        {item.country}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fleet_name"
                label="目标舰号或名称"
                rules={[
                  {
                    required: type === 2 ? true : false,
                    message: '请输入目标舰号或名称',
                  },
                ]}
              >
                <Input placeholder="名称" />
              </Form.Item>
            </Col>
          </Row>

          <Modal
            visible={visible}
            onCancel={() => {
              setVisible(false);
            }}
            onOk={() => {
              form.submit();
              setVisible(false);
            }}
            okText="保存"
            cancelText="取消"
            title="添加新类别"
          >
            <Form
              onFinish={(values: any) => {
                console.log(values);
                dispatch({
                  type: 'inforImport/addTeType',
                  payload: { name: values.addEchoFleet },
                }).then(() => {
                  settype(-1);
                });
              }}
              form={form}
            >
              <Form.Item
                name="addEchoFleet"
                label="类别名"
                style={{ marginTop: 20 }}
              >
                <Input style={{ width: '80%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      );
    };

    // 主动脉冲特有信息表单
    const PulseTarget = () => {
      const [value_1, setValue_1] = useState(1);
      const [value_2, setValue_2] = useState(1);
      const [visible_1, setVisible_1] = useState(false);
      const [visible_2, setVisible_2] = useState(false);

      const [form_1] = Form.useForm();
      const [form_2] = Form.useForm();

      const onChange_1 = (e) => {
        console.log('PulseTarget checked', e.target);
        setValue_1(e.target.value);
        if (e.target.value === '添加新类别') {
          setVisible_1(true);
        }
      };
      const onChange_2 = (e) => {
        console.log('PulseTarget checked', e.target);
        setValue_2(e.target.value);
        if (e.target.value === '添加新类别') {
          setVisible_2(true);
        }
      };

      return (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="ap_type"
                label="目标类型"
                labelAlign="left"
                labelCol={{ span: 2 }}
              >
                <Radio.Group onChange={onChange_2} value={value_2}>
                  {InforImport.apType?.map((item) => {
                    return <Radio value={item.ap_type}>{item.ap_type}</Radio>;
                  })}
                  <Radio
                    value={'添加新类别'}
                    style={{
                      display:
                        CookieUtil.get('role') === '3'
                          ? 'none'
                          : 'inline-block',
                    }}
                  >
                    添加新类别
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="as_type" label="主动声纳类型">
                <Radio.Group onChange={onChange_1} value={value_1}>
                  {InforImport.asType?.map((item) => {
                    return <Radio value={item.as_type}>{item.as_type}</Radio>;
                  })}
                  <Radio
                    value={'添加新类别'}
                    style={{
                      display:
                        CookieUtil.get('role') === '3'
                          ? 'none'
                          : 'inline-block',
                    }}
                  >
                    添加新类别
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="country"
                label="国别"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Select style={{ width: 120 }}>
                  {InforImport.country?.map((item) => {
                    return (
                      <Option value={item.country} key={item.country}>
                        {item.country}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fleet_name"
                label="目标舰号或名称"
                rules={[
                  {
                    required: type === 3 ? true : false,
                    message: '请输入目标舰号或名称',
                  },
                ]}
              >
                <Input placeholder="名称" />
              </Form.Item>
            </Col>
          </Row>

          <Modal
            visible={visible_2}
            onCancel={() => {
              setVisible_2(false);
            }}
            onOk={() => {
              form_2.submit();
              setVisible_2(false);
            }}
            okText="保存"
            cancelText="取消"
            title="添加新类别"
          >
            <Form
              onFinish={(values: any) => {
                console.log(values);
                dispatch({
                  type: 'inforImport/addApType',
                  payload: { name: values.addPluseFleet },
                }).then(() => {
                  settype(-1);
                });
              }}
              form={form_2}
            >
              <Form.Item
                name="addPluseFleet"
                label="类别名"
                style={{ marginTop: 20 }}
              >
                <Input style={{ width: '80%' }} />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            visible={visible_1}
            onCancel={() => {
              setVisible_1(false);
            }}
            onOk={() => {
              form_1.submit();
              setVisible_1(false);
            }}
            okText="保存"
            cancelText="取消"
            title="添加新类别"
          >
            <Form
              onFinish={(values: any) => {
                console.log(values);
                dispatch({
                  type: 'inforImport/addAsType',
                  payload: { name: values.addAsType },
                }).then(() => {
                  settype(-1);
                });
              }}
              form={form_1}
            >
              <Form.Item
                name="addAsType"
                label="声呐类型名"
                style={{ marginTop: 20 }}
              >
                <Input style={{ width: '80%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      );
    };

    // 动力装置单选框
    const Powerplant = () => {
      const [value, setValue] = useState(-1);
      const [visible, setVisible] = useState(false);
      const [form] = Form.useForm();

      const onChange = (e) => {
        console.log('Powerplant checked', e.target);
        setValue(e.target.value);
        if (e.target.value === '添加新类别') {
          setVisible(true);
        }
      };

      return (
        <>
          <Form.Item
            name="power_engine"
            label="动力装置"
            labelAlign="left"
            labelCol={{ span: 2 }}
          >
            <Radio.Group onChange={onChange} value={value}>
              {InforImport.powerEngine?.map((item) => {
                return <Radio value={item.name}>{item.name}</Radio>;
              })}
              <Radio
                value={'添加新类别'}
                style={{
                  display:
                    CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
                }}
              >
                添加新类别
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Modal
            visible={visible}
            onCancel={() => {
              setVisible(false);
            }}
            onOk={() => {
              form.submit();
              setVisible(false);
            }}
            okText="保存"
            cancelText="取消"
            title="添加新类别"
          >
            <Form
              onFinish={(values: any) => {
                console.log(values);
                dispatch({
                  type: 'inforImport/addPowerEngine',
                  payload: { name: values.addPower },
                }).then(() => {
                  settype(-1);
                });
              }}
              form={form}
            >
              <Form.Item
                name="addPower"
                label="类别名"
                style={{ marginTop: 20 }}
              >
                <Input style={{ width: '80%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      );
    };

    // 轴数叶数单选框
    const Propeller = () => {
      const [value_2, setValue_2] = useState(-1);
      const [visible, setVisible] = useState(false);
      const [form] = Form.useForm();

      const onChange_2 = (e) => {
        console.log('Propeller checked', e.target);
        setValue_2(e.target.value);
        if (e.target.value === '添加新类别') {
          setVisible(true);
        } else {
          sumForm.setFieldsValue({
            shaft_count: Number(e.target.value.split('_')[0]),
          });
          sumForm.setFieldsValue({
            blade_count: Number(e.target.value.split('_')[1]),
          });
          sumForm.setFieldsValue({
            rotationl_speed: Number(e.target.value.split('_')[2]),
          });
        }
      };

      return (
        <>
          <Row gutter={16}>
            <Col span={10} style={{ display: 'none' }}>
              <Form.Item name="shaft_count" label="轴数"></Form.Item>
              <Form.Item name="blade_count" label="叶数"></Form.Item>
              <Form.Item name="rotationl_speed" label="转速"></Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="shaft_blade_rotationl"
                label="螺旋桨"
                labelAlign="left"
                labelCol={{ span: 2 }}
              >
                <Radio.Group onChange={onChange_2} value={value_2}>
                  {InforImport.propeller?.map((item) => {
                    return (
                      <Radio
                        value={`${item.shaft_count}_${item.blade_count}_${item.rotationl_speed}`}
                      >
                        {item.shaft_count}轴{item.blade_count}叶
                        {item.rotationl_speed}转速
                      </Radio>
                    );
                  })}
                  <Radio
                    value={'添加新类别'}
                    style={{
                      display:
                        CookieUtil.get('role') === '3'
                          ? 'none'
                          : 'inline-block',
                    }}
                  >
                    添加新类别
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Modal
            visible={visible}
            onCancel={() => {
              setVisible(false);
            }}
            onOk={() => {
              form.submit();
              setVisible(false);
            }}
            okText="保存"
            cancelText="取消"
            title="添加新类别"
          >
            <Form
              onFinish={(values: any) => {
                console.log(values);
                dispatch({
                  type: 'inforImport/addPropeller',
                  payload: values,
                }).then(() => {
                  settype(-1);
                });
              }}
              form={form}
            >
              <Form.Item
                name="shaft_count"
                label="轴数"
                style={{ marginTop: 20 }}
              >
                <InputNumber style={{ width: '80%' }} />
              </Form.Item>
              <Form.Item
                name="blade_count"
                label="叶数"
                style={{ marginTop: 20 }}
              >
                <InputNumber style={{ width: '80%' }} />
              </Form.Item>
              <Form.Item
                name="rotationl_speed"
                label="转速"
                style={{ marginTop: 20 }}
              >
                <InputNumber style={{ width: '80%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      );
    };

    // 通用信息表单
    const SignalInfor = () => {
      return (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="speed"
                label="航速"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="distance"
                label="距离"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="collect_d"
                label="采集日期"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="collect_t"
                label="采集时间"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <TimePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="collect_platform"
                label="采集平台"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="采集位置"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={15}>
              <Form.Item
                name="task_source"
                label="采集任务源"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                name="depth"
                label="深度"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </>
      );
    };

    // 修改图片信息
    const UpgradePic = () => {
      const props = {
        name: 'picture',
        accept: '.jpg, .png',
        action: `${SERVICEURL}/v1/sound/upload_picture/${sound_data?.id}`,
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            // console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            console.log(info.file.response);
            if (info.file.response.code === 200) {
              message.success(`${info.file.name} 文件上传成功.`);
              dispatch({
                type: 'soundList/fetchSoundList',
              });
            } else {
              message.error(`${info.file.name} 文件上传失败.`);
              message.error(`${info.file.response.msg}`);
              dispatch({
                type: 'soundList/fetchSoundList',
              });
            }
          } else if (status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          }
        },
      };

      const handleDelete = () => {
        request(`/v1/sound/picture/${sound_data.id}`, {
          method: 'delete',
        }).then((res) => {
          if (res) {
            message.success('删除成功！');
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          } else {
            message.error('删除失败！');
          }
        });
      };

      return (
        <div style={{ display: 'flex' }}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>更新照片信息</Button>
          </Upload>
          <Button
            type="primary"
            style={{ marginLeft: 16 }}
            onClick={handleDelete}
          >
            删除照片
          </Button>
        </div>
      );
    };

    return (
      <div style={{ width: '100%' }}>
        <Form
          onFinish={(values: any) => {
            console.log(sound_data);

            let copy_vals = values;
            // 处理掉多余的键值对
            for (let key in copy_vals) {
              if (
                copy_vals[key] === undefined ||
                copy_vals[key] === null ||
                copy_vals[key] === 'undefined undefined' ||
                copy_vals[key] === 'null_null_null'
              ) {
                delete copy_vals[key];
              }
            }
            copy_vals['sid'] = sound_data.id;
            copy_vals['name'] = copy_vals['fleet_name'];
            delete copy_vals['fleet_name'];
            delete copy_vals['shaft_blade_rotationl'];

            if (copy_vals['collect_d'] && copy_vals['collect_t']) {
              console.log(copy_vals['collect_d'], copy_vals['collect_t']);
              copy_vals['collect_time'] =
                values.collect_d?.format('YYYY-MM-DD') +
                ' ' +
                values.collect_t?.format('HH:mm:ss');
              delete copy_vals['collect_d'];
              delete copy_vals['collect_t'];
            }

            console.log('这是修改目标信息表单值', copy_vals);
            request('/v1/sound/info', {
              method: 'PUT',
              data: copy_vals,
            }).then((res) => {
              if (res) {
                message.success('修改成功！');
                dispatch({
                  type: 'soundList/fetchSoundList',
                });
              } else {
                message.error('修改失败！');
                dispatch({
                  type: 'soundList/fetchSoundList',
                });
              }
            });
          }}
          form={sumForm}
        >
          <p>
            <b style={{ color: '#08979c' }}>信号类型</b>
          </p>
          <Row gutter={16}>
            <Col span={24}>
              <div style={{ marginTop: 0 }}>
                <TypeRadio />
              </div>
            </Col>
          </Row>
          {/* 分割线 */}
          <div
            style={{
              width: '100%',
              height: 1,
              backgroundColor: 'white',
              display: type === -1 ? 'none' : 'block',
            }}
          ></div>
          <p style={{ marginTop: type === -1 ? 0 : 30 }}>
            <b style={{ color: '#08979c' }}>信号目标船舰信息</b>
          </p>
          <Row gutter={16}>
            <Col span={24}>
              <div style={{ marginTop: 0 }}>
                <div
                  style={{
                    marginTop: 0,
                    display: type === 1 ? 'block' : 'none',
                  }}
                  id="radiation_target_div"
                >
                  <RadiationTarget />
                </div>
                <div
                  style={{
                    marginTop: 0,
                    display: type === 2 ? 'block' : 'none',
                  }}
                  id="echo_target_div"
                >
                  <EchoTarget />
                </div>
                <div
                  style={{
                    marginTop: 0,
                    display: type === 3 ? 'block' : 'none',
                  }}
                  id="pulse_target_div"
                >
                  <PulseTarget />
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div
                style={{
                  marginTop: 0,
                  display: type === 1 || type === 2 ? 'block' : 'none',
                }}
                id="powerplant_div"
              >
                <Powerplant />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div
                style={{ marginTop: 0, display: type === 1 ? 'block' : 'none' }}
                id="propeller_div"
              >
                <Propeller />
              </div>
            </Col>
          </Row>
          <div
            style={{
              width: '100%',
              height: 1,
              backgroundColor: 'white',
              display: type === -1 ? 'none' : 'block',
            }}
          ></div>
          <p style={{ marginTop: type === -1 ? 10 : 30 }}>
            <b style={{ color: '#08979c' }}>信号采集相关信息</b>
          </p>
          <Row gutter={16}>
            <Col span={24}>
              <div
                style={{
                  marginTop: 0,
                  display: type !== -1 ? 'block' : 'none',
                }}
              >
                <SignalInfor />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col>
              <Button
                type="dashed"
                onClick={() => {
                  sumForm.resetFields();
                  settype(-1);
                }}
                style={{ marginBottom: 20 }}
              >
                重置
              </Button>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col>
              <div style={{ color: '#08979c', marginBottom: 16 }}>
                <b>图片信息</b>
              </div>
              <UpgradePic />
              {/* {sound_data.pictures?.map((item: any, index: any) => {
                return (
                  <Image
                    src={item.picture_url}
                    style={{ marginBottom: 16, marginTop: 16 }}
                  ></Image>
                );
              })} */}
              <Image
                src={
                  sound_data?.pictures
                    ? sound_data?.pictures[sound_data.pictures.length - 1]
                        .picture_url
                    : null
                }
                style={{ marginBottom: 16, marginTop: 16 }}
              ></Image>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

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
    const [item, setitem] = useState(undefined);

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
        width={850}
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
      >
        <AddSound sound_data={item} />
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
  class TopMenu extends React.Component {
    handleClick = (e) => {
      // console.log('click ', e);
    };

    render() {
      return (
        <Menu
          onClick={this.handleClick}
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
            <a
              href={
                CookieUtil.get('role') == 3
                  ? 'http://10.0.70.89:82/student/#/index'
                  : 'http://10.0.70.89:82/admin/#/dashboard'
              }
            >
              听音训练
            </a>
          </Menu.Item>
          <Menu.Item key="/targetRecognition" icon={<RobotOutlined />}>
            <Link to="/targetRecognition">分类识别</Link>
          </Menu.Item>
          <Menu.Item key="/soundsExport" icon={<EditOutlined />}>
            <Link to="/soundsExport">音频导出</Link>
          </Menu.Item>
        </Menu>
      );
    }
  }

  // 更改密码modal框
  const ChangePasswordModal = () => {
    const [visible, setvisible] = useState(false);
    const [pwform] = Form.useForm();
    useEffect(() => {
      if (visible) {
        pwform.resetFields();
      }
    }, [visible]);

    const handleSubmit = (values: any) => {
      // console.log(values);
      request('/v1/user/password', {
        method: 'PUT',
        data: values,
      }).then((res) => {
        if (res) {
          message.success('修改成功！');
        } else {
          message.error('修改失败！');
        }
        setvisible(false);
      });
    };

    return (
      <>
        <a
          onClick={() => {
            setvisible(true);
          }}
        >
          修改密码
        </a>

        <Modal
          title="修改密码"
          visible={visible}
          onCancel={() => {
            setvisible(false);
          }}
          onOk={() => {
            pwform.submit();
          }}
        >
          <Form form={pwform} onFinish={handleSubmit}>
            <Form.Item
              label="旧密码"
              name="oldpassword"
              labelAlign="right"
              labelCol={{ span: 4 }}
              rules={[
                {
                  required: true,
                  message: '请输入旧密码!',
                },
                {
                  pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                  message: '密码必须包含数字和英文，长度6-20!',
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="新密码"
              name="newpassword"
              labelAlign="right"
              labelCol={{ span: 4 }}
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
                {
                  pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                  message: '新密码必须包含数字和英文，长度6-20!',
                },
              ]}
              hasFeedback
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="确认密码"
              name="renewpassword"
              labelAlign="right"
              labelCol={{ span: 4 }}
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newpassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次输入的密码不一致！');
                  },
                }),
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  // 更改用户名modal框
  const ChangeNicknameModal = () => {
    const [visible, setvisible] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
      if (visible) {
        form.resetFields();
      }
    }, [visible]);

    const handleSubmit = (values: any) => {
      // console.log(values);
      request('/v1/user/nickname', {
        method: 'PUT',
        data: values,
      }).then((res) => {
        if (res) {
          message.success('修改成功！');
        } else {
          message.error('修改失败！');
        }
        setvisible(false);
      });
    };

    return (
      <>
        <a
          onClick={() => {
            setvisible(true);
          }}
        >
          修改昵称
        </a>

        <Modal
          title="修改昵称"
          visible={visible}
          onCancel={() => {
            setvisible(false);
          }}
          onOk={() => {
            form.submit();
          }}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              label="新昵称"
              name="nickname"
              labelAlign="right"
              labelCol={{ span: 4 }}
            >
              <Input autoComplete="off" />
            </Form.Item>
          </Form>
        </Modal>
      </>
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
            <Option value={item}>{alltype[item]}</Option>
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
            <b>水声数据整编分析系统</b>
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

          <div className="info">
            <span
              style={{
                display: CookieUtil.get('role') == 1 ? 'inline' : 'none',
              }}
            >
              <Link to="/staffManage">用户管理 </Link>|
            </span>

            <span>{` 您好，${
              CookieUtil.get('role')
                ? roles[CookieUtil.get('role') - 1]
                : 'null'
            }`}</span>
          </div>
        </Header>
        <Layout style={{ backgroundColor: '#343434' }}>
          <Sider className="side" width={350}>
            <AllSearch />
            <div className="fileContainer">
              <SideCardList />
            </div>
          </Sider>
          <Content className="main-content">{props.children}</Content>
        </Layout>

        <Footer style={{ backgroundColor: '#292929', textAlign: 'center' }}>
          水声数据整编分析系统
        </Footer>
      </Layout>
    </div>
  );
};

const mapStateToProps = ({ loading, soundList, inforImport }) => {
  // console.log(loading)
  return {
    InforImport: inforImport,
    soundListLoading: loading.effects['soundList/fetchSoundList'],
    sound_list: soundList.sound_list,
  };
};

export default connect(mapStateToProps)(BasicLayouts);
