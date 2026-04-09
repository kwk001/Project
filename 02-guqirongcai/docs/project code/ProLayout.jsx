import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Button } from 'antd';
import {
  DatabaseOutlined,
  PrinterOutlined,
  QrcodeOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import './layout.css';

const { Header, Sider, Content } = Layout;

// 菜单配置
const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '工作台'
  },
  {
    key: 'baseData',
    icon: <DatabaseOutlined />,
    label: '基础数据',
    children: [
      { key: '/unit', label: '计量单位' },
      { key: '/category', label: '物料分类' },
      { key: '/material', label: '物料档案' },
      { key: '/customer', label: '客户档案' }
    ]
  },
  {
    key: '/print',
    icon: <PrinterOutlined />,
    label: '产品码打印'
  },
  {
    key: '/trace',
    icon: <QrcodeOutlined />,
    label: '微信扫码溯源'
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统设置',
    children: [
      { key: '/settings/printer', label: '打印设置' },
      { key: '/settings/user', label: '用户管理' },
      { key: '/settings/log', label: '操作日志' }
    ]
  }
];

// 用户菜单
const userMenuItems = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '账号设置' },
  { type: 'divider' },
  { key: 'logout', label: '退出登录' }
];

class ProLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: ['/print'],
      openKeys: ['baseData'],
      theme: localStorage.getItem('guqirongcai-theme') || 'light'
    };
  }

  componentDidMount() {
    // 应用主题
    document.documentElement.setAttribute('data-theme', this.state.theme);
    // 根据当前路径设置选中菜单
    const path = window.location.pathname;
    this.setSelectedKeys(path);
  }

  setSelectedKeys = (path) => {
    const selectedKeys = [path];
    const openKeys = [];

    // 查找需要展开的父菜单
    menuItems.forEach(item => {
      if (item.children) {
        const hasChild = item.children.some(child => child.key === path);
        if (hasChild) {
          openKeys.push(item.key);
        }
      }
    });

    this.setState({ selectedKeys, openKeys });
  };

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  onMenuClick = (e) => {
    const { onNavigate } = this.props;
    this.setState({ selectedKeys: [e.key] });
    if (onNavigate) {
      onNavigate(e.key);
    }
  };

  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  };

  toggleTheme = () => {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({ theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('guqirongcai-theme', newTheme);
  };

  renderLogo = () => (
    <div className="pro-layout-logo">
      <div className="logo-icon">🦢</div>
      {!this.state.collapsed && (
        <div className="logo-text">
          <div className="logo-title">古麒绒材</div>
          <div className="logo-subtitle">溯源管理系统</div>
        </div>
      )}
    </div>
  );

  renderHeader = () => (
    <Header className="pro-layout-header">
      <div className="header-left">
        <Button
          type="text"
          icon={this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={this.toggleCollapsed}
          className="collapse-btn"
        />
        <span className="breadcrumb">古麒绒材溯源管理系统</span>
      </div>
      <div className="header-right">
        <Space size={16}>
          <Button
            type="text"
            icon={this.state.theme === 'light' ? '🌙' : '☀️'}
            onClick={this.toggleTheme}
            className="theme-btn"
          >
            {this.state.theme === 'light' ? '深色' : '浅色'}
          </Button>
          <Badge count={5} size="small">
            <Button type="text" icon={<BellOutlined />} className="notice-btn" />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} size="small" />
              <span className="username">管理员</span>
              <DownOutlined className="dropdown-icon" />
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );

  render() {
    const { children } = this.props;
    const { collapsed, selectedKeys, openKeys, theme } = this.state;

    return (
      <Layout className={`pro-layout ${theme}`}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={260}
          collapsedWidth={80}
          className="pro-layout-sider"
        >
          {this.renderLogo()}
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            items={menuItems}
            onClick={this.onMenuClick}
            onOpenChange={this.onOpenChange}
            className="pro-layout-menu"
          />
        </Sider>
        <Layout className="pro-layout-main">
          {this.renderHeader()}
          <Content className="pro-layout-content">
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default ProLayout;
