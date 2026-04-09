const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, Header, Footer,
        PageNumber, PageBreak } = require('docx');
const fs = require('fs');

const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
};

function createCell(text, width, options = {}) {
    const { bold = false, rowSpan = 1, columnSpan = 1, shading = null, align = AlignmentType.CENTER } = options;
    const cellConfig = {
        borders: tableBorders,
        width: { size: width, type: WidthType.DXA },
        children: [new Paragraph({
            alignment: align,
            children: [new TextRun({ text: text, bold: bold, font: "宋体", size: 21 })]
        })]
    };
    if (rowSpan > 1) cellConfig.rowSpan = rowSpan;
    if (columnSpan > 1) cellConfig.columnSpan = columnSpan;
    if (shading) cellConfig.shading = { fill: shading, type: "clear" };
    return new TableCell(cellConfig);
}

function createPara(text, options = {}) {
    const { bold = false, indent = true, spacing = { before: 100, after: 100 } } = options;
    return new Paragraph({
        spacing: spacing,
        indent: indent ? { firstLine: 420 } : undefined,
        children: [new TextRun({ text: text, font: "宋体", size: 24, bold: bold })]
    });
}

function createHeading(text, level) {
    const sizes = { 1: 36, 2: 30, 3: 24 };
    return new Paragraph({
        spacing: { before: 300, after: 150 },
        children: [new TextRun({
            text: text,
            bold: true,
            font: "宋体",
            size: sizes[level] || 24
        })]
    });
}

function createList(text, level = 1) {
    const indent = level * 420;
    return new Paragraph({
        spacing: { before: 60, after: 60 },
        indent: { left: indent },
        children: [new TextRun({ text: text, font: "宋体", size: 24 })]
    });
}

