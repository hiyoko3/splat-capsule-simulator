const fs = require('fs');
const readline = require('readline');
const path = require('path');

function main() {
  const fileName = process.argv[2];
  let startId = process.argv[3] || 1000;

  const readStream = fs.createReadStream(path.resolve(fileName));
  const writeStream = fs.createWriteStream(path.resolve('ids.csv'));

  const readlineIF = readline.createInterface({
    input: readStream,
    output: writeStream
  });

  let ids = [];
  readlineIF.on('line', () => {
    ids.push(startId++);
  });
  readlineIF.on('close', () => {
    writeStream.write(ids.join(','));
    console.log('END!');
  });

  return;
}

if (process.argv.length < 2) {
  throw new Error('not found filename');
}

main();
