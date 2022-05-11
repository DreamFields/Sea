import React, { useState } from 'react';
import { Row, Col, Input, Button, Select, Modal, Form, Radio } from 'antd';
import CookieUtil from '@/utils/cookie.js';

const { Option } = Select;

// 主动脉冲特有信息表单
const PulseTarget = (props: any) => {
  const { dispatch, country, apType, asType, type } = props;
  const [value_1, setValue_1] = useState(1);
  const [value_2, setValue_2] = useState(1);
  const [visible_1, setVisible_1] = useState(false);
  const [visible_2, setVisible_2] = useState(false);

  const [form_1] = Form.useForm();
  const [form_2] = Form.useForm();

  const onChange_1 = (e) => {
    console.log('PulseTarget checked', e.target);
    setValue_1(e.target.value);
  };
  const onChange_2 = (e) => {
    console.log('PulseTarget checked', e.target);
    setValue_2(e.target.value);
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="ap_type"
            label="目标类型"
            labelAlign="left"
            labelCol={{ span: 2 }}
          >
            <Radio.Group onChange={onChange_2} value={value_2}>
              {apType?.map((item) => {
                return <Radio value={item.ap_type}>{item.ap_type}</Radio>;
              })}
              <Button
                value={'添加新类别'}
                onClick={() => {
                  setVisible_2(true);
                }}
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
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="as_type" label="主动声纳类型">
            <Radio.Group onChange={onChange_1} value={value_1}>
              {asType?.map((item) => {
                return <Radio value={item.as_type}>{item.as_type}</Radio>;
              })}
              <Button
                value={'添加新类别'}
                onClick={() => {
                  setVisible_1(true);
                }}
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="country"
            label="国别"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <Select style={{ width: 120 }}>
              {country?.map((item) => {
                return <Option value={item.country}>{item.country}</Option>;
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fleet_name"
            label="目标舰号或名称"
            rules={[
              {
                required: type === 3 ? true : false,
                message: '请输入目标舰号或名称',
              },
            ]}
          >
            <Input placeholder="名称" />
          </Form.Item>
        </Col>
      </Row>

      <Modal
        visible={visible_2}
        onCancel={() => {
          setVisible_2(false);
        }}
        onOk={() => {
          form_2.submit();
          setVisible_2(false);
        }}
        okText="保存"
        cancelText="取消"
        title="添加新类别"
      >
        <Form
          onFinish={(values: any) => {
            console.log(values);
            dispatch({
              type: 'inforImport/addApType',
              payload: { name: values.addPluseFleet },
            }).then(() => {});
          }}
          form={form_2}
        >
          <Form.Item
            name="addPluseFleet"
            label="类别名"
            style={{ marginTop: 20 }}
          >
            <Input style={{ width: '80%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={visible_1}
        onCancel={() => {
          setVisible_1(false);
        }}
        onOk={() => {
          form_1.submit();
          setVisible_1(false);
        }}
        okText="保存"
        cancelText="取消"
        title="添加新类别"
      >
        <Form
          onFinish={(values: any) => {
            console.log(values);
            dispatch({
              type: 'inforImport/addAsType',
              payload: { name: values.addAsType },
            }).then(() => {});
          }}
          form={form_1}
        >
          <Form.Item
            name="addAsType"
            label="声呐类型名"
            style={{ marginTop: 20 }}
          >
            <Input style={{ width: '80%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PulseTarget;
