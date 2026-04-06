// react-dom-shim.js
// 尝试从 window 对象获取 ReactDOM
let RD = window.ReactDOM;

// 如果 window.ReactDOM 未定义（直接访问模块时），尝试导入真正的 ReactDOM
if (!RD) {
  try {
    const ReactDOM = require('react-dom');
    RD = ReactDOM;
  } catch (e) {
    console.warn('ReactDOM not found in window or node_modules:', e);
    // 创建一个最小化的 ReactDOM 替代品，避免模块加载失败
    RD = {
      render: () => {},
      createRoot: () => ({
        render: () => {},
        unmount: () => {}
      })
    };
  }
}

export default RD;

// ReactDOM 18+ (createRoot / hydrateRoot)
export const {
  createRoot,
  hydrateRoot,

  // ReactDOM 17 兼容 API（一些环境仍然可能需要）
  render,
  hydrate,
  unmountComponentAtNode,
  findDOMNode,

  // Server side features (如果 CDN 提供)
  createPortal,

  // React 18 Transition API（可能存在）
  flushSync,
  unstable_batchedUpdates,
  unstable_renderSubtreeIntoContainer,
} = RD;