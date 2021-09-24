/*
 * @Author: your name
 * @Date: 2021-09-24 10:23:45
 * @LastEditTime: 2021-09-24 18:03:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /seaData/src/pages/soundsExport/index.tsx
 */
import React, { useState, useEffect } from 'react';
import { GetExportList, UploadExportList } from '../service';
import { Radio, Table, Button } from 'antd';
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
  const [tableData, setTableData] = useState([]);
  const [selectedIDList, setSelectedIDList] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const onRadioChange = (e) => {
    setSignal_type(e.target.value);
    switch (signal_type) {
      case signalType.RadiatedNoise:
        setTableData(RadiatedNoise_list);
        break;
      case signalType.TargetEcho:
        setTableData(TargetEcho_list);
        break;
      case signalType.ActivePulse:
        setTableData(ActivePulse_list);
        break;
    }
  };
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
      console.log(selectedRowKeys);
      setSelectedIDList(selectedRowKeys);
    },
  };
  const onClick = () => {
    setLoading(true);
    UploadExportList(selectedIDList, signal_type).then((res) => {
      console.log(res);
      setLoading(false);
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.radio}>
        <Radio.Group onChange={onRadioChange} value={signal_type}>
          <Radio value={signalType.RadiatedNoise}>辐射噪声</Radio>
          <Radio value={signalType.TargetEcho}>目标回声</Radio>
          <Radio value={signalType.ActivePulse}>主动脉冲</Radio>
        </Radio.Group>
      </div>
      <div className={styles.table}>
        <Table
          columns={columns}
          dataSource={tableData}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
        ></Table>
        <Button className={styles.button} onClick={onClick} loading={loading}>
          批量导出
        </Button>
      </div>
    </div>
  );
};
