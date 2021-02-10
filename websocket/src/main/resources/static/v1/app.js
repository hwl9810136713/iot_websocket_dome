var stompClient = null;
var serverPost = "localhost:8080";
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#notice").html("");
}

function connect() {
    var socket = new SockJS(serverPost+'/endpoint-websocket'); //连接上端点(基站)
    
    stompClient = Stomp.over(socket);			//用stom进行包装，规范协议
    stompClient.connect({}, function (frame) {	
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe(serverPost+'/topic/game_chat', function (result) {
        	console.info(result)
        	showContent(JSON.parse(result.body));
        });
    });
}


function connect2() {
    var socket = new SockJS('/endpoint-websocket'); //连接上端点(基站)

    stompClient = Stomp.over(socket);			//用stom进行包装，规范协议
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/chat/game_chat', function (result) {
            console.info(result)
            showContent(JSON.parse(result.body));
        });
    });
}
function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/v1/chat2", {}, JSON.stringify({'content': $("#content").val(),'to': $("#to").val()}) );
}

function showContent(body) {
    $("#notice").append("<tr><td>" + body.content + "</td> <td>"+new Date(body.time).toLocaleString()+"</td></tr>");
}





$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#connect2" ).click(function() { connect2(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});

