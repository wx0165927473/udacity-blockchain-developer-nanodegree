/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/


const SHA256 = require('crypto-js/sha256')
const ls = require('./levelSandbox.js')
const Block = require('./block.js')

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.totalBlockHeight;

    this.getBlockHeight()
    .then(blockHeight => {
      if (blockHeight == -1) {
        this.addBlock(new Block("First block in the chain - Genesis block"));
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  // Add new block
  async addBlock(newBlock){

    try {
      this.totalBlockHeight += 1
      // Block height
      newBlock.height = this.totalBlockHeight
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      // previous block hash
      if(this.totalBlockHeight > 0){
        newBlock.previousBlockHash = await this.getBlock(this.totalBlockHeight - 1)
                                          .then(block => {
                                            return block.hash
                                          })
                                          .catch(error => {
                                            console.log(error)
                                          })
      }
      // Block hash with SHA256 using newBlock and converting to a string
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

      console.log('adding new block', newBlock)

      // Adding block object to chain
      ls.addDataToLevelDB(newBlock)
    }
    catch(error) {
      console.log(error)
    }
  }

  // Get block height
  getBlockHeight(){
    return ls.getLevelDBCount()
          .then(totalHeight => {
            return (this.totalBlockHeight = totalHeight)
          })
          .catch(error => {
            console.log(error)
          })
  }

  // get block
  getBlock(blockHeight){
    // return object as a single string
    return ls.getLevelDBData(blockHeight)
  }

  // validate block
  async validateBlock(blockHeight){

    try {
        // get block object
        let block = await this.getBlock(blockHeight)
                        .then(block => {
                          return block
                        })
                        .catch(error => {
                          console.log(error)
                        })

        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
      }
      catch(error) {
        console.log(error)
      }
    }

    // Validate blockchain
    async validateChain(){
      let errorLog = [];
      for (var i = 0; i < this.totalBlockHeight + 1; i++) {

        try {
          // validate block
          let isBlockValid = await this.validateBlock(i)
                              .then(valid => {
                                return valid
                              })
                              .catch(error => {
                                console.log(error)
                              })

          if (!isBlockValid) {
            errorLog.push(i)
          }

          // compare blocks hash link
          let blockHash = await this.getBlock(i)
                              .then(block => {
                                return block.hash
                              })
                              .catch(error => {
                                console.log(error)
                              })

          if (i == this.totalBlockHeight) {
            break
          }
          else {
            let previousHash = await this.getBlock(i + 1)
                                    .then(block => {
                                      return block.previousBlockHash
                                    })
                                    .catch(error => {
                                      console.log(error)
                                    })

            if (blockHash !== previousHash) {
              errorLog.push(i);
            }
          }
        }
        catch(error) {
          console.log(error)
        }
      }

      if (errorLog.length > 0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: ' + errorLog);
      } else {
        console.log('No errors detected');
      }
  }
}
