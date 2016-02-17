//namespace
var PrimeEight = {
};

(function () {
	
	"use strict";
		
	PrimeEight.AntyGravity = {
	};


	PrimeEight.AntyGravity.Boot = function () {
		return this;
	};


	PrimeEight.AntyGravity.Boot.prototype = {

			preload: function () {
				
				// Assets required for preloader
				this.load.image('preloaderBackground', 'assets/preloader_background.png');
				this.load.image('preloaderBar', 'assets/preloader_bar.png');
	    },

			create: function () {
				this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
				this.scaleStage();
				this.state.start('Preloader');

	    },
    
			scaleStage:function(){
				if (this.game.device.desktop)
	        {
	            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
	        }
	        else
	        {
	            this.scale.scaleMode = Phaser.ScaleManager.NO_BORDER;
	            this.scale.forceOrientation(true, false);
	            this.scale.hasResized.add(this.gameResized, this);
	            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
	            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
	            this.scale.setScreenSize(true);
	        }
        
	        this.scale.minWidth = PrimeEight.AntyGravity.gameWidth/2;
	        this.scale.minHeight = PrimeEight.AntyGravity.gameHeight/2;
	        this.scale.maxWidth = PrimeEight.AntyGravity.gameWidth;
	        this.scale.maxHeight = PrimeEight.AntyGravity.gameHeight;
	        this.scale.pageAlignHorizontally = true;
	        this.scale.pageAlignVertically = true;
	        this.scale.setScreenSize(true);
        
					if(this.scale.scaleMode===Phaser.ScaleManager.NO_BORDER){
							PrimeEight.AntyGravity.viewX = (this.scale.width/2 - window.innerWidth/2)*this.scale.scaleFactor.x;
							PrimeEight.AntyGravity.viewY = (this.scale.height/2 - window.innerHeight/2 - 1)*this.scale.scaleFactor.y;
							PrimeEight.AntyGravity.viewWidth = PrimeEight.AntyGravity.gameWidth-PrimeEight.AntyGravity.viewX;
							PrimeEight.AntyGravity.viewHeight = PrimeEight.AntyGravity.gameHeight-PrimeEight.AntyGravity.viewY;
					}
					else {
							PrimeEight.AntyGravity.viewX = 0;
							PrimeEight.AntyGravity.viewY = 0;
							PrimeEight.AntyGravity.viewWidth = PrimeEight.AntyGravity.gameWidth;
							PrimeEight.AntyGravity.viewHeight = PrimeEight.AntyGravity.gameHeight;
					}
	
				this.styleGameDiv();
	    },

			gameResized: function (width, height) {
				this.styleGameDiv();
	    },

	    enterIncorrectOrientation: function () {

	        PrimeEight.AntyGravity.orientated = false;

	        document.getElementById('orientation').style.display = 'block';

	    },

	    leaveIncorrectOrientation: function () {

	        PrimeEight.AntyGravity.orientated = true;

	        document.getElementById('orientation').style.display = 'none';
					this.scaleStage();
	    }, 
			styleGameDiv: function () {
				document.getElementById("game").style.width = window.innerWidth+"px";
				document.getElementById("game").style.height = window.innerHeight-1+"px";//The css for body includes 1px top margin, I believe this is the cause for this -1
				document.getElementById("game").style.overflow = "hidden";
			}
	};
	PrimeEight.AntyGravity.Ant = function (game, x, y, sprite) {
	  Phaser.Sprite.call(this, game, x, y, sprite);
	  this.anchor.setTo(0.5, 0.5);

	  this.MIN_TUMBLE = 1.2;
		this.MAX_TUMBLE = 3;
		this.tumble = undefined;
		this.beenHit = false;
		this.animations.add('vanillaAnt', [0, 1]);
		this.animations.add('fireant1', [2, 3]);
		this.animations.add('fireant2', [2, 4]);
		this.animations.add('fireant3', [2, 5]);
		this.animations.add('fireant4', [2, 6]);
		this.animations.add('fireant5', [2, 7]);
		this.animations.add('zap', [8, 8, 8, 8, 8, 8]);
		this.animations.play('vanillaAnt', 12, true);
		this.tweenTime = 2500;
		this.fallingTween = undefined;
		this.setSpin();
	};

	PrimeEight.AntyGravity.Ant.prototype = Object.create(Phaser.Sprite.prototype);
	PrimeEight.AntyGravity.Ant.constructor = PrimeEight.AntyGravity.Ant;


	PrimeEight.AntyGravity.Ant.prototype.antUpdate = function() {
		if(!this.dying){
			this.angle += this.tumble;
		}
	};
	PrimeEight.AntyGravity.Ant.prototype.flameOn = function(dotFrame) {
		this.frame = dotFrame;
		this.animations.play(this.getAnimation(dotFrame), 12, true);
	};
	PrimeEight.AntyGravity.Ant.prototype.resetAnt = function() {
		this.beenHit = false;
		this.animations.play('vanillaAnt', 12, true);
		this.alive = true;
		this.exists = true;
		this.visible = true;
	};	
	PrimeEight.AntyGravity.Ant.prototype.setSpin = function(minT, maxT, spinDir) {
	
		spinDir = spinDir !== undefined ? spinDir : this.spinDirection();
		minT = minT !== undefined ? minT : this.MIN_TUMBLE;
		maxT = maxT !== undefined ? maxT : this.MAX_TUMBLE;
	
		this.tumble = (Math.floor(Math.random() * maxT) + minT) * spinDir;
	};
	PrimeEight.AntyGravity.Ant.prototype.spinDirection = function() {
		if(Math.random() <= 0.5){	return -1; }
		return 1;
	};
	PrimeEight.AntyGravity.Ant.prototype.getAnimation = function(dotFrame) {
	
		switch(dotFrame){
			case 0:
			return 'vanillaAnt';
		
			case 1:
			return 'fireant1';
		
			case 2:
			return 'fireant2';
		
			case 3:
			return 'fireant3';
		
			case 4:
			return 'fireant4';
		
			case 5:
			return 'fireant5';
		}
	};

}());