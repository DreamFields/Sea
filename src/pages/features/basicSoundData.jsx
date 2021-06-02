import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Statistic } from 'antd';

const Index = (props) => {
  const { f_key, data, dispatch } = props;

  return (
    <>
      <div style={{ color: 'white', fontSize: 20 }}>
        {f_key === '5' ? '过零率统计特征' : '基本听音特征'}
      </div>
      <div
        style={{
          backgroundColor: 'black',
          width: '100%',
          height: 300,
          float: 'left',
          overflowY: 'auto',
          overflowX: 'hidden',
          border: '1px solid grey',
          padding: '20px 20px',
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
        </div>

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
