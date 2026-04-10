class LowcodeComponent extends Component {
  constructor() {
    const { inject } = window.HaijuBasePack;
    inject(this, { withMethods: [], });
  }
  // eslint-disable-next-line no-unreachable
  state = {
    "isShowDialog": false,
    "tableData": [{ contractState: '1' }],
    "formOptions": {},
    "detailForm": {},
    "orderStateDic": [
      { label: '全部', value: '全部', key: '-1', color: '#fff' },
      { label: '存续', value: '存续', key: '0', color: 'green' },
      // { label: '临期', value: '临期', key: '1', color: 'red' },
      { label: '提前解除', value: '提前解除', key: '2', color: 'orange' },
      { label: '到期', value: '到期', key: '3', color: 'black' }
    ],
    currentUser: {},
    "contractNumberDic": [],
    "signBagDic": [],
    "searchForm": {},
    "titleNameStyle": { color: 'blue', fontSize: '18px', padding: '10px 0' },
    "businessDic": [],
    "drawerType": '',
    "formMap": {
      inquiry_packages: '',
      supplier: '',
      supplierContract: ''
    },
    // "formIds": {
    //   supplier: 't68a97040d20c29000782353e', // 合同
    //   businessLicense: 't69d7569c7184860008baae43', // 供应商 
    //   signBag: 't687f41c8c5f2250007aa4738'
    // },
    "rowSelectConfig": {
      primaryKey: '_id',
      hasBorder: true,
      rowSelection: {
        primaryKey: '_id',
        hasBorder: true,
        onChange: this.changeSelect.bind(this),
        onSelect(selected, record, records) { },
        onSelectAll(selected, records) {
        },
        selectedRowKeys: [],
      }
    },
    "selectList": [],
    "page": { size: 10, current: 1, total: 0 },
    "step": 30, // 过期的步长
  }
  get dialogTitle() {
    let titleObj = {
      "add": "添加合同",
      "edit": "编辑合同",
      "viww": "合同详情",
      "copy": "添加合同",
      "relieve": "该合同未到期，是否确认提前解除？"
    }
    return titleObj[this.state.drawerType]
  }
  componentDidMount() {
    const { setMomentLocale } = window.MomentLocale
    setMomentLocale()
    this.init(async () => {
      this.queryTableList()
      this.queryAllTable()
      this.queryGYSList()
      this.querySignBag()
    })
  }
  componentWillUnmount() { }
  changeSelect(ids, records) {
    const { rowSelectConfig } = this.state
    rowSelectConfig.rowSelection.selectedRowKeys = ids
    this.setState({ rowSelectConfig })
  }
  // 获取表格的options
  getTableOption() {
    const { orderStateDic } = this.state
    return {
      primaryKey: '_id',
      hasBorder: true,
      rowSelectConfig: this.state.rowSelectConfig,
      column: [
        { label: '序号', width: 60, prop: 'serialNumber', cell: (v, i) => i + 1 },
        { label: '合同编号', prop: 'contractNumber' },
        { label: '合同名称', prop: 'contractName', cell: (value, index, record) => <span onClick={() => this.preview(record.contractDocuments)} style={{ color: 'blue', cursor: 'pointer' }}>{value}</span> },
        { label: '供应商名称', prop: 'supplierName' },
        // { label: '标包', prop: 'signBag', cell: (value, index, record) => <span>{!!value && value.length > 0 ? value.join(',') : '--'}</span> },
        { label: '合同开始时间', prop: 'start_date' },
        { label: '合同到期时间', prop: 'end_date' },
        { label: '创建时间', prop: 'createTime' },
        {
          label: '状态', prop: 'statusTag',
          cell: (v) => {
            if(!!v) {
              const obj = orderStateDic.find(dic => dic.value === v)
              if(!obj) return v
              return <span style={{ color: obj.color }}>{v}</span>
            } else return '-'
          }
        },
        { label: '操作', width: 160, prop: 'opt', cell: (value, index, record) => this.oprRender.call(this, value, index, record) }
      ]
    }
  }
  // 获取表单的options
  getFormOption(type) {
    const { businessDic } = this.state
    let disabled = type === 'viww'
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      column: [
        { prop: 'contractNumber', label: '合同编号', span: 24, required: true, type: 'input', disabled, requiredMessage: '请填写合同编号' },
        { prop: 'supplierId', label: '供应商名称', showSearch: true, span: 24, required: true, type: 'select', dicData: businessDic, disabled, requiredMessage: '请选择供应商名称' },
        { prop: 'contractName', label: '合同名称', span: 24, required: true, disabled, requiredMessage: '请输入合同名称' },
        { prop: 'contractCircle', label: '合同期限', span: 24, required: true, type: 'dateRanger', disabled, requiredMessage: '请选择合同期限' },
        {
          label: '合同文件', span: 24, type: 'upload', disabled, accept: ".pdf", prop: 'contractDocuments',
          action: "/mainApi/processengine/app/application/upload",
          headers: { "Authorization": 'Bearer ' + new URLSearchParams(location.search).get('token') },
          onPreview: (filePath) => this.preview(filePath),
        },
      ]
    }
  }
  // 获取闲情和解除合同的options
  getViewOption(type, rowData) {
    const { Tag } = window.Next
    const { Group: TagGroup } = Tag, { orderStateDic } = this.state
    let stateItem = [{
      prop: 'state', label: '合同状态', cell: () => {
        if(!!rowData?.statusTag) {
          const stateObj = orderStateDic.find(it => it.value === rowData?.statusTag)
          return !!stateObj? <span style={{ color: stateObj.color }}>{stateObj.label}</span> : rowData?.statusTag
        } else return '-'
        // let stateObj = {}
        // if (this.state.detailForm.isRelieve == '是') {
        //   stateObj = this.state.orderStateDic.find(it => it.value == '3')
        // } else {
        //   const v = this.daysBetween(this.state.detailForm.end_date)
        //   stateObj = this.state.orderStateDic.find(it => it.value == v)
        // }

        // return <span style={{ color: stateObj.color }}>{stateObj.label}</span>
      }
    }],
      cardList = [
        { prop: 'contractNumber', label: '合同编号' },
        { prop: 'supplierName', label: '供应商名称' },
        {
          prop: 'contractCircle', label: '合同期限', cell: (value) => {
            let timer = value && Array.isArray(value) ? value.join(' ~ ') : value
            return <span>{timer}</span>
          }
        }
      ]
    let options = { column: [] }
    if (type === 'relieve') {
      cardList = [...cardList, ...stateItem]
      options.column = [
        ...options.column,
        { prop: 'relieveReson', label: '', span: 24, placeholder: '请输入解除原因', type: 'textarea' },
        {
          label: '', span: 24, type: 'upload', onPreview: (filePath) => this.preview(filePath), accept: ".pdf", prop: 'relieveFiles',
          action: "/mainApi/processengine/app/application/upload",
          headers: { "Authorization": 'Bearer ' + new URLSearchParams(location.search).get('token') },
        }
      ]
    } else { // 详情
      options.showSubmitBtn = false
      cardList = [
        ...cardList,
        {
          prop: 'contractDocuments', label: '合同文件', cell: (value) => {
            return <TagGroup>
              {
                value && Array.isArray(value) ? value.map(it => <div onClick={() => this.viewFile(it)} className="tagItem" style={{ cursor: 'pointer' }} key={it.prop} size="small">{it.name}</div>) : (value || '暂无附件')
              }
            </TagGroup>
          }
        },
        ...stateItem,
        { prop: 'relieveReson', label: '解除原因' },
        {
          prop: 'relieveFiles', label: '附件', cell: (value) => {
            return <TagGroup>
              {
                value && Array.isArray(value) ? value.map(it => <Tag onClick={() => this.viewFile(it)} style={{ cursor: 'pointer' }} key={it.prop} size="small" color={"#108ee9"}>{it.name}</Tag>) : '暂无附件'
              }
            </TagGroup>
          }
        }
      ]
    }
    let cardItem = {
      prop: 'card111', type: 'card', label: '', span: 24, static: true,
      cell: () => <div className="fullWith cTable" style={{ marginBottom: '10px' }}>
        {
          cardList.map((item, index) => {
            return <div className="myTableTr" style={{ borderTop: index == 0 ? 'none' : '1px solid #ccc' }}>
              <div className="tableTh">{item.label}</div>
              <div className="tableTd">{item.cell ? item.cell(rowData[item.prop]) : (rowData[item.prop] || '--')}</div>
            </div>
          })
        }
      </div>
    }
    options.column.unshift(cardItem)
    return options
  }
  // 预览文件
  viewFile(row) {
    this.commonReauire('getFileUrlList', { names: [row.url] }).then(res => {
      if (!!res && !!res[row.url]) {
        window.location.href = res[row.url]
      }
    })
  }
  // 列表row按钮
  oprRender(value, index, record) {
    const { Button } = window.Next,
      v = this.daysBetween(record.end_date)
    const oprList = [
      { key: 'relieve', name: '解除', isShow: () => record.isRelieve === '否' && !['3'].includes(v) },
      { key: 'edit', name: '编辑', isShow: () => record.isRelieve === '否' && !['3'].includes(v) },
      { key: 'copy', name: '复制', isShow: () => true },
      { key: 'viww', name: '详情', isShow: () => true },
      { key: 'del', name: '删除', color: 'red', isShow: () => true }
    ].filter(citem => citem.isShow())
    return (<div className={'opr-button'}>
      {oprList.map(item => {
        return (<Button type="primary"
          key={item.key}
          style={{ 'margin-right': '8px', color: item.color }}
          onClick={() => this.rowHandel(value, index, record, item.key)}
          text={true}>
          {item.name}
        </Button>)
      })}
    </div>)
  }
  // 渲染表格的函数
  renderTableListJsx() {
    const { Pagination } = window.Next
    let tableOptions = this.getTableOption()
    const TableComponent = React.forwardRef((props, ref) => {
      let { options: tableOptions, data: tableData, onChange } = props
      return this.renderTableForColumn(tableOptions, tableData, onChange, ref)
    })
    return <>
      <TableComponent data={this.state.tableData} options={tableOptions} ></TableComponent>
      <div style={{ width: '100%', textAlign: 'right', margin: '10px 0' }}>
        <Pagination
          className="custom-pagination"
          total={this.state.page.total}
          pageSize={this.state.page.size}
          pageSizeSelector="dropdown"
          pageSizeList={[10, 20, 50, 100]}
          onPageSizeChange={(s) => this.onPageSizeChange(s)}
          onChange={(c) => this.onChange(c)}
          totalRender={(t) => (
            <span style={{ padding: "0 10px" }}>{`总数: ${t}`}</span>
          )}
        />
      </div>
    </>
  }
  // 新增 方法
  addHandel(copyObj = {}) {
    let formOptions = this.getFormOption('add')
    this.setState({
      formOptions,
      detailForm: copyObj,
      drawerType: 'add'
    }, () => {
      this.setState({ isShowDialog: true })
    })
  }
  // 列的操作按钮事件
  rowHandel(value, index, record, key) {
    const { Dialog, Button } = window.Next
    if (key === 'copy') {
      const { supplierId } = record
      this.addHandel({ supplierId })
    } else if (key === 'del') {
      const dialog = Dialog.warning({
        v2: true,
        title: "提示",
        content: `是否确认删除 “${record.contractName}” 合同？`,
        footer: <>
          <Button style={{ marginRight: '10px' }} type="secondary" onClick={() => dialog.hide()} >取消</Button>
          <Button type="primary" onClick={() => this.deleteHandel(record, () => dialog.hide())}> 确定 </Button>
        </>
      })
    } else {
      let formOptions = {},
        { end_date, start_date, contractDocuments, relieveFiles } = record
      let newContractDocuments = []
      if(!!contractDocuments && Array.isArray(contractDocuments)) {
          newContractDocuments = contractDocuments.filter(item => !!item).map(item => {
          let lineP = (item && item.url) ? item.url : (item ? item.indexOf('/') + 1 : 0)
          return {
            name: item.url ? item.url.slice(lineP, -4) : item.slice(lineP, -4),
            url: item
          }
        })
      }
      relieveFiles = relieveFiles && Array.isArray(relieveFiles) ? relieveFiles.map(item => {
        let lineP = (item && item.url) ? item.url : (item ? item.indexOf('/') + 1 : 0)
        return {
          name: item.url ? item.url.slice(lineP, -4) : item.slice(lineP, -4),
          url: item
        }
      }) : []
      const detailForm = { ...record, contractCircle: [start_date, end_date], contractDocuments: newContractDocuments, relieveFiles }
      if (['relieve', 'viww'].includes(key)) {
        formOptions = this.getViewOption(key, detailForm)
      } else if (['copy', 'edit']) {
        formOptions = this.getFormOption(key)
      }
      this.setState({
        detailForm,
        formOptions,
        drawerType: key,
        isShowDialog: true
      }, () => {})
      this.setState({})
    }
  }
  // 导出按钮
  async exportHandel() {
    const { rowSelectConfig, formMap } = this.state,
      { Message } = window.Next
    let selectList = rowSelectConfig.rowSelection.selectedRowKeys
    if (selectList && selectList.length > 0) {
      let params = {
        conditionFilter: {
          conditionType: 'and',
          conditions: [
            {
              conditionOperator: 'eqa',
              conditionValues: selectList,
              field: '_id'
            }
          ]
        },
        page: { size: 1000, current: 1 },
        sorts: [],
        tableName: formMap['supplierContract']
      }
      const res = await this.commonReauire('exportExcel', params, 'export')
      this.exportExcel(res, '供应商合同')
    } else {
      Message.warning('请选择需要导出的合同')
    }
  }
  // 导入按钮
  importHandel() {

  }
  // 关闭弹框
  onDialogClose() { this.setState({ isShowDialog: false }) }
  // 弹框提交事件
  onDialogSubmit(form, errors) {
    const { Message } = window.Next
    if (errors && Object.keys(errors).length > 0) return Message.warning('请正确填写表单')
    const { supplierId, contractDocuments, contractCircle, relieveFiles } = form, { businessDic, formMap, drawerType } = this.state
    let obj = businessDic.find(item => item.value == supplierId),
      times = contractCircle.map(item => (item && item.format) ? item.format('YYYY-MM-DD') : item) || [],
      files = contractDocuments && Array.isArray(contractDocuments) ? contractDocuments.map(item => (item && item.response) ? item.response.result : (item.url ? item.url : item)).filter(item => !!item) : []
    let files1 = relieveFiles && Array.isArray(relieveFiles) ? relieveFiles.map(item => (item && item.response) ? item.response.result : (item.url ? item.url : item)) : []
    if(!files || !files.length) return Message.warning('合同文件为空，请检查是否已经上传合同文件')
    let params = {
      data: { ...form, supplierName: obj.label, contractDocuments: files, start_date: times[0], end_date: times[1], relieveFiles: files1 },
      formId: formMap.supplierContract
    }
    delete params.data.contractCircle
    let apiStr = ''
    if (drawerType === 'add') {
      apiStr = 'addFormData'
      params.data.isRelieve = '否'
    } else if (['edit', 'relieve'].includes(drawerType)) {
      apiStr = 'updateFormData'
      if (form._id) {
        params.id = form._id
        params.dataList = []
      }
      if (drawerType === 'relieve') {
        params.data.isRelieve = '是'
      }
    }
    this.updataList(apiStr, params)
  }
  // 查询供应商并更新状态
  async searchGYSOrUpdateStatus(supplierId) {
    const { formMap } = this.state
    let params = {
      conditionFilter: {
        conditionType: 'AND',
        conditions: [
          {
            conditionOperator: 'eq',
            conditionValues: [supplierId],
            field: 'supplierId'
          }
        ]
      },
      page: { current: 1, size: 10 },
      sorts: [],
      formId: formMap.supplier
    }
    return new Promise((async (resolve, reject) => {
      try {
        const { records } = await this.commonReauire('queryFormData', params)
        console.log(records);
        if (records && records.length > 0) {
          const params = {
            data: {
              supplierStatus: '正常',
            },
            dataList: [],
            formId: formMap.supplier,
            id: records[0]._id
          }
          await this.commonReauire('updateFormData', params)
        }
        resolve(true)
      } catch (error) {
        console.log(error);
        reject(error)
      }
    }))
  }
  renderFormJsx() {
    const FormComponent = React.forwardRef((props, ref) => this.formComponent(props, ref)),
      { formOptions, detailForm } = this.state
    console.log(detailForm, '===detailForm===', formOptions);
    return <FormComponent options={formOptions} data={detailForm}></FormComponent>
  }
  // 文件预览
  async preview(file, type) {
    const { Message, Dialog, Button } = window.Next
    if (!file || !Array.isArray(file) || file.length < 0) return Message.warning('无可预览的文件')
    let list = []
    if (Array.isArray(file)) {
      list = file.map(item => this.getFileDownUrl(item))
    } else {
      list = [this.getFileDownUrl(file)]
    }
    let res = await Promise.all(list)
    if (type == 'previewDialog') {
      const dialog = Dialog.show({
        v2: true,
        title: '预览',
        width: '50%',
        content: <div style={{ "max-height": '500px', overflow: 'hidden auto' }}>
          {
            res.map(item => <iframe style={{ width: '100%', height: '400px' }} src={item} frameborder="0"></iframe>)
          }
        </div>,
        footer: <>
          <Button style={{ marginRight: '10px' }} type="secondary" onClick={() => dialog.hide()} >关闭</Button>
        </>
      })
    } else {
      res.forEach(item => window.open(item))
    }
  }
  onSearch(searchForm) {
    this.state.page.current = 1
    this.state.searchForm = { ...searchForm }
    this.setState({}, () => this.queryTableList())
  }
  onReset() {
    this.state.page.current = 1
    this.state.searchForm = {}
    this.setState({}, () => this.queryTableList())
  }
  onChange(current) {
    const { page } = this.state
    page.current = current
    this.setState({ page }, () => this.queryTableList())
  }
  onPageSizeChange(size) {
    const { page } = this.state
    page.size = size
    this.setState({ page }, () => this.queryTableList())
  }
  // 获取供应商数据做 下拉
  async queryGYSList() {
    const { formMap } = this.state
    let params = {
      conditionFilter: {
        conditionType: 'and',
        conditions: []
      },
      formId: formMap.supplier,
      page: { size: 1000000, current: 1 }, sorts: []
    }
    const { records } = await this.commonReauire('queryFormData', params)
    let businessDic = records.map(item => {
      return {
        value: item.supplierId,
        label: item.supplierName
      }
    })
    this.setState({ businessDic })
  }
  // 获取所有合同的编号字典 contractNumberDic
  queryAllTable() {
    const { formMap } = this.state
    let params = {
      conditionFilter: { conditionType: 'and', conditions: [] },
      formId: formMap.supplierContract,
      page: { size: 10000000, current: 1 }, sorts: []
    }
    this.commonReauire('queryFormData', params).then(res => {
      let contractNumberDic = res.records.map(item => ({ label: item.contractNumber, value: item.contractNumber }))
      this.setState({ contractNumberDic })
    })
  }
  getTimeRolling(date) {
    return new Date(date).getTime()
  }
  // 获取合同表格数据
  async queryTableList() {
    const { page, searchForm } = this.state
    const nSearchTime = searchForm['contractDate'] ? searchForm['contractDate'].map(d => d && d.format ? d.format("YYYY-MM-DD") : d) : []
    const params = {
      currentPage: page.current,
      pageSize: page.size,
      startTime: nSearchTime[0],
      endTime: nSearchTime[1],
      contractNumber: searchForm['contractNumber'],
      supplierId: searchForm['supplierId']
    }
    if(!!searchForm['contractState'] && searchForm['contractState'] !== '全部') {
      params['status'] = searchForm['contractState']
    }
    try {
      const { total, records } = await this.commonReauire('querySupplierContract', params, 'data')
      page.total = total
      this.setState({ tableData: records, page })
    } catch (error) {
      console.log(error);
    }
  }
  // 新增合同数据 updateFormData addFormData
  async updataList(urlType, params) {
    try {
      await Promise.all([
        this.commonReauire(urlType, params),
        this.searchGYSOrUpdateStatus(params.data.supplierId)
      ])
    } catch (error) {
      console.log(error);
    }
    if (this.state.drawerType == 'add') { this.queryAllTable() }
    this.setState({ isShowDialog: false }, () => this.queryTableList())
  }
  // 删除处理
  deleteHandel(row, done) {
    const { _id } = row,
      { formMap } = this.state,
      params = {
        data: { _id: [_id] },
        formId: formMap.supplierContract
      }
    this.commonReauire('deleteFormData', params).then(res => {
      done && done()
      this.queryTableList()
      this.queryAllTable()
    })
  }
  // 获取文件的预览路径
  getFileDownUrl(filePath) {
    return new Promise((resolve, reject) => {
      this.commonReauire('getFileUrl', { filePath }).then(res => resolve(res))
    })
  }
  // 获取标包
  async querySignBag() {
    const { formMap } = this.state
    let params = {
      conditionFilter: {
        conditionType: 'and',
        conditions: []
      },
      formId: formMap.inquiry_packages,
      page: { current: 1, size: 1000000 },
      sorts: []
    }
    const { records } = await this.commonReauire('queryFormData', params)
    this.setState({
      signBagDic: records.map(item => {
        return {
          label: item.name,
          value: item.name
        }
      })
    })
  }
  // 公共接口 封装
  commonReauire(urlType, params, type='result') {
    let msgObj = {
      "queryFormData": null,
      "getFileUrl": null,
      "updateFormData": '更新成功',
      "addFormData": '新增成功',
      "deleteFormData": '删除成功'
    }
    const { Message } = window.Next
    return new Promise((resolve, reject) => {
      this.dataSourceMap[urlType].load(params).then(res => {
        if (type && type === 'export') {
          resolve(res)
        } else if (res.code === 200 || res.code === 0) {
          msgObj[urlType] && Message.success(msgObj[urlType])
          resolve(!!type?res[type] : res)
        }
      })
    })
  }
  // 工具方法
  daysBetween(data) {
    if (!data) return new Error('请传入一个时间')
    const oneDay = 24 * 60 * 60 * 1000, // 每天的毫秒数
      firstTime = new Date(data).getTime(),
      secondTime = new Date().getTime(),
      { step } = this.state
    let day = Math.round((firstTime - secondTime) / oneDay);
    if (day >= 0 && day <= step) {
      return '1'
    } else if (day > step) {
      return '0'
    } else {
      return '3'
    }
  }
  // 下载bobl导出文件
  exportExcel(data, file) {
    if (!data) {
      return
    }
    let blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    let fileName = `${file}` + '.xls'
    if ('download' in document.createElement('a')) { // 不是IE浏览器
      let url = window.URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    } else {
      window.navigator.msSaveBlob(blob, fileName)
    }
  }
  // 将时间往前推 n天 并且 返回 格式化 YYYY-MM-dd
  subtractDays(date, n = 0) {
    let nDate = new Date(date)
    nDate.setDate(nDate.getDate() - n);
    let y = nDate.getFullYear(),
      M = (nDate.getMonth() + 1) >= 10 ? (nDate.getMonth() + 1) : ('0' + (nDate.getMonth() + 1)),
      D = nDate.getDate() >= 10 ? nDate.getDate() : ('0' + nDate.getDate())
    return y + '-' + M + '-' + D
  }
  // 比较时间 大小 返回 大的时间
  getBigDate(date1, date2) {
    const nDate1 = new Date(date1), nDate2 = new Date(date2);
    return nDate1 > nDate2 ? nDate1 : nDate2
  }
  // 判断数组是不是空
  arrayyIsEmpty(arr) {
    if (!!arr && Array.isArray(arr)) {
      let length = arr.filter(item => item).length
      return length <= 0
    } else {
      return true
    }
  }
  // 如果a的开始时间大于b的结束时间，或者a的结束时间小于b的开始时间，则无交集
  isOverlapping(aStart, aEnd, bStart, bEnd) {
    return !(aStart > bEnd || aEnd < bStart);
  }
  // 取交集的事件 如果没有交集则返回null 
  mergeTimeRanges(range1, range2) {
    const [start1, end1] = range1;
    const [start2, end2] = range2;
    // 判断两个时间段是否有交集
    if (this.isOverlapping(start1, end1, start2, end2)) {
      // 如果有交集，取两个时间段的最大开始时间和最小结束时间
      return [Math.max(start1, start2), Math.min(end1, end2)];
    }
    return null; // 如果无交集，返回null
  }
  // 通过表格options渲染表格 ==== 组件
  renderTableForColumn(options, data, onChange) {
    const { Table, Button } = window.Next,
      { column, rowSelectConfig = {}, headerCell } = options
    return (<div className={'table-box'}>
      {headerCell && headerCell()}
      <Table.StickyLock
        dataSource={data || []}
        primaryKey={rowSelectConfig.primaryKey}
        hasBorder={rowSelectConfig.hasBorder}
        rowSelection={rowSelectConfig.rowSelection}
      >
        {column.map((item, index) => {
          return (<Table.Column
            cell={item.cell ? (value, index, record) => item.cell(value, index, record, data, onChange) : value => value}
            title={item.label}
            align={item.align || 'center'}
            width={item.width ? item.width : 100}
            dataIndex={item.prop}
            key={item.prop}
          />)
        })}
      </Table.StickyLock>
    </div>)
  }
  // 表单组件 ==== 组件
  formComponent({ options, data }) {
    const { Table, Button, Form, Input, Grid: { Row, Col }, Select, TimePicker2, DatePicker2, Upload, Icon } = window.Next,
      { column, gutter, isShowBtn = true, showSubmitBtn = true, showCancel = true, labelCol, wrapperCol } = options,
      FormItem = Form.Item,
      { RangePicker } = DatePicker2,
      TableComponent = React.forwardRef((props, ref) => {
        let { options: tableOptions, data: tableData, onChange } = props
        return this.renderTableForColumn(tableOptions, tableData, onChange, ref)
      }),
      // 表单小件封装 === 组件
      GetComponent = React.forwardRef((props) => {
        const { value: dataValue, item, onChange } = props
        switch (item.type) {
          case 'select':
            return <Select
              showSearch={item.showSearch}
              filterLocal={item.filterLocal}
              autoHighlightFirstItem={false}
              placeholder={item.placeholder || ('请选择' + item.label)}
              style={{ width: '100%' }}
              dataSource={item.dicData}
              disabled={item.disabled}
              defaultValue={dataValue}
              onChange={e => onChange(e)}
            />
          case 'timeRanger':
            return <TimePicker2.RangePicker
              format={item.format || 'HH:mm'}
              placeholder={item.placeholder || ('请选择' + item.label)}
              style={{ width: '100%' }}
              disabled={item.disabled}
              defaultValue={dataValue}
              popupStyle={{ height: '200px' }}
              onChange={e => onChange(e)}
            />
          case 'dateRanger':
            return <RangePicker
              placeholder={item.placeholder || ('请选择' + item.label)}
              style={{ width: '100%' }}
              disabled={item.disabled}
              defaultValue={dataValue}
              popupStyle={{ height: '200px' }}
              onChange={e => onChange(e)}
            />
          case 'data':
            return <DatePicker2
              placeholder={item.placeholder || ('请选择' + item.label)}
              defaultValue={dataValue}
              disabled={item.disabled}
              style={{ width: '100%' }}
              onChange={e => onChange(e)}
            />
          case 'textarea':
            return <Input.TextArea disabled={item.disabled} placeholder={item.placeholder || ('请输入' + item.label)}
              defaultValue={dataValue}
              onChange={e => onChange(e)}
            />
          case 'btnGroup':
            return <>
              {
                item.btns.map(btn => {
                  return <Button
                    style={{ 'margin-right': '8px' }} onClick={() => this.btnClick(btn.prop)} type={btn.type}>{btn.label}</Button>
                })
              }
            </>
          case 'btnAdnSearch':
            return <div style={{ display: 'flex' }}>
              <Input onChange={e => onChange(e)} placeholder={item.placeholder || ('请输入' + item.label)} />
              {
                item.btns.map(btn => {
                  return <Button onClick={() => this.btnClick(btn.prop)} type={btn.type}>{btn.label}</Button>
                })
              }
            </div>
          case 'upload':
            return item.listType == 'card' ? <Upload.Card
              listType="card"
              action={item.action}
              headers={item.headers}
              disabled={item.disabled}
              useDataURL
              accept={item.accept}
              defaultValue={dataValue}
              onChange={e => onChange(e)}
            ></Upload.Card> :
              <Upload
                action={item.action}
                disabled={item.disabled}
                headers={item.headers}
                defaultValue={dataValue}
                onPreview={(info) => item.onPreview(info)}
                listType={item.listType || 'text'}
                useDataURL
                accept={item.accept}
                onChange={e => onChange(e)}
              >
                <Button style={{ marginBottom: 8 }}>
                  <Icon type="upload" />
                  上传文件
                </Button>
              </Upload>
          case 'table':
            return <div>
              <TableComponent disabled={item.disabled} data={dataValue} options={item.options} />
            </div>
          case 'title':
            return <div style={item.style || ''}>
              {item.titleName}
            </div>
          case 'card':
            return <>{item.cell && item.cell()}</>
          default:
            return <>
              <Input disabled={item.disabled}
                onChange={e => onChange(e)} defaultValue={dataValue} placeholder={item.placeholder || '请输入' + item.label} />
            </>
        }
      })
    return <Form labelCol={{ span: labelCol || '4' }} wrapperCol={{ span: wrapperCol || '14' }} labelAlign="left" inline={false} className="dialogBox" value={data} >
      <Row wrap gutter={gutter || 8}>
        {
          column.map(item => {
            return <Col span={item.span || 12}>
              {
                item.static ?
                  <GetComponent item={item} data={data[item.prop]} /> :
                  <FormItem
                    name={item.prop}
                    required={item.required}
                    requiredMessage={item.requiredMessage}
                    label={!!item.label ? (item.label + ':') : ''}
                  >
                    <GetComponent item={item} data={data[item.prop]} />
                  </FormItem>
              }
            </Col>
          })
        }
        {
          isShowBtn && <div className="btnBox">
            <FormItem>
              {
                showSubmitBtn &&
                <Form.Submit
                  validate
                  type="primary"
                  onClick={(v, e) => this.onDialogSubmit(v, e)}
                  style={{ marginRight: 10 }}
                >
                  提交
                </Form.Submit>
              }
              {showCancel && <Form.Reset onClick={() => this.onDialogClose()} >取消</Form.Reset>}
            </FormItem>
          </div>
        }
      </Row>
    </Form>
  }
}