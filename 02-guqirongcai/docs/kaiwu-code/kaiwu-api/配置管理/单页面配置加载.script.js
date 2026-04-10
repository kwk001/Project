import http;
import log;
import org.bson.Document;
import '@/common/getFormIdByCodes' as getFormIdByCodes;
import response;

// 接口名称：单页面配置加载
// 接口类型：POST
// 接口路径：/api/config/page/load
// 接口功能：加载指定页面的完整配置（功能配置、API配置、字典数据）
// 
// 参数说明：
// - pageCode (String): body.pageCode 获取 - 页面编码（instanceFormCode）
//
// 返回值：
// {
//   code: 0,
//   message: "加载成功",
//   data: {
//     formCode: "xxx",
//     formName: "页面名称",
//     isInstance: true/false,
//     baseFormCode: "xxx",
//     functions: [...],
//     apiRoutes: [...],
//     dictTypes: [...],
//     dictData: {...},
//     globalConfig: {              // 全局配置（项目级，跨应用共享）
//       functions: [...],          // 全局业务功能列表
//       dictTypes: [...]           // 全局字典类型列表
//     }
//   }
// }
//
// 性能优化说明：
// - 功能配置、API路由、字典类型直接从页面配置子表单获取
// - 全局配置从项目配置子表获取（globalFuncList、globalDictTypeList）
// - 仅需 2 次 HTTP 调用（页面配置 + 项目配置）
// - 子表单数据按状态过滤（启用）

