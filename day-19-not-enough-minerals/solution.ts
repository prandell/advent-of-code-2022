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

type Resource = "clay" | "obsidian" | "ore" | "geode";

interface Blueprint {
  ore: { ore: number };
  clay: { ore: number };
  obsidian: { ore: number; clay: number };
  geode: { ore: number; obsidian: number };
}

const getResourceRequirements = (resourceString: string): any => {
  const rr = resourceString
    .split(",")
    .slice(1)
    .map((r) => r.split(" "));
  const requirements: any = {};
  for (const [amountRaw, resource] of rr) {
    requirements[resource as Resource] = parseInt(amountRaw);
  }
  return requirements;
};

const blueprints: { [id: number]: Blueprint } = {};
for await (const lineRaw of lineReader) {
  const line = lineRaw.trim();

  const [idRaw, ore, clay, obsidian, geode] = line.split(":");
  const id = parseInt(idRaw);

  blueprints[id] = {
    ore: getResourceRequirements(ore),
    clay: getResourceRequirements(clay),
    obsidian: getResourceRequirements(obsidian),
    geode: getResourceRequirements(geode),
  };
}

let ans = 0;
for (const bpKey of Object.keys(blueprints)) {
  let maxGeode = 0;
  //[ore, clay, obs, geo, oreBot, clayBot, obsBot, geoBot]
  let states: number[][] = [[0, 0, 0, 0, 1, 0, 0, 0]];
  const visited = new Set<string>(String([0, 0, 0, 0, 1, 0, 0, 0]));
  const blueprint = blueprints[bpKey as any];
  const maxClayCost = blueprint.obsidian.clay;
  const maxOreCost = Math.max(
    blueprint.ore.ore,
    blueprint.clay.ore,
    blueprint.geode.ore,
    blueprint.obsidian.ore
  );
  const maxObsidianCost = blueprint.geode.obsidian;
  for (let i = 0; i < 24; i++) {
    const newStates = new Set<string>();
    maxGeode = 0;
    for (const state of states) {
      const newOre = state[0] + state[4];
      const newClay = state[1] + state[5];
      const newOb = state[2] + state[6];
      const newGe = state[3] + state[7];
      maxGeode = Math.max(newGe, maxGeode);
      newStates.add(
        String([
          newOre,
          newClay,
          newOb,
          newGe,
          state[4],
          state[5],
          state[6],
          state[7],
        ])
      );
      if (
        state[0] >= blueprint.ore.ore &&
        state[4] < maxOreCost &&
        state[0] - state[4] < blueprint.ore.ore
      )
        newStates.add(
          String([
            newOre - blueprint.ore.ore,
            newClay,
            newOb,
            newGe,
            state[4] + 1,
            state[5],
            state[6],
            state[7],
          ])
        );
      if (
        state[0] >= blueprint.clay.ore &&
        state[5] < maxClayCost &&
        state[0] - state[4] < blueprint.clay.ore
      )
        newStates.add(
          String([
            newOre - blueprint.clay.ore,
            newClay,
            newOb,
            newGe,
            state[4],
            state[5] + 1,
            state[6],
            state[7],
          ])
        );
      if (
        state[0] >= blueprint.obsidian.ore &&
        state[1] >= blueprint.obsidian.clay &&
        state[6] < maxObsidianCost &&
        (state[0] - state[4] < blueprint.obsidian.ore ||
          state[1] - state[5] < blueprint.obsidian.clay)
      )
        newStates.add(
          String([
            newOre - blueprint.obsidian.ore,
            newClay - blueprint.obsidian.clay,
            newOb,
            newGe,
            state[4],
            state[5],
            state[6] + 1,
            state[7],
          ])
        );
      if (
        state[0] >= blueprint.geode.ore &&
        state[2] >= blueprint.geode.obsidian &&
        (state[0] - state[4] < blueprint.geode.ore ||
          state[2] - state[6] < blueprint.geode.obsidian)
      )
        newStates.add(
          String([
            newOre - blueprint.geode.ore,
            newClay,
            newOb - blueprint.geode.obsidian,
            newGe,
            state[4],
            state[5],
            state[6],
            state[7] + 1,
          ])
        );
    }
    if (i < 23) {
      for (const s of Array.from(newStates).map((s: string) =>
        s.split(",").map((p) => parseInt(p))
      )) {
        if (s[3] + (23 - i) >= maxGeode && !visited.has(String(s))) {
          states.push(s);
        }
      }
    }
    // console.log(bpKey, i, states.length, maxGeode);
  }
  ans += parseInt(String(bpKey)) * maxGeode;
}

