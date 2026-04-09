import React, { useState } from 'react';
import {
  Layout,
  Menu,
  theme,
  Switch,
  Space,
  Typography,
  Badge
} from 'antd';
import {
  DashboardOutlined,
  ApartmentOutlined,
  InboxOutlined,
  TeamOutlined,
  PrinterOutlined,
  QrcodeOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';

// 导入各页面组件
import UnitManagement from './计量单位管理';
import CategoryManagement from './产品分类管理';
import MaterialManagement from './产品档案管理';
import CustomerManagement from './客户档案管理';
import ProductCodePrint from './产品码打印';
import WechatTrace from './微信扫码溯源';
import './index.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// 仪表盘组件
const Dashboard = () => (
  <div className="dashboard-container">
    <Title level={2} style={{ marginBottom: 24 }}>欢迎使用古麒绒材溯源管理系统</Title>
    <div className="stats-cards">
      <div className="stat-card" style={{ background: '#e6f7ff' }}>
        <div className="stat-number">50+</div>
        <div className="stat-label">产品档案</div>
      </div>
      <div className="stat-card" style={{ background: '#f6ffed' }}>
        <div className="stat-number">1000+</div>
        <div className="stat-label">溯源码打印</div>
      </div>
      <div className="stat-card" style={{ background: '#fff7e6' }}>
        <div className="stat-number">5000+</div>
        <div className="stat-label">扫码查询次数</div>
      </div>
      <div className="stat-card" style={{ background: '#f9f0ff' }}>
        <div className="stat-number">50+</div>
        <div className="stat-label">合作客户</div>
      </div>
    </div>

    <div className="module-intro" style={{ marginTop: 32 }}>
      <Title level={4}>功能模块</Title>
      <div className="module-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginTop: 16 }}>
        <div className="module-item" style={{ padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Title level={5}>基础数据管理</Title>
          <p>计量单位、产品分类、产品档案、客户档案的统一管理</p>
        </div>
        <div className="module-item" style={{ padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Title level={5}>产品码打印</Title>
          <p>生成产品溯源码，支持补打和打印记录管理</p>
        </div>
        <div className="module-item" style={{ padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Title level={5}>微信扫码溯源</Title>
          <p>消费者扫码查询产品溯源信息，支持深色模式</p>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 切换主题
  const toggleTheme = (checked) => {
    setDarkMode(checked);
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : 'light');
  };

  // 菜单项
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: 'basic',
      icon: <InboxOutlined />,
      label: '基础数据',
      children: [
        { key: 'unit', icon: <ApartmentOutlined />, label: '计量单位管理' },
        { key: 'category', icon: <ApartmentOutlined />, label: '产品分类管理' },
        { key: 'material', icon: <InboxOutlined />, label: '产品档案管理' },
        { key: 'customer', icon: <TeamOutlined />, label: '客户档案管理' },
      ],
    },
    {
      key: 'business',
      icon: <PrinterOutlined />,
      label: '业务功能',
      children: [
        { key: 'print', icon: <PrinterOutlined />, label: '产品码打印' },
        { key: 'trace', icon: <QrcodeOutlined />, label: '微信扫码溯源' },
      ],
    },
  ];

  // 渲染当前页面
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'unit':
        return <UnitManagement />;
      case 'category':
        return <CategoryManagement />;
      case 'material':
        return <MaterialManagement />;
      case 'customer':
        return <CustomerManagement />;
      case 'print':
        return <ProductCodePrint />;
      case 'trace':
        return <WechatTrace />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={darkMode ? 'dark' : 'light'}
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
            borderBottom: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
          }}
        >
          {!collapsed && (
            <Title level={5} style={{ margin: 0, color: darkMode ? '#fff' : '#1890ff' }}>
              古麒绒材溯源
            </Title>
          )}
          {collapsed && <SettingOutlined style={{ fontSize: 24, color: darkMode ? '#fff' : '#1890ff' }} />}
        </div>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={['basic']}
          items={menuItems}
          onClick={({ key }) => setCurrentPage(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            zIndex: 5,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            古麒绒材溯源管理系统
          </div>
          <Space>
            <span style={{ color: darkMode ? '#999' : '#666' }}>
              {darkMode ? <BulbFilled /> : <BulbOutlined />}
            </span>
            <Switch
              checked={darkMode}
              onChange={toggleTheme}
              checkedChildren="深色"
              unCheckedChildren="浅色"
            />
            <Badge status="success" text="系统运行正常" />
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 280,
            background: 'var(--bg-primary)',
            borderRadius: borderRadiusLG,
          }}
        >
          {renderPage()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
