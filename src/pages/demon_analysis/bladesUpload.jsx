import React from 'react';
import { connect } from 'umi';
import { Table, Input, message, Button } from 'antd';
import request from '@/utils/request';
const BladesUpload = (props) => {
  const { blades, shade, dispatch, demon_id } = props;
  //叶片数提交
  const labelupload = () => {
    if (shade === '') {
      message.error('未进行基频选择，请检查操作是否正确');
    } else if (shade === 'auto') {
      request(`/v1/ffile/demon/blade/${demon_id}`, {
        method: 'POST',
        data: {
          auto_shade: blades,
        },
      }).then((res) => {
        message.success('提交叶片数成功');
      });
    } else if (shade === 'manual') {
      request(`/v1/ffile/demon/blade/${demon_id}`, {
        method: 'POST',
        data: {
          manual_shade: blades,
        },
      }).then((res) => {
        if (blades === 0) message.warning('提交叶片数为0，请检查是否正确');
        else message.success('提交叶片数成功');
      });
    }
  };
  return <Button onClick={labelupload}>叶片数提交</Button>;
};

const mapStateToProps = ({ bladesUpload }) => {
  return {
    blades: bladesUpload.blades,
    shade: bladesUpload.shade,
  };
};

export default connect(mapStateToProps)(BladesUpload);
