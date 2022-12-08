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
const grid = [];
let lineReader = await getLineReader();

for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  grid.push(line.split("").map((h) => parseInt(h)));
}

let visible = 0;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    let canSeeLeft = true;
    let canSeeRight = true;
    let canSeeUp = true;
    let canSeeDown = true;

    for (let k = j - 1; k >= 0; k--) {
      if (grid[i][k] >= grid[i][j]) {
        canSeeLeft = false;
        break;
      }
    }

    for (let k = j + 1; k < grid[i].length; k++) {
      if (grid[i][k] >= grid[i][j]) {
        canSeeRight = false;
        break;
      }
    }

    for (let k = i - 1; k >= 0; k--) {
      if (grid[k][j] >= grid[i][j]) {
        canSeeUp = false;
        break;
      }
    }

    for (let k = i + 1; k < grid.length; k++) {
      if (grid[k][j] >= grid[i][j]) {
        canSeeDown = false;
        break;
      }
    }

    if (canSeeDown || canSeeLeft || canSeeRight || canSeeUp) {
      visible++;
    }
  }
}

console.log("Part 1: ", visible);

///// ------- Part 2

visible = 0;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    let sceneScoreLeft = 0;
    let sceneScoreRight = 0;
    let sceneScoreUp = 0;
    let sceneScoreDown = 0;

    for (let k = j - 1; k >= 0; k--) {
      sceneScoreLeft++;
      if (grid[i][k] >= grid[i][j]) {
        break;
      }
    }

    for (let k = j + 1; k < grid[i].length; k++) {
      sceneScoreRight++;
      if (grid[i][k] >= grid[i][j]) {
        break;
      }
    }

    for (let k = i - 1; k >= 0; k--) {
      sceneScoreUp++;
      if (grid[k][j] >= grid[i][j]) {
        break;
      }
    }

    for (let k = i + 1; k < grid.length; k++) {
      sceneScoreDown++;
      if (grid[k][j] >= grid[i][j]) {
        break;
      }
    }

    visible = Math.max(visible, sceneScoreDown * sceneScoreLeft * sceneScoreRight * sceneScoreUp)
  }
}

console.log("Part 2: ", visible);
