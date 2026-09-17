/* =========================================================
   NEON CATCH
   SISTEMA COMPLETO DE FASES
========================================================= */


/* =========================================================
   CONFIGURAÇÃO PRINCIPAL DO JOGO

   Você pode alterar os valores daqui sem precisar
   modificar o restante do código.
========================================================= */

const GAME_CONFIG = {

    // Quantidade máxima de fases
    maxPhase: 10,

    // Fase 1 começa com 3 alvos
    initialTargets: 3,

    // Adiciona 1 alvo a cada fase
    targetIncrease: 1,

    // Fase 1 possui 10 segundos
    initialTime: 10,

    // Adiciona 2 segundos por fase
    timeIncrease: 2,

    // Pontuação inicial por alvo
    baseScore: 100,

    // Multiplicador máximo do combo
    maxCombo: 4,

    // A partir de qual fase o multiplicador de fase aumenta
    scoreMultiplierStartPhase: 3,

    // Quanto o multiplicador aumenta por fase
    scoreMultiplierIncrease: 0.10,

    // Intervalo inicial de movimento
    initialMovementInterval: 1300,

    // Redução do intervalo por fase
    movementIntervalDecrease: 80,

    // Velocidade inicial
    initialMovementSpeed: 700,

    // Aumento de velocidade por fase
    movementSpeedIncrease: 45,

    // Tempo de transição entre fases
    phaseTransitionTime: 1700,

    // Tamanho mínimo do alvo em pixels
    minTargetSize: 42,

    // Tamanho máximo do alvo em pixels
    maxTargetSize: 66,

    // Espaçamento mínimo entre alvos
    targetSpacing: 12,

    // Margem interna da arena
    arenaPadding: 30

};


/* =========================================================
   ESTADO DO JOGO
========================================================= */

const gameState = {

    phase: 1,

    score: 0,

    combo: 1,

    targetsHit: 0,

    totalTargets: 0,

    timeRemaining: 0,

    phaseScore: 0,

    isPlaying: false,

    isCountingDown: false,

    phaseComplete: false,

    timerInterval: null,

    movementInterval: null,

    transitionTimeout: null,

    targetElements: []

};


/* =========================================================
   ELEMENTOS HTML
========================================================= */

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");

const playButton = document.getElementById("playButton");

const targetsContainer =
    document.getElementById("targetsContainer");

const effectsContainer =
    document.getElementById("effectsContainer");

const countdownOverlay =
    document.getElementById("countdownOverlay");

const countdownNumber =
    document.getElementById("countdownNumber");

const countdownPhase =
    document.getElementById("countdownPhase");

const phaseOverlay =
    document.getElementById("phaseOverlay");

const phasePoints =
    document.getElementById("phasePoints");

const nextPhaseValue =
    document.getElementById("nextPhaseValue");

const gameOverOverlay =
    document.getElementById("gameOverOverlay");

const victoryOverlay =
    document.getElementById("victoryOverlay");

const restartGameButton =
    document.getElementById("restartGameButton");

const backMenuButton =
    document.getElementById("backMenuButton");

const victoryRestartButton =
    document.getElementById("victoryRestartButton");

const victoryMenuButton =
    document.getElementById("victoryMenuButton");

const phaseValue =
    document.getElementById("phaseValue");

const targetsValue =
    document.getElementById("targetsValue");

const scoreValue =
    document.getElementById("scoreValue");

const comboValue =
    document.getElementById("comboValue");

const timerValue =
    document.getElementById("timerValue");

const timeBar =
    document.getElementById("timeBar");

const timePercentage =
    document.getElementById("timePercentage");


/* GAME OVER */

const gameOverPhase =
    document.getElementById("gameOverPhase");

const gameOverScore =
    document.getElementById("gameOverScore");

const gameOverTargets =
    document.getElementById("gameOverTargets");

const gameOverCombo =
    document.getElementById("gameOverCombo");

