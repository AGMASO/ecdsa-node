const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.secp256k1.utils.randomPrivateKey();

const publicKey = secp.secp256k1.getPublicKey(privateKey);
const address = getEthAddress(publicKey);

console.log(`Your new PrivateKey = ${toHex(privateKey)}`);
console.log(`Your PublicKey = ${toHex(publicKey)}`);
console.log(`Your Address = 0x${toHex(address)}`);

function getEthAddress(publicKey) {
  const hashPublicKey = keccak256(publicKey.slice(1));
  const address = hashPublicKey.slice(-20);
  return address;
}
module.exports = getEthAddress;
