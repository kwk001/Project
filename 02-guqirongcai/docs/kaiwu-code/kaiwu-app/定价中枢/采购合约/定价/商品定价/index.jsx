class LowcodeComponent extends Component {
    constructor() {
        const { setMomentLocale } = window.MomentLocale
        setMomentLocale()
        const { inject } = window.HaijuBasePack;
        inject(this, {
            withMethods: []
        });
        const { injectPricingMethods } = window.HaijuCommodityPricing
        injectPricingMethods(this)
    }
    state = {
        formMap: {
            inquiry_packages: "", // 标包管理表单
            haiju_xunjiapeizhi: "", // 询价配置表单
            goods: "", // 商品基础表
            goodsSpecs: "", // 商品规格信息表
            planSupply_supplier: "", // 计划供应商
            supplier: "", // 供应商档案表
            haiju_xiangguandingjiajichuye: '', // 商品定价基础表
            haiju_goodsPricingDetails: '', // 商品定价详情表
            haiju_caigoubaojiaxiangqing: '', // 采购报价详情
            haiju_caigoubaojia: '', // 采购报价表
            customerTypeManage: '', // 客户类型表
            haiju_shitiaojia: '', // 市调价表
            haiju_salesRecord: '', // 销售记录表
            haiju_commodity: '', // 供应商中标表
            goods_supply: '', // 商品供应表
            goods_price: '', // 商品价格基础表
            planSupply_product: '', // 计划供应商品
            haiju_userPermissions: '', // 审批权限表单
            pricing_approval_record: '', // 定价审批记录表
            market_column_setting: '', // 市场价格字段显隐控制
        },
        // 首页表格查询数据
        queryParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 10, total: 1 },
            sorts: [],
            formId: ""
        },
        // 基础数据查询参数
        baseQueryParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 99999, total: 1 },
            sorts: [],
            formId: ""
        },
        // 详情页分页数据查询
        detailQueryParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 10, total: 1 },
            sorts: [],
            formId: ""
        },
        rowSelection: {
            onChange: function (ids, records) {
                this.onChangeRow(ids, records)
            },
            selectedRowKeys: [],
            getProps: function (record) {
                let flag = false
                const states = [
                    "待定价",
                    "待审核",
                    "二次报价"
                ]
                if (states.includes(record.pricingState)) {
                    flag = true
                }
                return {
                    disabled: flag
                }
            }
        },
        selectedRowRecords: [],
        searchParams: {},
        totalElements: 0,
        detailTotalElements: 0,
        tableData: [],
        uploadUrl: '/mainApi/processengine/app/application/upload',
        currentUser: {},
        conditions: [],
        curEditData: {},
        inquiryPackagesList: [],
        inquiryPackagesData: [],
        showDetailFlag: false,
        showPriceFlag: false,
        curTab: '全部',
        showPriceType: 'PRICING', // PRICING 是定价类型 PRICING_DETAIL 是查看定价详情类型
        detailTableData: [],
        priceDetailList: {
            goodsDetail: {}, // 商品详情
            curPriceDetail: {}, // 当前报价详情
            customerTypeList: [], // 客户类型价详情
            finalPriceList: [], // 最终定价List
            shiTiaoPriceList: [], // 最新市场价
            saleRecordList: {}, // 销售记录List
            priceResultList: [], // 报价结果表
            confirmSupplierList: {}, // 确认供应商列表
            planSupplySupplierList: [], // 计划供应商列表
            lowestSalePrice: [], // 最低测算销售价
            finalLowestSalePrice: [], // 最终测算销售价
            salesBOrCRecordList: [], // B端C端上阶段销售价
            packageSupplierList: [],// 该商品对应的所有的标包对应的供应商
        },
        planSupplySupplierList: [], // 计划供应商列表
        examineList: {
            detailList: [],
            xunjiaList: {},
            reQuoteList: [],
            confirmList: []
        },
        priceSearchMap: {
            regyotationsupplier: false, // 有再报价供应商
            finalsupplier: false, // 未确定供应商
            endBFinalPricing: false, // 未确定B端售价
            cEndFinalPricing: false, // 未确定C端售价
        },
        showQuotationTimeFlag: false, // 控制是否显示报价期限的弹窗
        reQuoteTime: [], // 报价期限数据
        showAttFlag: false,
        showExamineButtonFlag: true, // 控制是否显示提交审核按钮 true 隐藏 false 不隐藏
        showReQuoteButtonFlag: true, // 控制是否显示二次报价的按钮
        showCurGoodsPriceHistoryFlag: false, // 控制显示报价历史弹窗
        curGoodsPriceHistoryList: [], // 该商品历史报价集合
        viewShiTiaoDialogFlag: false, // 查看该商品市场价格历史弹窗
        shiTiaoHistoryList: [], // 市场历史价格list
        salesHistoryPriceList: [], // 销售历史价格列表
        viewSalesHistoryPriceListDialog: false, // 查看历史销售价弹窗
        curXunJiaList: {}, // 当前定价详情的询价单详情
        showPricingSummaryFlag: false, // 生成定价汇总表的弹窗
        pricingSummaryList: {}, // 生成定价汇总表要暂存的数据
        priceDetailParams: { // 查询报价详情参数
            code: "", // 标包
            goodsIdList: [], // 商品ID
            inquiryNumber: "", // 询价单号
            regyotationsupplier: false, // 有无再报价供应商
            finalSupplier: false, // 未确定供应商
            endBFinalPricing: false, // 未确定B端售价
            cEndFinalPricing: false, // 未确定C端售价
            isConfirmSupplier: false, // 确定供应商
            endFinalPricing: false, // 已定价
            pageSize: 10, // 分页参数
            currentPage: 1, // 分页参数
            supplierIdList: '',
            // TODO 增加二次议价需求
            isTwo: [], // 商品ID组2
            hasSecondPrice: false, // 是否有二次议价
            // TODO 增加二次议价需求
        },
        packageGoodsList: [], // 标包下的所有商品数据
        pricingColumnWidth: {}, // 表格列宽数据
        showCustomerDialogFlag: false, // 调整客户类型价价格数据弹窗
        customerTypeManageList: [], // 客户类型基础数据
        curEditDetailData: {}, // 当前编辑的数据详情
        detailTableLoading: false,
        pricingOprType: 'PRICING',
        taxRateList: [],
        packageSupplierListData: [],
        agreeButtonLoading: false, // 控制审核通过按钮，防止多次提交数据
        approveCode: ['AP_PRICING'], // AP_PRICING 定价审批ENUM
        userApproveList: [], // 审批权限列表
        curApprovalList: [], // 当前数据的审批记录
        showApprovalFlag: false, // 是否显示审批记录
        marketPriceColumnList: [], // 市场行情价显示哪些列
    }
    componentDidMount() {
        this.init(() => {
            console.log(this.state.userApproveList)

            // 初始化后续操作
            this.queryBaseData()
        })
    }
    // 查询基础数据
    async queryBaseData() {
        const { inquiry_packages, market_column_setting } = this.state.formMap
        let marketPriceColumnList = []
        const searchParams = {
            searchList: [
                { formId: inquiry_packages, conditions: [] },
                { formId: market_column_setting, conditions: []}
            ]
        }
        const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
        const inquiryPackagesData = res.data[inquiry_packages]
        const inquiryPackagesList = this.dealInquiryPackages(inquiryPackagesData, undefined)
        const temp = this.state.userApproveList.sort((a, b) => a.approveIndex - b.approveIndex)
        const columnList = res.data[market_column_setting] || []
        marketPriceColumnList = [...columnList]
        this.setState({
            inquiryPackagesList,
            inquiryPackagesData,
            userApproveList: [...temp],
            marketPriceColumnList
        }, () => {
            this.getTableData()
        })
    }
    // 首页表格选中事件
    onSelectChange(ids, selected, records) {
        this.setState({
            rowSelection: {
                selectedRowKeys: ids,
                selectedRows: records
            }
        })
    }
    onChangeRow(ids, records) {
        let { rowSelection } = this.state
        rowSelection.selectedRowKeys = ids
        this.setState({
            rowSelection,
        })
    }
    dealParams() {
        let queryParam = _.cloneDeep(this.state.queryParam)
        queryParam.formId = this.state.formMap.haiju_xiangguandingjiajichuye
        let obj = {
            conditionOperator: 'eq',
            field: 'pricingState',
            conditionValues: []
        }
        let otherConditions = []
        if (this.state.curTab !== '全部') {
            obj.conditionValues = [this.state.curTab]
            otherConditions.push(obj)
        }
        queryParam.conditionFilter.conditions = [...this.state.conditions, ...otherConditions]
        return queryParam
    }
    // 首页Tab切换
    onTabChange(e) {
        this.setState({ curTab: e }, () => {
            this.onPageChange(1)
        })
    }
    // 分页查询
    onPageChange(e) {
        let params = { ...this.state.queryParam }
        params.page.current = e
        this.setState({
            queryParam: params
        }, () => {
            this.getTableData()
        })
    }
    // 分页参数
    onPageSizeChange(e) {
        let params = { ...this.state.queryParam }
        params.page.size = e
        params.page.current = 1
        this.setState({
            queryParam: params
        }, () => {
            this.getTableData()
        })
    }
    onDetailPageChange(e) {
        let params = { ...this.state.priceDetailParams }
        params.currentPage = e
        this.setState({
            priceDetailParams: params
        }, () => {
            this.getDetailTableData(this.state.curEditData)
        })
    }
    onDetailPageSizeChange(e) {
        let params = { ...this.state.priceDetailParams }
        params.pageSize = e
        params.currentPage = 1
        this.setState({
            priceDetailParams: params
        }, () => {
            this.getDetailTableData(this.state.curEditData)
        })
    }
    onReset() {
        this.setState({
            conditions: []
        }, () => {
            this.onPageChange(1)
        })
    }

    onSearchData(event) {
        let conditions = []
        for (const field in event) {
            if (event[field] != undefined && event[field] != '') {
                let value = event[field]
                if (field === 'updateTime') {
                    if (value.length > 0 && value[0] != null && value[1] != null) {
                        const startTime = moment(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                        const endTime = moment(value[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                        const searchArr = [
                            { conditionOperator: 'eq', field: 'updateEffectiveTime', conditionValues: [startTime] },
                            { conditionOperator: 'eq', field: 'updateFailureTime', conditionValues: [endTime] },
                        ]
                        conditions = conditions.concat(searchArr)
                    }
                } else {
                    let query = { conditionOperator: 'eq', field, conditionValues: [value] }
                    conditions.push(query)
                }
            }
        }
        this.setState({
            conditions
        }, () => {
            this.onPageChange(1)
        })
    }
    // 获取详情页表格基础数据
    async getDetailDataBase(tableList, curEditData) {
        const { haiju_caigoubaojiaxiangqing, supplier, goods, haiju_xunjiapeizhi } = this.state.formMap
        // 获取当前询价单采购报价详情
        const searchParams = {
            searchList: [
                { formId: haiju_caigoubaojiaxiangqing, conditions: [{ inquiryNumber: curEditData.associatedInquiryNumber, supplierQuotationStatus: '已报价' }] },
                { formId: haiju_xunjiapeizhi, conditions: [{ inquiryNumber: curEditData.associatedInquiryNumber }] }
            ]
        }
        const res1 = await this.getMoreTableData(searchParams)
        let caigouList = []
        let goodsList = []
        let supplierList = []
        let curXunJiaList = null
        if (res1.hasOwnProperty(haiju_caigoubaojiaxiangqing)) {
            caigouList = res1[haiju_caigoubaojiaxiangqing]
        }
        if (res1.hasOwnProperty(haiju_xunjiapeizhi)) {
            if (res1[haiju_xunjiapeizhi].length > 0) {
                curXunJiaList = res1[haiju_xunjiapeizhi][0]
            }
        }
        let aList = caigouList.map(e => e.supplierId)
        for (const item of tableList) {
            if (item.finalSupplier) {
                aList.push(item.finalSupplier)
            }
            if (item.requotationSupplier) {
                const list = item.requotationSupplier.split(',')
                aList = aList.concat(list)
            }
        }
        const aArr = Array.from(new Set(aList)).filter(e => e)
        // 获取供应商信息和商品信息
        const aConditions = aArr.map(e => {
            return { supplierId: e }
        })
        const bConditions = tableList.map((e) => {
            return { goodsId: e.goodsId }
        })
        const searchParams1 = {
            searchList: [
                { formId: supplier, conditions: aConditions },
                { formId: goods, conditions: bConditions },
            ]
        }
        const res2 = await this.getMoreTableData(searchParams1)
        if (res2.hasOwnProperty(goods)) {
            goodsList = res2[goods]
        }
        if (res2.hasOwnProperty(supplier)) {
            supplierList = res2[supplier]
        }
        return { caigouList, goodsList, supplierList, curXunJiaList }
    }

    // 首页获取表格数据
    async getTableData() {
        let tableData = []
        const { haiju_xiangguandingjiajichuye, pricing_approval_record } = this.state.formMap
        const queryParams = this.dealParams()
        let { rowSelection, selectedRowRecords, userApproveList, currentUser } = this.state
        rowSelection.selectedRowKeys = []
        selectedRowRecords = []
        this.setState({
            rowSelection,
            selectedRowRecords
        })
        const tableRes = await this.dataSourceMap['queryFormData'].load(queryParams)
        if (tableRes.code === 200) {
            if (tableRes.result) {
                this.setState({ totalElements: tableRes.result.total })
                if (tableRes.result.records) {
                    const tableList = tableRes.result.records
                    // 这里开始查询要审批的人员和流程
                    const temp = tableList.filter(e => e.pricingState === '待审核')
                    let needApprovalList = []
                    if (temp.length > 0) {
                        let inquiryNumberList = []
                        let priceListNumberList = []
                        let dataAssociationIdList = []
                        for (const item of temp) {
                            inquiryNumberList.push(item.associatedInquiryNumber)
                            priceListNumberList.push(item.priceListNumber)
                            dataAssociationIdList.push(item.dataAssociationId)
                        }
                        let baseQueryParams = _.cloneDeep(this.state.baseQueryParam)
                        baseQueryParams.formId = pricing_approval_record
                        baseQueryParams.conditionFilter.conditions = [
                            { conditionOperator: 'eqa', field: 'inquiryNumber', conditionValues: [...inquiryNumberList] },
                            { conditionOperator: 'eqa', field: 'priceListNumber', conditionValues: [...priceListNumberList] },
                            { conditionOperator: 'eqa', field: 'dataAssociationId', conditionValues: [...dataAssociationIdList] },
                            { conditionOperator: 'eq', field: 'dataStatus', conditionValues: ['未过期'] },
                        ]
                        const approvalRes = await this.dataSourceMap['queryFormData'].load(baseQueryParams)
                        if (approvalRes.code === 200 && approvalRes?.result?.records?.length > 0) {
                            needApprovalList = [...approvalRes.result.records]
                        }
                    }
                    console.log('needApprovalList', needApprovalList)
                    for (const item of tableList) {
                        // 标包名称
                        let packageName = ''
                        const nameOfQuotationPackageList = this.state.inquiryPackagesData.filter(e => e.code === item.packageNumber)
                        if (nameOfQuotationPackageList && nameOfQuotationPackageList.length) {
                            packageName = nameOfQuotationPackageList[0].name
                        }
                        let approvePerson = '-'
                        let approveFlag = true // true 隐藏审核按钮
                        if (item.pricingState === '待审核') {
                            const appTempList = needApprovalList.filter(e =>
                                e.approveIndex === item.approveIndex &&
                                e.inquiryNumber === item.associatedInquiryNumber &&
                                e.priceListNumber === item.priceListNumber &&
                                e.dataAssociationId === item.dataAssociationId
                            )
                            if (appTempList && appTempList.length > 0) {
                                // 所有的没有审批的人员
                                approvePerson = appTempList[0].approveDetail.filter(e => !e.approveResult).map(e => e.approvePerson_user).join(',')
                                const flag = appTempList[0].approveDetail.filter(e => !e.approveResult).map(e => e.approvePerson).indexOf(currentUser.id) > -1
                                approveFlag = !flag
                            }
                        }
                        let obj = {
                            id: item._id,
                            priceListNumber: item.priceListNumber, // 定价单号
                            packageName: item.inquiryPackageName, // 商品标包
                            packageNumber: item.packageNumber,
                            associatedInquiryNumber: item.associatedInquiryNumber, // 关联询价单号
                            // deliveryStartTime: '', // 供货开始时间
                            // endOfDeliveryTime: '', // 供货结束时间
                            supplyCycle: `${item.deliveryStartTime} ~ ${item.endOfDeliveryTime}`, // 供货周期
                            updateEffectiveTime: item.updateEffectiveTime, // 更新生效时间
                            updateFailureTime: item.updateFailureTime, // 更新失效时间
                            pricingDate: item.pricingDate, // 定价日期
                            pricingState: item.pricingState, // 定价状态
                            isPriceStatus: item.isPriceStatus, // 是否可以开始定价
                            initiateARebid: item.initiateARebid, // 是否有再报价
                            approvePerson, // 待审批人员
                            approveFlag, // 是否具有审批权限
                            abortReason: item.abortReason, // 驳回理由
                            detail: { ...item }
                        }
                        tableData.push(obj)
                    }
                    this.setState({ tableData: [...tableData] })
                } else {
                    this.setState({ tableData: [], totalElements: 0 })
                }
            }
        } else {
            this.setState({ tableData: [], totalElements: 0 })
        }
    }
    // 处理二次报价和提交审核的控制按钮是否显示
    dealShowPricingButtonFlag(record) {
        let showExamineButtonFlag = true
        let showReQuoteButtonFlag = true
        if (record.pricingState === '待定价') {
            if (record.initiateARebid === '是') {
                showExamineButtonFlag = true
                showReQuoteButtonFlag = false
            } else {
                showExamineButtonFlag = false
                showReQuoteButtonFlag = true
            }
        }
        return { showExamineButtonFlag, showReQuoteButtonFlag }
    }
    // 开始查询标包下所有商品
    async queryPackageGoodsByCode(rowRecord) {
        const { packageNumber } = rowRecord
        const res = await this.dataSourceMap['queryPackageGoodsByCode'].load({ packageId: packageNumber })
        let packageGoodsList = []
        let packageSupplierListData = []
        if (res.code === 200) {
            packageGoodsList = res.data.goodsList.map(item => {
                return {
                    label: item.goodsName,
                    value: item.goodsId
                }
            })
            packageSupplierListData = res.data.supplierList.map(item => {
                return {
                    label: item.supplierName,
                    value: item.supplierId
                }
            })
        }
        this.setState({ packageGoodsList, packageSupplierListData })
    }
    // 获取定价基础数据
    async getPriceBaseData(rowRecord) {
        const pricingColumnWidth = {
            goodsIndex: 36,
            goodsName: 36,
            procurementStandards: 36,
            measurementUnit: 36,
            marketPrice: 41,
            nantongPrice: 41,
            dongzhouPrice: 41,
            tongyuanPrice: 41,
            oshangPrice: 41,
            yonghuiPrice: 41,
            jingdongPrice: 41,
            dongzhouCenterPrice: 41,
            haorunduoPrice: 41,
            otherPlatformsPrice: 41,
            oshangPurchasingPrice: 41,
            otherPrice: 41,
            oldBusinessPrice: 41,
            oldPurchasePrice: 41,
            oldSupplierName: 41,
            lowestSalePrice: 41,
            lowestSupplierGoodsPrice: 41,
            lowestQuotationSupplierName: 41,
            oldPurchasePriceIncrease: 41,
            deliveriesRate: 41,
            finalOffer: 61,
            supplierData: 82,
            InvoiceType: 41,
            reSupplier: 41,
            finalCalculatePrice: 52,
            outputTaxRate: 41,
            price1: 41,
            price2: 41,
            oldBusinessPriceIncrease: 41,
            endBFinalPricing: 61,
            cEndFinalPricing: 41,
            grossMarginB: 41,
            grossMarginC: 41,
            pricingButton: 46,
            haiJuRemark: 150,
            oprButton: 41,
            profitRate: 96,
            breakevenPoint: 96,
            button1: 41,
            button2: 41,
            button3: 41,
            button4: 41,
        }
        const priceDetailParams = { // 查询报价详情参数
            code: "", // 标包
            goodsIdList: [], // 商品ID
            inquiryNumber: "", // 询价单号
            regyotationsupplier: false, // 有无再报价供应商
            finalSupplier: false, // 未确定供应商
            endBFinalPricing: false, // 未确定B端售价
            cEndFinalPricing: false, // 未确定C端售价
            pageSize: 10, // 分页参数
            currentPage: 1, // 分页参数
            supplierIdList: '',
            // TODO 增加二次议价需求
            goodsIdListTwo: [], // 商品ID组2
            isTwo: false, // 是否有二次议价
            // TODO 增加二次议价需求
        }
        const { associatedInquiryNumber } = rowRecord
        let planSupplySupplierList = []
        let customerTypeManageList = []
        let curXunJiaList = {}
        let taxRateList = []
        const res = await this.dataSourceMap['queryPricingBaseDataByInquiryNumber'].load({ inquiryNumber: associatedInquiryNumber })
        console.log('res', res)
        if (res.code === 200) {
            const planSupplierList = res.data.planSupplierList || []
            // TODO 调整客户类型价格新需求
            customerTypeManageList = res.data.customerTypeManageList.filter(e => e.isSpecial === '否') || []
            planSupplySupplierList = planSupplierList.map(item => {
                return {
                    label: item.supplierName,
                    value: item.supplierId,
                    contactPhoneNumber: item.contactPhoneNumber, // 供应商电话号码
                    disabled: item.supplierStatus === '结束合作',
                }
            })
            curXunJiaList = res.data.inquiryList || {}
            taxRateList = res.data.taxRateList || []
        }
        return {
            planSupplySupplierList,
            pricingColumnWidth,
            customerTypeManageList,
            curXunJiaList,
            priceDetailParams,
            taxRateList
        }
    }
    // 商品开始定价
    async onPrice(e, { rowKey, rowRecord }) {
        console.log('rowRecord', rowRecord)
        const { showExamineButtonFlag, showReQuoteButtonFlag } = this.dealShowPricingButtonFlag(rowRecord)
        this.setState({
            curEditData: rowRecord,
            showDetailFlag: true,
            showExamineButtonFlag,
            showReQuoteButtonFlag,
            detailTableData: [],
            pricingOprType: 'PRICING',
            agreeButtonLoading: false

        }, async () => {
            await this.onPricingCommonMethod(rowRecord)
        })
    }
    async onPricingCommonMethod(rowRecord) {
        const {
            planSupplySupplierList,
            pricingColumnWidth,
            customerTypeManageList,
            curXunJiaList,
            priceDetailParams,
            taxRateList
        } = await this.getPriceBaseData(rowRecord)
        this.setState({
            planSupplySupplierList,
            pricingColumnWidth,
            customerTypeManageList,
            curXunJiaList,
            priceDetailParams,
            taxRateList
        }, async () => {
            await this.getDetailTableData(rowRecord)
            this.queryPackageGoodsByCode(rowRecord)
        })
    }
    // 商品定价进行审核
    async onPriceToExamine(e, { rowKey, rowRecord }) {
        await this.getDetailTableData(rowRecord)
        this.setState({
            curEditData: rowRecord,
            showDetailFlag: true,
            detailTableData: [],
            pricingOprType: 'APPROVE',
            agreeButtonLoading: false
        }, async () => {
            await this.onPricingCommonMethod(rowRecord)
        })
    }
    // 查看商品定价详情
    async onViewDetailData(e, { rowKey, rowRecord }) {
        await this.getDetailTableData(rowRecord)
        this.setState({
            curEditData: rowRecord,
            pricingOprType: 'PRICING_DETAIL',
            showDetailFlag: true,
            detailTableData: [],
            agreeButtonLoading: false
        }, async () => {
            await this.onPricingCommonMethod(rowRecord)
        })
    }
    // 批量生成定价汇总表
    batchPricingSummary() {
        const { selectedRowKeys } = this.state.rowSelection
        if (!selectedRowKeys.length) {
            this.showMessage('error', '错误', '请选择要生成的定价汇总数据')
            return
        }
        let selectedData = selectedRowKeys.map(e => {
            return this.state.tableData.find(item => item.id === e)
        })
        const temp = _.groupBy(selectedData, 'packageNumber')
        let packageNameArr = []
        for (const key in temp) {
            if (temp[key].length > 1) {
                packageNameArr.push(temp[key][0].packageName)
            }
        }
        if (packageNameArr.length > 0) {
            this.showMessage('error', '错误', `选择的数据中有重复的标包：${packageNameArr.join(',')}，请重新选择数据`, 2500)
            return
        }
        const list = selectedData.sort((a, b) => {
            return moment(b.pricingDate).valueOf - moment(a.pricingDate).valueOf()
        })
        let summaryList = []
        selectedData.forEach(e => {
            let obj = {
                packageNumber: e.packageNumber,
                packageName: e.packageName,
                associatedInquiryNumber: e.associatedInquiryNumber,
                priceListNumber: e.priceListNumber,
            }
            summaryList.push(obj)
        })
        let pricingSummaryList = {
            summaryTime: list[0].pricingDate,
            summaryList,
        }
        this.setState({
            pricingSummaryList,
            showPricingSummaryFlag: true
        })

    }
    // 渲染定价汇总JSX
    renderPricingSummaryJSX() {
        const { RenderPricingSummaryJSXData } = window.HaijuCommodityPricing
        let { pricingSummaryList } = this.state
        const onChangeSummaryDate = (e) => {
            let list = { ...pricingSummaryList }
            list.summaryTime = e
            this.setState({ pricingSummaryList: list })
        }
        return (<div>
            <RenderPricingSummaryJSXData
                onChangeSummaryDate={onChangeSummaryDate}
                pricingSummaryList={pricingSummaryList}>
            </RenderPricingSummaryJSXData>
        </div>)
    }
    // 关闭定价汇总
    closePricingSummaryDialog() {
        this.setState({
            pricingSummaryList: {},
            showPricingSummaryFlag: false
        })
    }
    // 确认导出定价汇总
    async confirmExportSummaryExcel() {
        const { pricingSummaryList } = this.state
        if (!pricingSummaryList.summaryTime) {
            this.showMessage('error', '错误', '请选择定价日期')
            return
        }
        const exportParams = {
            priceListNumberList: pricingSummaryList.summaryList.map(e => e.priceListNumber),
            priceTime: pricingSummaryList.summaryTime,
        }
        const packageName = pricingSummaryList.summaryList.map(e => e.packageName).join(',')
        const res = await this.dataSourceMap['goodsPriceToExcel'].load(exportParams)
        console.log(res, '===res')
        let blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
        console.log(blob, '==blob')
        let fileNames = `定价记录表-(${packageName})-${exportParams.priceTime}`
        let fileName = `${fileNames}` + '.xlsx'
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
        console.log('exportRes', res)
        this.closePricingSummaryDialog()
    }
    // 单条数据生成定价汇总表
    singlePricingSummary(e, { rowKey, rowRecord }) {
        let pricingSummaryList = {
            summaryTime: rowRecord.pricingDate,
            summaryList: [
                {
                    packageNumber: rowRecord.packageNumber,
                    packageName: rowRecord.packageName,
                    associatedInquiryNumber: rowRecord.associatedInquiryNumber,
                    priceListNumber: rowRecord.priceListNumber,
                }
            ]
        }
        this.setState({
            pricingSummaryList,
            showPricingSummaryFlag: true
        })
    }
    // 查看审批记录
    async viewApprovalDetail(e, { rowKey, rowRecord }) {
        console.log(rowRecord)
        // 查询审批记录
        const { userApproveList } = this.state
        const { priceListNumber, packageName } = rowRecord
        const { pricing_approval_record } = this.state.formMap
        let baseQueryParams = _.cloneDeep(this.state.baseQueryParam)
        baseQueryParams.formId = pricing_approval_record
        baseQueryParams.conditionFilter.conditions = [
            {
                conditionOperator: 'eq',
                field: 'priceListNumber',
                conditionValues: [priceListNumber]
            }
        ]
        baseQueryParams.sorts = [
            {
                "key": "createTime",
                "type": "DESC"
            }
        ]
        let curApprovalList = []
        const res = await this.dataSourceMap['queryFormData'].load(baseQueryParams)
        if (res.code === 200 && res?.result?.records?.length > 0) {
            const data = res.result.records
            for (const item of data) {
                let approveIndexName = ''
                const temp = userApproveList.filter(e => e.approveIndex === item.approveIndex)
                approveIndexName = temp.length > 0 ? temp[0].approveName : ''
                if (item.approveDetail && item.approveDetail.length > 0) {
                    const len = item.approveDetail.length
                    for (let i = 0; i < len; i++) {
                        const e = item.approveDetail[i]
                        let obj = {
                            priceListNumber,
                            packageName,
                            approveIndexName,
                            ...e
                        }
                        if (i === 0) {
                            obj['needRowSpan'] = true
                            obj['rowSpan'] = len
                        }
                        curApprovalList.push(obj)
                    }
                } else {
                    let obj = {
                        priceListNumber,
                        packageName,
                        approveIndexName,
                    }
                    curApprovalList.push(obj)
                }

            }
            // 数据开始处理
            this.setState({
                showApprovalFlag: true,
                curApprovalList
            })
        } else {
            this.showMessage('error', '错误', '暂无审批记录')
        }
    }
    // 关闭审核记录对话框
    closeApprovalDialog() {
        this.setState({
            showApprovalFlag: false,
            curApprovalList: []
        })
    }
    // 导出审核记录
    async exportApprovalDetail(e, { rowKey, rowRecord }) {
        const KaiwuExportExcel = window.KaiwuExportExcel
        const { userApproveList } = this.state
        const { priceListNumber, packageName, associatedInquiryNumber } = rowRecord
        const { pricing_approval_record } = this.state.formMap
        const column = [
            { title: '定价单号', dataIndex: 'priceListNumber' },
            { title: '询价单号', dataIndex: 'associatedInquiryNumber' },
            { title: '商品标包', dataIndex: 'packageName' },
            { title: '流程阶段', dataIndex: 'approveIndexName' },
            {
                title: '审批详情', dataIndex: 'approveDetail',
                children: [
                    { title: '审批人员', dataIndex: 'approvePerson_user' },
                    { title: '审批结果', dataIndex: 'approveResult' },
                    { title: '驳回原因', dataIndex: 'rejectReason' },
                    { title: '审批时间', dataIndex: 'approveTime' },
                ]
            },
        ]
        let baseQueryParams = _.cloneDeep(this.state.baseQueryParam)
        baseQueryParams.formId = pricing_approval_record
        baseQueryParams.conditionFilter.conditions = [
            {
                conditionOperator: 'eq',
                field: 'priceListNumber',
                conditionValues: [priceListNumber]
            }
        ]
        baseQueryParams.sorts = [
            {
                "key": "createTime",
                "type": "DESC"
            }
        ]
        let dataSource = []
        const res = await this.dataSourceMap['queryFormData'].load(baseQueryParams)
        if (res.code === 200 && res?.result?.records?.length > 0) {
            const data = res.result.records
            for (const item of data) {
                let approveIndexName = ''
                const temp = userApproveList.filter(e => e.approveIndex === item.approveIndex)
                approveIndexName = temp.length > 0 ? temp[0].approveName : ''
                let obj = {
                    priceListNumber,
                    packageName,
                    approveIndexName,
                    associatedInquiryNumber,
                    approveDetail: [...item.approveDetail],
                }
                dataSource.push(obj)
            }
            const title = `${packageName}审核记录`
            KaiwuExportExcel.Excel.exportData(column, dataSource, title)
        } else {
            this.showMessage('error', '错误', '暂无审批记录')
        }
    }
    // 渲染审核记录
    renderApprovalDetailJSX() {
        const column = [
            { title: '定价单号', dataIndex: 'priceListNumber' },
            { title: '商品标包', dataIndex: 'packageName' },
            { title: '流程阶段', dataIndex: 'approveIndexName' },
            {
                title: '审批详情', dataIndex: 'approveDetail',
                children: [
                    { title: '审批人员', dataIndex: 'approvePerson_user' },
                    { title: '审批结果', dataIndex: 'approveResult' },
                    { title: '驳回原因', dataIndex: 'rejectReason' },
                    { title: '审批时间', dataIndex: 'approveTime' },
                ]
            },
        ]
        const rowSpanList = ['priceListNumber', 'packageName', 'approveIndexName']
        const cellProps = (rowIndex, colIndex, dataIndex, record) => {
            if (record.needRowSpan && record.rowSpan && rowSpanList.indexOf(dataIndex) > -1) {
                return { rowSpan: record.rowSpan }
            }
        }
        const { Table } = window.Next
        return (<Table.StickyLock
            dataSource={this.state.curApprovalList}
            primaryKey={'_id'}
            cellProps={cellProps}
            hasBorder={true}
        >
            {column.map((item, index) => {
                if (!item.children) {
                    return (<Table.Column title={item.title} dataIndex={item.dataIndex} key={item.dataIndex} />)
                } else {
                    return (<Table.ColumnGroup title={item.title} key={item.dataIndex}>
                        {item.children.map((e, index) => {
                            return (<Table.Column title={e.title} dataIndex={e.dataIndex} key={e.dataIndex} />)
                        })}
                    </Table.ColumnGroup>)
                }
            })}
        </Table.StickyLock>)
    }
    // 数据逻辑拆分A 获取定价详情表，询价配置表
    async getCommonDataA() {
        const { haiju_goodsPricingDetails, haiju_xunjiapeizhi } = this.state.formMap
        const { curEditData } = this.state
        const searchParams = {
            searchList: [
                { formId: haiju_goodsPricingDetails, conditions: [{ priceListNumber: curEditData.priceListNumber }] },
                { formId: haiju_xunjiapeizhi, conditions: [{ inquiryNumber: curEditData.associatedInquiryNumber }] }
            ]
        }
        const detailRes = await this.getMoreTableData(searchParams)
        let detailList = []
        let xunjiaList = {}
        if (detailRes.hasOwnProperty(haiju_goodsPricingDetails)) {
            detailList = detailRes[haiju_goodsPricingDetails]
        }
        if (detailRes.hasOwnProperty(haiju_xunjiapeizhi) && detailRes[haiju_xunjiapeizhi].length > 0) {
            xunjiaList = detailRes[haiju_xunjiapeizhi][0]
        }
        return { detailList, xunjiaList }
    }
    // 处理采购报价数据
    async getCommonDataB(reQuoteList, xunjiaList) {
        // 这个拼装好要更新采购报价/采购报价详情的数据，用于供应商再次报价
        const { haiju_caigoubaojia } = this.state.formMap
        const { curEditData, reQuoteTime, planSupplySupplierList } = this.state
        let reQuoteSupplierId = []
        let caigoubaojiaList = []
        let caigoubaojiaUpdateData = [] // 采购报价主表要更新的数据
        let caigouDetailAddData = [] // 采购报价详情表要新增的数据
        let reQuotePhoneNumber = [] // 再报价供应商电话号码集合，用于发送短信提醒报价
        // 再报价数据进行拆分
        if (reQuoteList && reQuoteList.length) {
            for (const item of reQuoteList) {
                const supplierIds = item.requotationSupplier.split(',')
                reQuoteSupplierId = [...reQuoteSupplierId, ...supplierIds]
                for (const e of supplierIds) {
                    let obj = {
                        supplierId: e,
                        inquiryNumber: curEditData.associatedInquiryNumber,
                        inquiryGoodsId: item.goodsId,
                        quotationRound: xunjiaList.quotationProgress + 1,
                        quotationStartTime: reQuoteTime[0], // 报价开始时间
                        quotationEndTime: reQuoteTime[1], // 报价结束时间
                        supplierQuotationStatus: '未报价',
                        haijuRemarkStr: item.remark, // 东和方备注预留字段
                    }
                    caigouDetailAddData.push(obj)
                }
            }

        }
        if (reQuoteSupplierId && reQuoteSupplierId.length) {
            reQuoteSupplierId = Array.from(new Set(reQuoteSupplierId))
            for (const item of reQuoteSupplierId) {
                const temp = planSupplySupplierList.filter(e => e.value === item)
                if (temp && temp.length > 0 && temp[0].contactPhoneNumber) {
                    reQuotePhoneNumber.push(temp[0].contactPhoneNumber)
                }
            }
            // 开始查询采购报价数据
            const searchParams = {
                searchList: [
                    {
                        formId: haiju_caigoubaojia,
                        conditions: reQuoteSupplierId.map((e) => {
                            return {
                                supplierId: e,
                                inquiryNumber: curEditData.associatedInquiryNumber
                            }
                        })
                    }
                ]
            }
            const caigoubaojiaRes = await this.getMoreTableData(searchParams)
            if (caigoubaojiaRes.hasOwnProperty(haiju_caigoubaojia)) {
                caigoubaojiaList = caigoubaojiaRes[haiju_caigoubaojia]
            }
            for (const item of caigoubaojiaList) {
                const updateData = {
                    _id: item._id,
                    quotationStartTime: reQuoteTime[0], // 报价开始时间
                    quotationEndTime: reQuoteTime[1], // 报价结束时间
                    quotationRound: xunjiaList.quotationProgress + 1, // 当前询价单轮数要加1
                    bidStatus: '待报价'
                }
                caigoubaojiaUpdateData.push(updateData)
            }
        }
        return { caigoubaojiaUpdateData, caigouDetailAddData, reQuotePhoneNumber }
    }
    // 处理商品供应表要新增/更新的数据
    async getCommonDataC(confirmList, xunjiaList, detailList) {
        const { goods_supply, haiju_commodity, goods } = this.state.formMap
        const { curEditData } = this.state
        const { detail } = curEditData
        let conditions = []
        let commodityConditions = []
        let goodsCondition = []
        for (const item of confirmList) {
            // 供应详情表查询参数
            let obj = {
                goodsCode: item.goodsId,
                startDate: detail.deliveryStartTime,
                endDate: detail.endOfDeliveryTime
            }
            // 供应商品中标表查询参数
            let otherObj = {
                inquiryNumber: curEditData.associatedInquiryNumber,
                winningBidGoodsId: item.goodsId
            }
            let goodsObj = {
                goodsId: item.goodsId
            }
            conditions.push(obj)
            commodityConditions.push(otherObj)
            goodsCondition.push(goodsObj)
        }
        let goodsSupplyList = []
        let commodityList = []
        let goodsList = []
        const addGoodsSupplyData = [] // 要新增的供应商品数据
        const updateGoodsSupplyData = [] // 要更新的供应商品数据
        const updateCommodityData = [] // 要更新的供应商品中标数据
        const addCommodityData = [] // 要新增的供应商中标数据
        const updateGoodsData = []
        if (conditions.length) {
            const searchParams = {
                searchList: [
                    { formId: goods_supply, conditions: conditions },
                    { formId: haiju_commodity, conditions: commodityConditions },
                    { formId: goods, conditions: goodsCondition, showField: ['goodsId', 'goodsName', 'isListing', 'customerFluctuation'] },
                ]
            }
            const searchRes = await this.getMoreTableData(searchParams)
            // if (searchRes.hasOwnProperty(goods_supply)) {
            //     goodsSupplyList = searchRes[goods_supply]
            // }
            if (searchRes.hasOwnProperty(haiju_commodity)) {
                commodityList = searchRes[haiju_commodity]
            }
            // if (searchRes.hasOwnProperty(goods)) {
            //     goodsList = searchRes[goods]
            // }
        }
        if (confirmList && confirmList.length) {
            let pricingState = ''
            const curTime = moment()
            const { updateEffectiveTime, updateFailureTime } = curEditData.detail
            const startTime = moment(updateEffectiveTime).startOf('day')
            const endTime = moment(updateFailureTime).endOf('day')
            if (curTime.isBefore(startTime, 'second')) {
                pricingState = '待生效'
            } else if (curTime.isBetween(startTime, endTime, 'second', '(]')) {
                pricingState = '生效中'
            } else {
                pricingState = '已过期'
            }
            for (const item of confirmList) {
                // if (item.isConfirmSupplier === '是' && !item.endBFinalPricing && !item.cEndFinalPricing) {
                //
                // } else {
                //
                // }
                // TODO ======
                let deliveryStartTime = detail.deliveryStartTime
                let endOfDeliveryTime = detail.endOfDeliveryTime

                if (deliveryStartTime?.length == 10) {
                    deliveryStartTime = deliveryStartTime + " 00:00:00"
                    endOfDeliveryTime = endOfDeliveryTime + " 00:00:00"
                }
                let obj = {
                    goodsCode: item.goodsId, // 商品编号
                    inquiryNumber: curEditData.associatedInquiryNumber, // 询价单号
                    goodsName: '', // 商品名称
                    specs: '', // 规格
                    unit: item.unit, // 单位
                    startDate: deliveryStartTime, // 供货开始日期
                    endDate: endOfDeliveryTime, // 供货结束日期
                    purchasePrice: item.finalOffer || 0, // 采购价
                    businessPrice: item.endBFinalPricing || 0, // B端销售价
                    customerPrice: item.cEndFinalPricing || 0, // C端销售价
                    supplierCode: item.finalSupplier || '', // 供应商编号
                    rate: item.deliveriesRate || '', // 进项税率
                    status: pricingState, // 状态
                    pricingDate: moment().format('YYYY-MM-DD HH:mm:ss'), // 定价日期
                    invoiceType: item.InvoiceType || '', // 发票类型
                    supplierName: '', // 供应商名称
                    businessTypePrice: [], // 客户类型价
                    remarks: '', // 备注
                    isVoided: '否', // 是否作废，新增字段
                }
                let customerFlag = false
                const customerLen = item.customerTypeList.filter(e => !e.customerTypePrice)
                if (customerLen === item.customerTypeList.length) {
                    customerFlag = true
                }
                if (item.isConfirmSupplier === '是' && !item.endBFinalPricing && !item.cEndFinalPricing && customerFlag) {
                    obj.isVoided = '是'
                }
                if (item.customerTypeList && item.customerTypeList.length) {
                    for (const e of item.customerTypeList) {
                        const num = Decimal(e.upRatio).div(100)
                        let list = {
                            businessTypeId: e.customerTypeId,
                            price: e.customerTypePrice,
                            // upRatio: Number((e.upRatio / 100).toFixed(2)) || 0,
                            upRatio: new Decimal(num).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
                        }
                        obj.businessTypePrice.push(list)
                    }

                }
                addGoodsSupplyData.push(obj)
                // TODO ======

                if (item.finalSupplier) {

                    // 供应商中标商品数据
                    const commodityItems = commodityList.filter(e => e.inquiryNumber === curEditData.associatedInquiryNumber &&
                        e.winningBidGoodsId === item.goodsId
                    )
                    if (commodityItems && commodityItems.length) {
                        const commodityItem = commodityItems[0]
                        let commodityObj = {
                            _id: commodityItem._id,
                            supplierId: item.finalSupplier,
                            winningBidPrice: item.finalOffer || 0,
                            deliveriesRate: item.deliveriesRate,
                            InvoiceType: item.InvoiceType,
                            winningRound: item.winningRounds, // 中标轮次
                            attachments: item.hjAttachments || [], // 中标的附件
                            remark: item.remark, // 中标的备注
                            isConfirmStatus: '否', // TODO 现在需求是必须发送供货通知之后才能算该商品中标
                        }
                        updateCommodityData.push(commodityObj)
                    } else {
                        let obj = {
                            inquiryNumber: curEditData.associatedInquiryNumber,
                            winningBidGoodsId: item.goodsId,
                            supplierId: item.finalSupplier,
                            winningBidPrice: item.finalOffer || 0,
                            deliveriesRate: item.deliveriesRate,
                            InvoiceType: item.InvoiceType,
                            winningRound: item.winningRounds, // 中标轮次
                            attachments: item.hjAttachments || [], // 中标的附件
                            remark: item.remark, // 中标的备注
                            isConfirmStatus: '否',
                            isConfirmSupplier: '是', // TODO 现在需求是必须发送供货通知之后才能算该商品中标
                        }
                        addCommodityData.push(obj)
                    }
                }
            }
        }
        return { addGoodsSupplyData, updateGoodsSupplyData, updateCommodityData, addCommodityData, updateGoodsData }
    }
    // 没有再报价供应商的情况下，要更新供应商侧的状态为已定价状态
    async getCommonDataD(confirmList) {
        const { curEditData } = this.state
        const { xunjiaList } = this.state.examineList
        const { haiju_caigoubaojia, planSupply_product } = this.state.formMap
        let conditions = confirmList.filter(e => e.isConfirmSupplier !== '是').map(e => {
            if (e.finalSupplier) {
                return {
                    inquiryNumber: curEditData.associatedInquiryNumber,
                    supplierId: e.finalSupplier
                }
            }
        })
        const searchParams = {
            searchList: [
                { formId: haiju_caigoubaojia, conditions: [...conditions] },
                { formId: planSupply_product, conditions: [{ inquiryNumber: curEditData.associatedInquiryNumber }] }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        let arr = []
        let planSupplierGoods = []
        if (res.hasOwnProperty(haiju_caigoubaojia)) {
            arr = res[haiju_caigoubaojia]
        }
        if (res.hasOwnProperty(planSupply_product)) {
            planSupplierGoods = res[planSupply_product]
        }
        let updateSupplierPricingData = []
        let addSupplierPricingData = []
        if (confirmList && confirmList.length > 0) {
            for (const item of confirmList) {
                if (item.isConfirmSupplier !== '是') {
                    if (item.finalSupplier) {
                        const temp = arr.filter(e => e.supplierId === item.finalSupplier)
                        if (temp && temp.length) {
                            // 这时候要更新采购报价主表
                            let updateData = {
                                _id: temp[0]._id,
                                bidStatus: '待确认'
                            }
                            updateSupplierPricingData.push(updateData)
                        } else {
                            // 这时候要新增采购报价主表
                            const listA = planSupplierGoods.filter(e => e.inquiry_flag === '是')
                            let addData = {
                                supplierId: item.finalSupplier, // 供应商编号
                                inquiryNumber: curEditData.associatedInquiryNumber, // 询价单号
                                inquiryPackageId: xunjiaList.inquiryPackageId, // 询价标包ID
                                inquiryGoodsNumber: listA.length, // 询价商品数量
                                deliveryCycleStartTime: xunjiaList.deliveryCycleStartTime, // 供货开始时间
                                endOfSupplyCycleTime: xunjiaList.endOfSupplyCycleTime, // 供货结束时间
                                quotationStartTime: xunjiaList.quotationStartTime, // 报价开始时间
                                quotationEndTime: xunjiaList.quotationEndTime, // 报价结束时间
                                quotationRound: '', // 报价轮次
                                bidStatus: '待确认', // 报价状态
                            }
                            addSupplierPricingData.push(addData)
                        }
                    }
                }
            }
        }
        return { updateSupplierPricingData, addSupplierPricingData }
    }
    // 渲染报价期限内容
    renderQuoteTimeJSX() {
        const { DatePicker } = window.Next
        const { RangePicker } = DatePicker
        const onChangeRepeatDateTime = (e) => {
            const reQuoteTime = [
                moment(e[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(e[1]).format('YYYY-MM-DD HH:mm:ss'),
            ]
            this.setState({ reQuoteTime })
        }
        return (<div className={'repeat-box'}>
            <div>报价期限：</div>
            <RangePicker className={'repeat-box-time'} format="YYYY-MM-DD" showTime={{ format: "HH:mm:ss" }} onOk={onChangeRepeatDateTime} />
        </div>)
    }
    // 报价期限确认
    onConfirmQuoteTime() {
        const { reQuoteTime } = this.state
        if (!reQuoteTime.length) {
            this.showMessage('error', '错误', '请选择再报价期限')
            return
        }
        this.setState({
            showQuotationTimeFlag: false
        }, async () => {
            await this.confirmSubmitReQuoteData()
        })
    }
    // 报价期限取消
    onCancelQuoteTime() {
        this.setState({
            reQuoteTime: [],
            showQuotationTimeFlag: false
        })
    }
    // 确定提交再报价数据
    async confirmSubmitReQuoteData() {
        const {
            haiju_xunjiapeizhi,
            haiju_xiangguandingjiajichuye,
            haiju_caigoubaojia,
            haiju_caigoubaojiaxiangqing,
        } = this.state.formMap
        const { reQuoteList, xunjiaList, detailList } = this.state.examineList
        const { curEditData, reQuoteTime } = this.state
        let batchUpdateData = []
        let batchAddData = []
        let updateData = []
        let pricingState = '二次报价'
        const { caigoubaojiaUpdateData, caigouDetailAddData, reQuotePhoneNumber } = await this.getCommonDataB(reQuoteList, xunjiaList)
        // 如果有再报价供应商 询价配置要更新报价轮次
        if (reQuoteList && reQuoteList.length > 0) {
            const updateXunjiaData = {
                formId: haiju_xunjiapeizhi,
                id: xunjiaList._id,
                data: {
                    quotationProgress: xunjiaList.quotationProgress + 1,
                    quotationStartTime: reQuoteTime[0],
                    quotationEndTime: reQuoteTime[1],
                    bidStatus: '二次报价'
                }
            }
            updateData.push(updateXunjiaData)
        }
        // 更新采购报价主表
        if (caigoubaojiaUpdateData.length) {
            batchUpdateData.push({
                formId: haiju_caigoubaojia,
                datas: [...caigoubaojiaUpdateData]
            })
        }
        // 更新采购报价详情表
        if (caigouDetailAddData.length) {
            batchAddData.push({
                formId: haiju_caigoubaojiaxiangqing,
                datas: [...caigouDetailAddData]
            })
        }
        // 更新商品定价主表
        let updateMainFormData = {
            formId: haiju_xiangguandingjiajichuye,
            id: curEditData.detail._id,
            data: {
                pricingState
            }
        }
        updateData.push(updateMainFormData)
        const submitData = {
            batchUpdateData,
            batchAddData,
            updateData,
            addGoodsSupplyDataList: null,
            userInfo: {
                curTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                userId: this.state.currentUser.id
            }
        }
        const res = await this.dataSourceMap['pricingReview'].load(submitData)
        if (res.code === 200) {
            this.showMessage('success', '成功', '二次报价数据提交成功')
            // 开始发送二次报价通知
            if (reQuotePhoneNumber && reQuotePhoneNumber.length > 0) {
                // 【东和公司】温馨提示：您有标包18（水果）商品须2次议价，请在2024年7月26日（周五）14：00前完成议价。
                const time1 = moment(reQuoteTime[1]).format('YYYY年M月D日')
                const weekDay = moment(reQuoteTime[1]).day()
                let time2 = ''
                switch (weekDay) {
                    case 1:
                        time2 = '周一'
                        break
                    case 2:
                        time2 = '周二'
                        break
                    case 3:
                        time2 = '周三'
                        break
                    case 4:
                        time2 = '周四'
                        break
                    case 5:
                        time2 = '周五'
                        break
                    case 6:
                        time2 = '周六'
                        break
                    case 0:
                        time2 = '周日'
                        break
                    default:
                        break
                }
                const time3 = moment(reQuoteTime[1]).format('HH:mm')
                const sendSmsParams = {
                    mobiles: reQuotePhoneNumber.join(','),
                    content: `【东和公司】温馨提示：您有${curEditData.packageName}商品须2次议价，请在${time1}（${time2}）${time3}前完成议价。`
                }
                const sendRes = await this.dataSourceMap['sendSms'].load(sendSmsParams)
            }
            this.setState({
                showDetailFlag: false,
                examineList: {
                    detailList: [],
                    xunjiaList: {},
                    reQuoteList: [],
                    confirmList: []
                },
                curEditData: {}
            }, () => {
                this.getTableData()
            })
        } else {
            this.showMessage('error', '提示', res.message)
        }
    }
    // 通过该条数据进行数据提交
    async confirmAgreeCurData() {
        const {
            haiju_xunjiapeizhi,
            haiju_xiangguandingjiajichuye,
            haiju_caigoubaojia,
            goods_supply,
            haiju_commodity,
        } = this.state.formMap
        const { confirmList, xunjiaList, detailList } = this.state.examineList
        const { curEditData, reQuoteTime } = this.state
        let batchUpdateData = []
        let batchAddData = []
        let updateData = []
        let addGoodsSupplyDataList = null
        // 如果没有再报价供应商，这个时候要判断生效和失效时间，如果当前时间小于更新生效时间，当前状态是待生效
        // 如果当前时间在更新生效和更新失效时间区间内，当前状态改为生效中
        let pricingState = ''
        const curTime = moment()
        const { updateEffectiveTime, updateFailureTime } = curEditData.detail
        const startTime = moment(updateEffectiveTime).startOf('day')
        const endTime = moment(updateFailureTime).endOf('day')
        if (curTime.isBefore(startTime, 'second')) {
            pricingState = '待生效'
        } else if (curTime.isBetween(startTime, endTime, 'second', '(]')) {
            pricingState = '生效中'
        } else {
            pricingState = '已过期'
        }
        // 获取商品供应要新增/更新的数据 更新供应商中标表的数据
        const { addGoodsSupplyData, updateCommodityData, addCommodityData } = await this.getCommonDataC(confirmList, xunjiaList, detailList)
        // 没有再报价供应商的情况下，要更新供应商侧的状态
        const { updateSupplierPricingData, addSupplierPricingData } = await this.getCommonDataD(confirmList)
        if (updateSupplierPricingData && updateSupplierPricingData.length) {
            batchUpdateData.push({
                formId: haiju_caigoubaojia,
                datas: [...updateSupplierPricingData]
            })
        }
        if (addSupplierPricingData && addSupplierPricingData.length) {
            batchAddData.push({
                formId: haiju_caigoubaojia,
                datas: [...addSupplierPricingData]
            })
        }
        // 更新供应商中标商品表
        if (updateCommodityData.length) {
            batchUpdateData.push({
                formId: haiju_commodity,
                datas: [...updateCommodityData]
            })
        }
        // 中标表要新增的数据
        if (addCommodityData.length) {
            batchAddData.push({
                formId: haiju_commodity,
                datas: [...addCommodityData]
            })
        }
        // 更新商品定价主表
        let updateMainFormData = {
            formId: haiju_xiangguandingjiajichuye,
            id: curEditData.detail._id,
            data: {
                pricingState,
                approveIndex: 0,
                dataAssociationId: '',
                pricingDate: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }
        updateData.push(updateMainFormData)
        // 没有再报价供应商的情况下，要更新询价表的状态为已定价
        const updateXunjiaList = {
            formId: haiju_xunjiapeizhi,
            id: xunjiaList._id,
            data: {
                bidStatus: '已定价'
            }
        }
        updateData.push(updateXunjiaList)
        // 新增供应商品主表
        if (addGoodsSupplyData.length) {
            addGoodsSupplyDataList = {
                formId: goods_supply,
                datas: [...addGoodsSupplyData]
            }
        }
        const submitData = {
            batchUpdateData,
            batchAddData,
            updateData,
            addGoodsSupplyDataList,
            userInfo: {
                curTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                userId: this.state.currentUser.id
            }
        }
        const res = await this.dataSourceMap['pricingReview'].load(submitData)
        if (res.code === 200) {
            this.showMessage('success', '成功', '该条数据已经审核通过')
            this.setState({
                showDetailFlag: false,
                examineList: {
                    detailList: [],
                    xunjiaList: {},
                    reQuoteList: [],
                    confirmList: []
                },
                curEditData: {},
                showExamineButtonFlag: true,
                showReQuoteButtonFlag: true,
                agreeButtonLoading: false
            }, () => {
                this.getTableData()
            })
        } else {
            this.setState({
                agreeButtonLoading: false
            })
            this.showMessage('error', '提示', res.message)
        }
    }
    // 通过该条数据审核前置校验逻辑
    async checkCurApprovalStatus() {
        const { userApproveList, curEditData, formMap: { pricing_approval_record } } = this.state
        console.log('curEditData', curEditData)
        const { detail: { associatedInquiryNumber, approveIndex, priceListNumber, dataAssociationId } } = curEditData
        let baseQueryParams = _.cloneDeep(this.state.baseQueryParam)
        baseQueryParams.formId = pricing_approval_record
        baseQueryParams.conditionFilter.conditions = [
            { conditionOperator: 'eq', field: 'inquiryNumber', conditionValues: [associatedInquiryNumber] },
            { conditionOperator: 'eq', field: 'priceListNumber', conditionValues: [priceListNumber] },
            { conditionOperator: 'eq', field: 'dataAssociationId', conditionValues: [dataAssociationId] },
            { conditionOperator: 'eq', field: 'dataStatus', conditionValues: ['未过期'] },
            { conditionOperator: 'eq', field: 'approveIndex', conditionValues: [approveIndex] },
        ]
        const res = await this.dataSourceMap['queryFormData'].load(baseQueryParams)
        if (res.code === 200) {
            if (res?.result?.records?.length > 0) {
                return res.result.records[0]
            } else {
                return null
            }
        }
    }
    // 提交审核流程数据
    async submitCurApprovalData(checkData, curIndex, examineList = {}) {
        const { userApproveList, curEditData, currentUser } = this.state
        const { detail: { associatedInquiryNumber, priceListNumber } } = curEditData
        const { pricing_approval_record, haiju_xiangguandingjiajichuye } = this.state.formMap
        const isLastIndex = curIndex === userApproveList.length - 1 // 判断是否是最后一个审批阶段
        const checkFlag = checkData.approveDetail.filter(e => e.approveResult === '通过').length === checkData.approveDetail.length - 1
        let sApprovalData = _.cloneDeep(checkData)
        const index = sApprovalData.approveDetail.findIndex(e => e.approvePerson === currentUser.id)
        if (index > -1) {
            let item = sApprovalData.approveDetail[index]
            item.approveResult = '通过'
            item.approveTime = moment().format('YYYY-MM-DD HH:mm:ss')
            sApprovalData.approveDetail[index] = item
            const updateData = {
                formId: pricing_approval_record,
                id: sApprovalData._id,
                data: {
                    approveDetail: sApprovalData.approveDetail,
                    dataStatus: checkFlag ? '已过期' : '未过期'
                }
            }
            const res = await this.dataSourceMap['updateFormData'].load(updateData)
            if (res.code === 200) {
                if (checkFlag) {
                    // 这个时候说明已经是最后一个人审核数据
                    // 审核数据通过之后，提交一个新的下一阶段数据
                    if (!isLastIndex) {
                        // 不是最后一个审批流程
                        const dataAssociationId = `AP_${moment().valueOf()}`
                        const apInd = userApproveList[curIndex + 1].approveIndex
                        const temp = userApproveList[curIndex + 1].approvePerson.split(',')
                        const approveDetail = temp.map(e => {
                            return {
                                approvePerson: e
                            }
                        })
                        const addData = {
                            formId: pricing_approval_record,
                            data: {
                                priceListNumber,
                                inquiryNumber: associatedInquiryNumber,
                                approveIndex: apInd,
                                dataStatus: '未过期',
                                dataAssociationId,
                                approveDetail
                            }
                        }
                        // 开始更新主表状态
                        let updateMainFormData = {
                            formId: haiju_xiangguandingjiajichuye,
                            id: curEditData.detail._id,
                            data: {
                                approveIndex: apInd,
                                dataAssociationId,
                            }
                        }
                        const res = await Promise.all([
                            this.dataSourceMap['addFormData'].load(addData),
                            this.dataSourceMap['updateFormData'].load(updateMainFormData)
                        ])
                        if (res[0].code === 200 && res[1].code === 200) {
                            this.showMessage('success', '成功', '该条数据已经审核通过')
                            this.setState({
                                showDetailFlag: false,
                                examineList: {
                                    detailList: [],
                                    xunjiaList: {},
                                    reQuoteList: [],
                                    confirmList: []
                                },
                                curEditData: {},
                                showExamineButtonFlag: true,
                                showReQuoteButtonFlag: true,
                                agreeButtonLoading: false
                            }, () => {
                                setTimeout(() => {
                                    document.body.style = ''
                                    this.getTableData()
                                }, 500)
                            })
                        } else {
                            this.setState({
                                agreeButtonLoading: false
                            })
                            this.showMessage('error', '提示', '提交数据出错，请联系管理员')
                        }
                    } else {
                        // 最后一级审批，最后一个人审核通过，开始提交定价数据
                        this.setState({
                            examineList,
                            agreeButtonLoading: true
                        }, () => {
                            // 测试时屏蔽下一步最终提交审核业务数据
                            this.confirmAgreeCurData()
                        })
                    }
                } else {
                    this.showMessage('success', '成功', '该条数据已经审核通过')
                    this.setState({
                        showDetailFlag: false,
                        examineList: {
                            detailList: [],
                            xunjiaList: {},
                            reQuoteList: [],
                            confirmList: []
                        },
                        curEditData: {},
                        showExamineButtonFlag: true,
                        showReQuoteButtonFlag: true,
                        agreeButtonLoading: false
                    }, () => {
                        setTimeout(() => {
                            document.body.style = ''
                            this.getTableData()
                        }, 500)
                    })
                }
            }
        }

    }
    // 通过当前数据审核
    async agreeCurData() {
        const { detailList, xunjiaList } = await this.getCommonDataA()
        const { userApproveList, curEditData, currentUser } = this.state
        const { haiju_xiangguandingjiajichuye } = this.state.formMap
        if (!detailList.length) {
            this.showMessage('error', '提示', '暂时没有报价数据，不能审核')
            return
        }
        // 通过之前先做前置校验
        const checkData = await this.checkCurApprovalStatus()
        if (!checkData) {
            this.showMessage('error', '提示', '该审批流程已经被驳回或者审批完成，请返回重新刷新数据')
            return
        }
        console.log('checkData', checkData)
        window.Next.Dialog.confirm({
            title: '提示',
            v2: true,
            okProps: {
                loading: this.state.agreeButtonLoading,
            },
            content: '确定要通过该条数据审核？',
            onOk: async () => {
                // 开始分情况来处理 只有最后一级审批才最终提交数据
                const index = userApproveList.findIndex(e => e.approveIndex === curEditData.detail.approveIndex)
                if (index !== userApproveList.length - 1) {
                    console.log(index,"1")
                    this.setState({
                        agreeButtonLoading: true
                    }, async () => {
                        await this.submitCurApprovalData(checkData, index)
                    })
                } else {

                    let confirmList = [...detailList]
                    const examineList = {
                        detailList,
                        xunjiaList,
                        confirmList
                    }
                    await this.submitCurApprovalData(checkData, index, examineList)
                }
            },
            onCancel: () => {
                this.setState({
                    agreeButtonLoading: false
                })
            }
        })

    }
    // 通过当前数据审核 V2 - 基于后端接口实现
    async agreeCurDataV2() {
        const { detailList, xunjiaList } = await this.getCommonDataA()
        const { curEditData, currentUser } = this.state
        
        if (!detailList.length) {
            this.showMessage('error', '提示', '暂时没有报价数据，不能审核')
            return
        }

        window.Next.Dialog.confirm({
            title: '提示',
            v2: true,
            okProps: {
                loading: this.state.agreeButtonLoading,
            },
            content: '确定要通过该条数据审核？',
            onOk: async () => {
                this.setState({
                    agreeButtonLoading: true
                }, async () => {
                    try {
                        // 调用后端审批接口
                        const params = {
                            associatedInquiryNumber: curEditData.detail.associatedInquiryNumber,
                            priceListNumber: curEditData.detail.priceListNumber,
                            currentUserId: currentUser.id
                        }
                        
                        const res = await this.dataSourceMap['prePricingReview'].load(params)
                        
                        if (res.code === 1) {
                            // 判断是否是最后一级审批
                            if (res.data.isLastApproval) {
                                // 最后一级审批，调用最终提交逻辑
                                let confirmList = [...detailList]
                                const examineList = {
                                    detailList,
                                    xunjiaList,
                                    confirmList
                                }
                                this.setState({
                                    examineList
                                }, () => {
                                    this.confirmAgreeCurData()
                                })
                            } else {
                                // 非最后一级，刷新列表
                                this.showMessage('success', '成功', res.message)
                                this.setState({
                                    showDetailFlag: false,
                                    examineList: {
                                        detailList: [],
                                        xunjiaList: {},
                                        reQuoteList: [],
                                        confirmList: []
                                    },
                                    curEditData: {},
                                    showExamineButtonFlag: true,
                                    showReQuoteButtonFlag: true,
                                    agreeButtonLoading: false
                                }, () => {
                                    setTimeout(() => {
                                        document.body.style = ''
                                        this.getTableData()
                                    }, 500)
                                })
                            }
                        } else {
                            // 接口返回失败
                            this.setState({
                                agreeButtonLoading: false
                            })
                            this.showMessage('error', '提示', res.message)
                        }
                    } catch (error) {
                        this.setState({
                            agreeButtonLoading: false
                        })
                        this.showMessage('error', '错误', '审批接口调用失败：' + error.message)
                    }
                })
            },
            onCancel: () => {
                this.setState({
                    agreeButtonLoading: false
                })
            }
        })
    }
    // 驳回当前数据
    async refuseCurData() {
        const { haiju_xiangguandingjiajichuye, pricing_approval_record } = this.state.formMap
        const { currentUser, curEditData } = this.state
        // 驳回之前先做前置校验
        const checkData = await this.checkCurApprovalStatus()
        if (!checkData) {
            this.showMessage('error', '提示', '该审批流程已经被驳回或者审批完成，请返回重新刷新数据')
            return
        }
        // 现在的逻辑是，流程中间有任何一个人驳回数据状态都要回到待定价状态
        const { Input } = window.Next
        let rejectReason = ''
        const onChangeReason = (e) => {
            rejectReason = e
        }
        const content = (<div style={{ display: 'flex' }}>
            <div style={{ width: 120 }}>驳回理由：</div>
            <div style={{ flex: 1, width: 0 }}>
                <Input.TextArea
                    style={{ width: 250 }}
                    rows={2}
                    defaultValue={''}
                    onChange={onChangeReason}
                />
            </div>
        </div>)
        window.Next.Dialog.confirm({
            title: '提示',
            content,
            v2: true,
            okProps: {
                loading: this.state.agreeButtonLoading,
            },
            width: 500,
            onOk: async () => {
                if (rejectReason === '' || rejectReason === null) {
                    this.showMessage('error', '错误', '请输入驳回理由')
                    return Promise.reject()
                }
                this.setState({
                    agreeButtonLoading: true
                }, async () => {
                    let sApprovalData = _.cloneDeep(checkData)
                    const index = sApprovalData.approveDetail.findIndex(e => e.approvePerson === currentUser.id)
                    if (index > -1) {
                        let item = sApprovalData.approveDetail[index]
                        item.approveResult = '驳回'
                        item.approveTime = moment().format('YYYY-MM-DD HH:mm:ss')
                        item.rejectReason = rejectReason
                        sApprovalData.approveDetail[index] = item
                        const updateData = {
                            formId: pricing_approval_record,
                            id: sApprovalData._id,
                            data: {
                                approveDetail: sApprovalData.approveDetail,
                                dataStatus: '已过期'
                            }
                        }
                        const res = await this.dataSourceMap['updateFormData'].load(updateData)
                    }
                    const updateMainFormData = {
                        formId: haiju_xiangguandingjiajichuye,
                        id: curEditData.detail._id,
                        data: {
                            pricingState: '待定价',
                            approveIndex: 0, // 驳回审核阶段为0
                            dataAssociationId: ''
                        }
                    }
                    const updateRes = await this.dataSourceMap['updateFormData'].load(updateMainFormData)
                    if (updateRes.code === 200) {
                        this.setState({
                            showDetailFlag: false,
                            showExamineButtonFlag: true,
                            showReQuoteButtonFlag: true,
                            agreeButtonLoading: false
                        }, () => {
                            setTimeout(() => {
                                document.body.style = ''
                                this.getTableData()
                            }, 500)
                        })
                    }
                })

            },
            onCancel: () => {
                this.setState({
                    agreeButtonLoading: false
                })
            }
        })
    }
    onSearchDetailData(e) {
        this.setState({
            priceSearchMap: e
        }, () => {
            this.getDetailTableData(this.state.curEditData)
        })
    }
    // 处理定价详情页要查询的数据的参数
    // TODO 增加二次议价需求
    async dealDetailTableSearchParams(curEditData) {
        let queryParams = _.cloneDeep(this.state.priceDetailParams)
        const { haiju_caigoubaojiaxiangqing } = this.state.formMap
        queryParams.code = curEditData.packageNumber
        queryParams.inquiryNumber = curEditData.associatedInquiryNumber
        if (queryParams.isTwo) {
            // 二次议价做个前置条件
            let searchParams = _.cloneDeep(this.state.baseQueryParam)
            searchParams.formId = haiju_caigoubaojiaxiangqing
            searchParams.conditionFilter.conditions = [
                { conditionValues: [curEditData.associatedInquiryNumber], conditionOperator: "eq", field: "inquiryNumber" },
                { conditionValues: [2], conditionOperator: "ge", field: "quotationRound" },
            ]
            searchParams.fields = [{ field: 'inquiryNumber' }, { field: 'inquiryGoodsId' }]
            const searchRes = await this.dataSourceMap['queryFormData'].load(searchParams)
            if (searchRes.code === 200 && searchRes?.result?.records?.length > 0) {
                const goodsId = searchRes.result.records.map(e => e.inquiryGoodsId)
                const goodsIdListTwo = Array.from(new Set(goodsId))
                queryParams.goodsIdListTwo = [...goodsIdListTwo]
            }
        } else {
            queryParams.goodsIdListTwo = []
        }
        return queryParams
    }
    // TODO 增加二次议价需求
    // 处理客户类型价数据
    dealCustomerDataList(record) {
        let customerTypeData = []
        const { customerTypeManageList } = this.state
        if (record.customerTypeList && record.customerTypeList.length > 0) {
            for (const item of record.customerTypeList) {
                const list = customerTypeManageList.filter(e => e.customerTypeId === item.customerTypeId)
                if (list && list.length > 0) {
                    let obj = {
                        customerTypeId: item.customerTypeId,
                        customerTypeName: list[0].customerTypeName,
                        defaultScale: list[0].defaultScale,
                        defaultReferenceType: list[0].defaultReferenceType,
                        customerTypePrice: item.customerTypePrice, // 客户类型价
                        upRatio: item.upRatio,
                        _id: item._id
                    }
                    customerTypeData.push(obj)
                }
            }
        } else {
            // 此时表中没有客户类型价的数据
            for (const item of customerTypeManageList) {
                let finalOffer = record.finalOffer || 0
                let endBFinalPricing = record.endBFinalPricing || 0
                let customerTypePrice = 0
                if (item.defaultReferenceType === '采购价') {
                    // customerTypePrice = finalOffer === 0 ? 0 :
                    //     Number((finalOffer * (1 + item.defaultScale / 100)).toFixed(2))
                    if (finalOffer === 0) {
                        customerTypePrice = 0
                    } else {
                        const num = Decimal(finalOffer).mul(Decimal(1).add(Decimal(item.defaultScale).div(100)))
                        customerTypePrice = new Decimal(num).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
                    }
                } else {
                    // customerTypePrice = endBFinalPricing === 0 ? 0 :
                    //     Number((endBFinalPricing * (1 + item.defaultScale / 100)).toFixed(2))
                    if (endBFinalPricing === 0) {
                        customerTypePrice = 0
                    } else {
                        const num = Decimal(endBFinalPricing).mul(Decimal(1).add(Decimal(item.defaultScale).div(100)))
                        customerTypePrice = new Decimal(num).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
                    }
                }
                let obj = {
                    customerTypeId: item.customerTypeId,
                    customerTypeName: item.customerTypeName,
                    defaultScale: item.defaultScale,
                    defaultReferenceType: item.defaultReferenceType,
                    customerTypePrice, // 客户类型价
                    upRatio: item.defaultScale
                }
                customerTypeData.push(obj)
            }
        }
        return customerTypeData
    }
    // 获取详情页表格数据
    async getDetailTableData(curEditData) {
        let detailTableData = []
        this.setState({ detailTableLoading: true })
        const queryParams = await this.dealDetailTableSearchParams(curEditData)
        console.log('queryParams', queryParams)
        const { curXunJiaList } = this.state
        const tableRes = await this.dataSourceMap['goodsPriceDetail'].load(queryParams)
        if (tableRes.data) {
            if (tableRes.data.records && tableRes.data.records.length > 0) {
                this.setState({ detailTotalElements: tableRes.data.total })
                const tableList = tableRes.data.records
                const que = this.state.priceDetailParams
                const goodsIdList = tableList.map(e => e.goodsId)
                const productList = tableList.map(e => {
                    return {
                        goodsId: e.goodsId,
                        supplierId: e.finalSupplier ? e.finalSupplier : '',
                    }
                })
                const packageSupplierList = await this.queryPackageSupplierList(goodsIdList, productList)
                const goodsPricingDataList = await this.getGoodsPricingDataByGoodsId(goodsIdList, curEditData)
                const hasGoodsSpecsList = await this.queryGoodsSpecsByGoodsId(goodsIdList)
                let cesuanList = []
                for (let i = 0; i < tableList.length; i++) {
                    let item = tableList[i]
                    // 是否包含B端/C端
                    item.hasBSpecs = hasGoodsSpecsList.hasOwnProperty(item.goodsId) ? hasGoodsSpecsList[item.goodsId]['hasBSpecs'] : false
                    item.hasCSpecs = hasGoodsSpecsList.hasOwnProperty(item.goodsId) ? hasGoodsSpecsList[item.goodsId]['hasCSpecs'] : false
                    // 是否超过5%
                    item.isOverFive = false
                    // 处理供应商下拉框选项
                    const supplierOtherDataList = [
                        { label: '不确定供应商', value: 'NOT_CONFIRM', disabled: false },
                        { label: '再次报价', value: 'RE_QUOTE', disabled: false },
                    ]
                    const temp1 = packageSupplierList[item.goodsId] || []
                    const supplierBaseList = temp1.map(e => {
                        return {
                            label: e.supplierName,
                            value: e.supplierId,
                            // disabled: e.supplierStatus !== '正常'
                        }
                    }) // 标包下所有的供应商
                    let reSupplier = []
                    if (item.requotationSupplier && item.requotationSupplier.length > 0) {
                        reSupplier = item.requotationSupplier.split(',')
                    }
                    let goodsPricingList = []
                    if (goodsPricingDataList.hasOwnProperty(item.goodsId)) {
                        goodsPricingList = goodsPricingDataList[item.goodsId]
                    }
                    // 处理报价供应商字段
                    let supplierData = ''
                    if (reSupplier && reSupplier.length > 0) {
                        supplierData = 'RE_QUOTE'
                    } else if (item.isConfirmSupplier && item.isConfirmSupplier === '是') {
                        supplierData = 'NOT_CONFIRM'
                    }
                    if (supplierData === 'RE_QUOTE' || supplierData === 'NOT_CONFIRM') {
                        item.finalSupplier = ''
                        item.deliveriesRate = ''
                        item.InvoiceType = ''
                        item.finalOffer = ''
                        item.winningRounds = ''
                        item.oldBusinessPriceIncrease = '/'
                        item.finalCalculatePrice = '/'
                        item.grossMarginB = '/'
                        item.grossMarginC = '/'
                        item.price1 = '/'
                        item.price2 = '/'
                    } else {
                        // 第三种选项
                        if (item.finalSupplier && item.finalSupplier.length > 0) {
                            supplierData = item.finalSupplier
                        } else if (goodsPricingList.length > 0) {
                            // 这里如果没有确定的供应商，在报价中选择最低的报价供应商
                            if (this.state.pricingOprType !== 'PRICING_DETAIL' && this.state.pricingOprType !== 'APPROVE') {
                                const cItem = goodsPricingList[0]
                                supplierData = cItem.supplierId
                                item.finalSupplier = cItem.supplierId
                                item.deliveriesRate = cItem.deliveriesRate
                                item.InvoiceType = cItem.InvoiceType
                                item.finalOffer = cItem.supplierGoodsPrice
                                item.winningRounds = cItem.quotationCount || ''
                                // 同时计算下上阶段平台采购价同比增幅
                                let oldPurchasePrice = item['oldPurchasePrice'] === '/' ? 0 : item['oldPurchasePrice']
                                if (oldPurchasePrice === 0) {
                                    item['oldPurchasePriceIncrease'] = '/'
                                } else {
                                    item['oldPurchasePriceIncrease'] = (((item.finalOffer - oldPurchasePrice) / oldPurchasePrice * 100).toFixed(2)) + '%'
                                }
                                // 初始化赋值的时候也要同步计算下东和平台测算价，补税差，考虑税差
                                cesuanList.push({
                                    goodsCode: item.goodsId,
                                    supplierGoodsPrice: item.finalOffer,
                                    outputTaxRate: item.outputTaxRate,
                                    inputTaxRate: item.deliveriesRate
                                })
                            }
                        } else {
                            supplierData = ''
                            item.finalSupplier = ''
                            item.deliveriesRate = ''
                            item.InvoiceType = ''
                            item.finalOffer = ''
                            item.winningRounds = ''
                        }
                    }
                    // 客户类型价数据进行初始化
                    let customerTypeData = this.dealCustomerDataList(item)
                    // 开始处理东和备注字符串
                    let haiJuRemark = ''
                    let remarkStr = item.remark
                    if (remarkStr === '' || remarkStr === undefined || remarkStr === null) {
                        haiJuRemark = ''
                    } else {
                        const temp = JSON.parse(remarkStr)
                        if (Array.isArray(temp)) {
                            // const tempList = temp.filter(e => e.key === curXunJiaList.quotationProgress)
                            // if (tempList.length > 0) {
                            //     haiJuRemark = tempList[0].value
                            // }
                            // TODO 修改备注数据展示方式
                            const tempList = temp.sort((a, b) => b.key - a.key)
                            haiJuRemark = tempList[0].value
                        }
                    }
                    // 判定是否超过采购价5%
                    if (item['finalOffer'] && item['finalOffer'] > 0) {
                        if (item['endBFinalPricing'] !== '' && item['endBFinalPricing'] > 0) {
                            const percentA =  new Decimal(item['endBFinalPricing'])
                                .sub(item['finalOffer'])
                                .div(item['endBFinalPricing'])
                                .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
                                .toNumber()
                            console.log('percentA', percentA)
                            if (percentA > 0.05) {
                                item.isOverFive = true
                            }
                        }
                    }
                    let obj = {
                        id: item._id,
                        goodsIndex: ((que.currentPage - 1) * que.pageSize) + i + 1, // 商品序号
                        supplierData, // 针对供应商下拉选项要特殊处理
                        supplierDataList: [...supplierOtherDataList, ...supplierBaseList],
                        goodsPricingList,
                        customerTypeData, // 客户类型价数据
                        haiJuRemark, // 东和备注
                        reSupplier,
                        ...item
                    }
                    detailTableData.push(obj)
                }
                if (cesuanList && cesuanList.length > 0) {
                    const cesuanRes = await this.dataSourceMap['calculateSalePriceNew'].load({ goodsList: cesuanList })
                    if (cesuanRes.data && cesuanRes.data.length > 0) {
                        for (const item of detailTableData) {
                            for (const e of cesuanRes.data) {
                                if (item.goodsId === e.goodsCode) {
                                    item.finalCalculatePrice = e.lowestSalePrice
                                    item.price1 = e.price1
                                    item.price2 = e.price2
                                }
                            }
                        }
                    }
                }
                this.setState({ detailTableData: [...detailTableData], detailTableLoading: false })
            } else {
                this.setState({ detailTableData: [], detailTotalElements: 0, detailTableLoading: false })
            }
        } else {
            this.setState({ detailTableData: [], detailTotalElements: 0, detailTableLoading: false })
        }
    }
    // 获取最终报价结果
    async getQuoteList(goodsDetail) {
        const { goodsId } = goodsDetail
        const { associatedInquiryNumber } = this.state.curEditData
        const searchParams = {
            goodsCode: goodsId,
            inquiryNumber: associatedInquiryNumber,
            count: 3
        }
        const res = await this.dataSourceMap['getQuoteList'].load(searchParams)
        if (res.data && res.data.length) {
            return res.data
        } else {
            return []
        }
    }
    // 获取该商品所对应的标包下的供应商
    async queryPackageSupplierList(goodsIdList, productList = []) {
        let list = {}
        const searchParams = {
            ids: [...goodsIdList],
            productList: productList.length > 0 ? productList : []
        }
        const res = await this.dataSourceMap['queryPackageSupplierByProductCode'].load(searchParams)
        if (res.data) {
            list = res.data
        }
        console.log('list', list)
        return list
    }
    // 获取所有查询商品的报价最低详情列表
    async getGoodsPricingDataByGoodsId(goodsIdList, curEditData) {
        let list = {}
        const params = {
            inquiryNumber: curEditData.associatedInquiryNumber,
            goodsIdList
        }
        const res = await this.dataSourceMap['getQuoteListNew'].load(params)
        if (res.data && res.data.length > 0) {
            for (const item of res.data) {
                list[item.goodsId] = item.supplierInfoList || []
            }
        }
        return list
    }
    // 查询该商品是否包含B端和C端
    async queryGoodsSpecsByGoodsId(goodsIdList) {
        const params = {
            goodsIdList
        }
        let hasGoodsSpecsList = {}
        const res = await this.dataSourceMap['queryGoodsSpecsByGoodsId'].load(params)
        if (res.code === 200) {
            hasGoodsSpecsList = res.data.goodsSpecs
        }
        return hasGoodsSpecsList
    }
    // 获取供应商中标商品表中对应商品中标的数据
    async getWinningGoodsOfSupplier(goodsDetail) {
        const { associatedInquiryNumber } = this.state.curEditData
        const { haiju_commodity } = this.state.formMap
        const searchParams = {
            searchList: [
                {
                    formId: haiju_commodity,
                    conditions: [
                        { inquiryNumber: associatedInquiryNumber, winningBidGoodsId: goodsDetail.goodsId }
                    ]
                }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        let list = []
        if (res.hasOwnProperty(haiju_commodity)) {
            list = res[haiju_commodity]
        }
        return list
    }
    // 获取最低/最终测算价
    async calculateSalePrice(goodsDetail, winningPrice = null, winningSupplierName = null) {
        const { associatedInquiryNumber } = this.state.curEditData
        const { goodsId } = goodsDetail
        let searchParams = {
            goodsCode: goodsId,
            inquiryNumber: associatedInquiryNumber,
        }
        if (winningPrice !== null) {
            searchParams.winningPrice = winningPrice
        }
        if (winningSupplierName !== null) {
            searchParams.winningSupplierName = winningSupplierName
        }
        const res = await this.dataSourceMap['calculateSalePrice'].load(searchParams)
        if (res.success === true) {
            if (Object.keys(res.data).length > 0) {
                return res.data
            } else {
                return null
            }
        } else {
            return null
        }

    }
    // 点击定价时获取一些基础数据
    async getPriceDetailDataBase(goodsDetail) {
        const { customerTypeManage, haiju_shitiaojia, goodsSpecs, haiju_salesRecord, supplier, planSupply_supplier } = this.state.formMap
        const { associatedInquiryNumber } = this.state.curEditData
        const { goodsId } = goodsDetail
        const searchParams = {
            searchList: [
                { formId: customerTypeManage, conditions: [] }, // 获取客户类型基础数据
                { formId: haiju_shitiaojia, conditions: [{ goodsCode: goodsId }] }, // 获取最新市场价数据
                { formId: goodsSpecs, conditions: [{ goodsId, isSale: '是' }] }, // 获取商品规格信息
                { formId: haiju_salesRecord, conditions: [{ goodsId }] }, // 获取商品销售记录表，查询上一阶段销售价和采购价
                { formId: planSupply_supplier, conditions: [{ inquiryNumber: associatedInquiryNumber, inquiry_flag: '是' }] }, // 计划供应商列表
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        let customerTypeManageList = []
        let shiTiaoPriceList = []
        let goodsSpecsList = []
        let salesRecordList = null
        let salesBOrCRecordList = []
        let planSupplySupplierList = []
        let supplierIdList = []
        if (res.hasOwnProperty(customerTypeManage)) {
            customerTypeManageList = res[customerTypeManage]
        }
        // 处理最新市调价
        if (res.hasOwnProperty(haiju_shitiaojia)) {
            const list = res[haiju_shitiaojia]
            if (list.length > 0) {
                const otherList = list.sort((a, b) => {
                    let aTime = a.createTime
                    let bTime = b.createTime
                    if (a.hasOwnProperty('updateTime')) {
                        aTime = a.updateTime
                    }
                    if (b.hasOwnProperty('updateTime')) {
                        bTime = b.updateTime
                    }
                    return moment(bTime).valueOf() - moment(aTime).valueOf()
                })
                if (otherList && otherList.length) {
                    shiTiaoPriceList = [otherList[0]]
                }
            }
        }
        // 处理商品规格表数据
        if (res.hasOwnProperty(goodsSpecs)) {
            goodsSpecsList = res[goodsSpecs]
        }
        // 计划供应商列表
        if (res.hasOwnProperty(planSupply_supplier)) {
            planSupplySupplierList = res[planSupply_supplier]
            const aList = planSupplySupplierList.map(e => e.supplier_code)
            supplierIdList = aList.filter(e => e)
        }

        // 处理上阶段售价情况
        if (res.hasOwnProperty(haiju_salesRecord)) {
            if (res[haiju_salesRecord] && res[haiju_salesRecord].length > 0) {
                const curList = res[haiju_salesRecord]
                const arrA = curList.filter(e => e.salesChannels === 'B端').sort((a, b) => moment(b.createTime).valueOf() - moment(a.createTime).valueOf())
                const arrB = curList.filter(e => e.salesChannels === 'C端').sort((a, b) => moment(b.createTime).valueOf() - moment(a.createTime).valueOf())
                if (arrA.length) {
                    salesRecordList = arrA[0]
                    salesBOrCRecordList.push(arrA[0])
                }
                if (arrB.length) {
                    salesBOrCRecordList.push(arrB[0])
                }
                if (salesRecordList.supplierId) {
                    supplierIdList.push(salesRecordList.supplierId)
                }
            }
        }
        // 集中抽取供应商列表数据
        if (supplierIdList && supplierIdList.length) {
            const idList = Array.from(new Set(supplierIdList))
            const searchParamsA = {
                searchList: [
                    { formId: supplier, conditions: idList.map(e => ({ supplierId: e })) }
                ]
            }
            const supplierRes = await this.getMoreTableData(searchParamsA)
            if (supplierRes.hasOwnProperty(supplier)) {
                const list = supplierRes[supplier]
                if (list && list.length) {
                    if (salesRecordList && salesRecordList.supplierId) {
                        const a = list.filter(e => e.supplierId === salesRecordList.supplierId)
                        salesRecordList.supplierName = a && a.length ? a[0].supplierName : ''
                    }
                    for (const item of planSupplySupplierList) {
                        const b = list.filter(e => e.supplierId === item.supplier_code)
                        item.supplierName = b && b.length ? b[0].supplierName : ''
                    }
                }
            }
        }
        return { customerTypeManageList, shiTiaoPriceList, goodsSpecsList, salesRecordList, salesBOrCRecordList, planSupplySupplierList }
    }
    // 定价弹窗公共处理函数
    async dealSelectGoodsDetail(e, oprType) {
        const { curEditData, curXunJiaList } = this.state
        const { goodsDetail, detail: curPriceDetail } = e
        let customerTypeList = []
        if (curPriceDetail.hasOwnProperty('customerTypeList') && curPriceDetail.customerTypeList && curPriceDetail.customerTypeList.length > 0) {
            customerTypeList = [...curPriceDetail.customerTypeList]
        }
        let {
            customerTypeManageList,
            shiTiaoPriceList,
            goodsSpecsList,
            salesRecordList,
            planSupplySupplierList,
            salesBOrCRecordList
        } = await this.getPriceDetailDataBase(goodsDetail)
        // 处理客户类型列表 ===START===
        if (customerTypeList && customerTypeList.length) {
            customerTypeList.forEach(e => {
                const item = customerTypeManageList.find(a => a.customerTypeId === e.customerTypeId)
                if (item) {
                    e.customerTypeName = item.customerTypeName
                }
            })
        } else {
            customerTypeList = customerTypeManageList.map(e => {
                return {
                    customerTypeId: e.customerTypeId,
                    customerTypeName: e.customerTypeName,
                    customerTypePrice: '',
                    upRatio: ''
                }
            })
        }
        // 处理客户类型列表 ===END===
        // 处理各种规格商品定价 ===START===
        const { endBFinalPricing, cEndFinalPricing, isBPricing, isCPricing } = curPriceDetail
        const finalPriceList = []
        if (goodsSpecsList && goodsSpecsList.length > 0) {
            for (const item of goodsSpecsList) {
                if (item.salesChannels && item.salesChannels.length > 0) {
                    for (const e of item.salesChannels) {
                        let salePrice = ''
                        let isPricing = ''
                        if (e === 'B端') {
                            salePrice = endBFinalPricing || ''
                            isPricing = isBPricing ? isBPricing === '否' : false
                        }
                        if (e === 'C端') {
                            salePrice = cEndFinalPricing || ''
                            isPricing = isCPricing ? isCPricing === '否' : false
                        }
                        let obj = {
                            id: e,
                            salesChannel: e,
                            specificationDescription: item.specificationDescription,
                            measurementUnit: item.measurementUnit,
                            isPricing,
                            salePrice,
                            prevIncrease: '',
                            grossProfit: '',
                            grossProfitChange: ''
                        }
                        finalPriceList.push(obj)
                    }
                }
            }
        }
        const bItemIndex = finalPriceList.findIndex(e => e.salesChannel === 'B端')
        if (bItemIndex > -1) {
            const item = finalPriceList[bItemIndex]
            finalPriceList.splice(bItemIndex, 1)
            finalPriceList.unshift(item)
        }
        // 处理各种规格商品定价 ===END===
        // 处理报价结果 ===START===
        const priceResultList = await this.getQuoteList(goodsDetail)
        // 处理报价结果 ===END===
        // 该商品对应的标包下的供应商
        const packageSupplierList = await this.queryPackageSupplierList(goodsDetail)
        // 开始处理每一轮次的备注
        let remark = ''
        let remarkStr = curPriceDetail.remark
        if (remarkStr === '' || remarkStr === undefined || remarkStr === null) {
            remark = ''
        } else {
            const temp = JSON.parse(remarkStr)
            if (Array.isArray(temp)) {
                const tempList = temp.filter(e => e.key === curXunJiaList.quotationProgress)
                if (tempList.length > 0) {
                    remark = tempList[0].value
                }
            }
        }
        // 处理确认供应商列表 ===START===
        // 先看是否有确认供应商，没有的话默认选择中标供应商表中对应数据，下拉选择列表中为供应商报价最低/次低价列表
        let confirmSupplierList = {
            reQuoteFlag: false,
            finalSupplier: curPriceDetail.finalSupplier || '',
            winningBidPrice: curPriceDetail.finalOffer || '',
            deliveriesRate: curPriceDetail.deliveriesRate || 0,
            InvoiceType: curPriceDetail.InvoiceType || '',
            winningRounds: curPriceDetail.winningRounds || '', // 当前中标轮次进行记录
            isConfirmSupplier: curPriceDetail.isConfirmSupplier || '否', // 不确定供应商 是 不确定供应商 否 确定供应商/再次报价
            attachments: [], // 供应商提供的新增的附件的字段
            hjAttachments: [], // 东和要提供的附件
            remark, // 东和要提供的备注
            requotationSupplier: []
        }
        if (curPriceDetail.hjAttachments && curPriceDetail.hjAttachments.length > 0) {
            let picList = {}
            let hjAttachments = []
            const picParams = {
                names: [...curPriceDetail.hjAttachments]
            }
            const picRes = await this.dataSourceMap['getFileUrlList'].load(picParams)
            if (picRes.code === 200) {
                picList = picRes.result
                for (const info of curPriceDetail.hjAttachments) {
                    let obj = this.dealAnnexName(picList[info], info)
                    hjAttachments.push(obj)
                }
            }
            confirmSupplierList.hjAttachments = [...hjAttachments]
        }
        const annex = priceResultList.filter(e => e.supplierId === curPriceDetail.finalSupplier)
        if (annex && annex.length) {
            const curItem = annex[0]
            confirmSupplierList.attachments = curItem.attachments || []
        }
        let finalLowestSalePrice = []
        if (curEditData.initiateARebid === '是') {
            if (curPriceDetail.hasOwnProperty('requotationSupplier') && curPriceDetail.requotationSupplier) {
                confirmSupplierList.reQuoteFlag = true
            }
        }

        if (!confirmSupplierList.reQuoteFlag) {
            if (!curPriceDetail.hasOwnProperty('finalSupplier') || !curPriceDetail.finalSupplier) {
                if (!curPriceDetail.hasOwnProperty('isConfirmSupplier')) {
                    if (oprType !== 'PRICING_DETAIL' && priceResultList.length > 0) {
                        const list = priceResultList[0]
                        confirmSupplierList.finalSupplier = list.supplierId
                        confirmSupplierList.winningBidPrice = list.minSupplierGoodsPrice
                        confirmSupplierList.deliveriesRate = list.deliveriesRate
                        confirmSupplierList.InvoiceType = list.InvoiceType
                        confirmSupplierList.winningRounds = list.quotationCount
                    }
                }
            }
        }

        // 初始化的时候获取最终测算销售价
        if (confirmSupplierList.finalSupplier) {
            let sName = ''
            const sNameList = priceResultList.filter(e => e.supplierId === confirmSupplierList.finalSupplier)
            if (sNameList && sNameList.length) {
                sName = sNameList[0].supplierName
            }
            const finalLowestSalePriceList = await this.calculateSalePrice(goodsDetail, confirmSupplierList.winningBidPrice, sName)
            if (finalLowestSalePriceList) {
                finalLowestSalePrice = [finalLowestSalePriceList]
            }
        }
        if (curEditData.initiateARebid === '是') {
            if (curPriceDetail.requotationSupplier) {
                confirmSupplierList.requotationSupplier = curPriceDetail.requotationSupplier.split(',')
            }
        }
        // 处理确认供应商列表 ===END===
        // 获取最低测算销售价 ===START===
        const lowestPrice = await this.calculateSalePrice(goodsDetail)
        let lowestSalePrice = []
        if (lowestPrice) {
            lowestSalePrice = [lowestPrice]
        }
        // 获取最低测算销售价 ===END===
        // 处理上阶段售价情况 ===START===
        if (salesRecordList) {
            const numA = confirmSupplierList.winningBidPrice || 0
            const numB = salesRecordList.purchasePrice || 0
            let growthRate = 0
            if (numB !== 0) {
                growthRate = ((numA - numB) / numB * 100).toFixed(2)
            }
            salesRecordList.growthRate = growthRate
        }
        let objA = { salesBOrCRecordList, confirmSupplierList, goodsDetail }
        // 初始化计算B端和C端毛利率
        for (let item of finalPriceList) {
            const { prevIncrease, grossProfit } = this.getCalculateGrossProfitData(item, objA)
            item.prevIncrease = prevIncrease
            item.grossProfit = grossProfit
        }
        // 处理上阶段售价情况 ===END===
        let obj = {
            goodsDetail,
            curPriceDetail,
            customerTypeList,
            finalPriceList,
            salesRecordList,
            priceResultList,
            planSupplySupplierList,
            confirmSupplierList,
            lowestSalePrice,
            finalLowestSalePrice,
            salesBOrCRecordList,
            packageSupplierList,
            shiTiaoPriceList: [...shiTiaoPriceList]
        }
        this.setState({
            showPriceFlag: true,
            showPriceType: oprType,
            priceDetailList: { ...obj }
        })
    }
    // 点击详情查看单条报价详情
    async onViewGoodsPriceDetail(e) {
        const oprType = 'PRICING_DETAIL'
        await this.dealSelectGoodsDetail(e, oprType)
    }
    // 点击定价按钮，处理数据，显示弹窗
    async onSelectGoodsPrice(e) {
        const oprType = 'PRICING'
        await this.dealSelectGoodsDetail(e, oprType)
    }
    // 定价弹窗确定按钮
    async onSubmitPriceData() {
        // 开始组装数据进行提交
        // 查看详情的时候只关闭弹窗，不进行数据提交
        if (this.state.showPriceType === 'PRICING_DETAIL') {
            this.closeGoodsPrice()
            return
        }
        const { haiju_goodsPricingDetails } = this.state.formMap
        const {
            goodsDetail,
            curPriceDetail,
            customerTypeList,
            finalPriceList,
            priceResultList,
            finalLowestSalePrice,
            confirmSupplierList
        } = this.state.priceDetailList
        const { curXunJiaList } = this.state
        if (confirmSupplierList.isConfirmSupplier !== '是') {
            if (!confirmSupplierList.reQuoteFlag) {
                if (!confirmSupplierList.finalSupplier) {
                    this.showMessage('error', '错误', '请选择供应商再提交数据')
                    return
                }
            }
        }
        let submitData = {
            endBFinalPricing: '', // B端最终定价
            cEndFinalPricing: '', // C端最终定价
            isBPricing: '', // B端是否定价
            isCPricing: '', // C端是否定价
            customerTypeList: [], // 客户类型价列表
            salesPriceIncrease: '', // 销售价同比增幅
            minimumSellingPrice: '', // 最低测算销售价 => 这个暂时不存了，在详情中查看
            lowestQuotation: '', // 最低报价
            lowestQuotationSupplier: '', // 最低报价供应商
            finallyCalculateSellingPrice: '', // 最终测算销售价
            finalOffer: '', // 最终报价
            finalSupplier: '', // 最终供应商
            deliveriesRate: '', // 进项税率
            InvoiceType: '', // 中标发票类型
            winningRounds: '', // 中标轮次
            requotationSupplier: '', // 再报价供应商
            isConfirmSupplier: confirmSupplierList.isConfirmSupplier || '否', // 本次定价是否确认供应商
            hjAttachments: [], // 东和方要提供的附件
            remark: '', // 东和方要提供的备注
        }
        if (confirmSupplierList.isConfirmSupplier !== '是') {
            // 开始组装备注字段
            let otherRemark = []
            let remarkStr = curPriceDetail.remark
            if (remarkStr === '' || remarkStr === undefined || remarkStr === null) {
                otherRemark = []
            } else {
                const temp = JSON.parse(remarkStr)
                if (Array.isArray(temp)) {
                    otherRemark = temp
                }
            }
            const tempRemarkIndex = otherRemark.findIndex(e => e.key === curXunJiaList.quotationProgress)
            if (tempRemarkIndex >= 0) {
                otherRemark[tempRemarkIndex] = { key: curXunJiaList.quotationProgress, value: confirmSupplierList.remark }
            } else {
                otherRemark.push({ key: curXunJiaList.quotationProgress, value: confirmSupplierList.remark })
            }
            submitData.remark = JSON.stringify(otherRemark)
            if (!confirmSupplierList.reQuoteFlag) {
                // B端/C端最终定价 ====START====
                const bItem = finalPriceList.filter(e => e.salesChannel === 'B端')
                if (bItem && bItem.length) {
                    const item = bItem[0]
                    submitData.isBPricing = item.isPricing ? '否' : '是'
                    submitData.endBFinalPricing = item.salePrice
                    submitData.salesPriceIncrease = item.prevIncrease
                }
                const cItem = finalPriceList.filter(e => e.salesChannel === 'C端')
                if (cItem && cItem.length) {
                    const item = cItem[0]
                    submitData.isCPricing = item.isPricing ? '否' : '是'
                    submitData.cEndFinalPricing = item.salePrice
                }
                // B端/C端最终定价 ====END====
                // 客户类型价 ====START====
                if (customerTypeList && customerTypeList.length) {
                    submitData.customerTypeList = customerTypeList.map(e => {
                        let obj = {
                            customerTypeId: e.customerTypeId,
                            customerTypePrice: e.customerTypePrice,
                            upRatio: e.upRatio
                        }
                        if (e.hasOwnProperty('_id')) {
                            obj._id = e._id
                        }
                        return obj
                    })
                }
                // 客户类型价 ====END====
                // 最低报价 ====START====
                if (priceResultList && priceResultList.length) {
                    const item = priceResultList[0]
                    submitData.lowestQuotation = item.minSupplierGoodsPrice
                    submitData.lowestQuotationSupplier = item.supplierId
                }
                // 最低报价 ====END====
                // 最终测算销售价 ====START====
                if (finalLowestSalePrice && finalLowestSalePrice.length) {
                    submitData.finallyCalculateSellingPrice = finalLowestSalePrice[0].lowestSalePrice
                }
                // 最终测算销售价 ====END====
            }
            // 最终报价 ====START====
            if (!confirmSupplierList.reQuoteFlag) {
                submitData.finalOffer = confirmSupplierList.winningBidPrice
                submitData.finalSupplier = confirmSupplierList.finalSupplier
                submitData.deliveriesRate = confirmSupplierList.deliveriesRate
                submitData.InvoiceType = confirmSupplierList.InvoiceType
                submitData.winningRounds = confirmSupplierList.winningRounds
                // submitData.remark = confirmSupplierList.remark
                // 附件处理
                if (confirmSupplierList.hjAttachments && confirmSupplierList.hjAttachments.length) {
                    submitData.hjAttachments = confirmSupplierList.hjAttachments.map(e => e.fileName)
                }
            } else {
                submitData.requotationSupplier = confirmSupplierList.requotationSupplier && confirmSupplierList.requotationSupplier.length ?
                    confirmSupplierList.requotationSupplier.join(',') : ''
            }
        }
        // 最终报价 ====END====
        const updateData = {
            formId: haiju_goodsPricingDetails,
            id: curPriceDetail._id,
            data: { ...submitData }
        }
        const updateRes = await this.dataSourceMap['updateFormData'].load(updateData)
        if (updateRes.code === 200) {
            const { showExamineButtonFlag, showReQuoteButtonFlag } = await this.updateIsReQuote()
            this.setState({
                showExamineButtonFlag,
                showReQuoteButtonFlag
            }, () => {
                this.closeGoodsPrice()
                this.getDetailTableData(this.state.curEditData)
            })
        }
    }
    // 更新商品定价基础页中是否再报价字段
    async updateIsReQuote() {
        const { priceListNumber } = this.state.curEditData
        const { haiju_xiangguandingjiajichuye, haiju_goodsPricingDetails } = this.state.formMap
        const aConditions = [
            { priceListNumber }
        ]
        const searchParams = {
            searchList: [
                {
                    formId: haiju_goodsPricingDetails,
                    conditions: [...aConditions],
                    showField: ['priceListNumber', 'inquiryNumber', 'requotationSupplier', 'finalSupplier']
                }
            ]
        }
        let list = []
        const res = await this.getMoreTableData(searchParams)
        if (res.hasOwnProperty(haiju_goodsPricingDetails)) {
            list = [...res[haiju_goodsPricingDetails]]
        }
        if (list.length) {
            const flag = list.filter(e => e.requotationSupplier && e.requotationSupplier.length > 0).length > 0
            const initiateARebid = flag ? '是' : '否'
            const updateData = {
                formId: haiju_xiangguandingjiajichuye,
                id: this.state.curEditData.detail._id,
                data: {
                    initiateARebid
                }
            }
            const updateRes = await this.dataSourceMap['updateFormData'].load(updateData)
            if (updateRes.code === 200) {
                let record = { ...this.state.curEditData }
                record.initiateARebid = initiateARebid
                this.setState({ curEditData: record })
                return this.dealShowPricingButtonFlag(record)
            }
        }
    }
    // 关闭定价弹窗
    closeGoodsPrice() {
        this.setState({
            showPriceFlag: false,
            priceDetailList: {
                goodsDetail: {}, // 商品详情
                curPriceDetail: {}, // 当前报价详情
                customerTypeList: [], // 客户类型价详情
                finalPriceList: [], // 最终定价List
                shiTiaoPriceList: [], // 最新市场价
                saleRecordList: {}, // 销售记录List
                priceResultList: [], // 报价结果表
                confirmSupplierList: {}, // 确认供应商列表
                planSupplySupplierList: [], // 计划供应商列表
                lowestSalePrice: [], // 最低测算销售价
                finalLowestSalePrice: [], // 最终测算销售价
                salesBOrCRecordList: [], // B端C端上阶段销售价格
                packageSupplierList: [], // 该商品对应的所有标包下的供应商
            }
        })
    }
    // 二次报价
    async secondaryQuotation() {
        const { detailList, xunjiaList } = await this.getCommonDataA()
        let reQuoteList = []
        if (detailList && detailList.length) {
            for (const item of detailList) {
                if (item.requotationSupplier && item.requotationSupplier.length > 0) {
                    // 再报价供应商的数据
                    reQuoteList.push(item)
                }
            }
        }
        if (reQuoteList.length) {
            this.setState({
                examineList: {
                    detailList,
                    xunjiaList,
                    reQuoteList,
                },
                showQuotationTimeFlag: true,
                reQuoteTime: []
            })
        }
    }
    // 提交审核数据
    async submitApprovalData(curEditData, pricingState) {
        console.log('curEditData', curEditData)
        const { detail: { associatedInquiryNumber, priceListNumber } } = curEditData
        const { haiju_xiangguandingjiajichuye, pricing_approval_record } = this.state.formMap
        const { userApproveList } = this.state
        // 这里边要加一个字段，审批数据关联字段
        const dataAssociationId = `AP_${moment().valueOf()}`
        const updateData = {
            formId: haiju_xiangguandingjiajichuye,
            id: curEditData.id,
            data: {
                pricingState,
                dataAssociationId,
                approveIndex: 1, // 待审核提交审核阶段为1，驳回审核阶段为0
                abortReason: ''
            }
        }
        const approvalList = userApproveList.filter(e => e.approveIndex === 1)
        const approvalPerson = approvalList[0].approvePerson.split(',')
        const approveDetail = approvalPerson.map((e, index) => {
            return {
                approvePerson: e,
            }
        })
        // 要新增的流程审批数据
        const addApprovalData = {
            priceListNumber,
            inquiryNumber: associatedInquiryNumber,
            approveIndex: 1,
            dataStatus: '未过期',
            dataAssociationId,
            approveDetail
        }
        const addData = {
            formId: pricing_approval_record,
            data: { ...addApprovalData }
        }
        const res = await Promise.all([
            this.dataSourceMap['updateFormData'].load(updateData),
            this.dataSourceMap['addFormData'].load(addData)
        ])
        if (res[0].code === 200 && res[1].code === 200) {
            this.setState({
                showDetailFlag: false,
                showExamineButtonFlag: true,
                showReQuoteButtonFlag: true,
                agreeButtonLoading: false
            }, () => {
                setTimeout(() => {
                    document.body.style = ''
                    this.getTableData()
                }, 500)
            })
        }
    }
    // 提交审核数据 该条数据变为待审核状态
    async submitCurData(pricingState = '待审核') {
        const { haiju_xiangguandingjiajichuye, haiju_goodsPricingDetails } = this.state.formMap
        const content = '确定要提交审核？'
        const { curEditData } = this.state
        // 提交审核前先进行数据校验
        // 校验确定供应商的数量和要定价的商品数量是否一致，如果不一致，则不能进行数据提交
        if (pricingState === '待审核') {
            const aConditions = [
                { priceListNumber: curEditData.priceListNumber }
            ]
            const searchParams = {
                searchList: [
                    {
                        formId: haiju_goodsPricingDetails,
                        conditions: [...aConditions],
                        showField: ['priceListNumber', 'inquiryNumber', 'requotationSupplier', 'finalSupplier', 'isConfirmSupplier', 'isConfirmPricing']
                    }
                ]
            }
            let list = []
            const res = await this.getMoreTableData(searchParams)
            if (res.hasOwnProperty(haiju_goodsPricingDetails)) {
                list = [...res[haiju_goodsPricingDetails]]
            }
            if (list.length) {
                const data = list.filter(e => e.isConfirmPricing === '是')
                if (data.length !== list.length) {
                    this.showMessage('error', '错误', '该定价单还有部分商品没有定价，不能提交审核')
                    return
                }
            } else {
                this.showMessage('error', '错误', '暂时没有要提交审核的数据，不能提交审核')
                return
            }
        }
        window.Next.Dialog.confirm({
            title: '提示',
            content,
            v2: true,
            okProps: {
                loading: this.state.agreeButtonLoading,
            },
            width: 500,
            onOk: async () => {
                this.setState({
                    agreeButtonLoading: true
                }, async () => {
                    await this.submitApprovalData(curEditData, pricingState)
                })
            },
            onCancel: () => {
                this.setState({
                    agreeButtonLoading: false
                })
            }
        })


    }
    // 渲染详情页头部详情
    renderDetailJSX() {
        const { RenderDetailHeader, RenderDetailTable } = window.HaijuCommodityPricing
        const { curEditData, detailTableData, priceSearchMap } = this.state
        return (<div>
            <RenderDetailHeader curEditData={curEditData}></RenderDetailHeader>
            <RenderDetailTable detailTableData={detailTableData}
                               curEditData={curEditData}
                               priceSearchMap={priceSearchMap}
                               onSearchDetailData={this.onSearchDetailData}
                               onViewGoodsPriceDetail={this.onViewGoodsPriceDetail}
                               onSelectGoodsPrice={this.onSelectGoodsPrice}></RenderDetailTable>
        </div>)
    }
    // 渲染定价详情List
    renderPricingDetail() {
        return (<div>
            {/*渲染定价详情头部信息*/}
            {this.RenderPricingHeaderJSXData()}
            {/*渲染定价搜索数据*/}
            {this.RenderPricingSearchJSXData()}
            {/*渲染定价详情表格信息*/}
            {this.RenderPricingTableJSXData()}
        </div>)
    }
    // 渲染客户类型价对话框
    renderCustomerDialogData() {
        return (<div>
            {this.RenderCurCustomerTypeDataJSX()}
        </div>)
    }
    // 客户类型价确认
    onConfirmCurCustomerData() {
        this.setState({
            showCustomerDialogFlag: false,
            customerTypeList: []
        })
    }
    // 客户类型价取消
    onCancelCurCustomerData() {
        this.setState({
            showCustomerDialogFlag: false,
            customerTypeList: []
        })
    }
    // 计算销售价同比增幅和最终毛利率
    getCalculateGrossProfitData(record, priceDetailList) {
        let prevIncrease = null
        let grossProfit = null
        const { salesBOrCRecordList, confirmSupplierList, goodsDetail } = priceDetailList
        const shangSalesList = salesBOrCRecordList.filter(e => e.salesChannels === record.salesChannel)
        let shangSales = null
        if (shangSalesList && shangSalesList.length) {
            // 上阶段B端/C端销售价
            shangSales = shangSalesList[0]
            if (shangSales.salesPrice && record.salePrice) {
                prevIncrease = ((record.salePrice - shangSales.salesPrice) / shangSales.salesPrice * 100).toFixed(2)
            }
        }
        // 开始计算毛利率
        const deliveriesRate = confirmSupplierList.deliveriesRate // 进项税率即中标税率
        const outputTaxRate = goodsDetail.outputTaxRate // 销项税率
        const salePrice = record.salePrice || 0 // 销售价
        const winningBidPrice = confirmSupplierList.winningBidPrice || 0 // 采购价
        if (deliveriesRate === outputTaxRate) {
            // 销项和进项一致的情况
            //（销售价-采购价）/销售价
            if (salePrice) {
                grossProfit = ((salePrice - winningBidPrice) / salePrice * 100).toFixed(2)
            }
        } else {
            // 销项和进项不一致的情况
            // 毛利率=(销售价/(1+销项税率)-采购价/(1+进项税率)) / (销售价/(1+销项税率))
            // const numA = (salePrice / (1 + (outputTaxRate / 100))) - (winningBidPrice / (1 + deliveriesRate / 100))
            // const numB = (salePrice / (1 + (outputTaxRate / 100)))
            const numA = salePrice - winningBidPrice
            const numB = salePrice
            if (numB === 0 || !isNaN(parseFloat(numA)) || !isNaN(parseFloat(numB))) {
                grossProfit = null
            } else {
                grossProfit = (numA / numB * 100).toFixed(2)
            }
        }
        return { prevIncrease, grossProfit }
    }
    // 计算销售价同比增幅和最终毛利率
    async calculateGrossProfit(record) {
        const { salesBOrCRecordList, confirmSupplierList, goodsDetail } = this.state.priceDetailList
        const obj = { salesBOrCRecordList, confirmSupplierList, goodsDetail }
        const { prevIncrease, grossProfit } = this.getCalculateGrossProfitData(record, obj)
        let priceDetailList = { ...this.state.priceDetailList }
        let finalPriceList = priceDetailList.finalPriceList
        let index = finalPriceList.findIndex(e => e.salesChannel === record.salesChannel)
        record.prevIncrease = prevIncrease
        record.grossProfit = grossProfit
        finalPriceList[index] = record
        priceDetailList.finalPriceList = finalPriceList
        this.setState({ priceDetailList })
    }
    async onWinningPriceDataChange(data) {
        console.log('data', data)
        let priceDetailList = { ...this.state.priceDetailList }
        let { goodsDetail, customerTypeList, finalPriceList, packageSupplierList, salesRecordList } = priceDetailList
        priceDetailList.confirmSupplierList = data
        // 计算上阶段采购价同比增幅
        if (salesRecordList) {
            const numA = data.winningBidPrice || 0
            const numB = salesRecordList.purchasePrice || 0
            let growthRate = 0
            if (numB !== 0) {
                growthRate = ((numA - numB) / numB * 100).toFixed(2)
            }
            salesRecordList.growthRate = growthRate
            priceDetailList['salesRecordList'] = salesRecordList
        }
        this.setState({
            priceDetailList
        }, async () => {
            let sName = ''
            let finalLowestSalePrice = []
            const sNameList = packageSupplierList.filter(e => e.supplierId === data.finalSupplier)
            if (sNameList && sNameList.length) {
                sName = sNameList[0].supplierName
            }
            const finalLowestSalePriceList = await this.calculateSalePrice(goodsDetail, data.winningBidPrice, sName)
            if (finalLowestSalePriceList) {
                finalLowestSalePrice = [finalLowestSalePriceList]
            }
            priceDetailList.finalLowestSalePrice = finalLowestSalePrice
            // 开始计算销售价上浮比例
            const bPriceList = finalPriceList.filter(e => e.salesChannel === 'B端')
            if (bPriceList.length) {
                const bPrice = bPriceList[0].salePrice || 0
                const purchasePrice = data.winningBidPrice
                const num = this.dealPriceRatioData(purchasePrice, bPrice)
                for (const item of customerTypeList) {
                    item.upRatio = num
                }
                priceDetailList['customerTypeList'] = [...customerTypeList]
            }
            this.setState({ priceDetailList })
        })

    }
    // 定价弹窗数据发生改变
    async onPriceDataChange(type, data, isCalculation, isReset) {
        // isCalculation 是否计算最终测算价
        let priceDetailList = { ...this.state.priceDetailList }
        // 置空最终测算销售价
        if (isReset) {
            priceDetailList.finalLowestSalePrice = []
            if (priceDetailList.salesRecordList) {
                priceDetailList.salesRecordList.growthRate = ''
            }
        }
        priceDetailList[type] = data
        this.setState({ priceDetailList })
    }
    // 计算销售价上浮比例数据
    dealPriceRatioData(purchasePrice, num) {
        let outputNum = null
        if (purchasePrice === 0 || num === 0) {
            outputNum = null
        }
        // outputNum = Number(((num - purchasePrice) / purchasePrice * 100).toFixed(2))
        const numA = Decimal(num).sub(purchasePrice)
        const numB = Decimal(numA).div(purchasePrice).mul(100)
        outputNum = new Decimal(numB).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
        return outputNum
    }
    // 定价金额发生改变触发的操作
    onSalePriceChange(e, flag, bPriceData) {
        let priceDetailList = { ...this.state.priceDetailList }
        let { customerTypeList, confirmSupplierList } = priceDetailList
        if (flag) {
            for (let item of customerTypeList) {
                item.customerTypePrice = bPriceData.salePrice
                // 开始计算销售价上浮比例
                if (confirmSupplierList.finalSupplier) {
                    const num = this.dealPriceRatioData(confirmSupplierList.winningBidPrice, item.customerTypePrice)
                    item.upRatio = num
                }
            }
        }
        priceDetailList.customerTypeList = [...customerTypeList]
        priceDetailList.finalPriceList = [...e]
        this.setState({ priceDetailList })
    }
    // 匹配文件类型
    getFileClass(fName) {
        const OFFICE_REGEXP =
            /\.(xlsx|pptx|docx|pdf|doc|ppt|xls|zip|rar|csv|txt)/i;
        const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
        const VIDEO_REGEXP =
            /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;
        const AUDIO_REGEXP = /\.(mp3|wma|wav|flac|ogg|ape)/i;
        var fSuffix = fName;
        if (fName.indexOf(".") > 0) {
            fSuffix = fName.substring(fName.lastIndexOf("."));
        }
        fSuffix = fSuffix.toLowerCase();
        if (IMAGE_REGEXP.test(fSuffix)) {
            return "image";
        } else if (OFFICE_REGEXP.test(fSuffix)) {
            fSuffix = fSuffix.toLowerCase();
            return fSuffix.substring(1);
        } else if (VIDEO_REGEXP.test(fSuffix)) {
            return "video";
        } else if (AUDIO_REGEXP.test(fSuffix)) {
            return "audio";
        } else {
            return "other";
        }
    }
    // 查看附件
    async viewAnnex(data) {

        let picList = {}
        const picParams = {
            names: [...data]
        }
        const picRes = await this.dataSourceMap['getFileUrlList'].load(picParams)
        if (picRes.code === 200) {
            picList = picRes.result
            const annex = data[0]
            const type = this.getFileClass(annex)
            const annexUrl = picList[annex]
            if (type === 'pdf') {
                window.open(annexUrl, '_blank')
            } else if (type === 'image') {
                const dialog = window.Next.Dialog.show({
                    title: '查看附件',
                    v2: true,
                    width: 700,
                    content: (<div style={{ width: '100%', height: '100%' }}>
                        <img src={annexUrl} width={'100%'} height={'auto'} alt="" />
                    </div>),
                    footer: false,
                    onOk: () => {

                    }
                })
            } else {
                const dialog = window.Next.Dialog.confirm({
                    title: '查看附件',
                    v2: true,
                    content: (<div>
                        该附件暂时不支持预览，是否下载附件
                    </div>),
                    onOk: () => {
                        fetch(annexUrl).then(
                            res => res.blob()
                        ).then(blob => {
                            let a = document.createElement('a');
                            let url = window.URL.createObjectURL(blob);
                            const name = annex
                            const index = name.indexOf('/')
                            const name1 = name.substring(index + 1)
                            const fileName = name1.replace(/_\d+/g, '')
                            a.href = url;
                            a.download = fileName;
                            a.click();
                            window.URL.revokeObjectURL(url);
                            dialog.hide()
                        })
                    },
                    onCancel: () => {

                    }
                })
            }
        } else {
            this.showMessage('error', '错误', '获取附件列表失败')
        }
    }
    // 生成供货通知单
    async generateSupplyNotification() {
        const { selectedRowKeys } = this.state.rowSelection
        if (!selectedRowKeys.length) {
            this.showMessage('error', '错误', '暂时没有要生成的供货通知单')
            return
        }
        let ids = []
        for (const item of selectedRowKeys) {
            const e = this.state.tableData.filter(a => a.id === item)
            if (e && e.length > 0) {
                ids.push(e[0].associatedInquiryNumber)
            }
        }
        const params = { ids }
        const res = await this.dataSourceMap['generateGonghuoPdf'].load(params)
        if (res.code === 200) {
            this.showMessage('success', '成功', '生成供货通知单成功')
            this.getTableData()
        } else {
            this.showMessage('error', '错误', res.message)
        }
    }
    // 关闭查看报价详情
    onCloseCurGoodsPriceDialog() {
        this.setState({
            curGoodsPriceHistoryList: [],
            showCurGoodsPriceHistoryFlag: false
        })
    }
    // 查看报价详情
    async viewCurGoodsPriceHistory(goodsId) {
        const { curEditData } = this.state
        const searchParams = {
            goodsCode: goodsId,
            inquiryNumber: curEditData.associatedInquiryNumber,
            count: 9999
        }
        const res = await this.dataSourceMap['getAllQuoteList'].load(searchParams)
        if (res.code === 200) {
            // 处理要展示的数据
            const data = res.data

            // const arrA = data.map(e => e['quotationCount'])
            // const arrB = Array.from(new Set(arrA))
            // let curGoodsPriceHistoryList = []
            // for (const item of arrB) {
            //     let obj = {
            //         quotationCount: item,
            //         list: []
            //     }
            //     let temp = []
            //     for (const e of data) {
            //         if (item === e.quotationCount) {
            //             temp.push(e)
            //         }
            //     }
            //     const tempArr = temp.map(e => e.parity)
            //     const arrC = Array.from(new Set(tempArr)).sort((a, b) => a - b)
            //     console.log('arrC', arrC)
            //     for (let i = 0; i < arrC.length; i++) {
            //         const e = arrC[i]
            //         let text = i === 0 ? '最低价' : i === 1 ? '次低价' : i === 2 ? '次次低价' : ''
            //         for (const info of temp) {
            //             if (info.parity === e) {
            //                 info.text = text
            //             }
            //         }
            //     }
            //     console.log('text', temp)
            //     obj.list = [...temp]
            //     console.log('obj', obj)
            //     curGoodsPriceHistoryList.push(obj)

            // 按 quotationCount 分组
            const groupedByQuotationCount = data.reduce((acc, item) => {
                const { quotationCount } = item;
                if (!acc[quotationCount]) {
                    acc[quotationCount] = [];
                }
                acc[quotationCount].push(item);
                return acc;
            }, {});

            let curGoodsPriceHistoryList = [];

            for (const quotationCount in groupedByQuotationCount) {
                const list = groupedByQuotationCount[quotationCount];

                // 先按比价金额升序，再按报价升序
                list.sort((x, y) => {
                    if (x.parity !== y.parity) {
                        return x.parity - y.parity;
                    } else {
                        return x.minSupplierGoodsPrice - y.minSupplierGoodsPrice;
                    }
                });

                // 按照比价金额和报价升序分组
                const grouped = [];
                let currentGroup = [];
                let currentA = list[0]?.parity;
                let currentB = list[0]?.minSupplierGoodsPrice;

                for (const e of list) {
                    if (e.parity === currentA && e.minSupplierGoodsPrice === currentB) {
                        currentGroup.push(e);
                    } else {
                        grouped.push(currentGroup);
                        currentGroup = [e];
                        currentA = e.parity;
                        currentB = e.minSupplierGoodsPrice;
                    }
                }
                grouped.push(currentGroup);

                // 添加描述性文本
                const labeledList = grouped.flatMap((group, index) => {
                    const text = index === 0 ? '最低价' : index === 1 ? '次低价' : index === 2 ? '次次低价' : '';
                    return group.map(item => ({ ...item, text }));
                });

                curGoodsPriceHistoryList.push({
                    quotationCount: quotationCount,
                    list: labeledList
                });
            }
            curGoodsPriceHistoryList.sort((a, b) => b.quotationCount - a.quotationCount)
            this.setState({
                curGoodsPriceHistoryList,
                showCurGoodsPriceHistoryFlag: true
            })
            console.log('curGoodsPriceHistoryList', curGoodsPriceHistoryList)
        } else {
            this.showMessage('error', '错误', res.message)
        }
    }
    // 渲染商品报价历史数据
    renderCurGoodsPriceHistoryData() {
        const { RenderCurGoodsPriceHistoryList } = window.HaijuCommodityPricing
        const { curGoodsPriceHistoryList } = this.state
        return (<div>
            <RenderCurGoodsPriceHistoryList
                curGoodsPriceHistoryList={curGoodsPriceHistoryList}>
            </RenderCurGoodsPriceHistoryList>
        </div>)
    }
    // 进行附件上传
    async onUploadPriceFile(file) {
        let { priceDetailList } = this.state
        let { confirmSupplierList } = priceDetailList
        const formData = new FormData()
        formData.append('file', file[0].originFileObj)
        const resp = await fetch(
            this.state.uploadUrl, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token')
                },
                body: formData,
                redirect: "follow"
            })
        const res = await resp.json()
        if (res.code === 200) {
            let obj = this.dealAnnexName('', res.result)
            confirmSupplierList.hjAttachments = [obj]
            priceDetailList.confirmSupplierList = { ...confirmSupplierList }
            this.setState({ priceDetailList })
        }
    }
    // 关闭市场价弹窗
    onCloseViewShiCurTiaoPrice() {
        this.setState({
            viewShiTiaoDialogFlag: false,
            shiTiaoHistoryList: []
        })
    }
    // 渲染市场价jsx
    renderShiTiaoJSX() {
        const { RenderShiTiaoJSXData } = window.HaijuCommodityPricing
        const { shiTiaoHistoryList, marketPriceColumnList } = this.state
        return (<div>
            <RenderShiTiaoJSXData
                marketPriceColumnList={marketPriceColumnList}
                shiTiaoHistoryList={shiTiaoHistoryList}></RenderShiTiaoJSXData>
        </div>)
    }
    // 查看最新市场价详情
    async viewShiCurTiaoPrice(goodsId) {
        const { haiju_shitiaojia } = this.state.formMap
        const searchParams = {
            searchList: [
                {
                    formId: haiju_shitiaojia,
                    conditions: [{ goodsCode: goodsId }]
                }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        let shiTiaoHistoryList = []
        // 处理最新市调价
        if (res.hasOwnProperty(haiju_shitiaojia)) {
            const list = res[haiju_shitiaojia]
            if (list.length > 0) {
                const otherList = list.sort((a, b) => {
                    let aTime = a.createTime
                    let bTime = b.createTime
                    // if (a.hasOwnProperty('updateTime')) {
                    //     aTime = a.updateTime
                    // }
                    // if (b.hasOwnProperty('updateTime')) {
                    //     bTime = b.updateTime
                    // }
                    return moment(bTime).valueOf() - moment(aTime).valueOf()
                })
                if (otherList && otherList.length) {
                    shiTiaoHistoryList = [...otherList]
                }
            }
        }
        this.setState({
            viewShiTiaoDialogFlag: true,
            shiTiaoHistoryList
        })
    }
    // 查看历史销售价格表
    async onViewSaleHistory(goodsDetail) {
        const { goodsId, goodsName } = goodsDetail
        const { haiju_salesRecord, supplier } = this.state.formMap
        const searchParams = {
            searchList: [
                { formId: haiju_salesRecord, conditions: [{ goodsId }] }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        let saleRecordList = []
        if (res.hasOwnProperty(haiju_salesRecord)) {
            saleRecordList = res[haiju_salesRecord]
        }
        let supplierCondition = []
        let supplierList = []
        if (saleRecordList && saleRecordList.length) {
            // saleRecordList = saleRecordList.sort((a, b) => moment(b.pricingTime).valueOf() - moment(a.pricingTime).valueOf())
            const temp1 = saleRecordList.filter(e => e.pricingTime)
            const temp2 = saleRecordList.filter(e => !e.pricingTime)
            const tempList1 = temp1.sort((a, b) => moment(b.pricingTime).valueOf() - moment(a.pricingTime).valueOf())
            const list = [...tempList1, ...temp2]
            saleRecordList = [...list]
            const supplierIdList = saleRecordList.map(e => {
                if (e.supplierId) {
                    return e.supplierId
                }
            })
            if (supplierIdList && supplierIdList.length) {
                const arr = Array.from(new Set(supplierIdList))
                if (arr.length) {
                    supplierCondition = arr.map((e) => {
                        return { supplierId: e }
                    })
                }
            }
        }
        if (supplierCondition.length > 0) {
            const searchParams2 = {
                searchList: [
                    {
                        formId: supplier,
                        conditions: [...supplierCondition],
                        showField: ['supplierId', 'supplierName']
                    }
                ]
            }
            const supplierRes = await this.getMoreTableData(searchParams2)
            if (supplierRes.hasOwnProperty(supplier)) {
                supplierList = [...supplierRes[supplier]]
            }
        }
        // 开始组装数据
        for (let item of saleRecordList) {
            item.goodsName = goodsName
            const sp = supplierList.filter(e => e.supplierId === item.supplierId)
            if (sp && sp.length > 0) {
                item.supplierName = sp[0].supplierName
            }
        }
        this.setState({
            viewSalesHistoryPriceListDialog: true,
            salesHistoryPriceList: [...saleRecordList]
        })
    }
    // 渲染销售价历史数据
    renderSalesHistoryJSX() {
        const { RenderSalesHistoryJSXData } = window.HaijuCommodityPricing
        const { salesHistoryPriceList } = this.state
        return (<div>
            <RenderSalesHistoryJSXData salesHistoryPriceList={salesHistoryPriceList}></RenderSalesHistoryJSXData>
        </div>)
    }
    // 关闭销售历史价弹窗
    closeSalesHistoryDialog() {
        this.setState({
            viewSalesHistoryPriceListDialog: false,
            salesHistoryPriceList: []
        })
    }
    // 渲染报价详情弹窗
    renderOnPriceDetailJSX() {
        const { RenderOnPriceDetail } = window.HaijuCommodityPricing
        const { priceDetailList, showPriceType } = this.state
        const dataEvent = {
            ...priceDetailList,
            showPriceType,
            onDataChange: (type, data, isCalculation = false, isReset = false) => this.onPriceDataChange(type, data, isCalculation, isReset),
            onPriceChange: (e, flag, bPriceData) => this.onSalePriceChange(e, flag, bPriceData),
            onViewAttachments: (e) => this.viewAnnex(e),
            onViewCurGoodsPriceHistory: (e) => this.viewCurGoodsPriceHistory(e),
            onUploadPriceFile: (e) => this.onUploadPriceFile(e),
            calculateGrossProfit: (e) => this.calculateGrossProfit(e),
            viewShiCurTiaoPrice: (e) => this.viewShiCurTiaoPrice(e),
            onViewSaleHistory: (e) => this.onViewSaleHistory(e),
            onWinningPriceDataChange: (e) => this.onWinningPriceDataChange(e)
        }
        return (<div>
            <RenderOnPriceDetail {...dataEvent}></RenderOnPriceDetail>
        </div>)
    }
    // 关闭定价抽屉
    closeDrawer() {
        this.setState({
            showDetailFlag: false,
            detailQueryParam: {
                conditionFilter: { conditionType: "and", conditions: [] },
                page: { current: 1, pages: 0, size: 10, total: 1 },
                sorts: [],
                formId: ""
            },
            detailTableData: [],
            showExamineButtonFlag: true,
            showReQuoteButtonFlag: true
        }, () => {
            this.getTableData()
        })
    }
    componentWillUnmount() {

    }
    // 处理标包层级关系
    dealInquiryPackages(data, parentId) {
        return data
            .filter(item => item.parent_code === parentId)
            .map(item => ({ label: item.name, value: item.code, children: this.dealInquiryPackages(data, item.code) }))
    }
    // 处理上传的附件要显示的名称
    dealAnnexName(result, fileNames) {
        const name = fileNames
        const index = name.indexOf('/')
        const name1 = name.substring(index + 1)
        const fileName = name1.replace(/_\d+/g, '')
        let obj = {
            name: fileName,
            state: 'done',
            url: result,
            fileName: name
        }
        return obj
    }
    async getMoreTableData(searchParams) {
        const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
        const data = res.data
        if (typeof data === 'object' && data !== null) {
            return res.data
        } else {
            return null
        }
    }
}
