import lombok.experimental.var;
import http;
import log;
import request;
import response;
import java.math.BigDecimal;
import java.math.RoundingMode;

try {
    var reportUrl = "https://lowcode.kaiwu.cloud/kaiwuApi/48bc0f70144629ca8b9a581a4c277f04/ioc/updateCustomerStat";
    var apiKey = "X-API-KEY";
    var apiValue = "5am7mor18gmro9gp3z46jm3b6hiq8epc";
    var dbFlowable = db.kw_flowable;
    var dbIdentity = db.kw_identity;
    var dbDevice = db.postgresql_prod;
    // 数据库类型：MySQL or PostgreSQL
    var dbType = "MySQL";

    var tableNameUser;
    if (dbType == "PostgreSQL") {
        tableNameUser = "public.user";
    } else if (dbType == "MySQL") {
        tableNameUser = "user";
    } else {
        log.error("数据库类型未知");
        return;
    }

    // 当前日期时间 yyyy-MM-dd HH:mm:ss
    var nowDateTime = date_format(new Date());

    // 查询企业数据
    String queryCustomerSql = """
        SELECT
            cus.id AS customer_id,
            cus.name AS customer_name,
            cus.cooperation_org AS cooperation_id,
            coo.name AS cooperation_name,
            coop.id AS parent_cooperation_id,
            coop.name AS parent_cooperation_name,
            coo.path AS cooperation_id_paths,
            cus.province,
            cus.city,
            cus.district,
            cus.county,
            cus.longitude,
            cus.latitude,
            cus.industry_type
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
        var province = customerObj["province"];
        var city = customerObj["city"];
        var district = customerObj["district"];
        var county = customerObj["county"];
        var longitude = customerObj["longitude"];
        var latitude = customerObj["latitude"];
        var industryType = customerObj["industry_type"];

        // ------------------------------------------------------应用开通数据处理-开始---------------------------------------------------------
        // 开通应用数量
        var appOpenCount = 0;
        try {
            // 根据企业ID查询开通应用数量
            String querAppOpenCountSql = """
                SELECT
                    COUNT(*)
                FROM
                    app_application
                WHERE
                    del_flag = 0 
                    AND status = 'ENABLE'
            """;
            querAppOpenCountSql = querAppOpenCountSql + " AND customer_id = #{customerId}";
            // 根据企业ID查询开通应用数量
            appOpenCount = dbFlowable.selectInt(querAppOpenCountSql) || 0;
        } catch (ex) {
            log.error("应用开通数据处理异常", ex);
        }
        // ------------------------------------------------------应用开通数据处理-结束---------------------------------------------------------


        // ------------------------------------------------------用户活跃数据处理-开始---------------------------------------------------------
        // 用户注册数量
        var userRegisterCount = 0;
        // 用户活跃数量
        var userActiveCount = 0;
        // 用户活跃率
        var userActiveRate = new BigDecimal("0.00");
        // 用户活跃统计日期 yyyy-MM-dd
        var userActiveStatDate = nowDateTime.substring(0, 10);
        try {
            // 根据企业ID查询用户注册数量
            String querUserRegisterCountSql = """
                SELECT
                    COUNT(u.id)
                FROM
                    ${tableNameUser} u
                    INNER JOIN customer_user cu ON u.id = cu.user_id
                WHERE
                    u.del_flag = 0
                    AND u.status = 1
            """;
            querUserRegisterCountSql = querUserRegisterCountSql + " AND cu.customer_id = #{customerId}";
            userRegisterCount = dbIdentity.selectInt(querUserRegisterCountSql) || 0;

            // 根据企业ID查询用户活跃数量
            String querUserActiveCountSql = """
                SELECT
                    COUNT(u.id)
                FROM
                    ${tableNameUser} u
                    INNER JOIN customer_user cu ON u.id = cu.user_id
                WHERE
                    u.del_flag = 0
                    AND u.status = 1
            """;
            querUserActiveCountSql = querUserActiveCountSql + " AND cu.customer_id = #{customerId}";
            var dateTimeStart = userActiveStatDate + " 00:00:00";
            var dateTimeEnd = userActiveStatDate + " 23:59:59";
            if (dbType == "PostgreSQL") {
                querUserActiveCountSql = querUserActiveCountSql + " AND u.last_login_time >= TO_TIMESTAMP(#{dateTimeStart}, 'YYYY-MM-DD HH24:MI:SS')";
                querUserActiveCountSql = querUserActiveCountSql + " AND u.last_login_time <= TO_TIMESTAMP(#{dateTimeEnd}, 'YYYY-MM-DD HH24:MI:SS')";
            } else if (dbType == "MySQL") {
                querUserActiveCountSql = querUserActiveCountSql + " AND u.last_login_time >= #{dateTimeStart}";
                querUserActiveCountSql = querUserActiveCountSql + " AND u.last_login_time <= #{dateTimeEnd}";
            }
            userActiveCount = dbIdentity.selectInt(querUserActiveCountSql) || 0;
            // 计算用户活跃率（用户活跃数 / 用户注册数 * 100，保留两位小数）
            if (userRegisterCount != 0 && userActiveCount != 0) {
                // 百分比计算常量
                var hundred = new BigDecimal("100");
                // 最终保留 2 位小数
                userActiveRate = new BigDecimal(userActiveCount).divide(new BigDecimal(userRegisterCount), 4, RoundingMode.DOWN).multiply(hundred);
            }
        } catch (ex) {
            log.error("用户活跃数据处理异常", ex);
        }
        // ------------------------------------------------------用户活跃数据处理-结束---------------------------------------------------------


        // ------------------------------------------------------设备数据处理-开始---------------------------------------------------------
        // 设备安装数
        var deviceInstallCount = 0;
        // 设备在线数
        var deviceOnlineCount = 0;
        // 设备离线数
        var deviceOfflineCount = 0;
        try {
            var common_filter_sql = "'" + customerId + "' )) and ( d.additional_info is null or  json_extract_path_text(cast(d.additional_info as json),'gateway') is null or  json_extract_path_text(cast(d.additional_info as json),'gateway') = 'false' )";
            //查询企业设备总数据
            String query_sql_device_total = """
            select count(distinct d.id) as num from device d,relation_mapping rm  where  
            (rm.tb_id =d.tenant_id and rm.kw_entity_type='CUSTOMER' and rm.tb_entity_type ='TENANT' and rm.kw_id in (
            """;
            query_sql_device_total += common_filter_sql;
            deviceInstallCount = dbDevice.selectInt(query_sql_device_total);
            if (0 < deviceInstallCount) {
                //查询企业在线设备数据
                String query_sql_device_active = """
                select count(distinct d.id) as num from device d,relation_mapping rm,attribute_kv atkv where   d.id = atkv.entity_id
                and (
                    (atkv.attribute_key = 'client_active' and atkv.bool_v = true and atkv.attribute_type = 'CLIENT_SCOPE')
                    or (atkv.attribute_key = 'active' and atkv.bool_v = true and atkv.attribute_type = 'SERVER_SCOPE')
                    )
                    and (rm.tb_id =d.tenant_id and rm.kw_entity_type='CUSTOMER' and rm.tb_entity_type ='TENANT' and rm.kw_id in (
                """;
                query_sql_device_active += common_filter_sql;
                deviceOnlineCount = dbDevice.selectInt(query_sql_device_active);
            }
            // 设备离线数 = 设备安装数 - 设备在线数
            deviceOfflineCount = deviceInstallCount - deviceOnlineCount;
        } catch (ex) {
            log.error("设备数据处理异常", ex);
        }
        // ------------------------------------------------------设备数据处理-结束---------------------------------------------------------

        // 调用更新接口，上报数据
        var responseResult = http.connect(reportUrl).body({
            dataArray: [{
                customerId,
                customerName,
                cooperationId,
                cooperationName,
                parentCooperationId,
                parentCooperationName,
                cooperationIdPaths,
                province,
                city,
                district,
                county,
                longitude,
                latitude,
                industryType,
                appOpenCount,
                userRegisterCount,
                userActiveCount,
                userActiveRate,
                userActiveStatDate,
                deviceInstallCount,
                deviceOnlineCount,
                deviceOfflineCount
            }]
        }).header(apiKey, apiValue).post().getBody()
        log.info("调用接口返回: {}", responseResult::stringify);
    }
} catch (e) {
    log.error("上报异常", e)
}