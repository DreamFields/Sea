import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadPhotos = (props) => {
  const { url } = props;

  const upload_props = {
    name: 'picture',
    accept: '.jpg, .png',
    action: { url },
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log(info.file.response);
        if (info.file.response.code === 200) {
          message.success(`${info.file.name} 图片上传成功.`);
        } else {
          message.error(`${info.file.name} 图片上传失败.`);
          message.error(`${info.file.response.msg}`);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} 图片上传失败.`);
      }
    },
  };

  return (
    <Upload {...upload_props}>
      <Button icon={<UploadOutlined />}>更新照片信息</Button>
    </Upload>
  );
};

export default UploadPhotos;
