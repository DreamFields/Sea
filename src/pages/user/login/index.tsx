/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-26 15:36:10
 * @LastEditTime : 2020-11-17 10:33:56
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\user\login\index.tsx
 */
import React, { useEffect } from 'react';
import { Input, Space, Form, Button, Checkbox, message } from 'antd';
import { Link, history, connect } from 'umi';
import request from 'umi-request';
import { UserOutlined } from '@ant-design/icons';
import style from './style.less';
import logo from '../../../assets/sea-white-logo.png';
// import Cookies from 'js-cookie';

const Index = (props: any) => {
  const { dispatch } = props;
  // console.log(Cookies.get('token'));

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 20,
    },
  };

  const _tailLayout = {
    wrapperCol: {
      offset: 12,
      span: 4,
    },
  };

  const Login = () => {
    const onFinish = (values) => {
      dispatch({
        type: 'login/login',
        payload: values,
      }).then((res: any) => {
        // console.log(res);
        if (res) {
          history.push('/');
        } else {
          message.error('登录失败！');
        }
      });
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <Form
        {...layout}
        labelAlign="right"
        name="basic"
        size="large"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="account"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
            {
              pattern: /^[a-zA-Z0-9_-]{4,16}$/,
              message: '用户名包含4到16位（字母，数字，下划线，减号）!',
            },
          ]}
        >
          <Input
            size="large"
            placeholder="hlgdbzds"
            className={style.user}
            id="user"
          />
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
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}$/,
              message:
                '密码需要包含至少8个字符至多16个字符，至少1个大写字母，1个小写字母，1个数字和1个特殊字符!',
            },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Hrb123456@"
            className={style.password}
            id="password"
          />
        </Form.Item>

        <Form.Item {...tailLayout} valuePropName="checked">
          <Checkbox>记住我</Checkbox>
          <Link to="/user/register">
            <span style={{ marginLeft: '32%' }} className={style.linkto}>
              注册账户
            </span>
          </Link>
          <a style={{ marginLeft: '6%' }} className={style.linkto}>
            忘记密码
          </a>
        </Form.Item>

        <Form.Item {..._tailLayout}>
          <Button type="primary" id="loginBtn" htmlType="submit">
            {/* <Link to="/">登录</Link> */}
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  };

  useEffect(() => {});

  return (
    <div className={style.loginDiv}>
      <img src={logo} style={{ height: 45, width: 45, marginLeft: '20%' }} />
      <h2
        style={{
          marginLeft: '34%',
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
