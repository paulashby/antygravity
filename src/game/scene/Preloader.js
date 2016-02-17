(function () {
	
	"use strict";
	
	PrimeEight.AntyGravity.Preloader = function (game) {

		this.background = null;
		this.preloadBar = null;

		this.ready = false;

	};

	PrimeEight.AntyGravity.Preloader.prototype = {

		preload: function () {

			this.background = this.add.sprite(0, 0, 'preloaderBackground');
			this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
			this.background.width = PrimeEight.AntyGravity.srx;
			this.preloadBar.width = PrimeEight.AntyGravity.srx;
			this.load.setPreloadSprite(this.preloadBar);
		
			this.load.bitmapFont('antyfont', 'assets/' + PrimeEight.AntyGravity.screen + '/font.png', 'assets/' + PrimeEight.AntyGravity.screen + '/font.fnt');
			this.load.bitmapFont('BoogalooPrime8', 'assets/' + PrimeEight.AntyGravity.screen + '/BoogalooPrime8/BoogalooPrime8.png', 'assets/' + PrimeEight.AntyGravity.screen + '/BoogalooPrime8/BoogalooPrime8.fnt'); 
		
			this.load.audio('woosh', ['assets/audio/primitive/woosh.mp3', 'assets/audio/primitive/woosh.ogg']);
			this.load.audio('bgLoop', ['assets/audio/freeSoundCreativeCommons/mouseOrgan.mp3', 'assets/audio/freeSoundCreativeCommons/mouseOrgan.ogg']);
			this.load.audio('fall', ['assets/audio/primitive/fall.mp3', 'assets/audio/primitive/fall.ogg']);
			this.load.audio('score1', ['assets/audio/primitive/sfx_bounce1.mp3', 'assets/audio/primitive/sfx_bounce1.ogg']);
			this.load.audio('score4', ['assets/audio/primitive/sfx_bounce4.mp3', 'assets/audio/primitive/sfx_bounce4.ogg']);
			this.load.audio('scoreProcessed', ['assets/audio/primitive/sfx_scoreProcessed.mp3', 'assets/audio/primitive/sfx_scoreProcessed.ogg']);
			this.load.audio('antZap', ['assets/audio/primitive/sfx_antZap1.mp3', 'assets/audio/primitive/sfx_antZap1.ogg']);
			this.load.audio('gameOver', ['assets/audio/primitive/sfx_gameOver.mp3', 'assets/audio/primitive/sfx_gameOver.ogg']);
			this.load.image('menuBackground','assets/' + PrimeEight.AntyGravity.screen + '/menuBackground.png');
		
			this.load.image('logo', 'assets/' + PrimeEight.AntyGravity.screen + '/antyLogo.png');
			this.load.image('background','assets/' + PrimeEight.AntyGravity.screen + '/background.png');
			this.load.image('clouds','assets/' + PrimeEight.AntyGravity.screen + '/clouds.png');
			this.load.image('horizon','assets/' + PrimeEight.AntyGravity.screen + '/horizon.png');
			this.load.image('instructionsDotAnt','assets/' + PrimeEight.AntyGravity.screen + '/instructionsDotAnt.png');
			this.load.spritesheet('ant', 'assets/' + PrimeEight.AntyGravity.screen + '/ants.png', PrimeEight.AntyGravity.antSize, PrimeEight.AntyGravity.antSize, 9);
			this.load.spritesheet('dot', 'assets/' + PrimeEight.AntyGravity.screen + '/dot.png', PrimeEight.AntyGravity.dotSize, PrimeEight.AntyGravity.dotSize, 8);
			this.load.spritesheet('buttons', 'assets/' + PrimeEight.AntyGravity.screen + '/buttons.png', PrimeEight.AntyGravity.buttonsWidth, PrimeEight.AntyGravity.buttonsHeight, 7);
			this.load.spritesheet('buttonsSound', 'assets/' + PrimeEight.AntyGravity.screen + '/buttonsSound.png', PrimeEight.AntyGravity.buttonsSoundWidth, PrimeEight.AntyGravity.buttonsSoundHeight, 4);
		
		},

		create: function () {
			//this.preloadBar.cropEnabled = false;
			this.ready = true;
			this.state.start('MainMenu');
		},

		update: function () {

			if (this.cache.isSoundDecoded('titleMusic') && this.ready === false){
				this.ready = true;
				this.state.start('MainMenu');
			}

		}

	};

}());