function draw_grid(ctx, minor, major, stroke, fill) {
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke || "#00FF00";
    fill = fill || "#009900";
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.font = "15px Arial";
    ctx.fillStyle = fill;
    
    let width = ctx.canvas.width, height = ctx.canvas.height;
    for (var x = 0; x < width; x += minor) {
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,height);
        if(x % major == 0) { ctx.fillText(x,x,15); }
        ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
    }
    for (var y = 0; y < height; y += minor) {
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(width,y);
        if(y % major == 0) { ctx.fillText(y,0,y+15); }
        ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
    }
    ctx.restore();
}

function draw_pacman(ctx, x, y, radius, value) {
    x = x || 200;
    y = y || 200;
    radius = radius || 150;
    value = value * 1;
    ctx.beginPath();
    ctx.arc(
        x,
        y,
        radius,
        value * (0.2 * Math.PI),
        (2 - (0.2 * value)) * Math.PI
    );
    ctx.lineTo(x, y);
    ctx.fillStyle = "yellow";
    ctx.fill();
}

function draw_ship(ctx, x, y, radius, options) {

}