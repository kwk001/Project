import { Component } from 'react'

class MyCourses extends Component {
  constructor() {
    super()
    // 注入开物MES组件方法
    if (window.KaiwuMesModule) {
      const { injectMesModuleMethods } = window.KaiwuMesModule
      injectMesModuleMethods(this)
    }
  }

  static PAGE_FORMCODE = 'page_student_courses'
  static PAGE_FORMNAME = '我的课程'

  state = {
    formMap: {
      form_course: '',
    },
    currentPageConfig: {
      pageFormCode: 'page-student-courses',
      pageFormName: '我的课程',
      projectCode: 'PRO0001',
    },
    dataList: [],
    loading: false,
    selectedRowKeys: [],
    selectedCourse: null,
    isDetailDrawerVisible: false,
    activeTab: 'info',
    filterExpanded: false,
    searchKeyword: '',
    filterTeacher: 'all',
    filterStatus: 'all',
    filterClassroom: 'all',
    pageNo: 1,
    pageSize: 10,
    total: 0,
    currentUser: {},
    headers: {
      Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token'),
    },
  }

  // 模拟课程数据
  mockCourses = [
    {
      id: '1',
      courseCode: 'ME101',
      courseName: '智能制造基础',
      teacherName: '张老师',
      teacherPhone: '13800138001',
      teacherEmail: 'zhang@example.com',
      timeSlot: '周一 08:00-09:40',
      classroom: 'A101教室',
      status: 'active',
      pendingTasks: 3,
      videoMaterials: [
        { id: 'v1', name: '智能制造概述', duration: '15:30' },
        { id: 'v2', name: '工业4.0介绍', duration: '20:15' },
      ],
      textMaterials: [
        { id: 't1', name: '智能制造基础教材.pdf', size: '5.2MB' },
        { id: 't2', name: '实验指导书.pdf', size: '3.1MB' },
      ],
    },
    {
      id: '2',
      courseCode: 'ME102',
      courseName: '数控加工技术',
      teacherName: '李老师',
      teacherPhone: '13800138002',
      teacherEmail: 'li@example.com',
      timeSlot: '周二 10:00-11:40',
      classroom: '实训中心B201',
      status: 'active',
      pendingTasks: 2,
      videoMaterials: [{ id: 'v3', name: '数控编程基础', duration: '25:00' }],
      textMaterials: [{ id: 't3', name: '数控加工手册.pdf', size: '8.5MB' }],
    },
    {
      id: '3',
      courseCode: 'ME103',
      courseName: 'CAD/CAM技术',
      teacherName: '王老师',
      teacherPhone: '13800138003',
      teacherEmail: 'wang@example.com',
      timeSlot: '周三 14:00-15:40',
      classroom: '计算机房C301',
      status: 'active',
      pendingTasks: 5,
      videoMaterials: [
        { id: 'v4', name: 'CAD软件操作', duration: '30:00' },
        { id: 'v5', name: 'CAM编程实例', duration: '28:45' },
      ],
      textMaterials: [{ id: 't4', name: 'CAD/CAM教程.pdf', size: '12.3MB' }],
    },
    {
      id: '4',
      courseCode: 'ME104',
      courseName: '工业机器人编程',
      teacherName: '赵老师',
      teacherPhone: '13800138004',
      teacherEmail: 'zhao@example.com',
      timeSlot: '周四 08:00-09:40',
      classroom: '机器人实训室D401',
      status: 'active',
      pendingTasks: 1,
      videoMaterials: [{ id: 'v6', name: '机器人基础操作', duration: '22:30' }],
      textMaterials: [{ id: 't5', name: '机器人编程指南.pdf', size: '6.8MB' }],
    },
    {
      id: '5',
      courseCode: 'ME105',
      courseName: '质量检测技术',
      teacherName: '陈老师',
      teacherPhone: '13800138005',
      teacherEmail: 'chen@example.com',
      timeSlot: '周五 10:00-11:40',
      classroom: '检测实验室E501',
      status: 'completed',
      pendingTasks: 0,
      videoMaterials: [{ id: 'v7', name: '三坐标测量', duration: '18:20' }],
      textMaterials: [{ id: 't6', name: '质量检测标准.pdf', size: '4.2MB' }],
    },
  ]

