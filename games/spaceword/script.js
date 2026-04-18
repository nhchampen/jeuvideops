// Safe initialization for testing environment
const canvasElement = document.getElementsByTagName('canvas')[0];
const canvasWidth = canvasElement ? canvasElement.clientWidth : 800;
const canvasHeight = canvasElement ? canvasElement.clientHeight : 600;

const restitution = 0.90;
let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let gameObjects;
let mouseX = 400;
let mouseY = 300;
let words = [];
let word = '';
let elapsedTime = 0;
let timer;
let colorInterval;
let enemySpawnInterval;
let timerInterval;
let startTime;
let isDead = false;
let lastTime = 0;
let invencibilityTime = 2000;
let isGameBegins = false;
let reverse = false;
let pintinhaColor1 = 'white';
let pintinhaColor = 'black';


// === Expose game state for testing (with getters AND setters) ===
if (typeof window !== 'undefined') {
    window.gameState = {
        get isDead() { return isDead; },
        set isDead(val) { isDead = val; },
        get isGameBegins() { return isGameBegins; },
        set isGameBegins(val) { isGameBegins = val; },
        get words() { return words; },
        set words(val) { words = val; },
        get word() { return word; },
        set word(val) { word = val; },
        get gameObjects() { return gameObjects; },
        set gameObjects(val) { gameObjects = val; },
        get elapsedTime() { return elapsedTime; },
        set elapsedTime(val) { elapsedTime = val; },
    };
    window.gameActions = {
        beginGame,
        createAnEnemy,
        init,
        restartStateGame,
    };
}

// === AUDIO ===
let audioCtx;
const freqs = [261.63, 311.13, 261.63, 100, 200, 500, 415.30, 293.66];

function play(frequency) {
    setTimeout(() => {
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        oscillator.connect(gain);
        gain.gain.value = 1 / freqs.length;
        oscillator.frequency.value = freqs[frequency];
        oscillator.start(1);
        gain.connect(audioCtx.destination);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 6.0);
    }, 20);
}

function initAudio() {
    if (typeof AudioContext !== 'undefined') {
        audioCtx = new AudioContext();
    }
}
// === FIN AUDIO ===

window.onload = init;

class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isColliding = false;
    }
}

