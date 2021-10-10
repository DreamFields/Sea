import React from 'react';
import style from './style.less';
import { Input, Button, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;

const CommonComponent = ({ data, setData, readOnly }: any) => {
  return (
    <>
      <TextArea
        value={data.info_text_content.question_info}
        onChange={(e) => {
          data.info_text_content.question_info = e.target.value;
          setData({
            ...data,
          });
        }}
        placeholder="题目内容"
        readOnly={readOnly}
      ></TextArea>
      <TextArea
        value={data.info_text_content.A}
        onChange={(e) => {
          data.info_text_content.A = e.target.value;
          setData({
            ...data,
          });
        }}
        placeholder="A选项内容"
        readOnly={readOnly}
      ></TextArea>
      <TextArea
        value={data.info_text_content.B}
        onChange={(e) => {
          data.info_text_content.B = e.target.value;
          setData({
            ...data,
          });
        }}
        placeholder="B选项内容"
        readOnly={readOnly}
      ></TextArea>
      <TextArea
        value={data.info_text_content.C}
        onChange={(e) => {
          data.info_text_content.C = e.target.value;
          setData({
            ...data,
          });
        }}
        placeholder="C选项内容"
        readOnly={readOnly}
      ></TextArea>
      <TextArea
        value={data.info_text_content.D}
        onChange={(e) => {
          data.info_text_content.D = e.target.value;
          setData({
            ...data,
          });
        }}
        placeholder="D选项内容"
        readOnly={readOnly}
      ></TextArea>
      <TextArea
        value={data.analysis}
        onChange={(e) => {
          data.analysis = e.target.value;
          setData({
            ...data,
          });
        }}
        placeholder="题目分析"
        readOnly={readOnly}
      ></TextArea>
      <Input
        value={data.knowledge_id}
        onChange={(e) => {
          data.knowledge_id = e.target.value;
          setData({
            ...data,
          });
        }}
        placeholder="知识点ID"
        readOnly={readOnly}
      ></Input>
      <Select
        value={data.difficult}
        style={{
          display: 'block',
        }}
        onChange={(e) => {
          data.difficult = e;
          setData(data);
        }}
        disabled={readOnly}
      >
        <Option value="1">难度1</Option>
        <Option value="2">难度2</Option>
        <Option value="3">难度3</Option>
        <Option value="4">难度4</Option>
        <Option value="5">难度5</Option>
      </Select>
      <Select
        value={data.correct}
        style={{
          display: 'block',
        }}
        onChange={(e) => {
          data.correct = e;
          setData(data);
        }}
        disabled={readOnly}
      >
        <Option value="A">正确选项A</Option>
        <Option value="B">正确选项B</Option>
        <Option value="C">正确选项C</Option>
        <Option value="D">正确选项D</Option>
      </Select>

      <Upload
        name="file"
        action="http://www.baidu.com"
        headers={{ authorization: '' }}
        onChange={(info) => {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            console.log(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            console.error(`${info.file.name} file upload failed.`);
          }
        }}
        disabled={readOnly}
      >
        <Button icon={<UploadOutlined />}>上传音频</Button>
      </Upload>

      <Upload
        name="file"
        action="http://www.baidu.com"
        headers={{ authorization: '' }}
        onChange={(info) => {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            console.log(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            console.error(`${info.file.name} file upload failed.`);
          }
        }}
        disabled={readOnly}
      >
        <Button icon={<UploadOutlined />}>上传图片</Button>
      </Upload>
    </>
  );
};

export default CommonComponent;
