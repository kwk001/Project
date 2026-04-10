class LowcodeComponent extends Component {
  constructor() {
    const { setMomentLocale } = window.MomentLocale
    setMomentLocale()
    const { inject } = window.HaijuBasePack;
    inject(this, {
      withMethods: []
    });
  }
  state = {
    "text": "outer",
    showApprovalFlag:false,
    curApprovalList:[],
    isShowLoading: false,
    "isShowDialog": false,//定价
    isShowDetailDialog: false,//详情
    isShowApprovalDialog: false,
    isShowCustomerPriceDialog: false,
    isShowCompareHistoryDialog: false,
    isShowEditDialog: false,
    loading: false,
    currentUser: null,
    historyList: [],//历史记录
    formMap: {
      goods_supply: '',//商品供应
      goods: '', // 商品基础表
      goodsSpecs: '', // 商品规格信息表
      customerTypeManage: '', // 客户类型管理
      goodsTypeTable: '', // 商品分类基础表
      supplier: '',//供应商
      haiju_taxRate: '',
      goods_supply_history: '',//历史记录
      haiju_userPermissions: '',//审批设置
      goodsSupplyApprovalRecords: ""
    },
    editRow: {},
    approveCode: ['AP_GOODSSUPPLY'], // AP_INQUIRY 询价配置审批ENUM
    userApproveList: [], // 审批权限列表
    taxRateList: [],
    goodsSupplyForm: {
      goodsCode: '',
      supplierCode: '',
      startDate: '',
      endDate: '',
      purchasePrice: 0,
      specs: '',
      unit: '',
      businessPrice: 0,
      customerPrice: 0,
      status: '',
      rate: 0,
      invoiceType: '',
      remarks: '',
      businessTypePrice: []
    },
    businessTypePriceMap: {},
    options: {
      "invoiceType": [{ value: '专票', label: '专票' }, { value: '普票', label: '普票' }],
      "rate": [{ value: 0.03, label: '3' }, { value: 0.09, label: '9' }, { value: 0.13, label: '13' }]
    },
    goodsList: [],
    goodsOptions: [],
    supplierList: [],
    supplierOptions: [],
    allSupplierOptions: [],
    customerTypeList: [],
    searchParams: {
      dateRange: [], // 供货周期
      status: '', // 状态
      goodsTypeId: '',//商品分类
      supplierId: '',
      goodsCode: '', // 商品名称
      goodsName: ""
    },

    queryConditions: {
      goodsTypeId: '',//商品分类
      supplierId: '',
      "goodsCode": "",
      "status": "",
      "dateRange": [],
      "sort": { "createTime": -1 },
      page: { current: 1, pages: 0, size: 10, total: 1 },
    },
    tableData: [],
    total: 0,
    compareHisory: { rowRecord1: null, rowRecord2: null },
    rowSelection: {
      onChange: function (ids, records) {
        this.onChangeRow(ids, records)
      },
      onSelect: function (selected, record, records) {
      },
      onSelectAll: function (selected, records) {
      },
      // mode: 'single',
      selectedPRowKeys: [],
    },
  }
  componentDidMount() {
    this.init(() => {
      this.queryFormData()
      this.queryOtherForm()

    })
    console.log('did mount');
  }
  componentWillUnmount() {
    console.log('will unmount');
  }
  async resetGoodsSupply(record) {
    let historyList = await this.queryGoodsSupplyHistory(record._id)
    let oldValue = historyList?.[0] || {}

    window.Next.Dialog.confirm({
      title: '撤回',
      content: (<span style={{ 'font-size': '16px' }}>确定要撤回审批吗？</span>),
      onOk: async () => {
        const data = {
          formId: this.state.formMap.goods_supply,
          data: {
            status: '待定价',
            businessTypePrice: oldValue.businessTypePrice,
            invoiceType: oldValue.invoiceType,
            rate: oldValue.rate,
            supplierCode: oldValue.supplierId,
            customerPrice: oldValue.customerPrice,
            businessPrice: oldValue.businessPrice,
            purchasePrice: oldValue.purchasePrice,
            endDate: oldValue.endDate,
            startDate: oldValue.startDate
          },
          id: record._id
        }

        this.dataSourceMap['updateFormData'].load(data).then(res => {
          if (res.code === 200) {
            window.Next.Message.success('执行成功')
            this.onPageChange(1)
            //审批记录撤销
            this.resetApprovalRecord(record._id, '已撤销')
          }
        })
      },
      onCancel: () => {
      }
    })
  }


  closeGoodsSupply(record) {
    window.Next.Dialog.confirm({
      title: '关闭',
      content: (<span style={{ 'font-size': '16px' }}>关闭后不可撤回</span>),
      onOk: () => {
        const data = {
          formId: this.state.formMap.goods_supply,
          data: {
            status: '已关闭'
          },
          id: record._id
        }
        this.dataSourceMap['updateFormData'].load(data).then(res => {
          if (res.code === 200) {
            window.Next.Message.success('执行成功')
            this.onPageChange(1)
          }
        })
      },
      onCancel: () => {
      }
    })
  }

  getNameByCode(code, type) {
    const { goodsList, allSupplierOptions } = this.state
    if (type == 'goodsName') {
      let goods = goodsList?.find(e => e['goodsId'] == code)
      return goods?.['goodsName'] || ""
    }

    if (type == 'supplierName') {
      let supplier = allSupplierOptions.find(e => e['value'] == code)
      return supplier?.['label']
    }
  }
  // 渲染商品信息表格
  renderTableJSX() {
    const { Table, Button } = window.Next

    const { currentUser, userApproveList } = this.state
    const column = [
      { title: '商品名称', dataIndex: 'goodsName' },
      { title: '规格', dataIndex: 'specs' },
      { title: '单位', dataIndex: 'unit' },
      { title: '供货周期', dataIndex: 'dateRange', width: '200px' },
      { title: 'B端销售价', dataIndex: 'businessPrice' },
      { title: 'C端销售价', dataIndex: 'customerPrice' },
      { title: '采购价', dataIndex: 'purchasePrice' },
      { title: '状态', dataIndex: 'status' },
      { title: '当前审核人', dataIndex: 'appUsers' },
    ]

    const oprRender = (value, index, record) => {
      const showExport = (record) => {
        const temp2 = record.userApprovalList || []
        let hasRecords = false
        for (let e of temp2) {
          let has = e.userApprovalList.findIndex(item => item.createTime)
          if (has != -1) {
            hasRecords = true
          }
        }
        return  record.adjustBy && hasRecords
      }
      return (<div className={'opr-button'}>
        <Button type="primary"
          style={{ 'margin-right': '8px' }}
          onClick={() => this.openDetailDialog(record, 'view')}
          text={true}>
          详情
        </Button>
        {record.status == '待审批' && record.showApproval && <Button type="primary"
          style={{ 'margin-right': '8px' }}
          onClick={() => this.openDetailDialog(record, 'approval')}
          text={true}>
          审批
        </Button>
        }
        {record.status == '待审批' && record.chehuiflag && <Button type="primary"
          style={{ 'margin-right': '8px' }}
          onClick={() => this.resetGoodsSupply(record)}
          text={true}>
          撤回
        </Button>
        }
        {record.status !== '待审批' &&
          <Button type="primary"
            style={{ 'margin-right': '8px' }}
            onClick={() => this.openDetailDialog(record, 'edit')}
            text={true}>
            调整
          </Button>
        }
        {['生效中', '待生效'].includes(record.status) && <Button type="primary"
          style={{ 'margin-right': '8px' }}
          onClick={() => this.closeGoodsSupply(record)}
          text={true}>
          关闭
        </Button>
        }
        {record.status !== '待定价' && showExport(record) && <Button type="primary"
          style={{ 'margin-right': '8px' }}
          onClick={() => this.exportApprovalList(record)}
          text={true}>
          导出
        </Button>
        }
        {
          showExport(record) && <Button type="primary"
            style={{ 'margin-right': '8px' }}
            onClick={() => this.viewApprovalDetail(record)}
            text={true}>
            审批记录
          </Button>  
        }
      </div>)
    }
    return (<div className={'table-box'}>
      <Table.StickyLock
        dataSource={this.state.tableData}
        primaryKey={'_id'}
        hasBorder={true}
        loading={this.state.loading}
        rowSelection={this.state.rowSelection}
      >
        {column.map((item, index) => {

          if (item.title == '供货周期') {
            return (<Table.Column title={item.title} cell={(value, index, record) => { return `${record.startDate.substring(0, 10)}-${record.endDate.substring(0, 10)}` }} width={item.width ? item.width : 100} dataIndex={item.dataIndex} key={item.dataIndex} />)
          } else if (item.title == 'B端销售价') {
            return (<Table.Column title={item.title} cell={(value, index, record) => {
              return <Button type="primary" onClick={() => this.openCustomerType(record)}
                text={true}  >{record['businessPrice']}</Button>
            }} width={item.width ? item.width : 100} dataIndex={item.dataIndex} key={item.dataIndex} />)
          } else {
            return (<Table.Column title={item.title} width={item.width ? item.width : 100} dataIndex={item.dataIndex} key={item.dataIndex} />)
          }
        })}
        <Table.Column cell={oprRender} dataIndex="opr" width={200} lock="right" title="操作" />
      </Table.StickyLock>
    </div>)
  }
  // 计算价格
  computerNumber(num1, num2, type) {
    switch (type) {
      case "+":
        return Number(Decimal(num1).add(num2).toFixed(2))
      case "-":
        return Number(Decimal(num1).sub(num2).toFixed(2))
      case "*":
        return Number(Decimal(num1).mul(num2).toFixed(2))
      case "/":
        return Number(Decimal(num1).div(num2).toFixed(2))
    }
  }
  // 查看审批记录
  async viewApprovalDetail(rowRecord) {
    console.log(rowRecord)
    const { formMap } = this.state
    let param = {
      "searchList": [
        {
          formId: formMap.goodsSupplyApprovalRecords,
          conditions:  [ {
            supplyId: rowRecord._id,
            adjustTime: rowRecord.adjustTime
            }]
        }
      ]
    }
    let resp = await this.dataSourceMap.queryMoreTableData.load(param)
    if (resp.code == 1) {
      const data = resp.data[formMap.goodsSupplyApprovalRecords]

      let list = []
      for(let item of data){
        for(let userApp of item.userApprovalList){
          if(userApp.createTime){
            list.push({
              ...item,
              ...userApp
            })
          }
        }
         
      }
      let list2 =  _.sortBy(list, 'createTime')
      // 数据开始处理
      this.setState({
        showApprovalFlag: true,
        curApprovalList: list2
      })
    } else {
      this.showMessage('error', '错误', '暂无审批记录')
    }
  }
  async queryOtherForm() {
    let param = {
      "searchList": [
        {
          "formId": this.state.formMap['goods'],
          conditions: [],
          showField: ['goodsName','goodsId']
        },
        { formId: this.state.formMap['goodsTypeTable'], conditions: [] },
        {
          "formId": this.state.formMap['customerTypeManage'],
          conditions: [{ "isSpecial": "否" }]
        },
        {
          "formId": this.state.formMap['haiju_taxRate'],
          conditions: [ ],
          showField: ['taxRateName', 'taxRate']
        },
        {
          "formId": this.state.formMap['supplier'],
          conditions: [],
          showField: ['supplierName', 'supplierId']
        }


      ]
    }

    let result = await this.dataSourceMap['queryMoreTableData'].load(param);
    // 商品
    const goodsList = result.data[this.state.formMap['goods']]
    const goodsOptions = goodsList.map(item => {
      return { label: item.goodsName, value: item.goodsId }
    })

    // 税率
    const taxRatData = result.data[this.state.formMap['haiju_taxRate']]
    const taxRateList = taxRatData.map(item => {
      return { label: item.taxRateName, value: item.taxRate }
    })
    // 供应商
    const supplierList = result.data[this.state.formMap["supplier"]]
    const supplierOptions = supplierList.map(item => {
      return { label: item.supplierName, value: item.supplierId }
    })
    const goodsTypeData = result.data[this.state.formMap["goodsTypeTable"]]
    const goodsTypeList = this.dealGoodsTypeList(goodsTypeData, '--')
    // 客户类型
    const customerTypeList = result.data[this.state.formMap['customerTypeManage']]

    this.setState({
      goodsList,
      taxRateList,
      goodsOptions,
      allSupplierOptions: supplierOptions,
      goodsTypeList,
      customerTypeList
    })
  }
  // 处理商品分类
  dealGoodsTypeList(data, parentId) {
    return data
      .filter(item => item.parentGoodsTypeId === parentId)
      .map(item => ({ label: item.typeName, value: item.goodsTypeId, children: this.dealGoodsTypeList(data, item.goodsTypeId) }))
  }
  queryFormData() {
    const { queryConditions, formMap, searchParams } = this.state
    let queryConditions2 = {
      goodsTypeId: '',//商品分类
      supplierId: '',
      "goodsCode": "",
      "status": "",
      "dateRange": [],
      "sort": { "createTime": -1 },
      page: queryConditions.page
    }
    if (searchParams.status && searchParams.status != '全部') {
      queryConditions2.status = searchParams.status
    }
    if (searchParams.dateRange?.length) {
      queryConditions2.dateRange = searchParams.dateRange
    }
    if (searchParams.goodsTypeId) {
      queryConditions2.goodsTypeId = searchParams.goodsTypeId
    }
    if (searchParams.supplierId) {
      queryConditions2.supplierId = searchParams.supplierId
    }
    if (searchParams.goodsName) {
      queryConditions2.goodsName = searchParams.goodsName
    }
    if (searchParams.goodsCode) {
      queryConditions2.goodsCode = searchParams.goodsCode
    }
    this.setState({
      loading: true
    }, () => {
      this.dataSourceMap.queryProductSupply.load(queryConditions2).then(async res => {
        this.setState({
          loading: false
        })
        if (res.code == 1) {
          let list = res.data.records
          let temp = list?.map(e => e['_id'])
          
          if (temp.length) {
            let approvalList = await this.queryApprovalRecords(temp)
             
            for (const item of list) {
                this.setShowApprovalFlag(item, approvalList)
            }
          }
          this.setState({
            tableData: list || [],
            total: res.data.total
          })
        }
      })
    })
  }


  setShowApprovalFlag(item, list) {
    const { currentUser } = this.state
    item.showApproval = false
    if (item.status === '待审批') {
      
      const temp = list.find(e => e.supplyId == item['_id'] && e.approveIndex === item.approveIndex)
      if (temp) {
        item.approvalRecord = temp
        let approvePerson = temp.userApprovalList
        //当前登陆人是否为审批节点
        let hasRecords = temp.userApprovalList.find(e =>
          !e.approveResult &&
          e.approvePerson == currentUser.id)
        if (hasRecords) {
          item.showApproval = true
        }
        item.appUsers = temp.userApprovalList?.filter(e => !e.createTime).map(e => e.approvePerson_user)?.join(",")
        const temp2 = item.userApprovalList
        let chehuiflag = true
         
        for (let e of temp2) {
          let has = e.userApprovalList.findIndex(e1 => e1.createTime)
          if (has != -1) {
            chehuiflag = false
          }
        }
        item.chehuiflag = chehuiflag
      }
    }
   
  }

  //查询审批记录
  async queryApprovalRecords(ids) {
    const { formMap } = this.state
    let param = {
      "searchList": [
        {
          formId: formMap.goodsSupplyApprovalRecords,
          conditions: ids.map(e => {
            return {
              supplyId: e,
              status: "待审批"
            }
          })
        }
      ]
    }
    let resp = await this.dataSourceMap.queryMoreTableData.load(param)
    if (resp.code == 1) {
      return resp.data[formMap.goodsSupplyApprovalRecords]
    }
    return []
  }
  renderCustomerPrice() {
    const { Form, NumberPicker, Input, Select, DatePicker } = window.Next
    const { RangePicker, MonthPicker, YearPicker, WeekPicker } = DatePicker;
    const FormItem = Form.Item;
    const { goodsSupplyForm, customerTypeList, options, isShowApprovalDialog, isShowDialog, isShowDetailDialog, businessTypePriceMap } = this.state
    let formItemLayout = {
      labelCol: {
        fixedSpan: 8
      },
      wrapperCol: {
        span: 14
      }
    };

    const renderCustomerTypePriceList = () => {
      let list = customerTypeList.map(item => <FormItem
        name={item.customerTypeId}
        label={item.customerTypeName}
      >
        <span className='subPrice'>{businessTypePriceMap[item.customerTypeId]} </span>
      </FormItem>)
      return list
    }
    return (<Form style={{ width: '100%', fontSize: "14px" }}
      size='large' labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} colon>
      {renderCustomerTypePriceList()}
    </Form>)

  }
  renderAddFormView() {
    const { Form, NumberPicker, Input, Select, DatePicker } = window.Next
    const { RangePicker, MonthPicker, YearPicker, WeekPicker } = DatePicker;
    const FormItem = Form.Item;
    const { goodsSupplyForm, customerTypeList, options, isShowApprovalDialog, isShowDialog, isShowDetailDialog, businessTypePriceMap } = this.state
    let formItemLayout = {
      labelCol: {
        fixedSpan: 8
      },
      wrapperCol: {
        span: 14
      }
    };
    const onChange = (e) => {
      let startDate, endDate
      if (e[0]) {
        startDate = moment(e[0]).format("YYYY-MM-DD")
      }
      if (e[1]) {
        endDate = moment(e[1]).format("YYYY-MM-DD")
      }
      this.setState({
        goodsSupplyForm: { ...goodsSupplyForm, startDate, endDate }
      })
    }
    const renderCustomerTypePriceList = () => {
      let list = customerTypeList.map(item => <FormItem
        name={item.customerTypeId}
        label={item.customerTypeName}
      >
        <span className='subPrice'>{businessTypePriceMap[item.customerTypeId]} </span>
      </FormItem>)
      return list
    }
    return (<Form style={{ width: '100%', fontSize: "14px" }}

      size='large' labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} colon>
      <FormItem label="供应商" name="supplierCode">
      </FormItem>
      <FormItem required label="采购价" name="purchasePrice">
      </FormItem>
      <FormItem label="B端统一售价" name="businessPrice">
      </FormItem>
      <FormItem label="C端售价" name="customerPrice">
      </FormItem>
      <FormItem required label="进项税率" name="rate">

      </FormItem>
      <FormItem label="进项发票类型:" name="invoiceType">

      </FormItem>
      {renderCustomerTypePriceList()}
    </Form>)

  }
  onChangeGoodForm(value, index, type) {
    const { businessTypePriceMap, customerTypeList, goodsSupplyForm } = this.state

    let customerType = customerTypeList.find(e => e['customerTypeId'] == index)?.defaultReferenceType || '采购价'
    let defaultReferenceType = customerType?.defaultReferenceType || '采购价'
    let comparePrice = goodsSupplyForm.purchasePrice
    if (defaultReferenceType == '销售价') {
      comparePrice = goodsSupplyForm.businessPrice
    }
    if (!businessTypePriceMap[index]) {
      businessTypePriceMap[index] = {
        businessTypeId: customerType['customerTypeId'],
        businessTypeName: customerType['customerTypeName'],
        price: null,
        upRatio: null
      }
    }

    businessTypePriceMap[index][type] = value
    if (type == 'price' && comparePrice) {
      let upRate = this.computerNumber((value - comparePrice) / comparePrice, 100, "*")
      businessTypePriceMap[index].upRatio = upRate
    }

    if (type == 'upRatio' && comparePrice) {
      let price = this.computerNumber(comparePrice, 1 + value / 100, "*")
      businessTypePriceMap[index].price = price
    }
    this.setState({
      businessTypePriceMap
    })
  }
  renderAddForm() {
    const { Form, NumberPicker, DatePicker, Input, Select, Grid } = window.Next
    const { RangePicker } = DatePicker;
    const FormItem = Form.Item;
    const { Row, Col } = Grid;
    const { goodsSupplyForm, customerTypeList, editRow, options, taxRateList,
      isShowEditDialog, isShowApprovalDialog,
      isShowDialog, isShowDetailDialog, businessTypePriceMap } = this.state
    let formItemLayout = {
      labelCol: {
        fixedSpan: 8
      },
      wrapperCol: {
        span: 14
      }
    };


    const renderCustomerTypePriceList = () => {
      let list = customerTypeList.map(item =>
        <FormItem field={false}
          label={item.customerTypeName} >
          <Row  >
            <Col span="8">
              <FormItem
                field={false}
              >
                <NumberPicker precision={2} disabled={isShowApprovalDialog}
                  value={businessTypePriceMap[item.customerTypeId]?.price}
                  onChange={(e) => this.onChangeGoodForm(e, item.customerTypeId, 'price')}
                />
              </FormItem>
            </Col>
            <Col span="16">
              <FormItem
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label='上浮比例'
                field={false}
              >
                <NumberPicker precision={2} style={{ width: 100 }}
                  disabled={isShowApprovalDialog}
                  innerAfter="%"
                  value={businessTypePriceMap[item.customerTypeId]?.upRatio}
                  onChange={(e) => this.onChangeGoodForm(e, item.customerTypeId, 'upRatio')}
                />
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      )
      return list
    }
    return (<Form
      onChange={this.onChangeAddForm}
      style={{ width: '100%', fontSize: "14px" }}
      size='large'
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }} colon>
      {
        !isShowEditDialog &&
        <FormItem required label="商品" requiredMessage="请选择商品" name="goodsCode">
          <Select
            defaultValue={editRow.goodsCode}
            disabled={isShowApprovalDialog}
            style={{ width: 200 }} showSearch
            dataSource={this.state.goodsOptions}
          />
        </FormItem>}
      <FormItem label="供应商" name="supplierCode">
        <Select
          defaultValue={editRow.supplierCode}
          disabled={isShowApprovalDialog}
          style={{ width: 200 }} showSearch
          dataSource={this.state.supplierOptions}
        />
      </FormItem>
      <FormItem required label="供应周期" name="dateRange" requiredMessage="请填写供应周期">
        <RangePicker defaultValue={editRow.dateRange}
          disabled={isShowApprovalDialog}
        />
      </FormItem>
      <FormItem required label="采购价" name="purchasePrice" requiredMessage="请填写采购价">
        <NumberPicker precision={2} defaultValue={editRow.purchasePrice} disabled={isShowApprovalDialog} />
      </FormItem>
      <FormItem label="B端统一售价" name="businessPrice">
        <NumberPicker precision={2} defaultValue={editRow.businessPrice} disabled={isShowApprovalDialog} />
      </FormItem>
      <FormItem label="C端售价" name="customerPrice">
        <NumberPicker precision={2} defaultValue={editRow.customerPrice} disabled={isShowApprovalDialog} />
      </FormItem>
      <FormItem label="进项税率" name="rate" requiredMessage="请选择进项税率">
        <Select defaultValue={editRow.rate}
          // innerAfter={<span style={{ color: "#999", marginRight: 4 }}>%</span>}
          dataSource={taxRateList} disabled={isShowApprovalDialog} />
      </FormItem>
      <FormItem label="进项发票类型" name="invoiceType">
        <Select defaultValue={editRow.invoiceType} disabled={isShowApprovalDialog} dataSource={options.invoiceType} />
      </FormItem>
      {renderCustomerTypePriceList()}
    </Form>)

  }

  async onOk() {
    const { Message } = window.Next
    const { goodsSupplyForm, currentUser, userApproveList, customerTypeList, formMap, businessTypePriceMap, goodsOptions, supplierOptions } = this.state
    if (!goodsSupplyForm.goodsCode) {
      Message.error("请选择商品")
      return
    }

    if (!goodsSupplyForm.startDate || !goodsSupplyForm.endDate) {
      Message.error("请填写供货周期")
      return
    }
    if (goodsSupplyForm.purchasePrice == null) {
      Message.error("请填写供货价")
      return
    }
    if (goodsSupplyForm.businessPrice == null){
      Message.error("请填写B端销售价")
      return
    }
    if (goodsSupplyForm.customerPrice == null) {
      Message.error("请填写C端销售价")
      return
    }
    if (goodsSupplyForm.rate == null) {
      goodsSupplyForm.rate = 0
    }
    if (!goodsSupplyForm.invoiceType) {
      Message.error("请填写发票类型")
      return
    }
    goodsSupplyForm.endDate = goodsSupplyForm.endDate
    goodsSupplyForm.startDate = goodsSupplyForm.startDate
    //let specs = await this.queryGoodsSpecs(goodsSupplyForm.goodsCode)
   // goodsSupplyForm.unit = specs.filter(e => e['unitType'] == '基础单位')[0]?.measurementUnit
   // goodsSupplyForm.specs = specs.filter(e => e['unitType'] == '基础单位')[0]?.specificationDescription
    // goodsSupplyForm.goodsName = goodsOptions.find(item => item.value === goodsSupplyForm.goodsCode ).label
    //  goodsSupplyForm.supplierName = supplierOptions.find(item => item.value === goodsSupplyForm.supplierCode).label
    goodsSupplyForm.status = '待审批'
    if (Array.isArray(userApproveList) && userApproveList.length) {
      goodsSupplyForm.approveIndex = 1
    }
    goodsSupplyForm.adjustTime = moment().format("YYYY-MM-DD HH:mm:ss")
    goodsSupplyForm.adjustBy = currentUser.id
    goodsSupplyForm.adjustBy_user = currentUser.nickName
    goodsSupplyForm.businessTypePrice = []

    let priceIsNull = false
    customerTypeList.forEach(customerType => {
      let key = customerType.customerTypeId
      if (businessTypePriceMap[key].price == null) {
        priceIsNull = true
      }
      if (businessTypePriceMap[key].price != null) {
        goodsSupplyForm.businessTypePrice.push({
          businessTypeId: key,
          businessTypeName: businessTypePriceMap[key].businessTypeName,
          upRatio: this.computerNumber(businessTypePriceMap[key].upRatio, 100, "/"),
          price: businessTypePriceMap[key].price
        })
      }
    })
    if (priceIsNull) {
      Message.error("请填写客户类型价格")
      return
    }
    if (!goodsSupplyForm.supplierCode && goodsSupplyForm.businessPrice == 0 && goodsSupplyForm.purchasePrice == 0 && goodsSupplyForm.customerPrice == 0
      && goodsSupplyForm.businessTypePrice.every(e => e.price == 0)) {
      goodsSupplyForm.isVoided = '是'
    }
    delete goodsSupplyForm._id
    this.dataSourceMap['addFormData'].load({
      data: goodsSupplyForm,
      formId: formMap.goods_supply
    }).then(res => {
      if (res.code == 200) {
        window.Next.Message.success("提交成功")
        this.onPageChange(1)
        this.setState({
          isShowDialog: false
        })
        this.addApprovalInit(res.result)
      }
    })
  }
  onPageChange(e) {
    const { queryConditions } = this.state
    queryConditions.page.current = e
    this.setState({
      queryConditions
    }, this.queryFormData)
  }
  onCancel() {
    this.setState({
      isShowApprovalDialog: false,
      isShowDetailDialog: false,
      isShowDialog: false,
      isShowEditDialog: false,
    })
  }

  onClose() {
    this.setState({
      isShowApprovalDialog: false,
      isShowDialog: false,
      isShowEditDialog: false,
      isShowDetailDialog: false,
    })
  }
  /**
   * 修改采购价格
   */
  onChangeBusinessPrice(form) {
    const { businessTypePriceMap, customerTypeList, goodsList, goodsSupplyForm } = this.state
    //let customerFluctuationMap = new Map()
    //查询商品设置的客户类型上浮
    // goodsList.find(e => e.goodsId == goodsSupplyForm['goodsCode'])?.customerFluctuation?.forEach(item=>{
    //   customerFluctuationMap.set(item['customerTypeId'], item['salesIncreaseRatio'])
    // })

    customerTypeList.forEach(e => {
      let defaultScale = e['defaultScale'] || 0
      let defaultReferenceType = e['defaultReferenceType']
      let value = 0
      if (defaultReferenceType == "销售价") {
        value = form['businessPrice'] || 0
      } else if (defaultReferenceType == "采购价") {
        value = form['purchasePrice'] || 0
      }
      let price = this.computerNumber(value, 1 + defaultScale / 100, "*")
      businessTypePriceMap[e['customerTypeId']] = {
        businessTypeId: e['customerTypeId'],
        businessTypeName: e['customerTypeName'],
        price,
        upRatio: defaultScale
      }
    })
    this.setState({
      businessTypePriceMap
    })
  }
  //表单改变事件
  onChangeAddForm(e, item) {
    const { businessTypePriceMap, customerTypeList, goodsList, goodsSupplyForm } = this.state
    if (item.name == 'dateRange') {
      let startDate, endDate
      if (item.value[0]) {
        e.startDate = moment(item.value[0]).format("YYYY-MM-DD")
      }
      if (item.value[1]) {
        e.endDate = moment(item.value[1]).format("YYYY-MM-DD")
      }
    }

    if (item.name == 'goodsCode') {
      this.setState({
        supplierList: [],
        supplierOptions: []
      }, () => {
        this.dataSourceMap["queryPackageSupplierByProductCode"].load({ ids: [item.value] }).then(res => {
          if (res.code == 1 && res.data[item.value]) {
            let supplierList = res.data[item.value] || []
            const supplierOptions = supplierList.map(item => {
              return { label: item.supplierName, value: item.supplierId }
            })
            this.setState({
              supplierList: supplierList,
              supplierOptions: supplierOptions
            })
          }
        })
      })


      Object.keys(goodsSupplyForm).forEach(e => {
        goodsSupplyForm[e] = null
      })
      goodsSupplyForm.goodsCode = e
      this.setState({
        goodsSupplyForm: { ...goodsSupplyForm }
      })
    } else {
      this.setState({
        goodsSupplyForm: { ...goodsSupplyForm, ...e }
      })
    }

    if (item.name == 'purchasePrice' || item.name == 'businessPrice') {
      this.onChangeBusinessPrice(e)
    }
  }


  async queryGoodsSupplyHistory(_id) {
    let param = {
      "supplyId": _id
    }
    let result = await this.dataSourceMap['querySupplyHistory'].load(param);
    if (result.code == 1 && result.data) {
      return result.data
    }

    return []
  }
  /**
   * 查询商品规格
   */
  async queryGoodsSpecs(goodsId) {
    let param = {
      "searchList": [
        {
          "formId": this.state.formMap['goodsSpecs'],
          conditions: [
            {
              goodsId
            }
          ]
        }
      ]
    }
    let result = await this.dataSourceMap['queryMoreTableData'].load(param);
    if (result.code == 1 && result.data) {
      return result.data[this.state.formMap['goodsSpecs']]
    }
    return null
  }


  /**
   * 点击定价
   */
  openAddDialog() {
    this.setState({
      editRow: {},
      businessTypePriceMap: {},

      goodsSupplyForm: {
        goodsCode: '',
        supplierCode: '',
        startDate: '',
        endDate: '',
        purchasePrice: 0,
        specs: '',
        unit: '',
        businessPrice: 0,
        customerPrice: 0,
        status: '',
        rate: 0,
        invoiceType: '',
        remarks: '',
        businessTypePrice: []
      },
      isShowDialog: true
    })
  }

  /**
   * 点击查询
   */
  onSearch(event) {
    const conditions = []
    const searchParams = this.state.searchParams
    if (event.dateRange?.length >= 2 && event.dateRange[0] && event.dateRange[1]) {
      searchParams.dateRange = [
        moment(event.dateRange[0]).format("YYYY-MM-DD") + " 00:00:00",
        moment(event.dateRange[1]).format("YYYY-MM-DD") + " 23:59:59"
      ]
    } else {
      searchParams.dateRange = []
    }
    searchParams.status = event.status
    searchParams.supplierName = event.supplierName
    searchParams.goodsCode = event.goodsCode
    searchParams.goodsName = event.goodsName
    searchParams.supplierId = event.supplierId
    searchParams.goodsTypeId = event.goodsTypeId
    this.setState({
      searchParams
    }, () => {
      this.onPageChange(1)
    })
  }

  /**
   * 点击重置
   */
  onReset() {
    this.setState({
      searchParams: {
        dateRange: [], // 供货周期
        status: '', // 状态
        supplierName: '',//供应商名称
        goodsCode: '', // 商品名称
        goodsName: ''
      }
    }, () => {
      this.onPageChange(1)
    })
  }

  async openCustomerType(rowDetail) {
    const { businessTypePriceMap } = this.state
    let specs = await this.queryGoodsSpecs(rowDetail.goodsCode)
    let list = []
    specs.filter(e => e.isSale == '是').forEach(item => {
      if (item.salesChannels?.length) {
        item.salesChannels.forEach(key => {
          list.push({ ...item, type: key })
        })
      }
    })
    let historyList = await this.queryGoodsSupplyHistory(rowDetail._id)
    rowDetail.businessTypePrice?.forEach(e => {
      businessTypePriceMap[e.businessTypeId] = e.price
    })
    this.setState({
      editRow: rowDetail,
      goodsSupplyForm: rowDetail,
      businessTypePriceMap,
      isShowCustomerPriceDialog: true
    })
  }

  queryPackageSupplierByProductCode(code) {
    return this.dataSourceMap["queryPackageSupplierByProductCode"].load({ ids: [code] }).then(res => {
      if (res.code == 1 && res.data[code]) {
        let supplierList = res.data[code] || []
        const supplierOptions = supplierList.map(item => {
          return { label: item.supplierName, value: item.supplierId }
        })
        this.setState({
          supplierList: supplierList,
          supplierOptions: supplierOptions
        })
      }
    })
  }
  /**
   * 点开操作对话框
   */
  async openDetailDialog(rowDetail, operType) {
    const { businessTypePriceMap } = this.state
    let specs = await this.queryGoodsSpecs(rowDetail.goodsCode)
    let list = []
    specs.filter(e => e.isSale == '是').forEach(item => {
      if (item.salesChannels?.length) {
        item.salesChannels.forEach(key => {
          list.push({ ...item, type: key })
        })
      }
    })
    let historyList = await this.queryGoodsSupplyHistory(rowDetail._id)
    rowDetail.businessTypePrice?.forEach(e => {
      let ratio = this.computerNumber(e.upRatio, 100, "*")
      businessTypePriceMap[e.businessTypeId] = { ...e, upRatio: ratio }
    })
    rowDetail.dateRange = [rowDetail.startDate, rowDetail.endDate]
    await this.queryPackageSupplierByProductCode(rowDetail.goodsCode)
    if (operType == 'approval') {
      const { compareHisory } = this.state
      compareHisory.rowRecord1 = historyList[0]
      compareHisory.rowRecord2 = rowDetail
      rowDetail.supplier = {
        supplierName: rowDetail.supplierName
      }
      this.setState({
        compareHisory
      })
    }
    this.setState({
      editRow: rowDetail,
      goodsSupplyForm: rowDetail,
      businessTypePriceMap,
      specs: list,
      historyList: historyList,
      isShowDetailDialog: operType == 'view' ? true : false,
      isShowApprovalDialog: operType == 'approval' ? true : false,
      isShowEditDialog: operType == 'edit' ? true : false
    })


  }

  /**
   * 渲染商品详情
   */
  renderGoodsInfo() {
    const { editRow, specs } = this.state
    return (<div className="goodsPanel">
      <div className='goodsRow'>
        <span>商品名称</span>
        <label>{editRow.goodsName}</label>
        <span>商品编号</span>
        <label>{editRow.goodsCode}</label>
        <span>状态</span>
        <label>{editRow.status}</label>
      </div>
      <div className='goodsRow'>
        <span>供货周期</span>
        <label>{editRow.startDate?.substring(0, 10)} - {editRow.endDate?.substring(0, 10)}</label>
        <span>供应商</span>
        <label>{editRow.supplierName}</label>
        <span>采购价</span>
        <label>{editRow.purchasePrice}</label>
      </div>
      {
        specs?.map(item => <div className='goodsRow'>
          <span>售卖渠道</span>
          <label>{item.type}</label>
          <span>规格单位</span>
          <label>{item.measurementUnit}</label>
          <span>销售价</span>
          <label>{item.type == 'B端' ? editRow.businessPrice : editRow.customerPrice}</label>
        </div>)
      }
    </div>)
  }

  /**
     * 调整提交审批
     */
  onClickEditOk(event) {
    const {Message} = window.Next
    let { goodsSupplyForm, formMap, businessTypePriceMap, currentUser } = this.state
    let data = { ...goodsSupplyForm }
    data.status = '待审批'
    data.approveIndex = 1
    data.businessTypePrice = []
    data.adjustTime = moment().format("YYYY-MM-DD HH:mm:ss")
    data.adjustBy = currentUser.id
    data.adjustBy_user = currentUser.nickName

    if (!goodsSupplyForm.startDate || !goodsSupplyForm.endDate) {
      Message.error("请填写供货周期")
      return
    }
    if (goodsSupplyForm.purchasePrice == null) {
      Message.error("请填写供货价")
      return
    }
    if (goodsSupplyForm.businessPrice == null) {
      Message.error("请填写B端销售价")
      return
    }
    if (goodsSupplyForm.customerPrice == null) {
      Message.error("请填写C端销售价")
      return
    }
    if (goodsSupplyForm.rate == null) {
      goodsSupplyForm.rate = 0
    }
    Object.keys(businessTypePriceMap).forEach(key => {
      data.businessTypePrice.push({
        businessTypeId: key,
        price: businessTypePriceMap[key].price,
        businessTypeName: businessTypePriceMap[key].businessTypeName,
        upRatio: this.computerNumber(businessTypePriceMap[key].upRatio, 100, "/")
      })
    })
    if (!goodsSupplyForm.supplierCode && goodsSupplyForm.businessPrice == 0 && goodsSupplyForm.purchasePrice == 0 && goodsSupplyForm.customerPrice == 0
      && goodsSupplyForm.businessTypePrice.every(e => e.price == 0)) {
      goodsSupplyForm.isVoided = '是'
    } else {
      goodsSupplyForm.isVoided = '否'
    }
    this.dataSourceMap['updateFormData'].load({
      data,
      id: goodsSupplyForm._id,
      formId: formMap.goods_supply
    }).then(e => {
      if (e.code == 200) {
        window.Next.Message.success("修改成功")
        this.onPageChange(1)
        this.onClose()
        this.addApprovalInit(data)
      }
    })
  }

  //初始化配置参数
  async addApprovalInit(data) {
    const param =  { "conditionFilter": { "conditionType": "AND", "conditions": [{ "conditionValues": ["供应调整权限配置"], "conditionOperator": "eq", "field": "approveType" }] },
     "page": { "current": 1, "pages": 0, "size": 10, "total": 2 },
      "sorts": [{ "key": "approveIndex", "type": "ASC" }],
      "formId": this.state.formMap.haiju_userPermissions}
    let resp = await this.dataSourceMap.queryFormData.load(param)
    if (resp.code == 200) {

      let list = resp.result.records || []
      if (list?.length) {
        debugger
        let approvlInit = list.map(item => {
          return {
            supplyId: data['_id'],
            approveIndex: item.approveIndex,
            status: "待审批",
            adjustTime: data.adjustTime,
            adjustBy: data.adjustBy,
            adjustBy_user: data.adjustBy_user,
            userApprovalList: item.approvePerson?.split(",")?.map((e,index) => {
              return {
                approvePerson_user: item.approvePerson_user.split(",")[index],
                approvePerson: e,
              }
            })
          }
        })
        debugger
        this.dataSourceMap.addMoreFormData.load({
          datas: approvlInit,
          formId: this.state.formMap.goodsSupplyApprovalRecords
        })
      }
    }

  }


  /**
  * 审核驳回
  */
  async onClickReject(event) {
    const { Message,Input } = window.Next
    let { goodsSupplyForm, formMap, currentUser, userApproveList } = this.state
    let data = { ...goodsSupplyForm }

    let approvalRecord = goodsSupplyForm.approvalRecord

    let rejectReason = ""
    //输入驳回原因
    function onChangeReject(value) {
      rejectReason = value
    }
    window.Next.Dialog.confirm({
      title: "驳回",
      content: <Input.TextArea placeholder="请输入驳回原因" onChange={onChangeReject} />,
      onOk: () => {
        //添加审批时间
        let status = approvalRecord.status
        for (item of approvalRecord.userApprovalList) {
          if (item.approvePerson == currentUser.id) {
            item.approveResult = '驳回'
            item.rejectReason = rejectReason
            item.approvePerson_user = currentUser.nickName
            item.createTime = moment().format("YYYY-MM-DD HH:mm:ss")
          }
        }

        let updateApprovalRecord = this.dataSourceMap.updateFormData.load({
          formId: formMap.goodsSupplyApprovalRecords,
          id: approvalRecord._id,
          data: approvalRecord
        })

        data.approveIndex = 1
        data.status = '待定价'
        let updateFormData = this.dataSourceMap['updateFormData'].load({
          data,
          id: goodsSupplyForm._id,
          formId: formMap.goods_supply
        })
        return Promise.all([updateApprovalRecord, updateFormData]).then(res => {
          if (res[1].code == 200) {
            //修改审批记录
            this.resetApprovalRecord(goodsSupplyForm._id, "已审批")
            window.Next.Message.success("审批成功")
            //如果是生效中
            this.onPageChange(1)
            this.onClose()
          }
        })
      }
    })

   

    
  }
  /**
   * 审核通过或者驳回
   */
  async onClickApproval(event, param) {
    const { Message } = window.Next
    let { goodsSupplyForm, formMap, currentUser, userApproveList } = this.state
    let data = { ...goodsSupplyForm }
    let pass = true

    let approvalRecord = goodsSupplyForm.approvalRecord
    //添加审批时间
    let status = approvalRecord.status
    for (item of approvalRecord.userApprovalList) {
      if (item.approvePerson == currentUser.id) {
        item.approveResult = param.status
        item.approvePerson_user = currentUser.nickName
        item.createTime = moment().format("YYYY-MM-DD HH:mm:ss")
      }
    }

    let resp = await this.dataSourceMap.updateFormData.load({
      formId: formMap.goodsSupplyApprovalRecords,
      id: approvalRecord._id,
      data: approvalRecord
    })
    //是否审批完成
    let noResult = approvalRecord.userApprovalList.find(e => !e.approveResult)
    if (!noResult) {
      if (Array.isArray(userApproveList) && userApproveList?.length) {
        const maxValue = Math.max(...userApproveList.map(item => item.approveIndex));
        if (maxValue != goodsSupplyForm.approveIndex) {
          pass = false
        }
      }
    } else {
      Message.success("审批完成")
      this.onPageChange(1)
      this.onClose()
      return
    }


    if (pass) {
      let endDate = goodsSupplyForm.endDate?.replace("00:00:00", "23:59:59")
      if (moment(goodsSupplyForm.startDate).isAfter(moment())) {
        data.status = '待生效'
      } else if (moment().isAfter(moment(endDate))) {
        data.status = '已过期'
      } else {
        data.status = '生效中'
      }
    } else {
      data.approveIndex = goodsSupplyForm.approveIndex + 1
    }

    this.dataSourceMap['updateFormData'].load({
      data,
      id: goodsSupplyForm._id,
      formId: formMap.goods_supply
    }).then(e => {
      if (e.code == 200) {
        if (pass) {
          this.dataSourceMap['updateGoodsSupplyById'].load(
            { ids: [goodsSupplyForm._id] })
          //修改审批记录
          this.resetApprovalRecord(goodsSupplyForm._id, "已审批")
        }
        window.Next.Message.success("修改成功")
        //如果是生效中
        this.onPageChange(1)
        this.onClose()
      }
    })
  }


  async resetApprovalRecord(id, status) {
    let records = await this.queryApprovalRecords([id])
    if (records?.length) {
      let batchUpdateParam = {
        formId: this.state.formMap.goodsSupplyApprovalRecords,
        datas: records.map(e => {
          return {
            _id: e['_id'],
            status: status
          }
        })
      }
      this.dataSourceMap['batchUpdate'].load(batchUpdateParam)
    }
  }

  onCloseCustomerPrice() {
    this.setState({
      isShowCustomerPriceDialog: false
    })
  }



  renderHistoryTable() {
    const { Table, Button, NumberPicker } = window.Next

    const { currentUser, historyList } = this.state
    const column = [
      { title: '调整时间', dataIndex: 'edit_date' },
      {
        title: '调整人', dataIndex: 'editBy', cell: (v, i, row) => {
          return row.editUser?.nickName
        }
      },
      {
        title: '操作', dataIndex: 'num',
        cell: (v, i, row) => {
          if (i == historyList?.length - 1) {
            return "初始值"
          }
          return <span
            onClick={e => this.openCompareHistoryDialog(e, v, i)} >查看详情</span>
        }
      }
    ]

    return (<div className={'history_table_box'}>
      <Table fixedHeader maxBodyHeight={300}
        dataSource={this.state.historyList}
        primaryKey={'_id'}
        hasBorder={true}
      >
        {column.map((item, index) => {
          return (<Table.Column title={item.title} width={item.width ? item.width : 100}
            cell={item.cell ? (v, i, row) => item.cell(v, i, row) : v => v}
            dataIndex={item.dataIndex} key={item.dataIndex} />)
        })}
      </Table>
    </div>)

  }

  openCompareHistoryDialog(e, v, i) {
    const { compareHisory, historyList } = this.state
    compareHisory.rowRecord1 = historyList[i + 1]
    compareHisory.rowRecord2 = historyList[i]
    this.setState({
      compareHisory,
      isShowCompareHistoryDialog: true,
    })
  }
  /**
   * 查看历史比较详情
   */
  renderGoodsHistoryInfo() {
    const { compareHisory, goodsSupplyForm, customerTypeList } = this.state
    const { rowRecord1, rowRecord2 } = compareHisory
    const fomartTime = time => {
      if (time?.length > 26) {
        let arr = time.split("-")
      }

    }
    return (<div className="comparePricePanel">
      <div  >
        <span>状态 </span>
        <label>调整前</label>
        <label>调整后</label>
      </div>
      <div  >
        <span>商品名称</span>
        <label>{goodsSupplyForm.goodsName}</label>
        <label>{goodsSupplyForm.goodsName}</label>
      </div>
      <div  >
        <span>供应商</span>
        <label>{rowRecord1?.supplier?.supplierName}</label>
        <label>{rowRecord2?.supplier?.supplierName}</label>
      </div>
      <div  >
        <span>供货周期</span>
        <label>{(rowRecord1?.startDate?.substring(0, 10) || "") + "-" + (rowRecord1?.endDate?.substring(0, 10) || "")}</label>
        <label>{(rowRecord2?.startDate?.substring(0, 10) || "") + "-" + (rowRecord2?.endDate?.substring(0, 10) || "")}</label>
      </div>
      <div  >
        <span>采购价</span>
        <label>{rowRecord1?.purchasePrice}</label>
        <label>{rowRecord2?.purchasePrice}</label>
      </div>
      <div >
        <span>B端统一售价</span>
        <label>{rowRecord1?.businessPrice}</label>
        <label>{rowRecord2?.businessPrice}</label>
      </div>
      <div  >
        <span>C端售价</span>
        <label>{rowRecord1?.customerPrice}</label>
        <label>{rowRecord2?.customerPrice}</label>
      </div>
      <div >
        <span>进项税率</span>
        <label>{rowRecord1?.rate ? (rowRecord1?.rate + "%") : 0}</label>
        <label>{rowRecord2?.rate ? (rowRecord2?.rate + "%") : 0}</label>
      </div>
      <div >
        <span>发票类型</span>
        <label>{rowRecord1?.invoiceType}</label>
        <label>{rowRecord2?.invoiceType}</label>
      </div>
      {
        customerTypeList && customerTypeList.map(e =>
          <div  >
            <span>{e.customerTypeName}</span>
            <label>{rowRecord1?.businessTypePrice?.find(i => i['businessTypeId'] == e['customerTypeId'])?.price}</label>
            <label>{rowRecord2?.businessTypePrice?.find(i => i['businessTypeId'] == e['customerTypeId'])?.price}</label>
          </div>
        )
      }
    </div>)
  }



  onCloseCompareDialog() {
    this.setState({
      isShowCompareHistoryDialog: false
    })
  }




  async exportApprovalList(rowDetail) {
    // let historyList = await this.queryGoodsSupplyHistory(rowDetail._id)
    // let rowRecord1 = {}
    // if (historyList?.length && historyList.length > 1) {
    //   rowRecord1 = historyList[historyList.length - 1]
    // }
    this.setState({
      isShowLoading: true
    }, () => {
      this.dataSourceMap['exportGoodsSupply'].load({
        "supplyId": rowDetail['_id'] 
      }).then(res => {
        // 确认导出定价汇总
        let blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
        let fileName = rowDetail.goodsName + '审批记录.xlsx'
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
        this.setState({
          isShowLoading: false
        })
      }).catch(e => {
        this.setState({
          isShowLoading: false
        })
      })
    })
  }

	onCloseApprovalDialog(){
    this.setState({
      curApprovalList:[],
      showApprovalFlag:false
    })
	}

	renderApprovalIndex(value){
    return `第${value}阶段`
	}
}