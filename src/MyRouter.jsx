// react
import React from "react";
import { Switch, Route, Redirect, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
// 自定义jsx
import Login from './components/login/Login'
import Home from './components/Home'
import ForgetPassword from './components/login/ForgetPassword'
import V6learn from "./components/v6learn/V6learn";

export default class MyRouter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  // 导航对象，必须放在Router标签history属性
  history = createBrowserHistory()

  render() {
    return (
      <Router history={this.history}>
        <Switch>
          <Route path="/login" component={Login} ></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/forgetPassword" component={ForgetPassword}></Route>
          <Route path="/v6learn" component={V6learn}></Route>
          <Redirect to="/home" />
        </Switch>
      </Router>
    )
  }
}