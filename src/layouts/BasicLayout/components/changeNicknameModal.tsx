import React, { useState, useEffect } from 'react';
import { Modal, Form, message, Input } from 'antd';
import request from '@/utils/request';

// 更改用户名modal框
const ChangeNicknameModal = () => {
  const [visible, setvisible] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleSubmit = (values: any) => {
    // console.log(values);
    request('/v1/user/nickname', {
      method: 'PUT',
      data: values,
    }).then((res) => {
      if (res) {
        message.success('修改成功！');
      } else {
        message.error('修改失败！');
      }
      setvisible(false);
    });
  };

  return (
    <>
      <a
        onClick={() => {
          setvisible(true);
        }}
      >
        修改昵称
      </a>

      <Modal
        title="修改昵称"
        visible={visible}
        onCancel={() => {
          setvisible(false);
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="新昵称"
            name="nickname"
            labelAlign="right"
            labelCol={{ span: 4 }}
          >
            <Input autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangeNicknameModal;
