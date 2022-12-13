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

const comparePackets = (a: any, b: any): number => {
  if (Number.isInteger(a) && Number.isInteger(b)) {
    return a - b;
  } else if (Number.isInteger(a) && Array.isArray(b)) {
    a = [a];
  } else if (Array.isArray(a) && Number.isInteger(b)) {
    b = [b];
  }
  for (let i = 0; i < a.length; i++) {
    if (i >= b.length) {
      return 1;
    } else {
      const result = comparePackets(a[i], b[i]);
      if (result !== 0) {
        return result;
      }
    }
  }
  if (a.length === b.length) {
    return 0;
  } else {
    return -1;
  }
};

let lineReader = await getLineReader();
const allPackets: any[] = [];
let numRows = 0;
for await (const lineRaw of lineReader) {
  numRows++;
  const line = lineRaw.trim();
  if (line) {
    allPackets.push(JSON.parse(line));
  }
}
let sum = 0;
let packetIndex = 0;
for (let i = 0; i < allPackets.length; i += 2) {
  packetIndex++;
  const p1 = allPackets[i];
  const p2 = allPackets[i + 1];
  const result = comparePackets(p1, p2);
  if (result < 0) {
    sum += packetIndex;
  }
}

const divider1 = [[2]];
const divider2 = [[6]];

allPackets.push(divider1, divider2);
allPackets.sort(comparePackets);
const indexOfDivider1 = allPackets.indexOf(divider1) + 1;
const indexOfDivider2 = allPackets.indexOf(divider2) + 1;

console.log(`sum of correctly ordered pairs: ${sum}`);
console.log(`decoder key: ${indexOfDivider1 * indexOfDivider2}`);
