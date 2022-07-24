
        
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

function draw_pacman(ctx, radius, mouth) {
    radius = radius || 150;
    angle = 0.2 * Math.PI * mouth;
    ctx.save();
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0,0,radius,angle,-angle);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function draw_ship(ctx, radius, options) {
    ctx.save();
    const PI = Math.PI;
    // Set default values
    options = options || {};
    ctx.lineWidth = options.lineWidth || 2;
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    let angle = (options.angle || (1/2) * PI) / 2;
    let curve1 = options.curve1 || 0.25;
    let curve2 = options.curve2 || 0.75;

    // Optionally draw a guide showing the collision radius
    if (options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*PI);
        ctx.stroke();
        ctx.fill();
    }

    // Draw the ship in three lines
    ctx.beginPath();
    ctx.moveTo(radius, 0); // Start at the right point
    ctx.quadraticCurveTo(
        Math.cos(angle) * radius * curve2,
        Math.sin(angle) * radius * curve2,
        Math.cos(Math.PI - angle) * radius,
        Math.sin(Math.PI - angle) * radius
    );
    ctx.quadraticCurveTo(
        -radius * curve1, 
        0,
        Math.cos(Math.PI + angle) * radius,
        Math.sin(Math.PI + angle) * radius
    );
    ctx.quadraticCurveTo(
        Math.cos(-angle) * radius * curve2,
        Math.sin(-angle) * radius * curve2,
        radius, 
        0
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Guide lines and control points
    if(options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(
            Math.cos(-angle) * radius,
            Math.sin(-angle) * radius
        );
        ctx.lineTo(0, 0);
        ctx.lineTo(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        );
        ctx.moveTo(-radius, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            Math.cos(angle) * radius * curve2,
            Math.sin(angle) * radius * curve2,
            radius/40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
            Math.cos(-angle) * radius * curve2,
            Math.sin(-angle) * radius * curve2,
            radius/40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(radius * curve1 - radius, 0, radius/50, 0, 2 *
        Math.PI);
        ctx.fill();
    }
    ctx.restore();
}

function draw_shapes(ctx, radius, segments, options) {
    options = options || {};
    ctx.strokeStyle = options.fill || "white";
    ctx.fillStyle = options.fill || "black";
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < segments; i++) {
        ctx.rotate(2 * Math.PI / segments);
        ctx.lineTo(radius, 0);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (options.guide) {
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*Math.PI);
        ctx.stroke();
    }
    ctx.restore();
}

function draw_asteroid(ctx, radius, shape, options) {
    options = options || {};
    ctx.strokeStyle = options.fill || "white";
    ctx.fillStyle = options.fill || "black";
    let noise = options.noise || 0.1;
    ctx.save();
    ctx.beginPath();

    for (let i = 0; i < shape.length; i++) {
        ctx.rotate(2 * Math.PI / shape.length);
        ctx.lineTo(radius + radius * noise * shape[i], 0);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (options.guide) {
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 0.2;
        ctx.arc(0,0,radius + radius * noise, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0,0,radius - radius * noise, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();
}