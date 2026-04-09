import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Modal,
  message,
  Switch,
  Upload,
  Row,
  Col,
  Popconfirm,
  Typography,
  Tag
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// 50条业务数据
const mockUnitData = [
  { id: '1', unitCode: 'kg', unitName: '千克', status: '启用', createBy: '管理员', createTime: '2024-01-15 10:30:00' },
  { id: '2', unitCode: 'g', unitName: '克', status: '启用', createBy: '管理员', createTime: '2024-01-15 10:31:00' },
  { id: '3', unitCode: 't', unitName: '吨', status: '启用', createBy: '管理员', createTime: '2024-01-15 10:32:00' },
  { id: '4', unitCode: 'mg', unitName: '毫克', status: '启用', createBy: '管理员', createTime: '2024-01-15 10:33:00' },
  { id: '5', unitCode: 'lb', unitName: '磅', status: '禁用', createBy: '管理员', createTime: '2024-01-15 10:34:00' },
  { id: '6', unitCode: 'oz', unitName: '盎司', status: '禁用', createBy: '管理员', createTime: '2024-01-16 09:00:00' },
  { id: '7', unitCode: 'jin', unitName: '斤', status: '启用', createBy: '管理员', createTime: '2024-01-16 09:30:00' },
  { id: '8', unitCode: 'liang', unitName: '两', status: '启用', createBy: '管理员', createTime: '2024-01-16 10:00:00' },
  { id: '9', unitCode: 'dan', unitName: '担', status: '禁用', createBy: '管理员', createTime: '2024-01-16 10:30:00' },
  { id: '10', unitCode: 'shi', unitName: '市斤', status: '启用', createBy: '管理员', createTime: '2024-01-17 08:00:00' },
  { id: '11', unitCode: 'gongjin', unitName: '公斤', status: '启用', createBy: '管理员', createTime: '2024-01-17 08:30:00' },
  { id: '12', unitCode: 'ke', unitName: '刻', status: '禁用', createBy: '管理员', createTime: '2024-01-17 09:00:00' },
  { id: '13', unitCode: 'fen', unitName: '分', status: '禁用', createBy: '管理员', createTime: '2024-01-17 09:30:00' },
  { id: '14', unitCode: 'qian', unitName: '钱', status: '启用', createBy: '管理员', createTime: '2024-01-18 08:00:00' },
  { id: '15', unitCode: 'mi', unitName: '米', status: '启用', createBy: '管理员', createTime: '2024-01-18 08:30:00' },
  { id: '16', unitCode: 'cm', unitName: '厘米', status: '启用', createBy: '管理员', createTime: '2024-01-18 09:00:00' },
  { id: '17', unitCode: 'mm', unitName: '毫米', status: '启用', createBy: '管理员', createTime: '2024-01-18 09:30:00' },
  { id: '18', unitCode: 'km', unitName: '千米', status: '启用', createBy: '管理员', createTime: '2024-01-19 08:00:00' },
  { id: '19', unitCode: 'chi', unitName: '尺', status: '禁用', createBy: '管理员', createTime: '2024-01-19 08:30:00' },
  { id: '20', unitCode: 'cun', unitName: '寸', status: '禁用', createBy: '管理员', createTime: '2024-01-19 09:00:00' },
  { id: '21', unitCode: 'zhang', unitName: '丈', status: '禁用', createBy: '管理员', createTime: '2024-01-20 08:00:00' },
  { id: '22', unitCode: 'pingfangmi', unitName: '平方米', status: '启用', createBy: '管理员', createTime: '2024-01-20 08:30:00' },
  { id: '23', unitCode: 'pingfangcm', unitName: '平方厘米', status: '启用', createBy: '管理员', createTime: '2024-01-20 09:00:00' },
  { id: '24', unitCode: 'mu', unitName: '亩', status: '启用', createBy: '管理员', createTime: '2024-01-20 09:30:00' },
  { id: '25', unitCode: 'gongqing', unitName: '公顷', status: '启用', createBy: '管理员', createTime: '2024-01-21 08:00:00' },
  { id: '26', unitCode: 'sheng', unitName: '升', status: '启用', createBy: '管理员', createTime: '2024-01-21 08:30:00' },
  { id: '27', unitCode: 'haosheng', unitName: '毫升', status: '启用', createBy: '管理员', createTime: '2024-01-21 09:00:00' },
  { id: '28', unitCode: 'li', unitName: '里', status: '禁用', createBy: '管理员', createTime: '2024-01-21 09:30:00' },
  { id: '29', unitCode: 'yingcun', unitName: '英寸', status: '禁用', createBy: '管理员', createTime: '2024-01-22 08:00:00' },
  { id: '30', unitCode: 'yingchi', unitName: '英尺', status: '禁用', createBy: '管理员', createTime: '2024-01-22 08:30:00' },
  { id: '31', unitCode: 'ma', unitName: '码', status: '禁用', createBy: '管理员', createTime: '2024-01-22 09:00:00' },
  { id: '32', unitCode: 'haimi', unitName: '海里', status: '禁用', createBy: '管理员', createTime: '2024-01-22 09:30:00' },
  { id: '33', unitCode: 'pingfangyingchi', unitName: '平方英尺', status: '禁用', createBy: '管理员', createTime: '2024-01-23 08:00:00' },
  { id: '34', unitCode: 'yinger', unitName: '英亩', status: '禁用', createBy: '管理员', createTime: '2024-01-23 08:30:00' },
  { id: '35', unitCode: 'jiaolun', unitName: '加仑', status: '禁用', createBy: '管理员', createTime: '2024-01-23 09:00:00' },
  { id: '36', unitCode: 'pintuo', unitName: '品脱', status: '禁用', createBy: '管理员', createTime: '2024-01-23 09:30:00' },
  { id: '37', unitCode: 'bushi', unitName: '蒲式耳', status: '禁用', createBy: '管理员', createTime: '2024-01-24 08:00:00' },
  { id: '38', unitCode: 'telongsi', unitName: '桶', status: '禁用', createBy: '管理员', createTime: '2024-01-24 08:30:00' },
  { id: '39', unitCode: 'lansuo', unitName: '盎司（液体）', status: '禁用', createBy: '管理员', createTime: '2024-01-24 09:00:00' },
  { id: '40', unitCode: 'taiwanshi', unitName: '台斤', status: '启用', createBy: '管理员', createTime: '2024-01-24 09:30:00' },
  { id: '41', unitCode: 'gangshi', unitName: '港斤', status: '启用', createBy: '管理员', createTime: '2024-01-25 08:00:00' },
  { id: '42', unitCode: 'aomenchi', unitName: '澳门尺', status: '禁用', createBy: '管理员', createTime: '2024-01-25 08:30:00' },
  { id: '43', unitCode: 'ribencun', unitName: '日本寸', status: '禁用', createBy: '管理员', createTime: '2024-01-25 09:00:00' },
  { id: '44', unitCode: 'hanguocun', unitName: '韩国寸', status: '禁用', createBy: '管理员', createTime: '2024-01-25 09:30:00' },
  { id: '45', unitCode: 'eluosiwei', unitName: '俄尺', status: '禁用', createBy: '管理员', createTime: '2024-01-26 08:00:00' },
  { id: '46', unitCode: 'degongjin', unitName: '德公斤', status: '禁用', createBy: '管理员', createTime: '2024-01-26 08:30:00' },
  { id: '47', unitCode: 'fagongjin', unitName: '法公斤', status: '禁用', createBy: '管理员', createTime: '2024-01-26 09:00:00' },
  { id: '48', unitCode: 'yingbang', unitName: '英磅', status: '禁用', createBy: '管理员', createTime: '2024-01-26 09:30:00' },
  { id: '49', unitCode: 'meidan', unitName: '美担', status: '禁用', createBy: '管理员', createTime: '2024-01-27 08:00:00' },
  { id: '50', unitCode: 'yindan', unitName: '印担', status: '禁用', createBy: '管理员', createTime: '2024-01-27 08:30:00' }
];

