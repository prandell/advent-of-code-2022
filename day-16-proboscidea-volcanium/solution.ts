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

type ValveNetwork = {
  [valve: string]: { rate: number; destinations: string[] };
};
const valveNetwork: ValveNetwork = {};
const valveIdMap: { [valve: string]: number } = {};
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const [valveDetails, destinationsRaw] = line.split(";");
  const destinations = destinationsRaw.split(",");
  const [valve, rateRaw] = valveDetails.split(",");
  const rate = parseInt(rateRaw);
  valveNetwork[valve] = { rate, destinations };
  valveIdMap[valve] = Object.keys(valveIdMap).length;
}

// ---------------------------------------------

const bfs = (
  graph: ValveNetwork,
  starting: string,
  ending: string
): string[] => {
  let queue: string[][] = [];
  let visited: string[] = [starting];

  if (starting == ending) return [starting];
  queue.push([starting]);

  while (queue.length > 0) {
    let path: string[] = queue.shift() ?? [];
    let node = path[path.length - 1];

    for (let dest of graph[node].destinations) {
      if (visited.includes(dest)) continue;

      if (dest == ending) return path.concat([dest]);
      visited.push(dest);
      queue.push(path.concat([dest]));
    }
  }

  return [];
};

const findRates = (
  distances: ValveDistances,
  valve: string,
  minutes: number,
  left: string[],
  opened: { [valve: string]: number } = {}
) => {
  let allRates: any[] = [opened];

  left.forEach((other: string, index: number) => {
    let newMinutes = minutes - distances[valve][other] - 1;
    if (newMinutes < 1) return;

    let newOpened = JSON.parse(JSON.stringify(opened));
    newOpened[other] = newMinutes;

    let newLeft = [...left];
    newLeft.splice(index, 1);

    allRates.push(
      ...findRates(distances, other, newMinutes, newLeft, newOpened)
    );
  });

  return allRates;
};

type ValveDistances = { [valveFrom: string]: { [valveTo: string]: number } };
let distances: ValveDistances = {};
Object.keys(valveNetwork).forEach((start) => {
  Object.keys(valveNetwork).forEach((end) => {
    if (distances[start] == null) distances[start] = {};
    distances[start][end] = bfs(valveNetwork, start, end).length - 1;
  });
});

let nonzeroValves = Object.keys(valveNetwork).filter(
  (valve) => valveNetwork[valve].rate != 0
);
const p1 = findRates(distances, "AA", 30, nonzeroValves)
  .map((path: any) =>
    Object.entries(path).reduce(
      (acc, [key, value]) => acc + valveNetwork[key].rate * (value as any),
      0
    )
  )
  .sort((a: any, b: any) => b - a)[0];

console.log("Part1: ", p1);

let allRates = findRates(distances, "AA", 26, nonzeroValves);

let maxScores: any = {};
allRates.forEach((rate: any) => {
  let key = Object.keys(rate).sort().join(",");
  let score = Object.entries(rate).reduce(
    (acc, [key, value]) => acc + valveNetwork[key].rate * (value as any),
    0
  );

  if (maxScores[key] == null) maxScores[key] = -Infinity;
  maxScores[key] = Math.max(score, maxScores[key]);
});

let highest = -Infinity;
Object.keys(maxScores).forEach((player) => {
  Object.keys(maxScores).forEach((elephant) => {
    let allValves = new Set();
    let playerList = player.split(",");
    playerList.forEach((valve) => allValves.add(valve));
    let elephantList = elephant.split(",");
    elephantList.forEach((valve) => allValves.add(valve));

    if (allValves.size == playerList.length + elephantList.length)
      highest = Math.max(maxScores[player] + maxScores[elephant], highest);
  });
});

console.log("Part2: ", highest);

