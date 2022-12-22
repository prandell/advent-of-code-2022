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
const monkeyDict: { [monkey: string]: string[] | number } = {};
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();
  const [monkey, shout] = line.split(": ");
  const [m1, operand, m2] = shout.split(" ");
  if (!operand) {
    monkeyDict[monkey] = parseInt(m1);
  } else {
    monkeyDict[monkey] = [m1, operand, m2];
  }
}
// console.log(monkeyDict);

const mathItUp: { [op: string]: any } = {
  "+": function (x: number, y: number) {
    return x + y;
  },
  "-": function (x: number, y: number) {
    return x - y;
  },
  "*": function (x: number, y: number) {
    return x * y;
  },
  "/": function (x: number, y: number) {
    return x / y;
  },
};

const monkeyShout: any = (name: string) => {
  const shout = monkeyDict[name];
  if (Number.isInteger(shout)) {
    return shout;
  } else {
    const shou = shout as string[];
    return mathItUp[shou[1] as string](
      monkeyShout(shou[0]),
      monkeyShout(shou[2])
    );
  }
};
console.log(monkeyDict["root"]);
console.log(monkeyShout("root"));

(monkeyDict["root"] as any)[1] = "-";
const monkeyDo: any = () => {
  let current = 0;
  let result = null;
  while (!result) {
    monkeyDict["humn"] = current;
    if (current === Infinity || current === -Infinity) return false;
    const output = monkeyShout("root");
    if (output === 0) {
      console.log("Part2:", current);
      break;
    }
    const mod = Math.ceil(output / 10);
    current = current + mod;
  }
};

console.log(monkeyDo());
