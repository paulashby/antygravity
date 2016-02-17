(function () {
	
	"use strict";
	
	PrimeEight.AntyGravity.Game = function (game) {
		return this;
	};

	PrimeEight.AntyGravity.Game.prototype = {

		create: function () {
			var i,
			ppLogoClearance;			
			
			// keep the spacebar from propogating up to the browser
			this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

	    	// add mouse/touch controls
			this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.fireKey.onDown.add(this.onFire, this);
	
			this.DOT_SIZE = PrimeEight.AntyGravity.dotSize;
			this.NUM_DOTS = PrimeEight.AntyGravity.numDots;
			this.CONTROL_DOT_Y = PrimeEight.AntyGravity.viewHeight - this.DOT_SIZE;
			this.COLLISION_ZONE = this.CONTROL_DOT_Y - (this.DOT_SIZE/2);
			this.NUM_PULSE_FRAMES = 6;		
			this.PULSE_FRAME_RATE = 100;
			this.FIRST_ANT_DELAY = 1000;
			this.ADD_ANT_RATE = 7500;
			this.PORTAL_Y = this.game.height/5;
	
			this.ANT_SCORE_TWEEN_DURATION = 2000;
			this.ANT_SCORE_TARGET = -(this.game.height/5);
			this.SCORE_INSET = 7;
			this.FONT_SIZE = Math.round(PrimeEight.AntyGravity.gameHeight/10.67);
			this.MIN_BOUNCE_SPIN = 2;
			this.MAX_BOUNCE_SPIN = 6;
			this.BOUNCE_SPIN_DIR = -1;
			this.BOUNCE_SPACE = this.game.height - (this.game.height - this.CONTROL_DOT_Y);
			this.BOUNCE = Math.floor(this.BOUNCE_SPACE/this.NUM_PULSE_FRAMES);
			this.MIN_BOUNCE = this.BOUNCE_SPACE - (this.BOUNCE + this.DOT_SIZE/2);	
			this.BOUNCE_SCORE = 2;
	
			this.background = this.add.tileSprite(0,0, PrimeEight.AntyGravity.gameWidth, PrimeEight.AntyGravity.gameHeight, 'background');
			this.background.autoScroll(-15, 0);
			this.horizon = this.game.add.sprite(0, 0,'horizon');
			this.clouds = this.game.add.tileSprite(0,this.game.height/3, this.game.width, PrimeEight.AntyGravity.cloudHeight, 'clouds');
			this.clouds.autoScroll(-30, 0);
	
			// Audio
			this.music = this.game.add.audio('bgLoop', 1,true);
			this.music.play('',0,1,true);
			var chrome = window.chrome;
			if(chrome){
				// Workaround as Chrome has deprecated 'webkitAudioContext'
				this.music.onLoop.add(this.playMusic, this);
			}
			this.music.volume = 0.9;
			this.fallingAntSound = this.game.add.audio('fall');
			this.scoreSound1 = this.game.add.audio('score1');
			this.scoreSound4 = this.game.add.audio('score4');
			this.scoreSounds = [this.scoreSound1, this.scoreSound4, 
													this.scoreSound1, this.scoreSound4,
													this.scoreSound1 ,this.scoreSound4];
			this.scoreProcessedSound = this.game.add.audio('scoreProcessed');
			this.scoreProcessedSound.volume = 0.6;
			this.antZapSound = this.game.add.audio('antZap');
			if(!PrimeEight.AntyGravity.gameOverSound){
				PrimeEight.AntyGravity.gameOverSound = this.game.add.audio('gameOver');
			}
			PrimeEight.AntyGravity.gameOverSound.volume = 0.5;
			this.woosh = this.game.add.audio('woosh');
			this.woosh.play();
	
			// Ants
			this.ants = this.add.group();
			this.portals = [];
			this.activePortals = [0, 0, 0];
			this.portal = 0;
	
			// Dots
			this.dots = this.add.group();
			this.dots.x = this.DOT_SIZE;
			this.activeDot = 0;
			this.pulseNum = 0;
			this.dotState = [];
			this.pulsing = false;
	
			PrimeEight.AntyGravity.totalScore = 0;
			ppLogoClearance = PrimeEight.AntyGravity.desktop ? PrimeEight.AntyGravity.viewX + (this.SCORE_INSET * 2) : 50;
			this.scoreText = this.game.add.bitmapText(ppLogoClearance, PrimeEight.AntyGravity.viewY + this.SCORE_INSET, 'antyfont', PrimeEight.AntyGravity.totalScore.toString(), this.FONT_SIZE);
			this.hud = this.game.add.group();
	
			for (i = 0; i < this.NUM_DOTS; i++){
				this.addDot(i);
				this.addPortal(i);
			}
			this.resetDots();
			this.dotState[0] = 7;

			this.pulseTimer = this.time.create(false);
			this.pulseTimer.loop(this.PULSE_FRAME_RATE, this.onPulse, this);
			this.pulseTimer.add(Math.random() * this.FIRST_ANT_DELAY, this.addAnt, this);
			this.pulseTimer.start();
			this.antTimer = this.game.time.create(false);
	
			this.soundButton = this.game.add.button(PrimeEight.AntyGravity.viewWidth - (PrimeEight.AntyGravity.buttonsSoundWidth * 1.5), PrimeEight.AntyGravity.viewY + this.SCORE_INSET, 'buttonsSound', this.onToggleSound, this, 2, 2, 2, 2);
			this.musicButton = this.game.add.button(PrimeEight.AntyGravity.viewWidth - (PrimeEight.AntyGravity.buttonsSoundWidth * 2.7), PrimeEight.AntyGravity.viewY + this.SCORE_INSET, 'buttonsSound', this.onToggleMusic, this, 0, 0, 0, 0);
			if(this.game.soundOff) {
				this.onSoundOff();
			}
			if(this.game.musicOff) {
				this.onMusicOff();
			}
	
		},

		playMusic: function() {
			this.music.play('', 0, 1, true);
		},
		update: function () {
			this.ants.forEach(function(ant){
				if(ant.y < this.CONTROL_DOT_Y) {
					ant.antUpdate();
					this.checkBounce(ant);
				}
				else if(!ant.beenHit){ // Ant is being zapped
			
					ant.y = this.CONTROL_DOT_Y;
					this.antZapSound.play();
					ant.animations.play('zap', this.PULSE_FRAME_RATE, false);
			
					ant.dying = true;
					ant.antUpdate();

					this.pulseTimer.add(100, this.killAnt, this, ant);
					this.pulseTimer.start();
					ant.beenHit = true;
					this.game.tweens.remove(ant.fallingTween);
				}
			}, this);

		},
		killAnt: function(ant) {
			ant.exists = false;
	
			// if no ants exist exists, game over
			if(!this.antExists()) {
				this.deathHandler();
			}
	
		},
		antExists: function(){
			return this.ants.getFirstExists(true) === null ? false : true;
		},

		onHit: function(dotSprite, antSprite) {
	
			var dotFrame = dotSprite.frame;
		
			if(dotFrame < this.NUM_PULSE_FRAMES && !antSprite.dying){ // Ant is being bounced
			
				if(!antSprite.beenHit) { // Scored!
					this.onScore(antSprite, dotFrame);
				}
				this.bounceAnt(antSprite, dotSprite, dotFrame);
			}	
		},
		onScore: function(antSprite, dotFrame) {
			var justScored = this.BOUNCE_SCORE *  (dotFrame + 1), // extra for distance
			antScore = this.hud.getFirstExists(false),
			AntScoreTween;
	
			// Set ant colour depending on dot frame
			antSprite.flameOn(dotFrame);
	
			if(!antScore) { // No exisitng scores available - make a new one
				antScore = this.game.add.bitmapText(antSprite.x, antSprite.y, 'antyfont', justScored.toString(), this.FONT_SIZE);
	    	this.hud.add(antScore);
			}
			else{ // Use existing antScore
				antScore.x = antSprite.x;
				antScore.y = antSprite.y - antScore.textHeight/2;
				antScore.setText(justScored.toString());
			}
			antScore.exists = true;
			antScore.align = 'center';
			AntScoreTween = this.game.add.tween(antScore).to({y: this.ANT_SCORE_TARGET}, this.ANT_SCORE_TWEEN_DURATION, Phaser.Easing.Linear.InOut, true);
			AntScoreTween.start();
			AntScoreTween.onComplete.add(this.processAntScore, this, {obj: antScore});
			this.scoreSounds[dotFrame].play();
	
		},
		processAntScore: function(texOb) {
			var processedScore = parseInt(texOb.text, 10),
			newScore;
			texOb.exists = false;
			if(processedScore > 0){
				PrimeEight.AntyGravity.totalScore += processedScore/2;
			}
			else{
				newScore = PrimeEight.AntyGravity.totalScore + processedScore;
				if(newScore > 0){
					PrimeEight.AntyGravity.totalScore = newScore;
				}
				else{
					PrimeEight.AntyGravity.totalScore = 0;
				}
			}
			this.scoreText.setText(PrimeEight.AntyGravity.totalScore.toString());
			this.scoreProcessedSound.play();
		},
		onFire: function() {
			this.pulse( this.getFiringDot() );
		},
		getFiringDot: function() { // Used for spacebar control
			return Math.floor(((this.game.input.activePointer.x + (this.DOT_SIZE/2)) - this.DOT_SIZE) / this.DOT_SIZE);
		},
		setFloatTime: function(dotSprite) { // returns duration of bounce tween based on height of bounce
			 return this.BOUNCE_TWEEN_DURATION * (dotSprite.frame + 1);
		},
		setFloatTarget: function(dotFrame) { // Returns y value for bounce target based on which dot frame was hit
			return dotFrame === this.NUM_PULSE_FRAMES - 1 ? this.PORTAL_Y : Math.floor(this.MIN_BOUNCE - this.BOUNCE * dotFrame);
		},

		// Ant functions
		addAnt: function() {
			var antx = this.portals[Math.floor(Math.random() * (this.portals.length - 1) )],
			anty = this.PORTAL_Y,
			recycledAnt = this.ants.getFirstExists(false),
			Ant,
			tweenTime;
			if(!recycledAnt) { // No exisitng ants available - make a new one
				Ant = PrimeEight.AntyGravity.Ant;
				recycledAnt = new Ant(this.game, antx, anty, 'ant');
			}
			else{ // Use existing ant
				recycledAnt.reset(antx, anty);
				recycledAnt.resetAnt();
			}
			recycledAnt.scale.x = 1;
			recycledAnt.scale.y = 1;
			this.ants.add(recycledAnt);
			tweenTime = 2500;
			recycledAnt.fallingTween = this.game.add.tween(recycledAnt);
			recycledAnt.fallingTween.to({y: this.game.height}, tweenTime, Phaser.Easing.Quartic.In, true);
			this.fallingAntSound.play();
			this.antTimer.add(this.ADD_ANT_RATE, this.addAnt, this);
			this.antTimer.start();
		},
		addPortal: function(i) {
		  this.portals.push( this.DOT_SIZE + (this.DOT_SIZE * i));
		},
		checkBounce: function(ant){
			if(ant.y >= this.COLLISION_ZONE){
				this.dots.forEach(function(dot){
					if(ant.x >= dot.x && ant.x <= dot.x + this.DOT_SIZE){
						this.onHit(dot, ant);
					}
				}, this);
			}
		},
		bounceAnt: function(antSprite, dotSprite, dotFrame) {
			antSprite.bounceCounted = false;
			var tweenTime = this.setFloatTime(dotSprite),
			currX,
			targetX,
			deltaX;

			// Make sure we only set target for tween once
			if(antSprite.beenHit === false) {
				antSprite.beenHit = true;
				antSprite.setSpin(this.MIN_BOUNCE_SPIN, this.MAX_BOUNCE_SPIN, this.BOUNCE_SPIN_DIR);

				currX = antSprite.x;
				targetX = this.DOT_SIZE + (this.DOT_SIZE * (Math.floor(Math.random() * this.NUM_DOTS) ));
				deltaX = targetX - currX;

				antSprite.floatTweenX = this.game.add.tween(antSprite).to({x: currX + (deltaX/2)}, tweenTime, Phaser.Easing.Linear.InOut, true)
				.to({x: currX + deltaX}, this.setFloatTime(dotSprite), Phaser.Easing.Linear.InOut);
				antSprite.floatTweenY = this.game.add.tween(antSprite).to({y: this.setFloatTarget(dotFrame)}, tweenTime, Phaser.Easing.Quadratic.Out, true)
				.to({y: this.CONTROL_DOT_Y + 1}, this.setFloatTime(dotSprite), Phaser.Easing.Quadratic.In);
				antSprite.floatTweenY.onComplete.add(this.onBounceComplete, this, {obj: this.ant});
			}		
		},
		onBounceComplete: function(antSprite, maxBounces){// Reset beenHit so next hit registers
			antSprite.beenHit = false; 
		},

		// Dot functions
		addDot: function(i) {
			var dot = this.add.sprite(i * this.DOT_SIZE, this.CONTROL_DOT_Y, 'dot', this.NUM_PULSE_FRAMES);
			dot.anchor.setTo(0.5, 0.5);
			dot.inputEnabled = true;

			dot.frame = this.NUM_PULSE_FRAMES;
			this.dots.add(dot);
			dot.events.onInputDown.add(this.onDotClick, this);
		},
		onDotClick: function(sprite) {
			this.pulse(this.dots.getIndex(sprite));
		},
		updateDotSprites: function(){
			var i;
			// Update dots to match dotState (which is a list containing the frame number for each dot)
			for (i = 0; i < this.dots.length; i++){
				this.dots.getAt(i).frame = this.dotState[i];
			}
		},

		// Dot group functions
		pulse: function(clickedDot) {
			this.activeDot = clickedDot;
			this.pulsing = true;
			this.pulseNum = 0;
		},
		updateDotState: function() {
			if(this.pulsing === true){
				this.resetDots();

				// Set each dot in pulse to display correct frame
				if(this.pulseNum < this.NUM_PULSE_FRAMES){
					this.dotState[this.activeDot % this.NUM_DOTS] = this.pulseNum;
					this.pulseNum++;
					this.activeDot++;
				}
				else{
					this.pulsing = false;
					this.pulseNum = 0;
				}
			}
			else{
				this.resetDots();
				this.dotState[this.activeDot % this.NUM_DOTS] = 7;
				this.activeDot++;
			}
		},
		resetDots: function(numDots) {
			var i;
			for(i = 0; i < this.NUM_DOTS; i++){
				this.dotState[i] = 6;
			}
		}	,
		onPulse: function(sprite) {
				this.updateDotState();
				this.updateDotSprites();
		},
		onToggleSound: function() {
			if(this.game.soundOff){
				this.onSoundOn();
			}
			else{
				this.onSoundOff();
			}
		},
		onToggleMusic: function() {
			if(this.game.musicOff){
				this.onMusicOn();
			}
			else{
				this.onMusicOff();
			}
		},
		onMusicOn: function() {
			this.music.play('',0,1,true);
			this.musicButton.setFrames(0, 0, 0, 0);
			this.game.musicOff = false;
		},	
		onMusicOff: function() {
			this.music.stop();
			this.musicButton.setFrames(1, 1, 1, 1);
			this.game.musicOff = true;
		},
		onSoundOn: function() {
			this.game.sound.volume = 1;
			this.soundButton.setFrames(2, 2, 2, 2);
			this.game.soundOff = false;
		},	
		onSoundOff: function() {
			this.game.sound.volume = 0;
			this.soundButton.setFrames(3, 3, 3, 3);
			this.game.soundOff = true;
		},
		removeSound: function(_sound) {
			_sound.stop();
			_sound = null;		
		},
		removeTween: function(_tween) {
			if (_tween) {
				_tween.onComplete.removeAll();
				_tween.stop();
				_tween = null;
			}
		},	
		deathHandler: function(){
			PrimeEight.AntyGravity.gameOverSound.play();
			this.state.start('GameOver');
		},
		shutdown: function(){
			this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
			this.fireKey.onDown.remove(this.onFire, this);
			this.background.destroy();
			this.horizon.destroy();
			this.clouds.destroy();
			this.hud.destroy();
			this.pulseTimer.stop();
			this.antTimer.stop();
			this.ants.destroy();
			this.dots.destroy();
			this.removeSound(this.music);
			this.removeSound(this.fallingAntSound);
			this.scoreSounds = null;
			this.removeSound(this.scoreSound1);
			this.removeSound(this.scoreSound4);
			this.removeSound(this.scoreProcessedSound);
			this.removeSound(this.antZapSound);
			this.removeSound(this.woosh);
		}
	};
}());