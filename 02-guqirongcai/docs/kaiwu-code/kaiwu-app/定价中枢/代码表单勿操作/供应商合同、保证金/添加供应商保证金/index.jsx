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
    "isShowDialog": false,
    dataId:'',
    formMap:{
      "supplier_deposit":""
    },
    fileList:[],
    payableDeposi:0,
    uploadUrl: '/mainApi/processengine/app/application/upload',
    queryList:{
      "conditionFilter": { "conditionType": "and", "conditions": [] },
       page: { current : 1,
        pages: 0, 
        size: 10,
         total: 1 
         }
    },
    formData:{
    },
    customerId:'18cf494f6195740c4a5f0d6982bf5ec2'
  }
  
  componentDidMount() {
 
    this.init(() => {
      let dataId =   new URLSearchParams(window.location.search).get("dataId")
     // let dataId = '6655aac55b1fac00073dee29'
      if (!dataId) {
        window.Next.Message.error("缺少dataId")
        return
      }
      console.log("init ,,,,, ", dataId)
      this.setState({
        dataId,
        formData:{}

      }, this.queryDataById)

    })
    console.log('did mount');
  }
  onUploadSuccess(file, value) {
    this.setState({
      fileList: value
    })
  }
  onUploadError(res) {
    // window.Next.Message.error({
    //   title: "导入失败",
    //   duration: 10000
    // })
  }
  queryDataById( ){
    const { queryList, dataId,  formMap,formName} = this.state
    queryList.conditionFilter.conditions = [
       { "conditionValues": [dataId], "conditionOperator": "eq", "field": "_id" }
    ]
    queryList.formId = formMap.supplier_deposit

    this.dataSourceMap.queryFormData.load(queryList).then(res=>{
      if(res.code == 200){
        let formData = res.result.records[0];
        let deliveredDeposi = formData.deliveredDeposi || 0 
        debugger
        let payableDeposi = this.computerNumber(formData.payableDeposi, deliveredDeposi, "-")
        this.setState({
          payableDeposi,
          formData:{...res.result.records[0],payment:0,payment_date:null,file:''}
        })
      }
    })
  }
  componentWillUnmount() {
    console.log('will unmount');
  }
  

  async onSelectFile(file){
    const {formData} = this.state
    const formObj= new FormData()
    formObj.append('file', file[0].originFileObj)
    const resp = await fetch(
      this.state.uploadUrl
      , {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token')
        },
        body: formObj,
        redirect: "follow"
      })
    const res = await resp.json()
    if (res.code === 200) {
      const fileList = []
      file[0].fileName = res.result
      fileList.push(file[0])
      formData.file_url = [res.result]
      this.setState({
        fileList,
        formData
      })
    }
  }

	onClick(){
    const { formData, payableDeposi} = this.state
    if (!formData.payment){
       window.Next.Message.warning("金额不能为空")
       return 
    }
    if ( formData.payment <= 0) {
      window.Next.Message.warning("金额必须大于0")
      return
    }
    if (formData.payment > payableDeposi) {
      window.Next.Message.warning("金额不能大于应付金额")
      return
    }
    
    if (!formData.payment_date) {
      window.Next.Message.warning("日期不能为空")
      return
    }
    formData.payment_date = moment(formData.payment_date).format("YYYY-MM-DD")

 
    this.dataSourceMap.paymargins.load({
      "payment": formData.payment,
      "paymentDate": formData.payment_date,
      "file_url": formData.file_url,
      "type": "缴费",
      "dataId": formData._id
    }).then(e => {
       
        if(e.success){
          window.Next.Message.success("执行成功")
          window.parent.postMessage('123', '*')
          console.log("formData:", formData)
          formData.file_url = null
          formData.payment_date = null
          formData.payment = null
          this.setState({
            fileList:[],
            formData: formData
          })
        }
    })
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
	onOk(e){
    let {formData} = this.state
    formData.payment_date = e.format("YYYY-MM-DD")
    this.setState({
      formData
    })
	}

	onChangeFormData(e){
    let { formData } = this.state
    console.log(typeof e.payment_date)
    formData.payment_date = e.payment_date
    formData.payment  = e.payment 
    this.setState({
      formData: formData
    })
	}

  onClose() {
    let { formData } = this.state
    formData.file_url = null
    formData.payment_date = null
    formData.payment = null
    this.setState({
      fileList: [],
      formData: formData
    })
    window.parent.postMessage('123', '*')
  }
}