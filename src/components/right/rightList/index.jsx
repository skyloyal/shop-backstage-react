import React, { Component } from 'react';
import Breadnav from '../../template/BreadNav'
class Index extends Component {
  render() {

    const params = this.props.location.state || {}
    const item1 = params.item1 || ''
    const item2 = params.item2 || ''
    return (
      <div>
        {/* 面包屑导航区 */}
        <Breadnav item1={item1} item2={item2}></Breadnav>
        {/* 卡片视图区 */}
        {/* 添加角色 */}
        {/* 角色列表 */}

        {/* 分配权限对话框 */}

      </div>
    );
  }
}

export default Index;
