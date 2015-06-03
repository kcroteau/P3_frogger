// Global variable to keep track of the amount of successful wins
var level = 0;
// Global variable to see whether or not the level value has suprassed the highest obtained
var check = 0;
// Variables to check to see if last reset was due to win or loss
var stat, win = 0, loss = 1;

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random() * 200) + 100);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if (this.x >= 500) {
        this.x = -100;
        this.speed = Math.floor((Math.random() * 200) + 100);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    // Initial player location
    this.x = 200;
    this.y = 400;
};

// Update player location according to button presses and/or game win/loss; add and look for rocks
Player.prototype.update = function() {
    // Variables to check if there is a rock in the player's way
    var noleft = 0, noright = 0, noup = 0, nodown = 0;

    // Loop through rocks array to check for locations relative to the player
    for (var rock in rocks) {
      if (rock !== null) {
        // Check if rock is to the left of player
        if (this.x - 25 >= rocks[rock].x - 50 && this.x - 25 <= rocks[rock].x + 50)
            if (this.y >= rocks[rock].y - 60 && this.y <= rocks[rock].y + 24)
                noleft++;
        // Check if rock is to the right of player
        if (this.x + 25 >= rocks[rock].x - 50 && this.x + 25 <= rocks[rock].x + 50)
            if (this.y >= rocks[rock].y - 60 && this.y <= rocks[rock].y + 24)
                noright++;
        // Check if rock is above player
        if (this.y - 25 >= rocks[rock].y - 30 && this.y - 25 <= rocks[rock].y + 24)
            if (this.x >= rocks[rock].x - 50 && this.x <= rocks[rock].x + 50)
                noup++;
        // Check if rock is below player
        if (this.y + 25 >= rocks[rock].y - 60 && this.y + 25 <= rocks[rock].y + 24)
            if (this.x >= rocks[rock].x - 50 && this.x <= rocks[rock].x + 50)
                nodown++;
      }
    }

    // Button presses (if there is no rock obstruction)
    if(this.ctlKey === 'left' && this.x > 0 && noleft === 0)
        this.x -= 25;
    else if(this.ctlKey === 'right' && this.x != 400 && noright === 0)
        this.x += 25;
    else if(this.ctlKey === 'up' && noup === 0)
        this.y -= 25;
    else if (this.ctlKey === 'down' && this.y != 400 && nodown === 0)
        this.y += 25;
    
    // Limit button press
    this.ctlKey = null;

    // Game reset when player reaches water
    if (this.y < 0) {
        stat = win;
        reset();
        // Stop at level 5
        if (level != 5){
            level++;
        }
    }

    // Add rocks with successful wins for added difficulty
    if (level > check) {
        rocks.push(new Rock());
        overlap(rocks);
    }

    // Set the check to be equal to the current level
    check = level;
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Read input key press
Player.prototype.handleInput = function(key) {
    this.ctlKey = key;
};

// Rocks on the ground
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.x = (Math.random() * 400);
    this.y = (Math.random() * 250);

    // Loop to make sure rocks don't show in the same relative location
    for (var rock in rocks) {
      if (rock !== null) {
        while (this.x >= rocks[rock].x - 75 && this.x <= rocks[rock].x + 75 && this.y >= rocks[rock].y - 75 && this.y <= rocks[rock].y + 75) {
            this.x = (Math.random() * 400);
            this.y = (Math.random() * 250);
            rock = 0;
        }
      }
    }
};

// Place rock on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Function to display rocks in proper order from front to back of screen
var overlap = function(rocksArray) {
    // Temporary variables to support switches for rock order
    var tempx, tempy;

    // Loop to display rocks in proper order from front to back of screen
    for (var rock in rocksArray) {
      if (rock !== null) {
        for (var i=parseInt(rock)+1; i<rocks.length; i++) {
            if (rocksArray[rock].y > rocksArray[i].y) {
                tempx = rocksArray[rock].x;
                tempy = rocksArray[rock].y;
                rocksArray[rock].x = rocksArray[i].x;
                rocksArray[rock].y = rocksArray[i].y;
                rocksArray[i].x = tempx;
                rocksArray[i].y = tempy;
            }
        }
      }
    }
};

// Function to check player/enemy collisions
var checkCollisions = function() {
    for (var enemy in allEnemies) {
        if (player.x >= allEnemies[enemy].x - 30 && player.x <= allEnemies[enemy].x + 30) {
            if (player.y >= allEnemies[enemy].y - 30 && player.y <= allEnemies[enemy].y + 30) {
                stat = loss;
                reset();
            }
        }
    }
};

// Reset function to reset player to original location
var reset = function() {
    player.x = 200;
    player.y = 400;
    if (level == 5 && stat == win) {
        // Pop out all existing rocks, push in new ones with new locations
        for (var i=0; i<level; i++)
            rocks.pop();
        for (i=0; i<level; i++)
            rocks.push(new Rock());
    }
    overlap(rocks);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Enemy array
var allEnemies = [];
(function setEnemies(){
    allEnemies.push(new Enemy(-100,50));
    allEnemies.push(new Enemy(-100,110));
    allEnemies.push(new Enemy(-100,170));
    allEnemies.push(new Enemy(-100,230));
}());

// Player object
var player = new Player();

// Rock array
var rocks = [];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
