const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAdress, toAddress, amount){
        this.fromAdress = fromAdress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash=''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("28/09/2021", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    miningPendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficult);

        console.log("Block successful mined!");
        this.chain.push(block);

        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for( const block of this.chain){
            for (const trans of block.transactions){
                if(trans.fromAdress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
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
tnhCoin.createTransaction(new Transaction('address1', 'address2', 100)); 
tnhCoin.createTransaction(new Transaction('address1', 'address2', 100));

console.log('\n Starting of miner...');
tnhCoin.miningPendingTransactions("nghia-address");
console.log('\nBalance of nghia is: ', tnhCoin.getBalanceOfAddress('nghia-address'));

console.log('\n Starting of miner again...');
tnhCoin.miningPendingTransactions("nghia-address");
console.log('\nBalance of nghia is: ', tnhCoin.getBalanceOfAddress('nghia-address'));

console.log('\n Starting of miner again...');
tnhCoin.miningPendingTransactions("nghia-address");
console.log('\nBalance of nghia is: ', tnhCoin.getBalanceOfAddress('nghia-address'));


