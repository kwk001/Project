class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    "isShowDialog": false,
    isShowPriceList: false,
    showPriceListData: [],
    activeTab: 0,
    formIdMap: {
      'supplier': '',
      'haiju_xiaoshoujia': '',
      // 'haiju_caigoujia': '',
      'goods_price': '',
      'haiju_shitiaojia': '',
      'goodsSpecs': '', //商品规格信息--根据商品规格id匹配获取规格/单位类型
      'inquiry_packages': '', //商品标包管理
      'goods': '', //商品档案基础表
      'haiju_salesRecord': '',  //商品销售价记录基础表
      'customerTypeManage': '', //客户类型管理-表
      'goods_supply': '', //商品供应表
      'goodsTypeTable': '', //商品分类基础表
    },
    supplierList: {},
    goodsSpecsList: {},
    goodsTypeTableList: [],
    productPackageList: [],
    productPackageListData: [],
    salesRecordMap: {},
    sourceData: [
      {
        sourceName: 'goods_price', name: '销售价', formId: "", columns: [
          { title: '商品名称', dataIndex: 'goodsName' },
          { title: '商品编号', dataIndex: 'goodsCode' },
          { title: '规格型号', dataIndex: 'measurementUnit' },
          { title: '计量单位', dataIndex: 'unitType' },
          { title: '利润率（%）', dataIndex: 'profitRate' },
          { title: '盈亏平衡点（%）', dataIndex: 'breakevenPoint' },
          { title: '销售渠道', dataIndex: 'salesChannel' },
          { title: '当前销售价', dataIndex: 'price' },
          //{ title: '当前采购价', dataIndex: 'purchasePrice' },
          { title: '最近一次定价时间', dataIndex: 'djTime' },
          // { title: '商品规格ID', dataIndex: 'goodsSpecsId' },{
          //   title: '销售价明细', children: [
          //     { title: '销售价类型', dataIndex: 'saleType' },
          //     { title: '销售价', dataIndex: 'salePrice' }
          //   ]
          // }
        ]
      },
      {
        sourceName: 'goods_price', name: '采购价', formId: "", columns: [
          { title: '商品名称', dataIndex: 'goodsName' },
          { title: '商品编号', dataIndex: 'goodsCode' },
          { title: '商品分类', dataIndex: 'goodsClassify' },
          { title: '规格型号', dataIndex: 'measurementUnit' },
          { title: '计量单位', dataIndex: 'unitType' },
          { title: '最近一次供应商', dataIndex: 'supplier' },
          { title: '当前采购价', dataIndex: 'purchasePrice' },
          { title: '最近一次定价时间', dataIndex: 'djTime' },

          // { title: '利润率（%）', dataIndex: 'profitRate' },
          // { title: '商品规格ID', dataIndex: 'goodsSpecsId' },
          // { title: '盈亏平衡点（%）', dataIndex: 'breakevenPoint' },
          // { title: '销售渠道', dataIndex: 'salesChannel' },
          // { title: '当前销售价', dataIndex: 'price' },
          // { title: '销售价明细', children: [
          //   { title: '销售价类型', dataIndex: 'saleType' },
          //   { title: '销售价', dataIndex: 'salePrice' }
          // ] }
        ]
      },
      {
        sourceName: 'haiju_shitiaojia', name: '市调价', formId: "", columns: [
          { title: '商品名称', dataIndex: 'goodsName' },
          { title: '商品编号', dataIndex: 'goodsCode' },
          { title: '单位', dataIndex: 'unitType' },
          { title: '南通市发改委指导价', dataIndex: 'nantongPrice' },          
          { title: '南通通农物流中心价格', dataIndex: 'dongzhouPrice' },
          { title: '如东农贸中心市场价格', dataIndex: 'dongzhouCenterPrice' },
          { title: '天一市场价格', dataIndex: 'tongyuanPrice' },
          { title: '大润发价格', dataIndex: 'oshangPrice' },
          { title: '好润多超市价格', dataIndex: 'haodunrunPrice' },
          { title: '广隆超市价格', dataIndex: 'yonghuiPrice' },
          { title: '京东价格', dataIndex: 'jingdongPrice' },
          { title: '淘宝价格', dataIndex: 'taobaoPrice' },
          { title: '其它平台线上销售价格', dataIndex: 'otherPlatformsPrice' },
          { title: '统计时间', dataIndex: 'createTime' },
        ]
      }
    ],
    searchData: [],
    tableDataSource: [],
    queryConditions: {
      conditionFilter: {
        conditionType: "and", conditions: []
      },
      page: { current: 1, pages: 0, size: 10, total: 1 },
      sorts: [],
      formId: ""
    },
    tableRowSelection: {
      onChange: (selectedRowKeys, records) => {
        console.log(selectedRowKeys, records, '==onChange')
        this.setTableRowSelectionLsit(selectedRowKeys, records);
      },
      onSelect: (selected, record, records) => {
        console.log(selected, record, records, '==onSelect')
      },
      onSelectAll: (selected, records) => {
        console.log(selected, records, '==onSelectAll')
      },
      selectedRowKeys: []
    },
    tableRowSelectionLsit: [],
    tableSetProfitAndLossData: [],
    tableSetProfitAndLossDataCurrent: {},
    isProfitAndLoss: false,
    showAddArketPrice: false,
    goodsIdList: [],
    addArketPriceFrom: {
      goodsCode: '',
      goodsName: '',
      nantongPrice: 0,
      dongzhouPrice: 0,
      tongyuanPrice: 0,
      oshangPrice: 0,
      yonghuiPrice: 0,
      oshangPurchasingPrice: 0,
      otherPrice: 0,
      dongzhouCenterPrice: 0,
      haodunrunPrice: 0,
      jingdongPrice: 0,
      taobaoPrice: 0,
    },
    arketPriceFromEdit: false,
    formProductName: 'productName',
    recordDialog: false,
    goodsIdListKeys: {},
    showTableSetprice: false,
    tableRecordHistory: false,
    salesRecordList: [],
    goods_supplyList: [],
    customerTypeManageList: [],
    fileInputValue: '',
    LoadingVisible: false,
    goodsClassifys: [],
    previewImages: {},
    paginationChangePage: { current: 1, total: 0, activeTable: 1, id: '' },
  }
  componentDidMount() {
    console.log('did mount');
    this.init()
  }
  componentWillUnmount() {
    console.log('will unmount');
  }
  //获取初始化数据
  async init() {
    let formIdMapKeys = Object.keys(this.state.formIdMap);
    let codes = {
      codes: [...formIdMapKeys]
    }
    const res = await this.dataSourceMap['getIdByCode'].load(codes);
    if (res.result && res.result != null) {
      let sourceData = this.state.sourceData.map(m => {
        if (res.result[m.sourceName]) {
          m.formId = res.result[m.sourceName]
        }
        return m;
      });

      let queryData = {
        conditionFilter: {
          conditionType: "and", conditions: []
        },
        page: { current: 1, pages: 0, size: 99999, total: 1 },
        sorts: [],
        formId: res.result['goodsSpecs']
      }
      const goodsSpecs = await this.dataSourceMap['queryFormData'].load(queryData);
      let goodsSpecsList = {};
      if (goodsSpecs.success && goodsSpecs.result.records != null) {
        goodsSpecs.result.records.map(m => {
          goodsSpecsList[m.goodsTypeId] = m;
        })
      }

      //获取商品档案基础表数据 formIdMap goods
      let queryData1 = {
        conditionFilter: {
          conditionType: "and", conditions: []
        },
        page: { current: 1, pages: 0, size: 99999, total: 1 },
        sorts: [],
        formId: res.result['goods']
      }
      let goodsIdListKeys = {}
      const goodsDatas = await this.dataSourceMap['queryFormData'].load(queryData1)
      // console.log(goodsDatas, '=======goodsDatas')
      if (goodsDatas.success && goodsDatas.result.records != null) {
        goodsDatas.result.records.map(m => {
          m.label = m.goodsName;
          m.value = m.goodsName;
          goodsIdListKeys[m.goodsId] = m;
        })
        let lists = JSON.parse(JSON.stringify(goodsDatas.result.records));
        let goodsClassifys = lists.map(m => {
          m.label = m.goodsClassify;
          m.value = m.goodsId;
          return m
        })
        // console.log(goodsDatas.result.records, goodsClassifys, '==goodsIdList')
        this.setState({
          goodsIdList: goodsDatas.result.records,
          goodsClassifys
        })
      }

      this.setState({
        formIdMap: res.result,
        sourceData: sourceData,
        goodsSpecsList: goodsSpecsList,
        goodsIdListKeys: goodsIdListKeys
      }, () => {
        this.getSupplierList();
        this.getTableDataSource();
        this.getProductPackage();
        this.getCustomerTypeManage();
        this.getDoodsTypeTable();
      })
    }
  }

  getSupplierList() {
    const { formIdMap } = this.state;
    let queryData = {
      conditionFilter: {
        conditionType: "and", conditions: []
      },
      page: { current: 1, pages: 0, size: 99999, total: 1 },
      sorts: [],
      formId: formIdMap['supplier']
    }

    this.dataSourceMap['queryFormData'].load(queryData).then(res => {
      if (res.success && res.result.records != null) {
        let supplierIds = {};
        res.result.records.map(m =>{
          supplierIds[m.supplierId] = m
        })
        this.setState({
          supplierList: supplierIds
        })
      }
    })
  }

  //获取商品标包数据 productPackageList inquiry_packages
  getProductPackage() {
    const { formIdMap } = this.state;
    let queryData = {
      conditionFilter: {
        conditionType: "and", conditions: []
      },
      page: { current: 1, pages: 0, size: 99999, total: 1 },
      sorts: [],
      formId: formIdMap['inquiry_packages']
    }
    this.dataSourceMap['queryFormData'].load(queryData).then(res => {
      if (res.success && res.result.records != null) {
        const productPackageList = this.dealInquiryPackages(res.result.records, undefined)
        this.setState({
          productPackageList,
          productPackageListData: res.result.records
        })
      }
    })
  }
  //获取商品分类基础表数据
  getDoodsTypeTable() {
    const { formIdMap } = this.state;
    let queryData = {
      conditionFilter: {
        conditionType: "and", conditions: []
      },
      page: { current: 1, pages: 0, size: 99999, total: 1 },
      sorts: [],
      formId: formIdMap['goodsTypeTable']
    }
    this.dataSourceMap['queryFormData'].load(queryData).then(res => {
      if (res.success && res.result.records != null) {
        const goodsTypeList = this.dealGoodsTypeList(res.result.records, '--');
        // console.log(goodsTypeList, '==getDoodsTypeTable')
        this.setState({
          goodsTypeTableList: goodsTypeList
        })
      }
    })
  }
  // 处理标包层级关系
  dealInquiryPackages(data, parentId) {
    return data
      .filter(item => item.parent_code === parentId)
      .map(item => ({ label: item.name, value: item.code, children: this.dealInquiryPackages(data, item.code) }))
  }
  // 处理商品分类
  dealGoodsTypeList(data, parentId) {
    return data
      .filter(item => item.parentGoodsTypeId === parentId)
      .map(item => ({ label: item.typeName, value: item.goodsTypeId, children: this.dealGoodsTypeList(data, item.goodsTypeId) }))
  }

  //获取客户类型 customerTypeManage
  getCustomerTypeManage() {
    const { formIdMap } = this.state;
    let queryData = {
      conditionFilter: {
        conditionType: "and", conditions: []
      },
      page: { current: 1, pages: 0, size: 99999, total: 1 },
      sorts: [],
      formId: formIdMap['customerTypeManage']
    }
    this.dataSourceMap['queryFormData'].load(queryData).then(res => {
      if (res.success && res.result.records != null) {
        // console.log(res, '==getCustomerTypeManage')
        this.setState({
          customerTypeManageList: res.result.records
        })
      }
    })
  }

  //获取表格数据
  async getTableDataSource(data) {
    const { sourceData, activeTab, queryConditions, tableRowSelection, goodsSpecsList, goodsIdListKeys } = this.state;
    let isData = data ? data : []
    queryConditions.conditionFilter.conditions = [...isData];
    queryConditions.formId = sourceData[activeTab].formId;

    this.dataSourceMap['queryFormData'].load(queryConditions).then(async (res) => {

      if (res.success && res.result.records != null) {
        queryConditions.page.total = res.result.total;
        let salesRecordMap = await this.salesRecord(res.result.records);
        let listf = res.result.records.map(async (m) => {
          let isGoodType = goodsSpecsList[m.goodsSpecsId];
          let isGoodsIdListKeys = goodsIdListKeys[m.goodsCode];
          if (isGoodType) {
            m.measurementUnit = isGoodType.measurementUnit;
            m.unitType = isGoodType.unitType;
          }
          if (isGoodsIdListKeys && activeTab != 2) {
            m.goodsName = isGoodsIdListKeys.goodsName;
            m.goodsClassify = isGoodsIdListKeys.goodsClassify;
            m.supplier = isGoodsIdListKeys.supplier;
            m.previewImage = (isGoodsIdListKeys.previewImage && isGoodsIdListKeys.previewImage.length) ? isGoodsIdListKeys.previewImage[0] : '';
          } else {
            m.goodsClassify = isGoodsIdListKeys?.goodsClassify;
          }
          if (m.goodsCode && activeTab != 2) {
            m.djTime = salesRecordMap[m.goodsCode].createTime;
          }

          if (activeTab == 2) {
            // console.log(goodsSpecsList, m,'xxx')
            for (let key in goodsSpecsList) {
              if (goodsSpecsList[key].goodsId && goodsSpecsList[key].goodsId == m.goodsCode) {
                m.unitType = goodsSpecsList[key].measurementUnit;
              }
            }
          }
          return m;
        })
        
        let listfALL = await Promise.all(listf);
        this.setState({
          tableDataSource: listfALL,
          queryConditions
        })
      } else {
        queryConditions.page.total = 0;
        this.setState({
          tableDataSource: [],
          queryConditions
        })
      }
    })
  }

  //获取定价记录
  async salesRecord(list) {
    let ids = {};
    list.map(m => {
      ids[m.goodsCode] = { createTime: '' };
    })
    let queryData = {
      conditionFilter: {
        conditionType: "and", conditions: [
          { conditionOperator: 'eqa', field: 'goodsId', conditionValues: Object.keys(ids) }
        ]
      },
      page: { current: 1, size: 99999 },
      sorts: [{ key: "createTime", type: "ASC" }],
      formId: this.state.formIdMap['haiju_salesRecord']
    }
    const res = await this.dataSourceMap["queryFormData"].load(queryData);
    let resData = res.result.records && res.result.records != null ? res.result.records : [];
    let listMap = { ...this.state.salesRecordMap };
    resData.map(m => {
      if (!listMap[m.goodsId]) {
        listMap[m.goodsId] = m;
      }
    });
    this.state.salesRecordMap = Object.assign(ids, listMap)
    return this.state.salesRecordMap;
  }

  //tab切换
  onTabChange(val) {
    let queryConditions = JSON.parse(JSON.stringify(this.state.queryConditions));
    queryConditions.page.current = 1;
    this.state.formProductName = val == 2 ? 'goodsName' : 'productName';
    this.setState({
      queryConditions: queryConditions,
      searchData: [],
      activeTab: val,
      formProductName: this.state.formProductName
    }, () => {
      this.getTableDataSource()
    })
  }

  //表格数据勾选
  setTableRowSelectionLsit(ids, records) {
    const { tableRowSelection } = this.state;
    tableRowSelection.selectedRowKeys = ids;
    this.setState({
      tableRowSelectionLsit: [...records],
      tableRowSelection
    })
  }
  //分页改变
  onPageChange(val) {
    // console.log(val, 'onPageChange')
    this.state.queryConditions.page.current = val;
    this.setState({
      queryConditions: this.state.queryConditions
    }, () => {
      this.getTableDataSource(this.state.searchData)
    })
  }

  renderTop(activeTab) {
    const { Button } = window.Next;
    const { fileInputValue } = this.state;
    return (<div class="table-top-button">
      {activeTab == 0 && <Button type="secondary" onClick={() => { this.setProfitAndLoss() }}>批量配置盈亏</Button>}
      {activeTab == 0 && <Button type="secondary" onClick={() => { this.exportSalesPrice() }}>导出销售价</Button>}
      {activeTab == 1 && <Button type="secondary" onClick={() => { this.exportSalesPrice() }}>导出采购价</Button>}
      {activeTab == 2 && <Button type="secondary" onClick={() => { this.addArketPrice() }}>添加</Button>}
      {activeTab == 2 && <Button type="secondary">
        <input id="fileInput" type="file" value={fileInputValue} accept=".xlsx" onChange={(e) => { this.xlsxUpLoad(e) }} />
        导入市调价
      </Button>}
      {activeTab == 2 && <Button type="secondary" onClick={() => { this.exportSalesPrice() }}>导出市调价</Button>}
    </div>)
  }
  renderTable() {
    const { Table, Button, Dialog, Form, Input, Select, NumberPicker, Grid, Tab, Loading, Pagination } = window.Next;
    const FormItem = Form.Item;
    const { Row, Col } = Grid;
    const { sourceData, activeTab, addArketPriceFrom, goodsIdList, tableSetProfitAndLossDataCurrent,
      recordDialog, tableRecordHistory, salesRecordList, customerTypeManageList, LoadingVisible,
      previewImages, goods_supplyList, paginationChangePage, showPriceListData } = this.state;

    const render = (value, index, record) => {
      return (<div class="table-button">
        {activeTab == 0 && <div class="table-button">
          <Button type="primary" text onClick={() => { this.tableRecord(record, false, 1) }}>记录</Button>
          <Button type="primary" text onClick={() => { this.tableSetProfitAndLoss(record) }}>设置盈亏</Button>
          {(!record.price || record.price === '') && <Button type="primary" text onClick={() => { this.tableSetprice(record) }}>初始售价</Button>}
        </div>
        }
        {activeTab == 1 && <div class="table-button">
          <Button type="primary" text onClick={() => { this.tableRecord(record, true, 2) }}>历史记录</Button>
        </div>
        }
        {activeTab == 2 && <div class="table-button">
          <Button type="primary" text onClick={() => { this.tableEditRecord(record) }}>编辑</Button>
          <Button type="primary" text onClick={() => { this.tableDeleteRecord(record) }}>删除</Button>
        </div>
        }
      </div>)
    };


    // let cell = [{ title: '操作', cell: render, width: 180 }]; showPriceList salesChannel
    let columnList = [...sourceData[activeTab].columns];
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 16
      }
    };
    return (<div>
      {this.renderTop(activeTab)}
      <Loading visible={LoadingVisible} fullScreen ></Loading>
      <Table
        dataSource={this.state.tableDataSource}
        rowSelection={this.state.tableRowSelection}
        primaryKey={'_id'}>
        {columnList.map(m => 
          {
            if (activeTab == 0 && m.title === "当前销售价") {
              return <Table.Column title={m.title} 
                cell={(value, index, record) => {
                  if (record['salesChannel'] === 'B端') {
                    return <Button type="primary" onClick={() => this.showPriceList(record)}
                      text={true}  >{record['price']}</Button>
                  } else {
                    return record['price'];
                  }
                }} />;
            } else {
            return <Table.Column title={m.title} dataIndex={m.dataIndex} />;
            }
          }
        )}
        <Table.Column title='操作' cell={render} width='180px' />
      </Table>
      <Dialog
        v2
        title={tableRecordHistory ? '商品采购价记录' : '商品销售价记录'}
        visible={this.state.recordDialog}
        footer={true}
        width="80%"
        onOk={() => this.onDialogClose()}
        onClose={() => this.onDialogClose()}
      >
        <div>
          <div class="recorddialog-title">{tableRecordHistory ? '商品最新采购价' : '商品最新销售价'}</div>
          <div class="recorddialog-box">
            <div class="recorddialog-info">
              <div class="recorddialog-info-item"><div class="label">商品名称</div><div class="value">{tableSetProfitAndLossDataCurrent.goodsName}</div></div>
              <div class="recorddialog-info-item"><div class="label">商品编号</div><div class="value">{tableSetProfitAndLossDataCurrent.goodsCode}</div></div>
              <div class="recorddialog-info-item"><div class="label">商品单位</div><div class="value">{tableSetProfitAndLossDataCurrent.measurementUnit}</div></div>
              <div class="recorddialog-info-item"><div class="label">{tableRecordHistory ? '最新采购价' : '最新销售价'}</div><div class="value">{tableRecordHistory ? tableSetProfitAndLossDataCurrent.purchasePrice : tableSetProfitAndLossDataCurrent.price}</div></div>
            </div>
            <img src={previewImages[tableSetProfitAndLossDataCurrent.previewImage]} />
          </div>
          {!tableRecordHistory && <div>
            <div class="recorddialog-title">历史记录</div>
            <Table
              dataSource={salesRecordList}
              primaryKey={'_id'}>
              <Table.Column title="定价时间" dataIndex="createTime" />
              <Table.Column title="售卖渠道" dataIndex="salesChannels" />
              <Table.Column title="销售价" dataIndex="salesPrice" 
                cell={(value, index, record) => {
                  if (record['salesChannels'] === 'B端') {
                    return <Button type="primary" onClick={() => this.showPriceList(tableSetProfitAndLossDataCurrent)}
                      text={true}  >{record['salesPrice']}</Button>
                  } else {
                    return record['salesPrice'];
                  }
                }}/>
              <Table.Column title="来源" dataIndex="source" />
            </Table>
          </div>}
          {tableRecordHistory && <div>
            <Tab onChange={(e) => { this.tabChangeClick(e) }}>
              <Tab.Item title="定价记录" key="2">
                <Table
                  dataSource={goods_supplyList}
                  primaryKey={'_id'}>
                  <Table.Column title="供货周期" dataIndex="_supplyCycle" />
                  <Table.Column title="供应商" dataIndex="supplierName" />
                  <Table.Column title="供应商报价" dataIndex="purchasePrice" />
                  <Table.Column title="税率" dataIndex="rate" />
                </Table>
              </Tab.Item>
              <Tab.Item title="采购记录" key="1">
                <Table
                  dataSource={salesRecordList}
                  primaryKey={'_id'}>
                  <Table.Column title="定价时间" dataIndex="createTime" />
                  <Table.Column title="售卖渠道" dataIndex="salesChannels" />
                  <Table.Column title="销售价" dataIndex="salesPrice" />
                  <Table.Column title="来源" dataIndex="source" />
                </Table>
              </Tab.Item>
            </Tab>
          </div>}
          <Pagination current={paginationChangePage.current} pageSize={5} total={paginationChangePage.total} onChange={async (page) => { await this.paginationChangeClick(page) }} showJump={false} />
        </div>
      </Dialog>
      <Dialog
        v2
        title="设置盈亏"
        visible={this.state.isShowDialog}
        footer={false}
        // onOk={() => this.onDialogClose()}
        onClose={() => this.onDialogClose()}
      >
        <Form {...formItemLayout}>
          {tableSetProfitAndLossDataCurrent['goodsCode'] && <Row gutter="4">
            <Col>
              <div class="form-cols-box">商品名称: {tableSetProfitAndLossDataCurrent.goodsName}</div>
            </Col>
            <Col>
              <div class="form-cols-box">商品编号: {tableSetProfitAndLossDataCurrent.goodsCode}</div>
            </Col>
          </Row>}
          {tableSetProfitAndLossDataCurrent['goodsCode'] && <Row gutter="4">
            <Col>
              <div class="form-cols-box">规格型号: {tableSetProfitAndLossDataCurrent.measurementUnit}</div>
            </Col>
            <Col>
              <div class="form-cols-box">计量单位: {tableSetProfitAndLossDataCurrent.unitType}</div>
            </Col>
          </Row>}

          <FormItem
            name="breakevenPoint"
            label="盈亏平衡点"
            required
            requiredMessage="请输入!"
          >
            <NumberPicker innerAfter="%" precision={2} style={{ width: "100%" }} />
          </FormItem>
          <FormItem
            name="profitRate"
            label="利润率"
            required
            requiredMessage="请输入!"
          >
            <NumberPicker innerAfter="%" precision={2} style={{ width: "100%" }} />
          </FormItem>
          <FormItem label=" " colon={false} style={{ textAlign: 'right' }}>
            <Form.Submit
              type="primary"
              validate
              onClick={(values, errors) => this.onDialogSubmit(values, errors)}
              style={{ marginRight: 8 }}
            >
              确定
            </Form.Submit>
            <Form.Reset onClick={() => this.onDialogClose()}>取消</Form.Reset>
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        v2
        title="设置初始售价"
        visible={this.state.showTableSetprice}
        footer={false}
        width="50%"
        // onOk={() => this.onDialogClose()}
        onClose={() => this.onDialogClose()}>
        <Form {...formItemLayout}>
          <Row gutter="10">
            <Col>
              <div class="form-cols-box">商品名称: {tableSetProfitAndLossDataCurrent.goodsName}</div>
            </Col>
            <Col>
              <div class="form-cols-box">商品编号: {tableSetProfitAndLossDataCurrent.goodsCode}</div>
            </Col>
          </Row>
          <Row gutter="10">
            <Col>
              <div class="form-cols-box">规格型号: {tableSetProfitAndLossDataCurrent.measurementUnit}</div>
            </Col>
            <Col>
              <div class="form-cols-box">计量单位: {tableSetProfitAndLossDataCurrent.unitType}</div>
            </Col>
          </Row>
          <Row gutter="16" wrap className="showsablesetprice-form">
            <Col span="24">
              <FormItem
                name="price"
                label="销售价："
                required
                requiredMessage="请输入!"
              >
                <Input precision={2} style={{ width: "200px" }} />
              </FormItem>
            </Col>
            {tableSetProfitAndLossDataCurrent.salesChannel && !tableSetProfitAndLossDataCurrent.salesChannel.includes("C端") &&
              customerTypeManageList.map(m => <Col span="24">
                <FormItem
                  name={m.customerTypeId}
                  label={m.customerTypeName + '：'}
                  required
                  requiredMessage="请输入!"
                >
                  <Input precision={2} style={{ width: "200px" }} />
                </FormItem>
              </Col>)
            }
          </Row>

          <FormItem label=" " colon={false} style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
            <Form.Reset onClick={() => this.onDialogClose()}>取消</Form.Reset>
            <Form.Submit
              type="primary"
              validate
              onClick={(values, errors) => this.setInitialSellingPrice(values, errors)}
              style={{ marginLeft: 8 }}
            >
              确定
            </Form.Submit>
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        v2
        title="市调价"
        visible={this.state.showAddArketPrice}
        footer={false}
        // onOk={() => this.onDialogClose()}
        onClose={() => this.onDialogClose()}
      >
        <Form colon>
          <FormItem
            name="goodsName"
            label="商品名称"
            required
            requiredMessage="请选择">
            <Select style={{ width: "100%" }} defaultValue={addArketPriceFrom.goodsName} onChange={(value, actionType, item) => this.goodsIdListChange(value, actionType, item)}>
              {goodsIdList.map(m => <Select.Option value={m.value} label={m.label}></Select.Option>)}
            </Select>
          </FormItem>
          <FormItem name="goodsCode" label="商品编号" disabled>
            <Input value={addArketPriceFrom.goodsCode} />
          </FormItem>
          <Row gutter="4">
            <Col>
              <FormItem name="nantongPrice" label="南通市发改委指导价">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.nantongPrice} />
              </FormItem>
            </Col>
            <Col>
              <FormItem name="dongzhouPrice" label="南通通农物流中心价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.dongzhouPrice} />
              </FormItem>
            </Col>
            <Col>
              <FormItem name="dongzhouCenterPrice" label="如东农贸中心市场价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.dongzhouCenterPrice} />
              </FormItem>
            </Col>
          </Row>
          <Row gutter="4">
            <Col>
              <FormItem name="tongyuanPrice" label="天一市场价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.tongyuanPrice} />
              </FormItem>
            </Col>
            <Col>
              <FormItem name="oshangPrice" label="大润发价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.oshangPrice} />
              </FormItem>
            </Col>
            <Col>
              <FormItem name="haodunrunPrice" label="好润多超市价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.haodunrunPrice} />
              </FormItem>
            </Col>
          </Row>
           <Row gutter="4">
            <Col>
              <FormItem name="yonghuiPrice" label="广隆超市价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.yonghuiPrice} />
              </FormItem>
            </Col>
            <Col>
              <FormItem name="jingdongPrice" label="京东价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.jingdongPrice} />
              </FormItem>
            </Col>
            <Col>
              <FormItem name="taobaoPrice" label="淘宝价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.taobaoPrice} />
              </FormItem>
            </Col>
          </Row>
          <Row gutter="4">
            <Col>
              <FormItem name="otherPlatformsPrice" label="其它平台线上销售价格">
                <Input style={{ width: "100%" }} defaultValue={addArketPriceFrom.otherPlatformsPrice} />
              </FormItem>
            </Col>
          </Row>

          <FormItem label=" " colon={false} style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
            <Form.Submit
              type="primary"
              validate
              onClick={(values, errors) => this.addArketPriceSubmit(values, errors)}
              style={{ marginRight: 8 }}
            >
              确定
            </Form.Submit>
            <Form.Reset onClick={() => this.onDialogClose()}>取消</Form.Reset>
          </FormItem>
        </Form>
      </Dialog>
      <Dialog
        v2
        title="客户类型价格"
        visible={this.state.isShowPriceList}
        footer={false}
        width='340px'
        onClose={() => this.onDialogClose('isShowPriceList')}
      >
        {showPriceListData.map(m =>
          <div style={{display: 'flex',lineHeight: '40px', marginBottom: '20px'}}>
            <div style={{ width: '100px', paddingRight: '12px', textAlign: 'right', fontSize: '16px' }}>{m.name}:</div>
            <div style={{ width: '80px', height: '40px', border: '1px solid #dcdee3', fontSize: '14px', textAlign: 'center'}}>{m.value}</div>
          </div>
        )}
      </Dialog>
    </div>)
  }
  //Dialog 显示端价格
  showPriceList(record) {
    // console.log(record.detailList, this.state.customerTypeManageList, 'xxx');
    
    let list = [];
    // saleType
    if (record.detailList != null) {
      record.detailList.map(m =>{
        this.state.customerTypeManageList.map(ms =>{
          if (m.saleType === ms.customerTypeId) {
            list.push({ value: m.salePrice, name: ms.customerTypeName});
          }
        })
      });
    } else {
      this.state.customerTypeManageList.map(ms => {
        list.push({ value: 0, name: ms.customerTypeName })
      })
    }
    this.setState({
      isShowPriceList: true,
      showPriceListData: list
    })
  }
  //Dialog
  onDialogClose(type) {
    if (type === 'isShowPriceList') {
      this.setState({
        isShowPriceList: false
      })
      return;
    }
    this.setState({
      isShowDialog: false,
      showAddArketPrice: false,
      arketPriceFromEdit: false,
      recordDialog: false,
      showTableSetprice: false,
      isShowPriceList: false,
      tableSetProfitAndLossDataCurrent: {},
      addArketPriceFrom: {
        goodsCode: "",
        goodsName: "",
        nantongPrice: "",
        dongzhouPrice: "",
        tongyuanPrice: "",
        oshangPrice: "",
        yonghuiPrice: "",
        oshangPurchasingPrice: "",
        otherPlatformsPrice: "",
        otherPrice: ""
      }
    })
  }
  //onDialogSubmit
  onDialogSubmit(values, errors) {
    if (errors === null) {
      const { sourceData, activeTab, tableSetProfitAndLossData, isProfitAndLoss, tableRowSelectionLsit, tableRowSelection } = this.state;
      let lists = [];
      if (isProfitAndLoss) {
        lists = [...tableSetProfitAndLossData]
      } else {
        lists = [...tableRowSelectionLsit]
      }
      let rs = lists.map(m => {
        m.breakevenPoint = values.breakevenPoint;
        m.profitRate = values.profitRate;
        let data = {
          data: m,
          formId: sourceData[activeTab].formId,
          id: m._id
        }
        return this.dataSourceMap["updateFormData"].load(data);
      })
      Promise.all(rs).then(res => {
        this.showMessage('success', '修改数据成功');
        this.onDialogClose();
        this.getTableDataSource(this.state.searchData);

        if (isProfitAndLoss) {
          this.setState({
            isProfitAndLoss: false
          })
        } else {
          tableRowSelection.selectedRowKeys = [];
          this.setState({
            isProfitAndLoss: false
          })
        }

      })
    }
  }
  //设置盈亏--单个/批量
  setProfitAndLoss() {
    if (this.state.tableRowSelection.selectedRowKeys.length > 0) {
      this.setState({
        isShowDialog: true
      })
    } else {
      this.showMessage('error', '请选择要配置的数据!');
    }

  }
  //批量导出表格数据
  exportSalesPrice() {
    const { tableDataSource, activeTab, sourceData } = this.state;
    const { downLoadXLSX } = Xlsx;
    const activeData = sourceData[activeTab].columns;
    const name = sourceData[activeTab].name;

    let titles = [];
    let keys = [];
    let cells = [];
    activeData.map(m => {
      titles.push(m.title);
      keys.push(m.dataIndex);
    })
    tableDataSource.map(m => {
      let cell = [];
      keys.map(mk => {
        if (m[mk]) {
          cell.push(m[mk]);
        } else {
          cell.push('');
        }
      })
      cells.push(cell);
    });
    console.log([titles, ...cells])
    downLoadXLSX([titles, ...cells], `${name}.xlsx`);
  }
  showMessage(type, title, content, duration = 1000) {
    window.Next.Message.show({
      type,
      title,
      content,
      hasMask: false,
      duration
    })
  }
  //添加市调价
  addArketPrice() {
    this.setState({
      showAddArketPrice: !this.state.showAddArketPrice
    })
  }

  //导入市调价
  async xlsxUpLoad(e) {
    this.setState({
      LoadingVisible: true
    })
    const { sourceData, activeTab, searchData } = this.state;
    const { fileTOJSON } = Xlsx;
    const res = await fileTOJSON(e);
    const tabColums = sourceData[activeTab].columns;

    //获取对应key
    let keys = {};
    tabColums.map(m => {
      for (key in m) {
        keys[m.title] = m['dataIndex'];
      }
    })

    //匹配导入数据key与对应值
    let datas = [];
    res.map(m => {
      let data = {}
      for (key in m) {
        if (keys[key]) {
          data[keys[key]] = m[key]
        } else {
          this.showMessage('error', `数据项${key}不存在`);
          this.setState({
            LoadingVisible: false
          })
          throw new Error('Stop');
        }
      }
      datas.push(data)
    })

    let rs = datas.map(m => {
      m.goodsCode = m.goodsCode.toString();
      return m;
    });
    this.dataSourceMap["addMoreFormData"].load({
      datas: rs,
      formId: sourceData[activeTab].formId,
    }).then(res =>{
      this.showMessage('success', '导入数据成功');
      this.getTableDataSource(searchData)
      this.setState({
        LoadingVisible: false
      })
    }).catch(err => {
      this.setState({
        LoadingVisible: false
      })
    })
  }

  //市调价-商品id改变
  goodsIdListChange(value, actionType, item) {
    const { addArketPriceFrom, goodsIdList } = this.state;
    let isItem = goodsIdList.find(f => f.value === item.value);
    console.log(isItem)
    addArketPriceFrom.goodsCode = isItem.goodsId;
    this.setState({
      addArketPriceFrom: addArketPriceFrom
    })
  }

  //添加市调价--提交
  addArketPriceSubmit(values, errors) {
    if (errors === null) {
      const { sourceData, activeTab, searchData, arketPriceFromEdit, addArketPriceFrom } = this.state;
      // console.log(values, '==addArketPriceSubmit')
      let valuesF = {...values};
      for (let key in values) {
        if (values[key] === null) {
          valuesF[key] = ''
        } else {
          valuesF[key] = valuesF[key]
        }
      }
      let data = {
        data: valuesF,
        formId: sourceData[activeTab].formId,
      }
      //编辑
      if (arketPriceFromEdit) {
        data.id = addArketPriceFrom.id
        this.dataSourceMap["updateFormData"].load(data).then(res => {
          if (res.code === 200) {
            this.onDialogClose()
            this.showMessage('success', '修改数据成功');
            this.getTableDataSource(searchData)
          }
        })
      } else {
        //添加
        this.dataSourceMap["addFormData"].load(data).then(res => {
          if (res.code === 200) {
            this.onDialogClose()
            this.showMessage('success', '添加数据成功');
            this.getTableDataSource(searchData)
          }
        })
      }
    }
  }
  //操作--记录/历史记录点击
  async tableRecord(record, history, type) {
    const { formIdMap, activeTab, previewImages, goodsIdListKeys, paginationChangePage, supplierList } = this.state;
    console.log(record);

    //获取商品图片 previewImages
    if (record.previewImage != '' && !previewImages[record.previewImage]) {
      const picParam = { names: [record.previewImage] };
      const picRes = await this.dataSourceMap['getFileUrlList'].load(picParam);
      if (picRes.code === 200) {
        previewImages[record.previewImage] = picRes.result[record.previewImage];
        this.setState({
          previewImages
        })
      }
    }
    //根据商品编号获取商品售价历史记录 salesRecordList: [], haiju_salesRecord
    let salesRecordList = [];
    //获取采购价定价记录--商品供应表
    let goods_supplyList = [];

    paginationChangePage.current = 1;
    paginationChangePage.activeTable = type;
    paginationChangePage.id = record.goodsCode;

    this.setState({
      paginationChangePage,
    }, async () => {
      let salesRecordData = await this.paginationChange(1, true);
      salesRecordList = salesRecordData.list.filter(f => f.salesChannels === record.salesChannel);
      if (history) {
        let goodsSupplyData = await this.paginationChange(1);
        goods_supplyList = goodsSupplyData.list.map(m =>{
          m.supplierName = supplierList[m.supplierCode]?.supplierName;
          return m;
        });
        paginationChangePage.total = goodsSupplyData.res.total || 0;
      } else {
        paginationChangePage.total = salesRecordData.res.total || 0;
      }

      this.setState({
        tableSetProfitAndLossDataCurrent: record,
        recordDialog: true,
        tableRecordHistory: history,
        salesRecordList,
        goods_supplyList,
        paginationChangePage
      })
    })
  }
  //选项卡切换重置分页
  tabChangeClick(e) {
    const { paginationChangePage } = this.state;
    paginationChangePage.activeTable = parseInt(e);
    this.setState({
      paginationChangePage
    }, async () => {
      await this.paginationChangeClick(1);
    })
  }
  //记录历史记录分页表格改变
  async paginationChangeClick(page) {
    const { paginationChangePage, supplierList } = this.state;

    let data = await this.paginationChange(page);
    if (paginationChangePage.activeTable === 1) {
      paginationChangePage.current = page;
      paginationChangePage.total = data.res.total || 0;
      this.setState({
        salesRecordList: data.list,
        paginationChangePage
      })
    } else {
      paginationChangePage.current = page;
      paginationChangePage.total = data.res.total || 0;
      let datas = data.list.map(m =>{
        m.supplierName = supplierList[m.supplierCode]?.supplierName;
        return m;
      })
      this.setState({
        goods_supplyList: datas,
        paginationChangePage
      })
    }
  }

  //记录历史记录分页表格查询
  async paginationChange(page, salesRecord) {
    const { paginationChangePage, goodsIdListKeys, formIdMap } = this.state;
    let data = {
      list: [],
      res: {}
    };
    if (paginationChangePage.activeTable === 1 || salesRecord) {
      let queryData = {
        conditionFilter: {
          conditionType: "and", conditions: [
            { conditionOperator: 'like', field: 'goodsId', conditionValues: [paginationChangePage.id] }
          ]
        },
        page: { current: page, size: 5 },
        sorts: [],
        formId: formIdMap['haiju_salesRecord']
      }
      const res = await this.dataSourceMap["queryFormData"].load(queryData);
      if (res.code === 200 && res.result.records != null) {
        data.list = res.result.records.map(m => {
          let isGoodsIdListKeys = goodsIdListKeys[m.goodsId];
          if (isGoodsIdListKeys) {
            m.inputTaxRate = isGoodsIdListKeys.inputTaxRate
          }
          return m;
        });
        data.res = res.result;
        // console.log(res.result.records, goodsIdListKeys)
      }
    } else {
      let queryDatas = {
        conditionFilter: {
          conditionType: "and", conditions: [
            { conditionOperator: 'like', field: 'goodsCode', conditionValues: [paginationChangePage.id] }
          ]
        },
        page: { current: page, size: 5 },
        sorts: [],
        formId: formIdMap['goods_supply']
      }
      const resData = await this.dataSourceMap["queryFormData"].load(queryDatas);
      if (resData.code === 200 && resData.result.records != null) {
        // console.log(resData, '获取采购价定价记录--商品供应表')
        data.list = resData.result.records.map(m => {
          m._supplyCycle = `${m.startDate}-${m.endDate}`;
          return m;
        });
        data.res = resData.result;
      }
    }

    return data;
  }
  //操作--设置盈亏点击
  tableSetProfitAndLoss(record) {
    console.log(record)
    this.setState({
      tableSetProfitAndLossData: [record],
      tableSetProfitAndLossDataCurrent: record,
      isShowDialog: true,
      isProfitAndLoss: true
    })
  }
  //操作--初始售价点击
  tableSetprice(record) {
    console.log(record)
    this.setState({
      tableSetProfitAndLossDataCurrent: record,
      showTableSetprice: true
    })
  }

  //设置初始售价--提交
  setInitialSellingPrice(values, errors) {
    if (errors === null) {
      const { dateFormat } = Unit;
      let nowDateFormat = dateFormat(new Date());
      const { sourceData, activeTab, tableSetProfitAndLossDataCurrent, searchData, formIdMap } = this.state;

      let detailLists = [];
      for (key in values) {
        if (key != 'price') {
          detailLists.push({ saleType: key, salePrice: values[key], _id: '' })
        }
      }
      let data = {
        data: { detailList: detailLists, price: values['price'], lastPriceTime: nowDateFormat },
        formId: sourceData[activeTab].formId,
        id: tableSetProfitAndLossDataCurrent._id
      }
      console.log(values, tableSetProfitAndLossDataCurrent, data, '设置初始售价--提交')
      let addSalesRecord = {
        data: {
          goodsId: tableSetProfitAndLossDataCurrent.goodsCode,
          pricingTime: nowDateFormat,
          salesChannels: tableSetProfitAndLossDataCurrent.salesChannel,
          salesPrice: values['price'],
          source: '初始售价'
        },
        formId: formIdMap['haiju_salesRecord']
      }
      let rs = [];
      rs.push(this.dataSourceMap["updateFormData"].load(data));
      rs.push(this.dataSourceMap["addFormData"].load(addSalesRecord));

      Promise.all(rs).then(res => {
        this.onDialogClose()
        this.showMessage('success', '设置数据成功');
        this.getTableDataSource(searchData)
      })
    }
  }

  //操作-市调价编辑
  tableEditRecord(record) {
    const { addArketPriceFrom } = this.state;
    for (const key in addArketPriceFrom) {
      addArketPriceFrom[key] = record[key]
    }
    addArketPriceFrom['id'] = record._id;
    this.setState({
      addArketPriceFrom: addArketPriceFrom,
      showAddArketPrice: true,
      arketPriceFromEdit: true
    })
  }
  //操作-市调价删除
  tableDeleteRecord(record) {
    const { sourceData, activeTab, searchData } = this.state;
    window.Next.Dialog.confirm({
      title: '删除确认',
      content: (<span style={{ 'font-size': '18px' }}>确定要删除该条数据？</span>),
      onOk: () => {
        const data = {
          formId: sourceData[activeTab].formId,
          data: {
            _id: [record._id]
          }
        }
        this.dataSourceMap['deleteFormData'].load(data).then(res => {
          if (res.code === 200) {
            this.showMessage('success', '删除数据成功');
            this.getTableDataSource(searchData);
          }
        })
      },
      onCancel: () => {

      }
    })
  }
  //根据商品名称匹配-商品编号
  nameForCode(name) {
    const { goodsIdList } = this.state;
    let list = [];
    goodsIdList.map(m => {
      if (m.goodsName && m.goodsName.includes(name)) {
        list.push(m.goodsId)
      }
    })
    let isList = list.length > 0 ? list : ['is_list_kong'];
    return isList;
  }
  //根据所选标包获取商品编号
  packageNumberForCode(code) {
    const { productPackageListData } = this.state;
    const item = productPackageListData.find(f => f.code === code);
    let list = [];
    if (item.product_info && item.product_info.length) {
      item.product_info.map(m => {
        list.push(m.product_code)
      })
    }
    return list;
  }
  //根据商品分类获取商品编号
  goodsClassifyForCode(code) {
    const { goodsIdListKeys } = this.state;
    let list = [];
    for (key in goodsIdListKeys) {
      if (goodsIdListKeys[key]['goodsTypeId'] === code) {
        list.push(key)
      }
    }
    return list;
  }
  //表格搜索
  onTableSearch(val) {
    let searchData = [];
    let xsLists = [];
    for (const key in val) {
      if (val[key] !== '' && val[key] !== null && val[key] !== undefined) {
        if (Object.prototype.toString.call(val[key]).slice(8, -1) === 'Array') {
          if (val[key].length) {
            searchData.push({
              conditionOperator: 'like', field: key, conditionValues: [...val[key]]
            })
          }
        } else {
          if (key === 'isPriceStatus') {
            searchData.push({
              conditionOperator: val[key] === '是' ? 'isNotNull' : 'isNull', field: 'lastPriceTime', conditionValues: []
            })
          } else if (key === 'productName') {
            let lists = this.nameForCode(val[key]);
            xsLists.push(...lists)
            // searchData.push({
            //   conditionOperator: 'eqa', field: 'goodsCode', conditionValues: lists
            // })
          } else if (key === 'packageNumber') {
            let lists = this.packageNumberForCode(val[key]);
            xsLists.push(...lists)
            // searchData.push({
            //   conditionOperator: 'eqa', field: 'goodsCode', conditionValues: lists
            // })
          } else if (key === 'goodsCodeF') {
            let lists = this.goodsClassifyForCode(val[key]);
            xsLists.push(...lists);
          } else if (key === 'isState') {
            searchData.push({
              conditionOperator: val[key] === '已定价' ? 'isNotNull' : 'isNull', field: 'isState', conditionValues: []
            })
          } else {
            searchData.push({
              conditionOperator: 'like', field: key, conditionValues: [val[key]]
            })
          }
        }
      }
    }
    let setXsLists = Array.from(new Set(xsLists));
    if (setXsLists.length) {
      searchData.push({
        conditionOperator: 'eqa', field: 'goodsCode', conditionValues: setXsLists
      })
    }
    let queryConditions = JSON.parse(JSON.stringify(this.state.queryConditions));
    queryConditions.page.current = 1;
    this.setState({
      queryConditions: queryConditions,
      searchData
    }, () => {
      this.getTableDataSource(searchData)
    })
  }
  //重置搜索
  onTableReset() {
    let queryConditions = JSON.parse(JSON.stringify(this.state.queryConditions));
    queryConditions.page.current = 1;
    this.setState({
      queryConditions: queryConditions,
      searchData: []
    }, () => {
      this.getTableDataSource()
    })
  }
}