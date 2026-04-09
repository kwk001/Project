import React, { useState, useCallback } from 'react';
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
  Tag,
  Descriptions,
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
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

// 50条业务数据
const mockCustomerData = [
  { id: '1', customerCode: 'KH001', customerName: '海澜之家股份有限公司', customerType: '品牌商', contactName: '张经理', contactPhone: '13800138001', email: 'zhang@hla.com', address: '江苏省江阴市', status: '启用', createBy: '管理员', createTime: '2024-01-15 10:30:00' },
  { id: '2', customerCode: 'KH002', customerName: '森马服饰股份有限公司', customerType: '品牌商', contactName: '李经理', contactPhone: '13800138002', email: 'li@semir.com', address: '浙江省温州市', status: '启用', createBy: '管理员', createTime: '2024-01-15 11:00:00' },
  { id: '3', customerCode: 'KH003', customerName: '波司登国际控股有限公司', customerType: '品牌商', contactName: '王经理', contactPhone: '13800138003', email: 'wang@bosideng.com', address: '江苏省常熟市', status: '启用', createBy: '管理员', createTime: '2024-01-15 11:30:00' },
  { id: '4', customerCode: 'KH004', customerName: '罗莱生活科技股份有限公司', customerType: '品牌商', contactName: '赵经理', contactPhone: '13800138004', email: 'zhao@luolai.com', address: '江苏省南通市', status: '启用', createBy: '管理员', createTime: '2024-01-16 09:00:00' },
  { id: '5', customerCode: 'KH005', customerName: '富安娜家居用品股份有限公司', customerType: '品牌商', contactName: '刘经理', contactPhone: '13800138005', email: 'liu@fuanna.com', address: '广东省深圳市', status: '启用', createBy: '管理员', createTime: '2024-01-16 09:30:00' },
  { id: '6', customerCode: 'KH006', customerName: '水星家用纺织品股份有限公司', customerType: '品牌商', contactName: '陈经理', contactPhone: '13800138006', email: 'chen@mercury.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-16 10:00:00' },
  { id: '7', customerCode: 'KH007', customerName: '梦洁家纺股份有限公司', customerType: '品牌商', contactName: '杨经理', contactPhone: '13800138007', email: 'yang@mengjie.com', address: '湖南省长沙市', status: '启用', createBy: '管理员', createTime: '2024-01-16 10:30:00' },
  { id: '8', customerCode: 'KH008', customerName: '堂皇集团有限公司', customerType: '品牌商', contactName: '黄经理', contactPhone: '13800138008', email: 'huang@tanghuang.com', address: '江苏省丹阳市', status: '启用', createBy: '管理员', createTime: '2024-01-17 08:00:00' },
  { id: '9', customerCode: 'KH009', customerName: '红豆集团有限公司', customerType: '品牌商', contactName: '周经理', contactPhone: '13800138009', email: 'zhou@hongdou.com', address: '江苏省无锡市', status: '启用', createBy: '管理员', createTime: '2024-01-17 08:30:00' },
  { id: '10', customerCode: 'KH010', customerName: '雅戈尔集团股份有限公司', customerType: '品牌商', contactName: '吴经理', contactPhone: '13800138010', email: 'wu@youngor.com', address: '浙江省宁波市', status: '启用', createBy: '管理员', createTime: '2024-01-17 09:00:00' },
  { id: '11', customerCode: 'KH011', customerName: '杉杉控股有限公司', customerType: '品牌商', contactName: '徐经理', contactPhone: '13800138011', email: 'xu@shanshan.com', address: '浙江省宁波市', status: '启用', createBy: '管理员', createTime: '2024-01-17 09:30:00' },
  { id: '12', customerCode: 'KH012', customerName: '七匹狼实业股份有限公司', customerType: '品牌商', contactName: '孙经理', contactPhone: '13800138012', email: 'sun@septwolves.com', address: '福建省晋江市', status: '启用', createBy: '管理员', createTime: '2024-01-18 08:00:00' },
  { id: '13', customerCode: 'KH013', customerName: '九牧王股份有限公司', customerType: '品牌商', contactName: '马经理', contactPhone: '13800138013', email: 'ma@joeone.com', address: '福建省厦门市', status: '启用', createBy: '管理员', createTime: '2024-01-18 08:30:00' },
  { id: '14', customerCode: 'KH014', customerName: '利郎（中国）有限公司', customerType: '品牌商', contactName: '朱经理', contactPhone: '13800138014', email: 'zhu@lilang.com', address: '福建省晋江市', status: '启用', createBy: '管理员', createTime: '2024-01-18 09:00:00' },
  { id: '15', customerCode: 'KH015', customerName: '劲霸男装股份有限公司', customerType: '品牌商', contactName: '胡经理', contactPhone: '13800138015', email: 'hu@k-boxing.com', address: '福建省晋江市', status: '启用', createBy: '管理员', createTime: '2024-01-18 09:30:00' },
  { id: '16', customerCode: 'KH016', customerName: '太平鸟集团有限公司', customerType: '品牌商', contactName: '郭经理', contactPhone: '13800138016', email: 'guo@peacebird.com', address: '浙江省宁波市', status: '启用', createBy: '管理员', createTime: '2024-01-19 08:00:00' },
  { id: '17', customerCode: 'KH017', customerName: '美特斯邦威服饰股份有限公司', customerType: '品牌商', contactName: '何经理', contactPhone: '13800138017', email: 'he@metersbonwe.com', address: '上海市', status: '禁用', createBy: '管理员', createTime: '2024-01-19 08:30:00' },
  { id: '18', customerCode: 'KH018', customerName: '以纯集团有限公司', customerType: '品牌商', contactName: '林经理', contactPhone: '13800138018', email: 'lin@yishion.com', address: '广东省东莞市', status: '启用', createBy: '管理员', createTime: '2024-01-19 09:00:00' },
  { id: '19', customerCode: 'KH019', customerName: '真维斯服饰（中国）有限公司', customerType: '品牌商', contactName: '高经理', contactPhone: '13800138019', email: 'gao@jeanswest.com', address: '广东省惠州市', status: '启用', createBy: '管理员', createTime: '2024-01-19 09:30:00' },
  { id: '20', customerCode: 'KH020', customerName: '班尼路集团有限公司', customerType: '品牌商', contactName: '罗经理', contactPhone: '13800138020', email: 'luo@baleno.com', address: '广东省广州市', status: '启用', createBy: '管理员', createTime: '2024-01-20 08:00:00' },
  { id: '21', customerCode: 'KH021', customerName: '优衣库（中国）投资有限公司', customerType: '品牌商', contactName: '郑经理', contactPhone: '13800138021', email: 'zheng@uniqlo.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-20 08:30:00' },
  { id: '22', customerCode: 'KH022', customerName: '无印良品（上海）商业有限公司', customerType: '品牌商', contactName: '梁经理', contactPhone: '13800138022', email: 'liang@muji.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-20 09:00:00' },
  { id: '23', customerCode: 'KH023', customerName: '迪卡侬（上海）体育用品有限公司', customerType: '品牌商', contactName: '谢经理', contactPhone: '13800138023', email: 'xie@decathlon.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-20 09:30:00' },
  { id: '24', customerCode: 'KH024', customerName: '李宁（中国）体育用品有限公司', customerType: '品牌商', contactName: '宋经理', contactPhone: '13800138024', email: 'song@lining.com', address: '北京市', status: '启用', createBy: '管理员', createTime: '2024-01-21 08:00:00' },
  { id: '25', customerCode: 'KH025', customerName: '安踏体育用品集团有限公司', customerType: '品牌商', contactName: '唐经理', contactPhone: '13800138025', email: 'tang@anta.com', address: '福建省晋江市', status: '启用', createBy: '管理员', createTime: '2024-01-21 08:30:00' },
  { id: '26', customerCode: 'KH026', customerName: '特步（中国）有限公司', customerType: '品牌商', contactName: '韩经理', contactPhone: '13800138026', email: 'han@xtep.com', address: '福建省晋江市', status: '启用', createBy: '管理员', createTime: '2024-01-21 09:00:00' },
  { id: '27', customerCode: 'KH027', customerName: '361度（中国）有限公司', customerType: '品牌商', contactName: '冯经理', contactPhone: '13800138027', email: 'feng@361sport.com', address: '福建省晋江市', status: '启用', createBy: '管理员', createTime: '2024-01-21 09:30:00' },
  { id: '28', customerCode: 'KH028', customerName: '匹克（中国）有限公司', customerType: '品牌商', contactName: '于经理', contactPhone: '13800138028', email: 'yu@peak.com', address: '福建省泉州市', status: '启用', createBy: '管理员', createTime: '2024-01-22 08:00:00' },
  { id: '29', customerCode: 'KH029', customerName: '鸿星尔克（厦门）实业有限公司', customerType: '品牌商', contactName: '董经理', contactPhone: '13800138029', email: 'dong@erke.com', address: '福建省厦门市', status: '启用', createBy: '管理员', createTime: '2024-01-22 08:30:00' },
  { id: '30', customerCode: 'KH030', customerName: '贵人鸟股份有限公司', customerType: '品牌商', contactName: '萧经理', contactPhone: '13800138030', email: 'xiao@guirenniao.com', address: '福建省晋江市', status: '禁用', createBy: '管理员', createTime: '2024-01-22 09:00:00' },
  { id: '31', customerCode: 'KH031', customerName: '德尔惠（中国）有限公司', customerType: '品牌商', contactName: '程经理', contactPhone: '13800138031', email: 'cheng@deerway.com', address: '福建省晋江市', status: '禁用', createBy: '管理员', createTime: '2024-01-22 09:30:00' },
  { id: '32', customerCode: 'KH032', customerName: '乔丹体育股份有限公司', customerType: '品牌商', contactName: '曹经理', contactPhone: '13800138032', email: 'cao@qiaodan.com', address: '福建省晋江市', status: '启用', createBy: '管理员', createTime: '2024-01-23 08:00:00' },
  { id: '33', customerCode: 'KH033', customerName: '探路者控股集团股份有限公司', customerType: '品牌商', contactName: '袁经理', contactPhone: '13800138033', email: 'yuan@toread.com', address: '北京市', status: '启用', createBy: '管理员', createTime: '2024-01-23 08:30:00' },
  { id: '34', customerCode: 'KH034', customerName: '凯乐石户外运动用品有限公司', customerType: '品牌商', contactName: '邓经理', contactPhone: '13800138034', email: 'deng@kailas.com', address: '广东省广州市', status: '启用', createBy: '管理员', createTime: '2024-01-23 09:00:00' },
  { id: '35', customerCode: 'KH035', customerName: '牧高笛户外用品股份有限公司', customerType: '品牌商', contactName: '许经理', contactPhone: '13800138035', email: 'xu@mobi-garden.com', address: '浙江省衢州市', status: '启用', createBy: '管理员', createTime: '2024-01-23 09:30:00' },
  { id: '36', customerCode: 'KH036', customerName: '骆驼（中国）户外用品有限公司', customerType: '品牌商', contactName: '傅经理', contactPhone: '13800138036', email: 'fu@camel.com', address: '广东省广州市', status: '启用', createBy: '管理员', createTime: '2024-01-24 08:00:00' },
  { id: '37', customerCode: 'KH037', customerName: '北面（The North Face）中国', customerType: '品牌商', contactName: '沈经理', contactPhone: '13800138037', email: 'shen@thenorthface.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-24 08:30:00' },
  { id: '38', customerCode: 'KH038', customerName: '哥伦比亚运动服装商贸（上海）有限公司', customerType: '品牌商', contactName: '曾经理', contactPhone: '13800138038', email: 'zeng@columbia.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-24 09:00:00' },
  { id: '39', customerCode: 'KH039', customerName: '狼爪户外用品（上海）有限公司', customerType: '品牌商', contactName: '彭经理', contactPhone: '13800138039', email: 'peng@jack-wolfskin.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-24 09:30:00' },
  { id: '40', customerCode: 'KH040', customerName: '猛犸象户外用品（北京）有限公司', customerType: '品牌商', contactName: '吕经理', contactPhone: '13800138040', email: 'lv@mammut.com', address: '北京市', status: '启用', createBy: '管理员', createTime: '2024-01-25 08:00:00' },
  { id: '41', customerCode: 'KH041', customerName: '始祖鸟户外用品（上海）有限公司', customerType: '品牌商', contactName: '苏经理', contactPhone: '13800138041', email: 'su@arcteryx.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-25 08:30:00' },
  { id: '42', customerCode: 'KH042', customerName: '巴塔哥尼亚（上海）商贸有限公司', customerType: '品牌商', contactName: '卢经理', contactPhone: '13800138042', email: 'lu@patagonia.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-25 09:00:00' },
  { id: '43', customerCode: 'KH043', customerName: '加拿大鹅（Canada Goose）中国', customerType: '品牌商', contactName: '蒋经理', contactPhone: '13800138043', email: 'jiang@canadagoose.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-25 09:30:00' },
  { id: '44', customerCode: 'KH044', customerName: '盟可睐（Moncler）中国', customerType: '品牌商', contactName: '蔡经理', contactPhone: '13800138044', email: 'cai@moncler.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-26 08:00:00' },
  { id: '45', customerCode: 'KH045', customerName: '普拉达（Prada）中国', customerType: '品牌商', contactName: '贾经理', contactPhone: '13800138045', email: 'jia@prada.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-26 08:30:00' },
  { id: '46', customerCode: 'KH046', customerName: '博柏利（Burberry）中国', customerType: '品牌商', contactName: '丁经理', contactPhone: '13800138046', email: 'ding@burberry.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-26 09:00:00' },
  { id: '47', customerCode: 'KH047', customerName: '爱马仕（Hermes）中国', customerType: '品牌商', contactName: '魏经理', contactPhone: '13800138047', email: 'wei@hermes.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-26 09:30:00' },
  { id: '48', customerCode: 'KH048', customerName: '路易威登（LV）中国', customerType: '品牌商', contactName: '薛经理', contactPhone: '13800138048', email: 'xue@louisvuitton.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-27 08:00:00' },
  { id: '49', customerCode: 'KH049', customerName: '古驰（Gucci）中国', customerType: '品牌商', contactName: '叶经理', contactPhone: '13800138049', email: 'ye@gucci.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-27 08:30:00' },
  { id: '50', customerCode: 'KH050', customerName: '香奈儿（Chanel）中国', customerType: '品牌商', contactName: '闫经理', contactPhone: '13800138050', email: 'yan@chanel.com', address: '上海市', status: '启用', createBy: '管理员', createTime: '2024-01-27 09:00:00' }
];

