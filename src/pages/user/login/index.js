import React from 'react';
import { Input, Space, Form, Button, Checkbox  } from 'antd';
import { Link } from 'umi';
import { UserOutlined  } from '@ant-design/icons';
import style from './style.less';
import logo from '../../../assets/sealogo.png'

const index = ()=>{
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
          console.log('Success:', values);
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
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input size="large" placeholder="Loskyer" className={style.user} autoComplete="off" />
            </Form.Item>
      
            <Form.Item
              label="密码"
              name="password"
              style={{color: 'balck'}}
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password size="large" placeholder="Xsc123456" className={style.password} />
            </Form.Item>
      
            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
              <Link to="/user/register"><a style={{marginLeft: 110}}>注册账户</a></Link>
              <a style={{marginLeft: 20}}>忘记密码</a>
            </Form.Item>
              
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                <Link to="/">登录</Link>
              </Button>
            </Form.Item>
          </Form>
        );
    };


    return(
        <div className={style.loginDiv}>
            <img src={logo} style={{height: 45,width:45,marginLeft:155}} />
            <h2 style={{marginLeft: 215,marginTop: -40,marginBottom: 30}}>水声数据库系统</h2>
            <Login />
        </div>
    )
}

export default index;