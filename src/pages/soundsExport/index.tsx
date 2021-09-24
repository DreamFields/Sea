import React, { useState, useEffect } from 'react';
import { GetExportList } from '../service';
import { Radio, Table } from 'antd';
import styles from './index.less';
export default () => {
  const signalType = {
    RadiatedNoise: 1, //辐射噪声
    TargetEcho: 2, //目标回声
    ActivePulse: 3, //主动脉冲
  };
  const [signal_type, setSignal_type] = useState(signalType.RadiatedNoise);
  const [ActivePulse_list, setActivePulse_list] = useState([]);
  const [RadiatedNoise_list, setRadiatedNoise_list] = useState([]);
  const [TargetEcho_list, setTargetEcho_list] = useState([]);
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '上传时间',
      dataIndex: 'upload_time',
    },
  ];
  useEffect(() => {
    GetExportList().then((res: any) => {
      setActivePulse_list(
        res.ActivePulse_list.map((item) => ({
          name: item.name,
          upload_time: item.upload_time,
          key: item.sound_id,
        })),
      );
      setRadiatedNoise_list(
        res.RadiatedNoise_list.map((item) => ({
          name: item.name,
          upload_time: item.upload_time,
          key: item.sound_id,
        })),
      );
      setTargetEcho_list(
        res.TargetEcho_list.map((item) => ({
          name: item.name,
          upload_time: item.upload_time,
          key: item.sound_id,
        })),
      );
    });
  }, []);
  const onChange = (e) => {
    console.log('signal_type', signal_type);
    setSignal_type(e.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.radio}>
        <Radio.Group onChange={onChange} value={signal_type}>
          <Radio value={signalType.RadiatedNoise}>辐射噪声</Radio>
          <Radio value={signalType.TargetEcho}>目标回声</Radio>
          <Radio value={signalType.ActivePulse}>主动脉冲</Radio>
        </Radio.Group>
      </div>
      <Table></Table>
    </div>
  );
};
