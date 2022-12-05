import fs from 'fs'
import readline from 'readline'

async function getLineReader() {
  const fileStream = fs.createReadStream('input.txt')

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  return rl
}

let lineReader = await getLineReader()

function rangeToArray(rangeString: string): number[] {
  return rangeString.split('-').map((s) => parseInt(s))
}

let count = 0
//Part 1
for await (const line of lineReader) {
  // do something
  const trimemd = line.trim()
  const [range1, range2] = trimemd.split(',').map((s) => rangeToArray(s))

  if (
    (range1[0] >= range2[0] && range1[1] <= range2[1]) ||
    (range2[0] >= range1[0] && range2[1] <= range1[1])
  )
    count++
}

console.log('Part 1: ', count)

lineReader = await getLineReader()
count = 0
for await (const line of lineReader) {
  const trimemd = line.trim()
  const [range1, range2] = trimemd.split(',').map((s) => rangeToArray(s))
  if (
    (range1[0] >= range2[0] && range1[0] <= range2[1]) ||
    (range2[0] >= range1[0] && range2[0] <= range1[1])
  )
    count++
}

console.log('Part 2: ', count)
