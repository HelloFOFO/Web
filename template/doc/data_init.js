

//密码是md5加密 nicai
var a ={
    mobile:'18616365242'
    ,name:'管理员'
    ,passwd:'529faef522e1b7f8ce1387406caf9394'
    ,email:'admin@justpayyou.com'
    ,tel:''
    ,gender:'男'
    ,birthYear:'1982'
    ,favouriteCity:''
    ,lastDestCity:''
    ,lisencePlate:''
    ,intentCity:''
    ,idCard:''
    ,postAddr:''
    ,signupDate:1394671086295
    ,provider:ObjectId("5320ffb06532aa00951ff5e1")
    ,isEnable:true
    ,operator:ObjectId("5320ff9b6532aa00951ff5e0")
}
db.members.save(a)


var a={
    name:'路骋网'
    ,contactName:'管理员'
    ,contactEmail:'admin@justpayyou.com'
    ,contactPhone:'18616365242'
    ,proCode:'RTA'
    ,remark:''
    ,isEnable:true
    ,type:2
    ,balanceType:''
    ,returnType:''
    ,createTime:1394671086295
    ,updateTime:1394671086295
    ,operator:ObjectId("5320ff9b6532aa00951ff5e0")
}
db.ents.save(a)

var a={
    name:'wap'
    ,contactName:'管理员'
    ,contactEmail:'admin@justpayyou.com'
    ,contactPhone:'18616365242'
    ,proCode:'RTA'
    ,remark:''
    ,isEnable:true
    ,type:2
    ,balanceType:''
    ,returnType:''
    ,createTime:1394671086295
    ,updateTime:1394671086295
    ,operator:ObjectId("5320ff9b6532aa00951ff5e0")
}
db.ents.save(a)

var a={
    name:'web'
    ,contactName:'管理员'
    ,contactEmail:'admin@justpayyou.com'
    ,contactPhone:'18616365242'
    ,proCode:'RTA'
    ,remark:''
    ,isEnable:true
    ,type:2
    ,balanceType:''
    ,returnType:''
    ,createTime:1394671086295
    ,updateTime:1394671086295
    ,operator:ObjectId("5320ff9b6532aa00951ff5e0")
}
db.ents.save(a)










var a= {code:'provider',name:'供应商管理',cat:'供应商',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:1}
db.pro.modules.save(a);
var a={code:'providerMember',name:'供应商账号管理',cat:'供应商',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:2}
db.pro.modules.save(a);

var a={code:'ticketManagement',name:'门票产品上架',cat:'产品上架',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:10}
db.pro.modules.save(a);
var a={code:'ticketPackageManagement',name:'套票产品上架',cat:'产品上架',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:11}
db.pro.modules.save(a);
var a={code:'packageManagement',name:'打包产品上架',cat:'产品上架',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:12}
db.pro.modules.save(a);
var a={code:'hotelManagement',name:'酒店产品上架',cat:'产品上架',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:13}
db.pro.modules.save(a);
var a={code:'votureManagement',name:'优惠券产品上架',cat:'产品上架',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:14}
db.pro.modules.save(a);

var a={code:'ticketPrice/input',name:'门票价格录入',cat:'价格录入',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:21}
db.pro.modules.save(a);
var a={code:'ticketPackagePrice/input',name:'套票价格录入',cat:'价格录入',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:22}
db.pro.modules.save(a);
var a={code:'hotelPrice/input',name:'酒店价格录入',cat:'价格录入',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:23}
db.pro.modules.save(a);
var a={code:'voturePrice/input',name:'优惠券价格录入',cat:'价格录入',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:24}
db.pro.modules.save(a);


var a={code:'ticketPrice/audit',name:'门票价格审核',cat:'价格审核',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:31}
db.pro.modules.save(a);
var a={code:'ticketPackagePrice/audit',name:'套票价格审核',cat:'价格审核',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:32}
db.pro.modules.save(a);
var a={code:'hotelPrice/audit',name:'酒店价格审核',cat:'价格审核',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:33}
db.pro.modules.save(a);
var a={code:'voturePrice/audit',name:'优惠券价格审核',cat:'价格审核',isEnable:true,createTime:1394671086295,updateTime:1394671086295,operator:ObjectId('5320ff9b6532aa00951ff5e0'),order:34}
db.pro.modules.save(a);



