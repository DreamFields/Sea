import React, { useState, useEffect } from 'react';
import { Cascader, Carousel, DatePicker, TimePicker } from 'antd';
import { Link, connect, Dispatch } from 'umi';
import moment from 'moment';
import { Input, Button, Popconfirm, Select } from 'antd';
import { Upload, message, Modal, Form } from 'antd';
import { Table, Tag, Space, Radio, Steps } from 'antd';
import { InboxOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { StateType } from './model';
import style from "./style.less";
import axios from 'axios';
import TestList from '../../components/DataTable/index.jsx';

const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;
const { Step } = Steps;

interface IndexContentProps {
  dispatch: Dispatch;
  importInfo: any;
  loading: boolean;
}


const Index: React.FC<IndexContentProps> = (props: any) => {
  const { dispatch, importInfo, loading } = props;

  const AddSound: React.FC<{}> = () => {
    const [card, setCard] = useState(undefined);

    const TypeRadio = () => {
      const [value, setValue] = useState(1);

      const onChange = e => {
        console.log('radio checked', e.target);
        setValue(e.target.value);
        let radiation = document.getElementById('radiation_target_div');
        let echo = document.getElementById('echo_target_div');
        let pulse = document.getElementById('pulse_target_div');
        let power = document.getElementById('powerplant_div');
        let propeller = document.getElementById('propeller_div');
        console.log(echo);
        if (e.target.value == 1) {
          radiation.style.display = "block";
          echo.style.display = "none";
          pulse.style.display = "none";

          power.style.display = "block";
          propeller.style.display = "block";
        } else if (e.target.value == 2) {
          radiation.style.display = "none";
          echo.style.display = "block";
          pulse.style.display = "none";

          power.style.display = "block";
          propeller.style.display = "block";
        } else if (e.target.value == 3) {
          radiation.style.display = "none";
          echo.style.display = "none";
          pulse.style.display = "block";
          power.style.display = "none";
          propeller.style.display = "none";
        }
      };

      return (
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1} >辐射噪声</Radio>
          <Radio value={2} >目标回声</Radio>
          <Radio value={3} >主动脉冲</Radio>
        </Radio.Group>
      );
    }

    const RadiationTarget = () => {
      const [value_1, setValue_1] = useState(1);
      const [value_2, setValue_2] = useState(1);

      const onChange_1 = e => {
        console.log('RadiationTarget checked', e.target);
        setValue_1(e.target.value);
      };
      const onChange_2 = e => {
        console.log('RadiationTarget checked', e.target);
        setValue_2(e.target.value);
      };

      return (
        <Form name="radiation_target" >
          <Form.Item name='position' label="水面/水下">
            <Radio.Group onChange={onChange_1} value={value_1}>
              <Radio value={1} >水面</Radio>
              <Radio value={2} >水下</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='type' label="目标类型">
            <Radio.Group onChange={onChange_2} value={value_2}>
              <Radio value={1} >商船</Radio>
              <Radio value={2} >民船</Radio>
              <Radio value={3} >军舰-驱逐舰</Radio>
              <Radio value={4} >军舰-护卫舰</Radio>
              <Radio value={5} >潜艇-常规</Radio>
              <Radio value={6} >潜艇-战略核潜艇</Radio>
              <Radio value={7} >潜艇-攻击核潜艇</Radio>
              <Radio value={8} >监听船</Radio>
              <Radio value={9} >海洋科考船</Radio>
              <Radio value={10} >航空母舰</Radio>
              <Radio value={11} >未知类别</Radio>
              <Radio value={12} >添加新类别</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='country' label="国别">
            <Select defaultValue="china" style={{ width: 120 }} >
              <Option value="china">中国</Option>
              <Option value="UK">英国</Option>
              <Option value="USA">USA</Option>
              <Option value="France">法国</Option>
              <Option value="Russia">俄罗斯</Option>
            </Select>
          </Form.Item>
          <Form.Item name='name' label="目标舰号或名称">
            <Input placeholder="名称" id='fleet_name' />
          </Form.Item>
        </Form>
      );
    };


    const EchoTarget = () => {
      const [value, setValue] = useState(1);

      const onChange = e => {
        console.log('EchoTarget checked', e.target);
        setValue(e.target.value);
      };

      return (
        <Form name="echo_target" >
          <Form.Item name='type' label="目标类型">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1} >水面船舰</Radio>
              <Radio value={2} >潜艇-常规</Radio>
              <Radio value={3} >潜艇-战略核潜艇</Radio>
              <Radio value={4} >潜艇-攻击核潜艇</Radio>
              <Radio value={5} >礁石</Radio>
              <Radio value={6} >浅滩</Radio>
              <Radio value={7} >沉船</Radio>
              <Radio value={8} >混响</Radio>
              <Radio value={9} >未知类别</Radio>
              <Radio value={10} >添加新类别</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='country' label="国别">
            <Select defaultValue="china" style={{ width: 120 }} >
              <Option value="china">中国</Option>
              <Option value="UK">英国</Option>
              <Option value="USA">USA</Option>
              <Option value="France">法国</Option>
              <Option value="Russia">俄罗斯</Option>
            </Select>
          </Form.Item>
          <Form.Item name='name' label="目标舰号或名称">
            <Input placeholder="名称" id='fleet_name' />
          </Form.Item>
        </Form>
      );
    };


    const PulseTarget = () => {
      const [value_1, setValue_1] = useState(1);
      const [value_2, setValue_2] = useState(1);

      const onChange_1 = e => {
        console.log('PulseTarget checked', e.target);
        setValue_1(e.target.value);
      };
      const onChange_2 = e => {
        console.log('PulseTarget checked', e.target);
        setValue_2(e.target.value);
      };

      return (
        <Form name="pulse_target" >
          <Form.Item name='type' label="目标类型">
            <Radio.Group onChange={onChange_2} value={value_2}>
              <Radio value={1} >水面船舰</Radio>
              <Radio value={2} >潜艇-常规</Radio>
              <Radio value={3} >潜艇-战略核潜艇</Radio>
              <Radio value={4} >潜艇-攻击核潜艇</Radio>
              <Radio value={5} >浮标</Radio>
              <Radio value={6} >潜标</Radio>
              <Radio value={7} >未知类别</Radio>
              <Radio value={8} >添加新类别</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='sonar_type' label="主动声纳类型">
            <Radio.Group onChange={onChange_1} value={value_1}>
              <Radio value={1} >舰壳-xxx</Radio>
              <Radio value={2} >拖曳-xxx</Radio>
              <Radio value={3} >未知类别</Radio>
              <Radio value={4} >添加新类别</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='country' label="国别">
            <Select defaultValue="china" style={{ width: 120 }} >
              <Option value="china">中国</Option>
              <Option value="UK">英国</Option>
              <Option value="USA">USA</Option>
              <Option value="France">法国</Option>
              <Option value="Russia">俄罗斯</Option>
            </Select>
          </Form.Item>
          <Form.Item name='name' label="目标舰号或名称">
            <Input placeholder="名称" id='fleet_name' />
          </Form.Item>
        </Form>
      );
    };


    const Powerplant = () => {
      const [value, setValue] = useState(1);

      const onChange = e => {
        console.log('Powerplant checked', e.target);
        setValue(e.target.value);
      };

      return (
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1} >柴油机</Radio>
          <Radio value={2} >燃气轮机</Radio>
          <Radio value={3} >涡轮机</Radio>
          <Radio value={4} >电机</Radio>
          <Radio value={5} >柴电-联合动力</Radio>
          <Radio value={6} >未知类别</Radio>
          <Radio value={7} >添加新类别</Radio>
        </Radio.Group>
      );
    }

    const Propeller = () => {
      const [value_1, setValue_1] = useState(1);
      const [value_2, setValue_2] = useState(1);

      const onChange_1 = e => {
        console.log('Propeller checked', e.target);
        setValue_1(e.target.value);
      };
      const onChange_2 = e => {
        console.log('Propeller checked', e.target);
        setValue_2(e.target.value);
      };

      return (
        <Form name="propeller">
          <Form.Item name="axis_num" label="轴数">
            <Radio.Group onChange={onChange_1} value={value_1}>
              <Radio value={1} >单轴</Radio>
              <Radio value={2} >双轴</Radio>
              <Radio value={3} >四轴</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="leaf_num" label="叶数">
            <Radio.Group onChange={onChange_2} value={value_2}>
              <Radio value={1} >3叶</Radio>
              <Radio value={2} >4叶</Radio>
              <Radio value={3} >5叶</Radio>
              <Radio value={4} >6叶</Radio>
              <Radio value={5} >7叶</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      );
    };

    const SignalInfor = () => {
      function dateChange(date, dateString) {
        console.log(date, dateString);
      };

      function timeChange(time, timeString) {
        console.log(time, timeString);
      }

      return (
        <Form name="signal_information">
          <Form.Item name="time" label="采集时间">
            <DatePicker onChange={dateChange} />
            <TimePicker onChange={timeChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
          </Form.Item>
          <Form.Item name="platform" label="采集平台">
            <Input />
          </Form.Item>
          <Form.Item name="task_source" label="采集任务源">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="采集海区位置及深度">
            <Input />
          </Form.Item>
          <Form.Item name="new_type" label="添加新类别">
            <Input />
          </Form.Item>
        </Form>
      )
    }



    return (
      <div>
        <button
          className={style.leftButton}
          // style={{ left: 26 }}
          onClick={() => {
            // 通过获取走马灯dom，调用Carousel的prev()方法
            card.prev();
          }}
        >
          {/* <IconFont type="icon-previous" /> */}<LeftOutlined />
        </button>
        <button
          className={style.rightButton}
          // style={{ right: 26 }}
          onClick={() => {
            // 通过获取走马灯dom，调用Carousel的next()方法
            card.next();
          }}
        >
          {/* <IconFont type="icon-next" /> */}<RightOutlined />
        </button>
        <Form>
          <Carousel
            ref={(e: any) => {
              // 走马灯dom名card
              setCard(e);
            }}
          // autoplay
          >
            <div>
              <div className={style.contentStyle}>
                <span>1. 选择信号类型</span>
                <div style={{ marginTop: 150 }}>
                  <TypeRadio />
                </div>
              </div>
            </div>
            <div>
              <div className={style.contentStyle}>
                <span>2. 选择目标船舰类型</span>
                <div style={{ marginTop: 50 }} id='radiation_target_div'>
                  <RadiationTarget />
                </div>
                <div style={{ marginTop: 80, display: "none" }} id="echo_target_div">
                  <EchoTarget />
                </div>
                <div style={{ marginTop: 50, display: "none" }} id="pulse_target_div">
                  <PulseTarget />
                </div>
              </div>
            </div>
            <div>
              <div className={style.contentStyle}>
                <span>3. 录入目标动力装置</span>
                <div style={{ marginTop: 150 }} id="powerplant_div">
                  <Powerplant />
                </div>
              </div>
            </div>
            <div>
              <div className={style.contentStyle}>
                <span>4. 录入目标螺旋桨情况</span>
                <div style={{ marginTop: 120 }} id="propeller_div">
                  <Propeller />
                </div>
              </div>
            </div>
            <div>
              <div className={style.contentStyle}>
                <span>5. 信号采集信息</span>
                <div style={{ marginTop: 40 }}>
                  <SignalInfor />
                </div>
              </div>
            </div>
            {/* <div>
            <div className={style.contentStyle}>
              <span>6. 其他需要录入信息(图片等)</span>
              <div style={{marginTop:80}}>
                <OtherFiles />
              </div>
            </div>
          </div> */}
          </Carousel>
        </Form>

      </div>
    );
  }

  const OtherFiles: React.FC<{}> = () => {
    const props = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖动文件以上传</p>
        <p className="ant-upload-hint">
          支持单次或者批量上传
        </p>
      </Dragger>
    )
  }

  const SoundFiles: React.FC<{}> = () => {

    const uploadprops = {
      name: 'file',
      accept: '.wav',
      multiple: true,
      action: 'http://47.97.152.219:82/upload',
      data: { 'fleet_name': '' },
      showUploadList: false,
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          // console.log(info.file.response);
          if (info.file.response == 'target not exists!') {
            message.error('目标船舰不存在!');
          } else if (info.file.response == 'please choose target!') {
            alert('请选择目标!');
          } else {
            let sound_infor = info.file.response;
            // console.log("fleet_id: "+fleet_id_now);
            // console.log(sound_infor);
            axios({
              url: "http://47.97.152.219:82/v1/datamanage/upload",
              method: "POST",
              data: {
                fleet_id: localStorage['fleet_id_now'],
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

    return (
      <>
        <div style={{ width: '100%', height: 220, marginBottom: 50 }}>
          <Dragger {...uploadprops}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或将文件拖到该区域以上传</p>
            <p className="ant-upload-hint">
              目前仅支持单个文件上传
                </p>
          </Dragger>
        </div>
      </>
    )
  }

  const MainContent = () => {
    const [current, setCurrent] = useState(0);

    const steps = [
      {
        title: '上传音频',
        content: <SoundFiles />,
      },
      {
        title: '完善音频信息',
        content: <AddSound />,
      },
      {
        title: '上传图片信息',
        content: <OtherFiles />,
      },
    ];

    const next = () => {
      setCurrent(current + 1);
    }

    // const prev = () => {
    //   setCurrent(current - 1);
    // }

    return (
      <div className={style.rightContent}>
        <div className={style.rightCenter} style={{ backgroundColor: '', height: 630 }}>
          <h3>数据管理</h3>
          <h4 id='targetName'>一、上传数据</h4>

          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className={style.steps_content} style={{ height: current === 1 ? 400 : 220 }}>{steps[current].content}</div>
          <div className={style.steps_action}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => {message.success('完成!');setCurrent(0);}}>
                完成
              </Button>
            )}

            {/* {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={prev}>
                Previous
              </Button>
            )} */}
          </div>
          <h4 style={{ marginTop: 30 }}>二、已上传音频文件</h4>
          <TestList />
        </div>
      </div>
    )
  }

  return (
    <MainContent />
  )
}

const mapStateToProps = ({
  importInfo,
  // loading
}: {
  importInfo: StateType,
  // loading: { effects: { [key: string]: boolean } }
}) => {
  // console.log(importInfo)
  return {
    importInfo: importInfo,

  }
}

export default connect(mapStateToProps)(Index);
