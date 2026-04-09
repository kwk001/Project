var _id="_id"
if(result.isCollection()){
    result.each(obj=>{
        if(obj.containsKey(_id)){
         obj.put(_id,obj.getObjectId(_id).asString())
        }
   });
}else if(result.containsKey(_id)){
    result.put(_id,obj.getObjectId(_id).asString())
}
return result