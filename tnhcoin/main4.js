const {Blockchain, Transaction} = require('./blockchain');

//install library elliptic: npm install elliptic
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('94dfc35633956793f218cc38e2d2f77c79e6eb5427373b4d9b80cf770c82a944');
const myWalletAddress = myKey.getPublic('hex');

 
//initial blockchain
let tnhCoin = new Blockchain();

//create and sign transaction
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
tnhCoin.addTransaction(tx1);
console.log(tnhCoin,null,3);

console.log('\nStarting of miner...');
tnhCoin.miningPendingTransactions(myWalletAddress);

console.log('\nBalance of nghia is: ', tnhCoin.getBalanceOfAddress(myWalletAddress));

// Check Valid before change data in Block
console.log('Is chain valid? - Before change', tnhCoin.isChainValid());

tnhCoin.chain[1].transactions[0].amount = 1;
// Check Valid after change data in Block
console.log('Is chain valid? - After change', tnhCoin.isChainValid());


