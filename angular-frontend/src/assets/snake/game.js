const mx = 50;
const my = 50;

let canvas;
let ctx;
let speed = 200;
let score = 0;
let scoreElem;

let gameOverElem, finalScoreElem, restartBtn;

const tail = [
    {x: 1, y: 1},
    {x: 2, y: 1},
    {x: 3, y: 1}
];

let direction = { dx: 1, dy: 0 };
let canChangeDirection = true;

const randomCoord = () => ({
    x: Math.floor(Math.random() * mx),
    y: Math.floor(Math.random() * my)
});

const generateFruit = () => {
    let newFruit;
    do {
        newFruit = randomCoord();
    } while (tail.some(segment => segment.x === newFruit.x && segment.y === newFruit.y));
    return newFruit;
};

let fruit = generateFruit();

const draw = () => {
    ctx.clearRect(0, 0, 500, 500);

    // gyümölcs
    ctx.fillStyle = "red";
    ctx.fillRect(fruit.x * 10, fruit.y * 10, 10, 10);

    // kígyó
    ctx.fillStyle = "green";
    tail.forEach((segment) => {
        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });
};

const move = () => {
    const oldHead = tail[tail.length - 1];
    const newHead = {
        x: oldHead.x + direction.dx,
        y: oldHead.y + direction.dy
    };

    // Falba harapsz
    if (
        newHead.x < 0 || newHead.x >= mx ||
        newHead.y < 0 || newHead.y >= my
    ) {
        endGame();
        return;
    }

    // seggedbe harapsz
    if (tail.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    tail.push(newHead);

    if (newHead.x === fruit.x && newHead.y === fruit.y) {
        fruit = generateFruit();
        score++;
        scoreElem.textContent = "Score: " + score;

        // Gyorsítás
        clearInterval(timerId);
        speed = Math.max(50, speed - 20);
        timerId = setInterval(move, speed);
    } else {
        tail.shift();
    }

    draw();
    canChangeDirection = true;
};

const endGame = () => {
    clearInterval(timerId);
    finalScoreElem.textContent = "Score: " + score;
    gameOverElem.classList.remove("hidden");
};

const restartGame = () => {
    score = 0;
    speed = 200;
    tail.splice(0, tail.length, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1});
    direction = { dx: 1, dy: 0 };
    fruit = generateFruit();
    scoreElem.textContent = "Score: 0";
    gameOverElem.classList.add("hidden");
    clearInterval(timerId);
    timerId = setInterval(move, speed);
    draw();
};

let timerId;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    scoreElem = document.getElementById("score");
    gameOverElem = document.getElementById("game-over");
    finalScoreElem = document.getElementById("final-score");
    restartBtn = document.getElementById("restart-btn");

    restartBtn.addEventListener("click", restartGame);

    draw();
    timerId = setInterval(move, speed);
});

document.addEventListener("keydown", (event) => {
    if (!canChangeDirection) return;

    const { code } = event;

    if (code === "ArrowUp" && direction.dy !== 1) {
        direction = { dx: 0, dy: -1 };
    }
    else if (code === "ArrowDown" && direction.dy !== -1) {
        direction = { dx: 0, dy: 1 };
    }
    else if (code === "ArrowLeft" && direction.dx !== 1) {
        direction = { dx: -1, dy: 0 };
    }
    else if (code === "ArrowRight" && direction.dx !== -1) {
        direction = { dx: 1, dy: 0 };
    }

    canChangeDirection = false; //1 "tick" alatt 1 iráynváltás. de a kövi intervallal újra tölt
    event.preventDefault();
});