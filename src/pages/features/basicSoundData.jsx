/*
 * @Author: Meng Tian
 * @Date: 2021-10-18 15:01:45
 * @Description: 特征提取界面右侧下方的特征提取模块，在不同的特征选择下展示不同的水声信息
 */
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Statistic } from 'antd';
import PowerTable from '../power/table';
import LofarTable from '../lofarV1/table';

const Index = (props) => {
  const { f_key, data, dispatch } = props;

  console.log('data.hz', data.hz);

  return (
    <>
      <div style={{ color: 'white', fontSize: 20 }}>
        {f_key === '5' ? '过零率统计特征' : '特征提取'}
      </div>
      <div
        style={{
          backgroundColor: 'black',
          width: '100%',
          height: 300,
          float: 'left',
          overflow: 'auto',
          // overflowX: 'hidden',
          border: '1px solid grey',
          padding: '16px 16px 16px 16px',
        }}
      >
        {/* 直接看antd的statistic源码，做一个频率和分贝的数据展示 */}
        <div
          style={{
            display: f_key === '1' || f_key === '3' ? 'block' : 'none',
          }}
        >
          <Statistic title="分贝" value={data?.db} />

          <Statistic title="频率" value={data?.hz} />
          <div
            style={{
              display: f_key === '3' ? 'block' : 'none',
            }}
          >
            {/* <Statistic title="轴数" value={data?.db} /> */}
            <Statistic title="叶数" value={data?.label} />
            <Statistic title="转速" value={data?.rpm} />
          </div>
          {f_key === '1' ? <PowerTable /> : null}
        </div>

        {f_key === '2' ? <LofarTable /> : null}

        <div
          style={{
            display: f_key === '4' || f_key === '5' ? 'block' : 'none',
          }}
        >
          <Statistic title="信息熵" value={data?.calc} />

          <Statistic title="均值" value={data?.mean} />

          <Statistic title="方差" value={data?.va} />
        </div>

        <div
          className="Mel_Spectrogram"
          style={{ display: f_key === '6' ? 'block' : 'none' }}
        >
          <Statistic title="谱质心" value={data?.sc} />

          <Statistic title="谱质心带宽" value={data?.scw} />

          <Statistic title="谱包络面积" value={data?.sa} />

          <Statistic title="谱斜率" value={data?.ss} />

          <Statistic title="谱下降图" value={data?.sd} />

          <Statistic title="谱不规律性" value={data?.si} />

          <Statistic title="谱不平整性" value={data?.su} />

          <Statistic title="谱熵" value={data?.se} />
        </div>
      </div>
    </>
  );
};

const mapStatesToProps = ({ basicSoundData }) => {
  return {
    data: basicSoundData,
  };
};

export default connect(mapStatesToProps)(Index);
