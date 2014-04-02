/**
 * Created by wucho on 14-3-11.
 */

var pacakgeManagementApp = angular.module('pacakgeManagementApp', []);



pacakgeManagementApp.controller('packageModalController',['$scope',function($scope){

    $scope.addProduct = function(){
        $scope.packageInfo.relatedProductID.push([]);
        //console.log($scope.select);
    }

    $scope.saveProduct = function(){

    }
    //下来框选择产品的时候调用，更新$scope.selectedProducts
    $scope.selectProduct = function(){

    }


}]);


pacakgeManagementApp.controller('packageMainController',['$scope',function($scope){

    //点击查询按钮
    $scope.query = function(){

    }
    //点击新增供应商
    //点击编辑供应商
    $scope.edit  = function(productID){
        运行 //getRelateProductID/{id}
    }

    $scope.saveProduct = function(){

    }

}])