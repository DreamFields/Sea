import React, { useState } from 'react';
import { Card, Button, message } from 'antd';
import request from '@/utils/request';

const Index = (props) => {
  const { title, mode, sid } = props;
  const [result, setResult] = useState("");

  const fetchLevel = async () => {
    if(!sid){
      message.error("请先加载文件！")
      return;
    }
    const detectRes = await request(`/v1/evaluation/${mode}`, {
      method: 'POST',
      data: {
        sid: sid,
      },
    });
    console.log("detectRes", detectRes);
    setResult(detectRes);
  };

  return (
    <Card title={title}>
      <div style={{ minHeight: 200, width: 380 }}>
        <div
          style={{
            width: '100%',
            height: 150,
            background: '#3D3D3D',
            marginBottom: '32px'
          }}
        ></div>
        <span>
          <Button type="primary" onClick={fetchLevel}>检测</Button>
          <span style={{ marginLeft: 16 }}>检测结果：{result}</span>
        </span>
      </div>
    </Card>
  );
};

export default Index;
