const SHA256 = require('crypto-js/sha256');

function checker(ec, sender, privateKey){

  const keyPrivate = ec.keyFromPrivate(privateKey);
  const keyPublic = ec.keyFromPublic(sender, 'hex');


  const message = "Checking Keys";
  const msgHash = SHA256(message);

  const signature = keyPrivate.sign(msgHash.toString());

  return keyPublic.verify(msgHash.toString(),signature)
}

module.exports = {checker};