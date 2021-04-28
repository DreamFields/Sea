import React from 'react';
import { Upload, Button, message, Popover } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Cookies from '../../utils/cookie';
const uploadTip = (
  <div>
    上传图片之前要先下载当前图片
    <br />
    <b style={{ color: 'cyan' }}>额外提示</b>
    <br />
    如果进行过图片缩放，下载的将是缩放后的区域图片
    <br />
    如果想上传整个图片，可以点击下载按钮右侧的还原按钮
    <br />
    一次只能上传一张图片，批量上传只会上传最后一张上传的图片
  </div>
);
const UploadPhotos = (props) => {
  const { url } = props;

  const upload_props = {
    name: 'picture',
    accept: '.jpg, .png',
    action: url,
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        // console.log(info.file.response);
        if (info.file.response.code === 200) {
          message.success(`${info.file.name} 图片上传成功.`);
        } else {
          message.error(`${info.file.name} 图片上传失败,请检查是否已下载图片`);
          message.error(`${info.file.response.msg}`);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} 图片上传失败,请检查是否已下载图片`);
      }
    },
  };

  return (
    <Upload {...upload_props}>
      <Popover title="提示" content={uploadTip}>
        <Button icon={<UploadOutlined />}>上传图片</Button>
      </Popover>
    </Upload>
  );
};

export default UploadPhotos;