// 详细功能清单数据
const detailedFunctions = {
    "海关信息系统": {
        "智能卡口控制": [
            { name: "设备管理", func: "增/删/改/查", desc: "维护地磅、车牌识别设备、道闸、显示屏等设备信息，设备状态实时监控，设备故障自动报警，设备维护记录", p: "P0" },
            { name: "车辆识别", func: "查/识别", desc: "车牌自动识别、车辆信息比对、异常车辆预警，车牌识别准确率>99%，与预约信息比对，黑名单车辆自动拦截", p: "P0" },
            { name: "地磅称重", func: "查/称重", desc: "称重数据采集、超重预警、称重记录查询、数据防篡改，称重数据自动记录，超重自动预警，数据防篡改机制", p: "P0" },
            { name: "金关对接", func: "查/对接", desc: "与海关金关二期系统对接，申报数据比对、运输工具校验、风险预警、指令触发，海关金关二期接口对接", p: "P0" },
            { name: "安检对接", func: "查/对接", desc: "与机场、海关安检系统对接，安检申报、安检结果接收、安检状态同步，货物预报后自动向安检系统申报", p: "P0" }
        ],
        "查验预警处置": [
            { name: "查验筛选", func: "查/筛选", desc: "AI风险预警模型、查验对象智能筛选、查验优先级排序，基于历史数据和风险模型智能筛选", p: "P0" },
            { name: "指令下发", func: "增/删/改/查", desc: "查验指令生成、指令推送至PDA、查验项目提示，指令实时推送，查验项目自动提示，查验人员自动分配", p: "P0" },
            { name: "结果录入", func: "增/删/改/查", desc: "查验结果录入、拍照留痕、结果自动同步，PDA端结果录入，查验过程拍照，结果实时同步至海关系统", p: "P0" },
            { name: "异常处置", func: "增/删/改/查", desc: "异常登记、处置流程、处置审核、处置记录，异常自动识别，标准化处置流程，处置审核确认", p: "P0" }
        ],
        "货物预报管理": [
            { name: "预报录入", func: "增/改/查", desc: "录入货物基础信息、航空运输信息、收发货人信息，支持手工录入和Excel批量导入，货物信息完整性校验", p: "P0" },
            { name: "预报审核", func: "审核", desc: "对货物预报信息进行审核，审核通过后推送至海关系统", p: "P0" },
            { name: "预录入回执", func: "查/接收", desc: "接收海关系统预录入回执，回执解析与展示", p: "P0" }
        ],
        "跨境电商": [
            { name: "9610业务管理", func: "增/删/改/查", desc: "跨境电商B2C出口业务管理，订单申报、清单申报、汇总申报", p: "P0" },
            { name: "9710业务管理", func: "增/删/改/查", desc: "跨境电商B2B直接出口业务管理，订单申报、报关单申报", p: "P0" },
            { name: "9810业务管理", func: "增/删/改/查", desc: "跨境电商出口海外仓业务管理，海外仓备案、出口申报", p: "P0" },
            { name: "跨境电商海关对接", func: "查/对接", desc: "与海关跨境电商系统对接，数据报送、状态查询、回执接收", p: "P0" }
        ]
    },
    "航空货运信息管理系统": {
        "基础资料管理": [
            { name: "航班信息管理", func: "增/改/查/审核", desc: "航班信息录入、审核、状态变更管理", p: "P0" },
            { name: "客户信息管理", func: "增/改/查", desc: "客户信息录入、信用额度控制", p: "P0" },
            { name: "货物信息管理", func: "增/改/查", desc: "货物信息录入、货物类型维护", p: "P0" },
            { name: "仓库设置", func: "增/改/查", desc: "仓库信息维护、库位管理、容器管理", p: "P0" },
            { name: "资源管理", func: "增/改/查", desc: "人力资源档案管理、设备台账管理", p: "P2" },
            { name: "审批配置", func: "流程配置", desc: "审批流程配置", p: "P2" },
            { name: "单据配置", func: "增/删/改/查", desc: "单据编号规则配置、打印模板配置", p: "P2" }
        ],
        "订单与运单管理": [
            { name: "订单管理", func: "增/改/查/拆分", desc: "订单创建、订单拆分、订单变更、订单可视化", p: "P0" },
            { name: "运单管理", func: "增/改/查", desc: "运单录入、运单跟踪、运单变更", p: "P0" }
        ],
        "运输与调度": [
            { name: "运输调度", func: "增/删/改/查", desc: "调度计划、车辆配载、路线规划", p: "P0" },
            { name: "车辆调度", func: "增/删/改/查", desc: "预约申请、预约审核、智能排队、优先级计算、调度指令", p: "P0" },
            { name: "运输执行", func: "增/删/改/查", desc: "运输任务管理、交接单管理、签收管理、运单图片管理、回单管理", p: "P0" }
        ],
        "仓储作业管理": [
            { name: "货场作业", func: "导入/增/删/改/查", desc: "Excel导入、预约单管理、司机签到、作业指令推送", p: "P1" },
            { name: "月台管理", func: "查/分配/检测", desc: "月台自动分配、冲突检测、任务分配、进度跟踪、信息采集", p: "P0" },
            { name: "监管仓入库", func: "增/删/改/查", desc: "收货预约、到货登记、查验配合、上架作业、上架单、收货记录、取消收货", p: "P0" },
            { name: "监管仓出库", func: "增/删/改/查", desc: "出库申请、拣货作业、复核校验、货物交接、发货单、上机确认", p: "P0" },
            { name: "监管仓库内", func: "增/删/改/查", desc: "盘点管理、移位管理、差异管理、二维码查询、期初管理、库存日志", p: "P1" }
        ]
    }
};

