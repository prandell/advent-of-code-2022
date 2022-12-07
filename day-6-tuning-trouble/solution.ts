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

const windowIncludesChar = (window: string[], char: string) => {
  for (const [i, win] of window.entries()) {
    if (char === win) {
      return i;
    }
  }
  return -1;
};

//Part 1 & 2, just change LENGTH
const UNIQUE_LENGTH = 4;
let window: string[] = [];
let answer = 4;
let count = 1;
for await (const line of lineReader) {
  const trimmed = line.trim();
  const chars = trimmed.split("");
  for (let i = 0; i < chars.length; i++) {
    if (window.length == UNIQUE_LENGTH) {
      answer = i;
      break;
    }
    const char = chars[i];
    const firstPosEqual = windowIncludesChar(window, char);
    if (firstPosEqual > -1) {
      window = window.splice(firstPosEqual + 1);
      window.push(char);
      continue;
    }
    if (window.length < UNIQUE_LENGTH) {
      window.push(char);
      continue;
    }
    answer = i;
    break;
  }
  //only one line
  break;
}
console.log("Part 1/2: ", answer);

