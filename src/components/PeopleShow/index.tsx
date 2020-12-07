/*
 * author: TimothyZhung
 * date: 2020-11-10
 */

import { Card, Divider } from 'antd';
import React from 'react';
import styles from './index.less';
import { UserOutlined } from '@ant-design/icons';
export interface peopleDataType {
  x: string;
  y: number;
}

const PeopleShow = ({ peopleData }: { peopleData: peopleDataType[] }) => (
  <Card
    loading={false}
    className={styles.peopleCard}
    bordered={false}
    title="实时在线人数"
    style={{
      height: '100%',
    }}
  >
    <div className={styles.peopleShow}>
      <ul className={styles.people}>
        {peopleData.map((item, i) => (
          <li key={item.x}>
            <div
              style={{
                float: 'left',
                fontSize: 15,
              }}
            >
              <UserOutlined />
            </div>
            <div
              className={styles.dot}
              style={{
                backgroundColor: 'green',
              }}
            />
            <div className={styles.peopleType}>
              {item.x} : {item.y}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </Card>
);

export default PeopleShow;
