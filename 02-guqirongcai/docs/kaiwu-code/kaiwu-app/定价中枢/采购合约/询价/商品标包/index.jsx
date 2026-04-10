class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    showDrawer: false,
    "isShowDialog": false,
    total:0,
    currentUser: {},
    supplierList: [],//供应商列表
    productList: [],//商品列表
    supplierTypeList: [],//供应商类型
    productTypeList: [],//产品类型
    supplierType: '',//供应商类型
    searchProduct:{
      productType: '',//商品类型
      productName:"" //商品名称
    },
    supplierValue:[],
    productValue:[],
    product: {//穿梭框商品数据
      value: [],
      leftTotal: 0,
      rightTotal: 0,
      leftPage: 1,
      rightPage: 1,
      rightList: [],
      leftList: [],
      selectedValue: [],
      leftTableDataSource: [],
      rightTableDataSource: [],
      rselectedRowKeys: [],
      lselectedRowKeys: []
    },
    formMap: {
      'inquiry_packages': '', // 商品标包
      'product_plan': '',//商品计划供应
      'goods': '',//商品表
      'supplier': '',//供应商
      'packages_supplier':'',//
      'packages_product': '',//
      "goodsSpecs":"",//商品规格
      "goodsTypeTable": '', //产品类型
      "supplierType": '', //供应商类型
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
      packageType:"",
      status: '启用',
      remarks: '',
      supplier_info:[],
      product_info:[]
    },
    list: [],

  }
  componentDidMount() {
    this.init()
    console.log('did mount');
  }
  componentWillUnmount() {
    console.log('will unmount');
  }

  //查询所有的上架商品
  queryProductList() {
    let formId = this.state.formMap['goods']
    const { searchProduct, product, formValue } = this.state
    let param = {
      "searchList": [
        {
          "formId": formId,
          "conditions": [],
          "showField": ["goodsName", "goodsId","isListing"]
        }
      ]
    }
    if (searchProduct.productType) {
      param.searchList[0].conditions.push({
        goodsClassify: searchProduct.productType
      })
    }
    return this.dataSourceMap['queryMoreTableData'].load(param).then(res => {
      if (res.code == 1) {
        //商品列表转化为 穿梭框数据源
        product.transferDataSource = res.data[formId]?.map(v => ({
          label: v.goodsName,
          value: v.goodsId,
          isListing:v.isListing
        })) || [];
        //穿梭框数据源转化为表格数据源
        let tableData = this.transferToTable(product.transferDataSource)
        if (formValue.product_info?.length) {
          product.rightTableDataSource = formValue.product_info.map((e,index) => {
            return { "id": e.product_code, "label": e.product_name }
          }) || []
          let ids = product.rightTableDataSource.map(e => e.id)
          let list = tableData.filter(item => !ids.includes(item.id));
          product.leftTableDataSource = list
          product.value = ids
        } else {
          product.leftTableDataSource = tableData
          product.rightTableDataSource = []
          product.value = []
        }
        product.leftList = this.getProductPageData(product.leftTableDataSource, product.leftPage)
        product.rightList =  product.rightTableDataSource 
        product.leftTotal = product.leftTableDataSource?.length || 0
        product.rightTotal = product.rightTableDataSource?.length || 0
        this.setState({
          product,
          supplierValue: product.value || [],
          productList: res.data[formId]
        })
        return res.data[formId]
      }
    })
  }

  /**
   * 查询供应商列表
   */
  querySupplierList() {
    const { supplierType, supplier ,formValue} = this.state
    let formId = this.state.formMap['supplier']
    let param = {
      "searchList": [
        {
          "formId": formId,
          "conditions": []
        }
      ]
    }
    
    if (supplierType) {
      param.searchList[0].conditions.push({ "supplierType": supplierType })
    }
    return this.dataSourceMap['queryMoreTableData'].load(param).then(res => {
      if (res.code == 1) {
      return res.data[formId]
      }
    })
  }

  async init() {
    // 获取用户信息
    const userRes = await this.dataSourceMap['getCurrentUser'].load()
    const currentUser = userRes.result
    // 通过编码获取表单ID
    const formMapArr = Object.keys(this.state.formMap)
    const codeParams = {
      codes: [...formMapArr]
    }
    let formMap = {}
    const codeRes = await this.dataSourceMap['getIdByCode'].load(codeParams)
    if (codeRes.result && Object.keys(codeRes).length > 0) {
      formMap = { ...codeRes.result }
    }
    this.setState({
      currentUser,
      formMap
    }, () => {
      this.queryFormList()
      this.queryFormData()
      //查询基础单位
      this.queryBaseUnit()
    }
    )
  }
  //查询商品基础单位
  queryBaseUnit(){
    
      let formId = this.state.formMap['goodsSpecs']
      const { searchProduct, product, formValue } = this.state
      let param = {
        "searchList": [
          {
            "formId": formId,
            "conditions": [{
              unitType: '基础单位'
            }],
            "showField": ['goodsId',"measurementUnit"]
          }
        ]
      }
     
      this.dataSourceMap['queryMoreTableData'].load(param).then(res => {
      if (res.code == 1) {
        let result = res.data[formId]
        let map = result.reduce((resultMap, value, index) => {
          resultMap[value['goodsId']] = value['measurementUnit'];
          return resultMap;
        }, {});
 
        this.setState({
          unitMap:map
        })
      }
      })
  }
  /**
   * 查询产品类型和供应商类型
   */
  queryFormList() {
    let param = {
      "searchList": [
        {
          "formId": this.state.formMap['goodsTypeTable'],
          "conditions": []
        },
        {
          "formId": this.state.formMap['supplierType'],
          "conditions": []
        }
      ]
    }
    this.setState({
      kaiwuApiUrl: `/kaiwuApi/${this.state.currentUser.customerId}/queryMoreTableData`
    }, async () => {
      let result = await this.dataSourceMap['kaiwuApi'].load(param);
      this.setState({
        productTypeList: [{ 'value': '全部', 'label': '全部' }].concat(this.dealGoodsTypeList(result.data[this.state.formMap['goodsTypeTable']], '--')),
        supplierTypeList: result.data[this.state.formMap['supplierType']].map(e => { return { 'value': e.supplierTypeName, 'label': e.supplierTypeName } }),
      })

    })
  }
  // 处理商品分类
  dealGoodsTypeList(data, parentId) {
    return data
      .filter(item => item.parentGoodsTypeId === parentId)
      .map(item => ({ label: item.typeName, value: item.goodsTypeId, children: this.dealGoodsTypeList(data, item.goodsTypeId) }))
  }

  querySubPackage(item){
    const { formMap } = this.state
    //查询子包
    let queryConditions2 = {
      "conditionFilter": {
        "conditionType": "AND", "conditions": [{ "conditionValues": [item.code], "conditionOperator": "eq", "field": "parent_code" }]
      },
      "page": { "current": 1, "pages": 0, "size": 9999, "total": 1 },
      "sorts": [],
      "formId": formMap['inquiry_packages']
    }
    return this.dataSourceMap['queryFormData'].load(queryConditions2).then(res=>{
      if (res.code==200){
        item.children =res.result.records
      }
    })
  }
  //查询标包以及子包
  queryFormData() {
    const { queryConditions, formMap } = this.state
    queryConditions.formId = formMap['inquiry_packages']
    //查询主包
    queryConditions.conditionFilter.conditions = []
    queryConditions.conditionFilter.conditions.push(
      { "conditionValues": [], "conditionOperator": "isNull", "field": "parent_code" }
    )
   this.dataSourceMap['queryFormData'].load(queryConditions).then(res => {
      if (res.code == 200) {
        queryConditions.page.total = res.result.total
        //let packagesMap = new Map()
        // let reqList= res.result?.records?.map(item => {
        //   return this.querySubPackage(item)
        // })
        // Promise.all(reqList).then(e=>{
          this.setState({
            list: res.result?.records || [],
            total: res.result.total
          })
       // })
      }
    })
  }

  renderTable() {
    const { Table, Button, Dropdown, Menu, Box, MenuButton, Item } = window.Next
    const { useState } = React
   // const { default: SortableTable } = window.SortableTable
    /**
      // {
      //   !record['parent_code'] &&
      //   <Button type="primary" style={{ 'margin-right': '8px' }}
      //     onClick={() => this.onClickAdd('add',record)}
      //     text={true}>添加子包</Button>}
      */
    const operRender = (value, index, record) => {
      return (<div className={'opr-button'}>
    
        <Button type="primary" style={{ 'margin-right': '8px' }}
          onClick={() => this.onClickAdd('edit',record)}
          text={true}>编辑</Button>
        <Button type="primary" style={{ 'margin-right': '8px' }}
          onClick={() => this.onClickDelete(record)}
          text={true}>删除</Button>
      </div>)
    }
    const toggleExpand = function (record) {
      const key = record.id,
        { openRowKeys } = this.state,
        index = openRowKeys.indexOf(key);
      if (index > -1) {
        openRowKeys.splice(index, 1);
      } else {
        openRowKeys.push(key);
      }
      this.setState({
        openRowKeys: openRowKeys
      });
    }
    const renderSupplyCount = (value, index, record) => {
      return record['supplier_info']?.filter(e => e.supplier_code)?.length || 0
    }
    const renderProductCount = (value, index, record) => {
      return record['product_info']?.filter(e => e.product_code)?.length || 0
    }
    const expandedRowRender = (value, index, record) => {
      const children = value.children || [];
      return <ExpandedApp dataSource={children} index={index} />;
    }
  //  const { default: SortableTable } = window.SortableTable
    return (<div>
      <Table.StickyLock
        dataSource={this.state.list}
        primaryKey={'_id'}
        hasBorder={false} isTree
      >
        <Table.Column cell={(value, index, record) => { return !record?.parent_code && index+1 }} dataIndex="id" width={60} />
        <Table.Column title="标包名称" dataIndex="name" width={100} />
        <Table.Column title="标包类型" dataIndex="packageType" width={100} />
        <Table.Column title="商品数量" cell={renderProductCount} dataIndex="productCount" width={100} />
        <Table.Column title="有效性" dataIndex="status" width={100} />
        <Table.Column cell={operRender} title="操作" lock="right" width={140} />
      </Table.StickyLock>
    </div>)
  }

  /**
   * 商品计划是否使用标包
   */
  async hasUsed(code) {
    let param =   { "conditionFilter": { "conditionType": "and", "conditions": [{ "conditionValues": ["已关闭"], "conditionOperator": "ne", "field": "status" },
      { "conditionValues": [code], "conditionOperator": "eq", "field": "packages_code" }] }, "page": { "current": 1, "pages": 0, "size": 10, "total": 147 }, "sorts": [], "formId": this.state.formMap['product_plan'] }

    let resp = await this.dataSourceMap.queryFormData.load(param)
    if (resp.code == 200 && resp.result.records){
       return true
    }
    return false
  }

  /**
   * 删除
   */
  async onClickDelete(rowRecord) {
    if (rowRecord['status'] == '启用') {
      window.Next.Message.error("标包处于使用中，不允许删除")
      return
    }
    const {queryConditions} = this.state

    let param = {
      "searchList": [
        {
          "formId": this.state.formMap['product_plan'],
          "conditions": [
            {
              "packages_code": rowRecord.code
            }
          ]
        }
      ]
    }
    
      let result = await this.dataSourceMap['queryMoreTableData'].load(param);
    if (result?.data && result.data[this.state.formMap['product_plan']]?.length) {
        window.Next.Message.error("标包处于使用中，不允许删除")
        return
      }
      window.Next.Dialog.confirm({
        title: '警告',
        content: '确定删除?',
        onOk: () => {
          this.dataSourceMap.deleteFormData
            .load({
              formId: this.state.formMap['inquiry_packages'],
              data: {
                _id: [rowRecord._id]
              }
            }).then(res => {
              if (res.code == 200) {
                this.onPageChange(1)
                window.Next.Message.success('删除成功')

                this.dataSourceMap.deletePackage.load({})
              }
            })
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
  /**
   * 点击编辑
   */
  onClickEdit(rowRecord) {
    KaiwuLowcodeDriver.exec('OPEN_FORM', {
      formId: this.state.formMap['inquiry_packages'],
      size: "65%",
      isEdit: true,
      dataId: rowRecord._id
    }).then(res => {
      if (res.type !== 'cancel') {
        this.queryFormData()
      }
    })
  }

  transferToTable(dataSource) {
    const newTableDataSource = dataSource.map((v,index) => 
      {
      return {
      label: v.label,
      id: v.value,
      isListing:v.isListing
    }} );
    return newTableDataSource;
  }

  onClickAddBtn(){
    this.onClickAdd('add', null)
  }


  handleTransfer(){
    Promise.all([this.queryProductList()])
  }
  /**
   * 添加子包
   */
  async onClickAdd(type,rowRecord) {
    const {formValue, supplier, supplierList, product, productList } = this.state
    let isEditFlag = false
    if(type == 'add'){
      this.setState({
        formValue: {
          name: '',
          packageType:'',
          status: '启用',
          remarks: '',
          parent_code: rowRecord?.code ,
          supplier_info:[],
          product_info:[]
        }
      }, this.handleTransfer)
    }else{
      this.setState({
        formValue: { ...rowRecord }
      },this.handleTransfer)
      isEditFlag= true
    }
    this.setState({
      isEditFlag,
      showDrawer: true
    })
  }

  getProductPageData(dataSource, page) {
    // 计算起始和结束索引
    var startIndex = (page - 1) * 20;
    var endIndex = startIndex + 20;
    return dataSource.slice(startIndex, endIndex);
  }
  onProductChangePage(currentPage, type) {
    const { product } = this.state
    if (type === 'left') {
      product.leftPage = currentPage || product.leftPage
      product.leftList = this.getProductPageData(product.leftTableDataSource, product.leftPage)
    } else {
      product.rightPage = currentPage || product.rightPage
      product.rightList = this.getProductPageData(product.rightTableDataSource, product.rightPage)
    }
    this.setState({
      product
    })
  }
   
 
     

  /**
   * 商品穿梭框
   */
  renderProductTransfer() {
    const { Transfer, Table, Pagination } = window.Next
    const { product, productList } = this.state;
    const { default: SortableTable } = window.SortableTable
    const handleChange = (value, data, extra) => {  
      let list = product.value
      if (extra.direction == 'right') {
        list = list.concat(extra.movedValue)
        product.leftTableDataSource = this.transferToTable(extra.leftData)
      } else {
        list = list?.filter(e => !extra.movedValue.includes(e))
        let leftTableDataSource = productList?.filter(e => !list.includes(e.goodsId))?.map(v => ({
          label: v.goodsName,
          id: v.goodsId,
            isListing:v.isListing
        })) || [];
        product.leftTableDataSource = leftTableDataSource
      }
      let rightList = productList?.filter(e => list.includes(e.goodsId))?.map(v => ({
        label: v.goodsName,
        id: v.goodsId,
        isListing:v.isListing
      })) || []
      let sorted = rightList?.sort((a, b) => list.indexOf(a.id) - list.indexOf(b.id)) || [] ;
      console.log("handleChange", rightList);
      product.value = list
      product.rightList = sorted
      product.rightTableDataSource = rightList
      product.rselectedRowKeys = []
      product.lselectedRowKeys = []
      this.setState({
        product,
        dataSource:rightList
      },()=>{
        this.onProductChangePage(null, 'left')
      });
    }
    return <Transfer
      dataSource={product.transferDataSource}
      showCheckAll={false}
      defaultValue={this.state.productValue}
      sortable
      primaryKey="id"
      onChange={handleChange}
      className="table-transfer-demo"
    >
      {({ position, onChange, value, dataSource }) => {
        // console.log(position, onChange, value, dataSource);
        if (position === "left") {
          return (
            <div className='select-list'>
              <Table
                dataSource={product.leftList}
                
                rowSelection={{
                  onChange: (selectedRowKeys, records) => {
                    console.log(selectedRowKeys, records);
                    let ids = records.map(e=>e['id'])
                    product.lselectedRowKeys = ids
                    this.setState(
                      {
                        product
                      },
                      () => {
                        onChange(position, ids);
                      }
                    );
                  },
                  selectedRowKeys: product.lselectedRowKeys
                }}
              >
                <Table.Column title="入库商品" dataIndex="label" width={150} />
                <Table.Column title="单位" dataIndex="label" cell={(value,index,record)=>{
                  return this.state.unitMap[record['id']]}} width={150} />
                <Table.Column title="状态" dataIndex="isListing" width={150} />
              </Table>
              <Pagination onChange={(e) =>this.onProductChangePage(e, 'left')}
              totalRender={total => `${total}项`}
               total={product.leftTableDataSource?.length} pageSize={20} shape="no-border" type="simple" className="page-demo" />
            </div>
          );
        } else {
          return (<div className='select-list'>
            <SortableTable
              dataSource={product.rightList}
              onSort={list=>{
                product.rightList = list
                this.setState({
                  product
                })
              }}
              primaryKey="id"
              rowSelection={{
                onChange: (selectedRowKeys, records) => {
                  product.rselectedRowKeys = selectedRowKeys
                  this.setState(
                    {
                      product
                    },
                    () => {
                      onChange(position, selectedRowKeys);
                    }
                  );
                },
                selectedRowKeys: product.rselectedRowKeys
              }}
            >
              <Table.Column title="序号" itle="序号" cell={(value, index, record) => index+1} width={50} />
              <Table.Column title="标包商品" dataIndex="label" width={150} />
              <Table.Column title="单位" dataIndex="label" cell={(value, index, record) => { 
                return this.state.unitMap[record['id']] }} width={150} />
            </SortableTable>
            </div>
          );
        }
      }}
    </Transfer>
  }



  onClose() {
    this.setState({
      product: {//穿梭框商品数据
        value: [],
        leftTotal: 0,
        rightTotal: 0,
        leftPage: 1,
        rightPage: 1,
        rightList: [],
        leftList: [],
        selectedValue: [],
        leftTableDataSource: [],
        rightTableDataSource: [],
        rselectedRowKeys: [],
        lselectedRowKeys: []
      },
      showDrawer: false
    })
  }

  

  onChangeFormValue(e) {
    if(e.remarks){
      e['name'] = `${e.packageType}(${e.remarks})`
    }else{
      e['name'] = e.packageType
    }
     
    this.setState({
      formValue:e
    })
  }
  batchHandel(formValue){
    const {formMap} = this.state
    let param = {
      formId: formMap['packages_product'],
      data:{
        packages_code: formValue.code
      }
    }
    this.dataSourceMap['removeFormData'].load(param).then(e=>{
      if(e.code == 200){
        let productLists = formValue.product_info.map((item,index) => {
          return {
            ...item,
            "sortId":index,
            packages_code: formValue.code
          }
        })
        this.dataSourceMap['batchAdd'].load({
          datas: productLists,
          formId: formMap['packages_product']
        })
      }
    })

    let param2 = {
      formId: formMap['packages_supplier'],
      data: {
        packages_code: formValue.code
      }
    }
    this.dataSourceMap['removeFormData'].load(param2).then(e=>{
      if(e.code == 200){
        let supplierList = formValue.supplier_info.map((item, index) => {
          return {
            ...item,
            "sortId": index,
            packages_code: formValue.code
          }
        })
        this.dataSourceMap['batchAdd'].load({
          datas: supplierList,
          formId: formMap['packages_supplier']
        })
      }
    })
    
  }
  async onConfirmSubmit() {
    const { formMap} = this.state
    const {Message} = window.Next
    const { isEditFlag, dataSource, product, supplier, formValue, queryConditions } = this.state
    
    if(!formValue.packageType){
      Message.error("选择标包类型")  
      return 
    }

    // if(formValue.code){
    //   let hasUsed =  await this.hasUsed(formValue.code)
    //   if(hasUsed){
    //     Message.error("标包正在使用中，不允许编辑")
    //     return
    //   }
    // }
    
    if (!product?.rightList?.length) {
      Message.error("商品未选择")
      return
    }

    let supplierListResp = await this.onChangeSupplierType(formValue.packageType);
    formValue.supplier_info = supplierListResp.result.records?.map((e,index) => {
      return {
        "sortId":index,
        'supplier_code': e.supplierId,
        "supplier_name": e.supplierName
      }
    })
    if (!formValue.supplier_info?.length) {
      Message.error("供应商未选择")
      return
    }
    formValue.product_info = product.rightList?.map((e, index) => {
      return {
        "sortId": index,
        'product_code': e.id,
        "product_name": e.label
      }
    })

    if (isEditFlag){
      this.dataSourceMap['updateFormData'].load({
        data: formValue,
        id: formValue._id,
        formId: this.state.formMap['inquiry_packages']
      }).then(e => {
        if (e.code == 200) {
          this.batchHandel(formValue)
          this.setState({
            showDrawer: false,
            product: {//穿梭框商品数据
              value: [],
              leftTotal: 0,
              rightTotal: 0,
              leftPage: 1,
              rightPage: 1,
              rightList: [],
              leftList: [],
              selectedValue: [],
              leftTableDataSource: [],
              rightTableDataSource: [],
              rselectedRowKeys: [],
              lselectedRowKeys: []
            }
          }, this.queryFormData)
        } else {
          window.Next.Message.error(e.message || '提交有误')
        }
      })
    }else{
      delete formValue._id
      this.dataSourceMap['addFormData'].load({
        data: formValue,
        formId: this.state.formMap['inquiry_packages']
      }).then(e => {
        if (e.code == 200) {
          queryConditions.page.current = 1
          this.batchHandel(e.result)
          this.setState({
            showDrawer: false,
            product: {//穿梭框商品数据
              value: [],
              leftTotal: 0,
              rightTotal: 0,
              leftPage: 1,
              rightPage: 1,
              rightList: [],
              leftList: [],
              selectedValue: [],
              leftTableDataSource: [],
              rightTableDataSource: [],
              rselectedRowKeys: [],
              lselectedRowKeys: []
            },
            queryConditions
          }, this.queryFormData)
        } else {
          window.Next.Message.error(e.message || '提交有误')
        }
      })
    }
     
  }

  /**
   * 修改标包类型
   */
  onChangeSupplierType(value){
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
    return this.dataSourceMap['queryFormData'].load(param) 
  }

	onSearchProduct(obj){
    let formId = this.state.formMap['goods']
    const { searchProduct, product, formValue } = this.state
     let param = {
      "conditionFilter": {
        "conditionType": "AND", "conditions": []
      },
      "page": { "current": 1, "pages": 0, "size": 20000, "total": 1 },
      "sorts": [],
      "formId": formId
    }
    if (obj.productType && obj.productType != '全部') {
      param.conditionFilter.conditions.push({ "conditionValues": [obj.productType], "conditionOperator": "eqa", "field": "goodsTypeId" })
    }
     
    if (obj.productName ) {
      param.conditionFilter.conditions.push({ "conditionValues": [obj.productName], "conditionOperator": "like", "field": "goodsName" })
    }
    this.dataSourceMap['queryFormData'].load(param).then(res => {
      if (res.code == 200) {
        //商品列表转化为 穿梭框数据源
        product.transferDataSource = res.result?.records?.map(v => ({
          label: v.goodsName,
          value: v.goodsId,
          isListing:v.isListing
        })) || [];
      
        //穿梭框数据源转化为表格数据源
        let tableData = this.transferToTable(product.transferDataSource)
        let ids = product.rightTableDataSource?.map(e=>e.id) || []
        let list = tableData.filter(item => !ids.includes(item.id))
        product.leftTableDataSource = list
        product.leftList = this.getProductPageData(product.leftTableDataSource, product.leftPage)
        product.leftTotal = product.leftTableDataSource?.length || 0
        this.setState({
          product 
        })
      }
   })
	}

	onReset(e){
    this.setState({
      searchProduct: {
        productType: '',//商品类型
        productName: "" //商品名称
      }
    }, this.queryProductList)
	}

  //size改变
  onPageSizeChange(val) {
    this.state.queryConditions.page.size = val;
    this.state.queryConditions.page.current = 1;
    this.setState(
      {
        queryConditions: { ...this.state.queryConditions },
      },
      () => {
        this.queryFormData();
      }
    );
  }
  renderTotal(t){
     
     return <span style={{ padding: "0 10px" }}>{`总数: ${t}`}</span>
    
  }
 
}
