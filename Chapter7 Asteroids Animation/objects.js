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
