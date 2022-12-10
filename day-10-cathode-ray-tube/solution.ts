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

let X = 1;
let cycle = 0;

let cyclesInterestedIn = [20, 60, 100, 140, 180, 220];
let signalStrengths = [];
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const [command, amountRaw] = line.split(" ");
  const amount = parseInt(amountRaw);
  if (command === "noop") {
    cycle++;
    if (cyclesInterestedIn.includes(cycle)) {
      // console.log(X, " ", cycle);
      signalStrengths.push(cycle * X);
    }
    continue;
  }

  if (command === "addx") {
    cycle += 1;
    if (cyclesInterestedIn.includes(cycle)) {
      // console.log(X, " ", cycle);
      signalStrengths.push(cycle * X);
    }
    cycle += 1;
    if (cyclesInterestedIn.includes(cycle)) {
      // console.log(X, " ", cycle);
      signalStrengths.push(cycle * X);
    }
    X += amount;
    continue;
  }
}
// console.log("cycle ", cycle);
// console.log("X ", X);
console.log(signalStrengths);

console.log(
  "Part 1: ",
  signalStrengths.reduce((sum: number, strength: number) => {
    return sum + strength;
  }, 0)
);

///// ------- Part 2

lineReader = await getLineReader();

let pos = 1;
cycle = 0;
let picture = "";

const drawPos = () => {
  picture += Math.abs((cycle % 40) - pos) <= 1 ? "#" : ".";
  cycle++;
  if (cycle % 40 == 0) picture += "\n";
};

for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const [command, amountRaw] = line.split(" ");
  const amount = parseInt(amountRaw);

  if (command === "noop") {
    drawPos();
    continue;
  }

  if (command === "addx") {
    drawPos();
    drawPos();
    pos += amount;
    continue;
  }
}

console.log(picture);
