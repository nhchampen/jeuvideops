// Clean functional tests - only test the math and physics functions
import * as math from '../src/math.js';
import * as physics from '../src/physics.js';
import { vec3_create } from '../src/vec3.js';
import { box3_create, box3_overlapsBox } from '../src/box3.js';

describe('Two Ships - Functional Tests', () => {

  describe('Game Math Functions', () => {
    test('randFloatSpread returns number within range', () => {
      const result = math.randFloatSpread(1);
      expect(result).toBeGreaterThanOrEqual(-1);
      expect(result).toBeLessThanOrEqual(1);
    });

    test('maplinear maps values correctly', () => {
      const result = math.maplinear(1, 2, 3, 4, 5);
      expect(result).toBe(3);
    });

    test('lerp interpolates correctly', () => {
      const result = math.lerp(1, 3, 20);
      expect(result).toBe(41);
    });
  });

  describe('Physics System', () => {
    test('Physics bodies system exists', () => {
      expect(typeof physics.physics_bodies).toBe('function');
    });

    test('Body types are defined correctly', () => {
      expect(physics.BODY_DYNAMIC).toBe(2);
      expect(physics.BODY_STATIC).toBe(1);
      expect(physics.BODY_BULLET).toBe(4);
    });

    test('Swept AABB collision exists', () => {
      expect(typeof physics.sweptAABB).toBe('function');
    });
  });

  describe('Vector Math', () => {
    test('Vector creation works', () => {
      const vec = vec3_create();
      expect(vec).toBeDefined();
    });
  });

  describe('Collision Detection', () => {
    test('Box overlap detection exists', () => {
      expect(typeof box3_overlapsBox).toBe('function');
    });

    test('Box creation works', () => {
      const box = box3_create();
      expect(box).toBeDefined();
    });
  });
});