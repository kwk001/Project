class LowcodeComponent extends Component {
  constructor() {
    // 注册开物MES组件
    const { injectMesModuleMethods } = window.KaiwuMesModule;
    injectMesModuleMethods(this);
  }
  static PAGE_FORMCODE = 'diyigeyemian_4nxly7';
  static PAGE_FORMNAME = '第一个页面';
  state = {
    formMap: {
      jiaoxueguanliduan_ceshibiaodan: '', // 测试表单的表单ID
    },
        // 页面配置信息
    currentPageConfig: {
      pageFormCode: 'diyigeyemian_4nxly7',
      pageFormName: '第一个页面',
      projectCode: 'PRO0001',
    },
    depList: [],
    currentUser: {},
    headers: {
      "Authorization": 'Bearer ' + new URLSearchParams(location.search).get('token')
    },
  }
  async componentDidMount() {
    // 1. 初始化 DataService
    await this.initializeServices();
  }

  // ========================================
  // 初始化 DataService 服务
  // ========================================
  async initializeServices() {
    const { DataService } = window.KaiwuDataService;

    // 1. 创建 DataService 实例
    this.dataService = new DataService();

    // 2. 快捷引用
    this.formService = this.dataService.formDataService;
    this.userService = this.dataService.userService;
    // 使用 ConfigManager (Magic API)
    this.configManager = this.dataService.configManager;

    // 3. 初始化全局配置上下文 (使用 Magic API)
    await this.configManager.initGlobalContext([this.state.currentPageConfig.pageFormCode]);
    console.log('全局配置上下文已初始化 (ConfigManager)');

    // 4. 加载页面配置 (一键加载字典、功能、API路由)
    const currentPageConfig = await this.configManager.loadForPage(
      this.state.currentPageConfig.pageFormCode
    );
    console.log('页面配置已加载:', currentPageConfig);

    // 5. 预加载表单映射
    const formCodes = Object.keys(this.state.formMap);
    await this.formService.preloadForms(formCodes);
    console.log('表单映射已预加载:', formCodes);

    // 6. 获取当前用户信息
    const currentUser = await this.userService.getCurrentUser();
    if (currentUser) {
      await this.setStatePromise({ currentUser });
    }

    // 7. 预加载组织架构
    const depList = await this.userService.getDeptPersonTree();
    if (depList && depList.length > 0) {
      await this.setStatePromise({ depList });
    }

    // 8. 注册自定义 API 端点
    const customerId = currentUser?.customerId || this.state.currentUser?.customerId;
    if (customerId) {
      this.registerCustomAPIs(customerId);
    }

    // 9. 开始初始化的逻辑
    this.init()

    // 10. 标记服务初始化完成
    this.setState({ serviceReady: true });
    console.log('DataService 初始化完成');
    
    // 获取formId的方式
    const formId = await this.formService.getFormId('diyigeyemian_4nxly7')
    console.log('formId', formId)

  }


    // ========================================
  // 注册自定义 API 端点
  // ========================================
  registerCustomAPIs(customerId) {
    if (!this.dataService?.apiClient) return;

    // 入库回调 API
    this.dataService.apiClient.addEndpoint({
      method: 'post',
      path: `/kaiwuApi/${customerId}/mes/inventory/inCallbackCommon`,
      alias: 'inCallbackCommon',
      parameters: [{ name: 'data', type: 'Body', required: true }],
    });

    console.log('自定义 API 端点注册完成');
  }
  init() {
    
  }
  renderJSX() {
    const {ConfigProvider, Button, Row, Col, DatePicker, Input, Select, Table, Pagination, Form, Space} = window.antd
    const antdTheme = window.antdTheme
    const {RangePicker} = DatePicker
    return (<ConfigProvider theme={antdTheme} locale={this.getLocale()}>
      <div className="main-container">
        测试页面
      </div>
    </ConfigProvider>)
  }
  getLocale() {
    const t = window.DayjsLocale.getZhCN()
    return t
  }
  componentWillUnmount() {
  }
  
}