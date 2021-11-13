//react
import React from "react";
import { Link } from 'react-router-dom'

// antd
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

// 外部资源,css,图片等
import './Login.scss'
import logo from '../../assets/img/logo.png'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      initFormValues: {
        username: window.localStorage ? window.localStorage.getItem('username') : '',
        password: window.localStorage ? window.localStorage.getItem('password') : '',
        remember: true
      }
    }
  }
  formRef = React.createRef()
  history = this.props.history
  // 登录
  submit = () => {
    // console.log(loginForm)//{username:'',password:'',remember:true}

    console.log(this.formRef)//{current:{...}}

    // let result = this.formRef.current.validateFields()
    // console.log(result)//promise
    this.formRef.current.validateFields()
      .then(async loginForm => {
        console.log(loginForm)
        const { data: res } = await this.$axios.post('/login', loginForm)
        console.log(res.meta.msg)
        if (res.meta.status !== 200) {
          return
        }
        // window.sessionStorage.setItem('token', res.data.token)
        this.saveTokenInSessionStorage(res.data.token)
        if (loginForm.remember === true) {
          this.saveLoginFormInCookie(loginForm)
        }
        // console.log(this.history)
        this.history.push('/home')
      })
      .catch(errInfo => {
        console.log(errInfo)
        return
      })
  }
  // 重置登录信息
  reset = () => {
    this.formRef.current.resetFields()
  }
  // 保存登录信息到cookie
  saveLoginFormInCookie = (info) => {
    // Object.keys(info).forEach((key) => {
    //   window.localStorage.setItem(key, info[key])
    // })
    for (let key in info) {
      window.localStorage.setItem(key, info[key])
    }
  }
  // 保存token到sessionStorage
  saveTokenInSessionStorage = (token) => {
    window.sessionStorage.setItem('token', token)
  }
  // 登录信息校验规则
  loginFormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' }
    ]
  }
  render() {
    return (
      <div className="login_container">
        {/* 登录盒子 */}
        <div className="login_box">
          {/* 头像区域 */}
          <div className="avatar_box">
            <img src={logo} alt="头像" />
          </div>
          {/* 登录表单区域 */}
          <div className="form_box">
            <Form ref={this.formRef}
              name="loginForm"
              onFinish={this.submit}
              labelCol={{ span: 4 }}
              initialValues={this.state.initFormValues}
            >
              {/* 表单输入区 */}
              <Form.Item
                name="username"
                rules={this.loginFormRules.username}>
                <Input
                  placeholder="用户名"
                  prefix={<UserOutlined className="site-form-item-icon" />}></Input>
              </Form.Item>
              <Form.Item name="password"
                rules={this.loginFormRules.password}>
                <Input placeholder="密码" type="password"
                  prefix={<LockOutlined className="site-form-item-icon" />}></Input>
              </Form.Item>
              {/* 表单选择区 */}
              <div className="form_select">
                {/* antd把name属性当作关键字 */}
                <Form.Item name="remember"
                  valuePropName="checked"
                  noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                {/* 记住账号密码 */}
                {/* 忘记密码 */}
                <Link to="/forgetPassword">忘记密码</Link>
              </div>

              {/* 操作区 */}
              <Form.Item>
                <div className="btns">
                  <Button type="primary" htmlType="submit">登录</Button>
                  <Button type="info" onClick={this.reset}>重置</Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div >
    )
  }
}

export default Login