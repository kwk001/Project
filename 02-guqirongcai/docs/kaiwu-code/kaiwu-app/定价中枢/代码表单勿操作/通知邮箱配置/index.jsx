class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    "isShowDialog": false,
    quotationNoticeText: null, //报价通知单
    supplyNoticeText: null, //供货通知单
    formIdMap: {
      'haiju_tongzhiyouxiangpeizhi': ''
    },
    isEditData: []
  }
  componentDidMount() {
    console.log('did mount');
    const { renderQuill } = RichTextEditor;
    const quotationNoticeText = renderQuill('#_quotation_notice');
    const supplyNoticeText = renderQuill('#_supply_notice');
    this.setState({
      quotationNoticeText: quotationNoticeText,
      supplyNoticeText: supplyNoticeText
    },() =>{
      this.init();
    })
  }
  componentWillUnmount() {
    console.log('will unmount');
  }

  async init() {
    let formIdMapKeys = Object.keys(this.state.formIdMap);
    let codes = {
      codes: [...formIdMapKeys]
    }
    const res = await this.dataSourceMap['getIdByCode'].load(codes);
    if (res.result && res.result != null) {
      this.setState({
        formIdMap: res.result
      }, () =>{
        this.onSearchForm();
      })
    }
  }
  

  quotationNotice(){
    return <div class="richtexteditor-box">
      <div class="richtexteditor-box-tip">
        <span>*</span>
        注意事项：（报价通知单注意事项内容配置）
      </div>
      <div id='_quotation_notice'></div>
    </div>
	}

  supplyNotice() {
    return <div class="richtexteditor-box">
      <div class="richtexteditor-box-tip">
        <span>*</span>
        注意事项：（供货通知单注意事项内容配置）
      </div>
      <div id='_supply_notice'></div>
    </div>
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

	onSaveClick(){
    //报价通知单
    const quotationContents = this.state.quotationNoticeText.getContents();
    const quotationNotice = this.state.quotationNoticeText.getSemanticHTML();
    //供货通知单
    const supplyContents = this.state.supplyNoticeText.getContents();
    const supplyNotice = this.state.supplyNoticeText.getSemanticHTML();

    if (this.state.isEditData.length > 0) {
      let data = {
        data: {
          quotationContents,
          supplyContents,
          quotationNotice,
          supplyNotice
        },
        formId: this.state.formIdMap['haiju_tongzhiyouxiangpeizhi'],
        id: this.state.isEditData[0]._id
      }
      this.dataSourceMap["updateFormData"].load(data).then(res => {
        if (res.code === 200) {
          this.showMessage('success', '成功', '保存成功');
        }
      })
    } else {
      let data = {
        data: {
          quotationContents,
          supplyContents,
          quotationNotice,
          supplyNotice
        },
        formId: this.state.formIdMap['haiju_tongzhiyouxiangpeizhi']
      }
      this.dataSourceMap["addFormData"].load(data).then(res => {
        if (res.code === 200) {
          this.showMessage('success', '成功', '保存成功');
        }
      })
    }
	}

  onSearchForm() {
    let data = {
      conditionFilter: { conditionType: "and", conditions: [] },
      page: { current: 1, pages: 0, size: 99999, total: 1 },
      sorts: [],
      formId: this.state.formIdMap['haiju_tongzhiyouxiangpeizhi']
    }
    this.dataSourceMap["queryFormData"].load(data).then(res => {
      if (res.code === 200 && res.result.records != null) {
        let item = res.result.records[0];
        this.state.quotationNoticeText.setContents(item.quotationContents);
        this.state.supplyNoticeText.setContents(item.supplyContents);
        this.setState({
          isEditData: res.result.records
        })
      }
    })
  }

  setEdit(item) {
    let data = {
      formId: "t69d7569c7184860008baae28",
      conditionFilter: {
        conditionType: "and",
        conditions: [
          {
            conditionValues: [id],
            conditionOperator: "eq",
            field: "_id"
          }
        ]
      },
      page: { current: 1 },
    }
    this.dataSourceMap["queryFormData"].load(data).then(res => {
      if (res.code === 200 && res.result.records != null) {
        let item = res.result.records[0];
        
        
      }
    })
  }
}