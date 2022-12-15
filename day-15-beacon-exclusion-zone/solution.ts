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

const data: number[][] = [];
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const [sensorPos, beaconPos] = line
    .split(":")
    .map((s) => s.split(",").map((c) => parseInt(c)));
  const [sx, sy] = sensorPos;
  const [bx, by] = beaconPos;
  data.push([sx, sy, bx, by]);
}

const manhattanDistance = (pos1: number[], pos2: number[]) => {
  const [x0, y0] = pos1;
  const [x1, y1] = pos2;
  return Math.abs(x1 - x0) + Math.abs(y1 - y0);
};

let targetRowBoundaries: [number, boolean][] = [];
const targetRow = 2000000;

for (const line of data) {
  const [sx, sy, bx, by] = line;

  const dist = manhattanDistance([sx, sy], [bx, by]);
  const overlapTarget = dist - Math.abs(targetRow - sy);

  if (overlapTarget >= 0) {
    //start of the range in the target row
    targetRowBoundaries.push([sx - overlapTarget, true]);
    //end of the range in the target row
    targetRowBoundaries.push([sx + overlapTarget + 1, false]);
  }
}

targetRowBoundaries.sort((a, b) => a[0] - b[0]);

let count = -1;
let openRanges = 0;
let prev = 0;

for (const [x, isStart] of targetRowBoundaries) {
  if (openRanges > 0) {
    count += x - prev;
  }

  if (isStart) {
    openRanges++;
  } else {
    openRanges--;
  }

  prev = x;
}

console.log("Part1: ", count);

function isCloser(x: number, y: number) {
  for (const line of data) {
    const [sx, sy, bx, by] = line;
    const dist1 = Math.abs(sx - bx) + Math.abs(sy - by);
    const dist2 = Math.abs(sx - x) + Math.abs(sy - y);

    if (dist2 < dist1) {
      return false;
    }
  }

  return true;
}

//Only the outer ring of every sensor is part of the search space
//Otherwise there wouldn't be a single solution
let ans = 0;
for (const line of data) {
  const [sx, sy, bx, by] = line;
  const dist = manhattanDistance([sx, sy], [bx, by]);
  for (const [xdir, ydir] of [
    [-1, 1],
    [1, 1],
    [1, -1],
    [-1, -1],
  ]) {
    for (let i = 0; i <= dist + 1; i++) {
      const dx = i;
      const dy = dist + 1 - i;
      let x = sx + dx * xdir;
      let y = sy + dy * ydir;
      if (!(x < 0 || y < 0 || x > 4000000 || y > 4000000) && isCloser(x, y)) {
        ans = x * 4000000 + y;
        break;
      }
    }
    if (ans) break;
  }
  if (ans) break;
}

console.log("Part2: ", ans);
