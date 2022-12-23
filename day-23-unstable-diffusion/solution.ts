import fs from "fs";
import readline from "readline";

async function getLineReader() {
  const fileStream = fs.createReadStream("input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  return rl;
}

let lineReader = await getLineReader();

let elfPositions: { [curPos: string]: string } = {};
let y = 0;
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const row = line.split("");
  for (const [x, pos] of row.entries()) {
    if (pos === "#") elfPositions[String([y, x])] = String([y, x]);
  }
  y++;
}

console.log(Object.keys(elfPositions).length);

const arrayRotate = (arr: Array<"N" | "S" | "W" | "E">, reverse: boolean) => {
  if (reverse) arr.unshift(arr.pop() as "N" | "S" | "W" | "E");
  else arr.push(arr.shift() as "N" | "S" | "W" | "E");
  return arr;
};

const hasNeighbours = (x: number, y: number) => {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i === x && j === y) continue;
      if (elfPositions[String([j, i])]) {
        return true;
      }
    }
  }
  return false;
};

const getNewPosition = (
  x: number,
  y: number,
  directions: Array<"N" | "S" | "W" | "E">
) => {
  if (hasNeighbours(x, y)) {
    for (const dir of directions) {
      switch (dir) {
        case "N":
          if (
            !elfPositions[String([y - 1, x - 1])] &&
            !elfPositions[String([y - 1, x])] &&
            !elfPositions[String([y - 1, x + 1])]
          ) {
            return [y - 1, x];
          } else {
            continue;
          }
        case "S":
          if (
            !elfPositions[String([y + 1, x - 1])] &&
            !elfPositions[String([y + 1, x])] &&
            !elfPositions[String([y + 1, x + 1])]
          ) {
            return [y + 1, x];
          } else {
            continue;
          }
        case "W":
          if (
            !elfPositions[String([y - 1, x - 1])] &&
            !elfPositions[String([y, x - 1])] &&
            !elfPositions[String([y + 1, x - 1])]
          ) {
            return [y, x - 1];
          } else {
            continue;
          }
        case "E":
          if (
            !elfPositions[String([y - 1, x + 1])] &&
            !elfPositions[String([y, x + 1])] &&
            !elfPositions[String([y + 1, x + 1])]
          ) {
            return [y, x + 1];
          } else {
            continue;
          }
      }
    }
    return [y, x];
  } else {
    return [y, x];
  }
};

// LOGIC
let directions: Array<"N" | "S" | "W" | "E"> = ["N", "S", "W", "E"];
let elfMoved = true;
let tempElfPositions: { [curPos: string]: string } = {};
let round10Positions: number[][] = [];
let round = 0;
while (elfMoved) {
  if (round === 10) {
    round10Positions = Object.keys(elfPositions).map((p) =>
      p.split(",").map((i) => parseInt(i))
    );
  }
  console.log(round, directions);
  let roundElfMoved = false;
  for (const oldPos of Object.keys(elfPositions)) {
    const [y, x] = oldPos.split(",").map((i) => parseInt(i));
    const newPos = String(getNewPosition(x, y, directions));
    if (newPos !== oldPos) roundElfMoved = true;
    tempElfPositions[oldPos] = newPos;
  }

  for (const oldPos1 of Object.keys(tempElfPositions)) {
    for (const oldPos2 of Object.keys(tempElfPositions)) {
      if (
        tempElfPositions[oldPos1] === tempElfPositions[oldPos2] &&
        oldPos1 !== oldPos2
      ) {
        tempElfPositions[oldPos1] = oldPos1;
        tempElfPositions[oldPos2] = oldPos2;
      }
    }
  }
  directions = arrayRotate(directions, false);
  elfPositions = Object.values(tempElfPositions).reduce(
    (te: { [curPos: string]: string }, pos) => {
      te[pos] = "true";
      return te;
    },
    {}
  );
  tempElfPositions = {};
  elfMoved = roundElfMoved;
  round++;
}

let firstElfRow = Math.min(...round10Positions.map((p) => p[0]));
let firstElfColumn = Math.min(...round10Positions.map((p) => p[1]));
let lastElfRow = Math.max(...round10Positions.map((p) => p[0]));
let lastElfColumn = Math.max(...round10Positions.map((p) => p[1]));

const gridDims = [
  lastElfRow - firstElfRow + 1,
  lastElfColumn - firstElfColumn + 1,
];
// console.log(firstElfRow, firstElfColumn, lastElfRow, lastElfColumn);
// console.log(gridDims);

const numTiles = gridDims[0] * gridDims[1] - round10Positions.length;

console.log("Part 1: ", numTiles);
console.log("Part 2:", round);
