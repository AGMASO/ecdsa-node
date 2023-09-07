import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex} from 'ethereum-cryptography/utils';
import { keccak256} from 'ethereum-cryptography/keccak'

function Wallet({ address, setAddress, balance, setBalance, setPrivateKey,privateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    
    setPrivateKey(privateKey);
    //derive the address
    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    const hashPublicKey = (keccak256(publicKey.slice(1))).slice(-20);
    const address = `0x${toHex(hashPublicKey)}`
    setAddress(address);
   

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type your Private Key" value={privateKey} onChange={onChange}></input>
      </label>   
      
      <div>
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
