class LowcodeComponent extends Component {
  constructor(props, context) {
    window.HaijuBasePack.injector(this, props, context);
  }

  state = {
    // 系统配置
    headers: {
      "Authorization": 'Bearer ' + (new URLSearchParams(location.search).get('token') || '')
    },
    
    // 当前用户信息
    currentUser: {},
    
    // 加载状态
    loading: false,
    tableLoading: false,
    
    // 供应商数据
    supplierData: [],
    totalElements: 0,
    
    // 查询参数
    queryParam: {
      conditionFilter: { 
        conditionType: "and", 
        conditions: [] 
      },
      page: { 
        current: 1, 
        pages: 0, 
        size: 20, 
        total: 1 
      },
      sorts: [],
      formId: "t69d7569c7184860008baae43"
    },
    
    // 搜索条件
    searchConditions: {
      supplierName: '',
      supplierStatus: '',
      supplierType: '',
      contactPhoneNumber: '',
      supplierEmail: ''
    },
    
    // 选项数据
    optionsData: {
      supplierTypes: [],      // 标包类型选项
      supplierStatuses: [     // 供应商状态选项
        { label: '正常', value: '正常' },
        { label: '暂停', value: '暂停' },
        { label: '结束合作', value: '结束合作' }
      ]
    },
    
    // 同步账号相关状态
    syncAccount: {
      loading: false,
      selectedRows: []  // 选中的行数据
    },
    
    // 复选框选择状态
    selection: {
      selectedRowKeys: [],  // 选中的行ID数组
      selectedRows: [],     // 选中的行数据数组
      indeterminate: false, // 半选状态
      checkAll: false       // 全选状态
    },
    
    
    // 防抖定时器
    searchTimer: null
  }

  async componentDidMount() {
    // 初始化授权信息
    this.initializeAuth();
    
    // 获取当前用户信息
    await this.getCurrentUser();
    
    // 加载选项数据
    await this.loadOptionsData();
    
    // 加载供应商数据
    await this.loadSupplierData();

    // 监听低代码驱动器的表单操作完成事件
    this.setupFormEventListeners();
  }

