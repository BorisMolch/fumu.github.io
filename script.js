const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');



class PowerUp {
    constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.type = type;
    }

    draw() {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

let powerUps = [];

function spawnPowerUp() {
    const x = Math.random() * (canvas.width - 30);
    const size = 30;
    const powerUp = new PowerUp(x, -size, size, 'sizeIncrease');
    powerUps.push(powerUp);
    setTimeout(spawnPowerUp, 15000);
}

function updatePowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.y += speed;

        if (powerUp.y + powerUp.size > playerBoat.y && powerUp.y < playerBoat.y + playerBoat.size) {
            if (powerUp.x + powerUp.size > playerBoat.x && powerUp.x < playerBoat.x + playerBoat.size) {
                if (powerUp.type === 'sizeIncrease') {
                    playerBoat.size += 15;
                    setTimeout(() => {
                        playerBoat.size -= 15;
                    }, 5000);
                }
                powerUps.splice(index, 1);
            }
        }

        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });
}






class Boat {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

const playerBoat = new Boat(canvas.width / 2, canvas.height - 50, 30, randomColor());
let fallingBoats = [];
let score = 0;
let speed = 3;

function randomColor() {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

let sameColorBoatCounter = 0;

function spawnFallingBoat() {
    const x = Math.random() * (canvas.width - 30);
    const size = 30;
    const color = sameColorBoatCounter >= 4 ? playerBoat.color : randomColor();
    const boat = new Boat(x, -size, size, color);
    fallingBoats.push(boat);
    sameColorBoatCounter = color === playerBoat.color ? 0 : sameColorBoatCounter + 1;
    setTimeout(spawnFallingBoat, 1000);
}

function updateFallingBoats() {
    fallingBoats.forEach((boat, index) => {
        boat.y += speed;

        if (boat.y + boat.size > playerBoat.y && boat.y < playerBoat.y + playerBoat.size) {
            if (boat.x + boat.size > playerBoat.x && boat.x < playerBoat.x + playerBoat.size) {
                if (boat.color === playerBoat.color) {
                    score++;
                    speed *= 1.02;
                    playerBoat.color = randomColor();
                } else {
                    score--;
                    speed /= 2;
                }
                fallingBoats.splice(index, 1);
            }
        }

        if (boat.y > canvas.height) {
            fallingBoats.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    playerBoat.draw();
    fallingBoats.forEach(boat => boat.draw());
    powerUps.forEach(powerUp => powerUp.draw());

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
}




function gameLoop() {
    updateFallingBoats();
    updatePowerUps();
    draw();
    requestAnimationFrame(gameLoop);
}


canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

// Replace the existing 'mousemove' event listener with this:
canvas.addEventListener('mousemove', movePlayerBoat);

// Add touch event handling for mobile devices:
canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    movePlayerBoat(touch);
});

function movePlayerBoat(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    playerBoat.x = mouseX - playerBoat.size / 2;
}

spawnFallingBoat();
spawnPowerUp();
gameLoop();
