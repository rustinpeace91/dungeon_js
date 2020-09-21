
// TODO: Learn to transition data betwen scnes https://stackoverflow.com/questions/63213325/phaser-3-share-custom-object-data-between-scenes
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
        this.load.spritesheet('avatar', 'assets/knightanim.png', { frameWidth: 32, frameHeight: 32 });
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
        

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('avatar', { frames: [2]}),
            frameRate: 10,
            repeat: -1
        });
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('avatar', { frames: [2]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('avatar', { frames: [0]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('avatar', { frames: [4] }),
            frameRate: 10,
            repeat: -1
        });        
        // actual player status
        this.game.player = Object.create(player)
        // our avatar sprite created through the physics system
        this.avatar = this.physics.add.sprite(48, 112, 'avatar', 6);
        
        // Wall tiles
        this.obstacles = obstacles;

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.avatar.setCollideWorldBounds(true);
        
        // don't walk on trees
        this.physics.add.collider(this.avatar, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.avatar);
        this.cameras.main.roundPixels = true; // avoid tile bleed
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keyup_D', this.DebugMeth, this);
        this.input.keyboard.on('keyup_LEFT', this.MoveLeft, this);
        this.input.keyboard.on('keyup_UP', this.MoveUp, this);
        this.input.keyboard.on('keyup_RIGHT', this.MoveRight, this);
        this.input.keyboard.on('keyup_DOWN', this.MoveDown, this);
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.reSpawnEnemies()


    },
    reSpawnEnemies: function(){
        // where the enemies will be
        for(var i = 0; i < 50; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 32, 32);            
        }        
        // add collider
        this.physics.add.overlap(this.avatar, this.spawns, this.onMeetEnemy, false, this);
    },
    onMeetEnemy: function() {        
        // we move the zone to some other location
        // zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        // zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // // shake the world

        this.cameras.main.shake(300);
        // switch to BattleScene
        this.scene.switch('BattleScene');
        
        // start battle 
    },
    MoveLeft: function(){
        projected = this.avatar.x - 32
        if(this.CheckCollision(projected, this.avatar.y) === false){
            this.avatar.x -= 32;
        }
    },
    MoveUp: function(){
        projected = this.avatar.y - 32
        if(this.CheckCollision(this.avatar.x, projected) === false){
            this.avatar.y -= 32;
        }
    },
    MoveRight: function(){
        projected = this.avatar.x + 32
        if(this.CheckCollision(projected, this.avatar.y) === false){
            this.avatar.x += 32;
        }
    },
    MoveDown: function(){
        projected = this.avatar.y + 32
        if(this.CheckCollision(this.avatar.x, projected) === false){
            this.avatar.y += 32;
        }
    },
    DebugMeth: function(){
        this.onMeetEnemy()
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


        // TODO: consolidate this with the movement fucnctions 
        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.avatar.anims.play('left', true);
            this.avatar.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.avatar.anims.play('right', true);
            this.avatar.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.avatar.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.avatar.anims.play('down', true);
        }
        else
        {
            this.avatar.anims.stop();
        }
    }
    
});


	
var BattleScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function BattleScene ()
    {
        Phaser.Scene.call(this, { key: 'BattleScene' });
    },
    create: function ()
    {
        // set the background of the main scene green
        this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
        // Run UI Scene at the same time
        this.scene.run('UIScene');
    }
});
 
var UIScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'UIScene' });
    },
 
    create: function ()
    {       
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);        
        this.graphics.strokeRect(2, 150, 90, 100);
        this.graphics.fillRect(2, 150, 90, 100);
        this.graphics.strokeRect(95, 150, 90, 100);
        this.graphics.fillRect(95, 150, 90, 100);
        this.graphics.strokeRect(188, 150, 130, 100);
        this.graphics.fillRect(188, 150, 130, 100);
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
        WorldScene,
        BattleScene,
        UIScene
    ]
};
var game = new Phaser.Game(config);