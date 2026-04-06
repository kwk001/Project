import { useState, useEffect } from 'react'
import { Table, Button, Tag, Space, Input, Modal, message, Card, Badge, Tooltip, Select, DatePicker } from 'antd'
import dayjs from 'dayjs'
import {SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
  MoreOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
  TagsOutlined,
  CameraOutlined,
  InfoCircleOutlined,
  BookFilled,
  CalendarFilled,
  ClockCircleFilled,
  LoadingOutlined,
  AppstoreFilled
} from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'

const { Option } = Select
const { RangePicker } = DatePicker

const MyCourse = () => {
  const { theme, isDark } = useTheme()
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [customDateRange, setCustomDateRange] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [filteredData, setFilteredData] = useState(null)

  // 表单状态
  const [courseName, setCourseName] = useState('')
  const [courseCategory, setCourseCategory] = useState(undefined)
  const [courseStatus, setCourseStatus] = useState(undefined)
  const [courseDescription, setCourseDescription] = useState('')
  
  // 数字动画状态
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0])
  const [progressValues, setProgressValues] = useState([0, 0, 0])
  
  // 多选框状态
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // 查询处理函数
  const handleSearch = () => {
    setIsSearching(true)

    // 模拟API请求延迟
    setTimeout(() => {
      let result = [...data]

      // 1. 按课程名称筛选
      if (searchText.trim()) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )
      }

      // 2. 按状态筛选
      if (statusFilter !== 'all') {
        result = result.filter(item => item.status === statusFilter)
      }

      // 3. 按分类筛选
      if (categoryFilter !== 'all') {
        result = result.filter(item => item.category === categoryFilter)
      }

      // 4. 按时间范围筛选
      if (timeFilter !== 'all') {
        const now = new Date()
        result = result.filter(item => {
          const itemDate = new Date(item.updateTime)

          switch (timeFilter) {
            case 'today':
              return itemDate.toDateString() === now.toDateString()
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              return itemDate >= weekAgo
            case 'month':
              return itemDate.getMonth() === now.getMonth() &&
                     itemDate.getFullYear() === now.getFullYear()
            case 'year':
              return itemDate.getFullYear() === now.getFullYear()
            case 'custom':
              if (customDateRange && customDateRange[0] && customDateRange[1]) {
                const startDate = customDateRange[0].startOf('day').toDate()
                const endDate = customDateRange[1].endOf('day').toDate()
                return itemDate >= startDate && itemDate <= endDate
              }
              return true
            default:
              return true
          }
        })
      }

      setFilteredData(result)
      setIsSearching(false)

      // 显示查询结果提示
      message.success(`查询完成，共找到 ${result.length} 条记录`)
    }, 800)
  }

  // 统计数据 - 添加趋势数据
  const stats = [
    {
      label: '全部课程',
      value: 24,
      icon: <BookOutlined />,
      color: isDark ? '#0A84FF' : '#6366F1',
      trend: '+12%',
      trendUp: true,
      progress: 75
    },
    {
      label: '进行中',
      value: 8,
      icon: <FireOutlined />,
      color: isDark ? '#FF9500' : '#F59E0B',
      trend: '+5%',
      trendUp: true,
      progress: 33
    },
    {
      label: '已完成',
      value: 16,
      icon: <CheckCircleOutlined />,
      color: isDark ? '#34C759' : '#10B981',
      trend: '-2%',
      trendUp: false,
      progress: 67
    },
  ]

  const columns = [
    { 
      title: '序号', 
      dataIndex: 'index', 
      width: 80, 
      align: 'center',
      render: (_, __, index) => (
        <span style={{ 
          fontWeight: 600, 
          color: theme.text.secondary,
          fontSize: '14px'
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      ) 
    },
    { 
      title: '课程名称', 
      dataIndex: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: record.status === '进行中' 
              ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff'
          }}>
            <BookOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: theme.text.primary, fontSize: '15px' }}>{text}</div>
            <div style={{ fontSize: '12px', color: theme.text.secondary, marginTop: '2px' }}>ID: {record.key}</div>
          </div>
        </div>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 120,
      align: 'center',
      render: (text) => {
        const statusConfig = {
          '进行中': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <FireOutlined /> },
          '已完成': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircleOutlined /> },
          '未开始': { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: <ClockCircleOutlined /> },
        }
        const config = statusConfig[text] || statusConfig['未开始']
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: config.bg,
            color: config.color,
            fontSize: '13px',
            fontWeight: 500
          }}>
            {config.icon}
            {text}
          </div>
        )
      }
    },
    { 
      title: '学员人数', 
      dataIndex: 'students', 
      width: 120,
      align: 'center',
      render: (text) => (
        <Badge 
          count={text} 
          style={{ 
            backgroundColor: '#6366F1',
            fontSize: '13px',
            fontWeight: 600,
            padding: '0 8px',
            height: '22px',
            lineHeight: '22px',
            borderRadius: '11px'
          }} 
        />
      )
    },
    { 
      title: '更新人', 
      dataIndex: 'updater', 
      width: 140,
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
            fontWeight: 600
          }}>
            {text ? text.charAt(0) : 'U'}
          </div>
          <span style={{ color: theme.text.primary, fontSize: '14px' }}>{text || '未知'}</span>
        </div>
      )
    },
    { 
      title: '更新时间', 
      dataIndex: 'updateTime', 
      width: 180,
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.text.secondary }}>
          <ClockCircleOutlined style={{ fontSize: '14px' }} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record, index) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              style={{
                color: '#6366F1',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: hoveredRow === index ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
              }}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => {
                message.info(`查看课程：${record.name}`)
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              style={{
                color: '#F59E0B',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: hoveredRow === index ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
              }}
              onClick={() => {
                setIsEditMode(true)
                setCurrentRecord(record)
                // 填充表单数据
                setCourseName(record.name || '')
                setCourseCategory(record.category || undefined)
                setCourseStatus(record.status === '进行中' ? 'ongoing' : record.status === '已完成' ? 'completed' : 'pending')
                setCourseDescription(record.description || '')
                setIsModalOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{
                color: '#EF4444',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: hoveredRow === index ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
              }}
              onClick={() => {
                Modal.confirm({
                  title: '确认删除',
                  content: `确定要删除课程「${record.name}」吗？`,
                  okText: '确认删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => {
                    message.success(`已删除课程：${record.name}`)
                  }
                })
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const data = [
    { key: '1', name: 'CNC加工中心操作培训', status: '进行中', students: 32, updater: '张老师', updateTime: '2026-03-15 10:30' },
    { key: '2', name: '数控编程基础课程', status: '已完成', students: 45, updater: '李老师', updateTime: '2026-03-14 14:20' },
    { key: '3', name: '机械制图与识图', status: '进行中', students: 28, updater: '王老师', updateTime: '2026-03-13 09:15' },
    { key: '4', name: '安全生产规范培训', status: '未开始', students: 0, updater: '赵老师', updateTime: '2026-03-12 16:45' },
    { key: '5', name: '质量检测技术', status: '已完成', students: 38, updater: '刘老师', updateTime: '2026-03-11 11:20' },
  ]

  // 数字动画函数
  const animateNumbers = () => {
    const targets = [24, 8, 16]
    const progressTargets = [75, 33, 67]
    const duration = 1200
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      
      setAnimatedValues(targets.map(target => Math.round(target * easeProgress)))
      setProgressValues(progressTargets.map(target => Math.round(target * easeProgress)))
      
      if (step >= steps) {
        clearInterval(timer)
        setAnimatedValues(targets)
        setProgressValues(progressTargets)
      }
    }, interval)
  }
  
  // 页面加载时触发动画
  useEffect(() => {
    animateNumbers()
  }, [])
  
  // 刷新数据
  const handleRefresh = () => {
    setLoading(true)
    setAnimatedValues([0, 0, 0])
    setProgressValues([0, 0, 0])
    setTimeout(() => {
      setLoading(false)
      animateNumbers()
      message.success('数据已刷新')
    }, 800)
  }

  // 下载模板
  const handleDownloadTemplate = () => {
    const template = '课程名称,课程分类,课程状态,课程简介\n示例课程,CNC加工,ongoing,这是一个示例课程简介'
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '课程导入模板.csv'
    link.click()
    message.success('模板下载成功')
  }

  // 批量导入
  const handleBatchImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.xlsx,.xls'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        message.loading('正在导入...', 1.5)
        setTimeout(() => {
          message.success(`成功导入课程数据：${file.name}`)
        }, 1500)
      }
    }
    input.click()
  }

  // 批量导出
  const handleBatchExport = () => {
    const selectedData = data.filter(item => selectedRowKeys.includes(item.key))
    const csvContent = [
      '课程名称,课程状态,学员人数,更新人,更新时间',
      ...selectedData.map(item => `${item.name},${item.status},${item.students},${item.updater},${item.updateTime}`)
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `课程导出_${new Date().toLocaleDateString()}.csv`
    link.click()
    message.success(`成功导出 ${selectedData.length} 条课程数据`)
  }

  return (
    <div style={{ padding: '24px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* 页面头部 - 极致精致数据展示 */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        {/* 背景装饰 - 网格纹理 */}
        <div style={{
          position: 'absolute',
          top: -20,
          left: -20,
          right: -20,
          bottom: -20,
          background: isDark
            ? 'radial-gradient(circle at 20% 50%, rgba(10, 132, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(90, 200, 250, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* 浮动光球装饰 */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(10, 132, 255, 0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(52, 199, 89, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          filter: 'blur(35px)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          {stats.map((stat, index) => (
            <div
                key={index}
                className="stat-card"
                style={{
                  position: 'relative',
                  padding: '20px',
                  borderRadius: '16px',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(30, 37, 56, 0.8) 0%, rgba(21, 27, 43, 0.9) 100%)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.15)' : theme.border.light}`,
                  boxShadow: isDark
                    ? `0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 30px ${stat.color}10`
                    : `0 0 0 1px rgba(255,255,255,0.9) inset, 0 1px 3px rgba(0,0,0,0.05), 0 16px 32px -10px rgba(0,0,0,0.08), 0 0 0 1px ${stat.color}08`,
                  transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transform: 'translateZ(0)'
                }}
              >
              {/* 顶部发光边框 */}
              <div
                className="stat-glow-border"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '1px',
                  background: isDark
                    ? `linear-gradient(90deg, transparent 0%, ${stat.color} 30%, ${stat.color} 70%, transparent 100%)`
                    : `linear-gradient(90deg, transparent 0%, ${stat.color}60 50%, transparent 100%)`,
                  opacity: isDark ? 0.6 : 0.8,
                  transition: 'opacity 0.3s ease',
                  boxShadow: isDark ? `0 0 10px ${stat.color}` : 'none'
                }}
              />

              {/* 内部光晕 */}
              <div
                className="stat-inner-glow"
                style={{
                  position: 'absolute',
                  top: '-20%',
                  left: '-20%',
                  width: '140%',
                  height: '140%',
                  background: isDark
                    ? `radial-gradient(circle at 30% 20%, ${stat.color}20 0%, transparent 50%)`
                    : `radial-gradient(circle at 30% 20%, ${stat.color}12 0%, transparent 40%)`,
                  opacity: 0.6,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none'
                }}
              />

              {/* 角落装饰 */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: stat.color,
                opacity: isDark ? 0.8 : 0.6,
                boxShadow: isDark ? `0 0 12px ${stat.color}, 0 0 20px ${stat.color}60` : `0 0 8px ${stat.color}80`
              }} />
              
              {/* 内容区域 */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* 第一行：标签 */}
                <div style={{
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                    letterSpacing: '0.5px'
                  }}>
                    {stat.label}
                  </span>
                </div>

                {/* 第二行：大数字和趋势（同一行） */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: '12px'
                }}>
                  {/* 大数字 */}
                  <div style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#111111',
                    lineHeight: 1,
                    letterSpacing: '-1px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    transition: 'all 0.3s ease'
                  }}>
                    {animatedValues[index]}
                  </div>

                  {/* 趋势指示器 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: stat.trendUp
                        ? (isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                        : (isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'),
                      border: `1px solid ${stat.trendUp
                        ? (isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)')
                        : (isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.2)')}`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: stat.trendUp ? '#10B981' : '#EF4444'
                    }}>
                      {stat.trendUp ? '↑' : '↓'} {stat.trend}
                    </span>
                  </div>
                </div>
                
                {/* 第三行：进度条（带动画） */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${progressValues[index]}%`,
                      height: '100%',
                      borderRadius: '2px',
                      background: `linear-gradient(90deg, ${stat.color}60, ${stat.color})`,
                      boxShadow: `0 0 8px ${stat.color}40`,
                      transition: 'width 0.05s linear'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                    minWidth: '28px',
                    textAlign: 'right'
                  }}>
                    {progressValues[index]}%
                  </span>
                </div>
              </div>
              
              {/* 右侧图标 - 带旋转渐变边框 */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isDark
                  ? `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`
                  : `linear-gradient(135deg, ${stat.color}12, ${stat.color}03)`,
                border: `1px solid ${isDark ? `${stat.color}25` : `${stat.color}15`}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: stat.color,
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: `0 2px 8px ${stat.color}20`
              }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 搜索筛选区域 */}
      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '16px',
          background: theme.background.paper,
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${theme.border.light}`,
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* 标题栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: showAdvancedFilter ? `1px solid ${theme.border.light}` : 'none'
        }}>
          {/* 左侧：标题 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '4px',
              height: '18px',
              borderRadius: '2px',
              background: 'linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%)'
            }} />
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.text.primary
            }}>
              筛选条件
            </span>
          </div>
          
          {/* 右侧：收起/展开按钮 */}
          <Button
            type="text"
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            style={{
              height: '32px',
              padding: '0 8px',
              color: theme.text.secondary,
              fontSize: '13px'
            }}
          >
            {showAdvancedFilter ? '收起' : '展开'}
            <DownOutlined 
              style={{ 
                marginLeft: '4px',
                fontSize: '12px',
                transform: showAdvancedFilter ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} 
            />
          </Button>
        </div>
        
        {/* 筛选内容区域 */}
        {showAdvancedFilter && (
          <div className="filter-section" style={{
            padding: '28px',
            background: isDark
              ? 'linear-gradient(180deg, rgba(30, 37, 56, 0.6) 0%, rgba(21, 27, 43, 0.8) 100%)'
              : '#FAFAFA',
            animation: 'slideDown 0.3s ease-out',
            borderTop: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.1)' : theme.border.light}`
          }}>
            {/* 筛选条件网格 - 2x2 布局 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              {/* 课程名称 */}
              <div className="filter-item">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <BookFilled style={{
                    fontSize: '14px',
                    color: isDark ? '#8B5CF6' : '#6366F1'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: theme.text.primary
                  }}>
                    课程名称
                  </span>
                </div>
                <Input
                  placeholder="请输入课程名称关键词"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="filter-input"
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(11, 15, 25, 0.6)' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : theme.border.light}`,
                    color: theme.text.primary,
                    fontSize: '14px',
                    padding: '0 16px',
                    transition: 'all 0.3s ease'
                  }}
                  allowClear
                />
              </div>

              {/* 状态 */}
              <div className="filter-item">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <ClockCircleFilled style={{
                    fontSize: '14px',
                    color: isDark ? '#F59E0B' : '#F59E0B'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: theme.text.primary
                  }}>
                    课程状态
                  </span>
                </div>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="请选择状态"
                  className="filter-select"
                  style={{
                    width: '100%',
                    height: '44px'
                  }}
                  dropdownStyle={{
                    borderRadius: '12px',
                    background: isDark ? '#151B2B' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : '#E5E7EB'}`,
                    boxShadow: isDark ? '0 10px 40px rgba(0, 0, 0, 0.5)' : '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Option value="all">
                    <span style={{ color: theme.text.primary }}>全部状态</span>
                  </Option>
                  <Option value="ongoing">
                    <span style={{ color: isDark ? '#F59E0B' : '#D97706' }}>● 进行中</span>
                  </Option>
                  <Option value="completed">
                    <span style={{ color: isDark ? '#10B981' : '#059669' }}>● 已完成</span>
                  </Option>
                  <Option value="pending">
                    <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>● 未开始</span>
                  </Option>
                </Select>
              </div>

              {/* 分类 */}
              <div className="filter-item">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <AppstoreFilled style={{
                    fontSize: '14px',
                    color: isDark ? '#3B82F6' : '#3B82F6'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: theme.text.primary
                  }}>
                    课程分类
                  </span>
                </div>
                <Select
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  placeholder="请选择分类"
                  className="filter-select"
                  style={{
                    width: '100%',
                    height: '44px'
                  }}
                  dropdownStyle={{
                    borderRadius: '12px',
                    background: isDark ? '#151B2B' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : '#E5E7EB'}`,
                    boxShadow: isDark ? '0 10px 40px rgba(0, 0, 0, 0.5)' : '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Option value="all">
                    <span style={{ color: theme.text.primary }}>全部分类</span>
                  </Option>
                  <Option value="cnc">
                    <span style={{ color: theme.text.primary }}>🔧 CNC加工</span>
                  </Option>
                  <Option value="programming">
                    <span style={{ color: theme.text.primary }}>💻 数控编程</span>
                  </Option>
                  <Option value="safety">
                    <span style={{ color: theme.text.primary }}>🛡️ 安全培训</span>
                  </Option>
                  <Option value="quality">
                    <span style={{ color: theme.text.primary }}>📊 质量检测</span>
                  </Option>
                </Select>
              </div>

              {/* 时间范围 */}
              <div className="filter-item">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <CalendarFilled style={{
                    fontSize: '14px',
                    color: isDark ? '#EC4899' : '#EC4899'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: theme.text.primary
                  }}>
                    时间范围
                  </span>
                </div>
                <Select
                  value={timeFilter}
                  onChange={(value) => {
                    setTimeFilter(value)
                    if (value !== 'custom') {
                      setCustomDateRange(null)
                    }
                  }}
                  placeholder="请选择时间范围"
                  className="filter-select"
                  style={{
                    width: '100%',
                    height: '44px'
                  }}
                  dropdownStyle={{
                    borderRadius: '12px',
                    background: isDark ? '#151B2B' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : '#E5E7EB'}`,
                    boxShadow: isDark ? '0 10px 40px rgba(0, 0, 0, 0.5)' : '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Option value="all">
                    <span style={{ color: theme.text.primary }}>全部时间</span>
                  </Option>
                  <Option value="today">
                    <span style={{ color: theme.text.primary }}>📅 今天</span>
                  </Option>
                  <Option value="week">
                    <span style={{ color: theme.text.primary }}>📅 本周</span>
                  </Option>
                  <Option value="month">
                    <span style={{ color: theme.text.primary }}>📅 本月</span>
                  </Option>
                  <Option value="year">
                    <span style={{ color: theme.text.primary }}>📅 本年</span>
                  </Option>
                  <Option value="custom">
                    <span style={{ color: isDark ? '#8B5CF6' : '#6366F1', fontWeight: 600 }}>📆 自定义...</span>
                  </Option>
                </Select>
                
                {/* 自定义日期范围选择器 */}
                {timeFilter === 'custom' && (
                  <div style={{
                    marginTop: '12px',
                    animation: 'slideDown 0.3s ease-out'
                  }}>
                    <RangePicker
                      value={customDateRange}
                      onChange={(dates) => setCustomDateRange(dates)}
                      placeholder={['开始日期', '结束日期']}
                      style={{
                        width: '100%',
                        height: '44px',
                        borderRadius: '12px',
                        background: isDark ? 'rgba(11, 15, 25, 0.6)' : '#FFFFFF',
                        border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : theme.border.light}`,
                        color: theme.text.primary
                      }}
                      dropdownClassName="custom-date-picker-dropdown"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 操作按钮区域 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '16px',
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.15)' : theme.border.light}`
            }}>
              <Button
                icon={<ReloadOutlined />}
                className="filter-reset-btn"
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : theme.border.light}`,
                  background: isDark ? 'rgba(11, 15, 25, 0.5)' : '#FFFFFF',
                  color: theme.text.secondary,
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '0 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  setStatusFilter('all')
                  setCategoryFilter('all')
                  setSearchText('')
                  setTimeFilter('all')
                  setCustomDateRange(null)
                  setFilteredData(null)
                  message.info('已重置筛选条件')
                }}
              >
                重置条件
              </Button>
              <Button
                type="primary"
                icon={isSearching ? <LoadingOutlined /> : <SearchOutlined />}
                loading={isSearching}
                onClick={handleSearch}
                className="glow-button-primary filter-search-btn"
                style={{
                  height: '44px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '0 32px',
                  boxShadow: isDark ? '0 8px 30px rgba(99, 102, 241, 0.4)' : '0 4px 14px rgba(99, 102, 241, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {isSearching ? '查询中...' : '查询筛选'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 数据表格 */}
      <Card
        style={{
          borderRadius: '16px',
          background: theme.background.paper,
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${theme.border.light}`,
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '20px' }}
        title={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '4px 0'
          }}>
            {/* 左侧：主要操作按钮 */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {selectedRowKeys.length > 0 && (
                <span style={{
                  fontSize: '13px',
                  color: theme.text.secondary,
                  marginRight: '8px'
                }}>
                  已选择 <strong style={{ color: '#6366F1' }}>{selectedRowKeys.length}</strong> 项
                </span>
              )}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsEditMode(false)
                  setCurrentRecord(null)
                  // 重置表单
                  setCourseName('')
                  setCourseCategory(undefined)
                  setCourseStatus(undefined)
                  setCourseDescription('')
                  setIsModalOpen(true)
                }}
                className="glow-button-primary"
                style={{
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
                  border: 'none',
                  boxShadow: isDark ? '0 8px 30px rgba(99, 102, 241, 0.4)' : '0 4px 14px rgba(99, 102, 241, 0.4)',
                  fontWeight: 600,
                  fontSize: '13px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>新增课程</span>
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />} 
                disabled={selectedRowKeys.length === 0}
                style={{
                  height: '34px',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
                onClick={() => {
                  Modal.confirm({
                    title: '确认批量删除',
                    content: `确定要删除选中的 ${selectedRowKeys.length} 个课程吗？`,
                    okText: '确认删除',
                    okButtonProps: { danger: true },
                    cancelText: '取消',
                    onOk: () => {
                      message.success(`已删除 ${selectedRowKeys.length} 个课程`)
                      setSelectedRowKeys([])
                    }
                  })
                }}
              >
                批量删除 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
            </div>
            
            {/* 右侧：批量操作按钮 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadTemplate}
                style={{
                  height: '34px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  border: `1px solid ${theme.border.light}`,
                  color: theme.text.secondary
                }}
              >
                下载模版
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={handleBatchImport}
                style={{
                  height: '34px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  border: `1px solid ${theme.border.light}`,
                  color: theme.text.secondary
                }}
              >
                批量导入
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleBatchExport}
                disabled={selectedRowKeys.length === 0}
                style={{
                  height: '34px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  border: `1px solid ${theme.border.light}`,
                  color: theme.text.secondary
                }}
              >
                批量导出
              </Button>
            </div>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData || data}
          onRow={(record, index) => ({
            onMouseEnter: () => setHoveredRow(index),
            onMouseLeave: () => setHoveredRow(null),
            style: {
              background: hoveredRow === index
                ? isDark
                  ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.03) 50%, transparent 100%)'
                : 'transparent',
              borderLeft: hoveredRow === index ? '3px solid #6366F1' : '3px solid transparent',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => (
              <span style={{
                color: theme.text.secondary,
                fontSize: '14px',
                marginRight: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>显示</span>
                <strong style={{ color: '#6366F1', fontWeight: 600 }}>{range[0]}-{range[1]}</strong>
                <span>条，共</span>
                <strong style={{ color: '#6366F1', fontWeight: 600 }}>{total}</strong>
                <span>条记录</span>
              </span>
            ),
            itemRender: (page, type, originalElement) => {
              if (type === 'page') {
                return (
                  <div style={{
                    minWidth: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: page === 1 ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
                    color: page === 1 ? '#fff' : theme.text.primary,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: page === 1 ? 'none' : `1px solid ${theme.border.light}`
                  }}>
                    {page}
                  </div>
                )
              }
              return originalElement
            },
            style: { padding: '16px 24px', margin: 0 }
          }}
          loading={loading}
          rowClassName={() => 'custom-table-row'}
          style={{
            '--table-header-bg': isDark ? 'rgba(99, 102, 241, 0.1)' : '#F9FAFB',
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedKeys) => {
              setSelectedRowKeys(selectedKeys)
            },
            columnWidth: 50,
            selections: [
              {
                key: 'all',
                text: '全选所有',
                onSelect: () => {
                  setSelectedRowKeys(data.map(item => item.key))
                }
              },
              {
                key: 'invert',
                text: '反选',
                onSelect: () => {
                  setSelectedRowKeys(
                    data.map(item => item.key).filter(key => !selectedRowKeys.includes(key))
                  )
                }
              },
              {
                key: 'none',
                text: '清空选择',
                onSelect: () => {
                  setSelectedRowKeys([])
                }
              }
            ]
          }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={840}
        bodyStyle={{
          padding: '0',
          borderRadius: '16px',
          overflow: 'hidden',
          background: theme.background.paper
        }}
        style={{
          borderRadius: '16px'
        }}
        closable={false}
        centered
        wrapClassName={isDark ? 'dark-modal-wrapper' : ''}
      >
        <div style={{ display: 'flex', minHeight: '520px' }}>
          {/* 左侧步骤导航 */}
          <div style={{
            width: '200px',
            background: isDark
              ? theme.background.elevated
              : 'linear-gradient(180deg, #F8F7FF 0%, #F0EEFF 100%)',
            padding: '28px 20px',
            borderRight: `1px solid ${theme.border.light}`,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* 标题 */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: isEditMode
                  ? (isDark ? '#FF9500' : 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)')
                  : (isDark ? '#0A84FF' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: isEditMode
                  ? (isDark ? '0 4px 12px rgba(255, 149, 0, 0.3)' : '0 4px 12px rgba(245, 158, 11, 0.4)')
                  : (isDark ? '0 4px 12px rgba(10, 132, 255, 0.3)' : '0 4px 12px rgba(99, 102, 241, 0.4)'),
                marginBottom: '12px'
              }}>
                {isEditMode ? <EditOutlined style={{ fontSize: '22px' }} /> : <PlusOutlined style={{ fontSize: '22px' }} />}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: theme.text.primary }}>
                {isEditMode ? '编辑课程' : '新增课程'}
              </div>
              <div style={{ fontSize: '12px', color: theme.text.secondary, marginTop: '4px' }}>
                {isEditMode ? currentRecord?.name || '修改课程信息' : '分步填写信息'}
              </div>
            </div>

            {/* 步骤列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {[
                { num: 1, title: '基本信息', desc: '名称与分类' },
                { num: 2, title: '课程详情', desc: '简介与设置' },
                { num: 3, title: '封面设置', desc: '上传封面图' }
              ].map((step, idx) => (
                <div
                  key={step.num}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: idx === 0 ? (isDark ? 'rgba(10, 132, 255, 0.15)' : '#fff') : 'transparent',
                    border: idx === 0 ? `1px solid ${isDark ? 'rgba(10, 132, 255, 0.3)' : '#E0DCFF'}` : '1px solid transparent',
                    boxShadow: idx === 0 ? (isDark ? 'none' : '0 2px 8px rgba(99, 102, 241, 0.1)') : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: idx === 0 ? (isDark ? '#0A84FF' : '#6366F1') : (isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: idx === 0 ? '#fff' : theme.text.secondary,
                    flexShrink: 0
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: idx === 0 ? (isDark ? '#0A84FF' : '#6366F1') : theme.text.primary
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: theme.text.secondary,
                      marginTop: '2px'
                    }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部提示 */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.05)',
              fontSize: '11px',
              color: theme.text.secondary,
              lineHeight: 1.5
            }}>
              <InfoCircleOutlined style={{ marginRight: '6px', color: '#6366F1' }} />
              带 <span style={{ color: '#EF4444' }}>*</span> 的为必填项
            </div>
          </div>

          {/* 右侧表单区域 */}
          <div style={{
            flex: 1,
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            background: theme.background.paper
          }}>
            {/* 表单内容 */}
            <div style={{ flex: 1 }}>
              {/* 分组标题 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: `1px solid ${theme.border.light}`
              }}>
                <BookOutlined style={{ color: isDark ? '#0A84FF' : '#6366F1', fontSize: '16px' }} />
                <span style={{ fontSize: '15px', fontWeight: 600, color: theme.text.primary }}>
                  基本信息
                </span>
                <span style={{
                  fontSize: '12px',
                  color: theme.text.secondary,
                  marginLeft: 'auto',
                  padding: '2px 8px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
                  borderRadius: '4px'
                }}>
                  步骤 1/3
                </span>
              </div>

              {/* 表单字段 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* 课程名称 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: theme.text.primary,
                    marginBottom: '6px'
                  }}>
                    课程名称 <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <Input
                    placeholder="请输入课程名称"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    prefix={<BookOutlined style={{ color: theme.text.secondary, fontSize: '14px' }} />}
                    style={{
                      height: '42px',
                      borderRadius: '10px',
                      border: `1px solid ${theme.border.light}`,
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: theme.text.secondary, marginTop: '4px' }}>
                    建议名称简洁明了，不超过30个字符
                  </div>
                </div>

                {/* 课程分类 & 状态 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: theme.text.primary,
                      marginBottom: '6px'
                    }}>
                      课程分类 <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <Select
                      placeholder="请选择"
                      value={courseCategory}
                      onChange={setCourseCategory}
                      suffixIcon={<TagsOutlined style={{ color: theme.text.secondary }} />}
                      style={{ width: '100%', height: '42px' }}
                      dropdownStyle={{ borderRadius: '10px' }}
                    >
                      <Option value="cnc">CNC加工</Option>
                      <Option value="programming">数控编程</Option>
                      <Option value="safety">安全培训</Option>
                      <Option value="quality">质量检测</Option>
                    </Select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: theme.text.primary,
                      marginBottom: '6px'
                    }}>
                      课程状态 <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <Select
                      placeholder="请选择"
                      value={courseStatus}
                      onChange={setCourseStatus}
                      suffixIcon={<ClockCircleOutlined style={{ color: theme.text.secondary }} />}
                      style={{ width: '100%', height: '42px' }}
                      dropdownStyle={{ borderRadius: '10px' }}
                    >
                      <Option value="ongoing">进行中</Option>
                      <Option value="completed">已完成</Option>
                      <Option value="pending">未开始</Option>
                    </Select>
                  </div>
                </div>

                {/* 课程简介 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: theme.text.primary,
                    marginBottom: '6px'
                  }}>
                    课程简介
                  </label>
                  <Input.TextArea
                    placeholder="请输入课程简介，帮助学员了解课程内容..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows={3}
                    maxLength={200}
                    style={{
                      borderRadius: '10px',
                      border: `1px solid ${theme.border.light}`,
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                      fontSize: '14px',
                      resize: 'none'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: theme.text.secondary,
                    marginTop: '4px'
                  }}>
                    <span>简要描述课程目标和内容</span>
                    <span>{courseDescription.length}/200</span>
                  </div>
                </div>

                {/* 封面上传 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: theme.text.primary,
                    marginBottom: '6px'
                  }}>
                    课程封面
                  </label>
                  <div
                    className="upload-area"
                    style={{
                      border: `2px dashed ${theme.border.light}`,
                      borderRadius: '12px',
                      padding: '28px',
                      textAlign: 'center',
                      background: isDark ? 'rgba(255,255,255,0.02)' : '#FAFAFA',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#6366F1'
                      e.currentTarget.style.background = isDark ? 'rgba(99, 102, 241, 0.05)' : '#F5F3FF'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.border.light
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : '#FAFAFA'
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      fontSize: '24px',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                    }}>
                      <CameraOutlined />
                    </div>
                    <div style={{ fontSize: '14px', color: theme.text.primary, fontWeight: 500 }}>
                      点击或拖拽上传封面
                    </div>
                    <div style={{ fontSize: '12px', color: theme.text.secondary, marginTop: '6px' }}>
                      支持 JPG、PNG 格式，建议尺寸 16:9，最大 5MB
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '12px',
                      padding: '6px 14px',
                      background: isDark ? 'rgba(99, 102, 241, 0.1)' : '#EEF2FF',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#6366F1',
                      fontWeight: 500
                    }}>
                      <UploadOutlined /> 选择文件
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: `1px solid ${theme.border.light}`
            }}>
              <Button
                onClick={() => setIsModalOpen(false)}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.border.light}`,
                  color: theme.text.secondary,
                  fontSize: '14px'
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                className={isEditMode ? 'glow-button-warning' : 'glow-button-primary'}
                style={{
                  height: '42px',
                  padding: '0 28px',
                  borderRadius: '10px',
                  background: isEditMode
                    ? 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
                    : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  boxShadow: isDark
                    ? (isEditMode ? '0 8px 30px rgba(245, 158, 11, 0.4)' : '0 8px 30px rgba(99, 102, 241, 0.4)')
                    : (isEditMode ? '0 4px 12px rgba(245, 158, 11, 0.4)' : '0 4px 12px rgba(99, 102, 241, 0.4)'),
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  message.success(isEditMode ? '课程修改成功！' : '课程创建成功！')
                  setIsModalOpen(false)
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>{isEditMode ? '确认修改' : '确认添加'}</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 全局样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .custom-table-row:hover td {
          background: ${isDark ? 'rgba(99, 102, 241, 0.05)' : '#F9FAFB'} !important;
          transition: all 0.3s ease;
        }
        
        .ant-table-thead > tr > th {
          background: ${isDark ? 'rgba(99, 102, 241, 0.1)' : '#F9FAFB'} !important;
          font-weight: 600;
          color: ${theme.text.primary};
          border-bottom: 2px solid ${theme.border.light};
        }
        
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${theme.border.light};
          padding: 16px !important;
        }
        
        .ant-pagination-item-active {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
          border-color: transparent !important;
        }
        
        .ant-pagination-item-active a {
          color: #fff !important;
        }
        
        .ant-select-selector {
          border-radius: 10px !important;
          height: 40px !important;
          display: flex;
          align-items: center;
        }
        
        .ant-select-selection-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .ant-pagination-total-text {
          order: -1;
          margin-right: auto !important;
        }
        
        .ant-pagination {
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        .ant-pagination-options {
          margin-left: 16px;
        }
        
        .ant-pagination-item {
          border-radius: 8px;
          border: 1px solid ${theme.border.light};
          transition: all 0.3s ease;
          min-width: 32px;
          height: 32px;
          line-height: 30px;
        }
        
        .ant-pagination-item:hover {
          border-color: #6366F1;
          color: #6366F1;
        }
        
        .ant-pagination-item-active {
          background: ${isDark ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'} !important;
          border-color: transparent !important;
          box-shadow: ${isDark ? '0 8px 25px rgba(99, 102, 241, 0.5)' : '0 4px 12px rgba(99, 102, 241, 0.4)'} !important;
          position: relative;
          overflow: hidden;
        }

        .ant-pagination-item-active::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmerButton 2.5s infinite;
          pointer-events: none;
        }
        
        .ant-pagination-item-active a {
          color: #fff !important;
        }
        
        .ant-pagination-prev, .ant-pagination-next {
          border-radius: 8px;
          min-width: 32px;
          height: 32px;
          line-height: 30px;
          border: 1px solid ${theme.border.light};
        }
        
        .ant-pagination-prev:hover, .ant-pagination-next:hover {
          border-color: ${theme.primary.main};
          color: ${theme.primary.main};
        }
        
        .ant-pagination-disabled {
          opacity: 0.5;
        }
        
        .ant-select-selector {
          border-radius: 8px !important;
          height: 32px !important;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: ${isDark ? 'rgba(139, 92, 246, 0.3)' : theme.border.main} !important;
        }

        .stat-card:hover .stat-glow-border {
          opacity: 1 !important;
        }

        .stat-card:hover .stat-inner-glow {
          opacity: ${isDark ? '1' : '0.8'} !important;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        @keyframes shimmerButton {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        /* ========== 精致深色主题配色系统 ========== */
        
        /* 背景层次 */
        .ant-modal-content,
        .ant-card,
        .ant-card-head,
        .ant-card-body,
        .ant-table,
        .ant-table-container,
        .ant-table-content {
          background: ${theme.background.paper} !important;
          border-color: ${theme.border.light} !important;
        }

        /* 深色主题下卡片样式 */
        ${isDark ? `
        .ant-card {
          border: 1px solid ${theme.border.light} !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
          background: ${theme.background.paper} !important;
        }

        .ant-card:hover {
          border-color: rgba(139, 92, 246, 0.3) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.1) !important;
        }
        ` : ''}

        /* 表头使用 elevated 背景 */
        .ant-table-thead > tr > th {
          background: ${isDark ? theme.background.elevated : '#F9FAFB'} !important;
          color: ${theme.text.primary} !important;
          border-bottom-color: ${theme.border.light} !important;
          ${isDark ? 'font-weight: 600;' : ''}
        }

        /* 表格行背景 */
        .ant-table-tbody > tr > td {
          background: ${theme.background.paper} !important;
          color: ${theme.text.primary} !important;
          border-bottom-color: ${theme.border.light} !important;
        }

        /* 表格行悬停效果 - 配合 onRow 使用 */
        .ant-table-tbody > tr.custom-hover-row > td {
          background: transparent !important;
          border-bottom: 1px solid ${isDark ? 'rgba(139, 92, 246, 0.1)' : theme.border.light} !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .ant-table-tbody > tr.custom-hover-row:hover > td {
          background: transparent !important;
        }

        /* 选中行 */
        .ant-table-tbody > tr.ant-table-row-selected > td {
          background: ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.05)'} !important;
        }

        /* 输入控件统一背景 */
        .ant-input,
        .ant-select-selector,
        .ant-input-textarea > textarea {
          background: ${isDark ? theme.background.elevated : '#F9FAFB'} !important;
          border-color: ${theme.border.light} !important;
          color: ${theme.text.primary} !important;
          ${isDark ? 'transition: all 0.3s ease;' : ''}
        }

        /* 深色主题输入框悬停效果 */
        ${isDark ? `
        .ant-input:hover,
        .ant-select-selector:hover,
        .ant-input-textarea > textarea:hover {
          border-color: #484F58 !important;
        }
        ` : ''}

        /* 输入控件焦点状态 */
        .ant-input:focus,
        .ant-input-focused,
        .ant-select-focused .ant-select-selector {
          border-color: ${theme.primary.main} !important;
          box-shadow: ${isDark ? '0 0 0 2px rgba(139, 92, 246, 0.2)' : '0 0 0 2px rgba(99, 102, 241, 0.1)'} !important;
        }

        /* 深色主题输入框样式 */
        ${isDark ? `
        .ant-input {
          background: ${theme.background.input} !important;
          border-color: ${theme.border.light} !important;
          color: ${theme.text.primary} !important;
        }

        .ant-input::placeholder {
          color: ${theme.text.disabled} !important;
        }

        .ant-select-selector {
          background: ${theme.background.input} !important;
          border-color: ${theme.border.light} !important;
          color: ${theme.text.primary} !important;
        }

        .ant-select-selection-placeholder {
          color: ${theme.text.disabled} !important;
        }
        ` : ''}

        /* 占位符文字 */
        .ant-input::placeholder,
        .ant-select-selection-placeholder {
          color: ${theme.text.disabled} !important;
        }

        /* 默认按钮 */
        .ant-btn-default {
          background: ${isDark ? theme.background.elevated : '#fff'} !important;
          border-color: ${theme.border.light} !important;
          color: ${theme.text.primary} !important;
          ${isDark ? 'transition: all 0.3s ease;' : ''}
        }

        .ant-btn-default:hover {
          border-color: ${theme.primary.main} !important;
          color: ${theme.primary.main} !important;
          background: ${isDark ? 'rgba(10, 132, 255, 0.1)' : '#EFF6FF'} !important;
        }

        /* 分页器 */
        .ant-pagination-item {
          background: ${isDark ? theme.background.elevated : '#fff'} !important;
          border-color: ${theme.border.light} !important;
          ${isDark ? 'transition: all 0.3s ease;' : ''}
        }

        .ant-pagination-item a {
          color: ${theme.text.secondary} !important;
        }

        .ant-pagination-item:hover {
          border-color: ${theme.primary.main} !important;
        }

        .ant-pagination-item:hover a {
          color: ${theme.primary.main} !important;
        }

        .ant-pagination-prev .ant-pagination-item-link,
        .ant-pagination-next .ant-pagination-item-link {
          background: ${isDark ? theme.background.elevated : '#fff'} !important;
          border-color: ${theme.border.light} !important;
          color: ${theme.text.secondary} !important;
        }

        /* 下拉菜单 */
        .ant-dropdown-menu {
          background: ${theme.background.paper} !important;
          border: 1px solid ${theme.border.light} !important;
          box-shadow: ${isDark ? '0 10px 30px rgba(0, 0, 0, 0.5)' : theme.shadow.lg} !important;
        }

        .ant-dropdown-menu-item {
          color: ${theme.text.primary} !important;
        }

        .ant-dropdown-menu-item:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#EFF6FF'} !important;
          color: ${theme.primary.main} !important;
        }

        /* Tag 标签 */
        .ant-tag {
          background: ${isDark ? theme.background.elevated : '#F1F5F9'} !important;
          border-color: ${theme.border.light} !important;
          color: ${theme.text.primary} !important;
        }

        /* 高亮按钮光晕动效 - 新增课程、确认添加、分页选中 */
        .glow-button-primary {
          position: relative;
          overflow: hidden;
        }

        .glow-button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmerButton 2.5s infinite;
          pointer-events: none;
        }

        .glow-button-primary:hover {
          box-shadow: ${isDark ? '0 12px 40px rgba(139, 92, 246, 0.5) !important' : '0 8px 25px rgba(99, 102, 241, 0.5) !important'};
          transform: translateY(-1px);
        }

        .glow-button-warning {
          position: relative;
          overflow: hidden;
        }

        .glow-button-warning::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmerButton 2.5s infinite;
          pointer-events: none;
        }

        .glow-button-warning:hover {
          box-shadow: ${isDark ? '0 12px 40px rgba(245, 158, 11, 0.5) !important' : '0 8px 25px rgba(245, 158, 11, 0.5) !important'};
          transform: translateY(-1px);
        }

        /* 深色主题下主要按钮样式 */
        ${isDark ? `
        .ant-btn-primary {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%) !important;
          border: none !important;
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4) !important;
        }

        .ant-btn-primary:hover {
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.5) !important;
          transform: translateY(-1px);
        }
        ` : ''}

        /* 复选框 */
        .ant-checkbox-inner {
          background: ${isDark ? theme.background.elevated : '#fff'} !important;
          border-color: ${theme.border.main} !important;
        }

        .ant-checkbox-checked .ant-checkbox-inner {
          background: ${theme.primary.main} !important;
          border-color: ${theme.primary.main} !important;
        }

        /* Modal 特殊处理 */
        .ant-modal-header {
          background: ${theme.background.paper} !important;
          border-bottom-color: ${theme.border.light} !important;
        }

        .ant-modal-title {
          color: ${theme.text.primary} !important;
        }

        .ant-modal-close-x {
          color: ${theme.text.secondary} !important;
        }

        .ant-modal-close-x:hover {
          color: ${theme.text.primary} !important;
          background: ${isDark ? theme.background.elevated : '#F1F5F9'} !important;
        }

        /* 深色主题 Modal 样式 */
        ${isDark ? `
        .dark-modal-wrapper .ant-modal-content {
          background: ${theme.background.paper} !important;
          border: 1px solid ${theme.border.light} !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .dark-modal-wrapper .ant-modal-body {
          background: ${theme.background.paper} !important;
        }
        ` : ''}

        /* 筛选区域 */
        .filter-section {
          background: ${isDark ? 'linear-gradient(180deg, rgba(30, 37, 56, 0.6) 0%, rgba(21, 27, 43, 0.8) 100%)' : '#FAFAFA'} !important;
          border-color: ${isDark ? 'rgba(139, 92, 246, 0.1)' : theme.border.light} !important;
        }

        /* 筛选项 */
        .filter-item {
          transition: all 0.3s ease;
        }

        .filter-item:hover {
          transform: translateX(4px);
        }

        /* 筛选输入框 */
        .filter-input {
          transition: all 0.3s ease !important;
        }

        .filter-input:hover {
          border-color: ${isDark ? 'rgba(139, 92, 246, 0.4)' : '#C4B5FD'} !important;
        }

        .filter-input:focus {
          border-color: ${theme.primary.main} !important;
          box-shadow: ${isDark ? '0 0 0 3px rgba(139, 92, 246, 0.15), 0 0 20px rgba(139, 92, 246, 0.1)' : '0 0 0 3px rgba(99, 102, 241, 0.1)'} !important;
        }

        /* 筛选下拉框 */
        .filter-select .ant-select-selector {
          background: ${isDark ? 'rgba(11, 15, 25, 0.6)' : '#FFFFFF'} !important;
          border: 1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : theme.border.light} !important;
          border-radius: 12px !important;
          height: 44px !important;
          transition: all 0.3s ease !important;
        }

        .filter-select:hover .ant-select-selector {
          border-color: ${isDark ? 'rgba(139, 92, 246, 0.4)' : '#C4B5FD'} !important;
        }

        .filter-select.ant-select-focused .ant-select-selector {
          border-color: ${theme.primary.main} !important;
          box-shadow: ${isDark ? '0 0 0 3px rgba(139, 92, 246, 0.15), 0 0 20px rgba(139, 92, 246, 0.1)' : '0 0 0 3px rgba(99, 102, 241, 0.1)'} !important;
        }

        .filter-select .ant-select-selection-placeholder {
          color: ${theme.text.disabled} !important;
        }

        /* 下拉菜单样式 */
        .ant-select-dropdown {
          background: ${isDark ? '#151B2B' : '#FFFFFF'} !important;
          border: 1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : '#E5E7EB'} !important;
          border-radius: 12px !important;
          box-shadow: ${isDark ? '0 10px 40px rgba(0, 0, 0, 0.5)' : '0 10px 40px rgba(0, 0, 0, 0.1)'} !important;
        }

        .ant-select-item {
          color: ${theme.text.primary} !important;
          padding: 10px 16px !important;
          border-radius: 8px !important;
          margin: 2px 8px !important;
          transition: all 0.2s ease !important;
        }

        .ant-select-item:hover {
          background: ${isDark ? 'rgba(139, 92, 246, 0.15)' : '#F3F4F6'} !important;
        }

        .ant-select-item-option-selected {
          background: ${isDark ? 'rgba(139, 92, 246, 0.25)' : '#EEF2FF'} !important;
          font-weight: 600 !important;
        }

        /* 重置按钮 */
        .filter-reset-btn:hover {
          border-color: ${isDark ? 'rgba(139, 92, 246, 0.5)' : '#C4B5FD'} !important;
          color: ${theme.primary.main} !important;
          background: ${isDark ? 'rgba(139, 92, 246, 0.1)' : '#F5F3FF'} !important;
        }

        /* 日期选择器深色主题 */
        ${isDark ? `
        .custom-date-picker-dropdown .ant-picker-panel {
          background: #151B2B !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
          border-radius: 12px !important;
        }

        .custom-date-picker-dropdown .ant-picker-header {
          color: #F8FAFC !important;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2) !important;
        }

        .custom-date-picker-dropdown .ant-picker-header-view button:hover {
          color: #8B5CF6 !important;
        }

        .custom-date-picker-dropdown .ant-picker-cell {
          color: #94A3B8 !important;
        }

        .custom-date-picker-dropdown .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end) .ant-picker-cell-inner {
          background: rgba(139, 92, 246, 0.2) !important;
        }

        .custom-date-picker-dropdown .ant-picker-cell-in-view {
          color: #F8FAFC !important;
        }

        .custom-date-picker-dropdown .ant-picker-cell-selected .ant-picker-cell-inner,
        .custom-date-picker-dropdown .ant-picker-cell-range-start .ant-picker-cell-inner,
        .custom-date-picker-dropdown .ant-picker-cell-range-end .ant-picker-cell-inner {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
        }

        .custom-date-picker-dropdown .ant-picker-cell-in-range::before {
          background: rgba(139, 92, 246, 0.2) !important;
        }

        .custom-date-picker-dropdown .ant-picker-cell-today .ant-picker-cell-inner::before {
          border-color: #8B5CF6 !important;
        }

        .custom-date-picker-dropdown .ant-picker-content th {
          color: #94A3B8 !important;
        }

        .custom-date-picker-dropdown .ant-picker-footer {
          border-top: 1px solid rgba(139, 92, 246, 0.2) !important;
        }

        .custom-date-picker-dropdown .ant-picker-today-btn {
          color: #8B5CF6 !important;
        }

        .ant-picker-range {
          background: rgba(11, 15, 25, 0.6) !important;
          border: 1px solid rgba(139, 92, 246, 0.2) !important;
          border-radius: 12px !important;
        }

        .ant-picker-range:hover {
          border-color: rgba(139, 92, 246, 0.4) !important;
        }

        .ant-picker-range-focused {
          border-color: #8B5CF6 !important;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
        }

        .ant-picker-range .ant-picker-input > input {
          color: #F8FAFC !important;
        }

        .ant-picker-range .ant-picker-input > input::placeholder {
          color: #475569 !important;
        }

        .ant-picker-range .ant-picker-range-separator {
          color: #94A3B8 !important;
        }

        .ant-picker-suffix {
          color: #8B5CF6 !important;
        }
        ` : ''}

        /* 搜索输入框 */
        .search-input .ant-input {
          background: ${isDark ? theme.background.elevated : '#fff'} !important;
          border-color: ${theme.border.light} !important;
        }

        .search-input .ant-input-prefix {
          color: ${theme.text.disabled} !important;
        }

        /* 禁用状态统一 */
        .ant-btn-disabled,
        .ant-btn[disabled] {
          background: ${isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9'} !important;
          border-color: ${theme.border.light} !important;
          color: ${theme.text.disabled} !important;
        }

        /* 文字按钮悬停 */
        .ant-btn-text {
          color: ${theme.text.secondary} !important;
        }

        .ant-btn-text:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'} !important;
          color: ${theme.text.primary} !important;
        }
      `}</style>
    </div>
  )
}

export default MyCourse
