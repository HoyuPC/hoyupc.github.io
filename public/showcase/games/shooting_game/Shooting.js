//try {
const e_defeat=document.getElementById("cons");
const canvas=document.getElementById("game");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight-40;
canvas.style.top=40;
canvas.style.left=0;
const ctx=canvas.getContext("2d");
ctx.font="48px sans-serif";
ctx.fillStyle="white";
ctx.textAlign="center";
//↑canvs・consの取得など
let p_isalive=true;
let gameState="title";
const player={//自機の設定
    x:canvas.width/2,
    y:canvas.height/2,
    w:50,
    h:30
};

const boss_bullet={
    x:NaN,
    y:NaN,
    size:0
};

const boss_horn={
    R_hp:50,
    L_hp:50
};

const enemy={//敵機の設定
    w:50,
    h:30,
    speed:3,
    hp:5
};
const boss={//ボスの設定
    x:NaN,//canvas.width+250,
    y:NaN,//canvas.height/2,
    w:250,
    h:250,
    hp:100,
    phase:3
};

let enemy_x=[];
let enemy_y=[];
let enemy_hp=[];
let enemydefeat=0;
let enemyTimer=0;
let enemyInterval=60;
//↑敵機を出現させる間隔を調整するための変数
//↑上から順に敵機のx座標,y座標,HP,撃破数
function spawnEnemy(){//敵機を出現させる(配列に敵機の座標・HPを追加)
    const y=Math.random()*(canvas.height-enemy.h/2);
    enemy_x.push(canvas.width+20+enemy.w/2);
    enemy_y.push(y);
    enemy_hp.push(enemy.hp);
    enemyInterval=Math.trunc(60+Math.random()*60);
}

