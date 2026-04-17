import * as math from '../src/math.js';

describe('Two Ships Passing In The Night - Math Functions', () => {
  
  // Test 1
  test('randFloatSpread(1) should be <= 1', () => {
    const result = math.randFloatSpread(1);
    expect(result).toBeLessThanOrEqual(1);
  });

  // Test 2
  test('randFloatSpread(1) should be >= -1', () => {
    const result = math.randFloatSpread(1);
    expect(result).toBeGreaterThanOrEqual(-1);
  });

  // Test 3
  test('maplinear(1,2,3,4,5) should return 3', () => {
    const result = math.maplinear(1, 2, 3, 4, 5);
    expect(result).toBe(3);
  });

  // Test 4
  test('maplinear(1,20,3,40,5) should return approximately 0.882352941176471', () => {
    const result = math.maplinear(1, 20, 3, 40, 5);
    expect(result).toBeCloseTo(0.882352941176471);
  });

  // Test 5
  test('lerp(1,3,20) should return 41', () => {
    const result = math.lerp(1, 3, 20);
    expect(result).toBe(41);
  });

  // Test 6
  test('lerp(1,3,-7,2) should return -15.3', () => {
    const result = math.lerp(1, 3, -7, 2);
    expect(result).toBeCloseTo(-15.3);
  });
});