const UnitManagement = () => {
  // 搜索表单
  const [searchForm] = Form.useForm();
  // 表格数据
  const [dataSource, setDataSource] = useState(mockUnitData);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 模态框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增计量单位');
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  // 分页配置
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 50,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  // 表格列定义
  const columns = [
    {
      title: '单位编号',
      dataIndex: 'unitCode',
      key: 'unitCode',
      width: 120,
      sorter: (a, b) => a.unitCode.localeCompare(b.unitCode)
    },
    {
      title: '单位名称',
      dataIndex: 'unitName',
      key: 'unitName',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '启用' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: '启用', value: '启用' },
        { text: '禁用', value: '禁用' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime)
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            description="删除后将无法恢复"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 搜索
  const handleSearch = useCallback((values) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...mockUnitData];
      if (values.unitCode) {
        filtered = filtered.filter(item =>
          item.unitCode.toLowerCase().includes(values.unitCode.toLowerCase())
        );
      }
      if (values.unitName) {
        filtered = filtered.filter(item =>
          item.unitName.includes(values.unitName)
        );
      }
      if (values.status) {
        filtered = filtered.filter(item => item.status === values.status);
      }
      setDataSource(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
      setLoading(false);
    }, 300);
  }, []);

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setDataSource(mockUnitData);
    setPagination(prev => ({ ...prev, total: mockUnitData.length, current: 1 }));
  };

  // 新增
  const handleAdd = () => {
    setModalTitle('新增计量单位');
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record) => {
    setModalTitle('编辑计量单位');
    setEditingRecord(record);
    form.setFieldsValue({
      unitCode: record.unitCode,
      unitName: record.unitName,
      status: record.status === '启用'
    });
    setModalVisible(true);
  };

  // 删除
  const handleDelete = (record) => {
    setDataSource(prev => prev.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要删除的数据');
      return;
    }
    confirm({
      title: '确定批量删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: `已选中 ${selectedRows.length} 条数据，删除后将无法恢复`,
      onOk() {
        const ids = selectedRows.map(row => row.id);
        setDataSource(prev => prev.filter(item => !ids.includes(item.id)));
        setSelectedRows([]);
        setSelectedRowKeys([]);
        message.success(`成功删除 ${ids.length} 条数据`);
      }
    });
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newRecord = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        unitCode: values.unitCode,
        unitName: values.unitName,
        status: values.status ? '启用' : '禁用',
        createBy: '管理员',
        createTime: editingRecord ? editingRecord.createTime : new Date().toLocaleString()
      };

      if (editingRecord) {
        setDataSource(prev => prev.map(item =>
          item.id === editingRecord.id ? newRecord : item
        ));
        message.success('更新成功');
      } else {
        setDataSource(prev => [newRecord, ...prev]);
        message.success('新增成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 下载模版
  const handleDownloadTemplate = () => {
    const templateData = [
      { unitCode: 'kg', unitName: '千克', status: '启用' },
      { unitCode: 'g', unitName: '克', status: '启用' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '计量单位模版');
    XLSX.writeFile(wb, '计量单位导入模版.xlsx');
    message.success('模版下载成功');
  };

  // 批量导入
  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (jsonData.length === 0) {
          message.error('导入文件为空');
          return;
        }

        // 校验数据
        const validData = [];
        const errors = [];
        jsonData.forEach((row, index) => {
          if (!row.unitCode || !row.unitName) {
            errors.push(`第${index + 2}行：单位编号和单位名称不能为空`);
          } else {
            validData.push({
              id: Date.now().toString() + index,
              unitCode: row.unitCode,
              unitName: row.unitName,
              status: row.status || '启用',
              createBy: '管理员',
              createTime: new Date().toLocaleString()
            });
          }
        });

        if (errors.length > 0) {
          Modal.error({
            title: '导入失败',
            content: (
              <div style={{ maxHeight: 300, overflow: 'auto' }}>
                {errors.map((err, idx) => (
                  <div key={idx}>{err}</div>
                ))}
              </div>
            )
          });
          return;
        }

        setDataSource(prev => [...validData, ...prev]);
        message.success(`成功导入 ${validData.length} 条数据`);
      } catch (error) {
        message.error('文件解析失败，请检查文件格式');
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  // 批量导出
  const handleExport = () => {
    const exportData = dataSource.map(item => ({
      '单位编号': item.unitCode,
      '单位名称': item.unitName,
      '状态': item.status,
      '创建人': item.createBy,
      '创建时间': item.createTime
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '计量单位');
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    XLSX.writeFile(wb, `计量单位_${dateStr}.xlsx`);
    message.success('导出成功');
  };

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    }
  };

  return (
    <div className="page-container">
      {/* 搜索区域 */}
      <Card className="search-card" title="搜索条件" size="small">
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item name="unitCode" label="单位编号">
                <Input placeholder="请输入单位编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="unitName" label="单位名称">
                <Input placeholder="请输入单位名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="启用">启用</Option>
                  <Option value="禁用">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card
        className="table-card"
        title="计量单位列表"
        size="small"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
              disabled={selectedRows.length === 0}
            >
              批量删除
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
              下载模版
            </Button>
            <Upload
              accept=".xlsx,.xls"
              beforeUpload={handleImport}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>批量导入</Button>
            </Upload>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              批量导出
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1000 }}
          onChange={(newPagination) => setPagination(newPagination)}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="unitCode"
            label="单位编号"
            rules={[
              { required: true, message: '请输入单位编号' },
              { min: 1, max: 10, message: '长度1-10字符' }
            ]}
          >
            <Input placeholder="请输入单位编号" disabled={!!editingRecord} />
          </Form.Item>
          <Form.Item
            name="unitName"
            label="单位名称"
            rules={[
              { required: true, message: '请输入单位名称' },
              { min: 2, max: 20, message: '长度2-20字符' }
            ]}
          >
            <Input placeholder="请输入单位名称" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UnitManagement;
