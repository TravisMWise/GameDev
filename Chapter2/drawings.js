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