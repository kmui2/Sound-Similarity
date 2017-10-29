
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = "red";
ctx.strokeStyle = "black";
ctx.lineWidth = 3;

var xCoords = [208,270,333,400,459,519,584];
var yCoord = canvas.height/5;
for (x of xCoords)
    strokeCircle(x, yCoord);