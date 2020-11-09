/*
 * author: TimothyZhung
 * date: 2020-11-03
 */

import { Card } from 'antd';
import React from 'react';
import Pie from './Pie';
import styles from './style.less';
export interface VisitDataType {
  x: string;
  y: number;
}

const ProportionAudio = ({
  audioPieData,
}: {
  audioPieData: VisitDataType[];
}) => (
  <Card
    loading={false}
    className={styles.audioCard}
    bordered={false}
    title="声音类型占比"
    style={{
      height: '100%',
    }}
  >
    <div>
      <Pie
        hasLegend
        subTitle="总数"
        total={() => audioPieData.reduce((pre, now) => now.y + pre, 0)}
        data={audioPieData}
        valueFormat={value => value}
        height={180}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default ProportionAudio;
