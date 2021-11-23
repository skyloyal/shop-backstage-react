// react
import React from 'react';
import ReactDOM from 'react-dom';
// axios
import axios from 'axios'
// 调试用的，不清楚怎么用
import reportWebVitals from './reportWebVitals';
// 外部资源,css,图片等
import './assets/css/global.scss'
import 'antd/dist/antd.css';
// App组件
import App from './App';
// antd
import { message } from 'antd'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
React.Component.prototype.$axios = axios
React.Component.prototype.$message = message
ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
