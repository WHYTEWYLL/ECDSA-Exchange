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
  const publicKey  = key.getPublic('hex').toString(16);
  accounts.push({
    public: publicKey,
    balance: 100,
    nonce:0
  })
  console.log(publicKey + "\n with a private key of \n" + key.getPrivate().toString(16) + " has a balance of 100\n");

}

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
  const nonce = accounts.find(elem => {return elem.public === sender}).nonce
  const result = checker(ec, sender, nonce, recipient, privateKey)


  if(result){

    balanceSender = accounts.find(elem => {return elem.public === sender});
    balanceRecipient = accounts.find(elem => {return elem.public === recipient});

    if (balanceSender && balanceRecipient ){
      balanceSender.balance -= amount
      balanceRecipient.balance+= Number(amount);
      balanceSender.nonce ++

      res.send({ balance: balanceSender.balance});
    }else{res.send({ Error: "Not an account"});}

  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
