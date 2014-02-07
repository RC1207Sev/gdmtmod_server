var Chatclient = {};
(function () {
    "use strict";
 
    // for better performance - to avoid searching in DOM
    var content;
    var input;
    var Totalmessages = 0;

    var create_room_button = $('#b_create_room');
    var create_room_tf = $('#tf_create_room_name');
    var join_room_button = $('#b_join_room');
    var join_room_tf = $('#tf_join_room_name');
    var custom_type_tf = $('#tf_message_type');
    var custom_data_tf = $('#tf_message_data');
    var custom_message_button = $('#b_send_custom_message');
 
    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;
    // Chosen Nickname
    var myNickname = false;
    // check if already initialized
    var isInit = false;
 
    Chatclient.changeName = function (name){
    	
    	myNickname = name;
    	myName = true;
    	//console.log('Name changed into ' + myNickname);
    	
    };
    
    // It initializes 
    Chatclient.init = function () {
    	
    	
        content = $('#contentmodchat');
        input = $('#input');
    	create_room_button = $('#b_create_room');
   	create_room_tf = $('#tf_create_room_name');
    	join_room_button = $('#b_join_room');
   	join_room_tf = $('#tf_join_room_name');
    	custom_type_tf = $('#tf_message_type');
    	custom_data_tf = $('#tf_message_data');
    	custom_message_button = $('#b_send_custom_message');

        // get chromium websocket
        window.WebSocket = window.WebSocket;

        // if browser doesn't support WebSocket, just show some notification and exit
        if (!window.WebSocket) {
        	content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
        		+ 'support WebSockets.'} ));
        	input.hide();
        	$('span').hide();
        	return;
        }

        // open connection
        var connection = new WebSocket('ws://192.168.1.2:1338');

        connection.onopen = function () {

        	input.removeAttr('disabled');

        	var json = JSON.stringify({type: 'handshake', data: myNickname});
        	connection.send(json);
        	$(this).val(''); //clear input box to be sure
        	//console.log('Chat Connected to ws://54.194.3.0:1337');
            addGenericMessage("Connected!", new Date(),'green');
        };

        connection.onerror = function (error) {
        	// just in there were some problems with connection...
        	content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
        		+ 'connection or the server is down.' } ));
        };

        // most important part - incoming messages
        connection.onmessage = function (message) {

        	try {
        		var json = JSON.parse(message.data);
        	} catch (e) {
        		console.log('This doesn\'t look like a valid JSON: ', message.data);
        		return;
        	}

        	addMessage(json.type, json.data.text, json.data.color, new Date(json.data.time));

        };

        /**
         * Send mesage when user presses Enter key
         */
        input.keydown(function(e) {

        	if (e.keyCode === 13) {

        		var msg = $(this).val(); //content of input box

        		if (!msg) {
        			return;
        		}

        		var json = JSON.stringify({type: 'message', data: msg});
        		connection.send(json);

        		$(this).val('');
        		// disable the input field to make the user wait until server
        		// sends back response
        		input.attr('disabled', 'disabled');
        	}
        });

        setInterval(function() {
        	if (connection.readyState !== 1) {
        		//status.text('Error');
        		input.attr('disabled', 'disabled').val('Error: Unable to comminucate '
        				+ 'with the WebSocket server.');
        	}
        }, 4000);

        /**
         * Add message to the chat window
         */
        function addMessage(author, message, color, dt) {
        	content.append('<p style="margin: 0px; margin-top: 1px;">[' + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
        			+ (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
        			+ '] ' + '<span style="color:' + color + '">' + author + '</span>: '
        			+ message + '</p>');
        	Totalmessages += 1;
        	content.scrollTop(20 * Totalmessages);
        }

        /**
         * Add generic message without formatting (used for system notifications)
         * color: optional
         */
        function addGenericMessage(message, dt, color) {
        color || (color = 'black');
        content.append('<p style="margin: 0px; margin-top: 1px; color:' + color + '">[' + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
        + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
        + '] ' + ': '
        + message + '</p>');
        Totalmessages += 1;
        content.scrollTop(20 * Totalmessages);
        }


       function sendMessage(parType, parMsg){

        		if (!parMsg) {
        			return;
        		}

        		var json = JSON.stringify({type: parType, data: parMsg});
        		connection.send(json);
			addGenericMessage("Message sent: " + parType + " " + parMsg, new Date(), null);

	}


        /**
         * Status bar alteration functions
         */

        var max_button = $('#b_maximize');
        var min_button = $('#b_minimize');
        var close_button = $('#b_close');
        var statusBarSize;
        var OldHeight;
        var normalSizes = {};
        (function () {
        	normalSizes.height = 270;
        	normalSizes.width = 100;
        })();
        var largeSizes = {};
        (function () {
        	largeSizes.height = 600;
        	largeSizes.width = 200;
        })();
        var minimizedSizes = {};
        (function () {
        	minimizedSizes.height = 30;
        	minimizedSizes.width = 100;
        })();


        /**
         * Maximize the statusBar sizes
         */
        max_button.click(function() {

        	// if the status bar is not already maximized
        	if (2 != statusBarSize){
        		$('#statusBarCustomized').css("width", largeSizes.width + "%").css("height",largeSizes.height + "px");
        		$('#contentmodchat').css("height",(largeSizes.height - 70) + "px");
        		statusBarSize = 2;
        	}else{  // else it will return in the default state
        		$('#statusBarCustomized').css("width",normalSizes.width + "%").css("height",normalSizes.height + "px");
        		$('#contentmodchat').css("height",(normalSizes.height - 70) + "px");
        		statusBarSize = 1;
        	}
        	content.scrollTop(20 * Totalmessages);

        });


        /**
         * Minimize the statusBar sizes
         */
        min_button.click(function() {

        	// if the status bar is not already minimized
        	if (0 != statusBarSize){
        		$('#chat').hide();
        		$('#statusBarCustomized').css("width", minimizedSizes.width + "%").css("height",minimizedSizes.height + "px");
        		statusBarSize = 0;
        	}else{  // else it will return in the default state
        		$('#chat').show();
        		$('#statusBarCustomized').css("width",normalSizes.width + "%").css("height",normalSizes.height + "px");
        		statusBarSize = 1;
        	}
        	content.scrollTop(20 * Totalmessages);

        });

        /**
         * Close the statusBar
         */
        close_button.click(function() {

        	// correctly close the websocket
        	connection.onclose = function () {}; // disable onclose handler first
        	connection.close();
        	$('#statusBarCustomized').remove();	

        });

//    var create_room_button = $('b_create_room');
//    var create_room_tf = $('tf_create_room_name');
//    var join_room_button = $('tf_join_room_name');
//    var join_room_tf = $('b_join_room');
//    var custom_type_tf = $('tf_message_type');
//    var custom_data_tf = $('tf_message_data');
//    var custom_message_button = $('b_send_custom_message');

        /**
         * Sends a create_room message with room name = $('tf_create_room_name').val()

         */


        create_room_button.click(function() {

		console.log("create_room_button click event");
		sendMessage("create_room",create_room_tf.val());
		console.log("create_room message sent");

        });

        /**
         * Sends a join_room message with room name = $('tf_join_room_name').val()

         */
        join_room_button.click(function() {

		console.log("join_room_button click event");
		sendMessage("join_room", join_room_tf.val());
		console.log("join_room message sent");

        });

    };
    
})();
