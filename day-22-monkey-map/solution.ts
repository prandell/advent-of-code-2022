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
const grid: string[][] = [];

let instructions: string[] = [];
let gridFinished = false;
for await (const lineRaw of lineReader) {
  const line = lineRaw;
  if (!line) {
    gridFinished = true;
    continue;
  }
  if (!gridFinished) {
    if (line.length === 50) {
      grid.push([...line.split(""), ...Array(100).fill(" ")]);
    } else if (line.length === 100) {
      grid.push([...line.split(""), ...Array(50).fill(" ")]);
    } else {
      grid.push(line.split(""));
    }
  } else {
    instructions = line.split(/([RL])/g);
  }
}

// console.log(grid);
// console.log(new Set(grid.map((l) => l.length)));
// console.log(grid.length);
const checkPosition = (
  prevPos: number[],
  x: number,
  y: number,
  direction: "L" | "R" | "U" | "D"
): number[] => {
  let column = [];
  let ind;
  if (!grid[y] || grid[y][x] === " " || !grid[y][x]) {
    switch (direction) {
      case "L":
        ind = Math.max(grid[y].lastIndexOf("."), grid[y].lastIndexOf("#"));
        return checkPosition(prevPos, ind, y, direction);
      case "R":
        ind = Math.min(grid[y].indexOf("."), grid[y].indexOf("#"));
        return checkPosition(prevPos, ind, y, direction);
      case "U":
        column = grid.map((r) => r[x]);
        ind = Math.max(column.lastIndexOf("."), column.lastIndexOf("#"));
        return checkPosition(prevPos, x, ind, direction);
      case "D":
        column = grid.map((r) => r[x]);
        ind = Math.min(column.indexOf("."), column.indexOf("#"));
        return checkPosition(prevPos, x, ind, direction);
    }
  }
  if (grid[y][x] === "#") {
    return [...prevPos];
  }
  return [y, x];
};

const updatePosition = (
  pos: number[],
  direction: "L" | "R" | "U" | "D",
  moves: number
) => {
  let newPos = [...pos];
  for (let i = 0; i < moves; i++) {
    const [y, x] = newPos;
    switch (direction) {
      case "L":
        newPos = checkPosition(newPos, x - 1, y, direction);
        break;
      case "R":
        newPos = checkPosition(newPos, x + 1, y, direction);
        break;
      case "U":
        newPos = checkPosition(newPos, x, y - 1, direction);
        break;
      case "D":
        newPos = checkPosition(newPos, x, y + 1, direction);
        break;
    }
    if (x === newPos[1] && y === newPos[0]) break;
  }
  return newPos;
};

const getNewDirection = (
  curDir: "L" | "R" | "U" | "D",
  intruction: "L" | "R"
) => {
  switch (curDir) {
    case "L":
      if (intruction === "L") {
        return "D";
      } else {
        return "U";
      }
    case "R":
      if (intruction === "L") {
        return "U";
      } else {
        return "D";
      }
    case "U":
      if (intruction === "L") {
        return "L";
      } else {
        return "R";
      }
    case "D":
      if (intruction === "L") {
        return "R";
      } else {
        return "L";
      }
  }
};
const startPos = [0, grid[0].indexOf(".")];
let direction: "L" | "R" | "U" | "D" = "R";
let pos = [...startPos];
for (const instruction of instructions) {
  const num = parseInt(instruction);
  if (Number.isInteger(num)) {
    pos = updatePosition(pos, direction, num);
  } else {
    direction = getNewDirection(direction, instruction as "L" | "R");
  }
}
const getDirectionValue = (dir: "L" | "R" | "U" | "D") => {
  switch (dir) {
    case "L":
      return 2;
    case "R":
      return 0;
    case "U":
      return 3;
    case "D":
      return 1;
  }
};
console.log("------- PART 1 -------");
console.log(pos, direction);
console.log(
  (pos[0] + 1) * 1000 + 4 * (pos[1] + 1) + getDirectionValue(direction)
);

const sectionGrid: number[][] = grid.map((row: string[], y: number) => {
  return row.map((v: string, x: number) => {
    if (y < 50 && x < 100 && x >= 50) {
      return 1;
    }
    if (y < 50 && x >= 100) {
      return 2;
    }
    if (y >= 50 && y < 100 && x < 100 && x >= 50) {
      return 3;
    }
    if (y >= 100 && y < 150 && x < 50 && x >= 0) {
      return 4;
    }
    if (y >= 100 && y < 150 && x < 100 && x >= 50) {
      return 5;
    }
    if (y >= 150 && x < 50 && x >= 0) {
      return 6;
    }
    return 0;
  });
});

