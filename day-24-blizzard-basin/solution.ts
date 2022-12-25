import fs from "fs";
import { posix } from "path";
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

type BlizzardDirection = ">" | "<" | "^" | "v";
type BlizzardPosition = { pos: [number, number]; direction: BlizzardDirection };
let blizzardPositions: BlizzardPosition[] = [];
const grid: string[][] = [];
let wallPositions: [number, number][] = [];
let y = 0;
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const row = line.split("");
  grid.push(row);
  for (const [x, dir] of row.entries()) {
    if ([">", "<", "^", "v"].includes(dir)) {
      blizzardPositions.push({
        pos: [y, x],
        direction: dir as BlizzardDirection,
      });
    } else if (dir === "#") {
      wallPositions.push([y, x]);
    }
  }
  y++;
}

const startPos = [0, grid[0].indexOf(".")];
const endPos = [grid.length - 1, grid[grid.length - 1].indexOf(".")];

const xBounds = [grid[1].indexOf("#") + 1, grid[1].lastIndexOf("#") - 1];
const yBounds = [1, grid.length - 2];
const numBlizStates =
  (xBounds[1] - xBounds[0] + 1) * (yBounds[1] - yBounds[0] + 1);
// console.log(xBounds, yBounds);
// console.log(startPos, endPos);

const getNewBlizzardPosition = (
  x: number,
  y: number,
  direction: BlizzardDirection
): [number, number] => {
  switch (direction) {
    case ">":
      if (x + 1 > xBounds[1]) {
        return [y, xBounds[0]];
      }
      return [y, x + 1];
    case "<":
      if (x - 1 < xBounds[0]) {
        return [y, xBounds[1]];
      }
      return [y, x - 1];
    case "^":
      if (y - 1 < yBounds[0]) {
        return [yBounds[1], x];
      }
      return [y - 1, x];
    case "v":
      if (y + 1 > yBounds[1]) {
        return [yBounds[0], x];
      }
      return [y + 1, x];
  }
};

const generateNextBlizzardPositions = (
  blizzardPositions: BlizzardPosition[]
) => {
  let tempBlizzardPositions: BlizzardPosition[] = [];
  for (const curPos of blizzardPositions) {
    const { pos, direction } = curPos;
    const [y, x] = pos;
    const newPos = getNewBlizzardPosition(
      x,
      y,
      direction as ">" | "<" | "^" | "v"
    );
    tempBlizzardPositions.push({ pos: newPos, direction });
  }
  return tempBlizzardPositions;
};

const generateAllBlizzardStates = (blizzardPositions: BlizzardPosition[]) => {
  let allBlizStates: Set<string>[] = [];
  let blizPoz = [...blizzardPositions];
  for (let i = 0; i <= numBlizStates; i++) {
    allBlizStates[i] = blizPoz.reduce((set, blizzard) => {
      set.add(String(blizzard.pos));
      return set;
    }, new Set<string>());

    blizPoz = generateNextBlizzardPositions(blizPoz);
  }
  return allBlizStates;
};

const manhattanDistance = (pos1: number[], pos2: number[]) => {
  const [x0, y0] = pos1;
  const [x1, y1] = pos2;
  return Math.abs(x1 - x0) + Math.abs(y1 - y0);
};

const bfs = (
  allBlizzardStates: Set<string>[],
  starting: number[],
  ending: number[],
  startingMoves: number
): number => {
  let queue: any[][] = [];
  let visited: Set<string> = new Set(`${String(starting)},${startingMoves}`);

  queue.push([starting, startingMoves]);

  let ans = 0;
  while (queue.length > 0) {
    let [pos, moves] = queue.shift() ?? [];

    if (String(pos) === String(ending)) {
      ans = moves - startingMoves;
      break;
    }
    // console.log(moves);
    const [y, x] = pos;

    for (const move of [
      [y + 1, x],
      [y - 1, x],
      [y, x + 1],
      [y, x - 1],
      [y, x],
    ]) {
      const [ny, nx] = move;
      if (String(move) === String(ending)) {
        ans = moves + 1 - startingMoves;
        queue.push([move, moves + 1]);
        break;
      }
      if (String(move) === String(starting)) {
        visited.add(`${String(move)},${moves + 1}`);
        queue.push([move, moves + 1]);
        continue;
      }
      if (
        nx < xBounds[0] ||
        nx > xBounds[1] ||
        ny < yBounds[0] ||
        ny > yBounds[1] ||
        allBlizzardStates[(moves + 1) % numBlizStates].has(String(move)) ||
        visited.has(`${String(move)},${moves + 1}`) ||
        grid[ny][nx] == "#"
      ) {
        continue;
      }
      visited.add(`${String(move)},${moves + 1}`);
      queue.push([move, moves + 1]);
    }
    queue.sort(
      (a, b) =>
        manhattanDistance(a[0], ending) * a[2] -
        manhattanDistance(b[0], ending) * b[2]
    );
  }

  return ans;
};

const blizStates = generateAllBlizzardStates(blizzardPositions);
console.log("Part 1:", bfs(blizStates, startPos, endPos, 0));
let p2 = 0;
for (let trip = 1; trip <= 3; trip++) {
  p2 += bfs(
    blizStates,
    trip % 2 === 1 ? startPos : endPos,
    trip % 2 === 1 ? endPos : startPos,
    p2
  );
}
console.log("Part 2:", p2);
