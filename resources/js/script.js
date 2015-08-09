var dotNumber = 100;
var lineLength = 120;

var black = "#000000"
var color1 = "#76B729"
var color2 = "#F07D00"

var colors = [black, color1, color2];

randomColor = function(){
	return colors[Math.floor(Math.random()*colors.length)]
}

randomCoOrd = function(){
	return Math.random()*2000
}

var dots = [];

function Dot(color){

	this.color = randomColor();
	this.x = randomCoOrd();
	this.y = randomCoOrd();
	this.xVel = Math.random()*1 -2;
	this.yVel = Math.random()*1 -2;
	this.isClose = [];
	dots.push(this);

}

Dot.prototype.draw = function(context){

	context.strokeStyle = this.color;
	context.fillStyle = this.color;

	context.beginPath();
	context.arc(this.x,this.y,10,0,Math.PI*2,true);
	context.closePath();
	context.stroke();
	context.fill();

}

Dot.prototype.bounce = function(){
	if (this.x < 0 || this.x > 2000) this.xVel = -this.xVel;
	if (this.y < 0 || this.y > 2000) this.yVel = -this.yVel;
}

Dot.prototype.updatePosition = function(){
	this.x += this.xVel;
	this.y += this.yVel;
}


Dot.prototype.getDistance = function(otherDot){

	var xDistance = this.x - otherDot.x;
	var yDistance = this.y - otherDot.y;

	return Math.sqrt( xDistance*xDistance + yDistance*yDistance)

};

Dot.prototype.findClose = function(toConnect){
	
	this.isClose = []	

	var startAt = dots.indexOf(this) + 1;
	var finishAt = dots.length;

	for (var i = startAt; i < finishAt; i++){

		if ( this.getDistance(dots[i]) < lineLength ) {
			this.isClose.push(dots[i]);
		}
	};

}

Dot.prototype.drawLines = function(context){

	var scope = this;

	this.isClose.forEach(function(dot){
		context.beginPath();
		context.moveTo(scope.x,scope.y);
		context.lineTo(dot.x,dot.y);
		context.stroke();
	})
}

Dot.prototype.getDirectionVector = function(otherDot){

	var x = this.x - otherDot.x;
	var y = this.y - otherDot.y;
	
	return {'x': x, 'y': y}

}

Dot.prototype.pull = function(){

	var scope = this;

	this.isClose.forEach(function(dot){

		var direction = scope.getDirectionVector(dot);

		scope.xVel -= direction.x/500
		scope.yVel -= direction.y/500
		dot.xVel += direction.x/500
		dot.yVel += direction.y/500
	})


}


function createDot(context){
	var currentDot = new Dot();
	currentDot.draw(context);

}

$(document).ready(function(){

var canvas = document.getElementById('dots');
var context = canvas.getContext('2d');


	for (var i = 0; i < dotNumber; i++){
		createDot(context);
	}

	setInterval(function(){

		context.clearRect(0, 0, canvas.width, canvas.height);

		dots.forEach(function(dot){
			dot.updatePosition(context);
			dot.bounce();
			dot.findClose();
			dot.pull();
			dot.draw(context);
			dot.drawLines(context);
		})

	},50 );


})


