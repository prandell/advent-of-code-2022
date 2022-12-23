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

const cubes: number[][] = [];
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  cubes.push(line.split(",").map(Number));
}

const sum = (a: number, b: number): number => a + b;

const cubeSet = new Set(cubes.map((cube) => cube.toString()));

const p1 = cubes
  .map((cube) => {
    return [
      cubeSet.has([cube[0] + 1, cube[1], cube[2]].toString()) ? 0 : 1,
      cubeSet.has([cube[0] - 1, cube[1], cube[2]].toString()) ? 0 : 1,
      cubeSet.has([cube[0], cube[1] + 1, cube[2]].toString()) ? 0 : 1,
      cubeSet.has([cube[0], cube[1] - 1, cube[2]].toString()) ? 0 : 1,
      cubeSet.has([cube[0], cube[1], cube[2] + 1].toString()) ? 0 : 1,
      cubeSet.has([cube[0], cube[1], cube[2] - 1].toString()) ? 0 : 1,
    ].reduce(sum);
  })
  .reduce(sum);

console.log("Part 1", p1);

const getAdjacents = (cube: number[]): number[][] => {
  return [
    [cube[0] + 1, cube[1], cube[2]],
    [cube[0] - 1, cube[1], cube[2]],
    [cube[0], cube[1] + 1, cube[2]],
    [cube[0], cube[1] - 1, cube[2]],
    [cube[0], cube[1], cube[2] + 1],
    [cube[0], cube[1], cube[2] - 1],
  ];
};

const getWaterCubes = (
  minPos: number[],
  maxPos: number[],
  cubes: Set<string>
): Set<string> => {
  const visited = new Set<string>();
  const toVisit = [maxPos];

  let curr;
  while ((curr = toVisit.shift())) {
    if (visited.has(curr.toString())) continue;

    const worthItAdj = getAdjacents(curr).filter(
      (neighbour) =>
        !visited.has(neighbour.toString()) &&
        !cubes.has(neighbour.toString()) &&
        neighbour[0] >= minPos[0] - 1 &&
        neighbour[1] >= minPos[1] - 1 &&
        neighbour[2] >= minPos[2] - 1 &&
        neighbour[0] <= maxPos[0] + 1 &&
        neighbour[1] <= maxPos[1] + 1 &&
        neighbour[2] <= maxPos[2] + 1
    );

    toVisit.push(...worthItAdj);

    visited.add(curr.toString());
  }

  return visited;
};

const minPos = cubes.reduce((minPos, curr) => {
  return [
    Math.min(minPos[0], curr[0]),
    Math.min(minPos[1], curr[1]),
    Math.min(minPos[2], curr[2]),
  ];
}, cubes[0]);
const maxPos = cubes.reduce((maxPos, curr) => {
  return [
    Math.max(maxPos[0], curr[0]),
    Math.max(maxPos[1], curr[1]),
    Math.max(maxPos[2], curr[2]),
  ];
}, cubes[0]);

const waterCubes = getWaterCubes(minPos, maxPos, cubeSet);

const p2 = cubes
  .map((cube) => {
    const waterNeighbours = getAdjacents(cube).filter((neighbour) =>
      waterCubes.has(neighbour.toString())
    );
    return waterNeighbours.length;
  })
  .reduce(sum);

console.log("Part 2", p2);
