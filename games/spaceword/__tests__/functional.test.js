/**
 * @jest-environment jsdom
 */

import { timeToString } from '../js/utils.js';

let gameState;
let gameActions;

describe('SpaceWord Functional Tests', () => {
    beforeAll(() => {
        jest.useFakeTimers();

        window.AudioContext = jest.fn().mockImplementation(() => ({
            createOscillator: jest.fn(() => ({
                connect: jest.fn(),
                start: jest.fn(),
                frequency: { value: 0 },
            })),
            createGain: jest.fn(() => ({
                connect: jest.fn(),
                gain: {
                    value: 0,
                    exponentialRampToValueAtTime: jest.fn(),
                },
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
            cb(performance.now());
            return 0;
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    beforeEach(() => {
        gameActions.restartStateGame();
        jest.clearAllTimers();
    });

    test('Game initializes correctly when started', () => {
        gameActions.beginGame();

        expect(gameState.isGameBegins).toBe(true);
        expect(gameState.isDead).toBe(false);

        const mainCharacter = gameState.gameObjects.find(
            obj => obj.constructor.name === 'MainCharacter'
        );
        expect(mainCharacter).toBeDefined();
        expect(mainCharacter.lives).toBe(3);

        jest.advanceTimersByTime(3000);
        expect(gameState.gameObjects.length).toBeGreaterThan(1);

        expect(gameState.words.length).toBeGreaterThan(0);
        expect(gameState.word).toBe(gameState.words[0]);
        expect(document.querySelector('.text').innerHTML).toContain(gameState.word);
    });

    test('Typing correct letter advances the word and removes enemy when word is complete', () => {
        gameState.words = [];
        gameState.gameObjects = [];

        gameActions.createAnEnemy();
        const initialEnemyCount = gameState.gameObjects.length;
        const initialWord = gameState.words[0];
        expect(initialWord).toBeDefined();

        const firstLetter = initialWord[0];
        document.dispatchEvent(new KeyboardEvent('keydown', { key: firstLetter }));
        expect(gameState.word).toBe(initialWord.slice(1));

        for (let i = 1; i < initialWord.length; i++) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: initialWord[i] }));
        }

        expect(gameState.word).toBe('');
        expect(gameState.words.length).toBe(0);
        expect(gameState.gameObjects.length).toBe(initialEnemyCount - 1);
    });

    test('Collision with enemy decreases lives and triggers game over after 3 collisions', () => {
        gameActions.beginGame();

        const mainChar = gameState.gameObjects.find(
            obj => obj.constructor.name === 'MainCharacter'
        );
        expect(mainChar.lives).toBe(3);

        gameActions.createAnEnemy();
        const enemy = gameState.gameObjects.find(
            obj => obj.constructor.name === 'Circle'
        );
        enemy.x = mainChar.x;
        enemy.y = mainChar.y;
        enemy.radius = mainChar.radius;

        jest.advanceTimersByTime(16);
        expect(mainChar.lives).toBe(2);
        expect(gameState.isDead).toBe(false);

        jest.advanceTimersByTime(2000);
        enemy.x = mainChar.x;
        enemy.y = mainChar.y;
        jest.advanceTimersByTime(16);
        expect(mainChar.lives).toBe(1);

        jest.advanceTimersByTime(2000);
        enemy.x = mainChar.x;
        enemy.y = mainChar.y;
        jest.advanceTimersByTime(16);
        expect(mainChar.lives).toBe(0);
        expect(gameState.isDead).toBe(true);
        expect(document.getElementById('retry').style.visibility).toBe('visible');
    });
});