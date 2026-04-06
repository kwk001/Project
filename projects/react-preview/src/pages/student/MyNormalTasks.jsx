import { Component } from 'react'

class MyNormalTasks extends Component {
  constructor() {
    super()
    if (window.KaiwuMesModule) {
      const { injectMesModuleMethods } = window.KaiwuMesModule
      injectMesModuleMethods(this)
    }
  }

  static PAGE_FORMCODE = 'page_student_normal_tasks'
  static PAGE_FORMNAME = '我的普通任务'

  state = {
    formMap: { form_task: '' },
    currentPageConfig: {
      pageFormCode: 'page-student-normal-tasks',
      pageFormName: '我的普通任务',
      projectCode: 'PRO0001',
    },
    dataList: [],
    loading: false,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    currentUser: {},
    headers: {
      Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token'),
    },
  }

  async componentDidMount() {
    await this.initializeServices()
  }

  async initializeServices() {
    if (window.KaiwuDataService) {
      const { DataService } = window.KaiwuDataService
      this.dataService = new DataService()
      this.userService = this.dataService.userService
      const currentUser = await this.userService.getCurrentUser()
      if (currentUser) {
        this.setState({ currentUser })
      }
    }
    this.loadData()
  }

  async loadData() {
    this.setState({ loading: true })
    try {
      // 模拟数据
      this.setState({
        dataList: [
          { id: '1', taskName: '第一章课后练习', courseName: '智能制造基础', status: 'pending', score: null },
          { id: '2', taskName: '数控编程基础测试', courseName: '数控加工技术', status: 'completed', score: 85 },
        ],
        total: 2,
      })
    } catch (error) {
      const { message } = window.antd
      message.error('加载数据失败')
    } finally {
      this.setState({ loading: false })
    }
  }

  getLocale() {
    if (window.DayjsLocale) {
      return window.DayjsLocale.getZhCN()
    }
    return undefined
  }

  getColumns() {
    const { Button, Tag } = window.antd
    return [
      { title: '任务名称', dataIndex: 'taskName', key: 'taskName' },
      { title: '所属课程', dataIndex: 'courseName', key: 'courseName' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'completed' ? 'success' : 'warning'}>
            {status === 'completed' ? '已完成' : '待完成'}
          </Tag>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Button type="link" onClick={() => console.log('查看', record)}>
            查看
          </Button>
        ),
      },
    ]
  }

  renderJSX() {
    const { ConfigProvider, Table, Card } = window.antd
    const { dataList, loading, pageNo, pageSize, total } = this.state

    return (
      <ConfigProvider theme={window.antdTheme} locale={this.getLocale()}>
        <div className="main-container" style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
          <h1 style={{ marginBottom: 24 }}>我的普通任务</h1>
          <Card>
            <Table
              columns={this.getColumns()}
              dataSource={dataList}
              rowKey="id"
              loading={loading}
              pagination={{
                current: pageNo,
                pageSize: pageSize,
                total: total,
                onChange: (page, size) => this.setState({ pageNo: page, pageSize: size }),
              }}
            />
          </Card>
        </div>
      </ConfigProvider>
    )
  }

  render() {
    return this.renderJSX()
  }

  componentWillUnmount() {
    // 清理资源
    if (this.searchTimer) clearTimeout(this.searchTimer)
    if (this.pollingTimer) clearInterval(this.pollingTimer)
  }
}

// 低代码平台不需要导出
export default MyNormalTasks
