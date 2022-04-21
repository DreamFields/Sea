import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import '../BasicLayouts.css';
import { Form, message, Row, Col, Image, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import request from '@/utils/request';
import { SERVICEURL } from '@/utils/const';
import {
  TypeRadio,
  SignalInfo,
  Propeller,
  Powerplant,
  RadiationTarget,
  EchoTarget,
  PulseTarget,
} from '@/components/AudioInfos/index';

const AddSound = (props: any) => {
  const { sound_data, dispatch, sumForm, InforImport } = props;
  const [type, settype] = useState(
    sound_data?.signal_type ? sound_data?.signal_type : -1,
  );

  useEffect(() => {
    if (sound_data) {
      settype(sound_data?.signal_type ? sound_data?.signal_type : -1);
    }
  }, [sound_data]);

  // 修改图片信息
  const UpgradePic = () => {
    const props = {
      name: 'picture',
      accept: '.jpg, .png',
      action: `${SERVICEURL}/v1/sound/upload_picture/${sound_data?.id}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      onChange(info: any) {
        const { status } = info.file;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          console.log(info.file.response);
          if (info.file.response.code === 200) {
            message.success(`${info.file.name} 文件上传成功.`);
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          } else {
            message.error(`${info.file.name} 文件上传失败.`);
            message.error(`${info.file.response.msg}`);
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
          dispatch({
            type: 'soundList/fetchSoundList',
          });
        }
      },
    };

    const handleDelete = () => {
      request(`/v1/sound/picture/${sound_data.id}`, {
        method: 'delete',
      }).then((res) => {
        if (res) {
          message.success('删除成功！');
          dispatch({
            type: 'soundList/fetchSoundList',
          });
        } else {
          message.error('删除失败！');
        }
      });
    };

    return (
      <div style={{ display: 'flex' }}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>更新照片信息</Button>
        </Upload>
        <Button
          type="primary"
          style={{ marginLeft: 16 }}
          onClick={handleDelete}
        >
          删除照片
        </Button>
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Form
        onFinish={(values: any) => {
          console.log(sound_data);

          let copy_vals = values;
          // 处理掉多余的键值对
          for (let key in copy_vals) {
            if (
              copy_vals[key] === undefined ||
              copy_vals[key] === null ||
              copy_vals[key] === 'undefined undefined' ||
              copy_vals[key] === 'null_null_null'
            ) {
              delete copy_vals[key];
            }
          }
          copy_vals['sid'] = sound_data.id;
          copy_vals['name'] = copy_vals['fleet_name'];
          delete copy_vals['fleet_name'];
          delete copy_vals['shaft_blade_rotationl'];

          if (copy_vals['collect_d'] && copy_vals['collect_t']) {
            console.log(copy_vals['collect_d'], copy_vals['collect_t']);
            copy_vals['collect_time'] =
              values.collect_d?.format('YYYY-MM-DD') +
              ' ' +
              values.collect_t?.format('HH:mm:ss');
            delete copy_vals['collect_d'];
            delete copy_vals['collect_t'];
          }

          console.log('这是修改目标信息表单值', copy_vals);
          request('/v1/sound/info', {
            method: 'PUT',
            data: copy_vals,
          }).then((res) => {
            if (res) {
              message.success('修改成功！');
              dispatch({
                type: 'soundList/fetchSoundList',
              });
            } else {
              message.error('修改失败！');
              dispatch({
                type: 'soundList/fetchSoundList',
              });
            }
          });
        }}
        form={sumForm}
      >
        <p>
          <b style={{ color: '#08979c' }}>信号类型</b>
        </p>
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ marginTop: 0 }}>
              <TypeRadio type={type} settype={settype} />
            </div>
          </Col>
        </Row>
        {/* 分割线 */}
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: 'white',
            display: type === -1 ? 'none' : 'block',
          }}
        ></div>
        <p style={{ marginTop: type === -1 ? 0 : 30 }}>
          <b style={{ color: '#08979c' }}>信号目标船舰信息</b>
        </p>
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ marginTop: 0 }}>
              <div
                style={{
                  marginTop: 0,
                  display: type === 1 ? 'block' : 'none',
                }}
                id="radiation_target_div"
              >
                <RadiationTarget
                  dispatch={dispatch}
                  country={InforImport.country}
                  rnType={InforImport.rnType}
                  type={type}
                />
              </div>
              <div
                style={{
                  marginTop: 0,
                  display: type === 2 ? 'block' : 'none',
                }}
                id="echo_target_div"
              >
                <EchoTarget
                  dispatch={dispatch}
                  country={InforImport.country}
                  teType={InforImport.teType}
                  type={type}
                />
              </div>
              <div
                style={{
                  marginTop: 0,
                  display: type === 3 ? 'block' : 'none',
                }}
                id="pulse_target_div"
              >
                <PulseTarget
                  dispatch={dispatch}
                  country={InforImport.country}
                  apType={InforImport.apType}
                  asType={InforImport.asType}
                  type={type}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <div
              style={{
                marginTop: 0,
                display: type === 1 || type === 2 ? 'block' : 'none',
              }}
              id="powerplant_div"
            >
              <Powerplant
                dispatch={dispatch}
                powerEngine={InforImport.powerEngine}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <div
              style={{ marginTop: 0, display: type === 1 ? 'block' : 'none' }}
              id="propeller_div"
            >
              <Propeller
                dispatch={dispatch}
                propeller={InforImport.propeller}
                sumForm={sumForm}
              />
            </div>
          </Col>
        </Row>
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: 'white',
            display: type === -1 ? 'none' : 'block',
          }}
        ></div>
        <p style={{ marginTop: type === -1 ? 10 : 30 }}>
          <b style={{ color: '#08979c' }}>信号采集相关信息</b>
        </p>
        <Row gutter={16}>
          <Col span={24}>
            <div
              style={{
                marginTop: 0,
                display: type !== -1 ? 'block' : 'none',
              }}
            >
              <SignalInfo />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Button
              type="dashed"
              onClick={() => {
                sumForm.resetFields();
                settype(-1);
              }}
              style={{ marginBottom: 20 }}
            >
              重置
            </Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <div style={{ color: '#08979c', marginBottom: 16 }}>
              <b>图片信息</b>
            </div>
            <UpgradePic />
            {/* {sound_data.pictures?.map((item: any, index: any) => {
              return (
                <Image
                  src={item.picture_url}
                  style={{ marginBottom: 16, marginTop: 16 }}
                ></Image>
              );
            })} */}
            <Image
              src={
                sound_data?.pictures
                  ? sound_data?.pictures[sound_data.pictures.length - 1]
                      .picture_url
                  : null
              }
              style={{ marginBottom: 16, marginTop: 16 }}
            ></Image>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const mapStateToProps = ({ inforImport }) => {
  return {
    InforImport: inforImport,
  };
};

export default connect(mapStateToProps)(AddSound);
