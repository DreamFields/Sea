import React, { useState } from 'react';
import { Row, Col, Input, Button, Select, Modal, Form, Radio } from 'antd';
import CookieUtil from '@/utils/cookie.js';

const { Option } = Select;

// 辐射噪声特有信息表单
const RadiationTarget = (props: any) => {
  const { dispatch, country, rnType, type } = props;
  const [value_1, setValue_1] = useState(-1);
  const [value_2, setValue_2] = useState(-1);
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const onChange_1 = (e) => {
    console.log('RadiationTarget checked', e.target);
    setValue_1(e.target.value);
  };
  const onChange_2 = (e) => {
    console.log('RadiationTarget checked', e.target);
    setValue_2(e.target.value);
    if (e.target.value === '添加新类别') {
      setVisible(true);
    }
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="is_over_water"
            label="水面/水下"
            labelAlign="left"
            labelCol={{ span: 2 }}
          >
            <Radio.Group onChange={onChange_1} value={value_1}>
              <Radio value={1}>水面</Radio>
              <Radio value={0}>水下</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="rn_type"
            label="目标类型"
            labelAlign="left"
            labelCol={{ span: 2 }}
          >
            <Radio.Group onChange={onChange_2} value={value_2}>
              {rnType?.map((item: { rn_type: string }) => {
                return <Radio value={item.rn_type}>{item.rn_type}</Radio>;
              })}
            </Radio.Group>
            <Button
              value={'添加新类别'}
              onClick={() => {
                setVisible(true);
              }}
              style={{
                display:
                  CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
              }}
            >
              添加新类别
            </Button>
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
              {country?.map((item: { country: string }) => {
                return <Option value={item.country}>{item.country}</Option>;
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label="目标舰号或名称"
            rules={[
              {
                required: type === 1 ? true : false,
                message: '请输入目标舰号或名称',
              },
            ]}
          >
            <Input placeholder="名称" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="principal_machine"
            label="主机"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="auxiliary_machine"
            label="辅机"
            labelAlign="left"
            labelCol={{ span: 4 }}
          >
            <Input />
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
              type: 'inforImport/addRnType',
              payload: { name: values.addRnFleet },
            }).then(() => {});
          }}
          form={form}
        >
          <Form.Item name="addRnFleet" label="类别名" style={{ marginTop: 20 }}>
            <Input style={{ width: '80%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RadiationTarget;