  async componentDidMount() {
    await this.initializeServices()
  }

  async initializeServices() {
    if (window.KaiwuDataService) {
      const { DataService } = window.KaiwuDataService
      this.dataService = new DataService()
      this.formService = this.dataService.formDataService
      this.userService = this.dataService.userService
      this.configManager = this.dataService.configManager

      await this.configManager.initGlobalContext([
        this.state.currentPageConfig.pageFormCode,
      ])

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
      // 模拟数据加载
      const { searchKeyword, filterTeacher, filterStatus, filterClassroom } = this.state
      let filteredData = this.mockCourses.filter((course) => {
        if (searchKeyword && !course.courseName.includes(searchKeyword) && !course.courseCode.includes(searchKeyword))
          return false
        if (filterTeacher !== 'all' && course.teacherName !== filterTeacher) return false
        if (filterStatus !== 'all' && course.status !== filterStatus) return false
        if (filterClassroom !== 'all' && course.classroom !== filterClassroom) return false
        return true
      })

      this.setState({
        dataList: filteredData,
        total: filteredData.length,
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

  // 统计数据
  getStats() {
    const { dataList } = this.state
    return {
      total: dataList.length,
      active: dataList.filter((c) => c.status === 'active').length,
      completed: dataList.filter((c) => c.status === 'completed').length,
      totalPendingTasks: dataList.reduce((sum, c) => sum + c.pendingTasks, 0),
    }
  }

  // 获取教师列表
  getTeachers() {
    return [...new Set(this.mockCourses.map((c) => c.teacherName))]
  }

  // 获取教室列表
  getClassrooms() {
    return [...new Set(this.mockCourses.map((c) => c.classroom))]
  }

  // 查看课程详情
  handleViewDetail = (course) => {
    this.setState({
      selectedCourse: course,
      isDetailDrawerVisible: true,
      activeTab: 'info',
    })
  }

  // 重置筛选
  handleReset = () => {
    this.setState(
      {
        searchKeyword: '',
        filterTeacher: 'all',
        filterStatus: 'all',
        filterClassroom: 'all',
      },
      () => this.loadData()
    )
  }

  // 查询
  handleSearch = () => {
    this.loadData()
  }

  // 表格列定义
  getColumns() {
    const { Button, Badge, Tag, Space } = window.antd
    const { BookOutlined, UserOutlined, ClockCircleOutlined, EnvironmentOutlined, EyeOutlined } = window.antdIcon || {}

    return [
      {
        title: '课程编码',
        dataIndex: 'courseCode',
        key: 'courseCode',
        width: 120,
        align: 'center',
      },
      {
        title: '课程名称',
        dataIndex: 'courseName',
        key: 'courseName',
        width: 200,
        render: (text) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {BookOutlined && <BookOutlined style={{ color: '#1890ff' }} />}
            <span style={{ fontWeight: 500 }}>{text}</span>
          </div>
        ),
      },
      {
        title: '任课教师',
        dataIndex: 'teacherName',
        key: 'teacherName',
        width: 120,
        render: (text) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {UserOutlined && <UserOutlined style={{ color: '#52c41a' }} />}
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: '上课时间',
        dataIndex: 'timeSlot',
        key: 'timeSlot',
        width: 160,
        render: (text) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {ClockCircleOutlined && <ClockCircleOutlined style={{ color: '#faad14' }} />}
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: '上课教室',
        dataIndex: 'classroom',
        key: 'classroom',
        width: 150,
        render: (text) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {EnvironmentOutlined && <EnvironmentOutlined style={{ color: '#722ed1' }} />}
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: '待完成任务',
        dataIndex: 'pendingTasks',
        key: 'pendingTasks',
        width: 120,
        align: 'center',
        render: (count) =>
          count > 0 ? (
            <Badge count={count} style={{ backgroundColor: '#ff4d4f' }}>
              <Tag color="error">{count}个待完成</Tag>
            </Badge>
          ) : (
            <Tag color="success">已完成</Tag>
          ),
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        fixed: 'right',
        align: 'center',
        render: (_, record) => (
          <Space size="small">
            <Button type="link" icon={EyeOutlined && <EyeOutlined />} onClick={() => this.handleViewDetail(record)}>
              查看
            </Button>
          </Space>
        ),
      },
    ]
  }

  // 渲染统计卡片
  renderStatCard(title, value, icon, color, suffix) {
    const { Card } = window.antd
    const stats = this.getStats()

    return (
      <Card
        style={{
          borderRadius: 8,
          background: '#fff',
          border: '1px solid #e8e8e8',
        }}
        styles={{ body: { padding: 16 } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#262626' }}>
              {value}
              {suffix && <span style={{ fontSize: 14, marginLeft: 4 }}>{suffix}</span>}
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: color,
            }}
          >
            {icon}
          </div>
        </div>
      </Card>
    )
  }

  // 渲染筛选区
  renderFilterArea() {
    const { Card, Row, Col, Input, Select, Button } = window.antd
    const { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } = window.antdIcon || {}
    const { Option } = Select
    const { searchKeyword, filterTeacher, filterStatus, filterClassroom, filterExpanded } = this.state

    return (
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 8,
          background: '#fff',
          border: '1px solid #e8e8e8',
        }}
        styles={{ body: { padding: 16 } }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="课程名称/编码"
              value={searchKeyword}
              onChange={(e) => this.setState({ searchKeyword: e.target.value })}
              prefix={SearchOutlined && <SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择教师"
              value={filterTeacher}
              onChange={(value) => this.setState({ filterTeacher: value })}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="all">全部教师</Option>
              {this.getTeachers().map((teacher) => (
                <Option key={teacher} value={teacher}>
                  {teacher}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="课程状态"
              value={filterStatus}
              onChange={(value) => this.setState({ filterStatus: value })}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="all">全部状态</Option>
              <Option value="active">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Col>
          {filterExpanded && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="选择教室"
                value={filterClassroom}
                onChange={(value) => this.setState({ filterClassroom: value })}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="all">全部教室</Option>
                {this.getClassrooms().map((classroom) => (
                  <Option key={classroom} value={classroom}>
                    {classroom}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button icon={ReloadOutlined && <ReloadOutlined />} onClick={this.handleReset}>
            重置
          </Button>
          <Button type="primary" icon={SearchOutlined && <SearchOutlined />} onClick={this.handleSearch}>
            查询
          </Button>
          <Button type="link" onClick={() => this.setState({ filterExpanded: !filterExpanded })}>
            {filterExpanded ? (
              <>
                收起 {UpOutlined && <UpOutlined />}
              </>
            ) : (
              <>
                展开 {DownOutlined && <DownOutlined />}
              </>
            )}
          </Button>
        </div>
      </Card>
    )
  }

  // 渲染表格区
  renderTableArea() {
    const { Card, Table } = window.antd
    const { dataList, loading, selectedRowKeys, pageNo, pageSize, total } = this.state

    return (
      <Card
        style={{
          borderRadius: 8,
          background: '#fff',
          border: '1px solid #e8e8e8',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          columns={this.getColumns()}
          dataSource={dataList}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => this.setState({ selectedRowKeys: keys }),
          }}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 门课程`,
            style: { margin: '16px', textAlign: 'right' },
            onChange: (page, size) => this.setState({ pageNo: page, pageSize: size }),
          }}
        />
      </Card>
    )
  }

  // 渲染详情抽屉
  renderDetailDrawer() {
    const { Drawer, Tabs, List, Avatar, Tag, Button, Card, Row, Col } = window.antd
    const {
      UserOutlined,
      ClockCircleOutlined,
      EnvironmentOutlined,
      PlayCircleOutlined,
      FileTextOutlined,
    } = window.antdIcon || {}
    const { selectedCourse, isDetailDrawerVisible, activeTab } = this.state

    if (!selectedCourse) return null

    const tabItems = [
      {
        key: 'info',
        label: '基本信息',
        children: (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>{selectedCourse.courseName}</h2>
              <Tag color="blue">{selectedCourse.courseCode}</Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#8c8c8c', marginBottom: 4, fontSize: 14 }}>任课教师</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {UserOutlined && <Avatar icon={<UserOutlined />} size="small" />}
                <span style={{ fontSize: 14 }}>{selectedCourse.teacherName}</span>
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                  {selectedCourse.teacherPhone} | {selectedCourse.teacherEmail}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#8c8c8c', marginBottom: 4, fontSize: 14 }}>上课时间</div>
              <div style={{ fontSize: 14 }}>{selectedCourse.timeSlot}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#8c8c8c', marginBottom: 4, fontSize: 14 }}>上课教室</div>
              <div style={{ fontSize: 14 }}>{selectedCourse.classroom}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#8c8c8c', marginBottom: 4, fontSize: 14 }}>待完成任务</div>
              <div>
                {selectedCourse.pendingTasks > 0 ? (
                  <Tag color="error">{selectedCourse.pendingTasks}个任务待完成</Tag>
                ) : (
                  <Tag color="success">已完成所有任务</Tag>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'video',
        label: '视频教材',
        children: (
          <List
            dataSource={selectedCourse.videoMaterials}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="primary" icon={PlayCircleOutlined && <PlayCircleOutlined />} size="small">
                    播放
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={PlayCircleOutlined && <PlayCircleOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                  title={item.name}
                  description={`时长: ${item.duration}`}
                />
              </List.Item>
            )}
          />
        ),
      },
      {
        key: 'text',
        label: '辅导教材',
        children: (
          <List
            dataSource={selectedCourse.textMaterials}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" icon={FileTextOutlined && <FileTextOutlined />}>查看</Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={FileTextOutlined && <FileTextOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                  title={item.name}
                  description={`大小: ${item.size}`}
                />
              </List.Item>
            )}
          />
        ),
      },
    ]

    return (
      <Drawer
        title="课程详情"
        placement="right"
        width={640}
        onClose={() => this.setState({ isDetailDrawerVisible: false })}
        open={isDetailDrawerVisible}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => this.setState({ isDetailDrawerVisible: false })}>关闭</Button>
          </div>
        }
      >
        <Tabs activeKey={activeTab} onChange={(key) => this.setState({ activeTab: key })} items={tabItems} />
      </Drawer>
    )
  }

  // 主渲染方法
  renderJSX() {
    const { ConfigProvider, Row, Col } = window.antd
    const { BookOutlined, CheckCircleOutlined, ExclamationCircleOutlined, TeamOutlined } = window.antdIcon || {}
    const stats = this.getStats()

    return (
      <ConfigProvider theme={window.antdTheme} locale={this.getLocale()}>
        <div className="main-container" style={{ minHeight: '100vh', background: '#f5f5f5', padding: 24 }}>
          {/* 页面标题 */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#262626' }}>我的课程</h1>
            <p style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>查看我的课程安排，管理学习任务</p>
          </div>

          {/* 统计卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              {this.renderStatCard('全部课程', stats.total, BookOutlined && <BookOutlined />, '#1890ff', '门')}
            </Col>
            <Col xs={24} sm={12} lg={6}>
              {this.renderStatCard('进行中', stats.active, CheckCircleOutlined && <CheckCircleOutlined />, '#52c41a', '门')}
            </Col>
            <Col xs={24} sm={12} lg={6}>
              {this.renderStatCard(
                '已完成',
                stats.completed,
                ExclamationCircleOutlined && <ExclamationCircleOutlined />,
                '#faad14',
                '门'
              )}
            </Col>
            <Col xs={24} sm={12} lg={6}>
              {this.renderStatCard('待完成任务', stats.totalPendingTasks, TeamOutlined && <TeamOutlined />, '#ff4d4f', '个')}
            </Col>
          </Row>

          {/* 筛选区 */}
          {this.renderFilterArea()}

          {/* 表格区 */}
          {this.renderTableArea()}

          {/* 详情抽屉 */}
          {this.renderDetailDrawer()}
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

// 低代码平台规范建议不导出，但为兼容 React 模块系统保留导出
export default MyCourses
