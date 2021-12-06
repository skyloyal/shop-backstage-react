// react
import React from "react";
import { Switch, Route, Redirect, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
// 自定义jsx
import Login from './pages/login/Login'
import Home from './pages/Home'
import ForgetPassword from './pages/login/ForgetPassword'
import Welcome from './pages/Welcome'
import RoleList from './pages/right/roleList'
import RightList from './pages/right/rightList'
import Goods from './pages/good/goodList/'
import AddGood from './pages/good/goodList/AddGood/index.jsx'
import EditGood from './pages/good/goodList/EditGood'
import Params from './pages/good/param'
import Categories from './pages/good/cate'
import Orders from './pages/order'
import Reports from './pages/report'
// 内容页面
import User from './pages/user'

export default class MyRouter extends React.Component {

  // 导航对象，必须放在Router标签history属性
  history = createBrowserHistory()

  render() {
    return (
      <Router history={this.history}>
        <Switch>
          <Route path="/login" component={Login} ></Route>
          <Home path="/home" history={this.history}>
            <Route path="/home/welcome" component={Welcome}></Route>
            <Route path="/home/users" component={User}></Route>
            <Route path="/home/roles" component={RoleList}></Route>
            <Route path="/home/rights" component={RightList}></Route>
            <Route path="/home/goods" component={Goods}></Route>
            <Route path="/home/addGood" exact component={AddGood}></Route>
            <Route path="/home/editGood" exact component={EditGood}></Route>
            <Route path="/home/params" component={Params}></Route>
            <Route path="/home/categories" component={Categories}></Route>
            <Route path="/home/orders" component={Orders}></Route>
            <Route path="/home/reports" component={Reports}></Route>
          </Home>
          <Route path="/forgetPassword" exact
            component={ForgetPassword}></Route>
          <Redirect to="/home"></Redirect>
        </Switch >
      </Router >
    )

  }
}