const gameOverBest =
    document.getElementById("gameOverBest");


/* VITÓRIA */

const victoryScore =
    document.getElementById("victoryScore");

const victoryBestScore =
    document.getElementById("victoryBestScore");

const victoryBestPhase =
    document.getElementById("victoryBestPhase");


/* MENU */

const menuBestScore =
    document.getElementById("menuBestScore");

const menuBestPhase =
    document.getElementById("menuBestPhase");


/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_KEYS = {

    bestScore: "neonCatchBestScore",

    bestPhase: "neonCatchBestPhase"

};


function getBestScore() {

    return Number(
        localStorage.getItem(STORAGE_KEYS.bestScore)
    ) || 0;

}


function getBestPhase() {

    return Number(
        localStorage.getItem(STORAGE_KEYS.bestPhase)
    ) || 0;

}


function saveRecords() {

    const currentBestScore = getBestScore();
    const currentBestPhase = getBestPhase();

    if (gameState.score > currentBestScore) {

        localStorage.setItem(
            STORAGE_KEYS.bestScore,
            String(gameState.score)
        );

    }

    if (gameState.phase > currentBestPhase) {

        localStorage.setItem(
            STORAGE_KEYS.bestPhase,
            String(gameState.phase)
        );

    }

}


/* =========================================================
   FUNÇÕES DE CONFIGURAÇÃO DA FASE
========================================================= */


/*
    Retorna a quantidade de alvos da fase atual.

    Fase 1 = 3
    Fase 2 = 4
    Fase 3 = 5
    ...
*/

function getTargetCount() {

    return (
        GAME_CONFIG.initialTargets +
        ((gameState.phase - 1) * GAME_CONFIG.targetIncrease)
    );

}


/*
    Retorna o tempo da fase.

    Fase 1 = 10
    Fase 2 = 12
    Fase 3 = 14
*/

function getPhaseTime() {

    return (
        GAME_CONFIG.initialTime +
        ((gameState.phase - 1) * GAME_CONFIG.timeIncrease)
    );

}


/*
    Multiplicador de pontuação.

    Até a fase configurada como início do bônus:
    multiplicador = 1

    Depois aumenta gradualmente.
*/

function getScoreMultiplier() {

    if (
        gameState.phase <
        GAME_CONFIG.scoreMultiplierStartPhase
    ) {

        return 1;

    }

    const extraPhases =
        gameState.phase -
        GAME_CONFIG.scoreMultiplierStartPhase +
        1;

    return (
        1 +
        (
            extraPhases *
            GAME_CONFIG.scoreMultiplierIncrease
        )
    );

}


/*
    Velocidade de movimentação.

    Quanto maior a fase,
    maior a velocidade.
*/

function getMovementSpeed() {

    return (
        GAME_CONFIG.initialMovementSpeed +
        (
            (gameState.phase - 1) *
            GAME_CONFIG.movementSpeedIncrease
        )
    );

}


/*
    Intervalo de movimentação.

    Quanto maior a fase,
    menor o intervalo.
*/

function getMovementInterval() {

    const interval =
        GAME_CONFIG.initialMovementInterval -
        (
            (gameState.phase - 1) *
            GAME_CONFIG.movementIntervalDecrease
        );

    return Math.max(450, interval);

}


/* =========================================================
   TAMANHO DOS ALVOS
========================================================= */

function getTargetSize() {

    const screenWidth = window.innerWidth;

    let size;

    if (screenWidth <= 380) {

        size = 44;

    } else if (screenWidth <= 600) {

        size = 48;

    } else if (screenWidth <= 900) {

        size = 56;

    } else {

        size = 62;

    }


    /*
        Nas fases maiores os alvos ficam
        levemente menores.
    */

    size -= Math.min(
        14,
        (gameState.phase - 1) * 1
    );


    return Math.max(
        GAME_CONFIG.minTargetSize,
        Math.min(
            GAME_CONFIG.maxTargetSize,
            size
        )
    );

}


