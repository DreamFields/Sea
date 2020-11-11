/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime : 2020-11-07 11:07:38
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\user\register\index.tsx
 */
import React, { useEffect } from 'react';
import { Input, Space, Form, Button, Checkbox } from 'antd';
import { Link, connect, history } from 'umi';
import { UserOutlined } from '@ant-design/icons';
import style from './style.less';
import logo from '../../../assets/sea-white-logo.png';

const Index = (props: any) => {
  const { dispatch } = props;

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 6,
      span: 20,
    },
  };

  const _tailLayout = {
    wrapperCol: {
      offset: 10,
      span: 4,
    },
  };

  const Login = () => {
    const onFinish = (values) => {
      dispatch({
        type: 'register/register',
        payload: { ...values, type: 100 },
      }).then(() => {
        history.push('/user/login');
      });
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <Form
        {...layout}
        name="basic"
        size="large"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="nickname"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input size="large" className={style.user} autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
          ]}
        >
          <Input size="large" className={style.user} autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          style={{ color: 'balck' }}
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input.Password size="large" className={style.password} />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="password2"
          style={{ color: 'balck' }}
          rules={[
            {
              required: true,
              message: '请确认密码!',
            },
          ]}
        >
          <Input.Password size="large" className={style.password} />
        </Form.Item>

        <Form.Item {...tailLayout} name="back">
          <Link to="/user/login">
            <span className={style.back}>已有账号，点此登录...</span>
          </Link>
        </Form.Item>

        <Form.Item {..._tailLayout}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    );
  };

  useEffect(() => {
    // let labels = document.getElementsByClassName("ant-form-item-required")
    // console.log(labels);
    // for(let i=0;i<labels.length;i++){
    //   labels[i].style.color = "black";
    // }
    // let password_input = document.getElementById('basic_password');
    // password_input.style.color = "black";
  });

  return (
    <div className={style.loginDiv}>
      <img src={logo} style={{ height: 45, width: 45, marginLeft: '25%' }} />
      <h2
        style={{
          marginLeft: '38%',
          marginTop: -40,
          marginBottom: 30,
          color: 'white',
        }}
      >
        水声数据库系统
      </h2>
      <Login />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    loading: state.loading,
  };
}

export default connect(mapStateToProps)(Index);
