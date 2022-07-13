import React from 'react';
import {
  DatePicker,
  TimePicker,
  Row,
  Col,
  Input,
  InputNumber,
  Form,
} from 'antd';

// 通用基础信息表单
const SignalInfo = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="speed"
            label="航速"
            labelAlign="left"
            labelCol={{ span: 4 }}
            placeholder="单位：节"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="distance"
            label="距离"
            labelAlign="left"
            labelCol={{ span: 4 }}
            placeholder="单位：km"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="collect_d"
            label="采集日期"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="collect_t"
            label="采集时间"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="collect_platform"
            label="采集平台"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="location"
            label="采集位置"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="task_source"
            label="采集任务源"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="depth"
            label="深度"
            labelAlign="left"
            labelCol={{ span: 4 }}
            placeholder="单位：m"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default SignalInfo;
