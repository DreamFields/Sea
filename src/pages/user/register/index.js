import React,{ useEffect } from 'react';
import { Input, Space, Form, Button, Checkbox  } from 'antd';
import { Link } from 'umi';
import { UserOutlined  } from '@ant-design/icons';
import style from './style.less';
import logo from '../../../assets/sea-white-logo.png'

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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="用户名"
              name="username"
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
              name="邮箱"
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
              style={{color: 'balck'}}
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
              name="confirm_password"
              style={{color: 'balck'}}
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
              <Link to="/user/login"><a className={style.back}>已有账号，点此登录...</a></Link>
            </Form.Item>
      
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" >
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


    })

    return(
        <div className={style.loginDiv}>
            <img src={logo} style={{height: 45,width:45,marginLeft:155}} />
            <h2 style={{marginLeft: 215,marginTop: -40,marginBottom: 30,color: "white"}}>水声数据库系统</h2>
            <Login />
        </div>
    )
}

export default index;