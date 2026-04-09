import http
import log

var authorization=header?.Authorization;
if(is_blank(authorization)){
    authorization=header?.authorization;
}
//authorization="Bearer 7f2b7c4d-9a26-4f4b-b225-2b32c68fbbd9"
//"970719a4-e101-4b72-92dc-3b0f7a42012e"
log.info("authorization:{}", authorization);
var responseResult= http.connect("http://kaiwu-form-engine-core:18666/formEngine/form/getIdByCode").body({
    codes: formCodes,
    customerId:customerId
}).header("Authorization",authorization).post().getBody()
log.info("执行结果日志.: {}",responseResult::stringify);
return responseResult?.result