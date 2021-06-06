/*
 * author: TimothyZhung
 * date: 2020-11-03
 */

import { Card, Row, Col, Divider } from 'antd';
import React, { Suspense, useEffect } from 'react';
import styles from './style.less';
import { Pie3D } from 'react-pie3d';
export interface VisitDataType {
  x: string;
  y: number;
}
const CONFIG = {
  angle: 40,
  height: 25,
  ir: 0.6,
  moveDistance: 0.2,
  onClick: function (e: any) {
    return null;
  },
  showTooltips: !0,
  size: 1.2,
  stroke: 'white',
  strokeWidth: 1,
  tooltipShowName: !0,
  tooltipShowPercentage: !0,
  tooltipShowValue: !0,
};

const ProportionAudio = ({
  audioPieData,
}: {
  audioPieData: VisitDataType[];
}) => {
  let Data = [
    {
      value: audioPieData[0].y,
      label: 'active_pulse',
      //color: '#faebd7',
      color: 'rgb(8,190,156)',
    },
    {
      value: audioPieData[1].y,
      label: 'target_echo',
      //color: '#ff7f50',
      color: 'rgb(8,151,156)',
    },
    {
      value: audioPieData[2].y,
      label: 'radiated_noise',
      //color: '#cd5c5c',
      color: 'rgb(0,109,100)',
    },
  ];
  return (
    <Card
      loading={false}
      className={styles.audioCard}
      bordered={false}
      title="声音类型占比"
      style={{
        height: '100%',
      }}
    >
      <div className={styles.content}>
        <div className={styles.pie3d}>
          <Pie3D config={CONFIG} data={Data} />
        </div>
        <div className={styles.text}>
          <ul className={styles.legend}>
            {audioPieData.map((item, i) => (
              <li key={item.x}>
                <span
                  className={styles.dot}
                  style={{
                    backgroundColor:
                      item.x === 'active_pulse'
                        ? 'rgb(8,190,156)'
                        : item.x === 'target_echo'
                        ? 'rgb(8,151,156)'
                        : 'rgb(0,109,100)',
                  }}
                />
                <span className={styles.legendTitle}>
                  {item.x === 'active_pulse'
                    ? '主动脉冲'
                    : item.x === 'target_echo'
                    ? '目标回声'
                    : '辐射噪声'}
                </span>
                <Divider type="vertical" />
                <span className={styles.percent}>
                  {`${(Number.isNaN(item.y)
                    ? 0
                    : (item.y /
                        audioPieData.reduce(
                          (total, item) => total + item.y,
                          0,
                        )) *
                      100
                  ).toFixed(2)}%`}
                </span>

                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.y}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ProportionAudio;
