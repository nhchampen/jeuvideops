import {
    getRandomInt,
    rectIntersect,
    circleIntersect,
    timeToString,
    generateString,
    getPosition
} from '../js/utils.js';

describe('SpaceWord Utilities', () => {
    describe('getRandomInt', () => {
        test('returns an integer between the bounds', () => {
            const val = getRandomInt(-42, 42);
            expect(val).toBeGreaterThanOrEqual(-42);
            expect(val).toBeLessThanOrEqual(42);
            expect(Number.isInteger(val)).toBe(true);
        });

        test('equal bounds returns that value', () => {
            expect(getRandomInt(42, 42)).toBe(42);
        });
    });

    describe('rectIntersect', () => {
        test('non-overlapping returns false', () => {
            expect(rectIntersect(1, 1, 2, 1, 4, 1, 1, 2)).toBe(false);
        });

        test('overlapping returns true', () => {
            expect(rectIntersect(1, 1, 5, 2, 4, 1, 1, 2)).toBe(true);
        });

        test('rectangles touching edges collide', () => {
            expect(rectIntersect(0, 0, 10, 10, 10, 0, 5, 5)).toBe(true);
        });
    });

    describe('circleIntersect', () => {
        test('non-overlapping circles return false', () => {
            expect(circleIntersect(3, 2, 1, 6, 1, 1.5)).toBe(false);
        });

        test('overlapping circles return true', () => {
            expect(circleIntersect(3, 2, 1, 3, -2, 4)).toBe(true);
        });

        test('tangent circles return true', () => {
            expect(circleIntersect(0, 0, 5, 10, 0, 5)).toBe(true);
        });
    });

    describe('timeToString', () => {
        test('123456789 ms formats correctly (as per PDF expectation)', () => {
            expect(timeToString(123456789)).toBe("17:36:78");
        });

        test('non-numeric input returns NaN string', () => {
            expect(timeToString("toto")).toBe("NaN:NaN:NaN");
        });

        // 5 Units Test
        test('zero formats as 00:00:00', () => {
            expect(timeToString(0)).toBe("00:00:00");
        });

        test('negative value formats with negative components', () => {
            const result = timeToString(-123456);
            expect(result).toMatch(/-?\d+:-?\d+:-?\d+/);
        });
    });

    describe('generateString', () => {
        test('returns string of correct length', () => {
            expect(generateString(5)).toHaveLength(5);
            expect(generateString(10)).toHaveLength(10);
        });

        test('contains only lowercase letters', () => {
            const str = generateString(50);
            expect(str).toMatch(/^[a-z]+$/);
        });
    });

    describe('getPosition', () => {
        test('calculates absolute position of an element', () => {
            // Create Simulation Of a DOM
            document.body.innerHTML = `
                <div id="parent" style="position: relative;">
                    <div id="child">Child</div>
                </div>
            `;
            const parent = document.getElementById('parent');
            const child = document.getElementById('child');

            // Offset Simulation
            Object.defineProperty(child, 'offsetLeft', { value: 50 });
            Object.defineProperty(child, 'offsetTop', { value: 30 });
            Object.defineProperty(child, 'offsetParent', { value: parent });
            Object.defineProperty(parent, 'offsetLeft', { value: 100 });
            Object.defineProperty(parent, 'offsetTop', { value: 20 });
            Object.defineProperty(parent, 'offsetParent', { value: null });

            const pos = getPosition(child);
            expect(pos.x).toBe(150); // 100 + 50
            expect(pos.y).toBe(50);  // 20 + 30
        });
    });
});