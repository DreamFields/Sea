import React, { useState } from 'react';
import { Card, Button, message, Statistic, Popover } from 'antd';
import request from '@/utils/request';

const Index = (props) => {
  const { title, sid, requestUrl } = props;
  const [result1, setResult1] = useState(undefined);
  const [result2, setResult2] = useState(undefined);

  const getTargetResult = () => {
    if(!sid){
      message.error("请先加载音频！");
      return;
    }
    request(requestUrl, {
      method: 'POST',
      data: {
        sound_id: sid
      },
    }).then((res) => {
      if (!res) {
        message.error('分类失败！');
        setResult1('');
        setResult2('');
        return;
      }
      if (res.result1) {
        setResult1(
          res.result1 === 'FishingBoat'
            ? '渔船'
            : res.result1 === 'MerchantMarine'
            ? '商船'
            : res.result1,
        );
      }
      if (res.result2) {
        setResult2(res.result2);
      }
    });
  }

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
        <div>
        <Popover
          content="先在左侧选择音频，再点击分类"
          title="分类"
        >
          <Button type="primary" onClick={getTargetResult}>分类</Button>
        </Popover>
        </div>
        <div style={{display: "flex", marginTop: 16}}>
          <Statistic title="类型" value={result1 || "无"} />
          <Statistic title="置信度" value={result2 || "无"} style={{marginLeft: 16}} />
        </div>
      </div>
    </Card>
  );
};

export default Index;