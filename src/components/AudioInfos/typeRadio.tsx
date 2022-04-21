import React from 'react';
import { Form, Radio } from 'antd';

// 音频类型单选框
const TypeRadio = (props: any) => {
  const { settype, type } = props;

  const onChange = (e: any) => {
    settype(e.target.value);
    console.log('radio checked', e.target);
  };

  return (
    <>
      <Form.Item
        name="signal_type"
        label="信号类型"
        labelAlign="left"
        labelCol={{ span: 2 }}
      >
        <Radio.Group onChange={onChange} value={type}>
          <Radio value={1}>辐射噪声</Radio>
          <Radio value={2}>目标回声</Radio>
          <Radio value={3}>主动脉冲</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export default TypeRadio;