/* =========================================================
   POSICIONAMENTO DOS ALVOS
========================================================= */

function getSafePosition(targetSize, existingPositions) {

    const arenaRect =
        document
            .getElementById("arena")
            .getBoundingClientRect();


    /*
        Área segura.

        Evita:
        - HUD
        - bordas
        - barra de tempo
    */

    const halfSize = targetSize / 2;

    const padding =
        GAME_CONFIG.arenaPadding + halfSize;


    const topLimit = 60;

    const bottomLimit =
        arenaRect.height - 75 - halfSize;


    const leftLimit = padding;

    const rightLimit =
        arenaRect.width - padding;


    const maxAttempts = 100;


    for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
    ) {

        const x =
            leftLimit +
            Math.random() *
            Math.max(1, rightLimit - leftLimit);


        const y =
            topLimit +
            Math.random() *
            Math.max(1, bottomLimit - topLimit);


        const valid = existingPositions.every(
            position => {

                const dx =
                    x - position.x;

                const dy =
                    y - position.y;

                const distance =
                    Math.sqrt(
                        (dx * dx) +
                        (dy * dy)
                    );

                return (
                    distance >=
                    targetSize +
                    GAME_CONFIG.targetSpacing
                );

            }
        );


        if (valid) {

            return { x, y };

        }

    }


    /*
        Se não encontrar uma posição perfeita,
        retorna uma posição segura aleatória.
    */

    return {

        x:
            leftLimit +
            Math.random() *
            Math.max(1, rightLimit - leftLimit),

        y:
            topLimit +
            Math.random() *
            Math.max(1, bottomLimit - topLimit)

    };

}


/* =========================================================
   CRIAR ALVOS
========================================================= */

function createTargets() {

    removeTargets();


    const count =
        getTargetCount();

    const targetSize =
        getTargetSize();

    const positions = [];


    gameState.totalTargets = count;

    gameState.targetsHit = 0;

    gameState.phaseScore = 0;


    targetsContainer.innerHTML = "";


    /*
        Cria os alvos dinamicamente.
    */

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const target =
            document.createElement("div");


        target.className = "target";


        target.style.setProperty(
            "--target-size",
            `${targetSize}px`
        );


        target.style.setProperty(
            "--movement-duration",
            `${getMovementSpeed()}ms`
        );


        /*
            Armazena o índice do alvo.
        */

        target.dataset.targetId = String(i);


        const position =
            getSafePosition(
                targetSize,
                positions
            );


        positions.push(position);


        target.style.left =
            `${position.x}px`;

        target.style.top =
            `${position.y}px`;


        /*
            Evento de toque/clique.
        */

        target.addEventListener(
            "pointerdown",
            handleTargetHit,
            {
                passive: true
            }
        );


        targetsContainer.appendChild(target);


        gameState.targetElements.push(
            target
        );

    }


    updateHUD();

}


/* =========================================================
   REMOVER ALVOS
========================================================= */

function removeTargets() {

    gameState.targetElements.forEach(
        target => {

            if (target &&
                target.parentNode) {

                target.parentNode.removeChild(
                    target
                );

            }

        }
    );


    gameState.targetElements = [];


    targetsContainer.innerHTML = "";

}


/* =========================================================
   MOVIMENTAÇÃO
========================================================= */

function moveTargets() {

    if (!gameState.isPlaying) {
        return;
    }


    if (gameState.phaseComplete) {
        return;
    }


    const targetSize =
        getTargetSize();


    const positions = [];


    gameState.targetElements.forEach(
        target => {

            if (
                !target ||
                target.classList.contains("hit")
            ) {

                return;

            }


            const position =
                getSafePosition(
                    targetSize,
                    positions
                );


            positions.push(position);


            target.style.left =
                `${position.x}px`;

            target.style.top =
                `${position.y}px`;

        }
    );

}


/* =========================================================
   INTERVALO DE MOVIMENTAÇÃO
========================================================= */

