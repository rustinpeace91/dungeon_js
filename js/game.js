

var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // map tiles
        this.load.image('floor', 'assets/map/browntiles.png');

        // map tiles
        this.load.image('walls', 'assets/map/walls_19color.jpg');
        
        
        // map in json format

        this.load.tilemapTiledJSON('map', 'assets/map/dg2.json')
        // our two characters
        this.load.spritesheet('player', 'assets/knightanim.png', { frameWidth: 32, frameHeight: 32 });
    },

    create: function ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function ()
    {
        
    },
    create: function ()
    {
        // create the map
        var map = this.make.tilemap({ key: 'map' });
        
        // first parameter is the name of the tilemap in tiled
        var floorTiles = map.addTilesetImage('browntiles', 'floor');
        var wallTiles = map.addTilesetImage('bricks', 'walls')
        // creating the layers
        var grass = map.createStaticLayer('floors', floorTiles, 0, 0);
        var obstacles = map.createStaticLayer('walls', wallTiles, 0, 0);
        // // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);
        

        // //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [2]}),
            frameRate: 10,
            repeat: -1
        });
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [2]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [0]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [4] }),
            frameRate: 10,
            repeat: -1
        });        

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(48, 112, 'player', 6);
        
        // Wall tiles
        this.obstacles = obstacles;

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keyup_D', this.PrintCoords, this);
        this.input.keyboard.on('keyup_LEFT', this.MoveLeft, this);
        this.input.keyboard.on('keyup_UP', this.MoveUp, this);
        this.input.keyboard.on('keyup_RIGHT', this.MoveRight, this);
        this.input.keyboard.on('keyup_DOWN', this.MoveDown, this);

        
        // where the enemies will be
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);            
        }        
        // add collider
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);

    },

    onMeetEnemy: function(player, zone) {        
        // we move the zone to some other location
        // zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        // zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // // shake the world
        // this.cameras.main.shake(300);
        
        // start battle 
    },
    MoveLeft: function(){
        projected = this.player.x - 32
        if(this.CheckCollision(projected, this.player.y) === false){
            this.player.x -= 32;
        }
    },
    MoveUp: function(){
        projected = this.player.y - 32
        if(this.CheckCollision(this.player.x, projected) === false){
            this.player.y -= 32;
        }
    },
    MoveRight: function(){
        projected = this.player.x + 32
        if(this.CheckCollision(projected, this.player.y) === false){
            this.player.x += 32;
        }
    },
    MoveDown: function(){
        projected = this.player.y + 32
        if(this.CheckCollision(this.player.x, projected) === false){
            this.player.y += 32;
        }
    },
    PrintCoords: function(){
        console.log('DEEEEZ NUTZ');
        var current_tile = this.obstacles.getTileAtWorldXY(this.player.x, this.player.y, true);
        console.log(current_tile);
        console.log(this.player.x);
        console.log(this.player.y);


    },
    CheckCollision: function(x, y){
        next_tile = this.obstacles.getTileAtWorldXY(x, y, true);
        if(next_tile.index == 1){
            return true;
        } else {
            return false
        }
    },
    update: function (time, delta)
    {



        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
    
});

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 640,
    height: 480,
    zoom: 1,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);