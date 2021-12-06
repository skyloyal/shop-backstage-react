import React from 'react'
import './index.scss'
import isAuth from '../../template/Auth'
export default class Welcome extends React.Component {

  componentDidMount() {
    if (!isAuth()) {
      this.history.push('/login')
      return
    }
  }
  render() {
    return (
      <div className="welcome_container">
        <div className="welcome_slogan">
          welcome
        </div>
      </div>
    )
  }
}