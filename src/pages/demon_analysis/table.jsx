import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Table, Input } from 'antd';

const DemonTable = (props) => {
  const { table_data, dispatch } = props;

  const columns = [
    {
      title: 'n倍频',
      key: 'index',
      render: (text, record, index) => {
        if (index === 0) return <>基频</>;
        else if (index === 1) return <>二倍频</>;
        else if (index === 2) return <>三倍频</>;
        else if (index === 3) return <>四倍频</>;
        else if (index === 4) return <>五倍频</>;
        else if (index === 5) return <>六倍频</>;
        else if (index === 6) return <>七倍频</>;
      },
    },
    {
      title: '频率（Hz）',
      dataIndex: 'hz',
      key: 'hz',
    },
    {
      title: '轴数',
      dataIndex: 'axesNum',
      key: 'axesNum',
      render: (text, record, index) => {
        return <Input placeholder={'请输入轴数'} />;
      },
    },
    {
      title: '转速',
      dataIndex: 'rpm',
      key: 'rpm',
    },
    {
      title: '叶片数',
      dataIndex: 'bladeNum',
      key: 'bladeNum',
      render: (text, record, index) => {
        return <Input placeholder={'请输入叶片数'} />;
      },
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <a
          onClick={() => {
            dispatch({
              type: 'demonTable/setdata',
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

const mapStateToProps = ({ demonTable }) => {
  return {
    table_data: demonTable.tabledata,
  };
};

export default connect(mapStateToProps)(DemonTable);
