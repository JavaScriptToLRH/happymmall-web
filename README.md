# MMALL商城

## 1. 项目描述

## 2. 如何运行

### 2.1 项目初始化步骤

+ 安装nodejs环境: [node.js中文官网](https://nodejs.org/zh-cn)
+ 全局安装webpack: `npm install webpack -g`
+ 本地项目中安装1.15.0版本的webpack: `npm install -g webpack@^1.15.0`
+ 全局安装webpack-dev-server v^1.16.5 命令: `npm install -g webpack-dev-server@^1.16.5`
+ 在项目根目录执行npm初始化命令: `npm install (--registry=https://registry.npm.taobao.org)`
+ 执行命令进行打包: `webpack`
+ 启动项目
  + 开发模式: `npm run dev` (windows系统上为npm run dev_win)
  + 生产模式: `npm run dist` (windows系统上为npm run dist_win)
  + 注：如果提示缺少包没有安装，则可按照提示安装对应包再次进行启动
+ 开发模式下预览项目, 在浏览器中访问：`http://localhost:8089/dist/view/index.html`

### 2.2 设置 Charles 代理

打开Charles代理工具，在选项卡中选择: `Tools --> Map Remote`

``` text
  http://localhost:8089/cart/*       Form-->To   http://test.happymmall.com:80/cart/

  http://localhost:8089/user/*       Form-->To   http://test.happymmall.com:80/user/

  http://localhost:8089/product/*    Form-->To   http://test.happymmall.com:80/product/

  http://localhost:8089/shipping/*   Form-->To   http://test.happymmall.com:80/shipping/

  http://localhost:8089/order/*      Form-->To   http://test.happymmall.com:80/order/

  http://localhost:8089/manage/*     Form-->To   http://test.happymmall.com:80/manage/

  http://localhost:8089/user/*       Form-->To   http://test.happymmall.com:80/user/
```

### 2.3 其它

+ 环境软件下载：<http://learning.happymmall.com>
+ HappyMMall数据接口: <https://gitee.com/imooccode/happymmallwiki>
+ 前台域名: <http://test.happymmall.com>
+ 后台域名: <http://admintest.happymmall.com>
+ 管理员登录的账号是: `admin`
+ 管理员登录的密码是: `admin`

``` text
来源：happymmall线上测试环境
作者：Geely
链接：https://www.imooc.com/article/19088
来源：慕课网
```

## 3. 项目备注

## 4. 项目展示
