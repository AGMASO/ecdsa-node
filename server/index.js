const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x2cba30f55ea3d7cc420f089cdb13efb6266d10b6": 200,
  "0xd42248f704c615cefa58a54b5bfde2713aca4527": 50,
  "0xeea6eacdc11abda73e3281c1ec635f81e9c42f4f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  //TODO : recover the public address fro

  const { sender, recipient, amount, signature, messageHash } = req.body;
  console.log(`Estos son los req.body: ${sender} +  ${recipient}} `);

  //We proof that the signature is right verify

  const isSigned = secp.secp256k1.verify(signature, messageHash, sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (isSigned) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      console.log("Sending response:", {
        balance: balances[sender],
        message: "Balance successfully transferred!",
      });
      res.send({
        balance: balances[sender],
        message: "Balance successfully transferred!",
      });
    }
  } else {
    res.send({ message: "The Signature couldn´t be verify" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
