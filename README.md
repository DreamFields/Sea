<!--
 * @Author: your name
 * @Date: 2021-11-02 22:36:12
 * @LastEditTime: 2021-11-17 20:00:13
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Sea\README.md
-->
# umi project

## Getting Started

### 安装依赖,
首先确保开发环境安装了node，npm，然后安装依赖时确认是管理员身份运行的终端！
所有步骤在文件夹根目录下进行。

第一步
```bash
$ npm install yarn
```

第二步
```bash
$ yarn
```
这个过程会很漫长，耐心等待。

### 启动服务器

```bash
$ yarn start
```
如果yarn start失败，可以再 yarn 几次。

## 海工水声数据库系统
1. 数据录入
上传音频文件---补充文件相关信息---上传有关图片文件---完成

2. 数据预处理
录入的音频进行可视化，使用频谱图展示，用户可以在频谱图上拖动产生区域，对数据进行预处理如复制粘贴剪切删除片段，对音频某一片段打标签等功能（仿AE操作）

3. 特征提取
对音频进行过零率，功率谱，梅尔倒谱系数等特征提取。
