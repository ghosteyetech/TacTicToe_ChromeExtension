function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {

      // Whatever the user answers, we make sure we store the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // If the user is okay, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother him any more.
}

function PrintMsg(){
  console.log('Running');
  notifyMe();

}

//===============================================

// chrome.runtime.onMessage.addListener(
//
//   function(request, sender, sendResponse) {
//     console.log("Request from front End :"+request.rqdata);
//     sendResponse({reply: "OfflineServerRespose"});
//
//     /*var res = sendMessageWebsocket(request.rqdata);
//     sendResponse({reply: res});*/
//
// });

function receiveDataFfromFront(msg){
  console.log(msg);
  //var response = msg.rqdata + 'gotit';
  var response = sendMessageWebsocket(msg.rqdata);
  return {reply: response};
}


//-----------------------Websocket connect----------
var connection;
var response = 'None';
//var serverUrl = 'ws://127.0.0.1:3000';//For local testing
var serverUrl = 'wss://lit-everglades-29636.herokuapp.com/';//Live

function sendMessageWebsocket(msg){

  // var msg1='hi from sameera';
  console.log(msg);

  if(connection.readyState === 1){
    connection.send(msg);
    return msg;
  }else{
    console.log('===========>WebSocket error<=============');
    console.log(connection.readyState);
  }

}

function frontCall(dataRes){
  console.log("background:: frontCall CALLED");
  // var port;
  // if(!port){
  //   port = chrome.runtime.connect({name: "tttPort"});
  // }
  //
  // port.postMessage({serverRespond: dataRes });
  //
  // port.onMessage.addListener(function(msg) {
  //   console.log("Response from Front : ");
  //   console.log(msg);
  // });

  chrome.runtime.sendMessage({serverRespond: dataRes });

}


function WebSocketConnect(){
    var name ='sameera';
    var msg1 = 'hi from sameera';
    var retried=0;

    console.log('Starting WebSocket...');
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        console.log('Sorry, but your browser doesn\'t support WebSockets');
        return;
    }

    // open connection
    connection = new WebSocket(serverUrl);

    connection.onopen = function () {
        // first we want users to enter their names
        connection.send(name);
        connection.send(msg1);


    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        console.log('Sorry, but there\'s some problem with your connection or the server is down.');
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        //frontCall(message.data);
        chrome.runtime.sendMessage({serverRespond: message.data });//Send data to frontend
        try {
            var json = JSON.parse(message.data);
            console.log("Message :");
            console.log(json);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }


    };

    /**
     * Send mesage when user presses Enter key
     */


    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    reconnectInterval = setInterval(function() {
        if (connection.readyState !== 1) {
            console.log('Error Unable to comminucate with the WebSocket server.');
            connection.close();
            connection = new WebSocket(serverUrl);
            retried =1;
        }

        if(connection.readyState === 1  && retried === 1){
                console.log("===============Websocket connected");
                retried =0;
                WebSocketConnect();
        }

    }, 3000);

}

//ghost uncomment to start
WebSocketConnect();//Start WebSocketConnect
