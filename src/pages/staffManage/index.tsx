import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  Col,
  Row,
  Tag,
  Tabs,
  List,
  Popconfirm,
  message,
  Modal,
  Tooltip,
  Form,
  Input,
} from 'antd';
import request from '@/utils/request';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Meta } = Card;

const { TabPane } = Tabs;

const Index = () => {
  const [info, setinfo] = useState({ nickname: undefined, email: undefined });
  const [instructors, setinstructors] = useState([]);
  const [students, setstudents] = useState([]);
  useEffect(() => {
    request('/v1/admin/my_info', {
      method: 'GET',
    }).then((res) => {
      setinfo(res);
    });
    request('/v1/admin/instructor_info', {
      method: 'GET',
    }).then((res) => {
      setinstructors(res);
    });
    request('/v1/admin/student_info', {
      method: 'GET',
    }).then((res) => {
      setstudents(res);
    });
  }, []);

  const ChangePasswordModal = (props) => {
    const [visible, setvisible] = useState(false);
    const [form] = Form.useForm();
    const { id } = props;
    useEffect(() => {
      if (visible) {
        form.resetFields();
      }
    }, [visible]);

    const handleSubmit = (values: any) => {
      // console.log({...values, id: id});
      request('/v1/admin/pwadmin', {
        method: 'PUT',
        data: { ...values, id: id },
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
        <Tooltip title="修改密码">
          <SettingOutlined
            key="setting"
            onClick={() => {
              setvisible(true);
            }}
          />
        </Tooltip>

        <Modal
          title="修改用户密码"
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
                  message: '密码必须包含数字和英文，长度6-20!',
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

  return (
    <>
      <Row style={{ marginTop: 20, marginRight: 24 }}>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
              backgroundColor: '#2D2D2D',
            }}
          >
            <Meta
              avatar={<Avatar>U</Avatar>}
              title={info?.nickname}
              description={`email: ${info?.email}`}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginRight: 24, backgroundColor: '#2D2D2D' }}>
        <Col span={1}></Col>
        <Col span={22}>
          <Tabs defaultActiveKey="1" style={{ backgroundColor: '#2D2D2D' }}>
            <TabPane tab="教员" key="1">
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={instructors}
                renderItem={(item: any) => (
                  <List.Item>
                    <Card
                      bordered={false}
                      style={{
                        marginBottom: 24,
                        backgroundColor: '#141414',
                      }}
                      actions={[
                        <ChangePasswordModal />,
                        <Popconfirm
                          title="确认修改该用户权限为学生吗?"
                          placement="bottom"
                          onConfirm={() => {
                            request('/v1/admin/scope', {
                              method: 'PUT',
                              data: { id: item.id, role: 3 },
                            }).then((res) => {
                              if (res) {
                                message.success('修改成功！');
                                request('/v1/admin/instructor_info', {
                                  method: 'GET',
                                }).then((res) => {
                                  setinstructors(res);
                                });
                                request('/v1/admin/student_info', {
                                  method: 'GET',
                                }).then((res) => {
                                  setstudents(res);
                                });
                              } else {
                                message.error('修改失败！');
                              }
                            });
                          }}
                        >
                          <EditOutlined key="edit" />
                        </Popconfirm>,
                      ]}
                    >
                      <Meta
                        avatar={<Avatar>T</Avatar>}
                        title={item.nickname}
                        description={`email: ${item.email}`}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="学生" key="2">
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={students}
                renderItem={(item: any) => (
                  <List.Item>
                    <Card
                      bordered={false}
                      style={{
                        marginBottom: 24,
                        backgroundColor: '#141414',
                      }}
                      actions={[
                        <ChangePasswordModal id={item.id} />,
                        <Popconfirm
                          title="确认修改该用户权限为教员吗?"
                          placement="bottom"
                          onConfirm={() => {
                            request('/v1/admin/scope', {
                              method: 'PUT',
                              data: { id: item.id, role: 2 },
                            }).then((res) => {
                              if (res) {
                                message.success('修改成功！');
                                request('/v1/admin/instructor_info', {
                                  method: 'GET',
                                }).then((res) => {
                                  setinstructors(res);
                                });
                                request('/v1/admin/student_info', {
                                  method: 'GET',
                                }).then((res) => {
                                  setstudents(res);
                                });
                              } else {
                                message.error('修改失败！');
                              }
                            });
                          }}
                        >
                          <EditOutlined key="edit" />
                        </Popconfirm>,
                      ]}
                    >
                      <Meta
                        avatar={<Avatar>S</Avatar>}
                        title={item.nickname}
                        description={`email: ${item.email}`}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Col>
        <Col span={1}></Col>
      </Row>
    </>
  );
};
export default Index;
