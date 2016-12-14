window.onload=function(){
	var canvas, stage, exportRoot;
	var BG;//背景
	var Birdmc;//鳥
	var Floor;//地板
	var Floor2;//地板2
	var START;//遊戲開始的指式
	var Hit0, Hit1, Hit2;//水管
	var GAMEOVER,RESTART;//遊戲結束&重新再一次
    var Text,Text2;
    var winInt=0;
    
    //水管座標亂數
    var r0 = Math.floor(Math.random() * (3 - 0 + 0) + 0);
    var r1 = Math.floor(Math.random() * (3 - 0 + 0) + 0);
    var r2 = Math.floor(Math.random() * (3 - 0 + 0) + 0);   
	
    
    
    //水管座標
    var Hit_X = [435,655,875];
    var Hit_Y = [0,-57,-123];
	
	canvas = document.getElementById("canvas");
	images = images||{};

	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", handleFileLoad);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(lib.properties.manifest);

	function handleFileLoad(evt) {
		if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
	}

	function handleComplete() {
        //分數初始化
        winInt=0;
		exportRoot = new lib.fly();

		stage = new createjs.Stage(canvas);
		stage.addChild(exportRoot);
		stage.update();
		
		//addChild所有的物件到stage
		addChildMovieClip();
		
		
		
		//地板移動
		createjs.Ticker.addEventListener("tick",FloorFn)
		function FloorFn(){
			if(Floor.x < -canvas.width)Floor.x = canvas.width;
			if(Floor2.x < -canvas.width)Floor2.x = canvas.width;
			Floor.x-=5;
			Floor2.x-=5;
            
		    //地板停止移動
            if(Birdmc.y>=500){
                GAMEOVERfn()
            }
		}
		
		
		stage.addEventListener("mousedown",GameGoFn);
		function GameGoFn(e){
			//開始標誌消失
			START.visible = false;
            createjs.Tween.removeTweens ( Birdmc )
			createjs.Tween.get(Birdmc, { loop: false },true)
                .to({y:Birdmc.y-70,rotation :-20},200, createjs.Ease.backIn()).call(removeFn)

			Birdmc.removeEventListener("tick",Yfn);
            
            //計分文字
            Text2.visible=true;
            Text.visible=true;
		}
		
		function removeFn(e){
			Birdmc.addEventListener("tick",Yfn);
		}
        
        //鳥旋轉下墜
		function Yfn(e){
			createjs.Tween.get(Birdmc, { loop: false },true).to({rotation :50},650, createjs.Ease.backIn())
            Birdmc.y+=8
		}
        
        
       // 開始出現水管
        stage.addEventListener("click",pipeFn);
        function pipeFn(e){
            createjs.Ticker.addEventListener("tick",pipePosFn)
            stage.removeEventListener("click",pipeFn);
        }
        function pipePosFn(e){
            
            Hit0.x -= 5;
            Hit1.x -= 5;
            Hit2.x -= 5;  
            
            //水管跑出舞台回來
            if(Hit0.x < -195){
                var t = Math.floor(Math.random() * (3 - 0 + 0) + 0);
                Hit0.x = 440;
                Hit0.y = Hit_Y[t];
            }else if(Hit1.x < -195){
                var t = Math.floor(Math.random() * (3 - 0 + 0) + 0);
                Hit1.x = 440;
                Hit1.y = Hit_Y[t];
            }else if(Hit2.x < -195){
                var t = Math.floor(Math.random() * (3 - 0 + 0) + 0);
                Hit2.x = 440;
                Hit2.y = Hit_Y[t];
            }
            
            //水管碰撞
            if(ndgmr.checkRectCollision(Birdmc,Hit0.h1)||ndgmr.checkRectCollision(Birdmc,Hit0.h2)){        
                GAMEOVERfn()
            }else if(ndgmr.checkRectCollision(Birdmc,Hit1.h1)||ndgmr.checkRectCollision(Birdmc,Hit1.h2)){        
                GAMEOVERfn()
            }else if(ndgmr.checkRectCollision(Birdmc,Hit2.h1)||ndgmr.checkRectCollision(Birdmc,Hit2.h2)){        
                GAMEOVERfn()
            }
            
            //重新開啟分數控制
            if(ndgmr.checkRectCollision(Birdmc,Hit0.num_zz)){        
                createjs.Ticker.addEventListener("tick",winIntFn)
            }else if(ndgmr.checkRectCollision(Birdmc,Hit1.num_zz)){        
                createjs.Ticker.addEventListener("tick",winIntFn)
            }else if(ndgmr.checkRectCollision(Birdmc,Hit2.num_zz)){        
                createjs.Ticker.addEventListener("tick",winIntFn)
            }
            
        }
        
        //計分
        createjs.Ticker.addEventListener("tick",winIntFn)
        function winIntFn(){
            if(ndgmr.checkRectCollision(Birdmc,Hit0.num_int)){
                createjs.Ticker.removeEventListener("tick",winIntFn);
                winInt++;
                Text2.text=winInt;
                Text.text=winInt;
            }
            if(ndgmr.checkRectCollision(Birdmc,Hit1.num_int)){
                createjs.Ticker.removeEventListener("tick",winIntFn);
                winInt++;
                Text2.text=winInt;
                Text.text=winInt;
            }
            if(ndgmr.checkRectCollision(Birdmc,Hit2.num_int)){
                createjs.Ticker.removeEventListener("tick",winIntFn);
                winInt++;
                Text2.text=winInt;
                Text.text=winInt;
            }
        }
        
        
        
        //撞到水管遊戲結束
        function GAMEOVERfn(){
            stage.removeEventListener("mousedown",GameGoFn);
            createjs.Ticker.removeEventListener("tick",pipePosFn);
            createjs.Ticker.removeEventListener("tick",FloorFn);   
            createjs.Ticker.removeEventListener("tick",winIntFn);
            createjs.Tween.removeTweens ( Birdmc );
            Birdmc.removeEventListener("tick",Yfn);
            Birdmc.gotoAndPlay("boom"); 
            GAMEOVER.visible=true;
            RESTART.visible=true;
            
            //遊戲重新開始按鈕
            RESTART.addEventListener("click",RESTARTfn);
        }
        
        function RESTARTfn(){
           RESTART.removeEventListener("click",RESTARTfn);
           handleComplete()
        }    
                
		createjs.Ticker.setFPS(lib.properties.fps);
		createjs.Ticker.addEventListener("tick", stage);
	}
	
	
	function addChildMovieClip(){
		BG = new lib.BG();
		Floor = new lib.Floor();
		Floor2 = new lib.Floor();
		Birdmc = new lib.fBird()
		START = new lib.START();
        Hit0 = new lib.Hit();
        Hit1 = new lib.Hit();
        Hit2 = new lib.Hit();
        GAMEOVER = new lib.GAMEOVER();
        RESTART = new lib.RESTART();
        
        Text = new createjs.Text(0, "86px 'Flappy Bird'", "#ffffff");
        Text2 = new createjs.Text(0, "86px 'Flappy Bird'", "#000000");
        
		BG.x=0;    
		BG.y=0;
		Floor.x=0;
		Floor.y=518.85;
		Floor2.x=canvas.width;
		Floor2.y=518.85;
		Birdmc.x=120;
		Birdmc.y=210;
		START.x = canvas.width/2;
		START.y = canvas.height/2;
        Hit0.x = Hit_X[0];
        Hit1.x = Hit_X[1];
        Hit2.x = Hit_X[2];
        Hit0.y = Hit_Y[r0];
        Hit1.y = Hit_Y[r1];
        Hit2.y = Hit_Y[r2];
		GAMEOVER.x = canvas.width/2;
		GAMEOVER.y = canvas.height/2;
		RESTART.x = canvas.width/2;
		RESTART.y = canvas.height/2+80;
        
		exportRoot.addChild(BG);
        exportRoot.addChild(Hit0);
        exportRoot.addChild(Hit1);
        exportRoot.addChild(Hit2);
		exportRoot.addChild(Floor);
		exportRoot.addChild(Floor2);
		exportRoot.addChild(Birdmc);
		exportRoot.addChild(START);
		exportRoot.addChild(GAMEOVER);
		exportRoot.addChild(RESTART);
        GAMEOVER.visible=false;
        RESTART.visible=false;
        
        exportRoot.addChild(Text2,Text);
        Text2.x = canvas.width/2+2;
        Text2.y = 70;
        Text.x = canvas.width/2;
        Text.y = 70;
        Text2.textAlign = 'center';
        Text.textAlign = 'center';
        Text2.visible=false;
        Text.visible=false;
	}
	
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );

    var update = function () {

        stats.begin();
        stats.end();

        requestAnimationFrame( update );

    };

    requestAnimationFrame( update );
	
}