import org.bson.Document;
import org.bson.types.ObjectId;
var _id="_id"
var cursor=aggregateIterable.cursor()
var  result=new ArrayList();
while(cursor.hasNext()) {
   Document obj=cursor.next()
   if(obj.containsKey(_id)){
        obj.put(_id,obj.getObjectId(_id).asString())
   }
   result.add(obj);
}
return result