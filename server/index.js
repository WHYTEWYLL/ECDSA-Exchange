const express = require('express');
const EC = require('elliptic').ec;
const cors = require('cors');
const {checker} = require('../src/addressChecker')


const app = express();
const port = 3042;
const ec = new EC('secp256k1');


const accounts = []

for (let i = 0; i < 3;i ++ ){

  const key = ec.genKeyPair();
  
  accounts.push({
    public:key.getPublic('hex').toString(16),
    private:key.getPrivate().toString(16),
    balance: 100
  })

}


console.log('\nAvailable Accounts\n==================')
accounts.forEach(function(key, i ) {
  console.log(`(${i}) ${key.public} (${key.balance} ETH) `);
});

console.log('\nPrivate Keys\n==================')
accounts.forEach(function(key, i ) {
  console.log(`(${i}) ${key.private}`);
});


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());




app.get('/balance/:address', (req, res) => {

  //Modificar, mirarbalances posttransaction
  const {address} = req.params;
  let balance = undefined;

  let myAccount = accounts.find(elem => {return elem.public === address})
  if(myAccount){
    balance = myAccount.balance
  }

  res.send({ balance });

});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, privateKey} = req.body;

  //Check PrivateKey-PublicKey

  const result = checker(ec, sender, privateKey)


  if(result){

    balanceSender = accounts.find(elem => {return elem.public === sender});
    balanceRecipient = accounts.find(elem => {return elem.public === recipient});

    if (balanceSender && balanceRecipient ){
      balanceSender.balance -= amount
      balanceRecipient.balance+= Number(amount);

      res.send({ balance: balanceSender.balance});
    }else{res.send({ Error: "Not an account"});}

  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
