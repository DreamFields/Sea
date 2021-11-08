import React, { useState, useEffect } from 'react';
import CookieUtil from '@/utils/cookie';
import { SERVICEURL } from '@/utils/const';
import request from '@/utils/request';
import {
  HomeOutlined,
  MenuUnfoldOutlined,
  SnippetsOutlined,
  UploadOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
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
  Popover,
  notification,
} from 'antd';
import { connect } from '@@/plugin-dva/exports';
const { Option } = Select;
const { Search } = Input;

// TODO 现仅将组件AddSound抽象出来，这里由于不了解需求，暂搁置优化
const AddSound: React.FC<{ sound_data: any; sumForm: any }> = (props: any) => {
  const { sound_data, dispatch, InforImport, sumForm } = props;
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
              </Radio.Group>
              <Button
                value={'添加新类别'}
                onClick={() => {
                  setVisible(true);
                }}
                style={{
                  display:
                    CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
                }}
              >
                添加新类别
              </Button>
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
              }).then(() => {});
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
                      CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
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
              }).then(() => {});
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
                      CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
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
                      CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
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
              }).then(() => {});
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
              }).then(() => {});
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
          </Radio.Group>
          <Button
            value={'添加新类别'}
            onClick={() => setVisible(true)}
            style={{
              display: CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
            }}
          >
            添加新类别
          </Button>
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
              }).then(() => {});
            }}
            form={form}
          >
            <Form.Item name="addPower" label="类别名" style={{ marginTop: 20 }}>
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
              </Radio.Group>
              <Button
                value={'添加新类别'}
                onClick={() => {
                  setVisible(true);
                }}
                style={{
                  display:
                    CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
                }}
              >
                添加新类别
              </Button>
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
              }).then(() => {});
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
              <Input style={{ width: '24%' }} />
              <span className="ant-form-text">
                <strong>&ensp;度</strong>
              </span>
              <Input style={{ width: '24%' }} />
              <span className="ant-form-text">
                <strong>&ensp;秒</strong>
              </span>
              <Input style={{ width: '24%' }} />
              <span className="ant-form-text">
                <strong>&ensp;分</strong>
              </span>
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
              <InputNumber style={{ width: '85%' }} />
              <span className="ant-form-text">
                <strong>m</strong>
              </span>
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
            notification.success({
              message: '${info.file.name} 文件上传成功.',
            });
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          } else {
            notification.error({ message: '${info.file.name} 文件上传失败1.' });
            notification.error({ message: '${info.file.response.msg}' });
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          }
        } else if (status === 'error') {
          notification.error({ message: '${info.file.name} 文件上传失败2.' });
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

  console.log('reRender');
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
const mapStateToProps = ({ loading, soundList, inforImport }) => {
  // console.log(loading)
  return {
    InforImport: inforImport,
  };
};
export default connect(mapStateToProps)(AddSound);
