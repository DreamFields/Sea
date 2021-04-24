/*
 * @Descripttion:
 * @github: https://github.com/HlgdB/Seadata
 * @Author: HuRenbin
 * @Date: 2020-10-26 15:36:10
 * @LastEditors  : HuRenbin
 * @LastEditTime : 2020-12-14 20:10:19
 * @FilePath     : \Seadata-front\src\pages\audioImport\index.tsx
 */
import React, { useState, useEffect } from 'react';
import { connect, Dispatch, history } from 'umi';
import {
  DatePicker,
  TimePicker,
  Result,
  Row,
  Col,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
  Modal,
  Form,
  Radio,
  Steps,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import Cookies from 'js-cookie';
import style from './style.less';
import CookieUtil from '@/utils/cookie.js';
import RecorderCn from '@/components/recorder/index.jsx';

const { Dragger } = Upload;
const { Option } = Select;
const { Step } = Steps;

interface AudioImportContentProps {
  dispatch: Dispatch;
  InforImport: any;
}

const AudioImport: React.FC<AudioImportContentProps> = (props) => {
  const { dispatch, InforImport } = props;
  const [id, setId] = useState(undefined);
  const [current, setCurrent] = useState(0);

  const [sumForm] = Form.useForm();

  const AddSound: React.FC<{}> = () => {
    const [type, settype] = useState(-1);

    useEffect(() => {
      if (InforImport.searchInfor) {
        const infor = InforImport.searchInfor;
        console.log(InforImport.searchInfor);
        if (infor.signal_type === 1) {
          settype(1);
          sumForm.setFieldsValue({
            signal_type: 1,
            ...infor,
            name: undefined,
            depth: infor.depth_str,
            shaft_blade_count: `${infor.shaft_count}_${infor.blade_count}`,
            collect_d: infor.collect_time
              ? moment(infor.collect_time?.split(' ')[0], 'YYYY/MM/DD')
              : undefined,
            collect_t: infor.collect_time
              ? moment(infor.collect_time?.split(' ')[1], 'HH:mm:ss')
              : undefined,
          });
        } else if (infor.signal_type === 2) {
          settype(2);
          sumForm.setFieldsValue({
            signal_type: 2,
            ...infor,
            name: undefined,
            depth: infor.depth_str,
            collect_d: infor.collect_time
              ? moment(infor.collect_time?.split(' ')[0], 'YYYY/MM/DD')
              : undefined,
            collect_t: infor.collect_time
              ? moment(infor.collect_time?.split(' ')[1], 'HH:mm:ss')
              : undefined,
          });
        } else if (infor.signal_type === 3) {
          settype(3);
          sumForm.setFieldsValue({
            signal_type: 3,
            ...infor,
            name: undefined,
            depth: infor.depth_str,
            collect_d: infor.collect_time
              ? moment(infor.collect_time?.split(' ')[0], 'YYYY/MM/DD')
              : undefined,
            collect_t: infor.collect_time
              ? moment(infor.collect_time?.split(' ')[1], 'HH:mm:ss')
              : undefined,
          });
        }
        dispatch({
          type: 'inforImport/setInfor',
          payload: undefined,
        });
      }
    }, [InforImport.searchInfor]);

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
                    return <Option value={item.country}>{item.country}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
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
                    return <Option value={item.country}>{item.country}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
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
                    return <Option value={item.country}>{item.country}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
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

    // 动力装置栏
    const Powerplant = () => {
      const [value, setValue] = useState(1);
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

    // 螺旋桨
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
                name="shaft_blade_count"
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

    // 通用基础信息表单
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
            <Col span={12}>
              <Form.Item
                name="task_source"
                label="采集任务源"
                labelAlign="left"
                labelCol={{ span: 4 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
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
        payload: { id: id, body: values },
      }).then(() => {
        dispatch({
          type: 'soundList/fetchSoundList',
        });
      });
    };

    const modifyEcho = (values: any) => {
      dispatch({
        type: 'inforImport/modifyEcho',
        payload: { id: id, body: values },
      }).then(() => {
        dispatch({
          type: 'soundList/fetchSoundList',
        });
      });
    };

    const modifyPulse = (values: any) => {
      dispatch({
        type: 'inforImport/modifyPulse',
        payload: { id: id, body: values },
      }).then(() => {
        dispatch({
          type: 'soundList/fetchSoundList',
        });
      });
    };

    const modify = [modifyNoise, modifyEcho, modifyPulse];

    return (
      <div style={{ width: '100%' }}>
        <Form
          onFinish={(values: any) => {
            if (type === -1) {
              console.log('目标信息表单值', {
                ...values,
                collect_time:
                  values.collect_d?.format('YYYY-MM-DD') +
                  ' ' +
                  values.collect_t?.format('hh:mm:ss'),
                signal_type: undefined,
              });
            } else {
              let copy_vals = values;
              // 处理掉多余的键值对
              if (copy_vals['collect_d'] && copy_vals['collect_t']) {
                copy_vals['collect_time'] =
                  values.collect_d?.format('YYYY-MM-DD') +
                  ' ' +
                  values.collect_t?.format('HH:mm:ss');
                delete copy_vals['collect_d'];
                delete copy_vals['collect_t'];
              }
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
              delete copy_vals['shaft_blade_count'];
              console.log('目标信息表单值', copy_vals);
              modify[type - 1](copy_vals);
            }
            sumForm.resetFields();
            setCurrent(current + 1);
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
        </Form>
      </div>
    );
  };

  // 上传图片信息
  const OtherFiles: React.FC<{}> = () => {
    const props = {
      name: 'picture',
      accept: '.jpg, .png',
      // multiple: true,
      action: `http://47.97.152.219/v1/sound/upload_picture/${id}`,
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
          } else {
            message.error(`${info.file.name} 文件上传失败.`);
            message.error(`${info.file.response.msg}`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    };

    return (
      <div style={{ width: '100%', height: 220, marginBottom: 30 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖动文件以上传</p>
          <p className="ant-upload-hint">目前只支持单个上传</p>
        </Dragger>
      </div>
    );
  };

  // 上传本地音频
  const SoundFiles: React.FC<{}> = () => {
    const uploadprops = {
      name: 'audio',
      accept: '.wav, .mp3',
      // multiple: true,
      action: 'http://47.97.152.219/v1/sound/upload_sound',
      // action: 'http://127.0.0.1:5000/v1/sound/upload_sound',
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      showUploadList: true,
      onChange(info: any) {
        const { status } = info.file;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          console.log(info.file.response);
          if (info.file.response.code === 200) {
            message.success(`${info.file.name} 文件上传成功.`);
            setId(info.file.response.data.id);
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          } else {
            message.error(`${info.file.response.msg} 文件上传失败.`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    };

    return (
      <>
        <div style={{ width: '100%', height: 220, marginBottom: 50 }}>
          <Dragger {...uploadprops}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或将文件拖到该区域以上传</p>
            <p className="ant-upload-hint">目前仅支持单个文件上传</p>
          </Dragger>
        </div>
      </>
    );
  };

  // 流程完成页面
  const SuccessResult: React.FC<{}> = () => {
    return (
      <Result
        status="success"
        title="成功导入声音文件！"
        // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      />
    );
  };

  // 主界面
  const MainContent = () => {
    const steps = [
      {
        title: '上传音频',
        content: (
          <>
            <SoundFiles />
            <RecorderCn />
          </>
        ),
      },
      {
        title: '完善音频信息',
        content: <AddSound />,
      },
      {
        title: '上传图片信息',
        content: <OtherFiles />,
      },
      {
        title: '完成',
        content: <SuccessResult />,
      },
    ];

    const next_1 = () => {
      if (id === undefined) {
        message.warning('请先上传一个音频文件');
        // setCurrent(current + 1);
      } else {
        console.log('id', id);
        setCurrent(current + 1);
      }
    };

    const next_2 = async () => {
      try {
        const values = await sumForm.validateFields();
        console.log('Success:', values);
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
      sumForm.submit();
      // setCurrent(current + 1);
    };

    return (
      <div className={style.rightContent}>
        <div className={style.rightCenter}>
          <h3>数据管理</h3>
          <h4 id="targetName">上传数据</h4>

          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className={style.steps_content}>{steps[current].content}</div>
          <div className={style.steps_action}>
            {current === 0 && (
              <Button type="primary" onClick={next_1}>
                下一步
              </Button>
            )}
            {current === 1 && (
              <Button type="primary" onClick={next_2}>
                下一步
              </Button>
            )}
            {current === 2 && (
              <Button
                type="primary"
                onClick={() => {
                  setCurrent(current + 1);
                  setId(undefined);
                }}
              >
                下一步
              </Button>
            )}
            {current === 3 && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    setCurrent(0);
                    setId(undefined);
                  }}
                >
                  完成
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    history.push('/audioEdit');
                  }}
                  style={{ marginLeft: 16 }}
                >
                  数据预处理
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return <MainContent />;
};

const mapStateToProps = ({ inforImport }: { inforImport: any }) => {
  // console.log('inforImport', inforImport);
  return {
    InforImport: inforImport,
    // powerEngine: inforImport.powerEngine
  };
};

export default connect(mapStateToProps)(AudioImport);
