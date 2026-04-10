class LowcodeComponent extends Component {
    state = {
        formMap: {
            goods: '', // 商品基础表
            goodsSpecs: '', // 商品规格信息表
            goodsTypeTable: '', // 商品分类基础表
            supplier: '', // 供应商档案表
            delivery: '', // 配送方式
            measurementUnit: '', // 计量单位
            customerTypeManage: '', // 客户类型管理
            goods_price: '', // 商品价格表
            haiju_shangpinkucun: '', // 商品库存表
            orderDetail: '', // 销售订单详情表
            haiju_shangpinbiaoqianguanli: '', // 标签表
        },
        queryParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 10, total: 1 },
            sorts: [],
            formId: ""
        },
        baseQueryParam: {
            conditionFilter: { conditionType: "and", conditions: [] },
            page: { current: 1, pages: 0, size: 99999, total: 1 },
            sorts: [],
            formId: ""
        },
        searchParams: {
            goodsTypeId: '', // 商品分类
            isListing: '', // 是否上架
            goodsId: '', // 商品ID
        },
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
        totalElements: 0,
        tableData: [],
        showEditFlag: false,
        editType: 'add',
        goodsTypeList: [], // 商品分类list
        goodsTypeData: [],
        goodsList: [], // 商品list
        supplierList: [], // 供应商list
        deliveryList: [], // 配送方式list
        measurementUnitList: [], // 计量单位list
        customerTypeManageList: [], // 客户类型list
        userSelectList: [], // 人员list
        conditions: [],
        currentUser: {},
        importDialog: false,
        goodsForm: {
            goodsId: '', // 商品ID
            // goodsClassify: '', // 商品分类
            goodsName: '', // 商品名称
            goodsAlias: '', // 商品别名
            barCode: '', // 条形码
            goodsBrand: '', // 商品品牌
            goodsProducer: '', // 商品产地
            goodsLossRate: '', // 损耗率(%)
            // supplier: '', // 供应商
            outputTaxRate: '', // 销项税率(%)
            productShelfLife: '', // 商品保质期(天)
            standardProduct: '', // 标品
            outputInvoiceType: '', // 销项发票类型
            inputInvoiceType: '', // 进项发票类型
            inputTaxRate: '', // 进项税率
            // deliveryMethod: '', // 配送方式
            procurementManager: '', // 采购负责人
            procurementStandards: '', // 采购规格及标准
            // previewImage: '', // 预览图
            // detailedDiagramImage: '', // 详情图
            goodsTypeId: '', // 商品分类ID
            supplierId: '', // 供应商ID
            deliveryMethodId: '', // 配送方式ID
            textLabel: '', // 商品标签
            // isListing: '', // 是否上架
        },
        previewImageList: [],
        detailedDiagramImageList: [],
        specTableData: [],
        // customerFluctuation: [], // 客户类型价格浮动
        uploadUrl: '/mainApi/processengine/app/application/upload',
        newUploadUrl: '',
        uploadHeaders: {
            Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token')
        },
        isShowSpecAddFlag: true, // 控制能不能添加商品规格信息
        curEditData: {},
        showSpecDialogFlag: false,
        specDetailList: [],
        filePath: 'goods', // 海聚上传地址前缀
        orderDetail: [],
        textLabelList: [],
        detailedDescription: null, // 商品详情描述
        curEditor: null,
        showFloatingFlag: false, // 控制是否显示修改浮动率弹窗
        floatingForm: {
            floatingRateUp: 0, // 订单商品上浮率
            floatingRateDown: 0, // 订单商品下浮率
        },
        floatingFlag: 'BATCH', // BATCH 批量设置 SINGLE 单个商品设置
        privilegesList: [],
        canEditFloatRate: false,
    }
    componentDidMount() {
        this.init()
    }
    componentWillUnmount() {

    }
    async init() {
        let canEditFloatRate = false
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
        const operateRes = await this.queryOperatePermission(currentUser)
        const privilegesList = operateRes.buttonShowPrivs || []
        if (privilegesList.includes('设置浮动率')) {
            canEditFloatRate = true
        }
        this.setState({
            currentUser,
            formMap,
            privilegesList,
            canEditFloatRate,
            newUploadUrl: `/mainApi/apiProxy/${currentUser.customerId}/haiju/uploadToBucket`
        }, () => {
            // 初始化后续操作
            this.queryBaseData()
        })
    }
    // 查询操作权限
    async queryOperatePermission(currentUser) {
        const departmentIds = currentUser.department?.path?.split(",")
        const iframeParams = new URLSearchParams(window.location.search)
        const formId = iframeParams.get('id')
        // const formId = '69d7569c7184860008baae11'
        const searchParams = {
            departmentIds: departmentIds || [],
            entityId: formId,
            userId: currentUser.id,
            privCategories: ["PRIV_OPERATION", "PRIV_FIELD"]
        }
        const res = await this.dataSourceMap['getPrivileges'].load(searchParams)
        if (res.code === 200) {
            return res.result[formId]
        }
        return {}
    }
    // 查询基础信息
    async queryBaseData() {
        const { goodsTypeTable, goods, haiju_shangpinbiaoqianguanli } = this.state.formMap
        const searchParams = {
            searchList: [
                { formId: goodsTypeTable, conditions: [] },
                { formId: goods, conditions: [], showField: ['goodsId', 'goodsName'] },
                { formId: haiju_shangpinbiaoqianguanli, conditions: [] },
            ]
        }
        const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
        const goodsTypeData = res.data[goodsTypeTable]
        const goodsData = res.data[goods]
        const labelData = res.data[haiju_shangpinbiaoqianguanli]
        const tempLabel = labelData.map(e => e.labelName)
        const textLabelList = Array.from(new Set(tempLabel)).map(e => {
            return {
                label: e,
                value: e
            }
        })
        const goodsTypeList = this.dealGoodsTypeList(goodsTypeData, '--')
        const goodsList = this.dealGoodsList(goodsData)
        this.setState({
            goodsTypeList,
            goodsList,
            goodsTypeData,
            textLabelList
        }, () => {
            this.getTableData()
        })
    }

    // 新增数据
    async addNewData() {
        if (this.state.curEditor) {
            this.state.curEditor.destroy()
            this.state.curEditor = null
        }
        const { goodsTypeData, goodsTypeList, supplierList, deliveryList, measurementUnitList, userSelectList } = await this.getBaseData()
        let goodsForm = _.cloneDeep(this.state.goodsForm)
        for (const key in goodsForm) {
            goodsForm[key] = ''
        }
        const specTableData = [
            {
                unitType: '基础单位',
                measurementUnit: '',
                isDecimal: '是',
                minimumOrderQuantity: 0,
                salesChannels: ['B端', 'C端'],
                weight: 0,
                isSale: '否'
            }
        ]
        this.setState({
            goodsTypeData,
            goodsTypeList,
            supplierList,
            deliveryList,
            measurementUnitList,
            userSelectList,
            // customerTypeManageList,
            // customerFluctuation,
            editType: 'add',
            specTableData: [...specTableData],
            previewImageList: [],
            detailedDiagramImageList: [],
            goodsForm,
            showEditFlag: true,
        })
    }
    onReset() {
        this.setState({
            conditions: []
        }, () => {
            this.onPageChange(1)
        })
    }
    // 处理人员数据
    getUserSelectList(list) {
        const userList = []
        if (list && list.length) {
            const stack = list.slice()
            while (stack.length) {
                const top = stack.pop()
                if (top.children) {
                    for (const child of top.children) {
                        stack.push(child)
                    }
                }
                if (top.userDetails) {
                    for (const user of top.userDetails) {
                        const item = {
                            label: user.nickName,
                            value: user.id
                        }
                        userList.push(item)
                    }
                }
            }
        }
        return userList
    }
    // 获取商品详情基础数据
    async getBaseData() {
        const { goodsTypeTable, supplier, delivery, measurementUnit, customerTypeManage } = this.state.formMap
        const searchParams = {
            searchList: [
                { formId: goodsTypeTable, conditions: [] },
                { formId: supplier, conditions: [] },
                { formId: delivery, conditions: [] },
                { formId: measurementUnit, conditions: [] },
                // { formId: customerTypeManage, conditions: [] },
            ]
        }
        // 采购负责人，先拿系统人员，后期可能要做角色划分
        const userRes = await this.dataSourceMap['getUserList'].load()
        let userSelectList = []
        const innerDepts = userRes.result?.innerDepts || []
        const outDepts = userRes.result?.outDepts || []
        let innerList = this.getUserSelectList(innerDepts)
        let outerList = this.getUserSelectList(outDepts)
        userSelectList = [...innerList, ...outerList]

        const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
        // 商品分类
        const goodsTypeData = res.data[goodsTypeTable]
        const goodsTypeList = this.dealGoodsTypeList(goodsTypeData, '--')
        // 供应商
        const supplierData = res.data[supplier]
        const supplierList = supplierData.map(item => {
            return { label: item.supplierName, value: item.supplierId }
        })
        // 配送方式
        const deliveryData = res.data[delivery]
        const deliveryList = deliveryData.map(item => {
            return { label: item.deliveryMethod, value: item.deliveryMethodId }
        })
        // 计量单位
        const measurementUnitData = res.data[measurementUnit]
        const measurementUnitList = measurementUnitData.map(item => {
            return { label: item.unitName, value: item.unitName }
        })
        // 客户类型
        // const customerTypeManageList = res.data[customerTypeManage]

        return { goodsTypeData, goodsTypeList, supplierList, deliveryList, measurementUnitList, userSelectList }
    }

    // 商品详情表单数据发生改变
    onGoodsFormChange(e) {
        this.setState({
            goodsForm: e
        })
    }
    // 商品规格详情column
    getGoodsSpecsColumn() {
        return [
            { title: '商品规格ID', dataIndex: 'goodsTypeId' },
            { title: '商品ID', dataIndex: 'goodsId' },
            { title: '计量单位', dataIndex: 'measurementUnit' },
            { title: '单位类型', dataIndex: 'unitType' },
            // { title: '单位换算', dataIndex: 'unitConversion' },
            { title: '起订量', dataIndex: 'minimumOrderQuantity' },
            // { title: '库存类型', dataIndex: 'inventoryType' },
            // { title: '售卖库存', dataIndex: 'sellingInventory' },
            // { title: '可售库存', dataIndex: 'availableInventory' },
            { title: '规格描述', dataIndex: 'specificationDescription' },
            // { title: '长(cm)', dataIndex: 'length' },
            // { title: '宽(cm)', dataIndex: 'width' },
            // { title: '高(cm)', dataIndex: 'height' },
            { title: '重量(kg)', dataIndex: 'weight' },
            { title: '售卖渠道', dataIndex: 'salesChannels' },
            { title: '是否售卖', dataIndex: 'isSale' }
        ]
    }
    renderDescriptionJSX() {
        const { Editor, Toolbar } = window.WangEditorForReact

        const editorConfig = {
            MENU_CONF: {
                uploadImage: {
                    async customUpload(file, insertFn) {
                        let url = ''
                        let alt = ''
                        let href = ''
                        const formData = new FormData();
                        formData.append('file', file);
                        const resp = await fetch(
                            this.state.uploadUrl, {
                                method: 'POST',
                                cache: 'no-cache',
                                headers: {
                                    Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token')
                                },
                                body: formData,
                            })
                        const res = await resp.json()
                        if (res.code === 200) {
                            const name = res.result; // 假设服务器返回的URL字段为url
                            const picParams = {
                                names: [name]
                            }
                            const picRes = await this.dataSourceMap['getFileUrlList'].load(picParams)
                            if (picRes.code === 200) {
                                url = picRes.result[name]
                                href = picRes.result[name]
                                insertFn(url, alt, href)
                            }
                        }
                    },
                }
            }
        }
        const toolbarConfig = {
            // excludeKeys: ['uploadImage', 'uploadVideo', 'insertVideo', 'insertImage']
            excludeKeys: ['group-image', 'group-video']
        }
        const setEditor = (e) => {

            this.setState({
                curEditor: e
            })
        }
        const onChangeData = (editor) => {
            this.setState({
                detailedDescription: editor.getHtml()
            })
        }
        return (<div style={{ border: '1px solid #ccc' }}>
            <Toolbar
                editor={this.state.curEditor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
            />
            <Editor
                defaultConfig={editorConfig}
                value={this.state.detailedDescription}
                onCreated={setEditor}
                onChange={(editor) => onChangeData(editor)}
                mode="default"
                style={{ height: '300px', overflowY: 'hidden' }}
            />
        </div>)
    }
    getRef(ref) {
        this.quillRef = ref
    }
    initQuill() {
        const quill = this.quillRef.getEditor();
        quill.getModule('toolbar').addHandler('image', this.imageHandler);
    }
    imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
            const resp = await fetch(
                this.state.uploadUrl, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token')
                    },
                    body: formData,
                })
            const res = await resp.json()
            if (res.code === 200) {
                const name = res.result; // 假设服务器返回的URL字段为url
                const picParams = {
                    names: [name]
                }
                const picRes = await this.dataSourceMap['getFileUrlList'].load(picParams)
                if (picRes.code === 200) {
                    let imageUrl = picRes.result[name]
                    const quill = this.quillRef.getEditor();
                    const range = quill.getSelection(true);
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.style.maxWidth = '100%'; // 设置最大宽度
                    img.style.height = 'auto'; // 保持图片比例
                    quill.insertEmbed(range.index, 'image', imageUrl);
                    quill.insertEmbed(range.index + 1, 'html', `<br>`);
                    // quill.insertEmbed(range.index, 'image', imageUrl);
                }
            }

        };
    }
    handleDescriptionChange(e) {
        this.setState({ detailedDescription: e });
    }

    // 渲染商品规格信息
    renderGoodsTypeJSX() {
        const { Table, Button, NumberPicker, Select, Input, Checkbox, Radio } = window.Next
        const Option = Select.Option
        const { orderDetail, editType } = this.state
        const column = [
            { title: '', dataIndex: 'unitType' },
            { title: '计量单位', dataIndex: 'measurementUnit', width: 150 },
            // { title: '单位换算', dataIndex: 'unitConversion', width: 150 },
            { title: '是否小数下单', dataIndex: 'isDecimal', width: 200 },
            { title: '起订量', dataIndex: 'minimumOrderQuantity', width: 150 },
            // { title: '', dataIndex: 'inventoryType', width: 150 },
            // { title: '售卖库存', dataIndex: 'sellingInventory', width: 120 },
            // { title: '可售库存', dataIndex: 'availableInventory', width: 120 },
            { title: '规格描述', dataIndex: 'specificationDescription', width: 200 },
            // { title: '长(cm)', dataIndex: 'length', width: 120 },
            // { title: '宽(cm)', dataIndex: 'width', width: 120 },
            // { title: '高(cm)', dataIndex: 'height', width: 120 },
            { title: '重量(kg)', dataIndex: 'weight', width: 120 },
            { title: '售卖渠道', dataIndex: 'salesChannels', width: 150 },
            { title: '是否售卖', dataIndex: 'isSale', width: 120 }
        ]

        const deleteData = (value, index, record) => {
            const { specTableData } = this.state
            specTableData.splice(index, 1)
            this.setState({ specTableData })
        }
        // 数据改变时触发的操作
        const onChangeData = (e, record, dataIndex, index) => {
            record[dataIndex] = e
            // if (dataIndex === 'sellingInventory') {
            //     record['availableInventory'] = e
            // } else if (dataIndex === 'inventoryType') {
            //     record['sellingInventory'] = 0
            //     record['availableInventory'] = 0
            // }
            if (dataIndex === 'salesChannels') {
                if (record['salesChannels'].length === 0) {
                    record.isSale = '否'
                }
            }
            let specTableData = [...this.state.specTableData]
            specTableData[index] = record
            this.setState({
                specTableData
            }, () => {
                if (dataIndex === 'isSale') {
                    const len = this.state.specTableData.filter(item => item.isSale === '是').length
                    const isShowSpecAddFlag = len < 2
                    this.setState({ isShowSpecAddFlag })
                }
            })
        }
        const isDeleteDisabled = (record) => {
            return record.hasOwnProperty('goodsTypeId');
        }
        const isDisabled = (record) => {
            // return record.hasOwnProperty('goodsTypeId');
            let flag = false
            if (editType === 'add') {
                flag = false
            } else {
                if (record.hasOwnProperty('goodsTypeId')) {
                    // 有销售订单业务数据，不可以修改数据
                    const temp = orderDetail.filter(e => e.goodsTypeId === record.goodsTypeId)
                    if (temp && temp.length > 0) {
                        flag = true
                    }
                }
            }

            return flag
        }
        // 渲染每个字段
        const columnCell = (value, index, record, data) => {
            switch (data.dataIndex) {
                case 'unitType':
                    return record.unitType
                case 'measurementUnit':
                    return <Select onChange={(e) => onChangeData(e, record, data.dataIndex, index)}
                                   disabled={isDisabled(record)}
                                   value={record[data.dataIndex]}>
                        {this.state.measurementUnitList.map(item => {
                            return <Option value={item.value}>{item.label}</Option>
                        })}
                    </Select>

                case 'minimumOrderQuantity':
                    return <NumberPicker
                        precision={2}
                        onChange={(e) => onChangeData(e, record, data.dataIndex, index)}
                        value={record[data.dataIndex]}
                    />

                case 'specificationDescription':
                    return <Input
                        style={{ width: 160 }}
                        onChange={(e) => onChangeData(e, record, data.dataIndex, index)}
                        value={record[data.dataIndex]}
                    />
                // case 'length':
                // case 'width':
                // case 'height':
                case 'weight':
                    return <NumberPicker
                        precision={2}
                        onChange={(e) => onChangeData(e, record, data.dataIndex, index)}
                        value={record[data.dataIndex]}
                    />
                case 'salesChannels':
                    return <Checkbox.Group
                        value={record[data.dataIndex]}
                        onChange={(e) => onChangeData(e, record, data.dataIndex, index)}
                    >
                        <Checkbox value="B端">B端</Checkbox>
                        <Checkbox value="C端">C端</Checkbox>
                    </Checkbox.Group>
                case 'isDecimal':
                    return <Radio.Group
                        value={record[data.dataIndex]}
                        onChange={(e) => onChangeData(e, record, data.dataIndex, index)}
                    >
                        <Radio value="是">是</Radio>
                        <Radio value="否">否</Radio>
                    </Radio.Group>
                case 'isSale':
                    return <Radio.Group
                        value={record[data.dataIndex]}
                        disabled={record['salesChannels'].length === 0}
                        onChange={(e) => onChangeData(e, record, data.dataIndex, index)}
                    >
                        <Radio value="是">是</Radio>
                        <Radio value="否">否</Radio>
                    </Radio.Group>
                // case 'unitConversion':
                //     const component = <NumberPicker
                //         precision={2}
                //         disabled={isDisabled(record)}
                //         onChange={(e) => onChangeData(e, record, data.dataIndex)}
                //         defaultValue={record[data.dataIndex]}
                //     />
                //     return index > 0 ? component : ''
                // case 'inventoryType':
                //     return <Select onChange={(e) => onChangeData(e, record, data.dataIndex)} defaultValue={record[data.dataIndex]}>
                //         <Option value="不限制">不限制</Option>
                //         <Option value="自定义">自定义</Option>
                //     </Select>
                // case 'sellingInventory':
                //     if (record.inventoryType === '不限制') {
                //         return '-'
                //     } else {
                //         return <NumberPicker
                //             precision={2}
                //             onChange={(e) => onChangeData(e, record, data.dataIndex)}
                //             defaultValue={record[data.dataIndex]}
                //         />
                //     }
                // case 'availableInventory':
                //     if (record.inventoryType === '不限制') {
                //         return '-'
                //     } else {
                //         return <NumberPicker
                //             precision={2}
                //             disabled
                //             value={record[data.dataIndex]}
                //         />
                //     }
                default:
                    break
            }
        }
        const oprRender = (value, index, record) => {
            return (!isDeleteDisabled(record) && <Button type="primary"
                                                         onClick={() => deleteData(value, index, record)}
                                                         text={true}>
                删除
            </Button>)
        }
        // 添加规格信息逻辑
        const addSpecTableData = () => {
            let { specTableData } = this.state
            let specObj = {
                unitType: specTableData.length === 0 ? '基础单位' : '辅助单位',
                measurementUnit: '',
                // unitConversion: 0,
                isDecimal: '是',
                minimumOrderQuantity: 0,
                // inventoryType: '不限制',
                // sellingInventory: 0,
                // availableInventory: 0,
                salesChannels: [],
                // length: 0,
                // width: 0,
                // height: 0,
                weight: 0,
                isSale: '否'
            }
            specTableData.push(specObj)
            this.setState({ specTableData })
        }
        return (
            <div className={'spec-container'}>
                <div className={'table-box'}>
                    <Table.StickyLock
                        dataSource={this.state.specTableData}
                        primaryKey={'_id'}
                        hasBorder={true}
                    >
                        {column.map((item, index) => {
                            return (<Table.Column cell={(value, index, record) => columnCell(value, index, record, item)} title={item.title} width={item.width ? item.width : 100} dataIndex={item.dataIndex} key={item.dataIndex} />)
                        })}
                        <Table.Column cell={oprRender} dataIndex="opr" width={200} lock="right" title="操作" />
                    </Table.StickyLock>
                </div>
                {
                    this.state.isShowSpecAddFlag && <div className={'add-spec-box'} onClick={addSpecTableData}>+ 添加一行数据</div>
                }

            </div>
        )
    }
    // 提交数据进行数据校验
    checkSubmit() {
        let flag = false
        let message = ''
        const fieldMap = {
            goodsId: '请输入商品ID',
            goodsTypeId: '请选择商品分类',
            goodsName: '请输入商品名称',
            outputTaxRate: '请输入销项税率',
            standardProduct: '请选择标品',
            outputInvoiceType: '请选择销项发票类型',
            deliveryMethodId: '请选择配送方式'
        }
        const arr = Object.keys(fieldMap)
        const { goodsForm } = this.state
        for (let i = 0; i < arr.length; i++) {
            const field = arr[i]
            if (goodsForm[field] === null || goodsForm[field] === '' || goodsForm[field] === undefined) {
                flag = true;
                message = fieldMap[field]
                break
            }
        }
        return { flag, message }
    }
    checkSpecTableData() {
        let flag = false
        const { specTableData } = this.state
        if (specTableData.length) {
            let arr = [[], []]
            for (const item of specTableData) {
                if (item.salesChannels.length > 0) {
                    for (const info of item.salesChannels) {
                        if (info === 'B端') {
                            arr[0].push(info)
                        } else {
                            arr[1].push(info)
                        }
                    }
                }
            }
            if (arr[0].length >= 2 || arr[1].length >= 2) {
                // 在售卖的只能有一个B端和C端
                flag = true
            }

        }
        return flag
    }
    // 处理要提交的数据
    dealSubmitData() {
        const { goodsForm, specTableData, customerFluctuation } = this.state
        const otherField = {
            goodsClassify: '', // 商品分类
            supplier: '', // 供应商
            deliveryMethod: '', // 配送方式
            previewImage: [], // 预览图
            detailedDiagramImage: [], // 详情图
            isListing: '', // 是否上架
        }
        // 处理商品分类
        let goodsTypeItem = []
        this.getGoodsTypeName(goodsForm.goodsTypeId, goodsTypeItem)
        otherField.goodsClassify = goodsTypeItem.reverse().join('/')
        // 处理供应商名称
        if (goodsForm.supplierId) {
            const temp = this.state.supplierList.filter(item => item.value === goodsForm.supplierId)
            otherField.supplier = temp.length ? temp[0].label : ''
        }
        // 处理配送方式
        const tempDeliveryMethod = this.state.deliveryList.filter(item => item.value === goodsForm.deliveryMethodId)
        otherField.deliveryMethod = tempDeliveryMethod.length ? tempDeliveryMethod[0].label : ''
        // 处理预览图
        if (this.state.previewImageList.length > 0) {
            otherField.previewImage = this.state.previewImageList.map(item => item.fileName)
        }
        // 处理详情图
        if (this.state.detailedDiagramImageList.length > 0) {
            otherField.detailedDiagramImage = this.state.detailedDiagramImageList.map(item => item.fileName)
        }
        // 是否上架
        if (this.state.editType === 'add') {
            otherField.isListing = '已下架'
        } else {
            const curEditData = this.state
            otherField.isListing = curEditData.isListing
        }
        const form = { ...goodsForm, ...otherField }
        return { form }
    }
    getGoodsTypeName(typeId, arr) {
        const list = this.state.goodsTypeData.filter(item => item.goodsTypeId === typeId)
        if (list.length) {
            arr.push(list[0].typeName)
            if (list[0].parentGoodsTypeId !== '--') {
                return this.getGoodsTypeName(list[0].parentGoodsTypeId, arr)
            }
        }
        return arr
    }
    async updateGoodsPriceTemp() {
        const goodsSpecsList = [...this.state.specTableData]
        let map = {
            bChannel: null,
            cChannel: null
        }
        for (const item of goodsSpecsList) {
            if (item.salesChannels.indexOf('B端') > -1) {
                map.bChannel = item
            }
            if (item.salesChannels.indexOf('C端') > -1) {
                map.cChannel = item
            }
        }
        const baseSpec = goodsSpecsList.filter(e => e.unitType === '基础单位')
        // 这个时候说明没有勾选B端和C端的数据
        if (map.bChannel === null) {
            map.bChannel = baseSpec[0]
        }
        if (map.cChannel === null) {
            map.cChannel = baseSpec[0]
        }
        console.log('map', map)
    }
    // 提交新增商品/编辑商品结束后更新商品价格表基础数据
    async updateGoodsPriceData(goodsId) {
        // 开始更新商品价格表，进行差异化更新
        const { goodsSpecs, goods_price } = this.state.formMap
        let goodsSpecsList = []
        let goodsPriceList = []
        const searchParams = {
            searchList: [
                { formId: goodsSpecs, conditions: [{ goodsId }] },
                { formId: goods_price, conditions: [{ goodsCode: goodsId }] }
            ]
        }
        const res = await this.getMoreTableData(searchParams)
        if (res.hasOwnProperty(goodsSpecs)) {
            goodsSpecsList = res[goodsSpecs]
        }
        if (res.hasOwnProperty(goods_price)) {
            goodsPriceList = res[goods_price]
        }
        // const updateData = []
        // const addData = []
        let map = {
            bChannel: null,
            cChannel: null
        }
        for (const item of goodsSpecsList) {
            if (item.salesChannels.indexOf('B端') > -1) {
                map.bChannel = item
            }
            if (item.salesChannels.indexOf('C端') > -1) {
                map.cChannel = item
            }
        }
        const baseSpec = goodsSpecsList.filter(e => e.unitType === '基础单位')
        // 这个时候说明没有勾选B端和C端的数据
        if (map.bChannel === null) {
            map.bChannel = baseSpec[0]
        }
        if (map.cChannel === null) {
            map.cChannel = baseSpec[0]
        }
        if (this.state.editType === 'add') {
            // 新增商品进行直接新增 不管有没有勾选B端C端，给商品价格维护两条基础数据 B端和C端
            let addData = [
                {
                    goodsCode: goodsId,
                    profitRate: 5,
                    breakevenPoint: 16.82,
                    goodsSpecsId: map.bChannel.goodsTypeId,
                    salesChannel: 'B端'
                },
                {
                    goodsCode: goodsId,
                    profitRate: 5,
                    breakevenPoint: 16.82,
                    goodsSpecsId: map.cChannel.goodsTypeId,
                    salesChannel: 'C端'
                }
            ]
            const res = await this.dataSourceMap['addMoreFormData'].load({ formId: goods_price, datas: [...addData] })
            if (res.code === 200) {
                return { goodsSpecsList }
            }
        } else {
            if (goodsPriceList.length > 0) {
                // 这个时候要走更新
                // 编辑商品进行更新老数据
                let updateData = []
                const bItem = goodsPriceList.filter(e => e.salesChannel === 'B端')
                const cItem = goodsPriceList.filter(e => e.salesChannel === 'C端')
                if (bItem && bItem.length > 0) {
                    let obj = {
                        _id: bItem[0]._id,
                        goodsSpecsId: map.bChannel.goodsTypeId,
                    }
                    updateData.push(obj)
                }
                if (cItem && cItem.length > 0) {
                    let obj = {
                        _id: cItem[0]._id,
                        goodsSpecsId: map.cChannel.goodsTypeId,
                    }
                    updateData.push(obj)
                }
                if (updateData.length > 0) {
                    const res = await this.dataSourceMap['batchUpdate'].load({ formId: goods_price, datas: [...updateData] })
                    if (res.code === 200) {
                        return { goodsSpecsList }
                    }
                }
            } else {
                // 没有查询到数据，要走新增接口
                let sData = [
                    {
                        goodsCode: goodsId,
                        profitRate: 5,
                        breakevenPoint: 16.82,
                        goodsSpecsId: map.bChannel.goodsTypeId,
                        salesChannel: 'B端'
                    },
                    {
                        goodsCode: goodsId,
                        profitRate: 5,
                        breakevenPoint: 16.82,
                        goodsSpecsId: map.cChannel.goodsTypeId,
                        salesChannel: 'C端'
                    }
                ]
                const res = await this.dataSourceMap['addMoreFormData'].load({ formId: goods_price, datas: [...sData] })
                if (res.code === 200) {
                    return { goodsSpecsList }
                }
            }

        }
        // 之前老的更新逻辑，直接弃用
        // for (const item of goodsSpecsList) {
        //     const goodsPriceItem = goodsPriceList.filter(e => e.goodsSpecsId === item.goodsTypeId)
        //     if (goodsPriceItem.length) {
        //         const salesChannelsList = item.salesChannels
        //         if (salesChannelsList && salesChannelsList.length > 0) {
        //             for (const a of goodsPriceItem) {
        //                 if (!salesChannelsList.includes(a.salesChannel)) {
        //                     const updateObj = {
        //                         _id: a._id,
        //                         salesChannel: ''
        //                     }
        //                     updateData.push(updateObj)
        //                 }
        //             }
        //             for (const a of salesChannelsList) {
        //                 const cItem = goodsPriceItem.filter(e => e.salesChannel === a)
        //                 // 如果找到该规格ID的对应的售卖渠道的数据，则不进行更新
        //                 if (!cItem.length) {
        //                     // 没有找到售卖渠道的数据，则新增
        //                     const addObj = {
        //                         goodsCode: goodsId,
        //                         goodsSpecsId: item.goodsTypeId,
        //                         salesChannel: a
        //                     }
        //                     addData.push(addObj)
        //                 }
        //             }
        //         } else {
        //             // 这个时候是找到该规格ID的数据，但是没有售卖渠道，要吧数据置空
        //             for (const e of goodsPriceItem) {
        //                 const updateObj = {
        //                     _id: e._id,
        //                     salesChannel: ''
        //                 }
        //                 updateData.push(updateObj)
        //             }
        //         }
        //     } else {
        //         // 这个时候是新增操作，还要进行判断
        //         const salesChannelsList = item.salesChannels
        //         if (salesChannelsList.length > 0) {
        //             for (const e of salesChannelsList) {
        //                 const addObj = {
        //                     goodsCode: goodsId,
        //                     goodsSpecsId: item.goodsTypeId,
        //                     salesChannel: e
        //                 }
        //                 addData.push(addObj)
        //             }
        //         }
        //     }
        // }
        // // 所有数据处理完毕，进行数据提交
        // if (updateData.length || addData.length) {
        //     await Promise.all([
        //         addData.length && this.dataSourceMap['addMoreFormData'].load({ formId: goods_price, datas: [...addData] }),
        //         updateData.length && this.dataSourceMap['batchUpdate'].load({ formId: goods_price, datas: [...updateData] })
        //     ])
        // }
        // return { goodsSpecsList }
    }
    async getMoreTableData(searchParams) {
        const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
        const data = res.data
        if (typeof data === 'object' && data !== null) {
            return res.data
        } else {
            return null
        }
    }
    // 确认提交
    async confirmSubmit() {
        const { flag, message } = this.checkSubmit()
        if (flag) {
            this.showMessage('error', '错误', message)
            return
        }
        if (this.state.specTableData.length === 0) {
            this.showMessage('error', '错误', '请添加商品规格信息')
            return
        }
        const tableFlag = this.checkSpecTableData()
        if (tableFlag) {
            this.showMessage('error', '错误', '商品规格信息最多只能有一个B端和C端')
            return
        }
        // 开始处理要提交的数据
        const { form } = this.dealSubmitData()
        if (this.state.editType === 'add') {
            const addGoodsData = {
                goodsData: { ...form, detailedDescription: this.state.detailedDescription || '' },
                userId: this.state.currentUser.id,
                specData: []
            }
            for (const item of this.state.specTableData) {
                addGoodsData.specData.push({ ...item })
            }
            const addGoodsRes = await this.dataSourceMap['addGoods'].load(addGoodsData)
            if (addGoodsRes.code === 1) {
                this.showMessage('success', '成功', '新增商品成功')
                if (this.state.curEditor) {
                    this.state.curEditor.destroy()
                    this.state.curEditor = null
                }
                this.setState({
                    showEditFlag: false,
                    editType: 'add',
                    orderDetail: [],
                }, () => {
                    this.onPageChange(1)
                })
            } else {
                this.showMessage('error', '错误', addGoodsRes.message)
            }
        } else {
            const specTableData = _.cloneDeep(this.state.specTableData)
            const updateGoodsData = {
                id: this.state.curEditData._id,
                goodsData: {
                    ...form,
                    detailedDescription: this.state.detailedDescription || ''
                },
                userId: this.state.currentUser.id,
                specData: []
            }
            for (const item of specTableData) {
                let specObj = {
                    unitType: '',
                    measurementUnit: '',
                    isDecimal: '',
                    minimumOrderQuantity: 0,
                    specificationDescription: '',
                    salesChannels: [],
                    weight: 0,
                    isSale: '否'
                }
                for (const key in specObj) {
                    specObj[key] = item[key]
                }
                if (item.hasOwnProperty('_id')) {
                    // 此时是更新
                    updateGoodsData.specData.push({
                        _id: item._id,
                        specObj: { ...specObj }
                    })
                } else {
                    updateGoodsData.specData.push({
                        _id: null,
                        specObj: { ...specObj }
                    })
                }
            }
            const updateRes = await this.dataSourceMap['editGoods'].load(updateGoodsData)
            if (updateRes.code === 1) {
                this.showMessage('success', '成功', '商品信息更新成功')
                if (this.state.curEditor) {
                    this.state.curEditor.destroy()
                    this.state.curEditor = null
                }
                this.setState({
                    showEditFlag: false,
                    editType: 'add',
                    orderDetail: [],
                }, () => {
                    this.onPageChange(1)
                })
            } else {
                this.showMessage('error', '错误', updateRes.message)
            }
        }
    }
    async addShangpinKuncunData(goodsSpecsList, form) {
        const searchData = {
            searchList: [
                {formId: this.state.formMap.haiju_shangpinkucun, conditions: [{goodsId: form.goodsId}]}
            ]
        }
        const res = await this.dataSourceMap['queryMoreTableData'].load(searchData)
        const data = res.data[this.state.formMap.haiju_shangpinkucun] || []
        if (!data.length) {
            // 新增商品库存表
            let addKuncunData = {
                goodsId: form.goodsId,
                goodsName: form.goodsName,
                inventoryNum: 0,
                goodsTypeId: form.goodsTypeId,
                specificationId: '', // 基础单位
            }
            const temp = goodsSpecsList.filter(e => e.unitType === '基础单位')
            addKuncunData.specificationId = temp && temp.length > 0 ? temp[0].goodsTypeId : ''
            const addParams = {
                formId: this.state.formMap.haiju_shangpinkucun,
                data: {
                    ...addKuncunData
                }
            }
            const addRes = await this.dataSourceMap['addFormData'].load(addParams)
        }
    }
    // 取消提交
    cancelSubmit() {
        if (this.state.curEditor) {
            this.state.curEditor.destroy()
            this.state.curEditor = null
        }
        this.setState({
            showEditFlag: false,
            orderDetail: [],
        })
    }
    async newDealFileSelect(file, type) {
        const { filePath, newUploadUrl } = this.state
        const formData = new FormData()
        formData.append('file', file[0].originFileObj)
        formData.append('width', 400)
        formData.append('height', 400)
        formData.append('filePath', filePath)
        const resp = await fetch(
            newUploadUrl, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token')
                },
                body: formData,
            })
        const res = await resp.json()
        if (res.code === 200) {
            if (type === 'preview') {
                const previewImageList = [...this.state.previewImageList]
                file[0].fileName = res.result
                previewImageList.push(file[0])
                this.setState({
                    previewImageList: previewImageList
                })
            } else {
                const detailedDiagramImageList = [...this.state.detailedDiagramImageList]
                file[0].fileName = res.result
                detailedDiagramImageList.push(file[0])
                this.setState({
                    detailedDiagramImageList: detailedDiagramImageList
                })
            }

        }
        console.log('上传文件', res)
    }
    async dealFileSelect(file, type) {
        const formData = new FormData()
        formData.append('file', file[0].originFileObj)
        const resp = await fetch(
            this.state.uploadUrl, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    // 'Content-Type': 'multipart/form-data'
                    Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token')
                },
                body: formData,
            })
        const res = await resp.json()
        if (res.code === 200) {
            if (type === 'preview') {
                const previewImageList = [...this.state.previewImageList]
                file[0].fileName = res.result
                previewImageList.push(file[0])
                this.setState({
                    previewImageList: previewImageList
                })
            } else {
                const detailedDiagramImageList = [...this.state.detailedDiagramImageList]
                file[0].fileName = res.result
                detailedDiagramImageList.push(file[0])
                this.setState({
                    detailedDiagramImageList: detailedDiagramImageList
                })
            }

        }
    }
    onPreviewFileSuccess(e) {
        this.setState({
            previewImageList: e
        })
    }
    onDetailedFileSuccess(e) {
        this.setState({
            detailedDiagramImageList: e
        })
    }
    // 选择文件上传 => 预览图
    onSelectPreviewImage(file) {
        console.log(file)

        if (file[0].size > 1024 * 1024) {
            this.showMessage('error', '错误', '上传文件超过1MB, 请重新上传')
            return false
        }
        // this.dealFileSelect(file, 'preview')
        this.newDealFileSelect(file, 'preview')
    }
    // 选择文件上传 => 详情图
    async onSelectDetailedDiagramImage(file) {
        if (file[0].size > 1024 * 1024) {
            this.showMessage('error', '错误', '上传文件超过1MB, 请重新上传')
            return false
        }
        // this.dealFileSelect(file, 'detailedDiagram')
        this.newDealFileSelect(file, 'detailedDiagram')
    }
    dealParams() {
        let queryParam = _.cloneDeep(this.state.queryParam)
        queryParam.formId = this.state.formMap.goods
        queryParam.conditionFilter.conditions = [...this.state.conditions]
        return queryParam
    }
    // 查询筛选
    onSearch(event) {
        const conditions = []
        const searchParams = {
            goodsTypeId: '', // 商品分类
            isListing: '', // 是否上架
            goodsId: '', // 商品ID
        }

        for (const field in event) {
            if (event[field] != undefined && event[field] != '') {
                let query = {
                    conditionOperator: 'eq',
                    field,
                    conditionValues: [event[field]]
                }
                conditions.push(query)
                searchParams[field] = event[field]
            }
        }
        this.setState({
            conditions,
            searchParams
        }, () => {
            this.onPageChange(1)
        })
    }
    // 分页查询
    onPageChange(e) {
        let params = { ...this.state.queryParam }
        params.page.current = e
        this.setState({
            queryParam: params
        }, () => {
            this.getTableData()
        })
    }
    onPageSizeChange(e) {
        let params = { ...this.state.queryParam }
        params.page.size = e
        params.page.current = 1
        this.setState({
            queryParam: params
        }, () => {
            this.getTableData()
        })
    }
    // 表格多选选中
    onChangeRow(ids, records) {

    }
    // 处理附件
    dealAnnexName(result, fileNames) {
        const name = fileNames
        const index = name.indexOf('/')
        const name1 = name.substring(index + 1)
        const fileName = name1.replace(/_\d+/g, '')
        let obj = {
            name: fileName,
            state: 'done',
            url: result,
            fileName: name
        }
        return obj
    }
    // 编辑数据
    async editCurData(record) {
        console.log('this.state.curEditor---111', this.state.curEditor)
        if (this.state.curEditor) {
            this.state.curEditor.destroy()
            this.state.curEditor = null
        }
        const detail = record.detail
        const { goodsTypeData, goodsTypeList, supplierList, deliveryList, measurementUnitList, userSelectList } = await this.getBaseData()
        let goodsForm = _.cloneDeep(this.state.goodsForm)
        for (const key in goodsForm) {
            let value = detail[key]
            // if (key === 'textLabel') {
            //     value = detail[key] ? detail[key] : []
            // }
            goodsForm[key] = value
        }
        // 客户类型价格浮动
        // const customerFluctuation = detail.customerFluctuation
        // 商品详情图和预览图
        const previewImage = detail.previewImage || []
        const detailedDiagramImage = detail.detailedDiagramImage || []
        const previewImageList = []
        const detailedDiagramImageList = []
        const names = [...previewImage, ...detailedDiagramImage]
        let picList = {}
        // const picRes = await this.dataSourceMap['getFileUrlList'].load({ names })
        const picRes = await this.dataSourceMap['getFileUrlListNew'].load({ names })
        if (picRes.code === 200) {
            picList = { ...picRes.result }
        }
        for (const item of previewImage) {
            let obj = this.dealAnnexName(picList[item], item)
            previewImageList.push(obj)
        }
        for (const item of detailedDiagramImage) {
            let obj = this.dealAnnexName(picList[item], item)
            detailedDiagramImageList.push(obj)
        }
        // 查询规格信息
        let baseQueryParam = _.cloneDeep(this.state.baseQueryParam)
        baseQueryParam.formId = this.state.formMap.goodsSpecs
        baseQueryParam.conditionFilter.conditions = [
            { conditionOperator: 'eq', field: 'goodsId', conditionValues: [detail.goodsId] }
        ]

        const specRes = await this.dataSourceMap['queryFormData'].load(baseQueryParam)
        let specTableData = []
        let orderDetail = []
        if (specRes.code === 200 && specRes.result.records && specRes.result.records.length) {
            let temp = specRes.result.records
            const index = temp.findIndex(item => item.unitType === '基础单位')
            const item = temp[index]
            temp.splice(index, 1)
            temp.unshift(item)
            specTableData = [...temp]
            // 查询销售订单，用于判定编辑状态下能不能进行修改基础单位
            // 如果有业务数据，在编辑状态下则不能修改单位
            if (specTableData.length > 0) {
                const conditions = specTableData.map(e => {
                    return {
                        goodsTypeId: e.goodsTypeId
                    }
                })
                const searchParams = {
                    searchList: [
                        { formId: this.state.formMap.orderDetail, conditions, showField: ['orderID', 'goodsTypeId'] }
                    ]
                }
                const res = await this.dataSourceMap['queryMoreTableData'].load(searchParams)
                orderDetail = res.data[this.state.formMap.orderDetail] || []
            }
        }
        const len = specTableData.filter(item => item.isSale === '是').length
        const isShowSpecAddFlag = len < 2
        this.setState({
            goodsTypeData,
            goodsTypeList,
            supplierList,
            deliveryList,
            measurementUnitList,
            userSelectList,
            // customerTypeManageList,
            // customerFluctuation,
            isShowSpecAddFlag,
            editType: 'edit',
            previewImageList: [...previewImageList],
            detailedDiagramImageList: [...detailedDiagramImageList],
            curEditData: { ...detail },
            specTableData,
            goodsForm,
            orderDetail,
            detailedDescription: detail.detailedDescription || '',
            showEditFlag: true,
        })
    }
    // 删除数据
    deleteData(record) {
        const { goodsSpecs } = this.state.formMap
        window.Next.Dialog.confirm({
            title: '删除',
            content: (<span style={{ 'font-size': '16px' }}>确定要删除该条数据？</span>),
            onOk: async () => {
                const data = {
                    formId: this.state.formMap.goods,
                    data: {
                        _id: [record.detail._id]
                    }
                }
                const res = await this.dataSourceMap['deleteFormData'].load(data)
                if (res.code === 200) {
                    // 开始查询和删除商品规格信息表基础数据
                    const searchParams = {
                        searchList: [
                            { formId: goodsSpecs, conditions: [{ goodsId: record.detail.goodsId }] },
                        ]
                    }
                    let specsData = []
                    const searchRes = await this.getMoreTableData(searchParams)
                    if (searchRes.hasOwnProperty(goodsSpecs)) {
                        specsData = searchRes[goodsSpecs]
                    }
                    if (specsData.length > 0) {
                        const deleteData = {
                            formId: goodsSpecs,
                            data: {
                                _id: specsData.map(e => e._id)
                            }
                        }
                        const deleteRes = await this.dataSourceMap['deleteFormData'].load(deleteData)
                        if (deleteRes.code === 200) {
                            this.showMessage('success', '成功', '删除数据成功')
                            this.onPageChange(1)
                        }
                    } else {
                        this.showMessage('success', '成功', '删除数据成功')
                        this.onPageChange(1)
                    }
                } else {
                    this.showMessage('error', '错误', res.message)
                }
            },
            onCancel: () => {

            }
        })
    }
    // 关闭查看规格详情
    closeViewSpecData() {
        this.setState({
            showSpecDialogFlag: false
        }, () => {
            this.getTableData()
        })
    }
    // 改变售卖的状态
    async changeSaleStatus(rowRecord, type) {
        // 进行数据提交前的校验
        if (type === 'on') {
            let arr = []
            let flag = false
            for (const list of this.state.specDetailList) {
                const item = list.detail
                if (item.isSale === '是' && item.salesChannels.length > 0) {
                    arr = arr.concat(item.salesChannels)
                }
            }
            if (arr.length >= 2) {
                // 在售卖的只能有一个B端和C端
                flag = true
            }
            if (flag) {
                this.showMessage('error', '错误', '在售卖的只能有一个B端和C端')
                return
            }
        }
        // 开始更新数据
        const updateData = {
            formId: this.state.formMap.goodsSpecs,
            id: rowRecord.detail._id,
            data: {
                isSale: type === 'on' ? '是' : '否'
            }
        }
        const updateRes = await this.dataSourceMap['updateFormData'].load(updateData)
        if (updateRes.code === 200) {
            this.showMessage('success', '成功', '修改成功')
            const specDetailList = await this.getSpecTableData(this.state.curEditData)
            this.setState({ specDetailList })
        }
    }
    async getSpecTableData(detail) {
        // 查询规格信息
        let baseQueryParam = _.cloneDeep(this.state.baseQueryParam)
        baseQueryParam.formId = this.state.formMap.goodsSpecs
        baseQueryParam.conditionFilter.conditions = [
            { conditionOperator: 'eq', field: 'goodsId', conditionValues: [detail.goodsId] }
        ]
        const specRes = await this.dataSourceMap['queryFormData'].load(baseQueryParam)
        let specTableData = []
        if (specRes.code === 200 && specRes.result.records && specRes.result.records.length) {
            specTableData = [...specRes.result.records]
        }
        const specDetailList = []
        for (const item of specTableData) {
            let obj = {
                unitName: `${item.unitType}: ${item.measurementUnit}`,
                specificationDescription: item.specificationDescription, // 规格描述
                bPrice: '-',
                cPrice: '-',
                customerPrice: item.customerPrice || '暂未定价',
                minimumOrderQuantity: item.minimumOrderQuantity, // 起订量
                salesChannels: item.salesChannels ? item.salesChannels.join('/') : '-', // 售卖渠道
                sellingInventory: item.sellingInventory || '-',
                isSale: item.isSale,
                detail: { ...item }
            }
            if (item.salesChannels && item.salesChannels.length) {
                if (item.salesChannels.indexOf('B端') > -1) {
                    obj.bPrice = item.salePrice
                }
                if (item.salesChannels.indexOf('C端') > -1) {
                    obj.cPrice = item.salePrice
                }
            }
            specDetailList.push(obj)
        }
        return specDetailList
    }
    // 查看规格详情
    async viewSpecData(record) {
        const { detail } = record
        const specDetailList = await this.getSpecTableData(detail)
        this.setState({
            specDetailList,
            curEditData: { ...detail },
            showSpecDialogFlag: true
        })
    }
    // 修改是否上架
    changeStatus(record, type) {
        const message = type === 'on' ? '确定要上架该商品？' : '确定要下架该商品'
        window.Next.Dialog.confirm({
            title: '确认',
            content: (<span style={{ 'font-size': '16px' }}>{message}</span>),
            onOk: () => {
                const updateData = {
                    formId: this.state.formMap.goods,
                    id: record.detail._id,
                    data: {
                        isListing: type === 'on' ? '已上架' : '已下架'
                    }
                }
                this.dataSourceMap['updateFormData'].load(updateData).then(res => {
                    if (res.code === 200) {
                        this.showMessage('success', '成功', type === 'on' ? '上架成功' : '下架成功')
                        this.onPageChange(1)
                    }
                })
            },
            onCancel: () => {

            }
        })
    }
    // 操作按钮
    oprData(value, index, record, type) {
        switch (type) {
            case 'editData':
                this.editCurData(record)
                break
            case 'deleteData':
                this.deleteData(record)
                break
            case 'viewSpec':
                this.viewSpecData(record)
                break
            case 'changeOnStatus':
                this.changeStatus(record, 'on')
                break
            case 'changeOffStatus':
                this.changeStatus(record, 'off')
                break
            case 'settingFloatData': // 上下浮动率
                this.onSetSingleGoodsFloatData(record)
                break
            default:
                break
        }
    }
    // 渲染商品信息表格
    renderTableJSX() {
        const { Table, Button } = window.Next
        const column = [
            // { title: '商品图片', dataIndex: 'goodsPic' },
            { title: '商品名称', dataIndex: 'goodsName' },
            { title: '规格', dataIndex: 'specification' },
            { title: '计量单位', dataIndex: 'measurementUnit' },
            { title: '备注', dataIndex: 'remark' },
            // { title: '分类', dataIndex: 'goodsClassify' },
            // { title: '单位(B端/C端)', dataIndex: 'unit' },
            //{ title: '学校价', dataIndex: 'schoolPrice' },
            // { title: '销售价(B端/C端)', dataIndex: 'price' },
            // { title: '状态', dataIndex: 'goodsStatus' },
            // { title: '订单商品上浮率', dataIndex: 'floatingRateUp' },
            // { title: '订单商品下浮率', dataIndex: 'floatingRateDown' },
            // { title: '别名', dataIndex: 'goodsAlias' },
            { title: '创建时间', dataIndex: 'createTime' },
        ]
        const oprRender = (value, index, record) => {
            const oprList = [
                { key: 'editData', name: '编辑', display: true },
                { key: 'deleteData', name: '删除', display: true },
                // { key: 'settingFloatData', name: '设置浮动率', display: true },
                { key: 'viewSpec', name: '查看规格', display: true },
            ]
            if (this.state.canEditFloatRate) {
                oprList.push({ key: 'settingFloatData', name: '设置浮动率', display: true })
            }
            if (record.goodsStatus === '已下架') {
                oprList.push({ key: 'changeOnStatus', name: '上架', display: true })
            } else {
                oprList.push({ key: 'changeOffStatus', name: '下架', display: true })
            }
            return (<div className={'opr-button'}>
                {oprList.map((item, index) => {
                    return (<Button type="primary"
                                    key={item.key}
                                    style={{ 'margin-right': '8px' }}
                                    onClick={() => this.oprData(value, index, record, item.key)}
                                    text={true}>
                        {item.name}
                    </Button>)
                })}
            </div>)
        }
        return (<div className={'table-box'}>
            <Table.StickyLock
                dataSource={this.state.tableData}
                primaryKey={'id'}
                hasBorder={false}
                rowSelection={this.state.rowSelection}
            >
                {column.map((item, index) => {
                    return (<Table.Column title={item.title} width={item.width ? item.width : 100} dataIndex={item.dataIndex} key={item.dataIndex} />)
                })}
                <Table.Column cell={oprRender} dataIndex="opr" width={200} lock="right" title="操作" />
            </Table.StickyLock>
        </div>)
    }
    // 查询表格数据
    async getTableData() {
        let tableData = []
        const queryParams = this.dealParams()
        const { goods_price } = this.state.formMap
        let goodsPriceList = []
        const tableRes = await this.dataSourceMap['queryFormData'].load(queryParams)
        if (tableRes.code === 200) {
            this.setState({ totalElements: tableRes.result.total })
            if (tableRes.result.records && tableRes.result.records.length) {
                const list = tableRes.result.records
                // 获取商品规格信息
                const goodsIdList = list.map(item => item.goodsId)
                let baseQueryParam = _.cloneDeep(this.state.baseQueryParam)
                baseQueryParam.formId = this.state.formMap.goodsSpecs
                baseQueryParam.conditionFilter.conditions = [
                    { conditionOperator: 'eqa', field: 'goodsId', conditionValues: [...goodsIdList] }
                ]
                const specRes = await this.dataSourceMap['queryFormData'].load(baseQueryParam)
                let specList = []
                if (specRes.code === 200 && specRes.result.records && specRes.result.records.length) {
                    specList = [...specRes.result.records]
                }
                const bConditions = goodsIdList.map(e => {
                    return {
                        goodsCode: e,
                        salesChannel: "B端"
                    }
                })
                const searchParams = {
                    searchList: [
                        { formId: goods_price, conditions: [...bConditions] }
                    ]
                }
                const searchRes = await this.getMoreTableData(searchParams)
                if (searchRes.hasOwnProperty(goods_price)) {
                    goodsPriceList = searchRes[goods_price]
                }
                // 获取商品图片信息
                const imgArr = list.map(item => {
                    if (item.previewImage && item.previewImage.length > 0) {
                        return item.previewImage[0]
                    }
                }).filter(e => e)
                const picParam = {
                    names: [...imgArr]
                }
                let picList = {}
                // const picRes = await this.dataSourceMap['getFileUrlList'].load(picParam)
                const picRes = await this.dataSourceMap['getFileUrlListNew'].load(picParam)
                if (picRes.code === 200) {
                    picList = { ...picRes.result }
                }
                // 开始处理表格数据
                for (const item of list) {
                    let schoolPrice = ''
                    const curPrice = goodsPriceList.filter(e => e.goodsCode === item.goodsId)
                    if (curPrice && curPrice.length) {
                        const temp = curPrice[0]
                        if (temp['detailList'] && temp['detailList'].length) {
                            const aPrice = temp['detailList'].filter(e => e.saleType === 'CS202404190003')
                            if (aPrice && aPrice.length) {
                                schoolPrice = aPrice[0].salePrice
                            }
                        }
                    }
                    // 从specList中获取该商品的规格信息（基础单位）
                    const baseSpec = specList.find(e => e.goodsId === item.goodsId && e.unitType === '基础单位')
                    let obj = {
                        id: item._id,
                        goodsPic: '', // 商品图片
                        goodsName: item.goodsName, // 商品名称
                        specification: baseSpec ? baseSpec.specificationDescription || '-' : '-', // 规格
                        measurementUnit: baseSpec ? baseSpec.measurementUnit || '-' : '-', // 计量单位
                        remark: item.remark || '-', // 备注
                        goodsClassify: '', // 分类
                        unit: '-/-', // 单位(B端/C端)
                        price: '-/-', // 销售价(B端/C端)
                        goodsStatus: item.isListing, // 状态
                        schoolPrice, // 学校价
                        goodsAlias: item.goodsAlias, // 别名
                        floatingRateUp: item.floatingRateUp || '',
                        floatingRateDown: item.floatingRateDown || '',
                        createTime: item.createTime, // 创建时间
                        detail: { ...item }
                    }
                    let goodsTypeItem = []
                    this.getGoodsTypeName(item.goodsTypeId, goodsTypeItem)
                    obj.goodsClassify = goodsTypeItem.reverse().join('/')
                    // 显示预览图
                    if (item.previewImage && item.previewImage.length > 0) {
                        if (picList.hasOwnProperty(item.previewImage[0])) {
                            obj.goodsPic = picList[item.previewImage[0]]
                        }
                    }
                    // 处理B端和C端的单位 B端和C端的售价
                    const spec = specList.filter(e => e.goodsId === item.goodsId
                        && e.isSale === '是'
                        && e.salesChannels != null
                        && e.salesChannels.length > 0
                    )
                    if (spec.length) {
                        let unitArr = ['-', '-']
                        let priceArr = ['-', '-']
                        const bList = spec.filter(e => e.salesChannels.indexOf('B端') > -1)
                        const cList = spec.filter(e => e.salesChannels.indexOf('C端') > -1)
                        if (bList.length) {
                            unitArr[0] = bList[0].measurementUnit || '-'
                            priceArr[0] = bList[0].salePrice || '-'
                        }
                        if (cList.length) {
                            unitArr[1] = cList[0].measurementUnit || '-'
                            priceArr[1] = cList[0].salePrice || '-'
                        }
                        obj.unit = unitArr.join('/')
                        obj.price = priceArr.join('/')
                    }
                    tableData.push(obj)
                }
                this.setState({ tableData })
            } else {
                this.setState({ tableData: [], totalElements: 0 })
            }
        } else {
            this.setState({ tableData: [], totalElements: 0 })
        }

    }
    // 处理商品分类
    dealGoodsTypeList(data, parentId) {
        return data
            .filter(item => item.parentGoodsTypeId === parentId)
            .map(item => ({ label: item.typeName, value: item.goodsTypeId, children: this.dealGoodsTypeList(data, item.goodsTypeId) }))
    }
    // 处理商品列表
    dealGoodsList(data) {
        return data.map(item => {
            return {
                label: item.goodsName,
                value: item.goodsId
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

    setMomentLocale() {
        moment.locale('zh-cn', {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
                '_'
            ),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
                '_'
            ),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'YYYY/MM/DD',
                LL: 'YYYY年M月D日',
                LLL: 'YYYY年M月D日Ah点mm分',
                LLLL: 'YYYY年M月D日ddddAh点mm分',
                l: 'YYYY/M/D',
                ll: 'YYYY年M月D日',
                lll: 'YYYY年M月D日 HH:mm',
                llll: 'YYYY年M月D日dddd HH:mm',
            },
            meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
                    return hour;
                } else if (meridiem === '下午' || meridiem === '晚上') {
                    return hour + 12;
                } else {
                    // '中午'
                    return hour >= 11 ? hour : hour + 12;
                }
            },
            meridiem: function (hour, minute, isLower) {
                var hm = hour * 100 + minute;
                if (hm < 600) {
                    return '凌晨';
                } else if (hm < 900) {
                    return '早上';
                } else if (hm < 1130) {
                    return '上午';
                } else if (hm < 1230) {
                    return '中午';
                } else if (hm < 1800) {
                    return '下午';
                } else {
                    return '晚上';
                }
            },
            calendar: {
                sameDay: '[今天]LT',
                nextDay: '[明天]LT',
                nextWeek: function (now) {
                    if (now.week() !== this.week()) {
                        return '[下]dddLT';
                    } else {
                        return '[本]dddLT';
                    }
                },
                lastDay: '[昨天]LT',
                lastWeek: function (now) {
                    if (this.week() !== now.week()) {
                        return '[上]dddLT';
                    } else {
                        return '[本]dddLT';
                    }
                },
                sameElse: 'L',
            },
            dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'd':
                    case 'D':
                    case 'DDD':
                        return number + '日';
                    case 'M':
                        return number + '月';
                    case 'w':
                    case 'W':
                        return number + '周';
                    default:
                        return number;
                }
            },
            relativeTime: {
                future: '%s后',
                past: '%s前',
                s: '几秒',
                ss: '%d 秒',
                m: '1 分钟',
                mm: '%d 分钟',
                h: '1 小时',
                hh: '%d 小时',
                d: '1 天',
                dd: '%d 天',
                w: '1 周',
                ww: '%d 周',
                M: '1 个月',
                MM: '%d 个月',
                y: '1 年',
                yy: '%d 年',
            },
            week: {
                // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
                dow: 1, // Monday is the first day of the week.
                doy: 4, // The week that contains Jan 4th is the first week of the year.
            },
        })
    }
    // 单个设置上下浮动率
    onSetSingleGoodsFloatData(record) {
        const floatingRateUp = record?.floatingRateUp || 0
        const floatingRateDown = record?.floatingRateDown || 0
        const floatingForm = {
            floatingRateUp,
            floatingRateDown
        }
        console.log('record', record.detail)
        this.setState({
            floatingForm,
            showFloatingFlag: true,
            floatingFlag: 'SINGLE',
            curEditData: {...record.detail}
        })
    }
    // 批量设置上下浮动率
    onSetFloatData() {
        this.setState({
            showFloatingFlag: true,
            floatingFlag: 'BATCH'
        })
    }
    async onConfirmSettingFloatData() {
        const { floatingForm, currentUser, floatingFlag, curEditData } = this.state
        const { goods } = this.state.formMap
        console.log('floatingForm', floatingForm)
        if (floatingForm.floatingRateUp === '' || floatingForm.floatingRateUp === undefined || floatingForm.floatingRateUp === null) {
            this.showMessage('error', '错误', '请输入订单商品上浮率')
            return
        }
        if (floatingForm.floatingRateDown === '' || floatingForm.floatingRateDown === undefined || floatingForm.floatingRateDown === null) {
            this.showMessage('error', '错误', '请输入订单商品下浮率')
            return
        }
        // 开始请求接口 批量设置还是单个修改
        if (floatingFlag === 'BATCH') {
            // 批量设置
            const floatingData = {
                userId: currentUser.id,
                floatingRateUp: floatingForm.floatingRateUp,
                floatingRateDown: floatingForm.floatingRateDown,
            }
            const res = await this.dataSourceMap['settingGoodsFloatingRate'].load(floatingData)
            if (res.code == 1) {
                this.showMessage('success', '成功', '数据提交成功')
                this.onCancelSettingFloatData()
                this.onPageChange(1)
            } else {
                this.showMessage('error', '错误', res.message)
            }
        } else {
            // 单独修改
            const updateData = {
                formId: goods,
                id: curEditData._id,
                data: {
                    floatingRateUp: floatingForm.floatingRateUp,
                    floatingRateDown: floatingForm.floatingRateDown
                }
            }
            const res = await this.dataSourceMap['updateFormData'].load(updateData)
            if (res.code === 200) {
                this.showMessage('success', '成功', '数据提交成功')
                this.onCancelSettingFloatData()
                this.onPageChange(1)
            } else {
                this.showMessage('error', '错误', res.message)
            }
        }
    }
    onFloatingFormChange(e) {
        this.setState({
            floatingForm: e
        })
    }
    onCancelSettingFloatData() {
        this.setState({
            showFloatingFlag: false,
            floatingFlag: 'BATCH',
            floatingForm: {
                floatingRateUp: 0, // 订单商品上浮率
                floatingRateDown: 0, // 订单商品下浮率
            },
            curEditData: null
        })
    }
    onClickImport() {
        this.setState({
            importDialog: true
        })
    }
    onClose() {
        this.setState({
            importDialog: false
        })
    }
    onSelectFile(file) {
        const formData = new FormData();
        formData.append('goodsFile', file[0].originFileObj);
        return fetch(
            '/mainApi/apiProxy/tenant/haiju/importGoodsFile', {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    Authorization: 'Bearer ' + new URLSearchParams(location.search).get('token'),
                },
                body: formData,
            }).then(resp => resp.json()).then(res => {
            if (res.code === 200) {
                this.showMessage("success", "成功", "导入成功")
                this.setState({
                    importDialog: false
                })
                this.onPageChange(1)
            } else {
                this.showMessage("error", "错误", res.message || "导入失败")
            }
        });
    }

    renderTemplateUrl() {
        return <a href="https://kaiwu-cloud-01.oss-cn-beijing.aliyuncs.com/cdn/project/haiju/%E5%95%86%E5%93%81%E6%A1%A3%E6%A1%88%E5%9F%BA%E7%A1%80%E8%A1%A8%E6%A8%A1%E7%89%88.xlsx" >点我下载模版</a>
    }
    //导出
    onClickExport() {

        this.dataSourceMap['exportGoodsList'].load(this.state.searchParams).then(res => {
            let blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
            let fileName = '商品档案.xlsx'
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

        })
    }


    onClickExport2() {

        this.dataSourceMap['exportGoods'].load(this.state.searchParams).then(res => {
            if (res.code == 1) {

                let titles = ['商品ID',
                    '商品分类', '商品名称',
                    '销项税率(%)', '标品', '学校价格(元)',
                    '团购价格(元)', '销项发票类型', '是否上架',
                    '配送方式', '商品分类ID', '利润率（%）',
                    '盈亏平衡点（%）', '计量单位',
                    '是否小数下单', '采购规格及标准'];
                let list = res.data || []

                const { downLoadXLSX } = window.Xlsx;
                const cells = list.map(item => [
                    item.goodsId || '',
                    item.goodsClassify || '',
                    item.goodsName || '',
                    item.outputTaxRate || '',
                    item.standardProduct || '',
                    item.schoolPrice || '',
                    item.groupBuyPrice || '',
                    item.outputInvoiceType || '',
                    item.isListing || '',
                    item.deliveryMethodId || '',
                    item.goodsTypeId || '',
                    item.profitRate || '',
                    item.breakevenPoint || '',
                    item.measurementUnit || "",
                    item.isDecimal || "",
                    item.procurementStandards || ""
                ]);

                downLoadXLSX([titles, ...cells], `商品档案_导出.xlsx`);
                this.setState({
                    exportLoading: false
                })
            }
        })

    }
}
