/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Table, Form, Radio, message, Tag } from 'antd';
import { FetchAutoBatchLevel } from './service';

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
    key: 'level',
    render: (text, record) => {
      return tagMap[record.result];
    },
  },
];

const tagMap = {
  优: <Tag color={'orange'}>优秀</Tag>,
  良: <Tag color={'green'}>良好</Tag>,
  中: <Tag color={'geekblue'}>中等</Tag>,
  差: <Tag color={'volcano'}>较差</Tag>,
  undefined: '无',
};

const Index = (props) => {
  const { sound_list } = props;
  const [selectedRowKeys, setselectedRowKeys] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [dataSource, setDataSource] = useState(
    sound_list?.map((item) => {
      item.key = item.id;
      return item;
    }),
  );
  const [form] = Form.useForm();

  const onSelectChange = (e) => {
    setselectedRowKeys(e);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const modeOptions = [
    { label: 'THD', value: 'thd' },
    { label: '功率谱熵', value: 'se' },
  ];

  const addResultToData = (detectRes = []) => {
    if (detectRes.length === 0) return;
    for (let item of dataSource) {
      if (detectRes.length === 0) break;
      if (item.id === detectRes[0].sound_id) {
        item.result = detectRes[0].result;
        detectRes.shift();
      }
    }
    setDataSource(JSON.parse(JSON.stringify(dataSource)));
  };

  return (
    <>
      <div style={{ display: 'flex', marginTop: '1rem' }}>
        <Form
          onFinish={async (values) => {
            if (!values.mode) {
              message.error('请选择自动检测模式！');
              return;
            }
            // console.log(values, selectedRowKeys);
            setTableLoading(true);
            const detectRes = await FetchAutoBatchLevel({
              mode: values.mode,
              sids: selectedRowKeys,
            });
            addResultToData(detectRes);
            setTableLoading(false);
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
          disabled={tableLoading}
        >
          检测
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        loading={tableLoading}
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
