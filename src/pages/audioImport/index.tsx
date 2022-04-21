/*
 * @Descripttion:
 * @github: https://github.com/HlgdB/Seadata
 * @Author: HuRenbin
 * @Date: 2020-10-26 15:36:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-08 11:18:38
 * @FilePath     : \Seadata-front\src\pages\audioImport\index.tsx
 */
import React, { useState } from 'react';
import { connect, Dispatch, history } from 'umi';
import {
  Result,
  Button,
  Upload,
  message,
  Form,
  Steps,
  notification,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import style from './style.less';
import RecorderCn from '@/components/recorder_v2/index.jsx';
import { SERVICEURL } from '@/utils/const';
import AddSound from '@/pages/audioImport/AddSound';

const { Dragger } = Upload;
const { Step } = Steps;

interface AudioImportContentProps {
  dispatch: Dispatch;
  InforImport: any;
}

const AudioImport: React.FC<AudioImportContentProps> = (props) => {
  const { dispatch, InforImport } = props;
  const [id, setId] = useState(undefined);
  const [current, setCurrent] = useState(0);

  const [sumForm] = Form.useForm();

  // 上传图片信息
  const OtherFiles: React.FC<{}> = () => {
    const props = {
      name: 'picture',
      accept: '.jpg, .png',
      // multiple: true,
      action: `${SERVICEURL}/v1/sound/upload_picture/${id}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          console.log(info.file.response);
          if (info.file.response.code === 200) {
            notification.success({
              message: `${info.file.name} 文件上传成功.`,
            });
          } else {
            notification.error({ message: `${info.file.name} 文件上传失败.` });
            notification.error({ message: `${info.file.response.msg}` });
          }
        } else if (status === 'error') {
          notification.error({ message: `${info.file.name} 文件上传失败.` });
        }
      },
    };

    return (
      <div style={{ width: '100%', height: 220, marginBottom: 30 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖动文件以上传</p>
          <p className="ant-upload-hint">目前只支持单个上传</p>
        </Dragger>
      </div>
    );
  };

  // 上传本地音频
  const SoundFiles: React.FC<{}> = () => {
    const uploadprops = {
      name: 'audio',
      accept: '.wav, .mp3',
      action: `${SERVICEURL}/v1/sound/upload_sound`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      showUploadList: true,
      onChange(info: any) {
        const { status } = info.file;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          console.log(info.file.response);
          if (info.file.response.code === 200) {
            message.success(`${info.file.name} 文件上传成功.`);
            setId(info.file.response.data.id);
            dispatch({
              type: 'soundList/fetchSoundList',
            });
          } else {
            notification.error({
              message: `${info.file.response.msg} 文件上传失败.`,
            });
          }
        } else if (status === 'error') {
          notification.error({ message: `${info.file.name} 文件上传失败.` });
        }
      },
    };

    return (
      <>
        <div style={{ width: '100%', height: 220, marginBottom: 50 }}>
          <Dragger {...uploadprops}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或将文件拖到该区域以上传</p>
            <p className="ant-upload-hint">目前仅支持单个文件上传</p>
          </Dragger>
        </div>
      </>
    );
  };

  // 流程完成页面
  const SuccessResult: React.FC<{}> = () => {
    return (
      <Result
        status="success"
        title="成功导入声音文件！"
        // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      />
    );
  };

  // 主界面
  const MainContent = () => {
    console.log('reRender2');
    const steps = [
      {
        title: '上传音频',
      },
      {
        title: '完善音频信息',
      },
      {
        title: '上传图片信息',
      },
      {
        title: '完成',
      },
    ];

    const next_1 = () => {
      if (id === undefined) {
        message.warning('请先上传一个音频文件');
        // setCurrent(current + 1);
      } else {
        console.log('id', id);
        setCurrent(current + 1);
      }
    };

    const next_2 = async () => {
      try {
        const values = await sumForm.validateFields();
        console.log('Success:', values);
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
      sumForm.submit();
      setCurrent(current + 1);
    };
    const StepContent = (props) => {
      const { stepCurr } = props;
      switch (stepCurr) {
        case 0:
          return (
            <>
              <SoundFiles />
              <RecorderCn />
            </>
          );

        case 1:
          return (
            <AddSound
              id={id}
              sumForm={sumForm}
              current={current}
              setCurrent={setCurrent}
            />
          );
        case 2:
          return <OtherFiles />;
        case 3:
          return <SuccessResult />;
        default:
          return null;
      }
    };

    return (
      <div className={style.rightContent}>
        <div className={style.rightCenter}>
          <h3>数据管理</h3>
          <h4 id="targetName">上传数据</h4>

          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className={style.steps_content}>
            <StepContent stepCurr={current}></StepContent>
          </div>
          <div className={style.steps_action}>
            {current === 0 && (
              <Button type="primary" onClick={next_1}>
                下一步
              </Button>
            )}
            {current === 1 && (
              <Button type="primary" onClick={next_2}>
                下一步
              </Button>
            )}
            {current === 2 && (
              <Button
                type="primary"
                onClick={() => {
                  setCurrent(current + 1);
                  setId(undefined);
                }}
              >
                下一步
              </Button>
            )}
            {current === 3 && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    setCurrent(0);
                    setId(undefined);
                  }}
                >
                  完成
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    history.push('/audioEdit');
                  }}
                  style={{ marginLeft: 16 }}
                >
                  数据整编
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return <MainContent />;
};

const mapStateToProps = ({ inforImport }: { inforImport: any }) => {
  // console.log('inforImport', inforImport);
  return {
    // InforImport: inforImport,
    // powerEngine: inforImport.powerEngine
  };
};

export default connect(mapStateToProps)(AudioImport);
