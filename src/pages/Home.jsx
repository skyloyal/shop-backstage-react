// react
import React from "react";
import { Link } from "react-router-dom";
// antd
import { Layout, Button, Menu } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  KeyOutlined,
  PaperClipOutlined,
  AreaChartOutlined
} from '@ant-design/icons'
// 外部资源,css,图片等
import './Home.scss'
import logo from '../assets/img/heima.png'
// 鉴权类
// import Auth from '../template/Auth'
import isAuth from "../template/Auth";
const { Header, Sider, Content } = Layout;

export default class Home extends React.Component {

  // 导航对象
  history = this.props.history
  // 状态对象
  state = {
    menus: [],
    isCollapse: false,
    iconsObjs: {
      '125': <UserOutlined />,
      '103': <KeyOutlined />,
      '101': <ShoppingOutlined />,
      '102': <PaperClipOutlined />,
      '145': <AreaChartOutlined />
    },
  }
  // [methods]退出
  logOut = () => {
    window.sessionStorage.clear()
    this.$message.info('已退出账户')
    this.history.push('/login')
  }
  // [methods]获取菜单列表
  getMenuList = async () => {
    console.log('开始获取菜单列表')
    const { data: res } = await this.$axios.get('/menus')
    if (res.meta.status !== 200) {
      return this.$message.error('获取菜单失败')
    }
    // console.log(res.data)
    this.setState({ menus: res.data })
    console.log(this.state.menus)
  }

  // [methods]侧边栏收缩
  toggleCollapse = () => {
    this.setState({ isCollapse: !this.state.isCollapse })
    console.log(this.state)
  }
  // [methods]切换内容页面
  switchPage = (path, item1, item2) => () => {
    // const { item, key, keyPath, domEvent } = menuItemObj
    console.log(path)// /users
    console.log(item1)
    console.log(item2)
    // window.sessionStorage.setItem('activePath', path)
    // this.history.push('/')
    this.history.push(`/home/${path}`, { item1, item2 })
  }

  componentDidMount() {
    if (!isAuth()) {
      this.history.push('/login')
      return
    }
    // console.log('props', this.props)
    this.history.push('/home/welcome')
    this.getMenuList()
  }
  // [lifecycle]
  render() {
    return (
      <Layout className="home-container">
        {/* 头部区域 */}
        <Header className="topBox">
          <div className="logo_box">
            <Link to="/home"><img className="logo_img" src={logo} alt="" /></Link>
            <span>电商后台管理系统</span>
          </div>
          <div className="user_box">
            <Button type="primary"
              onClick={this.logOut} >退出</Button>
          </div>
        </Header>

        <Layout className="bottomBox">
          {/* 侧边栏区域 */}
          <Sider className="mySider"
            collapsed={this.state.isCollapse}
          >
            <div className="toggleBtn" onClick={this.toggleCollapse}>
              |||
            </div>
            <Menu className="menu"
              mode="inline">
              {
                this.state.menus.map(item1 => {
                  return (
                    <Menu.SubMenu
                      icon={this.state.iconsObjs[item1.id + '']}
                      className="subMenu"
                      title={item1.authName}
                      key={item1.id + ''}
                    >
                      {item1.children.map(item2 => {
                        return (
                          <Menu.Item
                            onClick={this.switchPage(`${item2.path}`, item1, item2)}
                            key={item2.id + ''}
                          >
                            {item2.authName}
                          </Menu.Item>

                        )
                      })}
                    </Menu.SubMenu>
                  )
                })
              }
            </Menu>
          </Sider>
          {/* 内容展示区 */}
          <Content className="myContent">
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}