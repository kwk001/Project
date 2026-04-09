import http
import log

var authorization=header?.Authorization;
if(is_blank(authorization)){
    authorization=header?.authorization;
}
log.info("authorization:{}", authorization);
var responseResult= http.connect("http://kaiwu-form-engine-core:18666/formEngine/form/getIdByCode").body({
    codes: formCodes
}).header("Authorization",authorization).post().getBody()
log.info("执行结果日志.: {}",responseResult::stringify);
return responseResult?.result

