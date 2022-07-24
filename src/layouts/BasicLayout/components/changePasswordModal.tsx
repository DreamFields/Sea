import React, { useState, useEffect } from 'react';
import { Modal, Form, message, Input } from 'antd';
import request from '@/utils/request';

// 更改密码modal框
const ChangePasswordModal = () => {
  const [visible, setvisible] = useState(false);
  const [pwform] = Form.useForm();
  useEffect(() => {
    if (visible) {
      pwform.resetFields();
    }
  }, [visible]);

  const handleSubmit = (values: any) => {
    // console.log(values);
    request('/v1/user/password', {
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
        修改密码
      </a>

      <Modal
        title="修改密码"
        visible={visible}
        onCancel={() => {
          setvisible(false);
        }}
        onOk={() => {
          pwform.submit();
        }}
      >
        <Form form={pwform} onFinish={handleSubmit}>
          <Form.Item
            label="旧密码"
            name="oldpassword"
            labelAlign="right"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: '请输入旧密码!',
              },
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                message: '密码必须包含数字和英文，长度6-20!',
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newpassword"
            labelAlign="right"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                message: '新密码必须包含数字和英文，长度6-20!',
              },
            ]}
            hasFeedback
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="renewpassword"
            labelAlign="right"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('newpassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入的密码不一致！');
                },
              }),
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
