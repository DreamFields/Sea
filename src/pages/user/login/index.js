import React, { useEffect } from 'react';
import { Input, Space, Form, Button, Checkbox  } from 'antd';
import { Link, history  } from 'umi';
import request from 'umi-request';
import { UserOutlined  } from '@ant-design/icons';
import style from './style.less';
import logo from '../../../assets/sea-white-logo.png';
import axios from 'axios';


const index = ()=>{
  const postInfor = ()=>{
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    const data = {
      account: user,
      password: password
    };
    const _data = JSON.stringify(data);
    console.log(user)
    console.log(password);
    axios({
      url: "http://223.4.179.3:80/v1/token",
      method: "POST",
      data: data,
    }).then(res=> {
      console.log(res);
      history.push('/')
    })
  }


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
              <Input size="large" placeholder="Loskyer" className={style.user} autoComplete="off" id="user" />
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
              <Input.Password size="large" placeholder="Xsc123456@" className={style.password}  id="password" />
            </Form.Item>
      
            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox >记住我</Checkbox>
              <Link to="/user/register"><a style={{marginLeft: 110}} className={style.linkto}>注册账户</a></Link>
              <a style={{marginLeft: 20}} href="#" className={style.linkto}>忘记密码</a>
            </Form.Item>
              

            <Form.Item {...tailLayout}>
              <Button type="primary"  id="loginBtn" onClick={postInfor}>
                {/* <Link to="/">登录</Link> */}
                登录
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

      // let Checkbox_span = document.getElementsByClassName('ant-checkbox-wrapper')[0];
      // Checkbox_span.style.color = "black";
    })

    return(
        <div className={style.loginDiv}>
            <img src={logo} style={{height: 45,width:45,marginLeft:155}} />
            <h2 style={{marginLeft: 215,marginTop: -40,marginBottom: 30,color:'white'}}>水声数据库系统</h2>
            <Login />
        </div>
    )
}

export default index;