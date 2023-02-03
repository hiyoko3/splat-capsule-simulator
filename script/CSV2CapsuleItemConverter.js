const fs = require('fs');
const readline = require('readline');
const path = require('path');

function main() {
  const fileName = process.argv[2];
  let startId = process.argv[3] || 1000;

  const readStream = fs.createReadStream(path.resolve(fileName));
  const writeStream = fs.createWriteStream(path.resolve('sample.json'));

  const readlineIF = readline.createInterface({
    input: readStream,
    output: writeStream
  });

  readlineIF.on('line', (lineString) => {
    const splitLine = lineString.split(',');
    const json = {
      id: startId++,
      name: splitLine[0],
      cssStyle: splitLine[2] || '',
      imgSrc: splitLine[1] || ''
    };
    writeStream.write(JSON.stringify(json));
    writeStream.write(',');
  });
  readlineIF.on('close', () => {
    console.log('END!');
  });

  return;
}

if (process.argv.length < 2) {
  throw new Error('not found filename');
}

main();
