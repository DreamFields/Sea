import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Row, Col, Button, Form } from 'antd';
import moment from 'moment';
import {
  TypeRadio,
  RadiationTarget,
  EchoTarget,
  PulseTarget,
  Powerplant,
  Propeller,
  SignalInfo,
} from '@/components/AudioInfos/index';

// TODO 现仅将组件AddSound抽象出来，这里由于不了解需求，暂搁置优化
const AddSound: React.FC<{
  dispatch: any;
  InforImport: any;
  sumForm: any;
  id: any;
  current: any;
  setCurrent: any;
}> = (props) => {
  const { dispatch, InforImport, sumForm, id, current, setCurrent } = props;
  const [type, settype] = useState(-2);
  useEffect(() => {
    console.log('type', type);
  }, [type]);

  useEffect(() => {
    if (InforImport.searchInfor) {
      const infor = InforImport.searchInfor;
      console.log(InforImport.searchInfor);
      if (infor.signal_type === 1) {
        settype(1);
        sumForm.setFieldsValue({
          signal_type: 1,
          ...infor,
          name: undefined,
          shaft_blade_rotationl: `${infor.shaft_count}_${infor.blade_count}_${infor.rotationl_speed}`,
          collect_d: infor.collect_time
            ? moment(infor.collect_time?.split(' ')[0], 'YYYY/MM/DD')
            : undefined,
          collect_t: infor.collect_time
            ? moment(infor.collect_time?.split(' ')[1], 'HH:mm:ss')
            : undefined,
        });
      } else if (infor.signal_type === 2) {
        settype(2);
        sumForm.setFieldsValue({
          signal_type: 2,
          ...infor,
          name: undefined,
          collect_d: infor.collect_time
            ? moment(infor.collect_time?.split(' ')[0], 'YYYY/MM/DD')
            : undefined,
          collect_t: infor.collect_time
            ? moment(infor.collect_time?.split(' ')[1], 'HH:mm:ss')
            : undefined,
        });
      } else if (infor.signal_type === 3) {
        settype(3);
        sumForm.setFieldsValue({
          signal_type: 3,
          ...infor,
          name: undefined,
          collect_d: infor.collect_time
            ? moment(infor.collect_time?.split(' ')[0], 'YYYY/MM/DD')
            : undefined,
          collect_t: infor.collect_time
            ? moment(infor.collect_time?.split(' ')[1], 'HH:mm:ss')
            : undefined,
        });
      }
      dispatch({
        type: 'inforImport/setInfor',
        payload: undefined,
      });
    }
  }, [InforImport.searchInfor]);

  const modifyActionNames = ['modifyNoise', 'modifyEcho', 'modifyPulse'];

  const _modify = (values: any, type: number) => {
    dispatch({
      type: `inforImport/${modifyActionNames[type]}`,
      payload: { id: id, body: values },
    }).then(() => {
      dispatch({
        type: 'soundList/fetchSoundList',
      });
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <Form
        onFinish={(values: any) => {
          if (type === -1) {
            console.log('目标信息表单值', {
              ...values,
              collect_time:
                values.collect_d?.format('YYYY-MM-DD') +
                ' ' +
                values.collect_t?.format('hh:mm:ss'),
              signal_type: undefined,
            });
          } else {
            let copy_vals = values;
            // 处理掉多余的键值对
            if (copy_vals['collect_d'] && copy_vals['collect_t']) {
              copy_vals['collect_time'] =
                values.collect_d?.format('YYYY-MM-DD') +
                ' ' +
                values.collect_t?.format('HH:mm:ss');
              delete copy_vals['collect_d'];
              delete copy_vals['collect_t'];
            }
            for (let key in copy_vals) {
              if (
                copy_vals[key] === undefined ||
                copy_vals[key] === null ||
                copy_vals[key] === 'undefined undefined' ||
                copy_vals[key] === 'null_null'
              ) {
                delete copy_vals[key];
              }
            }
            delete copy_vals['shaft_blade_rotationl'];
            copy_vals['name'] = copy_vals['fleet_name'];
            delete copy_vals['fleet_name'];
            console.log('目标信息表单值', copy_vals);
            _modify(copy_vals, type - 1);
          }
          sumForm.resetFields();
          setCurrent(current + 1);
        }}
        form={sumForm}
      >
        <p>
          <b style={{ color: '#08979c' }}>信号类型</b>
        </p>
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ marginTop: 0 }}>
              <TypeRadio settype={settype} type={type} />
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
      </Form>
    </div>
  );
};

const mapStateToProps = ({ inforImport }) => {
  // console.log(loading)
  return {
    InforImport: inforImport,
  };
};
export default connect(mapStateToProps)(AddSound);
