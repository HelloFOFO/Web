
/*
 * GET home page.
 */
module.exports = function(app){

    //bianbian Part
    var ProviderAction = require('./../action/ProviderAction');
    var ProviderMemberAction = require('./../action/ProviderMemberAction');
    var MemberAction = require('./../action/MemberAction');
    var hotelPriceQueryAction = require('./../action/hotelPriceQueryAction');
    var HotelPriceInputAction = require('./../action/HotelPriceInputAction');
    var TicketPriceInputAction = require('./../action/TicketPriceInputAction');
    var VoturePriceInputAction = require('./../action/VoturePriceInputAction');
    var TicketPackagePriceInputAction = require('./../action/TicketPackagePriceInputAction');
    var PriceAuditAction = require('./../action/PriceAuditAction');
    //wuchong Part
    var FileUploadAction = require('../action/FileUploadAction');
    var ticketManagementAction = require('./../action/TicketManagementAction');
    var hotelManagementAction = require('./../action/HotelManagementAction');
    var votureManagementAction = require('./../action/VotureManagementAction');
    var ticketPackageManagementAction = require('./../action/TicketPackageManagementAction');
    var packagePackageManagementAction = require('./../action/PackageManagementAction');



    app.get('/',function(request,response){
        response.render("index",{});
    });
    app.post('/login',MemberAction.login);
    //provider
    app.get('/provider',ProviderAction.viewProviderManger);
    app.post('/provider/add',ProviderAction.addProvider);
    app.post('/provider/detail',ProviderAction.getProviderDetail);
    app.post('/provider/update/:id',ProviderAction.updateProvider);
    app.post('/provider/list',ProviderAction.getProviders);
    //providerMember
    app.get('/providerMember',ProviderMemberAction.viewProviderMemberManager);
    app.post('/providerMember/add',ProviderMemberAction.addPMember);
    app.post('/providerMember/detail',ProviderMemberAction.getProviderMember);
    app.post('/providerMember/update/:id',ProviderMemberAction.updatePMember);
    app.post('/providerMember/list',ProviderMemberAction.getProviderMembersList);
    //hotel price input
    app.get('/hotelPrice/:category',HotelPriceInputAction.viewHotelPriceInput);
    app.get('/getProductNames/:productType',HotelPriceInputAction.getProductNames);
    app.post('/hotelPriceInput/list',HotelPriceInputAction.getHotelPriceLogList);
    app.post('/hotelPriceInput/add',HotelPriceInputAction.addInputLog);
    //ticket price input
    app.get('/ticketPrice/:category',TicketPriceInputAction.viewTicketPriceInput);
    app.post('/ticketPriceInput/list',TicketPriceInputAction.getTicketPriceLogList);
    app.post('/ticketPriceInput/add',TicketPriceInputAction.addInputLog);
    //voture price input
    app.get('/voturePrice/:category',VoturePriceInputAction.viewVoturePriceInput);
    app.post('/voturePriceInput/list',VoturePriceInputAction.getVoturePriceLogList);
    app.post('/voturePriceInput/add',VoturePriceInputAction.addInputLog);
    //ticketPackage price input
    app.get('/ticketPackagePrice/:category',TicketPackagePriceInputAction.viewTicketPackagePriceInput);
    app.post('/ticketPackagePriceInput/list',TicketPackagePriceInputAction.getTicketPackagePriceLogList);
    app.post('/ticketPackagePriceInput/add',TicketPackagePriceInputAction.addInputLog);
    //price audit
    app.post('/priceAudit/:type',PriceAuditAction.updateStatus);
    //file upload
    app.post('/file-upload', FileUploadAction.fileUpload);
    //ticketManagement
    app.get('/ticketManagement',ticketManagementAction.init);
    app.post('/ticketManagement/add',ticketManagementAction.add);
    app.post('/ticketManagement/update/:id',ticketManagementAction.update);
    app.get('/ticketManagement/detail/:id',ticketManagementAction.viewDetail);
    app.get('/ticketManagement/list',ticketManagementAction.list);
    //hotelManagement
    app.get('/hotelManagement',hotelManagementAction.init);
    app.post('/hotelManagement/add',hotelManagementAction.add);
    app.post('/hotelManagement/update/:id',hotelManagementAction.update);
    app.get('/hotelManagement/detail/:id',hotelManagementAction.viewDetail);
    app.get('/hotelManagement/list',hotelManagementAction.list);
    //votureManagement
    app.get('/votureManagement',votureManagementAction.init);
    app.post('/votureManagement/add',votureManagementAction.add);
    app.post('/votureManagement/update/:id',votureManagementAction.update);
    app.get('/votureManagement/detail/:id',votureManagementAction.viewDetail);
    app.get('/votureManagement/list',votureManagementAction.list);
    //ticketPackageManagement
    app.get('/ticketPackageManagement',ticketPackageManagementAction.init);
    app.post('/ticketPackageManagement/add',ticketPackageManagementAction.add);
    app.post('/ticketPackageManagement/update/:id',ticketPackageManagementAction.update);
    app.get('/ticketPackageManagement/detail/:id',ticketPackageManagementAction.viewDetail);
    app.get('/ticketPackageManagement/list',ticketPackageManagementAction.list);
    //packageManagement
    app.get('/packageManagement',packagePackageManagementAction.init);
    app.post('/packageManagement/add',packagePackageManagementAction.add);
    app.post('/packageManagement/update/:id',packagePackageManagementAction.update);
    app.get('/packageManagement/detail/:id',packagePackageManagementAction.viewDetail);
    app.get('/packageManagement/list',packagePackageManagementAction.list);

    //hotelPriceQuery
//    app.get('/hotelPriceQuery/:id',hotelPriceQueryAction.list);
};