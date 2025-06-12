document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO HTML ---
    const dialogueText = document.getElementById('dialogue-text');
    const actButton = document.getElementById('act-button');
    const itemButton = document.getElementById('item-button');
    const mercyButton = document.getElementById('mercy-button');
    const soulHeart = document.querySelector('.soul-heart');
    const battleBox = document.getElementById('battle-box');
    const bottomPanel = document.querySelector('.bottom-panel'); // CORRIGIDO
    const mainContainer = document.querySelector('.container');
    const hpBar = document.getElementById('hp-bar');
    const hpText = document.getElementById('hp-text');

    // --- ELEMENTOS MOBILE ---
    const arrowUp = document.getElementById('arrow-up');
    const arrowDown = document.getElementById('arrow-down');
    const arrowLeft = document.getElementById('arrow-left');
    const arrowRight = document.getElementById('arrow-right');

    // --- ESTADO DO JOGO ---
    const maxHP = 20;
    let currentHP = maxHP;
    let isPlayerTurn = true;
    let isInvincible = false;
    let battleLoopId;
    const soulPosition = { x: 0, y: 0 };
    const activeAttacks = [];

    // --- MENSAGENS ---
    const initialMessage = "* GuriThur, um san- digo... um arTHUR, bloqueia o caminho! VAIII CURINTIA!!!";
    const actMessage = "* Você checa GuriThur. ATK 10 DEF 10. Um irmão SANSacional, ótimo em games (melhor que o Wuallan) e um irmão pra todas as horas.";
    const itemMessage = "* Você usa o Sans de Aniversário. Seu HP foi maximizado!";
    const mercyMessage = "* Você escolheu POUPAR. Vocês venceram! Ganhou 0 EXP e uma irmandade que vale mais que qualquer LOVE... e um biscoito";
    const battleStartMessage = "* GuriThur está preparando seu ataque especial!";
    const battleEndMessage = "* Ufa! O cara ta me querendo que eu jogue no vasco! O ataque especial acabou. O que você fará?";

    // --- FUNÇÕES DE JOGO ---
    function typeWriter(text, callback) { /* ... (sem alterações) ... */ }
    function updateHPDisplay() { /* ... (sem alterações) ... */ }
    function takeDamage(amount) { /* ... (sem alterações) ... */ }
    function moveSoulToButton(button) { /* ... (sem alterações) ... */ }

    function startBattlePhase() {
        isPlayerTurn = false;
        bottomPanel.style.display = 'none'; // CORRIGIDO
        battleBox.style.display = 'block';
        
        battleBox.appendChild(soulHeart);
        soulPosition.x = battleBox.offsetWidth / 2 - soulHeart.offsetWidth / 2;
        soulPosition.y = battleBox.offsetHeight / 2 - soulHeart.offsetHeight / 2;
        updateSoulPosition();
        
        setTimeout(() => createAttack(50, -100, 'down'), 500);
        setTimeout(() => createAttack(250, -100, 'down'), 1500);
        setTimeout(() => createAttack(450, -100, 'down'), 2000);
        setTimeout(() => createAttack(-100, 50, 'right'), 3000);
        
        battleLoopId = requestAnimationFrame(battleLoop);
        setTimeout(endBattlePhase, 6000);
    }
    
    function endBattlePhase() {
        cancelAnimationFrame(battleLoopId);
        isPlayerTurn = true;
        bottomPanel.style.display = 'flex'; // CORRIGIDO
        battleBox.style.display = 'none';  
        
        mainContainer.appendChild(soulHeart);
        soulHeart.style.display = 'none';
        
        activeAttacks.forEach(attack => attack.element.remove());
        activeAttacks.length = 0;

        typeWriter(battleEndMessage);
    }
    
    // --- FUNÇÕES DE MOVIMENTO E BATALHA ---
    function handleSoulMovement(direction) {
        if (isPlayerTurn) return;
        const speed = 7;
        switch (direction) {
            case 'up': soulPosition.y -= speed; break;
            case 'down': soulPosition.y += speed; break;
            case 'left': soulPosition.x -= speed; break;
            case 'right': soulPosition.x += speed; break;
        }
        updateSoulPosition();
    }

    function battleLoop() { /* ... (sem alterações) ... */ }
    function createAttack(startX, startY, direction) { /* ... (sem alterações) ... */ }
    function checkCollision(attackElement) { /* ... (sem alterações) ... */ }
    function updateSoulPosition() { /* ... (sem alterações) ... */ }
    
    // --- EVENTOS ---
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': handleSoulMovement('up'); break;
            case 'ArrowDown': handleSoulMovement('down'); break;
            case 'ArrowLeft': handleSoulMovement('left'); break;
            case 'ArrowRight': handleSoulMovement('right'); break;
        }
    });

    // Eventos para botões mobile
    arrowUp.addEventListener('click', () => handleSoulMovement('up'));
    arrowDown.addEventListener('click', () => handleSoulMovement('down'));
    arrowLeft.addEventListener('click', () => handleSoulMovement('left'));
    arrowRight.addEventListener('click', () => handleSoulMovement('right'));

    // Eventos dos botões de menu
    actButton.addEventListener('click', () => { /* ... (sem alterações) ... */ });
    itemButton.addEventListener('click', () => { /* ... (sem alterações) ... */ });
    mercyButton.addEventListener('click', () => { /* ... (sem alterações) ... */ });
    actButton.addEventListener('mouseover', () => moveSoulToButton(actButton));
    itemButton.addEventListener('mouseover', () => moveSoulToButton(itemButton));
    mercyButton.addEventListener('mouseover', () => moveSoulToButton(mercyButton));

    // --- INÍCIO ---
    updateHPDisplay();
    typeWriter(initialMessage);


    // Funções que não foram alteradas (incluídas para o código ser completo)
    function typeWriter(text, callback){let i=0;dialogueText.innerHTML="";function typing(){if(i<text.length){dialogueText.innerHTML+=text.charAt(i);i++;setTimeout(typing,40)}else if(callback){callback()}}typing()}
    function updateHPDisplay(){hpText.textContent=currentHP;const hpPercentage=(currentHP/maxHP)*100;hpBar.style.width=`${hpPercentage}%`}
    function takeDamage(amount){if(isInvincible)return;currentHP=Math.max(0,currentHP-amount);updateHPDisplay();isInvincible=true;soulHeart.classList.add('soul-invincible');setTimeout(()=>{isInvincible=false;soulHeart.classList.remove('soul-invincible')},1500)}
    function moveSoulToButton(button){if(!isPlayerTurn)return;const rect=button.getBoundingClientRect();const containerRect=mainContainer.getBoundingClientRect();soulHeart.style.display='block';soulHeart.style.top=`${rect.top-containerRect.top+11}px`;soulHeart.style.left=`${rect.left-containerRect.left-25}px`}
    function battleLoop(){for(let i=activeAttacks.length-1;i>=0;i--){const attack=activeAttacks[i];const speed=3;if(attack.direction==='down')attack.y+=speed;if(attack.direction==='right')attack.x+=speed;attack.element.style.left=`${attack.x}px`;attack.element.style.top=`${attack.y}px`;checkCollision(attack.element);if(attack.y>battleBox.offsetHeight||attack.x>battleBox.offsetWidth){attack.element.remove();activeAttacks.splice(i,1)}}battleLoopId=requestAnimationFrame(battleLoop)}
    function createAttack(startX,startY,direction){const attackEl=document.createElement('div');attackEl.className='attack';battleBox.appendChild(attackEl);activeAttacks.push({element:attackEl,x:startX,y:startY,direction:direction})}
    function checkCollision(attackElement){const soulRect=soulHeart.getBoundingClientRect();const attackRect=attackElement.getBoundingClientRect();if(soulRect.x<attackRect.x+attackRect.width&&soulRect.x+soulRect.width>attackRect.x&&soulRect.y<attackRect.y+attackRect.height&&soulRect.y+soulRect.height>attackRect.y){takeDamage(5)}}
    function updateSoulPosition(){soulPosition.x=Math.max(0,Math.min(soulPosition.x,battleBox.offsetWidth-soulHeart.offsetWidth));soulPosition.y=Math.max(0,Math.min(soulPosition.y,battleBox.offsetHeight-soulHeart.offsetHeight));soulHeart.style.left=`${soulPosition.x}px`;soulHeart.style.top=`${soulPosition.y}px`}
    actButton.addEventListener('click',()=>{if(!isPlayerTurn)return;typeWriter(actMessage,()=>{setTimeout(()=>typeWriter(battleStartMessage,startBattlePhase),1500)})});
    itemButton.addEventListener('click',()=>{if(!isPlayerTurn)return;currentHP=maxHP;updateHPDisplay();typeWriter(itemMessage)});
    mercyButton.addEventListener('click',()=>{if(!isPlayerTurn)return;typeWriter(mercyMessage)});
});