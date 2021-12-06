import React, { Component, createRef } from 'react';
// 引入antd组件
import {
  Card, Row, Col, Table,
  Form, Modal, Button, Tag,
  Popconfirm,
  Input, Tree, Breadcrumb
} from 'antd'
// 引入antd图标
import {
  SearchOutlined, DeleteOutlined,
  SettingOutlined, CaretRightOutlined,
  CloseCircleFilled, ExclamationCircleOutlined
} from '@ant-design/icons'
// 引入自定义scss
import './index.scss'
import isAuth from '../../../template/Auth';
class RoleList extends Component {

  // [get]获取角色列表
  getRoleList = async () => {
    const { data: res } = await this.$axios.get('/roles')
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取角色列表失败')
    }
    this.setState({ dataSource: res.data })
    this.setState({ isLoading: false })
  }
  // [get]获取权限列表
  getRightList = async () => {
    if (this.state.treeDate.length !== 0) return
    const { data: res } = await this.$axios.get('/rights/tree')
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取权限列表失败')
    }
    this.setState({ treeDate: res.data })
  }
  // 数组去重
  unique = (arr) => {
    var hash = []
    for (var i = 0; i < arr.length; i++) {
      if (hash.indexOf(arr[i] === -1)) {
        hash.push(arr[i])
      }
    }
    return hash
  }

  // [custom]递归角色下最后一级权限内的所有权限ID
  getLeafKeys(node, arr1, arr2) {
    if (!node.children) {
      // 如果当前node节点不包含children属性，则是最下级节点，加入到第一个数组
      arr1.push(node.id)
    } else {
      // 如果当前node节点包括children属性，则是父节点，加入到第二个数组
      arr2.push(node.id)
      node.children.forEach(item => {
        this.getLeafKeys(item, arr1, arr2)
      });
    }
  }
  // [delete]移除权限
  removeRight = (role, rightId) => async () => {
    const roleId = role.id
    // console.log(roleId, rightId)
    const { data: res } = await this.$axios.delete(`roles/${roleId}/rights/${rightId}`)
    if (res.meta.status !== 200) {
      return this.$message.error('移除权限失败')
    }
    role.children = res.data
    // this.forceUpdate()
    this.setState({})
    this.$message.success('移除权限成功')
  }
  // [cancel]取消操作
  cancelRemoveRight = () => {
    return this.$message.warning('已取消移除权限操作')
  }
  // [add]展示添加角色对话框
  showAddRoleDialog = () => {
    this.setState({ addRoleDialogVisible: true })
  }
  // [add]关闭添加角色对话框
  closeAddRoleDialog = () => {
    this.setState({ addRoleDialogVisible: false })
  }
  // [add]提交添加角色对话框
  submitAddRoleDialog = async () => {
    // console.log(this.addRoleDialogFormRef.current)
    const current = this.addRoleDialogFormRef.current
    // console.log(current.getFieldsValue())
    const addUserForm = current.getFieldsValue()
    const { data: res } = await this.$axios.post('/roles', addUserForm)
    if (res.meta.status !== 201) {
      return this.$message.error('添加角色失败')
    }
    this.$message.success(`添加角色(${addUserForm.roleName})成功`)
    this.closeAddRoleDialog()
    this.getRoleList()
  }
  // [edit]展示编辑角色对话框
  showEditRoleDialog = (record) => () => {
    const current = this.editRoleDialogFormRef.current
    console.log(current)
    current.setFieldsValue(record)
    this.setState({ editRoleDialogVisible: true })
  }
  // [edit]关闭编辑角色对话框
  closeEditRoleDialog = () => {
    this.setState({ editRoleDialogVisible: false })
  }
  // [edit]提交编辑角色对话框
  submitEditRoleDialog = async () => {
    const current = this.editRoleDialogFormRef.current
    console.log(current)
    const editRoleForm = current.getFieldsValue()
    const { data: res } = await this.$axios.put(`roles/${editRoleForm.id}`, editRoleForm)
    if (res.meta.status !== 200) {
      return this.$message.error('编辑角色失败')
    }
    this.$message.success('编辑角色成功')
    this.closeEditRoleDialog()
    this.getRoleList()
  }
  // [delete]展示移除角色对话框
  showRemoveRoleDialog = (roleId) => () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该角色, 是否继续?',
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        const { data: res } = await this.$axios.delete(`roles/${roleId}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除角色失败')
        }
        this.$message.success('删除角色成功')
        this.getRoleList()
      },
      onCancel: () => {
        this.$message.info('取消删除')
      },
    })
  }
  // [edit]展示设置权限对话框
  showSetRoleDialog = (record) => async () => {
    // console.log(record)
    // 渲染对话框，并动态保存选中的角色
    this.setState({
      setRoleDialogVisible: true,
      selectedRole: record
    })
    // 两个数组，一个负责接收最后一级权限的ID，一个负责接收父级权限的ID
    let checkedKeysValue = []
    let expandedKeysValue = []
    this.getLeafKeys(record, checkedKeysValue, expandedKeysValue)
    // 父级权限ID列表第一个id不是权限，而是角色id，所以要去除第一个
    expandedKeysValue.shift()
    console.log('checkedKeys', checkedKeysValue)
    console.log('expandedKeys', expandedKeysValue)
    // 渲染最后一级权限、展开父级权限
    this.setState({
      checkedKeysValue: checkedKeysValue,
      expandedKeysValue: expandedKeysValue,
      halfCheckedKeysValue: expandedKeysValue
    })
  }
  // [edit]关闭设置权限对话框
  closeSetRoleDialog = () => {
    this.setState({ setRoleDialogVisible: false })
  }
  // [edit]提交设置权限对话框
  submitSetRoleDialog = async () => {
    // console.log(event)
    const { selectedRole, checkedKeysValue, halfCheckedKeysValue } = this.state
    console.log('selectedRole', selectedRole)
    console.log('checkedKeysValue', checkedKeysValue)
    console.log('halfCheckedKeysValue', halfCheckedKeysValue)
    let ridsArr = [...checkedKeysValue, ...halfCheckedKeysValue]
    console.log(ridsArr)
    let rids = ridsArr.join(',')
    console.log(rids)
    const { data: res } = await this.$axios.post(`/roles/${selectedRole.id}/rights`, {
      rids: rids
    })
    if (res.meta.status !== 200) {
      return this.$message.error('设置权限失败')
    }
    this.$message.success('设置权限成功')
    this.closeSetRoleDialog()
    this.getRoleList()
  }

  onExpand = async (expandedKeysValue) => {
    console.log('expand', expandedKeysValue)
    // await this.setState({
    //   expandedKeysValue: expandedKeysValue,
    //   autoExpandParent: false
    // })
    // console.log(this.state.expandedKeysValue)
    await this.setState({
      expandedKeysValue: expandedKeysValue,
      autoExpandParent: false
    })
  }
  onCheck = async (checkedKeysValue, info) => {
    console.log('onCheck', checkedKeysValue);
    // // setCheckedKeys(checkedKeysValue);
    // await this.setState({ checkedKeysValue: checkedKeysValue })
    // console.log(this.state.checkedKeysValue)
    this.setState({
      checkedKeysValue: checkedKeysValue,
      halfCheckedKeysValue: info.halfCheckedKeys
    })
  }
  onSelect = async (selectedKeysValue, info) => {
    console.log('onSelect', selectedKeysValue);
    // // setSelectedKeys(selectedKeysValue);
    // await this.setState({ selectedKeysValue: selectedKeysValue })
    // console.log(this.state.selectedKeysValue)
    await this.setState({ selectedKeysValue: selectedKeysValue })
  }


  // [动态状态]
  state = {
    // 角色列表table属性
    isLoading: true,
    dataSource: [],
    columns: [
      {
        title: '#',
        key: 'id',
        // render:function(text,record,index){}
        render: (_1, _2, index) => {
          return (
            <span>{index + 1}</span>
          )
        }
      },
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '角色描述',
        dataIndex: 'roleDesc',
        key: 'roleDesc',
      },
      {
        title: '操作',
        key: 'id',
        render: (text, record) => {
          return (
            <>
              <Button
                onClick={this.showEditRoleDialog(record)}
                className="primary opButton"><SearchOutlined /></Button>
              <Button
                onClick={this.showRemoveRoleDialog(record.id)}
                className="danger opButton"><DeleteOutlined /></Button>
              <Button
                onClick={this.showSetRoleDialog(record)}
                className="info opButton"><SettingOutlined /></Button>
            </>
          )
        }
      }
    ],
    // 角色权限tree属性
    treeDate: [],
    expandedKeysValue: [],
    checkedKeysValue: [],
    halfCheckedKeysValue: [],
    selectedKeysValue: [],
    autoExpandParent: true,
    // 对话框Modal属性
    addRoleDialogVisible: false,
    editRoleDialogVisible: false,
    removeRoleDialogVisible: false,
    setRoleDialogVisible: false,
    selectedRole: {
      id: '',
      roleName: '',
      roleDesc: ''
    },
    expand: {
      expandedRowRender: record => {
        // let record = this.state.selectedRole
        // console.log('record', record)
        return (
          <div>
            权限列表:
            {record.children.map((item1) => {
              return (
                <Row className="expandRow" key={item1.id}>
                  {/* 第一列,一级权限 */}
                  <Col span="5" key={item1.id}>
                    <Tag color="green" className="expandTag"
                    >{item1.id}:{item1.authName}&nbsp;
                      <Popconfirm
                        key={item1.id}
                        title="是否确认移除该权限?"
                        onConfirm={this.removeRight(record, item1.id)}
                        onCancel={this.cancelRemoveRight}
                        okText="确定"
                        cancelText="取消">
                        <CloseCircleFilled />
                      </Popconfirm>
                    </Tag>
                    <CaretRightOutlined />
                  </Col>
                  {/* 第二列,二三级权限 */}
                  <Col span="19">
                    {item1.children.map(item2 => {
                      return (
                        <Row className="expandRow" key={item2.id}>
                          {/* 二级权限 */}
                          <Col span="6" key={item2.id}>
                            <Tag color="#E9AD52"
                              className="expandTag">
                              {item2.id}:{item2.authName}&nbsp;
                              <Popconfirm
                                key={item2.id}
                                title="是否确认移除该权限?"
                                onConfirm={this.removeRight(record, item2.id)}
                                onCancel={this.cancelRemoveRight}
                                okText="确定"
                                cancelText="取消"
                              >
                                <CloseCircleFilled />
                              </Popconfirm>
                              {/* <CloseCircleFilled onClick={this.removeRight(record, item2.id)}></CloseCircleFilled> */}
                            </Tag>
                            <CaretRightOutlined />
                          </Col>
                          {/* 三级权限 */}
                          <Col span="18">{item2.children.map((item3) => {
                            return (
                              <Tag color="#409eff" key={item3.id}
                                className="expandTag"
                              >
                                {item3.id}:{item3.authName}&nbsp;
                                <Popconfirm
                                  placement="top"
                                  title="是否确认移除该权限?"
                                  onConfirm={this.removeRight(record, item3.id)}
                                  onCancel={this.cancelRemoveRight}
                                  okText="确定"
                                  cancelText="取消"
                                >
                                  <CloseCircleFilled />
                                </Popconfirm>
                              </Tag>
                            )
                          })}</Col>
                        </Row>
                      )
                    })}
                  </Col>
                </Row>
              )
            })}
          </div>
        )
      }
    }
  }
  // [静态状态]
  addRoleDialogRule = {
    roleName: [
      { required: true, min: 3, max: 15, message: '请输入长度为3~15的角色名称', validateTrigger: 'onBlur' }
    ],
  }
  editRoleDialogRule = {
    roleName: [
      { required: true, min: 3, max: 15, message: '请输入长度为3~15的角色名称', validateTrigger: 'onBlur' }
    ],
  }
  addRoleDialogFormRef = createRef()
  editRoleDialogFormRef = createRef()

  // [lifecycle]
  componentDidMount() {
    if (!isAuth()) {
      this.history.push('/login')
      return
    }
    this.getRoleList()
    this.getRightList()
  }
  // [lifecycle]
  render() {
    return (
      <div className="role_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>权限管理</Breadcrumb.Item>
          <Breadcrumb.Item>角色列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="role_show">
          {/* 添加角色 */}
          <Row>
            <Col>
              <Button
                onClick={this.showAddRoleDialog}
                className="primary">添加角色</Button>
            </Col>
          </Row>
          {/* 角色列表 */}
          <Table
            loading={this.state.isLoading}
            bordered
            rowKey={(record) => {
              // record是每行的数据对象
              return record.id
            }}
            className="role_table"
            pagination={false}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            childrenColumnName="no"
            // 展开行的渲染写在this.state.expand里面
            // expandable={this.state.expand}
            expandable={this.state.expand}
          // onExpand={this.setRole}
          >
          </Table>
        </Card>
        {/* 添加角色对话框 */}
        <Modal
          visible={this.state.addRoleDialogVisible}
          title="添加角色"
          okText="确定"
          cancelText="取消"
          onOk={this.submitAddRoleDialog}
          onCancel={this.closeAddRoleDialog}
        >
          <Form
            ref={this.addRoleDialogFormRef}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="角色名称"
              name="roleName"
              rules={this.addRoleDialogRule.roleName}
              validateTrigger={['onBlur']}
            >
              <Input
                placeholder="请输入角色名称"
              ></Input>
            </Form.Item>
            <Form.Item
              label="角色描述"
              name="roleDesc"
            >
              <Input
                placeholder="请输入角色描述"
              ></Input>
            </Form.Item>
          </Form>
        </Modal>
        {/* 编辑角色对话框 */}
        <Modal
          forceRender={true}
          visible={this.state.editRoleDialogVisible}
          title="添加角色"
          okText="确定"
          cancelText="取消"
          onOk={this.submitEditRoleDialog}
          onCancel={this.closeEditRoleDialog}
        >
          <Form
            ref={this.editRoleDialogFormRef}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="角色ID"
              name="id"
            >
              <Input
                disabled
              ></Input>
            </Form.Item>
            <Form.Item
              label="角色名称"
              name="roleName"
              rules={this.editRoleDialogRule.roleName}
              validateTrigger={['onBlur']}
            >
              <Input
              ></Input>
            </Form.Item>
            <Form.Item
              label="角色描述"
              name="roleDesc"
            >
              <Input
              ></Input>
            </Form.Item>
          </Form>
        </Modal>
        {/* 分配权限对话框 */}
        <Modal
          forceRender
          visible={this.state.setRoleDialogVisible}
          title="分配权限"
          okText="确定"
          cancelText="取消"
          onOk={this.submitSetRoleDialog}
          onCancel={this.closeSetRoleDialog}
        >
          <Tree
            checkable
            fieldNames={{
              title: 'authName',
              key: 'id',
              children: 'children'
            }}
            autoExpandParent={this.state.autoExpandParent}
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeysValue}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeysValue}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeysValue}
            treeData={this.state.treeDate}
          ></Tree>
        </Modal>
      </div>
    );
  }
}

export default RoleList;
