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

const heightMap = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .reduce((dict: { [char: string]: number }, char: string, ind: number) => {
    dict[char] = ind;
    return dict;
  }, {});

let lineReader = await getLineReader();
const grid: string[][] = [];
let numRows = 0;
for await (const lineRaw of lineReader) {
  numRows++;
  const line = lineRaw.trim();
  grid.push(line.split(""));
}

const allAs: number[][] = [];
let start: number[] = [];
let end: number[] = [];
for (const [i, row] of grid.entries()) {
  for (const [j, char] of row.entries()) {
    if (char === "S") {
      start = [i, j];
      allAs.push([i, j]);
      grid[i][j] = "a";
    } else if (char === "E") {
      end = [i, j];
      grid[i][j] = "z";
    } else if (char === "a") {
      allAs.push([i, j]);
    }
  }
}

const gridXLim = grid.length;
const gridYLim = grid[0].length;

///solution
const getAdj = (pos: number[]) => {
  const [posX, posY] = pos;
  const response = [];
  if (posX !== 0) {
    response.push([posX - 1, posY]);
  }
  if (posX !== gridXLim - 1) {
    response.push([posX + 1, posY]);
  }
  if (posY !== 0) {
    response.push([posX, posY - 1]);
  }
  if (posY !== gridYLim - 1) {
    response.push([posX, posY + 1]);
  }
  return response;
};

const bfs = (grid: string[][], starts: number[][]): number | undefined => {
  const visited: Set<string> = new Set();
  const queue: number[][] = starts.map((s) => [...s, 0]);
  while (queue.length) {
    const [x, y, distance] = queue.shift() ?? [0, 0, 0];
    const elevation = grid[x][y];
    if (String([x, y]) == String(end)) {
      return distance;
    }
    if (visited.has(String([x, y]))) {
      continue;
    }
    visited.add(String([x, y]));
    let res = undefined;
    for (let adj of getAdj([x, y])) {
      const adjElevation = grid[adj[0]][adj[1]];
      if (heightMap[adjElevation] - 1 <= heightMap[elevation]) {
        queue.push([...adj, distance + 1]);
        // res = bfs(grid, adj, newVisited, moves + 1);
      }
    }
  }
  return 99999999999999;
};

let visited: Set<string> = new Set();
const result = bfs(grid, [start]);
console.log("Part 1: ");
console.log(result);

///// ------- Part 2

console.log("Part 2: ");
const result2 = bfs(grid, allAs);
console.log(result2);