function startTargetMovement() {

    stopTargetMovement();


    moveTargets();


    gameState.movementInterval =
        setInterval(
            moveTargets,
            getMovementInterval()
        );

}


function stopTargetMovement() {

    if (
        gameState.movementInterval
    ) {

        clearInterval(
            gameState.movementInterval
        );

        gameState.movementInterval =
            null;

    }

}


/* =========================================================
   INICIAR FASE
========================================================= */

function startPhase() {

    clearGameTimers();


    gameState.isPlaying = false;

    gameState.phaseComplete = false;

    gameState.targetsHit = 0;

    gameState.totalTargets =
        getTargetCount();

    gameState.timeRemaining =
        getPhaseTime();

    gameState.phaseScore = 0;


    removeTargets();

    updateHUD();


    /*
        Countdown antes da fase.
    */

    startCountdown(
        () => {

            if (
                !gameState.isPlaying &&
                !gameState.phaseComplete
            ) {

                gameState.isPlaying = true;

                createTargets();

                startTimer();

                startTargetMovement();

                updateHUD();

            }

        }
    );

}


/* =========================================================
   COUNTDOWN
========================================================= */

function startCountdown(callback) {

    gameState.isCountingDown = true;


    countdownPhase.textContent =
        gameState.phase;


    countdownOverlay.classList.remove(
        "hidden"
    );


    const sequence = [
        "3",
        "2",
        "1",
        "VAI!"
    ];


    let index = 0;


    function showNext() {

        if (index >= sequence.length) {

            countdownOverlay.classList.add(
                "hidden"
            );

            gameState.isCountingDown = false;

            callback();

            return;

        }


        countdownNumber.textContent =
            sequence[index];


        /*
            Reinicia animação.
        */

        countdownNumber.style.animation =
            "none";

        void countdownNumber.offsetWidth;

        countdownNumber.style.animation =
            "countdownPulse 0.9s ease-out";


        index++;


        setTimeout(
            showNext,
            900
        );

    }


    showNext();

}


/* =========================================================
   PRÓXIMA FASE
========================================================= */

function nextPhase() {

    if (
        gameState.phase >=
        GAME_CONFIG.maxPhase
    ) {

        showVictory();

        return;

    }


    const completedPhase =
        gameState.phase;


    const points =
        gameState.phaseScore;


    gameState.phaseComplete = true;

    gameState.isPlaying = false;


    stopTimer();

    stopTargetMovement();

    removeTargets();


    /*
        Salva maior fase alcançada.
    */

    saveRecords();


    gameState.phase++;


    phasePoints.textContent =
        formatNumber(points);


    nextPhaseValue.textContent =
        gameState.phase;


    phaseOverlay.classList.remove(
        "hidden"
    );


    /*
        Aguarda aproximadamente 1.7 segundos.
    */

    gameState.transitionTimeout =
        setTimeout(
            () => {

                phaseOverlay.classList.add(
                    "hidden"
                );


                gameState.phaseComplete =
                    false;


                startPhase();

            },
            GAME_CONFIG.phaseTransitionTime
        );

}


/* =========================================================
   ACERTAR ALVO
========================================================= */

