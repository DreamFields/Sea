import React, { Validator, useState, useEffect } from 'react';
import style from './style.less';
import {
  Input,
  Button,
  Select,
  Upload,
  Form,
  Image,
  Radio,
  Checkbox,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { post } from '@/utils/request';
import AddKnowledge from './addKnowledge';

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

const CommonComponent = ({ data, onDataChange, readOnly }: any) => {
  console.log('question component', data);
  const { question_pic: pic_url, question_sound_url: sound_url } = data;

  const makeUploader = ({
    api,
    fileFieldName,
    cb,
    previewCb,
  }: {
    api: string;
    fileFieldName: string;
    cb: any;
    previewCb: any;
  }): CustomRequest => {
    const id = data.question_id;
    console.log('make uploader question_id', id, data);

    return ({ file, onSuccess, onError }) => {
      previewCb && previewCb(file);

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
        .then((res: any) => {
          console.debug.bind(null, 'uploader:');
          // @ts-ignore
          onSuccess?.({});

          cb && cb(res.id);
        })
        .catch(onError);
    };
  };

  const handleAudioUpload = makeUploader({
    api: '/v1/teacher/upload_sound',
    fileFieldName: 'audio',
    cb(id) {
      console.log('audio cb', id);
      onDataChange({ ...data, question_id: id });
    },
    previewCb(blob) {
      const blobUrl = URL.createObjectURL(blob);
      data.question_sound_url = blobUrl;
      onDataChange({ ...data, question_sound_url: blobUrl });
      console.log('blob audio', blob);
    },
  });
  const handlePictureUpload = makeUploader({
    api: '/v1/teacher/upload_picture',
    fileFieldName: 'picture',
    cb(id) {
      console.log('img cb', id);
      onDataChange({ ...data, question_id: id });
    },
    previewCb(blob) {
      const blobUrl = URL.createObjectURL(blob);
      data.question_pic = blobUrl;
      onDataChange({ ...data, question_pic: blobUrl });
      console.log('blob img', blob);
    },
  });

  const [knowledgeList, setKnowledgeList] = useState<any>([]);
  const [openCreateKnowledge, setOpenCreateKnowledge] = useState(false);
  const updateKnowledge = () => {
    post<any>('/v1/teacher/knowledge_list').then((res2) => {
      setKnowledgeList([...res2]);
    });
  };
  useEffect(() => {
    updateKnowledge();
  }, []);

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

      <Form.Item label="类型">
        <Radio.Group
          defaultValue={data.question_type.toString()}
          onChange={(e) => {
            console.log('question type change', e);
            data.question_type = e.target.value;
            onDataChange({
              ...data,
            });
          }}
          disabled={readOnly}
        >
          <Radio value="1">单选</Radio>
          <Radio value="2">多选</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="正确答案">
        {data.question_type == '1' && (
          <Radio.Group
            onChange={(e) => {
              console.log('radio group on change', e);

              data.correct = e.target.value;
              onDataChange({
                ...data,
              });
            }}
            disabled={readOnly}
            defaultValue={data.correct}
          >
            <Radio value="A">A</Radio>
            <Radio value="B">B</Radio>
            <Radio value="C">C</Radio>
            <Radio value="D">D</Radio>
          </Radio.Group>
        )}

        {data.question_type == '2' && (
          <Checkbox.Group
            defaultValue={(data.correct ?? '')
              .split('+')
              .filter((t) => t !== '')}
            onChange={(e) => {
              console.log('Checkbox group on change', e);

              data.correct = e.map((t) => t.toString()).join('+');
              onDataChange({
                ...data,
              });
            }}
            disabled={readOnly}
            options={[
              {
                label: 'A',
                value: 'A',
              },
              {
                label: 'B',
                value: 'B',
              },
              {
                label: 'C',
                value: 'C',
              },
              {
                label: 'D',
                value: 'D',
              },
            ]}
          />
        )}
      </Form.Item>

      {/* <Form.Item label="A选项内容" name="a">
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
      </Form.Item> */}

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
        <Select
          value={data.knowledge_id}
          defaultValue={data.knowledge_id}
          style={{
            display: 'block',
          }}
          onChange={(e) => {
            data.knowledge_id = e;
            onDataChange(data);
          }}
          disabled={readOnly}
        >
          {knowledgeList.map((item) => {
            return (
              <Option key={item.id} value={item.id}>
                {item.content}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      {!readOnly && (
        <div>
          <Button onClick={() => setOpenCreateKnowledge(!openCreateKnowledge)}>
            新增知识点
          </Button>
          {openCreateKnowledge && (
            <AddKnowledge
              onDone={() => {
                updateKnowledge();
                setOpenCreateKnowledge(false);
              }}
            />
          )}
        </div>
      )}

      <Form.Item label="章节" name="chapter">
        <Select
          value={data.chapter}
          defaultValue={data.chapter}
          style={{
            display: 'block',
          }}
          onChange={(e) => {
            data.chapter = e;
            onDataChange(data);
          }}
          disabled={readOnly}
        >
          <Option value="1">章节1</Option>
          <Option value="2">章节2</Option>
          <Option value="3">章节3</Option>
          <Option value="4">章节4</Option>
          <Option value="5">章节5</Option>
          <Option value="6">章节6</Option>
          <Option value="7">章节7</Option>
          <Option value="8">章节8</Option>
          <Option value="9">章节9</Option>
        </Select>
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
          <Option value="6">难度6</Option>
          <Option value="7">难度7</Option>
          <Option value="8">难度8</Option>
          <Option value="9">难度9</Option>
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
      {!readOnly && (
        <Form.Item label="上传图片" name="uploadimg">
          <Upload name="file" customRequest={handlePictureUpload}>
            <Button icon={<UploadOutlined />}>上传图片</Button>
          </Upload>
        </Form.Item>
      )}
      {pic_url && (
        <Image
          style={{ display: 'block' }}
          width={200}
          height={200}
          src={pic_url}
          fallback="data:image/png;base64,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"
        />
      )}
      {!readOnly && (
        <Form.Item label="上传音频" name="uploadaudio">
          <Upload name="file" customRequest={handleAudioUpload}>
            <Button icon={<UploadOutlined />}>上传音频</Button>
          </Upload>
        </Form.Item>
      )}
      {sound_url && <audio autoPlay={false} src={sound_url} controls />}
    </Form>
  );
};

export default CommonComponent;
