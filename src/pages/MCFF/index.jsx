import React, { useEffect, useState } from 'react';
import { Spin, Input, Button, Form, Table, Card } from 'antd';
import request from '@/utils/request';
import html2canvas from 'html2canvas';
import b64toBlob from 'b64-to-blob';

const TestApp = (props) => {
  useEffect(() => {
    getData();
  }, []);
  const [loading, setloading] = useState(false);
  const [picIfo, setpicIfo] = useState(undefined); //图片base64格式数据
  const [tableData, setTableData] = useState(undefined); //将之前的八个数据特征的useState整合来节省性能
  let tabledata = {};

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];
  const data = [
    {
      key: '1',
      name: '谱质心',
      tag: 'spectral_centroid',
      value: tableData?.spectral_centroid,
    },
    {
      key: '2',
      name: '谱质心带宽',
      tag: 'spectral_centroid_width',
      value: tableData?.spectral_centroid_width,
    },
    {
      key: '3',
      name: '谱包络面积',
      tag: 'spectral_area',
      value: tableData?.spectral_area,
    },
    {
      key: '4',
      name: '谱斜率',
      tag: 'spectral_slope',
      value: tableData?.spectral_slope,
    },
    {
      key: '5',
      name: '谱下降图',
      tag: 'spectral_decline',
      value: tableData?.spectral_decline,
    },
    {
      key: '6',
      name: '谱不规律性',
      tag: 'spectral_Irregularity',
      value: tableData?.spectral_Irregularity,
    },
    {
      key: '7',
      name: '谱不平整性',
      tag: 'spectral_Uneven',
      value: tableData?.spectral_Uneven,
    },
    {
      key: '8',
      name: '谱熵',
      tag: 'spectral_entropy',
      value: tableData?.spectral_entropy,
    },
  ];

  const { audio_id, dispatch } = props;

  const getData = () => {
    setloading(true);
    request(`/v1/feature/MCFF`, {
      method: 'POST',
      data: {
        file_id: audio_id,
      },
    }).then((res) => {
      console.log('MCFFRES', res);
      let spectral_centroid = Math.floor(res?.spectral_centroid * 1000) / 1000;
      let spectral_centroid_width =
        Math.floor(res?.spectral_centroid_width * 1000) / 1000;
      let spectral_area = Math.floor(res?.spectral_area * 1000) / 1000;
      let spectral_decline = Math.floor(res?.spectral_decline * 1000) / 1000;
      let spectral_Irregularity =
        Math.floor(res?.spectral_Irregularity * 1000) / 1000;
      let spectral_Uneven = Math.floor(res?.spectral_Uneven * 1000) / 1000;
      let spectral_entropy = Math.floor(res?.spectral_entropy * 1000) / 1000;
      tabledata.spectral_centroid = spectral_centroid;
      tabledata.spectral_centroid_width = spectral_centroid_width;
      tabledata.spectral_area = spectral_area;
      tabledata.spectral_slope = res?.spectral_slope;
      tabledata.spectral_decline = spectral_decline;
      tabledata.spectral_Irregularity = spectral_Irregularity;
      tabledata.spectral_Uneven = spectral_Uneven;
      tabledata.spectral_entropy = spectral_entropy;
      setTableData(tabledata);
      /*
        setSpectral_centroid(spectral_centroid);
        setSpectral_centroid_width(spectral_centroid_width);
        setSpectral_area(spectral_area);
        setSpectral_slope(res?.picIfo.spectral_slope);
        setSpectral_decline(spectral_decline);
        setSpectral_Irregularity(spectral_Irregularity);
        setSpectral_Uneven(spectral_Uneven);
        setSpectral_entropy(spectral_entropy);
         */
      setpicIfo(res?.picIfo);

      dispatch({
        type: 'basicSoundData/setdata',
        payload: {
          calc: res?.calc.toPrecision(4),
          mean: res?.mean.toPrecision(4),
          va: res?.var.toPrecision(4),
        },
      });

      setloading(false);
    });
  };

  const getScreenshot = () => {
    html2canvas(document.querySelector('#capture'), {
      // 转换为图片
      useCORS: true, // 解决资源跨域问题
    }).then((canvas) => {
      // imgUrl 是图片的 base64格式 代码 png 格式
      let imgUrl = canvas.toDataURL('image/png');
      //下面是 下载图片的功能。 不需要不加 注意加 .png
      const str = imgUrl.replace(/data:image\/png;base64,/, '');
      const file = b64toBlob(str, 'image/png');
      const clipboardItemInput = new window.ClipboardItem({
        'image/png': file,
      });
      window.navigator.clipboard.write([clipboardItemInput]);
    });
  };

  return (
    <div>
      <Card>
        <div id="capture">
          <Spin spinning={loading}>
            <div
              style={{
                width: '100%',
                height: 320,
              }}
            >
              <img
                alt="MCFF"
                src={picIfo}
                style={{
                  marginTop: 20,
                  width: '100%',
                  height: 300,
                  display: picIfo ? 'block' : 'none',
                }}
                id="resImg"
              />
              {/*
            <Table
              columns={columns}
              dataSource={data}
              style={{
                marginTop: 20,
                width: '100%',
                height: 200,
                display: picIfo ? 'block' : 'none',
              }}
            />*/}
            </div>
          </Spin>
        </div>
        <Button onClick={getScreenshot}>复制截图</Button>
      </Card>
    </div>
  );
};
export default TestApp;
