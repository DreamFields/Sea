import React, { useState } from 'react';
import { Table, Tag, Space, Popconfirm, Modal, Button, Form, Radio, Input, Select, Descriptions, Image } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './index.less';
import testpic from '../../assets/test.jpg'
import { render } from 'react-dom';

const { Column, ColumnGroup } = Table;
const { Search, TextArea } = Input;

//Data
const data = [
    {
        country: "中国",
        signal_category: "辐射噪声",
        fleet_name: "测试文件1",
        power_plant:"柴油机",
        propellers:"单轴3叶",
        Collection_time:"2019-12-12",
        Collection_platform:"平台3",
        Collection_area:"海域1",
        target_number: 2,
        fleet_type_name: "类型1",
        id: 1
    },
    {
        country: "中国",
        signal_category: "目标回声",
        fleet_name: "测试文件2",
        power_plant:"燃气轮机",
        propellers:"单轴4叶",
        Collection_time:"2019-12-24",
        Collection_platform:"平台1",
        Collection_area:"海域3",
        target_number: 3,
        fleet_type_name: "类型2",
        id: 2
    },
    {
        country: "中国",
        signal_category: "脉冲信号",
        fleet_name: "测试文件3",
        power_plant:"涡轮机",
        propellers:"四轴6叶",
        Collection_time:"2018-12-12",
        Collection_platform:"平台2",
        Collection_area:"海域2",
        target_number: 3,
        fleet_type_name: "类型3",
        id: 2
    },
];


const TestList = dataIndex => {
    const [visible, setVisible] = useState(false);
    const [Record, setRecord] = useState(undefined);
    const [searchTest, SetSearchTest] = useState('');
    const [searchedColumn, SetsearchedColumn] = useState('');
    
    // 搜索模块
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
            //   ref={node => {
            //     this.searchInput = node;
            //   }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            // setTimeout(() => this.searchInput.select(), 100);
            console.log("adad")
          }
        },
        render: text =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchTest]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });
    // 搜索模块所需的方法

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // this.setState({
        //   searchText: selectedKeys[0],
        //   searchedColumn: dataIndex,
        // });
        SetSearchTest(selectedKeys[0]);
        SetsearchedColumn(dataIndex);
      };
    
    const handleReset = clearFilters => {
        clearFilters();
        //this.setState({ searchText: '' });
        SetSearchTest('');
      };
    // 搜索模块 END



    const onCreate = values => {
        console.log('Received values of form: ', values);
        setVisible(false);
    };


    const editHandler = record => {
        console.log('record ', record);
        setVisible(true);
        setRecord(record);
        console.log(Record)
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: fleet_id => <a>{fleet_id}</a>,
            ...getColumnSearchProps('id')
        },
        {
            title: '目标名称',
            dataIndex: 'fleet_name',
            key: 'fleet_name',
            ...getColumnSearchProps('fleet_name')
        },
        {
            title: '信号形式',
            dataIndex: 'signal_category',
            key: 'signal_category',
            ...getColumnSearchProps('signal_category')
        },
        {
            title: '目标类型',
            dataIndex: 'fleet_type_name',
            key: 'fleet_type_name',
            ...getColumnSearchProps('fleet_type_name')
        },
        {
            title: '国别',
            dataIndex: 'country',
            key: 'country',
            ...getColumnSearchProps('country')
        },
        {
            title: '目标舷号',
            dataIndex: 'target_number',
            key: 'target_number',
            ...getColumnSearchProps('target_number')
        },
        {
            title: '动力装置',
            dataIndex: 'power_plant',
            key: 'power_plant',
            ...getColumnSearchProps('power_plant')
        },
        {
            title: '螺旋桨',
            dataIndex: 'propellers',
            key: 'propellers',
            ...getColumnSearchProps('propellers')
        },
        {
            title: '采集时间',
            dataIndex: 'Collection_time',
            key: 'Collection_time',
            ...getColumnSearchProps('Collection_time')
        },
        {
            title: '采集平台',
            dataIndex: 'Collection_platform',
            key: 'Collection_platform',
            ...getColumnSearchProps('Collection_platform')
        },
        {
            title: '采集海域',
            dataIndex: 'Collection_area',
            key: 'Collection_area',
            ...getColumnSearchProps('Collection_area')
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { editHandler(record) }}>查看/编辑</a>
                    <Popconfirm
                        title="Are you sure delete this task?"
                        okText="是"
                        cancelText="否"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    //render
    return (
        <div>
            <Table className="Table" dataSource={data} columns={columns} />
            {/* <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                New Collection
        </Button> */}
            <CollectionCreateForm
                visible={visible}
                Record={Record}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    )
}

const CollectionCreateForm = ({ visible, onCreate, onCancel, Record }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            Record={Record}
            title="Create a new collection"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Image src={testpic}></Image>

            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={Record}
            >
                <Form.Item name="fleet_name" label="目标名称">
                    <Input />
                </Form.Item>
                <Form.Item name="signal_category" label="信号形式">
                    <Input />
                </Form.Item>
                <Form.Item name="fleet_type_name" label="目标类型">
                    <Input />
                </Form.Item>
                <Form.Item name="country" label="国别">
                    <Input />
                </Form.Item>
                <Form.Item name="target_number" label="目标舷号">
                    <Input />
                </Form.Item>
                <Form.Item name="power_plant" label="动力装置">
                    <Input />
                </Form.Item>
                <Form.Item name="propellers" label="螺旋桨">
                    <Input />
                </Form.Item>
                <Form.Item name="Collection_time" label="采集时间">
                    <Input />
                </Form.Item>
                <Form.Item name="Collection_platform" label="采集平台">
                    <Input />
                </Form.Item>
                <Form.Item name="Collection_area" label="采集海域">
                    <Input />
                </Form.Item>
            </Form>

        </Modal>
    );
};


export default TestList;