// 数据库表结构设计
const dbTables = [
    {
        name: "t_flight_info",
        desc: "航班信息表",
        fields: [
            { name: "flight_id", type: "VARCHAR(32)", desc: "航班ID", key: "PK" },
            { name: "flight_no", type: "VARCHAR(20)", desc: "航班号", key: "IDX" },
            { name: "flight_date", type: "DATE", desc: "航班日期", key: "IDX" },
            { name: "departure", type: "VARCHAR(50)", desc: "起飞机场" },
            { name: "destination", type: "VARCHAR(50)", desc: "目的机场" },
            { name: "planned_departure", type: "DATETIME", desc: "计划起飞时间" },
            { name: "planned_arrival", type: "DATETIME", desc: "计划到达时间" },
            { name: "actual_departure", type: "DATETIME", desc: "实际起飞时间" },
            { name: "actual_arrival", type: "DATETIME", desc: "实际到达时间" },
            { name: "flight_status", type: "TINYINT", desc: "航班状态 0-计划中 1-起飞 2-到达 3-取消" },
            { name: "aircraft_type", type: "VARCHAR(20)", desc: "机型" },
            { name: "create_time", type: "DATETIME", desc: "创建时间" },
            { name: "update_time", type: "DATETIME", desc: "更新时间" }
        ]
    },
    {
        name: "t_customer_info",
        desc: "客户信息表",
        fields: [
            { name: "customer_id", type: "VARCHAR(32)", desc: "客户ID", key: "PK" },
            { name: "customer_code", type: "VARCHAR(20)", desc: "客户编码", key: "UK" },
            { name: "customer_name", type: "VARCHAR(100)", desc: "客户名称" },
            { name: "customer_type", type: "TINYINT", desc: "客户类型 1-发货人 2-收货人 3-货代" },
            { name: "credit_limit", type: "DECIMAL(18,2)", desc: "信用额度" },
            { name: "contact_name", type: "VARCHAR(50)", desc: "联系人" },
            { name: "contact_phone", type: "VARCHAR(20)", desc: "联系电话" },
            { name: "address", type: "VARCHAR(200)", desc: "地址" },
            { name: "status", type: "TINYINT", desc: "状态 0-禁用 1-启用" },
            { name: "create_time", type: "DATETIME", desc: "创建时间" }
        ]
    },
    {
        name: "t_order_info",
        desc: "订单信息表",
        fields: [
            { name: "order_id", type: "VARCHAR(32)", desc: "订单ID", key: "PK" },
            { name: "order_no", type: "VARCHAR(30)", desc: "订单编号", key: "UK" },
            { name: "customer_id", type: "VARCHAR(32)", desc: "客户ID", key: "FK,IDX" },
            { name: "order_type", type: "TINYINT", desc: "订单类型 1-出口 2-进口" },
            { name: "cargo_name", type: "VARCHAR(200)", desc: "货物名称" },
            { name: "cargo_weight", type: "DECIMAL(10,3)", desc: "货物重量(kg)" },
            { name: "cargo_volume", type: "DECIMAL(10,3)", desc: "货物体积(m³)" },
            { name: "cargo_quantity", type: "INT", desc: "货物件数" },
            { name: "sender_id", type: "VARCHAR(32)", desc: "发货人ID", key: "FK" },
            { name: "receiver_id", type: "VARCHAR(32)", desc: "收货人ID", key: "FK" },
            { name: "flight_id", type: "VARCHAR(32)", desc: "航班ID", key: "FK,IDX" },
            { name: "order_status", type: "TINYINT", desc: "订单状态", key: "IDX" },
            { name: "total_amount", type: "DECIMAL(18,2)", desc: "订单金额" },
            { name: "remark", type: "VARCHAR(500)", desc: "备注" },
            { name: "create_time", type: "DATETIME", desc: "创建时间" },
            { name: "create_by", type: "VARCHAR(32)", desc: "创建人" }
        ]
    },
    {
        name: "t_waybill_info",
        desc: "运单信息表",
        fields: [
            { name: "waybill_id", type: "VARCHAR(32)", desc: "运单ID", key: "PK" },
            { name: "waybill_no", type: "VARCHAR(30)", desc: "运单号", key: "UK" },
            { name: "order_id", type: "VARCHAR(32)", desc: "订单ID", key: "FK,IDX" },
            { name: "master_waybill_no", type: "VARCHAR(30)", desc: "主运单号" },
            { name: "waybill_type", type: "TINYINT", desc: "运单类型 1-主单 2-分单" },
            { name: "cargo_desc", type: "VARCHAR(500)", desc: "货物描述" },
            { name: "pieces", type: "INT", desc: "件数" },
            { name: "weight", type: "DECIMAL(10,3)", desc: "重量" },
            { name: "destination", type: "VARCHAR(50)", desc: "目的地" },
            { name: "waybill_status", type: "TINYINT", desc: "运单状态", key: "IDX" },
            { name: "create_time", type: "DATETIME", desc: "创建时间" }
        ]
    },
    {
        name: "t_gate_control_record",
        desc: "卡口控制记录表",
        fields: [
            { name: "record_id", type: "VARCHAR(32)", desc: "记录ID", key: "PK" },
            { name: "plate_no", type: "VARCHAR(20)", desc: "车牌号", key: "IDX" },
            { name: "entry_time", type: "DATETIME", desc: "入场时间", key: "IDX" },
            { name: "exit_time", type: "DATETIME", desc: "出场时间" },
            { name: "weight_in", type: "DECIMAL(10,3)", desc: "入场重量" },
            { name: "weight_out", type: "DECIMAL(10,3)", desc: "出场重量" },
            { name: "gate_status", type: "TINYINT", desc: "卡口状态" },
            { name: "customs_status", type: "TINYINT", desc: "海关状态" },
            { name: "security_status", type: "TINYINT", desc: "安检状态" },
            { name: "device_id", type: "VARCHAR(32)", desc: "设备ID" },
            { name: "create_time", type: "DATETIME", desc: "创建时间" }
        ]
    },
    {
        name: "t_inspection_task",
        desc: "查验任务表",
        fields: [
            { name: "task_id", type: "VARCHAR(32)", desc: "任务ID", key: "PK" },
            { name: "task_no", type: "VARCHAR(30)", desc: "任务编号", key: "UK" },
            { name: "order_id", type: "VARCHAR(32)", desc: "订单ID", key: "FK" },
            { name: "waybill_no", type: "VARCHAR(30)", desc: "运单号" },
            { name: "risk_level", type: "TINYINT", desc: "风险等级 1-低 2-中 3-高" },
            { name: "inspector_id", type: "VARCHAR(32)", desc: "查验人员ID" },
            { name: "task_status", type: "TINYINT", desc: "任务状态", key: "IDX" },
            { name: "inspection_result", type: "TINYINT", desc: "查验结果" },
            { name: "exception_flag", type: "TINYINT", desc: "异常标记" },
            { name: "create_time", type: "DATETIME", desc: "创建时间" },
            { name: "complete_time", type: "DATETIME", desc: "完成时间" }
        ]
    },
    {
        name: "t_warehouse_inventory",
        desc: "仓库库存表",
        fields: [
            { name: "inventory_id", type: "VARCHAR(32)", desc: "库存ID", key: "PK" },
            { name: "warehouse_id", type: "VARCHAR(32)", desc: "仓库ID", key: "FK,IDX" },
            { name: "location_id", type: "VARCHAR(32)", desc: "库位ID", key: "FK" },
            { name: "waybill_no", type: "VARCHAR(30)", desc: "运单号", key: "IDX" },
            { name: "cargo_name", type: "VARCHAR(200)", desc: "货物名称" },
            { name: "quantity", type: "INT", desc: "数量" },
            { name: "weight", type: "DECIMAL(10,3)", desc: "重量" },
            { name: "volume", type: "DECIMAL(10,3)", desc: "体积" },
            { name: "inbound_time", type: "DATETIME", desc: "入库时间" },
            { name: "inventory_status", type: "TINYINT", desc: "库存状态", key: "IDX" },
            { name: "update_time", type: "DATETIME", desc: "更新时间" }
        ]
    }
];

