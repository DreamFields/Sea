import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import style from '../audioEdit/edit.less';
import { Tabs, Button, Form, message, Alert, Radio } from 'antd';
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import SoundsTable from './soundTable';
import EvaluationCard from './EvaluationCard';

const { TabPane } = Tabs;

const Index = (props) => {
  const { qj_data, dispatch, location } = props;
  const [tab, settab] = useState('1');
  const [form] = Form.useForm();

  const handle_type_change = (key) => {
    settab(key);
  };

  useEffect(() => {
    dispatch({
      type: 'qualityJudge/save',
      payload: {
        audio_id: undefined,
        audio_name: undefined,
        signal_type: undefined,
        level: undefined,
        manual_level: undefined,
      },
    });
  }, [location]);

  useEffect(() => {
    if (qj_data.manual_level) {
      // console.log("manual_level", qj_data.manual_level);
      form.setFieldsValue({ result: qj_data.manual_level });
    }
    console.log('qj_data', qj_data);
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

  // 尝试自定义Form组件
  const ManualInput = ({ value = {}, onChange }) => {
    const [quality_level, setquality_level] = useState(undefined);
    const [manual_quality, setmanual_quality] = useState(undefined);

    const triggerChange = (changedValue) => {
      onChange?.({
        quality_level,
        manual_quality,
        ...value,
        ...changedValue,
      });
    };

    const qlOptions = [
      { label: '轴叶频清晰', value: 1 },
      { label: '轴频清晰，叶频不清晰', value: 2 },
      { label: '轴频缺失，叶频清晰', value: 3 },
      { label: '轴叶频缺失', value: 4 },
    ];

    const mqOptions = [
      { label: '优', value: '优' },
      { label: '良', value: '良' },
      { label: '中', value: '中' },
      { label: '劣', value: '劣' },
    ];

    const onQLChange = (e) => {
      setquality_level(e.target.value);

      triggerChange({
        quality_level: e.target.value,
      });
    };

    const onMQChange = (e) => {
      setmanual_quality(e.target.value);

      triggerChange({
        manual_quality: e.target.value,
      });
    };

    return (
      <span>
        <Radio.Group
          onChange={onQLChange}
          value={value.quality_level || quality_level}
          optionType="button"
          buttonStyle="solid"
          options={qlOptions}
        ></Radio.Group>
        <br />
        <Radio.Group
          onChange={onMQChange}
          value={value.manual_quality || manual_quality}
          style={{ marginTop: '8px' }}
          options={mqOptions}
          optionType="button"
          buttonStyle="solid"
        ></Radio.Group>
      </span>
    );
  };

  const heights = [1000, 900];

  return (
    <div>
      <div
        className={style.rightContent}
        style={{ height: heights[Number(tab) - 1] }}
      >
        <div
          className={style.rightCenter}
          style={{ height: heights[Number(tab) - 1] - 50 }}
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
              <div style={{ width: '100%' }}>
                <Waveform />
                <div style={{ display: 'flex', marginTop: '32px' }}>
                  <p>
                    <b>自动检测：</b>
                  </p>
                  <EvaluationCard
                    sid={qj_data.audio_id}
                    mode="thd"
                    title="THD"
                  />
                  <EvaluationCard
                    sid={qj_data.audio_id}
                    mode="se"
                    title="功率谱熵"
                  />
                </div>

                <div style={{ display: 'flex', marginTop: '32px' }}>
                  <Form
                    onFinish={(values) => {
                      if (!values.result || !qj_data.audio_id) {
                        message.error('您还未加载一个音频或者选择一个评级！');
                        return;
                      }
                      console.log({
                        sid: qj_data.audio_id,
                        ...values.result,
                        quality: values.result.manual_quality,
                      });
                      dispatch({
                        type: 'qualityJudge/modifyQuality',
                        payload: {
                          sid: qj_data.audio_id,
                          ...values.result,
                          // quality: values.result.manual_quality,
                        },
                      });
                    }}
                    form={form}
                  >
                    <Form.Item
                      name="result"
                      label="手动检测"
                      style={{ width: 650 }}
                    >
                      <ManualInput />
                    </Form.Item>
                    <Form.Item
                      // name="result"
                      label="检测结果"
                      style={{ width: 400 }}
                    >
                      <b>{qj_data.level ? qj_data.level : '暂无评价'}</b>
                    </Form.Item>
                  </Form>
                  <Button
                    type="primary"
                    onClick={() => {
                      form.submit();
                    }}
                  >
                    提交
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      form.resetFields();
                    }}
                    style={{ marginLeft: 16 }}
                  >
                    重置
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
