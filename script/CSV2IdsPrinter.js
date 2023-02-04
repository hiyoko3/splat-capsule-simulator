const fs = require('fs');
const readline = require('readline');
const path = require('path');

exports.idsPrinter = function (filename, startId) {
  const readStream = fs.createReadStream(path.resolve(filename));
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
};
