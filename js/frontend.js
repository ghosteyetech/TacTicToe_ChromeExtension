/*var a=0;

function count() {
	    a++;
	    document.getElementById('demo').textContent = a;

	    //chrome.runtime.sendMessage("hiiiiiii");
	    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		  console.log(response.farewell);//To see response open chrme extention console
		  // alert("From BackEnd:"+response.farewell)
		});
}

$(document).ready(function(){
    document.getElementById('do-count').onclick = count;
});
*/
chrome.extension.onMessage.addListener(function(message, messageSender, sendResponse) {
	console.log("Push Msg Received :: ");
	console.log(message);
	//document.getElementById('backendPushMsg').textContent = message.serverRespond;
	if(message.serverRespond != "zzz"){
		angular.element(document.getElementById('MainCtrl')).scope().receiveServerRespond(message.serverRespond);
		angular.element(document.getElementById('MainCtrl')).scope().$apply();
	}else{
		console.log(message.serverRespond);
	}

    // message is the message you sent, probably an object
    // messageSender is an object that contains info about the context that sent the message
    // sendResponse is a function to run when you have a response
});

var app = angular.module('tacTicToe',['ngMaterial']);
