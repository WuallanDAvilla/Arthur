document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DO HTML ---
  const battleMusic = document.getElementById("battle-music"),
    dialogueBox = document.getElementById("dialogue-box"),
    dialogueText = document.getElementById("dialogue-text"),
    nextIndicator = document.getElementById("next-indicator"),
    actButton = document.getElementById("act-button"),
    itemButton = document.getElementById("item-button"),
    mercyButton = document.getElementById("mercy-button"),
    soulHeart = document.querySelector(".soul-heart"),
    battleBox = document.getElementById("battle-box"),
    bottomPanel = document.querySelector(".bottom-panel"),
    mainContainer = document.querySelector(".container"),
    hpBar = document.getElementById("hp-bar"),
    hpText = document.getElementById("hp-text"),
    mobileControls = {
      up: document.getElementById("arrow-up"),
      down: document.getElementById("arrow-down"),
      left: document.getElementById("arrow-left"),
      right: document.getElementById("arrow-right"),
    },
    footer = document.getElementById("footer"),
    gameOverScreen = document.getElementById("game-over-screen"),
    gameOverMessage = document.getElementById("game-over-message"),
    retryButton = document.getElementById("retry-button");

  // --- ESTADO DO JOGO ---
  const maxHP = 20;
  let currentHP = maxHP,
    isPlayerTurn = true,
    waitingForNextTurnClick = false,
    isInvincible = false,
    isGameOver = false,
    battleLoopId,
    soulPosition = { x: 0, y: 0 },
    activeAttacks = [];
  let lastActIndex = -1,
    lastItemIndex = -1,
    lastBattleStartIndex = -1,
    lastBattleEndIndex = -1;

  // --- CONTEÚDO DO JOGO ---
  const gameOverText =
    "Arthur, voce e o futuro dos memes e das amizades... tenha determinacao!";
  const initialMessage =
    "* Thur, um san- digo... um arTHUR, bloqueia o caminho! VAIII CURINTIA!!!";
  const mercyMessage =
    "* Voce escolheu POUPAR. Voces venceram! Ganhou 0 EXP e uma irmandade que vale mais que qualquer LOVE... e um biscoito";
  const actMessages = [
    "* Voce checa Thur. ATK 10 DEF 10. Um irmao SANSacional, otimo em games (melhor que o Wuallan) e um parceiro pra todas as horas.",
    "* Voce tenta dizer a ele que Undertale 2 foi lancado. . . . . olhos dele brilham como estrelas",
    "* Voce tenta comecar a dancar, ele quer dancar com voce!",
  ];
  const items = [
    {
      name: "Sans de Aniversario",
      message: "* Voce usa o Sans de Aniversario. Seu HP foi maximizado!",
      effect: () => {
        currentHP = maxHP;
      },
    },
    {
      name: "Pedra",
      message: "* Voce come uma pedra, voce recuperou 1+ de HP",
      effect: () => {
        currentHP = Math.min(currentHP + 1, maxHP);
      },
    },
    {
      name: "Yago",
      message: "* Voce usa um Yago... Voce perdeu 5 de HP?!",
      effect: () => {
        takeDamage(5, true);
      },
    },
  ];
  const battleStartMessages = [
    "* Thur esta preparando seu ataque especial!",
    "* ThurGuri esta ataque preparando especial... pera ai, oque?...",
    "* O ar ao redor fica frio. Voce sente que vai ter um dia ruim.",
  ];
  const battleEndMessages = [
    "* Ufa! O cara ta me querendo que eu jogue no vasco! O ataque especial acabou. O que voce fara?",
    "* Ele esta cantarolando uma musica reconfortante...",
  ];

  // --- FUNÇÕES PRINCIPAIS ---
  function typeWriter(text, onComplete) {
    let i = 0;
    dialogueText.innerHTML = "";
    function typing() {
      if (i < text.length) {
        dialogueText.innerHTML += text.charAt(i);
        i++;
        setTimeout(typing, 40);
      } else if (onComplete) {
        if (onComplete === "waitForClick") {
          waitingForNextTurnClick = true;
          nextIndicator.classList.remove("hidden");
        } else {
          onComplete();
        }
      }
    }
    typing();
  }
  function triggerEnemyTurn() {
    const index = getRandomUnique("battleStart");
    const message = battleStartMessages[index];
    typeWriter(message, () => {
      if (index === 1) startSpecialBattlePhase();
      else if (index === 2) startSuperHardBattlePhase();
      else startBattlePhase();
    });
  }
  function handleGameOver() {
    isGameOver = true;
    battleMusic.pause();
    cancelAnimationFrame(battleLoopId);
    mainContainer.classList.add("hidden");
    footer.classList.add("hidden");
    mobileControls.up.parentElement.parentElement.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
    typeWriter.call({ innerHTML: "" }, gameOverText, () => {
      gameOverMessage.innerHTML = gameOverText.innerHTML;
    });
  }

  // --- LÓGICA DE BATALHA ---
  function setupBattle() {
    battleMusic.currentTime = 0;
    battleMusic.play();
    isPlayerTurn = false;
    bottomPanel.style.display = "none";
    battleBox.style.display = "block";
    soulHeart.style.display = "block";
    battleBox.appendChild(soulHeart);
    soulPosition.x = battleBox.offsetWidth / 2 - soulHeart.offsetWidth / 2;
    soulPosition.y = battleBox.offsetHeight / 2 - soulHeart.offsetHeight / 2;
    updateSoulPosition();
  }
  function startBattlePhase() {
    setupBattle();
    setTimeout(() => createAttack(50, -100, "down", 5), 500);
    setTimeout(() => createAttack(250, -100, "down", 5), 1500);
    setTimeout(() => createAttack(450, -100, "down", 5), 2000);
    setTimeout(() => createAttack(-100, 50, "right", 5), 3000);
    battleLoopId = requestAnimationFrame(battleLoop);
    setTimeout(endBattlePhase, 6000);
  }
  function startSpecialBattlePhase() {
    setupBattle();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const randomX = Math.random() * (battleBox.offsetWidth - 20);
        createAttack(randomX, -100, "down", 5);
      }, i * 300);
    }
    battleLoopId = requestAnimationFrame(battleLoop);
    setTimeout(endBattlePhase, 6000);
  }
  function startSuperHardBattlePhase() {
    setupBattle();
    const gap = 80;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const y = Math.random() * (battleBox.offsetHeight - gap);
        createAttack(-100, y, "right", 10);
        createAttack(battleBox.offsetWidth, y + 20, "left", 10);
      }, i * 700);
    }
    battleLoopId = requestAnimationFrame(battleLoop);
    setTimeout(endBattlePhase, 6000);
  }
  function endBattlePhase() {
    if (isGameOver) return;
    battleMusic.pause();
    cancelAnimationFrame(battleLoopId);
    isPlayerTurn = true;
    bottomPanel.style.display = "flex";
    battleBox.style.display = "none";
    mainContainer.appendChild(soulHeart);
    soulHeart.style.display = "none";
    activeAttacks.forEach((attack) => attack.element.remove());
    activeAttacks.length = 0;
    const message = battleEndMessages[getRandomUnique("battleEnd")];
    typeWriter(message);
  }
  function takeDamage(amount, bypassInvincibility = false) {
    if (isGameOver || (isInvincible && !bypassInvincibility)) return;
    currentHP = Math.max(0, currentHP - amount);
    updateHPDisplay();
    if (currentHP <= 0) {
      handleGameOver();
      return;
    }
    isInvincible = true;
    soulHeart.classList.add("soul-invincible");
    setTimeout(() => {
      isInvincible = false;
      soulHeart.classList.remove("soul-invincible");
    }, 1500);
  }
  function createAttack(x, y, dir, dmg) {
    if (isGameOver) return;
    const el = document.createElement("div");
    el.className = "attack";
    battleBox.appendChild(el);
    activeAttacks.push({ element: el, x, y, direction: dir, damage: dmg });
  }

  // --- FUNÇÕES DE UTILIDADE ---
  function getRandomUnique(type) {
    let array, lastIndex, setLastIndex;
    switch (type) {
      case "act":
        [array, lastIndex, setLastIndex] = [
          actMessages,
          lastActIndex,
          (i) => (lastActIndex = i),
        ];
        break;
      case "item":
        [array, lastIndex, setLastIndex] = [
          items,
          lastItemIndex,
          (i) => (lastItemIndex = i),
        ];
        break;
      case "battleStart":
        [array, lastIndex, setLastIndex] = [
          battleStartMessages,
          lastBattleStartIndex,
          (i) => (lastBattleStartIndex = i),
        ];
        break;
      case "battleEnd":
        [array, lastIndex, setLastIndex] = [
          battleEndMessages,
          lastBattleEndIndex,
          (i) => (lastBattleEndIndex = i),
        ];
        break;
    }
    let newIndex;
    if (array.length < 2) return 0;
    do {
      newIndex = Math.floor(Math.random() * array.length);
    } while (newIndex === lastIndex);
    setLastIndex(newIndex);
    return newIndex;
  }
  function updateHPDisplay() {
    hpText.textContent = `${currentHP} / ${maxHP}`;
    hpBar.style.width = `${(currentHP / maxHP) * 100}%`;
  }
  function moveSoulToButton(button) {
    if (!isPlayerTurn || isGameOver) return;
    const rect = button.getBoundingClientRect(),
      containerRect = mainContainer.getBoundingClientRect();
    soulHeart.style.display = "block";
    soulHeart.style.top = `${rect.top - containerRect.top + 11}px`;
    soulHeart.style.left = `${rect.left - containerRect.left - 25}px`;
  }
  function handleSoulMovement(direction) {
    if (isPlayerTurn || isGameOver) return;
    const speed = 7;
    switch (direction) {
      case "up":
        soulPosition.y -= speed;
        break;
      case "down":
        soulPosition.y += speed;
        break;
      case "left":
        soulPosition.x -= speed;
        break;
      case "right":
        soulPosition.x += speed;
        break;
    }
    updateSoulPosition();
  }
  function battleLoop() {
    if (isGameOver) return;
    for (let i = activeAttacks.length - 1; i >= 0; i--) {
      const attack = activeAttacks[i],
        speed = 3;
      if (attack.direction === "down") attack.y += speed;
      else if (attack.direction === "right") attack.x += speed;
      else if (attack.direction === "left") attack.x -= speed;
      attack.element.style.left = `${attack.x}px`;
      attack.element.style.top = `${attack.y}px`;
      checkCollision(attack);
      if (
        attack.y > battleBox.offsetHeight + 20 ||
        attack.x < -20 ||
        attack.x > battleBox.offsetWidth + 20
      ) {
        attack.element.remove();
        activeAttacks.splice(i, 1);
      }
    }
    battleLoopId = requestAnimationFrame(battleLoop);
  }
  function checkCollision(attack) {
    const soulRect = soulHeart.getBoundingClientRect(),
      attackRect = attack.element.getBoundingClientRect();
    if (
      soulRect.x < attackRect.x + attackRect.width &&
      soulRect.x + soulRect.width > attackRect.x &&
      soulRect.y < attackRect.y + attackRect.height &&
      soulRect.y + soulRect.height > attackRect.y
    ) {
      takeDamage(attack.damage);
    }
  }
  function updateSoulPosition() {
    soulPosition.x = Math.max(
      0,
      Math.min(soulPosition.x, battleBox.offsetWidth - soulHeart.offsetWidth)
    );
    soulPosition.y = Math.max(
      0,
      Math.min(soulPosition.y, battleBox.offsetHeight - soulHeart.offsetHeight)
    );
    soulHeart.style.left = `${soulPosition.x}px`;
    soulHeart.style.top = `${soulPosition.y}px`;
  }

  // --- EVENTOS ---
  dialogueBox.addEventListener("click", () => {
    if (waitingForNextTurnClick) {
      waitingForNextTurnClick = false;
      nextIndicator.classList.add("hidden");
      triggerEnemyTurn();
    }
  });
  actButton.addEventListener("click", () => {
    if (isPlayerTurn && !isGameOver) {
      const message = actMessages[getRandomUnique("act")];
      typeWriter(message, "waitForClick");
    }
  });
  itemButton.addEventListener("click", () => {
    if (isPlayerTurn && !isGameOver) {
      const item = items[getRandomUnique("item")];
      item.effect();
      updateHPDisplay();
      typeWriter(item.message, "waitForClick");
    }
  });
  mercyButton.addEventListener("click", () => {
    if (isPlayerTurn && !isGameOver) typeWriter(mercyMessage);
  });
  retryButton.addEventListener("click", () => location.reload());
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        handleSoulMovement("up");
        break;
      case "ArrowDown":
        handleSoulMovement("down");
        break;
      case "ArrowLeft":
        handleSoulMovement("left");
        break;
      case "ArrowRight":
        handleSoulMovement("right");
    }
  });
  mobileControls.up.addEventListener("click", () => handleSoulMovement("up"));
  mobileControls.down.addEventListener("click", () =>
    handleSoulMovement("down")
  );
  mobileControls.left.addEventListener("click", () =>
    handleSoulMovement("left")
  );
  mobileControls.right.addEventListener("click", () =>
    handleSoulMovement("right")
  );
  actButton.addEventListener("mouseover", () => moveSoulToButton(actButton));
  itemButton.addEventListener("mouseover", () => moveSoulToButton(itemButton));
  mercyButton.addEventListener("mouseover", () =>
    moveSoulToButton(mercyButton)
  );

  // --- INÍCIO ---
  updateHPDisplay();
  typeWriter(initialMessage);
});
