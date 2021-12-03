// react
import React, { Component, createRef } from 'react';

// antd
import {
  Breadcrumb, Card, Table,
  Alert, Cascader, Tabs,
  Row, Col, Button, Tag,
  Input, Modal, Form
} from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

// 自定义scss
import './index.scss'
// antd子组件
const { TabPane } = Tabs;

class Index extends Component {

  // history
  history = this.props.history
  // ref
  // saveInputRef = createRef()
  editParamDialogRef = createRef()

  // 动态数据渲染
  state = {
    // 商品分类列表
    cateList: [],
    selectedCateIdArr: [],
    manyTableData: [],
    manyTableColumns: [
      {
        title: '#',
        dataIndex: 'attr_id',
        render: (_, _2, index) => {
          return index + 1
        },
      },
      {
        title: '动态属性名称',
        key: 'attr_name',
        dataIndex: 'attr_name',
      },
      {
        title: '操作',
        key: 'attr_id',
        render: (text, record, index) => {
          return (
            <>
              <Button
                onClick={this.showEditParamDialog(record)}
                className="primary actionBtn">编辑</Button>
              <Button
                onClick={this.showRemoveParamDialog(record)}
                className="danger actionBtn">删除</Button>
            </>
          )
        }
      }
    ],
    manyTableExpand: {
      expandedRowRender: record => {
        return (
          <div key={record.attr_id}>
            {record.attr_valsArr.map((item, index) => {
              return (
                <Tag
                  className="attr_valsTag"
                  color="#108ee9" key={index}>
                  {item} &nbsp;<CloseCircleOutlined onClick={this.removeTag(record, index)} />
                </Tag>
              )
            })}
            {/* react条件渲染不能在花括号内使用if else */}
            {/* 可用三目运算符或者 "[条件] && (jsx)"代替 */}
            {record.inputVisible ? (
              <Input
                ref={record.inputRef}
                type="text"
                size="small"
                style={{ width: 100, height: 30 }}
                onChange={e => this.handleInputChange(e.target.value, record)}
                onPressEnter={this.submitInputTag(record)}
                onBlur={this.submitInputTag(record)}
              ></Input>
            ) :
              <Tag
                visible={!record.inputVisible}
                onClick={this.showInputTag(record)}
                className="newTag">
                + New Tag
              </Tag>
            }
          </div>
        )
      }
    },
    // 静态属性列表
    onlyTableData: [],
    onlyTableColumns: [
      {
        title: '#',
        dataIndex: 'attr_id',
        render: (_, _2, index) => {
          return index + 1
        },
      },
      {
        title: '动态属性名称',
        key: 'attr_name',
        dataIndex: 'attr_name',
      },
      {
        title: '操作',
        key: 'attr_id',
        render: (text, record, index) => {
          return (
            <>
              <Button
                onClick={this.showEditParamDialog(record)}
                className="primary actionBtn">编辑</Button>
              <Button
                onClick={this.showRemoveParamDialog(record)}
                className="danger actionBtn">删除</Button>
            </>
          )
        }
      }
    ],
    onlyTableExpand: {
      expandedRowRender: record => {
        return (
          <div key={record.attr_id}>
            {record.attr_valsArr.map((item, index) => {
              return (
                <Tag
                  className="attr_valsTag"
                  color="#108ee9" key={index}>
                  {item} &nbsp;<CloseCircleOutlined onClick={this.removeTag(record, index)} />
                </Tag>
              )
            })}
            {/* react条件渲染不能在花括号内使用if else */}
            {/* 可用三目运算符或者 "[条件] && (jsx)"代替 */}
            {record.inputVisible ? (
              <Input
                ref={record.inputRef}
                type="text"
                size="small"
                style={{ width: 100 }}
                onChange={e => this.handleInputChange(e.target.value, record)}
                onPressEnter={this.submitInputTag(record)}
                onBlur={this.submitInputTag(record)}
              ></Input>
            ) :
              <Tag
                visible={!record.inputVisible}
                onClick={this.showInputTag(record)}
                className="newTag">
                + New Tag
              </Tag>
            }
          </div>
        )
      }
    },
    activeKey: "0",

    editParamDialogVisible: false,
    editParamObject: {},
    removeParamDialogVisible: false,
    removeParamObject: {},
  }
  // [methods] 获取分类列表
  getCateList = async () => {
    console.log('开始获取分类列表')
    const { data: res } = await this.$axios.get('/categories')
    if (res.meta.status !== 200) {
      return this.$message.error('获取分类列表失败')
    }
    console.log(res.data)
    this.setState({ cateList: res.data })
  }
  // [methods] 选择分类后,获取该分类的动态属性和静态属性
  handleCateChange = async (value) => {
    let len = value.length
    // 未选择分类
    if (len === 0) {
      this.setState({ selectedCateIdArr: [], manyTableData: [] })
      // 没有选择三级分类
    } else if (len < 3) {
      this.setState({ selectedCateIdArr: [], manyTableData: [] })
      this.$message.warning('请选择三级分类')
      // 正确选择三级分类
    } else {
      this.setState({ selectedCateIdArr: value })
      let cateId = value[len - 1]
      // 获取商品动态属性保存至state.manyTableData
      this.getManyTableData(cateId)
      // 获取商品静态属性保存至state.onlyTableData
      this.getOnlyTableData(cateId)
    }
  }
  // [methods]获取商品动态属性保存至state.manyTableData
  getManyTableData = async (cateId) => {
    // 获取动态属性
    const { data: res } = await this.$axios.get(`/categories/${cateId}/attributes`, {
      params: {
        sel: 'many'
      }
    })
    // 错误提示
    if (res.meta.status !== 200) {
      return this.$message.error('获取动态属性失败')
    }
    // 动态属性预处理
    let manyTableData = res.data
    if (manyTableData.length > 0) {
      manyTableData.forEach(item => {
        item.attr_valsArr = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
        item.inputRef = createRef()
      })
    }
    console.log(manyTableData)
    this.setState({ manyTableData })
  }
  // [methods]获取商品静态属性保存至state.onlyTableData
  getOnlyTableData = async (cateId) => {
    // 获取静态属性
    const { data: res2 } = await this.$axios.get(`/categories/${cateId}/attributes`, {
      params: {
        sel: 'only'
      }
    })
    // 错误提示
    if (res2.meta.status !== 200) {
      return this.$message.error('获取静态属性失败')
    }
    let onlyTableData = res2.data
    if (onlyTableData.length > 0) {
      onlyTableData.forEach(item => {
        item.attr_valsArr = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
        item.inputRef = createRef()
      })
    }
    // 保存动态属性和静态属性到state
    console.log(onlyTableData)
    this.setState({ onlyTableData })
  }
  // [methods]切换页签
  handleActiveKeyChange = (key) => {
    this.setState({ activeKey: key })
  }
  // [methods]展示商品标签输入框
  showInputTag = (record) => () => {
    record.inputVisible = true
    this.setState({}, () => {
      record.inputRef.current.focus({ cursor: 'start' })
    })
  }
  // [methods]输入商品标签tag
  handleInputChange = (value, record) => {
    record.inputValue = value
  }
  // [methods]添加商品标签tag
  submitInputTag = (record) => () => {
    console.log(record)
    let inputContent = record.inputValue
    // 判断是否有输入内容
    if (inputContent.trim().length === 0) {
      record.inputValue = ''
      record.inputVisible = false
      this.setState({})
      return
    }
    // 判断新标签与旧标签是否重复
    if (record.attr_valsArr.indexOf(inputContent) > 0) {
      record.inputValue = ''
      record.inputVisible = false
      this.$message.warning('请不要添加重复标签')
      this.setState({})
      return
    }
    // 往tag数组添加新标签
    record.attr_valsArr.push(record.inputValue)
    // 清空输入框
    record.inputValue = ''
    // 提交后端
    this.saveAttrVals(record)
    // 强制重新渲染
    record.inputVisible = false
    this.setState({})
  }
  // [methods]发请求保存商品属性
  saveAttrVals = async (record) => {
    console.log('saveAttrVals', record)
    const { data: res } = await this.$axios.put(`categories/${record.cat_id}/attributes/${record.attr_id}`, {
      attr_name: record.attr_name,
      attr_sel: record.attr_sel,
      attr_vals: record.attr_valsArr.join(' ')
    })
    if (res.meta.status !== 200) {
      record.attr_valsArr.pop()
      return this.$message.error('修改参数项失败')
    }
    this.$message.success('修改参数项成功')
  }
  // [methods]移除商品标签tag
  removeTag = (record, index) => () => {
    record.attr_valsArr.splice(index, 1)
    this.saveAttrVals(record)
    this.setState({})
  }
  // [methods]展示编辑属性的对话框
  showEditParamDialog = (record) => () => {
    console.log(record)
    this.setState({
      editParamDialogVisible: true,
      editParamObject: record
    }, () => {
      this.editParamDialogRef.current.setFieldsValue(record)
      console.log(this.editParamDialogRef.current)
    })

  }
  // [methods]提交编辑属性的对话框
  submitEditParamDialog = async () => {
    const editParamDialogObject = this.editParamDialogRef.current.getFieldsValue()
    // console.log(editParamObj)
    const { attr_name } = editParamDialogObject
    const { cat_id, attr_id, attr_sel, attr_vals } = this.state.editParamObject
    const { data: res } = await this.$axios.put(`/categories/${cat_id}/attributes/${attr_id}`, {
      attr_name,
      attr_sel,
      attr_vals
    })
    if (res.meta.status !== 200) {
      return this.$message.error('提交编辑属性失败')
    }
    this.$message.success('提交编辑属性成功')
    if (attr_sel === "many") {
      this.getManyTableData(cat_id)
    } else {
      this.getOnlyTableData(cat_id)
    }
    this.closeEditParamDialog()
  }
  // [methods]关闭编辑属性的对话框
  closeEditParamDialog = () => {
    this.setState({
      editParamDialogVisible: false,
      editParamObject: {}
    }, () => {
      // console.log(this.editParamDialogRef.current)
      this.editParamDialogRef.current.resetFields()
    })
  }
  // [methods]展示编辑属性的对话框
  showRemoveParamDialog = (record) => () => {
    const { cat_id, attr_id, attr_sel } = record
    Modal.confirm({
      title: '删除商品属性',
      content: '此操作将永久删除该商品属性，是否继续?',
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        const { data: res } = await this.$axios.delete(`/categories/${cat_id}/attributes/${attr_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品属性失败')
        }
        this.$message.success('删除商品属性成功')
        if (attr_sel === 'many') {
          this.getManyTableData(cat_id)
        } else {
          this.getOnlyTableData(cat_id)
        }
      },
      onCancel: () => {
        this.$message.info('已取消删除商品属性操作')
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
      <div className="goodParam_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>分类参数</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="goodParam_show">
          <Alert className="goodParam_alert"
            type="warning" message="注意：只允许为第三级分类设置相关参数！" showIcon
          ></Alert>
          <Row>
            <Col>
              <span>选择商品分类：</span>
              <Cascader
                value={this.state.selectedCateIdArr}
                className="goodParam_cascader"
                placeholder="请选择商品分类"
                allowClear
                options={this.state.cateList}
                onChange={this.handleCateChange}
                fieldNames={{ label: 'cat_name', value: 'cat_id', children: 'children' }}
              >
              </Cascader>
            </Col>
          </Row>

          <Tabs
            activeKey={this.state.activeKey}
            onChange={this.handleActiveKeyChange}
            tabPosition="top"
          >
            <TabPane
              tab="动态属性"
              key="0"
            >
              <Table
                expandable={this.state.manyTableExpand}
                rowKey={record => record.attr_id}
                dataSource={this.state.manyTableData}
                columns={this.state.manyTableColumns}
              >
              </Table>
            </TabPane>
            <TabPane
              tab="静态属性"
              key="1"
            >
              <Table
                expandable={this.state.onlyTableExpand}
                rowKey={record => record.attr_id}
                dataSource={this.state.onlyTableData}
                columns={this.state.onlyTableColumns}
              ></Table>
            </TabPane>
          </Tabs>
        </Card>
        <Modal
          visible={this.state.editParamDialogVisible}
          title="编辑属性"
          okText="确定"
          cancelText="取消"
          onOk={this.submitEditParamDialog}
          onCancel={this.closeEditParamDialog}
        >
          <Form
            ref={this.editParamDialogRef}
            labelCol={{ span: 4 }}>
            <Form.Item name="cat_id" label="分类id">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item name="attr_id" label="属性id">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item name="attr_name" label="属性名称">
              <Input></Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Index;
