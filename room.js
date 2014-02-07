// Class player:
// This Class will handle all the information needed for each player

var players_in_room = [ ];

var MAX_PLAYERS_IN_ROOM = 4;

function room( name ) { 
 
	this.roomname = name;
	this.players_in_room = new Array(); 
	

} 


room.prototype.addPlayer = function(player){
	
	if (this.players_in_room.length < MAX_PLAYERS_IN_ROOM){
		if (player.room != null) {
			player.room.RemovePlayer("player",player);
		}
		player.room = this;
		this.players_in_room.push(player);
		return this.players_in_room.length;
	} else {
		return 0;
	}

}


room.prototype.RemovePlayer = function(searchType, searchString){
	
	var player_index = this.isPlayerInRoom(searchType, searchString);
	if (player_index >= 0) {
		players_in_room[player_index].room = null;
		players_in_room.splice(player_index - 1, 1);
		return players_in_room.length;
	}
	return -1;

}

room.prototype.isPlayerInRoom = function(searchType, searchString){
	
	switch(searchType)
	{
	case "player":	
		for (var i=0; i < this.players_in_room.length; i++) {
                	if (this.players_in_room[i].id == searchString.id){ return i; }
        	}
	break;
	case "connection":
		for (var i=0; i < this.players_in_room.length; i++) {
                	if (this.players_in_room[i].connection == searchString){ return i; }
        	}
	break;
	default:
	}	
	console.log("isPlayerInRoom: player not found using research type: " + searchType);
	return -1;

}

room.prototype.showPlayersInRoom = function(){
	
	for (var i=0; i < this.players_in_room.length; i++) {
                console.log(this.players_in_room[i].id);
        } 

	return 0;

}


room.prototype.sayHello = function(){console.log("room " + this.room);};
