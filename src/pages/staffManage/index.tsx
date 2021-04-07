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

  const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
  ];

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
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
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
                        // <SettingOutlined key="setting" />,
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

                        // <EllipsisOutlined key="ellipsis" />,
                      ]}
                    >
                      <Meta
                        avatar={
                          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        }
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
                        avatar={
                          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        }
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
