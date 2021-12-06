// react
import React, { Component } from 'react';
// antd
import { Breadcrumb, Card } from 'antd'
// echarts
import * as echarts from 'echarts'
import _ from 'lodash'
// 自定义scss
import './index.scss'
import isAuth from '../../template/Auth';
class Index extends Component {

  history = this.props.history

  state = {
    chartData: {},
    options: {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ]
    }
  }

  getReport = async () => {
    const { data: res } = await this.$axios.get('reports/type/1')
    console.log(res)
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据报表失败')
    }
    this.setState({ chartData: res.data })
  }
  drawChart = async () => {
    // await this.getReport()
    let mychart = echarts.init(document.getElementById('mychart'))
    const result = _.merge(this.state.chartData, this.state.options)
    mychart.setOption(result)
  }
  componentDidMount() {
    if (!isAuth()) {
      this.history.push('/login')
      return
    }
    Promise.resolve(this.getReport()).then(() => {
      this.drawChart()
    })
  }
  render() {
    return (
      <div className="report_container">
        {/* 面包屑导航区 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home/welcome">首页</Breadcrumb.Item>
          <Breadcrumb.Item>数据统计</Breadcrumb.Item>
          <Breadcrumb.Item>数据报表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片视图区 */}
        <Card className="report_show">
          <div id="mychart" className="mychart">
          </div>
        </Card>
      </div>
    );
  }
}

export default Index;
