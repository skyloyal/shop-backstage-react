import React, { Component } from 'react';
import dayjs from 'dayjs';
// antd
import {
  Card, Row, Col, Button,
  Table, Input, Pagination,
  Modal, Breadcrumb
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
// 自定义scss
import './index.scss'

class Index extends Component {

  // [standard]获取商品列表
  getGoodList = async () => {
    const { data: res } = await this.$axios.get('/goods', {
      params: this.state.queryInfo
    })
    if (res.meta.status !== 200) {
      return this.$message.error('获取商品列表失败')
    }
    console.log(res.data)
    const { total, goods: dataSource } = res.data
    this.setState({
      total: total,
      dataSource: dataSource
    })
  }
  // [get]按名称获取商品列表
  searchGoodByName = async (value) => {
    const newQueryInfo = { ...this.state.queryInfo, query: value }
    await this.setState({ queryInfo: newQueryInfo })
    this.getGoodList()
  }
  // [standard]
  pageChange = async (newPage, newPageSize) => {
    if (newPage === 0) {
      newPage = 1
    }
    console.log(newPage, newPageSize)
    const newQueryInfo = { ...this.state.queryInfo, pagenum: newPage, pagesize: newPageSize }
    await this.setState({ queryInfo: newQueryInfo })
    this.getGoodList()
  }
  // [add]
  showAddGoodPage = () => {
    this.history.push('/home/addGood')
  }
  // [edit]
  showEditGoodPage = (record) => () => {
    console.log(record)
    this.history.push(`/home/editGood/?id=${record.goods_id}`)
  }
  // [delete]
  showRemoveGoodDialog = (goods_id) => () => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '该操作将会永久移除商品条目是否继续?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        // console.log('OK');
        const { data: res } = await this.$axios.delete(`/goods/${goods_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品失败')
        } else {
          this.$message.success('已删除商品')
          this.getGoodList()
        }
      },
      onCancel: () => {
        // console.log('Cancel');
        this.$message.info('已取消删除操作')
      },
    })
  }
  // [standard]动态属性
  state = {
    dataSource: [],
    columns: [
      {
        title: 'id',
        dataIndex: 'goods_id',
        key: 'goods_id'
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        width: '300px'
      },
      {
        title: '商品单价（元）',
        dataIndex: 'goods_price',
        key: 'goods_price'
      },
      {
        title: '商品重量（kg）',
        dataIndex: 'goods_weight',
        key: 'goods_weight'
      },
      {
        title: '创建时间',
        dataIndex: 'add_time',
        key: 'add_time',
        render: (text, record, index) => {
          return (dayjs(record.add_time).format('YYYY-MM-DD HH:mm:ss'))
        }
      },
      {
        title: '操作',
        key: 'goods_id',
        render: (_, record, __) => {
          return (
            <>
              <Button
                onClick={this.showEditGoodPage(record)}
                className="primary actionBtn"
                size="small">编辑</Button>
              <Button
                onClick={this.showRemoveGoodDialog(record.goods_id)}
                className="danger actionBtn"
                size="small">删除</Button>
            </>
          )
        }
      }
    ],
    total: 0,
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 5
    },
  }
  // 静态属性
  history = this.props.history
  // [lifecycle]
  componentDidMount() {
    this.getGoodList()
  }
  // [lifecycle]
  render() {
    return (
      <div className="goodList_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="goodList_show">
          <Row gutter="10">
            <Col span={8}>
              <Input.Search
                placeholder="请输入商品名称"
                onSearch={this.searchGoodByName}
                allowClear
              >
              </Input.Search>
            </Col>
            <Col>
              <Button
                onClick={this.showAddGoodPage}
                className="primary">添加商品</Button>
            </Col>
          </Row>
          <Table
            className="goodList_table"
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            rowKey={record => record.goods_id}
            pagination={false}
          >
          </Table>
          <Pagination
            total={this.state.total}
            defaultCurrent={this.state.queryInfo.pagenum}
            defaultPageSize={this.state.queryInfo.pagesize}
            showSizeChanger
            showQuickJumper
            showTotal={total => `总计${total}条数据`}
            onChange={this.pageChange}
            pageSizeOptions={[5, 10, 20, 50]}
          >
          </Pagination>
          {/* <Modal
            visible={this.state.editGoodDialogVisible}
            title="编辑商品"
            okText="确定"
            cancelText="取消"
            onOk={this.submitEditGoodDialog}
            onCancel={this.closeEditGoodDialog}
          >

          </Modal> */}
        </Card>
      </div>
    );
  }
}

export default Index;