console.log("Part 1:", ans);

///// ------- Part 2
let ans2 = [];
for (const bpKey of [1, 2, 3]) {
  let maxGeode = 0;
  //[ore, clay, obs, geo, oreBot, clayBot, obsBot, geoBot]
  let states: number[][] = [[0, 0, 0, 0, 1, 0, 0, 0]];
  const visited = new Set<string>(String([0, 0, 0, 0, 1, 0, 0, 0]));
  const blueprint = blueprints[bpKey as any];

  const maxClayCost = blueprint.obsidian.clay;
  const maxOreCost = Math.max(
    blueprint.ore.ore,
    blueprint.clay.ore,
    blueprint.geode.ore,
    blueprint.obsidian.ore
  );
  const maxObsidianCost = blueprint.geode.obsidian;

  for (let i = 0; i < 32; i++) {
    const newStates = new Set<string>();
    maxGeode = 0;
    for (const state of states) {
      const newOre = state[0] + state[4];
      const newClay = state[1] + state[5];
      const newOb = state[2] + state[6];
      const newGe = state[3] + state[7];
      maxGeode = Math.max(newGe, maxGeode);
      newStates.add(
        String([
          newOre,
          newClay,
          newOb,
          newGe,
          state[4],
          state[5],
          state[6],
          state[7],
        ])
      );
      if (
        state[0] >= blueprint.ore.ore &&
        state[4] < maxOreCost &&
        state[0] - state[4] < blueprint.ore.ore
      )
        newStates.add(
          String([
            newOre - blueprint.ore.ore,
            newClay,
            newOb,
            newGe,
            state[4] + 1,
            state[5],
            state[6],
            state[7],
          ])
        );
      if (
        state[0] >= blueprint.clay.ore &&
        state[5] < maxClayCost &&
        state[0] - state[4] < blueprint.clay.ore
      )
        newStates.add(
          String([
            newOre - blueprint.clay.ore,
            newClay,
            newOb,
            newGe,
            state[4],
            state[5] + 1,
            state[6],
            state[7],
          ])
        );
      if (
        state[0] >= blueprint.obsidian.ore &&
        state[1] >= blueprint.obsidian.clay &&
        state[6] < maxObsidianCost &&
        (state[0] - state[4] < blueprint.obsidian.ore ||
          state[1] - state[5] < blueprint.obsidian.clay)
      )
        newStates.add(
          String([
            newOre - blueprint.obsidian.ore,
            newClay - blueprint.obsidian.clay,
            newOb,
            newGe,
            state[4],
            state[5],
            state[6] + 1,
            state[7],
          ])
        );
      if (
        state[0] >= blueprint.geode.ore &&
        state[2] >= blueprint.geode.obsidian &&
        (state[0] - state[4] < blueprint.geode.ore ||
          state[2] - state[6] < blueprint.geode.obsidian)
      )
        newStates.add(
          String([
            newOre - blueprint.geode.ore,
            newClay,
            newOb - blueprint.geode.obsidian,
            newGe,
            state[4],
            state[5],
            state[6],
            state[7] + 1,
          ])
        );
    }
    if (i < 31) {
      for (const s of Array.from(newStates).map((s: string) =>
        s.split(",").map((p) => parseInt(p))
      )) {
        if (s[3] + (31 - i) >= maxGeode && !visited.has(String(s))) {
          states.push(s);
        }
      }
    }
    // console.log(bpKey, i, states.length, maxGeode);
  }
  ans2.push(maxGeode);
}

console.log("Part 2: ", ans2[0] * ans2[2] * ans2[1]);
