const SHA256 = require('crypto-js/sha256');

function checker(ec, sender, nonce, recipient, privateKey){

  const keyPrivate = ec.keyFromPrivate(privateKey);
  const keyPublic = ec.keyFromPublic(sender, 'hex');


  const message = `Transaction between ${sender} nonce ${nonce} to ${recipient}`;
  console.log(message)
  const transaction = SHA256(message);

  const signature = keyPrivate.sign(transaction.toString());

  return keyPublic.verify(transaction.toString(),signature)
}

module.exports = {checker};