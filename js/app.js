// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    //this.sprite = 'images/enemy-bug.png';
    this.sprite = 'images/enemy-bug.png';
    var rand = Math.random();
    this.x = -50 - rand*150;
    this.y = Math.floor(1 + rand*3 )*83 - 23;
    this.row = Math.floor( 1 + rand*3 );
    this.speed = rand * 100;
    this.rand = rand;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed*dt;

    // check and see if this enemy is off the screen, if so reset it back to the left side of the screen
    if( this.x > 505 ){
        this.x = -50 - this.rand*150;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    /*
    ctx.rect( this.x, this.y , 100, 100 );
    ctx.stroke();
    */
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
}

Player.prototype.update = function( dt ){

}

Player.prototype.render = function(){
        ctx.drawImage(Resources.get( this.sprite), this.x, this.y  );
        var delta = Math.random();
        //this.x += delta; this.y += delta;

}

Player.prototype.handleInput = function( key ){

    // key will be one of up, down, left, right,
    if( key == 'up' && this.y >= 0)
        this.y -= 83;
    if( key == 'down' && this.y < 4*83 )
        this.y += 83;
    if( key == 'left' && this.x >= 101)
        this.x -= 101;
    if( key == 'right' && this.x < 4*101 )
        this.x += 101;  
}

Player.prototype.rowNumber = function(){
    return Math.floor(  ( this.y + 10 ) / 83 );
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = []
allEnemies.push( new Enemy());
allEnemies.push( new Enemy());
allEnemies.push( new Enemy());
allEnemies.push( new Enemy());
allEnemies.push( new Enemy());
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
