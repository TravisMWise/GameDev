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

    child(mass) {
        return new Asteroid(
            mass, this.x, this.y, this.x_speed, this.y_speed, this.rotation_speed
        );
    }
};

class Ship extends Mass {
    constructor(mass, radius, x, y, power, weapon_power) {
        // Mass(mass, radius, x, y, angle, x_speed, y_speed, rotation_speed)
        super(mass, radius, x, y, 1.5 * Math.PI, 0, 0, 0);
        this.thruster_power = power;
        this.steering_power = power / 80;
        this.right_thruster = false;
        this.left_thruster = false;
        this.thruster_on = false;
        this.retro_on = false;
        this.weapon_power = weapon_power || 200;
        this.loaded = false;
        this.weapon_reload_time = 0.19; // seconds
        this.time_until_reload = this.weapon_reload_time;
        this.compromised = false;
        this.max_health = 2.0;
        this.health = this.max_health;
    }

    projectile(elapsed) {
        // Projectile(mass, lifetime, x, y, x_speed, y_speed, rotation_speed)
        let p = new Projectile(
            0.025, 
            1.5, 
            this.x + Math.cos(this.angle) * this.radius,
            this.y + Math.sin(this.angle) * this.radius,
            this.x_speed,
            this.y_speed,
            this.rotation_speed
        );
        p.push(this.angle, this.weapon_power, elapsed);
        this.time_until_reload = this.weapon_reload_time;

        return p;
    }

    draw(ctx, guide) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (guide && this.compromised) {
            ctx.save();
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(0,0,this.radius,0,2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
        draw_ship(ctx, this.radius, {
            guide: guide,
            thruster_on: this.thruster_on,
        });
        ctx.restore();
    }

    update(elapsed, ctx) {
        this.push(
            this.angle, (this.thruster_on - this.retro_on) * this.thruster_power, elapsed
        );
        this.twist(
            (this.right_thruster - this.left_thruster) * this.steering_power, elapsed
        );
        this.loaded = this.time_until_reload === 0;
        if (!this.loaded) {
            this.time_until_reload -= Math.min(elapsed, this.time_until_reload)
        } 
        if (this.compromised) {
            this.health -= Math.min(elapsed, this.health);
        }
        super.update.apply(this, arguments);
    }
}

class Projectile extends Mass {
    constructor (mass, lifetime, x, y, x_speed, y_speed, rotation_speed) {
        let density = 0.00001; // low density means we can see very light projectiles
        let radius = Math.sqrt((mass / density) / Math.PI) / 5;
        super(mass, radius, x, y, 0, x_speed, y_speed, rotation_speed);
        this.lifetime = lifetime;
        this.life = 1.0;
    }

    draw(ctx, guide) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        draw_projectile(ctx, this.radius, this.life, guide);
        ctx.restore();
    }

    update(elapsed, ctx) {
        this.life -= (elapsed / this.lifetime);
        this.x += this.x_speed * elapsed;
        this.y += this.y_speed * elapsed;
        this.angle += this.rotation_speed * elapsed;
        this.angle %= (2 * Math.PI);
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

    update(elapsed, width, height) {
        // an average of once per 100 frames
        if (Math.random() <= 0.01) {
            if (Math.random() < 0.5) {
                this.turn_left();
            } else {
                this.turn_right();
            }
        }

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

    turn(direction) {
        if (this.y_speed) {
            // if we are traveling vertically
            // set the horizontal speed and apply the direction
            this.x_speed = -direction * this.y_speed;
            // clear the vertical speed and rotate
            this.y_speed = 0;
            this.angle = this.x_speed > 0 ? 0 : Math.PI; // 0 if we are moving right, PI if we are moving left 
        } else {
            // if we are traveling horizontally
            // set the vertical speed and apply yhe direction
            this.y_speed = direction * this.x_speed;

            // clear the horizontal speed and rotate
            this.x_speed = 0;
            this.angle = this.y_speed > 0 ? 0.5 * Math.PI : 1.5 * Math.PI; // PI/2 or 3PI/2
        }


    }

    turn_left() {
        this.turn(-1);
    }

    turn_right() {
        this.turn(1);
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

class Indicator {
    constructor (label, x, y, width, height) {
        this.label = label + ": ";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
    }

    draw(c, max, level) {
        c.save();
        c.strokeStyle = "white";
        c.fillStyle = "white";
        c.font = this.height + "pt Arial";
        var offset = c.measureText(this.label).width;
        c.fillText(this.label, this.x, this.y + this.height - 1);
        c.beginPath();
        c.rect(offset + this.x, this.y, this.width, this.height);
        c.stroke();
        c.beginPath();
        c.rect(offset + this.x, this.y, this.width * (max / level),this.height);
        c.fill();
        c.restore()
    }
}

class NumberIndicator {
    constructor(label, x, y, options) {
        options = options || {}
        this.label = label + ": ";
        this.x = x;
        this.y = y;
        this.digits = options.digits || 0;
        this.pt = options.pt || 10;
        this.align = options.align || 'end';
    }

    draw(c, value) {
        c.save();
        c.fillStyle = "white";
        c.font = this.pt + "pt Arial";
        c.textAlign = this.align;
        c.fillText(
            this.label + value.toFixed(this.digits),
            this.x, this.y + this.pt - 1
        );
        c.restore();
    }
}