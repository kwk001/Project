import http;
import log;
import '@/common/getFormIdByCodes' as getFormIdByCodes;
import response;

// 接口名称：功能配置检查
// 接口类型：POST
// 接口路径：/api/config/func/check
// 接口功能：检查功能是否启用并执行表达式求值
// 
// 参数说明：
// - funcCode (String): body.funcCode 获取 - 功能编码
// - projectCode (String): body.projectCode 获取 - 项目编码，可选（用于全局功能查询）
// - context (Object): body.context 获取 - 表达式执行上下文，可选
//
// 返回值：
// {
//   code: 0,
//   data: {
//     enabled: true/false,    // 配置是否启用
//     value: true/false,      // 表达式求值结果
//     funcName: "功能名称",
//     expression: "表达式"
//   }
// }

try {
    var formMap = getFormIdByCodes(["CM_yewugongneng"]);
    
    var funcCode = body.funcCode;
    var projectCode = body.projectCode;
    var context = body.context || {};

    if (!funcCode) {
        return response.json({
            code: -1,
            message: '缺少必要参数：funcCode',
            data: null
        });
    }

    log.info('功能配置检查接口被调用，功能编码：{}，项目编码：{}', funcCode, projectCode);

    var authorization = (header && header.Authorization) || (header && header.authorization);

    // 构建查询条件
    var conditions = [{
        field: "funcCode",
        conditionOperator: "eq",
        conditionValues: [funcCode]
    }];

    // 如果传入 projectCode，优先查全局配置（scope=global）
    if (projectCode) {
        conditions.push({
            field: "projectCode",
            conditionOperator: "eq",
            conditionValues: [projectCode]
        });
        conditions.push({
            field: "scope",
            conditionOperator: "eq",
            conditionValues: ["global"]
        });
    }

    // 查询功能配置
    var requestBody = {
        formId: formMap['CM_yewugongneng'],
        conditionFilter: {
            conditionType: "and",
            conditions: conditions
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

    var funcConfig = null;
    if (result && result.code == 200 && result.result && result.result.records && result.result.records.size() > 0) {
        funcConfig = result.result.records.get(0);
    }

    // 如果全局配置未找到且传入了 projectCode，回退查页面级配置
    if (!funcConfig && projectCode) {
        log.info('全局配置未找到，回退查页面级配置');
        var fallbackRequestBody = {
            formId: formMap['CM_yewugongneng'],
            conditionFilter: {
                conditionType: "and",
                conditions: [{
                    field: "funcCode",
                    conditionOperator: "eq",
                    conditionValues: [funcCode]
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
        var fallbackResult = http.connect("http://kaiwu-form-engine-core:18666/formEngine/formData/query")
            .body(fallbackRequestBody)
            .header("Authorization", authorization)
            .post()
            .getBody();
        if (fallbackResult && fallbackResult.code == 200 && fallbackResult.result && fallbackResult.result.records && fallbackResult.result.records.size() > 0) {
            funcConfig = fallbackResult.result.records.get(0);
        }
    }
    
    if (!funcConfig) {
        return response.json({
            code: 0,
            data: { 
                enabled: false, 
                value: false, 
                reason: "配置不存在" 
            }
        });
    }
    
    if (funcConfig.funcStatus != "启用") {
        return response.json({
            code: 0,
            data: { 
                enabled: false, 
                value: false, 
                reason: "配置未启用",
                funcName: funcConfig.funcName
            }
        });
    }
    
    // 执行表达式求值
    var value = true;
    if (funcConfig.funcExpression) {
        try {
            // 合并配置参数和运行时上下文
            var params = {};
            if (funcConfig.expressionParams) {
                try {
                    params = JSON.parse(funcConfig.expressionParams);
                } catch (parseErr) {
                    log.warn('表达式参数解析失败：{}', parseErr.message);
                }
            }
            
            // 合并上下文
            var mergedContext = {};
            for (key, val in params) {
                mergedContext[key] = val;
            }
            for (key, val in context) {
                mergedContext[key] = val;
            }
            
            // 执行表达式
            // 注意：magic 环境中使用 eval 执行表达式
            value = eval(funcConfig.funcExpression);
        } catch (evalErr) {
            log.warn('表达式执行失败：{}', evalErr.message);
            value = false;
        }
    }
    
    return response.json({
        code: 0,
        data: {
            enabled: true,
            value: value,
            funcName: funcConfig.funcName,
            expression: funcConfig.funcExpression
        }
    });

} catch (e) {
    log.error('功能配置检查出错', e);
    return response.json({
        code: -1,
        message: '功能配置检查失败：' + e.message,
        data: null
    });
}