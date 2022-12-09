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

const getMoveChange = (move: string): number[] => {
  switch (move) {
    case "R": {
      return [1, 0];
    }
    case "L": {
      return [-1, 0];
    }
    case "U": {
      return [0, 1];
    }
    case "D": {
      return [0, -1];
    }
    default: {
      return [];
    }
  }
};

const alterSMove = (HPos: number[], Spos: number[]) => {
  let [Hx, Hy] = HPos;
  let [Sx, Sy] = Spos;
  while (Math.abs(Sx - Hx) > 1 || Math.abs(Sy - Hy) > 1) {
    if (Math.abs(Sx - Hx) > 0) {
      Sx += Hx > Sx ? 1 : -1;
    }
    if (Math.abs(Sy - Hy) > 0) {
      Sy += Hy > Sy ? 1 : -1;
    }
  }
  return [Sx, Sy];
};

let positionsVisited = new Set();
let HPos = [0, 0];
let SPos = [0, 0];
positionsVisited.add(String(HPos));
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const [direction, rawTimes] = line.split(" ");
  const times = parseInt(rawTimes);
  for (let i = 0; i < times; i++) {
    const [x, y] = getMoveChange(direction);
    HPos[0] += x;
    HPos[1] += y;
    SPos = alterSMove(HPos, SPos);
    positionsVisited.add(String(SPos));
  }
}

console.log("Part 1: ", Array.from(positionsVisited).length);

///// ------- Part 2

lineReader = await getLineReader();
positionsVisited = new Set();
const rope = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const [direction, rawTimes] = line.split(" ");
  const times = parseInt(rawTimes);
  for (let i = 0; i < times; i++) {
    const [x, y] = getMoveChange(direction);
    HPos = rope[0];
    HPos[0] += x;
    HPos[1] += y;
    for (let j = 1; j < rope.length; j++) {
      rope[j] = alterSMove(rope[j - 1], rope[j]);
    }
    positionsVisited.add(String(rope[rope.length - 1]));
  }
}

console.log("Part 2: ", Array.from(positionsVisited).length);
