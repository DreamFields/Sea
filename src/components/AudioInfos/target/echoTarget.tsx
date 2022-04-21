import React, { useState } from 'react';
import { Row, Col, Input, Button, Select, Modal, Form, Radio } from 'antd';
import CookieUtil from '@/utils/cookie.js';

const { Option } = Select;

// 目标回声特有信息表单
const EchoTarget = (props: any) => {
  const { dispatch, country, teType, type } = props;
  const [value, setValue] = useState(-1);
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const onChange = (e: any) => {
    console.log('EchoTarget checked', e.target);
    setValue(e.target.value);
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="te_type"
            label="目标类型"
            labelAlign="left"
            labelCol={{ span: 2 }}
          >
            <Radio.Group onChange={onChange} value={value}>
              {teType?.map((item: any) => {
                return <Radio value={item.te_type}>{item.te_type}</Radio>;
              })}
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
            name="name"
            label="目标舰号或名称"
            rules={[
              {
                required: type === 2 ? true : false,
                message: '请输入目标舰号或名称',
              },
            ]}
          >
            <Input placeholder="名称" />
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
              type: 'inforImport/addTeType',
              payload: { name: values.addEchoFleet },
            }).then(() => {});
          }}
          form={form}
        >
          <Form.Item
            name="addEchoFleet"
            label="类别名"
            style={{ marginTop: 20 }}
          >
            <Input style={{ width: '80%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EchoTarget;
