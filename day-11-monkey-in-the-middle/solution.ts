const monkeyDict: {
  [monkey: number]: {
    start: number[];
    getNewWorry: (old: number) => number;
    toWhichMonkey: (num: number) => number;
    testVal: number;
    inspectCount: number;
  };
} = {
  0: {
    start: [85, 79, 63, 72],
    getNewWorry: (old: number) => old * 17,
    toWhichMonkey: (num: number) => {
      if (num % 2 === 0) {
        return 2;
      }
      return 6;
    },
    testVal: 2,
    inspectCount: 0,
  },
  1: {
    start: [53, 94, 65, 81, 93, 73, 57, 92],
    getNewWorry: (old: number) => old * old,
    toWhichMonkey: (num: number) => {
      if (num % 7 === 0) {
        return 0;
      }
      return 2;
    },
    testVal: 7,
    inspectCount: 0,
  },
  2: {
    start: [62, 63],
    getNewWorry: (old: number) => old + 7,
    toWhichMonkey: (num: number) => {
      if (num % 13 === 0) {
        return 7;
      }
      return 6;
    },
    testVal: 13,
    inspectCount: 0,
  },
  3: {
    start: [57, 92, 56],
    getNewWorry: (old: number) => old + 4,
    toWhichMonkey: (num: number) => {
      if (num % 5 === 0) {
        return 4;
      }
      return 5;
    },
    testVal: 5,
    inspectCount: 0,
  },
  4: {
    start: [67],
    getNewWorry: (old: number) => old + 5,
    toWhichMonkey: (num: number) => {
      if (num % 3 === 0) {
        return 1;
      }
      return 5;
    },
    testVal: 3,
    inspectCount: 0,
  },
  5: {
    start: [85, 56, 66, 72, 57, 99],
    getNewWorry: (old: number) => old + 6,
    toWhichMonkey: (num: number) => {
      if (num % 19 === 0) {
        return 1;
      }
      return 0;
    },
    testVal: 19,
    inspectCount: 0,
  },
  6: {
    start: [86, 65, 98, 97, 69],
    getNewWorry: (old: number) => old * 13,
    toWhichMonkey: (num: number) => {
      if (num % 11 === 0) {
        return 3;
      }
      return 7;
    },
    testVal: 11,
    inspectCount: 0,
  },
  7: {
    start: [87, 68, 92, 66, 91, 50, 68],
    getNewWorry: (old: number) => old + 2,
    toWhichMonkey: (num: number) => {
      if (num % 17 === 0) {
        return 4;
      }
      return 3;
    },
    testVal: 17,
    inspectCount: 0,
  },
};

const monkeys = Object.keys(monkeyDict) as unknown as number[];
// by using the mod of the product of all monkeys numbers
// we guarantee our worry level will maintain a consistent decision by the monkeys
let highestValue = Object.values(monkeyDict).reduce(
  (acc: number, monkey) => (acc *= monkey.testVal),
  1
);
let i = 1;
while (i <= 10000) {
  for (const monkey of monkeys) {
    let { start, getNewWorry, toWhichMonkey, inspectCount, testVal } =
      monkeyDict[monkey];
    for (let item of start) {
      inspectCount++;
      item = getNewWorry(item) % highestValue;
      // Comment this back in for part 1
      // item = Math.floor(item / 3);
      const newMonkey = toWhichMonkey(item);
      monkeyDict[newMonkey].start.push(item);
    }
    monkeyDict[monkey].start = [];
    monkeyDict[monkey] = {
      start: [],
      getNewWorry,
      toWhichMonkey,
      inspectCount,
      testVal,
    };
  }
  i++;
  if (i === 21) {
    const sortedInpsections = Object.values(monkeyDict)
      .map((md) => md.inspectCount)
      .sort((a, b) => b - a);
    console.log("Part 1: ", sortedInpsections[0] * sortedInpsections[1]);
  }
}

const sortedInpsections = Object.values(monkeyDict)
  .map((md) => md.inspectCount)
  .sort((a, b) => b - a);
console.log("Part 2: ", sortedInpsections[0] * sortedInpsections[1]);
console.log("Part 2: ");