// 接口详细设计
const interfaceDetails = [
    {
        name: "海关金关二期系统接口",
        direction: "双向",
        protocol: "HTTPS + JSON",
        auth: "海关数字证书 + 签名验证",
        functions: [
            "货物预报信息报送",
            "运抵信息报送",
            "查验结果报送",
            "放行指令接收",
            "风险预警接收"
        ],
        requestExample: `{
  "messageHeader": {
    "messageId": "MSG202404080001",
    "messageType": "DECLARE",
    "sendTime": "2024-04-08T10:30:00+08:00",
    "sender": "AIRPORT_PLAT",
    "receiver": "CUSTOMS_GJ2"
  },
  "messageBody": {
    "declareNo": "DEC202404080001",
    "waybillNo": "999-12345675",
    "cargoName": "电子产品",
    "cargoWeight": 150.5,
    "cargoQuantity": 10,
    "senderInfo": {...},
    "receiverInfo": {...}
  }
}`,
        responseExample: `{
  "code": "0000",
  "message": "接收成功",
  "data": {
    "declareNo": "DEC202404080001",
    "customsNo": "C2024040800001",
    "status": "ACCEPTED"
  }
}`
    },
    {
        name: "机场安检系统接口",
        direction: "双向",
        protocol: "WebService + XML",
        auth: "IP白名单 + Token",
        functions: [
            "货物安检申报",
            "安检结果接收",
            "安检图像获取",
            "安检状态同步"
        ]
    },
    {
        name: "场站系统接口",
        direction: "接收",
        protocol: "REST API + JSON",
        auth: "OAuth 2.0",
        functions: [
            "航班动态信息接收",
            "货物装机信息接收",
            "货物离港信息接收",
            "航班状态变更通知"
        ]
    },
    {
        name: "智能称重设备接口",
        direction: "接收",
        protocol: "TCP/Modbus",
        functions: [
            "称重数据实时采集",
            "设备状态监控",
            "超重预警触发"
        ]
    },
    {
        name: "车牌识别设备接口",
        direction: "接收",
        protocol: "SDK/API",
        functions: [
            "车牌识别结果接收",
            "车辆图像获取",
            "识别准确率统计"
        ]
    },
    {
        name: "分拣线PLC接口",
        direction: "双向",
        protocol: "OPC UA",
        functions: [
            "分拣指令下发",
            "设备状态读取",
            "故障报警接收",
            "产量数据上报"
        ]
    }
];

// 构建完整文档
const children = [];

