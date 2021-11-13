import React from "react";
export default class Auth extends React.Component {

  isAuth = () => {
    if (!window.sessionStorage.getItem('token')) {
      return false;
    } else {
      return true
    }
  }
}