import fs from "fs";

type RockLayer = { x: number; y: number };
type Rock = Array<RockLayer>;

// ####
let rock1: Rock = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
];
// .#.
// ###
// .#.
let rock2: Rock = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
];
// ..#
// ..#
// ###
let rock3: Rock = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
];
// #
// #
// #
// #
let rock4: Rock = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 0, y: 3 },
];
// ##
// ##
let rock5: Rock = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

const pattern = fs
  .readFileSync("input.txt", "utf8")
  .toString()
  .trim()
  .split("");

let rocks = [rock1, rock2, rock3, rock4, rock5];
let settledRock = new Set();

enum CollisionType {
  ROCK = "R",
  WALL = "W",
  FLOOR = "F",
  NONE = "N",
}

const getCollisionType = (rock: Rock) => {
  for (let piece of rock) {
    if (settledRock.has(`${piece.x},${piece.y}`)) return CollisionType.ROCK;
    if (piece.y <= 0) return CollisionType.FLOOR;
    if (piece.x <= 0 || piece.x >= 8) return CollisionType.WALL;
  }
  return false;
};

const updatePosition = (rock: Rock, tallestPoint: number) => {
  rock.forEach((piece: RockLayer) => {
    piece.y += tallestPoint + 4;
    piece.x += 3;
  });
  return rock;
};

const findTallestPoint = (rock: Rock, tallestPoint: number) => {
  for (let piece of rock) {
    tallestPoint = Math.max(tallestPoint, piece.y);
  }
  return tallestPoint;
};

let remainingPattern = [...pattern];
let tallestPoint = 0;
for (let i = 0; i < 2022; i++) {
  let rocksCopy = JSON.parse(JSON.stringify(rocks));

  let rock = rocksCopy[i % rocks.length];
  rock = updatePosition(rock, tallestPoint);

  let isFallNextMove = false;
  while (true) {
    if (isFallNextMove) {
      rock.forEach((piece: RockLayer) => {
        piece.y -= 1;
      });
      let collision = getCollisionType(rock);
      if (
        collision === CollisionType.ROCK ||
        collision === CollisionType.FLOOR
      ) {
        // Revert the fall and add the rock to the settledRock set
        rock.forEach((piece: RockLayer) => {
          piece.y += 1;
          settledRock.add(`${piece.x},${piece.y}`);
        });
        tallestPoint = findTallestPoint(rock, tallestPoint);
        break;
      }
    } else {
      let xMove = remainingPattern.shift() === ">" ? 1 : -1;
      if (remainingPattern.length === 0) remainingPattern = [...pattern];
      rock.forEach((piece: RockLayer) => {
        piece.x += xMove;
      });
      let checkCollisionResult = getCollisionType(rock);
      if (
        checkCollisionResult === CollisionType.ROCK ||
        checkCollisionResult === CollisionType.WALL
      ) {
        // Revert the move
        rock.forEach((piece: RockLayer) => {
          piece.x -= xMove;
        });
      }
    }
    isFallNextMove = !isFallNextMove;
  }
}

console.log("Part 1", tallestPoint);

remainingPattern = [...pattern];
tallestPoint = 0;
settledRock = new Set();
let i = 0;
const solve = () => {
  let rocksCopy = JSON.parse(JSON.stringify(rocks));

  let rock = rocksCopy[i++ % rocks.length];
  rock = updatePosition(rock, tallestPoint);

  let isFallNextMove = false;
  while (true) {
    if (isFallNextMove) {
      rock.forEach((piece: RockLayer) => {
        piece.y -= 1;
      });
      let checkCollisionResult = getCollisionType(rock);
      if (
        checkCollisionResult === CollisionType.ROCK ||
        checkCollisionResult === CollisionType.FLOOR
      ) {
        // Revert the fall and add the rock to the settledRock set
        rock.forEach((piece: RockLayer) => {
          piece.y += 1;
          settledRock.add(`${piece.x},${piece.y}`);
        });
        tallestPoint = findTallestPoint(rock, tallestPoint);
        break;
      }
    } else {
      let xMove = remainingPattern.shift() === ">" ? 1 : -1;
      if (remainingPattern.length === 0) remainingPattern = [...pattern];
      rock.forEach((piece: RockLayer) => {
        piece.x += xMove;
      });
      let checkCollisionResult = getCollisionType(rock);
      if (
        checkCollisionResult === CollisionType.ROCK ||
        checkCollisionResult === CollisionType.WALL
      ) {
        // Revert the move and fall
        rock.forEach((piece: RockLayer) => {
          piece.x -= xMove;
        });
      }
    }
    isFallNextMove = !isFallNextMove;
  }
  return rock;
};

// key: pattern
// value: { nextBlock, upcommingPattern, tallestPoint }
const memory = new Map();

const checkClosedPattern = (rock: Rock) => {
  let pattern = [];

  let minY = Infinity;
  let maxY = 0;

  for (let piece of rock) {
    minY = Math.min(minY, piece.y);
    maxY = Math.max(maxY, piece.y);
  }

  for (let y = minY; y <= maxY; y++)
    for (let x = 1; x <= 7; x++)
      if (settledRock.has(`${x},${y}`)) pattern.push(`x:${x}`);

  for (let y = minY; y <= maxY; y++) {
    let isInRow = true;
    for (let x = 1; x <= 7; x++) {
      if (!settledRock.has(`${x},${y}`)) {
        isInRow = false;
        break;
      }
    }
    if (isInRow) return pattern;
  }
  return false;
};

let placed = 0;
let startPoint = 0;
let startPlaced = 0;
while (true) {
  let placedRock = solve();
  placed++;
  let pattern = checkClosedPattern(placedRock);
  if (pattern) {
    if (memory.has(pattern.join(" "))) {
      let { nextBlock, upcommingPattern, tallestPointHistory, placedHistory } =
        memory.get(pattern.join(" "));
      if (
        placed % rocks.length === nextBlock &&
        upcommingPattern === remainingPattern.join("")
      ) {
        startPoint = tallestPointHistory;
        startPlaced = placedHistory;
        break;
      }
    }
    memory.set(pattern.join(" "), {
      nextBlock: placed % rocks.length,
      upcommingPattern: remainingPattern.join(""),
      tallestPointHistory: tallestPoint,
      placedHistory: placed,
    });
  }
}

let remaining = 1000000000000 - placed;
let gainedPer = tallestPoint - startPoint;
let reps = Math.floor(remaining / (placed - startPlaced));
let gained = reps * gainedPer;
let remainder = remaining % (placed - startPlaced);

for (let i = 0; i < remainder; i++) solve();

console.log("Part2", gained + tallestPoint);
