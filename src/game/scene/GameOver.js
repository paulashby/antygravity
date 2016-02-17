(function () {
	
	"use strict";
	
	PrimeEight.AntyGravity.GameOver = function (game) {
		return this;
	};

	PrimeEight.AntyGravity.GameOver.prototype = {

	  create: function () {
			this.FONT_SIZE = Math.floor(this.game.height/10.5);
			this.background = this.game.add.sprite(0,0,'background');
			this.horizon = this.game.add.sprite(0, 0,'horizon');
			this.totalScore = PrimeEight.AntyGravity.totalScore.toString();
			this.bestScore = localStorage.getItem('bestScore');
		
			this.woosh = this.game.add.audio('woosh');
			this.woosh.play();
		
			if(this.bestScore === null || parseInt(this.bestScore, 10) < parseInt(this.totalScore, 10)){
				this.bestScore = this.totalScore;
				localStorage.setItem('bestScore', this.bestScore);
				this.bestScoreLabel = this.game.add.sprite(this.game.width * 0.0645, this.game.height * 0.35, 'buttons', 6);
			}
			else{
				this.bestScoreLabel = this.game.add.sprite(this.game.width * 0.0645, this.game.height * 0.35, 'buttons', 5);
			}
			this.scoreGroup = this.add.group(); 
			this.buttonGroup = this.add.group();
		
			this.scoreLabel = this.game.add.sprite(this.game.width * 0.14, this.game.height * 0.173, 'buttons', 4);
			this.scoreText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.202, 'antyfont', this.totalScore, this.FONT_SIZE);
			this.bestScoreText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.379, 'antyfont', this.bestScore, this.FONT_SIZE);
			this.shareBttn = this.game.add.button(this.game.width * 0.511, this.game.height * 0.585, 'buttons', this.onMenu, this, 3, 3, 3, 3);
			this.playAgainBttn = this.game.add.button(this.game.width * 0.175, this.game.height * 0.585, 'buttons', this.onPlayAgain, this, 2, 2, 2, 2);

		 	this.scoreGroup.add(this.scoreLabel);
			this.scoreGroup.add(this.bestScoreLabel);
			this.scoreGroup.add(this.scoreText);
			this.scoreGroup.add(this.bestScoreText);
		
			this.buttonGroup.add(this.shareBttn);
			this.buttonGroup.add(this.playAgainBttn);
		
			//Set up exit tweens first as y values will otherwise be mid-tween when exit values are set
			this.scoreTween = this.addTransitionTween(this.scoreGroup, false, false);
			this.buttonTween = this.addTransitionTween(this.buttonGroup, true, false);
			this.buttonTween._lastChild.onComplete.add(this.onStartGame, this);

			this.scoreTweenEntry = this.addTransitionTween(this.scoreGroup, true, true);
			this.buttonTweenEntry = this.addTransitionTween(this.buttonGroup, false, true);
			this.scoreTweenEntry.start();
			this.buttonTweenEntry.start();
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
		onStartGame: function(){
			this.game.state.start('Game');
		},
	  onPlayAgain: function () {
			this.scoreTween.start();
			this.buttonTween.start();
		},
		onMenu: function () {
	    //back to main menu
			window.location.href = 'http://www.primitive.co/games/starmites/';
		},
		shutdown: function(){
			this.removeTween(this.buttonTweenEntry);
			this.removeTween(this.scoreTweenEntry);
			this.removeTween(this.buttonTween);
			this.removeTween(this.scoreTween);
			this.background.destroy();
			this.horizon.destroy();
			this.removeSound(this.woosh);
			this.buttonGroup.destroy();
			this.scoreGroup.destroy();
		}
	};
}());