import fs from "fs";
import { parse } from "path";
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
const allRockPoints: number[][] = [];
for await (const lineRaw of lineReader) {
  const rockLinePoints: Set<string> = new Set();
  const line = lineRaw.trim();
  const points = line
    .split(" -> ")
    .map((point) => point.split(",").map((coord) => parseInt(coord)));

  points.forEach((p) => rockLinePoints.add(JSON.stringify(p)));

  for (let i = 0; i < points.length - 1; i++) {
    const [pX, pY] = points[i];
    const [qX, qY] = points[i + 1];

    if (qX === pX) {
      let temp = Math.min(pY, qY) + 1;
      while (temp < Math.max(pY, qY)) {
        rockLinePoints.add(JSON.stringify([qX, temp]));
        temp++;
      }
    }

    if (qY === pY) {
      let temp = Math.min(pX, qX) + 1;
      while (temp < Math.max(pX, qX)) {
        rockLinePoints.add(JSON.stringify([temp, qY]));
        temp++;
      }
    }
  }

  allRockPoints.push(...Array.from(rockLinePoints).map((p) => JSON.parse(p)));
}

const [xMax, yMax] = allRockPoints.reduce(
  (max: number[], point: number[]) => {
    return [Math.max(max[0], point[0]), Math.max(max[1], point[1])];
  },
  [0, 0]
);
const grid = new Array(yMax + 1); // create an empty array of length n
for (let i = 0; i < yMax + 1; i++) {
  grid[i] = new Array(xMax + 1).fill("."); // make each element an array
}
allRockPoints.forEach((p) => {
  const [x, y] = p;
  try {
    grid[y][x] = "#";
  } catch (e) {
    console.log(x, y);
  }
});

let intoAbyss = false;
let sandCount = 0;
const sandPoint = [500, 0];
while (!intoAbyss) {
  let blocked = false;
  let pos = Array.from(sandPoint);
  while (!blocked) {
    const [x, y] = pos;
    try {
      if (grid[y + 1][x] === ".") {
        pos = [x, y + 1];
      } else if (grid[y + 1][x - 1] === ".") {
        pos = [x - 1, y + 1];
      } else if (grid[y + 1][x + 1] === ".") {
        pos = [x + 1, y + 1];
      } else {
        blocked = true;
      }
    } catch (e) {
      intoAbyss = true;
      console.log("Part 1: ");
      console.log(sandCount);
      break;
    }
  }
  const [x, y] = pos;
  grid[y][x] = "o";
  sandCount++;
}

///// ------- Part 2
const grid2 = new Array(yMax + 3); // create an empty array of length n
for (let i = 0; i < yMax + 2; i++) {
  grid2[i] = new Array(xMax * 2).fill("."); // make each element an array
}
grid2[yMax + 2] = new Array(xMax * 2).fill("#");
allRockPoints.forEach((p) => {
  const [x, y] = p;
  try {
    grid2[y][x] = "#";
  } catch (e) {
    console.log(x, y);
  }
});

sandCount = 0;
let filledHole = false;
while (!filledHole) {
  let blocked = false;
  let pos = Array.from(sandPoint);
  while (!blocked) {
    const [x, y] = pos;
    if (grid2[y + 1][x] === ".") {
      pos = [x, y + 1];
    } else if (grid2[y + 1][x - 1] === ".") {
      pos = [x - 1, y + 1];
    } else if (grid2[y + 1][x + 1] === ".") {
      pos = [x + 1, y + 1];
    } else {
      blocked = true;
    }
  }
  if (String(pos) == String(sandPoint)) {
    sandCount++;
    filledHole = true;
    console.log("Part 2: ");
    console.log(sandCount);
    break;
  }
  const [x, y] = pos;
  grid2[y][x] = "o";
  sandCount++;
}
