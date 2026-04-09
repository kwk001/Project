/**
 * 现代化导航组件加载器
 * 动态加载 nav-component-new.html 到页面中
 */
(function() {
  'use strict';

  // 获取当前脚本的路径
  const scriptElement = document.currentScript;
  const scriptPath = scriptElement ? scriptElement.src : '';
  const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1) || './';
  
  // 组件 URL (添加时间戳防止缓存)
  const cacheBuster = '?v=' + new Date().getTime();
  const navComponentUrl = basePath + 'nav-component-new.html' + cacheBuster;
  const navStylesUrl = basePath + 'nav-styles.css' + cacheBuster;

  /**
   * 加载 CSS 样式
   */
  function loadStyles() {
    if (document.querySelector('link[href*="nav-styles.css"]')) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = navStylesUrl;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * 加载导航组件
   */
  function loadNavigation() {
    const navContainer = document.getElementById('nav-container');
    
    if (!navContainer) {
      console.warn('nav-loader: 未找到 #nav-container 元素');
      return;
    }

    // 先加载样式
    loadStyles()
      .then(() => {
        // 然后加载 HTML 组件
        return fetch(navComponentUrl);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('加载导航组件失败: ' + response.status);
        }
        return response.text();
      })
      .then(html => {
        // 提取 nav 元素和脚本
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const nav = doc.querySelector('.nav-sidebar');
        const scripts = doc.querySelectorAll('script');

        if (nav) {
          navContainer.innerHTML = '';
          navContainer.appendChild(nav.cloneNode(true));
        }

        // 执行组件中的脚本
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
        });

        // 触发加载完成事件
        document.dispatchEvent(new CustomEvent('navigationLoaded'));
        console.log('✓ 导航组件加载成功');
      })
      .catch(error => {
        console.error('nav-loader: 加载导航组件出错:', error);
        navContainer.innerHTML = `
          <div style="
            padding: 20px;
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 8px;
            margin: 20px;
          ">
            <strong>导航加载失败</strong><br>
            请刷新页面重试，或联系管理员
          </div>
        `;
      });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
  } else {
    loadNavigation();
  }
})();