class MainCharacter extends GameObject {
    constructor(context, x, y, vx, vy) {
        super(context, x, y, vx, vy);
        this.lives = 3;
        this.width = 50;
        this.height = 0;
        this.radius = 30;
        canvas.addEventListener('mousemove', this.setMousePosition, false);
    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#2C2C2C' : '#C0C0C0';
        this.context.beginPath();
        this.context.arc(mouseX, mouseY, this.radius, 0, 2 * Math.PI, false);
        this.context.fill();

        // Pintinha central
        this.context.beginPath();
        context.fillStyle = 'white';
        this.context.arc(this.x, this.y, 7, 0, 2 * Math.PI, false);
        this.context.lineWidth = 1;
        this.context.fill();

        // Circulo de pintinhas
        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x + 23, this.y, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x - 23, this.y, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x, this.y - 23, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x, this.y + 23, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x + 15, this.y + 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x - 15, this.y - 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x + 15, this.y - 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x - 15, this.y + 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    update() {
        this.x = mouseX;
        this.y = mouseY;
        if (this.lives >= 0) {
            let liveShow = '<h1>';
            for (let i = 0; i < this.lives && this.lives > 0; i++) {
                liveShow += '🚀';
            }
            liveShow += '</h1>';
            document.querySelector('.lifebar').innerHTML = liveShow;
        }
        if (this.lives === 0) {
            isDead = true;
            play(3);
            play(4);
            play(5);
        }
        if (this.isColliding) {
            if (lastTime + invencibilityTime > Date.now()) {
                return;
            }
            --this.lives;
            lastTime = Date.now();
        }
    }

    setMousePosition(e) {
        const canvasPos = getPosition(canvas);
        mouseX = e.clientX - canvasPos.x;
        mouseY = e.clientY - canvasPos.y;
    }
}

function getPosition(el) {
    let xPosition = 0;
    let yPosition = 0;
    while (el) {
        xPosition += el.offsetLeft - el.scrollLeft + el.clientLeft;
        yPosition += el.offsetTop - el.scrollTop + el.clientTop;
        el = el.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

class Circle extends GameObject {
    constructor(context, x, y, vx, vy) {
        super(context, x, y, vx, vy);
        this.width = 50;
        this.height = 0;
        this.radius = 30;
    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#F3F3F3' : '#F3F3F3';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();

        this.context.beginPath();
        context.fillStyle = 'black';
        this.context.arc(this.x + 9, this.y - 8, 2, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();

        this.context.beginPath();
        context.fillStyle = 'black';
        this.context.arc(this.x + 7, this.y + 10, 4, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();

        this.context.beginPath();
        context.fillStyle = 'black';
        this.context.arc(this.x - 15, this.y, 7, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    update(secondsPassed) {
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

function init() {
    initAudio();
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    createWorld();
    word = words[0];
    document.addEventListener('keydown', (event) => {
        if (event.key === word[0]) {
            word = word.split('');
            word.shift();
            word = word.join('');
            if (word.length == 0) {
                words.splice(0, 1);
                word = words[0];
                gameObjects.splice(1, 1);
                play(1);
                play(2);
                play(3);
            }
        }
    }, false);
    window.requestAnimationFrame(gameLoop);
}

// function createWorld() {
//     setInterval(() => {
//         if (reverse) {
//             reverse = false;
//             pintinhaColor = 'white';
//             pintinhaColor1 = 'black';
//         } else {
//             reverse = true;
//             pintinhaColor1 = 'white';
//             pintinhaColor = 'black';
//         }
//     }, 3000);

//     gameObjects = [new MainCharacter(context, mouseX, mouseY, 50, -50)];
//     startTime = Date.now() - elapsedTime;

//     const interval = setInterval(() => {
//         if (!isDead) {
//             createAnEnemy();
//         } else {
//             clearInterval(interval);
//         }
//     }, 3000);
// }

function createWorld() {
    if (typeof jest !== 'undefined') {
        gameObjects = [new MainCharacter(context, mouseX, mouseY, 50, -50)];
        startTime = Date.now() - elapsedTime;
        return;
    }
    colorInterval = setInterval(function() {
        if (reverse) {
            reverse = false;
            pintinhaColor = 'white';
            pintinhaColor1 = 'black';
        } else {
            reverse = true;
            pintinhaColor1 = 'white';
            pintinhaColor = 'black';
        }
    }, 3000);
    gameObjects = [new MainCharacter(context, mouseX, mouseY, 50, -50)];
    startTime = Date.now() - elapsedTime;
    enemySpawnInterval = setInterval(function() {
        if (!isDead) {
            createAnEnemy();
        } else {
            clearInterval(enemySpawnInterval);
        }
    }, 3000);
}

const characters = 'abcdefghijklmnopqrstuvwxyz';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createAnEnemy() {
    words.push(generateString(getRandomInt(4, 7)));
    gameObjects.push(new Circle(context, getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight), getRandomInt(0, 100), getRandomInt(0, 100)));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function detectCollisions() {
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }
    for (let i = 0; i < gameObjects.length; i++) {
        const obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++) {
            const obj2 = gameObjects[j];
            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height) ||
                circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                obj1.isColliding = true;
                obj2.isColliding = true;
                const vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
                const distance = Math.sqrt(vCollision.x ** 2 + vCollision.y ** 2);
                const vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
                const vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
                const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                if (speed < 0) break;
                obj1.vx -= speed * vCollisionNorm.x;
                obj1.vy -= speed * vCollisionNorm.y;
                obj2.vx += speed * vCollisionNorm.x;
                obj2.vy += speed * vCollisionNorm.y;
            }
        }
    }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2);
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
    const squareDistance = (x1 - x2) ** 2 + (y1 - y2) ** 2;
    return squareDistance <= (r1 + r2) ** 2;
}

function detectEdgeCollisions() {
    for (let i = 0; i < gameObjects.length; i++) {
        const obj = gameObjects[i];
        if (obj.x < obj.radius) {
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.x = obj.radius;
        } else if (obj.x > canvasWidth - obj.radius) {
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.x = canvasWidth - obj.radius;
        }
        if (obj.y < obj.radius) {
            obj.vy = Math.abs(obj.vy) * restitution;
            obj.y = obj.radius;
        } else if (obj.y > canvasHeight - obj.radius) {
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.y = canvasHeight - obj.radius;
        }
    }
}

function gameLoop(timeStamp) {
    if (isGameBegins) {
        document.getElementsByTagName('nav')[0].style.visibility = 'hidden';
        document.getElementsByTagName('canvas')[0].style.cursor = 'none';
        if (!isDead) {
            secondsPassed = (timeStamp - oldTimeStamp) / 1000;
            oldTimeStamp = timeStamp;
            for (let i = 0; i < gameObjects.length; i++) {
                gameObjects[i].update(secondsPassed);
            }
            detectCollisions();
            detectEdgeCollisions();
            clearCanvas();

            for (let i = 0; i < gameObjects.length; i++) {
                if (words.length === 0) {
                    createAnEnemy();
                    word = words[0];
                }
                const html = '<h1>' + word + '</h1>';
                timerInterval = setInterval(() => {
                    if (!isDead) {
                        elapsedTime = Date.now() - startTime;
                    }
                }, 10);
                const timer = '<h1>' + timeToString(elapsedTime) + '</h1>';
                document.querySelector('.text').innerHTML = html;
                document.querySelector('.cronometer').innerHTML = timer;
                gameObjects[i].draw();
            }
            window.requestAnimationFrame(gameLoop);
        } else {
            clearCanvas();
            document.getElementsByClassName('text')[0].innerHTML = '';
            document.getElementsByClassName('cronometer')[0].innerHTML = '';
            document.getElementById('retry').style.visibility = 'visible';
            document.getElementsByTagName('canvas')[0].style.cursor = 'default';
            document.querySelector('.timefinish').innerHTML = timer;
        }
    }
}

function beginGame() {
    document.getElementById('retry').style.visibility = 'hidden';
    isGameBegins = true;
    isDead = false;
    elapsedTime = 0;
    init();
}

function timeToString(time) {
    const diffInHrs = time / 3600000;
    const hh = Math.floor(diffInHrs);
    const diffInMin = (diffInHrs - hh) * 60;
    const mm = Math.floor(diffInMin);
    const diffInSec = (diffInMin - mm) * 60;
    const ss = Math.floor(diffInSec);
    const diffInMs = (diffInSec - ss) * 100;
    const ms = Math.floor(diffInMs);
    const formattedMM = mm.toString().padStart(2, '0');
    const formattedSS = ss.toString().padStart(2, '0');
    const formattedMS = ms.toString().padStart(2, '0');
    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function sike() {
    alert('do you really think that i\'ll let you go easy? PLAY THE GAME!');
}

function restartStateGame() {
    secondsPassed = 0;
    oldTimeStamp = 0;
    gameObjects = [];
    words = [];
    word = '';
    elapsedTime = 0;
    timerInterval = null;
    colorInterval = null;
    enemySpawnInterval = null;
    startTime = undefined;
    lastTime = 0;
    invencibilityTime = 2000;
    isDead = false;
    isGameBegins = false;
    clearInterval(colorInterval);
    clearInterval(enemySpawnInterval);
    colorInterval = null;
    enemySpawnInterval = null;
    timer = '';
}

window.gameActions = {
    beginGame,
    createAnEnemy,
    init,
    restartStateGame,
    hardReset: function() {
        // Arrêter tous les intervalles
        clearInterval(colorInterval);
        clearInterval(enemySpawnInterval);
        clearInterval(timerInterval);
        // Réinitialiser toutes les variables globales
        secondsPassed = 0;
        oldTimeStamp = 0;
        gameObjects = [];
        words = [];
        word = '';
        elapsedTime = 0;
        timerInterval = null;
        startTime = undefined;
        lastTime = 0;
        invencibilityTime = 2000;
        isDead = false;
        isGameBegins = false;
        reverse = false;
        pintinhaColor1 = 'white';
        pintinhaColor = 'black';
        timer = '';
        mouseX = 400;
        mouseY = 300;
        // Nettoyer les éventuels écouteurs résiduels (optionnel)
    }
};