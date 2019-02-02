/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level')
const chainDB = './chaindata'
const db = level(chainDB, {valueEncoding: "json"})

// Add data to levelDB with key/value pair
var addLevelDBData = function (key,value){
  db.put(key, value)
  .catch(error => {
    console.log('Error: Add Block ${key}')
  })
}

// Get data from levelDB with key
var getLevelDBData = function (key){
  return db.get(key)
  .then(response => {
    return response
  })
  .catch(error => {
    console.log('Error: Get Level DB Data ${err}')
  })
}

// Add data to levelDB with value
var addDataToLevelDB = function (value) {
    let i = 0;
    db.createReadStream()
    .on('data', function(data) {
      i++;
    })
    .on('error', function(err) {
        return console.log('Unable to read data stream!', err)
    })
    .on('close', function() {
      console.log('Block #' + i);
      addLevelDBData(i, value);
    })
}

// Get all levelDB data
var getLevelDBCount = function () {
  return new Promise((resolve, reject) => {
    let blockHeight = -1
    db.createReadStream()
    .on('data', response => {
      blockHeight++
    })
    .on('error', error => {
      console.log('Error: unable to read data stream!', error)
    })
    .on('end', () => {
      resolve(blockHeight)
    })
  })
}

module.exports = {
  addLevelDBData,
  getLevelDBData,
  addDataToLevelDB,
  getLevelDBCount
}

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/


// (function theLoop (i) {
//   setTimeout(function () {
//     addDataToLevelDB('Testing data');
//     if (--i) theLoop(i);
//   }, 100);
// })(10);
