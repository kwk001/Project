class LowcodeComponent extends Component {
  constructor() {
    const { injectMesModuleMethods } = window.KaiwuMesModule;
    injectMesModuleMethods(this);
  }

  static PAGE_FORMCODE = 'MES_jldwgl';
  static PAGE_FORMNAME = '计量单位管理';

  // 生成单位编码：YYYYMMDD + 3位流水号，每日重置
  generateUnitCode(date, seq) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const seqStr = String(seq).padStart(3, '0');
    return `${year}${month}${day}${seqStr}`;
  }

  state = {
    mockData: [
      { _id: '1', unitCode: '20240115001', unitName: '千克', status: 'active', remark: '质量基本单位', createTime: '2024-01-15 10:30:00', creator: '张三' },
      { _id: '2', unitCode: '20240115002', unitName: '克', status: 'active', remark: '', createTime: '2024-01-15 11:20:00', creator: '张三' },
      { _id: '3', unitCode: '20240116001', unitName: '吨', status: 'active', remark: '', createTime: '2024-01-16 09:15:00', creator: '李四' },
      { _id: '4', unitCode: '20240116002', unitName: '毫克', status: 'active', remark: '小剂量计量', createTime: '2024-01-16 14:30:00', creator: '李四' },
      { _id: '5', unitCode: '20240117001', unitName: '升', status: 'active', remark: '体积基本单位', createTime: '2024-01-17 08:45:00', creator: '张三' },
      { _id: '6', unitCode: '20240117002', unitName: '毫升', status: 'active', remark: '', createTime: '2024-01-17 10:20:00', creator: '张三' },
      { _id: '7', unitCode: '20240118001', unitName: '米', status: 'active', remark: '长度基本单位', createTime: '2024-01-18 09:00:00', creator: '王五' },
      { _id: '8', unitCode: '20240118002', unitName: '厘米', status: 'active', remark: '', createTime: '2024-01-18 11:30:00', creator: '王五' },
      { _id: '9', unitCode: '20240119001', unitName: '毫米', status: 'active', remark: '', createTime: '2024-01-19 08:15:00', creator: '张三' },
      { _id: '10', unitCode: '20240119002', unitName: '千米', status: 'active', remark: '公里', createTime: '2024-01-19 14:45:00', creator: '张三' },
      { _id: '11', unitCode: '20240120001', unitName: '平方米', status: 'active', remark: '面积基本单位', createTime: '2024-01-20 09:30:00', creator: '李四' },
      { _id: '12', unitCode: '20240120002', unitName: '立方米', status: 'active', remark: '体积单位', createTime: '2024-01-20 11:00:00', creator: '李四' },
      { _id: '13', unitCode: '20240121001', unitName: '件', status: 'active', remark: '计数单位', createTime: '2024-01-21 08:45:00', creator: '王五' },
      { _id: '14', unitCode: '20240121002', unitName: '套', status: 'active', remark: '组合单位', createTime: '2024-01-21 13:20:00', creator: '王五' },
      { _id: '15', unitCode: '20240122001', unitName: '箱', status: 'active', remark: '包装单位', createTime: '2024-01-22 09:10:00', creator: '张三' },
      { _id: '16', unitCode: '20240122002', unitName: '小时', status: 'active', remark: '时间单位', createTime: '2024-01-22 15:30:00', creator: '张三' },
      { _id: '17', unitCode: '20240123001', unitName: '分钟', status: 'active', remark: '', createTime: '2024-01-23 08:20:00', creator: '李四' },
      { _id: '18', unitCode: '20240123002', unitName: '秒', status: 'active', remark: '', createTime: '2024-01-23 11:45:00', creator: '李四' },
      { _id: '19', unitCode: '20240124001', unitName: '天', status: 'active', remark: '', createTime: '2024-01-24 09:00:00', creator: '王五' },
      { _id: '20', unitCode: '20240124002', unitName: '磅', status: 'inactive', remark: '英制重量单位', createTime: '2024-01-24 14:15:00', creator: '王五' },
      { _id: '21', unitCode: '20240125001', unitName: '盎司', status: 'active', remark: '', createTime: '2024-01-25 08:30:00', creator: '张三' },
      { _id: '22', unitCode: '20240125002', unitName: '加仑', status: 'active', remark: '美制容量单位', createTime: '2024-01-25 13:00:00', creator: '张三' },
      { _id: '23', unitCode: '20240126001', unitName: '英尺', status: 'inactive', remark: '英制长度单位', createTime: '2024-01-26 09:45:00', creator: '李四' },
      { _id: '24', unitCode: '20240126002', unitName: '英寸', status: 'active', remark: '', createTime: '2024-01-26 11:20:00', creator: '李四' },
      { _id: '25', unitCode: '20240127001', unitName: '码', status: 'inactive', remark: '', createTime: '2024-01-27 08:00:00', creator: '王五' },
      { _id: '26', unitCode: '20240127002', unitName: '双', status: 'active', remark: '成对物品计数', createTime: '2024-01-27 14:30:00', creator: '王五' },
      { _id: '27', unitCode: '20240128001', unitName: '打', status: 'active', remark: '12件为一打', createTime: '2024-01-28 09:15:00', creator: '张三' },
      { _id: '28', unitCode: '20240128002', unitName: '卷', status: 'active', remark: '卷材单位', createTime: '2024-01-28 13:45:00', creator: '张三' },
      { _id: '29', unitCode: '20240129001', unitName: '捆', status: 'active', remark: '', createTime: '2024-01-29 08:30:00', creator: '李四' },
      { _id: '30', unitCode: '20240129002', unitName: '袋', status: 'active', remark: '', createTime: '2024-01-29 11:00:00', creator: '李四' },
      { _id: '31', unitCode: '20240130001', unitName: '瓶', status: 'active', remark: '瓶装单位', createTime: '2024-01-30 09:00:00', creator: '王五' },
      { _id: '32', unitCode: '20240130002', unitName: '罐', status: 'active', remark: '罐装单位', createTime: '2024-01-30 14:20:00', creator: '王五' },
      { _id: '33', unitCode: '20240131001', unitName: '包', status: 'active', remark: '', createTime: '2024-01-31 08:45:00', creator: '张三' },
      { _id: '34', unitCode: '20240131002', unitName: '千克/套', status: 'active', remark: '组合计量单位', createTime: '2024-01-31 13:30:00', creator: '张三' },
      { _id: '35', unitCode: '20240201001', unitName: '米/千克', status: 'active', remark: '线密度单位', createTime: '2024-02-01 09:10:00', creator: '李四' },
      { _id: '36', unitCode: '20240201002', unitName: '千瓦', status: 'active', remark: '功率单位', createTime: '2024-02-01 11:40:00', creator: '李四' },
      { _id: '37', unitCode: '20240202001', unitName: '瓦', status: 'active', remark: '', createTime: '2024-02-02 08:20:00', creator: '王五' },
      { _id: '38', unitCode: '20240202002', unitName: '千瓦时', status: 'active', remark: '电能单位', createTime: '2024-02-02 14:00:00', creator: '王五' },
      { _id: '39', unitCode: '20240203001', unitName: '伏特', status: 'active', remark: '电压单位', createTime: '2024-02-03 09:30:00', creator: '张三' },
      { _id: '40', unitCode: '20240203002', unitName: '安培', status: 'active', remark: '电流单位', createTime: '2024-02-03 13:15:00', creator: '张三' },
      { _id: '41', unitCode: '20240204001', unitName: '赫兹', status: 'active', remark: '频率单位', createTime: '2024-02-04 08:50:00', creator: '李四' },
      { _id: '42', unitCode: '20240204002', unitName: '千帕', status: 'active', remark: '压力单位', createTime: '2024-02-04 11:25:00', creator: '李四' },
      { _id: '43', unitCode: '20240205001', unitName: '兆帕', status: 'active', remark: '', createTime: '2024-02-05 09:05:00', creator: '王五' },
      { _id: '44', unitCode: '20240205002', unitName: '巴', status: 'active', remark: '', createTime: '2024-02-05 14:40:00', creator: '王五' },
      { _id: '45', unitCode: '20240206001', unitName: '磅力/平方英寸', status: 'inactive', remark: '英制压力单位', createTime: '2024-02-06 08:15:00', creator: '张三' },
      { _id: '46', unitCode: '20240206002', unitName: '摄氏度', status: 'active', remark: '温度单位', createTime: '2024-02-06 12:00:00', creator: '张三' },
      { _id: '47', unitCode: '20240207001', unitName: '华氏度', status: 'inactive', remark: '英制温度单位', createTime: '2024-02-07 09:20:00', creator: '李四' },
      { _id: '48', unitCode: '20240207002', unitName: '百万分率', status: 'active', remark: '浓度单位', createTime: '2024-02-07 13:55:00', creator: '李四' },
      { _id: '49', unitCode: '20240208001', unitName: '酸碱度', status: 'active', remark: '', createTime: '2024-02-08 08:40:00', creator: '王五' },
      { _id: '50', unitCode: '20240208002', unitName: '纳米', status: 'active', remark: '微观长度单位', createTime: '2024-02-08 11:10:00', creator: '王五' }
    ],
    dataList: [],
    loading: false,
    currentRecord: null,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    searchParams: {
      unitCode: '',
      unitName: '',
      status: 'all'
    },
    isModalVisible: false,
    isEdit: false,
    modalLoading: false,
    searchExpanded: false,
    selectedRowKeys: [],
    formData: {
      unitCode: '',
      unitName: '',
      status: 'active'
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
        // 单位编号 - 模糊搜索（不区分大小写）
        if (searchParams.unitCode && !item.unitCode.toLowerCase().includes(searchParams.unitCode.toLowerCase())) {
          return false;
        }
        // 单位名称 - 模糊搜索
        if (searchParams.unitName && !item.unitName.includes(searchParams.unitName)) {
          return false;
        }
        // 状态 - 精确匹配
        if (searchParams.status !== 'all' && item.status !== searchParams.status) {
          return false;
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
    const { Button, Switch } = window.antd;
    const { pageNo, pageSize } = this.state;

    return [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (_, __, index) => (pageNo - 1) * pageSize + index + 1
      },
      {
        title: '单位名称',
        dataIndex: 'unitName',
        key: 'unitName',
        width: 120
      },
      {
        title: '单位编号',
        dataIndex: 'unitCode',
        key: 'unitCode',
        width: 120
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (status, record) => (
          <Switch
            size="small"
            checked={status === 'active'}
            onChange={(checked) => this.handleStatusChange(record._id, checked)}
          />
        )
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
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

  handleStatusChange(id, checked) {
    const { message } = window.antd;
    const { mockData } = this.state;
    const newStatus = checked ? 'active' : 'inactive';

    const newMockData = mockData.map(item => {
      if (item._id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    this.setState({ mockData: newMockData }, () => {
      this.loadData();
      message.success(checked ? '已启用' : '已停用');
    });
  }

  handleSearch() {
    this.setState({ pageNo: 1 }, () => this.loadData());
  }

  handleReset() {
    this.setState({
      searchParams: {
        unitCode: '',
        unitName: '',
        status: 'all'
      },
      pageNo: 1
    }, () => this.loadData());
  }

  handlePageChange(page, pageSize) {
    this.setState({ pageNo: page, pageSize }, () => this.loadData());
  }

  handleAdd() {
    this.setState({
      isModalVisible: true,
      isEdit: false,
      currentRecord: null,
      formData: {
        unitCode: '',
        unitName: '',
        status: 'active'
      }
    });
  }

  handleEdit(record) {
    this.setState({
      isModalVisible: true,
      isEdit: true,
      currentRecord: record,
      formData: { ...record }
    });
  }

  handleDelete(record) {
    const { Modal, message } = window.antd;
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除计量单位 "${record.unitName}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const { mockData } = this.state;
          const newMockData = mockData.filter(item => item._id !== record._id);
          await this.setStatePromise({
            mockData: newMockData
          });
          message.success('删除成功');
          this.loadData();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  }

  async handleModalOk() {
    const { message } = window.antd;
    const { isEdit, currentRecord, formData, mockData } = this.state;

    // 验证单位编码
    if (!formData.unitCode) {
      message.error('请输入单位编号');
      return;
    }
    if (formData.unitCode.length < 1 || formData.unitCode.length > 10) {
      message.error('单位编号长度必须在1-10字符之间');
      return;
    }

    // 验证单位名称
    if (!formData.unitName) {
      message.error('请输入单位名称');
      return;
    }
    if (formData.unitName.length < 2 || formData.unitName.length > 20) {
      message.error('单位名称长度必须在2-20字符之间');
      return;
    }

    // 检查编码唯一性
    const codeExists = mockData.some(item =>
      item.unitCode.toLowerCase() === formData.unitCode.toLowerCase() &&
      item._id !== (currentRecord?._id || '')
    );
    if (codeExists) {
      message.error('单位编号已存在');
      return;
    }

    // 检查名称唯一性
    const nameExists = mockData.some(item =>
      item.unitName === formData.unitName &&
      item._id !== (currentRecord?._id || '')
    );
    if (nameExists) {
      message.error('单位名称已存在');
      return;
    }

    await this.setStatePromise({ modalLoading: true });
    try {
      if (isEdit) {
        const newMockData = mockData.map(item => {
          if (item._id === currentRecord._id) {
            return { ...item, ...formData };
          }
          return item;
        });
        await this.setStatePromise({
          mockData: newMockData,
          isModalVisible: false
        });
        message.success('编辑成功');
      } else {
        const newUnit = {
          _id: Date.now().toString(),
          ...formData,
          createTime: new Date().toLocaleString(),
          creator: '当前用户'
        };
        await this.setStatePromise({
          mockData: [newUnit, ...mockData],
          isModalVisible: false
        });
        message.success('新增成功');
      }
      this.loadData();
    } catch (error) {
      message.error(isEdit ? '编辑失败' : '新增失败');
    } finally {
      await this.setStatePromise({ modalLoading: false });
    }
  }

  handleModalCancel() {
    this.setState({ isModalVisible: false });
  }

  handleFormChange(field, value) {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: value
      }
    });
  }

  handleSearchParamChange(field, value) {
    this.setState({
      searchParams: {
        ...this.state.searchParams,
        [field]: value
      }
    });
  }

  handleBatchDelete() {
    const { Modal, message } = window.antd;
    const { selectedRowKeys, mockData } = this.state;

    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的数据');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const newMockData = mockData.filter(item => !selectedRowKeys.includes(item._id));
          await this.setStatePromise({
            mockData: newMockData,
            selectedRowKeys: []
          });
          message.success('批量删除成功');
          this.loadData();
        } catch (error) {
          message.error('批量删除失败');
        }
      }
    });
  }

  handleBatchExport() {
    const { message } = window.antd;
    const { dataList, searchParams } = this.state;

    if (dataList.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }

    // 构建CSV数据
    const headers = ['单位编号', '单位名称', '状态', '创建人', '创建时间'];
    const rows = dataList.map(item => [
      item.unitCode,
      item.unitName,
      item.status === 'active' ? '启用' : '停用',
      item.creator,
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
    link.download = `计量单位_${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('导出成功');
  }

  handleDownloadTemplate() {
    const { message } = window.antd;

    // 构建模板CSV
    const headers = ['单位编号', '单位名称', '状态'];
    const exampleRow = ['kg', '千克', '启用'];

    const csvContent = [
      headers.join(','),
      exampleRow.join(','),
      '',
      '说明：',
      '1. 单位编号：必填，1-10字符，全局唯一',
      '2. 单位名称：必填，2-20字符，全局唯一',
      '3. 状态：必填，填写"启用"或"停用"'
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '计量单位导入模板.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('模板下载成功');
  }

  handleBatchImport() {
    const { message, Modal } = window.antd;

    Modal.info({
      title: '批量导入',
      content: (
        <div>
          <p>请按以下步骤操作：</p>
          <ol>
            <li>先下载导入模板</li>
            <li>按模板格式填写数据</li>
            <li>上传Excel文件完成导入</li>
          </ol>
          <p style={{ color: '#999', marginTop: 16 }}>注意：此功能需要后端接口支持</p>
        </div>
      ),
      onOk() {},
    });

    message.info('导入功能开发中，请先使用模板准备数据');
  }

  renderActions(record) {
    const { Button, Popover } = window.antd;

    // 定义所有操作按钮（可以在这里添加更多功能点来测试场景2）
    const actions = [
      { key: 'edit', label: '编辑', onClick: () => this.handleEdit(record) },
      { key: 'delete', label: '删除', danger: true, onClick: () => this.handleDelete(record) }
      // 如需测试场景2，可取消下面注释
      // { key: 'view', label: '查看', onClick: () => console.log('查看', record) },
      // { key: 'copy', label: '复制', onClick: () => console.log('复制', record) },
    ];

    // 场景1：功能点 <= 3个时，正常显示
    if (actions.length <= 3) {
      return (
        <>
          {actions.map((action, index) => (
            <Button
              key={action.key}
              type="link"
              danger={action.danger}
              style={{ padding: '4px', marginRight: index < actions.length - 1 ? 8 : 0 }}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </>
      );
    }

    // 场景2：功能点 > 3个时，显示前3个+提示框展示其它功能点
    const visibleActions = actions.slice(0, 3);
    const moreActions = actions.slice(3);

    const moreContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {moreActions.map(action => (
          <Button
            key={action.key}
            type="link"
            danger={action.danger}
            style={{ padding: '4px 0', textAlign: 'left' }}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    );

    return (
      <>
        {visibleActions.map((action, index) => (
          <Button
            key={action.key}
            type="link"
            danger={action.danger}
            style={{ padding: '4px', marginRight: index < 2 ? 8 : 0 }}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
        <Popover
          content={moreContent}
          placement="bottomRight"
          trigger="hover"
        >
          <Button type="link" style={{ padding: '4px' }}>
            更多
          </Button>
        </Popover>
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
    const { Input, Select, Button, Space } = window.antd;
    const { searchParams } = this.state;

    return (
      <div className="search-area">
        <div className="search-row">
          <div className="search-item">
            <span className="search-label">单位编号：</span>
            <Input
              placeholder="请输入"
              value={searchParams.unitCode}
              onChange={(e) => this.handleSearchParamChange('unitCode', e.target.value)}
              allowClear
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">单位名称：</span>
            <Input
              placeholder="请输入"
              value={searchParams.unitName}
              onChange={(e) => this.handleSearchParamChange('unitName', e.target.value)}
              allowClear
              style={{ flex: 1 }}
            />
          </div>
          <div className="search-item">
            <span className="search-label">状态：</span>
            <Select
              placeholder="请选择"
              value={searchParams.status === 'all' ? undefined : searchParams.status}
              onChange={(value) => this.handleSearchParamChange('status', value || 'all')}
              allowClear
              style={{ flex: 1 }}
            >
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">停用</Select.Option>
            </Select>
          </div>
          <div className="search-item" />
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
                // 如果已经全选，则取消全选；否则全选
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
              <Button type="primary" onClick={() => this.handleAdd()} className="icon-text-btn">
                <span className="icon">⊕</span><span className="text">新增</span>
              </Button>
              <Button disabled={!selectedRowKeys || selectedRowKeys.length === 0} onClick={() => this.handleBatchDelete()} className="icon-text-btn">
                <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg><span className="text">批量删除</span>
              </Button>
              <Button onClick={() => this.handleDownloadTemplate()} className="icon-text-btn">
                <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg><span className="text">下载模板</span>
              </Button>
              <Button onClick={() => this.handleBatchImport()} className="icon-text-btn">
                <svg className="icon" width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v12"></path>
                  <path d="M7 12l5 5 5-5"></path>
                  <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
                </svg><span className="text">批量导入</span>
              </Button>
              <Button onClick={() => this.handleBatchExport()} className="icon-text-btn">
                <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg><span className="text">批量导出</span>
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
            scroll={{ x: 850, y: 'calc(100vh - 320px)' }}
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

  renderModal() {
    const { Modal, Form, Input, Radio, Switch } = window.antd;
    const { TextArea } = Input;
    const { isModalVisible, isEdit, formData, modalLoading } = this.state;

    return (
      <Modal
        title={isEdit ? '编辑计量单位' : '新增计量单位'}
        open={isModalVisible}
        onOk={() => this.handleModalOk()}
        onCancel={() => this.handleModalCancel()}
        confirmLoading={modalLoading}
        width={480}
        okText="确认"
        cancelText="取消"
      >
        <Form layout="vertical" className="modal-form">
          <Form.Item label="单位编号" required>
            <Input
              placeholder="请输入单位编号"
              value={formData.unitCode}
              onChange={(e) => this.handleFormChange('unitCode', e.target.value)}
              disabled={isEdit}
              maxLength={10}
            />
          </Form.Item>
          <Form.Item label="单位名称" required>
            <Input
              placeholder="请输入单位名称"
              value={formData.unitName}
              onChange={(e) => this.handleFormChange('unitName', e.target.value)}
              maxLength={20}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Switch
              checked={formData.status === 'active'}
              onChange={(checked) => this.handleFormChange('status', checked ? 'active' : 'inactive')}
              checkedChildren="启用"
              unCheckedChildren="停用"
            />
          </Form.Item>
        </Form>
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
          {this.renderModal()}
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
    if (this.pollingTimer) clearInterval(this.pollingTimer);
  }
}
