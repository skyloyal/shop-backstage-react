import React from "react";
export default class Auth extends React.Component {

  // 导航对象
  history = this.props.history
  isAuth = () => {
    if (!window.sessionStorage.getItem('token')) {
      return false;
    } else {
      return true
    }
  }
  constructor(props) {
    super(props)
    if (!this.isAuth()) {
      return this.history.push('/login')
    } else if (props.location.pathname === '/home') {
      return this.history.push('/home/welcome')
    } else {
      return
    }
  }
}