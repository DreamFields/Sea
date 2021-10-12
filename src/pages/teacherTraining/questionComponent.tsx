import React, { Validator, useCallback } from 'react';
import style from './style.less';
import { Input, Button, Select, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { post } from '@/utils/request';

const { TextArea } = Input;
const { Option } = Select;

type CustomRequest = Exclude<
  Exclude<
    Exclude<typeof Upload['propTypes'], undefined>['customRequest'],
    undefined
  > extends Validator<infer U>
    ? U
    : never,
  null | undefined
>;

const a = (b: number): string => ({} as any);

const makeUploader =
  ({
    api,
    fileFieldName,
    id,
  }: {
    api: string;
    fileFieldName: string;
    id: number;
  }): CustomRequest =>
  ({ file, onSuccess, onError }) => {
    const body = new FormData();
    body.append('id', `${id ?? ''}`);
    body.append(fileFieldName, file);
    post(api, {
      // headers: {
      //   // 这里的request的header不能加在extend创建实例里
      //   // 'Content-Type': 'application/x-www-form-urlencode',
      // },
      body,
    })
      .then(() => {
        console.debug.bind(null, 'uploader:');
        // @ts-ignore
        onSuccess?.({});
      })
      .catch(onError);
  };

const CommonComponent = ({ data, onDataChange, readOnly }: any) => {
  const handleAudioUpload = useCallback<CustomRequest>(
    makeUploader({
      api: '/v1/teacher/upload_sound',
      id: data.question_id,
      fileFieldName: 'audio',
    }),
    [],
  );
  const handlePictureUpload = useCallback<CustomRequest>(
    makeUploader({
      api: '/v1/teacher/upload_picture',
      id: data.question_id,
      fileFieldName: 'picture',
    }),
    [],
  );

  return (
    <Form labelCol={{ span: 2 }} wrapperCol={{ span: 16 }} autoComplete="off">
      <Form.Item label="题目内容" name="qi">
        <TextArea
          value={data.info_text_content.question_info}
          defaultValue={data.info_text_content.question_info}
          onChange={(e) => {
            data.info_text_content.question_info = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          placeholder="题目内容"
          readOnly={readOnly}
        ></TextArea>
      </Form.Item>
      <Form.Item label="A选项内容" name="a">
        <TextArea
          value={data.info_text_content.A}
          defaultValue={data.info_text_content.A}
          onChange={(e) => {
            data.info_text_content.A = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          placeholder="A选项内容"
          readOnly={readOnly}
        ></TextArea>
      </Form.Item>
      <Form.Item label="B选项内容" name="b">
        <TextArea
          value={data.info_text_content.B}
          defaultValue={data.info_text_content.B}
          onChange={(e) => {
            data.info_text_content.B = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          placeholder="B选项内容"
          readOnly={readOnly}
        ></TextArea>
      </Form.Item>

      <Form.Item label="C选项内容" name="c">
        <TextArea
          value={data.info_text_content.C}
          defaultValue={data.info_text_content.C}
          onChange={(e) => {
            data.info_text_content.C = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          placeholder="C选项内容"
          readOnly={readOnly}
        ></TextArea>
      </Form.Item>

      <Form.Item label="D选项内容" name="d">
        <TextArea
          value={data.info_text_content.D}
          defaultValue={data.info_text_content.D}
          onChange={(e) => {
            data.info_text_content.D = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          placeholder="D选项内容"
          readOnly={readOnly}
        ></TextArea>
      </Form.Item>

      <Form.Item label="题目分析" name="analysis">
        <TextArea
          value={data.analysis}
          defaultValue={data.analysis}
          onChange={(e) => {
            data.analysis = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          placeholder="题目分析"
          readOnly={readOnly}
        ></TextArea>
      </Form.Item>

      <Form.Item label="知识点ID" name="knowledge_id">
        <Input
          value={data.knowledge_id}
          defaultValue={data.knowledge_id}
          onChange={(e) => {
            data.knowledge_id = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          placeholder="知识点ID"
          readOnly={readOnly}
        ></Input>
      </Form.Item>

      <Form.Item label="难度" name="difficulty">
        <Select
          value={data.difficult}
          defaultValue={data.difficult}
          style={{
            display: 'block',
          }}
          onChange={(e) => {
            data.difficult = e;
            onDataChange(data);
          }}
          disabled={readOnly}
        >
          <Option value="1">难度1</Option>
          <Option value="2">难度2</Option>
          <Option value="3">难度3</Option>
          <Option value="4">难度4</Option>
          <Option value="5">难度5</Option>
        </Select>
      </Form.Item>

      <Form.Item label="正确选项" name="correct">
        <Select
          value={data.correct}
          defaultValue={data.correct}
          style={{
            display: 'block',
          }}
          onChange={(e) => {
            data.correct = e;
            onDataChange(data);
          }}
          disabled={readOnly}
        >
          <Option value="A">正确选项A</Option>
          <Option value="B">正确选项B</Option>
          <Option value="C">正确选项C</Option>
          <Option value="D">正确选项D</Option>
        </Select>
      </Form.Item>

      <Form.Item label="上传音频" name="uploadaudio">
        <Upload
          name="file"
          disabled={readOnly}
          customRequest={handleAudioUpload}
        >
          <Button icon={<UploadOutlined />}>上传音频</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="上传图片" name="uploadimg">
        <Upload
          name="file"
          customRequest={handlePictureUpload}
          disabled={readOnly}
        >
          <Button icon={<UploadOutlined />}>上传图片</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default CommonComponent;
