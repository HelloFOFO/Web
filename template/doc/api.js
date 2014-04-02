/**
 * Created by wucho on 14-3-13.
 */

备注1：门票系统中请在subType中录入电子票或者实体票
备注2：产品子类做成下来菜单

目录：
##########################################################
1.  post: /ent/provider/create          创建供应商
2.  post: /ent/provider/update/{id}     更新供应商
3.  get:  /ent/provider/list            供应商列表查询
4.  get:  /ent/provider/detail/{id}     供应商详情查询

5.  post: /ent/provider/member/create      创建供应商账号
6.  post: /ent/provider/member/update/{id} 更新供应商账号
7.  get:  /ent/provider/member/list        供应商账号列表查询
8.  get:  /ent/provider/member/detail/{id} 供应商账号详情查询
---------------------------------------------------------------------
9.  post: /product/ticket/create             门票产品录入
10. post: /product/hotel/create              酒店产品录入
11. post: /product/voture/create             优惠券产品录入
12. post: /product/package/create            打包产品录入

13. post: /product/ticket/update/{id}    门票产品修改
14. post: /product/hotel/update/{id}     酒店产品修改
15. post: /product/voture/update/{id}    优惠券产品修改
16. post: /product/package/update/{id}   打包产品修改

17. get:  /product/ticket/list     门票产品列表查询
18. get:  /product/hotel/list      酒店产品列表查询
19. get:  /product/voture/list     优惠券产品列表查询
20. get:  /product/package/list     打包产品列表查询

21. get:  /product/ticket/detail/{id}   门票产品详情查询
22. get:  /product/hotel/detail/{id}    酒店产品详情查询
23. get:  /product/voture/detail/{id}   优惠券产品详情查询
24. get:  /product/package/detail/{id}   打包产品详情查询
---------------------------------------------------------------------
25. post：/product/ticket/price/create   门票价格库存录入
26. post：/product/hotel/price/create    酒店价格库存录入
27. post：/product/voture/price/create   优惠券价格库存录入
---------------------------------------------------------------------
28. post：/product/ticket/price/audit     门票价格库存审核
29. post：/product/hotel/price/audit      酒店价格库存审核
30. post：/product/voture/price/audit      优惠券价格库存审核

31. post：/product/ticket/price/update     门票价格库存审核
32. post：/product/hotel/price/update      酒店价格库存审核
33. post：/product/voture/price/update     优惠券价格库存审核

34. get：/product/ticket/price/list       门票价格库存查询
35. get：/product/hotel/price/list        酒店价格库存查询
36. get：/product/voture/price/list       优惠券价格库存查询
37. get：/product/package/price/list      打包产品价格库存查询

##########################################################
38: get: /product/ticket/shortList                    获取门票产品列表
39: get: /product/hotel/shortList                     获取酒店产品列表
40: get: /product/voture/shortList                    获取优惠券产品列表
42: get: /product/package/RelatedProduct/{id}         获取关联产品信息
43: get: /provider/shortList                          获取供应商列表
44: get: /module/shortList                            获取模块列表
45: get: /city/shortList                              获取城市列表
46: get：/product/ticket|hotel|voture|/priceLog/list  价格录入查询
##########################################################
post: /member/logout                                  登入
post: /member/login                                   登出
get: /product/ticket|hotel|voture|package/image/{id}  查看图片列表
##########################################################



默认返回以下
{error:0,errorMsg:""}  为1时返回errorMsg






#####################新建供应商############################
post:   /ent/provider/create
----------input:
name
contactName
contactEmail
contactPhone
proCode
balanceType
returnType
remark
isEnable

---以下请自动生成
type
createTime
updateTime
operatorID


#################################################
post:   /ent/provider/update/{id}
----------input:
name
contactName
contactEmail
contactPhone
proCode
remark
isEnable
balanceType
returnType

---以下请自动生成
type
createTime
updateTime
operatorID
----------output
{error:0,errorMsg:""}  为1时返回errorMsg

##############################################
get: /ent/provider/list
---------------------------
input:
      page
　　　pageSize
---------------------------
output:

{data:[{
_id:
name:
contactName:
contactEmail:
contactPhone:
proCode:
isEnable:
createTime:
},{}],
totalPage:222,
totalCount:23222,
error:0,
errorMsg:""
}
---------------------------

##############################################
get: /ent/provider/detail/{id}

input:null

output:{data:{
_id
name
contactName
contactEmail
contactPhone
proCode
remark
isEnable
balanceType
returnType
createTime
updateTime
operatorID
operatorName
}}

##############################################


post: /ent/provider/member/create

input:
mobile
name
passwd
email
tel
gender
idCard
providerID
isEnable

以下自动生成
signupDate
operatorID


output

##############################################

post: /ent/provider/member/update/{id}
input:
mobile
name
passwd
email
tel
gender
idCard
providerID
isEnable

以下自动生成
signupDate
operatorID


output:

#####################供应商账号列表查询#########################