function horn(){
        ctx.beginPath();//w:boss.w/2,h:boss.h/6
        ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
        ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y-boss.h/3);
        ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*0.8);
        ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*(1-1/2));
        ctx.lineTo(boss.x-boss.w/2,boss.y-boss.h/3*(1-1/2));
        ctx.fillStyle="purple";
        ctx.fill();
        ctx.clearRect(boss.x-boss.w,boss.y-boss.h/3-1,boss.w*(50-boss_horn.R_hp)/100,boss.h/6+3);
        ctx.beginPath();
        ctx.moveTo(boss.x-boss.w/2,boss.y+boss.h/3);
        ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y+boss.h/3);
        ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*0.8);
        ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*(1-1/2));
        ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3*(1-1/2));
        ctx.fillStyle="purple";
        ctx.fill();
        ctx.clearRect(boss.x-boss.w,boss.y+boss.h/6-1,boss.w*(50-boss_horn.L_hp)/100,boss.h/6+3);
        for (let b=0;b<bullet_x.length;b++){
            let bosshr=hitRect(boss.x-boss.w/2*((48-boss_horn.R_hp)/50),boss.y-boss.h/4,boss.w/2*(boss_horn.R_hp/25),boss.h/6,
            bullet_x[b],bullet_y[b],p_bullet.w/2,p_bullet.h/2);
            if (bosshr){
                bullet_x.splice(b,1);
                bullet_y.splice(b,1);
                if (battleEngine>=2&&battleEngine<=4){
                    ctx.beginPath();//w:boss.w/2,h:boss.h/6
                    ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
                    ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y-boss.h/3);
                    ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*0.8);
                    ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*(1-1/2));
                    ctx.lineTo(boss.x-boss.w/2,boss.y-boss.h/3*(1-1/2));                        
                    ctx.fillStyle="white";
                    ctx.fill();
                    ctx.clearRect(boss.x-boss.w,boss.y-boss.h/3-1,boss.w*(50-boss_horn.R_hp)/100,boss.h/6+3);
                    if (boss_horn.R_hp>0&&(battleEngine==2||battleEngine==3)){
                        boss_horn.R_hp--;
                    }else if(battleEngine==4&&!revive){
                        ctx.fillStyle = "white";
                        ctx.beginPath();
                        ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
                        ctx.lineTo(boss.x-boss.w/4,boss.y-boss.h/2);
                        ctx.lineTo(boss.x+boss.w/4,boss.y-boss.h/2);
                        ctx.lineTo(boss.x+boss.w/2,boss.y-boss.h/4);
                        ctx.lineTo(boss.x+boss.w/2,boss.y+boss.h/4);
                        ctx.lineTo(boss.x+boss.w/4,boss.y+boss.h/2);
                        ctx.lineTo(boss.x-boss.w/4,boss.y+boss.h/2);
                        ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3);//ボスの胴体(正八角形)
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(boss.x-boss.w/2,boss.y+boss.h/3);
                        ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y+boss.h/3);
                        ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*0.8);
                        ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*(1-1/2));
                        ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3*(1-1/2));
                        ctx.fillStyle="white";
                        ctx.fill();
                        ctx.clearRect(boss.x-boss.w,boss.y+boss.h/6-1,boss.w*(50-boss_horn.L_hp)/100,boss.h/6+2);
                        boss.hp--;
                    }
                }
            }
            let bosshl=hitRect(boss.x-boss.w/2*((48-boss_horn.L_hp)/50),boss.y+boss.h/4,boss.w/2*(boss_horn.L_hp/25),boss.h/6,
            bullet_x[b],bullet_y[b],p_bullet.w/2,p_bullet.h/2);
            if (bosshl){
                bullet_x.splice(b,1);
                bullet_y.splice(b,1);
                if(battleEngine>=2&&battleEngine<=4){
                    ctx.beginPath();
                    ctx.moveTo(boss.x-boss.w/2,boss.y+boss.h/3);
                    ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y+boss.h/3);
                    ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*0.8);
                    ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*(1-1/2));
                    ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3*(1-1/2));
                    ctx.fillStyle="white";
                    ctx.fill();
                    ctx.clearRect(boss.x-boss.w,boss.y+boss.h/6-1,boss.w*(50-boss_horn.L_hp)/100,boss.h/6+2);
                    if (boss_horn.L_hp>0&&(battleEngine==2||battleEngine==3)){
                        boss_horn.L_hp--;
                    }else if(battleEngine==4&&!revive){
                        ctx.fillStyle = "white";
                        ctx.beginPath();
                        ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
                        ctx.lineTo(boss.x-boss.w/4,boss.y-boss.h/2);
                        ctx.lineTo(boss.x+boss.w/4,boss.y-boss.h/2);
                        ctx.lineTo(boss.x+boss.w/2,boss.y-boss.h/4);
                        ctx.lineTo(boss.x+boss.w/2,boss.y+boss.h/4);
                        ctx.lineTo(boss.x+boss.w/4,boss.y+boss.h/2);
                        ctx.lineTo(boss.x-boss.w/4,boss.y+boss.h/2);
                        ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3);//ボスの胴体(正八角形)
                        ctx.fill();
                        ctx.beginPath();//w:boss.w/2,h:boss.h/6
                        ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
                        ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y-boss.h/3);
                        ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*0.8);
                        ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*(1-1/2));
                        ctx.lineTo(boss.x-boss.w/2,boss.y-boss.h/3*(1-1/2));                        
                        ctx.fillStyle="white";
                        ctx.fill();
                        ctx.clearRect(boss.x-boss.w,boss.y-boss.h/3-1,boss.w*(50-boss_horn.R_hp)/100,boss.h/6+3);
                        ctx.beginPath();
                        ctx.moveTo(boss.x-boss.w/2,boss.y+boss.h/3);
                        ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y+boss.h/3);
                        ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*0.8);
                        ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*(1-1/2));
                        ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3*(1-1/2));
                        ctx.fillStyle="white";
                        ctx.fill();
                        ctx.clearRect(boss.x-boss.w,boss.y+boss.h/6-1,boss.w*(50-boss_horn.L_hp)/100,boss.h/6+2);
                        boss.hp--;
                    }
                }
            }
        }
}

