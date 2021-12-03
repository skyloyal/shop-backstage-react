import { createRef } from 'react'
// antd
import {
  Card, Input, Button, Row, Col,
  Table, Pagination, Switch, Modal,
  Form, Radio, Space, Breadcrumb
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
// 自定义样式
import './index.scss'
import Auth from '../template/Auth'
export default class User extends Auth {

  // 导航对象
  history = this.props.history
  // 添加用户表单ref
  addUserDialogFormRef = createRef()
  // 编辑用户表单ref
  editUserDialogFormRef = createRef()
  // 添加用户表单校验规则
  addUserDialogFormRules = {
    username: [
      { required: true, min: 3, max: 10, message: '用户名长度在3~10个字符之间', validateTrigger: 'onBlur' },
    ],
    password: [
      { required: true, min: 6, max: 15, message: '密码长度在6~15个字符之间', validateTrigger: 'onBlur' },
    ],
    email: [
      { required: true, type: 'email', message: '请输入正确的邮箱地址', validateTrigger: 'onBlur' }
    ],
    mobile: [
      {
        required: true, type: 'string', validateTrigger: 'onBlur',
        validator: (rule, value) => {
          // console.log(rule, value)
          if (isNaN(parseInt(value)) || value.length !== 11) {
            // 不是数字 or 长度不是11
            rule.message = '请输入正确的电话号码'
            return Promise.reject('请输入正确的电话号码')
          } else {
            // 是数字,且长度为11
            return Promise.resolve()
          }
        }
      }
    ],
  }
  editUserDialogFormRules = {
    username: [
      { required: true, min: 3, max: 10, message: '用户名长度在3~10个字符之间', validateTrigger: 'onBlur' },
    ],
    password: [
      { required: true, min: 6, max: 15, message: '密码长度在6~15个字符之间', validateTrigger: 'onBlur' },
    ],
    email: [
      { required: true, type: 'email', message: '请输入正确的邮箱地址', validateTrigger: 'onBlur' }
    ],
    mobile: [
      {
        required: true, type: 'string', validateTrigger: 'onBlur',
        validator: (rule, value) => {
          // console.log(rule, value)
          if (isNaN(parseInt(value)) || value.length !== 11) {
            // 不是数字 or 长度不是11
            rule.message = '请输入正确的电话号码'
            return Promise.reject('请输入正确的电话号码')
          } else {
            // 是数字,且长度为11
            return Promise.resolve()
          }
        }
      }
    ],
  }


  // [standard]获取用户列表
  getUserList = async () => {
    const { data: res } = await this.$axios.get('/users', {
      params: this.state.queryInfo
    })
    if (res.meta.status !== 200) {
      return this.$message.error('获取用户列表失败')
    }
    console.log(res.data)
    const { total, users } = res.data
    this.setState({
      total: total,
      dataSource: users,
      isLoading: false
    })
  }
  // 按用户名查询
  searchUserByName = async (query, event) => {
    // console.log(query, event)
    let newQueryInfo = { ...this.state.queryInfo, query }
    await this.setState({
      queryInfo: newQueryInfo
    })
    this.getUserList()
  }
  // 改变用户状态
  switchMg_state = async (checked, record) => {
    // console.log(record)
    console.log(checked)
    const { id, username } = record

    const { data: res } = await this.$axios.put(`users/${id}/state/${checked}`)
    // console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('修改用户状态失败')
    }
    this.$message.success(`已更改用户(${username})状态为${res.data.mg_state ? true : false}`)
  }
  // 每页条数或页数改变后重新渲染
  pageChange = async (page, size) => {
    if (page === 0) {
      page = 1
    }
    console.log(page, size)//0,5
    let newQueryInfo = { ...this.state.queryInfo, pagenum: page, pagesize: size }
    await this.setState({
      queryInfo: newQueryInfo
    })//setState是异步操作
    // console.log(newQueryInfo)//{query: '', pagenum: 1, pagesize: 5}
    // console.log(this.state.queryInfo)//{query: '', pagenum: 1, pagesize: 10}
    this.getUserList()
  }
  // [add]展示添加用户对话框
  showAddUserDialog = () => {
    this.setState({ addUserDialogVisible: true })
  }
  // [add]关闭添加用户对话框
  closeAddUserDialog = () => {
    this.setState({ addUserDialogVisible: false })
  }
  // [add]提交添加用户表单
  submitAddUserDialog = () => {
    // console.log(this.addUserDialogFormRef)
    // this.closeAddUserDialog()
    this.addUserDialogFormRef.current
      .validateFields().then(async () => {
        const values = this.addUserDialogFormRef.current.getFieldsValue()
        // console.log(values)
        const { data: res } = await this.$axios.post('/users', values)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        // console.log(res.data)
        this.$message.success('添加用户成功')
        this.closeAddUserDialog()
        this.getUserList()
      }).catch((e) => {
        return
      })


  }

  // [edit]展示编辑用户对话框
  showEditUserDialog = (record) => async () => {
    // console.log(record)
    // console.log(this.editUserDialogFormRef)
    this.editUserDialogFormRef.current.setFieldsValue(record)
    this.setState({ editUserDialogVisible: true })
  }
  // [editEdit]关闭编辑用户对话框
  closeEditUserDialog = () => {
    this.setState({ editUserDialogVisible: false })
  }
  // [editEdit]提交编辑用户表单
  submitEditUserDialog = () => {
    console.log(this.addUserDialogFormRef)
    // // this.closeAddUserDialog()
    const current = this.editUserDialogFormRef.current
    current.validateFields().then(async () => {
      const values = current.getFieldsValue()
      console.log(values)
      const { data: res } = await this.$axios.put(`/users/${values.id}`, values)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑用户失败')
      }
      // console.log(res.data)
      this.$message.success('编辑用户成功')
      this.closeEditUserDialog()
      this.getUserList()
    }).catch((e) => {
      return
    })


  }
  // [delete]确认删除用户
  showRemoveUserDialog = (id) => () => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该用户, 是否继续?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        // console.log('OK', id);
        const { data: res } = await this.$axios.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList()
      },
      onCancel: () => {
        // console.log('Cancel');
        this.$message.info('取消删除')
      },
    })
  }

  // [edit]展示设置用户对话框
  showSetUserDialog = (record) => async () => {
    await this.setState({ setUserForm: { ...record } })
    this.setState({ setUserDialogVisible: true })
    console.log(this.state.setUserForm)
    const { data: res } = await this.$axios.get('/roles')
    // console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取角色列表失败')
    }
    await this.setState({ roleList: res.data })
  }
  changeSelectedRoleId = (e) => {
    console.log(e.target)
    this.setState({ selectedRoleId: e.target.value })
  }

  // [edit]关闭设置用户对话框
  closeSetUserDialog = () => {
    this.setState({
      setUserDialogVisible: false,
      selectedRoleId: 0
    })
  }
  // [edit]提交设置用户表单
  submitSetUserDialog = async () => {
    // console.log(this.setUserDialogFormRef)
    // console.log(this.state.selectedRoleId)
    if (!this.state.selectedRoleId) {
      return this.$message.warning('请设置角色')
    }
    const { data: res } = await this.$axios.put(`/users/${this.state.setUserForm.id}/role`, {
      rid: this.state.selectedRoleId
    })
    // console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('设置用户角色失败')
    }
    this.$message.success('设置用户角色成功')
    this.closeSetUserDialog()
    this.getUserList()
  }

  // state变量
  state = {
    // 用户列表
    dataSource: [],
    // 用户列表展示规则
    columns: [
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        key: 'role_name',
      },
      {
        title: '电话',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '状态',
        key: 'mg_state',
        dataIndex: 'mg_state',
        render: (text, record) => {
          return (
            <>
              <Switch defaultChecked={text} onChange={checked => this.switchMg_state(checked, record)}></Switch>
            </>
          )
        }
      },
      {
        title: '操作',
        render: (_, record) => {
          return (
            <div style={{ minWidth: "230px" }}>
              <Button
                onClick={this.showEditUserDialog(record)}
                className="primary opButton"
                size="small">编辑</Button>
              <Button
                onClick={this.showRemoveUserDialog(record.id)}
                className="danger opButton"
                size="small">删除</Button>
              <Button
                onClick={this.showSetUserDialog(record)}
                className="warning opButton"
                size="small">设置角色</Button>
            </div>
          )
        }
      }
    ],
    // 查询
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 10
    },
    // 总页数
    total: 0,
    // loading
    isLoading: true,
    // 添加用户对话框显示
    addUserDialogVisible: false,
    // 编辑用户对话框显示
    editUserDialogVisible: false,
    // 设置用户对话框显示
    setUserDialogVisible: false,
    // 设置用户表单对象
    setUserForm: {},
    roleList: [],
    selectedRoleId: 0
  }

  // [lifecycle]
  componentDidMount() {
    this.getUserList()
  }
  // [lifecycle]
  render() {
    return (
      <div className="user_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>用户列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 内容卡片区 */}
        <Card className="user_show">
          <Row gutter={20}>
            <Col span={8} >
              <Input.Search
                onSearch={this.searchUserByName}
                placeholder="请输入需要查询的用户名称"
                allowClear></Input.Search>
            </Col>
            <Col span={4}>
              <Button
                onClick={this.showAddUserDialog}
                className="primary">添加用户</Button>
            </Col>
          </Row>
          <Table
            bordered
            loading={this.state.isLoading}
            rowKey={(record) => {
              // console.log(record)
              return record.id
            }}
            className="user_table"
            pagination={false}
            dataSource={this.state.dataSource}
            columns={this.state.columns} >
          </Table>
          <Pagination
            total={this.state.total}
            defaultCurrent={this.state.queryInfo.pagenum}
            defaultPageSize={this.state.queryInfo.pagesize}
            showSizeChanger
            showQuickJumper
            showTotal={total => `总计 ${total} 条数据`}
            onChange={this.pageChange}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card>
        {/* 添加用户对话框 */}
        <Modal title="添加用户"
          cancelText="取消"
          okText="确定"
          onCancel={this.closeAddUserDialog}
          onOk={this.submitAddUserDialog}
          visible={this.state.addUserDialogVisible}>
          <Form
            // form={this.state.addUserForm}
            ref={this.addUserDialogFormRef}
            labelCol={{ span: 4 }}
          >
            <Form.Item
              label="用户名"
              name="username"
              validateTrigger={['onBlur']}
              rules={this.addUserDialogFormRules.username}>
              <Input
                placeholder="请输入用户名"
              ></Input>
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              validateTrigger={['onBlur']}
              rules={this.addUserDialogFormRules.password}
            ><Input.Password
              placeholder="请输入密码"
            ></Input.Password>
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              validateTrigger={['onBlur']}
              rules={this.addUserDialogFormRules.email}
            ><Input
              placeholder="请输入邮箱地址"
            ></Input></Form.Item>
            <Form.Item
              label="电话"
              name="mobile"
              validateTrigger={['onBlur']}
              rules={this.addUserDialogFormRules.mobile}
            ><Input
              placeholder="请输入电话号码"
            ></Input></Form.Item>
          </Form>
        </Modal>
        {/* 编辑用户对话框 */}
        <Modal
          forceRender={true}
          title="编辑用户"
          cancelText="取消"
          okText="确定"
          onCancel={this.closeEditUserDialog}
          onOk={this.submitEditUserDialog}
          visible={this.state.editUserDialogVisible}>
          <Form
            ref={this.editUserDialogFormRef}
            labelCol={{ span: 4 }}
          >
            <Form.Item
              label="id"
              name="id"
            >
              <Input
                disabled
              ></Input>
            </Form.Item>
            <Form.Item
              label="用户名"
              name="username"
              validateTrigger={['onBlur']}
              rules={this.editUserDialogFormRules.username}>
              <Input
                disabled
              ></Input>
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              validateTrigger={['onBlur']}
              rules={this.editUserDialogFormRules.email}
            ><Input
              placeholder="请输入邮箱地址"
            ></Input></Form.Item>
            <Form.Item
              label="电话"
              name="mobile"
              validateTrigger={['onBlur']}
              rules={this.editUserDialogFormRules.mobile}
            ><Input
              placeholder="请输入电话号码"
            ></Input></Form.Item>
          </Form>
        </Modal>
        {/* 分配用户角色对话框 */}
        <Modal
          forceRender={true}
          title="设置用户角色"
          cancelText="取消"
          okText="确定"
          onCancel={this.closeSetUserDialog}
          onOk={this.submitSetUserDialog}
          visible={this.state.setUserDialogVisible}
        >
          <p>当前用户名称:{this.state.setUserForm.username}</p>
          <p>当前用户名称:{this.state.setUserForm.role_name}</p>
          <Radio.Group
            onChange={this.changeSelectedRoleId}
            value={this.state.selectedRoleId}
          >
            <Space direction="vertical">
              {this.state.roleList.map((item) => {
                return (
                  <div key={item.id}>
                    <Radio
                      value={item.id}
                      key={item.id}
                    >{item.roleName}</Radio>
                  </div>
                )
              })}
            </Space>
          </Radio.Group>
        </Modal>
      </div>
    )
  }
}