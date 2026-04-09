class LowcodeComponent extends Component {
  constructor() {
    const { injectMesModuleMethods } = window.KaiwuMesModule;
    injectMesModuleMethods(this);
  }

  static PAGE_FORMCODE = 'MES_cpdym';
  static PAGE_FORMNAME = '产品码打印';

  // 模拟产品档案数据（在state中定义）

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
    selectedRowKeys: [],
    // 产品档案数据
    productArchives: [
      { _id: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', unitName: '千克' },
      { _id: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', unitName: '千克' },
      { _id: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', unitName: '千克' },
      { _id: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', unitName: '千克' },
      { _id: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', unitName: '千克' },
      { _id: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', unitName: '千克' }
    ],
    // 新增打印弹窗相关
    isAddModalVisible: false,
    addModalCurrentStep: 0,
    addFormData: {
      materialId: '',
      materialCode: '',
      materialName: '',
      unitName: '',
      batchNo: '',
      quantity: null,
      produceDate: null,
      downContent: '',
      fluffiness: '',
      cleanliness: '',
      oxygenConsumption: ''
    }
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
        if (searchParams.materialName && !item.materialName.includes(searchParams.materialName)) {
          return false;
        }
        // 打印状态 - 精确匹配
        if (searchParams.printStatus !== 'all' && item.printStatus !== searchParams.printStatus) {
          return false;
        }
        // 生产日期范围
        if (searchParams.produceDateRange && searchParams.produceDateRange.length === 2) {
          const itemDate = new Date(item.produceDate);
          const startDate = searchParams.produceDateRange[0];
          const endDate = searchParams.produceDateRange[1];
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

      // 排序：按创建时间降序
      filteredData.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

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
    const { pageNo, pageSize } = this.state;

    return [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (_, __, index) => (pageNo - 1) * pageSize + index + 1
      },
      {
        title: '批次号',
        dataIndex: 'batchNo',
        key: 'batchNo',
        width: 130,
        render: (text, record) => (
          <Button type="link" style={{ padding: 0 }} onClick={() => this.handleViewDetail(record)}>
            {text}
          </Button>
        )
      },
      {
        title: '产品名称',
        dataIndex: 'materialName',
        key: 'materialName',
        width: 140
      },
      {
        title: '产品编号',
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 100
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 100,
        align: 'right',
        render: (qty, record) => `${qty} ${record.unitName}`
      },
      {
        title: '生产日期',
        dataIndex: 'produceDate',
        key: 'produceDate',
        width: 110
      },
      {
        title: '绒子含量',
        dataIndex: 'downContent',
        key: 'downContent',
        width: 90
      },
      {
        title: '蓬松度',
        dataIndex: 'fluffiness',
        key: 'fluffiness',
        width: 90
      },
      {
        title: '打印状态',
        dataIndex: 'printStatus',
        key: 'printStatus',
        width: 90,
        render: (status) => (
          <Tag color={status === '已打印' ? 'success' : 'warning'}>
            {status}
          </Tag>
        )
      },
      {
        title: '打印次数',
        dataIndex: 'printCount',
        key: 'printCount',
        width: 90,
        align: 'center'
      },
      {
        title: '创建人',
        dataIndex: 'createBy',
        key: 'createBy',
        width: 90
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        fixed: 'right',
        render: (_, record) => this.renderActions(record)
      }
    ];
  }

  renderActions(record) {
    const { Button } = window.antd;
    const canReprint = record.printStatus === '已打印' && record.printCount < 4;

    return (
      <>
        <Button
          type="link"
          style={{ padding: '4px', marginRight: 8 }}
          onClick={() => this.handleViewDetail(record)}
        >
          查看
        </Button>
        {record.printStatus === '未打印' ? (
          <Button
            type="link"
            style={{ padding: '4px' }}
            onClick={() => this.handlePrint(record)}
          >
            打印
          </Button>
        ) : canReprint ? (
          <Button
            type="link"
            style={{ padding: '4px' }}
            onClick={() => this.handleReprint(record)}
          >
            补打
          </Button>
        ) : (
          <Button
            type="link"
            style={{ padding: '4px' }}
            disabled
          >
            已达上限
          </Button>
        )}
      </>
    );
  }

  handleSearch() {
    this.setState({ pageNo: 1 }, () => this.loadData());
  }

  handleReset() {
    this.setState({
      searchParams: {
        batchNo: '',
        materialName: '',
        printStatus: 'all',
        produceDateRange: null
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

  // 查看详情
  handleViewDetail(record) {
    const { Modal, Tag } = window.antd;

    Modal.info({
      title: '批次详情',
      width: 560,
      content: (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <p><strong>批次号：</strong>{record.batchNo}</p>
              <p><strong>产品名称：</strong>{record.materialName}</p>
              <p><strong>产品编号：</strong>{record.materialCode}</p>
              <p><strong>数量：</strong>{record.quantity} {record.unitName}</p>
              <p><strong>生产日期：</strong>{record.produceDate}</p>
            </div>
            <div style={{ width: 120, textAlign: 'center' }}>
              <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <rect x="5" y="5" width="70" height="70" fill="white" stroke="#000" strokeWidth="2"/>
                  <text x="40" y="35" textAnchor="middle" fontSize="10">溯源码</text>
                  <text x="40" y="55" textAnchor="middle" fontSize="8">{record.batchNo}</text>
                </svg>
                <p style={{ fontSize: 10, color: '#999', marginTop: 4 }}>扫码溯源</p>
              </div>
            </div>
          </div>
          <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, marginBottom: 12 }}>
            <p style={{ marginBottom: 8, fontWeight: 'bold' }}>质检信息</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ width: '50%', marginBottom: 4 }}><strong>绒子含量：</strong>{record.downContent}</div>
              <div style={{ width: '50%', marginBottom: 4 }}><strong>蓬松度：</strong>{record.fluffiness}</div>
              <div style={{ width: '50%' }}><strong>清洁度：</strong>{record.cleanliness}</div>
              <div style={{ width: '50%' }}><strong>耗氧量：</strong>{record.oxygenConsumption}</div>
            </div>
          </div>
          <p><strong>打印状态：</strong>
            <Tag color={record.printStatus === '已打印' ? 'success' : 'warning'}>
              {record.printStatus}
            </Tag>
            {record.printStatus === '已打印' && <span style={{ marginLeft: 8 }}>打印次数：{record.printCount} 次</span>}
          </p>
          <p><strong>创建人：</strong>{record.createBy}</p>
          <p><strong>创建时间：</strong>{record.createTime}</p>
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
      content: `确定要打印批次 "${record.batchNo}" 的产品码吗？打印数量：${record.quantity}`,
      okText: '确认打印',
      cancelText: '取消',
      onOk: async () => {
        const { mockData } = this.state;
        const newMockData = mockData.map(item => {
          if (item._id === record._id) {
            return {
              ...item,
              printStatus: '已打印',
              printCount: 1
            };
          }
          return item;
        });
        await this.setStatePromise({ mockData: newMockData });
        message.success(`批次 ${record.batchNo} 打印成功`);
        this.loadData();
      }
    });
  }

  // 补打
  handleReprint(record) {
    const { Modal, message } = window.antd;

    if (record.printCount >= 4) {
      message.warning('已达到最大补打次数（3次）');
      return;
    }

    Modal.confirm({
      title: '补打产品码',
      content: (
        <div style={{ marginTop: 16 }}>
          <p><strong>批次号：</strong>{record.batchNo}</p>
          <p><strong>产品名称：</strong>{record.materialName}</p>
          <p><strong>当前打印次数：</strong>{record.printCount} 次</p>
          <p style={{ color: '#999', marginTop: 8 }}>注意：最多可补打3次（总打印次数≤4）</p>
        </div>
      ),
      okText: '确认补打',
      cancelText: '取消',
      onOk: async () => {
        const { mockData } = this.state;
        const newMockData = mockData.map(item => {
          if (item._id === record._id) {
            return {
              ...item,
              printCount: item.printCount + 1
            };
          }
          return item;
        });
        await this.setStatePromise({ mockData: newMockData });
        message.success(`批次 ${record.batchNo} 补打成功`);
        this.loadData();
      }
    });
  }

  renderSearchArea() {
    const { Input, Select, Button, Space, DatePicker } = window.antd;
    const { searchParams } = this.state;

    return (
      <div className="search-area">
        <div className="search-row">
          <div className="search-item">
            <span className="search-label">批次号：</span>
            <Input
              placeholder="请输入"
              value={searchParams.batchNo}
              onChange={(e) => this.handleSearchParamChange('batchNo', e.target.value)}
              allowClear
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">产品名称：</span>
            <Input
              placeholder="请输入"
              value={searchParams.materialName}
              onChange={(e) => this.handleSearchParamChange('materialName', e.target.value)}
              allowClear
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">打印状态：</span>
            <Select
              placeholder="请选择"
              value={searchParams.printStatus === 'all' ? undefined : searchParams.printStatus}
              onChange={(value) => this.handleSearchParamChange('printStatus', value || 'all')}
              allowClear
              style={{ flex: 1 }}
            >
              <Select.Option value="已打印">已打印</Select.Option>
              <Select.Option value="未打印">未打印</Select.Option>
            </Select>
          </div>
          <div className="search-item">
            <span className="search-label">生产日期：</span>
            <DatePicker.RangePicker
              style={{ flex: 1 }}
              placeholder={['开始日期', '结束日期']}
              value={searchParams.produceDateRange}
              onChange={(dates) => this.handleSearchParamChange('produceDateRange', dates)}
            />
          </div>
        </div>

        <div className="search-actions">
          <Space>
            <Button onClick={() => this.handleReset()}>重置</Button>
            <Button type="primary" onClick={() => this.handleSearch()}>查询</Button>
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
                <span className="text">新增打印</span>
              </Button>
              <Button className="icon-text-btn" onClick={() => this.handleBatchExport()}>
                <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span className="text">批量导出</span>
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
            scroll={{ x: 1300, y: 'calc(100vh - 320px)' }}
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

  // 批量导出
  handleBatchExport() {
    const { message } = window.antd;
    const { dataList } = this.state;

    if (dataList.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }

    // 构建CSV数据
    const headers = ['批次号', '产品名称', '产品编号', '数量', '单位', '生产日期', '绒子含量', '蓬松度', '清洁度', '耗氧量', '打印状态', '打印次数', '创建人', '创建时间'];
    const rows = dataList.map(item => [
      item.batchNo,
      item.materialName,
      item.materialCode,
      item.quantity,
      item.unitName,
      item.produceDate,
      item.downContent,
      item.fluffiness,
      item.cleanliness,
      item.oxygenConsumption,
      item.printStatus,
      item.printCount,
      item.createBy,
      item.createTime
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // 下载文件
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.href = URL.createObjectURL(blob);
    link.download = `产品批次_${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('导出成功');
  }

  // 新增打印
  handleAdd() {
    this.setState({
      isAddModalVisible: true,
      addModalCurrentStep: 0,
      addFormData: {
        materialId: '',
        materialCode: '',
        materialName: '',
        unitName: '',
        batchNo: '',
        quantity: null,
        produceDate: null,
        downContent: '',
        fluffiness: '',
        cleanliness: '',
        oxygenConsumption: ''
      }
    });
  }

  handleAddModalCancel() {
    this.setState({ isAddModalVisible: false });
  }

  handleAddFormChange(field, value) {
    this.setState({
      addFormData: {
        ...this.state.addFormData,
        [field]: value
      }
    });
  }

  // 生成批次号
  generateBatchNo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `BC${year}${month}${day}`;
    const existingCount = this.state.mockData.filter(item =>
      item.batchNo.startsWith(datePrefix)
    ).length;
    return `${datePrefix}${String(existingCount + 1).padStart(3, '0')}`;
  }

  // 渲染新增打印弹窗
  renderAddModal() {
    const { Modal, Steps, Step, Form, Select, Input, DatePicker, InputNumber, Button, message } = window.antd;
    const { isAddModalVisible, addModalCurrentStep, addFormData } = this.state;

    const steps = [
      { title: '选择产品', description: '从产品档案选择' },
      { title: '基本信息', description: '批次号和数量' },
      { title: '质检信息', description: '绒子含量等' },
      { title: '生成二维码', description: '预览并确认' },
      { title: '连接打印机', description: '选择打印设备' },
      { title: '完成打印', description: '打印并保存' }
    ];

    const handleNext = async () => {
      // 校验当前步骤
      if (addModalCurrentStep === 0) {
        if (!addFormData.materialId) {
          message.error('请选择产品档案');
          return;
        }
      } else if (addModalCurrentStep === 1) {
        if (!addFormData.batchNo) {
          message.error('请输入批次号');
          return;
        }
        if (!addFormData.quantity || addFormData.quantity <= 0) {
          message.error('请输入数量');
          return;
        }
        if (!addFormData.produceDate) {
          message.error('请选择生产日期');
          return;
        }
        // 校验批次号唯一性
        const exists = this.state.mockData.some(item =>
          item.batchNo.toLowerCase() === addFormData.batchNo.toLowerCase()
        );
        if (exists) {
          message.error('批次号已存在');
          return;
        }
      } else if (addModalCurrentStep === 2) {
        if (!addFormData.downContent || !addFormData.fluffiness ||
            !addFormData.cleanliness || !addFormData.oxygenConsumption) {
          message.error('请填写完整的质检信息');
          return;
        }
      }

      if (addModalCurrentStep < 5) {
        this.setState({ addModalCurrentStep: addModalCurrentStep + 1 });
      }
    };

    const handlePrev = () => {
      if (addModalCurrentStep > 0) {
        this.setState({ addModalCurrentStep: addModalCurrentStep - 1 });
      }
    };

    const handleFinish = async () => {
      const { mockData, addFormData } = this.state;
      const product = this.state.productArchives.find(p => p._id === addFormData.materialId);

      const newRecord = {
        _id: 'batch_' + Date.now(),
        batchNo: addFormData.batchNo,
        materialId: addFormData.materialId,
        materialCode: product.materialCode,
        materialName: product.materialName,
        quantity: addFormData.quantity,
        unitName: product.unitName,
        produceDate: addFormData.produceDate.format('YYYY-MM-DD'),
        downContent: addFormData.downContent,
        fluffiness: addFormData.fluffiness,
        cleanliness: addFormData.cleanliness,
        oxygenConsumption: addFormData.oxygenConsumption,
        printStatus: '已打印',
        printCount: 1,
        createBy: '当前用户',
        createTime: new Date().toLocaleString()
      };

      await this.setStatePromise({
        mockData: [newRecord, ...mockData],
        isAddModalVisible: false
      });
      message.success('新增打印成功');
      this.loadData();
    };

    // 步骤1：选择产品
    const renderStep1 = () => {
      return (
        <Form layout="vertical">
          <Form.Item label="产品档案" required>
            <Select
              placeholder="请选择产品档案"
              value={addFormData.materialId || undefined}
              onChange={(value) => {
                const product = this.state.productArchives.find(p => p._id === value);
                this.setState({
                  addFormData: {
                    ...addFormData,
                    materialId: value,
                    materialCode: product.materialCode,
                    materialName: product.materialName,
                    unitName: product.unitName
                  }
                });
              }}
              style={{ width: '100%' }}
            >
              {this.state.productArchives.map(p => (
                <Select.Option key={p._id} value={p._id}>
                  {p.materialName} ({p.materialCode})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {addFormData.materialId && (
            <>
              <Form.Item label="产品编号">
                <Input value={addFormData.materialCode} disabled />
              </Form.Item>
              <Form.Item label="计量单位">
                <Input value={addFormData.unitName} disabled />
              </Form.Item>
            </>
          )}
        </Form>
      );
    };

    // 步骤2：基本信息
    const renderStep2 = () => {
      return (
        <Form layout="vertical">
          <Form.Item label="批次号" required>
            <Input
              placeholder="请输入批次号，建议格式：BC+年月日+流水号"
              value={addFormData.batchNo}
              onChange={(e) => this.handleAddFormChange('batchNo', e.target.value)}
              maxLength={30}
            />
          </Form.Item>
          <Form.Item label="数量" required>
            <InputNumber
              min={1}
              max={999999}
              style={{ width: '100%' }}
              placeholder="请输入数量"
              value={addFormData.quantity}
              onChange={(value) => this.handleAddFormChange('quantity', value)}
            />
          </Form.Item>
          <Form.Item label="生产日期" required>
            <DatePicker
              style={{ width: '100%' }}
              placeholder="请选择生产日期"
              value={addFormData.produceDate}
              onChange={(date) => this.handleAddFormChange('produceDate', date)}
              disabledDate={(current) => current && current.valueOf() > Date.now()}
            />
          </Form.Item>
        </Form>
      );
    };

    // 步骤3：质检信息
    const renderStep3 = () => {
      return (
        <Form layout="vertical">
          <Form.Item label="绒子含量" required>
            <Input
              placeholder="如：95%"
              value={addFormData.downContent}
              onChange={(e) => this.handleAddFormChange('downContent', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="蓬松度" required>
            <Input
              placeholder="如：900+"
              value={addFormData.fluffiness}
              onChange={(e) => this.handleAddFormChange('fluffiness', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="清洁度" required>
            <Input
              placeholder="如：1000+"
              value={addFormData.cleanliness}
              onChange={(e) => this.handleAddFormChange('cleanliness', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="耗氧量" required>
            <Input
              placeholder="如：≤4.8"
              value={addFormData.oxygenConsumption}
              onChange={(e) => this.handleAddFormChange('oxygenConsumption', e.target.value)}
            />
          </Form.Item>
        </Form>
      );
    };

    // 步骤4：生成二维码
    const renderStep4 = () => {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 8, display: 'inline-block' }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <rect x="10" y="10" width="130" height="130" fill="white" stroke="#000" strokeWidth="2"/>
              <text x="75" y="60" textAnchor="middle" fontSize="14">溯源二维码</text>
              <text x="75" y="90" textAnchor="middle" fontSize="12">{addFormData.batchNo || '未填写'}</text>
              <text x="75" y="115" textAnchor="middle" fontSize="10">{addFormData.materialName || '未选择产品'}</text>
            </svg>
          </div>
          <p style={{ marginTop: 16, color: '#666' }}>
            溯源URL: https://guqi.example.com/trace/{addFormData.batchNo || 'XXXX'}
          </p>
        </div>
      );
    };

    // 步骤5：连接打印机
    const renderStep5 = () => {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1890ff" strokeWidth="1.5">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <p style={{ marginTop: 16 }}>正在连接打印机...</p>
          <p style={{ color: '#52c41a' }}>✓ 打印机连接成功（模拟）</p>
        </div>
      );
    };

    // 步骤6：完成打印
    const renderStep6 = () => {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#52c41a" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <p style={{ marginTop: 16, fontSize: 16 }}>打印任务已提交</p>
          <p style={{ color: '#666' }}>批次号：{addFormData.batchNo}</p>
          <p style={{ color: '#666' }}>打印数量：{addFormData.quantity} 张</p>
        </div>
      );
    };

    const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

    // 渲染步骤节点
    const renderStepNode = (index, title, description) => {
      const isCompleted = index < addModalCurrentStep;
      const isCurrent = index === addModalCurrentStep;
      const isPending = index > addModalCurrentStep;

      // 状态标签
      const getStatusLabel = () => {
        if (isCompleted) return { text: '已完成', color: '#52c41a', bgColor: '#f6ffed', borderColor: '#b7eb8f' };
        if (isCurrent) return { text: '进行中', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#91d5ff' };
        return { text: '待进行', color: '#8c8c8c', bgColor: '#fafafa', borderColor: '#d9d9d9' };
      };

      const status = getStatusLabel();

      return (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', padding: '0 4px' }}>
          {/* 步骤圆圈 */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isCompleted ? '#52c41a' : isCurrent ? '#1890ff' : '#fff',
              border: `2px solid ${isCompleted ? '#52c41a' : isCurrent ? '#1890ff' : '#d9d9d9'}`,
              color: isCompleted || isCurrent ? '#fff' : '#8c8c8c',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
              zIndex: 2,
              boxShadow: isCurrent ? '0 4px 12px rgba(24, 144, 255, 0.4)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {isCompleted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              index + 1
            )}
          </div>

          {/* 连接线（除了最后一个） */}
          {index < steps.length - 1 && (
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: 'calc(50% + 20px)',
                width: 'calc(100% - 40px)',
                height: 2,
                backgroundColor: index < addModalCurrentStep ? '#52c41a' : '#e8e8e8',
                zIndex: 1,
                transition: 'background-color 0.3s ease'
              }}
            />
          )}

          {/* 步骤名称 */}
          <div style={{
            fontSize: 13,
            fontWeight: isCurrent ? 600 : isCompleted ? 500 : 400,
            color: isCurrent ? '#1890ff' : isCompleted ? '#262626' : '#8c8c8c',
            marginBottom: 8,
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease'
          }}>
            {title}
          </div>

          {/* 状态标签 */}
          <div
            style={{
              fontSize: 11,
              color: status.color,
              backgroundColor: status.bgColor,
              padding: '3px 10px',
              borderRadius: 12,
              border: `1px solid ${status.borderColor}`,
              whiteSpace: 'nowrap',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
          >
            {status.text}
          </div>
        </div>
      );
    };

    // 步骤进度指示器
    const renderStepIndicator = () => (
      <div style={{
        marginBottom: 24,
        padding: '20px 16px',
        background: 'linear-gradient(180deg, #fafafa 0%, #fff 100%)',
        borderRadius: 8,
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {steps.map((step, index) => renderStepNode(index, step.title, step.description))}
        </div>
      </div>
    );

    return (
      <Modal
        title="新增产品码打印"
        open={isAddModalVisible}
        onCancel={() => this.handleAddModalCancel()}
        width={720}
        footer={null}
        destroyOnClose
      >
        {renderStepIndicator()}
        <div style={{ minHeight: 240, padding: '0 16px' }}>
          {stepContent[addModalCurrentStep]()}
        </div>
        <div style={{ textAlign: 'right', marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          {addModalCurrentStep > 0 && addModalCurrentStep < 5 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrev}>
              上一步
            </Button>
          )}
          {addModalCurrentStep < 5 && (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          )}
          {addModalCurrentStep === 5 && (
            <Button type="primary" onClick={handleFinish}>
              完成
            </Button>
          )}
        </div>
      </Modal>
    );
  }

  renderJSX() {
    const { ConfigProvider } = window.antd;

    return (
      <ConfigProvider locale={this.getLocale()}>
        <div className="main-container">
          {this.renderSearchArea()}
          {this.renderTableArea()}
          {this.renderAddModal()}
        </div>
      </ConfigProvider>
    );
  }

  getLocale() {
    const t = window.DayjsLocale.getZhCN();
    return t;
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }
}