function draw_boss(){
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
    ctx.lineTo(boss.x-boss.w/4,boss.y-boss.h/2);
    ctx.lineTo(boss.x+boss.w/4,boss.y-boss.h/2);
    ctx.lineTo(boss.x+boss.w/2,boss.y-boss.h/4);
    ctx.lineTo(boss.x+boss.w/2,boss.y+boss.h/4);
    ctx.lineTo(boss.x+boss.w/4,boss.y+boss.h/2);
    ctx.lineTo(boss.x-boss.w/4,boss.y+boss.h/2);
    ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3);//ボスの胴体(正八角形)
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle="magenta";
    ctx.arc(boss.x,boss.y,boss.w/4,0,Math.PI*2,false);//ボスの核描画
    ctx.fill();
    horn();//ボスの発射口描画
    for (let b=bullet_x.length-1;b>=0;b--){
        let hitB_b=hitRect(boss.x-7,boss.y,boss.w/2*(9/10),boss.h/2*(9/10),bullet_x[b],bullet_y[b],p_bullet.w/2,p_bullet.h/2);
        if (hitB_b){
            bullet_x.splice(b,1);
            bullet_y.splice(b,1);
            if (battleEngine==4&&!revive){
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
                ctx.lineTo(boss.x-boss.w/4,boss.y-boss.h/2);
                ctx.lineTo(boss.x+boss.w/4,boss.y-boss.h/2);
                ctx.lineTo(boss.x+boss.w/2,boss.y-boss.h/4);
                ctx.lineTo(boss.x+boss.w/2,boss.y+boss.h/4);
                ctx.lineTo(boss.x+boss.w/4,boss.y+boss.h/2);
                ctx.lineTo(boss.x-boss.w/4,boss.y+boss.h/2);
                ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3);//ボスの胴体(正八角形)
                ctx.fill();
                ctx.beginPath();//w:boss.w/2,h:boss.h/6
                ctx.moveTo(boss.x-boss.w/2,boss.y-boss.h/3);
                ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y-boss.h/3);
                ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*0.8);
                ctx.lineTo(boss.x-boss.w,boss.y-boss.h/3*(1-1/2));
                ctx.lineTo(boss.x-boss.w/2,boss.y-boss.h/3*(1-1/2));                        
                ctx.fillStyle="white";
                ctx.fill();
                ctx.clearRect(boss.x-boss.w,boss.y-boss.h/3-1,boss.w*(50-boss_horn.R_hp)/100,boss.h/6+3);
                ctx.beginPath();
                ctx.moveTo(boss.x-boss.w/2,boss.y+boss.h/3);
                ctx.lineTo(boss.x-boss.w/2*(1+2/3),boss.y+boss.h/3);
                ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*0.8);
                ctx.lineTo(boss.x-boss.w,boss.y+boss.h/3*(1-1/2));
                ctx.lineTo(boss.x-boss.w/2,boss.y+boss.h/3*(1-1/2));
                ctx.fillStyle="white";
                ctx.fill();
                ctx.clearRect(boss.x-boss.w,boss.y+boss.h/6-1,boss.w*(50-boss_horn.L_hp)/100,boss.h/6+2);
                boss.hp--;
            }
        }
    }
}
let battleEngine=0;
let addy=0;
let m_count=Math.trunc(2+Math.random()*3);
let m_counter=0;
let efc_pos=[];
let boss_isno=true;
let boss_charge=100;
let restore_t=30;
let restore_tr=0;
let revive=false;
let boss_phase=1;
function ishitB_p(){
    let p_front=[player.x+player.w/2,player.y];
    let p_lback=[player.x-player.w/2,player.y-player.h/2];
    let p_rback=[player.x-player.w/2,player.y+player.h/2];
    let distance={
        front:Math.sqrt((p_front[0]-boss_bullet.x)**2+(p_front[1]-boss_bullet.y)**2),
        Left:Math.sqrt((p_lback[0]-boss_bullet.x)**2+(p_lback[1]-boss_bullet.y)**2),
        Right:Math.sqrt((p_rback[0]-boss_bullet.x)**2+(p_rback[1]-boss_bullet.y)**2)
    };
    return(distance.front<boss_bullet.size||distance.Left<boss_bullet.size||distance.Right<boss_bullet.size);
}
function bossbattle(){
    switch (battleEngine){
        case 0:
            boss.x=canvas.width+boss.w;
            boss.y=canvas.height/2;
            addy=boss.y;
            battleEngine=1;
            boss_isno=false;
            break;
        case 1:
            boss.x--;
            if (boss.x<=canvas.width*(3/4))battleEngine=2;
            break;
        case 2:
            if (boss_horn.L_hp<=0&&boss_horn.R_hp<=0)battleEngine=4;
            //let hitToBullet=hitRect(boss.);
            if (addy==boss.y){
                addy=Math.trunc(canvas.height/10*(3+Math.trunc(Math.random()*5)));
                m_counter++;
                if (m_counter>=m_count){
                    battleEngine=3;
                    m_counter=0;
                    break;
                }
            }else if (addy>boss.y){
                boss.y++;
                boss.y=Math.trunc(boss.y);
            }else if (addy<boss.y){
                boss.y--;
                boss.y=Math.trunc(boss.y);
            }
            if (m_counter>=m_count)battleEngine=3;
            break;
        case 3:
            if (boss_horn.L_hp<=0&&boss_horn.R_hp<=0)battleEngine=4;
            if(efc_pos.length==0){
                boss_bullet.x=boss.x-boss.w;
                boss_bullet.y=boss.y;
            }
            if (efc_pos.length<=100){
                let efc_r=Math.random()*2*Math.PI;
                let efc_x=boss_bullet.x+boss.w*1*Math.cos(efc_r);
                let efc_y=boss_bullet.y+boss.h*1*Math.sin(efc_r);
                efc_pos.push([efc_x,efc_y]);
            }
            if (boss_bullet.size<boss_charge){
                boss_bullet.size++;
            }else{
                boss_bullet.x-=10;
                let ishit=ishitB_p();
                if (ishit){
                    player.x=NaN;
                    player.y=NaN;
                }
            }
            if (boss_bullet.x+boss_bullet.size<0){
                boss_bullet.x=NaN;
                boss_bullet.y=NaN;
                battleEngine=2;
                efc_pos=[];
                boss_bullet.size=0;
            }
            break;
        case 4:
            boss_bullet.size=0;
            efc_pos=[];
            boss_bullet.x=NaN;
            boss_bullet.y=NaN;
            restore_tr++;
            if (boss.hp<=0){
                if(boss_phase<boss.phase){
                    boss.hp=100;
                    boss_phase++;
                    revive=true;
                }else{
                    boss.x=NaN;
                    boss.y=NaN;
                }
            }
            if (restore_t<restore_tr||revive){
                if (boss_horn.L_hp<50)boss_horn.L_hp++;
                if (boss_horn.R_hp<50)boss_horn.R_hp++;
                restore_tr=0;
            }
            if (boss_horn.L_hp>=50&&boss_horn.R_hp>=50){
                battleEngine=2;
                revive=false;
            }
            break;
    }
}

