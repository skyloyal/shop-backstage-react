import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'
class Breadnav extends Component {
  render() {
    const { item1, item2 } = this.props
    return (
      <div>
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/home/welcome">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {item1 ? item1.authName : '?'}
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {item2 ? item2.authName : '??'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
}

export default Breadnav;
