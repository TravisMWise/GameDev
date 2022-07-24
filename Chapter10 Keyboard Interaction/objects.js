class Mass {
    constructor(mass, radius, x, y, angle, x_speed, y_speed, rotation_speed) {
        this.x = x;
        this.y = y;
        this.mass = mass || 1;
        this.radius = radius || 50;  
        this.angle = angle || 0;
        this.x_speed = x_speed || 0;
        this.y_speed = y_speed || 0;
        this.rotation_speed = rotation_speed || 0;
    }
    // Newton's first law
    /* 
        Every object will remain at rest or in uniform motion 
        in a straight line unless compelled to change its 
        state by the action of an external force.
    */
    update(elapsed, ctx) {
        this.x += this.x_speed * elapsed;
        this.y += this.y_speed * elapsed;
        this.angle += this.rotation_speed * elapsed;
        this.angle %= (2 * Math.PI);
        if (this.x - this.radius > ctx.canvas.width) {
            this.x = -this.radius;
        }
        if (this.x + this.radius < 0) {
            this.x = ctx.canvas.width + this.radius;
        }
        if (this.y - this.radius > ctx.canvas.height) {
            this.y = -this.radius;
        }
        if (this.y + this.radius < 0) {
            this.y = ctx.canvas.height + this.radius;
        }
    }
    // Newton's second law 
    /* 
        (F = m * a) 
    */
    push(angle, force, elapsed) {
        this.x_speed += elapsed * (Math.cos(angle) * force) / this.mass;
        this.y_speed += elapsed * (Math.sin(angle) * force) / this.mass;
        console.log("pushed")
    }
    // Rotation
    /*
        Positive forces rotate the mass clockwise,
        and negative forces rotate the mass counterclockwise.
    */
    twist(force, elapsed) {
        this.rotation_speed += elapsed * force / this.mass;
    }
    // Return the magnitude of the speed vector
    speed() {
        return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2))
    }
    // Return the angle of the speed vector
    movement_angle() {
        return Math.atan2(this.y_speed, this.x_speed);
    }
    // Make a draw function to test the Math class
    // We will override this function in any child classes
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0,0,this.radius,0,2 * Math.PI);
        ctx.lineTo(0,0);
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        ctx.restore();
    }

}

class Asteroid extends Mass {
    constructor(mass, x, y, x_speed, y_speed, rotation_speed) {
        var density = 1; // kg per square pixel
        var radius = Math.sqrt((mass / density) / Math.PI);
        super(mass, radius, x, y, 0, x_speed, y_speed, rotation_speed);
        this.circumference = 2 * Math.PI * this.radius;
        this.segments = Math.ceil(this.circumference / 15);
        this.segments = Math.min(25, Math.max(10, this.segments));
        this.noise = 0.2;
        this.shape = [];
        for(var i = 0; i < this.segments; i++) {
            this.shape.push(2 * (Math.random() - 0.5));
        }
    }
    draw(ctx, guide) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        draw_asteroid(ctx,this.radius,this.shape,{noise: this.noise, guide});
        ctx.restore();
    }
};

class Ship extends Mass {
    constructor(x,y) {
        // Mass(mass, radius, x, y, angle, x_speed, y_speed, rotation_speed)
        super(10, 50, x, y, 1.5 * Math.PI, 0);
    }

    draw(ctx, guide) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fillStyle = "black";
        draw_ship(ctx, this.radius, {
            guide: guide
        });
        ctx.restore();
    }
}

class PacMan {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = 0;
        this.x_speed = speed;
        this.y_speed = 0;
        this.time = 0;
        this. mouth = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        draw_pacman(ctx, this.radius, this.mouth);
        ctx.restore();
    }

    move_right() {
        this.x_speed = this.speed;
        this.y_speed = 0;
        this.angle = 0;
    }

    move_left() {
        this.x_speed = -this.speed;
        this.y_speed = 0;
        this.angle = Math.PI;
    }
    
    move_down() {
        this.x_speed = 0;
        this.y_speed = this.speed;
        this.angle = 0.5 * Math.PI;
    }

    move_up() {
        this.x_speed = 0
        this.y_speed = -this.speed;
        this.angle = 1.5 * Math.PI;
    }


    update(elapsed, width, height) {
        if (this.x - this.radius + elapsed * this.x_speed > width) {
            this.x = -this.radius;
        }
        if (this.x + this.radius + elapsed * this.x_speed < 0) {
            this.x = width + this.radius;
        }
        if (this.y - this.radius + elapsed * this.y_speed > height) {
            this.y = -this.radius;
        }
        if (this.y + this.radius + elapsed * this.y_speed < 0) {
            this.y = height + this.radius;
        }
        this.x += this.x_speed * elapsed;
        this.y += this.y_speed * elapsed;
        this.time += elapsed;
        this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
    }
}

class Ghost {
    constructor(x, y, radius, speed, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        draw_ghost(ctx, this.radius, {fill: this.color});
        ctx.restore();
    }

    update(target, elapsed) {
        let angle = Math.atan2(target.y - this.y, target.x - this.x);
        let x_speed = Math.cos(angle) * this.speed;
        let y_speed = Math.sin(angle) * this.speed;
        this.x += x_speed * elapsed;
        this.y += y_speed * elapsed;
    }
}
