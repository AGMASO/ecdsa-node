const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");
require("dotenv").config();

console.log("hola: " + process.env.PRIVATE_KEY1);
const messageHash = toHex(keccak256(utf8ToBytes("Que pasa loco")));
const messageHash2 = toHex(keccak256(utf8ToBytes("Que pasa tronco")));
console.log("Mensaje hasehado: " + messageHash);

const publicKey = secp.secp256k1.getPublicKey(process.env.PRIVATE_KEY1);
console.log("Hello: " + toHex(publicKey));
const signature = getSignature(messageHash, process.env.PRIVATE_KEY1);
console.log(signature);

const isSigned = secp.secp256k1.verify(signature, messageHash2, publicKey);

if (isSigned) {
  console.log("es la misma");
  return true;
} else {
  console.log("No es el mismo");
}

//////////

function getSignature(messageHash, privateKey) {
  const signature = secp.secp256k1.sign(messageHash, privateKey);
  return signature;
}
