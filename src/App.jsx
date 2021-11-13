import React from "react";
import MyRouter from './MyRouter.jsx'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <MyRouter></MyRouter>
    )
  }
}