const sectionDirectionMap: { [section: number]: { [dir: string]: any[] } } = {
  1: {
    U: [6, "R", (y: number, x: number) => [100 + x, 0]],
    D: [3, "D", (y: number, x: number) => [y + 1, x]],
    L: [4, "R", (y: number, x: number) => [149 - y, 0]],
    R: [2, "R", (y: number, x: number) => [y, x + 1]],
  },
  2: {
    U: [6, "U", (y: number, x: number) => [199, x - 100]],
    D: [3, "L", (y: number, x: number) => [x - 50, 99]],
    L: [1, "L", (y: number, x: number) => [y, x - 1]],
    R: [5, "L", (y: number, x: number) => [149 - y, 99]],
  },
  3: {
    U: [1, "U", (y: number, x: number) => [y - 1, x]],
    D: [5, "D", (y: number, x: number) => [y + 1, x]],
    L: [4, "D", (y: number, x: number) => [100, y - 50]],
    R: [2, "U", (y: number, x: number) => [49, y + 50]],
  },
  4: {
    U: [3, "R", (y: number, x: number) => [x + 50, 50]],
    D: [6, "D", (y: number, x: number) => [y + 1, x]],
    L: [1, "R", (y: number, x: number) => [149 - y, 50]],
    R: [5, "R", (y: number, x: number) => [y, x + 1]],
  },
  5: {
    U: [3, "U", (y: number, x: number) => [y - 1, x]],
    D: [6, "L", (y: number, x: number) => [x + 100, 49]],
    L: [4, "L", (y: number, x: number) => [y, x - 1]],
    R: [2, "L", (y: number, x: number) => [149 - y, 149]],
  },
  6: {
    U: [4, "U", (y: number, x: number) => [y - 1, x]],
    D: [2, "D", (y: number, x: number) => [0, x + 100]],
    L: [1, "D", (y: number, x: number) => [0, y - 100]],
    R: [5, "U", (y: number, x: number) => [149, y - 100]],
  },
};

const checkPosition3D = (
  prevPos: number[],
  prevDirection: "L" | "R" | "U" | "D",
  x: number,
  y: number,
  direction: "L" | "R" | "U" | "D"
): any[] => {
  if (!grid[y] || !sectionGrid[y][x]) {
    const [py, px] = prevPos;
    const curSection = sectionGrid[py][px];
    const [_, newDir, newPosFunc] = sectionDirectionMap[curSection][direction];
    const tmpPos = newPosFunc(py, px);
    if (prevDirection !== direction) {
      console.log(curSection, prevPos, direction, "---->", tmpPos);
    }
    return checkPosition3D(
      prevPos,
      prevDirection,
      tmpPos[1],
      tmpPos[0],
      newDir
    );
  }
  if (grid[y][x] === "#") {
    return [prevDirection, [...prevPos]];
  }
  return [direction, [y, x]];
};

const updatePosition3D = (
  pos: number[],
  direction: "L" | "R" | "U" | "D",
  moves: number
) => {
  let newPos = [...pos];
  let newDirection = direction;
  let res: any[] = [];
  for (let i = 0; i < moves; i++) {
    const [y, x] = newPos;
    switch (newDirection) {
      case "L":
        res = checkPosition3D(newPos, newDirection, x - 1, y, newDirection);
        break;
      case "R":
        res = checkPosition3D(newPos, newDirection, x + 1, y, newDirection);
        break;
      case "U":
        res = checkPosition3D(newPos, newDirection, x, y - 1, newDirection);
        break;
      case "D":
        res = checkPosition3D(newPos, newDirection, x, y + 1, newDirection);
        break;
    }
    newDirection = res[0];
    newPos = res[1];
    if (x === newPos[1] && y === newPos[0]) break;
  }
  return [newDirection, newPos];
};

direction = "R";
pos = [...startPos];
for (const instruction of instructions) {
  const num = parseInt(instruction);
  if (Number.isInteger(num)) {
    const res = updatePosition3D(pos, direction, num);
    direction = res[0] as "L" | "R" | "U" | "D";
    pos = res[1] as number[];
    if (!grid[pos[0]][pos[1]]) {
      console.log(pos);
      break;
    }
  } else {
    direction = getNewDirection(direction, instruction as "L" | "R");
  }
}
console.log("------- PART 2-------");
console.log(pos, direction);
console.log(
  (pos[0] + 1) * 1000 + 4 * (pos[1] + 1) + getDirectionValue(direction)
);
