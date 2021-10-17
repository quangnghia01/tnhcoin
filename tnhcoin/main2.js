//add hash function library:   npm install --save crypto-js
const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //PoW consensus
    mineBlock(difficult){
        while(this.hash.substring(0, difficult) !== Array(difficult+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();//new hash
        }
        console.log("Block mined: " + this.hash);
        // substring(0,3): return strings include 3 elements: ar[0[] ,arr[1] ,arr[2]
        // Array(3).join("0"): Initial array with 3 elements, insert "0" into among elements
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficult = 3; //total number of zeros  before the hash of Block
    }

    createGenesisBlock(){
        return new Block(0, "28/09/2021", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficult); //mineblock function has block hash

        //newBlock.hash = newBlock.calculateHash();

        this.chain.push(newBlock);
    }

    //Check block hash
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

//Intial a blockchain
let tnhCoin = new Blockchain();

//Start mining
console.log('Mining block 1...');
tnhCoin.addBlock(new Block(1, "29/09/2021", {amount: 4}));

console.log('Mining block 2...');
tnhCoin.addBlock(new Block(2, "29/09/2021", {amount: 10}));

//print chain of blocks
console.log(JSON.stringify(tnhCoin, null, 3));

