import { useState } from "react";
import server from "./server";
import {toHex} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";
import {utf8ToBytes} from "ethereum-cryptography/utils";
import * as secp from 'ethereum-cryptography/secp256k1';


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const messageHash = toHex(keccak256(utf8ToBytes(`The user with address: ${address}, wants to send: ${sendAmount} ETH to the user ${recipient}`)));
    console.log("Estos es messageHash: " + messageHash);

    const signature = secp.secp256k1.sign(messageHash,privateKey );
    

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        messageHash
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
