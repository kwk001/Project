import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Badge,
  Tooltip,
  Select,
  DatePicker,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Switch,
  Form,
  Upload,
  message,
  Popconfirm,
  Drawer
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  MoreOutlined,
  BookOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  FilterOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useTheme } from '../theme/ThemeContext'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

// 模拟数据
const mockData = [
  {
    id: '1',
    name: 'React前端开发实战',
    category: '前端开发',
    status: 'published',
    studentCount: 128,
    lessonCount: 24,
    duration: '12周',
    teacher: '张老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    updateTime: '2024-01-15 14:30',
    createTime: '2024-01-01',
    description: '从零开始学习React，掌握现代前端开发技能',
    cover: 'https://picsum.photos/400/200?random=1',
    price: 299,
    originalPrice: 399,
    tags: ['热门', '实战'],
    completionRate: 85
  },
  {
    id: '2',
    name: 'Vue3全栈开发',
    category: '前端开发',
    status: 'published',
    studentCount: 96,
    lessonCount: 32,
    duration: '16周',
    teacher: '李老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    updateTime: '2024-01-14 16:45',
    createTime: '2024-01-02',
    description: 'Vue3 + TypeScript + Node.js全栈开发课程',
    cover: 'https://picsum.photos/400/200?random=2',
    price: 399,
    originalPrice: 499,
    tags: ['全栈', '项目实战'],
    completionRate: 72
  },
  {
    id: '3',
    name: 'Python数据分析',
    category: '数据科学',
    status: 'draft',
    studentCount: 0,
    lessonCount: 18,
    duration: '9周',
    teacher: '王老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    updateTime: '2024-01-13 09:20',
    createTime: '2024-01-03',
    description: 'Python数据分析与可视化入门到精通',
    cover: 'https://picsum.photos/400/200?random=3',
    price: 199,
    originalPrice: 299,
    tags: ['数据分析', 'Python'],
    completionRate: 0
  },
  {
    id: '4',
    name: 'Java微服务架构',
    category: '后端开发',
    status: 'published',
    studentCount: 156,
    lessonCount: 40,
    duration: '20周',
    teacher: '赵老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    updateTime: '2024-01-12 11:15',
    createTime: '2024-01-04',
    description: 'Spring Cloud微服务架构设计与实战',
    cover: 'https://picsum.photos/400/200?random=4',
    price: 499,
    originalPrice: 699,
    tags: ['微服务', '架构'],
    completionRate: 68
  },
  {
    id: '5',
    name: 'UI/UX设计基础',
    category: '设计',
    status: 'published',
    studentCount: 84,
    lessonCount: 16,
    duration: '8周',
    teacher: '陈老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    updateTime: '2024-01-11 15:30',
    createTime: '2024-01-05',
    description: 'UI设计与用户体验设计基础课程',
    cover: 'https://picsum.photos/400/200?random=5',
    price: 249,
    originalPrice: 349,
    tags: ['设计', 'UI/UX'],
    completionRate: 91
  },
  {
    id: '6',
    name: 'Go语言高并发编程',
    category: '后端开发',
    status: 'review',
    studentCount: 0,
    lessonCount: 28,
    duration: '14周',
    teacher: '刘老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    updateTime: '2024-01-10 10:00',
    createTime: '2024-01-06',
    description: 'Go语言并发模式与高性能编程',
    cover: 'https://picsum.photos/400/200?random=6',
    price: 349,
    originalPrice: 449,
    tags: ['Go', '高并发'],
    completionRate: 0
  },
  {
    id: '7',
    name: '机器学习入门',
    category: '人工智能',
    status: 'published',
    studentCount: 203,
    lessonCount: 20,
    duration: '10周',
    teacher: '周老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    updateTime: '2024-01-09 14:20',
    createTime: '2024-01-07',
    description: '机器学习算法原理与实践应用',
    cover: 'https://picsum.photos/400/200?random=7',
    price: 399,
    originalPrice: 599,
    tags: ['AI', '机器学习'],
    completionRate: 78
  },
  {
    id: '8',
    name: 'Docker与K8s实战',
    category: '运维',
    status: 'published',
    studentCount: 112,
    lessonCount: 15,
    duration: '7周',
    teacher: '吴老师',
    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    updateTime: '2024-01-08 16:00',
    createTime: '2024-01-08',
    description: '容器化技术与Kubernetes集群管理',
    cover: 'https://picsum.photos/400/200?random=8',
    price: 299,
    originalPrice: 399,
    tags: ['Docker', 'K8s'],
    completionRate: 82
  }
]

