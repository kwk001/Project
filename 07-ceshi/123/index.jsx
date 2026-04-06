class LowcodeComponent extends Component {
  constructor() {
    const { injectMesModuleMethods } = window.KaiwuMesModule;
    injectMesModuleMethods(this);
  }

  static PAGE_FORMCODE = 'diyigeyemian_4nxly7';
  static PAGE_FORMNAME = '教师管理';

  state = {
    mockData: [
      {
        _id: '1',
        name: '张老师',
        phone: '13800138001',
        email: 'zhang@example.com',
        subject: '智能制造基础',
        title: '教授',
        status: 'active',
        description: '从事智能制造教学10年',
        createTime: '2024-01-15 10:30:00'
      },
      {
        _id: '2',
        name: '李老师',
        phone: '13800138002',
        email: 'li@example.com',
        subject: '数控加工技术',
        title: '副教授',
        status: 'active',
        description: '数控加工专家',
        createTime: '2024-01-16 14:20:00'
      },
      {
        _id: '3',
        name: '王老师',
        phone: '13800138003',
        email: 'wang@example.com',
        subject: 'CAD/CAM技术',
        title: '讲师',
        status: 'inactive',
        description: 'CAD软件认证讲师',
        createTime: '2024-01-17 09:15:00'
      },
      {
        _id: '4',
        name: '赵老师',
        phone: '13800138004',
        email: 'zhao@example.com',
        subject: '工业机器人编程',
        title: '教授',
        status: 'active',
        description: '机器人领域资深专家',
        createTime: '2024-01-18 16:45:00'
      },
      {
        _id: '5',
        name: '陈老师',
        phone: '13800138005',
        email: 'chen@example.com',
        subject: '质量检测技术',
        title: '副教授',
        status: 'active',
        description: '质量检测标准制定者',
        createTime: '2024-01-19 11:30:00'
      }
    ],
    subjectOptions: [
      { label: '智能制造基础', value: '智能制造基础' },
      { label: '数控加工技术', value: '数控加工技术' },
      { label: 'CAD/CAM技术', value: 'CAD/CAM技术' },
      { label: '工业机器人编程', value: '工业机器人编程' },
      { label: '质量检测技术', value: '质量检测技术' }
    ],
    titleOptions: [
      { label: '教授', value: '教授' },
      { label: '副教授', value: '副教授' },
      { label: '讲师', value: '讲师' },
      { label: '助教', value: '助教' }
    ],
    dataList: [],
    loading: false,
    currentRecord: null,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    searchParams: {
      name: '',
      subject: 'all',
      status: 'all'
    },
    isModalVisible: false,
    isEdit: false,
    modalLoading: false,
    formData: {
      name: '',
      phone: '',
      email: '',
      subject: '',
      title: '',
      status: 'active',
      description: ''
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
        if (searchParams.name && !item.name.includes(searchParams.name)) return false;
        if (searchParams.subject !== 'all' && item.subject !== searchParams.subject) return false;
        if (searchParams.status !== 'all' && item.status !== searchParams.status) return false;
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
    const { Tag, Button, Space } = window.antd;

    return [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        width: 130
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 180
      },
      {
        title: '任教科目',
        dataIndex: 'subject',
        key: 'subject',
        width: 150
      },
      {
        title: '职称',
        dataIndex: 'title',
        key: 'title',
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status) => (
          <Tag color={status === 'active' ? 'success' : 'default'}>
            {status === 'active' ? '在职' : '离职'}
          </Tag>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 170
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        fixed: 'right',
        render: (_, record) => (
          <Space size="small">
            <Button type="link" onClick={() => this.handleEdit(record)}>
              编辑
            </Button>
            <Button type="link" danger onClick={() => this.handleDelete(record)}>
              删除
            </Button>
          </Space>
        )
      }
    ];
  }

  handleSearch() {
    this.setState({ pageNo: 1 }, () => this.loadData());
  }

  handleReset() {
    this.setState({
      searchParams: { name: '', subject: 'all', status: 'all' },
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
        name: '',
        phone: '',
        email: '',
        subject: '',
        title: '',
        status: 'active',
        description: ''
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
      content: `确定要删除教师 "${record.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const { dataList } = this.state;
          const newList = dataList.filter(item => item._id !== record._id);
          await this.setStatePromise({
            dataList: newList,
            total: this.state.total - 1
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
    const { isEdit, currentRecord, formData, dataList } = this.state;

    if (!formData.name || !formData.phone || !formData.subject) {
      message.error('请填写必填项');
      return;
    }

    await this.setStatePromise({ modalLoading: true });
    try {
      if (isEdit) {
        const newList = dataList.map(item => {
          if (item._id === currentRecord._id) {
            return { ...item, ...formData };
          }
          return item;
        });
        await this.setStatePromise({
          dataList: newList,
          isModalVisible: false
        });
        message.success('编辑成功');
      } else {
        const newTeacher = {
          _id: Date.now().toString(),
          ...formData,
          createTime: new Date().toLocaleString()
        };
        await this.setStatePromise({
          dataList: [newTeacher, ...dataList],
          total: this.state.total + 1,
          isModalVisible: false
        });
        message.success('新增成功');
      }
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

  renderSearchArea() {
    const { Card, Row, Col, Input, Select, Button, Space } = window.antd;
    const { searchParams, subjectOptions } = this.state;

    return (
      <Card className="search-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="请输入教师姓名"
              value={searchParams.name}
              onChange={(e) => this.handleSearchParamChange('name', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择任教科目"
              value={searchParams.subject}
              onChange={(value) => this.handleSearchParamChange('subject', value)}
              className="full-width"
              allowClear
            >
              <Select.Option value="all">全部科目</Select.Option>
              {subjectOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择状态"
              value={searchParams.status}
              onChange={(value) => this.handleSearchParamChange('status', value)}
              className="full-width"
              allowClear
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="active">在职</Select.Option>
              <Select.Option value="inactive">离职</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button type="primary" onClick={() => this.handleSearch()}>
                查询
              </Button>
              <Button onClick={() => this.handleReset()}>
                重置
              </Button>
              <Button type="primary" onClick={() => this.handleAdd()}>
                新增
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  }

  renderTableArea() {
    const { Card, Table, Pagination } = window.antd;
    const { dataList, loading, pageNo, pageSize, total } = this.state;

    return (
      <Card
        className="table-card"
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div className="table-scroll-wrap">
          <Table
            columns={this.getColumns()}
            dataSource={dataList}
            rowKey="_id"
            loading={loading}
            pagination={false}
          />
        </div>
        <div className="pagination-bar">
          <Pagination
            current={pageNo}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(t) => `共 ${t} 条`}
            onChange={(page, size) => this.handlePageChange(page, size)}
          />
        </div>
      </Card>
    );
  }

  renderModal() {
    const { Modal, Form, Input, Select, Radio } = window.antd;
    const { TextArea } = Input;
    const { isModalVisible, isEdit, formData, modalLoading, subjectOptions, titleOptions } = this.state;

    return (
      <Modal
        title={isEdit ? '编辑教师' : '新增教师'}
        open={isModalVisible}
        onOk={() => this.handleModalOk()}
        onCancel={() => this.handleModalCancel()}
        confirmLoading={modalLoading}
        width={600}
        okText="确认"
        cancelText="取消"
      >
        <Form layout="vertical" className="modal-form">
          <Form.Item label="姓名" required>
            <Input
              placeholder="请输入教师姓名"
              value={formData.name}
              onChange={(e) => this.handleFormChange('name', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="联系电话" required>
            <Input
              placeholder="请输入联系电话"
              value={formData.phone}
              onChange={(e) => this.handleFormChange('phone', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="邮箱">
            <Input
              placeholder="请输入邮箱"
              value={formData.email}
              onChange={(e) => this.handleFormChange('email', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="任教科目" required>
            <Select
              placeholder="请选择任教科目"
              value={formData.subject}
              onChange={(value) => this.handleFormChange('subject', value)}
            >
              {subjectOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="职称">
            <Select
              placeholder="请选择职称"
              value={formData.title}
              onChange={(value) => this.handleFormChange('title', value)}
            >
              {titleOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="状态">
            <Radio.Group
              value={formData.status}
              onChange={(e) => this.handleFormChange('status', e.target.value)}
            >
              <Radio value="active">在职</Radio>
              <Radio value="inactive">离职</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注">
            <TextArea
              rows={3}
              placeholder="请输入备注信息"
              value={formData.description}
              onChange={(e) => this.handleFormChange('description', e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderHeader() {
    return (
      <div className="page-header">
        <h1 className="page-title">教师管理</h1>
        <p className="page-subtitle">管理教师信息，包括新增、编辑、删除教师</p>
      </div>
    );
  }

  renderJSX() {
    const { ConfigProvider } = window.antd;

    return (
      <ConfigProvider theme={window.antdTheme} locale={this.getLocale()}>
        <div className="main-container">
          {this.renderHeader()}
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