function draw_befc(){
    for (let e=0;e<=efc_pos.length-1;e++){
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(efc_pos[e][0],efc_pos[e][1],10,0,2*Math.PI,false);
        ctx.fill();
        /*if (efc_pos[e][0]==boss.x&&efc_pos[e][1]==boss.y){
            efc_pos.splice(e,1);
        }*/
        efc_pos[e][0]+=Math.trunc((boss_bullet.x-efc_pos[e][0])/5);
        efc_pos[e][1]+=Math.trunc((boss_bullet.y-efc_pos[e][1])/5);
    }
}

function draw_boss_bullet(){
    ctx.beginPath();
    ctx.fillStyle="red";
    ctx.arc(boss_bullet.x,boss_bullet.y,boss_bullet.size,0,2*Math.PI,false);
    ctx.fill();
}

const p_bullet={//自機の弾の設定
    color:"yellow",
    w:18,
    h:4,
    speed:15 
};

const keys={};
document.addEventListener("keydown",e=>{
    keys[e.key]=true;
});
document.addEventListener("keyup",e=>{
    keys[e.key]=false;
});

let isShooting=false;

document.addEventListener("keydown",e =>{
    if (e.code==="Space"){
        isShooting=true;
    }
});

document.addEventListener("keyup",e=>{
    if(e.code==="Space"){
        isShooting=false;
    }
});

