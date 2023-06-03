require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const fs = require("fs");

const { SDH } = require("./DH");

const app = express();
let _sdh;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  _sdh = new SDH(1024, 3); // создаем объект класса SDH с параметрами 1024 и 3, где 1024 - длина ключа, 3 - количество генерируемых ключей

  res.json(_sdh.getContext());  // отправляем клиенту контекст
});

app.post("/resource", (req, res) => {
  const context = req.body.clientContext; // получаем контекст от клиента

  if (!context) {
    res.status(409).json({ error: "Something run wrong" });
  }

  const secret = _sdh.getSecret(context); 
  const cipher = crypto.createCipher("aes256", secret.toString());  
  const content = fs.readFileSync(`${__dirname}/server.txt`, {
    encoding: "utf8",
  });
  const encrypted = cipher.update(content, "utf8", "hex") + cipher.final("hex"); // шифруем содержимое файла
  console.log(encrypted);
  res.json({ file: encrypted }); // отправляем клиенту зашифрованный файл
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
