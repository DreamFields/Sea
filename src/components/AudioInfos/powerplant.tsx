import React, { useState } from 'react';
import { Input, Button, Modal, Form, Radio } from 'antd';
import CookieUtil from '@/utils/cookie.js';

// 动力装置栏
const Powerplant = (props: any) => {
  const { powerEngine, dispatch } = props;
  const [value, setValue] = useState(1);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const onChange = (e) => {
    console.log('Powerplant checked', e.target);
    setValue(e.target.value);
  };

  return (
    <>
      <Form.Item
        name="power_engine"
        label="动力装置"
        labelAlign="left"
        labelCol={{ span: 2 }}
      >
        <Radio.Group onChange={onChange} value={value}>
          {powerEngine?.map((item: { name: string }) => {
            return <Radio value={item.name}>{item.name}</Radio>;
          })}
          <Button
            value={'添加新类别'}
            onClick={() => {
              setVisible(true);
            }}
            style={{
              display: CookieUtil.get('role') === '3' ? 'none' : 'inline-block',
            }}
          >
            添加新类别
          </Button>
        </Radio.Group>
      </Form.Item>
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
              type: 'inforImport/addPowerEngine',
              payload: { name: values.addPower },
            }).then(() => {});
          }}
          form={form}
        >
          <Form.Item name="addPower" label="类别名" style={{ marginTop: 20 }}>
            <Input style={{ width: '80%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Powerplant;
