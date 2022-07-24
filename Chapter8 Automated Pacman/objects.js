class Asteroid {
    constructor(segments, radius, noise) {
        this.x = context.canvas.width * Math.random();
        this.y = context.canvas.height * Math.random();
        this.angle = 0;
        this.x_speed = context.canvas.width * (Math.random() - 0.5);
        this.y_speed = context.canvas.height * (Math.random() - 0.5);
        this.rotation_speed = 2 * Math.PI * (Math.random() - 0.5);
        this.radius = radius;
        this.noise = noise;
        this.shape = [];
        for (let i = 0; i < segments; i++) {
            this.shape.push(Math.random() - 0.5);
        }
    }
    update(elapsed) {
        if (this.x - this.radius + elapsed * this.x_speed > context.canvas.width) {
            this.x = -this.radius;
        }
        if (this.x + this.radius + elapsed * this.x_speed < 0) {
            this.x = context.canvas.width + this.radius;
        }
        if (this.y - this.radius + elapsed * this.y_speed > context.canvas.height) {
            this.y = -this.radius;
        }
        if (this.y + this.radius + elapsed * this.y_speed < 0) {
            this.y = context.canvas.height + this.radius;
        }
        this.x += elapsed * this.x_speed;
        this.y += elapsed * this.y_speed;
        this.angle = (this.angle + elapsed * this.rotation_speed) % (2 * Math.PI);
    }
    draw(context, guide) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        draw_asteroid(
            context,
            this.radius,
            this.shape,
            {
                noise: this.noise,
                guide: guide
            }
        );
        context.restore();
    }
};

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
        console.log(this.time);
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