(function () {
	
	"use strict";
	
	PrimeEight.AntyGravity.MainMenu = function (game) {

		this.music = null;
		this.playButton = null;

	};

	PrimeEight.AntyGravity.MainMenu.prototype = {

		create: function () {
			this.background = this.game.add.sprite(0,0, 'menuBackground');
			this.logo = this.game.add.sprite(PrimeEight.AntyGravity.viewWidth * 0.04, PrimeEight.AntyGravity.viewY + PrimeEight.AntyGravity.viewHeight * 0.05, 'logo');
			this.playButton = this.game.add.button(PrimeEight.AntyGravity.viewWidth * 0.7, PrimeEight.AntyGravity.viewHeight * 0.8, 'buttons', this.onPlay, this, 1, 1, 1, 1);
			this.playButton.anchor.setTo(0.5, 0.5);
		
			//Set up exit tweens first as y values will otherwise be mid-tween when exit values are set
			this.logoTween = this.addTransitionTween(this.logo, false, false);
			this.buttonTween = this.addTransitionTween(this.playButton, true, false);
			this.buttonTween._lastChild.onComplete.add(this.onNextState, this);

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
		onNextState: function() {
			this.game.state.start('Instructions');
		},
		onPlay: function() {
			this.logoTween.start();
			this.buttonTween.start();
		},
		removeTween: function(_tween) {
			if (_tween) {
				_tween.onComplete.removeAll();
				_tween.stop();
				_tween = null;
			}
		},
		shutdown: function(){
			this.background.destroy();
			this.removeTween(this.logoTween); 
			this.removeTween(this.buttonTween);
			this.logo.destroy();
			this.playButton.destroy();			
		}
	};
}());
