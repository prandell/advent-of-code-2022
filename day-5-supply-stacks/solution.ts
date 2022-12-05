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


/* Initial stacks gathered from original input file, which was then modified to:

  AMOUNT-FROM-TO

  for each line so that each value can be gathered via split
*/
const initialStacks: { [stack: number]: string[] } = {
  1: ["N", "B", "D", "T", "V", "G", "Z", "J"],
  2: ["S", "R", "M", "D", "W", "P", "F"],
  3: ["V", "C", "R", "S", "Z"],
  4: ["R", "T", "J", "Z", "P", "H", "G"],
  5: ["T", "C", "J", "N", "D", "Z", "Q", "F"],
  6: ["N", "V", "P", "W", "G", "S", "F", "M"],
  7: ["G", "C", "V", "B", "P", "Q"],
  8: ["Z", "B", "P", "N"],
  9: ["W", "P", "J"],
};

//Part 1 - popping and pushing from source to destination one at a time
for await (const line of lineReader) {
  const trimmed = line.trim();
  const [amount, from, to] = trimmed.split("-").map((s) => parseInt(s));
  for (let i = 0; i < amount; i++) {
    initialStacks[to].push(initialStacks[from].pop() as string);
  }
}
console.log("Part 1: ", initialStacks);



// Part 2 - splicing the whole amount, pushing the whole amount
const initialStacks2: { [stack: number]: string[] } = {
  1: ["N", "B", "D", "T", "V", "G", "Z", "J"],
  2: ["S", "R", "M", "D", "W", "P", "F"],
  3: ["V", "C", "R", "S", "Z"],
  4: ["R", "T", "J", "Z", "P", "H", "G"],
  5: ["T", "C", "J", "N", "D", "Z", "Q", "F"],
  6: ["N", "V", "P", "W", "G", "S", "F", "M"],
  7: ["G", "C", "V", "B", "P", "Q"],
  8: ["Z", "B", "P", "N"],
  9: ["W", "P", "J"],
};
lineReader = await getLineReader();
for await (const line of lineReader) {
  const trimmed = line.trim();
  const [amount, from, to] = trimmed.split("-").map((s) => parseInt(s));
  initialStacks2[to].push(...initialStacks2[from].splice(-amount));
}

console.log("Part 2: ", initialStacks2);


// Part 2 - pop to temp stack, pop from temp stack to destination
const initialStacks3: { [stack: number]: string[] } = {
  1: ["N", "B", "D", "T", "V", "G", "Z", "J"],
  2: ["S", "R", "M", "D", "W", "P", "F"],
  3: ["V", "C", "R", "S", "Z"],
  4: ["R", "T", "J", "Z", "P", "H", "G"],
  5: ["T", "C", "J", "N", "D", "Z", "Q", "F"],
  6: ["N", "V", "P", "W", "G", "S", "F", "M"],
  7: ["G", "C", "V", "B", "P", "Q"],
  8: ["Z", "B", "P", "N"],
  9: ["W", "P", "J"],
};
lineReader = await getLineReader();
for await (const line of lineReader) {
  const trimmed = line.trim();
  const [amount, from, to] = trimmed.split("-").map((s) => parseInt(s));
  const temp: string[] = []
  for (let i = 0; i < amount; i++) {
    const popped = initialStacks3[from].pop();
    temp.push(popped as string);
  }

  for (let i = 0; i < amount; i++) {
    const popped = temp.pop();
    initialStacks3[to].push(popped as string);
  }
}

console.log("Part 2- alt: ", initialStacks3);