//↑キーボードの入出力を取得

let shootTimer=0;
const shootInterval=5;
//↑弾の発射間隔を設定するための変数
let r=[0,0,0,0];
function draw(){
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(player.x+25,player.y);
    ctx.lineTo(player.x-25,player.y+15);
    ctx.lineTo(player.x-25,player.y-15);
    ctx.fill();
}
//↑自機の描画
let bullet_x=[];
let bullet_y=[];
//↑自機の弾の座標を入れるための配列
function launch(){//自機の弾を生成(リストに座標を追加)
    if (isShooting){
        shootTimer++;
        if (shootTimer>=shootInterval){
            bullet_x.push(player.x+(player.w+p_bullet.w)/2);
            bullet_y.push(player.y);
            shootTimer=0;//これがないと自機は弾は間隔を開けずに発射してしまう...
        }
    }
}

function draw_bullet(){//弾を描画し動かす
    for (let n=0;n<bullet_x.length;n++){
        ctx.fillStyle = p_bullet.color;
        ctx.beginPath();
        //ctx.moveTo(p_bullet.x,p_bullet.y);
        ctx.fillRect(bullet_x[n],bullet_y[n]-p_bullet.h/2,p_bullet.w,p_bullet.h);
        bullet_x[n]+=p_bullet.speed;
        if (bullet_x[n]>canvas.width){//画面右端の弾を消去
            bullet_x.splice(n,1);
            bullet_y.splice(n,1);
        }
    }
}

function hitRect(ax,ay,aw,ah,bx,by,bw,bh){//あたり判定のプログラム
    return(
        ax-aw<bx+bw&&
        ax+aw>bx-bw&&
        ay-ah<by+bh&&
        ay+ah>by-bh
    );
}
function draw_enemy(){//敵機を描画
    for (let i=0;i<enemy_x.length;i++){
        ctx.fillStyle="red";
        ctx.beginPath();
        ctx.moveTo(enemy_x[i]-enemy.w/2,enemy_y[i]);
        ctx.lineTo(enemy_x[i]+enemy.w/2,enemy_y[i]-enemy.h/2);
        ctx.lineTo(enemy_x[i]+enemy.w/2,enemy_y[i]+enemy.h/2);
        ctx.fill();
        for (let e=enemy_x.length-1;e>=0;e--){
            const hitToPlayer=hitRect(
                player.x,player.y,
                player.w/2,player.h/2,
                enemy_x[e],enemy_y[e],
                enemy.w/2,enemy.h/2
                );
            if (hitToPlayer){//敵機が自機に触れたら両方消去
                enemy_x.splice(e,1);
                enemy_y.splice(e,1);
                player.x=NaN;
                player.y=NaN;
                p_isalive=false;
            }//↑自機の座標を「NaN(Not a Number)」にすることで自機を消去できる
        }
        enemy_x[i]-=enemy.speed;
        if (enemy_x[i]<0-enemy.w/2){//画面左端についたら消去
            enemy_x.splice(i,1);
            enemy_y.splice(i,1);
        }
        for (let e=enemy_x.length-1;e>=0;e--){//敵の座標が入った配列の長さ＊弾の座標が入った配列の長さだけ繰り返す
            for (let b=bullet_x.length-1;b>=0;b--){
                const hit = hitRect(//判定を変数「hit」に入れる(このときhitの中身は"true"か"false")
                bullet_x[b],bullet_y[b],
                p_bullet.w/2,p_bullet.h/2,
                enemy_x[e],enemy_y[e],
                enemy.w/2,enemy.h/2
                );
                if (hit){//敵機に弾が当たったとき
                    enemy_hp[e]-=1;
                    bullet_x.splice(b,1);
                    bullet_y.splice(b,1);
                    ctx.fillStyle="white";
                    ctx.beginPath();
                    ctx.moveTo(enemy_x[e]-enemy.w/2+enemy.speed,enemy_y[e]);
                    ctx.lineTo(enemy_x[e]+enemy.w/2+enemy.speed,enemy_y[e]-enemy.h/2);
                    ctx.lineTo(enemy_x[e]+enemy.w/2+enemy.speed,enemy_y[e]+enemy.h/2);
                    ctx.fill();
                    //↑敵機のhpが残っていたときの処理
                    //↓敵機のhpが0になったとき
                    if (enemy_hp[e]<=0){
                        enemy_x.splice(e,1);
                        enemy_y.splice(e,1);
                        enemy_hp.splice(e,1);
                        enemydefeat++;
                    }
                }
            }
        }
    }
}

