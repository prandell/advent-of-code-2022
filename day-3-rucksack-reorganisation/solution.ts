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

function charToPriority(char: string): number {
  if (typeof char === 'string' && /^[a-z]+$/.test(char)) {
    char = char.toUpperCase()
    let out = 0,
      len = char.length
    for (let pos = 0; pos < len; pos++) {
      out += (char.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1)
    }
    return out
  } else if (typeof char === 'string' && /^[A-Z]+$/.test(char)) {
    char = char.toUpperCase()
    let out = 0,
      len = char.length
    for (let pos = 0; pos < len; pos++) {
      //add 26 to adjust priority
      out += (char.charCodeAt(pos) - 64 + 26) * Math.pow(26, len - pos - 1)
    }
    return out
  }
  return 0
}

let sum = 0
//Part 1
for await (const line of lineReader) {
  // do something
  const trimemd = line.trim()
  var middle = Math.floor(trimemd.length / 2)

  var s1 = trimemd.substring(0, middle)
  var s2 = trimemd.substring(middle + 1)
  let priority = 0
  let happend = false
  for (const char of s1.split('')) {
    if (s2.includes(char)) {
      priority = charToPriority(String(char))
      happend = true
      break
    }
  }
  if (!happend) {
    //Must be odd number length, use middle character
    sum += charToPriority(String(line.charAt(s1.length)))
  }
  sum += priority
}

console.log('Part 1: ', sum)

lineReader = await getLineReader()
let memberCount = 0
let member1 = ''
let member2 = ''
let member3 = ''
sum = 0
for await (const line of lineReader) {
  const trimmed = line.trim()
  if (memberCount === 0) {
    memberCount++
    member1 = trimmed
  } else if (memberCount === 1) {
    memberCount++
    member2 = trimmed
  } else if (memberCount === 2) {
    memberCount = 0
    member3 = trimmed

    let priority = 0
    for (const char of member1.split('')) {
      if (member2.includes(char) && member3.includes(char)) {
        priority = charToPriority(String(char))
        break
      }
    }
    sum += priority
  }
}

console.log('Part 2: ', sum)
