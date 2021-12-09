# 关于这个项目





## 快速启动项目

### 下载依赖包

首先，必须下载nodejs，建议到官网[http://nodejs.cn]，下载稳定的版本（不建议使用最新版本）。

clone或download本项目。在命令行进行以下操作：

```powershell
# 进入项目根目录，下载前端依赖包
npm install
# 进入vue_api_server文件夹，下载后台服务器的依赖包
cd vue_api_server
npm install
```

### 配置数据库

后端使用的是mysql数据库，为使后端服务器能正常运作，也必须本地安装mysql并做相应配置。安装不做展开，相关配置如下：

```json
// 依次打开vue_api_server->config->default.json
// 编辑以下属性
"db_config" : {
		"protocol" : "mysql",
		"host" : "127.0.0.1",
		"database" : "shop_backstage",// 写mysql内自定义的数据库名称，必须先在mysql创建这个数据库
		"user" : "root",// 写自己mysql数据库用户
		"password" : "123456",// 写自己mysql数据库用户密码
		"port" : 3306// // 写自己mysql数据库端口
}

```

运行数据库脚本，依次打开vue_api_server->db，运行mydb.sql。运行方法很多，不作展开。

### 开启后台api项目

```powershell
# vue_api_server，启动后台api
node app
```

检查是否正常使用，使用Postman。

所有api都写在，vue_api_server下，电商管理后台 API 接口文档.md。因为该服务器所有请求都必须要有token认证，除了登录。所以测试以下登录功能：

![image-20211206095815995](C:\Users\mgj\AppData\Roaming\Typora\typora-user-images\image-20211206095815995.png)

### 开启前端项目

```powershell
# 根目录下运行scripts命令
npm run start
```

如果看到下面画面，则说明已经开启成功。

![image-20211206100023856](C:\Users\mgj\AppData\Roaming\Typora\typora-user-images\image-20211206100023856.png)

## 开始你的探索旅途

用react+antd写vue+element的黑马的电商后台管理系统，实现逻辑或者方法大相径庭，能学到很多，特别是对js的理解会加深，然后react-antd和vue-element的UI实现也有很大不同。本项目没有使用状态管理，项目结构简单。页面都写在pages文件夹里面，复用的模板写在templates文件夹。react的路由，以及路由守卫不太熟悉，没写好。

## 记录bug

### 分配权限对话框不作操作点击确认后，角色的所有权限清空（已解决）

触发路径：权限管理->角色列表->操作栏->设置按钮->对话框确认

触发条件：当设置任意角色的拥有的权限与原来拥有的权限一样并提交到后端服务器的时候，该角色的所有权限会被清空。

触发原因：因为没有操作，导致onCheck方法也没有调用，this.state.halfCheckedKeysValue为空数组。

处理办法：展示设置权限对话框前，this.state.halfCheckedKeysValue = expandedKeysValue。

### 编辑订单失败（已解决）

触发路径：订单管理->订单列表->操作栏->编辑按钮->对话框确认

触发条件：无论怎么填写，提交到后台都失败。

触发原因：api接口文档错漏，参数order_price不能为空，meta.status的正确返回码为201而不是文档中写的200。

处理办法：修改api接口文档

其他连带问题：

1：order_number是订单流水不是订单数量；

2：每条订单数据的consignee_addr都是空串，导致无法修改地址，收件人，联系方式等信息；

3：is_send后台返回是字符串"是"或"否"，作为请求参数则是"1"或"0"；

4：在vue_api_server->services->OrderService.js中doCheckOrderParams方法，其他参数都有检查，唯独info.pay_status = '0';导致无法设置付款状态。修改后即可通过。

5：无法获取每个订单的物流信息

