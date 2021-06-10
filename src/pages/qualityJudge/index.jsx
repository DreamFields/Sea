import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import style from '../audioEdit/edit.less';
import { Tabs, Button, Select, Form, message, Alert } from 'antd';
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import SoundsTable from './soundTable';

const { TabPane } = Tabs;
const { Option } = Select;

const Index = (props) => {
  const { qj_data, dispatch } = props;
  const [tab, settab] = useState('1');
  const [form] = Form.useForm();

  const handle_type_change = (key) => {
    settab(key);
  };

  useEffect(() => {
    if (qj_data.manual_level) {
      // console.log("manual_level", qj_data.manual_level);
      form.setFieldsValue({ level: qj_data.manual_level });
    }
    return () => {};
  }, [qj_data]);

  const Waveform = () => {
    var wavesurfer;

    useEffect(() => {
      // console.log('FeaturesInfor', FeaturesInfor);

      // 初始化wavesurfer组件
      wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'skyblue',
        progressColor: '#1e90ff',
        // splitChannels: true,
        cursorColor: '#bdc37',
        cursorWidth: 1,
        barWidth: 2,
        barHeight: 1, // the height of the wave
        barGap: 2, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
        barRadius: 3,
        plugins: [
          WaveSurfer.cursor.create({
            showTime: true,
            opacity: 1,
            color: 'white',
            customShowTimeStyle: {
              'background-color': '#000',
              color: 'white',
              padding: '2px',
              'font-size': '10px',
            },
          }),
          WaveSurfer.timeline.create({
            height: 20,
            container: '#wave-timeline',
          }),
        ],
      });
      let btnPlay = document.getElementById('btnPlay');
      btnPlay.addEventListener('click', function () {
        wavesurfer.playPause();
      });
      // Progress bar
      (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');
        var showProgress = function (percent) {
          progressDiv.style.display = 'block';
          progressBar.style.width = percent + '%';
        };
        var hideProgress = function () {
          progressDiv.style.display = 'none';
        };
        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
      })();
      // 初始化完成
      if (qj_data.audio_id) {
        request(`/v1/file/now_version_url/${qj_data.audio_id}`, {
          method: 'GET',
        }).then((res) => {
          // console.log('版本文件路径', res?.url);
          if (wavesurfer) {
            wavesurfer.load(res?.url);
          }
          // setpath(res?.url);
        });
      }
      return () => {};
    }, [qj_data]);

    return (
      <div style={{ backgroundColor: '#2F2F2F' }}>
        <Alert
          message="最终结果以手动检测为准！"
          type="warning"
          // showIcon
          style={{ display: tab == '2' ? 'none' : 'block' }}
        />
        <div style={{ marginTop: 20, overflow: 'auto' }}>
          <Button
            type="primary"
            id="btnPlay"
            style={{ fontSize: 15, float: 'left' }}
          >
            <PlayCircleOutlined />/<PauseOutlined />
          </Button>
          <Button
            type="primary"
            style={{ fontSize: 15, float: 'left', marginLeft: '16px' }}
            onClick={() => {
              if (wavesurfer) {
                wavesurfer.skip(0 - wavesurfer.getCurrentTime());
              }
            }}
          >
            复位
          </Button>
        </div>
        <div id="wave-timeline" style={{ marginTop: 20 }}></div>
        <div id="waveform" style={{ backgroundColor: '#3D3D3D' }}>
          <div
            className="progress progress-striped active"
            id="progress-bar"
            style={{ display: 'none' }}
          >
            <div className="progress-bar progress-bar-info"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        className={style.rightContent}
        style={{ height: tab === '1' ? 700 : 900 }}
      >
        <div
          className={style.rightCenter}
          style={{ height: tab === '1' ? 650 : 850 }}
        >
          <h3>质量评价</h3>
          <div
            style={{
              backgroundColor: 'white',
              height: 2,
              width: '100%',
              marginTop: -5,
              marginBottom: 5,
            }}
          ></div>

          <Tabs activeKey={tab} onChange={handle_type_change}>
            <TabPane tab="单文件" key="1">
              <div className={style.showWave}>
                <Waveform />
                <div style={{ display: 'flex', marginTop: '3rem' }}>
                  <Form
                    onFinish={(values) => {
                      // console.log(values);
                      if (values.level && qj_data.audio_id) {
                        dispatch({
                          type: 'qualityJudge/modifyQuality',
                          payload: {
                            sid: qj_data.audio_id,
                            quality: values.level,
                          },
                        });
                      } else {
                        message.error('您还未加载一个音频或者选择一个评级！');
                      }
                    }}
                    form={form}
                  >
                    <Form.Item
                      name="level"
                      label="手动检测"
                      style={{ width: 400 }}
                    >
                      <Select placeholder="选择等级">
                        <Option value="优">优</Option>
                        <Option value="良">良</Option>
                        <Option value="中">中</Option>
                        <Option value="劣">劣</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                  <Button
                    type="primary"
                    style={{ marginLeft: '1rem' }}
                    onClick={() => {
                      form.submit();
                    }}
                  >
                    提交
                  </Button>
                </div>

                <div style={{ display: 'flex' }}>
                  <Form
                    onFinish={(values) => {
                      console.log(values);
                    }}
                  >
                    <Form.Item
                      name="mode"
                      label="自动检测"
                      style={{ width: 400 }}
                    >
                      <Select placeholder="选择模式">
                        <Option value="1">模式1</Option>
                        <Option value="2">模式2</Option>
                        <Option value="3">模式3</Option>
                        <Option value="4">模式4</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="result"
                      label="检测结果"
                      style={{ width: 400 }}
                    >
                      <b>{qj_data.level ? qj_data.level : '暂无评价'}</b>
                    </Form.Item>
                  </Form>
                  <Button
                    type="primary"
                    style={{ marginLeft: '1rem' }}
                    onClick={() => {
                      form.submit();
                    }}
                  >
                    检测
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: '1rem' }}
                    onClick={() => {}}
                  >
                    保存结果
                  </Button>
                </div>
              </div>
            </TabPane>
            <TabPane tab="批文件" key="2">
              <SoundsTable />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ qualityJudge }) => {
  return {
    qj_data: qualityJudge,
  };
};

export default connect(mapStateToProps)(Index);
