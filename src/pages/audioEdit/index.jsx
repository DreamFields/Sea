import React, { useEffect, useState } from 'react';
import style from './edit.less';
import { connect, Dispatch } from 'umi';
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import { Input, Button, Timeline } from 'antd';
import axios from 'axios';
import demoWav from '@/assets/demo0.wav';
import request from '@/utils/request';
import Cookies from 'js-cookie';

let sound_name = '';
let sound_path = '';
let sound_id = '';
let region_now;

const Index = props => {
  const { dispatch, Pretreatment } = props;
  const [path, setpath] = useState(undefined);

  useEffect(() => {
    console.log('pretreatment', Pretreatment);
    if (Pretreatment?.audio) {
      if (Pretreatment.audio.audio_name) {
        request(`/v1/file/audio_url/${Pretreatment.audio.audio_name}`, {
          method: 'GET',
        }).then(res => {
          // console.log(res)
          setpath(res.url);
          // console.log(path);
        });
      }
    }
  }, [Pretreatment]);

  const Waveform = () => {
    useEffect(() => {
      var menu = document.getElementById('editMenu');
      document.onclick = function() {
        menu.style.display = 'none';
      };

      var wavesurfer = WaveSurfer.create({
        backgroundColor: 'black',
        container: '#waveform',
        waveColor: '#2ecc71',
        progressColor: '#2ecc71',
        // splitChannels: true,
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

      wavesurfer.load(path ? path : '123');

      wavesurfer.on('ready', function() {
        wavesurfer.enableDragSelection({
          color: 'rgba(112,500,130,0.3)',
        });
        const data = [{ start: 10, end: 20, data: { note: 'yes!' } }];
        wavesurfer.clearRegions();
        loadRegions(data);
        // axios({
        //   url: 'https://hv90v1ql-xloskyer.mock.coding.io/v1/pretreatment/getTips/2',
        //   method: 'GET',
        // }).then(res => {
        //   console.log(eval(res.data.data));
        //   wavesurfer.clearRegions();
        //   loadRegions(eval(res.data.data));
        // });
      });

      wavesurfer.on('region-click', function(region, e) {
        e.stopPropagation();
        // Play on click, loop on shift click
        e.shiftKey ? region.playLoop() : region.play();
      });

      wavesurfer.on('region-click', editAnnotation);
      wavesurfer.on('region-in', showNote);
      // wavesurfer.on('region-updated', saveRegions);
      // wavesurfer.on('region-removed', saveRegions);

      /**
       * Save annotations to localStorage.
       */
      function saveRegions() {
        var regions = Object.keys(wavesurfer.regions.list).map(function(id) {
          var region = wavesurfer.regions.list[id];
          return {
            start: region.start,
            end: region.end,
            data: region.data,
          };
        });
        // console.log(regions)
        axios({
          url: 'http://47.97.152.219:82/v1/pretreatment/saveTips',
          method: 'POST',
          data: { sound_id: sound_id, regions: JSON.stringify(regions) },
        }).then(res => {
          // console.log(res)
        });
      }

      /**
       * Load regions from localStorage.
       */
      function loadRegions(regions) {
        regions.forEach(function(region) {
          region.color = 'rgba(112,500,130,0.3)';
          wavesurfer.addRegion(region);
        });
      }

      /**
       * Display annotation.
       */
      function showNote(region) {
        if (!showNote.el) {
          showNote.el = document.querySelector('#subtitle');
        }
        showNote.el.textContent = region.data.note || '–';
      }

      function editAnnotation(region) {
        var form = document.forms.edit;
        (form.elements.start.value = region.start.toFixed(3)),
          (form.elements.end.value = region.end.toFixed(3));
        form.elements.note.value = region.data.note || '';

        region_now = region;

        form.dataset.region = region.id;
      }

      saveRegion.addEventListener('click', function(e) {
        // form.style.opacity = 1;
        // console.log(region_now)
        if (region_now != undefined) {
          region_now.update({
            start: document.querySelector('#regionStart').value,
            end: document.querySelector('#regionEnd').value,
            data: {
              note: document.querySelector('#regionNote').value,
            },
          });
        }

        // console.log(region_now);
        saveRegions();
        alert('success save!');
      });

      deleteRegion.addEventListener('click', function(e) {
        // form.style.opacity = 0;
        region_now.remove();
        // form.dataset.region = null;
        saveRegions();
      });

      audioDelete.addEventListener('click', function() {
        axios({
          url: 'http://47.97.152.219:82/v1/datamanage/sounds/' + sound_id,
          method: 'delete',
        }).then(res => {
          alert(res.data.msg);
        });
      });

      btnPlay.addEventListener('click', function() {
        wavesurfer.playPause();
      });

      btnLoad.addEventListener('click', function() {
        if (sound_path == '') {
          alert(
            '请点击左侧文件树上的节点选取单个音频，注意不是点击节点前的复选框!',
          );
        } else {
          console.log(sound_path);
          let str = '/var/www/html/seadist';
          wavesurfer.load(sound_path.replace(str, '.'));
        }
      });
      btncopy.addEventListener('click', function() {
        const sound_path =
          'D:\\万老师项目\\海工demo\\Seadata-front\\public\\demo0.wav';
        const user_id = 1;
        dispatch({
          type: 'pretreatment/editAudio',
          payload: {
            operateName: 'btncopy',
            start: 10.0,
            end: 20.0,
            audio_path: sound_path,
            user_id: user_id,
          },
        });
      });
      btncut.addEventListener('click', function() {
        const sound_path = 'D:\\test.wav';
        const user_id = 1;
        dispatch({
          type: 'pretreatment/editAudio',
          payload: {
            operateName: 'btncut',
            start: 0.0,
            end: 5.0,
            audio_path: sound_path,
            user_id: user_id,
          },
        });
      });
      btndelete.addEventListener('click', function() {
        const sound_path = 'D:\\test.wav';
        const user_id = 2;
        dispatch({
          type: 'pretreatment/editAudio',
          payload: {
            operateName: 'btndelete',
            start: 0.0,
            end: 3.0,
            audio_path: sound_path,
            user_id: user_id,
          },
        });
      });
      btnpaste.addEventListener('click', function() {
        const sound_path = 'D:\\test.wav';
        const user_id = 3;
        dispatch({
          type: 'pretreatment/editAudio',
          payload: {
            operateName: 'btnpaste',
            start: 0.0,
            end: 3.0,
            audio_path: sound_path,
            user_id: user_id,
          },
        });
      });

      function sendEdit(node) {
        var operateName = node.getAttribute('id');
        var start = document.querySelector('#regionStart').value;
        var end = document.querySelector('#regionEnd').value;
        axios({
          url: 'http://47.97.152.219:82/v1/pretreatment/editAudio',
          method: 'POST',
          data: {
            operateName: operateName,
            start: start,
            end: end,
            audio_path: sound_path,
          },
        }).then(res => {
          alert(res.data.status);
          // console.log(res.data);
          let str = '/var/www/html/seadist';
          let origin_len = region_now.end - region_now.start;
          console.log(origin_len);
          let paste_len = res.data.paste_len / 1000;
          if (operateName == 'btnpaste') {
            // console.log(paste_len - origin_len)
            axios({
              url:
                'http://47.97.152.219:82/v1/pretreatment/getTips/' + sound_id,
              method: 'GET',
            }).then(res => {
              let pre_regions = JSON.parse(res.data.regions);
              // console.log(pre_regions);
              pre_regions.forEach(function(reg) {
                // console.log(reg);
                if (reg.start > region_now.start) {
                  reg.start = reg.start + paste_len - origin_len;
                  reg.end = reg.end + paste_len - origin_len;
                } else if (
                  reg.start == region_now.start &&
                  reg.end == region_now.end
                ) {
                  reg.end = reg.start + paste_len;
                }
              });

              // console.log(pre_regions);
              axios({
                url: 'http://47.97.152.219:82/v1/pretreatment/saveTips',
                method: 'POST',
                data: {
                  sound_id: sound_id,
                  regions: JSON.stringify(pre_regions),
                },
              }).then(res => {
                wavesurfer.load(sound_path.replace(str, '.'));
              });
            });
          } else if (operateName == 'btncut' || operateName == 'btndelete') {
            axios({
              url:
                'http://47.97.152.219:82/v1/pretreatment/getTips/' + sound_id,
              method: 'GET',
            }).then(res => {
              let pre_regions = JSON.parse(res.data.regions);
              // console.log(pre_regions);
              console.log(pre_regions);
              let index = 0;
              pre_regions.forEach(function(reg) {
                console.log(reg);
                if (reg.start > region_now.start) {
                  reg.start = reg.start - origin_len;
                  reg.end = reg.end - origin_len;
                }
              });
              pre_regions.forEach(function(reg) {
                console.log(reg);
                if (
                  reg.start == region_now.start &&
                  reg.end == region_now.end
                ) {
                  pre_regions.splice(index, 1);
                }
                index += 1;
              });

              // console.log(pre_regions);
              axios({
                url: 'http://47.97.152.219:82/v1/pretreatment/saveTips',
                method: 'POST',
                data: {
                  sound_id: sound_id,
                  regions: JSON.stringify(pre_regions),
                },
              }).then(res => {
                wavesurfer.load(sound_path.replace(str, '.'));
              });
            });
          }
        });
      }

      // Progress bar
      (function() {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function(percent) {
          progressDiv.style.display = 'block';
          progressBar.style.width = percent + '%';
        };

        var hideProgress = function() {
          progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
      })();
    }, [1]);

    return (
      <>
        <div style={{ backgroundColor: '#3D3D3D' }}>
          <p id="subtitle" className="text-center text-info">
            &nbsp;
          </p>
          <div id="wave-timeline"></div>
          <div id="waveform" style={{ backgroundColor: 'black' }}>
            <div className="progress progress-striped active" id="progress-bar">
              <div className="progress-bar progress-bar-info"></div>
            </div>
          </div>
          <div id="wave-spectrogram"></div>
          <div style={{ marginTop: 10, marginLeft: 10, float: 'left' }}>
            <Button
              type="dashed"
              id="btnLoad"
              style={{ float: 'left', marginRight: 20 }}
            >
              保存
            </Button>
            <Button
              type="dashed"
              id="audioDelete"
              style={{ float: 'left', marginRight: 20 }}
            >
              删除
            </Button>
            <Button type="dashed" id="btnPlay" style={{ fontSize: 15 }}>
              <PlayCircleOutlined />/<PauseOutlined />
            </Button>
          </div>
        </div>
      </>
    );
  };

  // useEffect(() => {
  //   const targetNode = document.getElementById('fileName');
  //   const config = { 'characterData': true, attributes: true };
  //   var observer = new MutationObserver(function (mutations) {
  //     // console.log(targetNode.innerHTML);
  //     sound_id = localStorage['sound_id'];
  //     console.log(localStorage['sound_path']);
  //     sound_path = localStorage['sound_path'];

  //   });
  //   observer.observe(targetNode, config);

  // })

  const roll_back_data = [
    {
      version: 3,
      time: '2020-11-01 15:36:21',
    },
    {
      version: 2,
      time: '2020-10-28 17:28:39',
    },
    {
      version: 1,
      time: '2020-10-22 09:33:17',
    },
    {
      version: 0,
      time: '2020-10-20 13:55:20',
    },
  ];

  const RollBackLine = props => {
    return (
      <>
        <Timeline mode="right">
          {roll_back_data.map(item => {
            return (
              <Timeline.Item
                label={item.time}
                position="left"
                style={{ marginLeft: '-80%' }}
              >
                <a style={{ marginRight: 20 }}>回滚</a>
                版本{item.version}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </>
    );
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
          <form
            name="edit"
            role="form"
            style={{ marginTop: 20, marginBottom: 20, height: 32 }}
          >
            <Input
              id="regionStart"
              name="start"
              autoComplete="off"
              style={{ width: 120, float: 'left', marginLeft: 0 }}
              placeholder="开始时间"
            />
            <Input
              id="regionEnd"
              name="end"
              autoComplete="off"
              style={{ width: 120, float: 'left', marginLeft: 20 }}
              placeholder="结束时间"
            />
            <Input
              id="regionNote"
              name="note"
              autoComplete="off"
              style={{ width: 720, float: 'left', marginLeft: 20 }}
              placeholder="标签"
            />
          </form>
          <div className={style.showWave}>
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
        }}
        id="editMenu"
        className="btn-group-vertical"
        role="group"
      >
        <button type="button" className="btn btn-default" id="saveRegion">
          保存
        </button>
        <button type="button" className="btn btn-default" id="deleteRegion">
          删除标记
        </button>
        <button type="button" className="btn btn-default" id="btncopy">
          复制
        </button>
        <button type="button" className="btn btn-default" id="btnpaste">
          粘贴
        </button>
        <button type="button" className="btn btn-default" id="btndelete">
          删除区域
        </button>
        <button type="button" className="btn btn-default" id="btncut">
          剪切
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ pretreatment }) => {
  // console.log("pretreatment", pretreatment);
  return {
    Pretreatment: pretreatment,
  };
};

export default connect(mapStateToProps)(Index);
