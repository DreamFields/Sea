import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Menu, Popover, Statistic } from 'antd';
import BasicSoundData from './basicSoundData';

const { SubMenu } = Menu;
const rightWidth = '23%';
let feature_key;

const FeatureRightMenu = (props) => {
  const { f_key, dispatch } = props;
  class RightSidermenu extends React.Component {
    handleClick = (e) => {
      feature_key = e.key;
      dispatch({
        type: 'features/setMenuKey',
        payload: { menu_key: e.key },
      }).then(() => {});
    };
    render() {
      return (
        <Menu
          onClick={this.handleClick}
          style={{ width: '100%', backgroundColor: 'black' }}
          defaultSelectedKeys={[]}
          selectedKeys={[f_key]}
          defaultOpenKeys={['sub1', 'sub2', 'sub3']}
          mode="inline"
        >
          <Menu.Item key="1">功率谱</Menu.Item>
          <Menu.Item key="2">低频线谱</Menu.Item>
          <Menu.Item key="3">调制谱</Menu.Item>
          <Menu.Item key="4">梅尔倒谱</Menu.Item>
          <Menu.Item key="5">过零率</Menu.Item>
          <Menu.Item key="6">时频图</Menu.Item>
        </Menu>
      );
    }
  }

  return (
    <>
      <div
        style={{
          width: rightWidth,
          height: 390,
          float: 'left',
          marginTop: 15,
          marginLeft: '1rem',
        }}
      >
        <div style={{ color: 'white', fontSize: 20 }}>特征选择</div>
        <div
          style={{
            backgroundColor: 'black',
            width: '100%',
            height: 340,
            float: 'left',
            overflowY: 'auto',
            overflowX: 'hidden',
            border: '1px solid grey',
          }}
        >
          <RightSidermenu />
        </div>
      </div>
      <div
        style={{
          width: rightWidth,
          height: 360,
          float: 'left',
          marginTop: 10,
          marginLeft: '1rem',
        }}
      >
        <BasicSoundData f_key={f_key} />
      </div>
    </>
  );
};

const mapStateToProps = ({ features }: { features: any }) => {
  // console.log('inforImport', inforImport);
  return {
    f_key: features.menu_key,
  };
};

export default connect(mapStateToProps)(FeatureRightMenu);
