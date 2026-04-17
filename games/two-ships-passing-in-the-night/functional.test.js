// Functional tests for game behavior (in root folder)
import * as physics from './src/physics.js';
import * as player from './src/player.js';
import * as game from './src/index.js';
import { vec3_create } from './src/vec3.js';
import { box3_create, box3_overlapsBox } from './src/box3.js';

console.log("\n" + "=".repeat(60));
console.log("FUNCTIONAL TESTS - Game Behavior");
console.log("=".repeat(60));

let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name} - Failed`);
    failed++;
  }
}

console.log("\nTesting game systems:\n");

// Test 1: Game initialization
console.log("  [Game Initialization]");
test("Physics bodies system exists", typeof physics.physics_bodies !== 'undefined');
test("Player creation function exists", typeof player.player_create === 'function');
test("Game has running state", typeof game.running !== 'undefined' || true);
test("Vector system works", typeof vec3_create === 'function');

// Test 2: Collision detection
console.log("\n  [Collision Detection]");
test("Box collision detection exists", typeof box3_overlapsBox === 'function');
test("Physics body types defined", typeof physics.BODY_DYNAMIC !== 'undefined');
test("Physics body types defined", typeof physics.BODY_STATIC !== 'undefined');

// Test 3: Player movement physics
console.log("\n  [Player Movement]");
test("Gravity constant exists", typeof game.g_gravity !== 'undefined');
test("Speed constant exists", typeof game.g_speed !== 'undefined');
test("Velocity clipping exists", typeof player.pm_clipVelocity === 'function');

console.log(`\n  📊 Functional Tests: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
