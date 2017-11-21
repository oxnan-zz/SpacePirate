
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

//Setting vars////////
var backgroundLayer;
var groundLayer;
var map;
var bg;
/////////////////////

//player vars////////
var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var blackback;
var jumping = 0;
var weapon;
var shoot;
var ammo = 15;
var ammotext;
/////////////////////

////////////////////////////
var xlistC = [640,288,89,89,1504,940,2112,2336,2560,2254,2720,2752,2799,2852,2567,2816,2934];
var ylistC = [96,384,480,896,640,1152,608,416,640,128,320,192,192,192,1248,1120,1504];

var xlistM = [288,928,1024,1024,928,1284,1848,1835,883,1282,1874,2134,2927];
var ylistM = [64,700,100,302,544,256,224,864,928,1120,1248,1344,800];

var crystalgroup;
var monstergroup;
////////////////////////////

var crystalsCollected = 0;
var scoreText;

//var monster;
var monsterFacing;



function preload() {
    game.load.tilemap('tilemap', './tile-ting/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', './tile-ting/tileset.png');
    game.load.spritesheet('captain', 'assets/captain.png', 32, 32);
    game.load.spritesheet('monstersprite', 'assets/monstersprite.png', 32, 32);
    game.load.image('background', 'assets/background2.png');
    game.load.image('blackback', 'assets/blacknew1.png',-3000,-3000);
    game.load.image('gameover', 'assets/gameover.png',800,600);
    game.load.image('victory', 'assets/winning.png',-3000,-3000);

    game.load.image('bullet', 'assets/bullet.png', 32, 32);
    game.load.spritesheet('monster', 'assets/monster.png',26,32);
    game.load.spritesheet('crystal', 'assets/icecrystal.png', 22, 32);
    //Loading maps resources



}

function create() {

    map = game.add.tilemap('tilemap');
    map.addTilesetImage('tileset', 'tileset');

    background = map.createLayer('1');
    ground = map.createLayer('2');

    ground.resizeWorld();
    map.setCollisionBetween(0, 1000000, true, '2');




    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    game.physics.arcade.gravity.y = 100;

    //player///////////////////////////////////////////
    player = game.add.sprite(100, 600, 'captain');
    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.1;

    player.body.acceleration = 0.1;

    player.body.collideWorldBounds = true;
    player.animations.add('left', [2], 10, true);
    player.animations.add('turn', [0], 20, true);
    player.animations.add('right', [1], 10, true);
    ///////////////////////////////////////////////////


    cursors = game.input.keyboard.createCursorKeys();




    //spawn shit/////////
    crystalgroup = game.add.group();
    game.physics.arcade.enable(crystalgroup);
    crystalgroup.collideWorldBounds = true;
    crystalgroup.enableBody = true;

    monstergroup = game.add.group();
    game.physics.arcade.enable(monstergroup);
    monstergroup.collideWorldBounds = true;
    monstergroup.enableBody = true;

    spawncrystals(xlistC, ylistC);
    spawnmonsters(xlistM, ylistM);

    //monster.animations.add('left', [1], 10, true);
    //monster.animations.add('right', [2], 10, true);

    /////////////////////

    //Weapon
    shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    weapon = game.add.weapon(1, 'bullet')

    weapon.bulletSpeed = 600;
    weapon.fireRate = 100;
    weapon.fireLimit = 15;

    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 500;

    // weapon.bulletLifespan = 0.1;
    weapon.trackSprite(player, 0, 0, true);
    game.physics.arcade.enable(weapon);
    blackback = game.add.sprite(2048,2048,'blackback');
    game.physics.enable(blackback, Phaser.Physics.ARCADE);
    scoreText = game.add.text(16, 16, 'Crystals collected: 0/10', { fontSize: '25px', fill: '#ffce00' });
    scoreText.fixedToCamera = true;

    game.camera.follow(player);
}

function update() {

    game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(weapon.bullets, ground, deleteBullet);


    move();
    /////////////////////////
    game.physics.arcade.collide(crystalgroup, ground);
    game.physics.arcade.collide(crystalgroup, player, crystalKillandCount, null, this);

    game.physics.arcade.collide(monstergroup, ground);
    game.physics.arcade.collide(monstergroup, weapon.bullets, killMonster, null, this);
    game.physics.arcade.collide(monstergroup, player, resetGame);
    // ammoText.text = 'Ammo: ' + ammo + '/15';
    alignovelay(blackback)
    //displayImage();
    /////////////////////////

    if (shoot.isDown)
    {
        weapon.fire();
        ammo -= 1;
    }

}

function render() {

    // game.debug.text(game.time.suggestedFps, 32, 32);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

function deleteBullet() {
  console.log("jkjkdf")
  weapon.killAll()
}

function resetAmmo() {
  Weapon.resetShots;
}


function ammoControl() {
  setInterval(function(){
    weapon.resetShots()
}, 15000);
}

function move(){
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -100;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 100;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }

    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        jumping = 1;
        player.body.velocity.y = -150;
        jumpTimer = game.time.now + 750;
    }
    if (cursors.down.isDown && jumping == 1 && !player.body.onFloor()){
      jumping = 0;
      player.body.velocity.y = +150;
    }

}

function alignovelay(blackback) {
  blackback.body.x = player.body.x - (blackback.body.width/2)+(player.body.width/2);
  blackback.body.y = player.body.y - (blackback.body.height/2)+(player.body.height/2);
}
function spawnmonsters(xlistM, ylistM) {
  for (i = 0; i < xlistM.length; i++) {
    spawnmonster(xlistM[i], ylistM[i], "monster" + i);
  }
}

function spawnmonster(x, y, monstername) {
  monster = monstergroup.create(x, y, 'monstersprite');

  monsterTween = game.add.tween(monster).to({
        x: monster.x + 100
  }, 750, 'Linear', true, 0, 150, true);
}


function spawncrystals(xlistC, ylistC) {
  for (i = 0; i < xlistC.length; i++) {
    spawncrystal(xlistC[i], ylistC[i], "crystal" + i);
  }
}

function spawncrystal(x, y, crystalname){
  var crystal = crystalgroup.create(x, y, 'crystal');
}


function crystalKillandCount(player, crystal) {
  crystal.kill();
  crystalsCollected += 1;

  scoreText.text = 'Crystals collected: ' + crystalsCollected + '/10xz';

  if (crystalsCollected == 10) {
    victory();
  }
}

function victory() {
    victory = game.add.sprite(player.x-400,player.y-300,'victory');
    player.immovable = true;
}

function ulost() {
    gameover = game.add.sprite(player.x-400,player.y-300,'gameover');
    player.immovable = true;
}

function resetGame() {
  crystalsCollected = 0;
  ulost();
}

function killMonster(bullet, monster) {
  monster.kill();
  bullet.kill();
}
