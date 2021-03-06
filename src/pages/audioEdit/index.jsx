/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors: Please set LastEditors
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime: 2021-10-19 21:41:08
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\audioEdit\index.jsx
 */
import React, { useEffect, useState } from 'react';
import style from './edit.less';
import { connect } from 'umi';
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import {
  Input,
  Button,
  Timeline,
  Form,
  Row,
  Col,
  Tabs,
  // Spin,
  Popover,
  message,
  Slider,
  Alert,
  Card,
  Tooltip,
} from 'antd';
import request from '@/utils/request';
import randomString from '@/utils/random.js';
import CookieUtil from '@/utils/cookie.js';
// import WaveSurfer from 'wavesurfer.js';
// import WaveSurfer from 'react-wavesurfer';

let region_now;
let audio_id_dup = undefined;
const alert_message_1 =
  '对一个区域进行操作前请务必先左键单击对应的区域；您可以通过点击一个标签后，在上方的开始时间和结束时间输入栏修改当前选择标签的起始时间和结束时间，修改后记得右键单击标签点击设置标签！';
const alert_message_2_1 =
  '操作方式一：①选中某个区域 ②进行拖动操作 ③单击鼠标左键（音频起止时间可自动更新） ④单击鼠标右键-保存该标签。';
const alert_message_2_2 =
  '操作方式二：①选中某个区域 ②在输入框中更新信息 ③单击鼠标右键-保存该标签。';

// const alert_message_2 =
//   '在修改标签的起始时间，结束时间，或者备注后请右键单击标签点击设置标签修改标签状态。您可以完成对所有标签的删除，新增，修改操作后再点击保存所有标签，但是一定要点击，不然不会保存。';

//定义音频可视化组件
let wavesurfer;
let tip_region = null;

const gridStyle = {
  width: '100%',
  textAlign: 'left',
};

const { TabPane } = Tabs;

