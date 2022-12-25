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

type SnaffuDigit = "2" | "1" | "0" | "-" | "=";
const snaffuDict = {
  "2": 2,
  "1": 1,
  "0": 0,
  "-": -1, // === -1
  "=": -2, // === -2
};

const snaffuToDecimal = (snaffu: string, base = 5) => {
  const snaffuArray = snaffu.split("");
  let decimal = 0;
  for (let i = 0; i < snaffuArray.length; i++) {
    const digit = snaffuDict[snaffuArray[i] as SnaffuDigit];
    decimal += Math.pow(base, snaffuArray.length - 1 - i) * digit;
  }
  return decimal;
};

function decimalToSnaffu(n: number): string {
  if (n === 0) return "";
  if (n % 5 === 0) return decimalToSnaffu(Math.floor(n / 5)) + "0";
  if (n % 5 === 1) return decimalToSnaffu(Math.floor(n / 5)) + "1";
  if (n % 5 === 2) return decimalToSnaffu(Math.floor(n / 5)) + "2";
  if (n % 5 === 3) return decimalToSnaffu((n + 2) / 5) + "=";
  if (n % 5 === 4) return decimalToSnaffu((n + 1) / 5) + "-";
  return "";
}
const snaffus: string[] = [];
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  snaffus.push(line);
}
const nums = snaffus.map(snaffuToDecimal);

const sum = nums.reduce((sum, decimal) => sum + decimal, 0);
console.log("Part 1", sum, decimalToSnaffu(sum));
