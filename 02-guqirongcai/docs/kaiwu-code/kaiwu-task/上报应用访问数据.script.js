import lombok.experimental.var;
import http;
import log;
import request;
import response;
import java.math.BigDecimal;
import java.math.RoundingMode;
import redis;
import org.springframework.data.redis.core.StringRedisTemplate;

try {
    var reportUrl = "https://lowcode.kaiwu.cloud/kaiwuApi/48bc0f70144629ca8b9a581a4c277f04/ioc/updateCustomerAppStat";
    var apiKey = "X-API-KEY";
    var apiValue = "5am7mor18gmro9gp3z46jm3b6hiq8epc";
    var dbFlowable = db.kw_flowable;
    var dbIdentity = db.kw_identity;

    // 当前时间
    var statDate = date_format(new Date()).substring(0, 10);

    // 查询企业数据
    String queryCustomerSql = """
        SELECT
            cus.id AS customer_id,
            cus.name AS customer_name,
            cus.cooperation_org AS cooperation_id,
            coo.name AS cooperation_name,
            coop.id AS parent_cooperation_id,
            coop.name AS parent_cooperation_name,
            coo.path AS cooperation_id_paths
        FROM
            customer cus
            INNER JOIN cooperation coo ON cus.cooperation_org = coo.id
            LEFT JOIN cooperation coop ON coo.parent_org = coop.id
        WHERE
            cus.del_flag = 0
            AND cus.status = 1
            AND coo.del_flag = 0
            AND coo.status = 1
    """;
    var customerArray = dbIdentity.select(queryCustomerSql);

    if (customerArray == null || customerArray.size() <= 0) {
        return;
    }

    for (customerObj in customerArray) {
        var customerId = customerObj["customer_id"];
        var customerName = customerObj["customer_name"];
        var cooperationId = customerObj["cooperation_id"];
        var cooperationName = customerObj["cooperation_name"];
        var parentCooperationId = customerObj["parent_cooperation_id"];
        var parentCooperationName = customerObj["parent_cooperation_name"];
        var cooperationIdPaths = customerObj["cooperation_id_paths"];

        // 应用使用次数 redis 缓存
        String cacheKey = "customer_app_views:" + customerId + "-" + statDate;
        var appIdScoreSet = StringRedisTemplate.opsForZSet().rangeWithScores(cacheKey, 0, -1);
        if (appIdScoreSet != null && appIdScoreSet.size() > 0) {
            appIdScoreSet.forEach(tuple => {
                // 应用ID
                // 注意：这种方式取出来的 Value 数据前后都会保留双引号，需要替换
                String appId = (tuple.getValue() || "").replace("\"", "");
                // 使用访问次数
                int appVisitCount = tuple.getScore()::int(0);
                if (appId == "") {
                    return;
                }
                // 根据应用 ID 查询应用信息
                String queryAppSql = """
                    SELECT * FROM app_application
                """;
                queryAppSql = queryAppSql + "WHERE id = #{appId}";
                var app = dbFlowable.selectOne(queryAppSql);
                if (app == null) {
                    return;
                }
                var appName = app["name"];
                // log.info("{} - {} - {}", appId, appVisitCount, appName);
                // 调用更新接口，上报数据
                var responseResult= http.connect(reportUrl).body({
                    dataArray: [{
                        customerId,
                        customerName,
                        cooperationId,
                        cooperationName,
                        parentCooperationId,
                        parentCooperationName,
                        cooperationIdPaths,
                        appId,
                        appName,
                        appVisitCount,
                        statDate
                    }]
                }).header(apiKey, apiValue).post().getBody()
                log.info("调用接口返回: {}",responseResult::stringify);
            });
        }
    }
} catch (e) {
    log.error("上报异常", e)
}