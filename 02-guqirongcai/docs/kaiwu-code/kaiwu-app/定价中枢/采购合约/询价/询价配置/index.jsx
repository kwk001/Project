class LowcodeComponent extends Component {
    constructor() {
        const { setMomentLocale } = window.MomentLocale
        setMomentLocale()
        const { inject } = window.HaijuBasePack;
        inject(this, {
            withMethods: []
        });
        const { injectBaseMethods } = window.HaijuCommodityPricing
        injectBaseMethods(this)
    }
    state = {
        formMap: {
            inquiry_packages: "", // 标包管理表单
            haiju_xunjiapeizhi: "", // 询价配置表单
            planSupply_supplier: "", // 计划供应商
            planSupply_product: "", // 计划供应商品
            goods: "", // 商品基础表
            goodsSpecs: "", // 商品规格信息表
            supplier: "", // 供应商档案表
            haiju_caigoubaojia: '', // 采购报价表
            haiju_caigoubaojiaxiangqing: '', // 采购报价详情
            haiju_xiangguandingjiajichuye: '', // 相关定价基础页
            haiju_commodity: '', // 供应商中标商品表
            haiju_goodsPricingDetails: '', // 商品定价详情页表单数据
            haiju_userPermissions: '', // 审批权限表单
            packages_product: '', // 标包商品
            packages_supplier: '', // 标包供应商
        },
        approveCode: ['AP_INQUIRY'], // AP_INQUIRY 询价配置审批ENUM
        userApproveList: [], // 审批权限列表
        // 首页表格查询数据
        queryParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 10, total: 1 },
            // fields: [{field: 'XXX'}],
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
        // 详情页询价商品分页数据查询
        detailQueryParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 10, total: 1 },
            sorts: [],
            inquiryNumber: '',
            code: '',
            formId: ""
        },
        // 详情页按照三种不同的维度查看数据详情弹窗的分页数据
        quotationDetailPageParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 9999, total: 1 },
            sorts: [],
            formId: ""
        },
        rowSelection: {
            onChange: function (ids, records) {
                this.onChangeRow(ids, records)
            },
            onSelect: function (selected, record, records) {
            },
            onSelectAll: function (selected, records) {
            },
            // mode: 'single',
            selectedRowKeys: [],
        },
        selectedRowRecords: [],
        batchList: [],
        searchParams: {},
        totalElements: 0,
        detailTotalElements: 0,
        quotationDetailTotalElements: 0,
        tableData: [],
        currentUser: {},
        conditions: [],
        inquiryPackagesList: [],
        inquiryPackagesData: [],
        detailTableData: [], // 详情表格数据
        statusMap: {
            ALL: '全部',
            WAIT_CONFIG: '待配置',
            WAIT_EXAMINE: '待审核',
            QUOTATION: '报价中',
            SECONDARY_QUOTATION: '二次报价',
            WAIT_CONFIRM: '待确认',
            TO_BE_PRICED: '待定价',
            PRICED: '已定价',
            CLOSED: '已关闭',
        },
        curActiveTab: '全部',
        showAllocationFlag: false, // 待配置，待审核抽屉打开状态控制
        showDetailFlag: false, // 报价中抽屉打开状态控制
        showQuotationDetailFlag: false, // 报价中点击详情查看数据控制弹窗是否显示
        showReQuoteFlag: false, // 再报价弹窗 确认供应商弹窗
        curEditData: {},
        inquiryLeftTableData: [], // 待配置阶段 => 供应商
        inquiryRightTableData: [], // 待配置阶段 => 商品
        quotationDetailTableData: [], // 报价中详情表格数据
        quotationCycle: null, // 待配置阶段 => 报价周期字段
        supplyCycle: null, // 待配置阶段 => 供货周期字段
        loadingFlag: false, // 防止按钮二次提交数据
        curDetailTabKey: 'TAB_A', // 询价详情页tab切换的key
        caigouList: [], // 采购报价详情
        supplierDimensionList: [], // 按供应商维度统计报价数据
        quotationProgressList: [], // 按轮次统计报价数据
        byType: { // 详情统计维度
            GOODS: "GOODS",
            SUPPLIER: "SUPPLIER",
            ROUND: "ROUND"
        },
        quotationDetailRecord: {},
        quotationDetailInfo: {},
        quotationDetailType: 'GOODS',
        supplierList: [],
        reQuoteList: {
            goodsList: {},
            quoteList: [],
            otherList: {},
            supplierOptionList: [],
            curRecord: {}
        }, // 再报价和确认供应商数据
        quoteType: 'REQUOTE', // REQUOTE 再报价 CONFIRM 确认供应商
        curReQuoteEditData: {}, // 临时保存当前询价单的详细数据
        showRepeatOfferFlag: false, // 发起再报价，选择再报价期限
        repeatOfferTime: [],
        showBatchDialogFlag: false,
        batchDialogTitle: '批量配置',
        batchDialogType: '', // QUOTATION 报价通知单 SUPPLY 供货通知单 BATCH 批量配置
        showExportDataDialogFlag: false, // 下载报价汇总表弹窗
        quotationSummaryData: {
            inquiryNumber: "",
            statsTime: "",
            statsType: "商品", // 按商品/按供应商
            code: '',
            packageName: ''
        },
        agreeLoading: false,
        showAgreeFlag: false,
        isMobile: false
    }

    componentDidMount() {
        this.init(() => {
            console.log(this.state.userApproveList)
            const isMobile = this.getIsMobile()
            this.setState({ isMobile })
            // 初始化后续操作
            this.queryBaseData()
        })
    }
    getIsMobile() {
        const userAgentInfo = navigator.userAgent || '';
        const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "miniProgram", "MicroMessenger", 'micromessenger'];
        return agents.some(agent => userAgentInfo.indexOf(agent) >= 0)
    }
    onSearchData(event) {
        let conditions = []
        for (const field in event) {
            if (event[field] != undefined && event[field] != '') {
                let value = event[field]
                if (field === 'quotationStartTime' || field === 'deliveryCycleTime') {
                    if (value.length > 0 && value[0] !== null && value[1] !== null) {
                        if (field === 'quotationStartTime') {
                            const startTime = moment(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                            const endTime = moment(value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                            const searchArr = [
                                { conditionOperator: 'between', field: 'quotationStartTime', conditionValues: [startTime, endTime] },
                            ]
                            conditions = conditions.concat(searchArr)
                        } else {
                            const startTime = moment(value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                            const endTime = moment(value[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                            const searchArr = [
                                { conditionOperator: 'ge', field: 'deliveryCycleStartTime', conditionValues: [startTime] },
                                { conditionOperator: 'le', field: 'endOfSupplyCycleTime', conditionValues: [endTime] },
                            ]
                            conditions = conditions.concat(searchArr)
                        }
                    }
                } else {
                    let query = {
                        conditionOperator: 'eq',
                        field,
                        conditionValues: [value]
                    }
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
    dealParams() {
        let queryParam = _.cloneDeep(this.state.queryParam)
        queryParam.formId = this.state.formMap.haiju_xunjiapeizhi
        let obj = {
            conditionOperator: 'eq',
            field: 'bidStatus',
            conditionValues: []
        }
        let otherConditions = []
        if (this.state.curActiveTab !== '全部') {
            obj.conditionValues = [this.state.curActiveTab]
            otherConditions.push(obj)
        }
        queryParam.conditionFilter.conditions = [...this.state.conditions, ...otherConditions]
        return queryParam
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
    // 获取供应商，供应商品数据
    async getMoreTableData(searchParams) {
        const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
        const data = res.data
        if (typeof data === 'object' && data !== null) {
            return res.data
        } else {
            return null
        }
    }
    // 首页关闭该条询价单
    closeCurInquiryData(record) {
        const { haiju_xunjiapeizhi } = this.state.formMap
        window.Next.Dialog.confirm({
            title: '提示',
            content: '确定要关闭该询价单吗？',
            onOk: async () => {
                const updateData = {
                    formId: haiju_xunjiapeizhi,
                    id: record.detail._id,
                    data: {
                        bidStatus: '已关闭'
                    }
                }
                const res = await this.dataSourceMap['updateFormData'].load(updateData)
                if (res.code === 200) {
                    this.showMessage('success', '成功', '该询价单已关闭')
                    const element = document.querySelector('.next-drawer-body')
                    const isMobile = this.state.isMobile
                    if (isMobile) {
                        element.classList.remove('mobile-height')
                    } else {
                        element.classList.remove('pc-height')
                    }
                    this.getTableData()
                    this.resetInquiryParams()
                }
            }
        })
    }
    // 关闭询价单
    closeCurInquiry() {
        const { curEditData } = this.state
        const { haiju_xunjiapeizhi } = this.state.formMap
        window.Next.Dialog.confirm({
            title: '提示',
            content: '确定要关闭该询价单吗？',
            onOk: async () => {
                const updateData = {
                    formId: haiju_xunjiapeizhi,
                    id: curEditData.detail._id,
                    data: {
                        bidStatus: '已关闭'
                    }
                }
                const res = await this.dataSourceMap['updateFormData'].load(updateData)
                if (res.code === 200) {
                    this.showMessage('success', '成功', '该询价单已关闭')
                    this.setState({
                        showAllocationFlag: false
                    }, () => {
                        this.getTableData()
                        this.resetInquiryParams()
                    })
                }
            }
        })
    }
    // 获取表格数据
    async getTableData() {
        let tableData = []
        this.onClearAll()
        const { planSupply_supplier, planSupply_product, haiju_caigoubaojiaxiangqing, packages_product, packages_supplier, supplier } = this.state.formMap
        const queryParams = this.dealParams()
        const tableRes = await this.dataSourceMap['queryFormData'].load(queryParams)
        if (tableRes.code === 200) {
            if (tableRes.result) {
                this.setState({ totalElements: tableRes.result.total })
                if (tableRes.result.records) {
                    const tableList = tableRes.result.records
                    const inquiryNumberList = tableList.map(item => {
                        return { inquiryNumber: item.inquiryNumber }
                    })
                    const inquiryPackageIdTemp = tableList.map(item => item.inquiryPackageId)
                    const inquiryPackageIdList = Array.from(new Set(inquiryPackageIdTemp))
                    const packageConditions = inquiryPackageIdList.map(e => {
                        return { packages_code: e }
                    })
                    const inquiryPackageTypeName = tableList.map(e => e.inquiryPackageTypeName)
                    const tempConditions = Array.from(new Set(inquiryPackageTypeName))
                    const searchParams = {
                        searchList: [
                            { formId: planSupply_supplier, conditions: [...inquiryNumberList] }, // 计划供应商
                            { formId: planSupply_product, conditions: [...inquiryNumberList] }, // 计划供应商品
                            { formId: haiju_caigoubaojiaxiangqing, conditions: [...inquiryNumberList] }, // 采购报价详情，统计当前报价进度
                            { formId: packages_product, conditions: [...packageConditions] }, // 标包商品
                            // { formId: packages_supplier, conditions: [...packageConditions] }, // 标包供应商
                        ]
                    }
                    let supplierTemp = []
                    const planData = await this.getMoreTableData(searchParams)
                    const searchParam = {
                        "conditionFilter": {
                            "conditionType": "AND",
                            "conditions": [
                                { "conditionValues": [...tempConditions], "conditionOperator": "any", "field": "supplierType" }
                            ]
                        },
                        page: { current: 1, pages: 0, size: 9999, total: 0 },
                        sorts: [],
                        formId: supplier
                    }
                    const searchData = await this.dataSourceMap['queryFormData'].load(searchParam)
                    if (searchData?.result?.records) {
                        supplierTemp = [...searchData.result.records]
                    }

                    for (const item of tableList) {
                        let quantityOfInquirySuppliers = 0
                        let quantityOfRequestedGoods = 0
                        let quantityOfInquirySuppliersList = []
                        let paSupplierList = []
                        let quantityOfRequestedGoodsList = []
                        let packageSupplierList = []
                        if (planData.hasOwnProperty(planSupply_supplier)) {
                            const list = planData[planSupply_supplier].filter(e => e.inquiryNumber === item.inquiryNumber)
                            paSupplierList = [...list]
                            const temp = list.filter(e => e.isInquiry === '是')
                            quantityOfInquirySuppliersList = [...temp]
                            quantityOfInquirySuppliers = temp.length

                        }
                        for (const e of supplierTemp) {
                            if (e.supplierType && e.supplierType.length > 0) {
                                if (e.supplierType.indexOf(item.inquiryPackageTypeName) > -1) {
                                    packageSupplierList.push(e)
                                }
                            }
                        }
                        // 询价供应商
                        // if (planData.hasOwnProperty(packages_supplier)) {
                        //     const list = planData[packages_supplier].filter(e => e.packages_code === item.inquiryPackageId)
                        //     packageSupplierList = [...list]
                        //     quantityOfInquirySuppliers = list.length
                        // }

                        // 询价供应商品数量
                        if (planData.hasOwnProperty(planSupply_product)) {
                            const tempList = planData[planSupply_product].filter(e => e.inquiryNumber === item.inquiryNumber && e.inquiry_flag === '是')
                            const packageGoods = planData[packages_product].filter(e => e.packages_code === item.inquiryPackageId)
                            for (let e of tempList) {
                                const temp = packageGoods.filter(info => info.product_code === e.product_code)
                                if (temp && temp.length > 0) {
                                    e.sortId = temp[0].sortId
                                } else {
                                    e.sortId = 0
                                }
                            }
                            const list = tempList.sort((a, b) => a.sortId - b.sortId)
                            quantityOfRequestedGoodsList = [...list]
                            quantityOfRequestedGoods = list.length
                        }
                        // 标包名称
                        let nameOfQuotationPackage = ''
                        const nameOfQuotationPackageList = this.state.inquiryPackagesData.filter(e => e.code === item.inquiryPackageId)
                        if (nameOfQuotationPackageList && nameOfQuotationPackageList.length) {
                            nameOfQuotationPackage = nameOfQuotationPackageList[0].name
                        }
                        let supplyCycle = '-'
                        // 供货周期
                        if (item.deliveryCycleStartTime && item.endOfSupplyCycleTime) {
                            supplyCycle = item.deliveryCycleStartTime + ' ~ ' + item.endOfSupplyCycleTime
                        }
                        // 报价进度 => 根据不同的状态进行数据判断 => 还有很多的逻辑
                        let quotationStatus = '-'
                        if (planData.hasOwnProperty(haiju_caigoubaojiaxiangqing)) {
                            const quotationList = planData[haiju_caigoubaojiaxiangqing].filter(e => e.inquiryNumber === item.inquiryNumber)
                            const mapA = _.groupBy(quotationList, 'inquiryGoodsId')
                            let lenA = 0
                            let lenB = 0
                            for (const key in mapA) {
                                lenB++
                                if (mapA[key].some(e => e.supplierQuotationStatus === '已报价')) {
                                    lenA++
                                }
                            }
                            if (lenB > 0) {
                                quotationStatus = `${lenA}/${lenB}`
                            }
                        }
                        let obj = {
                            id: item._id,
                            inquiryNumber: item.inquiryNumber, // 询价单号
                            relatedPricingOrderNumber: item.relatedPricingOrderNumber || '-', // 关联定价单号
                            nameOfQuotationPackage: item.nameOfQuotationPackage, // 询价标包名称
                            quantityOfInquirySuppliers, // 询价供应商数量
                            quantityOfInquirySuppliersList, // 询价供应商list
                            paSupplierList, // 询价供应商未过滤数据
                            packageSupplierList, // 询价标包供应商
                            quantityOfRequestedGoods, // 询价商品数量
                            quantityOfRequestedGoodsList, // 询价商品list
                            supplyCycle, // 供货周期
                            quotationStartTime: item.quotationStartTime || '-', // 报价开始时间
                            quotationEndTime: item.quotationEndTime || '-', // 报价结束时间
                            bidStatus: item.bidStatus, // 报价状态
                            supplyOrderStatus: item.supplyOrderStatus, // 供货通知单状态
                            offerNoticeStatus: item.offerNoticeStatus, // 报价通知单状态
                            createTime: item.createTime,
                            quotationStatus, // 报价进度
                            detail: { ...item }
                        }
                        tableData.push(obj)
                    }
                    console.log('tableData', tableData)
                    this.setState({ tableData })
                } else {
                    this.setState({ tableData: [], totalElements: 0 })
                }
            }
        } else {
            this.setState({ tableData: [], totalElements: 0 })

        }
    }
    // 渲染询价详情页面
    renderInquiryDetailData() {
        const { Tab, Pagination } = window.Next
        const { curDetailTabKey } = this.state
        return (<div className={'detail-box'}>
            <div className={'detail-box-info'}>
                {this.RenderInquiryBaseJSXData()}
                <div className={'detail-box-tab'}>
                    <Tab onChange={this.onDetailTabChange} defaultActiveKey={curDetailTabKey}>
                        <Tab.Item title="按商品" key="TAB_A"></Tab.Item>
                        <Tab.Item title="按供应商" key="TAB_B"></Tab.Item>
                        <Tab.Item title="按轮次" key="TAB_C"></Tab.Item>
                    </Tab>
                </div>
            </div>
            <div className={'detail-box-inquiry'}>
                <div className={'detail-box-page-data'}>
                    {
                        curDetailTabKey === 'TAB_A' && (<div>
                            {this.RenderDetailTableJSXData()}
                            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                                <Pagination
                                    pageSize={this.state.detailQueryParam.page.size}
                                    pageSizeSelector={'dropdown'}
                                    pageSizeList={[10, 20, 50, 100]}
                                    current={this.state.detailQueryParam.page.current}
                                    onPageSizeChange={this.onDetailTableDataPageSizeChange}
                                    total={this.state.detailTotalElements} onChange={this.onDetailTableDataPageChange} />
                            </div>
                        </div>)
                    }
                    {
                        curDetailTabKey === 'TAB_B' && (<div>
                            {this.RenderSupplierDimensionJSXData()}
                        </div>)
                    }
                    {
                        curDetailTabKey === 'TAB_C' && (<div>
                            {this.RenderQuotationProgressJSXData()}
                        </div>)
                    }
                </div>
            </div>
        </div>)
    }

    // 渲染询价单配置
    renderInquiryBaseJSX() {
        return this.RenderInquiryBaseJSXData()
    }
    // 渲染报价详情 ==> table表格数据
    renderDetailTableJSX() {
        return this.RenderDetailTableJSXData()
    }
    // 渲染报价详情 ==> 按供应商维度统计
    renderSupplierDimensionJSX() {
        return this.RenderSupplierDimensionJSXData()
    }
    // 渲染报价详情 ==> 按轮次维度进行统计
    renderQuotationProgressJSX() {
        return this.RenderQuotationProgressJSXData()
    }
    // 渲染询价商品
    renderInquiryDetailJSX() {
        return this.RenderInquiryDetailJSXData()
    }
    // 询价单配置状态下进行数据校验
    checkInquiryData() {
        const quotationCycle = this.state.quotationCycle && this.state.quotationCycle.filter(e => e)
        const supplyCycle = this.state.supplyCycle && this.state.supplyCycle.filter(e => e)
        if (!quotationCycle || quotationCycle.length === 0) {
            this.showMessage('error', '错误', '请选择报价周期')
            return false
        }
        if (!supplyCycle || supplyCycle.length === 0) {
            this.showMessage('error', '错误', '请选择供货周期')
            return false
        }
        // 报价结束时间不能晚于供货结束日期
        const time1 = moment(this.state.quotationCycle[1])
        const time2 = moment(this.state.supplyCycle[1]).endOf('day')
        if (moment(time1).isAfter(moment(time2))) {
            this.showMessage('error', '错误', '报价结束时间不能晚于供货结束日期')
            return false
        }
        return true
    }
    // 检查供应商的状态和页面数据的匹配状态
    async checkSupplierStatus() {
        let obj = { checkFlag: false, checkMessage: '' }
        let checkSupplierList = []
        const { inquiryLeftTableData } = this.state
        const { supplier } = this.state.formMap
        let supplierList = []
        const supplierIdList = inquiryLeftTableData.map(item => item.detail.supplierId)
        let queryParam = _.cloneDeep(this.state.baseQueryParam)
        queryParam.formId = supplier
        queryParam.fields = [{ field: 'supplierId' }, { field: 'supplierStatus' }, { field: 'supplierName' }]
        queryParam.conditionFilter.conditions = [
            { conditionValues: [...supplierIdList], conditionOperator: "eqa", field: "supplierId" }
        ]
        const res = await this.dataSourceMap['queryFormData'].load(queryParam)
        if (res.code === 200 && res?.result?.records?.length > 0) {
            supplierList = [...res.result.records]
        }
        for (const item of inquiryLeftTableData) {
            if (!item.isManuallyChange) {
                // 没有手动发生改变发生的数据
                const temp = supplierList.filter(e => e.supplierId === item.detail.supplierId)
                if (temp.length > 0) {
                    const supplier = temp[0]
                    if (item.supplierStatus !== supplier.supplierStatus) {
                        checkSupplierList.push({
                            supplierId: supplier.supplierId,
                            supplierName: supplier.supplierName
                        })
                    }
                }
            }
        }
        // 如果匹配的数据有差异
        if (checkSupplierList.length > 0) {
            const tempName = checkSupplierList.map(e => e.supplierName).join(',')
            obj.checkFlag = true
            obj.checkMessage = `${tempName}供应商状态和页面数据不匹配，请确定是否要提交数据`
        }
        return obj
    }
    // 提交询价配置数据 ==> 改造
    async submitCurInquiryDataNew() {
        const { haiju_xunjiapeizhi, planSupply_supplier, planSupply_product } = this.state.formMap
        const { detail, quantityOfInquirySuppliersList, paSupplierList } = this.state.curEditData
        // 校验通过，进行数据组装
        // 开始更新主表
        const { quotationCycle, supplyCycle, inquiryLeftTableData, inquiryRightTableData } = this.state
        const quotationStartTime = moment(quotationCycle[0]).format('YYYY-MM-DD HH:mm:ss')
        const quotationEndTime = moment(quotationCycle[1]).format('YYYY-MM-DD HH:mm:ss')
        const deliveryCycleStartTime = moment(supplyCycle[0]).format('YYYY-MM-DD 00:00:00')
        const endOfSupplyCycleTime = moment(supplyCycle[1]).format('YYYY-MM-DD 00:00:00')
        let params = {
            inquiryNumber: this.state.curEditData.inquiryNumber, // 询价单号
            quotationStartTime, // 报价周期开始时间
            quotationEndTime, // 报价周期结束时间
            deliveryCycleStartTime, // 供货周期开始时间
            endOfSupplyCycleTime, // 供货周期结束时间
            addSupplierData: [], // 新增的计划供应商表
            updateGoodsData: [], // 更新计划供应商品表
            userId: this.state.currentUser.id, // 当前用户id
        }

        // 更新供应商表
        for (const item of inquiryLeftTableData) {
            const aList = quantityOfInquirySuppliersList[0]
            params.addSupplierData.push({
                plan_code: aList.plan_code,
                inquiryNumber: this.state.curEditData.inquiryNumber,
                supplier_code: item.detail.supplierId,
                supplier_name: item.supplierName,
                inquiry_flag: '是',
                isInquiry: item.isInquiry,
            })
        }
        // 更新计划供应商品表
        for (const item of inquiryRightTableData) {
            params.updateGoodsData.push({
                _id: item.detail._id,
                limitHighPrice: item.limitHighPrice || 0
            })
        }
        // 走新的接口
        const res = await this.dataSourceMap['inquiryConfigSubmit'].load(params)
        if (res.code === 0 || res.code === 500) {
            this.showMessage('error', '错误', '数据提交异常，请联系管理员')
            return
        }
        // const deleteRes = await this.dataSourceMap['deleteFormData'].load(deleteParams)
        // const res = await Promise.all([
        //     this.dataSourceMap['updateFormData'].load(updateMainForm),
        //     this.dataSourceMap['batchUpdate'].load(updateGoodsData),
        //     addSupplierData.datas.length > 0 && this.dataSourceMap['addMoreFormData'].load(addSupplierData)
        // ])
        this.showMessage('success', '成功', '数据更新成功')
        this.setState({
            showAllocationFlag: false
        }, () => {
            this.getTableData()
            this.resetInquiryParams()
        })
    }
    // 提交询价配置数据
    async submitCurInquiryData() {
        const { haiju_xunjiapeizhi, planSupply_supplier, planSupply_product } = this.state.formMap
        const { detail, quantityOfInquirySuppliersList, paSupplierList } = this.state.curEditData
        // 校验通过，进行数据组装
        // 开始更新主表
        const { quotationCycle, supplyCycle, inquiryLeftTableData, inquiryRightTableData } = this.state
        const quotationStartTime = moment(quotationCycle[0]).format('YYYY-MM-DD HH:mm:ss')
        const quotationEndTime = moment(quotationCycle[1]).format('YYYY-MM-DD HH:mm:ss')
        const deliveryCycleStartTime = moment(supplyCycle[0]).format('YYYY-MM-DD')
        const endOfSupplyCycleTime = moment(supplyCycle[1]).format('YYYY-MM-DD')
        const updateMainForm = {
            formId: haiju_xunjiapeizhi,
            id: detail._id,
            data: {
                bidStatus: '待审核',
                quotationStartTime, // 报价周期开始时间
                quotationEndTime, // 报价周期结束时间
                deliveryCycleStartTime, // 供货周期开始时间
                endOfSupplyCycleTime, // 供货周期结束时间
            }
        }
        const addSupplierData = {
            formId: planSupply_supplier,
            datas: []
        }
        const updateGoodsData = {
            formId: planSupply_product,
            datas: []
        }
        const deleteIds = paSupplierList.map(item => item._id)
        // 更新供应商表
        for (const item of inquiryLeftTableData) {
            const aList = quantityOfInquirySuppliersList[0]
            addSupplierData.datas.push({
                plan_code: aList.plan_code,
                inquiryNumber: this.state.curEditData.inquiryNumber,
                supplier_code: item.detail.supplierId,
                supplier_name: item.supplierName,
                inquiry_flag: '是',
                isInquiry: item.isInquiry,
            })
        }
        // 更新计划供应商品表
        for (const item of inquiryRightTableData) {
            updateGoodsData.datas.push({
                _id: item.detail._id,
                limitHighPrice: item.limitHighPrice || 0
            })
        }
        const deleteParams = {
            formId: planSupply_supplier,
            data: {
                _id: [...deleteIds]
            }
        }
        const deleteRes = await this.dataSourceMap['deleteFormData'].load(deleteParams)
        const res = await Promise.all([
            this.dataSourceMap['updateFormData'].load(updateMainForm),
            this.dataSourceMap['batchUpdate'].load(updateGoodsData),
            addSupplierData.datas.length > 0 && this.dataSourceMap['addMoreFormData'].load(addSupplierData)
        ])
        this.showMessage('success', '成功', '数据更新成功')
        this.setState({
            showAllocationFlag: false
        }, () => {
            this.getTableData()
            this.resetInquiryParams()
        })
    }
    // 询价单配置状态下进行数据提交
    async submitInquiryData() {
        const flag = this.checkInquiryData()
        const { haiju_xunjiapeizhi, planSupply_supplier, planSupply_product } = this.state.formMap
        const { detail, quantityOfInquirySuppliersList, paSupplierList } = this.state.curEditData
        console.log('flag', flag)
        if (flag) {
            const { checkFlag, checkMessage } = await this.checkSupplierStatus()
            if (checkFlag) {
                const dialog = window.Next.Dialog.confirm({
                    title: '提示',
                    content: checkMessage,
                    onOk: () => {
                        this.submitCurInquiryDataNew()
                    },
                    onCancel: () => {
                        dialog.hide()
                    }
                })
            } else {
                // 所有校验通过
                this.submitCurInquiryDataNew()
            }
        }
    }
    // 重置一些参数
    resetInquiryParams() {
        this.setState({
            curEditData: {},
            inquiryLeftTableData: [],
            inquiryRightTableData: [],
            quotationCycle: null,
            supplyCycle: null
        })
    }
    // 询价配置返回按钮
    closeInquiryDrawer() {
        const element = document.querySelector('.next-drawer-body')
        const isMobile = this.state.isMobile
        if (isMobile) {
            element.classList.remove('mobile-height')
        } else {
            element.classList.remove('pc-height')
        }
        this.setState({
            showAllocationFlag: false
        })
    }
    // 详情抽屉关闭
    closeDetailDrawer() {
        this.setState({
            showDetailFlag: false,
            curDetailTabKey: 'TAB_A',
            detailTableData: [],
            supplierDimensionList: [],
            quotationProgressList: []
        }, () => {
            this.getTableData()
        })
    }
    // 查询基础数据
    async queryBaseData() {
        const { inquiry_packages } = this.state.formMap
        const searchParams = {
            searchList: [
                { formId: inquiry_packages, conditions: [] },
            ]
        }
        const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
        const inquiryPackagesData = res.data[inquiry_packages]
        const inquiryPackagesList = this.dealInquiryPackages(inquiryPackagesData, undefined)
        this.setState({
            inquiryPackagesList,
            inquiryPackagesData
        }, () => {
            this.getTableData()
        })
    }
    // 处理标包层级关系
    dealInquiryPackages(data, parentId) {
        return data
            .filter(item => item.parent_code === parentId)
            .map(item => ({ label: item.name, value: item.code, children: this.dealInquiryPackages(data, item.code) }))
    }
    // 切换顶部tab
    onChangeTab(e) {
        this.setState({
            curActiveTab: this.state.statusMap[e]
        }, () => {
            this.onPageChange(1)
        })
    }

    componentWillUnmount() {

    }
    getTableColumn() {
        return [
            // { title: '询价标包ID', dataIndex: 'inquiryPackageId' },
            // { title: '供货周期开始时间', dataIndex: 'deliveryCycleStartTime' },
            // { title: '供货周期结束时间', dataIndex: 'endOfSupplyCycleTime' },
            // { title: '报价进度', dataIndex: 'quotationProgress' },

            { title: '询价单号', dataIndex: 'inquiryNumber' },
            { title: '关联定价单号', dataIndex: 'relatedPricingOrderNumber' },
            { title: '询价标包名称', dataIndex: 'nameOfQuotationPackage' },
            { title: '询价供应商数量', dataIndex: 'quantityOfInquirySuppliers' },
            { title: '询价商品数量', dataIndex: 'quantityOfRequestedGoods' },
            { title: '供货周期', dataIndex: 'supplyCycle' },
            { title: '报价开始时间', dataIndex: 'quotationStartTime' },
            { title: '报价结束时间', dataIndex: 'quotationEndTime' },
            { title: '报价状态', dataIndex: 'bidStatus' },
            { title: '供货通知单状态', dataIndex: 'supplyOrderStatus' },
            { title: '报价通知单状态', dataIndex: 'offerNoticeStatus' },
            { title: '报价进度', dataIndex: 'quotationStatus' }
        ]
    }
    // 操作按钮
    oprData(value, index, record, type) {
        switch (type) {
            case 'allocation':
                this.allocationData(record)
                break
            case 'examine': // 审核数据
                this.examineData(record)
                break
            case 'reject': // 撤回审核数据
                this.rejectData(record)
                break
            case 'detail': // 查看详情数据
                this.viewDetailData(record)
                break
            case 'closeInquiry': // 关闭询价单
                this.closeCurInquiryData(record)
                break
            case 'exportData': // 下载报价汇总表
                this.exportInquiryData(record)
                break
            default:
                break
        }
    }
    onCancelSubmitExamineData() {
        this.setState({
            agreeLoading: false,
            showAgreeFlag: false
        })
    }
    setStatePromise(nextState) {
        return new Promise((resolve) => {
            this.setState(nextState, resolve)
        })
    }
    // 询价配置审核通过 => 改造
    async onConfirmSubmitExamineDataNew() {
        await this.setStatePromise({
            agreeLoading: true
        })
        const { quotationCycle, supplyCycle, inquiryLeftTableData, curEditData, inquiryRightTableData } = this.state
        const { detail } = this.state.curEditData
        const quotationStartTime = moment(quotationCycle[0]).format('YYYY-MM-DD HH:mm:ss')
        const quotationEndTime = moment(quotationCycle[1]).format('YYYY-MM-DD HH:mm:ss')
        const deliveryCycleStartTime = moment(supplyCycle[0]).format('YYYY-MM-DD 00:00:00')
        const endOfSupplyCycleTime = moment(supplyCycle[1]).format('YYYY-MM-DD 00:00:00')
        const params = {
            inquiryNumber: curEditData.inquiryNumber, // 询价单号
            quotationStartTime, // 报价周期开始时间
            quotationEndTime, // 报价周期结束时间
            deliveryCycleStartTime, // 供货周期开始时间
            endOfSupplyCycleTime, // 供货周期结束时间
            userId: this.state.currentUser.id, // 用户id
        }
        // 请求新的接口
        let contactPhoneNumberList = [] // 供应商报价短信提醒的电话号码
        for (const item of inquiryLeftTableData) {
            if (item.isInquiry === '是') {
                if (item.contactPhoneNumber) {
                    contactPhoneNumberList.push(item.contactPhoneNumber)
                }
            }
        }
        const updateRes = await this.dataSourceMap['inquiryConfigAudit'].load(params)
        if (updateRes.code === 0 || updateRes.code === 500) {
            this.showMessage('error', '错误', '数据提交异常，请联系管理员')
            return
        }
        // TODO 发送短信的接口到现网要放开注释
        if (contactPhoneNumberList && contactPhoneNumberList.length > 0) {
            const time1 = moment(quotationEndTime).format('YYYY年M月D日')
            const weekDay = moment(quotationEndTime).day()
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
            const time3 = moment(quotationEndTime).format('HH:mm')
            const sendSmsParams = {
                mobiles: contactPhoneNumberList.join(','),
                content: `东和食材报价系统已上线，报价截止时间为${time1}（${time2}）${time3}，请严格按照商品标准及规格单位按时完成报价，供应商所有报价均以系统为准，不再接受其他任何形式的变更说明。谢谢!`
            }
            const sendRes = await this.dataSourceMap['sendSms'].load(sendSmsParams)
        }
        this.showMessage('success', '成功', '询价单审核成功')
        const element = document.querySelector('.next-drawer-body')
        const isMobile = this.state.isMobile
        if (isMobile) {
            element.classList.remove('mobile-height')
        } else {
            element.classList.remove('pc-height')
        }
        this.setState({
            showAllocationFlag: false,
            agreeLoading: false,
            showAgreeFlag: false
        }, () => {
            this.getTableData()
            this.resetInquiryParams()

        })

    }
    // 询价配置审核通过
    async onConfirmSubmitExamineData() {
        await this.setStatePromise({
            agreeLoading: true
        })
        const { quotationCycle, supplyCycle, inquiryLeftTableData, curEditData, inquiryRightTableData } = this.state
        const { haiju_xunjiapeizhi } = this.state.formMap
        const { detail } = this.state.curEditData
        // 更新主表
        const quotationStartTime = moment(quotationCycle[0]).format('YYYY-MM-DD HH:mm:ss')
        const quotationEndTime = moment(quotationCycle[1]).format('YYYY-MM-DD HH:mm:ss')
        const deliveryCycleStartTime = moment(supplyCycle[0]).format('YYYY-MM-DD')
        const endOfSupplyCycleTime = moment(supplyCycle[1]).format('YYYY-MM-DD')
        let contactPhoneNumberList = [] // 供应商报价短信提醒的电话号码
        const updateMainForm = {
            formId: haiju_xunjiapeizhi,
            id: detail._id,
            data: {
                bidStatus: '报价中',
                quotationProgress: 1, // 审核通过，报价轮次为1
                quotationStartTime, // 报价周期开始时间
                quotationEndTime, // 报价周期结束时间
                deliveryCycleStartTime, // 供货周期开始时间
                endOfSupplyCycleTime, // 供货周期结束时间
                rejectReason: '', // 驳回理由置空
            }
        }

        // 新增供应商报价相关数据
        // 新增供应商报价 => 采购报价表 对应 有多少供应商添加多少条数据 供应商从这张表拉取属于自己的数据
        let supplierData = []
        for (const item of inquiryLeftTableData) {
            // 筛选询价的供应商
            if (item.isInquiry === '是') {
                const { detail: detailList } = item
                let obj = {
                    supplierId: detailList.supplierId, // 供应商编号
                    inquiryNumber: curEditData.inquiryNumber, // 询价单号
                    inquiryPackageName: curEditData.nameOfQuotationPackage, // 询价标包名称
                    inquiryPackageId: curEditData.detail.inquiryPackageId, // 询价标包ID
                    inquiryGoodsNumber: curEditData.quantityOfRequestedGoods, // 询价商品数量
                    deliveryCycleStartTime: deliveryCycleStartTime, // 供货开始时间
                    endOfSupplyCycleTime: endOfSupplyCycleTime, // 供货结束时间
                    quotationStartTime: quotationStartTime, // 报价开始时间
                    quotationEndTime: quotationEndTime, // 报价结束时间
                    quotationRound: 1, // 报价轮次
                    bidStatus: '待报价', // 报价状态
                }
                supplierData.push(obj)
            }
        }


        // 新增供应商报价详情表数据 => 采购报价详情 数据量 供应商数量*商品数量 每个供应商都要有对应的商品 第一次提交 报价轮次为1
        let supplierDetailData = []
        for (const item of inquiryLeftTableData) {
            const { detail: detailList } = item
            if (item.isInquiry === '是') {
                if (item.contactPhoneNumber) {
                    contactPhoneNumberList.push(item.contactPhoneNumber)
                }
                for (const info of inquiryRightTableData) {
                    if (info.isInquiry === '是') {
                        const { detail: detailInfo } = info
                        let obj = {
                            supplierId: detailList.supplierId, // 供应商编号
                            inquiryNumber: curEditData.inquiryNumber, // 询价单号
                            inquiryGoodsId: detailInfo.product_code, // 询价商品编号
                            // supplierGoodsPrice: '', // 供应商商品报价（含税）
                            // deliveriesRate: '', // 供货税率%
                            // InvoiceType: '', // 发票类型
                            // supplierBrand: '', // 供货品牌
                            // remark: '', // 供货备注
                            // attachments: '', // 附件
                            quotationStartTime: quotationStartTime, // 报价开始时间
                            quotationEndTime: quotationEndTime, // 报价结束时间
                            quotationRound: 1, // 报价轮次
                            supplierQuotationStatus: '未报价', // 供应商报价状态
                        }
                        supplierDetailData.push(obj)
                    }
                }
            }
        }

        // 商品定价首页数据进行添加
        const goodsPriceParams = {
            formId: this.state.formMap.haiju_xiangguandingjiajichuye,
            data: {
                // priceListNumber: '', // 定价单号
                packageNumber: curEditData.detail.inquiryPackageId, // 商品标包号
                associatedInquiryNumber: curEditData.inquiryNumber, // 关联询价单号
                deliveryStartTime: deliveryCycleStartTime, // 供货开始时间
                endOfDeliveryTime: endOfSupplyCycleTime, // 供货结束时间
                updateEffectiveTime: deliveryCycleStartTime, // 更新生效时间
                updateFailureTime: endOfSupplyCycleTime, // 更新失效时间
                inquiryPackageName: curEditData.nameOfQuotationPackage, // 询价标包名称
                // pricingDate: '', // 定价日期
                // initiateARebid: '', // 发起再报价
                pricingState: '待定价', // 定价状态
                isPriceStatus: '否', // 是否可以发生定价
            }
        }

        // 开始发送数据请求
        // 主表更新
        const res1 = await this.dataSourceMap['updateFormData'].load(updateMainForm)
        // 供应商采购新增数据
        if (res1.code === 200) {
            const addParam1 = {
                formId: this.state.formMap.haiju_caigoubaojia,
                datas: [...supplierData]
            }
            const addParam2 = {
                formId: this.state.formMap.haiju_caigoubaojiaxiangqing,
                datas: [...supplierDetailData]
            }
            const res2 = await Promise.all([
                this.dataSourceMap['addMoreFormData'].load(addParam1),
                this.dataSourceMap['addMoreFormData'].load(addParam2)
            ])
            if (res2[0].code === 200 && res2[1].code === 200) {
                // 商品定价基础页新增数据
                const res3 = await this.dataSourceMap['addFormData'].load(goodsPriceParams)
                if (res3.code === 200) {
                    // 更新主表定价单号
                    const updateForm = {
                        formId: haiju_xunjiapeizhi,
                        id: detail._id,
                        data: {
                            relatedPricingOrderNumber: res3.result.priceListNumber
                        }
                    }
                    const addOtherFormArr = []
                    // 开始更新定价详情表
                    for (const item of inquiryRightTableData) {
                        if (item.isInquiry === '是') {
                            let obj = {
                                priceListNumber: res3.result.priceListNumber, // 定价单号
                                inquiryNumber: curEditData.inquiryNumber, // 询价单号
                                productPackageId: curEditData.detail.inquiryPackageId, // 商品标包号
                                deliveryStartTime: deliveryCycleStartTime, // 供货开始时间
                                endOfDeliveryTime: endOfSupplyCycleTime, // 供货结束时间
                                effectiveStartTime: deliveryCycleStartTime, // 生效开始时间
                                effectiveEndTime: endOfSupplyCycleTime, // 生效结束时间
                                inquiryPackageName: curEditData.nameOfQuotationPackage, // 询价标包名称
                                customerTypeList: [], // 客户类型价
                                goodsId: item.detail.product_code, // 商品编码
                                unit: item.measurementUnit, // 单位
                            }
                            addOtherFormArr.push(obj)
                        }
                    }
                    const addOtherParams = {
                        formId: this.state.formMap.haiju_goodsPricingDetails,
                        datas: [...addOtherFormArr]
                    }
                    const res4 = await this.dataSourceMap['updateFormData'].load(updateForm)
                    const res5 = await this.dataSourceMap['addMoreFormData'].load(addOtherParams)
                    if (res4.code === 200 && res5.code === 200) {
                        // 发送报价短信
                        if (contactPhoneNumberList && contactPhoneNumberList.length > 0) {
                            const time1 = moment(quotationEndTime).format('YYYY年M月D日')
                            const weekDay = moment(quotationEndTime).day()
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
                            const time3 = moment(quotationEndTime).format('HH:mm')
                            const sendSmsParams = {
                                mobiles: contactPhoneNumberList.join(','),
                                // content: `【海聚公司】温馨提示：${this.state.curEditData.nameOfQuotationPackage}商品未报价，请在${quotationEndTime}前完成报价`
                                content: `【扶海大数据】东和食材提示您:东和食材报价系统已上线，报价截止时间为${time1}（${time2}）${time3}，请严格按照商品标准及规格单位按时完成报价，谢谢！`
                            }
                            //【海聚公司】报价通知：海聚报价系统已上线，报价截止时间为2024年7月26日（周五）14：00，请严格按照商品标准及规格单位按时完成报价，谢谢！

                            const sendRes = await this.dataSourceMap['sendSms'].load(sendSmsParams)
                        }
                        this.showMessage('success', '成功', '询价单审核成功')
                        this.setState({
                            showAllocationFlag: false,
                            agreeLoading: false,
                            showAgreeFlag: false
                        }, () => {
                            this.getTableData()
                            this.resetInquiryParams()
                        })
                    }
                }
            }
        }

    }
    // 打开抽屉开始审核数据
    async examineCurData() {
        // 组装审核数据
        const flag = this.checkInquiryData()
        if (flag) {
            this.setState({
                showAgreeFlag: true,
                agreeLoading: false
            })
        }
    }
    // 处理撤回数据
    async dealRejectData(record, rejectReason = '') {
        let flag = false
        const updateData = {
            formId: this.state.formMap.haiju_xunjiapeizhi,
            id: record.detail._id,
            data: {
                bidStatus: '待配置',
                quotationProgress: 0,
                rejectReason
            }
        }
        const res = await this.dataSourceMap['updateFormData'].load(updateData)
        if (res.code === 200) {
            flag = true
        }
        return flag
    }
    // 撤回按钮点击，撤回数据
    async rejectData(record) {
        const flag = await this.dealRejectData(record)
        if (flag) {
            this.showMessage('success', '成功', '撤回询价单成功')
        } else {
            this.showMessage('error', '失败', '撤回询价单失败')
        }
        this.getTableData()

    }
    // 打开抽屉开始驳回数据
    async rejectCurData() {
        const { Input, Dialog } = window.Next
        let rejectReason = ''
        const onChangeReason = (e) => {
            rejectReason = e
        }
        Dialog.confirm({
            title: '驳回',
            v2: true,
            width: 500,
            content: (<div style={{ display: 'flex' }}>
                <div style={{ width: 120 }}>驳回理由：</div>
                <div style={{ flex: 1, width: 0 }}>
                    <Input.TextArea
                        style={{ width: 250 }}
                        rows={2}
                        defaultValue={''}
                        onChange={onChangeReason}
                    />
                </div>
            </div>),
            onOk: async () => {
                if (rejectReason === '' || rejectReason === null) {
                    this.showMessage('error', '错误', '请输入驳回理由')
                    return Promise.reject()
                }
                const flag = await this.dealRejectData(this.state.curEditData, rejectReason)
                if (flag) {
                    this.showMessage('success', '成功', '驳回询价单成功')
                    const element = document.querySelector('.next-drawer-body')
                    const isMobile = this.state.isMobile
                    if (isMobile) {
                        element.classList.remove('mobile-height')
                    } else {
                        element.classList.remove('pc-height')
                    }
                    this.setState({
                        showAllocationFlag: false,
                        curEditData: {},
                        inquiryLeftTableData: [],
                        inquiryRightTableData: [],
                        quotationCycle: null,
                        supplyCycle: null
                    }, () => {

                        this.getTableData()
                    })
                } else {
                    this.showMessage('error', '失败', '驳回询价单失败')
                }
            }
        })

    }
    // 开始审核
    async examineData(record) {
        await this.allocationData(record)
    }
    // 处理已报价商品数 报价进度 已报价供应商
    dealBaseInfoData_A(caigouList, supplierList) {
        // 商品纬度拆分
        const mapA = _.groupBy(caigouList, 'inquiryGoodsId')
        // 供应商纬度拆分
        const mapB = _.groupBy(caigouList, 'supplierId')
        let quotedGoodsLen = 0
        for (const key in mapA) {
            if (mapA[key].some(item => item.supplierQuotationStatus === '已报价')) {
                quotedGoodsLen++
            }
        }
        const quotationProgressLenB = Object.keys(mapB).length
        let quotationProgressLenA = 0
        let quotationSupplier = []
        for (const key in mapB) {
            if (mapB[key].some(item => item.supplierQuotationStatus === '已报价')) {
                quotationProgressLenA++
                const supplierS = supplierList.filter(e => e.supplierId === key)
                if (supplierS && supplierS.length) {
                    quotationSupplier.push(supplierS[0].supplierName)
                }
            }
        }
        return { quotedGoodsLen, quotationProgressLenA, quotationProgressLenB, quotationSupplier }
    }
    // 详情页按照不同的tab进行数据切换
    onDetailTabChange(e) {
        // 初始化数据，再根据不同的tab进行数据请求
        const { curEditData, caigouList, supplierList } = this.state
        let obj = {
            curDetailTabKey: e,
            detailTableData: [],
            detailTotalElements: 0,
            supplierDimensionList: [],
            detailQueryParam: {
                conditionFilter: { conditionType: "and", conditions: [] },
                page: { current: 1, pages: 0, size: 10, total: 1 },
                sorts: [],
                inquiryNumber: '',
                code: '',
                formId: ""
            },
        }
        this.setState({ ...obj }, () => {
            // 根据不同的tab进行数据处理和请求
            if (e === 'TAB_A') {
                this.getDetailTableData(curEditData, caigouList, supplierList)
            } else if (e === 'TAB_B') {
                this.getSupplierDimensionList(curEditData)
            } else {
                this.getQuotationProgressList(curEditData)
            }
        })
    }
    onDetailTableDataPageChange(e) {
        let params = { ...this.state.detailQueryParam }
        params.page.current = e
        const { curEditData, caigouList, supplierList } = this.state
        this.setState({
            detailQueryParam: params
        }, () => {
            this.getDetailTableData(curEditData, caigouList, supplierList)
        })
    }
    onDetailTableDataPageSizeChange(e) {
        let params = { ...this.state.detailQueryParam }
        params.page.size = e
        params.page.current = 1
        const { curEditData, caigouList, supplierList } = this.state
        this.setState({
            detailQueryParam: params
        }, () => {
            this.getDetailTableData(curEditData, caigouList, supplierList)
        })
    }
    detailTableColumn() {
        const { curEditData } = this.state
        let baseColumn = [
            { title: '序号', dataIndex: 'goodsIndex', width: 50, lock: 'left' },
            { title: '商品名称', dataIndex: 'goodsName', width: 90, lock: 'left' },
            { title: '单位', dataIndex: 'measurementUnit', width: 60, lock: 'left' },
            { title: '商品图片', dataIndex: 'goodsPic' },
            { title: '品牌', dataIndex: 'goodsBrand' },
            { title: '采购规格标准', dataIndex: 'procurementStandards', width: 200 },
            { title: '详细配送要求', dataIndex: 'deliveryMethod', width: 150 },
            { title: '上月销量汇总', dataIndex: 'lastmonth_sales', width: 150 },
            { title: '限高价', dataIndex: 'limitHighPrice', width: 150 },
            { title: '注意事项', dataIndex: 'note', width: 200 },
        ]
        let otherColumn = []
        if (curEditData.bidStatus === '报价中') {
            otherColumn = [
                { title: '报价供应商', dataIndex: 'quotationSupplier' },
            ]
        } else if (curEditData.bidStatus === '待确认') {
            otherColumn = [
                { title: '报价进度', dataIndex: 'quotationSupplier' }
            ]

        } else if (
            // curEditData.bidStatus === '待确认' ||
            // curEditData.bidStatus === '二次报价' ||
            // curEditData.bidStatus === '待定价' ||
            curEditData.bidStatus === '已定价' ||
            curEditData.bidStatus === '已关闭'
        ) {
            otherColumn = [
                { title: '最低价', dataIndex: 'lowestPrice' },
                { title: '最低价税率', dataIndex: 'lowestPriceRate' },
                { title: '最低价供应商', dataIndex: 'lowestPriceSupplier', width: 200 },
                { title: '次低价', dataIndex: 'secondLowestPrice' },
                { title: '次低价税率', dataIndex: 'secondLowestPriceRate' },
                { title: '次低价供应商', dataIndex: 'secondLowestPriceSupplier', width: 200 },
                { title: '最终采购价', dataIndex: 'finalPrice' },
                { title: '最终供应商', dataIndex: 'finalSupplier', width: 200 },
            ]
        }
        return [...baseColumn, ...otherColumn]
    }
    //
    // 报价详情中弹窗数据统一处理
    async getQuotationDetailPageData() {
        const {
            quotationDetailType,
            quotationDetailRecord,
            byType,
            curEditData
        } = this.state
        console.log('quotationDetailRecord', quotationDetailRecord)
        const { haiju_caigoubaojiaxiangqing, haiju_commodity, planSupply_product } = this.state.formMap
        let queryParams = _.cloneDeep(this.state.quotationDetailPageParam)
        queryParams.formId = haiju_caigoubaojiaxiangqing
        let baseConditions = [
            { conditionOperator: 'eq', field: 'inquiryNumber', conditionValues: [curEditData.inquiryNumber] }
        ]
        let otherConditions = []
        if (quotationDetailType === byType.GOODS) {
            // 商品维度
            otherConditions = [
                { conditionOperator: 'eq', field: 'inquiryGoodsId', conditionValues: [quotationDetailRecord.detail.product_code] }
            ]
        } else if (quotationDetailType === byType.SUPPLIER) {
            // 按供应商维度
            otherConditions = [
                { conditionOperator: 'eq', field: 'supplierId', conditionValues: [quotationDetailRecord.supplier.supplierId] },
                { conditionOperator: 'eq', field: 'supplierQuotationStatus', conditionValues: ['已报价'] },
            ]
        } else if (quotationDetailType === byType.ROUND) {
            otherConditions = [
                { conditionOperator: 'eq', field: 'supplierId', conditionValues: [quotationDetailRecord.supplierId] },
                { conditionOperator: 'eq', field: 'quotationRound', conditionValues: [quotationDetailRecord.quotationProgress] },
                { conditionOperator: 'eq', field: 'supplierQuotationStatus', conditionValues: ['已报价'] },
            ]
        }
        queryParams.conditionFilter.conditions = [...baseConditions, ...otherConditions]
        const tableRes = await this.dataSourceMap['queryFormData'].load(queryParams)
        let arrList = []
        let quotationDetailTableData = []
        if (tableRes.code === 200) {
            this.setState({ quotationDetailTotalElements: tableRes.result.total })
            console.log('tableRes.result.records', tableRes.result.records)
            if (tableRes.result.records && tableRes.result.records.length > 0) {
                const tableList = [...tableRes.result.records]
                // 开始进行数据处理
                if (quotationDetailType === byType.GOODS) {
                    // 按商品维度统计
                    const supplierConditions = tableList.map(e => {
                        return { supplierId: e.supplierId }
                    })
                    const { supplierList } = await this.getSupplierBaseData(supplierConditions)
                    tableList.forEach((item, index) => {
                        const supplierItem = supplierList.find(e => e.supplierId === item.supplierId)
                        let obj = {
                            supplierIndex: index + 1,
                            supplierName: supplierItem.supplierName || '',
                            quotationRound: item.quotationRound + '轮次',
                            supplierQuotationStatusName: item.supplierQuotationStatus === '已报价' ? '是' : '否'
                        }
                        arrList.push(obj)
                    })
                } else if (quotationDetailType === byType.SUPPLIER || quotationDetailType === byType.ROUND) {
                    // 按供应商维度处理数据 // 按轮次维度处理数据
                    // 获取商品基础信息
                    const goodsL = tableList.map(e => e.inquiryGoodsId)
                    const goodsListArr = Array.from(new Set(goodsL))
                    const goodsConditions = goodsListArr.map(e => {
                        return { goodsId: e }
                    })
                    const goodsSpecsConditions = goodsListArr.map(e => {
                        return { goodsId: e, unitType: '基础单位' }
                    })
                    const { goodsList, goodsSpecsList, picObj, packageProduct } = await this.getGoodsBaseData(goodsConditions, goodsSpecsConditions, curEditData.detail.inquiryPackageId)
                    // packageProduct 标包商品数据 用来排序呢
                    let quantityOfRequestedGoodsList = [] // 计划供应商品
                    let winningList = [] // 供应商中标表
                    const planProductSearchParams = {
                        searchList: [
                            { formId: planSupply_product, conditions: [{ inquiryNumber: curEditData.inquiryNumber }] } // 实时请求计划商品是因为前边有操作会改掉这个数据
                        ]
                    }
                    // 待确认/二次报价状态下查询是否中标
                    if (curEditData.bidStatus === '待确认' || curEditData.bidStatus === '二次报价' ||
                        curEditData.bidStatus === '待定价' || curEditData.bidStatus === '已定价' ||
                        curEditData.bidStatus === '已关闭'
                    ) {
                        let supplierId = quotationDetailType === byType.SUPPLIER ? quotationDetailRecord.supplier.supplierId : quotationDetailRecord.supplierId
                        planProductSearchParams.searchList.push({
                            formId: haiju_commodity,
                            conditions: [{ inquiryNumber: curEditData.inquiryNumber, supplierId }]
                        })
                    }
                    const planRes = await this.getMoreTableData(planProductSearchParams)
                    if (planRes.hasOwnProperty(planSupply_product)) {
                        quantityOfRequestedGoodsList = planRes[planSupply_product]
                    }
                    if (planRes.hasOwnProperty(haiju_commodity)) {
                        winningList = planRes[haiju_commodity]
                    }

                    for (let i = 0; i < tableList.length; i++) {
                        const item = tableList[i]
                        const goodsL = goodsList.filter(e => e.goodsId === item.inquiryGoodsId)
                        const sortIdList = packageProduct.filter(e => e.product_code === item.goodsId)
                        if (goodsL && goodsL.length) {
                            const goodsItem = goodsL[0]
                            let baseObj = {
                                goodsIndex: i + 1, // 序号
                                goodsPic: '', // 商品图片
                                goodsName: goodsItem.goodsName, // 商品名称
                                goodsBrand: goodsItem.goodsBrand, // 品牌
                                procurementStandards: goodsItem.procurementStandards, // 采购规格标准
                                deliveryMethod: goodsItem.deliveryMethod, // 配送要求
                                lastmonth_sales: '', // 计划采购量
                                measurementUnit: '', // 单位
                                note: '', // 注意事项
                                quotationRound: item.quotationRound, // 报价次数
                                supplierQuotationStatusName: item.supplierQuotationStatus === '已报价' ? '是' : '否', // 是否报价
                                sortId: sortIdList.length ? sortIdList[0].sortId : 0, // 商品序号，用来排序
                            }
                            let otherObj = {}
                            const aItem = quantityOfRequestedGoodsList.find(e => e.product_code === item.inquiryGoodsId)
                            if (curEditData.bidStatus === '报价中' || curEditData.bidStatus === '待审核') {
                                otherObj = {
                                    supplierQuotationStatusName: item.supplierQuotationStatus === '已报价' ? '是' : '否', // 是否报价
                                }
                            } else {
                                let isWinningList = winningList.filter(e => e.winningBidGoodsId === item.inquiryGoodsId
                                    && e.isConfirmStatus === '是'
                                    && e.winningRound === item.quotationRound
                                )
                                console.log('isWinningList', isWinningList)

                                otherObj = {
                                    limitHighPrice: aItem.limitHighPrice, // 限高价
                                    supplierGoodsPrice: item.supplierGoodsPrice, // 供货报价
                                    deliveriesRate: item.deliveriesRate, // 供货税率
                                    InvoiceType: item.InvoiceType, // 发票类型
                                    supplierBrand: item.supplierBrand, // 供货品牌
                                    remark: item.remark, // 供货备注
                                    quotationRound: item.quotationRound, // 报价次数
                                    isWinning: isWinningList.length ? '是' : '否', // 是否中标
                                }
                            }
                            let obj = { ...baseObj, ...otherObj }
                            obj.lastmonth_sales = aItem.lastmonth_sales
                            if (goodsItem.previewImage && goodsItem.previewImage.length) {
                                obj.goodsPic = picObj[goodsItem.previewImage[0]]
                            }
                            const goodsSpecsL = goodsSpecsList.filter(e => e.goodsId === item.inquiryGoodsId)
                            if (goodsSpecsL && goodsSpecsL.length) {
                                obj.measurementUnit = goodsSpecsL[0].measurementUnit
                            }
                            obj.note = aItem.note
                            arrList.push(obj)
                        }
                    }
                }
                if (quotationDetailType === byType.SUPPLIER || quotationDetailType === byType.ROUND) {
                    const mapA = _.groupBy(arrList, 'quotationRound')
                    let arr = []
                    for (const key in mapA) {
                        const tempArr = mapA[key].sort((a, b) => a.sortId - b.sortId)
                        let obj = {
                            quotationRound: key,
                            list: [...tempArr]
                        }
                        arr.push(obj)
                    }
                    quotationDetailTableData = arr.sort((a, b) => b.quotationRound - a.quotationRound)

                } else {
                    quotationDetailTableData = [...arrList]
                }
                this.setState({ quotationDetailTableData })
            } else {
                this.setState({ quotationDetailTableData: [] })
            }
        }

    }
    // 关闭报价详情弹窗
    closeQuotationDetailDialog() {
        this.setState({
            showQuotationDetailFlag: false
        })
    }
    // 报价弹窗详情分页数据变更
    onQuotationDetailPageChange(e) {
        let params = { ...this.state.quotationDetailPageParam }
        params.page.current = e
        this.setState({
            quotationDetailPageParam: params
        }, () => {
            this.getQuotationDetailPageData()
        })
    }
    // 报价状态 按轮次查看详情
    oprRoundDetailData(record) {
        this.setState({
            quotationDetailType: "ROUND",
            showQuotationDetailFlag: true,
            quotationDetailRecord: { ...record },
            quotationDetailTotalElements: 0,
            quotationDetailTableData: [],
            quotationDetailInfo: {
                quotationProgress: record.quotationProgress,
                quantityOfRequestedGoods: record.quantityOfRequestedGoods,
                quotedGoodsLen: record.quotedGoodsLen
            }
        }, () => {
            this.onQuotationDetailPageChange(1)
        })
    }
    // 报价状态 按供应商查看详情
    oprSupplierDetailData(record) {
        this.setState({
            quotationDetailType: "SUPPLIER",
            showQuotationDetailFlag: true,
            quotationDetailRecord: { ...record },
            quotationDetailTotalElements: 0,
            quotationDetailTableData: [],
            quotationDetailInfo: {
                supplierName: record.supplierName,
                quantityOfRequestedGoods: record.quantityOfRequestedGoods,
                quotedGoodsLen: record.quotedGoodsLen,
                winningBid: record.winningBid
            }
        }, () => {
            this.onQuotationDetailPageChange(1)
        })
    }
    // 按商品维度表格数据进行处理
    oprDetailTableButton(value, index, record, type) {
        switch (type) {
            // 报价中进行查看详情
            case 'detailInfo':
                this.oprDetailTableData(value, index, record)
                break
            // 待确认/二次报价 状态中，进行再报价
            case 'reQuote':
                this.reQuoteCurGoods(value, index, record)
                break
            // 待确认/二次报价 状态中，确认供应商
            case 'confirmSupplier':
                this.confirmSupplierData(value, index, record)
                break
            // 待定价状态下进行查看详情
            case 'viewDetail':
                break
            default:
                break
        }
    }
    // 关闭再报价/确认供应商对话框
    closeReQuoteDialog() {
        this.setState({
            reQuoteList: {
                goodsList: {},
                quoteList: [],
                otherList: {},
                supplierOptionList: [],
                curRecord: {}
            },
            showReQuoteFlag: false
        })
    }
    // 公共处理询价状态
    async dealXunJiaCommon() {
        const { quoteType, reQuoteList, curReQuoteEditData } = this.state
        const { haiju_caigoubaojiaxiangqing, planSupply_product, haiju_xunjiapeizhi } = this.state.formMap
        const quantityOfRequestedGoodsList = curReQuoteEditData.quantityOfRequestedGoodsList
        const aConditions = []
        let quotationRound
        if (curReQuoteEditData.detail.bidStatus === '待确认') {
            quotationRound = curReQuoteEditData.detail.quotationProgress + 1
        } else if (curReQuoteEditData.detail.bidStatus === '二次报价') {
            quotationRound = curReQuoteEditData.detail.quotationProgress
        }
        for (const item of quantityOfRequestedGoodsList) {
            aConditions.push({
                inquiryNumber: curReQuoteEditData.inquiryNumber,
                inquiryGoodsId: item.product_code,
                quotationRound,
            })
        }
        const searchParams = {
            searchList: [
                { formId: haiju_caigoubaojiaxiangqing, conditions: [...aConditions] }
            ]
        }
        const list = await this.getMoreTableData(searchParams)
        let detail = []
        if (list.hasOwnProperty(haiju_caigoubaojiaxiangqing)) {
            detail = [...list[haiju_caigoubaojiaxiangqing]]
        }
        let bidStatus = ''
        let quotationProgress = 1
        if (detail.length === 0) {
            // 没有任何一个商品进行二次报价
            bidStatus = '待确认'
            quotationProgress = curReQuoteEditData.detail.bidStatus === '待确认' ?
                curReQuoteEditData.detail.quotationProgress : curReQuoteEditData.detail.quotationProgress - 1
        } else {
            // 如果有任何一个商品进行二次报价，更新为二次报价的状态
            bidStatus = '二次报价'
            quotationProgress = curReQuoteEditData.detail.bidStatus === '待确认' ?
                curReQuoteEditData.detail.quotationProgress + 1 : curReQuoteEditData.detail.quotationProgress
        }
        // 更新主表状态
        let updateMainForm = {
            formId: haiju_xunjiapeizhi,
            id: curReQuoteEditData.detail._id,
            data: {
                bidStatus,
                quotationProgress, // 报价轮次
            }
        }
        const updateRes = await this.dataSourceMap['updateFormData'].load(updateMainForm)
        // 查询数据
        let queryParams = _.cloneDeep(this.state.baseQueryParam)
        queryParams.formId = haiju_xunjiapeizhi
        queryParams.conditionFilter.conditions = [
            { conditionOperator: 'eq', field: 'inquiryNumber', conditionValues: [curReQuoteEditData.inquiryNumber] },
        ]
        const res = await this.dataSourceMap['queryFormData'].load(queryParams)
        if (res.code === 200) {
            return res.result.records[0]
        }
        return {}
    }

    // 待确认或二次报价状态下弹窗 点击确定按钮进行数据提交
    async confirmSubmitReQuoteData() {
        const { quoteType, reQuoteList, curReQuoteEditData } = this.state
        const { haiju_caigoubaojiaxiangqing, planSupply_product, haiju_xunjiapeizhi, haiju_commodity } = this.state.formMap
        // 开始进行数据组装并提交
        if (quoteType === 'REQUOTE') {
            // 再报价确定供应商
            const { curRecord, otherList } = this.state.reQuoteList
            // 采购详情表，先删后增
            const list = await this.getReQuoteCurGoodsList(curRecord)
            if (list.length) {
                const params = {
                    formId: haiju_caigoubaojiaxiangqing,
                    data: {
                        _id: list.map(e => e._id)
                    }
                }
                await this.dataSourceMap['deleteFormData'].load(params)
            }
            // 如果选中了供应商，然后开始新增采购报价详情
            if (otherList.supplierIdArr) {
                let addArr = []
                for (const item of otherList.supplierIdArr) {
                    let obj = {
                        supplierId: item,
                        inquiryNumber: curReQuoteEditData.inquiryNumber,
                        inquiryGoodsId: curRecord.goodsId,
                        quotationRound: 1, // 报价轮次
                        supplierQuotationStatus: '未报价'
                    }
                    if (curReQuoteEditData.detail.bidStatus === '待确认') {
                        obj.quotationRound = curReQuoteEditData.detail.quotationProgress + 1
                    } else if (curReQuoteEditData.detail.bidStatus === '二次报价') {
                        obj.quotationRound = curReQuoteEditData.detail.quotationProgress
                    }
                    addArr.push(obj)
                }
                const addParams = {
                    formId: haiju_caigoubaojiaxiangqing,
                    datas: [...addArr]
                }
                const addRes = await this.dataSourceMap['addMoreFormData'].load(addParams)
                // 选中了供应商，要把该商品中标的结果给删掉，因为再报价和确定供应商是互斥的操作
                if (addRes.code === 200) {
                    const listD = await this.getWinningSupplierOfGoods(curRecord)
                    if (listD && listD.length) {
                        const listItem = listD[0]
                        const deleteParams = {
                            formId: haiju_commodity,
                            data: {
                                _id: [listItem._id]
                            }
                        }
                        await this.dataSourceMap['deleteFormData'].load(deleteParams)
                    }
                }
            }
            // 开始更新计划供应商品表
            const updateData = {
                formId: planSupply_product,
                id: reQuoteList.curRecord.detail._id,
                data: {
                    limitHighPrice: otherList.limitHighPrice,
                    note: otherList.note
                }
            }
            const updateRes = await this.dataSourceMap['updateFormData'].load(updateData)
            // 更新计划供应商品表完毕
            // 开始查询主表状态，进行状态更新
            const detailList = await this.dealXunJiaCommon()
            let curReQuoteEditDataList = _.cloneDeep(curReQuoteEditData)
            curReQuoteEditDataList.detail = { ...detailList }
            curReQuoteEditDataList.bidStatus = detailList.bidStatus
            // 主表状态更新完成
            this.setState({
                reQuoteList: {
                    goodsList: {},
                    quoteList: [],
                    otherList: {},
                    supplierOptionList: [],
                },
                quoteType: 'REQUOTE',
                showReQuoteFlag: false
            }, () => {
                this.viewDetailData(curReQuoteEditDataList)
            })
        } else if (quoteType === 'CONFIRM') {
            const { curRecord, otherList } = this.state.reQuoteList
            if (otherList.isConfirmSupplier) {
                if (!otherList.supplierId) {
                    this.showMessage('error', '错误', '请选择供应商')
                    return
                }
                if (otherList.winningBidPrice === '') {
                    this.showMessage('error', '错误', '请输入中标价格')
                }
            }
            const listD = await this.getWinningSupplierOfGoods(curRecord)
            // 如果存在该数据，则进行更新 如果不存在该中标商品，则新增
            if (listD.length) {
                const updateData = {
                    formId: haiju_commodity,
                    id: listD[0]._id,
                    data: {
                        isConfirmSupplier: otherList.isConfirmSupplier ? '是' : '否',
                        supplierId: otherList.isConfirmSupplier ? otherList.supplierId : '',
                        deliveriesRate: otherList.isConfirmSupplier ? otherList.deliveriesRate : '',
                        InvoiceType: otherList.isConfirmSupplier ? otherList.InvoiceType : '',
                        winningBidPrice: otherList.isConfirmSupplier ? otherList.winningBidPrice : '',
                    }
                }
                const updateRed = await this.dataSourceMap['updateFormData'].load(updateData)
            } else {
                let obj = {
                    supplierId: otherList.supplierId, // 供应商编号
                    inquiryNumber: curReQuoteEditData.inquiryNumber, // 询价单号
                    winningBidGoodsId: curRecord.goodsId, // 中标商品编号
                    winningBidPrice: otherList.isConfirmSupplier ? otherList.winningBidPrice : '', // 中标报价
                    deliveriesRate: otherList.isConfirmSupplier ? otherList.deliveriesRate : '', // 中标税率
                    InvoiceType: otherList.isConfirmSupplier ? otherList.InvoiceType : '', // 中标发票类型
                    winningRound: '', // 中标轮次
                    isConfirmSupplier: otherList.isConfirmSupplier ? '是' : '否', // 本次询价是否确定供应商
                    isConfirmStatus: '否', // 本次提交数据是否通过审核
                }
                if (curReQuoteEditData.detail.bidStatus === '待确认') {
                    obj.winningRound = curReQuoteEditData.detail.quotationProgress
                } else if (curReQuoteEditData.detail.bidStatus === '二次报价') {
                    obj.winningRound = curReQuoteEditData.detail.quotationProgress - 1
                }
                const addParams = {
                    formId: haiju_commodity,
                    data: { ...obj }
                }
                const addRes = this.dataSourceMap['addFormData'].load(addParams)
            }
            // 更新完成
            this.setState({
                reQuoteList: {
                    goodsList: {},
                    quoteList: [],
                    otherList: {},
                    supplierOptionList: [],
                },
                quoteType: 'REQUOTE',
                showReQuoteFlag: false
            }, () => {
                this.viewDetailData(curReQuoteEditData)
            })

        }
    }
    // 待确认或二次报价状态下确认供应商
    async confirmSupplierData(value, index, record) {
        // 确定供应商之前先判断有没有进行再报价
        if (record.isReQuote) {
            this.showMessage('error', '错误', '该商品已经进行再报价，不能确认供应商')
            return
        }
        // 开始组装数据
        // 商品基础信息
        const {
            goodsName,
            goodsBrand,
            measurementUnit,
            limitHighPrice,
            goodsSpecsList,
            goodsPic,
            detail,
            goodsItem,
            caigouList,
            supplierList
        } = record
        const goodsList = {
            goodsName,
            goodsBrand,
            measurementUnit,
            limitHighPrice,
            goodsPic,
            outputTaxRate: goodsItem.outputTaxRate,
            outputInvoiceType: goodsItem.outputInvoiceType,
            specificationDescription: goodsSpecsList.specificationDescription
        }
        let reQuoteList = _.cloneDeep(this.state.reQuoteList)
        let otherList = {}
        let quoteList = this.dealLowerPriceData(caigouList, supplierList, detail)
        // 开始获取要确定的供应商列表
        const listC = this.getConfirmCurSupplierList(record, caigouList)
        // 获取中标的该供应商
        const listD = await this.getWinningSupplierOfGoods(record)
        otherList = {
            isConfirmSupplier: true,
            supplierId: '',
            deliveriesRate: '',
            InvoiceType: '',
            winningBidPrice: '',
        }
        if (listD && listD.length) {
            const aItem = listD[0]
            otherList.isConfirmSupplier = aItem.isConfirmSupplier === '是'
            otherList.supplierId = aItem.supplierId
            otherList.deliveriesRate = aItem.deliveriesRate
            otherList.InvoiceType = aItem.InvoiceType
            otherList.winningBidPrice = aItem.winningBidPrice
        }
        reQuoteList.goodsList = { ...goodsList }
        reQuoteList.quoteList = [...quoteList]
        reQuoteList.curRecord = { ...record }
        reQuoteList.supplierOptionList = [...listC]
        reQuoteList.otherList = { ...otherList }
        this.setState({
            quoteType: 'CONFIRM',
            reQuoteList,
            showReQuoteFlag: true
        })
    }
    // 处理再报价供应商列表
    async getReQuoteCurGoodsList(record) {
        const { curReQuoteEditData } = this.state
        const { haiju_caigoubaojiaxiangqing } = this.state.formMap
        // 点击获取再报价供应商
        let quotationRound = null
        if (curReQuoteEditData.detail.bidStatus === '待确认') {
            quotationRound = curReQuoteEditData.detail.quotationProgress + 1
        } else if (curReQuoteEditData.detail.bidStatus === '二次报价') {
            quotationRound = curReQuoteEditData.detail.quotationProgress
        }
        const aConditions = [{
            inquiryNumber: curReQuoteEditData.inquiryNumber,
            quotationRound,
            inquiryGoodsId: record.detail.product_code
        }]
        const searchParams = {
            searchList: [
                { formId: haiju_caigoubaojiaxiangqing, conditions: [...aConditions] }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        let list = []
        if (res.hasOwnProperty(haiju_caigoubaojiaxiangqing)) {
            list = res[haiju_caigoubaojiaxiangqing]
        }
        return list
    }
    // 获取确认供应商选择的列表
    getConfirmCurSupplierList(record, caigouList) {
        const { supplierList } = record
        let list = []
        for (const item of supplierList) {
            let obj = {
                supplierId: item.supplierId,
                supplierName: item.supplierName,
                deliveriesRate: '', // 进项税率
                InvoiceType: '', // 发票类型
                winningBidPrice: 0, // 中标价
            }
            const listA = caigouList.filter(e => e.supplierId === item.supplierId
                && e.inquiryGoodsId === record.goodsId
                && e.supplierQuotationStatus === '已报价'
            )
            const listB = listA.sort((a, b) => a.supplierGoodsPrice - b.supplierGoodsPrice)
            if (listB.length) {
                const listItem = listB[0]
                obj.deliveriesRate = listItem.deliveriesRate
                obj.InvoiceType = listItem.InvoiceType
                obj.winningBidPrice = listItem.supplierGoodsPrice
            }
            list.push(obj)
        }
        return list
    }
    // 获取中标商品的供应商
    async getWinningSupplierOfGoods(record) {
        const { curReQuoteEditData } = this.state
        const { haiju_commodity } = this.state.formMap
        const conditions = [
            {
                inquiryNumber: curReQuoteEditData.inquiryNumber,
                winningBidGoodsId: record.goodsId
            }
        ]
        const searchParams = {
            searchList: [
                { formId: haiju_commodity, conditions: [...conditions] }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        let list = []
        if (res.hasOwnProperty(haiju_commodity)) {
            list = [...res[haiju_commodity]]
        }
        return list
    }
    dealLowerPriceData(caigouList, supplierList, detail) {
        let quoteList = []
        // 供应商报价最低数据处理
        const listB = caigouList.filter(e => e.inquiryGoodsId === detail.product_code && e.supplierQuotationStatus === '已报价')
        const temp = _.groupBy(listB, 'supplierId')
        let eArr = []
        for (const key in temp) {
            temp[key] = temp[key].sort((a, b) => a.supplierGoodsPrice - b.supplierGoodsPrice)
            if (temp[key] && temp[key].length) {
                eArr.push(temp[key][0])
            }
        }
        if (eArr.length) {
            eArr.sort((a, b) => a.supplierGoodsPrice - b.supplierGoodsPrice)
            // 这里边只筛选出最低价/次低价/次次低价
            const sliceArr = eArr.slice(0, 3)
            for (const listItem of sliceArr) {
                let supplierNameList = supplierList.filter(e => e.supplierId === listItem.supplierId)
                let supplierName = ''
                if (supplierNameList && supplierNameList.length) {
                    supplierName = supplierNameList[0].supplierName
                }
                const obj = {
                    supplierName, // 供应商
                    priceParity: listItem.supplierGoodsPrice, // 比价金额
                    supplierGoodsPrice: listItem.supplierGoodsPrice, // 报价(含税)
                    exTaxPrice: '', // 除税价
                    deliveriesRate: listItem.deliveriesRate, // 进项税率
                    InvoiceType: listItem.InvoiceType, // 发票类型
                    supplierBrand: listItem.supplierBrand, // 品牌
                    remark: listItem.remark, // 备注
                    quotationRound: listItem.quotationRound, // 报价轮次
                    createTime: listItem.updateTime, // 报价时间
                }
                // 计算除税价
                const num = Decimal.add(100, listItem.deliveriesRate).div(100)
                const exTaxPrice = Decimal(listItem.supplierGoodsPrice).div(num).toFixed(2)
                obj.exTaxPrice = exTaxPrice
                quoteList.push(obj)
            }
        }
        return quoteList
    }
    // 待确认或二次报价状态下发起再报价
    async reQuoteCurGoods(value, index, record) {
        // 开始组装数据
        // 商品基础信息
        const {
            goodsName,
            goodsBrand,
            measurementUnit,
            limitHighPrice,
            goodsSpecsList,
            goodsPic,
            detail,
            caigouList,
            supplierList
        } = record
        let reQuoteList = _.cloneDeep(this.state.reQuoteList)
        const goodsList = {
            goodsName,
            goodsBrand,
            measurementUnit,
            limitHighPrice,
            goodsPic,
            specificationDescription: goodsSpecsList.specificationDescription
        }
        // 去处理供应商报价最低/次低价/次次低价
        let quoteList = this.dealLowerPriceData(caigouList, supplierList, detail)
        let otherList = {}
        // 开始处理再报价供应商
        const listA = await this.getReQuoteCurGoodsList(record)
        let supplierIdArr = []
        if (listA.length) {
            supplierIdArr = listA.map(e => e.supplierId)
        }
        otherList = {
            supplierIdArr: [...supplierIdArr],
            limitHighPrice: record.limitHighPrice,
            note: record.note
        }
        // 再报价的供应商列表
        const supplierOptionList = supplierList.filter(e => e.supplierStatus === '正常').map(item => {
            return { label: item.supplierName, value: item.supplierId }
        })
        reQuoteList.goodsList = { ...goodsList }
        reQuoteList.quoteList = [...quoteList]
        reQuoteList.otherList = { ...otherList }
        reQuoteList.supplierOptionList = [...supplierOptionList]
        reQuoteList.curRecord = { ...record }
        this.setState({
            quoteType: 'REQUOTE',
            reQuoteList,
            showReQuoteFlag: true
        })
    }
    // 渲染再报价/确认供应商详情弹窗
    renderQuoteDetailJSX() {
        return this.RenderQuoteDetailJSXData()
    }

    // 报价状态详情表格进行操作按钮
    oprDetailTableData(value, index, record, type) {
        this.setState({
            quotationDetailType: "GOODS",
            showQuotationDetailFlag: true,
            quotationDetailRecord: { ...record },
            quotationDetailTotalElements: 0,
            quotationDetailTableData: [],
            quotationDetailInfo: {
                goodsName: record.goodsName
            }
        }, () => {
            this.onQuotationDetailPageChange(1)
        })
    }
    // 渲染报价中报价详情弹窗数据
    renderQuotationDetailData() {
        return this.RenderQuotationDetailDataData()
    }
    // 按轮次维度统计查询报价数据
    async getQuotationProgressList(record) {
        let quotationProgressList = []
        const {
            supplierList, // 供应商
            caigouList, // 采购报价详情
        } = await this.getDetailData_A(record)
        // 采购详情进行数据数据拆分
        // 先按轮次拆分
        const listA = _.groupBy(caigouList, 'quotationRound')
        for (const key in listA) {
            const item = listA[key]
            const mapA = _.groupBy(item, 'inquiryGoodsId')
            const mapB = _.groupBy(item, 'supplierId')
            const quantityOfRequestedGoods = Object.keys(mapA).length
            const quantityOfInquirySuppliers = Object.keys(mapB).length
            let quotedGoodsLen = 0
            for (const key in mapA) {
                if (mapA[key].some(item => item.supplierQuotationStatus === '已报价')) {
                    quotedGoodsLen++
                }
            }
            let quotationProgressLenA = 0
            let quotationSupplier = []
            for (const key1 in mapB) {
                if (mapB[key1].some(item => item.supplierQuotationStatus === '已报价')) {
                    quotationProgressLenA++
                }
                const listA = supplierList.filter(e => e.supplierId === key1)
                const supplierName = listA && listA.length ? listA[0].supplierName : ''
                const len = mapB[key1].filter(e => e.supplierQuotationStatus === '已报价').length
                let obj = {
                    supplierName,
                    supplierId: key1,
                    quotationProgress: Number(key),
                    quantityOfRequestedGoods: mapB[key1].length, // 询价商品
                    quotedGoodsLen: len // 已报价商品
                }
                quotationSupplier.push(obj)
            }
            let obj = {
                quotationProgress: Number(key), // 报价轮次
                quantityOfRequestedGoods, // 询价商品数
                quantityOfInquirySuppliers, // 询价供应商
                quotedGoodsLen, // 已报价商品数
                quotationRate: `${quotationProgressLenA}/${quantityOfInquirySuppliers}`, // 报价进度
                quotationDetail: [...quotationSupplier], // 报价详情
                quotationStartTime: item.length > 0 ? item[0].quotationStartTime : '', // 报价开始时间
                quotationEndTime: item.length > 0 ? item[0].quotationEndTime : '', // 报价结束时间
                record,
                detail: listA[key]
            }
            quotationProgressList.push(obj)
        }
        this.setState({
            quotationProgressList
        })
    }
    // 按供应商维度查询报价数据
    async getSupplierDimensionList(record) {
        let supplierDimensionList = []
        const {
            supplierList, // 供应商
            caigouList, // 采购报价详情
        } = await this.getDetailData_A(record)
        const mapA = _.groupBy(caigouList, 'supplierId')
        // 获取中标商品数据
        const { haiju_commodity } = this.state.formMap
        const conditions = [{ inquiryNumber: record.inquiryNumber, isConfirmStatus: '是' }]
        const searchParams = {
            searchList: [
                { formId: haiju_commodity, conditions: [...conditions] }
            ]
        }
        let winningList = []
        const res = await this.getMoreTableData(searchParams)
        if (res.hasOwnProperty(haiju_commodity)) {
            winningList = res[haiju_commodity]
        }
        for (const item of supplierList) {
            const list = mapA[item.supplierId]
            const quantityOfRequestedGoodsId = list && list.length ? list.map(e => e.inquiryGoodsId) : []
            const arr2 = Array.from(new Set(quantityOfRequestedGoodsId))
            const quotedGoodsList = list && list.length ? list.filter(e => e.supplierQuotationStatus === '已报价') : []
            // 相同商品去重处理
            const arr = quotedGoodsList.map(e => e.inquiryGoodsId)
            const arr1 = Array.from(new Set(arr))
            let obj = {
                supplierName: item.supplierName, // 供应商名称
                quantityOfRequestedGoods: arr2.length, // 询价商品数量
                quotedGoodsLen: arr1.length, // 已报价商品数
                winningBid: 0,
                record,
                supplier: item
            }
            const aList = winningList.filter(e => e.supplierId === item.supplierId && e.isConfirmStatus === '是')
            obj.winningBid = aList.length
            supplierDimensionList.push(obj)
        }
        this.setState({ supplierDimensionList })
    }
    // 查询询价详情表格数据
    async getDetailTableData(record, caigouList, supplierList) {
        console.log(record)
        const { planSupply_product, haiju_commodity } = this.state.formMap
        let queryParams = { ...this.state.detailQueryParam }
        queryParams.formId = planSupply_product
        // 修改后的查询参数
        queryParams.inquiryNumber = record.inquiryNumber
        queryParams.code = record.detail.inquiryPackageId

        queryParams.conditionFilter.conditions = [
            { conditionOperator: 'eq', field: 'inquiryNumber', conditionValues: [record.inquiryNumber] }
        ]
        let detailTableData = []
        // const tableRes = await this.dataSourceMap['queryFormData'].load(queryParams)
        const tableRes = await this.dataSourceMap['queryInquiryDetailByGoods'].load(queryParams)
        if (tableRes.code === 200) {
            if (tableRes.result) {
                this.setState({ detailTotalElements: tableRes.result.total })
                if (tableRes.result.records) {
                    // 开始处理相关联的数据
                    const tableList = tableRes.result.records
                    // 获取商品基础信息
                    const goodsConditions = tableList.map(item => {
                        return { goodsId: item.product_code }
                    })
                    const goodsSpecsConditions = tableList.map(item => {
                        return { goodsId: item.product_code, unitType: '基础单位' }
                    })
                    const { goodsList, goodsSpecsList, picObj } = await this.getGoodsBaseData(goodsConditions, goodsSpecsConditions)
                    // 开始查询商品是否中标
                    let winningList = []
                    if (record.bidStatus === '待确认' || record.bidStatus === '二次报价' ||
                        record.bidStatus === '待定价' || record.bidStatus === '已定价' ||
                        record.bidStatus === '已关闭') {
                        const searchParams = {
                            searchList: [
                                { formId: haiju_commodity, conditions: [{ inquiryNumber: record.inquiryNumber }] }
                            ]
                        }
                        const winning = await this.getMoreTableData(searchParams)
                        if (winning.hasOwnProperty(haiju_commodity)) {
                            winningList = [...winning[haiju_commodity]]
                        }
                    }
                    // 开始处理每个供应商品已经报价的供应商
                    const mapA = _.groupBy(caigouList, 'inquiryGoodsId')
                    const que = this.state.detailQueryParam.page
                    for (let i = 0; i < tableList.length; i++) {
                        const item = tableList[i]
                        const goodsL = goodsList.filter(e => e.goodsId === item.product_code)
                        if (goodsL && goodsL.length) {
                            const goodsItem = goodsL[0]
                            let baseObj = {
                                goodsIndex: ((que.current - 1) * que.size) + i + 1, // 序号
                                goodsPic: '', // 商品图片
                                goodsId: goodsItem.goodsId,
                                goodsName: goodsItem.goodsName, // 商品名称
                                goodsBrand: goodsItem.goodsBrand, // 品牌
                                procurementStandards: goodsItem.procurementStandards, // 采购规格标准
                                deliveryMethod: goodsItem.deliveryMethod, // 详细配送要求
                                lastmonth_sales: item.lastmonth_sales, // 上月销量汇总
                                measurementUnit: '', // 单位
                                limitHighPrice: item.limitHighPrice || '', // 限高价
                                note: item.note, // 注意事项
                                detail: { ...item },
                                caigouList,
                                supplierList,
                                goodsItem,
                                goodsSpecsList: {}
                            }
                            let otherObj = {}
                            if (record.bidStatus === '报价中' || record.bidStatus === '待确认') {
                                otherObj = {
                                    quotationSupplier: '', // 报价供应商
                                }
                            }
                            if (record.bidStatus === '待确认' || record.bidStatus === '二次报价' ||
                                record.bidStatus === '待定价' || record.bidStatus === '已定价' ||
                                record.bidStatus === '已关闭'
                            ) {
                                otherObj = {
                                    lowestPrice: '', // 最低价
                                    lowestPriceRate: '', // 最低价税率
                                    lowestPriceSupplier: '', // 最低价供应商
                                    secondLowestPrice: '', // 次低价
                                    secondLowestPriceRate: '', // 次低价税率
                                    secondLowestPriceSupplier: '', // 次低价供应商
                                    finalPrice: '', // 最终采购价
                                    finalSupplier: '', // 最终供应商
                                    isReQuote: false, // 是否再报价 => 用于确定供应商能不能再报价
                                    isConfirmSupplier: false, // 是否确定供应商中标商品
                                }
                            }
                            let obj = { ...baseObj, ...otherObj }
                            if (goodsItem.previewImage && goodsItem.previewImage.length) {
                                obj.goodsPic = picObj[goodsItem.previewImage[0]]
                            }
                            const goodsSpecsL = goodsSpecsList.filter(e => e.goodsId === item.product_code)
                            if (goodsSpecsL && goodsSpecsL.length) {
                                obj.goodsSpecsList = { ...goodsSpecsL[0] }
                                obj.measurementUnit = goodsSpecsL[0].measurementUnit
                            }
                            if (record.bidStatus === '报价中' || record.bidStatus === '待确认') {
                                // 每个供应商品的报价供应商
                                const info = mapA[item.product_code] || []
                                const listA = info.filter(e => e.supplierQuotationStatus === '已报价').map(e => e.supplierId)
                                const arrA = Array.from(new Set(listA))
                                // 去重
                                const listB = info.map(e => e.supplierId)
                                const arrB = Array.from(new Set(listB))
                                obj.quotationSupplier = `${arrA.length}/${arrB.length}`
                            }
                            if (record.bidStatus === '待确认' || record.bidStatus === '二次报价' ||
                                record.bidStatus === '待定价' || record.bidStatus === '已定价' ||
                                record.bidStatus === '已关闭'
                            ) {
                                // 待确认状态下的数据处理
                                const info = mapA[item.product_code] || []
                                let arrA = info.filter(e => e.supplierQuotationStatus === '已报价')
                                let arrC = []
                                // 这里边要按供应商维度再做一层筛选
                                const temp = _.groupBy(arrA, 'supplierId')
                                for (const eKey in temp) {
                                    temp[eKey] = temp[eKey].sort((a, b) => a.supplierGoodsPrice - b.supplierGoodsPrice)
                                    if (temp[eKey] && temp[eKey].length) {
                                        arrC.push(temp[eKey][0])
                                    }
                                }
                                if (arrC.length) {
                                    const arrB = arrC.sort((a, b) => a.supplierGoodsPrice - b.supplierGoodsPrice)
                                    let itemA = arrB[0]
                                    let itemB = null
                                    obj.lowestPrice = itemA.supplierGoodsPrice
                                    obj.lowestPriceRate = itemA.deliveriesRate
                                    const lowestPriceSupplierList = supplierList.filter(e => e.supplierId === itemA.supplierId)
                                    obj.lowestPriceSupplier = lowestPriceSupplierList && lowestPriceSupplierList.length ? lowestPriceSupplierList[0].supplierName : ''
                                    if (arrB.length > 1) {
                                        itemB = arrB[1]
                                        obj.secondLowestPrice = itemB.supplierGoodsPrice
                                        obj.secondLowestPriceRate = itemB.deliveriesRate
                                        const secondLowestPriceSupplierList = supplierList.filter(e => e.supplierId === itemB.supplierId)
                                        obj.secondLowestPriceSupplier = secondLowestPriceSupplierList && secondLowestPriceSupplierList.length ?
                                            secondLowestPriceSupplierList[0].supplierName : ''
                                    }
                                }
                                // 开始判断是否再报价
                                if (record.bidStatus === '待确认') {
                                    // 说明此时这个商品没有进行再报价，可以进行确认供应商
                                    obj.isReQuote = false
                                } else {
                                    // 这个时候在二次报价的状态下判断每个商品有没有再报价
                                    const quotationProgress = record.detail.quotationProgress
                                    const list = caigouList.filter(e => e.quotationRound === quotationProgress
                                        && e.inquiryGoodsId === goodsItem.goodsId)
                                    obj.isReQuote = list.length > 0
                                }
                                // 开始判断最终供应商报价，有没有中标
                                const cList = winningList.filter(e => e.winningBidGoodsId === obj.goodsId)
                                if (cList.length) {
                                    // 此时已经确认了供应商，或者次轮询价不确定供应商
                                    obj.isConfirmSupplier = true
                                    const cListItem = cList[0]
                                    if (cListItem.isConfirmStatus === '是') {
                                        obj.finalPrice = cListItem.winningBidPrice
                                        const finalSupplierList = supplierList.filter(e => e.supplierId === cListItem.supplierId)
                                        obj.finalSupplier = finalSupplierList && finalSupplierList.length ? finalSupplierList[0].supplierName : ''
                                    }
                                }
                            }
                            detailTableData.push(obj)
                        }
                    }
                    this.setState({ detailTableData })
                } else {
                    this.setState({ detailTableData: [] })
                }
            }
        } else {
            this.setState({ detailTableData: [], detailTotalElements: 0 })
        }

    }
    // 发起再报价前先确认有没有商品确认完毕
    async confirmRepeatOffer() {
        const { curEditData } = this.state
        // 采购报价表和中标商品表中获取有没有商品确认完毕
        const { haiju_caigoubaojiaxiangqing, haiju_commodity } = this.state.formMap
        const { quantityOfRequestedGoodsList, detail } = curEditData
        const { quotationProgress } = detail // 报价轮次
        const aConditions = [
            { inquiryNumber: curEditData.inquiryNumber, quotationRound: quotationProgress }
        ]
        const bConditions = [
            { inquiryNumber: curEditData.inquiryNumber }
        ]
        let searchParams = {
            searchList: [
                { formId: haiju_commodity, conditions: [...bConditions] },
            ]
        }
        if (curEditData.bidStatus === '二次报价') {
            searchParams.searchList.push({ formId: haiju_caigoubaojiaxiangqing, conditions: [...aConditions] })
        }
        const res = await this.getMoreTableData(searchParams)
        let listA = []
        let listB = []
        if (res.hasOwnProperty(haiju_caigoubaojiaxiangqing)) {
            listA = [...res[haiju_caigoubaojiaxiangqing]]
        }
        if (res.hasOwnProperty(haiju_commodity)) {
            listB = [...res[haiju_commodity]]
        }
        // 询价商品开始匹配有没有确认
        let arr = []
        for (const item of quantityOfRequestedGoodsList) {
            const aItem = listA.filter(e => e.inquiryGoodsId === item.product_code)
            const bItem = listB.filter(e => e.winningBidGoodsId === item.product_code)
            if (aItem.length || bItem.length) {
                arr.push(item.product_code)
            }
        }
        let flag = arr.length === quantityOfRequestedGoodsList.length
        return flag

    }
    // 渲染再报价期限
    renderRepeatOfferTimeJSX() {
        return this.RenderRepeatOfferTimeJSXData()
    }
    // 确认再报价状态
    async confirmRepeatOfferDialog() {
        const { haiju_caigoubaojia, haiju_xunjiapeizhi } = this.state.formMap
        const { curEditData, repeatOfferTime } = this.state
        if (!this.state.repeatOfferTime.length) {
            this.showMessage('error', '错误', '请选择报价期限')
            return
        }
        // 开始组装数据，进行再报价
        const aConditions = [
            { inquiryNumber: curEditData.inquiryNumber }
        ]
        const searchParams = {
            searchList: [
                { formId: haiju_caigoubaojia, conditions: [...aConditions] }
            ]
        }
        let list = []
        const res = await this.getMoreTableData(searchParams)
        if (res.hasOwnProperty(haiju_caigoubaojia)) {
            list = res[haiju_caigoubaojia]
        }
        // 更新询价表
        let updateFormA = {
            formId: haiju_xunjiapeizhi,
            id: curEditData.detail._id,
            data: {
                quotationStartTime: repeatOfferTime[0],
                quotationEndTime: repeatOfferTime[1],
                bidStatus: '报价中'
            }
        }
        // 更新采购报价表
        let updateFormB = {
            formId: haiju_caigoubaojia,
            datas: []
        }
        for (const item of list) {
            let obj = {
                _id: item._id,
                quotationStartTime: repeatOfferTime[0],
                quotationEndTime: repeatOfferTime[1],
                quotationRound: curEditData.detail.quotationProgress,
                bidStatus: '待报价'
            }
            updateFormB.datas.push(obj)
        }
        const updateRes = await Promise.all([
            this.dataSourceMap['updateFormData'].load(updateFormA),
            this.dataSourceMap['batchUpdate'].load(updateFormB)
        ])
        if (updateRes[0].code === 200 && updateRes[1].code === 200) {
            this.setState({
                repeatOfferTime: [],
                showRepeatOfferFlag: false
            }, () => {
                this.closeDetailDrawer()
            })
        }
    }
    // 取消再报价状态
    closeRepeatOffer() {
        this.setState({
            repeatOfferTime: [],
            showRepeatOfferFlag: false
        })
    }
    // 二次报价状态下发起再报价
    async repeatOffer() {
        // 发起再报价前先确认有没有商品确认完毕
        const flag = await this.confirmRepeatOffer()
        if (!flag) {
            this.showMessage('error', '错误', '商品未确认完毕')
            return
        }
        // 更新询价表和采购报价表
        this.setState({
            showRepeatOfferFlag: true,
            repeatOfferTime: []
        })

    }
    // 待确认状态下提交审核
    async submitForReview() {
        const { haiju_caigoubaojia, haiju_xunjiapeizhi, haiju_xiangguandingjiajichuye } = this.state.formMap
        const { curEditData } = this.state
        const flag = await this.confirmRepeatOffer()
        if (!flag) {
            this.showMessage('error', '错误', '商品未确认完毕')
            return
        }
        const aConditions = [
            { inquiryNumber: curEditData.inquiryNumber }
        ]
        const bConditions = [
            { associatedInquiryNumber: curEditData.inquiryNumber }
        ]
        const searchParams = {
            searchList: [
                { formId: haiju_caigoubaojia, conditions: [...aConditions] },
                { formId: haiju_xiangguandingjiajichuye, conditions: [...bConditions] }
            ]
        }
        let list = []
        let listA = []
        const res = await this.getMoreTableData(searchParams)
        if (res.hasOwnProperty(haiju_caigoubaojia)) {
            list = res[haiju_caigoubaojia]
        }
        if (res.hasOwnProperty(haiju_xiangguandingjiajichuye)) {
            listA = res[haiju_xiangguandingjiajichuye]
        }
        // 更新询价表
        let updateFormA = {
            formId: haiju_xunjiapeizhi,
            id: curEditData.detail._id,
            data: {
                bidStatus: '待定价'
            }
        }
        // 更新采购报价表
        let updateFormB = {
            formId: haiju_caigoubaojia,
            datas: []
        }
        for (const item of list) {
            let obj = {
                _id: item._id,
                bidStatus: '待定价'
            }
            updateFormB.datas.push(obj)
        }
        // 更新商品定价详情页数据
        let updateFormC = {}
        if (listA && listA.length) {
            updateFormC = {
                formId: haiju_xiangguandingjiajichuye,
                id: listA[0]._id,
                data: {
                    isPriceStatus: '是'
                }
            }
        }
        const updateRes = await Promise.all([
            this.dataSourceMap['updateFormData'].load(updateFormA),
            this.dataSourceMap['batchUpdate'].load(updateFormB),
            (listA && listA.length) && this.dataSourceMap['updateFormData'].load(updateFormC)
        ])
        if (updateRes[0].code === 200 && updateRes[1].code === 200) {
            this.showMessage('success', '成功', '提交审核成功')
            this.setState({
                showRepeatOfferFlag: false
            }, () => {
                this.closeDetailDrawer()
            })
        }

    }

    // 不同状态下的查看数据详情
    async viewDetailData(record) {
        const {
            supplierList, // 供应商
            caigouList, // 采购报价详情
        } = await this.getDetailData_A(record)
        // 开始进行数据处理
        // 处理已报价商品数 报价进度 已报价供应商
        const dataA = this.dealBaseInfoData_A(caigouList, supplierList)
        // 开始获取询价详情数据
        await this.getDetailTableData(record, caigouList, supplierList)
        const curEditData = { ...record, ...dataA }
        this.setState({
            curEditData,
            caigouList,
            supplierList,
            curReQuoteEditData: _.cloneDeep(record),
            showDetailFlag: true
        })
    }
    // 下载报价汇总表
    exportInquiryData(record) {
        console.log(record)
        if (record.bidStatus !== '已定价' && record.bidStatus !== '已关闭') {
            this.showMessage('error', '错误', '尚未完成定价，请先定价')
            return
        }
        let quotationSummaryData = {
            inquiryNumber: record.inquiryNumber,
            statsTime: moment().format('YYYY-MM-DD'),
            statsType: "商品", // 按商品/按供应商
            code: record.detail.inquiryPackageId,
            packageName: record.nameOfQuotationPackage
        }
        this.setState({
            quotationSummaryData,
            showExportDataDialogFlag: true
        })
    }
    closeExportInquiryDialog() {
        this.setState({
            showExportDataDialogFlag: false, // 下载报价汇总表弹窗
            quotationSummaryData: {
                inquiryNumber: "",
                statsTime: "",
                statsType: "商品", // 按商品/按供应商
                code: '',
                packageName: ''
            }
        })
    }
    // 确定下载报价汇总表
    async confirmExportInquiryData() {
        const params = { ...this.state.quotationSummaryData }
        const res = await this.dataSourceMap['goodsQuoteToExcel'].load(params)
        let blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
        let fileNames = `报价汇总表-${this.state.quotationSummaryData.packageName}-${this.state.quotationSummaryData.statsTime}`
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
        this.closeExportInquiryDialog()
    }
    // 渲染报价汇总表JSX
    renderExportInquiryJSX() {
        return this.RenderExportInquiryJSXData()
    }
    // 获取供应商基础信息
    async getSupplierBaseData(conditions) {
        let supplierList = []
        const { supplier } = this.state.formMap
        const searchParams = {
            searchList: [
                { formId: supplier, conditions: [...conditions] }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        if (res.hasOwnProperty(supplier)) {
            supplierList = [...res[supplier]]
        }
        return { supplierList }
    }
    // 获取商品基础信息
    async getGoodsBaseData(goodsConditions, goodsSpecsConditions, inquiryPackageId = '') {
        const { goods, goodsSpecs, packages_product } = this.state.formMap
        const code = inquiryPackageId || ''
        const searchParams = {
            searchList: [
                {
                    formId: goods, // 商品表
                    conditions: [...goodsConditions]
                },
                {
                    formId: goodsSpecs, // 商品规格表
                    conditions: [...goodsSpecsConditions]
                },

            ]
        }
        if (code) {
            searchParams.searchList.push({
                formId: packages_product, // 标包商品表
                conditions: [{ packages_code: code }]
            })
        }
        const goodsData = await this.getMoreTableData(searchParams)
        let goodsList = []
        let goodsSpecsList = []
        let packageProduct = []
        if (goodsData.hasOwnProperty(goodsSpecs)) {
            goodsSpecsList = [...goodsData[goodsSpecs]]
        }
        if (goodsData.hasOwnProperty(packages_product)) {
            packageProduct = [...goodsData[packages_product]]
        }
        let picObj = {}
        // 商品预览图
        if (goodsData.hasOwnProperty(goods)) {
            goodsList = [...goodsData[goods]]
            const picArr = goodsList.map(item => {
                if (item.previewImage && item.previewImage.length) {
                    return item.previewImage[0]
                }
            })
            if (picArr.length) {
                const names = picArr.filter(e => e)
                const picRes = await this.dataSourceMap['getFileUrlList'].load({ names })
                if (picRes.code === 200) {
                    picObj = picRes.result
                }
            }
        }
        return { goodsList, goodsSpecsList, picObj, packageProduct }
    }
    // 获取详情的统计信息
    async getDetailData_A(curEditData) {
        const { supplier, haiju_caigoubaojiaxiangqing } = this.state.formMap
        // 获取供应商信息
        const supplierConditions = curEditData.quantityOfInquirySuppliersList.map(item => {
            return { supplierId: item.supplier_code }
        })
        // 获取采购详情信息
        const caigouConditions = [{
            inquiryNumber: curEditData.inquiryNumber,
            // quotationRound: curEditData.quotationProgress
        }]
        let supplierList = []
        let caigouList = []
        const searchParams = {
            searchList: [
                {
                    formId: supplier, // 供应商表
                    conditions: [...supplierConditions]
                },
                {
                    formId: haiju_caigoubaojiaxiangqing, // 采购报价详情
                    conditions: [...caigouConditions]
                }
            ]
        }
        const planData = await this.getMoreTableData(searchParams)
        if (planData.hasOwnProperty(haiju_caigoubaojiaxiangqing)) {
            caigouList = [...planData[haiju_caigoubaojiaxiangqing]]
        }
        if (planData.hasOwnProperty(supplier)) {
            supplierList = [...planData[supplier]]
        }
        return { caigouList, supplierList }
    }
    // 获取询价单详情基础数据
    async getInquiryBaseData(curEditData) {
        const { supplier, haiju_caigoubaojiaxiangqing } = this.state.formMap
        // 获取商品基础信息
        const goodsConditions = curEditData.quantityOfRequestedGoodsList.map(item => {
            return { goodsId: item.product_code }
        })
        const goodsSpecsConditions = curEditData.quantityOfRequestedGoodsList.map(item => {
            return { goodsId: item.product_code, unitType: '基础单位' }
        })
        const { goodsList, goodsSpecsList, picObj } = await this.getGoodsBaseData(goodsConditions, goodsSpecsConditions)
        const { inquiryPackageTypeName } = curEditData.detail
        let supplierList = []
        // 获取供应商信息
        const supplierConditions = curEditData.packageSupplierList.map(item => {
            return { supplierId: item.supplierId }
        })
        const searchParams = {
            searchList: [
                {
                    formId: supplier, // 供应商表
                    conditions: [...supplierConditions]
                },
            ]
        }
        const planData = await this.getMoreTableData(searchParams)
        if (planData.hasOwnProperty(supplier)) {
            supplierList = [...planData[supplier]]
        }
        // if (inquiryPackageTypeName) {
        //     const queryParam = {
        //         conditionFilter: { conditionType: "and", conditions: [
        //             {
        //                 "conditionValues": [inquiryPackageTypeName],
        //                 "conditionOperator": "any",
        //                 "field": "supplierType"
        //             }
        //         ] },
        //         page: { current: 1, pages: 0, size: 9999, total: 1 },
        //         sorts: [],
        //         formId: supplier
        //     }
        //     const planRes = await this.dataSourceMap['queryFormData'].load(queryParam)
        //     if (planRes.code === 200 && planRes?.result?.records.length > 0) {
        //         supplierList = [...planRes.result.records]
        //     }
        // } else {
        //     const supplierConditions = curEditData.quantityOfInquirySuppliersList.map(item => {
        //         return { supplierId: item.supplier_code }
        //     })
        //     const searchParams = {
        //         searchList: [
        //             {
        //                 formId: supplier, // 供应商表
        //                 conditions: [...supplierConditions]
        //             },
        //         ]
        //     }
        //     const planData = await this.getMoreTableData(searchParams)
        //     if (planData.hasOwnProperty(supplier)) {
        //         supplierList = [...planData[supplier]]
        //     }
        // }
        return {
            supplierList, // 供应商
            goodsList, // 商品列表详情
            goodsSpecsList, // 商品规格
            picObj, // 图片列表
        }
    }
    // 开始配置报价
    async allocationData(record) {
        const curEditData = _.cloneDeep(record)
        console.log('curEditData', curEditData)
        const inquiryLeftTableData = []
        const inquiryRightTableData = []
        const { quantityOfInquirySuppliersList, quantityOfRequestedGoodsList, packageSupplierList } = curEditData
        // 进行基础数据的抽离
        const {
            supplierList,
            goodsList,
            goodsSpecsList,
            picObj
        } = await this.getInquiryBaseData(record, quantityOfRequestedGoodsList)
        // 待审核状态下处理报价周期和供货周期
        let quotationCycle = null
        let supplyCycle = null
        if (curEditData.bidStatus === '待审核' || curEditData.bidStatus === '待配置') {
            quotationCycle = [curEditData.detail.quotationStartTime, curEditData.detail.quotationEndTime]
            supplyCycle = [curEditData.detail.deliveryCycleStartTime, curEditData.detail.endOfSupplyCycleTime]
        }
        const { inquiryPackageTypeName } = curEditData.detail
        for (const item of packageSupplierList) {
            let obj = {
                supplierName: '',
                isInquiry: '否',
                supplierStatus: '',
                detail: item
            }
            const temp = quantityOfInquirySuppliersList.filter(e => e.supplier_code === item.supplierId)
            if (temp && temp.length) {
                obj.isInquiry = temp[0].isInquiry
            }
            const a = supplierList.filter(e => e.supplierId === item.supplierId)
            obj.supplierName = a.length ? a[0].supplierName : ''
            let supplierStatus = '结束合作'
            if (a.length) {
                if (inquiryPackageTypeName) {
                    if (a[0].supplierType && a[0].supplierType.indexOf(inquiryPackageTypeName) > -1) {
                        supplierStatus = a[0].supplierStatus
                    } else {
                        supplierStatus = '/'
                    }
                } else {
                    supplierStatus = a[0].supplierStatus
                }
            }
            obj.supplierStatus = supplierStatus
            if (curEditData.bidStatus === '待配置') {
                if (supplierStatus === '正常') {
                    obj.isInquiry = '是'
                } else {
                    obj.isInquiry = '否'
                }
            }
            obj.contactPhoneNumber = a.length && a[0].contactPhoneNumber || '' // 供应商联系电话
            inquiryLeftTableData.push(obj)
        }
        for (let i = 0; i < quantityOfRequestedGoodsList.length; i++) {
            const item = quantityOfRequestedGoodsList[i]
            const goodsL = goodsList.filter(e => e.goodsId === item.product_code)
            if (goodsL && goodsL.length) {
                const goodsItem = goodsL[0]
                let obj = {
                    goodsIndex: i + 1, // 序号
                    goodsPic: '', // 商品图片
                    goodsName: goodsItem.goodsName, // 商品名称
                    goodsBrand: goodsItem.goodsBrand, // 品牌
                    procurementStandards: goodsItem.procurementStandards, // 采购规格标准
                    deliveryMethod: goodsItem.deliveryMethod, // 详细配送要求
                    lastmonth_sales: item.lastmonth_sales, // 预估采购量
                    measurementUnit: '', // 单位
                    limitHighPrice: item.limitHighPrice || '', // 限高价
                    note: item.note, // 注意事项
                    isInquiry: item.isInquiry, // 是否询价
                    detail: item
                }
                if (goodsItem.previewImage && goodsItem.previewImage.length) {
                    obj.goodsPic = picObj[goodsItem.previewImage[0]]
                }
                const goodsSpecsL = goodsSpecsList.filter(e => e.goodsId === item.product_code)
                if (goodsSpecsL && goodsSpecsL.length) {
                    obj.measurementUnit = goodsSpecsL[0].measurementUnit
                }
                inquiryRightTableData.push(obj)
            }
        }
        // 查询询价供应商和询价商品
        this.setState({
            curEditData,
            inquiryLeftTableData,
            inquiryRightTableData,
            quotationCycle,
            supplyCycle,
            curReQuoteEditData: _.cloneDeep(curEditData),
            showAllocationFlag: true,
        }, () => {
            const element = document.querySelector('.next-drawer-body')
            const isMobile = this.state.isMobile
            if (isMobile) {
                element.classList.add('mobile-height')
            } else {
                element.classList.add('pc-height')
            }
        })
    }
    // 表格数据选中
    onChangeRow(ids, records) {
        let { rowSelection, selectedRowRecords } = this.state
        rowSelection.selectedRowKeys = ids
        selectedRowRecords = records
        this.setState({
            rowSelection,
            selectedRowRecords
        })
    }
    // 生成报价通知单
    generateQuotationNotification() {
        const { selectedRowRecords } = this.state
        if (!selectedRowRecords.length) {
            this.showMessage('error', '错误', '请选择报价中的询价单')
            return
        }
        const batchList = selectedRowRecords.filter(e => e.bidStatus === '报价中')
        if (!batchList.length) {
            this.showMessage('error', '错误', '选择的数据中，必须包含报价中的询价单，才能进行生成报价通知单', 2000)
            return
        }
        this.setState({
            showBatchDialogFlag: true,
            quotationCycle: null,
            supplyCycle: null,
            batchList,
            batchDialogType: 'QUOTATION',
            batchDialogTitle: '报价通知单'
        })
    }
    // 生成供货通知单
    generateSupplyNotification() {
        const { selectedRowRecords } = this.state
        if (!selectedRowRecords.length) {
            this.showMessage('error', '错误', '请选择已定价的询价单')
            return
        }
        const batchList = selectedRowRecords.filter(e => e.bidStatus === '已定价')
        if (!batchList.length) {
            this.showMessage('error', '错误', '选择的数据中，必须包含已定价的询价单，才能进行生成报价通知单', 2000)
            return
        }
        this.setState({
            showBatchDialogFlag: true,
            quotationCycle: null,
            supplyCycle: null,
            batchList,
            batchDialogType: 'SUPPLY',
            batchDialogTitle: '供货通知单'
        })
    }
    // 批量配置
    batchConfiguration() {
        const { selectedRowRecords } = this.state
        if (!selectedRowRecords.length) {
            this.showMessage('error', '错误', '请选择要配置的询价单')
            return
        }
        const batchList = selectedRowRecords.filter(e => e.bidStatus === '待配置')
        if (!batchList.length) {
            this.showMessage('error', '错误', '选择的数据中，必须包含待配置的询价单，才能进行批量配置', 2000)
            return
        }
        this.setState({
            showBatchDialogFlag: true,
            quotationCycle: null,
            supplyCycle: null,
            batchList,
            batchDialogType: 'BATCH',
            batchDialogTitle: '批量配置'
        })
    }
    // 批量配置确认
    async onConfirmBatchData() {
        // 开始进行数据提交和校验
        const { batchDialogType, quotationCycle, supplyCycle, batchList } = this.state
        const { haiju_xunjiapeizhi } = this.state.formMap
        if (batchDialogType === 'BATCH') {
            const flag = this.checkInquiryData()
            if (flag) {
                // 进行数据处理和提交
                const quotationStartTime = moment(quotationCycle[0]).format('YYYY-MM-DD HH:mm:ss')
                const quotationEndTime = moment(quotationCycle[1]).format('YYYY-MM-DD HH:mm:ss')
                const deliveryCycleStartTime = moment(supplyCycle[0]).format('YYYY-MM-DD')
                const endOfSupplyCycleTime = moment(supplyCycle[1]).format('YYYY-MM-DD')
                let updateData = []
                for (const item of batchList) {
                    let obj = {
                        _id: item.id,
                        bidStatus: '待审核',
                        quotationStartTime, // 报价周期开始时间
                        quotationEndTime, // 报价周期结束时间
                        deliveryCycleStartTime, // 供货周期开始时间
                        endOfSupplyCycleTime, // 供货周期结束时间
                    }
                    updateData.push(obj)
                }
                const updateParams = {
                    formId: haiju_xunjiapeizhi,
                    datas: [...updateData]
                }
                const updateRes = await this.dataSourceMap['batchUpdate'].load(updateParams)
                if (updateRes.code === 200) {
                    this.showMessage('success', '成功', '批量配置成功', 1500)
                    this.onCancelBatchData()
                    this.getTableData()
                }
            }
        } else if (batchDialogType === 'QUOTATION') {
            // 报价通知单
            let ids = batchList.map(e => e.inquiryNumber)
            const params = { ids }
            const res = await this.dataSourceMap['generateXunjiaPdf'].load(params)
            if (res.code === 200) {
                this.showMessage('success', '成功', '生成报价通知单成功', 1500)
                this.onCancelBatchData()
                this.getTableData()
            } else {
                this.showMessage('error', '错误', res.message)
            }
        } else if (batchDialogType === 'SUPPLY') {
            // 供货通知单
        }
    }
    // 清除全选的数据
    onClearAll() {
        let { rowSelection, selectedRowRecords } = this.state
        rowSelection.selectedRowKeys = []
        selectedRowRecords = []
        this.setState({
            rowSelection,
            selectedRowRecords
        })
    }
    // 批量配置取消
    onCancelBatchData() {
        this.setState({
            showBatchDialogFlag: false,
            batchList: [],
            quotationCycle: null,
            supplyCycle: null,
            batchDialogType: '',
            batchDialogTitle: '',
        })
    }
    // 渲染批量弹窗中的内容
    renderBatchDialogJSX() {
        return this.RenderBatchDialogData()
    }
    // 渲染表格
    renderTableJSX() {
        return this.RenderTableJSXData()
    }
    onResetData(e) {
        this.setState({
            conditions: []
        }, () => {
            this.onPageChange(1)
        })
    }
}
