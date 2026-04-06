/**
 * @name 行李全程追踪系统 - 管理工作站
 */


import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import type { AxureProps, AxureHandle } from '../../common/axure-types';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[] 组件渲染错误:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', border: '2px solid red', margin: '20px' }}>
          <h2>组件渲染失败: 行李全程追踪系统 - 管理工作站</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const Component = forwardRef<AxureHandle, AxureProps>(function (innerProps, ref) {
  useImperativeHandle(ref, function () {
    return {
      getVar: function () { return undefined; },
      fireAction: function () {},
      eventList: [],
      actionList: [],
      varList: [],
      configList: [],
      dataList: []
    };
  }, []);

  return (
    <div data-chrome-export-root="true">
      <div data-chrome-export-body="true">
        <header style={{ backgroundColor: '#1e293b', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>行李全程追踪系统</div>
          </div>
        </header>
        <aside style={{ position: 'fixed', left: 0, top: '4rem', width: '200px', height: '100vh', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '1rem' }}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '1rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#334155', display: 'block', padding: '0.5rem' }}>首页概览</a>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#334155', display: 'block', padding: '0.5rem' }}>行李追踪</a>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <a href="#" style={{ textDecoration: 'none', color: '#334155', display: 'block', padding: '0.5rem' }}>航班管理</a>
              </li>
            </ul>
          </nav>
        </aside>
        <main style={{ marginLeft: '200px', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>首页概览</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>实时监控行李处理状态，掌握机场行李全流程动态</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>12,456</h3>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>今日行李总量</p>
              <p style={{ color: '#10b981', fontSize: '0.875rem' }}>+12.5% 较昨日</p>
            </div>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>11,892</h3>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>已处理完成</p>
              <p style={{ color: '#10b981', fontSize: '0.875rem' }}>95.5% 完成率</p>
            </div>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>456</h3>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>在途行李</p>
              <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>平均处理时间 18分钟</p>
            </div>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>23</h3>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>异常行李</p>
              <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>-8.2% 较昨日</p>
            </div>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>99.8%</h3>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>设备在线率</p>
              <p style={{ color: '#10b981', fontSize: '0.875rem' }}>+0.2% 较昨日</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});

const App = function () {
  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
};

export default App;