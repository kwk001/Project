class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    "isShowDialog": false,
    activeTab: 0,
    formIdMap: { 'haiju_shangpintupianguanli': ''},
    sourceData: [{ sourceName: 'haiju_shangpintupianguanli', formId: "", columns: [
      { title: '商品名称', dataIndex: 'productName' }]
    }],
    tableDataSource: [],
    queryConditions: {
      conditionFilter: {
        conditionType: "and", conditions: []
      },
      page: { current: 1, pages: 0, size: 10, total: 1 },
      sorts: [],
      formId: ""
    },
    searchData: [],
    isShowImgWrapper: false,
    imgTransform: { scale: 1, rotate: '0deg', marginLeft: '0px', marginTop: '0px', imgUrl: '', leftx: 0, lefty: 0, x: 0, y: 0}
  }
  componentDidMount() {
    console.log('did mount');
    this.init()
  }
  componentWillUnmount() {
    console.log('will unmount');
  }
  
  init() {
    let formIdMapKeys = Object.keys(this.state.formIdMap);
    let codes = {
      codes: [...formIdMapKeys]
    }
    this.dataSourceMap['getIdByCode'].load(codes).then(res => {
      if (res.result && res.result != null) {
        let sourceData = this.state.sourceData.map(m => {
          if (res.result[m.sourceName]) {
            m.formId = res.result[m.sourceName]
          }
          return m;
        });
        this.setState({
          formIdMap: res.result,
          sourceData: sourceData
        }, () => {
          this.getTableDataSource()
        })
      }
    })
  }

  //获取表格数据
  getTableDataSource(data) {
    const { sourceData, activeTab, queryConditions } = this.state;
    let isData = data ? data : []
    queryConditions.conditionFilter.conditions = [...isData];
    queryConditions.formId = sourceData[activeTab].formId;

    this.dataSourceMap['queryFormData'].load(queryConditions).then( async (res) => {
      if (res.success && res.result.records != null) {
        let lists = res.result.records;
        const picParam = {
          names: []
        }
        lists.map(item => {
          if (item.auxiliaryDiagram && item.auxiliaryDiagram.length) {
            picParam.names.push(...item.auxiliaryDiagram)
          }
          if (item.detailedDiagram && item.detailedDiagram.length) {
            picParam.names.push(...item.detailedDiagram)
          }
          if (item.mainImage && item.mainImage.length) {
            picParam.names.push(...item.mainImage)
          }
        })
        let listsFilter = [];
        const picRes = await this.dataSourceMap['getFileUrlList'].load(picParam)
        if (picRes.code === 200) {
          listsFilter = lists.map(m => {
            m._auxiliaryDiagram = [];
            m._detailedDiagram = [];
            m._mainImage = [];
            if (m.auxiliaryDiagram && m.auxiliaryDiagram.length) {
              m.auxiliaryDiagram.map(mp =>{
                if (picRes.result[mp]) {
                  m._auxiliaryDiagram.push(picRes.result[mp])
                }
              })
            }
            if (m.detailedDiagram && m.detailedDiagram.length) {
              m.detailedDiagram.map(mp => {
                if (picRes.result[mp]) {
                  m._detailedDiagram.push(picRes.result[mp])
                }
              })
            }
            if (m.mainImage && m.mainImage.length) {
              m.mainImage.map(mp => {
                if (picRes.result[mp]) {
                  m._mainImage.push(picRes.result[mp])
                }
              })
            }
            return m;
          })
        }
        queryConditions.page.total = res.result.total;
        this.setState({
          tableDataSource: listsFilter,
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

	renderTable(){
    const { tableDataSource, sourceData, activeTab } = this.state;
    const { Table, Button} = window.Next;

    const render = (value, index, record) => {
      return (<div class="table-button">
        <Button type="primary" text onClick={() => { this.onEditClick(record) }}>编辑</Button>
        <Button type="primary" text onClick={() => { this.onDeleteClick(record) }}>删除</Button>
      </div>)
    };
    const _mainImage = (value, index, record) => {
      return (<div class="table-button">
        {record._mainImage.map(m => <img onClick={(e) => { this.isShowImgWrapperClick(e, m) }} src={m} alt={m}/>)}
      </div>)
    };
    const _auxiliaryDiagram = (value, index, record) => {
      return (<div class="table-button">
        {record._auxiliaryDiagram.map(m => <img onClick={(e) => { this.isShowImgWrapperClick(e, m) }} src={m} alt={m} />)}
      </div>)
    };
    const _detailedDiagram = (value, index, record) => {
      return (<div class="table-button">
        {record._detailedDiagram.map(m => <img onClick={(e) => { this.isShowImgWrapperClick(e, m)}} src={m} alt={m} />)}
      </div>)
    };
    let cell = [
      { title: '主图', cell: _mainImage },
      { title: '辅图', cell: _auxiliaryDiagram },
      { title: '详情图', cell: _detailedDiagram },
      { title: '操作', cell: render, width: 90 }
    ]
    return (<div>
      <Table
        dataSource={tableDataSource}
        primaryKey={'_id'}
        columns={[...sourceData[activeTab].columns, ...cell]}>
      </Table>
    </div>)
	}

	onPageChange(val){
    this.state.queryConditions.page.current = val;
    this.setState({
      queryConditions: this.state.queryConditions
    }, () => {
      this.getTableDataSource(this.state.searchData)
    })
	}

	onSearch(val){
    const searchData = [];
    for (const key in val) {
      if (val[key] !== '' && val[key] !== null && val[key] !== undefined) {
        if (Object.prototype.toString.call(val[key]).slice(8, -1) === 'Array') {
          if (val[key].length) {
            searchData.push({
              conditionOperator: 'like', field: key, conditionValues: [...val[key]]
            })
          }
        } else {
          searchData.push({
            conditionOperator: 'like', field: key, conditionValues: [val[key]]
          })
        }
      }
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

	onReset(){
    let queryConditions = JSON.parse(JSON.stringify(this.state.queryConditions));
    queryConditions.page.current = 1;
    this.setState({
      queryConditions: queryConditions,
      searchData: []
    }, () => {
      this.getTableDataSource()
    })
	}

  //新增列表
	onAddClick(){
    const { sourceData, activeTab, searchData } = this.state;
    let formId = sourceData[activeTab].formId;

    KaiwuLowcodeDriver.exec('OPEN_FORM', {
      formId: formId,
      isEdit: false,
      formValue: {}
    }).then(res => {
      if (res.type !== 'cancel') {
        this.showMessage('success', '成功', '新增数据成功');
        this.getTableDataSource(searchData)
      }
    })
	}
  //编辑
  onEditClick(record) {
    const { sourceData, activeTab, searchData } = this.state;
    let formId = sourceData[activeTab].formId;

    KaiwuLowcodeDriver.exec('OPEN_FORM', {
      formId: formId,
      dataId: record._id,
      isEdit: true,
      formValue: {}
    }).then(res => {
      if (res.type !== 'cancel') {
        this.showMessage('success', '成功', '修改数据成功');
        this.getTableDataSource(searchData)
      }
    })
  }

  //删除
  onDeleteClick(record) {
    const { sourceData, activeTab, searchData } = this.state;
    let formId = sourceData[activeTab].formId;

    window.Next.Dialog.confirm({
      title: '删除确认',
      content: (<span style={{ 'font-size': '18px' }}>确定要删除该条数据？</span>),
      onOk: () => {
        const data = {
          formId: formId,
          data: {
            _id: [record._id]
          }
        }
        this.dataSourceMap['deleteFormData'].load(data).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.showMessage('success', '成功', '删除数据成功');
            this.getTableDataSource(searchData)
          }
        })
      },
      onCancel: () => {

      }
    })
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

  showImgWrapper() {
    const { Icon } = window.Next;
    const { isShowImgWrapper, imgTransform } = this.state;
    return (<div class="Img-wrapper" style={{ display: isShowImgWrapper ? 'block' : 'none'}} >
      <div class="Img-wrapper-mask" onClick={(e) => this.isShowImgWrapperClick(e)} ></div>
      <span class="Img-wrapper-close" onClick={(e) => this.isShowImgWrapperClick(e)}>
       <svg class="icon" width="32px" height="32.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M256 810.666667a42.666667 42.666667 0 0 1-30.293333-12.373334 42.666667 42.666667 0 0 1 0-60.586666l512-512a42.666667 42.666667 0 1 1 60.586666 60.586666l-512 512A42.666667 42.666667 0 0 1 256 810.666667zM768 810.666667a42.666667 42.666667 0 0 1-30.293333-12.373334l-512-512a42.666667 42.666667 0 0 1 60.586666-60.586666l512 512a42.666667 42.666667 0 0 1 0 60.586666A42.666667 42.666667 0 0 1 768 810.666667z" /></svg>
      </span>
      <div class="Img-wrapper-actions">
        <svg onClick={(e) => { this.imgTransformClick(e, 'zoomin')}} class="icon" width="32px" height="32.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M919.264 905.984l-138.912-138.912C851.808 692.32 896 591.328 896 480c0-229.376-186.624-416-416-416S64 250.624 64 480s186.624 416 416 416c95.008 0 182.432-32.384 252.544-86.208l141.44 141.44a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0.032-45.248zM128 480C128 285.92 285.92 128 480 128s352 157.92 352 352-157.92 352-352 352S128 674.08 128 480zM625.792 448H512v-112a32 32 0 0 0-64 0V448h-112a32 32 0 0 0 0 64H448v112a32 32 0 1 0 64 0V512h113.792a32 32 0 1 0 0-64z" /></svg>
        <svg onClick={(e) => { this.imgTransformClick(e, 'zoomout') }} class="icon" width="32px" height="32.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M919.264 905.984l-138.912-138.912C851.808 692.32 896 591.328 896 480c0-229.376-186.624-416-416-416S64 250.624 64 480s186.624 416 416 416c95.008 0 182.432-32.384 252.544-86.208l141.44 141.44a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0.032-45.248zM128 480C128 285.92 285.92 128 480 128s352 157.92 352 352-157.92 352-352 352S128 674.08 128 480zM625.792 448H336a32 32 0 0 0 0 64h289.792a32 32 0 1 0 0-64z" /></svg>
        <svg onClick={(e) => { this.imgTransformClick(e, 'zoomrestoration') }} t="1716530423827" class="icon icont" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8533" width="32" height="32"><path d="M850.611 868.605H173.389c-68.925 0-125-56.075-125-125V280.394c0-68.925 56.075-125 125-125h677.222c68.925 0 125 56.075 125 125v463.211c0 68.925-56.075 125-125 125zM173.389 205.394c-41.355 0-75 33.645-75 75v463.211c0 41.355 33.645 75 75 75h677.222c41.355 0 75-33.645 75-75V280.394c0-41.355-33.645-75-75-75H173.389z" p-id="8534" fill="#ffffff"></path><path d="M319.963 697.471c-13.807 0-25-11.193-25-25V352.502c0-13.807 11.193-25 25-25s25 11.193 25 25V672.47c0 13.807-11.193 25.001-25 25.001zM704.037 697.472c-13.807 0-25-11.193-25-25V352.503c0-13.807 11.193-25 25-25s25 11.193 25 25v319.968c0 13.807-11.193 25.001-25 25.001z" p-id="8535" fill="#ffffff"></path><path d="M511.888 447.709m-35 0a35 35 0 1 0 70 0 35 35 0 1 0-70 0Z" p-id="8536" fill="#ffffff"></path><path d="M511.888 576.046m-35 0a35 35 0 1 0 70 0 35 35 0 1 0-70 0Z" p-id="8537" fill="#ffffff"></path></svg>
        <svg onClick={(e) => { this.imgTransformClick(e, 'rotatel') }} class="icon" width="30px" height="30px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M908.48720032 836.6741102c37.87904276-45.69522717 66.24798509-97.36510995 84.31811727-153.57260514 18.077368-56.22920266 24.93841732-114.16968858 20.39212236-172.21075266-4.7083794-60.11196913-21.50716894-117.69645012-49.93182705-171.15431604-20.44277241-38.44850555-46.30955235-73.44405524-76.88036934-104.01487223-33.84938829-33.84938829-73.00339125-61.89778144-116.37373405-83.36660045-42.75022925-21.16274147-88.57859543-35.43983196-136.21158793-42.43619252-48.1467388-7.07161299-96.959901-6.52168756-145.08348488 1.63385931-49.76467902 8.43340378-97.86800218 24.86967664-142.97205909 48.85223621-39.94054116 21.23727123-76.32610086 47.76323803-108.32745002 78.95706276l0-92.08075602c0-9.71053479-3.73443173-18.79371879-10.51588557-25.57517405-6.54701259-6.54701259-15.19098004-10.15192216-24.33856379-10.15192145-19.21846369 0-34.85445078 16.02672298-34.85445078 35.7270955l0 182.04429716c0 9.71053479 3.73443173 18.79371879 10.51660965 25.57589672 6.54628922 6.54628922 15.1895333 10.15192216 24.33784113 10.15119878a33.9533 33.9533 0 0 0 11.63744531-2.04123838l165.78385489 0c19.21846369 0 34.85445078-16.02672298 34.85445078-35.7270955 0-9.71053479-3.73443173-18.79371879-10.51661036-25.57589741-6.54628922-6.54628922-15.1895333-10.15192216-24.33783971-10.15119879l-93.69290716 0c27.35664402-26.94854159 58.57868868-49.82907806 92.97004321-68.11628637 38.06862233-20.24089201 78.65098593-34.11711518 120.62046464-41.24154976 40.56716788-6.88709913 81.70813947-7.36394225 122.27892562-1.41967737 40.11854398 5.87841838 78.70742578 17.88561761 114.69428827 35.68874556 36.47962611 18.04697726 69.40137587 41.62288113 97.85063634 70.07358834 25.64897973 25.64897973 47.34862314 55.00706475 64.49690515 87.25949693 23.86967987 44.89276916 37.9673208 93.26092573 41.90218549 143.7614929 3.80172425 48.79869055-1.99492854 97.52719297-17.2300469 144.83312383-15.24163081 47.32691496-39.16123878 90.83980413-71.09312248 129.33172532-33.06936183 39.86239384-73.33189962 72.56634481-119.67111863 97.20519776-38.06862233 20.24089201-78.65098593 34.11711518-120.62046465 41.24154975-40.5664438 6.88637506-81.70669273 7.36394225-122.27820154 1.4189533-40.11854398-5.87841838-78.70742578-17.88561761-114.69428898-35.68874485-36.47890274-18.04625389-69.40137587-41.62288113-97.85063634-70.07214161-25.64825636-25.64825636-47.34789906-55.00634068-64.49690515-87.25949692-28.9601126-54.46654597-43.43401777-113.33828727-43.01867951-174.97919592 0.06439975-9.50865368-3.59477885-18.43988468-10.30242843-25.14753425-6.81763438-6.81763438-15.94133913-10.52312211-25.6916713-10.43556815-19.88705861 0.17944956-36.17427266 16.35812554-36.30668901 36.06501123-0.48769791 72.45997756 17.23583669 144.57986929 51.25599127 208.56085661 20.44349649 38.44922963 46.30955235 73.44405524 76.88036934 104.01487223 33.84938829 33.84938829 73.00339125 61.89778144 116.37445742 83.36732382 42.75095262 21.1620181 88.57859543 35.43983196 136.21158793 42.43619252 48.1467388 7.07161299 96.959901 6.52168756 145.08348559-1.63385861 49.76540239-8.43412715 97.86800218-24.86967664 142.97205908-48.85223621 54.92312906-29.20685609 102.65163471-67.99617014 141.85918191-115.29486588z" /></svg>
        <svg onClick={(e) => { this.imgTransformClick(e, 'rotater') }} class="icon iconr" width="30px" height="30px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M908.48720032 836.6741102c37.87904276-45.69522717 66.24798509-97.36510995 84.31811727-153.57260514 18.077368-56.22920266 24.93841732-114.16968858 20.39212236-172.21075266-4.7083794-60.11196913-21.50716894-117.69645012-49.93182705-171.15431604-20.44277241-38.44850555-46.30955235-73.44405524-76.88036934-104.01487223-33.84938829-33.84938829-73.00339125-61.89778144-116.37373405-83.36660045-42.75022925-21.16274147-88.57859543-35.43983196-136.21158793-42.43619252-48.1467388-7.07161299-96.959901-6.52168756-145.08348488 1.63385931-49.76467902 8.43340378-97.86800218 24.86967664-142.97205909 48.85223621-39.94054116 21.23727123-76.32610086 47.76323803-108.32745002 78.95706276l0-92.08075602c0-9.71053479-3.73443173-18.79371879-10.51588557-25.57517405-6.54701259-6.54701259-15.19098004-10.15192216-24.33856379-10.15192145-19.21846369 0-34.85445078 16.02672298-34.85445078 35.7270955l0 182.04429716c0 9.71053479 3.73443173 18.79371879 10.51660965 25.57589672 6.54628922 6.54628922 15.1895333 10.15192216 24.33784113 10.15119878a33.9533 33.9533 0 0 0 11.63744531-2.04123838l165.78385489 0c19.21846369 0 34.85445078-16.02672298 34.85445078-35.7270955 0-9.71053479-3.73443173-18.79371879-10.51661036-25.57589741-6.54628922-6.54628922-15.1895333-10.15192216-24.33783971-10.15119879l-93.69290716 0c27.35664402-26.94854159 58.57868868-49.82907806 92.97004321-68.11628637 38.06862233-20.24089201 78.65098593-34.11711518 120.62046464-41.24154976 40.56716788-6.88709913 81.70813947-7.36394225 122.27892562-1.41967737 40.11854398 5.87841838 78.70742578 17.88561761 114.69428827 35.68874556 36.47962611 18.04697726 69.40137587 41.62288113 97.85063634 70.07358834 25.64897973 25.64897973 47.34862314 55.00706475 64.49690515 87.25949693 23.86967987 44.89276916 37.9673208 93.26092573 41.90218549 143.7614929 3.80172425 48.79869055-1.99492854 97.52719297-17.2300469 144.83312383-15.24163081 47.32691496-39.16123878 90.83980413-71.09312248 129.33172532-33.06936183 39.86239384-73.33189962 72.56634481-119.67111863 97.20519776-38.06862233 20.24089201-78.65098593 34.11711518-120.62046465 41.24154975-40.5664438 6.88637506-81.70669273 7.36394225-122.27820154 1.4189533-40.11854398-5.87841838-78.70742578-17.88561761-114.69428898-35.68874485-36.47890274-18.04625389-69.40137587-41.62288113-97.85063634-70.07214161-25.64825636-25.64825636-47.34789906-55.00634068-64.49690515-87.25949692-28.9601126-54.46654597-43.43401777-113.33828727-43.01867951-174.97919592 0.06439975-9.50865368-3.59477885-18.43988468-10.30242843-25.14753425-6.81763438-6.81763438-15.94133913-10.52312211-25.6916713-10.43556815-19.88705861 0.17944956-36.17427266 16.35812554-36.30668901 36.06501123-0.48769791 72.45997756 17.23583669 144.57986929 51.25599127 208.56085661 20.44349649 38.44922963 46.30955235 73.44405524 76.88036934 104.01487223 33.84938829 33.84938829 73.00339125 61.89778144 116.37445742 83.36732382 42.75095262 21.1620181 88.57859543 35.43983196 136.21158793 42.43619252 48.1467388 7.07161299 96.959901 6.52168756 145.08348559-1.63385861 49.76540239-8.43412715 97.86800218-24.86967664 142.97205908-48.85223621 54.92312906-29.20685609 102.65163471-67.99617014 141.85918191-115.29486588z" /></svg>
      </div>
      <div class="Img-wrapper-canvas" >
        <img onMouseDown={(e) => { this.imageOnMouseDown(e) }} draggable="false" style={{ 'transform': `scale(${imgTransform.scale}) rotate(${imgTransform.rotate})`, marginLeft: imgTransform.marginLeft, marginTop: imgTransform.marginTop }} src={imgTransform.imgUrl} alt=""/>
      </div>
    </div>)
  }

  isShowImgWrapperClick(e, url) {
    // console.log(e, url)
    e.stopPropagation();
    const { isShowImgWrapper, imgTransform } = this.state;
    if (imgTransform.imgUrl = url) {
      imgTransform.imgUrl = url;
    }

    imgTransform.scale = 1;
    imgTransform.rotate = '0deg';
    imgTransform.marginLeft = '0px';
    imgTransform.marginTop = '0px';
    imgTransform.leftx = 0;
    imgTransform.lefty = 0;
    imgTransform.x = 0;
    imgTransform.y = 0;
    this.setState({
      imgTransform: imgTransform,
      isShowImgWrapper: !isShowImgWrapper
    })
  }

  imgTransformClick(e, actions) {
    const {imgTransform } = this.state;
    e.stopPropagation();
    switch (actions) {
      case 'zoomin':
        imgTransform.scale = imgTransform.scale < 2 ? imgTransform.scale += 0.1 : 2;
        break;
      case 'zoomout':
        imgTransform.scale = imgTransform.scale > 0.2 ? imgTransform.scale -= 0.1 : 0.2;
        break;
      case 'zoomrestoration':
        imgTransform.scale = 1;
        imgTransform.rotate = '0deg';
        break;
      case 'rotatel':
        let rotate = parseInt(imgTransform.rotate) - 90;
        imgTransform.rotate = rotate + 'deg';
        break;
      default:
        let rotater = parseInt(imgTransform.rotate) + 90;
        imgTransform.rotate = rotater + 'deg';
        break;
    }

    this.setState({
      imgTransform: imgTransform
    })
  }

  imageOnMouseDown(e) {
    const { imgTransform } = this.state;
    // console.log(e, e.pageX, e.pageY, e.target.offsetLeft, e.target.offsetTop)
    
    let pageXY = { x: e.pageX, y: e.pageY};

    const ismove = this.move.bind(this, pageXY);

    window.addEventListener("mousemove", ismove);

    const up = function() {
      window.removeEventListener('mousemove', ismove);
      window.removeEventListener('mouseup', up);
      let imgTransformx = JSON.parse(JSON.stringify(this.state.imgTransform));
      imgTransformx.leftx = imgTransformx.x;
      imgTransformx.lefty = imgTransformx.y;
      this.setState({
        imgTransform: imgTransformx
      })
    }
    
    window.addEventListener("mouseup", up)

    e.stopPropagation();
  }

  move(pageXY,e) {
    const { imgTransform} = this.state;
    let leftx = imgTransform.leftx;
    let lefty = imgTransform.lefty;
    let x = lefty + e.pageX - pageXY.x;
    let y = lefty + e.pageY - pageXY.y
    imgTransform.marginLeft = x + 'px';
    imgTransform.marginTop = y + 'px';
    imgTransform.x = x;
    imgTransform.y = y;
    
    this.setState({
      imgTransform
    })
    
  }
}