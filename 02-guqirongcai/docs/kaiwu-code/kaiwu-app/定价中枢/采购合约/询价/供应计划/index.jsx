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
    isShowLoading: false,
    isShowApprovalDialog: false,
    isShowRejectDialog: false,
    "text": "outer",
    activeTab: '全部',
    "isShowDialog": false,
    dialogTitle: '新建计划单',
    packages: null,
    editRow: null,
    flag: false,
    list: [],
    operType: '',
    packageOptions: [],//标包options
    packageMap: null,
    productList: [],
    selectRecords: [],
    searchParams: {
      dateRange: [], // 日期范围
      status: '', // 状态
    },
    "rowSelection": {
      onChange: function (ids, records) {
        this.onChangeSelect(ids, records)
      },
      onSelect: function (selected, record, records) {
      },
      onSelectAll: function (selected, records) {
      },
      // mode: 'single',
      selectedPRowKeys: [],
    },
    formMap: {
      'inquiry—packages': '', // 商品标包
      'product_plan': '',//商品计划供应
      'goodsSpecs': '',//商品规格
      'goods': '',//商品表
      'supplier': '',//供应商
      "haiju_xunjiapeizhi": '',//询价表
      'planSupply_product': '',//计划配置商品
      'planSupply_supplier': "",
      haiju_userPermissions: '', // 审批权限表单
      planSupplyApprovalRecords: "" //审批记录
    },
    queryConditions: {
      "conditionFilter": {
        "conditionType": "AND", "conditions": []
      },
      "page": { "current": 1, "pages": 0, "size": 10, "total": 1 },
      "sorts": [],
      "formId": ""
    },
    formValue: {
      name: '',
      status: '启用',
      remarks: '',
      product_info: []
    },
    approveCode: ['AP_PLANSUPPLY'], // AP_PRICING 定价审批ENUM
    userApproveList: [], // 审批权限列表
    curApprovalList: [] //审批记录
  }
  componentDidMount() {
    this.init(() => {
      this.queryFormData()
    })
    console.log('did mount');
  }

  componentWillUnmount() {
    console.log('will unmount');
  }

  onChangeSelect(ids, records) {
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    this.setState({
      rowSelection,
      selectRecords: records
    });
  }

  /**
   * 
   */
  initEditData(rowRecord = {}) {
    const { productType, formValue, formMap } = this.state
    let param =
    {
      "searchList": [
        {
          "formId": formMap.planSupply_supplier,//计划供应商
          "conditions": [{ "plan_code": rowRecord.code }]
        },
        {
          "formId": formMap.planSupply_product,//计划商品
          "conditions": [{ "plan_code": rowRecord.code }]
        }
      ]
    }
    return this.dataSourceMap['queryMoreTableData'].load(param).then(async result => {
      if (result.code == 1) {
        let supplierList = result.data[formMap.planSupply_supplier].map(e => {
          return {
            ...e,
            supplierId: e['supplier_code'],
            inquiry_flag: e['inquiry_flag'] == '是' ? true : false,
            supplierName: e.supplier_name,
          }
        })
        this.setState({
          supplierList
        })
        let productList = result.data[formMap.planSupply_product]
        let goodsIds = productList.map(e => e['product_code'])
        //查询商品详情
        let res = await this.dataSourceMap['getGoodsDetail'].load({ 'goodsId': goodsIds })
        if (res.code == 1) {
          let list = []
          let goodsList = res.data
          let picUrls = goodsList.reduce((cur, value) => {
            if (value?.previewImage?.length) {
              return cur.concat(value?.previewImage)
            } else {
              return cur
            }
          }, [])
          let img = await this.getFileUrls(picUrls)
          productList.forEach(item => {
            let goods = goodsList.find(e => e.goodsId == item.product_code)
            if (goods?.previewImage?.[0]) {
              goods.fileUrl = img[goods?.previewImage?.[0]]
            }
            let product = {
              ...goods,
              ...item,
              inquiry_flag: item['inquiry_flag'] == '是' ? true : false,
            }
            list.push(product)
          })
          this.setState({
            productList: list
          })
        }
      }
    })
  }

  /**
   * 点击新增 初始化数据
   */
  queryPackages() {
    let formId = this.state.formMap['inquiry-packages']
    const { productType, product, formValue } = this.state
    return this.dataSourceMap['queryPackageList'].load().then(result => {
      if (result.code == 1) {
        let map = new Map()
        const list = result.data
        list.forEach((item, index) => {
          map.set(item['code'], item)
        })
        const packageOptions = this.dealGoodsTypeList(result.data, "")
        this.setState({
          packageOptions,
          packageMap: map
        })
      }
    })
  }

  /**
   * 获取商品图片
   */
  async getFileUrls(picUrls) {
    const picParam = {
      names: picUrls
    }
    const res = await this.dataSourceMap['getFileUrlList'].load(picParam)
    return res.result
  }
  // 处理商品分类
  dealGoodsTypeList(data,) {
    const list = data
      .filter(item => !item?.parent_code)
      .map(item => ({
        label: item.name,
        value: item.code,
        children:
          data.filter(sub => sub.parent_code == item.code).map(item => ({
            label: item.name,
            value: item.code
          })
          )
      }))

    return list;
  }

  async queryApprovalRecords(data, approvalIndex) {
    const { Message } = window.Next
    const { currentUser } = this.state
    const formId = this.state.formMap.planSupplyApprovalRecords
    let param = {
      "conditionFilter": {
        "conditionType": "and", "conditions":
          [
            { "conditionValues": [data.code], "conditionOperator": "eq", "field": "supplyNo" }
          ]
      },
      "page": { "current": 1, "pages": 0, "size": 10, "total": 0 },
      "sorts": [],
      "formId": formId
    }
    if (approvalIndex) {
      param.conditionFilter.conditions.push({ "conditionValues": [approvalIndex], "conditionOperator": "eq", "field": "approveIndex" })
    }
    return new Promise((resolve, reject) => {
      this.dataSourceMap['queryFormData'].load(param).then(resp => {
        resolve(resp.result?.records || [])
      }).catch(e => reject(e))
    })
  }

  /**
   * 打开抽屉
   */
  openDrawer(e, { operType, rowRecord = null }) {

    let { editFlag } = this.state

    this.setState({
      supplierList: [],
      productList: []
    }, () => {
      if (operType == 'add') {
        this.queryPackages()
        editFlag = false

      } else {
        this.initEditData(rowRecord)
        editFlag = true
      }
      this.setState({
        editFlag,
        editRow: rowRecord,
        operType: operType,
        isShowDialog: true
      })
    })

  }

  async queryApprovalList(conditions) {
    let param = {
      "searchList": [
        {
          "formId": this.state.formMap['planSupplyApprovalRecords'], //查询配置的供应商
          "conditions": conditions
        }
      ]
    }
    let res = await this.dataSourceMap['queryMoreTableData'].load(param)
    if (res.code == 1) {
      let list = res.data[this.state.formMap['planSupplyApprovalRecords']] || []
      return list
    }
    return []
  }
  setShowApprovalFlag(item, list) {
    const { currentUser, userApproveList } = this.state
    let approveFlag = false // true 隐藏审核按钮
    if (item.status === '审批中') {
      debugger
      const temp = userApproveList.filter(e => e.approveIndex === item.approveIndex)
      if (temp && temp.length > 0) {
        approvePerson = temp[0].approvePerson_user
        //当前登陆人是否为审批节点
        const flag = temp[0]['approvePerson'].indexOf(currentUser.id) > -1

        let hasRecords = list.find(e =>
          e.supplyNo == item.code &&
          e.approvalIndex == item.approvalIndex &&
          e.approvePerson == currentUser.id)
        if (flag && !hasRecords) {
          item.showApproval = true
        }

        let userIds = list.filter(e =>
          e.supplyNo == item.code &&
          e.approvalIndex == item.approvalIndex).map(e => e.approvePerson_user)
        let userList = approvePerson?.split(",")?.filter(e => !userIds.includes(e)) || []
        item.approvalUser = userList.join(",")
      }
    } else {
      item.approvalUser = ""
    }

  }
  async queryFormData() {
    const { queryConditions, formMap, searchParams } = this.state
    queryConditions.formId = formMap['product_plan']
    queryConditions.conditionFilter.conditions = []
    if (searchParams.status && searchParams.status != '全部') {
      queryConditions.conditionFilter.conditions.push({
        field: 'status',
        conditionValues: [searchParams.status],
        conditionOperator: "eq"
      })
    }
    if (searchParams.dateRange?.length) {
      queryConditions.conditionFilter.conditions.push({
        field: 'createTime',
        conditionValues: searchParams.dateRange,
        conditionOperator: "between"
      })
    }
    //查询主包
    let res = await this.dataSourceMap['queryFormData'].load(queryConditions)
    if (res.code == 200 && res.result?.records) {
      queryConditions.page.total = res.result.total
      let list = res.result.records
      let temp = res.result?.records?.filter(e => e.status == '审批中')
      if (temp.length) {
        let conditions = temp?.map(item => {
          return {
            "supplyNo": item['code'],
            "approveIndex": item["approveIndex"] || 1,
          }
        }) || []
        let approvalList = await this.queryApprovalList(conditions)
        for (const item of list) {
          if (item.status == '审批中') {
            this.setShowApprovalFlag(item, approvalList)
          } else {
            item.approvalUser = ""
          }
        }
      }

      this.setState({
        list: list || [],
        total: res.result.total || 0
      })
    }
  }
  onChangeTab(e) {
    const { searchParams } = this.state
    this.setState({
      searchParams: {
        dateRange: [],
        status: e
      },
      activeTab: e
    }, this.onPageChange(1))
  }

  onPageChange(e) {
    const { queryConditions } = this.state
    queryConditions.page.current = e
    this.setState({
      queryConditions
    }, this.queryFormData)
  }




  updateStatus(record, title, status, message) {
    const { Message, Input } = window.Next
    //输入驳回原因
    function onChangeReject(value) {
      const { editRow } = this.state
      editRow.rejectReason = value
      this.setState({
        editRow
      })
    }
    let getContent = (status) => {
      if (status == '已驳回') {
        return <Input.TextArea placeholder="请输入驳回原因" onChange={onChangeReject} />
      } else {
        return message
      }
    }

    window.Next.Dialog.confirm({
      title: title,
      content: (getContent(status)),
      onOk: () => {
        const data = {
          formId: this.state.formMap.product_plan,
          data: {
            status: status,
            rejectReason: this.state.editRow?.rejectReason
          },
          id: record._id
        }
        return new Promise(resolve => {
          this.dataSourceMap['updateFormData'].load(data).then(res => {
            if (res.code === 200) {
              resolve()
              this.onCloseAndRefresh()
              if (status == '已驳回') {
                //添加审批记录
                this.dataSourceMap['addFormData'].load(
                  {
                    "data": {
                      "supplyNo": record.code,
                      "approveIndex": record.approveIndex,
                      "approveResult": "已驳回",
                      "approvePerson_user": this.state.currentUser.nickName,
                      "approvePerson": this.state.currentUser.id,
                      "rejectReason": this.state.editRow.rejectReason,
                    }, "formId": this.state.formMap.planSupplyApprovalRecords
                  }
                )
              }
            }
          })
        }).then(() => {
          Message.success('执行成功')
        });


      },
      onCancel: () => {

      }
    })
  }

  /**
   * 撤销计划
   */
  chexiaoRecord() {
    this.updateStatus(this.state.editRow, "撤回", "已关闭", "撤销后不可撤回")
  }

  editRow(value, index, record) {
    console.log(arguments)
    this.initEditData(record)
    this.setState({
      editFlag: true,
      editRow: record,
      isShowDialog: true,
      packagesCode: record.packages_code
    })

  }

  checkApprovalUser(item) {
    const { currentUser, userApproveList } = this.state

    let approveFlag = false // true 隐藏审核按钮
    if (item.status === '审批中') {

      const temp = userApproveList.filter(e => e.approveIndex === item.approveIndex)
      if (temp && temp.length > 0) {
        approvePerson = temp[0].approvePerson_user
        const flag = temp[0]['approvePerson'].indexOf(currentUser.id) > -1
        approveFlag = flag
      }
    }
    console.log(approveFlag)
    return approveFlag
  }
  renderTable() {
    const { Table, Button, Dropdown, Menu, Box, MenuButton, Item } = window.Next
    const { useState } = React
    const operRender = (value, index, record) => {
      return (<div className={'opr-button'}>

        {['待提交'].includes(record['status']) && <Button type="primary" style={{ 'margin-right': '8px' }}
          text={true}
          onClick={(e) => { this.openDrawer(e, { rowRecord: record, operType: 'edit' }) }}
        >编辑</Button>
        }
        {['待提交'].includes(record['status']) && <Button type="primary" style={{ 'margin-right': '8px' }}
          onClick={(e) => { this.updateStatus(record, "撤回", '已关闭', '确定要撤销吗？') }}
          text={true}>撤销</Button>
        }
        {['审批中'].includes(record['status']) && record.showApproval && <Button type="primary" style={{ 'margin-right': '8px' }}
          onClick={(e) => { this.openDrawer(e, { rowRecord: record, operType: 'view' }) }}
          text={true}>审批</Button>
        }
        <Button type="primary" style={{ 'margin-right': '8px' }}
          onClick={(e) => { this.openDrawer(e, { rowRecord: record, operType: 'view' }) }}
          text={true}>详情</Button>

        <Button type="primary" style={{ 'margin-right': '8px' }}
          onClick={(e) => { this.exportExcel(e, { rowRecord: record, operType: 'export' }) }}
          text={true}>导出</Button>
        {['审批中', '已提交', '已驳回'].includes(record['status']) && <Button type="primary" style={{ 'margin-right': '8px' }}
          onClick={(e) => { this.showApprovalDialog(record) }}
          text={true}>查看审批记录</Button>
        }
      </div>)
    }
    return (<div>
      <Table.StickyLock
        dataSource={this.state.list}
        primaryKey={'_id'}
        hasBorder={true}
        rowSelection={this.state.rowSelection}
      >
        <Table.Column title="计划表单号" dataIndex="code" width={120} />
        <Table.Column title="标包" dataIndex="packages_name" width={100} />
        <Table.Column title="商品数量" dataIndex="product_count" width={60} />
        <Table.Column title="创建人" dataIndex="createBy_user" width={100} />
        <Table.Column title="创建时间" dataIndex="createTime" width={100} />
        <Table.Column title="关联询价单" dataIndex="inquiry_code" width={100} />
        <Table.Column title="状态" dataIndex="status" width={100} />
        <Table.Column title="当前审批人" dataIndex="approvalUser" width={100} />
        <Table.Column cell={operRender} title="操作" lock="right" width={140} />
      </Table.StickyLock>
    </div>)
  }



  // 查询筛选
  onSearch(event) {
    const conditions = []

    const searchParams = this.state.searchParams
    if (event.dateRange?.length >= 2 && !!event.dateRange[0] && !!event.dateRange[1]) {
      try {
        searchParams.dateRange = [
          moment(event.dateRange[0]).format("YYYY-MM-DD") + " 00:00:00",
          moment(event.dateRange[1]).format("YYYY-MM-DD") + " 00:00:00"
        ]
      } catch (e) {
        searchParams.dateRange = []
      }
    } else {
      searchParams.dateRange = []
    }
    searchParams.status = event.status
    this.setState({
      searchParams
    }, () => {
      this.onPageChange(1)
    })
  }

  onReset() {

    this.setState({
      searchParams: {
        dataRange: [],
        status: ''
      }
    }, () => {
      this.onPageChange(1)
    })

  }
  async showApprovalDialog(data) {
    const { Message } = window.Next
    const { userApproveList } = this.state
    let list = await this.queryApprovalRecords(data)
    if (!list?.length) {
      Message.error("暂无审批记录")
      return
    }
    list.forEach(item => {
      const temp = userApproveList.filter(e => e.approveIndex === item.approveIndex)
      item.approveIndexName = temp.length > 0 ? temp[0].approveName : ''
      item.packages_name = data.packages_name
    })
    // let groupList =   _.groupBy(list,"approveIndex")
    this.setState({
      isShowApprovalDialog: true,
      curApprovalList: list
    })

  }

  // 渲染审核记录
  renderApprovalDetailJSX() {
    const column = [
      { title: '供应单号', dataIndex: 'supplyNo' },
      { title: '商品标包', dataIndex: 'packages_name' },
      { title: '流程阶段', dataIndex: 'approveIndexName' },
      { title: '审批人员', dataIndex: 'approvePerson_user' },
      { title: '审批结果', dataIndex: 'approveResult' },
      { title: '审批时间', dataIndex: 'createTime' },
      { title: '驳回原因', dataIndex: 'rejectReason' }
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

      hasBorder={true}
    >
      {column.map((item, index) => {

        return (<Table.Column title={item.title} dataIndex={item.dataIndex} key={item.dataIndex} />)

      })}
    </Table.StickyLock>)
  }

  /**
   * 
   */
  renderSupplier(value, index, rowRecord) {
    const { Switch } = window.Next
    console.log(arguments)
    return <Switch
      size="small"
      defaultChecked={rowRecord['inquiry_flag']}
      disabled={['view', 'shenhe'].includes(this.state.operType)}
      onChange={(value) => {
        rowRecord['inquiry_flag'] = value
      }}
      style={{ verticalAlign: "middle" }}
    />
  }
  /**
   * 修改标包类型
   */
  async onChangeSupplierType(value) {
    const { supplierType, supplier, formValue } = this.state
    let formId = this.state.formMap['supplier']
    let param = {
      "conditionFilter": {
        "conditionType": "AND", "conditions": []
      },
      "page": { "current": 1, "pages": 0, "size": 20000, "total": 1 },
      "sorts": [],
      "formId": formId
    }
    param.conditionFilter.conditions.push({ "conditionValues": ["正常"], "conditionOperator": "eq", "field": "supplierStatus" })

    param.conditionFilter.conditions.push({ "conditionValues": [value], "conditionOperator": "any", "field": "supplierType" })
    let resp = await this.dataSourceMap['queryFormData'].load(param)
    if (resp.code == 200) {
      return resp.result.records || []
    }
  }

  async onChangePackage(value, data) {
    const { packageMap } = this.state


    let res = await this.dataSourceMap['queryPackageInfoById'].load({
      id: value
    })
    let packages = res.data

    let supplierList1 = await this.onChangeSupplierType(packages.packageType)
    let supplierList = supplierList1.map(e => {
      return {
        "supplierId": e["supplierId"],
        "supplierName": e["supplierName"],
        "_id": e["_id"],
        "inquiry_flag": true
      }
    })

    packages.product_list.forEach(e => {
      e['inquiry_flag'] = true
      e['lastmonth_sales'] = e.orderCount?.[0]?.count || 0
    })
    let productList = packages.product_list
    let picUrlList = await this.getFileUrls(productList.map(item => item.previewImage?.[0]).filter(e => !!e))
    productList.forEach(e => {
      if (e.previewImage) {
        e.fileUrl = picUrlList[e.previewImage?.[0]]
      }
    })
    //排序
    let sortedGoodsIds = packages.product_info?.map(e => e.product_code)
    //排序
    this.setState({
      packages: packages,
      supplierList: supplierList,
      productList: productList.sort((a, b) => sortedGoodsIds.indexOf(a.goodsId) - sortedGoodsIds.indexOf(b.goodsId))
    })
  }
  // 数据改变时触发的操作
  onChangeData(value, record, dataIndex) {
    record[dataIndex] = e
  }
  renderProductListTable() {
    const { Table, Input, Switch, Button, Dropdown, Menu, Box, MenuButton, Item } = window.Next
    const { useState } = React
    const Columns = [
      { title: '序号', dataIndex: 'index', width: 120 },
      { title: '商品图片', dataIndex: 'image', width: 120 },
      { title: '商品名称', dataIndex: 'goodsName', width: 120 },
      { title: '品牌', dataIndex: 'goodsBrand', width: 120 },
      { title: '采购规格标准', dataIndex: 'procurementStandards', width: 120 },
      { title: '详细配送标准', dataIndex: 'peisong', width: 120 },
      { title: '上月销量汇总', dataIndex: 'lastmonth_sales', width: 120 },
      { title: '单位', dataIndex: 'unit', width: 120 },
      { title: '注意事项', dataIndex: 'note', width: 200 },
      { title: '是否供货', dataIndex: 'inquiry_flag', width: 120 }
    ]
    // 渲染每个字段
    const columnCell = (value, index, record, data) => {
      switch (data.dataIndex) {
        case 'unitType':
          return record.unitType
        case 'index':
          return index + 1;
        case 'image':
          return (<div style={{ width: 50, height: 50 }}>
            <img width={50} height={'auto'} src={record.fileUrl} alt="" />
          </div>)
        case 'minimumOrderQuantity':
          return 0
        case 'orderCount':
          return record?.orderCount?.[0]?.count || 0
        case 'inquiry_flag':
          return <Switch
            size="small"
            defaultChecked={record['inquiry_flag']}
            onChange={(e) => {
              record[data.dataIndex] = e
            }}
            disabled={['view', 'shenhe'].includes(this.state.operType)}
            style={{ verticalAlign: "middle" }}
          />
        case 'peisong':
          return record['peisong']?.[0]?.requirement || ""
        case 'unit':
          return record['product_spec']?.[0]?.measurementUnit || ""
        case 'note':
          return <Input.TextArea
            onChange={(e) => {
              record[data.dataIndex] = e
            }}
            defaultValue={record['note']}
            disabled={['view', 'shenhe'].includes(this.state.operType)}
            style={{ width: 150 }} placeholder="注意事项" aria-label="注意事项" />
        default:
          return record[data.dataIndex]
      }
    }

    return (<div>
      <Table.StickyLock
        dataSource={this.state.productList}
        primaryKey={'_id'}
        hasBorder={true}
      >
        {Columns.map((item, index) => {
          return (<Table.Column cell={(value, index, record) => columnCell(value, index, record, item)} title={item.title} width={item.width ? item.width : 100} dataIndex={item.dataIndex} key={item.dataIndex} />)
        })}
      </Table.StickyLock>
    </div>)
  }



  batchHandle(formValue) {
    const { packages, formMap, supplierList, productList } = this.state
    this.dataSourceMap['removeFormData'].load({
      formId: formMap['planSupply_supplier'],
      data: {
        plan_code: formValue.code
      }
    }).then(e => {
      this.dataSourceMap['addMoreFormData'].load({
        datas: supplierList.map(item => {
          return {
            supplier_code: item.supplierId,
            supplier_name: item.supplierName,
            plan_code: formValue.code,
            inquiry_flag: item.inquiry_flag ? '是' : '否',
            isInquiry: item.inquiry_flag ? '是' : '否',
          }
        }),
        formId: formMap['planSupply_supplier']
      })
    })

    this.dataSourceMap['removeFormData'].load({
      formId: formMap['planSupply_product'],
      data: {
        plan_code: formValue.code
      }
    }).then(e => {
      this.dataSourceMap['addMoreFormData'].load({
        datas: productList.map((item, index) => {
          return {
            product_code: item.goodsId,
            product_name: item.goodsName,
            plan_code: formValue.code,
            sortId: index,
            note: item.note,
            lastmonth_sales: item.lastmonth_sales,
            inquiry_flag: item.inquiry_flag ? '是' : '否',
            isInquiry: item.inquiry_flag ? '是' : '否'
          }
        }),
        formId: formMap['planSupply_product']
      })
    })

  }

  /**
   * 点击动作按钮
   */
  onClick(e, payload) {
    console.log('payload', payload)
    const { operType, editRow, packages, supplierList, queryConditions, productList, formMap } = this.state
    if (operType == 'add' && packages == null) {
      window.Next.Message.error("必须选择一个标包")
      return
    }
    let supplierCount = supplierList?.filter(e => e['inquiry_flag'])?.length
    if (!supplierCount) {
      window.Next.Message.error("必须选择询价供应商")
      return
    }

    let productCount = productList?.filter(e => e['inquiry_flag'])?.length
    if (!productCount) {
      window.Next.Message.error("必须选择供货产品")
      return
    }
    let data = {}
    if (operType == 'add') {
      data = {
        inquiryPackageTypeName: packages.packageType,
        packages_code: packages.code,
        packages_name: packages.name,
        product_count: productCount,
        supplier_count: supplierCount
      }
    } else {
      data = {
        ...editRow,
        product_count: productCount,
        supplier_count: supplierCount
      }
    }


    if (payload.name == 'save') {
      data.status = '待提交'
      data._id ? this.updateRowData(data) : this.addRowData(data)
    } else if (payload.name == 'submit') {
      //提交审批
      this.updateStatus(data, "提交审批", '审批中', "确定要提交审批？");
    } else if (payload.name == 'addsubmit') {
      data.status = '审批中'
      this.addRowData(data)
    } else if (payload.name == '撤销') {
      this.updateStatus(data, "撤回", '已关闭', "确定要撤销计划吗？");
    }
    else if (payload.name == '驳回') {
      this.updateStatus(data, "驳回", '已驳回', "是否确定要驳回该计划单吗？");

    } else if (payload.name == '通过') {

      window.Next.Dialog.confirm({
        title: '审核',
        content: (<span style={{ 'font-size': '16px' }}>是否确定审核该计划单吗？</span>),
        onOk: () => {
          this.approvalPass(data)
        }
      })
    }
  }



  addXunjia(data) {
    const { formMap } = this.state
    return new Promise((resolve, reject) => {
      this.dataSourceMap['addFormData'].load({
        data: {
          inquiryPackageTypeName: data.inquiryPackageTypeName,
          inquiryPackageId: data.packages_code, //
          nameOfQuotationPackage: data.packages_name,//
          quantityOfRequestedGoods: data.product_count,//
          quantityOfInquirySuppliers: data.supplier_count,
          supplyOrderStatus: "未生成",
          offerNoticeStatus: '未生成',
          bidStatus: '待配置',
        },
        formId: formMap['haiju_xunjiapeizhi']
      }).then(res => resolve(res.result)).catch(e => reject(e))   
    })
  }
  /**
   * 更新数据
   */
  addRowData(data) {
    let { formMap, productList } = this.state

    data.approveIndex = 1
    this.dataSourceMap['addFormData'].load({
      data,
      formId: formMap['product_plan']
    }).then(e => {
      if (e.code == 200) {
        this.batchHandle(e.result)
        this.onCloseAndRefresh()

      }
    })
  }
  /**
   * 更新数据
   */
  updateRowData(data) {
    let { formMap, productList } = this.state

    //更新计划单信息
    this.dataSourceMap['updateFormData'].load({
      data,
      id: data._id,
      formId: formMap['product_plan']
    }).then(e => {
      if (e.code == 200) {
        this.onCloseAndRefresh()
        //更新附表单数据
        this.batchHandle(data)
      }
    })

  }

  //审核通过
  async approvalPass(data) {
    const { Message } = window.Next
    let { formMap, supplierList, productList, currentUser, userApproveList } = this.state

    try {
      let list = await this.queryApprovalRecords(data, data.approveIndex)

      if (list?.length && list.find(e => e.approvePerson == currentUser.id)) {
        Message.error("您已经审核过计划供应")
        return
      }

      //添加审批记录
      await this.dataSourceMap['addFormData'].load(
        {
          "data": {
            "supplyNo": data.code,
            "approveIndex": data.approveIndex,
            "approveResult": "通过",
            "approvePerson_user": currentUser.nickName,
            "approvePerson": currentUser.id,
            "rejectReason": null
          }, "formId": formMap.planSupplyApprovalRecords
        }
      )
      let nodeLength = userApproveList.find(item => item.approveIndex == data.approveIndex)?.approvePerson.split(",").length || 0
      if ((list?.length + 1) < nodeLength) {
        Message.success("审批完成！")
        this.onCloseAndRefresh()
        return
      }

      //是否最后一个节点
      const maxValue = Math.max(...userApproveList.map(item => item.approveIndex));
      if (maxValue != data.approveIndex) {
        await this.dataSourceMap.updateFormData.load({
          data: {
            approveIndex: data.approveIndex + 1
          },
          id: data._id,
          formId: formMap['product_plan']
        })
        Message.success("审批完成！")
        this.onCloseAndRefresh()
        return
      }

      //添加询价信息
      let xunjia = await this.addXunjia(data)
      if (!xunjia || !xunjia.inquiryNumber) {
        Message.error("创建询价单失败，请重试")
        return
      }
      data.inquiry_code = xunjia.inquiryNumber
      data.status = '已提交'
      data.approvalUser = null
      //更新计划单信息
      let updateRes = await this.dataSourceMap['updateFormData'].load({
        data,
        id: data._id,
        formId: formMap['product_plan']
      })
      if (updateRes.code == 200) {
        //更新供应商询价单号
        let batchUpdateParam = {
          formId: formMap['planSupply_supplier'],
          datas: supplierList.map(supplier => {
            return {
              _id: supplier['_id'],
              inquiryNumber: data.inquiry_code,
              inquiry_flag: supplier.inquiry_flag ? '是' : '否',
              isInquiry: supplier.inquiry_flag ? '是' : '否'
            }
          })
        }
        //更新产品询价单号
        let batchUpdateProductParam = {
          formId: formMap['planSupply_product'],
          datas: productList.map(item => {
            return {
              _id: item['_id'],
              inquiryNumber: data.inquiry_code,
              note: item.note,
              inquiry_flag: item.inquiry_flag ? '是' : '否',
              isInquiry: item.inquiry_flag ? '是' : '否'
            }
          })
        }
        await Promise.all([
          this.dataSourceMap.batchUpdate.load(batchUpdateParam),
          this.dataSourceMap.batchUpdate.load(batchUpdateProductParam)
        ])
        Message.success("审批完成！")
        this.onCloseAndRefresh()
      } else {
        Message.error("更新计划单状态失败，请重试")
      }
    } catch (e) {
      console.error('审批通过操作失败:', e)
      Message.error("审批操作异常，请重试")
    }
  }

  /**
     * 直接提交
     */
  async addsubmit(data) {
    let { formMap, packages, operType, productList } = this.state
    //添加询价单号
    let xunjia = await this.addXunjia(data)
    data.inquiry_code = xunjia.inquiryNumber
    let inquiryNumber = xunjia.inquiryNumber

    this.dataSourceMap['addFormData'].load({
      data,
      formId: formMap['product_plan']
    }).then(e => {
      if (e.code == 200) {
        this.dataSourceMap['addMoreFormData'].load({
          datas: supplierList.map(item => {
            return {
              supplier_code: item.supplierId,
              supplier_name: item.supplierName,
              plan_code: e.result.code,
              inquiry_flag: item.inquiry_flag ? '是' : '否',
              isInquiry: item.inquiry_flag ? '是' : '否',
              inquiryNumber: inquiryNumber
            }
          }),
          formId: formMap['planSupply_supplier']
        })

        this.dataSourceMap['addMoreFormData'].load({
          datas: productList.map(item => {
            return {
              product_code: item.goodsId,
              product_name: item.goodsName,
              plan_code: e.result.code,
              note: item.note,
              lastmonth_sales: item.lastmonth_sales,
              inquiryNumber: inquiryNumber,
              inquiry_flag: item.inquiry_flag ? '是' : '否',
              isInquiry: item.inquiry_flag ? '是' : '否'
            }
          }),
          formId: formMap['planSupply_product']
        })
        this.onCloseAndRefresh()
      }
    })

  }
  onCloseDrawer() {
    this.setState({
      isShowDialog: false
    }, this.onPageChange(1))
  }

  /**
   * 提交审核
   */
  submitRecord(record) {
    const { Message } = window.Next
    window.Next.Dialog.confirm({
      title: '撤销',
      content: (<span style={{ 'font-size': '16px' }}>确定提交审核吗</span>),
      onOk: () => {
        const data = {
          formId: this.state.formMap.product_plan,
          data: {
            status: '已关闭'
          },
          id: record._id
        }
        this.dataSourceMap['updateFormData'].load(data).then(res => {
          if (res.code === 200) {
            this.setState({
              isShowDialog: false
            })
            Message.success('执行成功')
            this.onPageChange(1)
          }
        })
      },
      onCancel: () => {

      }
    })
  }

  async handleSingleData(data) {
    data.status = "已提交"
    const { productType, product, formValue, formMap, selectRecords } = this.state

    let param =
    {
      "searchList": [
        {
          "formId": formMap.planSupply_supplier,//计划供应商
          "conditions": [{ "plan_code": data.code }]
        },
        {
          "formId": formMap.planSupply_product,//计划商品
          "conditions": [{ "plan_code": data.code }]
        }
      ]
    }
    const result = await this.dataSourceMap['queryMoreTableData'].load(param)
    let formList = result.data;
    if (result.code === 1) {
      let productList = formList[formMap.planSupply_product]
      let supplierList = formList[formMap.planSupply_supplier]
      let xunjia = await this.addXunjia(data)
      data.inquiry_code = xunjia.inquiryNumber
      //更新计划单信息
      let planResult = await this.dataSourceMap['updateFormData'].load({
        data,
        id: data._id,
        formId: formMap['product_plan']
      })
      if (planResult.code == 200) {
        //已审核，更新供应商询价单号
        supplierList.forEach(supplier => {
          this.dataSourceMap['updateFormData'].load({
            data: {
              inquiryNumber: data.inquiry_code
            },
            id: supplier._id,
            formId: formMap['planSupply_supplier']
          })
        })
        productList.forEach(item => {
          this.dataSourceMap['updateFormData'].load({
            data: {
              inquiryNumber: data.inquiry_code
            },
            id: item._id,
            formId: formMap['planSupply_product']
          })
        })
      }
    }
  }
  /**
   * 批量审批
   */
  batchApproval() {
    const { Message } = window.Next
    const { productType, flag, product, formValue, formMap, selectRecords } = this.state
    if (flag) {
      flag = true
      let counst = selectRecords.filter(e => e.status != '待提交').length
      if (!selectRecords?.length || counst != 0) {
        Message.error("请选择需要审核的数据")
        return
      }
      selectRecords.forEach(data => {
        let rowData = Object.assign({}, data)
        this.handleSingleData(rowData)
      })
      this.setState({
        flag: false
      })
    }
  }

  exportExcel(e, { operType, rowRecord = null }) {
    this.setState({
      isShowLoading: true
    }, () => {
      this.dataSourceMap['exportSupplyPlan'].load({
        "supplyId": rowRecord.code
      }).then(res => {
        // 确认导出定价汇总
        let blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
        let fileName = rowRecord.packages_name + '.xlsx'
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

  onCloseApproval() {
    this.setState({
      isShowApprovalDialog: false
    })
  }

  onCloseAndRefresh() {
    this.setState({
      isShowDialog: false
    }, this.onPageChange(1))
  }
  exportExcelApproval() {

    // const column = [
    //   { name: '供应单号', prop: 'supplyNo' },
    //   { name: '商品标包', prop: 'packages_name' },
    //   { name: '流程阶段', prop: 'approveIndexName' },
    //   { name: '审批人员', prop: 'approvePerson_user' },
    //   { name: '审批结果', prop: 'approveResult' },
    //   { name: '审批时间', prop: 'createTime' },
    //   { name: '驳回原因', prop: 'rejectReason' }
    // ]
    //const title = `${this.state.curApprovalList[0].packages_name}审核记录`
    //KaiwuExportExcel.Excel.exportData(column, this.state.curApprovalList, title)


    let titles = ['供应单号', '商品标包', '流程阶段', '审批人员', '审批结果', '审批时间',
      '驳回原因'];
    let cells = [];
    this.state.curApprovalList.forEach(item => {
      let {
        supplyNo = '',
        packages_name = '',
        approveIndexName = '',
        approvePerson_user = '',
        approveResult = '',
        createTime = '',
        rejectReason = ''
      } = item;
      supplyNo = supplyNo ?? '';
      packages_name = packages_name ?? '';
      approveIndexName = approveIndexName ?? '';
      approvePerson_user = approvePerson_user ?? '';
      approveResult = approveResult ?? '';
      createTime = createTime ?? '';
      rejectReason = rejectReason ?? '';
      cells.push([
        supplyNo,
        packages_name,
        approveIndexName,
        approvePerson_user,
        approveResult,
        createTime,
        rejectReason
      ])
    })
    const { downLoadXLSX } = window.Xlsx;
    downLoadXLSX([titles, ...cells], `采购订单_导出.xlsx`);
    this.setState({
      exportLoading: false
    })

  }


}