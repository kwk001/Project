import { Component } from 'react'

class MyExams extends Component {
  constructor() {
    super()
    if (window.KaiwuMesModule) {
      const { injectMesModuleMethods } = window.KaiwuMesModule
      injectMesModuleMethods(this)
    }
  }

  static PAGE_FORMCODE = 'page_student_exams'
  static PAGE_FORMNAME = '我的综合考试'

  state = {
    formMap: { form_exam: '' },
    currentPageConfig: {
      pageFormCode: 'page-student-exams',
      pageFormName: '我的综合考试',
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
      this.setState({
        dataList: [
          { id: '1', examName: '期中综合测试', courseName: '智能制造基础', status: 'pending', score: null },
          { id: '2', examName: '数控技术综合考试', courseName: '数控加工技术', status: 'completed', score: 92 },
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
      { title: '试卷名称', dataIndex: 'examName', key: 'examName' },
      { title: '所属课程', dataIndex: 'courseName', key: 'courseName' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'completed' ? 'success' : status === 'in_progress' ? 'processing' : 'warning'}>
            {status === 'completed' ? '已完成' : status === 'in_progress' ? '考试中' : '待考试'}
          </Tag>
        ),
      },
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
        render: (score) => (score !== null ? `${score}分` : '-'),
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
          <h1 style={{ marginBottom: 24 }}>我的综合考试</h1>
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

export default MyExams
