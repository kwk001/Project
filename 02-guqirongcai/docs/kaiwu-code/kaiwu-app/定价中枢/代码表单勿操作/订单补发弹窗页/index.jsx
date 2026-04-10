class LowcodeComponent extends Component {
  constructor() {
    const { inject } = window.HaijuBasePack;
    const { getModelMethods } = window.HaijuModel;
    inject(this, {
      withMethods: [
        getModelMethods  // 数据联查公用方法
      ]
    });
  }
  state = {
    formMap: {
      order: '', // 订单表
      orderDetail: '' // 订单详情表
    },
    currentUser: {},
    formData: {
      orderID: '',
    },
    selectedSingleGoodsData: {
      curGoodsId: '',
      curGoodsNum: '',
      curRemark: ''
    },
    //商品清单表格数据
    goodsTableData: [],
    orderGoodsList: [],
    orderGoodsMap: {},
    chineseInput: false
  }
  componentDidMount() {
    console.log('did mount');
    this.init(() => {

    })
  }
  componentWillUnmount() {
    console.log('will unmount');
  }


  renderJsx() {
    const { Input, Select, NumberPicker, Button } = window.Next;
    const Option = Select.Option;
    const { formData: { orderID }, orderGoodsList = [], selectedSingleGoodsData: { curGoodsId, curGoodsNum, curRemark } } = this.state;
    return <div className="page-container">
      <div className="formdata-container">
        <div className="edit-field">
          <span className="label-name is-requried">补发订单号</span>
          <Input
            hasClear
            value={orderID}
            onChange={this.handleFilterChange('orderID', 'formData')}
          />
        </div>
        {
          //   <div className="edit-field">
          //   <span className="label-name is-requried">补发商品</span>
          //   <Select
          //     style={{
          //       width: '200px'
          //     }}
          //     value={goodsId}
          //     onChange={this.handleFilterChange('goodsId', 'formData')}
          //     hasClear
          //     showSearch
          //   >
          //     {
          //       goodsList.map(item =>
          //         (<Option value={item.value} key={item.value}>{item.label}</Option>)
          //       )
          //     }
          //   </Select>
          // </div>
          // <div className="edit-field">
          //   <span className="label-name is-requried ">补发数量</span>
          //   <NumberPicker
          //     value={resendNum}
          //     onChange={this.handleFilterChange('resendNum', 'formData')}
          //     step={0.01}
          //     stringMode
          //     min={0}
          //   />
          // </div>
          // <div className="edit-field">
          //   <span className="label-name">补发备注</span>
          //   <Input.TextArea
          //     hasClear
          //     value={remark}
          //     onChange={this.handleFilterChange('remark', 'formData')}
          //   />
          // </div>
        }
        <div className="goods-list-operate">
          <div className="search-field">
            <span className="label-name">商品名称</span>
            <Select
              style={{ width: '200px' }}
              showSearch
              value={curGoodsId}
              onChange={this.handleFilterChange('curGoodsId', 'selectedSingleGoodsData')}
              hasClear
            >
              {
                orderGoodsList.map(item =>
                  (<Option value={item.value} key={item.value}>{item.label}</Option>)
                )
              }
            </Select>
          </div>
          <div className="search-field">
            <span className="label-name">补发数量</span>
            <NumberPicker
              value={curGoodsNum}
              onChange={this.handleFilterChange('curGoodsNum', 'selectedSingleGoodsData')}
              step={0.01}
              stringMode
              min={0}
            />
          </div>
          <div className="search-field">
            <span className="label-name">补发备注</span>
            <Input
              hasClear
              value={curRemark}
              onChange={this.handleFilterChange('curRemark', 'selectedSingleGoodsData')}
            />
          </div>
          <Button type="secondary" onClick={this.handleSingleGoodsAdd}>确定</Button>
        </div>
        <div className="goods-list-content">
          {this.GoodsTableJsx()}
        </div>
        <div className="btn-list">
          <Button type="primary"
            style={{ 'margin-right': '8px' }}
            onClick={() => this.handleOk()}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  }

  handleSingleGoodsAdd(isEnter = false, callback = () => { }) {
    const { selectedSingleGoodsData, goodsTableData, orderGoodsMap } = this.state;
    const { curGoodsId, curGoodsNum, curRemark } = selectedSingleGoodsData;
    if (!curGoodsId) {
      return this.showMessage('error', '', '请选择要添加的商品');
    }
    if (!curGoodsNum) {
      return this.showMessage('error', '', '请选择商品数量')
    }
    const existGoodsId = goodsTableData.map(item => item.goodsId);
    if (existGoodsId.includes(curGoodsId)) {
      this.showMessage('error', '', '该商品已经添加过了');
      return;
    }
    this.setState({
      goodsTableData: [
        {
          goodsId: curGoodsId,
          goodsName: orderGoodsMap[curGoodsId],
          resendNum: curGoodsNum,
          remark: curRemark
        },
        ...goodsTableData
      ],
      selectedSingleGoodsData: {
        curGoodsId: '',
        curGoodsNum: '',
        curRemark: ''
      }
    })

  }


  // 商品清单表格
  GoodsTableJsx() {
    const { Table, Button, NumberPicker, Input } = window.Next;
    const { goodsTableData } = this.state;
    let column = [
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '补发商品名', dataIndex: 'goodsName' },
      { title: '补发数量', dataIndex: 'resendNum' },
      { title: '补发备注', dataIndex: 'remark', width: 220 },

    ]
    const goodsTableCellRender = (dataIndex) => {
      return (value, index, record) => {
        if (dataIndex === 'resendNum') {
          // console.log('goodsTableCellRender', record)
          return (
            <NumberPicker
              value={value}
              onChange={(newValue) => { this.handleOrderNumChange(index, newValue, record) }}
              step={0.01}
              min={0}
            />
          );
        } else if (dataIndex === 'index') {
          return <span>{index + 1}</span>
        } else {
          return (
            <Input.TextArea
              placeholder="请输入备注"
              value={value}
              onChange={(newValue) => { this.batchGoodsRowChange(index, 'remark', newValue, 'goodsTableData') }}
            />
          );
        }
      }
    }
    const oprRender = (value, index, record) => {
      const oprList = [];
      // console.log('editData', editData)
      // if (editData.source === '后台' || !editData.source) {
      oprList.push({ key: 'delGoods', name: '删除', display: true })
      // }
      return (<div className={'opr-button'}>
        {oprList.map((item) => {
          return (<Button type="primary"
            key={item.key}
            style={{ 'margin-right': '8px', 'color': 'red' }}
            onClick={() => this.handleGoodsTableOperate(value, index, record, item.key)}
            text={true}>
            {item.name}
          </Button>)
        })}
      </div>)
    }
    return <Table.StickyLock
      dataSource={this.state.goodsTableData}
      loading={this.state.goodsTableLoading}
    >
      {column.map((item, index) => {
        if (['resendNum', 'remark', 'index'].includes(item.dataIndex)) {
          return (<Table.Column align='center' cell={goodsTableCellRender(item.dataIndex)} title={item.title} width={item.width ? item.width : 120} dataIndex={item.dataIndex} key={item.dataIndex} />)
        } else {
          return (<Table.Column align='center' title={item.title} width={item.width ? item.width : 120} dataIndex={item.dataIndex} key={item.dataIndex} />)
        }
      })}
      {
        <Table.Column cell={oprRender} dataIndex="opr" width={200} lock="right" title="操作" />
      }
    </Table.StickyLock>
  }
  // 商品操作按钮
  handleGoodsTableOperate(value, index, record, type) {
    // console.log('oprData', value, index, record, type)
    switch (type) {
      case 'delGoods':
        this.delGoods(index, record)
        break
    }
  }
  delGoods(index, record) {
    const { Dialog } = window.Next;
    Dialog.confirm({
      title: "确认",
      content: "是否删除当前数据",
      onOk: () => {
        this.delGoodsConfirm(index, record)
      },
      onCancel: () => console.log("cancel")
    });
  }
  delGoodsConfirm(index, record) {
    const { goodsTableData } = this.state;
    goodsTableData.splice(index, 1)
    // console.log('delGoodsConfirm', index, record)
    this.setState({
      goodsTableData
    })
  }
  handleOrderNumChange(index, newValue, record) {

    this.batchGoodsRowChange(index, 'resendNum', newValue, 'goodsTableData');
  }

  // 修改行数据
  batchGoodsRowChange(index, field, value, pathName = 'batchGoodsTableData') {
    // const { batchGoodsTableData } = this.state;
    const pathValue = this.state[pathName];
    pathValue[index][field] = value;
    this.setState({
      [pathName]: pathValue
    }, () => {
      console.log('batchGoodsRowChange', this.state[pathName])
    })
  }

  debounce(fn, timerFields, delay = 1000) {
    if (this.chineseInput) {
      this.waitExcuteFn = fn;
      return;
    }
    if (this[timerFields]) {
      clearTimeout(this[timerFields])
    }
    this[timerFields] = setTimeout(() => {
      fn();
    }, delay)
  }

  async handleOk() {
    const { formData: { orderID }, goodsTableData, currentUser } = this.state;
    if (!orderID) {
      this.showError('请输入订单号');
      return;
    }
    if (goodsTableData.length <= 0) {
      this.showError('请添加需要补发的商品');
      return;
    }
    // console.log('formData', formData)
    try {
      const goodsList = goodsTableData.map(item => {
        const { goodsId, resendNum, remark } = item;
        return {
          goodsId, resendNum: Number(resendNum), remark
        }
      })
      const params = {
        createBy: currentUser.id,
        createBy_user: currentUser.nickName,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        orderID,
        goodsList
      }
      // console.log('params', params)
      //   window.parent.postMessage('123', '*')
      // return;
      const res = await this.dataSourceMap['orderReSend'].load(params);
      console.log('res', res)
      const { success, message } = res;
      if (success) {
        this.showSuccess('补发订单成功');
        setTimeout(() => {
          window.parent.postMessage('123', '*')
        },500)
      } else {
        throw Error(message || '补发订单失败')
      }
    } catch (e) {
      console.log('e', e)
      this.showError(e?.message || '订单补发失败')
    }

  }

  fiterChangeCallback(field, value, pathName) {
    if (field === 'orderID') {
      this.getGoodsList(value)
    }
  }
  async getGoodsList(orderID) {
    const { formMap: { orderDetail } } = this.state;
    let orderGoodsList = [];
    let orderGoodsMap = {};
    if (orderID) {
      const res = await this.newModel(orderDetail).conditions([
        {
          "conditionValues": [
            orderID
          ],
          "conditionOperator": "eq",
          "field": "orderID"
        }
      ]).select();
      if (Array.isArray(res.records)) {
        res.records.forEach(item => {
          const { goodsId, goodsName } = item;
          orderGoodsList.push({
            label: goodsName,
            value: goodsId
          })
          orderGoodsMap[goodsId] = goodsName;
        })
      }
      console.log('orderGoodsList', orderGoodsList)
      this.setState({
        orderGoodsList,
        orderGoodsMap
      })
      console.log('getGoodsListRes', res)
    }
  }

  //更新搜索字段值
  handleFilterChange(field, pathName = "tableDataFilterFields") {
    return (value) => {
      const pathNameValue = this.state[pathName];
      pathNameValue[field] = value
      this.setState({
        [pathName]: pathNameValue
      }, () => {
        console.log('handleFilterChange', this.state[pathName]);
        if (typeof this.fiterChangeCallback === 'function') {
          console.log('fiterChangeCallBack is function')
          this.fiterChangeCallback(field, value, pathName)
        }
      })
    }
  }
}