function update(){
    if (gameState==="title"){
        if (keys[" "]){
            gameState="game";
        }
        e_defeat.innerHTML="EnemyDefeat:"+enemydefeat;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw();
        ctx.fillStyle="black";
        ctx.strokeStyle="white";
        ctx.lineWidth=3;
        ctx.strokeText("シューティングゲーム",canvas.width/2,canvas.height/2-40);
        ctx.fillText("シューティングゲーム",canvas.width/2,canvas.height/2-40);
        ctx.strokeText("スペースキーでスタート",canvas.width/2,canvas.height/2+40);
        ctx.fillText("スペースキーでスタート",canvas.width/2,canvas.height/2+40);
    
    }
    if (gameState==="game"){
    if (keys["ArrowRight"]&&player.x+(player.w/2)<canvas.width){
        r[3]=1;
    }else{
        r[3]=0;
    }
    if (keys["ArrowUp"]&&player.y-(player.h/2)>0){
        r[2]=-1;
    }else{
        r[2]=0;
    }
    if (keys["ArrowLeft"]&&player.x-(player.w/2)>0){
        r[0]=-1;
    }else{
        r[0]=0;
    }
    if (keys["ArrowDown"]&&player.y+(player.h/2)<canvas.height){
        r[1]=1;
    }else{
        r[1]=0;
    }
    let v=Math.sqrt((r[3]+r[0])**2+(r[1]+r[2])**2);
    //↑四方向に移動するときに変数vを計算するプログラム
    if (keys["ArrowRight"]||keys["ArrowUp"]||keys["ArrowLeft"]||keys["ArrowDown"]){
        if (v!==0)player.x+=Math.trunc(5*(r[3]+r[0])/v);
        if (v!==0)player.y+=Math.trunc(5*(r[1]+r[2])/v);
    }//vだけ自機の座標を変える
    enemyTimer++;
    if (enemyTimer>=enemyInterval&&boss_isno&&p_isalive){
        spawnEnemy();
        enemyTimer=0;
    }//関数"spawnEnemy()"をenemyTimerがenemyInmmterval以上になるたびに作動させるcde fg
    e_defeat.innerHTML="EnemyDefeat:"+enemydefeat;
    ctx.clearRect(0,0,canvas.width,canvas.height);//canvasに描画したものを全消去
    //ctx.fillRect(x,y,30,30);
    if(enemydefeat>=20){
        draw_boss();
        draw_befc();
        bossbattle();
        draw_boss_bullet();
    }
    draw();//自機の描画
    launch();//自機の弾生成
    draw_bullet();//自機弾の描画
    draw_enemy();//敵機の描画
    }
    requestAnimationFrame(update);//関数"update()"に入っているプログラムを繰り返す
}
update();
