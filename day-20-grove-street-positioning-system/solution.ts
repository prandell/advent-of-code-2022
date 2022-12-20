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
const encrypted: { val: number }[] = [];
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();

  encrypted.push({ val: parseInt(line) });
}
const mix = (input: { val: number }[], times: number) => {
  const mixed = [...input];
  for (let i = 0; i < times; i++) {
    for (const number of input) {
      const mixedIndex = mixed.indexOf(number);
      mixed.splice(mixedIndex, 1);
      const newIndex = (mixedIndex + number.val) % mixed.length;
      if (newIndex === 0) {
        mixed.push(number);
      } else {
        mixed.splice(newIndex, 0, number);
      }
    }
  }
  return mixed;
};

const getAns = (mixed: { val: number }[]) => {
  const theZeroIndex = mixed.findIndex(({ val }) => val === 0);
  return (
    mixed[(theZeroIndex + 1000) % mixed.length].val +
    mixed[(theZeroIndex + 2000) % mixed.length].val +
    mixed[(theZeroIndex + 3000) % mixed.length].val
  ).toString();
};

const copy = [...encrypted];
for (const number of encrypted) {
  const mixedIndex = copy.indexOf(number);
  copy.splice(mixedIndex, 1);
  const newIndex = (mixedIndex + number.val) % copy.length;
  if (newIndex === 0) {
    copy.push(number);
  } else {
    copy.splice(newIndex, 0, number);
  }
}
console.log("Part1: ", getAns(copy));

const decryptKey = 811589153;
const realEncrypted = encrypted.map(({ val }) => ({ val: val * decryptKey }));
const copy2 = [...realEncrypted];
for (let i = 0; i < 10; i++) {
  for (const number of realEncrypted) {
    const mixedIndex = copy2.indexOf(number);
    copy2.splice(mixedIndex, 1);
    const newIndex = (mixedIndex + number.val) % copy2.length;
    if (newIndex === 0) {
      copy2.push(number);
    } else {
      copy2.splice(newIndex, 0, number);
    }
  }
}

console.log("Part2: ", getAns(copy2));
