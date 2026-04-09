const { Component } = window.React;

class LowcodeComponent extends Component {
  constructor() {
    const { injectMesModuleMethods } = window.KaiwuMesModule;
    injectMesModuleMethods(this);
  }

  static PAGE_FORMCODE = 'ceshiyemian1_xxx';
  static PAGE_FORMNAME = '学生管理';

  state = {
    mockData: [
      {
        _id: '1',
        name: '张三',
        studentNo: '2024001',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        major: '智能制造工程',
        grade: '2024级',
        className: '智制2401班',
        status: 'active',
        createTime: '2024-09-01 09:00:00'
      },
      {
        _id: '2',
        name: '李四',
        studentNo: '2024002',
        phone: '13800138002',
        email: 'lisi@example.com',
        major: '数控技术',
        grade: '2024级',
        className: '数控2401班',
        status: 'active',
        createTime: '2024-09-01 09:30:00'
      },
      {
        _id: '3',
        name: '王五',
        studentNo: '2024003',
        phone: '13800138003',
        email: 'wangwu@example.com',
        major: '工业机器人',
        grade: '2023级',
        className: '机器人2301班',
        status: 'active',
        createTime: '2024-09-01 10:00:00'
      },
      {
        _id: '4',
        name: '赵六',
        studentNo: '2024004',
        phone: '13800138004',
        email: 'zhaoliu@example.com',
        major: 'CAD/CAM技术',
        grade: '2023级',
        className: 'CAD2301班',
        status: 'inactive',
        createTime: '2024-09-01 10:30:00'
      },
      {
        _id: '5',
        name: '陈七',
        studentNo: '2024005',
        phone: '13800138005',
        email: 'chenqi@example.com',
        major: '质量检测技术',
        grade: '2024级',
        className: '质检2401班',
        status: 'active',
        createTime: '2024-09-01 11:00:00'
      }
    ],
    majorOptions: [
      { label: '智能制造工程', value: '智能制造工程' },
      { label: '数控技术', value: '数控技术' },
      { label: '工业机器人', value: '工业机器人' },
      { label: 'CAD/CAM技术', value: 'CAD/CAM技术' },
      { label: '质量检测技术', value: '质量检测技术' }
    ],
    gradeOptions: [
      { label: '2024级', value: '2024级' },
      { label: '2023级', value: '2023级' },
      { label: '2022级', value: '2022级' },
      { label: '2021级', value: '2021级' }
    ],
    dataList: [],
    loading: false,
    currentRecord: null,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    searchParams: {
      name: '',
      major: 'all',
      grade: 'all',
      status: 'all'
    },
    isModalVisible: false,
    isEdit: false,
    modalLoading: false,
    formData: {
      name: '',
      studentNo: '',
      phone: '',
      email: '',
      major: '',
      grade: '',
      className: '',
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
        if (searchParams.name && !item.name.includes(searchParams.name)) return false;
        if (searchParams.major !== 'all' && item.major !== searchParams.major) return false;
        if (searchParams.grade !== 'all' && item.grade !== searchParams.grade) return false;
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
        title: '学号',
        dataIndex: 'studentNo',
        key: 'studentNo',
        width: 120
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        width: 130
      },
      {
        title: '专业',
        dataIndex: 'major',
        key: 'major',
        width: 150
      },
      {
        title: '年级',
        dataIndex: 'grade',
        key: 'grade',
        width: 100
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        width: 130
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status) => (
          <Tag color={status === 'active' ? 'success' : 'default'}>
            {status === 'active' ? '在读' : '休学'}
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
      searchParams: { name: '', major: 'all', grade: 'all', status: 'all' },
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
        studentNo: '',
        phone: '',
        email: '',
        major: '',
        grade: '',
        className: '',
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
      content: `确定要删除学生 "${record.name}" 吗？`,
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

    if (!formData.name || !formData.studentNo || !formData.major) {
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
        const newStudent = {
          _id: Date.now().toString(),
          ...formData,
          createTime: new Date().toLocaleString()
        };
        await this.setStatePromise({
          dataList: [newStudent, ...dataList],
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
    const { searchParams, majorOptions, gradeOptions } = this.state;

    return (
      <Card className="search-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="请输入学生姓名"
              value={searchParams.name}
              onChange={(e) => this.handleSearchParamChange('name', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择专业"
              value={searchParams.major}
              onChange={(value) => this.handleSearchParamChange('major', value)}
              className="full-width"
              allowClear
            >
              <Select.Option value="all">全部专业</Select.Option>
              {majorOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择年级"
              value={searchParams.grade}
              onChange={(value) => this.handleSearchParamChange('grade', value)}
              className="full-width"
              allowClear
            >
              <Select.Option value="all">全部年级</Select.Option>
              {gradeOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
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
    const { isModalVisible, isEdit, formData, modalLoading, majorOptions, gradeOptions } = this.state;

    return (
      <Modal
        title={isEdit ? '编辑学生' : '新增学生'}
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
              placeholder="请输入学生姓名"
              value={formData.name}
              onChange={(e) => this.handleFormChange('name', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="学号" required>
            <Input
              placeholder="请输入学号"
              value={formData.studentNo}
              onChange={(e) => this.handleFormChange('studentNo', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="联系电话">
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
          <Form.Item label="专业" required>
            <Select
              placeholder="请选择专业"
              value={formData.major}
              onChange={(value) => this.handleFormChange('major', value)}
            >
              {majorOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="年级" required>
            <Select
              placeholder="请选择年级"
              value={formData.grade}
              onChange={(value) => this.handleFormChange('grade', value)}
            >
              {gradeOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="班级" required>
            <Input
              placeholder="请输入班级"
              value={formData.className}
              onChange={(e) => this.handleFormChange('className', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Radio.Group
              value={formData.status}
              onChange={(e) => this.handleFormChange('status', e.target.value)}
            >
              <Radio value="active">在读</Radio>
              <Radio value="inactive">休学</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderHeader() {
    return (
      <div className="page-header">
        <h1 className="page-title">学生管理</h1>
        <p className="page-subtitle">管理学生信息，包括新增、编辑、删除学生</p>
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
