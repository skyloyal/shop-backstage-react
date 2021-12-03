import React, { Component } from 'react';
// antd
import { Card, Table, Tag, Breadcrumb } from 'antd'
// 自定义样式
import './index.scss'

class Index extends Component {
  // [standard] 获取权限列表
  getRightList = async () => {
    const { data: res } = await this.$axios.get('/rights/list')
    if (res.meta.status !== 200) {
      return this.$message.error('获取列表失败')
    }
    console.log(res.data)
    this.setState({
      dataSource: res.data,
      total: res.data.length
    })
  }
  // [standard] 动态状态
  state = {
    dataSource: [],
    columns: [
      {
        title: '#',
        key: 'id',
        render: (text, record, index) => {
          return (
            <div>{index + 1}</div>
          )
        }
      },
      {
        title: '权限ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '权限名称',
        dataIndex: 'authName',
        key: 'authName',
      },
      {
        title: '权限等级',
        key: 'level',
        dataIndex: 'level',
        render: (text) => {
          let tagElement
          if (text === '0') {
            tagElement = (<Tag color="#67C23A">一级权限</Tag>)
          } else if (text === '1') {
            tagElement = (<Tag color="#E9AD52">二级权限</Tag>)
          } else {
            tagElement = (<Tag color="#909399">三级权限</Tag>)
          }
          return tagElement
        }
      }
    ],
    total: 0,

  }
  // [lifecycle] 
  componentDidMount() {
    this.getRightList()
  }
  // [lifecycle]
  render() {
    return (
      <div className="rightList_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>权限管理</Breadcrumb.Item>
          <Breadcrumb.Item>权限列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="rightList_show">
          <Table
            pagination={{
              position: ['bottomLeft ']
            }}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            rowKey={record => record.id}
          >
          </Table>
        </Card>
      </div>
    );
  }
}

export default Index;
