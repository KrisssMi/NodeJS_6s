require("dotenv").config({ path: ".env" });
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");

const { CDH } = require("./DH");

const getInfo = async () => {
  try {
    let res = await axios.get(process.env.APP_BASE_URL);

    const _cdh = new CDH(res.data);
    const clientSecret = _cdh.getSecret(res.data);
    const clientContext = _cdh.getContext();

    res = await axios.post(`${process.env.APP_BASE_URL}/resource`, {
      // отправляем контекст на сервер
      clientContext,
    });

    const text = res.data.file.toString("utf8"); // получаем зашифрованный файл
    const decipher = crypto.createDecipher("aes256", clientSecret.toString()); // создаем объект для расшифровки
    const decrypted =
      decipher.update(text, "hex", "utf8") + decipher.final("utf8");

    fs.writeFileSync(`${__dirname}/client.txt`, decrypted);
  } catch (error) {
    console.log(error.message);
  }
};

getInfo();
