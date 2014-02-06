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
		var index = this.players_in_room.push(player) - 1;
		return index;
	} else {
		return 0;
	}

}


room.prototype.RemovePlayer = function(player){
	
	return (this.isPlayerInRoom(player) && isPlayerInRoom.splice(this.isPlayerInRoom(player) - 1, 1));

}

room.prototype.isPlayerInRoom = function(player){
	
	for (var i=0; i < this.players_in_room.length; i++) {
                if (this.players_in_room[i].id === player.id){ return i; }
        } 

	return 0;

}

room.prototype.showPlayersInRoom = function(){
	
	for (var i=0; i < this.players_in_room.length; i++) {
                console.log(this.players_in_room[i].id);
        } 

	return 0;

}


room.prototype.sayHello = function(){console.log("room " + this.room);};
