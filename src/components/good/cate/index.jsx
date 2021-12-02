// react
import React, { Component, createRef } from 'react';

// antd
import {
  Button, Modal, Table, Row,
  Col, Tag, Pagination, Form,
  Input, Card, Breadcrumb,
  Cascader
} from 'antd'

// 自定义scss
import './index.scss'
class Index extends Component {

  // history
  history = this.props.history
  // ref
  addCateDialogRef = createRef()
  editCateDialogRef = createRef()
  // 数据渲染
  state = {
    // 商品分类列表
    cateList: [],
    // 父级分类列表
    parentCateList: [],
    // 级联选择器选中的父级分类列表
    selectedCateIdArr: [],
    // 商品分类table的展示列
    columns: [
      {
        title: '商品分类名称',
        key: 'cat_name',
        dataIndex: 'cat_name'
      },
      {
        title: '分类ID',
        key: 'cat_id',
        dataIndex: 'cat_id'
      },
      {
        title: '分类等级',
        key: 'cat_level',
        dataIndex: 'cat_level',
        render: (text) => {
          if (text === 0) {
            return (<Tag color="#87d068">一级</Tag>)
          } else if (text === 1) {
            return (<Tag color="#e9ad52">二级</Tag>)
          } else {
            return (<Tag color="#909399">三级</Tag>)
          }
        }
      },
      {
        title: '操作',
        render: (_, record) => {
          return (
            <>
              <Button
                onClick={this.showEditCateDialog(record)}
                className="primary actionBtn" size="small">编辑</Button>
              <Button
                onClick={this.showRemoveCateDialog(record.cat_id)}
                className="danger actionBtn" size="small">删除</Button>
            </>
          )
        }
      }
    ],
    // 请求对象
    queryInfo: {
      pagenum: 1,
      pagesize: 5
    },
    // 商品分类的总数量
    total: 0,
    addCateDialogVisible: false,
    editCateDialogVisible: false,
  }
  // [methods]获取商品分类列表
  getCateList = async () => {
    const { data: res } = await this.$axios.get('/categories', {
      params: this.state.queryInfo
    })
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取商品列表失败')
    }
    this.setState({
      cateList: res.data.result,
      total: res.data.total
    })
  }
  // [methods]页码，每页页数改变则请求新的数据
  pageChange = (pagenum, pagesize) => {
    console.log('pagenum', pagenum)
    console.log('pagesize', pagesize)
    if (pagenum === 0) {
      pagenum = 1
    }
    let queryInfo = { pagenum, pagesize }
    this.setState({ queryInfo }, () => {
      this.getCateList()
    })
  }

  // [methods]展示添加商品分类对话框
  showAddCateDialog = () => {
    this.getParentCateList()
    this.setState({
      addCateDialogVisible: true
    }, () => {
      console.log(this.state.parentCateList)
    })
  }
  // [methods]获取父级商品分类列表
  getParentCateList = async () => {
    const { data: res } = await this.$axios.get('/categories', {
      params: { type: 2 }
    })
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取父级商品列表失败')
    }
    this.setState({
      parentCateList: res.data
    })
  }

  // [methods]添加商品选择父级分类
  handleParentCateChange = (value) => {
    this.setState({ selectedCateIdArr: value })
  }
  // [methods]提交添加商品分类对话框
  submitAddCateDialog = async () => {
    let { cat_name } = this.addCateDialogRef.current.getFieldsValue()
    cat_name = cat_name.trim()
    console.log(cat_name)
    if (!cat_name) {
      return this.$message.warning('请输入正确的商品分类名称')
    }
    const selectedCateIdArr = this.state.selectedCateIdArr
    const len = selectedCateIdArr.length
    const cat_pid = (len > 0) ? selectedCateIdArr[len - 1] : 0
    console.log(this.addCateDialogRef.current)
    const cat_level = len
    console.log('cat_pid:', cat_pid)
    console.log('cat_name:', cat_name)
    console.log('cat_level:', cat_level)

    const { data: res } = await this.$axios.post('categories', {
      cat_pid,
      cat_name,
      cat_level
    })
    if (res.meta.status !== 201) {
      return this.$message.error('添加商品分类失败')
    }
    this.$message.success('添加商品分类成功')
    this.addCateDialogRef.current.resetFields()
    this.closeAddCateDialog()
    this.getCateList()
  }

  // [methods]关闭添加商品分类对话框
  closeAddCateDialog = () => {
    this.setState({
      addCateDialogVisible: false,
      selectedCateIdArr: [],
      parentCateList: []
    })
  }
  // [methods]展示编辑商品分类对话框
  showEditCateDialog = (record) => () => {
    console.log(record)

    this.setState({ editCateDialogVisible: true }, () => {
      console.log(this.editCateDialogRef.current)
      this.editCateDialogRef.current.setFieldsValue(record)
    })
  }
  submitEditCateDialog = async () => {
    let { cat_id, cat_name } = this.editCateDialogRef.current.getFieldsValue()
    cat_name = cat_name.trim()
    if (!cat_name) {
      return this.$message.warning('请输入正确的商品分类名称')
    }
    const { data: res } = await this.$axios.put(`/categories/${cat_id}`, {
      cat_name
    })
    if (res.meta.status !== 200) {
      return this.$message.error('编辑商品分类失败')
    }
    this.$message.success('编辑商品分类成功')
    this.closeEditCateDialog()
    this.getCateList()
  }
  closeEditCateDialog = () => {
    this.setState({
      editCateDialogVisible: false,
    })
    this.editCateDialogRef.current.resetFields()
  }
  // [methods]展示删除商品分类对话框
  showRemoveCateDialog = (cateId) => () => {
    Modal.confirm({
      title: "删除商品分类",
      content: '该操作将永久删除该数据，是否继续?',
      okText: "确定",
      cancelText: "取消",
      onCancel: () => {
        this.$message.info('已取消删除商品分类操作')
      },
      onOk: async () => {
        const { data: res } = await this.$axios.delete(`/categories/${cateId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品分类失败')
        }
        this.$message.success('删除商品分类成功')
        this.getCateList()
      }
    })
  }

  // [lifecycle]
  componentDidMount() {
    this.getCateList()
  }

  // [lifecycle]
  render() {
    return (
      <div
        className="goodCate_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>分类参数</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="goodCate_show">
          {/* 操作区 */}
          <Row>
            <Col>
              <Button
                onClick={this.showAddCateDialog}
                className="primary">添加分类</Button>
            </Col>
          </Row>
          {/* 展示表格*/}
          <Table
            rowKey={record => record.cat_id}
            className="goodCate_table"
            dataSource={this.state.cateList}
            columns={this.state.columns}
            pagination={false}
          >
          </Table>
          {/* 分页栏 */}
          <Pagination
            total={this.state.total}
            showSizeChanger
            showQuickJumper
            showTotal={total => `总计${total}条数据`}
            pageSize={this.state.queryInfo.pagesize}
            pageSizeOptions={[5, 10, 20, 50]}
            onChange={this.pageChange}
          ></Pagination>
        </Card>
        {/* 添加商品分类对话框 */}
        <Modal
          title="添加商品分类"
          visible={this.state.addCateDialogVisible}
          okText="确认"
          cancelText="取消"
          onCancel={this.closeAddCateDialog}
          onOk={this.submitAddCateDialog}
        >
          <Form
            labelCol={{ span: 4 }}
            ref={this.addCateDialogRef}>
            <Form.Item
              label="父级分类">
              <Cascader
                value={this.state.selectedCateIdArr}
                onChange={this.handleParentCateChange}
                changeOnSelect
                expandTrigger="hover"
                options={this.state.parentCateList}
                fieldNames={{ value: 'cat_id', label: 'cat_name', children: 'children' }}
                allowClear
                placeholder="请选择父级分类"
              ></Cascader>
              <span style={{ fontSize: 10, color: 'red' }}>如不选择分类则默认为一级分类</span>
            </Form.Item>
            <Form.Item label="分类名称" name="cat_name">
              <Input></Input>
            </Form.Item>
          </Form>
        </Modal>
        {/* 编辑商品分类 */}
        <Modal
          title="编辑商品分类"
          visible={this.state.editCateDialogVisible}
          okText="确认"
          cancelText="取消"
          onCancel={this.closeEditCateDialog}
          onOk={this.submitEditCateDialog}
        >
          <Form
            labelCol={{ span: 4 }}
            ref={this.editCateDialogRef}>
            <Form.Item
              label="父级分类" name="cat_id">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="分类名称" name="cat_name">
              <Input placeholder="请输入商品分类名称"></Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Index;
