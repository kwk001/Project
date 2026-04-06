// 尝试从 window 对象获取 React
let R = window.React;
let RJSXRuntime = window.ReactJSXRuntime || {};

// 如果 window.React 未定义（直接访问模块时），尝试导入真正的 React
if (!R) {
  try {
    const React = require('react');
    R = React;
    RJSXRuntime = React;
  } catch (e) {
    console.warn('React not found in window or node_modules:', e);
    // 创建一个最小化的 React 替代品，避免模块加载失败
    R = {
      useState: () => [null, () => {}],
      useEffect: () => {},
      useRef: () => ({ current: null }),
      forwardRef: (Component) => Component,
      Component: class {},
      createElement: (type, props, ...children) => ({ type, props, children }),
      Fragment: 'React.Fragment'
    };
  }
}

export default R;

export const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  useSyncExternalStore,
  useInsertionEffect,

  forwardRef,
  memo,
  createElement,
  Fragment,
  Component,
  PureComponent,
  createContext,
  createRef,
  lazy,
  Suspense,
  StrictMode,
  Profiler,
  Children,
  cloneElement,
  isValidElement,
  createFactory,
  startTransition,
  act,
  version,
} = R;

// JSX Runtime exports for modern React
export const jsx = RJSXRuntime.jsx || createElement;
export const jsxs = RJSXRuntime.jsxs || createElement;
export const jsxDEV = RJSXRuntime.jsxDEV || createElement;