var a ={ "_id" : ObjectId("53217588af7d5b633f3361cc"), "isEnable" : true, "name" : "江苏" }
db.provinces.insert(a);
var a ={ "_id" : ObjectId("53217588af7d5b633f3361cd"), "isEnable" : true, "name" : "浙江" }
db.provinces.insert(a);
var a ={ "_id" : ObjectId("53217588af7d5b633f3361ce"), "isEnable" : true, "name" : "安徽" }
db.provinces.insert(a);
var a ={ "_id" : ObjectId("53217589af7d5b633f3361cf"), "isEnable" : true, "name" : "上海" }
db.provinces.insert(a);


var a = {image:[],firstLetter:"n","pinyin":'ningbo',"province" : ObjectId("53217588af7d5b633f3361cd"), "isEnable" : true, "name" :'宁波',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"h","pinyin":'huzhou',"province" : ObjectId("53217588af7d5b633f3361cd"), "isEnable" : true, "name" :'湖州',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"a","pinyin":'anji',"province" : ObjectId("53217588af7d5b633f3361cd"), "isEnable" : true, "name" :'安吉',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"n","pinyin":'nanxun',"province" : ObjectId("53217588af7d5b633f3361cd"), "isEnable" : true, "name" :'南浔',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"h","pinyin":'haining',"province" : ObjectId("53217588af7d5b633f3361cd"), "isEnable" : true, "name" :'海宁',order:1}
db.cities.save(a);


var a = {image:[],firstLetter:"m","pinyin":'maanshan',"province" : ObjectId("53217588af7d5b633f3361ce"), "isEnable" : true, "name" :'马鞍山',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"c","pinyin":'chuzhou',"province" : ObjectId("53217588af7d5b633f3361ce"), "isEnable" : true, "name" :'滁州',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"x","pinyin":'xuancheng',"province" : ObjectId("53217588af7d5b633f3361ce"), "isEnable" : true, "name" :'宣城',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"n","pinyin":'ningguo',"province" : ObjectId("53217588af7d5b633f3361ce"), "isEnable" : true, "name" :'宁国',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"l","pinyin":'lingbi',"province" : ObjectId("53217588af7d5b633f3361ce"), "isEnable" : true, "name" :'灵璧',order:1}
db.cities.save(a);

var a = {image:[],firstLetter:"s","pinyin":'suzhou',"province" : ObjectId("53217588af7d5b633f3361cc"), "isEnable" : true, "name" :'苏州',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"k","pinyin":'kunshan',"province" : ObjectId("53217588af7d5b633f3361cc"), "isEnable" : true, "name" :'昆山',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"n","pinyin":'nantong',"province" : ObjectId("53217588af7d5b633f3361cc"), "isEnable" : true, "name" :'南通',order:2}
db.cities.save(a);
var a = {image:[],firstLetter:"h","pinyin":'haimen',"province" : ObjectId("53217588af7d5b633f3361cc"), "isEnable" : true, "name" :'海门',order:2}
db.cities.save(a);

var a = {image:[],firstLetter:"s","pinyin":'shanghai',"province" : ObjectId("53217589af7d5b633f3361cf"),"isEnable" : true, "name" : '上海',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"s","pinyin":'songjiang',"province" : ObjectId("53217589af7d5b633f3361cf"),"isEnable" : true, "name" : '松江',order:1}
db.cities.save(a);
var a = {image:[],firstLetter:"q","pinyin":'qingpu',"province" : ObjectId("53217589af7d5b633f3361cf"),"isEnable" : true, "name" : '青浦',order:2}
db.cities.save(a);
var a = {image:[],firstLetter:"j","pinyin":'jinshan',"province" : ObjectId("53217589af7d5b633f3361cf"),"isEnable" : true, "name" : '金山',order:3}
db.cities.save(a);
var a = {image:[],firstLetter:"c","pinyin":'chongming',"province" : ObjectId("53217589af7d5b633f3361cf"),"isEnable" : true, "name" : '崇明',order:4}
db.cities.save(a);
var a = {image:[],firstLetter:"j","pinyin":'jiading',"province" : ObjectId("53217589af7d5b633f3361cf"),"isEnable" : true, "name" : '嘉定',order:5}
db.cities.save(a);









