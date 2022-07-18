import draw_grid from './drawings';

// Get the canvas and set the context to 2d
var canvas = document.getElementById("asteroids");
var ctx = canvas.getContext("2d");

// Set the size of the canvas
canvas.width = canvas.height = 700;

ctx.strokeStyle = "#00FF00";
ctx.lineWidth = 0.3;

// Text color
ctx.fillStyle = "#009900";

for (var x = 0; x < canvas.width; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    if (x % 50 == 0) { ctx.fillText(x,x,10); }
    ctx.lineWidth = (x % 50 == 0) ? 0.5 : 0.25;
    ctx.stroke();
}
for (var y = 0; y < canvas.height; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width, y);
    if (y % 50 == 0) { ctx.fillText(y,0,y+10); }
    ctx.lineWidth = (y % 50 == 0) ? 0.5 : 0.25;
    ctx.stroke();
}
ctx.stroke();