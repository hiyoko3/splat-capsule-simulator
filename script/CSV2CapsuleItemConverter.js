const fs = require('fs');
const readline = require('readline');
const path = require('path');

exports.itemConverter = function (filename, startId = 1000) {
  const readStream = fs.createReadStream(path.resolve(filename));
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
};
