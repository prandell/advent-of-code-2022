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

const fileSizes: { [path: string]: number } = {};
const dirsPath = new Set();
let path: string[] = [];

for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();

  if (line === "$ cd /") continue;
  if (line === "$ ls") continue;

  if (line === "$ cd ..") {
    path.pop();
    continue;
  }

  if (line.startsWith("$ cd ")) {
    const [dollar, cd, dir] = line.split(" ");
    path.push(dir);
    continue;
  }

  const [sizeOrDir, name] = line.split(" ");
  if (sizeOrDir === "dir") {
    dirsPath.add(String([...path, name]));
  } else {
    fileSizes[String([...path, name])] = parseInt(sizeOrDir);
  }
}

const directorySizes = (Array.from(dirsPath) as string[]).reduce(
  (directorySizesDict: { [path: string]: number }, path: string) => {
    let sum = 0;
    for (const k of Object.keys(fileSizes)) {
      const size = fileSizes[k];
      if (k.startsWith(path)) {
        sum += size;
      }
    }
    directorySizesDict[path] = sum;
    return directorySizesDict;
  },
  {}
);

// console.log(directorySizes);

console.log(
  "Part 1: ",
  Object.values(directorySizes).reduce((sum: number, size: number) => {
    if (size < 100000) {
      sum += size;
    }
    return sum;
  }, 0)
);

const toRemove =
  30000000 -
  (70000000 -
    Object.values(fileSizes).reduce((sum: number, size: number) => {
      sum += size;
      return sum;
    }, 0));

console.log(
  "Part 2: ",
  Math.min(
    ...Object.values(directorySizes).filter((size: number) => {
      if (size > toRemove) {
        return size;
      }
    })
  )
);
