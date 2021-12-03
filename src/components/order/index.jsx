// react
import React, { Component, createRef } from 'react';
// antd
import {
  Breadcrumb, Button, Table,
  Tag, Pagination, Row, Col,
  Card, Form, Input, Modal,
  Cascader, Radio, Switch,
  InputNumber, Timeline
} from 'antd'
import { CheckCircleTwoTone, CloseCircleTwoTone, EditOutlined, EnvironmentOutlined } from '@ant-design/icons'
// dayjs
import dayjs from 'dayjs'
// 城市数据
import cityData from './cityData'
// 自定义scss
import './index.scss'

class Index extends Component {

  // ref
  editOrderDialogRef = createRef()

  state = {
    // 订单列表
    orderList: [],
    // 表格展示列
    columns: [
      {
        title: '#',
        render: (_, _2, index) => {
          return (index + 1)
        }
      },
      {
        title: '订单号',
        key: 'order_number',
        dataIndex: 'order_number'
      },
      {
        title: '订单价格',
        key: 'order_price',
        dataIndex: 'order_price'
      },
      {
        title: '是否已付款',
        key: 'pay_status',
        dataIndex: 'pay_status',
        render: (text) => {
          if (text === '0') {
            return (
              <Tag color="#f50">未付款</Tag>
            )
          } else {
            return (
              <Tag color="#87d068">已付款</Tag>
            )
          }
        }
      },
      {
        title: '是否已发货',
        key: 'is_send',
        dataIndex: 'is_send',
        render: (text) => {
          if (text === '是') {
            return <CheckCircleTwoTone twoToneColor="#52c41a" />
          } else {
            return <CloseCircleTwoTone twoToneColor="#F56C6C" />
          }
        }
      },
      {
        title: '下单时间',
        key: 'create_time',
        dataIndex: 'create_time',
        render: (text) => {
          return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '操作',
        key: 'order_id',
        render: (_, record) => {
          return (
            <>
              <Button
                onClick={this.showEditOrderDialog(record)}
                className="primary actionBtn"
                icon={<EditOutlined />}></Button>
              <Button
                onClick={this.showProgressDialog(record)}
                className="success actionBtn"
                icon={<EnvironmentOutlined />}></Button>
            </>
          )
        }
      },
    ],
    // 请求参数
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 5,
    },
    // 订单数据总条数
    total: 0,
    editOrderDialogVisible: false,
    progressDialogVisible: false,
    cityData: cityData,
    progressForm: [

      { content: '商品已经下单', timestamp: '2021-10-21 11:38' },
      { content: '包裹正在等待揽收', timestamp: '2021-10-21 13:53' },
      { content: '辽宁省盘锦市大硅县公司 已发出，下一站 盘锦转运中心', timestamp: '2021-10-21 15:13' },
      { content: '盘锦转运中心公司', timestamp: '2021-10-22 01:26' },
      { content: '盘锦转运中心公司 已发出，下一站 广州转运中心', timestamp: '2021-10-22 01:29' },
      { content: '广州转运中心公司 已收入', timestamp: '2021-10-23 21:02' },
      { content: '广州转运中心公司 已发出，下一站 佛山转运中心', timestamp: '2021-10-23 21:04' },
      { content: '佛山转运中心公司 已收入', timestamp: '2021-10-24 01:59' },
    ],
  }
  // [methods]获取订单列表
  getOrderList = async () => {
    console.log(this.state.queryInfo)
    const { data: res } = await this.$axios.get('/orders', {
      params: this.state.queryInfo
    })
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$axios.error('获取订单列表失败')
    }
    this.setState({
      total: res.data.total,
      orderList: res.data.goods
    })

  }
  handleQueryChange = (e) => {
    const query = e.target.value
    console.log(query)
    let queryInfo = this.state.queryInfo
    this.setState({ queryInfo: { ...queryInfo, query: query } })
  }
  handlePageChange = (newPagenum, newPageSize) => {
    console.log('newPagenum:', newPagenum)
    console.log('newPageSize:', newPageSize)
    if (newPagenum === 0) {
      newPagenum = 1
    }
    let queryInfo = this.state.queryInfo
    this.setState({ queryInfo: { ...queryInfo, pagenum: newPagenum, pagesize: newPageSize } }, () => {
      this.getOrderList()
    })
  }
  // [methods]展示编辑订单对话框
  showEditOrderDialog = (record) => () => {
    this.setState({
      editOrderDialogVisible: true
    }, () => {
      const current = this.editOrderDialogRef.current
      console.log(current)
      current.setFieldsValue(record)
    })
  }
  // [methods]提交编辑订单对话框
  submitEditOrderDialog = async () => {
    const current = this.editOrderDialogRef.current
    console.log(current)
    const editOrderObj = current.getFieldsValue()
    console.log(editOrderObj)
    if (editOrderObj.address1 && editOrderObj.address2) {
      if (editOrderObj.address1.length > 0 && editOrderObj.address2.trim().length > 0) {
        editOrderObj.address = editOrderObj.address1.join('') + editOrderObj.address2
        console.log(editOrderObj)
      }
    }

    const { data: res } = await this.$axios.put(`/orders/${editOrderObj.order_id}`, editOrderObj)
    if (res.meta.status !== 200) {
      return this.$message.error('编辑订单失败')
    }
    this.$message.success('编辑订单成功')
    this.closeEditOrderDialog()
    this.getOrderList()
  }
  // [methods]关闭编辑订单对话框
  closeEditOrderDialog = () => {
    this.editOrderDialogRef.current.resetFields()
    this.setState({
      editOrderDialogVisible: false
    })
  }
  // [methods]编辑订单的地址，城市
  handleCityChange = (value) => {
    this.setState({
      selectedCityArr: value
    })
  }
  // [methods]展示物流信息对话框
  showProgressDialog = (record) => async () => {
    // const { data: res } = await this.$axios.get(`/kuaidi/1106975712662`)
    // console.log(res)
    this.setState({ progressDialogVisible: true })
  }
  closeProgressDialog = () => {
    this.setState({ progressDialogVisible: false })
  }
  // [lifecycle]
  componentDidMount() {
    this.getOrderList()
  }
  // [lifecycle]
  render() {
    return (
      <div className="order_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>订单管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="order_show">
          <Row>
            <Col>
              <Input.Search placeholder="请输入内容"
                allowClear
                onSearch={this.getOrderList}
                onChange={this.handleQueryChange}>
              </Input.Search>
            </Col>
          </Row>
          {/* 订单表格 */}
          <Table className="order_table"
            dataSource={this.state.orderList}
            columns={this.state.columns}
            rowKey={record => record.order_id}
            pagination={false}
          ></Table>
          {/* 分页 */}
          <Pagination className="order_pagination"
            pageSize={this.state.queryInfo.pagesize}
            pageSizeOptions={['5', '10', '20', '50']}
            onChange={this.handlePageChange}
            showQuickJumper
            showSizeChanger
            showTotal={total => `总计${total}条数据`}
            total={this.state.total}
          >
          </Pagination>
        </Card>
        {/* 编辑订单信息对话框 */}
        <Modal
          title="修改地址"
          visible={this.state.editOrderDialogVisible}
          okText="确定"
          cancelText="取消"
          onOk={this.submitEditOrderDialog}
          onCancel={this.closeEditOrderDialog}
        >
          <Form
            labelCol={{ span: 4 }}
            ref={this.editOrderDialogRef}>
            <Form.Item
              label="订单id"
              name="order_id">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item
              label="订单号"
              name="order_number"
            >
              <Input disabled></Input>
            </Form.Item>
            <Form.Item
              name="address1"
              label="省市区/县">
              <Cascader
                allowClear
                onChange={this.handleCityChange}
                options={this.state.cityData}
              >
              </Cascader>
            </Form.Item>
            <Form.Item
              name="address2"
              label="详细地址">
              <Input placeholder="请输入地址"></Input>
            </Form.Item>
            <Form.Item
              label="订单价格"
              name="order_price"
            >
              <InputNumber style={{ width: 300 }}></InputNumber>
            </Form.Item>
            <Form.Item
              name="pay_status"
              label="是否已付款">
              <Radio.Group>
                <Radio value="0">未付款</Radio>
                <Radio value="1">已付款</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="order_pay"
              label="支付方式">
              <Radio.Group>
                <Radio value="0">未确定</Radio>
                <Radio value="1">支付宝</Radio>
                <Radio value="2">微信</Radio>
                <Radio value="3">银行卡</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="是否发货"
              name="is_send"
            >
              <Radio.Group>
                <Radio value="否">未发货</Radio>
                <Radio value="是">已发货</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="物流信息"
          footer={null}
          onCancel={this.closeProgressDialog}
          visible={this.state.progressDialogVisible}>
          {
            (
              <Timeline mode={"left"} reverse={true}>
                {this.state.progressForm.map((item, index) => {
                  let len = this.state.progressForm.length
                  if (index < len - 1) {
                    return (
                      <Timeline.Item
                        color="gray"
                        className="timeLineItem"
                        key={item.timestamp}
                        label={item.timestamp}>
                        {item.content}
                      </Timeline.Item>
                    )
                  } else {
                    return (
                      <Timeline.Item
                        color="orange"
                        className="timeLineItem"
                        key={item.timestamp}
                        label={item.timestamp}>
                        {item.content}
                      </Timeline.Item>
                    )
                  }

                })}
              </Timeline>
            )
          }
        </Modal>
      </div>
    );
  }
}

export default Index;
