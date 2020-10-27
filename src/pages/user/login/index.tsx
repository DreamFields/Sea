import React, { useEffect } from 'react';
import { Input, Space, Form, Button, Checkbox } from 'antd';
import { Link, history, connect } from 'umi';
import request from 'umi-request';
import { UserOutlined } from '@ant-design/icons';
import style from './style.less';
import logo from '../../../assets/sea-white-logo.png';
// import Cookies from 'js-cookie';

const Index = (props:any) => {
  const { dispatch } = props;
  // console.log(Cookies.get('token'));

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const Login = () => {
    const onFinish = (values) => {
      dispatch({
        type: 'login/login',
        payload: values
      }).then((res:any)=>{
        // console.log(res);
        if(res){
          history.push('/');
        }
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
              message: 'Please input your username!',
            },
          ]}
        >
          <Input size="large" placeholder="Loskyer" className={style.user}  id="user" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          style={{ color: 'balck' }}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password size="large" placeholder="Xsc123456@" className={style.password} id="password" />
        </Form.Item>

        <Form.Item {...tailLayout}  valuePropName="checked">
          <Checkbox >记住我</Checkbox>
          <Link to="/user/register"><span style={{ marginLeft: 110 }} className={style.linkto}>注册账户</span></Link>
          <a style={{ marginLeft: 20 }} href="#" className={style.linkto}>忘记密码</a>
        </Form.Item>


        <Form.Item {...tailLayout}>
          <Button type="primary" id="loginBtn" htmlType="submit">
            {/* <Link to="/">登录</Link> */}
                登录
              </Button>
        </Form.Item>
      </Form>
    );
  };


  useEffect(() => {
    
  })

  return (
    <div className={style.loginDiv}>
      <img src={logo} style={{ height: 45, width: 45, marginLeft: 155 }} />
      <h2 style={{ marginLeft: 215, marginTop: -40, marginBottom: 30, color: 'white' }}>水声数据库系统</h2>
      <Login />
    </div>
  )
};

function mapStateToProps(state:any) {
  return {
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Index);