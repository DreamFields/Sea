/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime : 2020-12-27 18:17:58
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\audioEdit\index.jsx
 */
import React, { useEffect, useState, useCallback } from 'react';
import style from './edit.less';
import { connect, Dispatch } from 'umi';
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import {
  Input,
  Button,
  Timeline,
  Form,
  Row,
  Col,
  Tabs,
  Spin,
  Popover,
  message,
} from 'antd';
import request from '@/utils/request';
import randomString from '@/utils/random.js';
import CookieUtil from '@/utils/cookie.js';

let region_now;
let audio_id_dup = undefined;

//定义音频可视化组件
let wavesurfer;

const { TabPane } = Tabs;

const Index = (props) => {
  // console.log(props);
  const { dispatch, Pretreatment, versionsLoading, location } = props;
  const [path, setpath] = useState(undefined);
  const [tab, settab] = useState('1');
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('pretreatment', Pretreatment);
    if (Pretreatment.audio_id !== audio_id_dup) {
      if (Pretreatment.audio_id) {
        if (tab === '1') {
          request(`/v1/file/duplicate_url/${Pretreatment.audio_id}`, {
            method: 'GET',
          }).then((res) => {
            console.log(
              '经过随机化处理的副本路径',
              res?.url + '?ran=' + randomString(true, 5, 15),
            );
            setpath(res?.url + '?ran=' + randomString(true, 5, 15));
          });
        } else {
          request(`/v1/file/now_version_url/${Pretreatment.audio_id}`, {
            method: 'GET',
          }).then((res) => {
            console.log('版本文件路径', res?.url);
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
      }
    }
  }, [tab]);

  const Waveform = () => {
    const [loading, setloading] = useState(undefined);

    function editAnnotation(region) {
      form.setFieldsValue({
        start: region.start.toFixed(3),
        end: region.end.toFixed(3),
        note: region.data.note || '',
      });
      region_now = region;
    }

    /**
     * Load regions.
     */
    function loadRegions(regions) {
      let _regions = undefined;
      if (regions && regions.length !== 0) {
        _regions = JSON.parse(regions);
      }
      if (tab === '2' && _regions) {
        console.log(_regions);
        _regions.forEach(function (region) {
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
        backgroundColor: 'black',
        container: '#waveform',
        waveColor: 'skyblue',
        progressColor: '#1e90ff',
        splitChannels: true,
        cursorColor: '#bdc3c7',
        cursorWidth: 1,
        // barWidth: 2,
        // barHeight: 1, // the height of the wave
        // barGap: 2, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
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
          WaveSurfer.spectrogram.create({
            wavesurfer: wavesurfer,
            container: '#wave-spectrogram',
            labels: true,
          }),
          WaveSurfer.regions.create(),
          WaveSurfer.timeline.create({
            height: 20,
            container: '#wave-timeline',
            color: 'red',
          }),
        ],
      });

      if (path) {
        console.log('path', path);
        wavesurfer.load(path);
      }

      wavesurfer.on('ready', function () {
        wavesurfer.enableDragSelection({
          color: 'rgba(100,149,237,0.3)',
        });
        wavesurfer.clearRegions();
        loadRegions(Pretreatment.tips);
      });
      wavesurfer.on('region-click', function (region, e) {
        e.stopPropagation();
        e.shiftKey ? region.playLoop() : region.play();
      });
      wavesurfer.on('region-click', editAnnotation);
      wavesurfer.on('region-in', showNote);

      /**
       * Display annotation.
       */
      function showNote(region) {
        if (!showNote.el) {
          showNote.el = document.querySelector('#subtitle');
        }
        showNote.el.textContent = region.data.note || '–';
      }

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

      // setTimeout(()=>{alert("aaa")}, 5000)
      // return () => {};
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
    };

    return (
      <>
        <div style={{ backgroundColor: '#3D3D3D' }}>
          <p id="subtitle" className="text-center text-info">
            &nbsp;
          </p>
          <div id="wave-timeline"></div>
          <div id="waveform" style={{ backgroundColor: 'black' }}>
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
            <Popover content="将所有设置过的标签保存。" title="保存所有标签">
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
      </>
    );
  };

  //保存某个区域到wavesurfer的regions数组里
  const handle_save_region = () => {
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
    console.log(Pretreatment);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btncopy',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
    });
  };

  const handle_paste = () => {
    console.log(Pretreatment);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btnpaste',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
    }).then(() => {
      const _path = path + '?ran=' + randomString(true, 5, 15);
      setpath(_path);
    });
  };

  const handle_delete = () => {
    console.log(Pretreatment);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btndelete',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
    }).then(() => {
      const _path = path + '?ran=' + randomString(true, 5, 15);
      setpath(_path);
    });
  };

  const handle_cut = () => {
    console.log(Pretreatment);
    dispatch({
      type: 'pretreatment/editAudio',
      payload: {
        operateName: 'btncut',
        start: form.getFieldsValue().start,
        end: form.getFieldsValue().end,
        file_name: Pretreatment.audio_name,
      },
    }).then(() => {
      const _path = path + '?ran=' + randomString(true, 5, 15);
      setpath(_path);
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
      window.open(outputUrl, '_blank');
    });
  };

  const RollBackLine = (props) => {
    const [title, settitle] = useState('初始版本');
    const [versions, setversions] = useState(undefined);
    const [loading, setloading] = useState(false);

    useEffect(() => {
      if (Pretreatment.audio_id && !versions) {
        // dispatch({
        //   type: 'pretreatment/getVersions',
        //   payload: Pretreatment.audio_id,
        // });
        setloading(true);
        request(`/v1/sound/all_version_asc/${Pretreatment.audio_id}`, {
          method: 'GET',
        }).then((res) => {
          // console.log("versions", res);
          if (res) {
            setversions(res);
            setloading(false);
            if (res[0]) {
              settitle(res[0].now_version);
            }
          }
        });
      }
    }, [Pretreatment]);

    const handle_rollBack = (version) => {
      setloading(true);
      dispatch({
        type: 'pretreatment/rollBack',
        payload: {
          target_version: version,
          file_name: Pretreatment.audio_name,
        },
      }).then(() => {
        const _path = path + '?ran=' + randomString(true, 5, 15);
        setpath(_path);
        request(`/v1/sound/all_version_asc/${Pretreatment.audio_id}`, {
          method: 'GET',
        }).then((res) => {
          setversions(res);
          setloading(false);
        });
      });
    };

    return (
      <div
        style={{
          overflowY: 'scroll',
          height: 350,
          display: versions ? 'block' : 'none',
          marginTop: 32,
        }}
      >
        <Spin spinning={loading}>
          <h4>
            <b>
              音频版本信息(当前版本：
              {title}
              ):
            </b>
          </h4>
          <Timeline style={{ marginTop: 20 }} className={style.timeLine}>
            {versions?.map((item, index) => {
              return index === 0 ? null : (
                <Timeline.Item>
                  <p style={{ color: '#08979c' }}>
                    {item.generate_time}&nbsp;&nbsp;&nbsp;&nbsp;
                  </p>
                  <p>
                    id为
                    <span style={{ color: '#08979c' }}> {item.user_id} </span>
                    的用户保存了版本
                    <span style={{ color: '#08979c' }}> {item.version} </span>。
                    {/* 保存文件名为：
                    <span style={{ color: '#08979c' }}> {item.filename} </span> */}
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
        </Spin>
      </div>
    );
  };

  const handle_type_change = (key) => {
    audio_id_dup = undefined;
    wavesurfer = undefined;
    settab(key);
  };

  const handle_remove_region = () => {
    if (!region_now) {
      message.warning('请先通过点击以选择一片区域！');
    } else {
      region_now.remove();
    }
  };

  return (
    <div>
      <div className={style.rightContent}>
        <div className={style.rightCenter}>
          <h3>数据预处理</h3>
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
          <Form
            name="edit"
            form={form}
            style={{ marginTop: 20, marginBottom: 20, height: 32 }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="start" label="开始时间">
                  <Input id="regionStart" name="start" autoComplete="off" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="end" label="结束时间">
                  <Input id="regionEnd" name="end" autoComplete="off" />
                </Form.Item>
              </Col>
              <Col
                span={12}
                style={{ display: tab === '2' ? 'block' : 'none' }}
              >
                <Form.Item name="note" label="标签">
                  <Input id="regionNote" name="note" autoComplete="off" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            className={style.showWave}
            style={{ height: tab === '2' ? 388 : 608 }}
          >
            <Waveform />
          </div>
          <RollBackLine />
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
          onClick={handle_save_region}
        >
          设置标记
        </button>
        <button
          type="button"
          className="btn btn-default"
          id="deleteRegion"
          onClick={handle_remove_region}
        >
          删除标记
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
          删除区域
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