const customerTypeOptions = ['品牌商', '经销商', '代工厂', '贸易公司', '其他'];

const CustomerManagement = () => {
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState(mockCustomerData);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增客户');
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
      title: '客户编号',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 120,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 250,
      ellipsis: true,
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      key: 'customerType',
      width: 100,
      filters: customerTypeOptions.map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.customerType === value,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 130,
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
      let filtered = [...mockCustomerData];
      if (values.customerCode) {
        filtered = filtered.filter(item =>
          item.customerCode.toLowerCase().includes(values.customerCode.toLowerCase())
        );
      }
      if (values.customerName) {
        filtered = filtered.filter(item =>
          item.customerName.includes(values.customerName)
        );
      }
      if (values.customerType) {
        filtered = filtered.filter(item => item.customerType === values.customerType);
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
    setDataSource(mockCustomerData);
    setPagination(prev => ({ ...prev, total: mockCustomerData.length, current: 1 }));
  };

  const handleAdd = () => {
    setModalTitle('新增客户');
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalTitle('编辑客户');
    setEditingRecord(record);
    form.setFieldsValue({
      customerCode: record.customerCode,
      customerName: record.customerName,
      customerType: record.customerType,
      contactName: record.contactName,
      contactPhone: record.contactPhone,
      email: record.email,
      address: record.address,
      status: record.status === '启用'
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
        customerCode: values.customerCode,
        customerName: values.customerName,
        customerType: values.customerType,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        email: values.email || '',
        address: values.address || '',
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

  const handleExport = () => {
    const exportData = dataSource.map(item => ({
      '客户编号': item.customerCode,
      '客户名称': item.customerName,
      '客户类型': item.customerType,
      '联系人': item.contactName,
      '联系电话': item.contactPhone,
      '邮箱': item.email,
      '地址': item.address,
      '状态': item.status,
      '创建人': item.createBy,
      '创建时间': item.createTime
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '客户档案');
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    XLSX.writeFile(wb, `客户档案_${dateStr}.xlsx`);
    message.success('导出成功');
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { customerCode: 'KH001', customerName: '示例客户公司', customerType: '品牌商', contactName: '张经理', contactPhone: '13800138001', email: 'zhang@example.com', address: '安徽省芜湖市', status: '启用' },
      { customerCode: 'KH002', customerName: '示例经销商', customerType: '经销商', contactName: '李经理', contactPhone: '13800138002', email: 'li@example.com', address: '江苏省南京市', status: '启用' }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '客户档案模版');
    XLSX.writeFile(wb, '客户档案导入模版.xlsx');
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
          if (!row.customerCode || !row.customerName || !row.customerType) {
            errors.push(`第${index + 2}行：客户编号、客户名称和客户类型不能为空`);
          } else if (!customerTypeOptions.includes(row.customerType)) {
            errors.push(`第${index + 2}行：客户类型必须是${customerTypeOptions.join('/')}`);
          } else {
            validData.push({
              id: Date.now().toString() + index,
              customerCode: row.customerCode,
              customerName: row.customerName,
              customerType: row.customerType,
              contactName: row.contactName || '',
              contactPhone: row.contactPhone || '',
              email: row.email || '',
              address: row.address || '',
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
              <Form.Item name="customerCode" label="客户编号">
                <Input placeholder="请输入客户编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="customerName" label="客户名称">
                <Input placeholder="请输入客户名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="customerType" label="客户类型">
                <Select placeholder="请选择类型" allowClear>
                  {customerTypeOptions.map(type => (
                    <Option key={type} value={type}>{type}</Option>
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
        title="客户档案列表"
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
        <Form form={form} layout="vertical" initialValues={{ status: true, customerType: '品牌商' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerCode"
                label="客户编号"
                rules={[
                  { required: true, message: '请输入客户编号' },
                  { min: 2, max: 20, message: '长度2-20字符' }
                ]}
              >
                <Input placeholder="请输入客户编号" disabled={!!editingRecord} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="客户名称"
                rules={[
                  { required: true, message: '请输入客户名称' },
                  { min: 2, max: 100, message: '长度2-100字符' }
                ]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerType"
                label="客户类型"
                rules={[{ required: true, message: '请选择客户类型' }]}
              >
                <Select placeholder="请选择客户类型">
                  {customerTypeOptions.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactName"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[{ type: 'email', message: '邮箱格式不正确' }]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="address"
            label="地址"
          >
            <TextArea rows={2} placeholder="请输入地址" />
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

      {/* 详情模态框 */}
      <Modal
        title="客户档案详情"
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
            <Descriptions.Item label="客户编号">{viewingRecord.customerCode}</Descriptions.Item>
            <Descriptions.Item label="客户名称">{viewingRecord.customerName}</Descriptions.Item>
            <Descriptions.Item label="客户类型">{viewingRecord.customerType}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={viewingRecord.status === '启用' ? 'success' : 'default'}>
                {viewingRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="联系人">{viewingRecord.contactName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{viewingRecord.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="电子邮箱">{viewingRecord.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="地址">{viewingRecord.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建人">{viewingRecord.createBy}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{viewingRecord.createTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CustomerManagement;