// 封面
children.push(new Paragraph({ spacing: { before: 800 }, children: [] }));
children.push(new Paragraph({ spacing: { before: 400 }, children: [] }));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 600, after: 200 },
    children: [new TextRun({ text: "民用机场工程", font: "宋体", size: 56, bold: true })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 600 },
    children: [new TextRun({ text: "信息弱电工程施工", font: "宋体", size: 56, bold: true })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: "国际物流航空货站运行平台", font: "宋体", size: 48, bold: true })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 200 },
    children: [new TextRun({ text: "及海关信息平台", font: "宋体", size: 48, bold: true })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 800 },
    children: [new TextRun({ text: "深化设计技术方案说明书", font: "宋体", size: 48, bold: true })]
}));
children.push(new Paragraph({ spacing: { before: 1000 }, children: [] }));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: "编制单位：XXX科技有限公司", font: "宋体", size: 30 })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 150, after: 100 },
    children: [new TextRun({ text: "编 制 人：XXX", font: "宋体", size: 30 })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 150, after: 100 },
    children: [new TextRun({ text: "审 核 人：XXX", font: "宋体", size: 30 })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 150, after: 100 },
    children: [new TextRun({ text: "审 批 人：XXX", font: "宋体", size: 30 })]
}));
children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 150, after: 200 },
    children: [new TextRun({ text: "编制日期：2026年04月08日", font: "宋体", size: 30 })]
}));

// 文件变更记录
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(createHeading("文件变更记录", 1));
children.push(new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [1200, 1500, 1500, 1500, 3300],
    rows: [
        new TableRow({
            children: [
                createCell("版本号", 1200, { bold: true, shading: "D9D9D9" }),
                createCell("日期", 1500, { bold: true, shading: "D9D9D9" }),
                createCell("修改人", 1500, { bold: true, shading: "D9D9D9" }),
                createCell("审阅人", 1500, { bold: true, shading: "D9D9D9" }),
                createCell("摘要", 3300, { bold: true, shading: "D9D9D9" })
            ]
        }),
        new TableRow({
            children: [
                createCell("V1.0", 1200),
                createCell("2026-04-08", 1500),
                createCell("XXX", 1500),
                createCell("XXX", 1500),
                createCell("初始版本创建", 3300)
            ]
        })
    ]
}));

// 目录
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(createHeading("目 录", 1));
const tocItems = [
    "1 引言", "1.1 编写目的", "1.2 范围", "1.3 编制依据", "1.4 术语定义",
    "2 概述", "2.1 系统目标", "2.2 开发环境", "2.3 运行环境", "2.4 条件与限制",
    "3 总体设计", "3.1 技术架构设计", "3.2 逻辑架构设计", "3.3 功能架构设计",
    "3.4 网络架构设计", "3.5 功能及流程设计",
    "4 数据结构设计", "4.1 逻辑结构设计", "4.2 物理结构设计", "4.3 数据库表结构",
    "5 中间件设计", "5.1 消息队列", "5.2 缓存", "5.3 搜索引擎", "5.4 对象存储",
    "6 人机界面设计", "6.1 界面风格", "6.2 布局设计", "6.3 交互设计", "6.4 移动端适配",
    "7 系统安全设计", "7.1 身份认证", "7.2 访问控制", "7.3 数据加密", "7.4 安全审计", "7.5 漏洞防护",
    "8 业务连续性设计", "8.1 高可用设计", "8.2 容灾备份", "8.3 故障恢复",
    "9 系统接口设计", "9.1 接口总表", "9.2 海关金关二期接口", "9.3 安检系统接口",
    "9.4 场站系统接口", "9.5 设备接口",
    "10 工程界面设计",
    "11 软硬件资源需求分析",
    "12 集成测试设计",
    "13 演练方案设计",
    "14 试运行方案设计"
];
tocItems.forEach(item => {
    children.push(createPara(item, { indent: false }));
});

console.log("开始生成文档内容...");
console.log("封面、文件变更记录、目录已生成");

// 将后续内容写入临时文件分批处理
fs.writeFileSync('/tmp/doc_part1.json', JSON.stringify({
    detailedFunctions, dbTables, interfaceDetails
}));

console.log("数据结构已保存，准备生成主体内容...");
console.log("海关信息系统功能点: " + Object.keys(detailedFunctions["海关信息系统"]).reduce((sum, k) => sum + detailedFunctions["海关信息系统"][k].length, 0) + "个");
console.log("数据库表: " + dbTables.length + "张");
console.log("外部接口: " + interfaceDetails.length + "个");