function handleTargetHit(event) {

    if (
        !gameState.isPlaying ||
        gameState.phaseComplete
    ) {

        return;

    }


    const target =
        event.currentTarget;


    if (
        !target ||
        target.classList.contains("hit")
    ) {

        return;

    }


    /*
        Evita clique duplo no mesmo alvo.
    */

    target.classList.add("hit");


    /*
        Combo:
        1º acerto = x1
        2º acerto = x2
        3º acerto = x3
        4º em diante = x4
    */

    const currentCombo =
        Math.min(
            GAME_CONFIG.maxCombo,
            gameState.combo
        );


    /*
        Pontuação base.
    */

    const basePoints =
        GAME_CONFIG.baseScore;


    /*
        Multiplicador de fase.
    */

    const phaseMultiplier =
        getScoreMultiplier();


    /*
        Pontuação final do alvo.
    */

    const points = Math.round(
        basePoints *
        currentCombo *
        phaseMultiplier
    );


    gameState.score += points;

    gameState.phaseScore += points;

    gameState.targetsHit++;


    /*
        Aumenta combo para o próximo alvo.
    */

    gameState.combo =
        Math.min(
            GAME_CONFIG.maxCombo,
            gameState.combo + 1
        );


    /*
        Efeitos visuais.
    */

    createHitEffects(
        event.clientX,
        event.clientY,
        points,
        currentCombo
    );


    /*
        Remove o alvo depois da animação.
    */

    setTimeout(
        () => {

            if (
                target &&
                target.parentNode
            ) {

                target.remove();

            }

        },
        220
    );


    updateHUD();


    /*
        Verifica se completou a fase.
    */

    if (
        gameState.targetsHit >=
        gameState.totalTargets
    ) {

        completeCurrentPhase();

    }

}


/* =========================================================
   COMPLETAR FASE
========================================================= */

function completeCurrentPhase() {

    if (gameState.phaseComplete) {
        return;
    }


    gameState.phaseComplete = true;

    gameState.isPlaying = false;


    stopTimer();

    stopTargetMovement();


    /*
        Pequeno efeito final.
    */

    createArenaFlash();


    setTimeout(
        () => {

            nextPhase();

        },
        250
    );

}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    stopTimer();


    const phaseDuration =
        getPhaseTime();


    const startTime =
        performance.now();


    gameState.timeRemaining =
        phaseDuration;


    updateTimerVisual();


    gameState.timerInterval =
        setInterval(
            () => {

                if (
                    !gameState.isPlaying ||
                    gameState.phaseComplete
                ) {

                    return;

                }


                const elapsed =
                    (
                        performance.now() -
                        startTime
                    ) / 1000;


                gameState.timeRemaining =
                    Math.max(
                        0,
                        phaseDuration - elapsed
                    );


                updateTimerVisual();


                if (
                    gameState.timeRemaining <= 0
                ) {

                    timeExpired();

                }

            },
            50
        );

}


/* =========================================================
   PARAR TIMER
========================================================= */

function stopTimer() {

    if (gameState.timerInterval) {

        clearInterval(
            gameState.timerInterval
        );

        gameState.timerInterval =
            null;

    }

}


/* =========================================================
   TEMPO ESGOTADO
========================================================= */

function timeExpired() {

    if (
        gameState.phaseComplete ||
        !gameState.isPlaying
    ) {

        return;

    }


    gameState.isPlaying = false;

    gameState.phaseComplete = true;


    stopTimer();

    stopTargetMovement();


    /*
        Salva recordes.
    */

    saveRecords();


    showGameOver();

}


/* =========================================================
   VISUAL DO TIMER
========================================================= */

function updateTimerVisual() {

    const maxTime =
        getPhaseTime();


    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (
                    gameState.timeRemaining /
                    maxTime
                ) * 100
            )
        );


    timerValue.textContent =
        gameState.timeRemaining.toFixed(1);


    timeBar.style.transform =
        `scaleX(${percentage / 100})`;


    timePercentage.textContent =
        `${Math.ceil(percentage)}%`;


    /*
        Modo alerta quando restam
        25% do tempo.
    */

    const warning =
        percentage <= 25;


    timeBar.classList.toggle(
        "warning",
        warning
    );


    document
        .querySelector(".timer-stat")
        .classList.toggle(
            "warning",
            warning
        );

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    phaseValue.textContent =
        gameState.phase;


    targetsValue.textContent =
        `${gameState.targetsHit} / ${gameState.totalTargets}`;


    scoreValue.textContent =
        formatNumber(gameState.score);


    comboValue.textContent =
        `x${gameState.combo}`;


    timerValue.textContent =
        gameState.timeRemaining.toFixed(1);


    updateTimerVisual();

}


