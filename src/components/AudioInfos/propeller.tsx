import React, { useState } from 'react';
import { Row, Col, Button, InputNumber, Modal, Form, Radio } from 'antd';
import CookieUtil from '@/utils/cookie.js';

// 螺旋桨
const Propeller = (props: any) => {
  const { sumForm, propeller, dispatch } = props;
  const [value_2, setValue_2] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const onChange_2 = (e) => {
    console.log('Propeller checked', e.target);
    setValue_2(e.target.value);
    sumForm.setFieldsValue({
      shaft_count: Number(e.target.value.split('_')[0]),
    });
    sumForm.setFieldsValue({
      blade_count: Number(e.target.value.split('_')[1]),
    });
    sumForm.setFieldsValue({
      rotationl_speed: Number(e.target.value.split('_')[2]),
    });
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={10} style={{ display: 'none' }}>
          <Form.Item name="shaft_count" label="轴数"></Form.Item>
          <Form.Item name="blade_count" label="叶数"></Form.Item>
          <Form.Item name="rotationl_speed" label="转速"></Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="shaft_blade_rotationl"
            label="螺旋桨"
            labelAlign="left"
            labelCol={{ span: 2 }}
          >
            <Radio.Group onChange={onChange_2} value={value_2}>
              {propeller?.map((item: any) => {
                return (
                  <Radio
                    value={`${item.shaft_count}_${item.blade_count}_${item.rotationl_speed}`}
                  >
                    {item.shaft_count}轴{item.blade_count}叶
                    {item.rotationl_speed}转速
                  </Radio>
                );
              })}
              <Button
                value={'添加新类别'}
                onClick={() => setVisible(true)}
                style={{
                  display:
                    CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
                }}
              >
                添加新类别
              </Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          form.submit();
          setVisible(false);
        }}
        okText="保存"
        cancelText="取消"
        title="添加新类别"
      >
        <Form
          onFinish={(values: any) => {
            console.log(values);
            dispatch({
              type: 'inforImport/addPropeller',
              payload: values,
            }).then(() => {});
          }}
          form={form}
        >
          <Form.Item name="shaft_count" label="轴数" style={{ marginTop: 20 }}>
            <InputNumber style={{ width: '80%' }} />
          </Form.Item>
          <Form.Item name="blade_count" label="叶数" style={{ marginTop: 20 }}>
            <InputNumber style={{ width: '80%' }} />
          </Form.Item>
          <Form.Item
            name="rotationl_speed"
            label="转速"
            style={{ marginTop: 20 }}
          >
            <InputNumber style={{ width: '80%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Propeller;
