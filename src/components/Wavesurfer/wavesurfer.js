import React, { useEffect, useRef, useState } from 'react';
import { Slider } from 'antd';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';
import wavesurfer from 'wavesurfer.js';

const formWaveSurferOptions = (ref) => ({
  container: '#waveform',
  waveColor: '#eee',
  progressColor: '#1e90ff',
  cursorColor: '#bdc3c7',
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 150,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
  plugins: [
    RegionsPlugin.create(),
    TimelinePlugin.create({
      height: 20,
      container: '#wave-timeline',
    }),
    CursorPlugin.create({
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
  ],
});

export default function Waveform({ url }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    var menu = document.getElementById('editMenu');
    document.onclick = function () {
      menu.style.display = 'none';
    };
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.on('ready', function () {
      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        console.log(wavesurfer.current);
        console.log(WaveSurfer.spectrogram);
      }
      wavesurfer.current.enableDragSelection({
        color: 'rgba(100,149,237,0.3)',
      });
      wavesurfer.current.clearRegions();
    });

    wavesurfer.current.on('region-click', function (region, e) {
      e.stopPropagation();
      e.shiftKey ? region.playLoop() : region.play();
    });

    (function () {
      var progressDiv = document.querySelector('#progress-bar');
      var progressBar = progressDiv.querySelector('.progress-bar');

      var showProgress = function (percent) {
        progressDiv.style.display = 'block';
        progressBar.style.width = percent + '%';
      };

      var hideProgress = function () {
        console.log('over!!');
        progressDiv.style.display = 'none';
      };

      wavesurfer.current.on('loading', showProgress);
      wavesurfer.current.on('ready', hideProgress);
      wavesurfer.current.on('destroy', hideProgress);
      wavesurfer.current.on('error', hideProgress);
    })();

    wavesurfer.current.load(url);

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  return (
    <div>
      <div id="wave-timeline"></div>
      <div id="waveform" ref={waveformRef}>
        <div
          className="progress progress-striped active"
          id="progress-bar"
          style={{ display: 'none' }}
        >
          <div className="progress-bar progress-bar-info"></div>
        </div>
      </div>
      <div id="wave-spectrogram" style={{ overflowX: 'auto' }}></div>
      <div className="controls">
        <button onClick={handlePlayPause}>{!playing ? 'Play' : 'Pause'}</button>
        <Slider
          min={20}
          max={1000}
          defaultValue={20}
          style={{ width: 300 }}
          onChange={(value) => {
            // console.log("wavesufer", wavesurfer.params);
            if (wavesurfer.current) wavesurfer.current.zoom(value);
          }}
        />
      </div>
    </div>
  );
}
