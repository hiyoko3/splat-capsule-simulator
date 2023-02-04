const { itemConverter } = require('./CSV2CapsuleItemConverter');
const { idsPrinter } = require('./CSV2IdsPrinter');

if (process.argv.length < 3) {
  throw new Error('not found filename and startId');
}

itemConverter(process.argv[2], process.argv[3]);
idsPrinter(process.argv[2], process.argv[3]);