get: /ent/provider/member/list
-----------------------
input:page  (default 1)
　　　pageSize(default 25)
      mobile(optional regex match)
      name(optional  regex match)
      email(optional  regex match)
      providerID(optional exact match)
      isEnable(optional exact match)
-----------------------
output:
默认按照供应商名称排序

{
data:[{
_id
mobile
name
passwd
email
tel
gender
signupDate
providerName(由providerID派生)
isEnable
},{}],
totalPage:222,
totalCount:23222,
error:0,
errorMsg:""}

######################获取供应商会员详情########################
get: /ent/provider/member/detail/{id}

output:
{
data:{
_id
mobile
name
passwd
email
tel
gender
idCard
signupDate
providerName(由providerID派生)
isEnable
operatorName(由operatorID派生)
}
}


#################创建产品#################
post: /product/ticket|hotel|voture|package/create
name:
subType:
relatedProductID:[{product:"dfdfdfdfdfdf",day:1,qty:1},{},{}]
content:
intro:
image:  abdee.gif:图片1,abcdefg:图片2 (不同图片之间用逗号，图片文件名和图片描述之间用冒号)
city:
addr:
GPS:29384.22,2323.233 （顺序是lat,lon)
level:
openTime:
bookRule:
useRule:
cancelRule:
transportation:
effectDate:
expiryDate:
isEnable:
contactName:
tel:
fax:
operator:(string)

以下自动生成

createTime:
updateTime:
type:1


#################更新产品#################
post: /product/ticket|hotel|voture|package/update/{id}
input:
_id:
name:
content:
intro:
image:  abdee.gif:图片1,abcdefg:图片2 (不同图片之间用逗号，图片文件名和图片描述之间用冒号)
cityID:
addr:
GPS:29384.22,2323.233 （顺序是lat,lon)
level:
openTime:
bookRule:
useRule:
cancelRule:
transportation:
effectDate:
expiryDate:
isEnable:
contactName:
tel:
fax:
subType:

output:

以下自动生成
updateTime:
type:1
operatorID： ObjectID('*************')




#################查看产品列表#################
get: /product/ticket|hotel|voture|package/list
---------------------------
input:page  (default 1)
　　　pageSize(default 25)
      name(optional regex match)
      cityID(optional exact match)
      effectDate(optional )
      expiryDate(optional )
      isEnable(exact match)
---------------------------
output:(默认按照城市排序)
{data:[{
_id:
name:
cityName:(由cityID派生)
level:
effectDate:
expiryDate:
isEnable:
createTime:
subType:
},{...},{...},...,{...}]
,
totalPage:222,
totalCount:23222,
error:0,
errorMsg:""}
---------------------------
有效期查询--- 如果用户查询 2013-01-01  --- 2013-03-01 有效的产品
应当列出有任意一天是落在这个区间内的所有产品

#################查看产品详情#################
get: /product/ticket|hotel|voture|package/detail/{id}
{
data:{
_id:
relatedProductID:[[[ObjectID('283shs73hs32he2h232323'),2],[ObjectID('283shs73hs32he2h232323'),1]]
,[[ObjectID('283shs73hs32he2h232323'),2],[ObjectID('283shs73hs32he2h232323'),1]]
,[[ObjectID('283shs73hs32he2h232323'),2],[ObjectID('283shs73hs32he2h232323'),1]]]
name:
content:
intro:
image: [{url:xxx,intro:222},{url:xxx,intro:222},...,{url:xxx,intro:222}]
cityName:(由cityID派生)
addr:
GPS:{lat:223,lon:232}
level:
openTime:
bookRule:
useRule:
cancelRule:
transportation:
effectDate:
expiryDate:
isEnable:
contactName:
tel:
fax:
subType:
operatorName:由operatorID派生)
createTime:
updateTime:
}
}


##############产品价格库存录入######################
post： /product/ticket|hotel|voture/price/create

input:

productID
startDate
endDate
cost
costWeekend
price
priceWeekend
marketPrice
marketPriceWeekend
packagePrice
packagePriceWeekend
inventory
inventoryWeekend
inventoryType (1.大库存 0单天库存,如果前端传过来是大库存，则不用看inventoryWeekend字段)
weekend： [5,6](周一是1，听见没？）
status：
providerID：
operator:(string)


以下自动生成
createTime
productType (1 TICKET/2 HOTEL/3 VOTURE)

------------------------
output:

------------------------
用户录入大库存(inventoryType==1)时，
价格表中记录库存为1，
大库存id为对应的大库存表中的id，
如果用户再次录入大库存的时候，
录入的时间段中在价格表中对应的库存中有为1的数据，
则表示用户录入的时间段与之前的录入有交叉，
此时报错，不允许录入,并返回大库存冲突的时间段。
如果用户禁用原始录入的大库存，则set PRICE.inventory=0



##############产品价格库存审核######################
post： /product/ticket|hotel|voture/price/audit/{id}
------------------------
input:
status:(1新录入 2 已通过  0已拒绝 3 已禁用)

以下自动生成:
auditTime
auditorID
-----------------------
output:
-----------------------
逻辑备注：

如果状态是2，需要对PRICELOG进行拆分
如果状态是0，仅需要对PRICELOG表进行更新
如果状态是3，则需要对PRICE表中对inventory作标0处理
你帮我也判断一下：
如果做status=2的更新，则原status只能=1
如果做status=0的更新，则原status只能=1
如果做status=3的更新，则原status只能=2
不允许做status=1的更新。
谢谢你！


##############产品价格|库存修改######################
post： /product/ticket|hotel|voture/price/update/{id}
-----------------------
input:
_id:(PRICE表中的_ID)
cost
price
marketPrice
packagePrice
inventory
oldCost
oldPrice
oldMarketPrice
oldPackagePrice
oldInventory


以下自动生成
updateTime
operatorID
-----------------------
output：
如大库存冲突,需要在errorMsg中标注出大库存冲突的日期段
-----------------------


##############产品价格|库存查询######################
get： /product/ticket|hotel|voture|package/price/list/{id}
-----------------------
input:
effiectDate:
expiryDate:
-----------------------
output:输出结果请按照日期进行排正序

{data:[
{
_id:(PRICE表中的_ID)
date:
cost:
price:
marketPrice:
packagePrice:
inventory:
inventoryType:
inventoryS:库存对应的开始时间(当且仅当inventoryType=1时才需要返回此字段)
inventoryE:库存对应的结束时间(当且仅当inventoryType=1时才需要返回此字段)
}
]
,error:0,
errorMsg:""}




##############产品价格|库存日志查询######################
get： /product/ticket|hotel|voture|/priceLog/list

input:
productID(optional)
startDate(optional)
endDate(optional)
operatorID(optional)
providerID(optional)
status(必填)

output:
{
data:[{
productID:
productName:
startDate:
endDate:
cost:
costWeekend:
price:
priceWeekend:
marketPrice:
marketPriceWeekend:
packagePrice:
packagePriceWeekend:
inventory:
inventoryWeekend:
inventoryType: (1.大库存 0单天库存,如果前端传过来是大库存，则不用看inventoryWeekend字段)
weekend： [5,6](周一是1，听见没？）
status：
providerName：
createTime:
auditorName:
auditTime:
},{...}...{}]
}



#####################查询产品短列表#####################################
get: /product/ticket|hotel|voture|package/shortList
仅选取isEnable=true的产品
-----------
input:
cityID (optional)没有传入cityID时返回所有产品
name   (optional)按照正则来匹配产品名称
-----------
output:
{data:[{name:'',_id:''}]}




#####################查询打包关联产品短列表#####################################
get: /product/package/RelatedProduct/{id}
返回关联产品的名称、id、天数、以及对应数量
------------------------------------------------------
input:null
------------------------------------------------------
output:
{data:[
{productID:"dfdfd",productName:"dfdfdf",dayID:1,quantity:2},{},...{}
]
}
------------------------------------------------------

#####################查询供应商短列表#####################################
get: /provider/shortList
检出所在供应商isEnable=true type=1的供应商
----------
input:null
----------
output:{data:[{_id:'',name:''},{}]}




#####################查询模块列表#####################################
get: /module/shortList
输出的时候按照order进行排正序,仅查询isEnable=true的数据，根据operatorID查到他应有的模块列表（调试期间不判断)
---------------------
input:operator:'operatorID'(必填)
---------------------
output:
{data:[
{
code:''
name:''
cat:''
},{...},{...},{}
]
}
---------------------


#####################查询城市列表#####################################
get: /city/shortList
仅查询isEnable=true的酒店，并按照order进行排序
---------------------
input:null
---------------------
output:
{data:
[{
_id:"dfsdfsdffsdf3434343dfdfd"
,name:"上海"
,provinceName:"广东"
}]
}
---------------------
仅查询isEnable=true的城市名称以及ID
这个shortList接口供页面上的城市下来菜单使用
保留/city/list 接口供城市列表维护功能，先暂不开发。


#####################查询图片列表#####################################
get: /product/ticket|hotel|voture|package/image/detail/{id}
-------------------------
input:null
-------------------------
output:{data:[
{url:'dfdf.jpg',intro:''},
{url:'dfdf.jpg',intro:''},{url:'dfdf.jpg',intro:''}
]}
--------------------------

####################登录#############################################
post: /member/login
input:
mobile:''(必填)
passwd:''（必填)
output:
{
data:{loggedIn:true}
}

####################修改密码#############################################

post: /member/logout
-------------
input:mobile(必填)

output:
{
data:{loggedIn:false}
}

####################删除图片#############################################
删除数组中对应位置的图片,返回删除后的image列表
post: /product/ticket|hotel|voture|package/image/delete/{id}
-------------
input: position=1  (位置从0开始)
------------
output:{data:[
{url:'dfdf.jpg',intro:''},
{url:'dfdf.jpg',intro:''},{url:'dfdf.jpg',intro:''}
]}
