import React from 'react'
import ReactDOM from 'react-dom/client'
import * as antd from 'antd'
import { ConfigProvider, theme, Menu, Layout, Table, Card, Button, Tag, Badge, Input, Select, Row, Col, Drawer, Tabs, List, Avatar, Space, Modal, message, Form, Radio, Checkbox, Progress, Steps, Statistic, Timeline, Divider, Alert, Empty, DatePicker } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import * as antdIcons from '@ant-design/icons'
import {
  BookOutlined,
  FileTextOutlined,
  ToolOutlined,
  FormOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  ToolFilled,
  BuildOutlined,
  ProjectOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  EditOutlined,
  SaveOutlined,
  SendOutlined,
  TrophyOutlined,
  CalendarOutlined,
  HourglassOutlined,
  RedoOutlined,
  DeleteOutlined,
  FilterOutlined,
} from '@ant-design/icons'

// 导入学生端页面
import MyCourses from './pages/student/MyCourses'
import MyNormalTasks from './pages/student/MyNormalTasks'
import MyPracticeTasks from './pages/student/MyPracticeTasks'
import MyExams from './pages/student/MyExams'
import WrongQuestions from './pages/student/WrongQuestions'

const { darkAlgorithm, defaultAlgorithm } = theme
const { Sider, Content } = Layout

// 学生端菜单配置
const studentMenuItems = [
  {
    key: 'courses',
    icon: <BookOutlined />,
    label: '我的课程',
  },
  {
    key: 'normal-tasks',
    icon: <FileTextOutlined />,
    label: '我的普通任务',
  },
  {
    key: 'practice-tasks',
    icon: <ToolOutlined />,
    label: '我的实训任务',
  },
  {
    key: 'exams',
    icon: <FormOutlined />,
    label: '我的综合考试',
  },
  {
    key: 'wrong-questions',
    icon: <CloseCircleOutlined />,
    label: '错题集',
  },
  {
    key: 'process',
    icon: <SettingOutlined />,
    label: '工艺管理',
  },
  {
    key: 'tool-plan',
    icon: <ToolFilled />,
    label: '刀具需求计划',
  },
  {
    key: 'tool-manage',
    icon: <BuildOutlined />,
    label: '刀具管理',
  },
  {
    key: 'tool-apply',
    icon: <ToolOutlined />,
    label: '刀具补申领',
  },
  {
    key: 'project-tasks',
    icon: <ProjectOutlined />,
    label: '项目任务管理',
  },
]

// 渲染学生端页面组件
const renderStudentPage = (key) => {
  const pageProps = {
    key: Date.now(), // 强制重新挂载组件
  }

  switch (key) {
    case 'courses':
      return <MyCourses {...pageProps} />
    case 'normal-tasks':
      return <MyNormalTasks {...pageProps} />
    case 'practice-tasks':
      return <MyPracticeTasks {...pageProps} />
    case 'exams':
      return <MyExams {...pageProps} />
    case 'wrong-questions':
      return <WrongQuestions {...pageProps} />
    default:
      return (
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            background: '#f5f7fa',
            minHeight: '100vh',
          }}
        >
          <h2>页面开发中</h2>
          <p>该功能模块正在开发中，敬请期待...</p>
        </div>
      )
  }
}

// 全局主题配置
const antdTheme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
  },
}

// 将 antd 组件挂载到 window 对象，供低代码组件使用
window.antd = antd
window.antdTheme = antdTheme
window.antdIcon = antdIcons
window.DayjsLocale = { getZhCN: () => zhCN }

const AppContent = () => {
  const [selectedKey, setSelectedKey] = React.useState('courses')
  const [collapsed, setCollapsed] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme={isDark ? 'dark' : 'light'}
          style={{
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid #e8e8e8',
              fontSize: collapsed ? 14 : 18,
              fontWeight: 700,
              color: '#1890ff',
            }}
          >
            {collapsed ? '学生' : '学生端'}
          </div>
          <Menu
            theme={isDark ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[selectedKey]}
            items={studentMenuItems}
            onClick={({ key }) => setSelectedKey(key)}
            style={{ borderRight: 0 }}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: 0, padding: 0, overflow: 'auto' }}>
            {renderStudentPage(selectedKey)}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

const App = () => {
  return <AppContent />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
