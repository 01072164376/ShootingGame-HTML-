//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas); 

let backgroundImage,gameoverImage,spaceImage,gunImage,enemyImage;
let gameOver = false // ture이면 게임이 끝남, false이면 게임이 안끝남
let score = 0
//우주선 좌표
let spaceX = canvas.width/2-30
let spaceY = canvas.height-60

let bulletList = [] //총알들을 저장하는 리스트
function Bullet(){
    this.x = 0;
    this.y = 0; 
    this.init=function(){
        this.x = spaceX + 18;
        this.y = spaceY
        this.alive=true //true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this)
    };
    this.update = function(){
        this.y -=7;
    };

    this.checkHit = function(){
        // 총알.y <= 적군.y and
        // 총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이
        for(let i=0;i<enemyList.length;i++){
            if(
            this.y <= enemyList[i].y && 
            this.x >= enemyList[i].x && 
            this.x <= enemyList[i].x+40
        ){
            //총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
            score++;
            this.alive = false //죽은 총알
            enemyList.splice(i, 1);
            }
        }
    }
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList=[] //적군 저장하는 리스트
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width-50)
        enemyList.push(this)
    };
    this.update=function(){
        this.y += 3; // 적군의 속도조절
        
        if(this.y >= canvas.height - 50){
            gameOver = true;
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="Image/background.gif";
    
    gameoverImage = new Image();
    gameoverImage.src="Image/gameover.png";

    spaceImage = new Image();
    spaceImage.src="Image/space.png";

    gunImage = new Image();
    gunImage.src="Image/gun.png";

    enemyImage = new Image();
    enemyImage.src="Image/enemy.png";
}

let keysDown={};
function setupkeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet() // 총알 생성
        }
    });
}

function createBullet(){
    let b = new Bullet()
    b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000)
}

function update(){
    if( 39 in keysDown){
        spaceX += 7; // 우주선 속도
    } //right
    if( 37 in keysDown){
        spaceX -= 7;
    } //left

    if(spaceX <= 0){
        spaceX=0
    }
    if(spaceX >= canvas.width-60){
        spaceX = canvas.width - 60
    }
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceImage, spaceX, spaceY);
    ctx.fillText(`Score:${score}`,20,20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(gunImage,bulletList[i].x,bulletList[i].y);
        }
    }

    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}

function main(){
    if(!gameOver){
        update(); // 좌표값 업데이트
        render(); // 그림그림
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverImage,10,100,380,380);
    }
}

loadImage();
setupkeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy 좌표가 바뀌고
// 다시 render