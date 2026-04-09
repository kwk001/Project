import React from 'react';
import ProLayout from './ProLayout';

// 导入各页面组件
import UnitManagement from './计量单位管理';
import CategoryManagement from './物料分类管理';
import MaterialManagement from './物料档案管理';
import CustomerManagement from './客户档案管理';
import ProductCodePrint from './产品码打印';
import WechatTrace from './微信扫码溯源';

// 页面映射
const pageComponents = {
  '/dashboard': () => (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <h1>🎉 欢迎使用古麒绒材溯源管理系统</h1>
      <p style={{ color: '#666', marginTop: 16 }}>请从左侧菜单选择功能模块</p>
      <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
        <div style={{ padding: 24, background: '#f6ffed', borderRadius: 8, minWidth: 150 }}>
          <div style={{ fontSize: 32, color: '#52c41a', fontWeight: 'bold' }}>50+</div>
          <div style={{ color: '#666' }}>物料档案</div>
        </div>
        <div style={{ padding: 24, background: '#e6f7ff', borderRadius: 8, minWidth: 150 }}>
          <div style={{ fontSize: 32, color: '#1890ff', fontWeight: 'bold' }}>1000+</div>
          <div style={{ color: '#666' }}>溯源码打印</div>
        </div>
        <div style={{ padding: 24, background: '#fff7e6', borderRadius: 8, minWidth: 150 }}>
          <div style={{ fontSize: 32, color: '#fa8c16', fontWeight: 'bold' }}>5000+</div>
          <div style={{ color: '#666' }}>扫码查询次数</div>
        </div>
      </div>
    </div>
  ),
  '/unit': UnitManagement,
  '/category': CategoryManagement,
  '/material': MaterialManagement,
  '/customer': CustomerManagement,
  '/print': ProductCodePrint,
  '/trace': WechatTrace,
  '/settings/printer': () => (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>🖨️ 打印设置</h2>
      <p style={{ color: '#999' }}>打印机配置（开发中）</p>
    </div>
  ),
  '/settings/user': () => (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>👤 用户管理</h2>
      <p style={{ color: '#999' }}>用户权限配置（开发中）</p>
    </div>
  ),
  '/settings/log': () => (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>📝 操作日志</h2>
      <p style={{ color: '#999' }}>系统操作记录（开发中）</p>
    </div>
  )
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPath: '/dashboard'
    };
  }

  handleNavigate = (path) => {
    this.setState({ currentPath: path });
    // 更新浏览器URL（不刷新页面）
    window.history.pushState(null, '', path);
  };

  renderCurrentPage = () => {
    const { currentPath } = this.state;
    const PageComponent = pageComponents[currentPath];

    if (PageComponent) {
      return <PageComponent />;
    }

    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>404</h1>
        <p>页面不存在</p>
      </div>
    );
  };

  render() {
    return (
      <ProLayout onNavigate={this.handleNavigate}>
        {this.renderCurrentPage()}
      </ProLayout>
    );
  }
}

export default App;
