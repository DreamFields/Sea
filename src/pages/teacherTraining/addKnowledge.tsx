import React, { useState } from 'react';
import style from './style.less';
import { Input, Button } from 'antd';

const Component = (props: any) => {
  const [content, setContent] = useState('');
  const submit = () => {
    const data = { content };
    console.log(data);
  };
  return (
    <div>
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
      ></Input>
      <Button onClick={submit}>提交</Button>
    </div>
  );
};

export default Component;
