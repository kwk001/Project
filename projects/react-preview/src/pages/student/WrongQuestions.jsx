import { Component } from 'react'

class WrongQuestions extends Component {
  constructor() {
    super()
    if (window.KaiwuMesModule) {
      const { injectMesModuleMethods } = window.KaiwuMesModule
      injectMesModuleMethods(this)
    }
  }

  static PAGE_FORMCODE = 'page_student_wrong_questions'
  static PAGE_FORMNAME = '错题集'

  state = {
    formMap: { form_wrong: '' },
    currentPageConfig: {
      pageFormCode: 'page-student-wrong-questions',
      pageFormName: '错题集',
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
          { id: '1', questionContent: '工业4.0的核心特征是什么？', courseName: '智能制造基础', wrongCount: 2 },
          { id: '2', questionContent: 'G00指令表示什么？', courseName: '数控加工技术', wrongCount: 1 },
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
    const { Button, Badge } = window.antd
    return [
      {
        title: '题目内容',
        dataIndex: 'questionContent',
        key: 'questionContent',
        render: (text) => (text.length > 50 ? text.substring(0, 50) + '...' : text),
      },
      { title: '所属课程', dataIndex: 'courseName', key: 'courseName' },
      {
        title: '错误次数',
        dataIndex: 'wrongCount',
        key: 'wrongCount',
        render: (count) => <Badge count={count} style={{ backgroundColor: count >= 3 ? '#ff4d4f' : '#1890ff' }} />,
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
          <h1 style={{ marginBottom: 24 }}>错题集</h1>
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

export default WrongQuestions
