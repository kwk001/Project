const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, Header, Footer,
        PageNumber, PageBreak, convertInchesToTwip } = require('docx');
const fs = require('fs');

// 定义表格边框样式
const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
};

// 创建表格单元格辅助函数
function createCell(text, width, options = {}) {
    const { bold = false, rowSpan = 1, columnSpan = 1, shading = null } = options;
    const cellConfig = {
        borders: tableBorders,
        width: { size: width, type: WidthType.DXA },
        children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: text, bold: bold, font: "宋体", size: 21 })]
        })]
    };
    if (rowSpan > 1) cellConfig.rowSpan = rowSpan;
    if (columnSpan > 1) cellConfig.columnSpan = columnSpan;
    if (shading) cellConfig.shading = { fill: shading, type: "clear" };
    return new TableCell(cellConfig);
}

// 创建正文段落
function createPara(text, options = {}) {
    const { bold = false, heading = null, spacing = { before: 100, after: 100 } } = options;
    return new Paragraph({
        heading: heading,
        spacing: spacing,
        indent: heading ? undefined : { firstLine: 420 },
        children: [new TextRun({ text: text, font: "宋体", size: 24, bold: bold })]
    });
}

// 创建标题
function createHeading(text, level) {
    const sizes = { 1: 36, 2: 30, 3: 24 };
    return new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [new TextRun({
            text: text,
            bold: true,
            font: "宋体",
            size: sizes[level] || 24
        })]
    });
}

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "宋体", size: 24 }
            }
        }
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 }
            }
        },
        headers: {
            default: new Header({
                children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "国际物流航空货站运行平台及海关信息平台 - 深化设计技术方案说明书", font: "宋体", size: 18 })]
                })]
            })
        },
        footers: {
            default: new Footer({
                children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "第 ", font: "宋体", size: 20 }),
                        new TextRun({ children: [PageNumber.CURRENT], font: "宋体", size: 20 }),
                        new TextRun({ text: " 页", font: "宋体", size: 20 })
                    ]
                })]
            })
        },
        children: [
            // ========== 封面 ==========
            new Paragraph({ spacing: { before: 800 }, children: [] }),
            new Paragraph({ spacing: { before: 400 }, children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 600, after: 200 },
                children: [new TextRun({ text: "民用机场工程", font: "宋体", size: 52, bold: true })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 600 },
                children: [new TextRun({ text: "信息弱电工程施工", font: "宋体", size: 52, bold: true })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 400, after: 200 },
                children: [new TextRun({ text: "国际物流航空货站运行平台及海关信息平台", font: "宋体", size: 44, bold: true })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 800 },
                children: [new TextRun({ text: "深化设计技术方案说明书", font: "宋体", size: 44, bold: true })]
            }),
            new Paragraph({ spacing: { before: 1200 }, children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 100 },
                children: [new TextRun({ text: "编制单位：XXX科技有限公司", font: "宋体", size: 28 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
                children: [new TextRun({ text: "编 制 人：XXX", font: "宋体", size: 28 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
                children: [new TextRun({ text: "审 核 人：XXX", font: "宋体", size: 28 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
                children: [new TextRun({ text: "审 批 人：XXX", font: "宋体", size: 28 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 200 },
                children: [new TextRun({ text: "编制日期：2026年04月08日", font: "宋体", size: 28 })]
            }),

            // ========== 分页 ==========
            new Paragraph({ children: [new PageBreak()] }),

            // ========== 文件变更记录 ==========
            createHeading("文件变更记录", 1),
            new Table({
                width: { size: 9000, type: WidthType.DXA },
                columnWidths: [1500, 1500, 1500, 1500, 3000],
                rows: [
                    new TableRow({
                        children: [
                            createCell("版本号", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("日期", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("修改人", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("审阅人", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("摘要", 3000, { bold: true, shading: "D9D9D9" })
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("V1.0", 1500),
                            createCell("2026-04-08", 1500),
                            createCell("XXX", 1500),
                            createCell("XXX", 1500),
                            createCell("初始版本", 3000)
                        ]
                    })
                ]
            }),

            // ========== 分页 ==========
            new Paragraph({ children: [new PageBreak()] }),

            // ========== 目录 ==========
            createHeading("目 录", 1),
            createPara("1 引言", { bold: true }),
            createPara("   1.1 编写目的"),
            createPara("   1.2 范围"),
            createPara("   1.3 编制依据"),
            createPara("   1.4 术语定义"),
            createPara("2 概述", { bold: true }),
            createPara("   2.1 系统目标"),
            createPara("   2.2 开发环境"),
            createPara("   2.3 运行环境"),
            createPara("   2.4 条件与限制"),
            createPara("3 总体设计", { bold: true }),
            createPara("   3.1 技术架构设计"),
            createPara("   3.2 逻辑架构设计"),
            createPara("   3.3 功能架构设计"),
            createPara("   3.4 网络架构设计"),
            createPara("   3.5 功能及流程设计"),
            createPara("4 数据结构设计", { bold: true }),
            createPara("5 中间件设计", { bold: true }),
            createPara("6 人机界面设计", { bold: true }),
            createPara("7 系统安全设计", { bold: true }),
            createPara("8 业务连续性设计", { bold: true }),
            createPara("9 系统接口设计", { bold: true }),
            createPara("10 工程界面设计", { bold: true }),
            createPara("11 软硬件资源需求分析", { bold: true }),
            createPara("12 集成测试设计", { bold: true }),
            createPara("13 演练方案设计", { bold: true }),
            createPara("14 试运行方案设计", { bold: true }),

            // ========== 分页 ==========
            new Paragraph({ children: [new PageBreak()] }),

            // ========== 1 引言 ==========
            createHeading("1 引言", 1),

            createHeading("1.1 编写目的", 2),
            createPara("依据《国际物流航空货站运行平台及海关信息平台招标文件》、《用户需求调研分析报告》进行本系统深化设计，本设计方案将对本系统的各个功能模块及功能点进行详细设计，涵盖航空货运信息管理、海关信息系统、园区运行中心、航空物流公共信息平台四大核心子系统，是系统建设及项目实施的指导与依据。"),

            createHeading("1.2 范围", 2),
            createPara("系统名称：国际物流航空货站运行平台及海关信息平台"),
            createPara("开发人员：XXX科技有限公司开发团队"),
            createPara("功能范围：本系统包含航空货运信息管理系统（104个功能点）、海关信息系统（23个功能点）、园区运行中心（22个功能点）、航空物流公共信息平台（22个功能点），共计171个功能点。"),

            createHeading("1.3 编制依据", 2),
            createPara("1. 《国际物流航空货站运行平台及海关信息平台招标文件》"),
            createPara("2. 《用户需求调研分析报告》"),
            createPara("3. 《海关金关二期智能卡口系统接口规范》"),
            createPara("4. 《民用机场工程信息弱电系统设计规范》"),
            createPara("5. 《信息安全技术网络安全等级保护基本要求》（GB/T 22239-2019）"),
            createPara("6. 《软件工程软件开发成本度量规范》（GB/T 36964-2018）"),

            createHeading("1.4 术语定义", 2),
            new Table({
                width: { size: 9000, type: WidthType.DXA },
                columnWidths: [2500, 4500, 2000],
                rows: [
                    new TableRow({
                        children: [
                            createCell("名词", 2500, { bold: true, shading: "D9D9D9" }),
                            createCell("含义", 4500, { bold: true, shading: "D9D9D9" }),
                            createCell("备注", 2000, { bold: true, shading: "D9D9D9" })
                        ]
                    }),
                    new TableRow({
                        children: [createCell("9610", 2500), createCell("跨境电商B2C出口监管方式", 4500), createCell("海关监管代码", 2000)]
                    }),
                    new TableRow({
                        children: [createCell("9710", 2500), createCell("跨境电商B2B直接出口监管方式", 4500), createCell("海关监管代码", 2000)]
                    }),
                    new TableRow({
                        children: [createCell("9810", 2500), createCell("跨境电商出口海外仓监管方式", 4500), createCell("海关监管代码", 2000)]
                    }),
                    new TableRow({
                        children: [createCell("IoT", 2500), createCell("物联网（Internet of Things）", 4500), createCell("技术术语", 2000)]
                    }),
                    new TableRow({
                        children: [createCell("PDA", 2500), createCell("手持终端设备", 4500), createCell("硬件设备", 2000)]
                    }),
                    new TableRow({
                        children: [createCell("PLC", 2500), createCell("可编程逻辑控制器", 4500), createCell("控制设备", 2000)]
                    }),
                    new TableRow({
                        children: [createCell("WMS", 2500), createCell("仓库管理系统", 4500), createCell("系统名称", 2000)]
                    }),
                    new TableRow({
                        children: [createCell("TMS", 2500), createCell("运输管理系统", 4500), createCell("系统名称", 2000)]
                    })
                ]
            }),

            // ========== 分页 ==========
            new Paragraph({ children: [new PageBreak()] }),

            // ========== 2 概述 ==========
            createHeading("2 概述", 1),

            createHeading("2.1 系统目标", 2),
            createPara("国际物流航空货站运行平台及海关信息平台旨在构建一个集航空货运业务管理、海关监管、园区运营管理、公共信息服务于一体的综合性智慧物流平台。系统建设目标包括："),
            createPara("1. 实现航空货运业务全流程数字化管理，涵盖订单、运单、运输、仓储等核心环节；"),
            createPara("2. 建立与海关金关二期系统的深度对接，实现智能卡口控制、货物预报、查验预警等海关业务功能；"),
            createPara("3. 构建园区态势感知体系，实现交通、消防、安防、能耗等多维度实时监控；"),
            createPara("4. 提供移动端服务能力，支持司机APP、作业PDA、管理小程序等多终端接入；"),
            createPara("5. 建立数据治理平台，实现数据标准化、共享交换与智能分析。"),

            createHeading("2.2 开发环境", 2),
            new Table({
                width: { size: 9000, type: WidthType.DXA },
                columnWidths: [2500, 2000, 4500],
                rows: [
                    new TableRow({
                        children: [
                            createCell("工具名称", 2500, { bold: true, shading: "D9D9D9" }),
                            createCell("使用版本", 2000, { bold: true, shading: "D9D9D9" }),
                            createCell("简要说明", 4500, { bold: true, shading: "D9D9D9" })
                        ]
                    }),
                    new TableRow({
                        children: [createCell("JDK", 2500), createCell("1.8+", 2000), createCell("Java开发工具包", 4500)]
                    }),
                    new TableRow({
                        children: [createCell("Spring Boot", 2500), createCell("2.7.x", 2000), createCell("微服务开发框架", 4500)]
                    }),
                    new TableRow({
                        children: [createCell("MySQL", 2500), createCell("8.0", 2000), createCell("关系型数据库", 4500)]
                    }),
                    new TableRow({
                        children: [createCell("Redis", 2500), createCell("6.x", 2000), createCell("分布式缓存", 4500)]
                    }),
                    new TableRow({
                        children: [createCell("RabbitMQ", 2500), createCell("3.x", 2000), createCell("消息中间件", 4500)]
                    }),
                    new TableRow({
                        children: [createCell("Elasticsearch", 2500), createCell("7.x", 2000), createCell("搜索引擎", 4500)]
                    }),
                    new TableRow({
                        children: [createCell("Vue.js", 2500), createCell("3.x", 2000), createCell("前端框架", 4500)]
                    }),
                    new TableRow({
                        children: [createCell("Node.js", 2500), createCell("16+", 2000), createCell("前端运行环境", 4500)]
                    })
                ]
            }),

            createHeading("2.3 运行环境", 2),
            createPara("数据库环境：MySQL 8.0 主从部署，支持读写分离；MongoDB用于非结构化数据存储"),
            createPara("消息中间件：RabbitMQ集群，支持消息持久化与高可用"),
            createPara("Java虚拟机：OpenJDK 1.8+，堆内存配置4GB-8GB"),
            createPara("服务注册中心：Nacos 2.x，支持服务发现与配置管理"),
            createPara("数据缓存组件：Redis 6.x 集群模式，支持分布式锁与缓存"),
            createPara("开发框架：Spring Boot 2.7.x + Spring Cloud Alibaba"),
            createPara("开发技术：Java、JavaScript、Vue.js、Python（AI算法）"),

            createHeading("2.4 条件与限制", 2),
            createPara("技术约束：系统需支持与海关金关二期系统、机场安检系统、场站系统等外部系统的接口对接，接口协议需符合相关标准规范。"),
            createPara("业务约束：海关业务功能需严格遵循海关监管要求，数据报文格式需符合海关接口规范。"),
            createPara("资源约束：系统部署在云平台，需考虑资源成本与扩展性平衡。"),
            createPara("安全约束：系统需通过等保三级认证，数据传输需加密，敏感操作需审计。"),

            // ========== 分页 ==========
            new Paragraph({ children: [new PageBreak()] }),

            // ========== 3 总体设计 ==========
            createHeading("3 总体设计", 1),

            createHeading("3.1 技术架构设计", 2),
            createPara("系统采用微服务架构，基于Spring Cloud Alibaba技术栈构建，整体技术架构分为五层："),
            createPara("1. 接入层：提供多渠道接入能力，包括Web端、移动端（司机APP、PDA、小程序）、第三方系统接口网关。"),
            createPara("2. 网关层：基于Spring Cloud Gateway实现统一接入、负载均衡、限流熔断、安全认证。"),
            createPara("3. 服务层：核心业务服务，包括航空货运管理、海关信息、园区运行、公共平台四大领域服务。"),
            createPara("4. 数据层：关系型数据库（MySQL）、缓存（Redis）、搜索引擎（ES）、对象存储（MinIO）。"),
            createPara("5. 基础设施层：容器化部署（Docker + K8s）、服务注册（Nacos）、配置中心、监控告警。"),

            createHeading("3.2 逻辑架构设计", 2),
            createPara("逻辑架构按照领域驱动设计（DDD）原则，划分为以下核心领域："),
            createPara("1. 航空货运领域：负责订单、运单、运输调度、仓储管理、计费结算等核心业务。"),
            createPara("2. 海关监管领域：负责智能卡口、货物预报、查验预警、跨境电商等海关业务。"),
            createPara("3. 园区运营领域：负责态势感知、停车管理、安防监控、设备管理等园区业务。"),
            createPara("4. 公共服务领域：负责用户认证、消息通知、数据查询、客服支撑等公共服务。"),

            createHeading("3.3 功能架构设计", 2),
            createPara("系统功能架构包含四大子系统，共计171个功能点："),
            createPara("【航空货运信息管理系统】104个功能点，包含："),
            createPara("  - 基础资料管理（航班、客户、货物、仓库、资源管理）"),
            createPara("  - 订单与运单管理（订单创建、拆分、变更、跟踪）"),
            createPara("  - 运输与调度管理（调度计划、车辆配载、智能排队）"),
            createPara("  - 仓储作业管理（预约、收货、上架、盘点、出库）"),
            createPara("  - 计费与合同管理（费率、账单、报价、合同）"),
            createPara("  - 货包机跟踪（空运、陆运、铁路全程跟踪）"),
            createPara("  - 分拣线控制（PLC对接、流程调度、资源调度）"),
            createPara("【海关信息系统】23个功能点，包含："),
            createPara("  - 智能卡口控制（设备、识别、称重、金关对接、安检对接）"),
            createPara("  - 查验预警处置（AI筛选、指令下发、结果录入、异常处置）"),
            createPara("  - 货物预报管理（预报录入、审核、回执接收）"),
            createPara("  - 跨境电商（9610/9710/9810业务管理）"),
            createPara("  - 可视化展示（业务大屏、监管大屏、卡口大屏）"),
            createPara("【园区运行中心】22个功能点，包含："),
            createPara("  - 态势监控（园区、交通、消防、货物、车辆、仓储、能耗等）"),
            createPara("  - 园区管理（车辆通行、车位管理、巡更巡检）"),
            createPara("  - 数字平台（物联网、数据治理、视频转码、统一认证）"),
            createPara("【航空物流公共信息平台】22个功能点，包含："),
            createPara("  - 多端接入（司机APP、作业PDA、查验PDA、管理/客户小程序）"),
            createPara("  - 公共信息服务（航班查询、货物跟踪、资讯发布）"),
            createPara("  - 客服业务（在线客服、投诉建议、工单管理）"),

            createHeading("3.4 网络架构设计", 2),
            createPara("网络架构采用分层设计，分为："),
            createPara("1. 互联网接入区：面向公众用户的移动端接入，通过WAF、DDoS防护保障安全。"),
            createPara("2. 边界隔离区：部署防火墙、网闸，实现内外网隔离与数据安全交换。"),
            createPara("3. 应用服务区：部署业务应用服务、中间件、缓存集群。"),
            createPara("4. 数据存储区：部署数据库、对象存储、备份系统。"),
            createPara("5. 运维管理区：部署监控、日志、堡垒机等运维系统。"),
            createPara("6. 海关专网区：与海关金关二期系统对接的专用网络区域。"),

            createHeading("3.5 功能及流程设计", 2),
            createPara("【核心业务流程】"),
            createPara("1. 货物入站流程：车辆预约 → 卡口识别 → 地磅称重 → 安检申报 → 入库上架 → 库存管理"),
            createPara("2. 货物出站流程：出库申请 → 拣货复核 → 货物交接 → 上机确认 → 运单跟踪"),
            createPara("3. 海关查验流程：AI风险筛选 → 查验指令下发 → PDA结果录入 → 异常处置 → 结果同步"),
            createPara("4. 跨境电商流程：订单申报 → 海关审核 → 货物放行 → 离境申报 → 结关反馈"),

            // ========== 分页 ==========
            new Paragraph({ children: [new PageBreak()] }),

            // ========== 4-14 其他章节（简化展示） ==========
            createHeading("4 数据结构设计", 1),
            createHeading("4.1 逻辑结构设计", 2),
            createPara("逻辑结构设计采用ER模型，主要实体包括："),
            createPara("1. 基础数据实体：航班信息、客户信息、货物信息、仓库库位、设备资源"),
            createPara("2. 业务数据实体：订单、运单、运输任务、仓储作业单、计费账单"),
            createPara("3. 海关数据实体：卡口记录、预报数据、查验记录、异常处置记录"),
            createPara("4. 系统数据实体：用户、角色、权限、日志、配置参数"),

            createHeading("4.2 物理结构设计", 2),
            createPara("物理数据库设计遵循以下原则："),
            createPara("1. 分库分表：按业务域垂直分库，大表按时间或ID水平分表"),
            createPara("2. 索引优化：主键、外键、查询条件字段建立索引"),
            createPara("3. 数据分区：历史数据按时间分区，便于归档清理"),
            createPara("4. 读写分离：查询走从库，写入走主库"),

            createHeading("5 中间件设计", 1),
            createPara("中间件逻辑架构："),
            createPara("1. 消息队列（RabbitMQ）：用于异步处理、系统解耦、流量削峰。选用理由：支持消息持久化、高可靠、易扩展。"),
            createPara("2. 缓存（Redis）：用于热点数据缓存、分布式锁、会话管理。选用理由：高性能、支持集群、数据类型丰富。"),
            createPara("3. 搜索引擎（Elasticsearch）：用于全文检索、日志分析、数据聚合。选用理由：分布式、近实时、查询性能高。"),
            createPara("4. 对象存储（MinIO）：用于文件、图片、视频存储。选用理由：兼容S3接口、高性能、易于集成。"),

            createHeading("6 人机界面设计", 1),
            createPara("人机界面设计遵循以下原则："),
            createPara("1. 界面风格：采用现代化扁平化设计，主色调为科技蓝（#1890FF），简洁专业。"),
            createPara("2. 布局设计：采用响应式布局，支持1920x1080及以上分辨率，左侧导航+右侧内容区。"),
            createPara("3. 交互设计：统一的操作反馈，表单校验即时提示，关键操作二次确认。"),
            createPara("4. 移动端适配：PDA界面简洁高效，司机APP操作便捷，小程序轻量化。"),

            createHeading("7 系统安全设计", 1),
            createPara("系统安全设计从以下维度展开："),
            createPara("1. 身份认证：支持用户名/密码、短信验证码、数字证书多种认证方式；采用JWT Token机制。"),
            createPara("2. 访问控制：基于RBAC模型，支持角色、权限、数据范围三级授权。"),
            createPara("3. 数据加密：敏感数据（密码、证件号）加密存储；传输采用HTTPS/TLS。"),
            createPara("4. 安全审计：记录登录、操作、数据变更日志，支持追溯查询。"),
            createPara("5. 漏洞防护：防SQL注入、XSS攻击、CSRF攻击；文件上传类型白名单。"),

            createHeading("8 业务连续性设计", 1),
            createPara("业务连续性保障措施："),
            createPara("1. 高可用设计：应用多节点部署，数据库主从复制，中间件集群模式。"),
            createPara("2. 容灾备份：数据库每日全量备份+增量备份，对象存储多副本，跨可用区部署。"),
            createPara("3. 故障恢复：RTO<30分钟，RPO<15分钟；自动故障转移，手动切换预案。"),
            createPara("4. 应急预案：制定系统故障、网络中断、数据丢失等场景的应急处理流程。"),

            // ========== 分页 ==========
            new Paragraph({ children: [new PageBreak()] }),

            createHeading("9 系统接口设计", 1),

            createHeading("9.1 系统接口总表", 2),
            new Table({
                width: { size: 9000, type: WidthType.DXA },
                columnWidths: [800, 2000, 2000, 1500, 1200, 1500],
                rows: [
                    new TableRow({
                        children: [
                            createCell("序号", 800, { bold: true, shading: "D9D9D9" }),
                            createCell("生产系统", 2000, { bold: true, shading: "D9D9D9" }),
                            createCell("消费系统", 2000, { bold: true, shading: "D9D9D9" }),
                            createCell("接口方向", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("协议类型", 1200, { bold: true, shading: "D9D9D9" }),
                            createCell("备注", 1500, { bold: true, shading: "D9D9D9" })
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("1", 800), createCell("海关金关二期", 2000),
                            createCell("本平台", 2000), createCell("接收", 1500),
                            createCell("HTTPS", 1200), createCell("卡口数据", 1500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("2", 800), createCell("机场安检系统", 2000),
                            createCell("本平台", 2000), createCell("双向", 1500),
                            createCell("WebService", 1200), createCell("安检数据", 1500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("3", 800), createCell("场站系统", 2000),
                            createCell("本平台", 2000), createCell("接收", 1500),
                            createCell("REST API", 1200), createCell("航班数据", 1500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("4", 800), createCell("称重设备", 2000),
                            createCell("本平台", 2000), createCell("接收", 1500),
                            createCell("TCP/Modbus", 1200), createCell("称重数据", 1500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("5", 800), createCell("车牌识别", 2000),
                            createCell("本平台", 2000), createCell("接收", 1500),
                            createCell("SDK/API", 1200), createCell("识别结果", 1500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("6", 800), createCell("分拣线PLC", 2000),
                            createCell("本平台", 2000), createCell("双向", 1500),
                            createCell("OPC UA", 1200), createCell("控制指令", 1500)
                        ]
                    })
                ]
            }),
            createPara("说明：本表是根据招标文件和用户需求调研成果文件梳理的本系统现阶段的接口汇总，后期根据项目进展和对接情况进行调整和优化，详细接口内容详见各业务系统签订的接口协议。"),

            createHeading("9.2 本系统对外提供数据的接口设计", 2),
            createPara("【与海关金关二期系统提供数据接口】"),
            createPara("接口设计：RESTful API + HTTPS"),
            createPara("接口说明：向海关系统报送货物预报信息、运抵信息、查验结果、放行指令执行结果"),
            createPara("数据流图：本平台 → 数据加密 → HTTPS传输 → 海关金关二期系统"),
            createPara("接口协议：符合《海关金关二期智能卡口系统接口规范》"),
            createPara("数据报文格式：JSON格式，包含报文头（报文ID、时间戳、签名）和报文体（业务数据）"),

            createHeading("9.3 本系统对外部接收数据接口设计", 2),
            createPara("【与场站系统接收数据接口】"),
            createPara("接口设计：REST API + Token认证"),
            createPara("接口说明：接收航班动态信息、货物装机信息、货物离港信息"),
            createPara("数据流图：场站系统 → API调用 → 本平台 → 数据处理 → 业务系统"),
            createPara("接口协议：自定义REST API规范，基于OAuth 2.0认证"),
            createPara("数据报文格式：JSON格式，包含航班号、航班日期、货物清单、状态信息"),

            createHeading("10 工程界面设计", 1),
            createPara("【与海关金关二期系统的工程界面】"),
            createPara("物理边界：海关专网与本平台应用服务器之间通过网闸隔离"),
            createPara("责任划分：本平台负责数据报送与接收处理，海关系统负责监管指令下发"),
            createPara("接口位置：部署在海关专网边界的数据交换区"),

            createHeading("11 软硬件资源需求分析", 1),

            createHeading("11.1 云资源需求", 2),
            new Table({
                width: { size: 9000, type: WidthType.DXA },
                columnWidths: [2000, 1500, 1500, 1500, 2500],
                rows: [
                    new TableRow({
                        children: [
                            createCell("资源类型", 2000, { bold: true, shading: "D9D9D9" }),
                            createCell("配置", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("数量", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("用途", 1500, { bold: true, shading: "D9D9D9" }),
                            createCell("备注", 2500, { bold: true, shading: "D9D9D9" })
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("应用服务器", 2000), createCell("8C16G", 1500),
                            createCell("4台", 1500), createCell("业务应用", 1500),
                            createCell("负载均衡部署", 2500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("数据库服务器", 2000), createCell("16C32G", 1500),
                            createCell("2台", 1500), createCell("MySQL主从", 1500),
                            createCell("SSD存储500G", 2500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("缓存服务器", 2000), createCell("4C8G", 1500),
                            createCell("3台", 1500), createCell("Redis集群", 1500),
                            createCell("主从+哨兵", 2500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("对象存储", 2000), createCell("标准存储", 1500),
                            createCell("1个", 1500), createCell("文件存储", 1500),
                            createCell("容量1TB起步", 2500)
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("消息队列", 2000), createCell("4C8G", 1500),
                            createCell("2台", 1500), createCell("RabbitMQ", 1500),
                            createCell("镜像队列", 2500)
                        ]
                    })
                ]
            }),

            createHeading("11.2 网络需求", 2),
            createPara("1. 互联网带宽：100Mbps，用于公众用户访问"),
            createPara("2. 专线带宽：50Mbps，用于与海关系统对接"),
            createPara("3. 内网带宽：1Gbps，用于系统内部通信"),
            createPara("4. 公网IP：4个，用于负载均衡和网关"),

            createHeading("12 集成测试设计", 1),
            createPara("集成测试策略："),
            createPara("1. 测试范围：四大子系统间的接口集成、与外部系统的对接集成"),
            createPara("2. 测试方法：自下而上集成，先单元测试，后接口测试，再端到端测试"),
            createPara("3. 测试用例：覆盖正常流程、异常流程、边界条件、并发场景"),
            createPara("4. 通过标准：功能覆盖率100%，严重缺陷0个，一般缺陷<5个"),

            createHeading("13 演练方案设计", 1),
            createPara("演练场景："),
            createPara("1. 系统压力演练：模拟双十一高峰期业务量，验证系统承载能力"),
            createPara("2. 故障切换演练：模拟主数据库故障，验证主从切换能力"),
            createPara("3. 安全应急演练：模拟网络攻击，验证安全防护能力"),
            createPara("4. 业务应急演练：模拟海关系统中断，验证本地应急处理能力"),

            createHeading("14 试运行方案设计", 1),
            createPara("试运行安排："),
            createPara("1. 试运行范围：先试点一个货站，稳定后推广至全园区"),
            createPara("2. 试运行周期：3个月，分为平稳期、压力期、优化期"),
            createPara("3. 切换策略：新旧系统并行运行1个月，逐步切流"),
            createPara("4. 回退方案：保留旧系统3个月，制定详细回退流程和应急预案")
        ]
    }]
});

// 生成文档
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('国际物流航空货站运行平台及海关信息平台_技术方案说明书_V1.0.docx', buffer);
    console.log('文档生成成功！');
});
