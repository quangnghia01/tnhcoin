//add hash function library:   npm install --save crypto-js
const { sign } = require('crypto');
//install library elliptic: npm install elliptic
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//data of Block
class Transaction{
    constructor(fromAdress, toAddress, amount){
        this.fromAdress = fromAdress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAdress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if (signingKey.getPublic('hex')!==this.fromAdress){
            throw new Error('You cannot sign transaction for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
    
    isValid(){
        if(this.fromAdress === null) return true;

        if (!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publickey = ec.keyFromPublic(this.fromAdress, 'hex');
        return publickey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    constructor(timestamp, transactions, previousHash=''){
        this.timestamp = timestamp;
        this.transactions = transactions; 
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    //PoW consensus
    mineBlock(difficult){
        while(this.hash.substring(0, difficult) !== Array(difficult+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash); 
        // substring(0,3): return strings include 3 elements: ar[0[] ,arr[1] ,arr[2]
        // Array(3).join("0"): Initial array with 3 elements, insert "0" into among elements
    }

    hasValidTransaction(){
        for (const tx of this.transactions){
            if (!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficult = 3; //total number of zeros  before the hash of Block

        //In PoW, 1 Block created every 10 minutes
        //all transactions are temporarily stored in this
        this.pendingTransactions = [];
        this.miningReward = 100; //for miner
    }

    createGenesisBlock(){
        return new Block("28/09/2021", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    miningPendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficult);

        console.log("Block successful mined!");
        this.chain.push(block);

        // affter Block has been mined, we create a bew transaction to give you your miningReward
        // so one new transaction is added to pendingTransactions array
        // so miningReward will only be sent when the next block is mined
        // so in the first times mine, balance of miner equal zero
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    addTransaction(transaction){
        if(!transaction.fromAdress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if(!transaction.isValid()){
            throw new Error ('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
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

    //check block hask
    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransaction()){
                return false;
            }

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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;