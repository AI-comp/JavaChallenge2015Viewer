// player の配置
var MAP_WIDTH=40; // 8 block * 8 block, 1block = 5*5 
var playersNum=4;
var INITIAL_LIFE=5;
var NumPannel=8;
var FORCED_END_TURN=10000;
var MaxTurn=10000;
var currTurn=0; // 現在ターンで、0 のときは初期配置
var targetTurn=0;
var allBoard=[];
var Life=[];
var PlayerPos=[];
var PlayerCommand=[];
var GoToFirstTurn=false;
var GoToLastTurn=false;
var replaySpeed=0.5;
//"curr" means current
// input log from text file
var Arr = []; // for adding strings written in text(log)
STR=replay; // input from replay(string)
var tmpArr=[];
var STRtmp=STR.split("\n");
var i=0;
for(i=0;i<STRtmp.length;++i){ Arr.push(STRtmp[i]);}
cc.log("Arr: "+Arr.length);
MaxTurn=parseInt(Arr.length/47)-1; // Turn が0 origin の場合 -1 すること!!
cc.log("MaxTurn: "+MaxTurn);
var j=0;
for(j=0;j<=MaxTurn;++j){
	var J=47*j;
	currTurn=parseInt(Arr[J+0][0],10);
	cc.log("currTurn: " + currTurn);
	Life[currTurn]=Arr[J+1].split(" ").map(function(v) { return parseInt(v); });
	cc.log("Life: "+Life[currTurn]);
	var currboard =[[],[]];
	var i=0;
	for(i=0;i<MAP_WIDTH;++i){
		currboard[i] = Arr[J+i+2].split(" ").map(function(v) { return parseInt(v); });
		//cc.log(currboard[i]);
	}
	cc.log("currboard: "+currboard.length);
	allBoard[currTurn]=currboard;
	PlayerPos[currTurn]=[[],[],[],[]];
	for(i=42;i<42+playersNum;++i){
		var tmp=Arr[J+i].split(" ");
		PlayerPos[currTurn][i-42][0] = parseInt(tmp[0],10);
		PlayerPos[currTurn][i-42][1] = parseInt(tmp[1],10);
		PlayerPos[currTurn][i-42][2] = tmp[2];
	}
	cc.log("PlayerPos: "+PlayerPos[currTurn]);
	PlayerCommand[currTurn]=Arr[J+i].split(" ");
	cc.log("PlayerCommand: "+PlayerCommand[currTurn]);
}

//
var BaseLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super(); // initialize 
        var size = cc.winSize; // window size
        if(currTurn<MaxTurn*0.8){
        	this.sprite = new cc.Sprite(res.BackGround01_jpg);
        }else{
        	this.sprite = new cc.Sprite(res.BackGround02_jpg);	// evening
        }
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 0
        });
        this.sprite.setScale(1);
        this.addChild(this.sprite, 0);
        return true;
    }
});

// character and field
var FieldLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		this._super(); // initialize 
		var size = cc.winSize; // window size
		var board=[[],[]];
		board=allBoard[currTurn]; // set board to current Turn
		var i,j;
		// field の座標
		var fieldX=new Array();
		for(i=0;i<MAP_WIDTH;++i) fieldX[i]= cc.winSize.width/NumPannel+10*i;
		var fieldY=new Array();
		for(i=0;i<MAP_WIDTH;++i) fieldY[i]=cc.winSize.height- 40 - i*10;
		// 2 * n + 5 (the center of the pannel)
		for(j=0;j<NumPannel;++j){
			for(i=0;i<NumPannel;++i){
				var NUM=board[5*j+2][5*i+2];
				if(NUM<0) continue;
				if((i+j)%2==0){
					this.sprite = new cc.Sprite(res.block4_png);
				}else{
					this.sprite = new cc.Sprite(res.block7_png);
				}
				this.sprite.attr({
				x: fieldX[2+5*i],
				y: fieldY[2+5*j],
				scale: 50/16, // pannel 16x16 -> 50x50
				rotation: 0
				});
				// board[y][x]
				this.addChild(this.sprite, 0);
				if(NUM>0){
					var Fout=cc.FadeTo.create(1.5,50+NUM*30);
					var Fin=cc.FadeIn.create(1.5);
					var TMP=cc.sequence(Array(Fout,Fin));
					this.sprite.runAction(cc.repeatForever(TMP));				
				}
				/*
				if(NUM>0){
					// this shows the number of pannel's life on the pannel.				
					var TurnLabel = new cc.LabelTTF(NUM, "Arial", 30);
					TurnLabel.x = fieldX[2+5*i];
					TurnLabel.y = fieldY[2+5*j];
					TurnLabel.setColor(cc.color(100,100,100,0));
					this.addChild(TurnLabel, 0);
				}
				*/
			}
		}
		// Player
		for(i=0;i<playersNum;++i){
			var dir=PlayerPos[currTurn][i][2];
			dir=dir[0]; // because of dir[1]=='\n'
			if(i==0){		
				switch (dir) {
				case "L":
					this.sprite = new cc.Sprite(res.chara1L_png);
					break;
				case "R":
					this.sprite = new cc.Sprite(res.chara1R_png);
					break;
				case "U":
					this.sprite = new cc.Sprite(res.chara1B_png);
					break;
				default: // D, or N
					this.sprite = new cc.Sprite(res.chara1F_png);
					break;
				}
			}else if(i==1){
				switch (dir) {
				case "L":
					this.sprite = new cc.Sprite(res.chara2L_png);
					break;
				case "R":
					this.sprite = new cc.Sprite(res.chara2R_png);
					break;
				case "U":
					this.sprite = new cc.Sprite(res.chara2B_png);
					break;
				default: // D, or N
					this.sprite = new cc.Sprite(res.chara2F_png);
				break;
				}
			}else if(i==2){
				switch (dir) {
				case "L":
					this.sprite = new cc.Sprite(res.chara3L_png);
					break;
				case "R":
					this.sprite = new cc.Sprite(res.chara3R_png);
					break;
				case "U":
					this.sprite = new cc.Sprite(res.chara3B_png);
					break;
				default: // D, or N
					this.sprite = new cc.Sprite(res.chara3F_png);
				break;
				}
			}else{
				switch (dir) {
				case "L":
					this.sprite = new cc.Sprite(res.chara4L_png);
					break;
				case "R":
					this.sprite = new cc.Sprite(res.chara4R_png);
					break;
				case "U":
					this.sprite = new cc.Sprite(res.chara4B_png);
					break;
				default: // D, or N
					this.sprite = new cc.Sprite(res.chara4F_png);
				break;
				}
			}
			var PX=PlayerPos[currTurn][i][0];
			var PY=PlayerPos[currTurn][i][1];
			this.sprite.attr({
				x: fieldX[PX],
				y: fieldY[PY], 
				scale: 60/30, // ?? chara 30x30, pannel 50x50
				rotation: 0
			});
			// キャラクターの重心と位置座標が同一だと、違和感がある
			// (0.5,0.5)で中心を表す
			this.sprite.setAnchorPoint(0.5, 0.25);		
			//this.sprite.setScale(1);
			if(PX!=-1 && PY!=-1) 
				this.addChild(this.sprite, 0);
		}
		return true;
	}
});

var MenuLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		this._super(); // initialize
		var size = cc.winSize; // window size
		var i;
		for(i=0;i<playersNum;++i){
			switch (i) {
			case 0:
				this.sprite = new cc.Sprite(res.Menu1_png);
				break;
			case 1:
				this.sprite = new cc.Sprite(res.Menu2_png);
				break;
			case 2:
				this.sprite = new cc.Sprite(res.Menu3_png);
				break;
			case 3:
				this.sprite = new cc.Sprite(res.Menu4_png);
				break;
			default:
				break;
			}
			this.sprite.attr({
				x: size.width,
				y: size.height-75*i, // 画像サイズ(200*75)
				scale: 1,
				rotation: 0
			});
			this.sprite.setAnchorPoint(1, 1);	
			this.addChild(this.sprite, 0);
			var Labelsize=25;
			var NAME = "Player" + (i+1);
			var PlayerLabel = new cc.LabelTTF(NAME, "Arial", Labelsize);
			PlayerLabel.x = size.width - 100 ;
			PlayerLabel.y = size.height -40 + Labelsize - 75*i;
			PlayerLabel.setColor(cc.color(10,10,10,0));
			this.addChild(PlayerLabel, 0);

			// life
			var k;
			for(k=0;k<INITIAL_LIFE;++k){
				var tmp = Life[currTurn][i];
				if(k<tmp){
					this.sprite = new cc.Sprite(res.life1_png);
				}else{
					this.sprite = new cc.Sprite(res.life2_png);
				}
				this.sprite.attr({
					x: 40 * k + size.width - 180 ,
					y: size.height - 55 - 75*i,
					scale: 0.75,
					rotation: 0
				});
				this.addChild(this.sprite, 0);
			}
		}

		// Menubar(it shows parameters, such as current turn)
		// manual replay
		this.sprite = new cc.Sprite(res.Menu5_png);
		this.sprite.attr({
			x: size.width,
			y: size.height - 75*4,
			scale: 1,
			rotation: 0
		});
		this.sprite.setAnchorPoint(1, 1);
		this.addChild(this.sprite, 0);
		var TurnLabel = new cc.LabelTTF("Turn: "+currTurn, "Arial", Labelsize);
		TurnLabel.x = size.width - 50; // width/2
		TurnLabel.y = size.height - 75*4; // height*4
		TurnLabel.setColor(cc.color(0,0,0,0));
		TurnLabel.setAnchorPoint(1,1);
		this.addChild(TurnLabel, 0);

		// Turn (go and back)
		for(i=-1;i<=1;i+=2){
			if(i==-1){
				var closeItem = new cc.MenuItemImage(
						res.botton1_png,
						res.botton2_png,
						function () {
							cc.log("Back!!");
							// 存在しないところにアクセスしないようにする必要がある
							if(currTurn-1>=0){
								GoToLastTurn=false; // 自動再生off 
								--currTurn;
								cc.director.runScene(new HelloWorldScene());
							}
						}, this);
			}else{
				var closeItem = new cc.MenuItemImage(
						res.botton1_png,
						res.botton2_png,
						function () {
							cc.log("Next!!");
							// 存在しないところにアクセスしないようにする必要がある
							if(currTurn+1<=MaxTurn){
								GoToLastTurn=false; // 自動再生off 
								++currTurn;
								cc.director.runScene(new HelloWorldScene());
							}
						}, this);
			}
			var rot=180;
			if(i==-1){rot=180}else{rot=0}
			closeItem.attr({
				x: size.width - 100 + 30*i,
				y: size.height - 45 - 75*4,
				scale: 0.6,
				rotation: rot
			});
			var menu = new cc.Menu(closeItem);
			menu.x = 0;
			menu.y = 0;
			this.addChild(menu, 0);
		}
		// goto firstTurn or lastTurn
		// Turn (go and back)
		for(i=-1;i<=1;i+=2){
			if(i==-1){
				var closeItem = new cc.MenuItemImage(
						res.botton3_png,
						res.botton4_png,
						function () {
							cc.log("Go First Turn!!");
							// 存在しないところにアクセスしないようにする必要がある
							currTurn=0;
							GoToLastTurn=false; // 自動再生off 
							cc.director.runScene(new HelloWorldScene());
						}, this);
			}else{
				var closeItem = new cc.MenuItemImage(
						res.botton3_png,
						res.botton4_png,
						function () {
							cc.log("Go Last Turn!!");
							// 存在しないところにアクセスしないようにする必要がある
							currTurn=MaxTurn;
							GoToLastTurn=false; // 自動再生off 
							cc.director.runScene(new HelloWorldScene());
						}, this);
			}
			var rot=180;
			if(i==-1){rot=180}else{rot=0}
			closeItem.attr({
				x: size.width - 100 + 70*i,
				y: size.height - 45 - 75*4,
				scale: 0.6,
				rotation: rot
			});
			var menu = new cc.Menu(closeItem);
			menu.x = 0;
			menu.y = 0;
			this.addChild(menu, 0);
		}
		// auto replay
		this.sprite = new cc.Sprite(res.Menu5_png);
		this.sprite.attr({
			x: size.width,
			y: size.height-75*5,
			scale: 1,
			rotation: 0
		});
		this.sprite.setAnchorPoint(1, 1);
		this.addChild(this.sprite, 0);

		var replayLabel = new cc.LabelTTF("自動再生", "Arial", Labelsize);
		replayLabel.x = size.width - 50;
		replayLabel.y = size.height - 75*5;
		replayLabel.setColor(cc.color(0,0,0,0));
		replayLabel.setAnchorPoint(1,1);
		this.addChild(replayLabel, 0);

		for(i=-1;i<=1;++i){
			if(i==-1){
				var replayItem = new cc.MenuItemImage(
						res.slow1_png,
						res.slow2_png,
						function () {
							cc.log("Slow!!");
							if(currTurn<=MaxTurn){
								if(currTurn==MaxTurn){ currTurn=0;}
								GoToLastTurn=true;
								replaySpeed=1;
								cc.director.runScene(new HelloWorldScene());
							}
						}, this);
			}else if(i==0){
				var replayItem = new cc.MenuItemImage(
						res.normal1_png,
						res.normal2_png,
						function () {
							cc.log("Normal!!");
							if(currTurn<=MaxTurn){
								if(currTurn==MaxTurn){ currTurn=0;}
								GoToLastTurn=true;
								replaySpeed=0.5;
								cc.director.runScene(new HelloWorldScene());
							}
						}, this);
			}else {
				var replayItem = new cc.MenuItemImage(
						res.fast1_png,
						res.fast2_png,
						function () {
							cc.log("Fast!!");
							if(currTurn<=MaxTurn){
								if(currTurn==MaxTurn){ currTurn=0;}
								GoToLastTurn=true;
								replaySpeed=0.1;
								cc.director.runScene(new HelloWorldScene());
							}
						}, this);
			}
			replayItem.attr({
				x: size.width - 100 + 60*i,
				y: size.height - 50 - 75*5,
				scale: 0.25,
				rotation: 0
			});
			var replay = new cc.Menu(replayItem);
			replay.x = 0;
			replay.y = 0;
			this.addChild(replay, 0);
		}
		
		return true;
	}
});


var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.addChild(new BaseLayer);
        this.addChild(new MenuLayer); 
        this.addChild(new FieldLayer);
        //cc.log("height " + cc.winSize.height);
        //cc.log("width " + cc.winSize.width);
        if(currTurn==0){GoToFirstTurn=false;}
        if(currTurn==MaxTurn){GoToLastTurn=false;}
        /*
        if(GoToFirstTurn==true){
        	this.schedule(function(){
        		--currTurn;
        		cc.log("scheduler"+currTurn);
        		cc.director.runScene(new HelloWorldScene());
        	}, 0, 1, 0.25);
        }else */ 
        if(GoToLastTurn==true){
        	this.schedule(function(){
        		++currTurn;
        		cc.director.runScene(new HelloWorldScene());
        	}, 0, 1, replaySpeed);
        }
    }
});

