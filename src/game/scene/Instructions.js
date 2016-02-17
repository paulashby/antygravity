(function () {
	
	"use strict";
	
	PrimeEight.AntyGravity.Instructions = function (game) {

		this.music = null; 

	};

	PrimeEight.AntyGravity.Instructions.prototype = {

		create: function () {
			this.instructionsString = PrimeEight.AntyGravity.desktop ? 'CLICK THE DOTS TO\rBOUNCE THE ANTS' : 'TAP THE DOTS TO\rBOUNCE THE ANTS';
			this.woosh = this.game.add.audio('woosh');
		
			this.background = this.add.tileSprite(0,0, PrimeEight.AntyGravity.gameWidth, PrimeEight.AntyGravity.gameHeight, 'background');
			this.horizon = this.game.add.sprite(0, 0,'horizon');
			this.instructionsDotAnt = this.game.add.sprite(PrimeEight.AntyGravity.viewWidth/2, PrimeEight.AntyGravity.viewHeight * 0.85, 'instructionsDotAnt');
			this.instructionsDotAnt.anchor.setTo(0.5, 1);
			this.instructionsTxt = this.game.add.bitmapText(PrimeEight.AntyGravity.viewWidth * 0.1, PrimeEight.AntyGravity.viewHeight * 0.1, 'BoogalooPrime8', this.instructionsString, PrimeEight.AntyGravity.fntSize);
			this.OKbutton = this.game.add.button(PrimeEight.AntyGravity.viewWidth * 0.5, PrimeEight.AntyGravity.viewHeight * 0.5, 'buttons', this.onStartGame, this, 0, 0, 0, 0);
			this.OKbutton.anchor.setTo(0.5, 0.5);
			this.foregroundElements = this.add.group();
			this.foregroundElements.add(this.instructionsTxt);
			this.foregroundElements.add(this.OKbutton);
		
			//Set up exit tweens first as y values will otherwise be mid-tween when exit values are set
			this.dotTween = this.addTransitionTween(this.instructionsDotAnt, false, false);
			this.backgroundTween = this.addTransitionTween(this.foregroundElements, true, false);
			this.backgroundTween._lastChild.onComplete.add(this.onExitTweenComplete, this);
		
			this.dotTweenEntry = this.addTransitionTween(this.instructionsDotAnt, true, true);
			this.backgroundTweenEntry = this.addTransitionTween(this.foregroundElements, false, true);
			this.backgroundTweenEntry._lastChild.onComplete.add(this.onEntryTweenComplete, this);
			this.dotTweenEntry.start();
			this.backgroundTweenEntry.start();
		},
		addTransitionTween: function(tweenedObj, tweenUp, entryTween) {
			var transTween = this.add.tween(tweenedObj),
			tweenDir = tweenUp ? -1 : 1,
			y1dir = entryTween ? tweenDir : tweenDir * -1,
			tweenY1 = tweenedObj.y + ((PrimeEight.AntyGravity.gameHeight * 0.25) * y1dir),
			tweenY2 = entryTween ? tweenedObj.y : (PrimeEight.AntyGravity.gameHeight + tweenedObj.height) * tweenDir,
			tweenDuration = 150;
		  transTween.to( { y: tweenY1}, tweenDuration, Phaser.Easing.Quadratic.InOut)
		  .to( { y: tweenY2 }, tweenDuration, Phaser.Easing.Quadratic.InOut);
			if(entryTween){
				tweenedObj.y = (PrimeEight.AntyGravity.gameHeight + tweenedObj.height) * - tweenDir;
			}
			return transTween;		
		},
		onEntryTweenComplete: function(){
			this.woosh.play();
		},
		onExitTweenComplete: function(){
			this.game.state.start('Game');
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
		shutdown: function(){
			this.removeTween(this.backgroundTweenEntry);
			this.removeTween(this.dotTweenEntry);
			this.removeTween(this.backgroundTween);
			this.removeTween(this.dotTween);
			this.foregroundElements.destroy(true);
			this.instructionsString = null;
			this.removeSound(this.woosh);
			this.background.destroy();
			this.horizon.destroy();
			this.foregroundElements.destroy(true);		
			this.instructionsDotAnt.destroy();
		},
		onStartGame: function(){
			this.backgroundTween.start();
			this.dotTween.start();
		}
	};
}());	