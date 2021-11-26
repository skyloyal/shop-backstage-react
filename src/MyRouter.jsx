// react
import React from "react";
import { Switch, Route, Redirect, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
// 自定义jsx
import Login from './components/login/Login'
import Home from './components/Home'
import ForgetPassword from './components/login/ForgetPassword'
import Welcome from './components/Welcome'
import RoleList from './components/right/roleList'
import RightList from './components/right/rightList'
import Goods from './components/good/goodList'
import Params from './components/good/param'
import Categories from './components/good/cate'
// 内容页面
import User from './components/user'

export default class MyRouter extends React.Component {

  // 导航对象，必须放在Router标签history属性
  history = createBrowserHistory()

  render() {
    return (
      <Router history={this.history}>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Home path="/home" history={this.history}>
            <Route path="/home/welcome" component={Welcome}></Route>
            <Route path="/home/users" component={User}></Route>
            <Route path="/home/roles" component={RoleList}></Route>
            <Route path="/home/rights" component={RightList}></Route>
          </Home>
          <Route path="/forgetPassword" exact
            component={ForgetPassword}></Route>
          <Redirect to="/home"></Redirect>
        </Switch >
      </Router >
    )
  }
}