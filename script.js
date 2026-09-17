// ==========================================
// NEON CATCH - JAVASCRIPT
// ==========================================

const startButton = document.querySelector("#start");
const targets = document.querySelectorAll(".target");
const scoreElement = document.querySelector(".score");
const progress = document.querySelector(".progress span");
const arena = document.querySelector(".arena");

let score = 0;
let time = 10;
let gameStarted = false;
let timer;
let combo = 0;


// ==========================================
// INICIAR JOGO
// ==========================================

startButton.addEventListener("change", () => {

    if (startButton.checked) {
        startGame();
    }

});


// ==========================================
// COMEÇAR
// ==========================================

function startGame() {

    gameStarted = true;
    score = 0;
    time = 10;
    combo = 0;

    scoreElement.textContent = score;

    progress.style.animation = "none";
    progress.offsetHeight;
    progress.style.animation = "timer 10s linear forwards";

    targets.forEach(target => {
        target.style.opacity = "1";
        target.style.pointerEvents = "auto";
    });

    startTimer();

    moveTargets();

}


// ==========================================
// CRONÔMETRO
// ==========================================

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        time--;

        if (time <= 0) {
            clearInterval(timer);
            gameOver();
        }

    }, 1000);

}


// ==========================================
// ACERTAR ALVO
// ==========================================

targets.forEach((target, index) => {

    target.addEventListener("click", () => {

        if (!gameStarted) return;

        if (target.classList.contains("hit-target")) return;

        target.classList.add("hit-target");

        score += 100;
        combo++;

        // Bônus de combo
        if (combo >= 3) {
            score += 50;
        }

        scoreElement.textContent = score;

        createExplosion(target);

        // Pequeno atraso antes de mover
        setTimeout(() => {
            target.classList.remove("hit-target");

            moveTarget(target);

        }, 300);

        checkVictory();

    });

});


// ==========================================
// MOVER UM ALVO
// ==========================================

function moveTarget(target) {

    const arenaWidth = arena.clientWidth;
    const arenaHeight = arena.clientHeight;

    const targetSize = target.offsetWidth;

    const maxX = arenaWidth - targetSize - 20;
    const maxY = arenaHeight - targetSize - 40;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

}


// ==========================================
// MOVER TODOS OS ALVOS
// ==========================================

function moveTargets() {

    targets.forEach(target => {
        moveTarget(target);
    });

}


// ==========================================
// EFEITO DE EXPLOSÃO
// ==========================================

function createExplosion(target) {

    const explosion = document.createElement("div");

    explosion.classList.add("explosion");

    explosion.style.left =
        `${target.offsetLeft + target.offsetWidth / 2}px`;

    explosion.style.top =
        `${target.offsetTop + target.offsetHeight / 2}px`;

    arena.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 600);

}


// ==========================================
// VERIFICAR VITÓRIA
// ==========================================

function checkVictory() {

    const allHit = [...targets]
        .every(target =>
            target.classList.contains("hit-target")
        );

    if (allHit) {
        victory();
    }

}


// ==========================================
// VITÓRIA
// ==========================================

function victory() {

    gameStarted = false;

    clearInterval(timer);

    setTimeout(() => {

        alert(
            `VOCÊ VENCEU! 🎉\n\nPontuação: ${score}`
        );

    }, 200);

}


// ==========================================
// GAME OVER
// ==========================================

function gameOver() {

    gameStarted = false;

    targets.forEach(target => {
        target.style.pointerEvents = "none";
    });

    alert(
        `TEMPO ESGOTADO! ⏰\n\nPontuação: ${score}`
    );

}


// ==========================================
// ALVO SE MOVE AUTOMATICAMENTE
// ==========================================

setInterval(() => {

    if (!gameStarted) return;

    const randomTarget =
        targets[Math.floor(Math.random() * targets.length)];

    if (
        !randomTarget.classList.contains("hit-target")
    ) {
        moveTarget(randomTarget);
    }

}, 2500);
