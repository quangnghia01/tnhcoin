const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficult){
        while(this.hash.substring(0, difficult) !== Array(difficult+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash); 
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficult = 3;
    }

    createGenesisBlock(){
        return new Block(0, "28/09/2021", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficult);

        //newBlock.hash = newBlock.calculateHash();

        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let tnhCoin = new Blockchain();
console.log('Mining block 1...');
tnhCoin.addBlock(new Block(1, "29/09/2021", {amount: 4}));

console.log('Mining block 2...');
tnhCoin.addBlock(new Block(2, "29/09/2021", {amount: 10}));
console.log(JSON.stringify(tnhCoin, null, 3));
/*
console.log('Is Blockchain valid? ' + tnhCoin.isChainValid());

tnhCoin.chain[1].data = {amount:3};
tnhCoin.chain[1].hash = tnhCoin.chain[1].calculateHash();

console.log('Is Blockchain valid? ' + tnhCoin.isChainValid());

//console.log(JSON.stringify(tnhCoin, null, 3));

*/