  // 初始化授权信息
  initializeAuth() {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      this.setState({
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } else {
      console.warn('未找到token，某些功能可能无法正常使用');
    }
  }

  componentWillUnmount() {
    // 清理事件监听器
    this.cleanupFormEventListeners();
    
    // 清理防抖定时器
    if (this.state.searchTimer) {
      clearTimeout(this.state.searchTimer);
    }
  }

  // 设置表单事件监听器
  setupFormEventListeners() {
    // 监听表单保存成功事件
    this.handleFormSaveSuccess = (event) => {
      console.log('表单保存成功，刷新供应商列表', event);
      this.loadSupplierData();
    };

    // 监听表单关闭事件
    this.handleFormClose = (event) => {
      console.log('表单关闭，刷新供应商列表', event);
      // 延迟刷新，确保表单完全关闭后再刷新
      setTimeout(() => {
        this.loadSupplierData();
      }, 500);
    };

    // 监听窗口焦点事件，当从表单页面返回时刷新
    this.handleWindowFocus = () => {
      console.log('窗口获得焦点，刷新供应商列表');
      this.loadSupplierData();
    };

    // 添加事件监听器
    if (window.addEventListener) {
      // 低代码驱动器事件
      window.addEventListener('kaiwu-form-save-success', this.handleFormSaveSuccess);
      window.addEventListener('kaiwu-form-close', this.handleFormClose);
      window.addEventListener('lowcode-form-saved', this.handleFormSaveSuccess);
      window.addEventListener('lowcode-form-closed', this.handleFormClose);
      
      // 窗口焦点事件作为备用刷新机制
      window.addEventListener('focus', this.handleWindowFocus);
    }
  }

  // 清理表单事件监听器
  cleanupFormEventListeners() {
    if (window.removeEventListener) {
      // 清理低代码驱动器事件
      window.removeEventListener('kaiwu-form-save-success', this.handleFormSaveSuccess);
      window.removeEventListener('kaiwu-form-close', this.handleFormClose);
      window.removeEventListener('lowcode-form-saved', this.handleFormSaveSuccess);
      window.removeEventListener('lowcode-form-closed', this.handleFormClose);
      
      // 清理窗口焦点事件
      window.removeEventListener('focus', this.handleWindowFocus);
    }
  }

  // =================== 数据加载方法 ===================
  
  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await this.dataSourceMap['getCurrentUser'].load();
      
      if (response && response.code === 200 && response.result) {
        const currentUser = response.result;
        console.log('获取到当前用户信息:', currentUser);
        
        this.setState({ 
          currentUser: {
            ...currentUser,
            userId: currentUser.id // 将id映射为userId
          }
        });
        
        return currentUser;
      } else {
        console.warn('获取当前用户信息失败，使用默认用户');
        this.loadDefaultUser();
      }
    } catch (error) {
      console.error('加载当前用户信息失败:', error);
      this.loadDefaultUser();
    }
  }

  // 加载默认用户信息（当API失败时使用）
  loadDefaultUser() {
    const defaultUser = {
      id: 'default_user_id',
      userId: 'default_user_id',
      name: '当前用户',
      username: 'current_user',
      customerId: 'default_customer'
    };
    
    this.setState({ currentUser: defaultUser });
  }

  // 加载选项数据
  async loadOptionsData() {
    try {
      // 加载标包类型选项
      const supplierTypesResponse = await this.loadSupplierTypes();

      this.setState({
        optionsData: {
          ...this.state.optionsData,
          supplierTypes: supplierTypesResponse || []
        }
      });
    } catch (error) {
      console.error('加载选项数据失败:', error);
      this.setState({
        optionsData: {
          ...this.state.optionsData,
          supplierTypes: []
        }
      });
    }
  }

  // 加载标包类型选项
  async loadSupplierTypes() {
    try {
      const params = {
        formId: 't69d7569c7184860008baae42', // 标包类型表ID
        conditionFilter: {
          conditionType: 'and',
          conditions: [
            {
              conditionOperator: 'isNotNull',
              field: 'supplierTypeName',
              conditionValues: []
            }
          ]
        },
        page: {
          current: 1,
          size: 1000
        },
        sorts: []
      };

      const response = await this.dataSourceMap['querySupplierTypes'].load(params);
      
      if (response && response.code === 200 && response.result && response.result.records) {
        return response.result.records.map(record => ({
          label: record.supplierTypeName || record.name || '未知类型',
          value: record.supplierTypeName || record.name || record.id
        }));
      }
      return [];
    } catch (error) {
      console.error('加载标包类型选项失败:', error);
      return [];
    }
  }

  // 加载供应商数据
  async loadSupplierData() {
    try {
      this.setState({ tableLoading: true });
      
      const queryParam = this.buildQueryParams();
      console.log('查询供应商数据参数:', queryParam);

      const response = await this.dataSourceMap['querySupplierData'].load(queryParam);
      
      if (response && response.code === 200 && response.result) {
        const { records = [], total = 0 } = response.result;
        console.log('获取到供应商数据:', records);
        
        this.setState({
          supplierData: records,
          totalElements: total,
          queryParam: {
            ...this.state.queryParam,
            page: {
              ...this.state.queryParam.page,
              total: total
            }
          }
        });
        
        // 数据刷新后清空选择状态
        this.ui_selection_clearAll();
      } else {
        console.warn('供应商数据查询失败:', response);
        this.setState({
          supplierData: [],
          totalElements: 0
        });
      }
    } catch (error) {
      console.error('加载供应商数据失败:', error);
      this.setState({
        supplierData: [],
        totalElements: 0
      });
    } finally {
      this.setState({ tableLoading: false });
    }
  }

  // 构建查询参数
  buildQueryParams() {
    const { searchConditions, queryParam } = this.state;
    let conditions = [];

    // 构建搜索条件
    Object.keys(searchConditions).forEach(key => {
      const value = searchConditions[key];
      if (value && value.trim() !== '') {
        let conditionOperator = 'eq';
        
        // 根据字段类型设置不同的操作符
        if (['supplierName', 'contactPhoneNumber', 'supplierEmail'].includes(key)) {
          conditionOperator = 'like'; // 模糊查询
        }
        
        conditions.push({
          conditionOperator,
          field: key,
          conditionValues: [value.trim()]
        });
      }
    });

    return {
      ...queryParam,
      conditionFilter: {
        conditionType: "and",
        conditions
      }
    };
  }

  // =================== 事件处理方法 ===================
  
  // 处理搜索
  handleSearch() {
    this.setState({
      queryParam: {
        ...this.state.queryParam,
        page: {
          ...this.state.queryParam.page,
          current: 1
        }
      }
    }, async () => {
      await this.loadSupplierData();
    });
  }

  // 重置搜索
  resetSearch() {
    this.setState({
      searchConditions: {
        supplierName: '',
        supplierStatus: '',
        supplierType: '',
        contactPhoneNumber: '',
        supplierEmail: ''
      },
      queryParam: {
        ...this.state.queryParam,
        page: {
          ...this.state.queryParam.page,
          current: 1
        }
      }
    }, async () => {
      await this.loadSupplierData();
    });
  }

  // 处理搜索条件变化
  handleSearchConditionChange(field, value) {
    this.setState({
      searchConditions: {
        ...this.state.searchConditions,
        [field]: value
      }
    });
  }

  // 分页处理
  handlePageChange(current, size) {
    this.setState({
      queryParam: {
        ...this.state.queryParam,
        page: {
          ...this.state.queryParam.page,
          current,
          size
        }
      }
    }, async () => {
      await this.loadSupplierData();
    });
  }

  // 打开弹窗
  openModal(type, record = {}) {
    const formId = "t69d7569c7184860008baae43"; // 供应商档案表单ID
    const appId = "8458f839b9260c7487315662282d1818"; // 应用ID

    try {
      // 检查低代码驱动器是否可用
      if (!window.KaiwuLowcodeDriver) {
        console.error('KaiwuLowcodeDriver 不可用');
        alert('系统组件未加载，请刷新页面重试');
        return;
      }

      if (type === 'add') {
        // 新增供应商
        console.log('新增供应商');
        window.KaiwuLowcodeDriver.exec('OPEN_FORM', {
          formId: formId, // 供应商档案表单ID
          isEdit: false, // 创建模式
          appId: appId, // 应用ID
          formValue: {} // 空的表单初始值
        });
      } else if (type === 'edit') {
        // 编辑供应商
        console.log('编辑供应商:', record, 'ID:', record._id);
        window.KaiwuLowcodeDriver.exec('OPEN_FORM', {
          formId: formId, // 供应商档案表单ID
          isEdit: true,
          dataId: record._id, // 数据ID
          appId: appId, // 应用ID
          formValue: record // 传递供应商数据作为表单初始值
        });
      } else if (type === 'view') {
        // 查看供应商详情
        console.log('查看供应商详情:', record, 'ID:', record._id);
        window.KaiwuLowcodeDriver.exec('SHOW_FORM_DATA', {
          formId: formId, // 供应商档案表单ID
          isEdit: true,
          dataId: record._id, // 数据ID
          appId: appId, // 应用ID
          formValue: record // 传递供应商数据作为表单初始值
        });
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败，请稍后重试');
    }
  }


  // 删除供应商
  async deleteSupplier(record) {
    try {
      // 确认删除
      if (!confirm(`确定要删除供应商"${record.supplierName || record._id}"吗？`)) {
        return;
      }

      console.log('删除供应商:', record, 'ID:', record._id);

      // 构建删除参数
      const deleteParams = {
        formId: "t69d7569c7184860008baae43", // 供应商档案表单ID
        data: {
          _id: [record._id] // 数据ID数组
        }
      };

      console.log('删除参数:', deleteParams);

      // 使用dataSourceMap调用删除接口，这样会自动包含authorization
      const response = await this.dataSourceMap['deleteSupplierData'].load(deleteParams);
      
      if (response && (response.success || response.code === 200)) {
        this.showMessage('success', '成功', '删除供应商成功');
        // 刷新列表
        await this.loadSupplierData();
      } else {
        console.warn('删除供应商失败:', response);
        this.showMessage('error', '错误', response?.message || '删除供应商失败');
      }
    } catch (error) {
      console.error('删除供应商失败:', error);
      this.showMessage('error', '错误', '删除供应商失败，请稍后重试');
    }
  }

  // 显示消息
  showMessage(type, title, message) {
    // 这里可以使用具体的消息组件，如 antd 的 message 或 notification
    console.log(`${type}: ${title} - ${message}`);
    alert(`${title}: ${message}`);
  }

  // =================== 复选框选择功能 ===================
  
  // UI层：处理单行复选框选择
  ui_selection_onRowSelect(record, selected) {
    const { selectedRowKeys, selectedRows } = this.state.selection;
    const { supplierData } = this.state;
    
    let newSelectedRowKeys = [...selectedRowKeys];
    let newSelectedRows = [...selectedRows];
    
    if (selected) {
      // 添加选中项
      if (!newSelectedRowKeys.includes(record._id)) {
        newSelectedRowKeys.push(record._id);
        newSelectedRows.push(record);
      }
    } else {
      // 移除选中项
      const index = newSelectedRowKeys.indexOf(record._id);
      if (index > -1) {
        newSelectedRowKeys.splice(index, 1);
        newSelectedRows.splice(index, 1);
      }
    }
    
    // 更新选择状态
    this.ui_selection_updateState(newSelectedRowKeys, newSelectedRows, supplierData);
  }
  
  // UI层：处理全选复选框
  ui_selection_onSelectAll(checked) {
    const { supplierData } = this.state;
    
    let newSelectedRowKeys = [];
    let newSelectedRows = [];
    
    if (checked) {
      // 全选
      newSelectedRowKeys = supplierData.map(item => item._id);
      newSelectedRows = [...supplierData];
    }
    
    // 更新选择状态
    this.ui_selection_updateState(newSelectedRowKeys, newSelectedRows, supplierData);
  }
  
  // UI层：更新选择状态
  ui_selection_updateState(selectedRowKeys, selectedRows, allData) {
    const totalCount = allData.length;
    const selectedCount = selectedRowKeys.length;
    
    const checkAll = selectedCount === totalCount && totalCount > 0;
    const indeterminate = selectedCount > 0 && selectedCount < totalCount;
    
    this.setState({
      selection: {
        selectedRowKeys,
        selectedRows,
        checkAll,
        indeterminate
      }
    });
  }
  
  // UI层：清空选择
  ui_selection_clearAll() {
    this.setState({
      selection: {
        selectedRowKeys: [],
        selectedRows: [],
        checkAll: false,
        indeterminate: false
      }
    });
  }
  
  // 业务层：检查记录是否被选中
  biz_selection_isSelected(recordId) {
    return this.state.selection.selectedRowKeys.includes(recordId);
  }

  // =================== 同步账号功能 ===================
  
  // UI层：同步账号按钮点击事件
  async ui_syncAccount_onSync() {
    try {
      // 调试信息
      console.log('开始同步账号，当前headers:', this.state.headers);
      
      this.setState({
        syncAccount: { ...this.state.syncAccount, loading: true }
      });
      
      const { selectedRows } = this.state.selection;
      
      if (selectedRows && selectedRows.length > 0) {
        // 批量同步选中的记录
        await this.biz_syncSelectedSuppliers(selectedRows);
        // 同步成功后清空选择
        this.ui_selection_clearAll();
      } else {
        // 全量同步没有账号的供应商
        await this.biz_syncAllUnsyncedSuppliers();
      }
      
      // 刷新列表
      await this.loadSupplierData();
      
    } catch (error) {
      console.error('同步账号失败:', error);
      this.showMessage('error', '错误', error.message || '同步账号失败');
    } finally {
      this.setState({
        syncAccount: { ...this.state.syncAccount, loading: false }
      });
    }
  }
  
  // 业务层：批量同步选中的供应商
  async biz_syncSelectedSuppliers(selectedRows) {
    if (selectedRows.length > 20) {
      throw new Error('每次同步的数据不能超过20条');
    }
    
    const errorSuppliers = [];
    
    for (let i = 0; i < selectedRows.length; i++) {
      const record = selectedRows[i];
      try {
        await this.biz_syncSingleSupplier(record);
      } catch (error) {
        console.error(`同步供应商 ${record.supplierName} 失败:`, error);
        errorSuppliers.push(record.supplierName);
      }
    }
    
    if (errorSuppliers.length > 0) {
      const errorMessage = `同步失败用户: ${errorSuppliers.join(', ')}`;
      throw new Error(errorMessage);
    } else {
      this.showMessage('success', '成功', '同步成功');
    }
  }
  
  // 业务层：全量同步没有账号的供应商
  async biz_syncAllUnsyncedSuppliers() {
    // 查询没有账号的供应商
    const unsyncedSuppliers = await this.data_queryUnsyncedSuppliers();
    
    if (!unsyncedSuppliers || unsyncedSuppliers.length === 0) {
      throw new Error('没有需要同步的数据了');
    }
    
    const errorSuppliers = [];
    
    for (let i = 0; i < unsyncedSuppliers.length; i++) {
      const record = unsyncedSuppliers[i];
      try {
        await this.biz_syncSingleSupplier(record, true); // true表示是新建账号
      } catch (error) {
        console.error(`同步供应商 ${record.supplierName} 失败:`, error);
        errorSuppliers.push(record.supplierName);
      }
    }
    
    if (errorSuppliers.length > 0) {
      const errorMessage = `同步失败用户: ${errorSuppliers.join(', ')}`;
      throw new Error(errorMessage);
    } else {
      this.showMessage('success', '成功', '同步成功');
    }
  }
  
  // 业务层：同步单个供应商
  async biz_syncSingleSupplier(record, isCreate = false) {
    const {
      _id,
      supplierName,
      supplierAccount,
      contactPhoneNumber,
      supplierContact,
      userId,
      supplierEmail,
      supplierStatus
    } = record;
    
    if (!supplierContact) {
      throw new Error(`供应商 ${supplierName} 缺少联系人信息`);
    }
    
    if (!contactPhoneNumber) {
      throw new Error(`供应商 ${supplierName} 缺少联系电话`);
    }
    
    const username = `gys${contactPhoneNumber}`;
    
    try {
      let userResult;
      
      if (isCreate || !supplierAccount) {
        // 创建新用户
        userResult = await this.data_addUser({
          username,
          nickName: supplierContact,
          mobile: contactPhoneNumber,
          email: supplierEmail,
          status: supplierStatus
        });
        
        // 更新供应商记录
        await this.data_updateSupplierAccount(_id, {
          supplierAccount: username,
          userId: userResult.id
        });
      } else {
        // 更新现有用户
        await this.data_updateUser({
          username,
          nickName: supplierContact,
          mobile: contactPhoneNumber,
          email: supplierEmail,
          id: userId,
          status: supplierStatus
        });
        
        // 更新供应商记录
        await this.data_updateSupplierAccount(_id, {
          supplierAccount: username
        });
      }
      
    } catch (error) {
      throw new Error(`同步供应商 ${supplierName} 失败: ${error.message}`);
    }
  }
  
  // 数据层：查询没有账号的供应商
  async data_queryUnsyncedSuppliers() {
    try {
      const searchParams = {
        "conditionFilter": {
          "conditionType": "AND",
          "conditions": [
            {
              "conditionValues": [],
              "conditionOperator": "isNull",
              "field": "supplierAccount"
            }
          ]
        },
        "page": {
          "current": 1,
          "pages": 0,
          "size": 30,
          "total": 1
        },
        "sorts": [{
          "key": "createTime",
          "type": "DESC"
        }],
        "formId": "t69d7569c7184860008baae43"
      };
      
      const response = await this.dataSourceMap['querySupplierData'].load(searchParams);
      
      if (response && response.code === 200 && response.result) {
        return response.result.records || [];
      } else {
        throw new Error('获取供应商数据失败');
      }
    } catch (error) {
      console.error('查询未同步供应商失败:', error);
      throw error;
    }
  }
  
  // 数据层：创建用户
  async data_addUser(params) {
    // 检查Authorization是否存在
    if (!this.state.headers || !this.state.headers.Authorization) {
      throw new Error('缺少授权信息，请重新登录');
    }
    
    const businessConfig = {
      deptId: 'cbd9e257b9cb5d279b6a27df8c026eb5', // 部门Id
      roleId: '95ae5a7aa328759e56ebd16e396e4395'  // 角色Id
    };
    
    const { deptId, roleId } = businessConfig;
    
    const userParams = {
      "username": params.username,
      "type": "0",
      "status": params.status === '结束合作' ? 0 : 1,
      "sex": "男",
      "roles": [
        {
          "id": roleId
        }
      ],
      "password": "admin@123",
      "nickName": params.nickName,
      "mobile": params.mobile,
      "email": params.email,
      "position": "",
      "isHeader": false,
      "department": {
        "id": deptId
      }
    };
    
    try {
      // 使用现有的API调用方式
      const response = await fetch('/mainApi/identity/user/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.state.headers.Authorization
        },
        body: JSON.stringify(userParams)
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        return { id: result.result.id };
      } else {
        throw new Error(result.message || '创建用户失败');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }
  
  // 数据层：更新用户
  async data_updateUser(params) {
    // 检查Authorization是否存在
    if (!this.state.headers || !this.state.headers.Authorization) {
      throw new Error('缺少授权信息，请重新登录');
    }
    
    const businessConfig = {
      deptId: 'cbd9e257b9cb5d279b6a27df8c026eb5', // 部门Id
      roleId: '95ae5a7aa328759e56ebd16e396e4395',  // 角色Id
      parentId: 'c3e9a68b50c5f19f2acecfebb897c10b'
    };
    
    const { deptId, parentId, roleId } = businessConfig;
    
    const userParams = {
      "currentRoles": roleId,
      "username": params.username,
      "email": params.email,
      "mobile": params.mobile,
      "nickName": params.nickName,
      "sex": "男",
      "status": params.status === '结束合作' ? 0 : 1,
      "position": "",
      "type": 0,
      "roles": [
        {
          "id": roleId
        }
      ],
      "department": {
        "id": deptId,
        "delFlag": 0,
        "title": "供应商",
        "parentId": parentId,
        "sortOrder": 0,
        "status": 0,
        "path": `${parentId},${deptId}`,
      },
      "isHeader": false,
      "id": params.id,
      "delFlag": 0,
      "departmentId": deptId,
    };
    
    try {
      const response = await fetch('/mainApi/identity/user/admin/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.state.headers.Authorization
        },
        body: JSON.stringify(userParams)
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        return true;
      } else {
        throw new Error(result.message || '更新用户失败');
      }
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  }
  
  // 数据层：更新供应商账号信息
  async data_updateSupplierAccount(supplierId, accountData) {
    // 检查Authorization是否存在
    if (!this.state.headers || !this.state.headers.Authorization) {
      throw new Error('缺少授权信息，请重新登录');
    }
    
    const updateData = {
      "dataList": [],
      "data": accountData,
      "formId": "t69d7569c7184860008baae43",
      "id": supplierId
    };
    
    try {
      const response = await fetch('/mainApi/processengine/app/formData/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.state.headers.Authorization
        },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (result.code !== 200) {
        throw new Error(result.message || '更新供应商账号信息失败');
      }
      
      return result;
    } catch (error) {
      console.error('更新供应商账号信息失败:', error);
      throw error;
    }
  }

  // =================== 渲染方法 ===================
  
  renderContent() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="supplier-container">
          <div className="loading-wrapper">
            <div className="loading-spinner"></div>
            <div className="loading-text">加载中...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="supplier-container">
        {/* 搜索筛选区域 */}
        {this.renderSearchFilters()}
        
        {/* 表格和分页组合 */}
        <div className="table-pagination-wrapper">
          {/* 供应商数据表格 */}
          {this.renderSupplierTable()}
          
          {/* 分页组件 */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }

  // 渲染搜索筛选器
  renderSearchFilters() {
    const { searchConditions, optionsData } = this.state;
    
    return (
      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-item-inline">
            <label>供应商名称:</label>
            <input
              type="text"
              placeholder="请输入供应商名称"
              value={searchConditions.supplierName}
              onChange={(e) => this.handleSearchConditionChange('supplierName', e.target.value)}
            />
          </div>
          
          <div className="filter-item-inline">
            <label>供应商状态:</label>
            <select
              value={searchConditions.supplierStatus}
              onChange={(e) => this.handleSearchConditionChange('supplierStatus', e.target.value)}
            >
              <option value="">全部状态</option>
              {optionsData.supplierStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 暂时隐藏标包类型和联系电话查询条件 */}
          {/* 
          <div className="filter-item-inline">
            <label>标包类型:</label>
            <select
              value={searchConditions.supplierType}
              onChange={(e) => this.handleSearchConditionChange('supplierType', e.target.value)}
            >
              <option value="">全部类型</option>
              {optionsData.supplierTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-item-inline">
            <label>联系电话:</label>
            <input
              type="text"
              placeholder="请输入联系电话"
              value={searchConditions.contactPhoneNumber}
              onChange={(e) => this.handleSearchConditionChange('contactPhoneNumber', e.target.value)}
            />
          </div>
          */}
          
          <div className="filter-actions">
            <button className="search-btn" onClick={() => this.handleSearch()}>搜索</button>
            <button className="reset-btn" onClick={() => this.resetSearch()}>重置</button>
            <button className="add-btn primary-btn" onClick={() => this.openModal('add')}>+ 新增供应商</button>
            <button 
              className="sync-btn" 
              onClick={() => this.ui_syncAccount_onSync()}
              disabled={this.state.syncAccount.loading}
            >
              {this.state.syncAccount.loading ? '同步中...' : 
               (this.state.selection.selectedRows.length > 0 ? 
                `同步选中(${this.state.selection.selectedRows.length})` : '同步账号')}
            </button>
            {this.state.selection.selectedRows.length > 0 && (
              <button 
                className="clear-selection-btn" 
                onClick={() => this.ui_selection_clearAll()}
              >
                清空选择
              </button>
            )}
            
          </div>
        </div>
      </div>
    );
  }


  // 渲染供应商数据表格
  renderSupplierTable() {
    const { supplierData, tableLoading, selection } = this.state;
    
    if (tableLoading) {
      return (
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">数据加载中...</div>
        </div>
      );
    }
    
    if (!supplierData || supplierData.length === 0) {
      return (
        <div className="no-data">
          <div className="no-data-icon">📋</div>
          <div className="no-data-text">暂无供应商数据</div>
        </div>
      );
    }

    return (
      <div className="supplier-table">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={selection.checkAll}
                    ref={checkbox => {
                      if (checkbox) checkbox.indeterminate = selection.indeterminate;
                    }}
                    onChange={(e) => this.ui_selection_onSelectAll(e.target.checked)}
                  />
                </th>
                <th className="col-supplier-id">供应商ID</th>
                <th className="col-supplier-name">供应商名称</th>
                <th className="col-contact">联系人</th>
                <th className="col-phone">联系电话</th>
                <th className="col-email">邮箱地址</th>
                <th className="col-type">标包类型</th>
                <th className="col-status">状态</th>
                <th className="col-money">保证金(元)</th>
                <th className="col-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              {supplierData.map((record, index) => (
                <tr key={record.id || index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>
                    <input
                      type="checkbox"
                      checked={this.biz_selection_isSelected(record._id)}
                      onChange={(e) => this.ui_selection_onRowSelect(record, e.target.checked)}
                    />
                  </td>
                  <td>{record.supplierId || '-'}</td>
                  <td>{record.supplierName || '-'}</td>
                  <td>{record.supplierContact || '-'}</td>
                  <td>{record.contactPhoneNumber || '-'}</td>
                  <td>{record.supplierEmail || '-'}</td>
                  <td>{Array.isArray(record.supplierType) ? record.supplierType.join(', ') : (record.supplierType || '-')}</td>
                  <td>
                    <span className={`status-tag status-${record.supplierStatus}`}>
                      {record.supplierStatus || '-'}
                    </span>
                  </td>
                  <td>{record.supplierMoney ? record.supplierMoney.toLocaleString() : '-'}</td>
                  <td>
                    <div className="action-links">
                      <a 
                        className="action-link view-link" 
                        onClick={() => this.openModal('view', record)}
                      >
                        查看
                      </a>
                      <a 
                        className="action-link edit-link" 
                        onClick={() => this.openModal('edit', record)}
                      >
                        编辑
                      </a>
                      <a 
                        className="action-link delete-link" 
                        onClick={() => this.deleteSupplier(record)}
                      >
                        删除
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 渲染分页组件
  renderPagination() {
    const { queryParam, totalElements } = this.state;
    const { current, size } = queryParam.page;
    const totalPages = Math.ceil(totalElements / size);
    
    if (totalElements <= size) {
      return null; // 不需要分页
    }

    return (
      <div className="pagination">
        <div className="pagination-info">
          共 {totalElements} 条记录，第 {current} 页，共 {totalPages} 页
        </div>
        <div className="pagination-controls">
          <button 
            className="page-btn" 
            disabled={current <= 1}
            onClick={() => this.handlePageChange(1, size)}
          >
            首页
          </button>
          <button 
            className="page-btn" 
            disabled={current <= 1}
            onClick={() => this.handlePageChange(current - 1, size)}
          >
            上一页
          </button>
          <span className="page-info">
            第 
            <input 
              type="number" 
              min="1" 
              max={totalPages}
              value={current}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  this.handlePageChange(page, size);
                }
              }}
            />
            页
          </span>
          <button 
            className="page-btn" 
            disabled={current >= totalPages}
            onClick={() => this.handlePageChange(current + 1, size)}
          >
            下一页
          </button>
          <button 
            className="page-btn" 
            disabled={current >= totalPages}
            onClick={() => this.handlePageChange(totalPages, size)}
          >
            末页
          </button>
          <select 
            value={size} 
            onChange={(e) => this.handlePageChange(1, parseInt(e.target.value))}
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
            <option value={100}>100条/页</option>
          </select>
        </div>
      </div>
    );
  }


}