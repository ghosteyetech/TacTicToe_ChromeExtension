app.service('webSocketInfoService', function(){
  this.getWebSocketData= function(callback,data){

    // chrome.runtime.sendMessage({rqdata: "hello"}, function(response) {
    //   //console.log(response);//To see response open chrme extention console
    //   callback(response);
    // });
     var bgPage = chrome.extension.getBackgroundPage();
     var response =  bgPage.receiveDataFfromFront({rqdata: data});
     console.log("Reply from background page :::");
     console.log(response);
     callback(response);
  }

});


app.controller('MainCtrl',['$scope','webSocketInfoService', function($scope,webSocketInfoService){

  $scope.helloText = "Test text";
  $scope.serverPushMsg = "Not received";

  $scope.boxButtons = [
    { rowId:'row1',
           rowButtons : [ { colunmId:'11btn' ,clicked: 'false'}, {colunmId:'12btn' ,clicked: 'false'}, {colunmId:'13btn' ,clicked: 'false'}]
    },
    { rowId:'row1',
           rowButtons : [ { colunmId:'21btn' ,clicked: 'false'}, {colunmId:'22btn' ,clicked: 'false'}, {colunmId:'23btn' ,clicked: 'false'}]
    },
    { rowId:'row1',
           rowButtons : [ { colunmId:'31btn' ,clicked: 'false'}, {colunmId:'32btn' ,clicked: 'false'}, {colunmId:'33btn' ,clicked: 'false'}]
    }
  ];


  $scope.sendAction = function(ev,btnObj,data){

    btnObj.clicked = true;//change button color
    var dataToServer = {"data" : btnObj.colunmId };
    //Send data to background-js via service
    console.log("Requesting....");
    var webSctData = webSocketInfoService.getWebSocketData(function(data){
      console.log(data);
      $scope.helloText = data.reply;
      //$scope.$apply();

    },dataToServer);
  };

  $scope.receiveServerRespond = function(severRes){
    console.log("Server response ==== ");
    console.log(severRes);
    $scope.serverPushMsg = severRes;
    $scope.$apply();
  }

}]);
