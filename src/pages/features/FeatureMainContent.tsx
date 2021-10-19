/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors: Please set LastEditors
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime: 2021-10-19 11:44:46
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\features\index.jsx
 */
import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
// import '../main.less';
// import '../audioEdit/edit.less';
import { Menu, Popover, Statistic } from 'antd';
import { PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import { Input, Button, Form, Table } from 'antd';
import axios from 'axios';
import request from '@/utils/request';
import PowerApp from '../power/index.jsx';
import DemonApp from '../demonAnalysis/index';
import MelApp from '../melSpectrogram/index';
import LofarApp from '../lofarV1/index';
import ZeroApp from '../zeroCrossing/index';
import MCFFApp from '../MCFF/index';
import BasicSoundData from './basicSoundData';
import FeatureRightMenu from './FeatureRightMenu';

const FeatureMainContent = (props) => {
  const { FeaturesInfor, dispatch, path, f_key } = props;
  const FeatureMainDiv = {
    1: (
      <div>
        <PowerApp
          audio_id={FeaturesInfor.audio_id}
          audio_name={FeaturesInfor.audio_name}
        />
      </div>
    ),
    2: (
      <div>
        <LofarApp
          audio_id={FeaturesInfor.audio_id}
          audio_name={FeaturesInfor.audio_name}
        />
      </div>
    ),
    3: (
      <div>
        <DemonApp
          audio_id={FeaturesInfor.audio_id}
          audio_name={FeaturesInfor.audio_name}
          path={path}
        />
      </div>
    ),

    4: (
      <div>
        <MCFFApp audio_id={FeaturesInfor.audio_id} dispatch={dispatch} />
      </div>
    ),
    5: (
      <div>
        <ZeroApp
          audio_id={FeaturesInfor.audio_id}
          audio_name={FeaturesInfor.audio_name}
          path={path}
        />
      </div>
    ),
    6: (
      <div>
        <MelApp
          audio_id={FeaturesInfor.audio_id}
          audio_name={FeaturesInfor.audio_name}
          signal_type={FeaturesInfor.signal_type}
          dispatch={dispatch}
        />
      </div>
    ),
  };

  return FeatureMainDiv[f_key] ? FeatureMainDiv[f_key] : null;
};

const mapStateToProps = ({ features, loading }) => {
  return {
    FeaturesInfor: features,
    f_key: features.menu_key,
  };
};

export default connect(mapStateToProps)(FeatureMainContent);
