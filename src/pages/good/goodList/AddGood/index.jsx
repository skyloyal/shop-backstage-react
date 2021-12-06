// react
import React, { Component, createRef } from 'react';
// antd
import {
  Breadcrumb, Card, Alert, Steps, Modal,
  Tabs, Cascader, InputNumber, Checkbox,
  Button, Input, Form, Row, Col, Upload,
  Result
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
// react-quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// 自定义scss
import './index.scss'
import isAuth from '../../../../template/Auth';
// antd子组件
const { Step } = Steps;
const { TabPane } = Tabs;
// const { TextArea } = Input;

// 文件对象转base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);// 把文件对象读取成url
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    console.log(reader)
  });
}

class Addgood extends Component {
  // refs
  basicFormRef = createRef()
  // history
  history = this.props.history
  timeoutId = 0
  // [data] 渲染数据
  state = {
    // 激活的页签key，默认为字符串0
    activeKey: "0",
    // 商品分类列表
    cateList: [],
    // 选中的商品分类数组
    // 例如：[1, 3, 6]代表一级分类id为1，二级分类id为3，三级分类id为6
    selectedCateIdArr: [],
    // 添加商品表单校验规则
    addGoodFormRules: {
      goods_name: [
        { required: true, type: 'string', message: '请输入商品名称', validateTrigger: 'onBlur' }
      ],
      goods_cat: [
        { required: true, type: 'array', message: '请选择商品分类', validateTrigger: 'onBlur' }
      ],
      goods_price: [
        { required: true, type: 'number', message: '请输入商品单价', validateTrigger: 'onBlur' }
      ],
      goods_number: [
        { required: true, type: 'number', message: '请输入商品数量', validateTrigger: 'onBlur' }
      ],
      goods_weight: [
        { required: true, type: 'number', message: '请输入商品重量', validateTrigger: 'onBlur' }
      ]
    },
    // 基本信息
    basicFormData: {},
    // 商品参数
    manyTableData: [],
    // 商品属性
    onlyTableData: [],
    // 商品图片
    fileList: [],
    // 商品内容
    goods_introduce: '',
    // 图片上传地址
    uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
    // 图片上传的权限请求头
    headerObj: {
      Authorization: window.sessionStorage.getItem('token')
    },
    // 图片预览标题
    previewTitle: '',
    // 图片预览图片本体
    previewImage: '',
    // 图片预览对话框visible
    previewDialogVisible: false,
    // 完成页面disabled
    isNotFinish: true
  }
  // [methods] 页签切换
  changeActiveKey = async (activeKey) => {
    // 判断是否切换至商品参数/商品属性页签
    if (activeKey === '1' || activeKey === '2') {
      // 取第三级商品分类的id，向后端发请求获取该分类的动态参数
      let len = this.state.selectedCateIdArr.length
      if (len < 3) {
        this.setState({ activeKey: "0" })
        return this.$message.info('请先选择基本信息中的商品分类')
      }
    }
    if (activeKey === '5') {
      this.timeoutId = setTimeout(() => {
        this.history.push('/home/goods')
      }, 5000)
    }
    this.setState({ activeKey })
    console.log('activeKey =', this.state.activeKey)
  }
  // [methods] 获取分类列表
  getCateList = async () => {
    console.log('开始获取分类列表')
    const { data: res } = await this.$axios.get('/categories')
    if (res.meta.status !== 200) {
      return this.$message.error('获取分类列表失败')
    }
    console.log(res.data)
    this.setState({ cateList: res.data })
  }
  // [methods] 选择分类后,获取该分类的动态参数和静态属性
  handleCateChange = async (value, selectedOptions) => {
    console.log(value, selectedOptions)
    let len = value.length
    // 如果没选分类，则清空商品分类选项
    if (len === 0) {
      return this.setState({ selectedCateIdArr: value })
      // 如果不是选择三级分类，则清空商品分类选项
    } else if (len < 3) {
      for (let i = 0; i < len; i++) {
        value.pop()
      }
      this.setState({ selectedCateIdArr: value })
      return this.$message.warning('只允许选择第三级商品分类')
    } else {
      // 保存选择的商品分类
      this.setState({ selectedCateIdArr: value })
      let cateId = value[len - 1]
      // 获取动态参数
      const { data: res } = await this.$axios.get(`categories/${cateId}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      // 错误提示
      if (res.meta.status !== 200) {
        return this.$message.error('获取该分类参数失败')
      }
      // 保存动态参数，并初始化选中参数数组
      let manyTableData = res.data
      manyTableData.forEach(item => {
        item.attr_valsArr = item.attr_vals.split(' ')
        item.attr_checkedValsArr = []
      })
      this.setState({
        manyTableData
      })
      console.log(this.state.manyTableData)
      // 获取商品静态属性
      const { data: res2 } = await this.$axios.get(`/categories/${cateId}/attributes`, {
        params: {
          sel: 'only'
        }
      })
      // 错误提示
      if (res2.meta.status !== 200) {
        return this.$message.error('获取该分类参数失败')
      }
      let onlyTableData = res2.data
      onlyTableData.forEach(item => {
        item.attr_checkedVals = item.attr_vals
      })
      this.setState({
        onlyTableData
      })
      console.log(this.state.onlyTableData)
    }

  }
  // [methods] 切换上一页签
  preTab = () => {
    let activeKey = parseInt(this.state.activeKey) - 1
    activeKey = activeKey + ""
    this.changeActiveKey(activeKey)
  }
  // [methods] 切换下一页签
  nextTab = () => {
    let activeKey = parseInt(this.state.activeKey) + 1
    activeKey = activeKey + ""
    this.changeActiveKey(activeKey)
  }
  // [methods] 动态属性选中后保存在manyTableData
  handleMany_AttrChange = (checkedValue, attr_id) => {
    // console.log(this.state.manyTableData)
    // console.log('checkedValue = ', checkedValue)
    // console.log('attr_id = ', attr_id)
    let newManyTableData = [...this.state.manyTableData]
    newManyTableData.forEach(item => {
      if (item.attr_id === attr_id) {
        item.attr_checkedValsArr = checkedValue
      }
    })
    this.setState({ manyTableData: newManyTableData })
    console.log(this.state.manyTableData)
  }
  // [methods] 静态属性改变后保存在onlyTableData
  handleOnly_AttrChange = (e, attr_id) => {
    console.log(e)
    let checkedValue = e.target.value
    let newOnlyTableData = [...this.state.onlyTableData]
    newOnlyTableData.forEach(item => {
      if (item.attr_id === attr_id) {
        item.attr_checkedVals = checkedValue
      }
    })
    this.setState({ onlyTableData: newOnlyTableData })
    console.log(this.state.onlyTableData)
  }
  // [methods] 上传图片的信息保存在fileList
  handleChange = ({ fileList }) => {
    console.log(fileList)
    this.setState({ fileList });
  }
  // [methods] 图片预览
  handlePreview = async file => {
    console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewDialogVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  // [methods] 关闭图片预览
  closePreviewDialog = () => {
    this.setState({ previewDialogVisible: false })
  }
  // [methods] 填写商品内容信息保存在goods_introduce
  editGoods_introduce = (value) => {
    console.log(value)
    this.setState({ goods_introduce: value })
  }
  // [methods] 提交表单
  submitAddGood = () => {
    // 构造请求参数对象
    let submitObj = {
      goods_name: '',
      goods_cat: '',
      goods_price: 0,
      goods_number: 0,
      goods_weight: 0,
      goods_introduce: '',
      pics: [],
      attrs: []
    }
    const basicFormObj = this.basicFormRef.current
    // console.log(basicFormObj)
    basicFormObj.validateFields()
      .then(values => {
        console.log(values)
        this.setState({ basicFormData: values })
      }).then(() => {
        // 赋值基本参数
        submitObj = { ...this.state.basicFormData, goods_cat: this.state.basicFormData.goods_cat.join(',') }
        // 赋值动态参数
        let manyAttrs = this.state.manyTableData.map(item => {
          let attr_value = item.attr_checkedValsArr.join(' ')
          return { attr_id: item.attr_id, attr_value: attr_value }
        })
        // 赋值静态属性
        let onlyAttrs = this.state.onlyTableData.map(item => {
          return { attr_id: item.attr_id, attr_value: item.attr_checkedVals }
        })
        submitObj.attrs = [...manyAttrs, ...onlyAttrs]
        // 赋值pics
        let pics = this.state.fileList.map(item => {
          return { pic: '/' + item.response.data.tmp_path }
        })
        submitObj.pics = pics
        // 赋值商品内容
        submitObj.goods_introduce = this.state.goods_introduce
        console.log(submitObj)
      }, e => {
        console.log(e)
        this.$message.error('请正确填写商品信息')
      }).then(async () => {
        // 向后端发送请求
        const { data: res } = await this.$axios.post('/goods', submitObj)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        console.log('商品信息:', res.data)
        this.setState({ isNotFinish: false })
        this.changeActiveKey('5')
      })
  }
  backToGoodsPage = () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    this.history.push('/home/goods')
  }
  // [lifecycle]
  componentDidMount() {
    if (!isAuth()) {
      this.history.push('/login')
      return
    }
    this.getCateList()
  }
  // [lifecycle]
  render() {
    const UploadButton = () => {
      return (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )
    }
    return (
      <div className="addGood_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">" className="addGood_nav">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品列表</Breadcrumb.Item>
          <Breadcrumb.Item>添加商品</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="addGood_show">
          <Row>
            <Col>
              <Button
                onClick={this.backToGoodsPage}
                className="primary">返回商品列表</Button>
            </Col>
          </Row>
          <Alert
            className="addGood_alert"
            message="添加商品信息。注意：*为必填项"
            type="info"
            showIcon closable={false} />
          <Steps current={this.state.activeKey} className="addGood_steps">
            <Step title="基本信息" />
            <Step title="商品参数" />
            <Step title="商品属性" />
            <Step title="商品图片" />
            <Step title="商品内容" />
            <Step title="完成" />
          </Steps>
          <Tabs
            className="addGood_tabs"
            activeKey={this.state.activeKey}
            onChange={this.changeActiveKey}
            tabPosition="left">
            <TabPane
              tab="基本信息"
              key="0">
              <Form
                ref={this.basicFormRef}
                validateTrigger={['onBlur']}
                className="addGood_form"
                labelCol={{ span: 4 }}>
                <Form.Item
                  label="商品名称" name="goods_name" rules={this.state.addGoodFormRules.goods_name}>
                  <Input className="addGood_input"></Input>
                </Form.Item>
                <Form.Item
                  label="商品分类"
                  name="goods_cat"
                  rules={this.state.addGoodFormRules.goods_cat}>
                  <Cascader
                    className="addGood_input"
                    onChange={this.handleCateChange}
                    allowClear
                    fieldNames={{ label: 'cat_name', value: 'cat_id', children: 'children' }}
                    options={this.state.cateList}
                    placeholder="请选择商品分类" />
                </Form.Item>
                <Form.Item label="商品单价（元）" name="goods_price" rules={this.state.addGoodFormRules.goods_price}>
                  <InputNumber className="addGood_input"></InputNumber>
                </Form.Item>
                <Form.Item label="商品数量（个/件）" name="goods_number" rules={this.state.addGoodFormRules.goods_number}>
                  <InputNumber className="addGood_input"></InputNumber>
                </Form.Item>
                <Form.Item label="商品重量（kg）" name="goods_weight" rules={this.state.addGoodFormRules.goods_weight}>
                  <InputNumber className="addGood_input"></InputNumber>
                </Form.Item>
                <Row gutter={10}>
                  <Col span={3} offset={4}><Button className="primary" onClick={this.nextTab}>下一页</Button></Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane
              tab="商品参数"
              key="1">
              {this.state.manyTableData.map(item => {
                return (
                  <div key={item.attr_id}
                    name={`many_${item.attr_id}`}>
                    <Row>
                      {item.attr_name}
                    </Row>
                    <Checkbox.Group
                      value={item.attr_checkedValsArr}
                      onChange={checkedValue => {
                        this.handleMany_AttrChange(checkedValue, item.attr_id)
                      }}
                      options={item.attr_valsArr} >
                    </Checkbox.Group>
                  </div>
                )
              })}
              <Row gutter={10}>
                <Col span={3} offset={4}><Button className="primary" onClick={this.preTab}>上一页</Button></Col>
                <Col span={3}><Button className="primary" onClick={this.nextTab}>下一页</Button></Col>
              </Row>
            </TabPane>
            <TabPane
              tab="商品属性"
              key="2">
              <Form
                className="addGood_form"
                labelCol={{ span: 4 }}>
                {this.state.onlyTableData.map(item => {
                  return (
                    <Form.Item
                      label={item.attr_name}
                      key={item.attr_id}
                      name={`only_${item.attr_id}`}
                      initialValue={item.attr_checkedVals}
                    >
                      <Input
                        className="addGood_input"
                        key={item.attr_id}
                        onChange={e => {
                          this.handleOnly_AttrChange(e, item.attr_id)
                        }}
                      ></Input>
                    </Form.Item>
                  )
                })}
                <Row gutter={10}>
                  <Col span={3} offset={4}><Button className="primary" onClick={this.preTab}>上一页</Button></Col>
                  <Col span={3}><Button className="primary" onClick={this.nextTab}>下一页</Button></Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane
              tab="商品图片"
              key="3">
              <Upload
                action={this.state.uploadURL}
                listType="picture-card"
                fileList={this.state.fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                headers={this.state.headerObj}
              >
                <UploadButton></UploadButton>
              </Upload>
              <Row gutter={10}>
                <Col span={3}><Button className="primary" onClick={this.preTab}>上一页</Button></Col>
                <Col span={3}><Button className="primary" onClick={this.nextTab}>下一页</Button></Col>
              </Row>
              <Modal
                visible={this.state.previewDialogVisible}
                title={this.state.previewTitle}
                onCancel={this.closePreviewDialog}
                footer={null}
              >
                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
              </Modal>
            </TabPane>
            <TabPane
              tab="商品内容"
              key="4">
              <ReactQuill
                className="addGood_quill"
                theme="snow"
                onChange={this.editGoods_introduce} />
              <div style={{ marginTop: 50 }}>
                <Row gutter={10}>
                  <Col span={3}><Button className="primary" onClick={this.preTab}>上一页</Button></Col>
                  <Col span={3}><Button className="primary" onClick={this.submitAddGood}>提交</Button></Col>
                </Row>
              </div>
            </TabPane>
            <TabPane
              disabled={this.state.isNotFinish}
              tab="完成"
              key="5">
              <Result
                status="success"
                title="已成功添加新的商品!"
                subTitle="即将跳转至商品列表页面，请稍后..."
                extra={[
                  <Button
                    className="primary"
                    key="back"
                    onClick={this.backToGoodsPage}
                  >
                    立即返回
                  </Button>
                ]}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default Addgood;
