var a=0;

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
