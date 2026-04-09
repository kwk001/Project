class LowcodeComponent extends Component {
  constructor() {
    const { injectMesModuleMethods } = window.KaiwuMesModule;
    injectMesModuleMethods(this);
  }

  static PAGE_FORMCODE = 'MES_cpdym';
  static PAGE_FORMNAME = '产品码打印';

  // 模拟产品档案数据
  productArchives = [
    { _id: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', unitName: '千克' },
    { _id: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', unitName: '千克' },
    { _id: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', unitName: '千克' },
    { _id: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', unitName: '千克' },
    { _id: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', unitName: '千克' },
    { _id: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', unitName: '千克' },
  ];

  state = {
    mockData: [
      { _id: 'batch_001', batchNo: 'BC202401001', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', quantity: 500, unitName: '千克', produceDate: '2024-01-15', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printCount: 1, createBy: '张三', createTime: '2024-01-15 10:30:00' },
      { _id: 'batch_002', batchNo: 'BC202401002', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', quantity: 300, unitName: '千克', produceDate: '2024-01-16', downContent: '90%', fluffiness: '850+', cleanliness: '980+', oxygenConsumption: '≤5.0', printStatus: '已打印', printCount: 2, createBy: '李四', createTime: '2024-01-16 11:20:00' },
      { _id: 'batch_003', batchNo: 'BC202401003', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', quantity: 800, unitName: '千克', produceDate: '2024-01-17', downContent: '85%', fluffiness: '800+', cleanliness: '950+', oxygenConsumption: '≤5.2', printStatus: '未打印', printCount: 0, createBy: '王五', createTime: '2024-01-17 09:15:00' },
      { _id: 'batch_004', batchNo: 'BC202401004', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', quantity: 600, unitName: '千克', produceDate: '2024-01-18', downContent: '80%', fluffiness: '750+', cleanliness: '920+', oxygenConsumption: '≤5.5', printStatus: '已打印', printCount: 1, createBy: '张三', createTime: '2024-01-18 14:30:00' },
      { _id: 'batch_005', batchNo: 'BC202401005', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', quantity: 400, unitName: '千克', produceDate: '2024-01-19', downContent: '95%', fluffiness: '880+', cleanliness: '990+', oxygenConsumption: '≤4.9', printStatus: '已打印', printCount: 3, createBy: '李四', createTime: '2024-01-19 08:45:00' },
      { _id: 'batch_006', batchNo: 'BC202401006', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', quantity: 350, unitName: '千克', produceDate: '2024-01-20', downContent: '90%', fluffiness: '820+', cleanliness: '960+', oxygenConsumption: '≤5.1', printStatus: '未打印', printCount: 0, createBy: '王五', createTime: '2024-01-20 10:20:00' },
      { _id: 'batch_007', batchNo: 'BC202401007', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', quantity: 450, unitName: '千克', produceDate: '2024-01-21', downContent: '95%', fluffiness: '920+', cleanliness: '1000+', oxygenConsumption: '≤4.7', printStatus: '已打印', printCount: 4, createBy: '张三', createTime: '2024-01-21 09:00:00' },
      { _id: 'batch_008', batchNo: 'BC202401008', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', quantity: 280, unitName: '千克', produceDate: '2024-01-22', downContent: '90%', fluffiness: '860+', cleanliness: '970+', oxygenConsumption: '≤4.9', printStatus: '未打印', printCount: 0, createBy: '李四', createTime: '2024-01-22 11:30:00' },
      { _id: 'batch_009', batchNo: 'BC202401009', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', quantity: 720, unitName: '千克', produceDate: '2024-01-23', downContent: '85%', fluffiness: '810+', cleanliness: '940+', oxygenConsumption: '≤5.3', printStatus: '已打印', printCount: 1, createBy: '王五', createTime: '2024-01-23 08:15:00' },
      { _id: 'batch_010', batchNo: 'BC202401010', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', quantity: 550, unitName: '千克', produceDate: '2024-01-24', downContent: '80%', fluffiness: '760+', cleanliness: '930+', oxygenConsumption: '≤5.4', printStatus: '已打印', printCount: 2, createBy: '张三', createTime: '2024-01-24 14:45:00' },
      { _id: 'batch_011', batchNo: 'BC202401011', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', quantity: 380, unitName: '千克', produceDate: '2024-01-25', downContent: '95%', fluffiness: '890+', cleanliness: '980+', oxygenConsumption: '≤4.8', printStatus: '未打印', printCount: 0, createBy: '李四', createTime: '2024-01-25 08:30:00' },
      { _id: 'batch_012', batchNo: 'BC202401012', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', quantity: 320, unitName: '千克', produceDate: '2024-01-26', downContent: '90%', fluffiness: '830+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printCount: 1, createBy: '王五', createTime: '2024-01-26 09:45:00' },
      { _id: 'batch_013', batchNo: 'BC202401013', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', quantity: 480, unitName: '千克', produceDate: '2024-01-27', downContent: '95%', fluffiness: '910+', cleanliness: '1000+', oxygenConsumption: '≤4.7', printStatus: '已打印', printCount: 3, createBy: '张三', createTime: '2024-01-27 11:20:00' },
      { _id: 'batch_014', batchNo: 'BC202401014', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', quantity: 260, unitName: '千克', produceDate: '2024-01-28', downContent: '90%', fluffiness: '840+', cleanliness: '960+', oxygenConsumption: '≤5.0', printStatus: '未打印', printCount: 0, createBy: '李四', createTime: '2024-01-28 08:00:00' },
      { _id: 'batch_015', batchNo: 'BC202401015', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', quantity: 750, unitName: '千克', produceDate: '2024-01-29', downContent: '85%', fluffiness: '800+', cleanliness: '920+', oxygenConsumption: '≤5.4', printStatus: '已打印', printCount: 1, createBy: '王五', createTime: '2024-01-29 14:30:00' },
    ],
    dataList: [],
    loading: false,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    searchParams: {
      batchNo: '',
      materialName: '',
      printStatus: 'all',
      produceDateRange: null
    },
    selectedRowKeys: []
  };

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await this.setStatePromise({ loading: true });
    try {
      const { searchParams, pageNo, pageSize, mockData } = this.state;

      let filteredData = mockData.filter(item => {
        // 批次号 - 模糊搜索
        if (searchParams.batchNo && !item.batchNo.toLowerCase().includes(searchParams.batchNo.toLowerCase())) {
          return false;
        }
        // 产品名称 - 模糊搜索
        if (searchParams.productName && !item.productName.includes(searchParams.productName)) {
          return false;
        }
        // 规格型号 - 模糊搜索
        if (searchParams.specModel && !item.specModel.toLowerCase().includes(searchParams.specModel.toLowerCase())) {
          return false;
        }
        // 计量单位 - 模糊搜索
        if (searchParams.unit && !item.unit.includes(searchParams.unit)) {
          return false;
        }
        // 打印状态 - 精确匹配
        if (searchParams.printStatus !== 'all' && item.printStatus !== searchParams.printStatus) {
          return false;
        }
        // 打印人 - 模糊搜索
        if (searchParams.printer && !item.printer.includes(searchParams.printer)) {
          return false;
        }
        // 打印时间范围
        if (searchParams.printTimeRange && searchParams.printTimeRange.length === 2 && item.printTime) {
          const itemDate = new Date(item.printTime);
          const startDate = searchParams.printTimeRange[0];
          const endDate = searchParams.printTimeRange[1];
          const startTime = startDate && startDate.startOf ? startDate.startOf('day').toDate() : new Date(startDate);
          const endTime = endDate && endDate.endOf ? endDate.endOf('day').toDate() : new Date(endDate);
          startTime.setHours(0, 0, 0, 0);
          endTime.setHours(23, 59, 59, 999);
          if (itemDate < startTime || itemDate > endTime) {
            return false;
          }
        }
        return true;
      });

      const start = (pageNo - 1) * pageSize;
      const end = start + pageSize;
      const pageData = filteredData.slice(start, end);

      await this.setStatePromise({
        dataList: pageData,
        total: filteredData.length
      });
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      await this.setStatePromise({ loading: false });
    }
  }

  getColumns() {
    const { Button, Tag } = window.antd;

    return [
      {
        title: '批次号',
        dataIndex: 'batchNo',
        key: 'batchNo',
        width: 130
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 150
      },
      {
        title: '规格型号',
        dataIndex: 'specModel',
        key: 'specModel',
        width: 180,
        ellipsis: true
      },
      {
        title: '计量单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 90
      },
      {
        title: '打印数量',
        dataIndex: 'printQty',
        key: 'printQty',
        width: 90,
        align: 'right'
      },
      {
        title: '生产日期',
        dataIndex: 'produceDate',
        key: 'produceDate',
        width: 110
      },
      {
        title: '打印状态',
        dataIndex: 'printStatus',
        key: 'printStatus',
        width: 90,
        render: (status) => (
          <Tag color={status === 'printed' ? 'success' : 'warning'}>
            {status === 'printed' ? '已打印' : '待打印'}
          </Tag>
        )
      },
      {
        title: '打印人',
        dataIndex: 'printer',
        key: 'printer',
        width: 90,
        render: (printer) => printer || '-'
      },
      {
        title: '打印时间',
        dataIndex: 'printTime',
        key: 'printTime',
        width: 150,
        render: (time) => time || '-'
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        fixed: 'right',
        render: (_, record) => this.renderActions(record)
      }
    ];
  }

  handleSearch() {
    this.setState({ pageNo: 1 }, () => this.loadData());
  }

  handleReset() {
    this.setState({
      searchParams: {
        batchNo: '',
        productName: '',
        specModel: '',
        unit: '',
        printStatus: 'all',
        printer: '',
        printTimeRange: null
      },
      pageNo: 1
    }, () => this.loadData());
  }

  handlePageChange(page, pageSize) {
    this.setState({ pageNo: page, pageSize }, () => this.loadData());
  }

  handleSearchParamChange(field, value) {
    this.setState({
      searchParams: {
        ...this.state.searchParams,
        [field]: value
      }
    });
  }

  // 预览
  handlePreview(record) {
    const { Modal } = window.antd;
    Modal.info({
      title: '打印预览',
      width: 480,
      content: (
        <div style={{ marginTop: 16 }}>
          <p><strong>批次号：</strong>{record.batchNo}</p>
          <p><strong>产品名称：</strong>{record.productName}</p>
          <p><strong>规格型号：</strong>{record.specModel}</p>
          <p><strong>计量单位：</strong>{record.unit}</p>
          <p><strong>打印数量：</strong>{record.printQty}</p>
          <p><strong>生产日期：</strong>{record.produceDate}</p>
          <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', textAlign: 'center' }}>
            <svg width="200" height="80" viewBox="0 0 200 80">
              <rect x="10" y="10" width="180" height="60" fill="white" stroke="#000" strokeWidth="2"/>
              <text x="100" y="35" textAnchor="middle" fontSize="12">{record.batchNo}</text>
              <text x="100" y="55" textAnchor="middle" fontSize="10">{record.productName}</text>
            </svg>
            <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>条码预览区域</p>
          </div>
        </div>
      ),
      okText: '关闭'
    });
  }

  // 打印
  handlePrint(record) {
    const { Modal, message } = window.antd;
    Modal.confirm({
      title: '确认打印',
      content: `确定要打印批次 "${record.batchNo}" 的产品码吗？打印数量：${record.printQty}`,
      okText: '确认打印',
      cancelText: '取消',
      onOk: () => {
        message.success(`批次 ${record.batchNo} 打印任务已提交`);
      }
    });
  }

  // 补打
  handleReprint(record) {
    const { Modal, message, InputNumber } = window.antd;
    let reprintQty = 1;

    Modal.confirm({
      title: '补打产品码',
      content: (
        <div style={{ marginTop: 16 }}>
          <p>批次号：{record.batchNo}</p>
          <p>产品名称：{record.productName}</p>
          <p>原打印数量：{record.printQty}</p>
          <div style={{ marginTop: 16 }}>
            <span>补打数量：</span>
            <InputNumber
              min={1}
              max={100}
              defaultValue={1}
              onChange={(value) => { reprintQty = value; }}
            />
          </div>
        </div>
      ),
      okText: '确认补打',
      cancelText: '取消',
      onOk: () => {
        message.success(`批次 ${record.batchNo} 补打 ${reprintQty} 张任务已提交`);
      }
    });
  }

  renderActions(record) {
    const { Button } = window.antd;

    return (
      <>
        <Button
          type="link"
          style={{ padding: '4px', marginRight: 8 }}
          onClick={() => this.handlePreview(record)}
        >
          预览
        </Button>
        <Button
          type="link"
          style={{ padding: '4px', marginRight: 8 }}
          onClick={() => this.handlePrint(record)}
        >
          打印
        </Button>
        <Button
          type="link"
          style={{ padding: '4px' }}
          onClick={() => this.handleReprint(record)}
        >
          补打
        </Button>
      </>
    );
  }

  // 获取自动完成候选值
  getAutoCompleteOptions(field) {
    const { mockData } = this.state;
    const values = [...new Set(mockData.map(item => item[field]).filter(Boolean))];
    return values.map(value => ({ value, label: value }));
  }

  renderSearchArea() {
    const { Input, Select, Button, Space, DatePicker, AutoComplete } = window.antd;
    const { searchParams, searchExpanded } = this.state;

    return (
      <div className="search-area">
        <div className="search-row">
          <div className="search-item">
            <span className="search-label">批次号：</span>
            <AutoComplete
              placeholder="请输入"
              value={searchParams.batchNo}
              options={this.getAutoCompleteOptions('batchNo')}
              onChange={(value) => this.handleSearchParamChange('batchNo', value)}
              onSelect={(value) => this.handleSearchParamChange('batchNo', value)}
              allowClear
              filterOption={(input, option) =>
                option.value.toLowerCase().includes(input.toLowerCase())
              }
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">产品名称：</span>
            <AutoComplete
              placeholder="请输入"
              value={searchParams.productName}
              options={this.getAutoCompleteOptions('productName')}
              onChange={(value) => this.handleSearchParamChange('productName', value)}
              onSelect={(value) => this.handleSearchParamChange('productName', value)}
              allowClear
              filterOption={(input, option) =>
                option.value.toLowerCase().includes(input.toLowerCase())
              }
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">规格型号：</span>
            <AutoComplete
              placeholder="请输入"
              value={searchParams.specModel}
              options={this.getAutoCompleteOptions('specModel')}
              onChange={(value) => this.handleSearchParamChange('specModel', value)}
              onSelect={(value) => this.handleSearchParamChange('specModel', value)}
              allowClear
              filterOption={(input, option) =>
                option.value.toLowerCase().includes(input.toLowerCase())
              }
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">计量单位：</span>
            <AutoComplete
              placeholder="请输入"
              value={searchParams.unit}
              options={this.getAutoCompleteOptions('unit')}
              onChange={(value) => this.handleSearchParamChange('unit', value)}
              onSelect={(value) => this.handleSearchParamChange('unit', value)}
              allowClear
              filterOption={(input, option) =>
                option.value.toLowerCase().includes(input.toLowerCase())
              }
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="search-row" style={{ display: searchExpanded ? 'flex' : 'none' }}>
          <div className="search-item">
            <span className="search-label">打印状态：</span>
            <Select
              placeholder="请选择"
              value={searchParams.printStatus === 'all' ? undefined : searchParams.printStatus}
              onChange={(value) => this.handleSearchParamChange('printStatus', value || 'all')}
              allowClear
              style={{ flex: 1 }}
            >
              <Select.Option value="printed">已打印</Select.Option>
              <Select.Option value="pending">待打印</Select.Option>
            </Select>
          </div>
          <div className="search-item">
            <span className="search-label">打印人：</span>
            <AutoComplete
              placeholder="请输入"
              value={searchParams.printer}
              options={this.getAutoCompleteOptions('printer').filter(item => item.value)}
              onChange={(value) => this.handleSearchParamChange('printer', value)}
              onSelect={(value) => this.handleSearchParamChange('printer', value)}
              allowClear
              filterOption={(input, option) =>
                option.value.toLowerCase().includes(input.toLowerCase())
              }
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">打印时间：</span>
            <DatePicker.RangePicker
              style={{ flex: 1 }}
              placeholder={['开始日期', '结束日期']}
              value={searchParams.printTimeRange}
              onChange={(dates) => this.handleSearchParamChange('printTimeRange', dates)}
            />
          </div>
          <div className="search-item" />
        </div>

        <div className="search-actions">
          <Space>
            <Button onClick={() => this.handleReset()}>重置</Button>
            <Button type="primary" onClick={() => this.handleSearch()}>查询</Button>
            <Button
              type="link"
              onClick={() => this.setState({ searchExpanded: !searchExpanded })}
            >
              {searchExpanded ? '收起' : '展开'}
              <svg style={{ marginLeft: 2, width: 12, height: 12, transition: 'transform 0.3s', transform: searchExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </Button>
          </Space>
        </div>
      </div>
    );
  }

  renderTableArea() {
    const { Table, Pagination, Button, Dropdown, Checkbox } = window.antd;
    const { dataList, loading, pageNo, pageSize, total, selectedRowKeys } = this.state;

    // 行选择配置
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
      columnTitle: (
        <Dropdown
          overlay={
            <div className="checkbox-dropdown-menu">
              <div className="checkbox-menu-item" onClick={() => {
                const allIds = dataList.map(item => item._id);
                const currentSelected = this.state.selectedRowKeys || [];
                if (currentSelected.length === allIds.length) {
                  this.setState({ selectedRowKeys: [] });
                } else {
                  this.setState({ selectedRowKeys: allIds });
                }
              }}>
                全选所有
              </div>
              <div className="checkbox-menu-item" onClick={() => {
                const allIds = dataList.map(item => item._id);
                const currentSelected = this.state.selectedRowKeys || [];
                const newSelected = allIds.filter(id => !currentSelected.includes(id));
                this.setState({ selectedRowKeys: newSelected });
              }}>
                反选
              </div>
              <div className="checkbox-menu-item" onClick={() => this.setState({ selectedRowKeys: [] })}>
                清空选择
              </div>
            </div>
          }
          trigger={['click']}
        >
          <div className="checkbox-dropdown-trigger" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < dataList.length}
              checked={selectedRowKeys.length === dataList.length && dataList.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  this.setState({ selectedRowKeys: dataList.map(item => item._id) });
                } else {
                  this.setState({ selectedRowKeys: [] });
                }
              }}
            />
            <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </Dropdown>
      )
    };

    return (
      <div className="table-area">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="btn-group">
              <Button type="primary" className="icon-text-btn" onClick={() => this.handleAdd()}>
                <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span className="text">新增</span>
              </Button>
              <Button type="primary" className="icon-text-btn" onClick={() => {
                const { message } = window.antd;
                if (!selectedRowKeys || selectedRowKeys.length === 0) {
                  message.warning('请先选择要打印的数据');
                  return;
                }
                message.success(`已提交 ${selectedRowKeys.length} 条批量打印任务`);
              }}>
                <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                <span className="text">批量打印</span>
              </Button>
              <Button className="icon-text-btn" onClick={() => {
                const { message } = window.antd;
                message.success('导出任务已提交');
              }}>
                <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span className="text">导出</span>
              </Button>
            </div>
          </div>
          <div className="toolbar-right">
          </div>
        </div>
        <div className="table-scroll-wrap">
          <Table
            columns={this.getColumns()}
            dataSource={dataList}
            rowKey="_id"
            loading={loading}
            pagination={false}
            scroll={{ x: 1100, y: 'calc(100vh - 320px)' }}
            rowSelection={rowSelection}
          />
        </div>
        <div className="pagination-bar">
          <span className="pagination-total">共 {total} 条</span>
          <Pagination
            current={pageNo}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={false}
            onChange={(page, size) => this.handlePageChange(page, size)}
          />
        </div>
      </div>
    );
  }

  renderJSX() {
    const { ConfigProvider } = window.antd;

    return (
      <ConfigProvider locale={this.getLocale()}>
        <div className="main-container">
          {this.renderSearchArea()}
          {this.renderTableArea()}
        </div>
      </ConfigProvider>
    );
  }

  getLocale() {
    const t = window.DayjsLocale.getZhCN();
    return t;
  }

  // 新增
  handleAdd() {
    const { Modal, Form, Input, DatePicker, InputNumber, message } = window.antd;
    const formRef = React.createRef();

    Modal.confirm({
      title: '新增产品码',
      width: 520,
      content: (
        <Form
          ref={formRef}
          layout="vertical"
          style={{ marginTop: 16 }}
          initialValues={{
            batchNo: this.generateBatchNo(),
            printQty: 1,
            produceDate: moment()
          }}
        >
          <Form.Item
            label="批次号"
            name="batchNo"
            rules={[{ required: true, message: '请输入批次号' }]}
          >
            <Input placeholder="请输入批次号" disabled />
          </Form.Item>
          <Form.Item
            label="产品名称"
            name="productName"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          <Form.Item
            label="规格型号"
            name="specModel"
            rules={[{ required: true, message: '请输入规格型号' }]}
          >
            <Input placeholder="请输入规格型号" />
          </Form.Item>
          <Form.Item
            label="计量单位"
            name="unit"
            rules={[{ required: true, message: '请输入计量单位' }]}
          >
            <Input placeholder="请输入计量单位" />
          </Form.Item>
          <Form.Item
            label="打印数量"
            name="printQty"
            rules={[{ required: true, message: '请输入打印数量' }]}
          >
            <InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="请输入打印数量" />
          </Form.Item>
          <Form.Item
            label="生产日期"
            name="produceDate"
            rules={[{ required: true, message: '请选择生产日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择生产日期" />
          </Form.Item>
        </Form>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const form = formRef.current;
        if (form) {
          form.validateFields().then(values => {
            const newRecord = {
              _id: String(Date.now()),
              batchNo: values.batchNo,
              productName: values.productName,
              specModel: values.specModel,
              unit: values.unit,
              printQty: values.printQty,
              produceDate: values.produceDate ? values.produceDate.format('YYYY-MM-DD') : '',
              printStatus: 'pending',
              printer: '',
              printTime: ''
            };
            this.setState({
              mockData: [newRecord, ...this.state.mockData],
              total: this.state.total + 1
            }, () => {
              this.loadData();
              message.success('新增成功');
            });
          }).catch(() => {
            return Promise.reject();
          });
        }
      }
    });
  }

  // 生成批次号
  generateBatchNo() {
    const now = new Date();
    const dateStr = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const existingCount = this.state.mockData.filter(item =>
      item.batchNo.startsWith(dateStr)
    ).length;
    return `${dateStr}${String(existingCount + 1).padStart(3, '0')}`;
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    if (this.pollingTimer) clearInterval(this.pollingTimer);
  }
}
