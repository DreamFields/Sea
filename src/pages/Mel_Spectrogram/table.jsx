import React, { useEffect } from 'react';
import { connect } from 'umi';
import request from '@/utils/request';
import {
  Button,
  notification,
  Radio,
  Input,
  Space,
  Table,
  message,
  Card,
  Spin,
  Popover,
  Checkbox,
  Row,
  Col,
} from 'antd';

const MelTable = (props) => {
  const { table_data, dispatch, signal_type, table_data1, table_data2 } = props;
  const onChange = (checkedValues) => {
    let copy_data;
    dispatch({
      type: 'MelTable/setdata',
      payload: {},
      callback: (state) => {
        if (signal_type === 3) {
          copy_data = state.tabledata2.slice();
          copy_data[0].signal_type = checkedValues;
          return { tabledata2: copy_data };
        }
      },
    });
  };
  const uploadTip = (
    <div>
      点击提交按钮即可提交表格中的信息
      <br />
      <b style={{ color: 'cyan' }}>额外提示</b>
      <br />
      中心频率需要手动输入
      <br />
      信号形式需要手动选择
      <br />
      其他信息在图中框选即可自动计算
    </div>
  );
  const InputTip = (
    <div>
      中心频率需要手动输入
      <br />
      <b style={{ color: 'cyan' }}>额外提示</b>
      <br />
      点击提交即可将输入框中内容提交
      <br />
      中心频率要求输入纯数字,例如:1000
      <br />
      如果输入其他字符就会提交失败,错误示例:1000Hz
    </div>
  );
  const InputTip2 = (
    <div>
      分辨率需要手动输入
      <br />
      <b style={{ color: 'cyan' }}>额外提示</b>
      <br />
      输入之后重新点击语谱图分析即可加载新的图表
      <br />
      分辨率要求输入纯数字,例如:25
      <br />
      分辨率的范围为0～50，默认值为25
    </div>
  );
  const dispatchEcho = () => {
    request(`/v1/ffile/frequency/${id}`, {
      method: 'PUT',
      data: {
        echo_length: table_data1.echo_length,
        echo_width: table_data1.echo_width,
        signal_type: table_data2.signal_type,
        center_frequency: table_data1.center_frequency
          ? table_data1.center_frequency
          : table_data2.center_frequency,
        pulse_cycle: table_data2.pulse_cycle,
        pusle_width: table_data2.pulse_width,
      },
    }).then((res) => {
      if (res === true) {
        message.success('提交成功！');
      } else if (res === null) {
        message.error('提交失败，请检查图片是否加载成功！');
      } else {
        console.log(res.code);
      }
    });
  };
  //回波的样式
  const columns1 = [
    {
      title: '中心频率',
      dataIndex: 'frequency',
      key: 'frequency',
      /*render: (text) => (
        <Popover title="提示" content={InputTip}>
          <Input
            placeholder="frequency"
            onChange={(e) => {
              setcenter_frequency(e.target.value);
            }}
          />
        </Popover>
      ),*/
    },
    {
      title: '回波宽带',
      dataIndex: 'echo_width',
      key: 'echo_width',
    },
    {
      title: '回波长波',
      dataIndex: 'echo_length',
      key: 'echo_length',
    },
    {
      render: () => (
        <Popover title="提示" content={uploadTip}>
          <Button onClick={dispatchEcho}>提交</Button>
        </Popover>
      ),
    },
  ];
  //主动脉冲展示
  const columns2 = [
    {
      title: '中心频率',
      dataIndex: 'frequency',
      key: 'frequency',
      /*
      * render: (text) => (
        <Popover title="提示" content={InputTip}>
          <Input
            placeholder="frequency"
            onChange={(e) => {
              setcenter_frequency(e.target.value);
            }}
          />
        </Popover>
      ),*/
    },
    {
      title: '信号形式',
      dataIndex: 'signal_type',
      key: 'signal_type',
      render: (text) => (
        <Checkbox.Group
          style={
            {
              //width: '100%'
            }
          }
          onChange={onChange}
        >
          <Row>
            <Col span={24}>
              <Checkbox value="CW">CW</Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="LFM">LFM</Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="HFM">HFM</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
        /*
        <Radio.Group onChange={onChange} value={signal_type2}>
          <Space direction="vertical">
            <Radio value={'CW'}>CW</Radio>
            <Radio value={'LFM'}>LFM</Radio>
            <Radio value={'HFM'}>HFM</Radio>
            <Radio value={'CW+LFM'}>CW+LFM</Radio>
            <Radio value={'CW+HFM'}>CW+HFM</Radio>
            <Radio value={6}>
              More...
              {signal_type2 === 6 ? (
                <Input style={{ width: 100, marginLeft: 10 }} />
              ) : null}
            </Radio>
          </Space>
        </Radio.Group>*/
      ),
    },
    {
      title: '脉冲宽度',
      dataIndex: 'pulse_width',
      key: 'pulse_width',
    },
    {
      title: '脉冲周期',
      dataIndex: 'pulse_cycle',
      key: 'pulse_cycle',
    },
    {
      render: () => (
        <Popover title="提示" content={uploadTip}>
          <Button onClick={dispatchEcho}>提交</Button>
        </Popover>
      ),
    },
  ];

  return (
    <Table
      columns={signal_type === 2 ? columns1 : columns2}
      dataSource={signal_type === 2 ? table_data1 : table_data2}
      style={{ marginTop: '1rem' }}
      pagination={{ pageSize: 5 }}
    />
  );
};

const mapStateToProps = ({ MelTable }) => {
  return {
    table_data1: MelTable.tabledata1,
    table_data2: MelTable.tabledata2,
  };
};

export default connect(mapStateToProps)(MelTable);