const CourseManagement = () => {
  const { isDark, toggleTheme, token } = useTheme()
  const [data, setData] = useState(mockData)
  const [filteredData, setFilteredData] = useState(mockData)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false)
  const [currentCourse, setCurrentCourse] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [dateRange, setDateRange] = useState(null)
  const [viewMode, setViewMode] = useState('table')

  // 统计卡片数据
  const stats = {
    total: data.length,
    published: data.filter(item => item.status === 'published').length,
    draft: data.filter(item => item.status === 'draft').length,
    review: data.filter(item => item.status === 'review').length,
    totalStudents: data.reduce((sum, item) => sum + item.studentCount, 0),
    avgCompletion: Math.round(data.filter(item => item.completionRate > 0).reduce((sum, item) => sum + item.completionRate, 0) / data.filter(item => item.completionRate > 0).length)
  }

  // 筛选逻辑
  useEffect(() => {
    let result = data

    if (searchText) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.teacher.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus)
    }

    if (filterCategory !== 'all') {
      result = result.filter(item => item.category === filterCategory)
    }

    if (dateRange) {
      result = result.filter(item => {
        const itemDate = dayjs(item.createTime)
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1])
      })
    }

    setFilteredData(result)
  }, [data, searchText, filterStatus, filterCategory, dateRange])

  // 状态标签配置
  const statusConfig = {
    published: { color: 'success', text: '已发布', icon: <CheckCircleOutlined /> },
    draft: { color: 'default', text: '草稿', icon: <ExclamationCircleOutlined /> },
    review: { color: 'warning', text: '审核中', icon: <ClockCircleOutlined /> },
    archived: { color: 'error', text: '已归档', icon: <CloseCircleOutlined /> }
  }

  // 分类选项
  const categories = ['前端开发', '后端开发', '数据科学', '人工智能', '设计', '运维', '移动开发']

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      title: '课程信息',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={record.cover}
            alt={text}
            style={{
              width: 80,
              height: 50,
              objectFit: 'cover',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: token.colorText }}>{text}</div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
              {record.lessonCount}课时 · {record.duration}
            </div>
            <div style={{ marginTop: 4 }}>
              {record.tags.map(tag => (
                <Tag key={tag} size="small" style={{ fontSize: 10 }}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const config = statusConfig[status]
        return (
          <Tag
            icon={config.icon}
            color={config.color}
            style={{ fontWeight: 500 }}
          >
            {config.text}
          </Tag>
        )
      }
    },
    {
      title: '学员人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.studentCount - b.studentCount,
      render: (count) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 600 }}>{count}</span>
        </div>
      )
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.completionRate - b.completionRate,
      render: (rate) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 60, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${rate}%`,
                height: '100%',
                background: rate >= 80 ? '#52c41a' : rate >= 60 ? '#faad14' : '#ff4d4f',
                borderRadius: 3,
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500 }}>{rate}%</span>
        </div>
      )
    },
    {
      title: '讲师',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 150,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar src={record.teacherAvatar} size={32} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      )
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.price - b.price,
      render: (price, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, color: '#f5222d', fontSize: 16 }}>¥{price}</div>
          {record.originalPrice > price && (
            <div style={{ textDecoration: 'line-through', color: '#999', fontSize: 12 }}>
              ¥{record.originalPrice}
            </div>
          )}
        </div>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      sorter: (a, b) => dayjs(a.updateTime).unix() - dayjs(b.updateTime).unix(),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: token.colorTextSecondary }}>
          <ClockCircleOutlined />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个课程吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                style={{ color: '#ff4d4f' }}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="更多">
            <Button
              type="text"
              icon={<MoreOutlined />}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  // 处理函数
  const handleAdd = () => {
    setCurrentCourse(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record) => {
    setCurrentCourse(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id))
    message.success('删除成功')
  }

  const handleViewDetail = (record) => {
    setCurrentCourse(record)
    setIsDetailDrawerVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentCourse) {
        // 编辑
        setData(data.map(item =>
          item.id === currentCourse.id
            ? { ...item, ...values, updateTime: dayjs().format('YYYY-MM-DD HH:mm') }
            : item
        ))
        message.success('更新成功')
      } else {
        // 新增
        const newCourse = {
          ...values,
          id: String(data.length + 1),
          createTime: dayjs().format('YYYY-MM-DD'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
          studentCount: 0,
          completionRate: 0
        }
        setData([...data, newCourse])
        message.success('创建成功')
      }
      setIsModalVisible(false)
    })
  }

  const handleBatchDelete = () => {
    setData(data.filter(item => !selectedRows.includes(item.id)))
    setSelectedRows([])
    message.success('批量删除成功')
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  const handleResetFilters = () => {
    setSearchText('')
    setFilterStatus('all')
    setFilterCategory('all')
    setDateRange(null)
  }

  // 统计卡片组件
  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <Card
      style={{
        borderRadius: 16,
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        background: isDark
          ? 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, color: token.colorTextSecondary, marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: token.colorText }}>{value}</div>
          {trend && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 8,
              fontSize: 12,
              color: trend === 'up' ? '#52c41a' : '#ff4d4f'
            }}>
              {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color: color
        }}>
          {icon}
        </div>
      </div>
    </Card>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d1d8e0 100%)',
      padding: 24
    }}>
      {/* 头部 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: token.colorText,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <BookOutlined style={{ color: '#1890ff' }} />
            课程管理
          </h1>
          <p style={{
            margin: '8px 0 0 0',
            color: token.colorTextSecondary,
            fontSize: 14
          }}>
            管理和维护所有课程信息，支持批量操作和数据导出
          </p>
        </div>
        <Space>
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAdd}
            style={{
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              border: 'none'
            }}
          >
            新增课程
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="全部课程"
            value={stats.total}
            icon={<BookOutlined />}
            color="#1890ff"
            trend="up"
            trendValue="12%"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="已发布"
            value={stats.published}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            trend="up"
            trendValue="8%"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="草稿"
            value={stats.draft}
            icon={<EditOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总学员"
            value={stats.totalStudents}
            icon={<TeamOutlined />}
            color="#722ed1"
            trend="up"
            trendValue="23%"
          />
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.08)',
          background: isDark
            ? 'rgba(30,30,30,0.8)'
            : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="搜索课程名称、讲师..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: 8 }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder="课程状态"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%', borderRadius: 8 }}
              allowClear
            >
              <Option value="all">全部状态</Option>
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="review">审核中</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder="课程分类"
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: '100%', borderRadius: 8 }}
              allowClear
            >
              <Option value="all">全部分类</Option>
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetFilters}
              style={{ borderRadius: 8 }}
            >
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 批量操作栏 */}
      {selectedRows.length > 0 && (
        <div style={{
          marginBottom: 16,
          padding: '12px 16px',
          background: isDark ? 'rgba(24,144,255,0.2)' : 'rgba(24,144,255,0.1)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ color: '#1890ff', fontWeight: 500 }}>
            已选择 {selectedRows.length} 项
          </span>
          <Space>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              批量导出
            </Button>
          </Space>
        </div>
      )}

      {/* 表格 */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.08)',
          background: isDark
            ? 'rgba(30,30,30,0.8)'
            : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys),
            selectedRowKeys: selectedRows
          }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: { marginTop: 16 }
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={currentCourse ? '编辑课程' : '新增课程'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        style={{ borderRadius: 16 }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="课程名称"
                rules={[{ required: true, message: '请输入课程名称' }]}
              >
                <Input placeholder="请输入课程名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="课程分类"
                rules={[{ required: true, message: '请选择课程分类' }]}
              >
                <Select placeholder="请选择课程分类">
                  {categories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacher"
                label="讲师"
                rules={[{ required: true, message: '请输入讲师姓名' }]}
              >
                <Input placeholder="请输入讲师姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="课程状态"
                rules={[{ required: true, message: '请选择课程状态' }]}
              >
                <Select placeholder="请选择课程状态">
                  <Option value="published">已发布</Option>
                  <Option value="draft">草稿</Option>
                  <Option value="review">审核中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lessonCount"
                label="课时数"
                rules={[{ required: true, message: '请输入课时数' }]}
              >
                <Input type="number" placeholder="请输入课时数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="课程时长"
                rules={[{ required: true, message: '请输入课程时长' }]}
              >
                <Input placeholder="例如：12周" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="课程价格"
                rules={[{ required: true, message: '请输入课程价格' }]}
              >
                <Input type="number" placeholder="请输入课程价格" prefix="¥" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="originalPrice"
                label="原价"
              >
                <Input type="number" placeholder="请输入原价" prefix="¥" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="课程简介"
            rules={[{ required: true, message: '请输入课程简介' }]}
          >
            <TextArea rows={4} placeholder="请输入课程简介" />
          </Form.Item>
          <Form.Item
            name="cover"
            label="课程封面"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              showUploadList={false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传封面</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="课程详情"
        placement="right"
        width={600}
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
      >
        {currentCourse && (
          <div>
            <img
              src={currentCourse.cover}
              alt={currentCourse.name}
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 12,
                marginBottom: 24
              }}
            />
            <h2 style={{ marginBottom: 16 }}>{currentCourse.name}</h2>
            <div style={{ marginBottom: 24 }}>
              <Tag color="blue">{currentCourse.category}</Tag>
              {currentCourse.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>讲师：</strong>
              <Avatar src={currentCourse.teacherAvatar} size={24} style={{ marginRight: 8 }} />
              {currentCourse.teacher}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>状态：</strong>
              <Tag color={statusConfig[currentCourse.status].color}>
                {statusConfig[currentCourse.status].text}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>学员人数：</strong>{currentCourse.studentCount} 人
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>课时数：</strong>{currentCourse.lessonCount} 课时
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>课程时长：</strong>{currentCourse.duration}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>价格：</strong>
              <span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>
                ¥{currentCourse.price}
              </span>
              {currentCourse.originalPrice > currentCourse.price && (
                <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: 8 }}>
                  ¥{currentCourse.originalPrice}
                </span>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>完成率：</strong>{currentCourse.completionRate}%
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>创建时间：</strong>{currentCourse.createTime}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>更新时间：</strong>{currentCourse.updateTime}
            </div>
            <div>
              <strong>课程简介：</strong>
              <p style={{ marginTop: 8, lineHeight: 1.8 }}>{currentCourse.description}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default CourseManagement

