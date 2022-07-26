function collision(obj1, obj2) {
    return distance_between(obj1, obj2) < (obj1.radius + obj2.radius);
}

function distance_between(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2))
}

class AsteroidsGame {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.canvas.width = 2;
        this.c = this.canvas.getContext("2d");
        this.c.canvas.width = window.innerWidth-5;
        this.c.canvas.height= window.innerHeight-10;
        this.canvas.focus();
        this.guide = false;
        this.ship_mass = 1;
        this.ship_radius = 30;
        this.asteroid_mass = 5000; // Mass of asteroids
        this.asteroid_push = 500000; // max force to apply in one frame
        this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
        this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
        this.mass_destroyed = 500;
        this.score = 0;
        this.level = 1;
        this.game_over = false;
        window.requestAnimationFrame(this.frame.bind(this));

        // Indicators
        this.health_indicator = new Indicator("Health", 5, 5, 100, 10);
        this.score_indicator = new NumberIndicator("Score", this.canvas.width - 10, 5);
        this.fps_indicator = new NumberIndicator("FPS", this.canvas.width - 10, this.canvas.height - 15, {digits: 2});
        this.message = new Message(this.canvas.width / 2, this.canvas.height * 0.4);
        this.level_indicator = new NumberIndicator("Level", this.canvas.width/2, 5, { align: "center" });
        // Start the game
        this.reset_game();
    }

    reset_game() {
        this.score = 0;
        this.level = 0;
        this.game_over = false;
        this.ship = new Ship(
            this.ship_mass, 
            this.ship_radius, 
            this.canvas.width / 2,
            this.canvas.height / 2,
            500,
            1000
        );
        this.projectiles = [];
        this.asteroids = [];
        this.level_up();
    }

    frame(timestamp) {
        if (!this.previous) this.previous = timestamp;
        var elapsed = timestamp - this.previous;
        this.update(elapsed / 1000);
        this.fps = 1000 / elapsed;
        this.draw()
        this.previous = timestamp;
        window.requestAnimationFrame(this.frame.bind(this));
    }

    update(elapsed) {
        this.ship.compromised = false;
        if (this.asteroids.length === 0) {
            this.level_up();
        } else {
            this.asteroids.forEach((asteroid) => {
                asteroid.update(elapsed, this.c);
                if (collision(asteroid, this.ship)) {
                    this.ship.compromised = true;
                }
            }, this);
        }
        if (this.ship.health <= 0) {
            this.game_over = true;
            return;
        }
        this.ship.update(elapsed, this.c);
        this.projectiles.forEach((p, i, projectiles) => {
            p.update(elapsed, this.c);
            if (p.life <= 0) {
                projectiles.splice(i, 1);
            } else {
                this.asteroids.forEach((asteroid, j) => {
                    if (collision(asteroid, p)) {
                        projectiles.splice(i, 1);
                        this.asteroids.splice(j,1);
                        this.split_asteroid(asteroid, elapsed);
                    }
                }), this;
            }
        }, this);
        if (this.ship.trigger && this.ship.loaded) {
            this.projectiles.push(this.ship.projectile(elapsed));
        }
    }

    draw() {
        this.c.clearRect(0,0,this.canvas.width,this.canvas.height);
        if (this.guide) {
            draw_grid(this.c);
            this.asteroids.forEach((asteroid) => {
                draw_line(this.c, asteroid, this.ship);
                this.projectiles.forEach((p) => {
                    draw_line(this.c, p, asteroid);
                }, this);
            }, this);
        }
        this.asteroids.forEach((asteroid) => {
            asteroid.draw(this.c, this.guide);
        }, this);
        if (this.game_over && this.ship.health === 0) {
            this.message.draw(this.c, "GAME OVER [ Score: " + this.score + " ]", "Press enter to play again");
            return;
        } 
        this.ship.draw(this.c, this.guide);
        this.projectiles.forEach((p) => {
            p.draw(this.c);
        }, this);
        this.fps_indicator.draw(this.c, this.fps);
        this.health_indicator.draw(this.c,this.ship.health,this.ship.max_health);
        this.score_indicator.draw(this.c, this.score);
        this.level_indicator.draw(this.c, this.level);
    }
    
    level_up() {
        this.level += 1;
        for (let i = 0; i < this.level; i++) {
            this.asteroids.push(this.moving_asteroid());
        }
    }

    moving_asteroid(elapsed) {
        var asteroid = this.new_asteroid();
        this.push_asteroid(asteroid, elapsed);
        return asteroid;
    }

    new_asteroid() {
        // Asteroid(mass, x, y, x_speed, y_speed, rotation_speed)
        return new Asteroid(
            this.asteroid_mass,
            this.canvas.width * Math.random(),
            this.canvas.height * Math.random()
        )
    }

    push_asteroid(asteroid, elapsed) {
        elapsed = elapsed || 0.015;
        asteroid.push(2 * Math.PI * Math.random(), 25*this.asteroid_push, elapsed);
        asteroid.twist((Math.random() - 0.5) * Math.PI * this.asteroid_push * 0.02, elapsed);
    }

    keyDown(e) { this.key_handler(e, true); }
    
    keyUp(e) { this.key_handler(e, false); }

    key_handler(e, bool) {
        var nothing_handled = false;
        // console.log(e);
        switch(e.key || keyCode) {
            case "ArrowLeft":
            case "a":
            case 37:
                this.ship.left_thruster = bool;
                break;
            case "ArrowUp":
            case "w":
            case 38:
                this.ship.thruster_on = bool;
                break;
            case "ArrowRight":
            case "d":
            case 39:
                this.ship.right_thruster = bool;
                break;
            case "ArrowDown":
            case "s":
            case 40:
                this.ship.retro_on = bool;
                break;
            case " ":
            case 32:
                this.ship.trigger = bool;
                break;
            case "Enter":
                if (this.game_over) {
                    this.reset_game();
                } else {
                    nothing_handled = true;
                }
                break;
            case "q":
                this.ship.x_speed = 0;
                this.ship.y_speed = 0;
                this.ship.rotation_speed = 0;
                break;
            case "g":
            case 71:
                if (bool) { this.guide = !this.guide; }
                break;
            default:
                nothing_handled = true;
        }
        if (!nothing_handled) e.preventDefault();
    }
    
    split_asteroid(asteroid, elapsed) {
        asteroid.mass -= this.mass_destroyed;
        this.score += this.mass_destroyed;
        var split = 0.25 + 0.5 * Math.random(); // split unevenly
        var ch1 = asteroid.child(asteroid.mass * split);
        var ch2 = asteroid.child(asteroid.mass * (1 - split));
        [ch1, ch2].forEach(function(child) {
        if(child.mass < this.mass_destroyed) {
        this.score += child.mass;
        } else {
        this.push_asteroid(child, elapsed);
        this.asteroids.push(child);
        }
        }, this);
    }

    
}