try {
    var formMap = getFormIdByCodes([
        "CM_yemianpeizhi",
        "CM_xiangmupeizhi"
    ]);
    
    var pageCode = body.pageCode;
    
    if (!pageCode) {
        return response.json({
            code: -1,
            message: '缺少必要参数：pageCode',
            data: null
        });
    }
    
    log.info('单页面配置加载接口被调用，页面编码：{}', pageCode);

    var authorization = (header && header.Authorization) || (header && header.authorization);

    // ========== 1. 查询页面配置 ==========
    var requestBody = {
        formId: formMap['CM_yemianpeizhi'],
        conditionFilter: {
            conditionType: "and",
            conditions: [{
                field: "instanceFormCode",
                conditionOperator: "eq",
                conditionValues: [pageCode]
            }, {
                field: "formStatus",
                conditionOperator: "eq",
                conditionValues: ["启用"]
            }]
        },
        page: {
            current: 1,
            size: 1,
            pages: 0,
            total: 1
        },
        sorts: []
    };
    var result = http.connect("http://kaiwu-form-engine-core:18666/formEngine/formData/query")
        .body(requestBody)
        .header("Authorization", authorization)
        .post()
        .getBody();
    
    var pageConfig = null;
    if (result && result.code == 200 && result.result && result.result.records && result.result.records.size() > 0) {
        pageConfig = result.result.records.get(0);
    }
    
    if (!pageConfig) {
        return response.json({
            code: -1,
            message: '页面配置不存在或未启用：' + pageCode,
            data: null
        });
    }
    
    // 判断是否为实例页面
    var isInstance = pageConfig.instanceFormCode && 
                     pageConfig.instanceFormCode != pageConfig.formCode;
    var baseFormCode = pageConfig.formCode || pageCode;
    
    log.info('页面配置查询完成，是否实例页面：{}，基础页面：{}', isInstance, baseFormCode);

    // ========== 2. 从子表单获取功能配置（过滤启用状态）==========
    var mergedFuncs = [];
    if (pageConfig.funcConfigList) {
        for (func in pageConfig.funcConfigList) {
            if (func.funcStatus == "启用") {
                var funcItem = {};
                funcItem["funcCode"] = func.funcCode;
                funcItem["funcName"] = func.funcName;
                funcItem["funcStatus"] = func.funcStatus;
                funcItem["funcExpression"] = func.funcExpression;
                funcItem["expressionParams"] = func.expressionParams;
                funcItem["funcDesc"] = func.funcDesc;
                funcItem["formCode"] = func.funcConfigFormCode || baseFormCode;
                funcItem["scope"] = "page";
                mergedFuncs.push(funcItem);
            }
        }
    }
    
    log.info('功能配置加载完成，数量：{}', mergedFuncs.length);

    // ========== 3. 从子表单获取API路由配置（过滤启用状态）==========
    var mergedApis = [];
    if (pageConfig.apiUrlCfgList) {
        for (api in pageConfig.apiUrlCfgList) {
            if (api.apiStatus == "启用") {
                var apiItem = {};
                apiItem["apiName"] = api.apiName;
                apiItem["apiUrl"] = api.apiUrl;
                apiItem["locationValue"] = api.locationValue;
                apiItem["apiJson"] = api.apiJson;
                apiItem["apiStatus"] = api.apiStatus;
                apiItem["description"] = api.description;
                mergedApis.push(apiItem);
            }
        }
    }
    
    log.info('API配置加载完成，数量：{}', mergedApis.length);

    // ========== 4. 从子表单获取字典数据（过滤启用状态，按类型分组）==========
    var dictTypes = [];
    var dictData = {};
    if (pageConfig.dictTypeList) {
        for (dictItem in pageConfig.dictTypeList) {
            if (dictItem.dicStatus == "启用" && dictItem.dictType) {
                // 收集字典类型
                if (dictTypes.indexOf(dictItem.dictType) == -1) {
                    dictTypes.push(dictItem.dictType);
                }
                // 按类型分组字典数据
                var dictType = dictItem.dictType;
                if (!dictData[dictType]) {
                    dictData[dictType] = [];
                }
                dictData[dictType].push({
                    label: dictItem.dictItem,
                    value: dictItem.dictItemCode,
                    color: dictItem.color,
                    parentDictType: dictItem.parentDictType,
                    scope: "page"
                });
            }
        }
    }
    
    log.info('字典数据加载完成，类型数：{}', dictTypes.length);

    // ========== 5. 查询项目配置，获取全局业务功能和全局字典 ==========
    var globalFunctions = [];
    var globalDictTypes = [];

    var projectRequestBody = {
        formId: formMap['CM_xiangmupeizhi'],
        conditionFilter: {
            conditionType: "and",
            conditions: [{
                field: "status",
                conditionOperator: "eq",
                conditionValues: ["启用"]
            }]
        },
        page: {
            current: 1,
            size: 1,
            pages: 0,
            total: 1
        },
        sorts: []
    };
    var projectResult = http.connect("http://kaiwu-form-engine-core:18666/formEngine/formData/query")
        .body(projectRequestBody)
        .header("Authorization", authorization)
        .post()
        .getBody();

    if (projectResult && projectResult.code == 200 && projectResult.result && projectResult.result.records && projectResult.result.records.size() > 0) {
        var activeProject = projectResult.result.records.get(0);

        // 从项目配置子表获取全局业务功能
        if (activeProject.globalFuncList) {
            for (func in activeProject.globalFuncList) {
                if (func.funcStatus == "启用") {
                    globalFunctions.push({
                        funcCode: func.funcCode,
                        funcName: func.funcName,
                        funcStatus: func.funcStatus,
                        funcExpression: func.funcExpression || '',
                        expressionParams: func.expressionParams || '',
                        funcDesc: func.funcDesc || '',
                        scope: "global"
                    });
                }
            }
        }

        // 从项目配置子表获取全局字典类型
        if (activeProject.globalDictTypeList) {
            for (item in activeProject.globalDictTypeList) {
                if (item.dictType && item.dicStatus == "启用") {
                    if (globalDictTypes.indexOf(item.dictType) == -1) {
                        globalDictTypes.push(item.dictType);
                    }
                }
            }
        }
    }

    log.info('全局配置加载完成，功能数：{}，字典类型数：{}', globalFunctions.length, globalDictTypes.length);

    // ========== 6. 合并全局配置到页面配置 ==========

    // 6.1 合并全局功能（页面级已在构建时带 scope: "page"）
    var allFunctions = [];
    for (func in mergedFuncs) {
        allFunctions.push(func);
    }
    for (gFunc in globalFunctions) {
        // 全局功能已有 scope: "global"，检查是否被页面级覆盖
        var overridden = false;
        for (pFunc in mergedFuncs) {
            if (pFunc.funcCode == gFunc.funcCode) {
                overridden = true;
            }
        }
        if (!overridden) {
            allFunctions.push(gFunc);
        }
    }

    // 6.2 合并全局字典类型到页面字典类型
    var allDictTypes = [];
    for (dt in dictTypes) {
        allDictTypes.push(dt);
    }
    for (gType in globalDictTypes) {
        if (allDictTypes.indexOf(gType) == -1) {
            allDictTypes.push(gType);
        }
    }

    // 6.3 全局字典数据补充到 dictData（页面级已在构建时带 scope: "page"）
    if (projectResult && projectResult.code == 200 && projectResult.result && projectResult.result.records && projectResult.result.records.size() > 0) {
        var activeProjectForDict = projectResult.result.records.get(0);
        if (activeProjectForDict.globalDictTypeList) {
            for (item in activeProjectForDict.globalDictTypeList) {
                if (item.dictType && item.dicStatus == "启用") {
                    var gDictType = item.dictType;
                    if (!dictData[gDictType]) {
                        dictData[gDictType] = [];
                    }
                    // 仅添加全局字典类型的条目（带 scope 标识）
                    var exists = false;
                    for (existing in dictData[gDictType]) {
                        if (existing.value == item.dictItemCode && existing.scope == "global") {
                            exists = true;
                        }
                    }
                    if (!exists && item.dictItem) {
                        dictData[gDictType].push({
                            label: item.dictItem,
                            value: item.dictItemCode,
                            color: null,
                            parentDictType: null,
                            scope: "global"
                        });
                    }
                }
            }
        }
    }

    log.info('配置合并完成，功能总数：{}，字典类型总数：{}', allFunctions.length, allDictTypes.length);

    // ========== 7. 返回响应 ==========
    return response.json({
        code: 0,
        message: '页面配置加载成功',
        data: {
            formCode: pageCode,
            formName: pageConfig.instanceFormName || pageConfig.formName || pageCode,
            isInstance: isInstance,
            baseFormCode: isInstance ? baseFormCode : null,
            functions: allFunctions,
            apiRoutes: mergedApis,
            dictTypes: allDictTypes,
            dictData: dictData
            // globalConfig: {
            //     functions: globalFunctions,
            //     dictTypes: globalDictTypes
            // }
        }
    });

} catch (e) {
    log.error('单页面配置加载出错', e);
    return response.json({
        code: -1,
        message: '页面配置加载失败：' + e.message,
        data: null
    });
}