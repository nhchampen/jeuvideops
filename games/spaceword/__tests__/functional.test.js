/**
 * @jest-environment jsdom
 */

describe('SpaceWord Functional Tests', () => {
    let gameState;
    let gameActions;

    beforeAll(() => {
        jest.useFakeTimers();

        jest.spyOn(window, 'setInterval').mockImplementation(() => 999);
        jest.spyOn(window, 'clearInterval').mockImplementation(() => {});

        HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            beginPath: jest.fn(),
            arc: jest.fn(),
            fill: jest.fn(),
            stroke: jest.fn(),
            fillText: jest.fn(),
            measureText: jest.fn(() => ({ width: 50 })),
            save: jest.fn(),
            restore: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            scale: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            setTransform: jest.fn(),
            createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
            createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
        }));

        window.AudioContext = jest.fn().mockImplementation(() => ({
            createOscillator: jest.fn(() => ({
                connect: jest.fn(),
                start: jest.fn(),
                frequency: { value: 0 },
            })),
            createGain: jest.fn(() => ({
                connect: jest.fn(),
                gain: { value: 0, exponentialRampToValueAtTime: jest.fn() },
            })),
            destination: {},
            currentTime: 0,
        }));

        document.body.innerHTML = `
            <canvas id="canvas" width="800" height="600"></canvas>
            <nav style="visibility: visible;"></nav>
            <div class="lifebar"></div>
            <div class="text"></div>
            <div class="cronometer"></div>
            <div class="timefinish"></div>
            <button id="retry" style="visibility: hidden;" onclick="window.gameActions.beginGame()">Retry</button>
        `;

        require('../script.js');

        gameState = window.gameState;
        gameActions = window.gameActions;

        if (!gameState || !gameActions) {
            throw new Error('window.gameState or window.gameActions not exposed');
        }

        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            return setTimeout(() => cb(performance.now()), 0);
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    beforeEach(() => {
        if (gameActions.hardReset) gameActions.hardReset();
        else gameActions.restartStateGame();
        jest.clearAllTimers();
    });

    const advance = (ms) => jest.advanceTimersByTime(ms);
    const flushRAF = () => jest.runOnlyPendingTimers();

    test('Game starts without crashing and creates main character', () => {
        gameActions.beginGame();
        advance(100);
        flushRAF();

        expect(gameState.isGameBegins).toBe(true);
        expect(gameState.isDead).toBe(false);

        const mainCharacter = gameState.gameObjects.find(
            obj => obj.constructor.name === 'MainCharacter'
        );
        expect(mainCharacter).toBeDefined();
        expect(mainCharacter.lives).toBeGreaterThan(0);
    });

    test('Enemy can be created and typing mechanic works', () => {
        gameActions.beginGame();
        advance(50);
        flushRAF();

        const initialEnemyCount = gameState.gameObjects.length;
        gameActions.createAnEnemy();
        advance(10);
        flushRAF();

        expect(gameState.gameObjects.length).toBe(initialEnemyCount + 1);
        expect(gameState.words.length).toBeGreaterThan(0);

        const wordBefore = gameState.word;
        expect(wordBefore).toBeTruthy();

        const firstLetter = wordBefore[0];
        document.dispatchEvent(new KeyboardEvent('keydown', { key: firstLetter }));
        advance(10);
        flushRAF();

        expect(gameState.word).not.toBe(wordBefore);
    });

    test('Collision detection reduces lives and ends game', () => {
        let mockTime = 10000;
        const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => mockTime);

        gameActions.beginGame();
        advance(50);
        flushRAF();

        const mainChar = gameState.gameObjects.find(
            obj => obj.constructor.name === 'MainCharacter'
        );
        mainChar.lives = 3;
        expect(mainChar.lives).toBe(3);

        gameActions.createAnEnemy();
        advance(10);
        flushRAF();
        const enemy = gameState.gameObjects.find(
            obj => obj.constructor.name === 'Circle'
        );
        // Placer directement l'ennemi sur le joueur
        enemy.x = mainChar.x;
        enemy.y = mainChar.y;
        enemy.radius = mainChar.radius;

        // Avancer plusieurs frames pour laisser la collision se produire
        for (let i = 0; i < 10; i++) {
            advance(16);
            flushRAF();
            if (mainChar.lives < 3 || gameState.isDead) break;
        }

        // Vérifier que les vies ont diminué ou que le jeu est terminé
        expect(mainChar.lives < 3 || gameState.isDead).toBe(true);

        dateSpy.mockRestore();
    });
});