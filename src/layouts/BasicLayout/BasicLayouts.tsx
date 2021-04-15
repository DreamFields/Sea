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
} from 'antd';
import { Link, connect, Dispatch, history } from 'umi';
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
import request from '@/utils/request';
import moment from 'moment';
const { Header, Sider, Footer, Content } = Layout;

const { SubMenu } = Menu;
const { Option } = Select;
const { Search } = Input;

const pagesHeight = {
  '/': 810,
  '/audioImport': 1030,
  '/audioEdit': 1318,
  '/features': 1093,
  '/targetRecognition': 1093,
};

const listHeight = {
  '/': 682,
  '/audioImport': 892,
  '/audioEdit': 1172,
  '/features': 955,
  '/targetRecognition': 955,
};

const roles = ['管理员', '教员', '学员'];

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

  // console.log("role", CookieUtil.get('role'));

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

  const [sumForm] = Form.useForm();
  const [loading, setloading] = useState(false);

  const AddSound: React.FC<{ sound_data: any }> = (props: any) => {
    const { sound_data } = props;
    const [type, settype] = useState(
      sound_data.signal_type ? sound_data.signal_type : -1,
    );

    useEffect(() => {
      if (sound_data) {
        console.log('sound_data', sound_data);
        sumForm.resetFields();
        sumForm.setFieldsValue({
          ...sound_data,
          collect_d: sound_data.collect_time
            ? moment(sound_data.collect_time?.split(' ')[0], 'YYYY/MM/DD')
            : undefined,
          collect_t: sound_data.collect_time
            ? moment(sound_data.collect_time?.split(' ')[1], 'HH:mm:ss')
            : undefined,
          shaft_blade_count: `${sound_data.shaft_count}_${sound_data.blade_count}`,
        });
      }
    }, []);

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
                label="水面/水下"
                labelAlign="left"
                labelCol={{ span: 2 }}
              >
                <Radio.Group onChange={onChange_1} value={value_1}>
                  <Radio value={1}>水面</Radio>
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
          // console.log("目标信息表单值", sumForm.getFieldsValue());
        }
      };

      return (
        <>
          <Row gutter={16}>
            <Col span={10} style={{ display: 'none' }}>
              <Form.Item name="shaft_count" label="轴数"></Form.Item>
              <Form.Item name="blade_count" label="叶数"></Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="shaft_blade_count"
                label="轴叶数"
                labelAlign="left"
                labelCol={{ span: 2 }}
              >
                <Radio.Group onChange={onChange_2} value={value_2}>
                  {InforImport.propeller?.map((item) => {
                    return (
                      <Radio value={`${item.shaft_count}_${item.blade_count}`}>
                        {item.shaft_count}轴{item.blade_count}叶
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
            </Form>
          </Modal>
        </>
      );
    };

    const SignalInfor = () => {
      return (
        <>
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

    const modifyNoise = (values: any) => {
      dispatch({
        type: 'inforImport/modifyNoise',
        payload: { id: sound_data.id, body: values },
      }).then(() => {
        dispatch({
          type: 'soundList/fetchSoundList',
        });
      });
    };

    const modifyEcho = (values: any) => {
      dispatch({
        type: 'inforImport/modifyEcho',
        payload: { id: sound_data.id, body: values },
      }).then(() => {
        dispatch({
          type: 'soundList/fetchSoundList',
        });
      });
    };

    const modifyPulse = (values: any) => {
      dispatch({
        type: 'inforImport/modifyPulse',
        payload: { id: sound_data.id, body: values },
      }).then(() => {
        dispatch({
          type: 'soundList/fetchSoundList',
        });
      });
    };

    // const modify = [modifyNoise, modifyEcho, modifyPulse];

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
                copy_vals[key] === 'null_null'
              ) {
                delete copy_vals[key];
              }
            }
            copy_vals['sid'] = sound_data.id;
            copy_vals['name'] = copy_vals['fleet_name'];
            delete copy_vals['fleet_name'];
            delete copy_vals['shaft_blade_count'];

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
              {sound_data.pictures?.map((item: any) => {
                return (
                  <Image
                    src={item.picture_url}
                    style={{ marginBottom: 16 }}
                  ></Image>
                );
              })}
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  const InforModal = ({ item }) => {
    const [visible, setvisible] = useState(false);

    return (
      <>
        <Drawer
          title={item.name}
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
          <Spin spinning={loading}>
            <AddSound sound_data={item} />
          </Spin>
        </Drawer>
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
                    title={item.sound_list_specific_data.name}
                    style={{
                      width: '92%',
                      marginLeft: '4%',
                      borderColor: '#595959',
                    }}
                  >
                    <InforModal item={item.sound_list_specific_data} />
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
            <Link to="/audioEdit">音频编辑</Link>
          </Menu.Item>
          <Menu.Item key="/features" icon={<SnippetsOutlined />}>
            <Link to="/features">特征提取</Link>
          </Menu.Item>
          <Menu.Item key="/targetRecognition" icon={<RobotOutlined />}>
            <Link to="/targetRecognition">二分类</Link>
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

  const menu = (
    <Menu>
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

  return (
    <div>
      <Layout>
        <Header style={{ backgroundColor: '#2D2D2D', zIndex: 999, height: 66 }}>
          <div className="logo">
            <b>水声数据库系统</b>
          </div>

          <Sidermenu />

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
            <Search
              placeholder="输入关键字搜索文件"
              onSearch={handleSearch}
              enterButton
              style={{ marginTop: 16 }}
            />
            <div className="fileContainer">
              <SideCardList />
            </div>
          </Sider>
          <Content className="main-content">{props.children}</Content>
        </Layout>

        <Footer style={{ backgroundColor: '#292929', textAlign: 'center' }}>
          水声数据库系统 Created by 海工小分队
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
    searchListLoading: loading.effects['soundList/searchSoundList'],
    sound_list: soundList.sound_list,
  };
};

export default connect(mapStateToProps)(BasicLayouts);
