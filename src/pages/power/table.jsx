import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Table } from 'antd';

const PowerTable = (props) => {
  const { table_data, dispatch } = props;

  const columns = [
    {
      title: '编号',
      key: 'index',
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: '中心频率（Hz）',
      dataIndex: 'hz',
      key: 'hz',
    },
    {
      title: '幅值（dB）',
      dataIndex: 'db',
      key: 'db',
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <a
          onClick={() => {
            dispatch({
              type: 'powerTable/setdata',
              payload: {},
              callback: (state) => {
                let copy_data = state.tabledata.slice();
                copy_data.splice(index, 1);
                return { tabledata: copy_data };
              },
            });
          }}
        >
          删除
        </a>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={table_data}
      style={{ marginTop: '1rem' }}
    />
  );
};

const mapStateToProps = ({ powerTable }) => {
  return {
    table_data: powerTable.tabledata,
  };
};

export default connect(mapStateToProps)(PowerTable);
