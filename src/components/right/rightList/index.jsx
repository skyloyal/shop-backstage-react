import React, { Component } from 'react';
// antd
import { Card, Table, Tag } from 'antd'
// 自定义样式
import './index.scss'
// 自定义组件
import Breadnav from '../../template/BreadNav'

class Index extends Component {
  // [standard] 获取权限列表
  getRightList = async () => {
    const { data: res } = await this.$axios.get('/rights/list')
    if (res.meta.status !== 200) {
      return this.$message.error('获取列表失败')
    }
    console.log(res.data)
    this.setState({ dataSource: res.data })
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
    ]
  }
  // [lifecycle] 
  componentDidMount() {
    this.getRightList()
  }
  // [lifecycle]
  render() {
    const params = this.props.location.state || {}
    const item1 = params.item1 || ''
    const item2 = params.item2 || ''
    return (
      <div className="rightList_container">
        {/* 面包屑导航区 */}
        <Breadnav className="rightList_top"
          item1={item1} item2={item2}>
        </Breadnav>
        {/* 卡片视图区 */}
        <Card className="rightList_show">
          <Table
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            rowKey={record => record.id}
          >
          </Table>
        </Card>
        {/* 添加角色 */}
        {/* 角色列表 */}

        {/* 分配权限对话框 */}

      </div>
    );
  }
}

export default Index;
