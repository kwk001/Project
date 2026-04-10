class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    "isShowDialog": false,
    "dataList": [],
    "visiDialog": false,
    "formData": {},
    "formIds": {
      mainFormId: "t69d7569c7184860008baae41"
    },
    "currentUser": {},
    "formIdsProps": {
      goodsTypeTable: 'mainFormId'
    },
    "page": {
      size: 10,
      current: 1,
      total: 0
    },
    "typeDic": [],
    "formType": 'add',
    "dialogTitle": ''
  }
  componentDidMount() {
    this.queryCurrentLoginUserInfo()
  }
  componentWillUnmount() {
  }
  // 查询登录用户的ID customerId
  async queryCurrentLoginUserInfo() {
    const { Unit: { commonReauire, apiEnum } } = window
    const formIds = await this.queryFormIdsDate(this.state.formIdsProps)
    let userInfo = await commonReauire(this, apiEnum('user'))
    this.state.formIds = { ...formIds }
    this.state.currentUser = { ...userInfo }
    this.queryAllList()
  }
  // 获取queryFormIdsDate
  queryFormIdsDate(obj) {
    const { Unit: { commonReauire } } = window
    const formMapArr = Object.keys(obj)
    const codeParams = { codes: [...formMapArr] }
    return new Promise((resolve, reject) => {
      commonReauire(this, 'getIdByCode', codeParams).then(res => {
        let formIds = {}
        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            formIds[obj[key]] = res[key]
          }
        }
        resolve(formIds)
      }).catch(err => reject(err))
    })
  }
  // 查询所有分页数据做字典
  async queryAllList() {
    const { formIds } = this.state
    let params = {
      conditionFilter: {
        conditionType: 'and',
        conditions: []
      },
      formId: formIds.mainFormId,
      page: {
        size: 100000,
        current: 1
      },
      sorts: []
    }
    const { records } = await this.queryApi(params)
    if (!!records && records.length > 0) {
      const imgArr = records.map(item => item.picture && Array.isArray(item.picture) ? item.picture[0] : '').filter(item => !!item)
      const imgArrresult = await this.queryImgUrl(imgArr)
      console.log(imgArrresult);
      let dataList = records.filter(item => !item.parentGoodsTypeId || item.parentGoodsTypeId == '--')
      let typeDic = dataList.map(item => {
        return {
          label: item.typeName,
          value: item.goodsTypeId
        }
      })
      dataList = dataList.map(item => {
        item.children = records.filter(it => item.goodsTypeId == it.parentGoodsTypeId).map(citem => {
          return {
            ...citem,
            cDisplay: citem.cDisplay ? citem.cDisplay.split(',') : [],
          }
        })
        return {
          ...item,
          cDisplay: item.cDisplay ? item.cDisplay.split(',') : [],
          imgUrl: (item.picture && Array.isArray(item.picture)) ? imgArrresult[item.picture[0]] : ''
        }
      })
      this.state.typeDic = [{ label: "无", value: '--' }, ...typeDic]
      this.state.dataList = dataList
    } else {
      this.state.typeDic = []
      this.state.dataList = []
    }
    console.log(this.state.typeDic, this.state.dataList);
    this.setState({})
  }
  // 查询图片的阿里地址
  queryImgUrl(imgArr) {
    const { Unit: { commonReauire, isArray, dateFormat }, Next: { Message } } = window,
      { currentUser } = this.state
    if (!!isArray(imgArr)) {
      return new Promise((resolve, reject) => {
        commonReauire(this, 'getFileUrlList', { names: imgArr }).then(res => resolve(res)).catch(err => reject(err))
      })
    } else {
      return Promise.resolve([])
    }
  }
  // 分页查询列表
  async queList() {
    const { formIds, page } = this.state
    let params = {
      conditionFilter: {
        conditionType: 'and',
        conditions: [
          {
            conditionOperator: "eqa",
            conditionValues: ['--', null],
            field: "parentGoodsTypeId"
          }
        ]
      },
      formId: formIds.mainFormId,
      page,
      sorts: []
    }
    const { records } = await this.queryApi(params)
    let dataList = records ? records.map(item => {
      return { ...item, children: [] }
    }) : []
    this.setState({ dataList })
  }
  // 查询数据接口
  queryApi(params) {
    return new Promise((resolve, reject) => {
      this.dataSourceMap['queryFormData'].load(params).then(res => {
        const { code, result } = res
        if (code == 200) {
          resolve(result)
        } else {
          reject(result)
          Message.error('获取列表失败')
        }
      }).catch(err => err)
    })
  }
  // 删除分类
  deleteType(e, { rowRecord }) {
    const { Next: { Message }, Unit: { commonReauire, apiEnum, showDialog } } = window,
      { formIds } = this.state
    const that = this
    showDialog({
      content: '是否确定删除该商品类别?',
      cb: async dialog => {
        let params = { data: { _id: [rowRecord._id], formId: formIds.mainFormId } }
        try {
          await commonReauire(that, apiEnum('del'), params)
          dialog.hide()
          Message.success('删除成功')
          that.queryAllList()
        } catch (error) {
          dialog.hide()
          Message.error('删除失败')
        }
      }
    })
  }
  addType() { // 添加分类
    this.state.formData = { parentGoodsTypeId: '--' }
    this.state.dialogTitle = '添加分类'
    this.state.formType = 'addMainType'
    this.state.isShowDialog = true
    this.setState({})
  }
  optHandel(item, row) {
    console.log(item, row);
    const { Next: { Message }, Unit: { commonReauire, apiEnum, showDialog } } = window,
      { formIds } = this.state
    const that = this
    this.state.formType = item.prop
    if (item.prop == 'del') {
      showDialog({
        content: '是否确定删除该商品类别?',
        cb: async dialog => {
          if (row.parentGoodsTypeId == '--' && row.children && row.children.length > 0) return Message.error('该分类下具有子分类不可直接删除')
          let params = { data: { _id: [row._id] }, formId: formIds.mainFormId }
          try {
            await commonReauire(that, apiEnum('del'), params)
            dialog.hide()
            Message.success('删除成功')
            that.queryAllList()
          } catch (error) {
            dialog.hide()
            Message.error('删除失败')
          }
        }
      })
    } else {
      if (item.prop == 'add') {
        this.state.formData = {
          parentGoodsTypeId: row.goodsTypeId
        }
      } else {
        let picture = (row.picture && Array.isArray(row.picture)) ? row.picture.map((item, i) => {
          return {
            uid: i,
            name: item,
            state: 'done',
            url: row.imgUrl,
            imgURL: row.imgUrl
          }
        }) : undefined
        this.state.formData = { ...row, picture }
      }
      this.state.isShowDialog = true
      this.state.dialogTitle = item.label
      this.setState({})
    }
  }
  renderOpct(row) {
    const { Button } = window.Next
    let btn = [
      { label: '添加子类', prop: 'add', display: row.parentGoodsTypeId == '--' },
      { label: '编辑', prop: 'edit', display: true },
      { label: '删除', prop: 'del', display: true },
    ].filter(v => v.display)
    return <>
      {
        btn.map((item, index) => (
          <Button style={{ marginRight: '10px' }} type="primary" text onClick={() => this.optHandel(item, row)}>{item.label}</Button>
        ))
      }
    </>
  }
  async onDrawerSubmit(form, error) {
    console.log(form, error);
    const { Next: { Message }, Unit: { } } = window,
      { formType, formIds } = this.state
    if (error && Object.keys(error).length > 0) return Message.warning('请规范填写表单')
    let msg = ''
    let params = {}, apiType = ''
    if (['addMainType', 'add'].includes(formType)) {
      params = {
        data: {
          ...form,
          cDisplay: form.cDisplay ? form.cDisplay.join(',') : '',
          picture: (form.picture && Array.isArray(form.picture)) ? form.picture.map(item => (item.response) ? item.response.result : '') : ''
        },
        formId: formIds.mainFormId
      }
      apiType = 'addFormData'
      msg = '添加'
    } else {
      params = {
        data: {
          ...form,
          cDisplay: form.cDisplay ? form.cDisplay.join(',') : '',
          picture: form.picture && Array.isArray(form.picture) ? form.picture.map(file => file.response ? file.response.result : (file.name ? file.name : '')) : ''
        },
        formId: formIds.mainFormId, id: form._id
      }
      delete params.data._id
      apiType = 'updateFormData'
      msg = '修改'
    }
    try {
      await this.dataSourceMap[apiType].load(params)
      this.state.isShowDialog = false
      Message.success(msg + '成功')
      this.setState({}, () => this.queryAllList())
    } catch (error) {
      Message.error(msg + '失败')
    }
  }
  onFormChange(e) {
    console.log(e);
    this.state.formData = { ...this.state.formData, ...e }
  }
  onCancel() {
    this.state.isShowDialog = false
    this.setState({})
  }
  renderJSXForm() {
    const { Unit: { TypeCustomForm } } = window
    console.log(this.state.typeDic, '=====')
    let options = {
      onSubmit: (e, v) => this.onDrawerSubmit(e, v),
      onFormChange: e => this.onFormChange(e),
      onCancel: _ => this.onCancel(),
      column: [
        {
          label: '上级分类',
          required: true,
          requiredMessage: '请选择父级分类',
          prop: 'parentGoodsTypeId',
          disabled: true,
          span: 24,
          showSearch: true,
          display: this.state.formData.parentGoodsTypeId !== '--' && this.state.formType == 'add',
          type: 'select', dicData: this.state.typeDic
        },
        {
          label: '显示端(B端/C端)',
          prop: 'cDisplay',
          type: 'checkBox',
          span: 24,
          dicData: [{ label: 'C端', value: 'C端' }, { label: 'B端', value: 'B端' }]
        },
        {
          label: '分类名称',
          span: 24,
          required: true,
          requiredMessage: '请输入分类名称',
          prop: 'typeName',
        },
        {
          label: '分类图片', span: 24, type: 'upload',
          listType: 'card',
          shape: 'card',
          required: true,
          requiredMessage: '请上传图片',
          accept: "image/png, image/jpg",
          prop: 'picture',
          span: 24,
          display: this.state.formData.parentGoodsTypeId == '--',
          limit: 1,
          action: "/mainApi/processengine/app/application/upload",
          headers: { "Authorization": 'Bearer ' + new URLSearchParams(location.search).get('token') },
        },
        {
          label: '备注',
          span: 24,
          prop: 'remark',
          type: 'textarea'
        },
      ]
    }
    return <TypeCustomForm options={options} data={this.state.formData}></TypeCustomForm>
  }
  renderTypeTitle(v, row) {
    const { imgUrl } = row
    if (imgUrl) {
      return <div className="titleName">
        <img className="img" src={imgUrl} />
        <div style={{ marginLeft: '10px' }}>{v}</div>
      </div>
    } else {
      return <div>{v}</div>
    }
  }
  renderJSXTable() {
    const { Table, Button } = window.Next
    return <div>
      <div style={{ padding: '10px 0' }}>
        <Button type="primary" onClick={() => this.addType()}>添加分类</Button>
      </div>
      <Table dataSource={this.state.dataList} primaryKey="goodsTypeId" isTree>
        <Table.Column title="分类名称" dataIndex="typeName" cell={(v, i, row) => this.renderTypeTitle(v, row)} />
        <Table.Column align="center" title="是否C端/B端显示" dataIndex="cDisplay" cell={v => v ? v.join('/') : ''} />
        <Table.Column title="备注" dataIndex="remark" />
        <Table.Column align="center" title="操作" width={200} dataIndex="opt" cell={(v, i, row) => this.renderOpct(row)} />
      </Table>
    </div>
  }
}