class LowcodeComponent extends Component {
  constructor() {
    super();
    var self = this;
    if (window.KaiwuMesModule && window.KaiwuMesModule.injectMesModuleMethods) {
      window.KaiwuMesModule.injectMesModuleMethods(self);
    }
    self.setStatePromise = self.setStatePromise || function(state) {
      return new Promise(function(resolve) {
        self.setState(state, resolve);
      });
    };
  }

  static PAGE_FORMCODE = 'MES_cpdym';
  static PAGE_FORMNAME = '产品码打印';

  state = {
    mockData: [],
    dataList: [],
    loading: false,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    searchParams: {
      batchNo: '',
      materialName: '',
      productCodeStatus: 'all',
      produceDateRange: null
    },
    selectedRowKeys: [],
    productArchives: [
      { _id: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', unitName: '千克', specification: '高规格' },
      { _id: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', unitName: '千克', specification: '高规格' },
      { _id: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', unitName: '千克', specification: '标准规格' }
    ],
    executionStandards: [
      { _id: 'std_001', standardCode: 'GB/T 14272-2021', standardType: '国标', executionCode: 'EXEC001', productStandardCategory: '国标' },
      { _id: 'std_002', standardCode: 'FZ/T 73053-2021', standardType: '行标', executionCode: 'EXEC002', productStandardCategory: '行标' }
    ],
    companyLinkOptions: [
      { label: '官方网站', value: 'https://www.guqi.com' },
      { label: '天猫旗舰店', value: 'https://guqi.tmall.com' }
    ],
    isAddModalVisible: false,
    isEditMode: false,
    editingRecordId: null,
    addFormData: {},
    isDetailModalVisible: false,
    detailRecord: null,
    isPreviewModalVisible: false,
    previewRecord: null
  };

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    var self = this;
    self.setState({ loading: true });
    
    setTimeout(function() {
      var mockData = self.state.mockData;
      if (mockData.length === 0) {
        mockData = [
          { _id: 'batch_001', batchNo: 'BC2024001', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 500, produceDate: '2024-01-15', productionYear: 2024, executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', downContent: '95%', fluffiness: '900+', turbidity: '8mm', odor: '无异物', productCodeStatus: '已生成', createBy: '张三', createTime: '2024-01-15 10:30:00' },
          { _id: 'batch_002', batchNo: 'BC2024002', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 300, produceDate: '2024-01-16', productionYear: 2024, executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', downContent: '90%', fluffiness: '880+', turbidity: '10mm', odor: '无异物', productCodeStatus: '未生成', createBy: '李四', createTime: '2024-01-16 11:20:00' }
        ];
      }
      
      var searchParams = self.state.searchParams;
      var filteredData = mockData.filter(function(item) {
        if (searchParams.batchNo && item.batchNo.toLowerCase().indexOf(searchParams.batchNo.toLowerCase()) === -1) {
          return false;
        }
        if (searchParams.materialName && item.materialName.toLowerCase().indexOf(searchParams.materialName.toLowerCase()) === -1) {
          return false;
        }
        if (searchParams.productCodeStatus !== 'all' && item.productCodeStatus !== searchParams.productCodeStatus) {
          return false;
        }
        return true;
      });
      
      var pageNo = self.state.pageNo;
      var pageSize = self.state.pageSize;
      var start = (pageNo - 1) * pageSize;
      var end = start + pageSize;
      var pageData = filteredData.slice(start, end);
      
      self.setState({
        mockData: mockData,
        dataList: pageData,
        total: filteredData.length,
        loading: false
      });
    }, 500);
  }

  renderJSX() {
    var self = this;
    var antd = window.antd;
    var ConfigProvider = antd.ConfigProvider;
    var Table = antd.Table;
    var Pagination = antd.Pagination;
    var Button = antd.Button;
    var Input = antd.Input;
    var Select = antd.Select;
    var Modal = antd.Modal;
    var Form = antd.Form;
    var DatePicker = antd.DatePicker;
    var message = antd.message;
    var Tag = antd.Tag;
    var Space = antd.Space;
    var Upload = antd.Upload;
    
    var state = self.state;
    var dataList = state.dataList;
    var loading = state.loading;
    var pageNo = state.pageNo;
    var pageSize = state.pageSize;
    var total = state.total;
    var searchParams = state.searchParams;
    var isAddModalVisible = state.isAddModalVisible;
    var addFormData = state.addFormData;
    var isEditMode = state.isEditMode;
    var productArchives = state.productArchives;
    var executionStandards = state.executionStandards;
    var companyLinkOptions = state.companyLinkOptions;
    
    var columns = [
      { title: '序号', key: 'index', width: 60, render: function(_, __, index) { return (pageNo - 1) * pageSize + index + 1; } },
      { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 130 },
      { title: '产品名称', dataIndex: 'materialName', key: 'materialName', width: 140 },
      { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
      { title: '生产日期', dataIndex: 'produceDate', key: 'produceDate', width: 110 },
      { title: '绒子含量', dataIndex: 'downContent', key: 'downContent', width: 100 },
      { title: '产品码状态', dataIndex: 'productCodeStatus', key: 'productCodeStatus', width: 100, render: function(status) { return React.createElement(Tag, { color: status === '已生成' ? 'success' : 'warning' }, status); } },
      { title: '创建人', dataIndex: 'createBy', key: 'createBy', width: 90 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150 },
      { title: '操作', key: 'action', width: 200, render: function(_, record) {
        return React.createElement(Space, null,
          React.createElement(Button, { type: 'link', size: 'small', onClick: function() { self.setState({ isDetailModalVisible: true, detailRecord: record }); } }, '查看'),
          React.createElement(Button, { type: 'link', size: 'small', onClick: function() {
            self.setState({
              isAddModalVisible: true,
              isEditMode: true,
              editingRecordId: record._id,
              addFormData: Object.assign({}, record)
            });
          } }, '编辑'),
          React.createElement(Button, { type: 'link', size: 'small', disabled: record.productCodeStatus !== '已生成', onClick: function() { message.success('下载产品码：' + record.batchNo); } }, '下载产品码')
        );
      } }
    ];
    
    return React.createElement(ConfigProvider, { locale: window.DayjsLocale.getZhCN() },
      React.createElement('div', { className: 'main-container' },
        // 搜索区域
        React.createElement('div', { className: 'search-area' },
          React.createElement('div', { className: 'search-row' },
            React.createElement('div', { className: 'search-item' },
              React.createElement('span', { className: 'search-label' }, '批次号：'),
              React.createElement(Input, {
                placeholder: '请输入',
                value: searchParams.batchNo,
                onChange: function(e) { self.setState({ searchParams: Object.assign({}, searchParams, { batchNo: e.target.value }) }); },
                allowClear: true,
                style: { flex: 1 }
              })
            ),
            React.createElement('div', { className: 'search-item' },
              React.createElement('span', { className: 'search-label' }, '产品名称：'),
              React.createElement(Input, {
                placeholder: '请输入',
                value: searchParams.materialName,
                onChange: function(e) { self.setState({ searchParams: Object.assign({}, searchParams, { materialName: e.target.value }) }); },
                allowClear: true,
                style: { flex: 1 }
              })
            ),
            React.createElement('div', { className: 'search-item' },
              React.createElement('span', { className: 'search-label' }, '产品码状态：'),
              React.createElement(Select, {
                placeholder: '请选择',
                value: searchParams.productCodeStatus === 'all' ? undefined : searchParams.productCodeStatus,
                onChange: function(value) { self.setState({ searchParams: Object.assign({}, searchParams, { productCodeStatus: value || 'all' }) }); },
                allowClear: true,
                style: { flex: 1 }
              },
                React.createElement(Select.Option, { value: '已生成' }, '已生成'),
                React.createElement(Select.Option, { value: '未生成' }, '未生成')
              )
            )
          ),
          React.createElement('div', { className: 'search-actions', style: { marginTop: 16 } },
            React.createElement(Space, null,
              React.createElement(Button, { onClick: function() { self.setState({ searchParams: { batchNo: '', materialName: '', productCodeStatus: 'all' } }, function() { self.loadData(); }); } }, '重置'),
              React.createElement(Button, { type: 'primary', onClick: function() { self.loadData(); } }, '查询')
            )
          )
        ),
        // 表格区域
        React.createElement('div', { style: { background: '#fff', padding: 16, borderRadius: 4 } },
          React.createElement('div', { style: { marginBottom: 16 } },
            React.createElement(Button, { type: 'primary', onClick: function() { self.setState({ isAddModalVisible: true, isEditMode: false, editingRecordId: null, addFormData: {} }); } }, '+ 新增批次')
          ),
          React.createElement(Table, {
            dataSource: dataList,
            columns: columns,
            loading: loading,
            rowKey: '_id',
            pagination: false
          })
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 16 } },
          React.createElement(Pagination, {
            current: pageNo,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: function(page, size) { self.setState({ pageNo: page, pageSize: size }, function() { self.loadData(); }); }
          })
        ),
        // 新增/编辑弹窗
        isAddModalVisible ? React.createElement(Modal, {
          title: isEditMode ? '编辑批次' : '新增批次',
          open: isAddModalVisible,
          onCancel: function() { self.setState({ isAddModalVisible: false, isEditMode: false, editingRecordId: null, addFormData: {} }); },
          width: 720,
          footer: [
            React.createElement(Button, { key: 'cancel', onClick: function() { self.setState({ isAddModalVisible: false, isEditMode: false, editingRecordId: null, addFormData: {} }); } }, '取消'),
            React.createElement(Button, { key: 'save', type: 'primary', onClick: function() { 
              message.success(isEditMode ? '保存修改成功' : '新增批次成功');
              self.setState({ isAddModalVisible: false, isEditMode: false, editingRecordId: null, addFormData: {} }, function() { self.loadData(); });
            } }, isEditMode ? '保存修改' : '保存')
          ]
        },
          React.createElement(Form, { layout: 'vertical', style: { marginTop: 16 } },
            // 基本信息
            React.createElement('div', { style: { marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 } },
              React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '基本信息'),
              React.createElement('div', { style: { display: 'flex', gap: 16, marginBottom: 16 } },
                React.createElement(Form.Item, { label: '产品名称', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Select, {
                    placeholder: '请选择产品名称',
                    value: addFormData.materialId || undefined,
                    onChange: function(value) {
                      var product = productArchives.find(function(p) { return p._id === value; });
                      self.setState({ addFormData: Object.assign({}, addFormData, { materialId: value, materialCode: product ? product.materialCode : '', materialName: product ? product.materialName : '', unitName: product ? product.unitName : '', specification: product ? product.specification : '' }) });
                    },
                    style: { width: '100%' }
                  }, productArchives.map(function(p) {
                    return React.createElement(Select.Option, { key: p._id, value: p._id }, p.materialName + ' (' + p.materialCode + ')');
                  }))
                ),
                React.createElement(Form.Item, { label: '批次号', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '请输入批次号',
                    value: addFormData.batchNo || '',
                                        onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { batchNo: e.target.value }) }); }
                  })
                )
              ),
              addFormData.materialId && React.createElement('div', { style: { display: 'flex', gap: 16, marginBottom: 16 } },
                React.createElement(Form.Item, { label: '产品编号', style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, { value: addFormData.materialCode || '', disabled: true })
                ),
                React.createElement(Form.Item, { label: '规格', style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, { value: addFormData.specification || '', disabled: true })
                )
              ),
              React.createElement('div', { style: { display: 'flex', gap: 16 } },
                React.createElement(Form.Item, { label: '生产日期', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(DatePicker, {
                    placeholder: '请选择生产日期',
                    style: { width: '100%' },
                    value: addFormData.produceDate,
                    onChange: function(date) { self.setState({ addFormData: Object.assign({}, addFormData, { produceDate: date }) }); }
                  })
                ),
                React.createElement(Form.Item, { label: '生产年度', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(DatePicker, {
                    placeholder: '请选择生产年度',
                    picker: 'year',
                    style: { width: '100%' },
                    value: addFormData.productionYear,
                    onChange: function(year) { self.setState({ addFormData: Object.assign({}, addFormData, { productionYear: year }) }); }
                  })
                )
              )
            ),
            // 执行标准
            React.createElement('div', { style: { marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 } },
              React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '执行标准'),
              React.createElement('div', { style: { display: 'flex', gap: 16 } },
                React.createElement(Form.Item, { label: '执行标准', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Select, {
                    placeholder: '请选择执行标准',
                    value: addFormData.executionStandard || undefined,
                    onChange: function(value) {
                      var std = executionStandards.find(function(s) { return s._id === value; });
                      self.setState({ addFormData: Object.assign({}, addFormData, { executionStandard: value, productStandardCategory: std ? std.productStandardCategory : '' }) });
                    },
                    style: { width: '100%' }
                  }, executionStandards.map(function(s) {
                    return React.createElement(Select.Option, { key: s._id, value: s._id }, s.standardCode + ' (' + s.standardType + ')');
                  }))
                ),
                React.createElement(Form.Item, { label: '产品标准类别', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Select, {
                    placeholder: '请选择产品标准类别',
                    value: addFormData.productStandardCategory || undefined,
                    onChange: function(value) { self.setState({ addFormData: Object.assign({}, addFormData, { productStandardCategory: value }) }); },
                    style: { width: '100%' }
                  },
                    React.createElement(Select.Option, { value: '国标' }, '国标'),
                    React.createElement(Select.Option, { value: '行标' }, '行标'),
                    React.createElement(Select.Option, { value: '企标' }, '企标')
                  )
                )
              )
            ),
            // 质检信息
            React.createElement('div', { style: { marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 } },
              React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '质检信息'),
              React.createElement('div', { style: { display: 'flex', gap: 16 } },
                React.createElement(Form.Item, { label: '绒子含量(%)', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '如：95%',
                    value: addFormData.downContent || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { downContent: e.target.value }) }); }
                  })
                ),
                React.createElement(Form.Item, { label: '蓬松度', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '如：900+',
                    value: addFormData.fluffiness || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { fluffiness: e.target.value }) }); }
                  })
                ),
                React.createElement(Form.Item, { label: '浊度(mm)', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '如：10mm',
                    value: addFormData.turbidity || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { turbidity: e.target.value }) }); }
                  })
                ),
                React.createElement(Form.Item, { label: '气味', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '如：无异物',
                    value: addFormData.odor || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { odor: e.target.value }) }); }
                  })
                )
              )
            ),
            // 产品视频
            React.createElement('div', { style: { marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 } },
              React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '产品视频'),
              React.createElement(Form.Item, { label: '产品视频', required: true, style: { marginBottom: 16 } },
                React.createElement(Input, {
                  placeholder: '请输入视频URL',
                  value: addFormData.productVideo || '',
                  onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { productVideo: e.target.value }) }); }
                })
              ),
              React.createElement(Form.Item, { label: '认证信息', required: true },
                React.createElement(Input, {
                  placeholder: '请输入认证信息（多个用逗号分隔）',
                  value: (addFormData.certificationImages || []).join(','),
                  onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { certificationImages: e.target.value.split(',').filter(function(x) { return x; }) }) }); }
                })
              )
            ),
            // 企业信息
            React.createElement('div', { style: { padding: 16, background: '#fafafa', borderRadius: 8 } },
              React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '企业信息'),
              React.createElement('div', { style: { display: 'flex', gap: 16, marginBottom: 16 } },
                React.createElement(Form.Item, { label: '企业名称', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '请输入企业名称',
                    value: addFormData.companyName || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { companyName: e.target.value }) }); }
                  })
                ),
                React.createElement(Form.Item, { label: '企业地址', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '请输入企业地址',
                    value: addFormData.companyAddress || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { companyAddress: e.target.value }) }); }
                  })
                )
              ),
              React.createElement('div', { style: { display: 'flex', gap: 16, marginBottom: 16 } },
                React.createElement(Form.Item, { label: '生产许可证', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '请输入生产许可证号',
                    value: addFormData.licenseNo || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { licenseNo: e.target.value }) }); }
                  })
                ),
                React.createElement(Form.Item, { label: '质检员', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '请输入质检员姓名',
                    value: addFormData.inspector || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { inspector: e.target.value }) }); }
                  })
                )
              ),
              React.createElement('div', { style: { display: 'flex', gap: 16 } },
                React.createElement(Form.Item, { label: '微信公众号图片', required: true, style: { flex: 1, marginBottom: 0 } },
                  React.createElement(Input, {
                    placeholder: '请输入图片URL',
                    value: addFormData.wechatQrImage || '',
                    onChange: function(e) { self.setState({ addFormData: Object.assign({}, addFormData, { wechatQrImage: e.target.value }) }); }
                  })
                ),
                React.createElement(Form.Item, { label: '企业链接', required: true, style: { flex: 2, marginBottom: 0 } },
                  React.createElement(Select, {
                    mode: 'multiple',
                    placeholder: '请选择企业链接（多选）',
                    value: addFormData.companyLinks || [],
                    onChange: function(value) { self.setState({ addFormData: Object.assign({}, addFormData, { companyLinks: value }) }); },
                    style: { width: '100%' }
                  }, companyLinkOptions.map(function(link) {
                    return React.createElement(Select.Option, { key: link.value, value: link.value }, link.label);
                  }))
                )
              )
            )
          )
        ) : null,
        // 详情弹窗
        state.isDetailModalVisible ? React.createElement(Modal, {
          title: '批次详情',
          open: state.isDetailModalVisible,
          onCancel: function() { self.setState({ isDetailModalVisible: false, detailRecord: null }); },
          width: 640,
          footer: [
            React.createElement(Button, { key: 'close', onClick: function() { self.setState({ isDetailModalVisible: false, detailRecord: null }); } }, '关闭')
          ]
        },
          React.createElement('div', { style: { padding: '16px 0' } },
            state.detailRecord && React.createElement('div', null,
              React.createElement('div', { style: { marginBottom: 24 } },
                React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '基本信息'),
                React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px 0' } },
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '批次号：'), React.createElement('span', null, state.detailRecord.batchNo)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '产品名称：'), React.createElement('span', null, state.detailRecord.materialName)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '产品编号：'), React.createElement('span', null, state.detailRecord.materialCode)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '规格型号：'), React.createElement('span', null, state.detailRecord.specification)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '数量：'), React.createElement('span', null, state.detailRecord.quantity)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '生产日期：'), React.createElement('span', null, state.detailRecord.produceDate)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '生产年度：'), React.createElement('span', null, state.detailRecord.productionYear))
                )
              ),
              React.createElement('div', { style: { marginBottom: 24 } },
                React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '质检信息'),
                React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px 0' } },
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '绒子含量：'), React.createElement('span', null, state.detailRecord.downContent)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '蓬松度：'), React.createElement('span', null, state.detailRecord.fluffiness)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '浊度：'), React.createElement('span', null, state.detailRecord.turbidity)),
                  React.createElement('div', { style: { width: '50%', marginBottom: 8 } }, React.createElement('span', { style: { color: '#666' } }, '气味：'), React.createElement('span', null, state.detailRecord.odor))
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { style: { marginBottom: 16, color: '#1890ff' } }, '产品码'),
                React.createElement('div', { style: { textAlign: 'center', padding: 24, background: '#f5f5f5', borderRadius: 8 } },
                  state.detailRecord.productCodeStatus === '已生成'
                    ? React.createElement('div', null,
                        React.createElement('div', { style: { fontSize: 64, marginBottom: 16 } }, '▣'),
                        React.createElement('div', null, '产品码：' + state.detailRecord.batchNo),
                        React.createElement(Button, { type: 'primary', style: { marginTop: 16 }, onClick: function() { message.success('下载产品码：' + state.detailRecord.batchNo); } }, '下载产品码')
                      )
                    : React.createElement('div', { style: { color: '#999' } }, '尚未生成产品码')
                )
              )
            )
          )
        ) : null
      )
    );
  }

  getLocale() {
    return window.DayjsLocale.getZhCN();
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }
}
