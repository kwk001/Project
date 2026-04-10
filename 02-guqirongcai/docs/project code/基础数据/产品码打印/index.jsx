class LowcodeComponent extends Component {
  constructor() {
    const { injectMesModuleMethods } = window.KaiwuMesModule;
    injectMesModuleMethods(this);
  }

  static PAGE_FORMCODE = 'MES_cpdym';
  static PAGE_FORMNAME = '产品码打印';

  state = {
    mockData: [
      { _id: 'batch_001', batchNo: 'BC20240001', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 250, produceDate: '2024-01-02', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '95%', fluffiness: '900+', turbidity: '8mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '张三', createTime: '2024-01-02 09:07:00' },
      { _id: 'batch_002', batchNo: 'BC20240002', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 300, produceDate: '2024-01-03', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '90%', fluffiness: '880+', turbidity: '10mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '李四', createTime: '2024-01-03 10:14:00' },
      { _id: 'batch_003', batchNo: 'BC20240003', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 350, produceDate: '2024-01-04', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '85%', fluffiness: '860+', turbidity: '11mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '王五', createTime: '2024-01-04 11:21:00' },
      { _id: 'batch_004', batchNo: 'BC20240004', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 400, produceDate: '2024-01-05', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '80%', fluffiness: '850+', turbidity: '12mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '赵六', createTime: '2024-01-05 12:28:00' },
      { _id: 'batch_005', batchNo: 'BC20240005', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 450, produceDate: '2024-01-06', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '75%', fluffiness: '820+', turbidity: '14mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '钱七', createTime: '2024-01-06 13:35:00' },
      { _id: 'batch_006', batchNo: 'BC20240006', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 500, produceDate: '2024-01-07', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '95%', fluffiness: '810+', turbidity: '15mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '张三', createTime: '2024-01-07 14:42:00' },
      { _id: 'batch_007', batchNo: 'BC20240007', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 550, produceDate: '2024-01-08', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '90%', fluffiness: '800+', turbidity: '16mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '李四', createTime: '2024-01-08 15:49:00' },
      { _id: 'batch_008', batchNo: 'BC20240008', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 600, produceDate: '2024-01-09', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '85%', fluffiness: '760+', turbidity: '18mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '王五', createTime: '2024-01-09 08:56:00' },
      { _id: 'batch_009', batchNo: 'BC20240009', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 650, produceDate: '2024-01-10', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '80%', fluffiness: '750+', turbidity: '8mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '赵六', createTime: '2024-01-10 09:03:00' },
      { _id: 'batch_010', batchNo: 'BC20240010', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 700, produceDate: '2024-01-11', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '75%', fluffiness: '900+', turbidity: '10mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '钱七', createTime: '2024-01-11 10:10:00' },
      { _id: 'batch_011', batchNo: 'BC20240011', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 750, produceDate: '2024-01-12', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '95%', fluffiness: '880+', turbidity: '11mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '张三', createTime: '2024-01-12 11:17:00' },
      { _id: 'batch_012', batchNo: 'BC20240012', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 800, produceDate: '2024-01-13', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '90%', fluffiness: '860+', turbidity: '12mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '李四', createTime: '2024-01-13 12:24:00' },
      { _id: 'batch_013', batchNo: 'BC20240013', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 850, produceDate: '2024-01-14', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '85%', fluffiness: '850+', turbidity: '14mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '王五', createTime: '2024-01-14 13:31:00' },
      { _id: 'batch_014', batchNo: 'BC20240014', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 900, produceDate: '2024-01-15', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '80%', fluffiness: '820+', turbidity: '15mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '赵六', createTime: '2024-01-15 14:38:00' },
      { _id: 'batch_015', batchNo: 'BC20240015', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 950, produceDate: '2024-01-16', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '75%', fluffiness: '810+', turbidity: '16mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '钱七', createTime: '2024-01-16 15:45:00' },
      { _id: 'batch_016', batchNo: 'BC20240016', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 200, produceDate: '2024-01-17', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '95%', fluffiness: '800+', turbidity: '18mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '张三', createTime: '2024-01-17 08:52:00' },
      { _id: 'batch_017', batchNo: 'BC20240017', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 250, produceDate: '2024-01-18', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '90%', fluffiness: '760+', turbidity: '8mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '李四', createTime: '2024-01-18 09:59:00' },
      { _id: 'batch_018', batchNo: 'BC20240018', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 300, produceDate: '2024-01-19', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '85%', fluffiness: '750+', turbidity: '10mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '王五', createTime: '2024-01-19 10:06:00' },
      { _id: 'batch_019', batchNo: 'BC20240019', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 350, produceDate: '2024-01-20', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '80%', fluffiness: '900+', turbidity: '11mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '赵六', createTime: '2024-01-20 11:13:00' },
      { _id: 'batch_020', batchNo: 'BC20240020', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 400, produceDate: '2024-01-21', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '75%', fluffiness: '880+', turbidity: '12mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '钱七', createTime: '2024-01-21 12:20:00' },
      { _id: 'batch_021', batchNo: 'BC20240021', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 450, produceDate: '2024-01-22', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '95%', fluffiness: '860+', turbidity: '14mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '张三', createTime: '2024-01-22 13:27:00' },
      { _id: 'batch_022', batchNo: 'BC20240022', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 500, produceDate: '2024-01-23', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '90%', fluffiness: '850+', turbidity: '15mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '李四', createTime: '2024-01-23 14:34:00' },
      { _id: 'batch_023', batchNo: 'BC20240023', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 550, produceDate: '2024-01-24', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '85%', fluffiness: '820+', turbidity: '16mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '王五', createTime: '2024-01-24 15:41:00' },
      { _id: 'batch_024', batchNo: 'BC20240024', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 600, produceDate: '2024-01-25', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '80%', fluffiness: '810+', turbidity: '18mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '赵六', createTime: '2024-01-25 08:48:00' },
      { _id: 'batch_025', batchNo: 'BC20240025', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 650, produceDate: '2024-01-26', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '75%', fluffiness: '800+', turbidity: '8mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '钱七', createTime: '2024-01-26 09:55:00' },
      { _id: 'batch_026', batchNo: 'BC20240026', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 700, produceDate: '2024-01-27', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '95%', fluffiness: '760+', turbidity: '10mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '张三', createTime: '2024-01-27 10:02:00' },
      { _id: 'batch_027', batchNo: 'BC20240027', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 750, produceDate: '2024-01-28', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '90%', fluffiness: '750+', turbidity: '11mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '李四', createTime: '2024-01-28 11:09:00' },
      { _id: 'batch_028', batchNo: 'BC20240028', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 800, produceDate: '2024-01-01', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '85%', fluffiness: '900+', turbidity: '12mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '王五', createTime: '2024-01-01 12:16:00' },
      { _id: 'batch_029', batchNo: 'BC20240029', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 850, produceDate: '2024-02-02', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '80%', fluffiness: '880+', turbidity: '14mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '赵六', createTime: '2024-02-02 13:23:00' },
      { _id: 'batch_030', batchNo: 'BC20240030', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 900, produceDate: '2024-02-03', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '75%', fluffiness: '860+', turbidity: '15mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '钱七', createTime: '2024-02-03 14:30:00' },
      { _id: 'batch_031', batchNo: 'BC20240031', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 950, produceDate: '2024-02-04', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '95%', fluffiness: '850+', turbidity: '16mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '张三', createTime: '2024-02-04 15:37:00' },
      { _id: 'batch_032', batchNo: 'BC20240032', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 200, produceDate: '2024-02-05', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '90%', fluffiness: '820+', turbidity: '18mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '李四', createTime: '2024-02-05 08:44:00' },
      { _id: 'batch_033', batchNo: 'BC20240033', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 250, produceDate: '2024-02-06', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '85%', fluffiness: '810+', turbidity: '8mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '王五', createTime: '2024-02-06 09:51:00' },
      { _id: 'batch_034', batchNo: 'BC20240034', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 300, produceDate: '2024-02-07', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '80%', fluffiness: '800+', turbidity: '10mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '赵六', createTime: '2024-02-07 10:58:00' },
      { _id: 'batch_035', batchNo: 'BC20240035', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 350, produceDate: '2024-02-08', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '75%', fluffiness: '760+', turbidity: '11mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '钱七', createTime: '2024-02-08 11:05:00' },
      { _id: 'batch_036', batchNo: 'BC20240036', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 400, produceDate: '2024-02-09', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '95%', fluffiness: '750+', turbidity: '12mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '张三', createTime: '2024-02-09 12:12:00' },
      { _id: 'batch_037', batchNo: 'BC20240037', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 450, produceDate: '2024-02-10', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '90%', fluffiness: '900+', turbidity: '14mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '李四', createTime: '2024-02-10 13:19:00' },
      { _id: 'batch_038', batchNo: 'BC20240038', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 500, produceDate: '2024-02-11', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '85%', fluffiness: '880+', turbidity: '15mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '王五', createTime: '2024-02-11 14:26:00' },
      { _id: 'batch_039', batchNo: 'BC20240039', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 550, produceDate: '2024-02-12', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '80%', fluffiness: '860+', turbidity: '16mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '赵六', createTime: '2024-02-12 15:33:00' },
      { _id: 'batch_040', batchNo: 'BC20240040', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 600, produceDate: '2024-02-13', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '75%', fluffiness: '850+', turbidity: '18mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '钱七', createTime: '2024-02-13 08:40:00' },
      { _id: 'batch_041', batchNo: 'BC20240041', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 650, produceDate: '2024-02-14', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '95%', fluffiness: '820+', turbidity: '8mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '张三', createTime: '2024-02-14 09:47:00' },
      { _id: 'batch_042', batchNo: 'BC20240042', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 700, produceDate: '2024-02-15', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '90%', fluffiness: '810+', turbidity: '10mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '李四', createTime: '2024-02-15 10:54:00' },
      { _id: 'batch_043', batchNo: 'BC20240043', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 750, produceDate: '2024-02-16', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '85%', fluffiness: '800+', turbidity: '11mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '王五', createTime: '2024-02-16 11:01:00' },
      { _id: 'batch_044', batchNo: 'BC20240044', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 800, produceDate: '2024-02-17', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '80%', fluffiness: '760+', turbidity: '12mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '赵六', createTime: '2024-02-17 12:08:00' },
      { _id: 'batch_045', batchNo: 'BC20240045', materialId: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 850, produceDate: '2024-02-18', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '75%', fluffiness: '750+', turbidity: '14mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '钱七', createTime: '2024-02-18 13:15:00' },
      { _id: 'batch_046', batchNo: 'BC20240046', materialId: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', specification: '标准规格', unitName: '千克', quantity: 900, produceDate: '2024-02-19', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '95%', fluffiness: '900+', turbidity: '15mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '张三', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '张三', createTime: '2024-02-19 14:22:00' },
      { _id: 'batch_047', batchNo: 'BC20240047', materialId: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 950, produceDate: '2024-02-20', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '90%', fluffiness: '880+', turbidity: '16mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '李四', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '李四', createTime: '2024-02-20 15:29:00' },
      { _id: 'batch_048', batchNo: 'BC20240048', materialId: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', specification: '高规格', unitName: '千克', quantity: 200, produceDate: '2024-02-21', executionStandard: 'Q/GQ 001-2024', productStandardCategory: '企标', productionYear: 2024, downContent: '85%', fluffiness: '860+', turbidity: '18mm', odor: '无异味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '王五', wechatQrImage: '', companyLinks: [], productCodeStatus: '未生成', createBy: '王五', createTime: '2024-02-21 08:36:00' },
      { _id: 'batch_049', batchNo: 'BC20240049', materialId: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', specification: '高规格', unitName: '千克', quantity: 250, produceDate: '2024-02-22', executionStandard: 'GB/T 14272-2021', productStandardCategory: '国标', productionYear: 2024, downContent: '80%', fluffiness: '850+', turbidity: '8mm', odor: '无异物', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '赵六', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '赵六', createTime: '2024-02-22 09:43:00' },
      { _id: 'batch_050', batchNo: 'BC20240050', materialId: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', specification: '高规格', unitName: '千克', quantity: 300, produceDate: '2024-02-23', executionStandard: 'FZ/T 73053-2021', productStandardCategory: '行标', productionYear: 2024, downContent: '75%', fluffiness: '820+', turbidity: '10mm', odor: '轻微气味', productVideo: '', certificationImages: [], companyName: '安徽古麒绒材股份有限公司', companyAddress: '安徽省芜湖市', licenseNo: 'SC12345678901', inspector: '钱七', wechatQrImage: '', companyLinks: [], productCodeStatus: '已生成', createBy: '钱七', createTime: '2024-02-23 10:50:00' }
    ],
    dataList: [],
    loading: false,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    searchParams: {
      batchNo: '',
      materialName: '',
      productCodeStatus: 'all',
      produceDateRange: null
    },
    selectedRowKeys: [],
    // 产品档案数据
    productArchives: [
      { _id: 'mat_001', materialCode: 'WL001', materialName: '95%白鹅绒', unitName: '千克', specification: '高规格' },
      { _id: 'mat_002', materialCode: 'WL002', materialName: '90%白鹅绒', unitName: '千克', specification: '高规格' },
      { _id: 'mat_003', materialCode: 'WL003', materialName: '85%白鸭绒', unitName: '千克', specification: '标准规格' },
      { _id: 'mat_004', materialCode: 'WL004', materialName: '80%白鸭绒', unitName: '千克', specification: '标准规格' },
      { _id: 'mat_005', materialCode: 'WL005', materialName: '95%灰鹅绒', unitName: '千克', specification: '高规格' },
      { _id: 'mat_006', materialCode: 'WL006', materialName: '90%灰鹅绒', unitName: '千克', specification: '高规格' }
    ],
    // 执行标准数据
    executionStandards: [
      { _id: 'std_001', standardCode: 'GB/T 14272-2021', standardType: '国标', executionCode: 'EXEC001', productStandardCategory: '国标' },
      { _id: 'std_002', standardCode: 'FZ/T 73053-2021', standardType: '行标', executionCode: 'EXEC002', productStandardCategory: '行标' },
      { _id: 'std_003', standardCode: 'Q/GQ 001-2024', standardType: '企标', executionCode: 'EXEC003', productStandardCategory: '企标' }
    ],
    // 新增批次弹窗相关
    isAddModalVisible: false,
    addFormData: {
      materialId: '',
      materialCode: '',
      materialName: '',
      unitName: '',
      specification: '',
      batchNo: '',
      quantity: null,
      produceDate: null,
      executionStandard: '',
      productStandardCategory: '',
      productionYear: null,
      productVideo: '',
      certificationImages: [],
      downContent: '',
      fluffiness: '',
      turbidity: '',
      odor: '',
      companyName: '',
      companyAddress: '',
      licenseNo: '',
      inspector: '',
      wechatQrImage: '',
      companyLinks: []
    },
    // 查看详情弹窗
    isDetailModalVisible: false,
    detailRecord: null,
    // 产品码预览弹窗
    isPreviewModalVisible: false,
    previewRecord: null
  };

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await this.setStatePromise({ loading: true });
    try {
      const { searchParams, pageNo, pageSize, mockData } = this.state;

      let filteredData = mockData.filter(item => {
        if (searchParams.batchNo && !item.batchNo.toLowerCase().includes(searchParams.batchNo.toLowerCase())) {
          return false;
        }
        if (searchParams.materialName && !item.materialName.includes(searchParams.materialName)) {
          return false;
        }
        if (searchParams.productCodeStatus !== 'all' && item.productCodeStatus !== searchParams.productCodeStatus) {
          return false;
        }
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
        title: '规格型号',
        dataIndex: 'specification',
        key: 'specification',
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
        title: '执行标准',
        dataIndex: 'executionStandard',
        key: 'executionStandard',
        width: 140
      },
      {
        title: '产品标准类别',
        dataIndex: 'productStandardCategory',
        key: 'productStandardCategory',
        width: 110
      },
      {
        title: '产品码状态',
        dataIndex: 'productCodeStatus',
        key: 'productCodeStatus',
        width: 100,
        render: (status) => (
          <Tag color={status === '已生成' ? 'success' : 'warning'}>
            {status}
          </Tag>
        )
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
        width: 180,
        fixed: 'right',
        render: (_, record) => this.renderActions(record)
      }
    ];
  }

  renderActions(record) {
    const { Button } = window.antd;

    return (
      <>
        <Button
          type="link"
          style={{ padding: '4px', marginRight: 8 }}
          onClick={() => this.handleViewDetail(record)}
        >
          查看
        </Button>
        {record.productCodeStatus === '未生成' ? (
          <Button
            type="link"
            style={{ padding: '4px', marginRight: 8 }}
            onClick={() => this.handleGenerateCode(record)}
          >
            生成产品码
          </Button>
        ) : (
          <Button
            type="link"
            style={{ padding: '4px', marginRight: 8 }}
            onClick={() => this.handleDownloadCode(record)}
          >
            下载产品码
          </Button>
        )}
        <Button
          type="link"
          style={{ padding: '4px' }}
          onClick={() => this.handlePreview(record)}
        >
          预览
        </Button>
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
        productCodeStatus: 'all',
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
    this.setState({
      isDetailModalVisible: true,
      detailRecord: record
    });
  }

  // 生成产品码
  handleGenerateCode(record) {
    const { Modal, message } = window.antd;
    Modal.confirm({
      title: '生成产品码',
      content: `确定要为批次 "${record.batchNo}" 生成产品码吗？`,
      okText: '确认生成',
      cancelText: '取消',
      onOk: async () => {
        const { mockData } = this.state;
        const newMockData = mockData.map(item => {
          if (item._id === record._id) {
            return { ...item, productCodeStatus: '已生成' };
          }
          return item;
        });
        await this.setStatePromise({ mockData: newMockData });
        message.success(`批次 ${record.batchNo} 产品码生成成功`);
        this.loadData();
      }
    });
  }

  // 下载产品码
  handleDownloadCode(record) {
    const { Modal, message } = window.antd;

    Modal.info({
      title: '下载产品码',
      width: 400,
      content: (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, display: 'inline-block' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <rect x="10" y="10" width="100" height="100" fill="white" stroke="#000" strokeWidth="2"/>
              <text x="60" y="50" textAnchor="middle" fontSize="12">产品码</text>
              <text x="60" y="75" textAnchor="middle" fontSize="10">{record.batchNo}</text>
            </svg>
          </div>
          <p style={{ marginTop: 12, color: '#666' }}>高清PNG格式（600dpi）</p>
          <p style={{ color: '#999', fontSize: 12 }}>批次号：{record.batchNo}</p>
        </div>
      ),
      okText: '下载PNG',
      onOk: () => {
        message.success('产品码下载成功');
      }
    });
  }

  // 预览产品码
  handlePreview(record) {
    this.setState({
      isPreviewModalVisible: true,
      previewRecord: record
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
            <span className="search-label">产品码状态：</span>
            <Select
              placeholder="请选择"
              value={searchParams.productCodeStatus === 'all' ? undefined : searchParams.productCodeStatus}
              onChange={(value) => this.handleSearchParamChange('productCodeStatus', value || 'all')}
              allowClear
              style={{ flex: 1 }}
            >
              <Select.Option value="已生成">已生成</Select.Option>
              <Select.Option value="未生成">未生成</Select.Option>
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
                <span className="text">新增批次</span>
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
            scroll={{ x: 1500, y: 'calc(100vh - 320px)' }}
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

    const headers = ['批次号', '产品名称', '产品编号', '规格型号', '数量', '单位', '生产日期', '执行标准', '产品标准类别', '生产年度', '绒子含量', '蓬松度', '浊度', '气味', '产品码状态', '创建人', '创建时间'];
    const rows = dataList.map(item => [
      item.batchNo,
      item.materialName,
      item.materialCode,
      item.specification,
      item.quantity,
      item.unitName,
      item.produceDate,
      item.executionStandard,
      item.productStandardCategory,
      item.productionYear,
      item.downContent,
      item.fluffiness,
      item.turbidity,
      item.odor,
      item.productCodeStatus,
      item.createBy,
      item.createTime
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

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

  // 新增批次
  handleAdd() {
    this.setState({
      isAddModalVisible: true,
      addFormData: {
        materialId: '',
        materialCode: '',
        materialName: '',
        unitName: '',
        specification: '',
        batchNo: '',
        quantity: null,
        produceDate: null,
        executionStandard: '',
        productStandardCategory: '',
        productionYear: null,
        productVideo: '',
        certificationImages: [],
        downContent: '',
        fluffiness: '',
        turbidity: '',
        odor: '',
        companyName: '',
        companyAddress: '',
        licenseNo: '',
        inspector: '',
        wechatQrImage: '',
        companyLinks: []
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

  // 渲染新增批次弹窗
  renderAddModal() {
    const { Modal, Form, Select, Input, DatePicker, InputNumber, Button, message, Upload, YearPicker } = window.antd;
    const { isAddModalVisible, addFormData } = this.state;

    const handleSave = async () => {
      const { mockData, addFormData } = this.state;

      // 必填校验
      if (!addFormData.materialId) {
        message.error('请选择产品档案');
        return;
      }
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
      if (!addFormData.executionStandard) {
        message.error('请选择执行标准');
        return;
      }
      if (!addFormData.productStandardCategory) {
        message.error('请选择产品标准类别');
        return;
      }
      if (!addFormData.productionYear) {
        message.error('请选择生产年度');
        return;
      }
      if (!addFormData.downContent || !addFormData.fluffiness || !addFormData.turbidity || !addFormData.odor) {
        message.error('请填写完整的质检信息');
        return;
      }

      // 校验批次号唯一性
      const exists = mockData.some(item =>
        item.batchNo.toLowerCase() === addFormData.batchNo.toLowerCase()
      );
      if (exists) {
        message.error('批次号已存在');
        return;
      }

      const product = this.state.productArchives.find(p => p._id === addFormData.materialId);
      const standard = this.state.executionStandards.find(s => s._id === addFormData.executionStandard);

      const newRecord = {
        _id: 'batch_' + Date.now(),
        batchNo: addFormData.batchNo,
        materialId: addFormData.materialId,
        materialCode: product.materialCode,
        materialName: product.materialName,
        specification: product.specification,
        unitName: product.unitName,
        quantity: addFormData.quantity,
        produceDate: addFormData.produceDate.format('YYYY-MM-DD'),
        executionStandard: standard ? standard.standardCode : '',
        productStandardCategory: addFormData.productStandardCategory,
        productionYear: addFormData.productionYear,
        productVideo: addFormData.productVideo,
        certificationImages: addFormData.certificationImages,
        downContent: addFormData.downContent,
        fluffiness: addFormData.fluffiness,
        turbidity: addFormData.turbidity,
        odor: addFormData.odor,
        companyName: addFormData.companyName || '安徽古麒绒材股份有限公司',
        companyAddress: addFormData.companyAddress || '安徽省芜湖市',
        licenseNo: addFormData.licenseNo || 'SC12345678901',
        inspector: addFormData.inspector || '当前用户',
        wechatQrImage: addFormData.wechatQrImage,
        companyLinks: addFormData.companyLinks,
        productCodeStatus: '未生成',
        createBy: '当前用户',
        createTime: new Date().toLocaleString()
      };

      await this.setStatePromise({
        mockData: [newRecord, ...mockData],
        isAddModalVisible: false
      });
      message.success('新增批次成功');
      this.loadData();
    };

    const product = this.state.productArchives.find(p => p._id === addFormData.materialId);
    const standard = this.state.executionStandards.find(s => s._id === addFormData.executionStandard);

    return (
      <Modal
        title="新增批次"
        open={isAddModalVisible}
        onCancel={() => this.handleAddModalCancel()}
        width={720}
        footer={[
          <Button key="cancel" onClick={() => this.handleAddModalCancel()}>取消</Button>,
          <Button key="save" type="primary" onClick={handleSave}>保存</Button>,
          <Button key="saveAndGenerate" type="primary" onClick={async () => {
            await handleSave();
            const newRecord = this.state.mockData[0];
            if (newRecord) {
              this.handleGenerateCode(newRecord);
            }
          }}>保存并生成产品码</Button>
        ]}
        destroyOnClose
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          {/* 基本信息区域 */}
          <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff' }}>基本信息</h4>
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
                      unitName: product.unitName,
                      specification: product.specification
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
            {product && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Form.Item label="产品编号" style={{ flex: 1, marginBottom: 0 }}>
                  <Input value={addFormData.materialCode} disabled />
                </Form.Item>
                <Form.Item label="产品名称" style={{ flex: 1, marginBottom: 0 }}>
                  <Input value={addFormData.materialName} disabled />
                </Form.Item>
                <Form.Item label="计量单位" style={{ flex: 1, marginBottom: 0 }}>
                  <Input value={addFormData.unitName} disabled />
                </Form.Item>
                <Form.Item label="规格型号" style={{ flex: 1, marginBottom: 0 }}>
                  <Input value={addFormData.specification} disabled />
                </Form.Item>
              </div>
            )}
            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item label="批次号" required style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="请输入批次号，建议格式：BC+年月日+流水号"
                  value={addFormData.batchNo}
                  onChange={(e) => this.handleAddFormChange('batchNo', e.target.value)}
                  maxLength={30}
                  suffix={
                    <Button type="link" size="small" onClick={() => this.handleAddFormChange('batchNo', this.generateBatchNo())}>
                      自动生成
                    </Button>
                  }
                />
              </Form.Item>
              <Form.Item label="数量" required style={{ flex: 1, marginBottom: 0 }}>
                <InputNumber
                  min={1}
                  max={999999}
                  style={{ width: '100%' }}
                  placeholder="请输入数量"
                  value={addFormData.quantity}
                  onChange={(value) => this.handleAddFormChange('quantity', value)}
                />
              </Form.Item>
              <Form.Item label="生产日期" required style={{ flex: 1, marginBottom: 0 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择生产日期"
                  value={addFormData.produceDate}
                  onChange={(date) => this.handleAddFormChange('produceDate', date)}
                  disabledDate={(current) => current && current.valueOf() > Date.now()}
                />
              </Form.Item>
            </div>
          </div>

          {/* 执行标准区域 */}
          <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff' }}>执行标准</h4>
            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item label="执行标准" required style={{ flex: 1, marginBottom: 0 }}>
                <Select
                  placeholder="请选择执行标准"
                  value={addFormData.executionStandard || undefined}
                  onChange={(value) => {
                    const std = this.state.executionStandards.find(s => s._id === value);
                    this.setState({
                      addFormData: {
                        ...addFormData,
                        executionStandard: value,
                        productStandardCategory: std ? std.productStandardCategory : ''
                      }
                    });
                  }}
                  style={{ width: '100%' }}
                >
                  {this.state.executionStandards.map(s => (
                    <Select.Option key={s._id} value={s._id}>
                      {s.standardCode} ({s.standardType})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="产品标准类别" required style={{ flex: 1, marginBottom: 0 }}>
                <Select
                  placeholder="请选择产品标准类别"
                  value={addFormData.productStandardCategory || undefined}
                  onChange={(value) => this.handleAddFormChange('productStandardCategory', value)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="国标">国标</Select.Option>
                  <Select.Option value="行标">行标</Select.Option>
                  <Select.Option value="企标">企标</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="生产年度" required style={{ flex: 1, marginBottom: 0 }}>
                <DatePicker.YearPicker
                  style={{ width: '100%' }}
                  placeholder="请选择生产年度"
                  value={addFormData.productionYear}
                  onChange={(year) => this.handleAddFormChange('productionYear', year)}
                />
              </Form.Item>
            </div>
          </div>

          {/* 质检信息区域 */}
          <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff' }}>质检信息</h4>
            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item label="绒子含量" required style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="如：95%"
                  value={addFormData.downContent}
                  onChange={(e) => this.handleAddFormChange('downContent', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="蓬松度" required style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="如：900+"
                  value={addFormData.fluffiness}
                  onChange={(e) => this.handleAddFormChange('fluffiness', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="浊度" required style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="如：10mm"
                  value={addFormData.turbidity}
                  onChange={(e) => this.handleAddFormChange('turbidity', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="气味" required style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="如：无异物"
                  value={addFormData.odor}
                  onChange={(e) => this.handleAddFormChange('odor', e.target.value)}
                />
              </Form.Item>
            </div>
          </div>

          {/* 媒体信息区域 */}
          <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff' }}>媒体信息</h4>
            <Form.Item label="产品视频" style={{ marginBottom: 16 }}>
              <Input
                placeholder="视频文件URL（支持MP4，最大100MB）"
                value={addFormData.productVideo}
                onChange={(e) => this.handleAddFormChange('productVideo', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="认证信息" style={{ marginBottom: 0 }}>
              <Input
                placeholder="认证图片URL，多个用逗号分隔（支持JPG/PNG，最多5张）"
                value={addFormData.certificationImages.join(',')}
                onChange={(e) => this.handleAddFormChange('certificationImages', e.target.value.split(',').filter(Boolean))}
              />
            </Form.Item>
          </div>

          {/* 企业信息区域 */}
          <div style={{ padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <h4 style={{ marginBottom: 16, color: '#1890ff' }}>企业信息</h4>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <Form.Item label="企业名称" style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="请输入企业名称"
                  value={addFormData.companyName}
                  onChange={(e) => this.handleAddFormChange('companyName', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="生产许可证" style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="请输入生产许可证号"
                  value={addFormData.licenseNo}
                  onChange={(e) => this.handleAddFormChange('licenseNo', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="质检员" style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="请输入质检员姓名"
                  value={addFormData.inspector}
                  onChange={(e) => this.handleAddFormChange('inspector', e.target.value)}
                />
              </Form.Item>
            </div>
            <Form.Item label="企业地址" style={{ marginBottom: 16 }}>
              <Input
                placeholder="请输入企业地址"
                value={addFormData.companyAddress}
                onChange={(e) => this.handleAddFormChange('companyAddress', e.target.value)}
              />
            </Form.Item>
            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item label="微信公众号图片" style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="公众号二维码图片URL"
                  value={addFormData.wechatQrImage}
                  onChange={(e) => this.handleAddFormChange('wechatQrImage', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="企业链接" style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="多个链接用逗号分隔"
                  value={addFormData.companyLinks.join(',')}
                  onChange={(e) => this.handleAddFormChange('companyLinks', e.target.value.split(',').filter(Boolean))}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }

  // 渲染详情弹窗
  renderDetailModal() {
    const { Modal, Tag } = window.antd;
    const { isDetailModalVisible, detailRecord } = this.state;

    if (!detailRecord) return null;

    return (
      <Modal
        title="批次详情"
        open={isDetailModalVisible}
        onCancel={() => this.setState({ isDetailModalVisible: false })}
        width={700}
        footer={null}
      >
        <div style={{ marginTop: 16 }}>
          {/* 基本信息 */}
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <h4 style={{ marginBottom: 12, color: '#1890ff' }}>基本信息</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>批次号：</strong>{detailRecord.batchNo}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>产品名称：</strong>{detailRecord.materialName}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>产品编号：</strong>{detailRecord.materialCode}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>规格型号：</strong>{detailRecord.specification}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>数量：</strong>{detailRecord.quantity} {detailRecord.unitName}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>生产日期：</strong>{detailRecord.produceDate}</div>
            </div>
          </div>

          {/* 执行标准 */}
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <h4 style={{ marginBottom: 12, color: '#1890ff' }}>执行标准</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>执行标准：</strong>{detailRecord.executionStandard}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>产品标准类别：</strong>{detailRecord.productStandardCategory}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>生产年度：</strong>{detailRecord.productionYear}</div>
            </div>
          </div>

          {/* 质检信息 */}
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <h4 style={{ marginBottom: 12, color: '#1890ff' }}>质检信息</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>绒子含量：</strong>{detailRecord.downContent}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>蓬松度：</strong>{detailRecord.fluffiness}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>浊度：</strong>{detailRecord.turbidity}</div>
              <div style={{ width: '50%', marginBottom: 8 }}><strong>气味：</strong>{detailRecord.odor}</div>
            </div>
          </div>

          {/* 状态信息 */}
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <h4 style={{ marginBottom: 12, color: '#1890ff' }}>状态信息</h4>
            <p>
              <strong>产品码状态：</strong>
              <Tag color={detailRecord.productCodeStatus === '已生成' ? 'success' : 'warning'}>
                {detailRecord.productCodeStatus}
              </Tag>
            </p>
            <p><strong>创建人：</strong>{detailRecord.createBy}</p>
            <p><strong>创建时间：</strong>{detailRecord.createTime}</p>
          </div>
        </div>
      </Modal>
    );
  }

  // 渲染产品码预览弹窗
  renderPreviewModal() {
    const { Modal, Button } = window.antd;
    const { isPreviewModalVisible, previewRecord } = this.state;

    if (!previewRecord) return null;

    return (
      <Modal
        title="产品码预览"
        open={isPreviewModalVisible}
        onCancel={() => this.setState({ isPreviewModalVisible: false })}
        width={400}
        footer={[
          <Button key="close" onClick={() => this.setState({ isPreviewModalVisible: false })}>关闭</Button>,
          previewRecord.productCodeStatus === '已生成' && (
            <Button key="download" type="primary" onClick={() => {
              this.setState({ isPreviewModalVisible: false });
              this.handleDownloadCode(previewRecord);
            }}>下载产品码</Button>
          )
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 8, display: 'inline-block' }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <rect x="10" y="10" width="130" height="130" fill="white" stroke="#000" strokeWidth="2"/>
              <text x="75" y="50" textAnchor="middle" fontSize="14">溯源二维码</text>
              <text x="75" y="80" textAnchor="middle" fontSize="12">{previewRecord.batchNo}</text>
              <text x="75" y="105" textAnchor="middle" fontSize="10">{previewRecord.materialName}</text>
            </svg>
          </div>
          <p style={{ marginTop: 16, color: '#666' }}>
            溯源URL: https://guqi.example.com/trace/{previewRecord.batchNo}
          </p>
          {previewRecord.productCodeStatus === '未生成' && (
            <p style={{ color: '#ff4d4f' }}>该产品码尚未生成</p>
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
          {this.renderDetailModal()}
          {this.renderPreviewModal()}
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
