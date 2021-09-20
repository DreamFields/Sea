import React, { useState } from 'react';
import { Card, Button, message, Spin } from 'antd';
import request from '@/utils/request';

const Index = (props) => {
  const { title, mode, sid } = props;
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(undefined);

  const fetchLevel = async () => {
    if(!sid){
      message.error("请先加载文件！")
      return;
    }
    setLoading(true);
    const detectRes = await request(`/v1/evaluation/${mode}`, {
      method: 'POST',
      data: {
        sid: sid,
      },
    });
    console.log("detectRes", detectRes);
    setLoading(false);
    setResult(detectRes);
  };

  return (
    <Spin spinning={loading}>
      <Card title={title}>
        <div style={{ height: 200, width: 380, overflowY: "auto" }}>
          <div
            style={{
              width: '100%',
              height: 150,
              background: '#3D3D3D',
              marginBottom: '32px'
            }}
          >
            <img src={imgSrc} style={{width: 380}} />
          </div>
          <span>
            <Button type="primary" onClick={fetchLevel}>检测</Button>
            <span style={{ marginLeft: 16 }}>检测结果：{result}</span>
          </span>
        </div>
      </Card>
    </Spin>
  );
};

export default Index;
