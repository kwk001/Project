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
  Row,
  Col,
  Popconfirm,
  Upload,
  Descriptions,
  Tag,
  Tabs
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
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 50条业务数据
const mockMaterialData = [
  { id: '1', materialCode: 'WL001', materialName: '95%白鹅绒', categoryName: '白鹅绒', unitName: '千克', spec: '高规格', status: '启用', createBy: '管理员', createTime: '2024-01-15 10:30:00', description: '高品质白鹅绒，蓬松度900+' },
  { id: '2', materialCode: 'WL002', materialName: '90%白鹅绒', categoryName: '白鹅绒', unitName: '千克', spec: '标准', status: '启用', createBy: '管理员', createTime: '2024-01-15 11:00:00', description: '标准白鹅绒，蓬松度850+' },
  { id: '3', materialCode: 'WL003', materialName: '85%白鹅绒', categoryName: '白鹅绒', unitName: '千克', spec: '普通', status: '启用', createBy: '管理员', createTime: '2024-01-15 11:30:00', description: '普通白鹅绒，蓬松度800+' },
  { id: '4', materialCode: 'WL004', materialName: '95%灰鹅绒', categoryName: '灰鹅绒', unitName: '千克', spec: '高规格', status: '启用', createBy: '管理员', createTime: '2024-01-16 09:00:00', description: '高品质灰鹅绒，蓬松度900+' },
  { id: '5', materialCode: 'WL005', materialName: '90%灰鹅绒', categoryName: '灰鹅绒', unitName: '千克', spec: '标准', status: '启用', createBy: '管理员', createTime: '2024-01-16 09:30:00', description: '标准灰鹅绒，蓬松度850+' },
  { id: '6', materialCode: 'WL006', materialName: '95%白鸭绒', categoryName: '白鸭绒', unitName: '千克', spec: '高规格', status: '启用', createBy: '管理员', createTime: '2024-01-16 10:00:00', description: '高品质白鸭绒，蓬松度850+' },
  { id: '7', materialCode: 'WL007', materialName: '90%白鸭绒', categoryName: '白鸭绒', unitName: '千克', spec: '标准', status: '启用', createBy: '管理员', createTime: '2024-01-16 10:30:00', description: '标准白鸭绒，蓬松度800+' },
  { id: '8', materialCode: 'WL008', materialName: '85%白鸭绒', categoryName: '白鸭绒', unitName: '千克', spec: '普通', status: '启用', createBy: '管理员', createTime: '2024-01-17 08:00:00', description: '普通白鸭绒，蓬松度750+' },
  { id: '9', materialCode: 'WL009', materialName: '95%灰鸭绒', categoryName: '灰鸭绒', unitName: '千克', spec: '高规格', status: '启用', createBy: '管理员', createTime: '2024-01-17 08:30:00', description: '高品质灰鸭绒，蓬松度850+' },
  { id: '10', materialCode: 'WL010', materialName: '90%灰鸭绒', categoryName: '灰鸭绒', unitName: '千克', spec: '标准', status: '启用', createBy: '管理员', createTime: '2024-01-17 09:00:00', description: '标准灰鸭绒，蓬松度800+' },
  { id: '11', materialCode: 'WL011', materialName: '波兰95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '进口高规格', status: '启用', createBy: '管理员', createTime: '2024-01-17 09:30:00', description: '波兰进口，蓬松度950+' },
  { id: '12', materialCode: 'WL012', materialName: '匈牙利95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '进口高规格', status: '启用', createBy: '管理员', createTime: '2024-01-18 08:00:00', description: '匈牙利进口，蓬松度950+' },
  { id: '13', materialCode: 'WL013', materialName: '西伯利亚95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '进口顶级', status: '启用', createBy: '管理员', createTime: '2024-01-18 08:30:00', description: '西伯利亚进口，蓬松度1000+' },
  { id: '14', materialCode: 'WL014', materialName: '80%白鹅绒', categoryName: '白鹅绒', unitName: '千克', spec: '经济型', status: '禁用', createBy: '管理员', createTime: '2024-01-18 09:00:00', description: '经济型白鹅绒，蓬松度750+' },
  { id: '15', materialCode: 'WL015', materialName: '80%灰鹅绒', categoryName: '灰鹅绒', unitName: '千克', spec: '经济型', status: '禁用', createBy: '管理员', createTime: '2024-01-18 09:30:00', description: '经济型灰鹅绒，蓬松度750+' },
  { id: '16', materialCode: 'WL016', materialName: '羽绒被填充料A级', categoryName: '羽绒制品', unitName: '千克', spec: 'A级', status: '启用', createBy: '管理员', createTime: '2024-01-19 08:00:00', description: '专用于高端羽绒被' },
  { id: '17', materialCode: 'WL017', materialName: '羽绒被填充料B级', categoryName: '羽绒制品', unitName: '千克', spec: 'B级', status: '启用', createBy: '管理员', createTime: '2024-01-19 08:30:00', description: '专用于中端羽绒被' },
  { id: '18', materialCode: 'WL018', materialName: '羽绒枕填充料', categoryName: '羽绒制品', unitName: '千克', spec: '标准', status: '启用', createBy: '管理员', createTime: '2024-01-19 09:00:00', description: '专用于羽绒枕' },
  { id: '19', materialCode: 'WL019', materialName: '服装填充料95%', categoryName: '服装填充料', unitName: '千克', spec: '高规格', status: '启用', createBy: '管理员', createTime: '2024-01-19 09:30:00', description: '专用于高端羽绒服' },
  { id: '20', materialCode: 'WL020', materialName: '服装填充料90%', categoryName: '服装填充料', unitName: '千克', spec: '标准', status: '启用', createBy: '管理员', createTime: '2024-01-20 08:00:00', description: '专用于普通羽绒服' },
  { id: '21', materialCode: 'WL021', materialName: '睡袋填充料', categoryName: '睡袋填充料', unitName: '千克', spec: '户外级', status: '启用', createBy: '管理员', createTime: '2024-01-20 08:30:00', description: '专用于户外睡袋' },
  { id: '22', materialCode: 'WL022', materialName: '医用95%白鹅绒', categoryName: '特殊用途', unitName: '千克', spec: '医用级', status: '启用', createBy: '管理员', createTime: '2024-01-20 09:00:00', description: '符合医用标准' },
  { id: '23', materialCode: 'WL023', materialName: '军用95%白鹅绒', categoryName: '特殊用途', unitName: '千克', spec: '军规级', status: '启用', createBy: '管理员', createTime: '2024-01-20 09:30:00', description: '符合军用标准' },
  { id: '24', materialCode: 'WL024', materialName: '航空航天用绒', categoryName: '特殊用途', unitName: '千克', spec: '航空级', status: '启用', createBy: '管理员', createTime: '2024-01-21 08:00:00', description: '符合航空航天标准' },
  { id: '25', materialCode: 'WL025', materialName: '水洗白鹅绒', categoryName: '精洗绒', unitName: '千克', spec: '精洗', status: '启用', createBy: '管理员', createTime: '2024-01-21 08:30:00', description: '深度水洗处理' },
  { id: '26', materialCode: 'WL026', materialName: '水洗灰鹅绒', categoryName: '精洗绒', unitName: '千克', spec: '精洗', status: '启用', createBy: '管理员', createTime: '2024-01-21 09:00:00', description: '深度水洗处理' },
  { id: '27', materialCode: 'WL027', materialName: '毛片原料', categoryName: '羽绒原料', unitName: '千克', spec: '原料', status: '启用', createBy: '管理员', createTime: '2024-01-21 09:30:00', description: '毛片原料' },
  { id: '28', materialCode: 'WL028', materialName: '绒丝原料', categoryName: '羽绒原料', unitName: '千克', spec: '原料', status: '启用', createBy: '管理员', createTime: '2024-01-22 08:00:00', description: '绒丝原料' },
  { id: '29', materialCode: 'WL029', materialName: '羽毛原料', categoryName: '羽绒原料', unitName: '千克', spec: '原料', status: '启用', createBy: '管理员', createTime: '2024-01-22 08:30:00', description: '羽毛原料' },
  { id: '30', materialCode: 'WL030', materialName: '台湾95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '台湾产', status: '启用', createBy: '管理员', createTime: '2024-01-22 09:00:00', description: '台湾产高品质白鹅绒' },
  { id: '31', materialCode: 'WL031', materialName: '日本95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '日本产', status: '启用', createBy: '管理员', createTime: '2024-01-22 09:30:00', description: '日本产高品质白鹅绒' },
  { id: '32', materialCode: 'WL032', materialName: '加拿大95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '加拿大产', status: '启用', createBy: '管理员', createTime: '2024-01-23 08:00:00', description: '加拿大产高品质白鹅绒' },
  { id: '33', materialCode: 'WL033', materialName: '美国95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '美国产', status: '启用', createBy: '管理员', createTime: '2024-01-23 08:30:00', description: '美国产高品质白鹅绒' },
  { id: '34', materialCode: 'WL034', materialName: '德国95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '德国产', status: '启用', createBy: '管理员', createTime: '2024-01-23 09:00:00', description: '德国产高品质白鹅绒' },
  { id: '35', materialCode: 'WL035', materialName: '法国95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '法国产', status: '启用', createBy: '管理员', createTime: '2024-01-23 09:30:00', description: '法国产高品质白鹅绒' },
  { id: '36', materialCode: 'WL036', materialName: '意大利95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '意大利产', status: '启用', createBy: '管理员', createTime: '2024-01-24 08:00:00', description: '意大利产高品质白鹅绒' },
  { id: '37', materialCode: 'WL037', materialName: '奥地利95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '奥地利产', status: '启用', createBy: '管理员', createTime: '2024-01-24 08:30:00', description: '奥地利产高品质白鹅绒' },
  { id: '38', materialCode: 'WL038', materialName: '瑞士95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '瑞士产', status: '启用', createBy: '管理员', createTime: '2024-01-24 09:00:00', description: '瑞士产高品质白鹅绒' },
  { id: '39', materialCode: 'WL039', materialName: '荷兰95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '荷兰产', status: '启用', createBy: '管理员', createTime: '2024-01-24 09:30:00', description: '荷兰产高品质白鹅绒' },
  { id: '40', materialCode: 'WL040', materialName: '丹麦95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '丹麦产', status: '启用', createBy: '管理员', createTime: '2024-01-25 08:00:00', description: '丹麦产高品质白鹅绒' },
  { id: '41', materialCode: 'WL041', materialName: '挪威95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '挪威产', status: '启用', createBy: '管理员', createTime: '2024-01-25 08:30:00', description: '挪威产高品质白鹅绒' },
  { id: '42', materialCode: 'WL042', materialName: '瑞典95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '瑞典产', status: '启用', createBy: '管理员', createTime: '2024-01-25 09:00:00', description: '瑞典产高品质白鹅绒' },
  { id: '43', materialCode: 'WL043', materialName: '芬兰95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '芬兰产', status: '启用', createBy: '管理员', createTime: '2024-01-25 09:30:00', description: '芬兰产高品质白鹅绒' },
  { id: '44', materialCode: 'WL044', materialName: '冰岛95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '冰岛产', status: '启用', createBy: '管理员', createTime: '2024-01-26 08:00:00', description: '冰岛产高品质白鹅绒' },
  { id: '45', materialCode: 'WL045', materialName: '新西兰95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '新西兰产', status: '启用', createBy: '管理员', createTime: '2024-01-26 08:30:00', description: '新西兰产高品质白鹅绒' },
  { id: '46', materialCode: 'WL046', materialName: '澳大利亚95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '澳大利亚产', status: '启用', createBy: '管理员', createTime: '2024-01-26 09:00:00', description: '澳大利亚产高品质白鹅绒' },
  { id: '47', materialCode: 'WL047', materialName: '英国95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '英国产', status: '启用', createBy: '管理员', createTime: '2024-01-26 09:30:00', description: '英国产高品质白鹅绒' },
  { id: '48', materialCode: 'WL048', materialName: '爱尔兰95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '爱尔兰产', status: '启用', createBy: '管理员', createTime: '2024-01-27 08:00:00', description: '爱尔兰产高品质白鹅绒' },
  { id: '49', materialCode: 'WL049', materialName: '比利时95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '比利时产', status: '启用', createBy: '管理员', createTime: '2024-01-27 08:30:00', description: '比利时产高品质白鹅绒' },
  { id: '50', materialCode: 'WL050', materialName: '卢森堡95%白鹅绒', categoryName: '进口绒', unitName: '千克', spec: '卢森堡产', status: '启用', createBy: '管理员', createTime: '2024-01-27 09:00:00', description: '卢森堡产高品质白鹅绒' }
];

// 分类选项
const categoryOptions = ['白鹅绒', '灰鹅绒', '白鸭绒', '灰鸭绒', '进口绒', '羽绒制品', '服装填充料', '睡袋填充料', '特殊用途', '精洗绒', '羽绒原料'];
const unitOptions = ['千克', '克', '吨'];

const MaterialManagement = () => {
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState(mockMaterialData);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增产品档案');
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 50,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  const columns = [
    {
      title: '产品编号',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 130,
    },
    {
      title: '产品名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 180,
    },
    {
      title: '产品分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      filters: categoryOptions.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.categoryName === value,
    },
    {
      title: '规格型号',
      dataIndex: 'spec',
      key: 'spec',
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
      width: 80,
      align: 'center',
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
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
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

  const handleSearch = useCallback((values) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...mockMaterialData];
      if (values.materialCode) {
        filtered = filtered.filter(item =>
          item.materialCode.toLowerCase().includes(values.materialCode.toLowerCase())
        );
      }
      if (values.materialName) {
        filtered = filtered.filter(item =>
          item.materialName.includes(values.materialName)
        );
      }
      if (values.categoryName) {
        filtered = filtered.filter(item => item.categoryName === values.categoryName);
      }
      if (values.status) {
        filtered = filtered.filter(item => item.status === values.status);
      }
      setDataSource(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
      setLoading(false);
    }, 300);
  }, []);

  const handleReset = () => {
    searchForm.resetFields();
    setDataSource(mockMaterialData);
    setPagination(prev => ({ ...prev, total: mockMaterialData.length, current: 1 }));
  };

  const handleAdd = () => {
    setModalTitle('新增产品档案');
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalTitle('编辑产品档案');
    setEditingRecord(record);
    form.setFieldsValue({
      materialCode: record.materialCode,
      materialName: record.materialName,
      categoryName: record.categoryName,
      unitName: record.unitName,
      spec: record.spec,
      status: record.status === '启用',
      description: record.description
    });
    setModalVisible(true);
  };

  const handleView = (record) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleDelete = (record) => {
    setDataSource(prev => prev.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newRecord = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        materialCode: values.materialCode,
        materialName: values.materialName,
        categoryName: values.categoryName,
        unitName: values.unitName,
        spec: values.spec,
        status: values.status ? '启用' : '禁用',
        createBy: '管理员',
        createTime: editingRecord ? editingRecord.createTime : new Date().toLocaleString(),
        description: values.description || ''
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

  const handleDownloadTemplate = () => {
    const templateData = [
      { materialCode: 'WL001', materialName: '95%白鹅绒', categoryName: '白鹅绒', unitName: '千克', spec: '高规格', status: '启用', description: '高品质白鹅绒' },
      { materialCode: 'WL002', materialName: '90%白鹅绒', categoryName: '白鹅绒', unitName: '千克', spec: '标准', status: '启用', description: '标准白鹅绒' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '产品档案模版');
    XLSX.writeFile(wb, '产品档案导入模版.xlsx');
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
          if (!row.materialCode || !row.materialName) {
            errors.push(`第${index + 2}行：产品编号和产品名称不能为空`);
          } else {
            validData.push({
              id: Date.now().toString() + index,
              materialCode: row.materialCode,
              materialName: row.materialName,
              categoryName: row.categoryName || '',
              unitName: row.unitName || '千克',
              spec: row.spec || '',
              status: row.status || '启用',
              createBy: '管理员',
              createTime: new Date().toLocaleString(),
              description: row.description || ''
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
      '产品编号': item.materialCode,
      '产品名称': item.materialName,
      '产品分类': item.categoryName,
      '规格型号': item.spec,
      '单位': item.unitName,
      '状态': item.status,
      '创建人': item.createBy,
      '创建时间': item.createTime,
      '备注': item.description
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '产品档案');
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    XLSX.writeFile(wb, `产品档案_${dateStr}.xlsx`);
    message.success('导出成功');
  };

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
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={5}>
              <Form.Item name="materialCode" label="产品编号">
                <Input placeholder="请输入产品编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="materialName" label="产品名称">
                <Input placeholder="请输入产品名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="categoryName" label="产品分类">
                <Select placeholder="请选择分类" allowClear>
                  {categoryOptions.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="启用">启用</Option>
                  <Option value="禁用">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
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
        title="产品档案列表"
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
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
          onChange={(newPagination) => setPagination(newPagination)}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ status: true, unitName: '千克' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="materialCode"
                label="产品编号"
                rules={[
                  { required: true, message: '请输入产品编号' },
                  { min: 1, max: 20, message: '长度1-20字符' }
                ]}
              >
                <Input placeholder="请输入产品编号" disabled={!!editingRecord} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="materialName"
                label="产品名称"
                rules={[
                  { required: true, message: '请输入产品名称' },
                  { min: 2, max: 100, message: '长度2-100字符' }
                ]}
              >
                <Input placeholder="请输入产品名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryName"
                label="产品分类"
                rules={[{ required: true, message: '请选择产品分类' }]}
              >
                <Select placeholder="请选择分类">
                  {categoryOptions.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unitName"
                label="计量单位"
                rules={[{ required: true, message: '请选择计量单位' }]}
              >
                <Select placeholder="请选择单位">
                  {unitOptions.map(unit => (
                    <Option key={unit} value={unit}>{unit}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="spec"
                label="规格型号"
              >
                <Input placeholder="请输入规格型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                valuePropName="checked"
              >
                <span>启用</span>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="备注说明"
          >
            <TextArea rows={3} placeholder="请输入备注说明" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="产品档案详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {viewingRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="产品编号">{viewingRecord.materialCode}</Descriptions.Item>
            <Descriptions.Item label="产品名称">{viewingRecord.materialName}</Descriptions.Item>
            <Descriptions.Item label="产品分类">{viewingRecord.categoryName}</Descriptions.Item>
            <Descriptions.Item label="计量单位">{viewingRecord.unitName}</Descriptions.Item>
            <Descriptions.Item label="规格型号">{viewingRecord.spec || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={viewingRecord.status === '启用' ? 'success' : 'default'}>
                {viewingRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建人">{viewingRecord.createBy}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{viewingRecord.createTime}</Descriptions.Item>
            <Descriptions.Item label="备注说明" span={2}>
              {viewingRecord.description || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MaterialManagement;