/* =========================================================
   EFEITOS DE ACERTO
========================================================= */

function createHitEffects(
    x,
    y,
    points,
    combo
) {

    const arena =
        document.getElementById("arena");


    const rect =
        arena.getBoundingClientRect();


    const localX =
        x - rect.left;


    const localY =
        y - rect.top;


    /*
        Flash
    */

    const flash =
        document.createElement("div");


    flash.className = "flash";


    flash.style.left =
        `${localX}px`;

    flash.style.top =
        `${localY}px`;


    effectsContainer.appendChild(
        flash
    );


    setTimeout(
        () => flash.remove(),
        350
    );


    /*
        Pontuação
    */

    const pointsElement =
        document.createElement("div");


    pointsElement.className =
        "effect-points";


    pointsElement.textContent =
        `+${formatNumber(points)}`;


    pointsElement.style.left =
        `${localX}px`;

    pointsElement.style.top =
        `${localY}px`;


    effectsContainer.appendChild(
        pointsElement
    );


    setTimeout(
        () => pointsElement.remove(),
        900
    );


    /*
        Combo
    */

    if (combo >= 2) {

        const comboElement =
            document.createElement("div");


        comboElement.className =
            "effect-combo";


        comboElement.textContent =
            `COMBO x${combo}`;


        comboElement.style.left =
            `${localX}px`;

        comboElement.style.top =
            `${localY + 28}px`;


        effectsContainer.appendChild(
            comboElement
        );


        setTimeout(
            () => comboElement.remove(),
            1000
        );

    }


    /*
        Partículas
    */

    createParticles(
        localX,
        localY
    );

}


/* =========================================================
   PARTÍCULAS
========================================================= */

function createParticles(x, y) {

    const particleCount =
        window.innerWidth <= 600
            ? 8
            : 14;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement("div");


        particle.className =
            "particle";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            25 +
            Math.random() * 55;


        const particleX =
            Math.cos(angle) *
            distance;


        const particleY =
            Math.sin(angle) *
            distance;


        particle.style.left =
            `${x}px`;

        particle.style.top =
            `${y}px`;


        particle.style.setProperty(
            "--particle-x",
            `${particleX}px`
        );


        particle.style.setProperty(
            "--particle-y",
            `${particleY}px`
        );


        /*
            Algumas partículas ficam rosas.
        */

        if (i % 4 === 0) {

            particle.style.background =
                "var(--pink)";

            particle.style.boxShadow =
                "0 0 10px var(--pink)";

        }


        effectsContainer.appendChild(
            particle
        );


        setTimeout(
            () => particle.remove(),
            700
        );

    }

}


/* =========================================================
   FLASH DA ARENA
========================================================= */

function createArenaFlash() {

    const flash =
        document.createElement("div");


    flash.className =
        "flash";


    flash.style.left =
        "50%";

    flash.style.top =
        "50%";


    flash.style.width =
        "180px";

    flash.style.height =
        "180px";


    effectsContainer.appendChild(
        flash
    );


    setTimeout(
        () => flash.remove(),
        400
    );

}


/* =========================================================
   GAME OVER
========================================================= */

function showGameOver() {

    saveRecords();


    gameOverPhase.textContent =
        gameState.phase;


    gameOverScore.textContent =
        formatNumber(gameState.score);


    gameOverTargets.textContent =
        `${gameState.targetsHit} / ${gameState.totalTargets}`;


    gameOverCombo.textContent =
        `x${gameState.combo}`;


    gameOverBest.textContent =
        formatNumber(
            getBestScore()
        );


    gameOverOverlay.classList.remove(
        "hidden"
    );


    updateMenuRecords();

}


/* =========================================================
   VITÓRIA
========================================================= */