const Index = (props) => {
  // console.log(props);
  const { dispatch, Pretreatment, location } = props;
  const [path, setpath] = useState(undefined);
  const [tab, settab] = useState('1');
  const [form] = Form.useForm();

  function chooseCurrentRegion(region) {
    console.log('wavesurfer.regions.list', wavesurfer.regions.list);
    // 设置点击的region为其它颜色，方便交互
    Object.keys(wavesurfer.regions.list).map(function (id) {
      console.log('id', id);
      if (id === region.id) {
        wavesurfer.regions.list[id].update({
          color: 'rgba(242,136,57,0.4)',
        });
      } else {
        wavesurfer.regions.list[id].update({
          color: 'rgba(100,149,237,0.3)',
        });
      }
    });
    const newData = wavesurfer.regions.list;
    console.log('new wavesurfer.regions.list', newData);
  }

  useEffect(() => {
    console.log('pretreatment', Pretreatment);
    if (Pretreatment.audio_id !== audio_id_dup) {
      if (Pretreatment.audio_id) {
        if (tab === '1') {
          request(`/v1/file/duplicate_url/${Pretreatment.audio_id}`, {
            method: 'GET',
          }).then((res) => {
            // console.log(
            //   '经过随机化处理的副本路径',
            //   res?.url + '?ran=' + randomString(true, 5, 15),
            // );
            setpath(res?.url + '?ran=' + randomString(true, 5, 15));
          });
        } else {
          request(`/v1/file/now_version_url/${Pretreatment.audio_id}`, {
            method: 'GET',
          }).then((res) => {
            // console.log('版本文件路径', res?.url);
            setpath(res?.url);
          });
        }
      }

      audio_id_dup = Pretreatment.audio_id;
    }
    return () => {};
  }, [Pretreatment, tab]);

  useEffect(() => {
    if (Pretreatment.audio_id) {
      if (tab === '2') {
        dispatch({
          type: 'pretreatment/getTips',
          payload: Pretreatment.audio_id,
        });
      } else {
        dispatch({
          type: 'pretreatment/getVersions',
          payload: Pretreatment.audio_id,
        });
      }
    }
  }, [tab, Pretreatment.audio_id]);

  /**
   * Display annotation.
   */
  function showNote(region) {
    console.log('region-in方法');
    if (!showNote.el) {
      showNote.el = document.querySelector('#subtitle');
    }
    showNote.el.textContent = region.data.note || '–';
  }

  function editAnnotation(region) {
    console.log('保存的region', region);
    // const newNote=form.getFieldsValue().note
    form.getFieldsValue();
    console.log('editAnnotation()');
    form.setFieldsValue({
      start: region.start.toFixed(3),
      end: region.end.toFixed(3),
      // note: newNote===undefined?region.data.note:newNote || '',
      note: region.data.note || '',
    });
    // console.log('region.list',region.list)

    region_now = region;
    console.log('点击后的region_now', region_now);
  }

  const Waveform = () => {
    /**
     * Load regions.
     */
    function loadRegions(regions) {
      let _regions = undefined;
      if (regions && regions.length !== 0) {
        _regions = JSON.parse(regions);
      }
      if (tab === '2' && _regions) {
        // console.log(_regions);
        _regions.forEach(function (region) {
          region.color = 'rgba(100,149,237,0.3)';
          wavesurfer.addRegion(region);
        });
      } else if (tab === '1' && tip_region) {
        // console.log(tip_region);
        tip_region.forEach(function (region) {
          region.color = 'rgba(100,149,237,0.3)';
          wavesurfer.addRegion(region);
        });
      }
    }

    useEffect(() => {
      var menu = document.getElementById('editMenu');
      document.onclick = function () {
        menu.style.display = 'none';
      };

      wavesurfer = WaveSurfer.create({
        // backgroundColor: 'black',
        container: '#waveform',
        waveColor: 'skyblue',
        progressColor: '#1e90ff',
        splitChannels: true,
        cursorColor: '#bdc3c7',
        cursorWidth: 1, // 鼠标点击的竖线宽度
        // barWidth: 1,
        // barHeight: 1, // the height of the wave
        barRadius: 3,
        plugins: [
          WaveSurfer.cursor.create({
            showTime: true,
            opacity: 1,
            color: '#bdc3c7',
            customShowTimeStyle: {
              'background-color': '#000',
              color: 'white',
              padding: '2px',
              'font-size': '10px',
            },
          }),
          // WaveSurfer.spectrogram.create({
          //   wavesurfer: wavesurfer,
          //   container: '#wave-spectrogram',
          //   labels: true,
          // }),
          WaveSurfer.regions.create(),
          WaveSurfer.timeline.create({
            height: 20,
            container: '#wave-timeline',
            color: 'red',
          }),
        ],
      });

      if (path) {
        // console.log('path', path);
        wavesurfer.load(path);
      }

      wavesurfer.on('ready', function () {
        // console.log('regions',regions)
        wavesurfer.enableDragSelection({
          color: 'rgba(100,149,237,0.3)', // 设置可拖拽区域的颜色
          // waveColor: 'red',
        });
        wavesurfer.clearRegions();
        loadRegions(Pretreatment.tips);
      });

      // 鼠标在region中点击时触发
      wavesurfer.on('region-click', function (region, e) {
        chooseCurrentRegion(region);
        wavesurfer.enableDragSelection({
          color: 'rgba(100,149,237,0.3)', // 设置可拖拽区域的颜色
        });
        // console.log('点击的区域', region);
        // console.log('e', e);
        e.stopPropagation();
        e.shiftKey ? region.playLoop() : region.play();
      });

      // 鼠标在region中点击时触发
      wavesurfer.on('region-click', editAnnotation);
      wavesurfer.on('region-in', showNote);

      // Progress bar
      (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function (percent) {
          progressDiv.style.display = 'block';
          progressBar.style.width = percent + '%';
          // if(percent === 100) {
          //   progressDiv.style.display = 'none';
          // } else {
          //   progressDiv.style.display = 'block';
          // }
        };

        var hideProgress = function () {
          console.log('over!!');
          progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
      })();

      return () => {
        wavesurfer = null;
      };
    }, [path]);

    const handle_save_audio = () => {
      console.log(Pretreatment);
      dispatch({
        type: 'pretreatment/saveAudio',
        payload: {
          file_name: Pretreatment.audio_name,
          audio_id: Pretreatment.audio_id,
        },
      });
    };

    const handle_reset = (version) => {
      dispatch({
        type: 'pretreatment/reset',
        payload: {
          file_name: Pretreatment.audio_name,
        },
      }).then(() => {
        const _path = path + '?ran=' + randomString(true, 5, 15);
        setpath(_path);
      });
    };

    return (
      <>
        <div style={{ backgroundColor: '#3D3D3D' }}>
          <p id="subtitle" className="text-center text-info">
            &nbsp;
          </p>
          <div id="wave-timeline"></div>
          <div id="waveform">
            <div
              className="progress progress-striped active"
              id="progress-bar"
              style={{ display: 'none' }}
            >
              <div className="progress-bar progress-bar-info"></div>
            </div>
          </div>
          <div
            id="wave-spectrogram"
            style={{ display: tab === '1' ? 'block' : 'none' }}
          ></div>
          <div style={{ marginTop: 20, float: 'left' }}>
            <Button
              type="primary"
              onClick={() => {
                if (wavesurfer) {
                  wavesurfer.skip(0 - wavesurfer.getCurrentTime());
                }
              }}
              style={{
                float: 'left',
                marginRight: 20,
              }}
            >
              复位
            </Button>
            <Popover
              content="将修改后的音频保存为一个版本存储，会在下方的版本记录中显示历史版本。"
              title="保存音频"
            >
              <Button
                type="primary"
                onClick={handle_save_audio}
                style={{
                  float: 'left',
                  marginRight: 20,
                  display: tab === '1' ? 'block' : 'none',
                }}
              >
                保存音频
              </Button>
            </Popover>
            <Popover
              content="将当前被修改后的音频重置到当前版本状态，注意不是重置到最初状态。"
              title="重置"
            >
              <Button
                type="primary"
                onClick={handle_reset}
                style={{
                  float: 'left',
                  marginRight: 20,
                  display: tab === '1' ? 'block' : 'none',
                }}
              >
                重置为当前版本
              </Button>
            </Popover>
            <Button
              type="primary"
              onClick={() => {
                window.open(path, '_blank');
              }}
              style={{
                float: 'left',
                marginRight: 20,
                display:
                  tab === '1' && CookieUtil.get('role') !== '3'
                    ? 'block'
                    : 'none',
              }}
            >
              导出当前音频
            </Button>
            <Popover content="将所有鼠标拖动过的标签保存。">
              <Button
                type="primary"
                onClick={handle_save_regions}
                style={{
                  float: 'left',
                  marginRight: 20,
                  display: tab === '2' ? 'block' : 'none',
                }}
              >
                保存所有标签
              </Button>
            </Popover>
            <Button
              type="primary"
              id="btnPlay"
              style={{ fontSize: 15 }}
              onClick={() => {
                wavesurfer.playPause();
              }}
            >
              <PlayCircleOutlined />/<PauseOutlined />
            </Button>
          </div>
        </div>
        <Slider
          defaultValue={20}
          max={5000}
          min={20}
          style={{ marginTop: 80 }}
          onChange={(value) => {
            if (wavesurfer) wavesurfer.zoom(value);
          }}
        />
      </>
    );
  };
  /**
   * @description: 保存所有标签
   * @param {*}
   * @return {*}
   */
  const handle_save_regions = () => {
    var regions = Object.keys(wavesurfer.regions.list).map(function (id) {
      var region = wavesurfer.regions.list[id];
      return {
        start: region.start,
        end: region.end,
        data: region.data,
      };
    });
    console.log(JSON.stringify(regions));
    dispatch({
      type: 'pretreatment/saveTips',
      payload: {
        audio_id: Pretreatment.audio_id,
        regions: JSON.stringify(regions),
      },
    });
    form.setFieldsValue({
      start: null,
      end: null,
      note: null,
    });
  };

  //保存某个区域到wavesurfer的regions数组里
  // 修改，使其点击后能够将标签直接保存到下面的列表中
  const handle_save_region_tag = () => {
    // console.log(form.getFieldsValue())
    if (region_now != undefined) {
      region_now.update({
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        data: {
          note: form.getFieldsValue().note,
        },
      });
    }
    /* wavesurfer.regions.list[region_now.id].update({
      start: form.getFieldsValue().start,
      end: form.getFieldsValue().end,
      data: {
        note: form.getFieldsValue().note,
      },
    }); */
    // 同时保存所有标签（因为只有一个保存所有标签的接口）
    handle_save_regions();
  };

  const handle_save_region_edit = () => {
    // console.log(form.getFieldsValue())
    if (region_now != undefined) {
      region_now.update({
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        data: {
          note: form.getFieldsValue().note,
        },
      });
    }
  };

  const handle_copy = () => {
    // console.log(Pretreatment);
    var regions = Object.keys(wavesurfer.regions.list).map(function (id) {
      var region = wavesurfer.regions.list[id];
      return {
        start: region.start,
        end: region.end,
        data: region.data,
      };
    });
    console.log(regions);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btncopy',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
      callback: (res) => {},
    });
  };

  // 正确的在dispatch中拿到回调  其实就是一个收集-发布的过程！
  const handle_paste = () => {
    // console.log(Pretreatment);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btnpaste',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
      callback: (res) => {
        // console.log(res);
        const _path = path + '?ran=' + randomString(true, 5, 15);
        tip_region = [
          {
            start: parseFloat(form.getFieldsValue().start),
            end:
              parseFloat(form.getFieldsValue().start) + res?.audio_lenth / 1000,
            data: {
              note: '',
            },
          },
        ];
        form.resetFields();
        setpath(_path);
      },
    });
  };

  const handle_delete = () => {
    // console.log(Pretreatment);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btndelete',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
      callback: (res) => {
        console.log(res);
        const _path = path + '?ran=' + randomString(true, 5, 15);
        tip_region = [
          {
            start: parseFloat(form.getFieldsValue().start),
            end: parseFloat(form.getFieldsValue().start) + 0.05,
            data: {
              note: '',
            },
          },
        ];
        form.resetFields();
        setpath(_path);
      },
    });
  };

  const handle_cut = () => {
    // console.log(Pretreatment);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btncut',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
      callback: (res) => {
        const _path = path + '?ran=' + randomString(true, 5, 15);
        tip_region = [
          {
            start: parseFloat(form.getFieldsValue().start),
            end: parseFloat(form.getFieldsValue().start) + 0.05,
            data: {
              note: '',
            },
          },
        ];
        form.resetFields();
        setpath(_path);
      },
    });
  };

  const output = (version) => {
    request('/v1/pretreatment/output', {
      method: 'post',
      data: {
        file_name: Pretreatment.audio_name,
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
      },
    }).then((res) => {
      console.log(res);
      const outputUrl = res + '?ran=' + randomString(true, 5, 15);
      form.resetFields();
      window.open(outputUrl, '_blank');
    });
  };

  const RollBackLine = (props) => {
    const [title, settitle] = useState('初始版本');
    // const [loading, setloading] = useState(false);

    useEffect(() => {
      // console.log(Pretreatment)
      if (
        Pretreatment.audio_versions &&
        Pretreatment.audio_versions.length != 0
      ) {
        settitle(Pretreatment.audio_versions[0].now_version);
      }
    }, [Pretreatment]);

    const handle_rollBack = (version) => {
      dispatch({
        type: 'pretreatment/rollBack',
        payload: {
          target_version: version,
          file_name: Pretreatment.audio_name,
        },
      }).then(() => {
        const _path = path + '?ran=' + randomString(true, 5, 15);
        setpath(_path);
        dispatch({
          type: 'pretreatment/getVersions',
          payload: Pretreatment.audio_id,
        });
      });
    };

    return (
      <div
        style={{
          overflowY: 'scroll',
          height: 350,
          display:
            Pretreatment?.audio_versions && tab === '1' ? 'block' : 'none',
          marginTop: 32,
        }}
      >
        {/* <Spin spinning={loading}> */}
        <h4>
          <b>
            音频版本信息(当前版本：
            {title}
            ):
          </b>
        </h4>
        <Timeline style={{ marginTop: 20 }} className={style.timeLine}>
          {Pretreatment.audio_versions?.map((item, index) => {
            return index === 0 ? null : (
              <Timeline.Item>
                <p style={{ color: '#08979c' }}>
                  {item.generate_time}&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
                <p>
                  <span style={{ color: '#08979c' }}>
                    {' '}
                    {`${item.user?.role_str}${item.user?.nickname}`}{' '}
                  </span>
                  保存了版本
                  <span style={{ color: '#08979c' }}> {item.version} </span>。
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </p>
                <a
                  style={{ marginRight: 20, color: '#ff4d4f' }}
                  onClick={() => {
                    handle_rollBack(item.version);
                  }}
                >
                  回滚
                </a>
              </Timeline.Item>
            );
          })}
        </Timeline>
        {/* </Spin> */}
      </div>
    );
  };

  const handle_type_change = (key) => {
    audio_id_dup = undefined;
    wavesurfer = undefined;
    settab(key);
  };

  const handle_remove_region_tag = () => {
    if (!region_now) {
      message.warning('请先通过点击以选择一片区域！');
    } else {
      region_now.remove();
    }
    handle_save_regions();
  };
  const handle_remove_region_edit = () => {
    if (!region_now) {
      message.warning('请先通过点击以选择一片区域！');
    } else {
      region_now.remove();
    }
    // handle_save_regions();
  };

  return (
    <div>
      <div className={style.rightContent}>
        <div className={style.rightCenter}>
          <h3>数据整编</h3>
          <div
            style={{
              backgroundColor: 'white',
              height: 2,
              width: '100%',
              marginTop: -5,
              marginBottom: 5,
            }}
          ></div>
          <h3 id="fileName">从左栏选取文件进行编辑</h3>
          <Tabs defaultActiveKey="1" onChange={handle_type_change}>
            <TabPane tab="音频编辑" key="1"></TabPane>
            <TabPane tab="标签处理" key="2"></TabPane>
          </Tabs>

          <Alert
            message={alert_message_1}
            type="warning"
            showIcon
            style={{ display: tab == '2' ? 'none' : 'block' }}
          />
          <Alert
            message={alert_message_2_1}
            type="warning"
            showIcon
            style={{ display: tab == '1' ? 'none' : 'block' }}
          />
          <Alert
            message={alert_message_2_2}
            type="warning"
            showIcon
            style={{ display: tab == '1' ? 'none' : 'block' }}
          />

          <Form
            name="edit"
            form={form}
            style={{ marginTop: 20, marginBottom: 20, height: 32 }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Tooltip title="修改后请及时单击右键-保存该标签">
                  <Form.Item name="start" label="开始时间">
                    <Input id="regionStart" name="start" autoComplete="off" />
                  </Form.Item>
                </Tooltip>
              </Col>
              <Col span={6}>
                <Tooltip title="修改后请及时单击右键-保存该标签">
                  <Form.Item name="end" label="结束时间">
                    <Input id="regionEnd" name="end" autoComplete="off" />
                  </Form.Item>
                </Tooltip>
              </Col>
              <Col
                span={12}
                style={{ display: tab === '2' ? 'block' : 'none' }}
              >
                <Tooltip title="修改后请及时单击右键-保存该标签">
                  <Form.Item name="note" label="备注">
                    <Input id="regionNote" name="note" autoComplete="off" />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>
          </Form>

          <div
            className={style.showWave}
            style={{ height: tab === '2' ? 388 : 458 }}
          >
            <Waveform />
          </div>

          <RollBackLine />

          <div
            style={{
              height: 500,
              overflowY: 'auto',
              marginTop: 48,
              display: tab === '2' ? 'block' : 'none',
            }}
          >
            <Card
              title="标签列表"
              style={{
                backgroundColor: '#272727',
              }}
            >
              {typeof Pretreatment.tips !== 'string'
                ? null
                : JSON.parse(Pretreatment.tips).map((item, index) => {
                    console.log(item);
                    return (
                      <Card.Grid style={gridStyle} key={index}>
                        <Row gutter={16}>
                          <Col span={2}>{index + 1}</Col>
                          <Col span={3}>{`开始时间：${item.start}s`}</Col>
                          <Col span={3}>{`结束时间：${item.end}s`}</Col>
                          <Col span={12}>{`备注：${item.data.note}`}</Col>
                          <Col span={4}>
                            <Button
                              type="primary"
                              onClick={() => {
                                console.log(
                                  'wavesurfer.getCurrentTime()',
                                  wavesurfer.getCurrentTime(),
                                );
                                wavesurfer.skip(
                                  item.start - wavesurfer.getCurrentTime(),
                                );
                                console.log('item', item);
                                editAnnotation(item);
                                Object.keys(wavesurfer.regions.list).map(
                                  function (id) {
                                    if (
                                      wavesurfer.regions.list[id].start ===
                                      item.start
                                    ) {
                                      chooseCurrentRegion(
                                        wavesurfer.regions.list[id],
                                      );
                                      showNote(wavesurfer.regions.list[id]);
                                    }
                                  },
                                );
                              }}
                            >
                              定位到标签
                            </Button>
                          </Col>
                        </Row>
                      </Card.Grid>
                    );
                  })}
            </Card>
          </div>
        </div>
      </div>

      <div
        style={{
          width: 150,
          height: 200,
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 9,
          display: 'none',
          borderRadius: 0,
        }}
        id="editMenu"
        className="btn-group-vertical"
        role="group"
      >
        <button
          type="button"
          className="btn btn-default"
          id="saveRegion"
          onClick={
            tab === '1' ? handle_save_region_edit : handle_save_region_tag
          }
        >
          {tab === '1' ? '设置区域' : '保存该标签'}
        </button>
        <button
          type="button"
          className="btn btn-default"
          id="deleteRegion"
          onClick={
            tab === '1' ? handle_remove_region_edit : handle_remove_region_tag
          }
        >
          {tab === '1' ? '删除区域' : '删除该标签'}
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={handle_copy}
          style={{ display: tab === '1' ? 'block' : 'none' }}
        >
          复制
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={handle_paste}
          style={{ display: tab === '1' ? 'block' : 'none' }}
        >
          粘贴
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={handle_delete}
          style={{ display: tab === '1' ? 'block' : 'none' }}
        >
          删除音频区域
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={handle_cut}
          style={{ display: tab === '1' ? 'block' : 'none' }}
        >
          剪切
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={output}
          style={{
            display:
              tab === '1' && CookieUtil.get('role') !== '3' ? 'block' : 'none',
          }}
        >
          导出
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ pretreatment, loading }) => {
  return {
    Pretreatment: pretreatment,
    versionsLoading: loading.effects['pretreatment/getVersions'],
  };
};

export default connect(mapStateToProps)(Index);
