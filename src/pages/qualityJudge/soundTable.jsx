/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Table, Form, Radio, message } from 'antd';
import request from '@/utils/request';

const columns = [
  {
    title: '序号',
    key: 'index',
    render: (text, record, index) => <span>{index + 1}</span>,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '评级',
    key: 'address',
    render: () => <>无</>,
  },
];

const Index = (props) => {
  const { sound_list } = props;
  const [selectedRowKeys, setselectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const onSelectChange = (e) => {
    console.log(e);
    setselectedRowKeys(e);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const modeOptions = [
    {label: "THD", value: 'thd'},
    {label: "功率谱熵", value: "se"},
  ]

  return (
    <>
      <div style={{ display: 'flex', marginTop: '1rem' }}>
        <Form
          onFinish={async (values) => {
            if(!values.mode) {
              message.error("请选择自动检测模式！");
              return;
            }
            // console.log(values, selectedRowKeys);
            const detectRes = await request(`/v1/evaluation/auto_${values.mode}`, {
              method: 'POST',
              data: {
                sid: selectedRowKeys,
              },
            });
            alert(JSON.stringify(detectRes));
          }}
          form={form}
        >
          <Form.Item name="mode" label="批量自动检测" style={{ width: 400 }}>
            <Radio.Group 
              optionType="button"
              buttonStyle="solid"
              options={modeOptions}
            />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            form.submit();
          }}
        >
          检测
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={sound_list?.map((x) => {
          let y = x;
          y.key = x.id;
          return y;
        })}
        rowSelection={rowSelection}
      />
    </>
  );
};

const mapStateToProps = ({ loading, soundList }) => {
  return {
    soundListLoading: loading.effects['soundList/fetchSoundList'],
    sound_list: soundList.sound_list,
  };
};

export default connect(mapStateToProps)(Index);