function showVictory() {

    clearGameTimers();


    gameState.isPlaying = false;

    gameState.phaseComplete = true;


    saveRecords();


    victoryScore.textContent =
        formatNumber(
            gameState.score
        );


    victoryBestScore.textContent =
        formatNumber(
            getBestScore()
        );


    victoryBestPhase.textContent =
        getBestPhase();


    victoryOverlay.classList.remove(
        "hidden"
    );


    updateMenuRecords();

}


/* =========================================================
   RESET DO JOGO
========================================================= */

function resetGame() {

    clearGameTimers();


    gameState.phase = 1;

    gameState.score = 0;

    gameState.combo = 1;

    gameState.targetsHit = 0;

    gameState.totalTargets =
        getTargetCount();

    gameState.timeRemaining =
        getPhaseTime();

    gameState.phaseScore = 0;

    gameState.isPlaying = false;

    gameState.isCountingDown = false;

    gameState.phaseComplete = false;


    removeTargets();


    phaseOverlay.classList.add(
        "hidden"
    );

    gameOverOverlay.classList.add(
        "hidden"
    );

    victoryOverlay.classList.add(
        "hidden"
    );

    countdownOverlay.classList.add(
        "hidden"
    );


    updateHUD();

}


/* =========================================================
   INICIAR JOGO
========================================================= */

function startGame() {

    resetGame();


    menuScreen.classList.remove(
        "active"
    );

    gameScreen.classList.add(
        "active"
    );


    startPhase();

}


/* =========================================================
   VOLTAR AO MENU
========================================================= */

function returnToMenu() {

    clearGameTimers();

    removeTargets();


    gameState.isPlaying = false;

    gameState.phaseComplete = true;


    gameScreen.classList.remove(
        "active"
    );

    menuScreen.classList.add(
        "active"
    );


    phaseOverlay.classList.add(
        "hidden"
    );

    gameOverOverlay.classList.add(
        "hidden"
    );

    victoryOverlay.classList.add(
        "hidden"
    );

    countdownOverlay.classList.add(
        "hidden"
    );


    updateMenuRecords();

}


/* =========================================================
   LIMPAR TODOS OS TIMERS
========================================================= */

function clearGameTimers() {

    stopTimer();

    stopTargetMovement();


    if (
        gameState.transitionTimeout
    ) {

        clearTimeout(
            gameState.transitionTimeout
        );

        gameState.transitionTimeout =
            null;

    }

}


/* =========================================================
   FORMATAR NÚMEROS
========================================================= */

function formatNumber(value) {

    return Number(value).toLocaleString(
        "pt-BR"
    );

}


/* =========================================================
   ATUALIZAR RECORDES DO MENU
========================================================= */

function updateMenuRecords() {

    menuBestScore.textContent =
        formatNumber(
            getBestScore()
        );


    menuBestPhase.textContent =
        getBestPhase();

}


/* =========================================================
   REDIMENSIONAMENTO
========================================================= */

window.addEventListener(
    "resize",
    () => {

        /*
            Reposiciona os alvos quando
            a tela muda de tamanho.
        */

        if (
            gameState.isPlaying &&
            !gameState.phaseComplete
        ) {

            moveTargets();

        }

    }
);


/* =========================================================
   EVENTOS DOS BOTÕES
========================================================= */

playButton.addEventListener(
    "click",
    startGame
);


restartGameButton.addEventListener(
    "click",
    startGame
);


victoryRestartButton.addEventListener(
    "click",
    startGame
);


backMenuButton.addEventListener(
    "click",
    returnToMenu
);


victoryMenuButton.addEventListener(
    "click",
    returnToMenu
);


/* =========================================================
   EVITAR MENU DE CONTEXTO NO JOGO
========================================================= */

document.addEventListener(
    "contextmenu",
    event => {

        if (
            event.target.closest(".target")
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeGame() {

    updateMenuRecords();


    /*
        Estado inicial da primeira fase.
    */

    gameState.totalTargets =
        getTargetCount();

    gameState.timeRemaining =
        getPhaseTime();


    updateHUD();

}


initializeGame();
