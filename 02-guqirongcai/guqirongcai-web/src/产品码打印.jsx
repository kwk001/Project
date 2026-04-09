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
  DatePicker,
  InputNumber,
  Descriptions,
  QRCode,
  Statistic,
  Badge
} from 'antd';
import {
  PrinterOutlined,
  ExportOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
  CheckOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 50条业务数据
const mockPrintData = [
  { id: '1', batchNo: 'BC202401001', materialName: '95%白鹅绒', materialCode: 'WL001', quantity: 500, produceDate: '2024-01-15', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-01-15 10:30:00', printCount: 1, printBy: '张三', traceCode: 'TR20240100100001' },
  { id: '2', batchNo: 'BC202401002', materialName: '90%白鹅绒', materialCode: 'WL002', quantity: 800, produceDate: '2024-01-15', downContent: '90%', fluffiness: '850+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-01-15 14:20:00', printCount: 1, printBy: '张三', traceCode: 'TR20240100200001' },
  { id: '3', batchNo: 'BC202401003', materialName: '95%灰鹅绒', materialCode: 'WL004', quantity: 600, produceDate: '2024-01-16', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-01-16 09:15:00', printCount: 2, printBy: '李四', traceCode: 'TR20240100300001' },
  { id: '4', batchNo: 'BC202401004', materialName: '90%灰鹅绒', materialCode: 'WL005', quantity: 700, produceDate: '2024-01-16', downContent: '90%', fluffiness: '850+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-01-16 11:30:00', printCount: 1, printBy: '李四', traceCode: 'TR20240100400001' },
  { id: '5', batchNo: 'BC202401005', materialName: '95%白鸭绒', materialCode: 'WL006', quantity: 900, produceDate: '2024-01-17', downContent: '95%', fluffiness: '850+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-01-17 08:45:00', printCount: 1, printBy: '王五', traceCode: 'TR20240100500001' },
  { id: '6', batchNo: 'BC202401006', materialName: '90%白鸭绒', materialCode: 'WL007', quantity: 1000, produceDate: '2024-01-17', downContent: '90%', fluffiness: '800+', cleanliness: '900+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-01-17 13:20:00', printCount: 1, printBy: '王五', traceCode: 'TR20240100600001' },
  { id: '7', batchNo: 'BC202401007', materialName: '波兰95%白鹅绒', materialCode: 'WL011', quantity: 300, produceDate: '2024-01-18', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-18 10:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240100700001' },
  { id: '8', batchNo: 'BC202401008', materialName: '匈牙利95%白鹅绒', materialCode: 'WL012', quantity: 400, produceDate: '2024-01-18', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-18 15:30:00', printCount: 1, printBy: '张三', traceCode: 'TR20240100800001' },
  { id: '9', batchNo: 'BC202401009', materialName: '西伯利亚95%白鹅绒', materialCode: 'WL013', quantity: 200, produceDate: '2024-01-19', downContent: '95%', fluffiness: '1000+', cleanliness: '1000+', oxygenConsumption: '≤4.2', printStatus: '已打印', printTime: '2024-01-19 09:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240100900001' },
  { id: '10', batchNo: 'BC202401010', materialName: '85%白鹅绒', materialCode: 'WL003', quantity: 1200, produceDate: '2024-01-19', downContent: '85%', fluffiness: '800+', cleanliness: '850+', oxygenConsumption: '≤5.5', printStatus: '已打印', printTime: '2024-01-19 14:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240101000001' },
  { id: '11', batchNo: 'BC202401011', materialName: '羽绒被填充料A级', materialCode: 'WL016', quantity: 1500, produceDate: '2024-01-20', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-01-20 08:30:00', printCount: 1, printBy: '王五', traceCode: 'TR20240101100001' },
  { id: '12', batchNo: 'BC202401012', materialName: '服装填充料95%', materialCode: 'WL019', quantity: 800, produceDate: '2024-01-20', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-01-20 11:00:00', printCount: 2, printBy: '王五', traceCode: 'TR20240101200001' },
  { id: '13', batchNo: 'BC202401013', materialName: '睡袋填充料', materialCode: 'WL021', quantity: 600, produceDate: '2024-01-21', downContent: '90%', fluffiness: '850+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-01-21 10:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240101300001' },
  { id: '14', batchNo: 'BC202401014', materialName: '医用95%白鹅绒', materialCode: 'WL022', quantity: 100, produceDate: '2024-01-21', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.0', printStatus: '已打印', printTime: '2024-01-21 14:30:00', printCount: 1, printBy: '张三', traceCode: 'TR20240101400001' },
  { id: '15', batchNo: 'BC202401015', materialName: '军用95%白鹅绒', materialCode: 'WL023', quantity: 150, produceDate: '2024-01-22', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.0', printStatus: '已打印', printTime: '2024-01-22 09:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240101500001' },
  { id: '16', batchNo: 'BC202401016', materialName: '水洗白鹅绒', materialCode: 'WL025', quantity: 2000, produceDate: '2024-01-22', downContent: '90%', fluffiness: '850+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-22 13:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240101600001' },
  { id: '17', batchNo: 'BC202401017', materialName: '毛片原料', materialCode: 'WL027', quantity: 3000, produceDate: '2024-01-23', downContent: '70%', fluffiness: '500+', cleanliness: '500+', oxygenConsumption: '≤8.0', printStatus: '已打印', printTime: '2024-01-23 08:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240101700001' },
  { id: '18', batchNo: 'BC202401018', materialName: '台湾95%白鹅绒', materialCode: 'WL030', quantity: 250, produceDate: '2024-01-23', downContent: '95%', fluffiness: '920+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-23 15:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240101800001' },
  { id: '19', batchNo: 'BC202401019', materialName: '日本95%白鹅绒', materialCode: 'WL031', quantity: 180, produceDate: '2024-01-24', downContent: '95%', fluffiness: '930+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-24 09:30:00', printCount: 1, printBy: '张三', traceCode: 'TR20240101900001' },
  { id: '20', batchNo: 'BC202401020', materialName: '加拿大95%白鹅绒', materialCode: 'WL032', quantity: 220, produceDate: '2024-01-24', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-24 14:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240102000001' },
  { id: '21', batchNo: 'BC202401021', materialName: '美国95%白鹅绒', materialCode: 'WL033', quantity: 280, produceDate: '2024-01-25', downContent: '95%', fluffiness: '940+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-25 10:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240102100001' },
  { id: '22', batchNo: 'BC202401022', materialName: '德国95%白鹅绒', materialCode: 'WL034', quantity: 200, produceDate: '2024-01-25', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-25 15:30:00', printCount: 1, printBy: '李四', traceCode: 'TR20240102200001' },
  { id: '23', batchNo: 'BC202401023', materialName: '法国95%白鹅绒', materialCode: 'WL035', quantity: 190, produceDate: '2024-01-26', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-26 09:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240102300001' },
  { id: '24', batchNo: 'BC202401024', materialName: '意大利95%白鹅绒', materialCode: 'WL036', quantity: 170, produceDate: '2024-01-26', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-26 14:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240102400001' },
  { id: '25', batchNo: 'BC202401025', materialName: '英国95%白鹅绒', materialCode: 'WL047', quantity: 160, produceDate: '2024-01-27', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-01-27 10:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240102500001' },
  { id: '26', batchNo: 'BC202401026', materialName: '95%白鹅绒', materialCode: 'WL001', quantity: 600, produceDate: '2024-02-01', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-02-01 09:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240200100001' },
  { id: '27', batchNo: 'BC202401027', materialName: '90%白鹅绒', materialCode: 'WL002', quantity: 750, produceDate: '2024-02-01', downContent: '90%', fluffiness: '850+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-02-01 13:30:00', printCount: 1, printBy: '李四', traceCode: 'TR20240200200001' },
  { id: '28', batchNo: 'BC202401028', materialName: '95%灰鹅绒', materialCode: 'WL004', quantity: 550, produceDate: '2024-02-02', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-02-02 10:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240200300001' },
  { id: '29', batchNo: 'BC202401029', materialName: '波兰95%白鹅绒', materialCode: 'WL011', quantity: 320, produceDate: '2024-02-02', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-02 14:30:00', printCount: 1, printBy: '王五', traceCode: 'TR20240200400001' },
  { id: '30', batchNo: 'BC202401030', materialName: '匈牙利95%白鹅绒', materialCode: 'WL012', quantity: 380, produceDate: '2024-02-03', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-03 09:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240200500001' },
  { id: '31', batchNo: 'BC202401031', materialName: '95%白鸭绒', materialCode: 'WL006', quantity: 850, produceDate: '2024-02-03', downContent: '95%', fluffiness: '850+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-02-03 13:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240200600001' },
  { id: '32', batchNo: 'BC202401032', materialName: '90%白鸭绒', materialCode: 'WL007', quantity: 950, produceDate: '2024-02-04', downContent: '90%', fluffiness: '800+', cleanliness: '900+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-02-04 10:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240200700001' },
  { id: '33', batchNo: 'BC202401033', materialName: '羽绒被填充料A级', materialCode: 'WL016', quantity: 1800, produceDate: '2024-02-04', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-02-04 15:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240200800001' },
  { id: '34', batchNo: 'BC202401034', materialName: '睡袋填充料', materialCode: 'WL021', quantity: 700, produceDate: '2024-02-05', downContent: '90%', fluffiness: '850+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-02-05 09:30:00', printCount: 1, printBy: '李四', traceCode: 'TR20240200900001' },
  { id: '35', batchNo: 'BC202401035', materialName: '水洗白鹅绒', materialCode: 'WL025', quantity: 2200, produceDate: '2024-02-05', downContent: '90%', fluffiness: '850+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-05 14:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240201000001' },
  { id: '36', batchNo: 'BC202401036', materialName: '医用95%白鹅绒', materialCode: 'WL022', quantity: 120, produceDate: '2024-02-06', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.0', printStatus: '已打印', printTime: '2024-02-06 10:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240201100001' },
  { id: '37', batchNo: 'BC202401037', materialName: '军用95%白鹅绒', materialCode: 'WL023', quantity: 180, produceDate: '2024-02-06', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.0', printStatus: '已打印', printTime: '2024-02-06 15:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240201200001' },
  { id: '38', batchNo: 'BC202401038', materialName: '西伯利亚95%白鹅绒', materialCode: 'WL013', quantity: 240, produceDate: '2024-02-07', downContent: '95%', fluffiness: '1000+', cleanliness: '1000+', oxygenConsumption: '≤4.2', printStatus: '已打印', printTime: '2024-02-07 09:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240201300001' },
  { id: '39', batchNo: 'BC202401039', materialName: '加拿大95%白鹅绒', materialCode: 'WL032', quantity: 260, produceDate: '2024-02-07', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-07 14:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240201400001' },
  { id: '40', batchNo: 'BC202401040', materialName: '美国95%白鹅绒', materialCode: 'WL033', quantity: 300, produceDate: '2024-02-08', downContent: '95%', fluffiness: '940+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-08 10:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240201500001' },
  { id: '41', batchNo: 'BC202401041', materialName: '德国95%白鹅绒', materialCode: 'WL034', quantity: 210, produceDate: '2024-02-08', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-08 15:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240201600001' },
  { id: '42', batchNo: 'BC202401042', materialName: '法国95%白鹅绒', materialCode: 'WL035', quantity: 200, produceDate: '2024-02-19', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-19 09:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240201700001' },
  { id: '43', batchNo: 'BC202401043', materialName: '意大利95%白鹅绒', materialCode: 'WL036', quantity: 180, produceDate: '2024-02-19', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-19 14:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240201800001' },
  { id: '44', batchNo: 'BC202401044', materialName: '95%白鹅绒', materialCode: 'WL001', quantity: 650, produceDate: '2024-02-20', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-02-20 10:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240201900001' },
  { id: '45', batchNo: 'BC202401045', materialName: '90%白鹅绒', materialCode: 'WL002', quantity: 780, produceDate: '2024-02-20', downContent: '90%', fluffiness: '850+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-02-20 15:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240202000001' },
  { id: '46', batchNo: 'BC202401046', materialName: '波兰95%白鹅绒', materialCode: 'WL011', quantity: 340, produceDate: '2024-02-21', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-21 09:00:00', printCount: 1, printBy: '李四', traceCode: 'TR20240202100001' },
  { id: '47', batchNo: 'BC202401047', materialName: '匈牙利95%白鹅绒', materialCode: 'WL012', quantity: 400, produceDate: '2024-02-21', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.5', printStatus: '已打印', printTime: '2024-02-21 14:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240202200001' },
  { id: '48', batchNo: 'BC202401048', materialName: '服装填充料95%', materialCode: 'WL019', quantity: 850, produceDate: '2024-02-22', downContent: '95%', fluffiness: '900+', cleanliness: '1000+', oxygenConsumption: '≤4.8', printStatus: '已打印', printTime: '2024-02-22 10:00:00', printCount: 1, printBy: '王五', traceCode: 'TR20240202300001' },
  { id: '49', batchNo: 'BC202401049', materialName: '睡袋填充料', materialCode: 'WL021', quantity: 750, produceDate: '2024-02-22', downContent: '90%', fluffiness: '850+', cleanliness: '950+', oxygenConsumption: '≤5.0', printStatus: '已打印', printTime: '2024-02-22 15:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240202400001' },
  { id: '50', batchNo: 'BC202401050', materialName: '医用95%白鹅绒', materialCode: 'WL022', quantity: 130, produceDate: '2024-02-23', downContent: '95%', fluffiness: '950+', cleanliness: '1000+', oxygenConsumption: '≤4.0', printStatus: '已打印', printTime: '2024-02-23 10:00:00', printCount: 1, printBy: '张三', traceCode: 'TR20240202500001' }
];

const materialOptions = ['WL001-95%白鹅绒', 'WL002-90%白鹅绒', 'WL003-85%白鹅绒', 'WL004-95%灰鹅绒', 'WL005-90%灰鹅绒', 'WL006-95%白鸭绒', 'WL007-90%白鸭绒', 'WL011-波兰95%白鹅绒', 'WL012-匈牙利95%白鹅绒', 'WL013-西伯利亚95%白鹅绒'];

const ProductCodePrint = () => {
  const [searchForm] = Form.useForm();
  const [printForm] = Form.useForm();
  const [dataSource, setDataSource] = useState(mockPrintData);
  const [loading, setLoading] = useState(false);

  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);

  // 步骤向导状态
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

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
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 140,
    },
    {
      title: '产品名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 180,
    },
    {
      title: '数量(kg)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
    },
    {
      title: '生产日期',
      dataIndex: 'produceDate',
      key: 'produceDate',
      width: 110,
    },
    {
      title: '绒子含量',
      dataIndex: 'downContent',
      key: 'downContent',
      width: 90,
      align: 'center',
    },
    {
      title: '蓬松度',
      dataIndex: 'fluffiness',
      key: 'fluffiness',
      width: 90,
      align: 'center',
    },
    {
      title: '清洁度',
      dataIndex: 'cleanliness',
      key: 'cleanliness',
      width: 90,
      align: 'center',
    },
    {
      title: '耗氧量',
      dataIndex: 'oxygenConsumption',
      key: 'oxygenConsumption',
      width: 90,
      align: 'center',
    },
    {
      title: '打印状态',
      dataIndex: 'printStatus',
      key: 'printStatus',
      width: 100,
      render: (status) => (
        <Badge status={status === '已打印' ? 'success' : 'default'} text={status} />
      ),
    },
    {
      title: '打印次数',
      dataIndex: 'printCount',
      key: 'printCount',
      width: 90,
      align: 'center',
    },
    {
      title: '打印人',
      dataIndex: 'printBy',
      key: 'printBy',
      width: 100,
    },
    {
      title: '打印时间',
      dataIndex: 'printTime',
      key: 'printTime',
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
            icon={<PrinterOutlined />}
            onClick={() => handleReprint(record)}
          >
            补打
          </Button>
        </Space>
      )
    }
  ];

  // 统计数据
  const stats = {
    total: dataSource.length,
    printed: dataSource.filter(item => item.printStatus === '已打印').length,
    unprinted: dataSource.filter(item => item.printStatus === '未打印').length,
    todayPrinted: dataSource.filter(item => item.printTime && item.printTime.startsWith(dayjs().format('YYYY-MM-DD'))).length
  };

  const handleSearch = useCallback((values) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...mockPrintData];
      if (values.batchNo) {
        filtered = filtered.filter(item =>
          item.batchNo.toLowerCase().includes(values.batchNo.toLowerCase())
        );
      }
      if (values.materialName) {
        filtered = filtered.filter(item =>
          item.materialName.includes(values.materialName)
        );
      }
      if (values.printStatus) {
        filtered = filtered.filter(item => item.printStatus === values.printStatus);
      }
      if (values.dateRange && values.dateRange.length === 2) {
        const startDate = values.dateRange[0].format('YYYY-MM-DD');
        const endDate = values.dateRange[1].format('YYYY-MM-DD');
        filtered = filtered.filter(item =>
          item.produceDate >= startDate && item.produceDate <= endDate
        );
      }
      setDataSource(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
      setLoading(false);
    }, 300);
  }, []);

  const handleReset = () => {
    searchForm.resetFields();
    setDataSource(mockPrintData);
    setPagination(prev => ({ ...prev, total: mockPrintData.length, current: 1 }));
  };

  const handleAddPrint = () => {
    printForm.resetFields();
    setCurrentStep(0);
    setCompletedSteps([]);
    setPrintModalVisible(true);
  };

  // 步骤配置
  const steps = [
    { title: '产品信息' },
    { title: '原材料信息' },
    { title: '生产信息' },
    { title: '质检信息' },
    { title: '仓储物流信息' },
    { title: '销售信息' }
  ];

  // 下一步
  const handleNext = async () => {
    try {
      // 验证当前步骤的字段
      const currentStepFields = getStepFields(currentStep);
      await printForm.validateFields(currentStepFields);

      // 标记当前步骤为已完成
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      // 进入下一步
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      message.error('请完善当前步骤信息');
    }
  };

  // 上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 获取每个步骤需要验证的字段
  const getStepFields = (step) => {
    const stepFields = {
      0: ['productName', 'specification', 'model', 'unit', 'quantity'],
      1: ['rawMaterialSource', 'rawMaterialBatch', 'supplier', 'rawMaterialQuality'],
      2: ['productionLine', 'productionDate', 'productionBatch', 'operator'],
      3: ['qcResult', 'downContent', 'fluffiness', 'cleanliness', 'oxygenConsumption', 'qcReport'],
      4: ['warehouse', 'storageLocation', 'logisticsCompany', 'trackingNo'],
      5: ['salesOrder', 'customer', 'salesDate', 'distributionChannel']
    };
    return stepFields[step] || [];
  };

  // 渲染步骤内容
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="productName" label="产品名称" rules={[{ required: true, message: '请输入产品名称' }]}>
                <Select placeholder="请选择产品" showSearch>
                  {materialOptions.map(opt => {
                    const name = opt.split('-')[1];
                    return <Option key={opt} value={name}>{name}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="specification" label="规格" rules={[{ required: true, message: '请输入规格' }]}>
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="model" label="型号" rules={[{ required: true, message: '请输入型号' }]}>
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unit" label="单位" rules={[{ required: true, message: '请选择单位' }]}>
                <Select placeholder="请选择单位">
                  <Option value="kg">kg</Option>
                  <Option value="g">g</Option>
                  <Option value="件">件</Option>
                  <Option value="套">套</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="产品量" rules={[{ required: true, message: '请输入产品量' }]}>
                <InputNumber min={1} max={999999} style={{ width: '100%' }} placeholder="请输入产品量" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 1:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rawMaterialSource" label="原材料来源" rules={[{ required: true, message: '请输入原材料来源' }]}>
                <Input placeholder="请输入原材料来源" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rawMaterialBatch" label="原材料批次" rules={[{ required: true, message: '请输入原材料批次' }]}>
                <Input placeholder="请输入原材料批次" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier" label="供应商" rules={[{ required: true, message: '请输入供应商' }]}>
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rawMaterialQuality" label="原材料质量等级" rules={[{ required: true, message: '请选择质量等级' }]}>
                <Select placeholder="请选择质量等级">
                  <Option value="A级">A级</Option>
                  <Option value="B级">B级</Option>
                  <Option value="C级">C级</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );
      case 2:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="productionLine" label="生产线" rules={[{ required: true, message: '请输入生产线' }]}>
                <Input placeholder="请输入生产线" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productionDate" label="生产日期" rules={[{ required: true, message: '请选择生产日期' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="请选择生产日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productionBatch" label="生产批次" rules={[{ required: true, message: '请输入生产批次' }]}>
                <Input placeholder="请输入生产批次" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="operator" label="操作员" rules={[{ required: true, message: '请输入操作员' }]}>
                <Input placeholder="请输入操作员" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 3:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="qcResult" label="质检结果" rules={[{ required: true, message: '请选择质检结果' }]}>
                <Select placeholder="请选择质检结果">
                  <Option value="合格">合格</Option>
                  <Option value="不合格">不合格</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="downContent" label="绒子含量" rules={[{ required: true, message: '请输入绒子含量' }]}>
                <Input placeholder="如：95%" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="fluffiness" label="蓬松度" rules={[{ required: true, message: '请输入蓬松度' }]}>
                <Input placeholder="如：900+" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cleanliness" label="清洁度" rules={[{ required: true, message: '请输入清洁度' }]}>
                <Input placeholder="如：1000+" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="oxygenConsumption" label="耗氧量" rules={[{ required: true, message: '请输入耗氧量' }]}>
                <Input placeholder="如：≤4.8" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="qcReport" label="质检报告编号">
                <Input placeholder="请输入质检报告编号" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 4:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="warehouse" label="仓库" rules={[{ required: true, message: '请输入仓库' }]}>
                <Input placeholder="请输入仓库" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="storageLocation" label="库位" rules={[{ required: true, message: '请输入库位' }]}>
                <Input placeholder="请输入库位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="logisticsCompany" label="物流公司" rules={[{ required: true, message: '请输入物流公司' }]}>
                <Input placeholder="请输入物流公司" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="trackingNo" label="物流单号" rules={[{ required: true, message: '请输入物流单号' }]}>
                <Input placeholder="请输入物流单号" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 5:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="salesOrder" label="销售订单号" rules={[{ required: true, message: '请输入销售订单号' }]}>
                <Input placeholder="请输入销售订单号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customer" label="客户名称" rules={[{ required: true, message: '请输入客户名称' }]}>
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salesDate" label="销售日期" rules={[{ required: true, message: '请选择销售日期' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="请选择销售日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="distributionChannel" label="销售渠道" rules={[{ required: true, message: '请选择销售渠道' }]}>
                <Select placeholder="请选择销售渠道">
                  <Option value="线上">线上</Option>
                  <Option value="线下">线下</Option>
                  <Option value="批发">批发</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };

  const handleView = (record) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleReprint = (record) => {
    Modal.confirm({
      title: '确认补打',
      content: `确定要补打批次号 ${record.batchNo} 的溯源码吗？`,
      onOk() {
        setDataSource(prev => prev.map(item =>
          item.id === record.id
            ? { ...item, printCount: item.printCount + 1, printTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
            : item
        ));
        message.success('补打成功');
      }
    });
  };

  const handlePrintSave = async () => {
    try {
      // 验证所有步骤的字段
      const allFields = [
        'productName', 'specification', 'model', 'unit', 'quantity',
        'rawMaterialSource', 'rawMaterialBatch', 'supplier', 'rawMaterialQuality',
        'productionLine', 'productionDate', 'productionBatch', 'operator',
        'qcResult', 'downContent', 'fluffiness', 'cleanliness', 'oxygenConsumption',
        'warehouse', 'storageLocation', 'logisticsCompany', 'trackingNo',
        'salesOrder', 'customer', 'salesDate', 'distributionChannel'
      ];
      const values = await printForm.validateFields(allFields);

      const newRecord = {
        id: Date.now().toString(),
        batchNo: `BC${dayjs().format('YYYYMMDD')}${String(dataSource.length + 1).padStart(3, '0')}`,
        materialName: values.productName,
        materialCode: `WL${String(dataSource.length + 1).padStart(3, '0')}`,
        quantity: values.quantity,
        produceDate: values.productionDate ? dayjs(values.productionDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        downContent: values.downContent,
        fluffiness: values.fluffiness,
        cleanliness: values.cleanliness,
        oxygenConsumption: values.oxygenConsumption,
        printStatus: '已打印',
        printTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        printCount: 1,
        printBy: '当前用户',
        traceCode: `TR${dayjs().format('YYYYMMDD')}${String(dataSource.length + 1).padStart(5, '0')}`
      };

      setDataSource(prev => [newRecord, ...prev]);
      message.success('打印成功');
      setPrintModalVisible(false);
      printForm.resetFields();
      setCurrentStep(0);
      setCompletedSteps([]);
    } catch (error) {
      console.error('Validate Failed:', error);
      message.error('请完善所有必填信息');
    }
  };

  const handleExport = () => {
    const exportData = dataSource.map(item => ({
      '批次号': item.batchNo,
      '产品名称': item.materialName,
      '产品编号': item.materialCode,
      '数量(kg)': item.quantity,
      '生产日期': item.produceDate,
      '绒子含量': item.downContent,
      '蓬松度': item.fluffiness,
      '清洁度': item.cleanliness,
      '耗氧量': item.oxygenConsumption,
      '打印状态': item.printStatus,
      '打印次数': item.printCount,
      '打印人': item.printBy,
      '打印时间': item.printTime,
      '溯源码': item.traceCode
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '打印记录');
    const dateStr = dayjs().format('YYYYMMDD');
    XLSX.writeFile(wb, `打印记录_${dateStr}.xlsx`);
    message.success('导出成功');
  };

  return (
    <div className="page-container">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总批次"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已打印"
              value={stats.printed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="未打印"
              value={stats.unprinted}
              valueStyle={{ color: '#d9d9d9' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日打印"
              value={stats.todayPrinted}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索区域 */}
      <Card className="search-card" title="搜索条件" size="small">
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={5}>
              <Form.Item name="batchNo" label="批次号">
                <Input placeholder="请输入批次号" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="materialName" label="产品名称">
                <Input placeholder="请输入产品名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="printStatus" label="打印状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="已打印">已打印</Option>
                  <Option value="未打印">未打印</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="dateRange" label="生产日期">
                <RangePicker style={{ width: '100%' }} />
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
        title="产品码打印记录"
        size="small"
        extra={
          <Space>
            <Button type="primary" icon={<PrinterOutlined />} onClick={handleAddPrint}>
              新增打印
            </Button>
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
          scroll={{ x: 1400 }}
          onChange={(newPagination) => setPagination(newPagination)}
        />
      </Card>

      {/* 新增打印模态框 - 步骤向导 */}
      <Modal
        title="新增产品码打印"
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: '16px 0' }}>
          {/* 步骤条 */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {steps.map((item, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    position: 'relative'
                  }}>
                    {/* 步骤圆圈 */}
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isCompleted || isCurrent ? '#1890ff' : '#fff',
                      border: `2px solid ${isCompleted || isCurrent ? '#1890ff' : '#e0e0e0'}`,
                      color: isCompleted || isCurrent ? '#fff' : '#999',
                      fontSize: 14,
                      fontWeight: 500,
                      zIndex: 1
                    }}>
                      {index + 1}
                    </div>

                    {/* 状态标签 */}
                    <div style={{
                      fontSize: 12,
                      color: isCompleted ? '#1890ff' : isCurrent ? '#1890ff' : '#bfbfbf',
                      marginTop: 8,
                      marginBottom: 4
                    }}>
                      {isCompleted ? '已填写' : isCurrent ? '进行中' : '待进行'}
                    </div>

                    {/* 步骤标题 */}
                    <div style={{
                      fontSize: 14,
                      color: isCurrent ? '#262626' : '#bfbfbf',
                      fontWeight: isCurrent ? 500 : 400
                    }}>
                      {item.title}
                    </div>

                    {/* 连接线 */}
                    {index < steps.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        top: 16,
                        left: '50%',
                        width: '100%',
                        height: 2,
                        backgroundColor: isCompleted ? '#1890ff' : '#e0e0e0',
                        zIndex: 0
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 步骤内容 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '0 16px 16px',
            minHeight: 200
          }}>
            <Form form={printForm} layout="vertical">
              {renderStepContent(currentStep)}
            </Form>
          </div>

          {/* 底部按钮 */}
          <div style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px dashed #e8e8e8',
            display: 'flex',
            justifyContent: 'center',
            gap: 16
          }}>
            {currentStep > 0 && (
              <Button
                size="large"
                icon={<LeftOutlined />}
                onClick={handlePrev}
                style={{ minWidth: 120 }}
              >
                上一步
              </Button>
            )}
            {currentStep === 0 && (
              <div style={{ minWidth: 120 }} />
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                size="large"
                icon={<RightOutlined />}
                onClick={handleNext}
                style={{ minWidth: 120 }}
              >
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                onClick={handlePrintSave}
                style={{ minWidth: 120 }}
              >
                保存
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="批次详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {viewingRecord && (
          <>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="批次号">{viewingRecord.batchNo}</Descriptions.Item>
              <Descriptions.Item label="溯源码">{viewingRecord.traceCode}</Descriptions.Item>
              <Descriptions.Item label="产品名称">{viewingRecord.materialName}</Descriptions.Item>
              <Descriptions.Item label="产品编号">{viewingRecord.materialCode}</Descriptions.Item>
              <Descriptions.Item label="数量">{viewingRecord.quantity} kg</Descriptions.Item>
              <Descriptions.Item label="生产日期">{viewingRecord.produceDate}</Descriptions.Item>
              <Descriptions.Item label="绒子含量">{viewingRecord.downContent}</Descriptions.Item>
              <Descriptions.Item label="蓬松度">{viewingRecord.fluffiness}</Descriptions.Item>
              <Descriptions.Item label="清洁度">{viewingRecord.cleanliness}</Descriptions.Item>
              <Descriptions.Item label="耗氧量">{viewingRecord.oxygenConsumption}</Descriptions.Item>
              <Descriptions.Item label="打印状态">
                <Badge status={viewingRecord.printStatus === '已打印' ? 'success' : 'default'} text={viewingRecord.printStatus} />
              </Descriptions.Item>
              <Descriptions.Item label="打印次数">{viewingRecord.printCount}</Descriptions.Item>
              <Descriptions.Item label="打印人">{viewingRecord.printBy}</Descriptions.Item>
              <Descriptions.Item label="打印时间">{viewingRecord.printTime}</Descriptions.Item>
            </Descriptions>
            <div style={{ textAlign: 'center' }}>
              <h4>溯源码二维码</h4>
              <QRCode
                value={`https://trace.guqirongcai.com/${viewingRecord.traceCode}`}
                size={200}
              />
              <p style={{ marginTop: 8, color: '#666' }}>
                扫码可查看产品溯源信息
              </p>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProductCodePrint;
