import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  Modal,
  message,
  TreeSelect,
  InputNumber,
  Tag,
  Row,
  Col,
  Popconfirm,
  Upload
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
  ExclamationCircleOutlined,
  FolderOutlined,
  FileOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { confirm } = Modal;

// 50条业务数据（树形结构）
const mockCategoryData = [
  // 一级分类
  { id: '1', categoryCode: 'FL001', categoryName: '白鹅绒', parentId: null, parentName: '', sortOrder: 1, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-15 10:30:00' },
  { id: '2', categoryCode: 'FL002', categoryName: '灰鹅绒', parentId: null, parentName: '', sortOrder: 2, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-15 10:35:00' },
  { id: '3', categoryCode: 'FL003', categoryName: '白鸭绒', parentId: null, parentName: '', sortOrder: 3, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-15 10:40:00' },
  { id: '4', categoryCode: 'FL004', categoryName: '灰鸭绒', parentId: null, parentName: '', sortOrder: 4, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-15 10:45:00' },
  { id: '5', categoryCode: 'FL005', categoryName: '羽绒原料', parentId: null, parentName: '', sortOrder: 5, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-16 09:00:00' },
  // 白鹅绒二级分类
  { id: '6', categoryCode: 'FL001-01', categoryName: '95%白鹅绒', parentId: '1', parentName: '白鹅绒', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-16 09:30:00' },
  { id: '7', categoryCode: 'FL001-02', categoryName: '90%白鹅绒', parentId: '1', parentName: '白鹅绒', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-16 10:00:00' },
  { id: '8', categoryCode: 'FL001-03', categoryName: '85%白鹅绒', parentId: '1', parentName: '白鹅绒', sortOrder: 3, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-16 10:30:00' },
  { id: '9', categoryCode: 'FL001-04', categoryName: '80%白鹅绒', parentId: '1', parentName: '白鹅绒', sortOrder: 4, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-17 08:00:00' },
  // 灰鹅绒二级分类
  { id: '10', categoryCode: 'FL002-01', categoryName: '95%灰鹅绒', parentId: '2', parentName: '灰鹅绒', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-17 08:30:00' },
  { id: '11', categoryCode: 'FL002-02', categoryName: '90%灰鹅绒', parentId: '2', parentName: '灰鹅绒', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-17 09:00:00' },
  { id: '12', categoryCode: 'FL002-03', categoryName: '85%灰鹅绒', parentId: '2', parentName: '灰鹅绒', sortOrder: 3, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-17 09:30:00' },
  // 白鸭绒二级分类
  { id: '13', categoryCode: 'FL003-01', categoryName: '95%白鸭绒', parentId: '3', parentName: '白鸭绒', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-18 08:00:00' },
  { id: '14', categoryCode: 'FL003-02', categoryName: '90%白鸭绒', parentId: '3', parentName: '白鸭绒', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-18 08:30:00' },
  { id: '15', categoryCode: 'FL003-03', categoryName: '85%白鸭绒', parentId: '3', parentName: '白鸭绒', sortOrder: 3, level: 2, status: '禁用', createBy: '管理员', createTime: '2024-01-18 09:00:00' },
  // 灰鸭绒二级分类
  { id: '16', categoryCode: 'FL004-01', categoryName: '95%灰鸭绒', parentId: '4', parentName: '灰鸭绒', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-18 09:30:00' },
  { id: '17', categoryCode: 'FL004-02', categoryName: '90%灰鸭绒', parentId: '4', parentName: '灰鸭绒', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-19 08:00:00' },
  // 羽绒原料二级分类
  { id: '18', categoryCode: 'FL005-01', categoryName: '毛片', parentId: '5', parentName: '羽绒原料', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-19 08:30:00' },
  { id: '19', categoryCode: 'FL005-02', categoryName: '绒丝', parentId: '5', parentName: '羽绒原料', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-19 09:00:00' },
  { id: '20', categoryCode: 'FL005-03', categoryName: '羽毛', parentId: '5', parentName: '羽绒原料', sortOrder: 3, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-19 09:30:00' },
  // 三级分类
  { id: '21', categoryCode: 'FL001-01-A', categoryName: '高蓬松95%白鹅绒', parentId: '6', parentName: '95%白鹅绒', sortOrder: 1, level: 3, status: '启用', createBy: '管理员', createTime: '2024-01-20 08:00:00' },
  { id: '22', categoryCode: 'FL001-01-B', categoryName: '标准95%白鹅绒', parentId: '6', parentName: '95%白鹅绒', sortOrder: 2, level: 3, status: '启用', createBy: '管理员', createTime: '2024-01-20 08:30:00' },
  { id: '23', categoryCode: 'FL001-02-A', categoryName: '高蓬松90%白鹅绒', parentId: '7', parentName: '90%白鹅绒', sortOrder: 1, level: 3, status: '启用', createBy: '管理员', createTime: '2024-01-20 09:00:00' },
  { id: '24', categoryCode: 'FL001-02-B', categoryName: '标准90%白鹅绒', parentId: '7', parentName: '90%白鹅绒', sortOrder: 2, level: 3, status: '启用', createBy: '管理员', createTime: '2024-01-20 09:30:00' },
  { id: '25', categoryCode: 'FL002-01-A', categoryName: '高蓬松95%灰鹅绒', parentId: '10', parentName: '95%灰鹅绒', sortOrder: 1, level: 3, status: '启用', createBy: '管理员', createTime: '2024-01-21 08:00:00' },
  // 更多数据
  { id: '26', categoryCode: 'FL006', categoryName: '羽绒制品', parentId: null, parentName: '', sortOrder: 6, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-21 08:30:00' },
  { id: '27', categoryCode: 'FL006-01', categoryName: '羽绒被', parentId: '26', parentName: '羽绒制品', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-21 09:00:00' },
  { id: '28', categoryCode: 'FL006-02', categoryName: '羽绒枕', parentId: '26', parentName: '羽绒制品', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-21 09:30:00' },
  { id: '29', categoryCode: 'FL006-03', categoryName: '羽绒床垫', parentId: '26', parentName: '羽绒制品', sortOrder: 3, level: 2, status: '禁用', createBy: '管理员', createTime: '2024-01-22 08:00:00' },
  { id: '30', categoryCode: 'FL007', categoryName: '服装填充料', parentId: null, parentName: '', sortOrder: 7, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-22 08:30:00' },
  { id: '31', categoryCode: 'FL007-01', categoryName: '羽绒服填充', parentId: '30', parentName: '服装填充料', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-22 09:00:00' },
  { id: '32', categoryCode: 'FL007-02', categoryName: '羽绒马甲填充', parentId: '30', parentName: '服装填充料', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-22 09:30:00' },
  { id: '33', categoryCode: 'FL008', categoryName: '睡袋填充料', parentId: null, parentName: '', sortOrder: 8, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-23 08:00:00' },
  { id: '34', categoryCode: 'FL008-01', categoryName: '露营睡袋填充', parentId: '33', parentName: '睡袋填充料', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-23 08:30:00' },
  { id: '35', categoryCode: 'FL008-02', categoryName: '室内睡袋填充', parentId: '33', parentName: '睡袋填充料', sortOrder: 2, level: 2, status: '禁用', createBy: '管理员', createTime: '2024-01-23 09:00:00' },
  { id: '36', categoryCode: 'FL009', categoryName: '特殊用途', parentId: null, parentName: '', sortOrder: 9, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-23 09:30:00' },
  { id: '37', categoryCode: 'FL009-01', categoryName: '医疗用绒', parentId: '36', parentName: '特殊用途', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-24 08:00:00' },
  { id: '38', categoryCode: 'FL009-02', categoryName: '军用绒', parentId: '36', parentName: '特殊用途', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-24 08:30:00' },
  { id: '39', categoryCode: 'FL009-03', categoryName: '航空航天用绒', parentId: '36', parentName: '特殊用途', sortOrder: 3, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-24 09:00:00' },
  { id: '40', categoryCode: 'FL010', categoryName: '进口绒', parentId: null, parentName: '', sortOrder: 10, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-24 09:30:00' },
  { id: '41', categoryCode: 'FL010-01', categoryName: '波兰白鹅绒', parentId: '40', parentName: '进口绒', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-25 08:00:00' },
  { id: '42', categoryCode: 'FL010-02', categoryName: '匈牙利白鹅绒', parentId: '40', parentName: '进口绒', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-25 08:30:00' },
  { id: '43', categoryCode: 'FL010-03', categoryName: '西伯利亚白鹅绒', parentId: '40', parentName: '进口绒', sortOrder: 3, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-25 09:00:00' },
  { id: '44', categoryCode: 'FL011', categoryName: '混合绒', parentId: null, parentName: '', sortOrder: 11, level: 1, status: '禁用', createBy: '管理员', createTime: '2024-01-25 09:30:00' },
  { id: '45', categoryCode: 'FL011-01', categoryName: '鹅鸭混合绒', parentId: '44', parentName: '混合绒', sortOrder: 1, level: 2, status: '禁用', createBy: '管理员', createTime: '2024-01-26 08:00:00' },
  { id: '46', categoryCode: 'FL012', categoryName: '精洗绒', parentId: null, parentName: '', sortOrder: 12, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-26 08:30:00' },
  { id: '47', categoryCode: 'FL012-01', categoryName: '水洗白鹅绒', parentId: '46', parentName: '精洗绒', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-26 09:00:00' },
  { id: '48', categoryCode: 'FL012-02', categoryName: '水洗灰鹅绒', parentId: '46', parentName: '精洗绒', sortOrder: 2, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-26 09:30:00' },
  { id: '49', categoryCode: 'FL013', categoryName: '实验研发', parentId: null, parentName: '', sortOrder: 13, level: 1, status: '启用', createBy: '管理员', createTime: '2024-01-27 08:00:00' },
  { id: '50', categoryCode: 'FL013-01', categoryName: '新配方绒', parentId: '49', parentName: '实验研发', sortOrder: 1, level: 2, status: '启用', createBy: '管理员', createTime: '2024-01-27 08:30:00' }
];

const CategoryManagement = () => {
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState(mockCategoryData);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增分类');
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 50,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  // 构建树形数据
  const buildTreeData = useCallback(() => {
    const treeData = [];
    const map = {};

    // 先创建所有节点的引用
    dataSource.forEach(item => {
      map[item.id] = { ...item, key: item.id, children: [] };
    });

    // 构建树形结构
    dataSource.forEach(item => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item.id]);
      } else if (!item.parentId) {
        treeData.push(map[item.id]);
      }
    });

    return treeData;
  }, [dataSource]);

  // 获取树形选择数据（排除自己和子级）
  const getTreeSelectData = (excludeId = null) => {
    const filterData = (items, level = 1) => {
      return items
        .filter(item => item.id !== excludeId)
        .map(item => ({
          title: item.categoryName,
          value: item.id,
          key: item.id,
          disabled: level >= 3 || item.id === excludeId,
          children: item.children ? filterData(item.children, level + 1) : []
        }));
    };
    return filterData(buildTreeData());
  };

  // 渲染分类名称（带层级缩进）
  const renderCategoryName = (text, record) => {
    const icon = record.children?.length > 0 ? <FolderOutlined /> : <FileOutlined />;
    const indent = record.level > 1 ? '　'.repeat(record.level - 1) + '├ ' : '';
    return (
      <span>
        {indent}{icon} {text}
      </span>
    );
  };

  const columns = [
    {
      title: '分类编号',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      width: 150,
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 250,
      render: renderCategoryName
    },
    {
      title: '父分类',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 150,
      render: (text) => text || '-'
    },
    {
      title: '排序号',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      align: 'center'
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
      )
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
      width: 180
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
            description={record.children?.length > 0 ? "该分类下有子分类，不能删除" : "删除后将无法恢复"}
            onConfirm={() => handleDelete(record)}
            disabled={record.children?.length > 0}
          >
            <Button type="link" danger icon={<DeleteOutlined />} disabled={record.children?.length > 0}>
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
      let filtered = [...mockCategoryData];
      if (values.categoryCode) {
        filtered = filtered.filter(item =>
          item.categoryCode.toLowerCase().includes(values.categoryCode.toLowerCase())
        );
      }
      if (values.categoryName) {
        filtered = filtered.filter(item =>
          item.categoryName.includes(values.categoryName)
        );
      }
      setDataSource(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
      setLoading(false);
    }, 300);
  }, []);

  const handleReset = () => {
    searchForm.resetFields();
    setDataSource(mockCategoryData);
    setPagination(prev => ({ ...prev, total: mockCategoryData.length, current: 1 }));
  };

  const handleAdd = () => {
    setModalTitle('新增分类');
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalTitle('编辑分类');
    setEditingRecord(record);
    form.setFieldsValue({
      categoryCode: record.categoryCode,
      categoryName: record.categoryName,
      parentId: record.parentId,
      sortOrder: record.sortOrder,
      status: record.status === '启用'
    });
    setModalVisible(true);
  };

  const handleDelete = (record) => {
    if (record.children?.length > 0) {
      message.error('该分类下有子分类，不能删除');
      return;
    }
    setDataSource(prev => prev.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

  const handleBatchDelete = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要删除的数据');
      return;
    }
    const hasChildren = selectedRows.some(row => row.children?.length > 0);
    if (hasChildren) {
      message.error('选中的数据包含有关联子分类的记录，无法删除');
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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const parent = values.parentId ? dataSource.find(item => item.id === values.parentId) : null;
      const level = parent ? parent.level + 1 : 1;

      const newRecord = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        categoryCode: values.categoryCode,
        categoryName: values.categoryName,
        parentId: values.parentId || null,
        parentName: parent?.categoryName || '',
        sortOrder: values.sortOrder || 0,
        level,
        status: values.status ? '启用' : '禁用',
        createBy: '管理员',
        createTime: editingRecord ? editingRecord.createTime : new Date().toLocaleString(),
        children: editingRecord?.children || []
      };

      if (editingRecord) {
        setDataSource(prev => prev.map(item =>
          item.id === editingRecord.id ? newRecord : item
        ));
        message.success('更新成功');
      } else {
        setDataSource(prev => [...prev, newRecord]);
        message.success('新增成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { categoryCode: 'FL001', categoryName: '白鹅绒', parentCode: '', sortOrder: 1, status: '启用' },
      { categoryCode: 'FL001-01', categoryName: '95%白鹅绒', parentCode: 'FL001', sortOrder: 1, status: '启用' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '产品分类模版');
    XLSX.writeFile(wb, '产品分类导入模版.xlsx');
    message.success('模版下载成功');
  };

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

        const validData = [];
        const errors = [];
        jsonData.forEach((row, index) => {
          if (!row.categoryCode || !row.categoryName) {
            errors.push(`第${index + 2}行：分类编号和分类名称不能为空`);
          } else {
            validData.push({
              id: Date.now().toString() + index,
              categoryCode: row.categoryCode,
              categoryName: row.categoryName,
              parentId: null,
              parentName: '',
              sortOrder: row.sortOrder || 0,
              level: 1,
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

  const handleExport = () => {
    const exportData = dataSource.map(item => ({
      '分类编号': item.categoryCode,
      '分类名称': item.categoryName,
      '父分类': item.parentName || '-',
      '层级': item.level,
      '排序号': item.sortOrder,
      '状态': item.status,
      '创建人': item.createBy,
      '创建时间': item.createTime
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '产品分类');
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    XLSX.writeFile(wb, `产品分类_${dateStr}.xlsx`);
    message.success('导出成功');
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    }
  };

  // 获取表格数据（树形展示）
  const getTableData = () => {
    const treeData = buildTreeData();
    const flatten = (items, result = []) => {
      items.forEach(item => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children, result);
        }
      });
      return result;
    };
    return flatten(treeData);
  };

  return (
    <div className="page-container">
      <Card className="search-card" title="搜索条件" size="small">
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item name="categoryCode" label="分类编号">
                <Input placeholder="请输入分类编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryName" label="分类名称">
                <Input placeholder="请输入分类名称" allowClear />
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

      <Card
        className="table-card"
        title="产品分类列表"
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
            <Upload accept=".xlsx,.xls" beforeUpload={handleImport} showUploadList={false}>
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
          dataSource={getTableData()}
          loading={loading}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
          onChange={(newPagination) => setPagination(newPagination)}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical" initialValues={{ sortOrder: 0, status: true }}>
          <Form.Item
            name="parentId"
            label="父分类"
          >
            <TreeSelect
              treeData={getTreeSelectData(editingRecord?.id)}
              placeholder="请选择父分类（不选则为一级分类）"
              allowClear
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item
            name="categoryCode"
            label="分类编号"
            rules={[
              { required: true, message: '请输入分类编号' },
              { min: 2, max: 20, message: '长度2-20字符' }
            ]}
          >
            <Input placeholder="请输入分类编号" disabled={!!editingRecord} />
          </Form.Item>
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { min: 2, max: 50, message: '长度2-50字符' }
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="排序号"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入排序号" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <span>启用</span>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
