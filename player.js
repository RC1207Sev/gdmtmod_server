// Class player:
// This Class will handle all the information needed for each player

function player( name ) { 
 
	this.playername = name; 
	

} 




player.prototype.sayHello = function(){console.log(this.playername);}; 


player.prototype.changeName = function(name){ this.playername = name;}; 
